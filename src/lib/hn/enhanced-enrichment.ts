import { z } from 'zod'
import { Redis } from 'ioredis'
import { HNEnrichmentConfigSchema, HNSearchResponseSchema, type HNStory, type HNContextPack } from '@/lib/schemas/hackernews.schema'

// Enhanced HN Enrichment with Redis caching and advanced ranking
export class HNEnrichmentService {
  private static instance: HNEnrichmentService
  private redis: Redis | null = null
  private cacheEnabled: boolean
  private readonly CACHE_TTL = 5 * 60 // 5 minutes
  private readonly RATE_LIMIT_TTL = 60 * 60 // 1 hour

  constructor() {
    this.cacheEnabled = !!process.env.UPSTASH_REDIS_REST_URL

    if (this.cacheEnabled) {
      this.redis = new Redis({
        port: parseInt(process.env.UPSTASH_REDIS_REST_PORT || '6379'),
        host: process.env.UPSTASH_REDIS_REST_HOST || 'localhost',
        password: process.env.UPSTASH_REDIS_REST_TOKEN,
        tls: process.env.UPSTASH_REDIS_REST_URL?.includes('rediss://') ? {} : undefined,
        retryDelayOnFailover: 100,
        enableReadyCheck: false,
        maxRetriesPerRequest: 3,
      })
    }
  }

  static getInstance(): HNEnrichmentService {
    if (!HNEnrichmentService.instance) {
      HNEnrichmentService.instance = new HNEnrichmentService()
    }
    return HNEnrichmentService.instance
  }

