import { prisma } from '@/lib/prisma'
import { AIGenerationHero } from '@/components/home/AIGenerationHero-simple'
import { PostCard } from '@/components/post/PostCard'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Sparkles, Zap } from 'lucide-react'

// Temporary mock data for frontend development
async function getLatestPosts() {
  return [
    {
      id: "1",
      title: "Welcome to the Blog",
      slug: "welcome-to-the-blog",
      excerpt: "This is a sample post for frontend development.",
      publishedAt: new Date(),
      author: {
        profile: {
          username: "demo_user",
          displayName: "Demo User",
          avatarUrl: null
        }
      },
      tags: [
        { tag: { name: "demo", slug: "demo" } }
      ],
      _count: {
        likes: 5,
        comments: 2
      }
    }
  ]
}

async function getTrendingPosts() {
  return [
    {
      id: "2", 
      title: "Trending Sample Post",
      slug: "trending-sample-post",
      excerpt: "This is a trending sample post.",
      publishedAt: new Date(),
      author: {
        profile: {
          username: "trending_user",
          displayName: "Trending User", 
          avatarUrl: null
        }
      },
      tags: [
        { tag: { name: "trending", slug: "trending" } }
      ],
      _count: {
        likes: 15,
        comments: 8
      }
    }
  ]
}

async function getPopularTags() {
  return [
    { id: "1", name: "JavaScript", slug: "javascript", _count: { posts: 10 } },
    { id: "2", name: "React", slug: "react", _count: { posts: 8 } },
    { id: "3", name: "TypeScript", slug: "typescript", _count: { posts: 6 } },
    { id: "4", name: "Next.js", slug: "nextjs", _count: { posts: 5 } },
    { id: "5", name: "CSS", slug: "css", _count: { posts: 4 } }
  ]
}

export default async function Home() {
  const [latestPosts, trendingPosts, popularTags] = await Promise.all([
    getLatestPosts(),
    getTrendingPosts(),
    getPopularTags(),
  ])

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* AI Generation Hero */}
      <AIGenerationHero />

      {/* Popular Tags Section */}
      <section className="py-16 border-y border-dark-border bg-dark-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-5 h-5 text-teal-400" />
            <h2 className="text-2xl font-bold text-text-primary">
              Popular Topics
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {popularTags.map((tag) => (
              <Link key={tag.id} href={`/tag/${tag.slug}`}>
                <Badge
                  className="px-5 py-2.5 text-sm bg-dark-card border-dark-border text-text-primary hover:border-teal-500/50 hover:bg-dark-hover hover:shadow-glow-teal transition-all cursor-pointer group"
                >
                  {tag.name}
                  <span className="ml-2 text-text-tertiary group-hover:text-teal-400 transition-colors">
                    {tag._count.posts}
                  </span>
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Feed Section */}
      <section className="py-20 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-3 text-text-primary flex items-center gap-3">
              <Zap className="w-8 h-8 text-orange-500" />
              Discover Stories
            </h2>
            <p className="text-lg text-text-secondary">
              Explore the latest insights from our community
            </p>
          </div>

          <Tabs defaultValue="latest" className="w-full">
            <TabsList className="mb-10 bg-dark-card border border-dark-border p-1">
              <TabsTrigger 
                value="latest" 
                className="flex items-center gap-2 data-[state=active]:bg-teal-500 data-[state=active]:text-white"
              >
                <ArrowRight className="w-4 h-4" />
                Latest
              </TabsTrigger>
              <TabsTrigger 
                value="trending" 
                className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                <TrendingUp className="w-4 h-4" />
                Trending
              </TabsTrigger>
            </TabsList>

            <TabsContent value="latest" className="mt-0">
              {latestPosts.length === 0 ? (
                <div className="text-center py-20 glass-card">
                  <Sparkles className="w-16 h-16 text-teal-400 mx-auto mb-4" />
                  <p className="text-text-secondary text-lg mb-4">
                    No posts yet. Be the first to write!
                  </p>
                  <Link
                    href="/editor/new"
                    className="inline-flex items-center gap-2 px-6 py-3 btn-primary"
                  >
                    <Zap className="w-5 h-5" />
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
                <div className="text-center py-20 glass-card">
                  <TrendingUp className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                  <p className="text-text-secondary text-lg">
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
      <section className="py-24 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-dark-bg to-orange-500/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Sparkles className="w-12 h-12 text-teal-400 mx-auto mb-6 animate-pulse" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
            Ready to Share{' '}
            <span className="text-gradient-primary">Your Story?</span>
          </h2>
          <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of writers sharing their expertise and passion. 
            <span className="text-teal-400 font-medium"> Start writing today.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center px-8 py-4 btn-primary text-lg font-semibold group"
            >
              <Zap className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center justify-center px-8 py-4 btn-secondary text-lg font-medium"
            >
              Explore More Posts
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
