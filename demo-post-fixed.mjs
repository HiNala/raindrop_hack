import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createDemoPost() {
  try {
    console.log('🌱️ Creating demo post...');
    
    // Get or create demo user
    let demoUser = await prisma.user.findUnique({
      where: { clerkId: 'demo_user_clerk_id' },
      include: { profile: true }
    });

    if (!demoUser) {
      demoUser = await prisma.user.create({
        data: {
          clerkId: 'demo_user_clerk_id',
          email: 'demo@example.com',
          profile: {
            create: {
              username: 'demo',
              displayName: 'Demo User',
              bio: 'Demo user for the blog platform.',
              avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo'
            }
          }
        }
      });
    }

    // Get existing tags
    const nextjsTag = await prisma.tag.findUnique({
      where: { slug: 'nextjs' }
    });
    
    const webdevTag = await prisma.tag.findUnique({
      where: { slug: 'web-development' }
    });

    const tagIds = [];
    if (nextjsTag) tagIds.push(nextjsTag.id);
    if (webdevTag) tagIds.push(webdevTag.id);

    // Create a simple demo post
    const demoPost = await prisma.post.create({
      data: {
        title: 'Getting Started with Our Blog Platform',
        slug: 'getting-started-blog-platform',
        excerpt: 'A comprehensive introduction to our modern blog platform with AI-powered content generation.',
        contentJson: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Welcome to our modern blog platform! This post demonstrates the features available.'
                }
              ]
            },
            {
              type: 'heading',
              attrs: { level: 2 },
              content: [
                {
                  type: 'text',
                  text: 'Platform Features'
                }
              ]
            },
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Our platform includes modern UI, AI-powered content generation, real-time autosave, and much more.'
                }
              ]
            }
          ]
        },
        contentHtml: '<p>Welcome to our modern blog platform!</p><h2>Platform Features</h2><p>Modern UI, AI-powered content, and real-time autosave.</p>',
        readTimeMin: 3,
        published: true,
        publishedAt: new Date(),
        featured: true,
        authorId: demoUser.id,
        tags: tagIds.length > 0 ? {
          create: tagIds.map(tagId => ({ tagId }))
        } : undefined
      }
    });

    console.log('✅ Demo post created successfully!');
    console.log(`Title: ${demoPost.title}`);
    console.log(`Slug: ${demoPost.slug}`);
    console.log(`Author: ${demoUser.displayName}`);

    return demoPost;
  } catch (error) {
    console.error('❌ Failed to create demo post:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

createDemoPost().then(post => {
  if (post) {
    console.log('🎉 Database setup completed successfully!');
    console.log('🚀 Your blog platform is now functional!');
    
    // Test the app
    console.log('📝 Ready to start development server:');
    console.log('   npm run dev');
  } else {
    console.log('❌ Database setup failed');
  }
}).catch(error => {
  console.error('💥 Fatal error:', error);
});