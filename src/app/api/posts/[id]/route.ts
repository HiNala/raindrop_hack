import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { postSchema } from '@/lib/validations'
import slugify from 'slugify'
import { z } from 'zod'

interface Params {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            bio: true,
          }
        },
        category: true,
        tags: {
          include: {
            tag: true
          }
        },
        comments: {
          where: { approved: true },
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true
          }
        }
      }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const body = await request.json()
    
    // Generate slug if title changed and slug not provided
    if (body.title && !body.slug) {
      body.slug = slugify(body.title, { lower: true, strict: true })
    }

    const validatedData = postSchema.partial().parse(body)

    // Check if slug is unique (if changing)
    if (validatedData.slug) {
      const existingPost = await prisma.post.findFirst({
        where: {
          slug: validatedData.slug,
          NOT: { id: params.id }
        }
      })

      if (existingPost) {
        return NextResponse.json(
          { error: 'A post with this slug already exists' },
          { status: 400 }
        )
      }
    }

    // Handle tag updates
    let tagOperations
    if (validatedData.tagIds !== undefined) {
      // Delete existing tag relationships
      await prisma.postTag.deleteMany({
        where: { postId: params.id }
      })

      // Create new tag relationships
      tagOperations = {
        create: validatedData.tagIds.map(tagId => ({
          tagId
        }))
      }
    }

    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        tagOperations
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    return NextResponse.json(post)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    await prisma.post.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}