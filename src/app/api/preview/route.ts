import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify, SignJWT } from 'jose'
import { prisma } from '@/lib/prisma'

const PREVIEW_SECRET = process.env.PREVIEW_SECRET || 'your-preview-secret'
const JWT_SECRET = new TextEncoder().encode(PREVIEW_SECRET)

export async function POST(request: NextRequest) {
  try {
    const { postId } = await request.json()

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
    }

    // Create signed token that expires in 24 hours
    const token = await new SignJWT({ postId })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .setIssuedAt()
      .sign(JWT_SECRET)

    const previewUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/preview/${token}`

    return NextResponse.json({ previewUrl, token })
  } catch (error) {
    console.error('Error creating preview link:', error)
    return NextResponse.json({ error: 'Failed to create preview link' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    // Verify token
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const { postId } = payload as { postId: string }

    if (!postId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
    }

    // Get post
    const post = await prisma.post.findUnique({
      where: { id: postId },
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
      },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error verifying preview token:', error)
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
  }
}
