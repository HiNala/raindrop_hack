import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireUser()

    const existing = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId: params.id,
        },
      },
    })

    if (existing) {
      // Unlike
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId: user.id,
            postId: params.id,
          },
        },
      })
    } else {
      // Like
      await prisma.like.create({
        data: {
          userId: user.id,
          postId: params.id,
        },
      })
    }

    const likes = await prisma.like.count({
      where: { postId: params.id },
    })

    return NextResponse.json({ likes, isLiked: !existing })
  } catch (error) {
    console.error('Like error:', error)
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 })
  }
}


