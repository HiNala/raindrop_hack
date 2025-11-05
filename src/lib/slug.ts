import { prisma } from './prisma'
import { validateSlug } from './security'

/**
 * Generate a unique slug from a title
 * Handles collisions by appending a number
 */
export async function generateUniqueSlug(title: string, excludePostId?: string): Promise<string> {
  // Convert to slug format
  let baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .substring(0, 100) // Limit length

  // Ensure minimum length
  if (baseSlug.length < 3) {
    baseSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`
  }

  let slug = baseSlug
  let counter = 1

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    })

    // If no collision, or collision is with the same post being updated
    if (!existing || (excludePostId && existing.id === excludePostId)) {
      break
    }

    // Try next number
    slug = `${baseSlug}-${counter}`
    counter++

    // Prevent infinite loops
    if (counter > 100) {
      slug = `${baseSlug}-${Date.now()}`
      break
    }
  }

  return slug
}

/**
 * Create a slug redirect when a post's slug changes
 */
export async function createSlugRedirect(postId: string, oldSlug: string, newSlug: string) {
  // Don't create redirect if slugs are the same
  if (oldSlug === newSlug) return

  // Validate the new slug
  const validation = validateSlug(newSlug)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  // Check if old slug redirect already exists
  const existingRedirect = await prisma.slugRedirect.findUnique({
    where: { fromSlug: oldSlug },
  })

  if (existingRedirect) {
    // Update existing redirect
    await prisma.slugRedirect.update({
      where: { id: existingRedirect.id },
      data: { toSlug: newSlug },
    })
  } else {
    // Create new redirect
    await prisma.slugRedirect.create({
      data: {
        fromSlug: oldSlug,
        toSlug: newSlug,
        postId,
      },
    })
  }
}

/**
 * Check if a slug change will break existing links
 */
export async function checkSlugChangeImpact(currentSlug: string, newSlug: string) {
  const redirect = await prisma.slugRedirect.findUnique({
    where: { fromSlug: currentSlug },
  })

  return {
    hasExistingRedirect: !!redirect,
    willBreakLinks: !redirect || redirect.toSlug !== newSlug,
  }
}


