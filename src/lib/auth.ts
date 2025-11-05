import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from './prisma'
import { logger } from './logger'
import { AuthenticationError, NotFoundError } from './errors'
import { isValidUsername, sanitizeText } from './security-enhanced'

export async function requireUser() {
  const { userId } = await auth()
  if (!userId) {
    throw new AuthenticationError()
  }

  // Check if user exists - DO NOT create automatically
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { profile: true },
  })

  if (!user) {
    logger.authError('User profile not found', userId)
    throw new AuthenticationError('User profile not completed. Please complete onboarding.')
  }

  return user
}

export async function getCurrentUser() {
  const { userId } = await auth()
  if (!userId) return null

  return await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { profile: true },
  })
}

export async function isSignedIn() {
  const { userId } = await auth()
  return !!userId
}

export function getClerkAuth() {
  return auth()
}

/**
 * Create user profile explicitly during onboarding
 */
export async function createUserProfile(userId: string, userData: {
  email: string
  firstName?: string
  lastName?: string
  username?: string
  displayName?: string
  avatarUrl?: string
}) {
  const clerkUser = await currentUser()
  if (!clerkUser || clerkUser.id !== userId) {
    throw new AuthenticationError('Invalid user context')
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (existingUser) {
    throw new AuthenticationError('User already exists')
  }

  // Validate and sanitize username
  let username = userData.username
  if (username) {
    if (!isValidUsername(username)) {
      throw new AuthenticationError('Invalid username format')
    }

    // Check if username is already taken
    const existingUsername = await prisma.profile.findUnique({
      where: { username },
    })

    if (existingUsername) {
      throw new AuthenticationError('Username already taken')
    }
  } else {
    // Generate unique username from user data
    const baseUsername = sanitizeText(
      userData.firstName?.toLowerCase() ||
      userData.displayName?.toLowerCase().replace(/\s+/g, '') ||
      userData.email?.split('@')[0] ||
      'user',
    )

    username = await generateUniqueUsername(baseUsername)
  }

  // Create user and profile
  const user = await prisma.user.create({
    data: {
      clerkId: userId,
      email: userData.email,
      profile: {
        create: {
          username,
          displayName: sanitizeText(userData.displayName ||
            (userData.firstName && userData.lastName
              ? `${userData.firstName} ${userData.lastName}`
              : userData.firstName || 'New User')),
          avatarUrl: userData.avatarUrl,
        },
      },
    },
    include: { profile: true },
  })

  logger.info('User profile created', { userId, username })
  return user
}

/**
 * Generate a unique username
 */
async function generateUniqueUsername(baseUsername: string): Promise<string> {
  let username = baseUsername
  let counter = 1

  while (await prisma.profile.findUnique({ where: { username } })) {
    username = `${baseUsername}${counter}`
    counter++

    // Prevent infinite loop
    if (counter > 1000) {
      throw new Error('Unable to generate unique username')
    }
  }

  return username
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: {
    displayName?: string
    bio?: string
    websiteUrl?: string
    location?: string
    githubUrl?: string
    twitterUrl?: string
    linkedinUrl?: string
  },
) {
  const user = await requireUser()

  if (user.clerkId !== userId) {
    throw new AuthenticationError('Unauthorized')
  }

  if (!user.profile) {
    throw new NotFoundError('User profile')
  }

  // Sanitize text inputs
  const sanitizedUpdates = {
    ...updates,
    displayName: updates.displayName ? sanitizeText(updates.displayName) : undefined,
    bio: updates.bio ? sanitizeText(updates.bio) : undefined,
    location: updates.location ? sanitizeText(updates.location) : undefined,
  }

  const updatedProfile = await prisma.profile.update({
    where: { userId: user.id },
    data: sanitizedUpdates,
  })

  logger.info('User profile updated', { userId, fields: Object.keys(updates) })
  return updatedProfile
}
