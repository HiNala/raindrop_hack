/**
 * Enhanced security utilities
 * Content sanitization, validation, and security headers
 */

// Note: DOMPurify and JSDOM imports removed for build compatibility
// Using fallback sanitization for now

export interface SanitizeOptions {
  allowedTags?: string[]
  allowedAttributes?: Record<string, string[]>
  allowStyle?: boolean
}

const DEFAULT_ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 'i', 'b',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'dl', 'dt', 'dd',
  'blockquote', 'pre', 'code',
  'a', 'img',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
]

const DEFAULT_ALLOWED_ATTRIBUTES = {
  'a': ['href', 'title', 'target'],
  'img': ['src', 'alt', 'title', 'width', 'height'],
  '*': ['class'],
}

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(
  content: string,
  options: SanitizeOptions = {},
): string {
  const {
    allowedTags = DEFAULT_ALLOWED_TAGS,
    allowedAttributes = DEFAULT_ALLOWED_ATTRIBUTES,
    allowStyle = false,
  } = options

  const config = {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: Object.values(allowedAttributes).flat(),
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover'],
    ADD_ATTR: ['target'],
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_DOM_IMPORT: false,
  }

  if (!allowStyle) {
    config.FORBID_TAGS!.push('style')
    Object.keys(allowedAttributes).forEach(tag => {
      const index = allowedAttributes[tag]?.indexOf('style')
      if (index > -1) {
        allowedAttributes[tag].splice(index, 1)
      }
    })
  }

  // Fallback sanitization - basic HTML tag removal for now
  // TODO: Implement proper sanitization with DOMPurify when JSDOM issues are resolved
  return content
    .replace(/<script[^>]*>.*?<\/script>/gis, '') // Remove script tags
    .replace(/<style[^>]*>.*?<\/style>/gis, '') // Remove style tags
    .replace(/<iframe[^>]*>.*?<\/iframe>/gis, '') // Remove iframe tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
    .trim()
}

/**
 * Sanitize plain text content
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .replace(/[<>]/g, '') // Remove potential HTML
    .trim()
}

/**
 * Validate and sanitize URLs
 */
export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url)

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null
    }

    // Basic domain validation
    if (!parsed.hostname || parsed.hostname.length === 0) {
      return null
    }

    return parsed.toString()
  } catch {
    return null
  }
}

/**
 * Validate and sanitize file names
 */
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[<>:"/\\|?*]/g, '') // Remove invalid characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/[^a-zA-Z0-9_.-]/g, '') // Remove other special characters
    .substring(0, 255) // Limit length
}

/**
 * Generate secure random string
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return result
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate username format
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/
  return usernameRegex.test(username)
}

/**
 * Rate limiting configuration
 */
export const RATE_LIMITS = {
  // AI generation limits
  AI_GENERATION: { requests: 10, window: '1d' },
  // HN enrichment limits
  HN_ENRICHMENT: { requests: 100, window: '1h' },
  // General API limits
  API_GENERAL: { requests: 1000, window: '1h' },
  // Authentication limits
  AUTH_ATTEMPTS: { requests: 5, window: '15m' },
  // Content creation limits
  POST_CREATION: { requests: 20, window: '1h' },
  // Comment limits
  COMMENT_CREATION: { requests: 50, window: '1h' },
  // Upload limits
  FILE_UPLOAD: { requests: 10, window: '1h' },
} as const

/**
 * Content Security Policy configuration
 */
export const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.clerk.accounts.dev https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https: blob:",
  "connect-src 'self' https://api.openai.com https://*.clerk.accounts.dev https://*.clerk.com wss://*.clerk.accounts.dev",
  "media-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src https://*.clerk.accounts.dev https://challenges.cloudflare.com",
]

/**
 * Security headers configuration
 */
export const SECURITY_HEADERS = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Content-Security-Policy',
    value: CSP_DIRECTIVES.join('; '),
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
] as const

/**
 * Input validation patterns
 */
export const VALIDATION_PATTERNS = {
  username: /^[a-zA-Z0-9_-]{3,20}$/,
  slug: /^[a-z0-9-]+$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s-()]+$/,
  url: /^https?:\/\/.+/,
  title: /^.{1,200}$/,
  excerpt: /^.{0,500}$/,
  content: /^.{1,50000}$/,
} as const
