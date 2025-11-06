import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { handleAPIError, withErrorHandling, validateRequest } from '@/lib/errors'
import { applyRateLimit, RATE_LIMITS } from '@/lib/rate-limit-middleware'
import { requireUser } from '@/lib/auth'
import { sanitizeHtml, sanitizeText, sanitizeUrl, VALIDATION_PATTERNS } from '@/lib/security-enhanced'
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
    coverImage: data.coverImage && sanitizeUrl(data.coverImage) ? data.coverImage : undefined,
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

      // Validate and sanitize inputs
      if (page < 1 || limit < 1) {
        return NextResponse.json({ error: 'Invalid pagination parameters' }, { status: 400 })
      }

      if (slug && (!VALIDATION_PATTERNS.slug.test(slug) || slug.length > 100)) {
        return NextResponse.json({ error: 'Invalid slug parameter' }, { status: 400 })
      }

      if (tag && (!VALIDATION_PATTERNS.tagSlug.test(tag) || tag.length > 50)) {
        return NextResponse.json({ error: 'Invalid tag parameter' }, { status: 400 })
      }

      if (authorId && (!VALIDATION_PATTERNS.postId.test(authorId) || authorId.length > 50)) {
        return NextResponse.json({ error: 'Invalid author parameter' }, { status: 400 })
      }

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
          return NextResponse.json({ error: 'Post not found' }, { status: 404 })
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

      // Build where clause with enhanced security
      const where: any = { published: true }

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
        // Enhanced search validation
        if (sanitizedSearch && sanitizedSearch.length <= 100 && /^[a-zA-Z0-9\s\-_.,!?]+$/.test(sanitizedSearch)) {
          where.OR = [
            { title: { contains: sanitizedSearch, mode: 'insensitive' } },
            { excerpt: { contains: sanitizedSearch, mode: 'insensitive' } },
          ]
        } else {
          // Return empty result for invalid search
          return {
            posts: [],
            pagination: {
              page,
              limit,
              total: 0,
              pages: 0,
            },
          }
        }
      }

      // Optimized query with proper field selection
      const [posts, total] = await Promise.all([
        prisma.post.findMany({
          where,
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            coverImage: true,
            publishedAt: true,
            featured: true,
            readTimeMin: true,
            viewCount: true,
            author: {
              select: {
                id: true,
                clerkId: true,
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
              select: {
                id: true,
                tag: {
                  select: { 
                    id: true,
                    name: true, 
                    slug: true, 
                    color: true 
                  },
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
        }),
        prisma.post.count({ where }),
      ])

      // Sanitize post data before returning
      const sanitizedPosts = posts.map(post => ({
        ...post,
        title: sanitizeText(post.title),
        excerpt: post.excerpt ? sanitizeText(post.excerpt) : undefined,
        coverImage: post.coverImage && sanitizeUrl(post.coverImage) ? post.coverImage : null,
      }))

      return {
        posts: sanitizedPosts,
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

      // Additional validation
      if (validatedData.contentHtml && validatedData.contentHtml.length > 50000) {
        return NextResponse.json({ error: 'Content too long (max 50,000 characters)' }, { status: 400 })
      }

      // Generate unique slug with collision handling
      const baseSlug = slugify(sanitizeText(validatedData.title), {
        lower: true,
        strict: true,
        remove: /[^\w\s-]/g, // Remove non-word chars except space and hyphen
      }).substring(0, 100) // Limit length

      let slug = baseSlug
      let counter = 1
      const maxAttempts = 100

      while (await prisma.post.findUnique({ where: { slug } }) && counter <= maxAttempts) {
        slug = `${baseSlug}-${counter}`
        counter++
      }

      if (counter > maxAttempts) {
        logger.error('Unable to generate unique slug', { baseSlug, attempts: maxAttempts })
        return NextResponse.json({ error: 'Unable to generate unique slug' }, { status: 500 })
      }

      // Calculate reading time if content provided
      let readTimeMin = 5 // default
      if (validatedData.contentHtml) {
        const textContent = sanitizeText(validatedData.contentHtml.replace(/<[^>]*>/g, ''))
        const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length
        readTimeMin = Math.max(1, Math.min(99, Math.ceil(wordCount / 200)))
      }

      // Validate tag IDs
      if (validatedData.tagIds && validatedData.tagIds.length > 0) {
        const validTagIds = await prisma.tag.findMany({
          where: { id: { in: validatedData.tagIds } },
          select: { id: true }
        })
        
        if (validTagIds.length !== validatedData.tagIds.length) {
          return NextResponse.json({ error: 'One or more invalid tag IDs' }, { status: 400 })
        }
      }

      // Create post with transaction for data consistency
      const post = await prisma.$transaction(async (tx) => {
        const newPost = await tx.post.create({
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
          },
        })

        // Create tag relationships if provided
        if (validatedData.tagIds && validatedData.tagIds.length > 0) {
          await tx.postTag.createMany({
            data: validatedData.tagIds.map((tagId) => ({
              postId: newPost.id,
              tagId,
            })),
          })
        }

        return newPost
      })

      // Fetch complete post data
      const completePost = await prisma.post.findUnique({
        where: { id: post.id },
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

      if (!completePost) {
        throw new Error('Post created but not found')
      }

      logger.info('Post created successfully', {
        postId: completePost.id,
        slug: completePost.slug,
        userId: user.id,
        hasTags: validatedData.tagIds?.length > 0,
      })

      return {
        success: true,
        data: completePost,
      }
    },
    { route: '/api/posts', userId: (await requireUser()).id }
  )
}
