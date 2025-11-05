import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

const DEMO_POSTS = [
  {
    title: "Getting Started with Next.js 15",
    slug: "getting-started-nextjs-15",
    excerpt: "A comprehensive guide to building modern web applications with Next.js 15, including the latest App Router features and optimization techniques.",
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Next.js 15 brings exciting new features that make building modern web applications easier than ever. In this guide, we'll explore the key improvements and how you can leverage them in your projects."
            }
          ]
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [
            {
              type: "text",
              text: "What's New in Next.js 15"
            }
          ]
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "The latest version introduces significant improvements to the App Router, enhanced caching strategies, and better developer experience with improved error messages and debugging capabilities."
            }
          ]
        },
        {
          type: "heading",
          attrs: { level: 3 },
          content: [
            {
              type: "text",
              text: "App Router Enhancements"
            }
          ]
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "The App Router now supports better streaming, improved loading states, and more granular control over caching. This means faster initial page loads and smoother user experiences."
            }
          ]
        }
      ]
    },
    tags: ['nextjs', 'react', 'web-development'],
    readTimeMin: 5,
  },
  {
    title: "TypeScript Best Practices in 2024",
    slug: "typescript-best-practices-2024",
    excerpt: "Learn the essential TypeScript patterns and practices that will make your code more maintainable, type-safe, and developer-friendly in modern applications.",
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "TypeScript continues to evolve as one of the most popular programming languages for web development. Let's explore the best practices that will help you write better, more maintainable code."
            }
          ]
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [
            {
              type: "text",
              text: "Core TypeScript Patterns"
            }
          ]
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Understanding TypeScript's type system is crucial for building robust applications. From utility types to conditional types, these patterns will elevate your code quality."
            }
          ]
        }
      ]
    },
    tags: ['typescript', 'javascript', 'web-development'],
    readTimeMin: 7,
  },
  {
    title: "Building Scalable React Applications",
    slug: "building-scalable-react-applications",
    excerpt: "Discover the architectural patterns and best practices for building React applications that can scale from small projects to enterprise-level applications.",
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Scalability is a critical consideration when building React applications. As your application grows, proper architecture becomes essential for maintaining performance and developer productivity."
            }
          ]
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [
            {
              type: "text",
              text: "Architecture Principles"
            }
          ]
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Learn how to structure your React application using proven patterns like component composition, state management strategies, and performance optimization techniques."
            }
          ]
        }
      ]
    },
    tags: ['react', 'javascript', 'frontend'],
    readTimeMin: 8,
  }
]

async function main() {
  console.log('🌱 Starting database seeding...')

  try {
    // Create tags
    console.log('📝 Creating tags...')
    const createdTags = await Promise.all(
      DEMO_TAGS.map(async (tag) => {
        return await prisma.tag.upsert({
          where: { slug: tag.slug },
          update: {},
          create: tag,
        })
      })
    )
    console.log(`✅ Created ${createdTags.length} tags`)

    // Create a demo user
    console.log('👤 Creating demo user...')
    const demoUser = await prisma.user.upsert({
      where: { clerkId: 'demo_user_clerk_id' },
      update: {},
      create: {
        clerkId: 'demo_user_clerk_id',
        email: 'demo@example.com',
        profile: {
          create: {
            username: 'demo',
            displayName: 'Demo User',
            bio: 'A demonstration user for the blog platform. This user showcases the platform features with sample content.',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
          },
        },
      },
      include: { profile: true }
    })
    console.log(`✅ Created demo user: ${demoUser.profile?.displayName}`)

    // Create demo posts
    console.log('📄 Creating demo posts...')
    const tagMap = new Map(createdTags.map(tag => [tag.name, tag]))
    
    for (const postData of DEMO_POSTS) {
      const post = await prisma.post.create({
        data: {
          authorId: demoUser.id,
          title: postData.title,
          slug: postData.slug,
          excerpt: postData.excerpt,
          contentJson: postData.content,
          readTimeMin: postData.readTimeMin,
          published: true,
          publishedAt: new Date(),
          tags: {
            create: postData.tags.map(tagName => ({
              tag: {
                connect: { id: tagMap.get(tagName)!.id }
              }
            }))
          }
        }
      })
      console.log(`✅ Created post: "${post.title}"`)
    }

    console.log('🎉 Database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`   - Tags: ${createdTags.length}`)
    console.log(`   - Users: 1`)
    console.log(`   - Posts: ${DEMO_POSTS.length}`)
    
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })