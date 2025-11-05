import { z } from 'zod'
import { HNContextPack } from '@/lib/schemas/hackernews.schema'

export const PromptOptionsSchema = z.object({
  tone: z.enum(['professional', 'casual', 'technical', 'educational', 'storytelling']).default('professional'),
  length: z.enum(['short', 'medium', 'long', 'detailed']).default('medium'),
  audience: z.enum(['beginners', 'intermediate', 'experts', 'mixed']).default('mixed'),
  format: z.enum(['article', 'tutorial', 'opinion', 'analysis', 'case-study']).default('article'),
  includeExamples: z.boolean().default(true),
  includeCode: z.boolean().default(true),
  includeSteps: z.boolean().default(false),
  includeConclusion: z.boolean().default(true),
  customInstructions: z.string().optional(),
  hnContextStyle: z.enum(['integrated', 'reference', 'appendix']).default('integrated'),
})

export type PromptOptions = z.infer<typeof PromptOptionsSchema>

export class PromptBuilder {
  /**
   * Build comprehensive prompt with HN context and advanced options
   */
  static buildPrompt(
    userPrompt: string,
    options: PromptOptions = {},
    hnContext?: HNContextPack,
  ): string {
    const validatedOptions = PromptOptionsSchema.parse(options)

    // Base system prompt
    const systemPrompt = this.getBaseSystemPrompt(validatedOptions)

    // HN context section
    const hnContextSection = hnContext ? this.buildHNContextSection(hnContext, validatedOptions) : ''

    // Length and structure guidelines
    const structureGuidelines = this.getStructureGuidelines(validatedOptions)

    // Tone and style guidelines
    const styleGuidelines = this.getStyleGuidelines(validatedOptions)

    // Custom instructions
    const customSection = validatedOptions.customInstructions
      ? `\n\nCustom Requirements:\n${validatedOptions.customInstructions}`
      : ''

    // Final prompt assembly
    return [
      systemPrompt,
      hnContextSection,
      structureGuidelines,
      styleGuidelines,
      customSection,
      '\n\nUser Request:',
      userPrompt,
      '\n\nGenerate a comprehensive blog post based on this request and all the guidelines above.',
    ].filter(Boolean).join('\n')
  }

  /**
   * Get base system prompt based on options
   */
  private static getBaseSystemPrompt(options: PromptOptions): string {
    const { tone, format, audience } = options

    const toneInstructions = {
      professional: 'Write in a professional, authoritative tone suitable for industry experts and business leaders.',
      casual: 'Write in a friendly, conversational tone that feels like you\'re talking to a knowledgeable friend.',
      technical: 'Write with technical depth and precision, using appropriate terminology and detailed explanations.',
      educational: 'Write in a clear, teaching-focused tone that helps readers understand concepts step by step.',
      storytelling: 'Write with narrative flair, using stories and examples to illustrate your points.',
    }

    const formatInstructions = {
      article: 'Structure as a well-organized article with clear sections and smooth transitions.',
      tutorial: 'Structure as a step-by-step tutorial with clear instructions and practical examples.',
      opinion: 'Structure as an opinion piece with strong arguments, evidence, and thoughtful analysis.',
      analysis: 'Structure as an in-depth analysis with data, insights, and strategic thinking.',
      'case-study': 'Structure as a case study with real-world examples, challenges, and outcomes.',
    }

    const audienceInstructions = {
      beginners: 'Assume readers have little to no prior knowledge. Explain concepts from first principles.',
      intermediate: 'Assume readers have basic familiarity. Build on existing knowledge with deeper insights.',
      experts: 'Assume readers are knowledgeable. Focus on advanced concepts, nuances, and expert-level insights.',
      mixed: 'Cater to various knowledge levels. Start accessible and gradually introduce complexity.',
    }

    return `You are an expert technical writer creating high-quality blog content.

${toneInstructions[tone]}
${formatInstructions[format]}
${audienceInstructions[audience]}`
  }

