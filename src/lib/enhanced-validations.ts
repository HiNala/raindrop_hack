/**
 * Enhanced validation schemas with comprehensive security
 */

import { z } from 'zod'
import { VALIDATION_PATTERNS } from './security-enhanced'

// Post validation schemas
export const postCreateSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .regex(VALIDATION_PATTERNS.title, 'Title contains invalid characters'),

  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200, 'Slug must be less than 200 characters')
    .regex(VALIDATION_PATTERNS.slug, 'Slug must contain only lowercase letters, numbers, and hyphens'),

  excerpt: z
    .string()
    .max(500, 'Excerpt must be less than 500 characters')
    .regex(VALIDATION_PATTERNS.excerpt, 'Excerpt contains invalid characters')
    .optional()
    .or(z.literal('')),

  content: z
    .string()
    .min(10, 'Content must be at least 10 characters')
    .max(50000, 'Content must be less than 50,000 characters')
    .regex(VALIDATION_PATTERNS.content, 'Content contains invalid characters'),

  contentJson: z
    .object({})
    .optional()
    .refine(
      (obj) => !obj || Object.keys(obj).length > 0,
      'Content JSON cannot be empty',
    ),

  coverImage: z
    .string()
    .url('Cover image must be a valid URL')
    .regex(VALIDATION_PATTERNS.url, 'Cover image URL is invalid')
    .optional()
    .or(z.literal('')),

  published: z.boolean().default(false),
  featured: z.boolean().default(false),

  tagIds: z
    .array(z.string().cuid('Invalid tag ID format'))
    .max(5, 'Cannot have more than 5 tags')
    .optional(),

  seoTitle: z
    .string()
    .max(60, 'SEO title must be less than 60 characters')
    .optional()
    .or(z.literal('')),

  seoDescription: z
    .string()
    .max(160, 'SEO description must be less than 160 characters')
    .optional()
    .or(z.literal('')),

  canonicalUrl: z
    .string()
    .url('Canonical URL must be a valid URL')
    .optional()
    .or(z.literal('')),

  visibility: z.enum(['PUBLIC', 'UNLISTED', 'MEMBERS_ONLY', 'PRIVATE']).default('PUBLIC'),

  readTimeMin: z
    .number()
    .min(1, 'Reading time must be at least 1 minute')
    .max(120, 'Reading time cannot exceed 120 minutes')
    .optional(),
})

export const postUpdateSchema = postCreateSchema.partial().extend({
  id: z.string().cuid('Invalid post ID'),
})

// User profile validation schemas
export const userProfileCreateSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(VALIDATION_PATTERNS.username, 'Username can only contain letters, numbers, underscores, and hyphens'),

  displayName: z
    .string()
    .min(1, 'Display name is required')
    .max(100, 'Display name must be less than 100 characters'),

  bio: z
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .optional()
    .or(z.literal('')),

  websiteUrl: z
    .string()
    .url('Website URL must be valid')
    .optional()
    .or(z.literal('')),

  location: z
    .string()
    .max(100, 'Location must be less than 100 characters')
    .optional()
    .or(z.literal('')),

  githubUrl: z
    .string()
    .url('GitHub URL must be valid')
    .refine((url) => !url || url.includes('github.com'), 'GitHub URL must be a valid GitHub link')
    .optional()
    .or(z.literal('')),

  twitterUrl: z
    .string()
    .url('Twitter URL must be valid')
    .refine((url) => !url || url.includes('twitter.com') || url.includes('x.com'), 'Twitter URL must be a valid Twitter/X link')
    .optional()
    .or(z.literal('')),

  linkedinUrl: z
    .string()
    .url('LinkedIn URL must be valid')
    .refine((url) => !url || url.includes('linkedin.com'), 'LinkedIn URL must be a valid LinkedIn link')
    .optional()
    .or(z.literal('')),

  avatarUrl: z
    .string()
    .url('Avatar URL must be valid')
    .optional()
    .or(z.literal('')),
})

export const userProfileUpdateSchema = userProfileCreateSchema.partial()

