import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { rateLimiter, RATE_LIMITS } from '@/lib/security'

export async function GET() {
  try {
    const user = await requireUser()

    // Rate limit exports
    const exportRateKey = `export:comments:${user.id}`
    const allowed = rateLimiter.check(
      exportRateKey,
      RATE_LIMITS.EXPORT.limit,
      RATE_LIMITS.EXPORT.windowMs,
    )

    if (!allowed) {
      return NextResponse.json(
        { error: 'Export limit exceeded. You can request 3 exports per day.' },
        { status: 429 },
      )
    }

    // Fetch all comments by the user
    const comments = await prisma.comment.findMany({
      where: { authorId: user.id },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Format the data
    const exportData = {
      exportDate: new Date().toISOString(),
      user: {
        id: user.id,
        clerkId: user.clerkId,
      },
      comments: comments.map((comment) => ({
        id: comment.id,
        body: comment.body,
        post: {
          id: comment.post.id,
          title: comment.post.title,
          slug: comment.post.slug,
        },
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      })),
    }

    // Return as JSON download
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="comments-export-${new Date().toISOString().split('T')[0]}.json"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 })
  }
}

