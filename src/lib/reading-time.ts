/**
 * Calculate reading time in minutes based on word count
 * Assumes 200 words per minute (average reading speed)
 */
export function calculateReadingTime(content: string | object): number {
  let text = ''
  
  if (typeof content === 'string') {
    text = content
  } else {
    // Extract text from TipTap JSON structure
    text = extractTextFromJson(content)
  }
  
  // Count words (split by whitespace and filter empty strings)
  const words = text.trim().split(/\s+/).filter(word => word.length > 0).length
  
  // Calculate minutes (minimum 1 minute)
  const minutes = Math.max(1, Math.ceil(words / 200))
  
  return minutes
}

/**
 * Recursively extract text content from TipTap/Novel JSON structure
 */
function extractTextFromJson(node: any): string {
  if (!node) return ''
  
  let text = ''
  
  // If node has text property, add it
  if (node.text) {
    text += node.text + ' '
  }
  
  // If node has content array, recursively process children
  if (Array.isArray(node.content)) {
    for (const child of node.content) {
      text += extractTextFromJson(child)
    }
  }
  
  return text
}

/**
 * Format reading time for display
 */
export function formatReadingTime(minutes: number): string {
  if (minutes === 1) {
    return '1 min read'
  }
  return `${minutes} min read`
}


