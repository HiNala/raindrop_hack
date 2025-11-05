import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { handleAPIError, withErrorHandling, validateRequest } from '@/lib/errors'
import { applyRateLimit, RATE_LIMITS } from '@/lib/rate-limit-middleware'
import { requireUser } from '@/lib/auth'
import { sanitizeHtml, sanitizeText } from '@/lib/security-enhanced'
import { logger } from '@/lib/logger'
import slugify from 'slugify'

const createPostSchema = z
  .object({
    title: z.string().min(1).max(200),
    excerpt: z.string().max(500).optional(),
    contentJson: z.object({}).optional(),
    contentHtml: z.string().optional(),
    coverImage: z.string().url().optional(),
    tagIds: z.array(z.string()).optional(),
  })
  .transform((data) => ({
    ...data,
    title: sanitizeText(data.title),
    excerpt: data.excerpt ? sanitizeText(data.excerpt) : undefined,
    contentHtml: data.contentHtml ? sanitizeHtml(data.contentHtml) : undefined,
  }))

export async function GET(request: NextRequest) {
  return withErrorHandling(
    async () => {
      // Apply rate limiting for GET requests
      await applyRateLimit(request, 'SEARCH')

      const { searchParams } = new URL(request.url)
      const page = parseInt(searchParams.get('page') || '1')
      const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50) // Cap at 50
      const slug = searchParams.get('slug')
      const tag = searchParams.get('tag')
      const search = searchParams.get('search')
      const authorId = searchParams.get('authorId')

      // If specific slug requested
      if (slug) {
        const post = await prisma.post.findUnique({
          where: {
            slug,
            published: true,
          },
          include: {
            author: {
              include: {
                profile: {
                  select: {
                    username: true,
                    displayName: true,
                    avatarUrl: true,
                  },
                },
              },
            },
            tags: {
              include: {
                tag: {
                  select: { name: true, slug: true, color: true },
                },
              },
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
        })

        if (!post) {
          throw new Error('Post not found')
        }

        // Increment view count asynchronously
        prisma.post
          .update({
            where: { id: post.id },
            data: { viewCount: { increment: 1 } },
          })
          .catch((error) => {
            logger.dbError('incrementViewCount', error, { postId: post.id })
          })

        return post
      }

      // Build where clause with optimizations
      const where: {
        published: boolean
        tags?: {
          some: {
            tag: {
              slug: string
            }
          }
        }
        author?: {
          clerkId: string
        }
      } = { published: true }

      if (tag) {
        where.tags = {
          some: {
            tag: { slug: tag },
          },
        }
      }

      if (authorId) {
        where.authorId = authorId
      }

      if (search) {
        const sanitizedSearch = sanitizeText(search)
        if (sanitizedSearch) {
          where.OR = [
            { title: { contains: sanitizedSearch, mode: 'insensitive' } },
            { excerpt: { contains: sanitizedSearch, mode: 'insensitive' } },
          ]
        }
      }

      // Optimized query with proper pagination
      const [posts, total] = await Promise.all([
        prisma.post.findMany({
          where,
          include: {
            author: {
              include: {
                profile: {
                  select: {
                    username: true,
                    displayName: true,
                    avatarUrl: true,
                  },
                },
              },
            },
            tags: {
              include: {
                tag: {
                  select: { name: true, slug: true, color: true },
                },
              },
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
          orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
          skip: (page - 1) * limit,
          take: limit,
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            coverImage: true,
            publishedAt: true,
            featured: true,
            readTimeMin: true,
            author: {
              include: {
                profile: {
                  select: {
                    username: true,
                    displayName: true,
                    avatarUrl: true,
                  },
                },
              },
            },
            tags: {
              include: {
                tag: {
                  select: { name: true, slug: true, color: true },
                },
              },
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
        }),
        prisma.post.count({ where }),
      ])

      return {
        posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      }
    },
    { route: '/api/posts' }
  )
}

export async function POST(request: NextRequest) {
  return withErrorHandling(
    async () => {
      // Apply rate limiting for post creation
      const user = await requireUser()
      await applyRateLimit(request, 'POST_CREATION', { userId: user.id })

      const body = await request.json()
      const validatedData = validateRequest(createPostSchema, body)

      // Generate unique slug
      const baseSlug = slugify(sanitizeText(validatedData.title), {
        lower: true,
        strict: true,
      })

      let slug = baseSlug
      let counter = 1
      while (await prisma.post.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`
        counter++
      }

      // Calculate reading time if content provided
      let readTimeMin = 5 // default
      if (validatedData.contentHtml) {
        const wordCount = validatedData.contentHtml.split(/\s+/).length
        readTimeMin = Math.max(1, Math.ceil(wordCount / 200))
      }

      // Create post with proper error handling
      const post = await prisma.post.create({
        data: {
          title: validatedData.title,
          slug,
          excerpt: validatedData.excerpt,
          contentJson: validatedData.contentJson || {},
          contentHtml: validatedData.contentHtml,
          coverImage: validatedData.coverImage,
          authorId: user.id,
          published: false, // Start as draft
          readTimeMin,
          tags:
            validatedData.tagIds && validatedData.tagIds.length > 0
              ? {
                  create: validatedData.tagIds.map((tagId) => ({
                    tagId,
                  })),
                }
              : undefined,
        },
        include: {
          author: {
            include: {
              profile: {
                select: {
                  username: true,
                  displayName: true,
                  avatarUrl: true,
                },
              },
            },
          },
          tags: {
            include: {
              tag: {
                select: { name: true, slug: true, color: true },
              },
            },
          },
        },
      })

      logger.info('Post created', {
        postId: post.id,
        slug: post.slug,
        userId: user.id,
      })

      return {
        success: true,
        data: post,
      }
    },
    { route: '/api/posts', userId: (await requireUser()).id }
  )
}
