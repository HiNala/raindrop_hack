import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { handleAPIError, withErrorHandling } from '@/lib/errors'
import { logger } from '@/lib/logger'

interface Params {
  params: {
    postId: string
  }
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { postId } = params

    // Verify post ownership
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        author: {
          clerkId: userId,
        },
      },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found or unauthorized' }, { status: 404 })
    }

    // Get 30 days of analytics data
    const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)

    const analytics = await prisma.analyticsDaily.findMany({
      where: {
        postId,
        date: {
          gte: since,
        },
      },
      orderBy: {
        date: 'asc',
      },
      select: {
        date: true,
        views: true,
        reads: true,
      },
    })

    return NextResponse.json(analytics)
  } catch (error) {
    logger.dbError('fetchAnalytics', error, { postId })
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
