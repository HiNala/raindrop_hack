import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: params.id },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ comments })
  } catch (error) {
    console.error('Comments fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await requireUser()
    const { body } = await request.json()

    if (!body || !body.trim()) {
      return NextResponse.json({ error: 'Comment body is required' }, { status: 400 })
    }

    const comment = await prisma.comment.create({
      data: {
        postId: params.id,
        authorId: user.id,
        body: body.trim(),
      },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
      },
    })

    return NextResponse.json({ comment })
  } catch (error) {
    console.error('Comment creation error:', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}


