'use server'

import { generatePost as generatePostWithAI, GeneratePostOptions } from '@/lib/openai'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { enrichWithHN, formatCitationsMarkdown } from '@/lib/hn-search'
import { logger } from '@/lib/logger'
import { sanitizeText } from '@/lib/security-enhanced'
import { checkRateLimit, RateLimitConfig } from '@/lib/rate-limiting-redis'

const RATE_LIMIT_CONFIG: RateLimitConfig = {
  requests: 10, // Max generations per day
  window: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
}

const ANONYMOUS_RATE_LIMIT_CONFIG: RateLimitConfig = {
  requests: 3, // Max generations per session for anonymous users
  window: 60 * 60 * 1000, // 1 hour
}

/**
 * Generate a unique identifier for rate limiting
 */
function getRateLimitIdentifier(userId?: string, sessionId?: string): string {
  if (userId) {
    return `ai-generation:user:${userId}`
  }
  if (sessionId) {
    return `ai-generation:anonymous:${sessionId}`
  }
  return 'ai-generation:unknown'
}

/**
 * Fetch Hacker News context for enrichment
 */
async function fetchHNContext(prompt: string, includeHNContext: boolean = false) {
  if (!includeHNContext) {
    return null
  }

  try {
    const { citations, contextText } = await enrichWithHN(prompt, {
      limit: 5,
      minPoints: 20,
    })

    if (citations.length === 0) {
      return null
    }

    return {
      contextText,
      citations,
      citationsMarkdown: formatCitationsMarkdown(citations),
    }
  } catch (error) {
    logger.error('Error fetching HN context', error, {
      prompt: sanitizeText(prompt).substring(0, 100),
    })
    return null
  }
}

/**
 * Generate a blog post from a prompt (authenticated users only)
 */
export async function generateAuthenticatedPost(
  prompt: string,
  options: GeneratePostOptions & { includeHNContext?: boolean } = {}
) {
  let user = null
  
  try {
    user = await getCurrentUser()

    if (!user) {
      return {
        success: false,
        error: 'You must be signed in to generate posts',
      }
    }

    // Validate input
    if (!prompt || typeof prompt !== 'string || prompt.trim().length === 0) {
      return {
        success: false,
        error: 'Prompt is required',
      }
    }

    if (prompt.length > 1000) {
      return {
        success: false,
        error: 'Prompt is too long (max 1000 characters)',
      }
    }

    // Check rate limit
    const identifier = getRateLimitIdentifier(user.id)
    const rateLimit = await checkRateLimit(identifier, RATE_LIMIT_CONFIG)
    
    if (!rateLimit.allowed) {
      logger.security('AI generation rate limit exceeded', {
        userId: user.id,
        prompt: sanitizeText(prompt).substring(0, 100),
        retryAfter: rateLimit.retryAfter
      })
      
      return {
        success: false,
        error: `Rate limit exceeded. You can generate up to ${RATE_LIMIT_CONFIG.requests} posts per day. Try again in ${rateLimit.retryAfter} minutes.`,
      }
    }

    // Fetch HN context if enabled
    const hnContext = await fetchHNContext(prompt, options.includeHNContext)

    // Generate post with AI
    const generated = await generatePostWithAI(prompt, {
      ...options,
      hnContext,
    })

    // Create draft in database
    const post = await prisma.post.create({
      data: {
        authorId: user.id,
        title: sanitizeText(generated.title).substring(0, 200),
        slug: '', // Will be generated on publish
        excerpt: sanitizeText(generated.excerpt).substring(0, 500),
        contentJson: generated.contentJson,
        readTimeMin: Math.max(1, Math.min(99, generated.readTimeMin || 5)),
        published: false,
      },
    })

    logger.info('AI post generated successfully', {
      userId: user.id,
      postId: post.id,
      title: generated.title.substring(0, 100),
      hasHNContext: !!hnContext,
      remaining: rateLimit.remaining - 1
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
        hnSources: generated.hnSources,
        remaining: rateLimit.remaining - 1,
        resetAt: rateLimit.resetAt,
      },
    }
  } catch (error) {
    logger.error('Error generating authenticated post', error, {
      userId: user?.id,
      prompt: sanitizeText(prompt).substring(0, 100),
    })
    
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
  options: GeneratePostOptions & { includeHNContext?: boolean; sessionId?: string } = {}
) {
  try {
    // Validate input
    if (!prompt || typeof prompt !== 'string || prompt.trim().length === 0) {
      return {
        success: false,
        error: 'Prompt is required',
      }
    }

    if (prompt.length > 1000) {
      return {
        success: false,
        error: 'Prompt is too long (max 1000 characters)',
      }
    }

    // Check rate limit for anonymous users
    const identifier = getRateLimitIdentifier(undefined, options.sessionId)
    const rateLimit = await checkRateLimit(identifier, ANONYMOUS_RATE_LIMIT_CONFIG)
    
    if (!rateLimit.allowed) {
      logger.security('Anonymous AI generation rate limit exceeded', {
        sessionId: options.sessionId,
        prompt: sanitizeText(prompt).substring(0, 100),
        retryAfter: rateLimit.retryAfter
      })
      
      return {
        success: false,
        error: `Rate limit exceeded. You can generate up to ${ANONYMOUS_RATE_LIMIT_CONFIG.requests} posts per session. Try again in ${rateLimit.retryAfter} minutes.`,
      }
    }

    // Fetch HN context if enabled (limited for anonymous users)
    const hnContext = options.includeHNContext ? await fetchHNContext(prompt, true) : null

    const generated = await generatePostWithAI(prompt, {
      ...options,
      hnContext,
    })

    logger.info('Anonymous AI post generated successfully', {
      sessionId: options.sessionId,
      title: generated.title.substring(0, 100),
      hasHNContext: !!hnContext,
      remaining: rateLimit.remaining - 1
    })

    return {
      success: true,
      data: {
        title: generated.title,
        excerpt: generated.excerpt,
        contentJson: generated.contentJson,
        suggestedTags: generated.suggestedTags,
        readTimeMin: generated.readTimeMin,
        hnSources: generated.hnSources,
        remaining: rateLimit.remaining - 1,
        resetAt: rateLimit.resetAt,
      },
    }
  } catch (error) {
    logger.error('Error generating anonymous post', error, {
      sessionId: options.sessionId,
      prompt: sanitizeText(prompt).substring(0, 100),
    })
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate post',
    }
  }
}