  /**
   * Build Hacker News context section
   */
  private static buildHNContextSection(hnContext: HNContextPack, options: PromptOptions): string {
    const { hnContextStyle } = options
    const { citations } = hnContext

    const contextText = hnContext.contextText

    // Add citation usage guidelines based on style
    const citationGuidelines = {
      integrated: 'Weave HN discussions naturally throughout your content using [HN-X] markers when relevant.',
      reference: 'Reference HN discussions in a dedicated section using [HN-X] markers for each citation.',
      appendix: 'Include all HN references in an appendix section with [HN-X] markers linking to detailed discussion points.',
    }

    return `

Context from Hacker News Discussions:
${contextText}

HN Usage Guidelines:
${citationGuidelines[hnContextStyle]}
Available Citations: ${citations.length} discussions to reference (${citations.map(c => c.id).join(', ')})`
  }

  /**
   * Get structure guidelines based on options
   */
  private static getStructureGuidelines(options: PromptOptions): string {
    const { length, includeExamples, includeCode, includeSteps, includeConclusion } = options

    const lengthGuidelines = {
      short: 'Aim for 400-600 words (2-3 minutes reading time).',
      medium: 'Aim for 800-1200 words (4-6 minutes reading time).',
      long: 'Aim for 1500-2500 words (7-12 minutes reading time).',
      detailed: 'Aim for 2500+ words (15+ minutes reading time) with comprehensive coverage.',
    }

    const sections = ['## Introduction', '## Main Content', '## Conclusion']

    if (includeSteps) {
      sections.splice(2, 0, '## Step-by-Step Guide')
    }

    const guidelines = []

    guidelines.push(`Target Length: ${lengthGuidelines[length]}`)
    guidelines.push(`Structure: ${sections.join(' → ')}`)

    if (includeExamples) {
      guidelines.push('Include practical examples and real-world applications.')
    }

    if (includeCode) {
      guidelines.push('Include relevant code examples with syntax highlighting and explanations.')
    }

    if (!includeConclusion) {
      guidelines.push('Skip the formal conclusion; end with a strong final point or call to action.')
    }

    guidelines.push('Use markdown formatting: ## for headings, ``` for code blocks, > for quotes, ** for bold.')
    guidelines.push('Include a compelling title and brief excerpt (150 characters max).')

    return `

Structure Guidelines:
${guidelines.map(g => `- ${g}`).join('\n')}`
  }

  /**
   * Get style guidelines based on options
   */
  private static getStyleGuidelines(options: PromptOptions): string {
    const { tone, includeExamples, includeCode } = options

    const guidelines = []

    // Tone-specific style guidance
    switch (tone) {
      case 'professional':
        guidelines.push('Use formal language, avoid slang, maintain objectivity.')
        guidelines.push('Include data, research, or expert opinions to support claims.')
        break
      case 'casual':
        guidelines.push('Use conversational language, contractions are acceptable.')
        guidelines.push('Share personal experiences and insights where appropriate.')
        break
      case 'technical':
        guidelines.push('Use precise terminology and provide detailed explanations.')
        guidelines.push('Include technical specifications, diagrams, or code architectures.')
        break
      case 'educational':
        guidelines.push('Break down complex concepts into digestible pieces.')
        guidelines.push('Use analogies and metaphors to explain difficult ideas.')
        break
      case 'storytelling':
        guidelines.push('Use narrative elements: characters, conflicts, resolutions.')
        guidelines.push('Create emotional connection through vivid descriptions and examples.')
        break
    }

    // Content-specific guidance
    if (includeExamples) {
      guidelines.push('For each major point, include at least one concrete example.')
      guidelines.push('Examples should be practical and immediately applicable.')
    }

    if (includeCode) {
      guidelines.push('Code examples should be complete, tested, and well-commented.')
      guidelines.push('Explain the what, why, and how of each code snippet.')
    }

    guidelines.push('Maintain consistent voice and style throughout.')
    guidelines.push('Use active voice preferentially; passive voice only when appropriate.')
    guidelines.push('Vary sentence structure to maintain reader engagement.')

    return `

Style Guidelines:
${guidelines.map(g => `- ${g}`).join('\n')}`
  }

