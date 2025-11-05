import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedDatabase() {
  try {
    console.log('🌱️ Starting database seeding...')
    
    // Create demo tags
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
      { name: 'devops', slug: 'devops' },
      { name: 'Database', slug: 'database' },
      { name: 'API', slug: 'api' },
      { name: 'CSS', slug: 'css' },
      { name: 'HTML', slug: 'html' }
    ];
    
    console.log('Creating demo tags...');
    for (const tag of DEMO_TAGS) {
      await prisma.tag.upsert({
        where: { slug: tag.slug },
        update: {},
        create: tag
      });
    }

    // Create demo user
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
            bio: 'A demonstration user for the blog platform.',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo'
          }
        }
      }
    });

    // Create demo posts
    const DEMO_POSTS = [
      {
        title: 'Getting Started with Next.js 15',
        slug: 'getting-started-nextjs-15',
        excerpt: 'A comprehensive guide to building modern web applications with Next.js 15.',
        contentJson: {
          type: 'doc',
          content: [
            { type: 'paragraph', content: [{ type: 'text', text: 'Next.js 15 brings exciting new features.' }] },
            { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'What\'s New in Next.js 15?' }] }
          ]
        }
      },
      {
        title: 'TypeScript Best Practices in 2024',
        slug: 'typescript-best-practices-2024',
        excerpt: 'Learn essential TypeScript patterns for maintainable code.',
        contentJson: {
          type: 'dd',
          content: [
            { type: 'paragraph', content: [{ type: 'text', text: 'TypeScript continues to evolve.' }] },
            { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Understanding TypeScript\'s type system is crucial.' }] }
          ]
        }
      }
    ];

    for (const postData of DEMO_POSTS) {
      // Get tag IDs
      const existingTags = await prisma.tag.findMany();
      const tagMap = new Map();
      existingTags.forEach(tag => tagMap.set(tag.name, tag.id));
      
      const post = await prisma.post.create({
        data: {
          authorId: demoUser.id,
          title: postData.title,
          slug: postData.slug,
          excerpt: postData.excerpt,
          contentJson: postData.contentJson,
          readTimeMin: Math.max(1, Math.ceil(JSON.stringify(postData.contentJson).length / 200)),
          published: true,
          publishedAt: new Date(),
          featured: postData.slug === 'getting-started-nextjs-15',
          tags: {
            create: postData.tags.map(tagName => ({
              tagId: tagMap.get(tagName) || null
            })).filter(Boolean)
          }
        }
      });
      
      console.log('✅ Created post:', post.title);
    }

    console.log('🎉 Database seeding completed!');
    console.log('Created demo posts and tags');
    
    return { success: true, posts: DEMO_POSTS.length, tags: DEMO_TAGS.length };
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    return { success: false, error: error.message };
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase().then(result => {
  if (result.success) {
    console.log('🎉 Success! Database seeded');
    console.log(`Created ${result.posts} posts, ${result.tags} tags`);
  } else {
    console.log('❌ Seeding failed:', result.error);
  }
}).catch(error => {
  console.error('Fatal error:', error);
});