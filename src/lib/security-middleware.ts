import { NextRequest, NextResponse } from 'next/server'
import { createMiddleware } from 'next-intl/middleware'
import { withAuth } from 'next-auth/middleware'
import { rateLimitService } from '@/lib/rate-limiting'

// Rate limiting configurations
const RATE_LIMITS = {
  // API endpoints
  '/api/generate-post': {
    requests: 10,
    window: '1 d',
  },
  '/api/hn-enrichment': {
    requests: 100,
    window: '1 h',
  },
  '/api/posts': {
    requests: 20,
    window: '1 h',
  },
  '/api/comments': {
    requests: 50,
    window: '1 h',
  },
  '/api/upload': {
    requests: 10,
    window: '1 h',
  },
  '/api/auth': {
    requests: 5,
    window: '15 m',
  },
}

// Security headers
const SECURITY_HEADERS = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-XSS-Protection': '1; mode=block',
}

// Content Security Policy
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://js.stripe.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https: blob:",
  "connect-src 'self' https://api.openai.com https://hn.algolia.com https://api.uploadthing.com https://clerk.yourdomain.com",
  "frame-src 'self' https://js.stripe.com",
  "media-src 'self' blob:",
].join('; ')

// CORS configuration
const CORS_CONFIG = {
  origins: [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
    'https://app.yourdomain.com',
    process.env.NODE_ENV === 'development' && 'http://localhost:3000',
  ].filter(Boolean) as string[],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  headers: [
    'Accept',
    'Authorization',
    'Content-Type',
    'X-Requested-With',
    'X-CSRF-Token',
  ],
}

// IP blocking configuration
const BLOCKED_IPS = new Set([
  // Add malicious IPs here
])

// Suspicious activity detection
const SUSPICIOUS_PATTERNS = {
  rapidRequests: {
    threshold: 100, // requests
    window: '1 m', // time window
  },
  unusualUserAgents: [
    /bot/i,
    /crawler/i,
    /scanner/i,
    /sqlmap/i,
    /nikto/i,
  ],
  maliciousPaths: [
    '/admin',
    '/wp-admin',
    '/phpmyadmin',
    '/.env',
    '/config',
  ],
}

// Rate limiting middleware
async function rateLimitMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Find matching rate limit config
  const rateLimitConfig = Object.entries(RATE_LIMITS).find(([path]) =>
    pathname.startsWith(path),
  )?.[1]

  if (!rateLimitConfig) {
    return { success: true }
  }

  // Get identifier
  const identifier = await getIdentifier(request) || request.ip || 'anonymous'

  // Check rate limit
  const result = await rateLimitService.checkLimit(identifier, rateLimitConfig)

  if (!result.success) {
    return {
      success: false,
      headers: {
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': result.reset.toString(),
        'Retry-After': result.retryAfter?.toString(),
      },
    }
  }

  return {
    success: true,
    headers: {
      'X-RateLimit-Limit': result.limit.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': result.reset.toString(),
    },
  }
}

// Security headers middleware
function securityHeadersMiddleware(response: NextResponse): NextResponse {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  response.headers.set('Content-Security-Policy', CSP)

  return response
}

// CORS middleware
function corsMiddleware(request: NextRequest, response: NextResponse): NextResponse {
  const origin = request.headers.get('origin')

  if (CORS_CONFIG.origins.includes(origin || '')) {
    response.headers.set('Access-Control-Allow-Origin', origin || '')
  }

  response.headers.set(
    'Access-Control-Allow-Methods',
    CORS_CONFIG.methods.join(', '),
  )

  response.headers.set(
    'Access-Control-Allow-Headers',
    CORS_CONFIG.headers.join(', '),
  )

  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Max-Age', '86400')

  return response
}

// IP blocking middleware
function ipBlockingMiddleware(request: NextRequest) {
  const ip = request.ip

  if (BLOCKED_IPS.has(ip)) {
    return {
      blocked: true,
      reason: 'IP address blocked',
    }
  }

  return { blocked: false }
}

