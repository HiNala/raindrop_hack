import OpenAI from 'openai'
import { markdownToTiptapJson, extractTitleFromMarkdown, extractExcerptFromMarkdown } from './markdown'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface GeneratePostOptions {
  tone?: 'professional' | 'casual' | 'technical'
  length?: 'short' | 'medium' | 'long'
  audience?: string
}

export interface GeneratedPost {
  title: string
  excerpt: string
  contentJson: object
  suggestedTags: string[]
  readTimeMin: number
}

/**
 * Generate a blog post from a prompt using OpenAI
 */
export async function generatePost(
  prompt: string,
  options: GeneratePostOptions = {}
): Promise<GeneratedPost> {
  const { tone = 'professional', length = 'medium', audience = 'web developers' } = options

  // Determine word count target
  const wordCountMap = {
    short: '500-800',
    medium: '1000-1500',
    long: '2000-3000',
  }
  const targetWords = wordCountMap[length]

  // Build system prompt
  const systemPrompt = `You are an expert blog writer. Write high-quality, engaging blog posts in markdown format.

Guidelines:
- Tone: ${tone}
- Target audience: ${audience}
- Length: ${targetWords} words
- Format: Use markdown with headings (##, ###), lists, bold, italic, code blocks
- Structure: Include introduction, main sections with subheadings, and conclusion
- Style: Clear, practical, and informative
- Include code examples where relevant (use \`\`\` code blocks)

Output format:
# [Compelling Title]

[Introduction paragraph that hooks the reader]

## Section 1
[Content]

## Section 2
[Content]

[Continue with more sections...]

## Conclusion
[Wrap up with key takeaways]

IMPORTANT: 
- Start directly with the title (# Title)
- Make the title compelling and SEO-friendly
- Write in a natural, engaging voice
- Use concrete examples
- Avoid generic advice`

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

    // Extract components
    const title = extractTitleFromMarkdown(markdown)
    const excerpt = extractExcerptFromMarkdown(markdown)
    const contentJson = markdownToTiptapJson(markdown)

    // Generate suggested tags using another quick API call
    const tagsCompletion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Extract 3-5 relevant tags from the blog post. Return only tag names separated by commas, lowercase.',
        },
        { role: 'user', content: markdown },
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
    const wordCount = markdown.split(/\s+/).length
    const readTimeMin = Math.max(1, Math.ceil(wordCount / 200))

    return {
      title,
      excerpt,
      contentJson,
      suggestedTags,
      readTimeMin,
    }
  } catch (error) {
    console.error('OpenAI generation error:', error)
    throw new Error('Failed to generate post. Please try again.')
  }
}


