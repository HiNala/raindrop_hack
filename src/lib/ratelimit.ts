import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Initialize Redis connection
const redis = Redis.fromEnv()

// Rate limiters for different use cases
export const rlAI = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 d'), // 10 requests per day
  analytics: true,
})

export const rlHN = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 h'), // 100 requests per hour
  analytics: true,
})

export const rlWrite = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, '1 h'), // 30 requests per hour
  analytics: true,
})

export const rlComments = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 m'), // 10 comments per 10 minutes
  analytics: true,
})

export const rlLikes = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, '1 h'), // 50 likes per hour
  analytics: true,
})

// Helper function to check rate limits and return appropriate response
export async function checkRateLimit(
  identifier: string,
  ratelimit: Ratelimit,
  _request?: Request,
) {
  const { success, limit, remaining, reset } = await ratelimit.limit(identifier)

  if (!success) {
    return {
      allowed: false,
      limit,
      remaining,
      reset,
      error: 'Rate limit exceeded. Please try again later.',
    }
  }

  return {
    allowed: true,
    limit,
    remaining,
    reset,
  }
}

// Get identifier from request (user ID or IP)
export function getIdentifier(request?: Request, userId?: string): string {
  if (userId) return `user:${userId}`

  if (request) {
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
    return `ip:${ip}`
  }

  return 'anonymous'
}
