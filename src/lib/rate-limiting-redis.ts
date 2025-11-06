/**
 * Redis-based rate limiting to prevent race conditions across server instances
 */

import { Redis } from '@upstash/redis'

// Initialize Redis client (fallback to in-memory if Redis not available)
let redis: Redis | null = null

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = Redis.fromEnv()
  }
} catch (error) {
  console.warn('Redis not available, falling back to in-memory rate limiting')
}

// Fallback in-memory rate limiting (single instance only)
const memoryRateLimit = new Map<string, { count: number; resetAt: number }>()

const CLEANUP_INTERVAL = 60 * 60 * 1000 // 1 hour

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of memoryRateLimit.entries()) {
    if (now > value.resetAt) {
      memoryRateLimit.delete(key)
    }
  }
}, CLEANUP_INTERVAL)

export interface RateLimitConfig {
  requests: number
  window: number // in milliseconds
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
  retryAfter?: number
}

/**
 * Check rate limit for a given identifier
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const now = Date.now()
  const window = config.window
  const resetAt = now + window

  if (redis) {
    return checkRedisRateLimit(identifier, config, now, resetAt)
  } else {
    return checkMemoryRateLimit(identifier, config, now, resetAt)
  }
}

/**
 * Redis-based rate limiting using sorted set
 */
async function checkRedisRateLimit(
  identifier: string,
  config: RateLimitConfig,
  now: number,
  resetAt: number
): Promise<RateLimitResult> {
  try {
    const key = `rate_limit:${identifier}`
    const pipeline = redis!.pipeline()

    // Add current request with timestamp as score
    pipeline.zadd(key, now, `${now}-${Math.random()}`)
    
    // Remove expired entries
    pipeline.zremrangebyscore(key, 0, now - config.window)
    
    // Get current count
    pipeline.zcard(key)
    
    // Set expiration
    pipeline.expire(key, Math.ceil(config.window / 1000))

    const results = await pipeline.exec()
    const count = results?.[2]?.[1] as number || 0

    const allowed = count < config.requests
    const remaining = Math.max(0, config.requests - count)

    return {
      allowed,
      remaining,
      resetAt,
      retryAfter: allowed ? undefined : Math.ceil(config.window / 1000)
    }
  } catch (error) {
    console.error('Redis rate limiting error, falling back to memory:', error)
    return checkMemoryRateLimit(identifier, config, now, resetAt)
  }
}

/**
 * In-memory rate limiting fallback
 */
function checkMemoryRateLimit(
  identifier: string,
  config: RateLimitConfig,
  now: number,
  resetAt: number
): RateLimitResult {
  const userLimit = memoryRateLimit.get(identifier)

  if (!userLimit || now > userLimit.resetAt) {
    // Reset or create new entry
    memoryRateLimit.set(identifier, {
      count: 1,
      resetAt,
    })
    return {
      allowed: true,
      remaining: config.requests - 1,
      resetAt
    }
  }

  if (userLimit.count >= config.requests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: userLimit.resetAt,
      retryAfter: Math.ceil((userLimit.resetAt - now) / 1000)
    }
  }

  userLimit.count++
  return {
    allowed: true,
    remaining: config.requests - userLimit.count,
    resetAt: userLimit.resetAt
  }
}

/**
 * Get current rate limit status without incrementing
 */
export async function getRateLimitStatus(
  identifier: string,
  config: RateLimitConfig
): Promise<{ count: number; remaining: number; resetAt: number }> {
  const now = Date.now()

  if (redis) {
    try {
      const key = `rate_limit:${identifier}`
      
      // Remove expired entries first
      await redis.zremrangebyscore(key, 0, now - config.window)
      
      // Get current count
      const count = await redis.zcard(key)
      
      // Get TTL for reset time
      const ttl = await redis.ttl(key)
      const resetAt = ttl > 0 ? now + (ttl * 1000) : now + config.window
      
      return {
        count,
        remaining: Math.max(0, config.requests - count),
        resetAt
      }
    } catch (error) {
      console.error('Redis status check error:', error)
    }
  }

  // Fallback to memory
  const userLimit = memoryRateLimit.get(identifier)
  if (!userLimit || now > userLimit.resetAt) {
    return { count: 0, remaining: config.requests, resetAt: now + config.window }
  }
  
  return {
    count: userLimit.count,
    remaining: Math.max(0, config.requests - userLimit.count),
    resetAt: userLimit.resetAt
  }
}

/**
 * Reset rate limit for a specific identifier (admin use)
 */
export async function resetRateLimit(identifier: string): Promise<void> {
  if (redis) {
    try {
      const key = `rate_limit:${identifier}`
      await redis.del(key)
    } catch (error) {
      console.error('Redis reset error:', error)
    }
  }
  
  memoryRateLimit.delete(identifier)
}