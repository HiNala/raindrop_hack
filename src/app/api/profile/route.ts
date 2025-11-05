import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(50),
  bio: z.string().max(500).optional(),
  websiteUrl: z.string().url().optional(),
  avatarUrl: z.string().url().optional(),
  location: z.string().max(100).optional(),
})

export async function GET(_request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { profile: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ profile: user.profile })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PATCH(_request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { profile: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = updateProfileSchema.parse(body)

    // Create profile if it doesn't exist
    if (!user.profile) {
      const profile = await prisma.profile.create({
        data: {
          userId: user.id,
          username: user.email.split('@')[0], // Generate username from email
          displayName:
            validatedData.displayName ||
            user.firstName ||
            user.emailAddresses[0]?.emailAddress?.split('@')[0] ||
            'User',
          bio: validatedData.bio || null,
          websiteUrl: validatedData.websiteUrl || null,
          avatarUrl: validatedData.avatarUrl || null,
          location: validatedData.location || null,
        },
      })

      return NextResponse.json({ profile })
    } else {
      const profile = await prisma.profile.update({
        where: { userId: user.id },
        data: validatedData,
      })

      return NextResponse.json({ profile })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
