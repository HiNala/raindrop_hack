/**
 * Enhanced security utilities
 * Content sanitization, validation, and security headers
 */

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
 * Enhanced HTML sanitization with comprehensive XSS protection
 */
export function sanitizeHtml(
  content: string,
  options: SanitizeOptions = {},
): string {
  if (!content || typeof content !== 'string') {
    return ''
  }

  const {
    allowedTags = DEFAULT_ALLOWED_TAGS,
    allowedAttributes = DEFAULT_ALLOWED_ATTRIBUTES,
    allowStyle = false,
  } = options

  // Convert to lowercase for consistent matching
  let sanitized = content

  // Remove dangerous elements and their content
  const dangerousPatterns = [
    // Script tags (including variations)
    /<script[^>]*>.*?<\/script>/gis,
    /<script[^>]*\/>/gis,
    
    // Style tags if not allowed
    allowStyle ? null : /<style[^>]*>.*?<\/style>/gis,
    
    // iframe and embed tags
    /<iframe[^>]*>.*?<\/iframe>/gis,
    /<embed[^>]*>.*?<\/embed>/gis,
    /<object[^>]*>.*?<\/object>/gis,
    
    // Form elements
    /<form[^>]*>.*?<\/form>/gis,
    /<input[^>]*>/gis,
    /<button[^>]*>.*?<\/button>/gis,
    /<textarea[^>]*>.*?<\/textarea>/gis,
    /<select[^>]*>.*?<\/select>/gis,
    /<option[^>]*>/gis,
    
    // Meta tags
    /<meta[^>]*>/gis,
    
    // Link tags
    /<link[^>]*>/gis,
  ].filter(Boolean)

  dangerousPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern as RegExp, '')
  })

  // Remove all event handlers and javascript: URLs
  const eventHandlerPattern = /on\w+\s*=\s*["'][^"']*["']/gis
  const javascriptUrlPattern = /javascript\s*:/gis
  const dataUrlPattern = /data\s*:/gis
  const vbscriptPattern = /vbscript\s*:/gis

  sanitized = sanitized
    .replace(eventHandlerPattern, '')
    .replace(javascriptUrlPattern, '')
    .replace(dataUrlPattern, '')
    .replace(vbscriptPattern, '')

  // Remove HTML comments (can contain scripts)
  sanitized = sanitized.replace(/<!--[\s\S]*?-->/g, '')

  // Sanitize allowed tags
  const allowedTagPattern = new RegExp(`<(?!\\/?(${allowedTags.join('|')})\\s*[^>]*>|\\/${allowedTags.join('|')}>)[^>]*>`, 'gis')
  sanitized = sanitized.replace(allowedTagPattern, '')

  // Sanitize attributes in allowed tags
  allowedTags.forEach(tag => {
    const tagPattern = new RegExp(`<${tag}([^>]*)>`, 'gis')
    sanitized = sanitized.replace(tagPattern, (match, attributes) => {
      const sanitizedAttributes = sanitizeAttributes(attributes, tag, allowedAttributes)
      return `<${tag}${sanitizedAttributes}>`
    })
  })

  // Clean up multiple whitespace
  sanitized = sanitized.replace(/\s+/g, ' ').trim()

  return sanitized
}

/**
 * Sanitize HTML attributes for allowed tags
 */
function sanitizeAttributes(attributes: string, tag: string, allowedAttributes: Record<string, string[]>): string {
  if (!attributes) return ''

  const allowed = allowedAttributes[tag] || allowedAttributes['*'] || []
  const attributePattern = /(\w+)\s*=\s*["']([^"']*)["']/g
  const sanitized: string[] = []

  let match
  while ((match = attributePattern.exec(attributes)) !== null) {
    const [_, attrName, attrValue] = match
    
    if (allowed.includes(attrName)) {
      // Additional validation for specific attributes
      let sanitizedValue = attrValue
      
      if (attrName === 'href' || attrName === 'src') {
        sanitizedValue = sanitizeUrl(attrValue) || ''
      }
      
      if (sanitizedValue) {
        sanitized.push(`${attrName}="${sanitizedValue}"`)
      }
    }
  }

  return sanitized.length > 0 ? ' ' + sanitized.join(' ') : ''
}

