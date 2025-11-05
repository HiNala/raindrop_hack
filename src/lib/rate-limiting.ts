import { Redis } from 'ioredis'
import { Ratelimit } from '@upstash/ratelimit'
import { NextRequest } from 'next/server'

export interface RateLimitConfig {
  requests: number
  window: string // '1 s', '1 m', '1 h', '1 d'
  identifier?: string
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
  retryAfter?: number
}

export class RateLimitService {
  private static instance: RateLimitService
  private redis: Redis | null = null
  private cache: Map<string, any> = new Map()

  constructor() {
    // Initialize Redis if available
    if (process.env.UPSTASH_REDIS_REST_URL) {
      this.redis = new Redis({
        port: parseInt(process.env.UPSTASH_REDIS_REST_PORT || '6379'),
        host: process.env.UPSTASH_REDIS_REST_HOST || 'localhost',
        password: process.env.UPSTASH_REDIS_REST_TOKEN,
        tls: process.env.UPSTASH_REDIS_REST_URL?.includes('rediss://') ? {} : undefined,
        retryDelayOnFailover: 100,
        enableReadyCheck: false,
        maxRetriesPerRequest: 3,
      })
    }
  }

  static getInstance(): RateLimitService {
    if (!RateLimitService.instance) {
      RateLimitService.instance = new RateLimitService()
    }
    return RateLimitService.instance
  }

  /**
   * Parse window string to milliseconds
   */
  private parseWindow(window: string): number {
    const unit = window.slice(-1)
    const value = parseInt(window.slice(0, -1))

    switch (unit) {
      case 's': return value * 1000
      case 'm': return value * 60 * 1000
      case 'h': return value * 60 * 60 * 1000
      case 'd': return value * 24 * 60 * 60 * 1000
      default: throw new Error(`Invalid window format: ${window}`)
    }
  }

  /**
   * Create rate limiter instance
   */
  private createRateLimiter(config: RateLimitConfig): Ratelimit {
    const windowMs = this.parseWindow(config.window)

    if (this.redis) {
      // Use Redis-backed rate limiter
      return new Ratelimit({
        redis: this.redis,
        limiter: Ratelimit.slidingWindow(config.requests, windowMs),
        analytics: true,
        ephemeralCache: this.cache,
        skipSuccessfulRequests: config.skipSuccessfulRequests || false,
        skipFailedRequests: config.skipFailedRequests || false,
      })
    } else {
      // Use in-memory rate limiter (fallback)
      return new Ratelimit({
        limiter: Ratelimit.slidingWindow(config.requests, windowMs),
        analytics: false,
        ephemeralCache: this.cache,
        skipSuccessfulRequests: config.skipSuccessfulRequests || false,
        skipFailedRequests: config.skipFailedRequests || false,
      })
    }
  }

