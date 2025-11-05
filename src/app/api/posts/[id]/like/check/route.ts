import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireUser()

    const like = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId: params.id,
        },
      },
    })

    return NextResponse.json({ isLiked: !!like })
  } catch (error) {
    return NextResponse.json({ isLiked: false })
  }
}