  /**
   * Advanced keyword extraction with NLP techniques
   */
  private extractKeywords(prompt: string, title?: string): string[] {
    const text = [prompt, title].filter(Boolean).join(' ').toLowerCase()

    // Remove common stop words
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
      'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
      'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this',
      'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
      'what', 'where', 'when', 'why', 'how', 'all', 'any', 'both', 'each',
      'few', 'more', 'most', 'other', 'some', 'such', 'only', 'own', 'same',
      'so', 'than', 'too', 'very', 'just', 'now', 'also', 'here', 'there',
    ])

    // Extract technical terms and entities
    const technicalTerms = text.match(/\b(?:javascript|typescript|react|next\.js|node|python|api|database|css|html|web3|blockchain|ai|machine learning|ml|devops|docker|kubernetes|aws|azure|gcp|firebase|mongodb|postgresql|mysql|redis)\b/g) || []

    // Extract common words with frequency analysis
    const words = text
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word =>
        word.length > 3 &&
        !stopWords.has(word) &&
        !technicalTerms.includes(word),
      )

    const frequency = new Map<string, number>()
    words.forEach(word => {
      frequency.set(word, (frequency.get(word) || 0) + 1)
    })

    // Combine technical terms with frequent words
    const allTerms = [
      ...technicalTerms.map(term => ({ term, score: 3 })), // Technical terms get higher score
      ...Array.from(frequency.entries()).map(([term, freq]) => ({ term, score: freq })),
    ]

    // Sort by score and take top 5
    return allTerms
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => item.term)
  }

  /**
   * Fetch stories from HN Algolia API with retry logic
   */
  private async searchHNWithRetry(
    query: string,
    options: {
      tags?: string
      minPoints?: number
      maxAge?: number
      limit?: number
      retries?: number
    },
  ): Promise<HNStory[]> {
    const { retries = 3, ...searchOptions } = options

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const params = new URLSearchParams({
          query,
          tags: searchOptions.tags || 'story',
          hitsPerPage: String(searchOptions.limit || 10),
        })

        // Add numeric filters
        const filters: string[] = []
        if (searchOptions.minPoints) {
          filters.push(`points>${searchOptions.minPoints}`)
        }
        if (searchOptions.maxAge) {
          const cutoffTimestamp = Math.floor(Date.now() / 1000) - (searchOptions.maxAge * 24 * 60 * 60)
          filters.push(`created_at_i>${cutoffTimestamp}`)
        }
        if (filters.length > 0) {
          params.append('numericFilters', filters.join(','))
        }

        const url = `https://hn.algolia.com/api/v1/search?${params}`

        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Blog-Platform-HN-Enrichment/1.0',
          },
          signal: AbortSignal.timeout(10000), // 10 second timeout
        })

        if (!response.ok) {
          throw new Error(`HN API error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()

        // Validate response
        const validated = HNSearchResponseSchema.parse(data)

        return validated.hits

      } catch (error) {
        console.warn(`HN search attempt ${attempt + 1} failed:`, error)

        if (attempt === retries) {
          console.error('All HN search attempts failed')
          return []
        }

        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }

    return []
  }

  /**
   * Advanced story ranking algorithm
   */
  private rankStories(stories: HNStory[], keywords: string[]): HNStory[] {
    const now = Date.now() / 1000

    return stories
      .map(story => {
        // Keyword matching score
        const storyText = `${story.title} ${story.author}`.toLowerCase()
        const keywordMatches = keywords.filter(keyword =>
          storyText.includes(keyword.toLowerCase()),
        ).length
        const keywordScore = keywordMatches / keywords.length

        // Normalized metrics
        const pointsScore = Math.min(story.points / 100, 1) // Max 100 points = 1.0
        const commentsScore = Math.min(story.num_comments / 50, 1) // Max 50 comments = 1.0

        // Freshness: exponential decay over 30 days
        const ageInDays = (now - story.created_at_i) / (24 * 60 * 60)
        const freshnessScore = Math.exp(-ageInDays / 30)

        // Domain authority (simple heuristic)
        const domain = story.url ? new URL(story.url).hostname.toLowerCase() : ''
        const trustedDomains = ['github.com', 'stackoverflow.com', 'medium.com', 'dev.to', 'infoq.com']
        const domainScore = trustedDomains.some(trusted => domain.includes(trusted)) ? 1.2 : 1.0

        // Blended score with weighted factors
        const score = (
          keywordScore * 0.4 +      // Keyword relevance (40%)
          pointsScore * 0.25 +      // Points (25%)
          commentsScore * 0.15 +    // Comments (15%)
          freshnessScore * 0.15 +   // Freshness (15%)
          domainScore * 0.05        // Domain authority (5%)
        ) * domainScore

        return { ...story, score }
      })
      .sort((a, b) => b.score - a.score)
  }

  /**
   * Generate cache key with bucketing for better cache hits
   */
  private getCacheKey(keywords: string[], options: {
    language?: string
    minPoints?: number
    maxAge?: number
  }): string {
    const keywordHash = keywords.sort().join(',')
    const bucket = `${Math.floor(Date.now() / (5 * 60 * 1000))}` // 5-minute bucket
    const optionsHash = `${options.minPoints || 0}-${options.maxAge || 'unlimited'}`

    return `hn:enrich:${Buffer.from(`${keywordHash}:${optionsHash}:${bucket}`).toString('base64')}`
  }

  /**
   * Rate limiting with Redis
   */
  private async checkRateLimit(userId: string, limit: number = 10): Promise<boolean> {
    if (!this.redis) return true

    const key = `hn:ratelimit:${userId}`
    const current = await this.redis.incr(key)

    if (current === 1) {
      await this.redis.expire(key, this.RATE_LIMIT_TTL)
    }

    return current <= limit
  }

  /**
   * Main enrichment function with advanced features
   */
  async enrichWithHN(
    prompt: string,
    config: z.infer<typeof HNEnrichmentConfigSchema>,
    userId?: string,
  ): Promise<HNContextPack> {
    // Validate config
    const validatedConfig = HNEnrichmentConfigSchema.parse(config)

    if (!validatedConfig.enabled) {
      return {
        query: prompt,
        contextText: '',
        citations: [],
        cacheHit: false,
        retrievedAt: new Date().toISOString(),
      }
    }

    // Rate limiting
    if (userId && this.cacheEnabled && !(await this.checkRateLimit(userId, validatedConfig.limit || 10))) {
      console.warn(`Rate limit exceeded for user: ${userId}`)
      throw new Error('Rate limit exceeded. Please try again later.')
    }

    // Extract keywords
    const keywords = validatedConfig.keywords.length > 0
      ? validatedConfig.keywords
      : this.extractKeywords(prompt, validatedConfig.title)

    if (keywords.length === 0) {
      console.warn('No keywords extracted, skipping HN enrichment')
      return {
        query: prompt,
        contextText: '',
        citations: [],
        cacheHit: false,
        retrievedAt: new Date().toISOString(),
      }
    }

    // Check cache
    const cacheKey = this.getCacheKey(keywords, validatedConfig)

    if (this.cacheEnabled && this.redis) {
      try {
        const cached = await this.redis.get(cacheKey)
        if (cached) {
          const cachedData = JSON.parse(cached)
          console.log('HN cache hit:', cacheKey)
          return { ...cachedData, cacheHit: true }
        }
      } catch (error) {
        console.warn('Cache read failed:', error)
      }
    }

    // Fetch from HN with parallel queries
    console.log('Fetching from HN:', keywords)
    const query = keywords.join(' ')

    const [relevantStories, recentStories] = await Promise.all([
      this.searchHNWithRetry(query, {
        minPoints: validatedConfig.minPoints,
        limit: Math.ceil(validatedConfig.limit * 0.7), // 70% relevant
        retries: 2,
      }),
      this.searchHNWithRetry(query, {
        maxAge: 7, // Last 7 days
        limit: Math.floor(validatedConfig.limit * 0.3), // 30% recent
        retries: 2,
      }),
    ])

    // Combine and process results
    const allStories = [...relevantStories, ...recentStories]

    // Advanced deduplication by URL and title similarity
    const uniqueStories = this.deduplicateStories(allStories)

    // Rank stories with advanced algorithm
    const rankedStories = this.rankStories(uniqueStories, keywords)
    const topStories = rankedStories.slice(0, validatedConfig.limit)

    // Format outputs
    const contextText = this.formatContextForAI(topStories, keywords)
    const citations = this.formatCitations(topStories)

    const contextPack: HNContextPack = {
      query: keywords.join(' '),
      contextText,
      citations,
      cacheHit: false,
      retrievedAt: new Date().toISOString(),
    }

    // Cache result
    if (this.cacheEnabled && this.redis) {
      try {
        await this.redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(contextPack))
        console.log('Cached HN result:', cacheKey)
      } catch (error) {
        console.warn('Cache write failed:', error)
      }
    }

    return contextPack
  }

  /**
   * Advanced deduplication with URL normalization and title similarity
   */
  private deduplicateStories(stories: HNStory[]): HNStory[] {
    const seen = new Set<string>()
    const titleSet = new Set<string>()

    return stories.filter(story => {
      if (!story.url) return false

      // URL normalization
      const normalizedUrl = story.url.toLowerCase()
        .replace(/^(https?:\/\/)?(www\.)?/, '')
        .replace(/\/$/, '')
        .replace(/^www\./, '')

      // Title similarity (simple Levenshtein approximation)
      const normalizedTitle = story.title.toLowerCase().replace(/[^a-z0-9]/g, '')

      // Check for exact URL matches
      if (seen.has(normalizedUrl)) return false

      // Check for title similarity (>80% match)
      for (const existingTitle of titleSet) {
        const similarity = this.calculateSimilarity(normalizedTitle, existingTitle)
        if (similarity > 0.8) return false
      }

      seen.add(normalizedUrl)
      titleSet.add(normalizedTitle)
      return true
    })
  }

  /**
   * Simple similarity calculation for title deduplication
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1

    if (longer.length === 0) return 1.0

    const editDistance = this.levenshteinDistance(longer, shorter)
    return (longer.length - editDistance) / longer.length
  }

  /**
   * Levenshtein distance algorithm
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() =>
      Array(str1.length + 1).fill(null),
    )

    for (let i = 0; i <= str1.length; i++) {
      matrix[0][i] = i
    }
    for (let j = 0; j <= str2.length; j++) {
      matrix[j][0] = j
    }

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator, // substitution
        )
      }
    }

    return matrix[str2.length][str1.length]
  }

  /**
   * Format context for AI model with enhanced structure
   */
  private formatContextForAI(stories: HNStory[], keywords: string[]): string {
    if (stories.length === 0) return ''

    const sections = stories.slice(0, 5).map((story, index) => {
      const date = new Date(story.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })

      const relevance = this.calculateRelevance(story, keywords)

      return [
        `[HN-${index + 1}] ${story.title}`,
        `Relevance: ${relevance}% | Points: ${story.points} | Comments: ${story.numComments} | Date: ${date}`,
        story.url ? `URL: ${story.url}` : 'URL: HN Discussion',
        story.author ? `By: ${story.author}` : '',
        '',
      ].filter(Boolean).join('\n')
    })

    return [
      'Relevant Hacker News Discussions:',
      `Query: ${keywords.join(', ')}`,
      '',
      ...sections,
      'Usage Guidelines:',
      '- Reference these discussions using [HN-X] markers where relevant',
      '- Focus on insights that complement your main points',
      '- Provide attribution when using specific information or quotes',
      '- Prioritize recent discussions unless historical context is needed',
    ].join('\n')
  }

  /**
   * Calculate relevance score for display
   */
  private calculateRelevance(story: HNStory, keywords: string[]): number {
    const storyText = `${story.title} ${story.author}`.toLowerCase()
    const matches = keywords.filter(keyword =>
      storyText.includes(keyword.toLowerCase()),
    ).length
    return Math.round((matches / keywords.length) * 100)
  }

  /**
   * Format citations with enhanced metadata
   */
  private formatCitations(stories: HNStory[]) {
    return stories.map((story, index) => ({
      id: `HN-${index + 1}`,
      index: index + 1,
      title: story.title,
      url: story.url || `https://news.ycombinator.com/item?id=${story.objectID}`,
      author: story.author,
      points: story.points,
      numComments: story.numComments,
      createdAt: story.created_at,
      objectID: story.objectID,
      relevance: 0, // Will be calculated when needed
    }))
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<{
    totalKeys: number
    hitRate: number
    memoryUsage: string
  }> {
    if (!this.redis) {
      return { totalKeys: 0, hitRate: 0, memoryUsage: '0B' }
    }

    try {
      const keys = await this.redis.keys('hn:enrich:*')
      const info = await this.redis.info('memory')

      const memoryMatch = info.match(/used_memory_human:([^\r\n]+)/)
      const memoryUsage = memoryMatch ? memoryMatch[1] : 'Unknown'

      return {
        totalKeys: keys.length,
        hitRate: 0, // Would need to track hits/misses separately
        memoryUsage,
      }
    } catch (error) {
      console.warn('Failed to get cache stats:', error)
      return { totalKeys: 0, hitRate: 0, memoryUsage: 'Error' }
    }
  }

  /**
   * Clear cache
   */
  async clearCache(): Promise<void> {
    if (!this.redis) return

    try {
      const keys = await this.redis.keys('hn:enrich:*')
      if (keys.length > 0) {
        await this.redis.del(...keys)
        console.log(`Cleared ${keys.length} cache entries`)
      }
    } catch (error) {
      console.warn('Failed to clear cache:', error)
    }
  }

  /**
   * Cleanup resources
   */
  async disconnect(): Promise<void> {
    if (this.redis) {
      await this.redis.quit()
      this.redis = null
    }
  }
}

// Export singleton instance
export const hnEnrichment = HNEnrichmentService.getInstance()

// Legacy compatibility
export { hnEnrichment as enrichWithHN }
