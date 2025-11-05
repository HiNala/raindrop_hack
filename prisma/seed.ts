import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create some demo tags
  const tags = [
    { name: 'Web Development', slug: 'web-development' },
    { name: 'JavaScript', slug: 'javascript' },
    { name: 'TypeScript', slug: 'typescript' },
    { name: 'React', slug: 'react' },
    { name: 'Next.js', slug: 'nextjs' },
    { name: 'AI & ML', slug: 'ai-ml' },
    { name: 'DevOps', slug: 'devops' },
    { name: 'Career', slug: 'career' },
    { name: 'Tutorial', slug: 'tutorial' },
    { name: 'Best Practices', slug: 'best-practices' },
  ]

  console.log('Creating tags...')
  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    })
  }
  console.log(`✅ Created ${tags.length} tags`)

  // Note: We don't create demo users here because users are managed by Clerk
  // Users will be automatically created when they first sign in via the auth sync utility

  console.log('✅ Database seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error during database seed:')
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