// Comment validation schemas
export const commentCreateSchema = z.object({
  body: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment must be less than 1000 characters')
    .trim(),

  postId: z.string().cuid('Invalid post ID'),
  parentId: z.string().cuid('Invalid parent comment ID').optional(),
})

export const commentUpdateSchema = z.object({
  body: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment must be less than 1000 characters')
    .trim(),

  id: z.string().cuid('Invalid comment ID'),
})

// Tag validation schemas
export const tagCreateSchema = z.object({
  name: z
    .string()
    .min(1, 'Tag name is required')
    .max(50, 'Tag name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Tag name contains invalid characters'),

  slug: z
    .string()
    .min(1, 'Tag slug is required')
    .max(50, 'Tag slug must be less than 50 characters')
    .regex(VALIDATION_PATTERNS.slug, 'Tag slug must contain only lowercase letters, numbers, and hyphens'),

  description: z
    .string()
    .max(200, 'Tag description must be less than 200 characters')
    .optional()
    .or(z.literal('')),

  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color must be a valid hex color')
    .optional()
    .or(z.literal('')),
})

export const tagUpdateSchema = tagCreateSchema.partial().extend({
  id: z.string().cuid('Invalid tag ID'),
})

// Category validation schemas
export const categoryCreateSchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(100, 'Category name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Category name contains invalid characters'),

  slug: z
    .string()
    .min(1, 'Category slug is required')
    .max(100, 'Category slug must be less than 100 characters')
    .regex(VALIDATION_PATTERNS.slug, 'Category slug must contain only lowercase letters, numbers, and hyphens'),

  description: z
    .string()
    .max(500, 'Category description must be less than 500 characters')
    .optional()
    .or(z.literal('')),
})

// Search and pagination schemas
export const searchParamsSchema = z.object({
  q: z.string().max(100, 'Search query too long').optional(),
  page: z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sort: z.enum(['newest', 'oldest', 'popular', 'trending']).default('newest'),
  tag: z.string().max(50).optional(),
  author: z.string().max(50).optional(),
  category: z.string().max(50).optional(),
})

// Analytics schemas
export const analyticsEventSchema = z.object({
  postId: z.string().cuid('Invalid post ID'),
  event: z.enum(['view', 'read', 'like', 'comment', 'share']),
  duration: z.number().int().min(0).max(7200).optional(), // Max 2 hours
  referrer: z.string().max(500).optional(),
  userAgent: z.string().max(500).optional(),
})

// File upload schemas
export const fileUploadSchema = z.object({
  filename: z
    .string()
    .min(1, 'Filename is required')
    .max(255, 'Filename too long'),

  size: z
    .number()
    .int()
    .min(1, 'File size must be greater than 0')
    .max(10 * 1024 * 1024, 'File size cannot exceed 10MB'), // 10MB limit

  type: z
    .string()
    .regex(/^image\/(jpeg|jpg|png|gif|webp|avif)$/, 'Only image files are allowed'),
})

// Pagination helper
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  cursor: z.string().optional(),
})

// Export types
export type PostCreateInput = z.infer<typeof postCreateSchema>
export type PostUpdateInput = z.infer<typeof postUpdateSchema>
export type UserProfileCreateInput = z.infer<typeof userProfileCreateSchema>
export type UserProfileUpdateInput = z.infer<typeof userProfileUpdateSchema>
export type CommentCreateInput = z.infer<typeof commentCreateSchema>
export type CommentUpdateInput = z.infer<typeof commentUpdateSchema>
export type TagCreateInput = z.infer<typeof tagCreateSchema>
export type TagUpdateInput = z.infer<typeof tagUpdateSchema>
export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>
export type SearchParams = z.infer<typeof searchParamsSchema>
export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>
export type FileUpload = z.infer<typeof fileUploadSchema>
export type PaginationParams = z.infer<typeof paginationSchema>

// Validation helpers
export function validatePagination(params: unknown) {
  return paginationSchema.parse(params)
}

export function validateSearchParams(params: unknown) {
  return searchParamsSchema.parse(params)
}

export function validateFileUpload(file: unknown) {
  return fileUploadSchema.parse(file)
}
