/**
 * Hacker News Algolia Search Integration
 * API Docs: https://hn.algolia.com/api
 */

export interface HNStory {
  objectID: string
  title: string
  url: string
  author: string
  points: number
  created_at: string
  num_comments: number
  _tags: string[]
}

export interface HNSearchResult {
  hits: HNStory[]
  nbHits: number
  page: number
  nbPages: number
  hitsPerPage: number
  processingTimeMS: number
}

export interface HNCitation {
  title: string
  url: string
  author: string
  points: number
  created_at: string
  num_comments: number
}

const HN_ALGOLIA_API = 'https://hn.algolia.com/api/v1'

// Simple in-memory cache with expiration
const cache = new Map<string, { data: HNSearchResult; expires: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Extract keywords from a prompt/title
 */
export function extractKeywords(text: string): string[] {
  // Remove common stop words and extract meaningful keywords
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
    'can', 'must', 'shall', 'what', 'which', 'how', 'why', 'when', 'where',
    'who', 'that', 'this', 'these', 'those', 'i', 'you', 'he', 'she', 'it',
    'we', 'they', 'them', 'their', 'your', 'my', 'our', 'his', 'her', 'its',
  ])

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word))
    .slice(0, 5) // Limit to top 5 keywords
}

/**
 * Search Hacker News for relevant stories
 */
export async function searchHN(
  query: string,
  options: {
    limit?: number
    minPoints?: number
    tag?: string
  } = {},
): Promise<HNSearchResult> {
  const { limit = 10, minPoints = 10, tag = 'story' } = options

  // Generate cache key
  const cacheKey = `${query}:${limit}:${minPoints}:${tag}`

  // Check cache first
  const cached = cache.get(cacheKey)
  if (cached && cached.expires > Date.now()) {
    return cached.data
  }

  try {
    // Build search URL
    const params = new URLSearchParams({
      query,
      tags: tag,
      hitsPerPage: String(Math.min(limit * 2, 20)), // Fetch more for filtering
    })

    const response = await fetch(`${HN_ALGOLIA_API}/search?${params}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HN API returned ${response.status}`)
    }

    const data: HNSearchResult = await response.json()

    // Filter and sort by points
    const filteredHits = data.hits
      .filter(hit => hit.points >= minPoints && hit.url) // Must have URL
      .sort((a, b) => {
        // Sort by points desc, then comments desc
        if (b.points !== a.points) {
          return b.points - a.points
        }
        return b.num_comments - a.num_comments
      })
      .slice(0, limit)

    const result = {
      ...data,
      hits: filteredHits,
      nbHits: filteredHits.length,
    }

    // Cache the result
    cache.set(cacheKey, {
      data: result,
      expires: Date.now() + CACHE_DURATION,
    })

    return result
  } catch (error) {
    console.error('HN Search Error:', error)
    throw new Error('Failed to search Hacker News')
  }
}

/**
 * Deduplicate stories by URL
 */
export function deduplicateByUrl(stories: HNStory[]): HNStory[] {
  const seen = new Set<string>()
  return stories.filter(story => {
    if (!story.url) return false
    // Normalize URL for comparison
    const normalizedUrl = story.url.toLowerCase().replace(/^https?:\/\/(www\.)?/, '')
    if (seen.has(normalizedUrl)) {
      return false
    }
    seen.add(normalizedUrl)
    return true
  })
}

/**
 * Convert HN stories to citations format
 */
export function storiesToCitations(stories: HNStory[]): HNCitation[] {
  return stories.map(story => ({
    title: story.title,
    url: story.url,
    author: story.author,
    points: story.points,
    created_at: story.created_at,
    num_comments: story.num_comments,
  }))
}

/**
 * Format citations for markdown
 */
export function formatCitationsMarkdown(citations: HNCitation[]): string {
  if (citations.length === 0) return ''

  const lines = ['## Sources', '']

  citations.forEach((citation, index) => {
    const num = index + 1
    const date = new Date(citation.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

    lines.push(
      `${num}. **${citation.title}**  `,
      `   ${citation.url}  `,
      `   Posted by ${citation.author} on ${date} • ${citation.points} points • ${citation.num_comments} comments`,
      '',
    )
  })

  return lines.join('\n')
}

/**
 * High-level function to enrich content with HN context
 */
export async function enrichWithHN(
  prompt: string,
  options: {
    limit?: number
    minPoints?: number
  } = {},
): Promise<{
  citations: HNCitation[]
  contextText: string
}> {
  try {
    // Extract keywords from prompt
    const keywords = extractKeywords(prompt)
    const query = keywords.join(' ')

    if (!query) {
      return { citations: [], contextText: '' }
    }

    // Search HN
    const result = await searchHN(query, options)

    // Deduplicate
    const uniqueStories = deduplicateByUrl(result.hits)

    // Convert to citations
    const citations = storiesToCitations(uniqueStories)

    // Create context text for LLM
    const contextText = citations.map((cit, i) =>
      `[${i + 1}] ${cit.title} (${cit.points} points)`,
    ).join('\n')

    return { citations, contextText }
  } catch (error) {
    console.error('Failed to enrich with HN:', error)
    return { citations: [], contextText: '' }
  }
}

