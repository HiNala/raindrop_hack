import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ isLiked: false })
    }

    const like = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: params.id,
        },
      },
    })

    return NextResponse.json({
      success: true,
      isLiked: !!like,
    })
  } catch (error) {
    console.error('Like check error:', error)
    return NextResponse.json({ isLiked: false })
  }
}
