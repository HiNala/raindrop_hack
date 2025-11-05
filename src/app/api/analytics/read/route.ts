import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { postId } = await request.json()

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
    }

    // Get today's date at midnight
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Update or create analytics record
    await prisma.analyticsDaily.upsert({
      where: {
        postId_date: {
          postId,
          date: today,
        },
      },
      create: {
        postId,
        date: today,
        reads: 1,
      },
      update: {
        reads: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking read:', error)
    return NextResponse.json({ error: 'Failed to track read' }, { status: 500 })
  }
}
