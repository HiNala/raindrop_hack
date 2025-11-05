import { prisma } from './prisma'
import { logger } from './logger'

/**
 * Track a post view event
 */
export async function trackPostView(postId: string, _userId?: string, referrer?: string) {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Update or create daily analytics record
    await prisma.analyticsDaily.upsert({
      where: {
        postId_date: {
          postId,
          date: today,
        },
      },
      update: {
        views: { increment: 1 },
      },
      create: {
        postId,
        date: today,
        views: 1,
        reads: 0,
      },
    })

    // Update post total views
    await prisma.post.update({
      where: { id: postId },
      data: {
        viewCount: { increment: 1 },
      },
    })

    // Track referrer if provided
    if (referrer && referrer !== 'direct') {
      await prisma.referrer.upsert({
        where: {
          postId_url: {
            postId,
            url: referrer,
          },
        },
        update: {
          count: { increment: 1 },
        },
        create: {
          postId,
          url: referrer,
          count: 1,
        },
      })
    }

    logger.info('Tracked post view', { postId, userId, referrer })
  } catch (error) {
    logger.dbError('trackPostView', error, { postId, userId })
    // Don't throw - analytics shouldn't break the app
  }
}

/**
 * Track a post read event (when user scrolls past certain threshold)
 */
export async function trackPostRead(postId: string, userId?: string) {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Update daily analytics record
    await prisma.analyticsDaily.upsert({
      where: {
        postId_date: {
          postId,
          date: today,
        },
      },
      update: {
        reads: { increment: 1 },
      },
      create: {
        postId,
        date: today,
        views: 0,
        reads: 1,
      },
    })

    // Update post analytics
    await prisma.postAnalytics.upsert({
      where: { postId },
      update: {
        reads: { increment: 1 },
      },
      create: {
        postId,
        reads: 1,
        avgReadTime: 0,
      },
    })

    logger.info('Tracked post read', { postId, userId })
  } catch (error) {
    logger.dbError('trackPostRead', error, { postId, userId })
    // Don't throw - analytics shouldn't break the app
  }
}

/**
 * Track reading time for a post
 */
export async function trackReadingTime(postId: string, timeSpent: number) {
  try {
    const existing = await prisma.postAnalytics.findUnique({
      where: { postId },
      select: { reads: true, avgReadTime: true },
    })

    if (existing) {
      const totalReads = existing.reads + 1
      const currentAvg = existing.avgReadTime
      const newAvg = ((currentAvg * existing.reads) + timeSpent) / totalReads

      await prisma.postAnalytics.update({
        where: { postId },
        data: {
          avgReadTime: Math.round(newAvg),
        },
      })
    } else {
      await prisma.postAnalytics.create({
        data: {
          postId,
          reads: 0,
          avgReadTime: Math.round(timeSpent),
        },
      })
    }

    logger.performanceMetric('trackReadingTime', timeSpent, { postId })
  } catch (error) {
    logger.dbError('trackReadingTime', error, { postId, timeSpent })
  }
}

/**
 * Get analytics data for a post
 */
export async function getPostAnalytics(postId: string) {
  try {
    const [post, dailyStats, topReferrers] = await Promise.all([
      prisma.post.findUnique({
        where: { id: postId },
        select: {
          viewCount: true,
          _count: {
            select: { likes: true, comments: true },
          },
        },
      }),
      prisma.analyticsDaily.findMany({
        where: { postId },
        orderBy: { date: 'desc' },
        take: 30, // Last 30 days
      }),
      prisma.referrer.findMany({
        where: { postId },
        orderBy: { count: 'desc' },
        take: 10, // Top 10 referrers
      }),
    ])

    if (!post) return null

    const totalReads = dailyStats.reduce((sum, day) => sum + day.reads, 0)
    const avgReadTime = await prisma.postAnalytics.findUnique({
      where: { postId },
      select: { avgReadTime: true },
    })

    return {
      views: post.viewCount,
      reads: totalReads,
      likes: post._count.likes,
      comments: post._count.comments,
      avgReadTime: avgReadTime?.avgReadTime || 0,
      dailyStats,
      topReferrers,
    }
  } catch (error) {
    logger.dbError('getPostAnalytics', error, { postId })
    return null
  }
}

/**
 * Get referrer URL from request headers
 */
export function getReferrerFromHeaders(request: Request): string | undefined {
  const referrer = request.headers.get('referer') || request.headers.get('referrer')

  if (!referrer) return 'direct'

  try {
    const url = new URL(referrer)
    // Remove protocol and www for cleaner grouping
    return url.hostname.replace(/^www\./, '')
  } catch {
    return 'direct'
  }
}
