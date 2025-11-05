import { AIGenerationHero } from '@/components/home/AIGenerationHero-simple'
import { PostCard } from '@/components/post/PostCard'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { ArrowRight, TrendingUp } from 'lucide-react'

// Mock data for frontend development
const getLatestPosts = () => [
  {
    id: "1",
    title: "Welcome to the Blog",
    slug: "welcome-to-the-blog",
    excerpt: "This is a sample post for frontend development.",
    coverImage: null,
    publishedAt: new Date(),
    readTimeMin: 5,
    viewCount: 120,
    author: {
      profile: {
        username: "demo_user",
        displayName: "Demo User",
        avatarUrl: null
      }
    },
    tags: [{ tag: { name: "demo", slug: "demo" } }],
    _count: { likes: 15, comments: 3 }
  },
  {
    id: "2",
    title: "Getting Started with Modern Web Development",
    slug: "getting-started-with-modern-web-development",
    excerpt: "A comprehensive guide to modern web development tools and practices.",
    coverImage: null,
    publishedAt: new Date(),
    readTimeMin: 8,
    viewCount: 250,
    author: {
      profile: {
        username: "tech_writer",
        displayName: "Tech Writer",
        avatarUrl: null
      }
    },
    tags: [
      { tag: { name: "webdev", slug: "webdev" } },
      { tag: { name: "tutorial", slug: "tutorial" } }
    ],
    _count: { likes: 32, comments: 8 }
  },
  {
    id: "3",
    title: "The Future of AI in Software Development",
    slug: "the-future-of-ai-in-software-development",
    excerpt: "Exploring how artificial intelligence is reshaping the way we write code and build software.",
    coverImage: null,
    publishedAt: new Date(),
    readTimeMin: 10,
    viewCount: 450,
    author: {
      profile: {
        username: "ai_expert",
        displayName: "AI Expert",
        avatarUrl: null
      }
    },
    tags: [
      { tag: { name: "ai", slug: "ai" } },
      { tag: { name: "future", slug: "future" } }
    ],
    _count: { likes: 67, comments: 14 }
  }
]

const getTrendingPosts = () => [
  {
    id: "4",
    title: "Understanding React Server Components",
    slug: "understanding-react-server-components",
    excerpt: "A deep dive into React's new Server Components paradigm and how it changes development.",
    coverImage: null,
    publishedAt: new Date(),
    readTimeMin: 12,
    viewCount: 320,
    author: {
      profile: {
        username: "react_dev",
        displayName: "React Developer",
        avatarUrl: null
      }
    },
    tags: [
      { tag: { name: "react", slug: "react" } },
      { tag: { name: "tutorial", slug: "tutorial" } }
    ],
    _count: { likes: 45, comments: 9 }
  }
]

const getPopularTags = () => [
  { id: "1", name: "JavaScript", slug: "javascript", _count: { posts: 10 } },
  { id: "2", name: "React", slug: "react", _count: { posts: 8 } },
  { id: "3", name: "TypeScript", slug: "typescript", _count: { posts: 6 } },
  { id: "4", name: "Next.js", slug: "nextjs", _count: { posts: 5 } },
  { id: "5", name: "AI", slug: "ai", _count: { posts: 7 } },
  { id: "6", name: "CSS", slug: "css", _count: { posts: 4 } },
  { id: "7", name: "Web Development", slug: "webdev", _count: { posts: 9 } },
  { id: "8", name: "Tutorial", slug: "tutorial", _count: { posts: 12 } }
]

export default function Home() {
  const latestPosts = getLatestPosts()
  const trendingPosts = getTrendingPosts()
  const popularTags = getPopularTags()

  return (
    <div className="min-h-screen">
      {/* AI Generation Hero */}
      <AIGenerationHero />

      {/* Popular Tags */}
      <section className="py-12 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Popular Topics
          </h2>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Link key={tag.id} href={`/tag/${tag.slug}`}>
                <Badge
                  variant="outline"
                  className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  {tag.name}
                  <span className="ml-2 text-gray-500 dark:text-gray-400">
                    {tag._count.posts}
                  </span>
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Feed */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
              Discover Stories
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Explore the latest insights from our community
            </p>
          </div>

          <Tabs defaultValue="latest" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="latest" className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Latest
              </TabsTrigger>
              <TabsTrigger value="trending" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Trending
              </TabsTrigger>
            </TabsList>

            <TabsContent value="latest" className="mt-0">
              {latestPosts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                    No posts yet. Be the first to write!
                  </p>
                  <Link
                    href="/editor/new"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    Create Your First Post
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {latestPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="trending" className="mt-0">
              {trendingPosts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    No trending posts this week. Check back soon!
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {trendingPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Share Your Story?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of writers sharing their expertise and passion. Start writing today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/posts"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Explore More Posts
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}