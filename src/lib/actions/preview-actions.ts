'use server'

import { jwtVerify } from 'jose'
import { prisma } from '@/lib/prisma'

const PREVIEW_SECRET = process.env.PREVIEW_SECRET || 'your-preview-secret'
const JWT_SECRET = new TextEncoder().encode(PREVIEW_SECRET)

export async function getPostByPreviewToken(token: string) {
  try {
    // Verify token
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const { postId } = payload as { postId: string }

    if (!postId) {
      return null
    }

    // Get post with all necessary data
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
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    })

    return post
  } catch (error) {
    console.error('Error verifying preview token:', error)
    return null
  }
}
