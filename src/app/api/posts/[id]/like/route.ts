import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const existing = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: params.id,
        },
      },
    })

    if (existing) {
      // Unlike
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId: userId,
            postId: params.id,
          },
        },
      })
    } else {
      // Like
      await prisma.like.create({
        data: {
          userId: userId,
          postId: params.id,
        },
      })
    }

    const likes = await prisma.like.count({
      where: { postId: params.id }
    })

    const isLiked = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: params.id,
        },
      },
    })

    return NextResponse.json({ 
      success: true,
      likes,
      isLiked: !!isLiked
    })
  } catch (error) {
    console.error('Like error:', error)
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 })
  }
}