// Suspicious activity detection
function suspiciousActivityMiddleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || ''
  const pathname = request.nextUrl.pathname

  // Check for suspicious user agents
  const isSuspiciousUA = SUSPICIOUS_PATTERNS.unusualUserAgents.some(pattern =>
    pattern.test(userAgent),
  )

  // Check for malicious paths
  const isMaliciousPath = SUSPICIOUS_PATTERNS.maliciousPaths.some(path =>
    pathname.toLowerCase().includes(path),
  )

  if (isSuspiciousUA || isMaliciousPath) {
    return {
      suspicious: true,
      reason: isSuspiciousUA ? 'Suspicious user agent' : 'Malicious path requested',
      userAgent,
      path: pathname,
    }
  }

  return { suspicious: false }
}

// Get identifier for rate limiting
async function getIdentifier(request: NextRequest): Promise<string | null> {
  // Try to get user ID from auth header
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const token = authHeader.replace('Bearer ', '')
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.sub || null
    } catch (error) {
      // Invalid token
    }
  }

  // Try to get user ID from session
  const sessionToken = request.cookies.get('__session')?.value
  if (sessionToken) {
    try {
      const payload = JSON.parse(atob(sessionToken))
      return payload.userId || null
    } catch (error) {
      // Invalid session
    }
  }

  return null
}

// Input validation middleware
function inputValidationMiddleware(request: NextRequest) {
  const contentType = request.headers.get('content-type')

  // Validate content type for POST/PUT requests
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    if (!contentType?.includes('application/json') && !contentType?.includes('multipart/form-data')) {
      return {
        invalid: true,
        reason: 'Invalid content type',
        expected: ['application/json', 'multipart/form-data'],
      }
    }
  }

  // Check request size
  const contentLength = request.headers.get('content-length')
  if (contentLength) {
    const size = parseInt(contentLength)
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (size > maxSize) {
      return {
        invalid: true,
        reason: 'Request too large',
        maxSize: `${maxSize / 1024 / 1024}MB`,
      }
    }
  }

  return { invalid: false }
}

// Main security middleware
export function securityMiddleware(request: NextRequest) {
  return async (response: NextResponse) => {
    try {
      // 1. IP blocking
      const ipCheck = ipBlockingMiddleware(request)
      if (ipCheck.blocked) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 },
        )
      }

      // 2. Suspicious activity detection
      const suspiciousCheck = suspiciousActivityMiddleware(request)
      if (suspiciousCheck.suspicious) {
        console.warn('Suspicious activity detected:', suspiciousCheck)

        // Don't block immediately, but log and potentially implement additional checks
      }

      // 3. Rate limiting
      const rateLimitCheck = await rateLimitMiddleware(request)
      if (!rateLimitCheck.success) {
        const errorResponse = NextResponse.json(
          {
            error: 'Rate limit exceeded',
            message: 'Too many requests. Please try again later.',
          },
          { status: 429 },
        )

        // Add rate limit headers
        Object.entries(rateLimitCheck.headers || {}).forEach(([key, value]) => {
          errorResponse.headers.set(key, value)
        })

        return errorResponse
      }

      // 4. Input validation
      const validationCheck = inputValidationMiddleware(request)
      if (validationCheck.invalid) {
        return NextResponse.json(
          {
            error: 'Invalid request',
            message: validationCheck.reason,
          },
          { status: 400 },
        )
      }

      // 5. Apply security headers to response
      securityHeadersMiddleware(response)

      // 6. Apply CORS headers
      corsMiddleware(request, response)

      // 7. Add rate limit headers to successful responses
      if (rateLimitCheck.headers) {
        Object.entries(rateLimitCheck.headers).forEach(([key, value]) => {
          response.headers.set(key, value)
        })
      }

      return response
    } catch (error) {
      console.error('Security middleware error:', error)

      // Fail open for security middleware errors
      return securityHeadersMiddleware(response)
    }
  }
}

// Export individual middleware functions for specific use cases
export {
  rateLimitMiddleware,
  securityHeadersMiddleware,
  corsMiddleware,
  ipBlockingMiddleware,
  suspiciousActivityMiddleware,
  inputValidationMiddleware,
}

// Usage in API routes:
// export async function GET(request: NextRequest) {
//   const securityResponse = await securityMiddleware(request)(NextResponse.next())
//
//   if (securityResponse.status >= 400) {
//     return securityResponse
//   }
//
//   // Your API logic here
// }
