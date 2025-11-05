import { NextResponse } from 'next/server'

interface HNSearchResult {
  title: string
  url: string
  author: string
  createdAt: string
  points: number
  numComments: number
  objectId: string
}

interface HNContext {
  query: string
  results: HNSearchResult[]
  total: number
  processedAt: string
}

// Cache to store HN results for 5 minutes
const hnCache = new Map<string, { data: HNContext; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Search Hacker News using Algolia API
 */
async function searchHackerNews(query: string): Promise<HNSearchResult[]> {
  const ALGOLIA_APP_ID = 'HYI9B2GI1O'
  const ALGOLIA_API_KEY = '39dd00ce238cbf8d556b3b4ae1c2d1ab'

  try {
    // First search for stories
    const storiesResponse = await fetch(
      `https://${ALGOLIA_APP_ID}-dsn.algolia.net/1/v1/indexes/hackernews/query`,
      {
        method: 'POST',
        headers: {
          'X-Algolia-API-Key': ALGOLIA_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          filters: 'type:story',
          hitsPerPage: 20,
          advancedSyntax: true,
          analyticsTags: ['production'],
        }),
      },
    )

    if (!storiesResponse.ok) {
      throw new Error(`HN search failed: ${storiesResponse.statusText}`)
    }

    const storiesData = await storiesResponse.json()

    return storiesData.hits.map((hit: any) => ({
      title: hit.title || hit.story_title || '',
      url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
      author: hit.author || '',
      createdAt: hit.created_at_i ? new Date(hit.created_at_i * 1000).toISOString() : '',
      points: hit.points || 0,
      numComments: hit.num_comments || 0,
      objectId: hit.objectID,
    }))
  } catch (error) {
    console.error('Hacker News search error:', error)
    return []
  }
}

/**
 * Extract keywords from text for HN search
 */
function extractKeywords(text: string): string[] {
  // Simple keyword extraction - can be enhanced with NLP
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !['the', 'and', 'for', 'are', 'with', 'this', 'that', 'from', 'have', 'they', 'been', 'said', 'each', 'which', 'their', 'time', 'will', 'about', 'been', 'call', 'who', 'oil', 'its', 'now'].includes(word))

  // Remove duplicates and return top keywords
  return [...new Set(words)].slice(0, 5)
}

/**
 * Rank and filter HN results based on relevance and quality
 */
function rankAndFilterResults(results: HNSearchResult[]): HNSearchResult[] {
  return results
    .filter(result => {
      // Filter out low-quality content
      return (
        result.title.length > 10 &&
        result.points >= 5 && // Minimum points threshold
        result.url && result.url.startsWith('http')
      )
    })
    .sort((a, b) => {
      // Rank by combination of points, recency, and comment count
      const scoreA = a.points + (a.numComments * 0.5)
      const scoreB = b.points + (b.numComments * 0.5)
      return scoreB - scoreA
    })
    .slice(0, 10) // Top 10 results
}

/**
 * Generate cache key from query parameters
 */
function generateCacheKey(query: string): string {
  return `hn:${query.toLowerCase().trim()}`
}

/**
 * Get cached HN context or fetch new data
 */
function getCachedOrFetch(query: string): Promise<HNContext> {
  const cacheKey = generateCacheKey(query)
  const cached = hnCache.get(cacheKey)

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return Promise.resolve(cached.data)
  }

  // Fetch new data
  return fetchHNContext(query)
}

/**
 * Fetch Hacker News context for a given query
 */
export async function fetchHNContext(query: string): Promise<HNContext> {
  try {
    // Extract keywords for better search results
    const keywords = extractKeywords(query)
    const searchQuery = keywords.length > 0 ? keywords.join(' ') : query

    // Search Hacker News
    const rawResults = await searchHackerNews(searchQuery)

    // Rank and filter results
    const rankedResults = rankAndFilterResults(rawResults)

    const context: HNContext = {
      query: searchQuery,
      results: rankedResults,
      total: rankedResults.length,
      processedAt: new Date().toISOString(),
    }

    // Cache the results
    const cacheKey = generateCacheKey(query)
    hnCache.set(cacheKey, {
      data: context,
      timestamp: Date.now(),
    })

    // Clean up old cache entries
    cleanupCache()

    return context
  } catch (error) {
    console.error('Error fetching HN context:', error)
    return {
      query,
      results: [],
      total: 0,
      processedAt: new Date().toISOString(),
    }
  }
}

/**
 * Clean up expired cache entries
 */
function cleanupCache() {
  const now = Date.now()
  for (const [key, entry] of hnCache.entries()) {
    if (now - entry.timestamp > CACHE_DURATION) {
      hnCache.delete(key)
    }
  }
}

/**
 * API route for fetching Hacker News context
 */
export async function POST(request: Request) {
  try {
    const { query, includeHNContext = false } = await request.json()

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 },
      )
    }

    if (!includeHNContext) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'HN context disabled',
      })
    }

    const context = await getCachedOrFetch(query)

    return NextResponse.json({
      success: true,
      data: context,
    })
  } catch (error) {
    console.error('HN context API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}

/**
 * Health check endpoint for HN service
 */
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    cacheSize: hnCache.size,
    cacheMaxAge: `${CACHE_DURATION / 1000}s`,
    timestamp: new Date().toISOString(),
  })
}
