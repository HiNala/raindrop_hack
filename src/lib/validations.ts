import { z } from 'zod'

export const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  slug: z.string().min(1, 'Slug is required').max(200, 'Slug must be less than 200 characters'),
  excerpt: z.string().max(500, 'Excerpt must be less than 500 characters').optional(),
  content: z.string().min(1, 'Content is required'),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  categoryId: z.string().min(1, 'Category is required'),
  authorId: z.string().min(1, 'Author is required'),
  tagIds: z.array(z.string()).optional(),
})

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
})

export const tagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  slug: z.string().min(1, 'Slug is required').max(50, 'Slug must be less than 50 characters'),
})

export const commentSchema = z.object({
  content: z.string().min(1, 'Comment is required').max(1000, 'Comment must be less than 1000 characters'),
  author: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Valid email is required'),
  postId: z.string().min(1, 'Post is required'),
})

export const userSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'AUTHOR']).default('AUTHOR'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = userSchema.pick({
  name: true,
  email: true,
  password: true,
})

export type PostInput = z.infer<typeof postSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type TagInput = z.infer<typeof tagSchema>
export type CommentInput = z.infer<typeof commentSchema>
export type UserInput = z.infer<typeof userSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
