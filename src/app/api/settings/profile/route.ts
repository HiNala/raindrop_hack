import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const profileSettingsSchema = z.object({
  bio: z.string().max(500).optional(),
  websiteUrl: z.string().url().or(z.literal('')).optional(),
  githubUrl: z.string().url().or(z.literal('')).optional(),
  twitterUrl: z.string().url().or(z.literal('')).optional(),
  linkedinUrl: z.string().url().or(z.literal('')).optional(),
})

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = profileSettingsSchema.parse(body)

    // Get user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { profile: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update user profile
    const updatedProfile = await prisma.userProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        username: user.profile?.username || user.id,
        displayName: user.profile?.displayName || 'User',
        bio: validatedData.bio || '',
        websiteUrl: validatedData.websiteUrl || '',
        githubUrl: validatedData.githubUrl || '',
        twitterUrl: validatedData.twitterUrl || '',
        linkedinUrl: validatedData.linkedinUrl || '',
      },
      update: {
        bio: validatedData.bio,
        websiteUrl: validatedData.websiteUrl,
        githubUrl: validatedData.githubUrl,
        twitterUrl: validatedData.twitterUrl,
        linkedinUrl: validatedData.linkedinUrl,
      },
    })

    return NextResponse.json(updatedProfile)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 },
      )
    }

    console.error('Error updating profile settings:', error)
    return NextResponse.json({ error: 'Failed to update profile settings' }, { status: 500 })
  }
}
