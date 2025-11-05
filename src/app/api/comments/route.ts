import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { commentSchema } from '@/lib/validations'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const postId = searchParams.get('postId')
    const approved = searchParams.get('approved')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    const where: any = {}

    if (postId) {
      where.postId = postId
    }

    if (approved !== null) {
      where.approved = approved === 'true'
    }

    if (search) {
      where.OR = [
        { content: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
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
              slug: true
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        }
      }),
      prisma.comment.count({ where })
    ])

    return NextResponse.json({
      comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = commentSchema.parse(body)

    // Verify post exists
    const post = await prisma.post.findUnique({
      where: { id: validatedData.postId }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    const comment = await prisma.comment.create({
      data: {
        content: validatedData.content,
        author: validatedData.author,
        email: validatedData.email,
        postId: validatedData.postId,
        approved: false // Comments need approval by default
      },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      }
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}