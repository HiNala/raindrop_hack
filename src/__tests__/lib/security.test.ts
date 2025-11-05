import { logger } from '../logger'
import {
  sanitizeHtml,
  sanitizeText,
  sanitizeUrl,
  isValidEmail,
  isValidUsername,
} from '../security-enhanced'

describe('Logger', () => {
  beforeEach(() => {
    // Mock console methods
    jest.spyOn(console, 'error').mockImplementation()
    jest.spyOn(console, 'warn').mockImplementation()
    jest.spyOn(console, 'info').mockImplementation()
    jest.spyOn(console, 'debug').mockImplementation()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should log error messages', () => {
    logger.error('Test error message')
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('ERROR: Test error message'))
  })

  it('should log API errors with context', () => {
    const error = new Error('API failed')
    logger.apiError('/api/test', error, { userId: 'test-user' })

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('API Error in /api/test'),
      expect.any(Error),
      expect.objectContaining({ userId: 'test-user' })
    )
  })

  it('should log performance metrics', () => {
    logger.performanceMetric('test-operation', 150, { postId: 'test-post' })

    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('Performance: test-operation took 150ms'),
      expect.objectContaining({ operation: 'test-operation', duration: 150, postId: 'test-post' })
    )
  })
})

describe('Security Utilities', () => {
  describe('sanitizeHtml', () => {
    it('should remove script tags', () => {
      const html = '<p>Safe content</p><script>alert("xss")</script>'
      const result = sanitizeHtml(html)
      expect(result).not.toContain('<script>')
      expect(result).toContain('<p>Safe content</p>')
    })

    it('should allow safe HTML tags', () => {
      const html = '<h1>Title</h1><p>Content with <strong>bold</strong> text</p>'
      const result = sanitizeHtml(html)
      expect(result).toContain('<h1>Title</h1>')
      expect(result).toContain('<strong>bold</strong>')
    })

    it('should remove dangerous attributes', () => {
      const html = '<p onclick="alert(\'xss\')">Content</p>'
      const result = sanitizeHtml(html)
      expect(result).not.toContain('onclick')
    })
  })

  describe('sanitizeText', () => {
    it('should remove control characters', () => {
      const text = 'Normal text\x00\x01\x02with control chars'
      const result = sanitizeText(text)
      expect(result).toBe('Normal textwith control chars')
    })

    it('should remove HTML brackets', () => {
      const text = 'Text with <script> and <html> tags'
      const result = sanitizeText(text)
      expect(result).toBe('Text with script and html tags')
    })

    it('should trim whitespace', () => {
      const text = '  padded text  '
      const result = sanitizeText(text)
      expect(result).toBe('padded text')
    })
  })

  describe('sanitizeUrl', () => {
    it('should allow valid HTTPS URLs', () => {
      const url = 'https://example.com/page'
      const result = sanitizeUrl(url)
      expect(result).toBe(url)
    })

    it('should allow valid HTTP URLs', () => {
      const url = 'http://example.com/page'
      const result = sanitizeUrl(url)
      expect(result).toBe(url)
    })

    it('should reject javascript URLs', () => {
      const url = 'javascript:alert("xss")'
      const result = sanitizeUrl(url)
      expect(result).toBeNull()
    })

    it('should reject invalid URLs', () => {
      const url = 'not-a-url'
      const result = sanitizeUrl(url)
      expect(result).toBeNull()
    })
  })

  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('user@example.com')).toBe(true)
      expect(isValidEmail('test.email+tag@domain.co.uk')).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid-email')).toBe(false)
      expect(isValidEmail('@domain.com')).toBe(false)
      expect(isValidEmail('user@')).toBe(false)
      expect(isValidEmail('')).toBe(false)
    })
  })

  describe('isValidUsername', () => {
    it('should validate correct usernames', () => {
      expect(isValidUsername('username')).toBe(true)
      expect(isValidUsername('user_name')).toBe(true)
      expect(isValidUsername('user-name')).toBe(true)
      expect(isValidUsername('user123')).toBe(true)
    })

    it('should reject invalid usernames', () => {
      expect(isValidUsername('us')).toBe(false) // too short
      expect(isValidUsername('very-long-username-that-exceeds-limit')).toBe(false)
      expect(isValidUsername('user name')).toBe(false) // space
      expect(isValidUsername('user@name')).toBe(false) // special char
      expect(isValidUsername('')).toBe(false)
    })
  })
})