  /**
   * Generate prompt variations for testing
   */
  static generatePromptVariations(basePrompt: string): string[] {
    const variations = [
      // More concise version
      basePrompt
        .split('\n')
        .filter(line => !line.trim().startsWith('#'))
        .join('\n'),

      // More focused on HN context
      `${basePrompt  }\n\nPay special attention to integrating Hacker News insights naturally throughout the content.`,

      // More focused on practical examples
      `${basePrompt  }\n\nEmphasize practical, real-world examples that readers can apply immediately.`,

      // More conversational
      basePrompt.replace(/professional/g, 'conversational')
        .replace(/formal/g, 'friendly'),
    ]

    return variations
  }

  /**
   * Validate generated content against requirements
   */
  static validateContent(content: string, options: PromptOptions): {
    isValid: boolean
    issues: string[]
    suggestions: string[]
  } {
    const issues: string[] = []
    const suggestions: string[] = []

    // Check length requirements
    const wordCount = content.split(/\s+/).length
    const targetLengths = {
      short: { min: 300, max: 700 },
      medium: { min: 700, max: 1400 },
      long: { min: 1400, max: 3000 },
      detailed: { min: 2500, max: Infinity },
    }

    const targetLength = targetLengths[options.length]
    if (wordCount < targetLength.min) {
      issues.push(`Content is too short: ${wordCount} words (minimum: ${targetLength.min})`)
    } else if (wordCount > targetLength.max) {
      suggestions.push(`Content is quite long: ${wordCount} words. Consider if all sections are necessary.`)
    }

    // Check structure
    const headings = content.match(/^##\s+.+$/gm) || []
    if (headings.length < 2) {
      suggestions.push('Consider adding more section headings to improve structure.')
    }

    // Check for examples if required
    if (options.includeExamples && !content.includes('example') && !content.includes('For instance')) {
      suggestions.push('Consider adding practical examples as requested.')
    }

    // Check for code if required
    if (options.includeCode && !content.includes('```')) {
      suggestions.push('Consider adding code examples as requested.')
    }

    // Check for HN citations
    const hnCitations = content.match(/\[HN-\d+\]/g) || []
    if (hnCitations.length > 0) {
      suggestions.push(`Found ${hnCitations.length} HN citations. Ensure they appear in the Sources section.`)
    }

    // Check conclusion
    if (options.includeConclusion && !content.toLowerCase().includes('conclusion')) {
      suggestions.push('Consider adding a conclusion section as requested.')
    }

    return {
      isValid: issues.length === 0,
      issues,
      suggestions,
    }
  }

  /**
   * Extract metadata from generated content
   */
  static extractMetadata(content: string): {
    title?: string
    excerpt?: string
    wordCount: number
    readingTime: number
    headings: string[]
    codeBlocks: number
    hnCitations: number
  } {
    // Extract title (first # heading or bold text at start)
    const titleMatch = content.match(/^#\s+(.+)$/m) || content.match(/^\*\*(.+)\*\*/m)
    const title = titleMatch ? titleMatch[1].trim() : undefined

    // Generate excerpt (first paragraph)
    const firstParagraph = content.split('\n\n')[0]?.replace(/^#+\s*/gm, '').replace(/\*\*/g, '').trim()
    const excerpt = firstParagraph ? firstParagraph.slice(0, 150) + (firstParagraph.length > 150 ? '...' : '') : undefined

    // Count words
    const wordCount = content.split(/\s+/).filter(Boolean).length

    // Calculate reading time (200 words per minute)
    const readingTime = Math.ceil(wordCount / 200)

    // Extract headings
    const headings = (content.match(/^##\s+(.+)$/gm) || []).map(h => h.replace(/^##\s+/, ''))

    // Count code blocks
    const codeBlocks = (content.match(/```/g) || []).length / 2

    // Count HN citations
    const hnCitations = (content.match(/\[HN-\d+\]/g) || []).length

    return {
      title,
      excerpt,
      wordCount,
      readingTime,
      headings,
      codeBlocks,
      hnCitations,
    }
  }
}

// Export for easy usage
export const promptBuilder = PromptBuilder
