import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  newFollowers: z.boolean(),
  newComments: z.boolean(),
  newLikes: z.boolean(),
  weeklyDigest: z.boolean(),
  productUpdates: z.boolean(),
})

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = notificationSettingsSchema.parse(body)

    // Get user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Store notification settings in the settings table
    const settings = await prisma.setting.upsert({
      where: { key: `notifications:${user.id}` },
      create: {
        key: `notifications:${user.id}`,
        value: validatedData,
        description: 'User notification preferences',
      },
      update: {
        value: validatedData,
      },
    })

    return NextResponse.json({ success: true, settings })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating notification settings:', error)
    return NextResponse.json({ error: 'Failed to update notification settings' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get notification settings
    const settings = await prisma.setting.findUnique({
      where: { key: `notifications:${user.id}` },
    })

    // Return default settings if none exist
    const defaultSettings = {
      emailNotifications: true,
      newFollowers: true,
      newComments: true,
      newLikes: false,
      weeklyDigest: true,
      productUpdates: false,
    }

    return NextResponse.json(settings?.value as any || defaultSettings)
  } catch (error) {
    console.error('Error fetching notification settings:', error)
    return NextResponse.json({ error: 'Failed to fetch notification settings' }, { status: 500 })
  }
}