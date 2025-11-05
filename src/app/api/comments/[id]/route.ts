import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface Params {
  params: { id: string }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const body = await request.json()
    const { approved } = body

    if (typeof approved !== 'boolean') {
      return NextResponse.json(
        { error: 'approved must be a boolean' },
        { status: 400 },
      )
    }

    const comment = await prisma.comment.update({
      where: { id: params.id },
      data: { approved },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    await prisma.comment.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Comment deleted successfully' })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 },
    )
  }
}
