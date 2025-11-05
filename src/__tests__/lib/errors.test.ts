import {
  APIError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  handleAPIError,
  withErrorHandling,
} from '../errors'
import { z } from 'zod'

describe('Error Classes', () => {
  describe('APIError', () => {
    it('should create APIError with default values', () => {
      const error = new APIError('Test error')
      expect(error.message).toBe('Test error')
      expect(error.statusCode).toBe(500)
      expect(error.code).toBe('INTERNAL_ERROR')
      expect(error.name).toBe('APIError')
    })

    it('should create APIError with custom values', () => {
      const error = new APIError('Custom error', 400, 'CUSTOM_CODE', { detail: 'test' })
      expect(error.message).toBe('Custom error')
      expect(error.statusCode).toBe(400)
      expect(error.code).toBe('CUSTOM_CODE')
      expect(error.details).toEqual({ detail: 'test' })
    })
  })

  describe('ValidationError', () => {
    it('should create ValidationError with correct status code', () => {
      const error = new ValidationError('Invalid data', { field: 'value' })
      expect(error.statusCode).toBe(400)
      expect(error.code).toBe('VALIDATION_ERROR')
      expect(error.details).toEqual({ field: 'value' })
    })
  })

  describe('AuthenticationError', () => {
    it('should create AuthenticationError with correct status code', () => {
      const error = new AuthenticationError('Not authenticated')
      expect(error.statusCode).toBe(401)
      expect(error.code).toBe('AUTHENTICATION_ERROR')
    })

    it('should use default message', () => {
      const error = new AuthenticationError()
      expect(error.message).toBe('Authentication required')
    })
  })

  describe('AuthorizationError', () => {
    it('should create AuthorizationError with correct status code', () => {
      const error = new AuthorizationError('Access denied')
      expect(error.statusCode).toBe(403)
      expect(error.code).toBe('AUTHORIZATION_ERROR')
    })
  })

  describe('NotFoundError', () => {
    it('should create NotFoundError with correct status code', () => {
      const error = new NotFoundError('Post')
      expect(error.statusCode).toBe(404)
      expect(error.code).toBe('NOT_FOUND')
      expect(error.message).toBe('Post not found')
    })

    it('should use default resource name', () => {
      const error = new NotFoundError()
      expect(error.message).toBe('Resource not found')
    })
  })
})

describe('Error Handling Functions', () => {
  describe('handleAPIError', () => {
    let mockResponse: any

    beforeEach(() => {
      mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      }
      global.NextResponse = {
        json: jest.fn().mockReturnValue(mockResponse),
      } as any
    })

    it('should handle APIError correctly', () => {
      const error = new APIError('Test error', 400, 'TEST_ERROR', { detail: 'test' })

      handleAPIError(error)

      expect(NextResponse.json).toHaveBeenCalledWith(
        {
          error: 'Test error',
          code: 'TEST_ERROR',
          details: { detail: 'test' },
        },
        { status: 400 }
      )
    })

    it('should handle generic Error correctly', () => {
      const error = new Error('Generic error')

      handleAPIError(error)

      expect(NextResponse.json).toHaveBeenCalledWith(
        {
          error: 'Internal server error',
          code: 'INTERNAL_ERROR',
        },
        { status: 500 }
      )
    })

    it('should handle ZodError correctly', () => {
      const schema = z.string().min(5)
      const result = schema.safeParse('abc')

      if (!result.success) {
        handleAPIError(result.error)

        expect(NextResponse.json).toHaveBeenCalledWith(
          {
            error: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: expect.arrayContaining([
              expect.objectContaining({
                field: '',
                message: expect.any(String),
                code: expect.any(String),
              }),
            ]),
          },
          { status: 400 }
        )
      }
    })
  })

  describe('withErrorHandling', () => {
    it('should return successful response', async () => {
      const handler = jest.fn().mockResolvedValue({ success: true })

      await withErrorHandling(handler)

      expect(handler).toHaveBeenCalled()
    })

    it('should handle errors in handler', async () => {
      const handler = jest.fn().mockRejectedValue(new Error('Handler error'))
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      }
      global.NextResponse = {
        json: jest.fn().mockReturnValue(mockResponse),
      } as any

      await withErrorHandling(handler)

      expect(NextResponse.json).toHaveBeenCalledWith(
        {
          error: 'Internal server error',
          code: 'INTERNAL_ERROR',
        },
        { status: 500 }
      )
    })
  })
})
