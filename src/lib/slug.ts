import slugify from 'slugify'
import { prisma } from './prisma'

/**
 * Generate a unique slug from a title
 * Handles collisions by appending a number
 */
export async function generateUniqueSlug(title: string, excludePostId?: string): Promise<string> {
  const baseSlug = slugify(title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  }).substring(0, 100) // Limit length

  let slug = baseSlug
  let counter = 1

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
  }

  return slug
}


