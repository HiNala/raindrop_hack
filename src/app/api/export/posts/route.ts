import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { rateLimiter, RATE_LIMITS } from '@/lib/security'

export async function GET() {
  try {
    const user = await requireUser()

    // Rate limit exports
    const exportRateKey = `export:posts:${user.id}`
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

    // Fetch all posts by the user
    const posts = await prisma.post.findMany({
      where: { authorId: user.id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
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
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        contentJson: post.contentJson,
        coverImage: post.coverImage,
        published: post.published,
        featured: post.featured,
        viewCount: post.viewCount,
        readTimeMin: post.readTimeMin,
        tags: post.tags.map((pt) => pt.tag.name),
        likes: post._count.likes,
        comments: post._count.comments,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        publishedAt: post.publishedAt,
      })),
    }

    // Return as JSON download
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="posts-export-${new Date().toISOString().split('T')[0]}.json"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 })
  }
}

