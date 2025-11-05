import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: Request) {
  try {
    const user = await requireUser()
    const { displayName, bio, websiteUrl, avatarUrl } = await request.json()

    if (!displayName || !displayName.trim()) {
      return NextResponse.json({ error: 'Display name is required' }, { status: 400 })
    }

    const updated = await prisma.profile.update({
      where: { userId: user.id },
      data: {
        displayName: displayName.trim(),
        bio: bio?.trim() || null,
        websiteUrl: websiteUrl?.trim() || null,
        avatarUrl: avatarUrl || null,
      },
    })

    return NextResponse.json({ profile: updated })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}


