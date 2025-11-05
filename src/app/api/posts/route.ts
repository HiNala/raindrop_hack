import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  excerpt: z.string().max(500).optional(),
  contentJson: z.object({}).optional(),
  contentHtml: z.string().optional(),
  coverImage: z.string().url().optional(),
  tagIds: z.array(z.string()).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
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
              profile: true,
            },
          },
          tags: {
            include: {
              tag: true,
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

      // Increment view count
      await prisma.post.update({
        where: { id: post.id },
        data: { viewCount: { increment: 1 } },
      })

      return NextResponse.json(post)
    }

    // Build where clause
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
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ]
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          include: {
            profile: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: [{ publishedAt: 'desc' }, { featured: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
    })

    const total = await prisma.post.count({ where })

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Posts API error:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createPostSchema.parse(body)

    // Get user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { profile: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Generate unique slug
    const baseSlug = validatedData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    let slug = baseSlug
    let counter = 1
    while (await prisma.post.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Create post
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
        readTimeMin: validatedData.contentHtml
          ? Math.ceil(validatedData.contentHtml.split(' ').length / 200)
          : 5,
        tags: validatedData.tagIds
          ? {
              create: validatedData.tagIds.map((tagId, _index) => ({
                tagId,
                postId: post.id, // This will be set after post creation
              })),
            }
          : undefined,
      },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: post,
    })
  } catch (error) {
    console.error('Post creation error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
