import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/auth'
import { logger } from '@/lib/errors'
import { withErrorHandling } from '@/lib/errors'

interface Params {
  params: { id: string }
}

// Validate comment ID format
function validateCommentId(id: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(id) && id.length > 0 && id.length <= 50
}

export async function PUT(request: NextRequest, { params }: Params) {
  return withErrorHandling(async () => {
    // Validate comment ID
    if (!validateCommentId(params.id)) {
      return NextResponse.json({ error: 'Invalid comment ID' }, { status: 400 })
    }

    // Authenticate user
    const user = await requireUser()
    
    // Check if user has admin/moderator role
    if (user.role !== 'ADMIN') {
      logger.security('Unauthorized comment moderation attempt', {
        userId: user.id,
        commentId: params.id,
        action: 'moderate'
      })
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { approved } = body

    if (typeof approved !== 'boolean') {
      return NextResponse.json({ error: 'approved must be a boolean' }, { status: 400 })
    }

    // Check if comment exists
    const existingComment = await prisma.comment.findUnique({
      where: { id: params.id },
      select: { id: true, approved: true }
    })

    if (!existingComment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
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

    logger.info('Comment moderation', {
      commentId: params.id,
      approved,
      moderatorId: user.id
    })

    return NextResponse.json(comment)
  }, { route: '/api/comments/[id]', method: 'PUT' })
}

export async function DELETE(request: NextRequest, { params }: Params) {
  return withErrorHandling(async () => {
    // Validate comment ID
    if (!validateCommentId(params.id)) {
      return NextResponse.json({ error: 'Invalid comment ID' }, { status: 400 })
    }

    // Authenticate user
    const user = await requireUser()
    
    // Check if user owns the comment or is admin
    const comment = await prisma.comment.findUnique({
      where: { id: params.id },
      select: { userId: true, postId: true }
    })

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    // Allow deletion if user owns the comment or is admin
    if (comment.userId !== user.id && user.role !== 'ADMIN') {
      logger.security('Unauthorized comment deletion attempt', {
        userId: user.id,
        commentId: params.id,
        action: 'delete'
      })
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.comment.delete({
      where: { id: params.id },
    })

    logger.info('Comment deleted', {
      commentId: params.id,
      deleterId: user.id,
      wasOwner: comment.userId === user.id
    })

    return NextResponse.json({ message: 'Comment deleted successfully' })
  }, { route: '/api/comments/[id]', method: 'DELETE' })
}
