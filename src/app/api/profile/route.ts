import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { withErrorHandling } from '@/lib/errors'
import { sanitizeText, sanitizeUrl, isValidUsername } from '@/lib/security-enhanced'
import { logger } from '@/lib/logger'

// Secure URL validation schema
const secureUrlSchema = z.string().url().refine((url) => {
  return sanitizeUrl(url) !== null
}, 'Invalid URL format. Only HTTP/HTTPS URLs are allowed.')

const updateProfileSchema = z.object({
  displayName: z.string()
    .min(1, 'Display name is required')
    .max(50, 'Display name must be 50 characters or less')
    .transform(sanitizeText),
  bio: z.string()
    .max(500, 'Bio must be 500 characters or less')
    .transform(val => val ? sanitizeText(val) : null)
    .optional()
    .nullable(),
  websiteUrl: secureUrlSchema
    .optional()
    .nullable(),
  avatarUrl: secureUrlSchema
    .optional()
    .nullable(),
  location: z.string()
    .max(100, 'Location must be 100 characters or less')
    .transform(sanitizeText)
    .optional()
    .nullable(),
  githubUrl: secureUrlSchema
    .optional()
    .nullable(),
  twitterUrl: secureUrlSchema
    .optional()
    .nullable(),
  linkedinUrl: secureUrlSchema
    .optional()
    .nullable(),
})

export async function GET(request: NextRequest) {
  return withErrorHandling(
    async () => {
      const { userId } = await auth()
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
        include: { 
          profile: {
            select: {
              id: true,
              username: true,
              displayName: true,
              bio: true,
              websiteUrl: true,
              avatarUrl: true,
              location: true,
              githubUrl: true,
              twitterUrl: true,
              linkedinUrl: true,
              createdAt: true,
              updatedAt: true,
            }
          }
        },
      })

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      // Sanitize profile data before returning
      const sanitizedProfile = user.profile ? {
        ...user.profile,
        bio: user.profile.bio || null,
        websiteUrl: user.profile.websiteUrl && sanitizeUrl(user.profile.websiteUrl),
        avatarUrl: user.profile.avatarUrl && sanitizeUrl(user.profile.avatarUrl),
        location: user.profile.location || null,
        githubUrl: user.profile.githubUrl && sanitizeUrl(user.profile.githubUrl),
        twitterUrl: user.profile.twitterUrl && sanitizeUrl(user.profile.twitterUrl),
        linkedinUrl: user.profile.linkedinUrl && sanitizeUrl(user.profile.linkedinUrl),
      } : null

      return NextResponse.json({ profile: sanitizedProfile })
    },
    { route: '/api/profile', method: 'GET' }
  )
}

export async function PATCH(request: NextRequest) {
  return withErrorHandling(
    async () => {
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
      
      // Validate request body
      const validatedData = updateProfileSchema.parse(body)

      // Additional validation
      if (validatedData.websiteUrl) {
        const sanitized = sanitizeUrl(validatedData.websiteUrl)
        if (!sanitized) {
          return NextResponse.json({ error: 'Invalid website URL' }, { status: 400 })
        }
      }

      if (validatedData.avatarUrl) {
        const sanitized = sanitizeUrl(validatedData.avatarUrl)
        if (!sanitized) {
          return NextResponse.json({ error: 'Invalid avatar URL' }, { status: 400 })
        }
      }

      // Check for duplicate username if updating username
      if (validatedData.username && validatedData.username !== user.profile?.username) {
        if (!isValidUsername(validatedData.username)) {
          return NextResponse.json({ error: 'Invalid username format' }, { status: 400 })
        }

        const existingUsername = await prisma.profile.findUnique({
          where: { username: validatedData.username },
        })

        if (existingUsername) {
          return NextResponse.json({ error: 'Username already taken' }, { status: 409 })
        }
      }

      // Create profile if it doesn't exist
      if (!user.profile) {
        // Generate unique username from user data
        const baseUsername = sanitizeText(
          user.firstName ||
          user.emailAddresses[0]?.emailAddress?.split('@')[0] ||
          'user',
        ).toLowerCase().replace(/[^a-z0-9]/g, '')

        let username = baseUsername
        let counter = 1
        while (await prisma.profile.findUnique({ where: { username } })) {
          username = `${baseUsername}${counter}`
          counter++
          if (counter > 1000) {
            throw new Error('Unable to generate unique username')
          }
        }

        const profile = await prisma.profile.create({
          data: {
            userId: user.id,
            username,
            displayName: validatedData.displayName,
            bio: validatedData.bio,
            websiteUrl: validatedData.websiteUrl,
            avatarUrl: validatedData.avatarUrl,
            location: validatedData.location,
            githubUrl: validatedData.githubUrl,
            twitterUrl: validatedData.twitterUrl,
            linkedinUrl: validatedData.linkedinUrl,
          },
        })

        logger.info('Profile created', {
          userId: user.id,
          username: profile.username,
          displayName: profile.displayName,
        })

        return NextResponse.json({ profile })
      } else {
        // Update existing profile
        const profile = await prisma.profile.update({
          where: { userId: user.id },
          data: {
            displayName: validatedData.displayName,
            bio: validatedData.bio,
            websiteUrl: validatedData.websiteUrl,
            avatarUrl: validatedData.avatarUrl,
            location: validatedData.location,
            githubUrl: validatedData.githubUrl,
            twitterUrl: validatedData.twitterUrl,
            linkedinUrl: validatedData.linkedinUrl,
          },
        })

        logger.info('Profile updated', {
          userId: user.id,
          username: profile.username,
          fields: Object.keys(validatedData),
        })

        return NextResponse.json({ profile })
      }
    },
    { route: '/api/profile', method: 'PATCH' }
  )
}
