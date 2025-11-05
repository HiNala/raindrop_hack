import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createCommentSchema = z.object({
  body: z.string().min(1).max(2000),
  postId: z.string(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const postId = searchParams.get('postId')

    const skip = (page - 1) * limit

    const where: any = {}

    if (postId) {
      where.postId = postId
    }

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          post: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
          author: {
            include: {
              profile: true,
            },
          },
        },
      }),
      prisma.comment.count({ where }),
    ])

    return NextResponse.json({
      comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createCommentSchema.parse(body)

    // Get user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { profile: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify post exists
    const post = await prisma.post.findUnique({
      where: { id: validatedData.postId },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Check if user has already commented on this post
    const existingComment = await prisma.comment.findFirst({
      where: {
        postId: validatedData.postId,
        authorId: user.id,
      },
    })

    if (existingComment) {
      return NextResponse.json(
        { error: 'You have already commented on this post' },
        { status: 400 },
      )
    }

    const comment = await prisma.comment.create({
      data: {
        body: validatedData.body,
        postId: validatedData.postId,
        authorId: user.id,
      },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        author: {
          include: {
            profile: true,
          },
        },
      },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 },
      )
    }

    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}
