import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

/**
 * Convert markdown to TipTap/Novel JSON format
 * This is a simplified conversion - Novel editor can handle this
 */
export function markdownToTiptapJson(markdown: string): object {
  // For now, return a basic structure
  // In production, you'd want a more sophisticated parser
  // or use TipTap's generateJSON on the server

  const paragraphs = markdown.split('\n\n').filter(p => p.trim())

  const content: any[] = []

  for (const para of paragraphs) {
    const trimmed = para.trim()

    // Heading
    if (trimmed.startsWith('# ')) {
      content.push({
        type: 'heading',
        attrs: { level: 1 },
        content: [{ type: 'text', text: trimmed.substring(2) }],
      })
    } else if (trimmed.startsWith('## ')) {
      content.push({
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: trimmed.substring(3) }],
      })
    } else if (trimmed.startsWith('### ')) {
      content.push({
        type: 'heading',
        attrs: { level: 3 },
        content: [{ type: 'text', text: trimmed.substring(4) }],
      })
    }
    // List items
    else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const items = trimmed.split('\n').filter(l => l.startsWith('- ') || l.startsWith('* '))
      content.push({
        type: 'bulletList',
        content: items.map(item => ({
          type: 'listItem',
          content: [{
            type: 'paragraph',
            content: [{ type: 'text', text: item.substring(2) }],
          }],
        })),
      })
    }
    // Regular paragraph
    else {
      // Handle bold and italic
      const text = trimmed
      const hasFormatting = /\*\*|\*|__|\||`/.test(text)

      if (hasFormatting) {
        // Simple formatting - in production use a proper parser
        content.push({
          type: 'paragraph',
          content: [{ type: 'text', text }],
        })
      } else {
        content.push({
          type: 'paragraph',
          content: [{ type: 'text', text }],
        })
      }
    }
  }

  return {
    type: 'doc',
    content,
  }
}

/**
 * Extract title from markdown content
 */
export function extractTitleFromMarkdown(markdown: string): string {
  const lines = markdown.split('\n')
  for (const line of lines) {
    if (line.startsWith('# ')) {
      return line.substring(2).trim()
    }
  }
  return 'Untitled Post'
}

/**
 * Extract excerpt from markdown content
 */
export function extractExcerptFromMarkdown(markdown: string, maxLength: number = 200): string {
  // Remove title (first h1)
  let content = markdown.replace(/^#\s+.+\n\n?/, '')

  // Remove markdown formatting
  content = content
    .replace(/#{1,6}\s+/g, '') // Remove headings
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links
    .replace(/`(.+?)`/g, '$1') // Remove code
    .replace(/^[-*]\s+/gm, '') // Remove list markers
    .trim()

  // Get first paragraph and truncate
  const firstPara = content.split('\n\n')[0] || content

  if (firstPara.length <= maxLength) {
    return firstPara
  }

  return `${firstPara.substring(0, maxLength).trim()  }...`
}


