import { z } from 'zod'
import { postSchema, commentSchema, userSchema, loginSchema, registerSchema } from './validations'
import { cn } from './utils'

// Enhanced form schemas with client-side hints
export const enhancedPostSchema = postSchema.extend({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .refine(val => val.trim().length > 0, 'Title cannot be just whitespace'),
  slug: z.string()
    .min(1, 'Slug is required')
    .max(200, 'Slug must be less than 200 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  excerpt: z.string()
    .max(500, 'Excerpt must be less than 500 characters')
    .optional()
    .transform(val => val?.trim() || undefined),
  content: z.string()
    .min(10, 'Content must be at least 10 characters')
    .refine(val => val.trim().length > 0, 'Content cannot be just whitespace'),
  tags: z.array(z.string().min(1).max(50)).max(5, 'Maximum 5 tags allowed').optional(),
  readingTime: z.number().min(1).optional(),
})

export const enhancedCommentSchema = commentSchema.extend({
  content: z.string()
    .min(3, 'Comment must be at least 3 characters')
    .max(1000, 'Comment must be less than 1000 characters')
    .refine(val => val.trim().length > 0, 'Comment cannot be just whitespace'),
  author: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .refine(val => val.trim().length > 0, 'Name cannot be just whitespace'),
})

export const enhancedProfileSchema = userSchema.pick({
  name: true,
  bio: true,
}).extend({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .refine(val => val.trim().length > 0, 'Name cannot be just whitespace'),
  bio: z.string()
    .max(500, 'Bio must be less than 500 characters')
    .optional()
    .transform(val => val?.trim() || undefined),
  email: z.string().email('Valid email is required').optional(),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
    .optional(),
})

// Real-time validation utilities
export const validateField = <T extends z.ZodType>(
  schema: T,
  field: keyof z.infer<T>,
  value: unknown
) => {
  try {
    const fieldSchema = schema.shape[field as string] as z.ZodType
    fieldSchema.parse(value)
    return { valid: true, error: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0]?.message || 'Invalid value' }
    }
    return { valid: false, error: 'Validation error' }
  }
}

// Optimistic update utilities
export interface OptimisticState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  isOptimistic: boolean
}

export const createOptimisticUpdate = <T>(
  initialState: OptimisticState<T>
) => {
  const state = { ...initialState }

  const setOptimistic = (optimisticData: T) => {
    state.data = optimisticData
    state.isOptimistic = true
    state.isLoading = false
    state.error = null
  }

  const setPending = () => {
    state.isLoading = true
    state.error = null
  }

  const setSuccess = (data: T) => {
    state.data = data
    state.isLoading = false
    state.error = null
    state.isOptimistic = false
  }

  const setError = (error: string) => {
    state.error = error
    state.isLoading = false
    state.isOptimistic = false
  }

  const reset = () => {
    state.data = initialState.data
    state.isLoading = false
    state.error = null
    state.isOptimistic = false
  }

  return {
    get: () => state,
    setOptimistic,
    setPending,
    setSuccess,
    setError,
    reset,
  }
}

// Form submission utilities
export interface FormSubmitOptions<T = unknown> {
  onSuccess?: (data: T) => void
  onError?: (error: string) => void
  onSettled?: () => void
  optimisticUpdate?: (data: T) => void
  resetForm?: boolean
}

export const createFormSubmit = <T>(
  schema: z.ZodType<T>,
  submitFn: (data: T) => Promise<unknown>,
  options: FormSubmitOptions<T> = {}
) => {
  return async (data: unknown, form?: HTMLFormElement) => {
    try {
      // Client-side validation
      const validatedData = schema.parse(data)

      // Show optimistic state if provided
      if (options.optimisticUpdate) {
        options.optimisticUpdate(validatedData)
      }

      // Submit to server
      const result = await submitFn(validatedData)

      // Success callback
      if (options.onSuccess) {
        options.onSuccess(result)
      }

      // Reset form if requested
      if (options.resetForm && form) {
        form.reset()
      }

      return { success: true, data: result }
    } catch (error) {
      let errorMessage = 'Something went wrong'

      if (error instanceof z.ZodError) {
        errorMessage = error.errors[0]?.message || 'Validation error'
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      // Error callback
      if (options.onError) {
        options.onError(errorMessage)
      }

      return { success: false, error: errorMessage }
    } finally {
      // Settled callback
      if (options.onSettled) {
        options.onSettled()
      }
    }
  }
}

// React Hook Form integration
export const createFormResolver = (schema: z.ZodType) => {
  return (values: unknown) => {
    try {
      const validated = schema.parse(values)
      return { values: validated, errors: {} }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            errors[err.path.join('.')] = err.message
          }
        })
        return { values: {}, errors }
      }
      return { values: {}, errors: { root: 'Validation failed' } }
    }
  }
}

export type EnhancedPostInput = z.infer<typeof enhancedPostSchema>
export type EnhancedCommentInput = z.infer<typeof enhancedCommentSchema>
export type EnhancedProfileInput = z.infer<typeof enhancedProfileSchema>