/**
 * Enhanced plain text sanitization
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') {
    return ''
  }

  return text
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters except tab, newline, carriage return
    .replace(/[\uFFFE\uFFFF]/g, '') // Remove invalid Unicode
    .replace(/[<>]/g, '') // Remove potential HTML
    .replace(/&/g, '&amp;') // Escape ampersands
    .replace(/"/g, '&quot;') // Escape quotes
    .replace(/'/g, '&#x27;') // Escape apostrophes
    .replace(/\//g, '&#x2F;') // Escape forward slashes
    .trim()
}

/**
 * Enhanced URL validation and sanitization
 */
export function sanitizeUrl(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null
  }

  try {
    const trimmed = url.trim()
    
    // Block dangerous protocols
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'ftp:']
    if (dangerousProtocols.some(proto => trimmed.toLowerCase().startsWith(proto))) {
      return null
    }

    // Ensure URL starts with http:// or https://
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      return null
    }

    const parsed = new URL(trimmed)

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null
    }

    // Validate hostname
    if (!parsed.hostname || parsed.hostname.length === 0) {
      return null
    }

    // Prevent localhost and private IPs in production
    const hostname = parsed.hostname.toLowerCase()
    if (hostname === 'localhost' || 
        hostname.startsWith('127.') ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname.includes('::1')) {
      return null
    }

    // Limit URL length
    if (trimmed.length > 2048) {
      return null
    }

    return parsed.toString()
  } catch {
    return null
  }
}

/**
 * Enhanced file name sanitization
 */
export function sanitizeFileName(fileName: string): string {
  if (!fileName || typeof fileName !== 'string') {
    return 'unnamed'
  }

  return fileName
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '') // Remove invalid characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/[^a-zA-Z0-9_.-]/g, '') // Remove other special characters
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
    .replace(/^\./, '_') // Don't start with dot
    .substring(0, 255) // Limit length
    || 'unnamed' // Fallback name
}

/**
 * Generate cryptographically secure random string
 */
export function generateSecureToken(length: number = 32): string {
  if (typeof window !== 'undefined' && window.crypto) {
    // Browser environment
    const array = new Uint8Array(length)
    window.crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  } else if (typeof require !== 'undefined') {
    // Node.js environment
    const crypto = require('crypto')
    return crypto.randomBytes(length).toString('hex')
  } else {
    // Fallback (less secure)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }
}

/**
 * Enhanced email validation
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string) {
    return false
  }

  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  
  if (!emailRegex.test(email)) {
    return false
  }

  // Additional checks
  if (email.length > 254) { // Max email length
    return false
  }

  const [localPart, domain] = email.split('@')
  if (localPart.length > 64) { // Max local part length
    return false
  }

  if (domain.length > 253) { // Max domain length
    return false
  }

  return true
}

/**
 * Enhanced username validation
 */
export function isValidUsername(username: string): boolean {
  if (!username || typeof username !== 'string') {
    return false
  }

  // Allow alphanumeric, underscore, and hyphen, 3-20 characters
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/
  
  if (!usernameRegex.test(username)) {
    return false
  }

  // Prevent consecutive special characters
  if (/[_-]{2,}/.test(username)) {
    return false
  }

  // Prevent starting/ending with special characters
  if (/^[_-]|[_-]$/.test(username)) {
    return false
  }

  return true
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
 * Enhanced Content Security Policy configuration
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
 * Enhanced input validation patterns
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
  postId: /^[a-zA-Z0-9_-]+$/,
  commentId: /^[a-zA-Z0-9_-]+$/,
  tagSlug: /^[a-z0-9-]+$/,
  categorySlug: /^[a-z0-9-]+$/,
} as const
