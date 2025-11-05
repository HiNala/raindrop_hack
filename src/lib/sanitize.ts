import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

// Create a DOM window for server-side DOMPurify
const window = new JSDOM('').window
const DOMPurifyServer = DOMPurify(window as any)

/**
 * Sanitize HTML content for safe rendering
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurifyServer.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'blockquote', 'ul', 'ol', 'li', 'code', 'pre', 'a', 'img', 'span', 'div'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'src', 'alt', 'class', 'id', 'style'
    ],
    ALLOW_DATA_ATTR: false,
  })
}

/**
 * Sanitize plain text by escaping HTML entities
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Validate and sanitize user input for database storage
 */
export function sanitizeUserInput(input: string): string {
  // Remove null bytes and other dangerous characters
  return input
    .replace(/\0/g, '') // Remove null bytes
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
    .trim()
    .slice(0, 10000) // Limit length
}
