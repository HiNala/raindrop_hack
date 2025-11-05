import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from './prisma'
import slugify from 'slugify'

export async function requireUser() {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  // Check if user exists, create if not
  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { profile: true },
  })

  if (!user) {
    const clerkUser = await currentUser()
    if (!clerkUser) {
      throw new Error('Unauthorized')
    }

    // Generate a unique username from Clerk user data
    const baseUsername = clerkUser.username ||
                       clerkUser.firstName?.toLowerCase() ||
                       clerkUser.emailAddresses?.[0]?.emailAddress?.split('@')[0] ||
                       'user'

    const username = slugify(baseUsername, { lower: true, strict: true })

    // Ensure username is unique
    let finalUsername = username
    let counter = 1
    while (await prisma.profile.findUnique({ where: { username: finalUsername } })) {
      finalUsername = `${username}${counter}`
      counter++
    }

    // Create user and profile
    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email: clerkUser.emailAddresses?.[0]?.emailAddress || `${userId}@example.dev`,
        profile: {
          create: {
            username: finalUsername,
            displayName: clerkUser.fullName ||
                         clerkUser.firstName && clerkUser.lastName
              ? `${clerkUser.firstName} ${clerkUser.lastName}`
              : 'New User',
            avatarUrl: clerkUser.imageUrl,
          },
        },
      },
      include: { profile: true },
    })

    console.log(`Created new user: ${user.id} with username: ${finalUsername}`)
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
