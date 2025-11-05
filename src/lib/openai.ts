import OpenAI from 'openai'
import { markdownToTiptapJson, extractTitleFromMarkdown, extractExcerptFromMarkdown } from './markdown'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface GeneratePostOptions {
  tone?: 'professional' | 'casual' | 'technical'
  length?: 'short' | 'medium' | 'long'
  audience?: string
  hnContext?: HNContext | null
}

export interface HNContext {
  contextText: string
  citations: Array<{
    title: string
    url: string
    author: string
    points: number
    created_at: string
    num_comments: number
  }>
  citationsMarkdown: string
}

export interface HNSource {
  title: string
  url: string
  author: string
  points: number
  comments: number
  date: string
}

export interface GeneratedPost {
  title: string
  excerpt: string
  contentJson: object
  suggestedTags: string[]
  readTimeMin: number
  hnSources?: HNSource[]
}

/**
 * Format HN context for AI prompt
 */
function formatHNContext(hnContext: HNContext): string {
  if (!hnContext || hnContext.citations.length === 0) {
    return ''
  }

  const topResults = hnContext.citations.map((citation, index) => {
    const date = new Date(citation.created_at).toLocaleDateString()
    return `[HN-${index + 1}] ${citation.title} (${citation.points} points, ${citation.num_comments} comments)\nURL: ${citation.url}\nAuthor: ${citation.author} | Date: ${date}\n`
  }).join('\n')

  return `

## Hacker News Context
Here are some relevant discussions from Hacker News that you can reference:

${topResults}

When referencing these sources in your article, use the format [HN-X] where X is the number (e.g., [HN-1]). Weave these references naturally into your content where relevant.`
}

/**
 * Generate sources section from HN context
 */
function generateSourcesSection(hnContext: HNContext | null): string {
  if (!hnContext || hnContext.citations.length === 0) {
    return ''
  }

  return `\n\n${hnContext.citationsMarkdown}`
}

/**
 * Extract HN sources for tracking
 */
function extractHNSources(hnContext: HNContext | null): HNSource[] {
  if (!hnContext) return []

  return hnContext.citations.map(citation => ({
    title: citation.title,
    url: citation.url,
    author: citation.author,
    points: citation.points,
    comments: citation.num_comments,
    date: new Date(citation.created_at).toLocaleDateString(),
  }))
}

/**
 * Generate a blog post from a prompt using OpenAI
 */
export async function generatePost(
  prompt: string,
  options: GeneratePostOptions = {},
): Promise<GeneratedPost> {
  const { tone = 'professional', length = 'medium', audience = 'web developers', hnContext } = options

  // Determine word count target
  const wordCountMap = {
    short: '500-800',
    medium: '1000-1500',
    long: '2000-3000',
  }
  const targetWords = wordCountMap[length]

  // Build system prompt with HN context
  let hnContextText = ''
  if (hnContext && hnContext.citations.length > 0) {
    hnContextText = formatHNContext(hnContext)
  }

  const systemPrompt = `You are an expert blog writer. Write high-quality, engaging blog posts in markdown format.

Guidelines:
- Tone: ${tone}
- Target audience: ${audience}
- Length: ${targetWords} words
- Format: Use markdown with headings (##, ###), lists, bold, italic, code blocks
- Structure: Include introduction, main sections with subheadings, and conclusion
- Style: Clear, practical, and informative
- Include code examples where relevant (use \`\`\` code blocks)
${hnContext?.citations?.length ? '- Reference Hacker News discussions naturally using [HN-X] format' : ''}

Output format:
# [Compelling Title]

[Introduction paragraph that hooks the reader]

## Section 1
[Content]

## Section 2
[Content]

[Continue with more sections...]

## Conclusion
[Wrap up with key takeaways]${hnContextText ? generateSourcesSection(hnContext) : ''}

IMPORTANT: 
- Start directly with the title (# Title)
- Make the title compelling and SEO-friendly
- Write in a natural, engaging voice
- Use concrete examples
- Avoid generic advice
- If you include HN references, make them feel natural and relevant to the content`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Write a blog post about: ${prompt}` },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    })

    const markdown = completion.choices[0]?.message?.content || '# Untitled\n\nContent generation failed.'

    // Remove sources section from main content if it exists (we'll track it separately)
    const mainContent = markdown.split('## Sources')[0]

    // Extract components
    const title = extractTitleFromMarkdown(mainContent)
    const excerpt = extractExcerptFromMarkdown(mainContent)
    const contentJson = markdownToTiptapJson(mainContent)

    // Generate suggested tags using another quick API call
    const tagsCompletion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Extract 3-5 relevant tags from the blog post. Return only tag names separated by commas, lowercase.',
        },
        { role: 'user', content: mainContent },
      ],
      temperature: 0.3,
      max_tokens: 50,
    })

    const tagsText = tagsCompletion.choices[0]?.message?.content || ''
    const suggestedTags = tagsText
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .slice(0, 5)

    // Estimate reading time (rough calculation)
    const wordCount = mainContent.split(/\s+/).length
    const readTimeMin = Math.max(1, Math.ceil(wordCount / 200))

    return {
      title,
      excerpt,
      contentJson,
      suggestedTags,
      readTimeMin,
      hnSources: extractHNSources(hnContext),
    }
  } catch (error) {
    console.error('OpenAI generation error:', error)
    throw new Error('Failed to generate post. Please try again.')
  }
}
