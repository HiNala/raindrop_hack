'use server'

import { generatePost as generatePostWithAI, GeneratePostOptions } from '@/lib/openai'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Rate limiting tracking (in-memory for simplicity, use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

const RATE_LIMIT = 10 // Max generations per day
const RATE_WINDOW = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

/**
 * Check if user has exceeded rate limit
 */
function checkRateLimit(userId: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const userLimit = rateLimitMap.get(userId)

  if (!userLimit || now > userLimit.resetAt) {
    // Reset or create new entry
    rateLimitMap.set(userId, {
      count: 0,
      resetAt: now + RATE_WINDOW,
    })
    return { allowed: true, remaining: RATE_LIMIT }
  }

  if (userLimit.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 }
  }

  return { allowed: true, remaining: RATE_LIMIT - userLimit.count }
}

/**
 * Increment rate limit counter
 */
function incrementRateLimit(userId: string) {
  const userLimit = rateLimitMap.get(userId)
  if (userLimit) {
    userLimit.count++
  }
}

/**
 * Generate a blog post from a prompt (authenticated users only)
 */
export async function generateAuthenticatedPost(
  prompt: string,
  options: GeneratePostOptions = {}
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return {
        success: false,
        error: 'You must be signed in to generate posts',
      }
    }

    // Check rate limit
    const rateLimit = checkRateLimit(user.id)
    if (!rateLimit.allowed) {
      return {
        success: false,
        error: 'Rate limit exceeded. You can generate up to 10 posts per day.',
      }
    }

    // Generate post with AI
    const generated = await generatePostWithAI(prompt, options)

    // Increment rate limit
    incrementRateLimit(user.id)

    // Create draft in database
    const post = await prisma.post.create({
      data: {
        authorId: user.id,
        title: generated.title,
        slug: '', // Will be generated on publish
        excerpt: generated.excerpt,
        contentJson: generated.contentJson,
        readTimeMin: generated.readTimeMin,
        published: false,
      },
    })

    return {
      success: true,
      data: {
        postId: post.id,
        title: generated.title,
        excerpt: generated.excerpt,
        contentJson: generated.contentJson,
        suggestedTags: generated.suggestedTags,
        readTimeMin: generated.readTimeMin,
        remaining: rateLimit.remaining - 1,
      },
    }
  } catch (error) {
    console.error('Error generating post:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate post',
    }
  }
}

/**
 * Generate a blog post for anonymous users (returns data only, doesn't save)
 */
export async function generateAnonymousPost(
  prompt: string,
  options: GeneratePostOptions = {}
) {
  try {
    // For anonymous users, we don't save to DB or rate limit strictly
    // The client will handle the 3-post limit via localStorage

    const generated = await generatePostWithAI(prompt, options)

    return {
      success: true,
      data: {
        title: generated.title,
        excerpt: generated.excerpt,
        contentJson: generated.contentJson,
        suggestedTags: generated.suggestedTags,
        readTimeMin: generated.readTimeMin,
      },
    }
  } catch (error) {
    console.error('Error generating anonymous post:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate post',
    }
  }
}

