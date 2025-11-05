'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateUniqueSlug } from '@/lib/slug'
import { calculateReadingTime } from '@/lib/reading-time'
import { createSlugRedirect } from '@/lib/slug'
import { logger } from '@/lib/logger'
import { sanitizeText } from '@/lib/security-enhanced'

interface SaveDraftData {
  title: string
  excerpt?: string
  contentJson: object
  coverImage?: string
  tagIds?: string[]
}

/**
 * Save or create a draft post
 */
export async function saveDraft(postId: string | undefined, data: SaveDraftData) {
  try {
    const user = await requireUser()

    if (postId) {
      // Update existing post
      const existing = await prisma.post.findUnique({
        where: { id: postId },
        select: { authorId: true },
      })

      if (!existing || existing.authorId !== user.id) {
        return { success: false, error: 'Unauthorized' }
      }

      const updated = await prisma.post.update({
        where: { id: postId },
        data: {
          title: validatedData.title,
          excerpt: validatedData.excerpt || '',
          contentJson: validatedData.contentJson,
          coverImage: validatedData.coverImage || null,
          readTimeMin: calculateReadingTime(validatedData.contentJson),
          tags: data.tagIds
            ? {
                deleteMany: {},
                create: data.tagIds.map((tagId) => ({ tagId })),
              }
            : undefined,
        },
      })

      revalidatePath('/dashboard')
      return { success: true, data: { postId: updated.id } }
    } else {
      // Create new draft
      const post = await prisma.post.create({
        data: {
          authorId: user.id,
          title: validatedData.title,
          slug: '', // Will be generated on publish
          excerpt: validatedData.excerpt || '',
          contentJson: validatedData.contentJson,
          coverImage: data.coverImage,
          readTimeMin: calculateReadingTime(data.contentJson),
          published: false,
          tags: data.tagIds
            ? {
                create: data.tagIds.map((tagId) => ({ tagId })),
              }
            : undefined,
        },
      })

      revalidatePath('/dashboard')
      return { success: true, data: { postId: post.id } }
    }
  } catch (error) {
    logger.dbError('saveDraft', error, { postId, userId: user.id })
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save draft',
    }
  }
}

/**
 * Publish a post
 */
export async function publishPost(postId: string) {
  try {
    const user = await requireUser()

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        tags: true,
      },
    })

    if (!post || post.authorId !== user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Validate
    if (!post.title || post.title.length < 10) {
      return { success: false, error: 'Title must be at least 10 characters' }
    }

    if (post.tags.length === 0) {
      return { success: false, error: 'Please add at least one tag' }
    }

    // Handle slug generation/changes
    let slug: string
    const oldSlug = post.slug

    if (!post.slug) {
      // Generate new slug for unpublished post
      slug = await generateUniqueSlug(post.title, postId)
    } else {
      // Check if slug needs updating based on title
      const expectedSlug = await generateUniqueSlug(post.title, postId)
      if (post.slug !== expectedSlug) {
        // Slug changed, create redirect
        slug = expectedSlug
        if (oldSlug) {
          await createSlugRedirect(postId, oldSlug, slug)
        }
      } else {
        slug = post.slug
      }
    }

    // Publish
    const published = await prisma.post.update({
      where: { id: postId },
      data: {
        published: true,
        publishedAt: new Date(),
        slug,
      },
    })

    revalidatePath('/dashboard')
    revalidatePath('/')
    revalidatePath(`/p/${published.slug}`)

    // Also revalidate old slug if it changed
    if (oldSlug && oldSlug !== slug) {
      revalidatePath(`/p/${oldSlug}`)
    }

    return { success: true, data: { slug: published.slug } }
  } catch (error) {
    logger.dbError('publishPost', error, { postId, userId: user.id })
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to publish post',
    }
  }
}

/**
 * Unpublish a post (revert to draft)
 */
export async function unpublishPost(postId: string) {
  try {
    const user = await requireUser()

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true, slug: true },
    })

    if (!post || post.authorId !== user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    await prisma.post.update({
      where: { id: postId },
      data: {
        published: false,
        publishedAt: null,
      },
    })

    revalidatePath('/dashboard')
    revalidatePath('/')
    if (post.slug) {
      revalidatePath(`/p/${post.slug}`)
    }

    return { success: true }
  } catch (error) {
    logger.dbError('unpublishPost', error, { postId, userId: user.id })
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to unpublish post',
    }
  }
}

/**
 * Delete a post
 */
export async function deletePost(postId: string) {
  try {
    const user = await requireUser()

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true, slug: true },
    })

    if (!post || post.authorId !== user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    await prisma.post.delete({
      where: { id: postId },
    })

    revalidatePath('/dashboard')
    revalidatePath('/')
    if (post.slug) {
      revalidatePath(`/p/${post.slug}`)
    }

    return { success: true }
  } catch (error) {
    logger.dbError('deletePost', error, { postId, userId: user.id })
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete post',
    }
  }
}

/**
 * Get or create tags
 */
export async function getOrCreateTags(tagNames: string[]) {
  try {
    const tagIds: string[] = []

    for (const name of tagNames) {
      const slug = name.toLowerCase().replace(/\s+/g, '-')

      const tag = await prisma.tag.upsert({
        where: { slug },
        update: {},
        create: { name, slug },
      })

      tagIds.push(tag.id)
    }

    return { success: true, data: tagIds }
  } catch (error) {
    logger.dbError('getOrCreateTags', error, { tagNames })
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create tags',
    }
  }
}
