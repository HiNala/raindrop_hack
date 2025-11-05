/**
 * Security utilities for the application
 */

// Allowed image MIME types
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
]

// Maximum file sizes (in bytes)
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
export const MAX_AVATAR_SIZE = 2 * 1024 * 1024 // 2MB

/**
 * Validate uploaded file type and size
 */
export function validateImageUpload(
  file: File,
  maxSize: number = MAX_IMAGE_SIZE,
): { valid: boolean; error?: string } {
  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
    }
  }

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${(maxSize / (1024 * 1024)).toFixed(0)}MB`,
    }
  }

  return { valid: true }
}

/**
 * Sanitize HTML content (remove potentially dangerous tags/attributes)
 * This is a basic sanitizer - for production, consider using DOMPurify
 */
export function sanitizeHtml(html: string): string {
  // Remove script tags
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

  // Remove iframe tags
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')

  // Remove on* event handlers
  sanitized = sanitized.replace(/\son\w+\s*=/gi, '')

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '')

  return sanitized
}

/**
 * Simple in-memory rate limiter
 * For production, use Upstash Redis or similar
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map()

  check(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now()
    const timestamps = this.requests.get(key) || []

    // Filter out old requests outside the time window
    const recentRequests = timestamps.filter(ts => now - ts < windowMs)

    if (recentRequests.length >= limit) {
      return false // Rate limit exceeded
    }

    // Add current request
    recentRequests.push(now)
    this.requests.set(key, recentRequests)

    return true // Request allowed
  }

  reset(key: string) {
    this.requests.delete(key)
  }
}

export const rateLimiter = new RateLimiter()

/**
 * Rate limit configurations
 */
export const RATE_LIMITS = {
  AI_GENERATION: { limit: 10, windowMs: 60 * 60 * 1000 }, // 10 per hour
  HN_SEARCH: { limit: 20, windowMs: 5 * 60 * 1000 }, // 20 per 5 minutes
  API_DEFAULT: { limit: 100, windowMs: 15 * 60 * 1000 }, // 100 per 15 minutes
  EXPORT: { limit: 3, windowMs: 24 * 60 * 60 * 1000 }, // 3 per day
}

/**
 * Validate slug format (lowercase, hyphenated, no special chars)
 */
export function validateSlug(slug: string): { valid: boolean; error?: string } {
  if (!slug || slug.trim().length === 0) {
    return { valid: false, error: 'Slug cannot be empty' }
  }

  if (slug.length > 200) {
    return { valid: false, error: 'Slug too long (max 200 characters)' }
  }

  // Only allow lowercase letters, numbers, and hyphens
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  if (!slugRegex.test(slug)) {
    return {
      valid: false,
      error: 'Slug must contain only lowercase letters, numbers, and hyphens',
    }
  }

  return { valid: true }
}

/**
 * Check if user owns a resource
 */
export function checkOwnership(resourceAuthorId: string, userId: string): boolean {
  return resourceAuthorId === userId
}

