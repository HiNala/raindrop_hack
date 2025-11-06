import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { withErrorHandling } from '@/lib/errors'
import { sanitizeText, sanitizeUrl, sanitizeHtml, VALIDATION_PATTERNS } from '@/lib/security-enhanced'
import { logger } from '@/lib/logger'

interface Params {
  params: { id: string }
}

// Validate post ID format
function validatePostId(id: string): boolean {
  return VALIDATION_PATTERNS.postId.test(id) && id.length > 0 && id.length <= 50
}

const updatePostSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less')
    .transform(sanitizeText)
    .optional(),
  excerpt: z.string()
    .max(500, 'Excerpt must be 500 characters or less')
    .transform(val => val ? sanitizeText(val) : undefined)
    .optional(),
  contentJson: z.object().optional(),
  contentHtml: z.string()
    .max(50000, 'Content too long')
    .transform(val => val ? sanitizeHtml(val) : undefined)
    .optional(),
  coverImage: z.string()
    .url()
    .refine(url => sanitizeUrl(url) !== null, 'Invalid image URL')
    .optional(),
  published: z.boolean().optional(),
  tagIds: z.array(z.string()).optional(),
})

export async function GET(request: NextRequest, { params }: Params) {
  return withErrorHandling(
    async () => {
      // Validate post ID
      if (!validatePostId(params.id)) {
        return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 })
      }

      const post = await prisma.post.findUnique({
        where: { id: params.id },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          contentHtml: true,
          contentJson: true,
          coverImage: true,
          published: true,
          publishedAt: true,
          featured: true,
          readTimeMin: true,
          viewCount: true,
          createdAt: true,
          updatedAt: true,
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
                  color: true,
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
      })

      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      }

      // Increment view count asynchronously (only for published posts)
      if (post.published) {
        prisma.post
          .update({
            where: { id: post.id },
            data: { viewCount: { increment: 1 } },
          })
          .catch((error) => {
            logger.dbError('incrementViewCount', error, { postId: post.id })
          })
      }

      // Sanitize post data before returning
      const sanitizedPost = {
        ...post,
        title: sanitizeText(post.title),
        excerpt: post.excerpt ? sanitizeText(post.excerpt) : null,
        coverImage: post.coverImage && sanitizeUrl(post.coverImage),
        author: {
          ...post.author,
          profile: post.author.profile ? {
            ...post.author.profile,
            displayName: sanitizeText(post.author.profile.displayName),
            avatarUrl: post.author.profile.avatarUrl && sanitizeUrl(post.author.profile.avatarUrl),
          } : null,
        },
      }

      return NextResponse.json(sanitizedPost)
    },
    { route: '/api/posts/[id]', method: 'GET' }
  )
}

export async function PUT(request: NextRequest, { params }: Params) {
  return withErrorHandling(
    async () => {
      // Validate post ID
      if (!validatePostId(params.id)) {
        return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 })
      }

      const { userId } = await auth()
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const body = await request.json()
      const validatedData = updatePostSchema.parse(body)

      // Check if user owns the post
      const existingPost = await prisma.post.findUnique({
        where: { id: params.id },
        select: {
          id: true,
          title: true,
          published: true,
          publishedAt: true,
          author: {
            select: {
              id: true,
              clerkId: true,
            },
          },
        },
      })

      if (!existingPost) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      }

      if (existingPost.author.clerkId !== userId) {
        logger.security('Unauthorized post update attempt', {
          userId,
          postId: params.id,
          postAuthorId: existingPost.author.clerkId,
        })
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      // Validate tag IDs if provided
      if (validatedData.tagIds) {
        const validTagIds = await prisma.tag.findMany({
          where: { id: { in: validatedData.tagIds } },
          select: { id: true }
        })
        
        if (validTagIds.length !== validatedData.tagIds.length) {
          return NextResponse.json({ error: 'One or more invalid tag IDs' }, { status: 400 })
        }
      }

      // Use transaction for data consistency
      const post = await prisma.$transaction(async (tx) => {
        // Handle tag updates if provided
        if (validatedData.tagIds !== undefined) {
          // Delete existing tag relationships
          await tx.postTag.deleteMany({
            where: { postId: params.id },
          })

          // Create new tag relationships
          if (validatedData.tagIds.length > 0) {
            await tx.postTag.createMany({
              data: validatedData.tagIds.map((tagId) => ({
                postId: params.id,
                tagId,
              })),
            })
          }
        }

        // Prepare update data
        const updateData: any = {
          ...(validatedData.title && { title: validatedData.title }),
          ...(validatedData.excerpt !== undefined && { excerpt: validatedData.excerpt }),
          ...(validatedData.contentJson && { contentJson: validatedData.contentJson }),
          ...(validatedData.contentHtml !== undefined && { contentHtml: validatedData.contentHtml }),
          ...(validatedData.coverImage !== undefined && { coverImage: validatedData.coverImage }),
          ...(validatedData.published !== undefined && { published: validatedData.published }),
        }

        // Update publishedAt if publishing for the first time
        if (validatedData.published && !existingPost.publishedAt) {
          updateData.publishedAt = new Date()
        }

        // Update post
        return await tx.post.update({
          where: { id: params.id },
          data: updateData,
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            contentHtml: true,
            contentJson: true,
            coverImage: true,
            published: true,
            publishedAt: true,
            featured: true,
            readTimeMin: true,
            createdAt: true,
            updatedAt: true,
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
                    color: true,
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
        })
      })

      logger.info('Post updated successfully', {
        postId: post.id,
        userId,
        published: post.published,
        fields: Object.keys(validatedData),
      })

      return NextResponse.json(post)
    },
    { route: '/api/posts/[id]', method: 'PUT' }
  )
}

export async function DELETE(request: NextRequest, { params }: Params) {
  return withErrorHandling(
    async () => {
      // Validate post ID
      if (!validatePostId(params.id)) {
        return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 })
      }

      const { userId } = await auth()
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      // Check if user owns the post
      const existingPost = await prisma.post.findUnique({
        where: { id: params.id },
        select: {
          id: true,
          title: true,
          author: {
            select: {
              id: true,
              clerkId: true,
            },
          },
        },
      })

      if (!existingPost) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      }

      if (existingPost.author.clerkId !== userId) {
        logger.security('Unauthorized post deletion attempt', {
          userId,
          postId: params.id,
          postAuthorId: existingPost.author.clerkId,
        })
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      // Use transaction for cascading deletes
      await prisma.$transaction(async (tx) => {
        // Delete related records first (should cascade but being explicit)
        await tx.postTag.deleteMany({
          where: { postId: params.id },
        })

        await tx.comment.deleteMany({
          where: { postId: params.id },
        })

        await tx.like.deleteMany({
          where: { postId: params.id },
        })

        // Delete the post
        await tx.post.delete({
          where: { id: params.id },
        })
      })

      logger.info('Post deleted successfully', {
        postId: params.id,
        userId,
        postTitle: existingPost.title,
      })

      return NextResponse.json({ message: 'Post deleted successfully' })
    },
    { route: '/api/posts/[id]', method: 'DELETE' }
  )
}