  /**
   * Check rate limit for API endpoints
   */
  async checkLimit(
    identifier: string,
    config: RateLimitConfig,
  ): Promise<RateLimitResult> {
    const limiter = this.createRateLimiter(config)

    try {
      const result = await limiter.limit(identifier)

      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
        retryAfter: result.retryAfter,
      }
    } catch (error) {
      console.error('Rate limit check failed:', error)

      // Fail open if rate limiting fails
      return {
        success: true,
        limit: config.requests,
        remaining: config.requests,
        reset: Date.now() + this.parseWindow(config.window),
      }
    }
  }

  /**
   * Middleware for Next.js API routes
   */
  createMiddleware(config: RateLimitConfig) {
    return async (request: NextRequest) => {
      // Get identifier from request
      const identifier = await this.getIdentifier(request)

      if (!identifier) {
        // If we can't identify the user, use IP address
        const ip = request.ip || 'unknown'
        return this.checkLimit(ip, config)
      }

      return this.checkLimit(identifier, config)
    }
  }

  /**
   * Extract identifier from request
   */
  private async getIdentifier(request: NextRequest): Promise<string | null> {
    // Try to get user ID from auth header
    const authHeader = request.headers.get('authorization')
    if (authHeader) {
      try {
        // For Clerk, extract user ID from JWT token
        const token = authHeader.replace('Bearer ', '')
        const payload = JSON.parse(atob(token.split('.')[1]))
        return payload.sub || null
      } catch (error) {
        // Invalid token, fall back to IP
      }
    }

    // Try to get user ID from session
    const sessionToken = request.cookies.get('__session')?.value
    if (sessionToken) {
      try {
        // Parse session token to get user ID
        const payload = JSON.parse(atob(sessionToken))
        return payload.userId || null
      } catch (error) {
        // Invalid session, fall back to IP
      }
    }

    // Fall back to IP address
    return request.ip || null
  }

  /**
   * Predefined rate limit configurations
   */
  static readonly LIMITS = {
    // AI generation limits
    AI_GENERATION: {
      requests: 10,
      window: '1 d',
      skipSuccessfulRequests: false,
    },

    // HN enrichment limits
    HN_ENRICHMENT: {
      requests: 100,
      window: '1 h',
      skipSuccessfulRequests: false,
    },

    // General API limits
    API_GENERAL: {
      requests: 1000,
      window: '1 h',
      skipSuccessfulRequests: true,
    },

    // Authentication limits
    AUTH_ATTEMPTS: {
      requests: 5,
      window: '15 m',
      skipSuccessfulRequests: false,
    },

    // Content creation limits
    POST_CREATION: {
      requests: 20,
      window: '1 h',
      skipSuccessfulRequests: false,
    },

    // Comment limits
    COMMENT_CREATION: {
      requests: 50,
      window: '1 h',
      skipSuccessfulRequests: false,
    },

    // Upload limits
    FILE_UPLOAD: {
      requests: 10,
      window: '1 h',
      skipSuccessfulRequests: false,
    },
  } as const

  /**
   * Get rate limit status for a user
   */
  async getUserStatus(userId: string): Promise<{
    aiGeneration: RateLimitResult
    hnEnrichment: RateLimitResult
    general: RateLimitResult
    posts: RateLimitResult
    comments: RateLimitResult
  }> {
    const [
      aiGeneration,
      hnEnrichment,
      general,
      posts,
      comments,
    ] = await Promise.all([
      this.checkLimit(userId, RateLimitService.LIMITS.AI_GENERATION),
      this.checkLimit(userId, RateLimitService.LIMITS.HN_ENRICHMENT),
      this.checkLimit(userId, RateLimitService.LIMITS.API_GENERAL),
      this.checkLimit(userId, RateLimitService.LIMITS.POST_CREATION),
      this.checkLimit(userId, RateLimitService.LIMITS.COMMENT_CREATION),
    ])

    return {
      aiGeneration,
      hnEnrichment,
      general,
      posts,
      comments,
    }
  }

  /**
   * Reset rate limits for a user (admin only)
   */
  async resetUserLimits(userId: string): Promise<void> {
    if (!this.redis) {
      console.warn('Cannot reset limits: Redis not available')
      return
    }

    try {
      const keys = await this.redis.keys(`@upstash/ratelimit:${userId}:*`)
      if (keys.length > 0) {
        await this.redis.del(...keys)
        console.log(`Reset ${keys.length} rate limit entries for user: ${userId}`)
      }
    } catch (error) {
      console.error('Failed to reset user limits:', error)
    }
  }

  /**
   * Get rate limit statistics
   */
  async getStats(): Promise<{
    totalKeys: number
    memoryUsage: string
    activeUsers: number
    mostActiveLimits: Array<{ identifier: string; count: number }>
  }> {
    if (!this.redis) {
      return {
        totalKeys: 0,
        memoryUsage: '0B',
        activeUsers: 0,
        mostActiveLimits: [],
      }
    }

    try {
      const keys = await this.redis.keys('@upstash/ratelimit:*')
      const info = await this.redis.info('memory')

      const memoryMatch = info.match(/used_memory_human:([^\r\n]+)/)
      const memoryUsage = memoryMatch ? memoryMatch[1] : 'Unknown'

      // Count unique users (first two parts of key)
      const users = new Set()
      for (const key of keys) {
        const parts = key.split(':')
        if (parts.length >= 2) {
          users.add(parts[1])
        }
      }

      // Get most active limits (simplified)
      const mostActiveLimits = await Promise.all(
        Array.from(users).slice(0, 10).map(async (userId) => {
          const userKeys = keys.filter(key => key.includes(userId))
          return {
            identifier: userId,
            count: userKeys.length,
          }
        }),
      )

      return {
        totalKeys: keys.length,
        memoryUsage,
        activeUsers: users.size,
        mostActiveLimits: mostActiveLimits.sort((a, b) => b.count - a.count),
      }
    } catch (error) {
      console.error('Failed to get rate limit stats:', error)
      return {
        totalKeys: 0,
        memoryUsage: 'Error',
        activeUsers: 0,
        mostActiveLimits: [],
      }
    }
  }

  /**
   * Cleanup expired entries
   */
  async cleanup(): Promise<void> {
    if (!this.redis) return

    try {
      // Redis handles TTL automatically, but we can cleanup expired keys manually if needed
      const keys = await this.redis.keys('@upstash/ratelimit:*')

      let cleanedCount = 0
      for (const key of keys) {
        const ttl = await this.redis.ttl(key)
        if (ttl === -1) { // No expiration set
          await this.redis.expire(key, 24 * 60 * 60) // Set 24 hour expiration
          cleanedCount++
        }
      }

      if (cleanedCount > 0) {
        console.log(`Cleaned up ${cleanedCount} rate limit entries`)
      }
    } catch (error) {
      console.error('Failed to cleanup rate limits:', error)
    }
  }

  /**
   * Disconnect from Redis
   */
  async disconnect(): Promise<void> {
    if (this.redis) {
      await this.redis.quit()
      this.redis = null
    }
  }
}

// Export singleton instance
export const rateLimitService = RateLimitService.getInstance()

// Export helper function for easy usage
export async function createRateLimit(config: RateLimitConfig) {
  return rateLimitService.createMiddleware(config)
}
