import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DEMO_TAGS = [
  { name: 'JavaScript', slug: 'javascript' },
  { name: 'TypeScript', slug: 'typescript' },
  { name: 'React', slug: 'react' },
  { name: 'Next.js', slug: 'nextjs' },
  { name: 'Node.js', slug: 'nodejs' },
  { name: 'Python', slug: 'python' },
  { name: 'Machine Learning', slug: 'machine-learning' },
  { name: 'Web Development', slug: 'web-development' },
  { name: 'Frontend', slug: 'frontend' },
  { name: 'Backend', slug: 'backend' },
  { name: 'DevOps', slug: 'devops' },
  { name: 'Database', slug: 'database' },
  { name: 'CSS', slug: 'css' },
  { name: 'HTML', slug: 'html' },
  { name: 'API', slug: 'api' },
]

export async function POST() {
  try {
    // Create demo tags
    const createdTags = await Promise.all(
      DEMO_TAGS.map(async (tag) => {
        return await prisma.tag.upsert({
          where: { slug: tag.slug },
          update: {},
          create: {
            name: tag.name,
            slug: tag.slug,
          },
        })
      }),
    )

    return NextResponse.json({
      success: true,
      message: `Created ${createdTags.length} demo tags`,
      tags: createdTags,
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
