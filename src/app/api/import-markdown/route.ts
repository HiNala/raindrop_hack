import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

// Convert markdown to TipTap JSON
function markdownToTiptap(markdown: string): any {
  // Parse markdown to HTML
  const html = md.render(markdown)

  // Convert HTML to TipTap JSON
  // This is a simplified conversion - TipTap's generateJSON would be ideal
  // but we'll create a basic structure
  const lines = markdown.split('\n')
  const content: any[] = []

  let currentParagraph: string[] = []

  for (const line of lines) {
    // Headings
    if (line.startsWith('### ')) {
      if (currentParagraph.length > 0) {
        content.push({
          type: 'paragraph',
          content: [{ type: 'text', text: currentParagraph.join(' ') }],
        })
        currentParagraph = []
      }
      content.push({
        type: 'heading',
        attrs: { level: 3 },
        content: [{ type: 'text', text: line.replace('### ', '') }],
      })
    } else if (line.startsWith('## ')) {
      if (currentParagraph.length > 0) {
        content.push({
          type: 'paragraph',
          content: [{ type: 'text', text: currentParagraph.join(' ') }],
        })
        currentParagraph = []
      }
      content.push({
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: line.replace('## ', '') }],
      })
    } else if (line.startsWith('# ')) {
      if (currentParagraph.length > 0) {
        content.push({
          type: 'paragraph',
          content: [{ type: 'text', text: currentParagraph.join(' ') }],
        })
        currentParagraph = []
      }
      content.push({
        type: 'heading',
        attrs: { level: 1 },
        content: [{ type: 'text', text: line.replace('# ', '') }],
      })
    } else if (line.trim() === '') {
      if (currentParagraph.length > 0) {
        content.push({
          type: 'paragraph',
          content: [{ type: 'text', text: currentParagraph.join(' ') }],
        })
        currentParagraph = []
      }
    } else {
      currentParagraph.push(line)
    }
  }

  // Add remaining paragraph
  if (currentParagraph.length > 0) {
    content.push({
      type: 'paragraph',
      content: [{ type: 'text', text: currentParagraph.join(' ') }],
    })
  }

  return {
    type: 'doc',
    content: content.length > 0 ? content : [{ type: 'paragraph' }],
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function extractTitle(markdown: string): string {
  const lines = markdown.split('\n')
  for (const line of lines) {
    if (line.startsWith('# ')) {
      return line.replace('# ', '').trim()
    }
  }
  return 'Imported Post'
}

function extractExcerpt(markdown: string): string {
  const lines = markdown.split('\n')
  let excerpt = ''

  for (const line of lines) {
    if (line.trim() && !line.startsWith('#')) {
      excerpt = line.trim()
      break
    }
  }

  return excerpt.substring(0, 200)
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { markdown, title: providedTitle } = await req.json()

    if (!markdown) {
      return NextResponse.json({ error: 'Markdown content is required' }, { status: 400 })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { clerkId: session.userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Extract metadata
    const title = providedTitle || extractTitle(markdown)
    const excerpt = extractExcerpt(markdown)
    const slug = generateSlug(title)

    // Convert markdown to TipTap JSON
    const contentJson = markdownToTiptap(markdown)

    // Calculate read time (words per minute average)
    const wordCount = markdown.split(/\s+/).length
    const readTimeMin = Math.ceil(wordCount / 200)

    // Create draft post
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        contentJson,
        published: false,
        readTimeMin,
        authorId: user.id,
      },
    })

    return NextResponse.json({
      success: true,
      postId: post.id,
      redirect: `/editor/${post.id}`,
    })
  } catch (error) {
    console.error('Import markdown error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Import failed' },
      { status: 500 }
    )
  }
}
