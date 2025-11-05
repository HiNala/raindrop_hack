import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PostCard } from '@/components/post/PostCard'
import { Tag, Sparkles } from 'lucide-react'

async function getTagWithPosts(slug: string) {
  const tag = await prisma.tag.findUnique({
    where: { slug },
    include: {
      posts: {
        where: {
          post: {
            published: true,
          },
        },
        include: {
          post: {
            include: {
              author: {
                include: {
                  profile: true,
                },
              },
              tags: {
                include: {
                  tag: true,
                },
              },
              _count: {
                select: {
                  likes: true,
                  comments: true,
                },
              },
            },
          },
        },
        orderBy: {
          post: {
            publishedAt: 'desc',
          },
        },
      },
    },
  })

  return tag
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const tag = await getTagWithPosts(params.slug)

  if (!tag) {
    return { title: 'Tag Not Found' }
  }

  return {
    title: `${tag.name} - Browse Posts`,
    description: `Explore all posts tagged with ${tag.name}`,
  }
}

export default async function TagPage({ params }: { params: { slug: string } }) {
  const tag = await getTagWithPosts(params.slug)

  if (!tag) {
    notFound()
  }

  const posts = tag.posts.map((pt) => pt.post)

  return (
    <div className="min-h-screen bg-[#0a0a0b] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="glass-effect border border-[#27272a] rounded-2xl p-8 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>

            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-6">
                <div className="p-5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl shadow-glow-teal">
                  <Tag className="w-10 h-10 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl md:text-5xl font-bold text-text-primary">{tag.name}</h1>
                    <Sparkles className="w-6 h-6 text-teal-400 animate-pulse" />
                  </div>
                  <p className="text-text-secondary text-lg">
                    {posts.length} {posts.length === 1 ? 'post' : 'posts'} published
                  </p>
                  {posts.length > 0 && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-text-tertiary">
                      <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
                      Explore stories about {tag.name}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="glass-effect border border-[#27272a] rounded-xl p-20 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-dark-card rounded-full mb-6">
              <Tag className="w-12 h-12 text-text-tertiary" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-3">No posts yet</h2>
            <p className="text-lg text-text-secondary max-w-md mx-auto">
              Be the first to write about {tag.name}!
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
