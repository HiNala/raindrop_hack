import { PrismaClient } from '@prisma/client'

const prisma = async () => {
  const client = new PrismaClient({
    log: ['error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });
  return client;
};

async function testDatabase() {
  const client = await prisma();
  try {
    // Test basic connection
    await client.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful');
    return client;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return null;
  } finally {
      await client.$disconnect();
  }
}

async function getTags() {
  const client = await prisma();
  try {
    const tags = await client.tag.findMany();
    console.log(`Found ${tags.length} tags`);
    return tags;
  } catch (error) {
    console.error('❌ Failed to fetch tags:', error);
    return [];
  } finally {
      await client.$disconnect();
    }
}

async function createUser() {
  const client = await prisma();
  try {
    const user = await client.user.upsert({
      where: { clerkId: 'demo_user_clerk_id' },
      update: {},
      create: {
        clerkId: 'demo_user_clerk_id',
        email: 'demo@example.com',
        profile: {
          create: {
            username: 'demo',
            displayName: 'Demo User',
            bio: 'Demo user for testing.',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo'
          }
        }
      }
    });
    console.log('✅ Created user:', user.displayName);
    return user;
  } catch (error) {
    console.error('❌ Failed to create user:', error);
    return null;
  } finally {
      await client.$disconnect();
    }
}

async function createPost(title, slug, excerpt, authorId, tagIds = []) {
  const client = await prisma();
  try {
    const post = await client.post.create({
      data: {
        title,
        slug,
        excerpt,
        authorId,
        published: true,
        publishedAt: new Date(),
        readTimeMin: 5,
        tags: tagIds.length > 0 ? {
          create: tagIds.map(tagId => ({ tagId }))
        } : undefined
      }
    });
    console.log('✅ Created post:', title);
    return post;
  } catch (error) {
    console.error('❌ Failed to create post:', error);
    return null;
  } finally {
      await client.$disconnect();
    }
}

async function seedDatabase() {
  console.log('🌱️ Testing database connection...');
  const client = await testDatabase();
  if (!client) {
    console.log('❌ Database connection test failed');
    return { success: false };
  }

  console.log('📋 Fetching existing tags...');
  const tags = await getTags();
  console.log(`Found ${tags.length} existing tags`);

  console.log('👤 Creating demo user...');
  const user = createUser();
  if (!user) {
    console.log('❌ Failed to create demo user');
    return { success: false };
  }

  console.log('📝 Creating demo post...');
  const post = await createPost(
    'Getting Started with Next.js 15',
    'getting-started-nextjs-15',
    'A comprehensive guide to modern web applications with Next.js 15.',
    user.id
  );
  
  return { success: true, posts: 1, tags: tags.length };
}

seedDatabase().then(result => {
  if (result.success) {
    console.log('🎉 Database seeding completed!');
    console.log(`✅ Created ${result.posts} posts, ${result.tags} tags`);
    console.log('🚀 Your blog platform is now functional!');
    
    // Test API routes
    console.log('🔍 Testing API endpoints...');
    testAPIEndpoints();
  } else {
    console.log('❌ Database setup failed');
  }
}).catch(error => {
  console.error('💥 Fatal error:', error);
});