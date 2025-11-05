/**
 * Enhanced error handling utilities
 * Standardizes error responses across the application
 */

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { logger } from './logger'

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR',
    public details?: any,
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export class ValidationError extends APIError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends APIError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR')
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends APIError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR')
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends APIError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}

export class RateLimitError extends APIError {
  constructor(limit: number, reset: number) {
    super('Rate limit exceeded', 429, 'RATE_LIMIT_ERROR', { limit, reset })
    this.name = 'RateLimitError'
  }
}

export function handleAPIError(error: unknown, context?: { route?: string; userId?: string }): NextResponse {
  const route = context?.route || 'unknown'

  // Log the error
  if (error instanceof Error) {
    logger.apiError(route, error, { userId: context?.userId })
  } else {
    logger.error('Unknown API error', { route, userId: context?.userId, error })
  }

  // Handle known error types
  if (error instanceof APIError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        ...(error.details && { details: error.details }),
      },
      { status: error.statusCode },
    )
  }

  // Handle Zod validation errors
  if (error instanceof z.ZodError) {
    const validationError = new ValidationError(
      'Validation failed',
      error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
        code: e.code,
      })),
    )

    return NextResponse.json(
      {
        error: validationError.message,
        code: validationError.code,
        details: validationError.details,
      },
      { status: validationError.statusCode },
    )
  }

  // Handle Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as any

    switch (prismaError.code) {
      case 'P2002':
        return NextResponse.json(
          {
            error: 'Resource already exists',
            code: 'DUPLICATE_ERROR',
          },
          { status: 409 },
        )
      case 'P2025':
        return NextResponse.json(
          {
            error: 'Resource not found',
            code: 'NOT_FOUND',
          },
          { status: 404 },
        )
      default:
        logger.error('Unhandled Prisma error', { code: prismaError.code, route, userId: context?.userId })
        break
    }
  }

  // Generic error fallback - don't expose internal details
  return NextResponse.json(
    {
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    },
    { status: 500 },
  )
}

export function createSafeResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status })
}

export async function withErrorHandling<T>(
  handler: () => Promise<T>,
  context?: { route?: string; userId?: string },
): Promise<NextResponse> {
  try {
    const result = await handler()
    return createSafeResponse(result)
  } catch (error) {
    return handleAPIError(error, context)
  }
}

export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid request data', error.errors)
    }
    throw new ValidationError('Invalid request data')
  }
}
