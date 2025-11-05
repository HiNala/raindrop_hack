'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateUniqueSlug } from '@/lib/slug'
import { calculateReadingTime } from '@/lib/reading-time'

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
          title: data.title,
          excerpt: data.excerpt,
          contentJson: data.contentJson,
          coverImage: data.coverImage,
          readTimeMin: calculateReadingTime(data.contentJson),
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
          title: data.title,
          slug: '', // Will be generated on publish
          excerpt: data.excerpt,
          contentJson: data.contentJson,
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
    console.error('Error saving draft:', error)
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

    // Generate slug if not exists
    const slug = post.slug || (await generateUniqueSlug(post.title, postId))

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

    return { success: true, data: { slug: published.slug } }
  } catch (error) {
    console.error('Error publishing post:', error)
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
    console.error('Error unpublishing post:', error)
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
    console.error('Error deleting post:', error)
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
    console.error('Error creating tags:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create tags',
    }
  }
}


