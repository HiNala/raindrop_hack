import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PostCard } from '@/components/post/PostCard'
import { Badge } from '@/components/ui/badge'
import { Tag } from 'lucide-react'

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

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
              <Tag className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {tag.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {posts.length} {posts.length === 1 ? 'post' : 'posts'}
              </p>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <Tag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No posts with this tag yet
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


