/**
 * Enhanced rate limiting middleware with Redis fallback
 */

import { NextRequest, NextResponse } from 'next/server'
import { rateLimitService } from './rate-limiting'
import { RateLimitError } from './errors'
import { logger } from './logger'

interface RateLimitConfig {
  requests: number
  window: string
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

/**
 * Create rate limit middleware for API routes
 */
export async function createRateLimit(
  config: RateLimitConfig,
  request: NextRequest,
  context?: { userId?: string },
): Promise<void> {
  try {
    // Get identifier from request
    const identifier = await getIdentifier(request, context?.userId)

    if (!identifier) {
      logger.warn('No identifier found for rate limiting', {
        ip: request.ip,
        userAgent: request.headers.get('user-agent'),
      })
      // If we can't identify, use IP address
      const ip = request.ip || 'unknown'
      const result = await rateLimitService.checkLimit(ip, config)

      if (!result.success) {
        throw new RateLimitError(config.requests, result.reset)
      }

      return
    }

    // Check rate limit
    const result = await rateLimitService.checkLimit(identifier, config)

    if (!result.success) {
      logger.warn('Rate limit exceeded', {
        identifier,
        limit: config.requests,
        window: config.window,
      })
      throw new RateLimitError(config.requests, result.reset)
    }

  } catch (error) {
    if (error instanceof RateLimitError) {
      throw error
    }

    logger.error('Rate limiting error', error, {
      ip: request.ip,
      config,
    })

    // Fail open if rate limiting fails
    // But log the error for monitoring
  }
}

/**
 * Get identifier from request
 */
async function getIdentifier(request: NextRequest, userId?: string): Promise<string | null> {
  // Use provided userId first
  if (userId) {
    return `user:${userId}`
  }

  // Try to get user ID from auth header
  const authHeader = request.headers.get('authorization')
  if (authHeader) {
    try {
      // For Clerk, extract user ID from JWT token
      const token = authHeader.replace('Bearer ', '')
      const payload = JSON.parse(atob(token.split('.')[1]))
      return `user:${payload.sub || payload.userId}`
    } catch (error) {
      // Invalid token, fall back to IP
    }
  }

  // Try to get user ID from session
  const sessionToken = request.cookies.get('__session')?.value
  if (sessionToken) {
    try {
      const payload = JSON.parse(atob(sessionToken))
      return `user:${payload.userId}`
    } catch (error) {
      // Invalid session, fall back to IP
    }
  }

  // Fall back to IP address
  const ip = request.ip ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'

  return `ip:${ip}`
}

/**
 * Rate limiting middleware wrapper for API routes
 */
export function withRateLimit(
  config: RateLimitConfig,
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>,
) {
  return async (request: NextRequest, context?: any) => {
    try {
      // Apply rate limiting
      await createRateLimit(config, request, context)

      // Execute handler
      return await handler(request, context)
    } catch (error) {
      if (error instanceof RateLimitError) {
        return NextResponse.json(
          {
            error: error.message,
            code: error.code,
            details: error.details,
          },
          {
            status: error.statusCode,
            headers: {
              'X-RateLimit-Limit': error.details?.limit?.toString() || '0',
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': error.details?.reset?.toString() || '0',
              'Retry-After': Math.ceil((error.details?.reset || 0 - Date.now()) / 1000).toString(),
            },
          },
        )
      }

      throw error
    }
  }
}

/**
 * Predefined rate limit configurations with enhanced security
 */
export const RATE_LIMITS = {
  // AI generation limits - very strict
  AI_GENERATION: {
    requests: 10,
    window: '1d',
    skipSuccessfulRequests: false,
  },

  // HN enrichment limits - more lenient
  HN_ENRICHMENT: {
    requests: 100,
    window: '1h',
    skipSuccessfulRequests: false,
  },

  // General API limits - high but limited
  API_GENERAL: {
    requests: 1000,
    window: '1h',
    skipSuccessfulRequests: true,
  },

  // Authentication limits - very strict
  AUTH_ATTEMPTS: {
    requests: 5,
    window: '15m',
    skipSuccessfulRequests: false,
  },

  // Content creation limits - moderate
  POST_CREATION: {
    requests: 20,
    window: '1h',
    skipSuccessfulRequests: false,
  },

  // Comment limits - higher
  COMMENT_CREATION: {
    requests: 50,
    window: '1h',
    skipSuccessfulRequests: false,
  },

  // Upload limits - strict
  FILE_UPLOAD: {
    requests: 10,
    window: '1h',
    skipSuccessfulRequests: false,
  },

  // Search limits - moderate
  SEARCH: {
    requests: 100,
    window: '1h',
    skipSuccessfulRequests: true,
  },

  // Analytics tracking limits - lenient
  ANALYTICS: {
    requests: 5000,
    window: '1h',
    skipSuccessfulRequests: true,
  },
} as const

/**
 * Apply rate limiting to a request with context
 */
export async function applyRateLimit(
  request: NextRequest,
  limitType: keyof typeof RATE_LIMITS,
  context?: { userId?: string },
): Promise<void> {
  return createRateLimit(RATE_LIMITS[limitType], request, context)
}
