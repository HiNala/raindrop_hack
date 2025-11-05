import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

interface Params {
  params: { id: string }
}

const updatePostSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  excerpt: z.string().max(500).optional(),
  contentJson: z.object().optional(),
  contentHtml: z.string().optional(),
  coverImage: z.string().url().optional(),
  published: z.boolean().optional(),
  tagIds: z.array(z.string()).optional(),
})

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
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
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updatePostSchema.parse(body)

    // Check if user owns the post
    const existingPost = await prisma.post.findUnique({
      where: { id: params.id },
      include: { author: true },
    })

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (existingPost.author.clerkId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Handle tag updates
    const updateData: any = { ...validatedData }

    if (validatedData.tagIds !== undefined) {
      // Delete existing tag relationships
      await prisma.postTag.deleteMany({
        where: { postId: params.id },
      })

      updateData.tags = {
        create: validatedData.tagIds.map((tagId, _index) => ({
          tagId,
          postId: params.id,
        })),
      }
    }

    // Update publishedAt if publishing
    if (validatedData.published && !existingPost.publishedAt) {
      updateData.publishedAt = new Date()
    }

    const post = await prisma.post.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json(post)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 },
      )
    }

    console.error('Error updating post:', error)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user owns the post
    const existingPost = await prisma.post.findUnique({
      where: { id: params.id },
      include: { author: true },
    })

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (existingPost.author.clerkId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete related records first
    await prisma.postTag.deleteMany({
      where: { postId: params.id },
    })

    await prisma.comment.deleteMany({
      where: { postId: params.id },
    })

    await prisma.like.deleteMany({
      where: { postId: params.id },
    })

    await prisma.post.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
