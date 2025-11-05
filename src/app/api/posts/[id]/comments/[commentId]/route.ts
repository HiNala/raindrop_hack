import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const user = await requireUser()

    const comment = await prisma.comment.findUnique({
      where: { id: params.commentId },
      include: {
        post: {
          select: {
            authorId: true,
          },
        },
      },
    })

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    // Only comment author or post author can delete
    if (comment.authorId !== user.id && comment.post.authorId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await prisma.comment.delete({
      where: { id: params.commentId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Comment deletion error:', error)
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
  }
}


