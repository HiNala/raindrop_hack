import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { PostCard } from '@/components/post/PostCard'
import { Search as SearchIcon } from 'lucide-react'

async function searchPosts(query: string) {
  if (!query) return []

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      OR: [
        {
          title: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          excerpt: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          tags: {
            some: {
              tag: {
                name: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            },
          },
        },
      ],
    },
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
    orderBy: {
      publishedAt: 'desc',
    },
    take: 50,
  })

  return posts
}

export const metadata: Metadata = {
  title: 'Search Posts',
  description: 'Search for blog posts',
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q || ''
  const posts = await searchPosts(query)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Search Results
          </h1>

          {query && (
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {posts.length} {posts.length === 1 ? 'result' : 'results'} for &ldquo;{query}&rdquo;
            </p>
          )}
        </div>

        {/* Results */}
        {!query ? (
          <div className="text-center py-20">
            <SearchIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Enter a search query to find posts
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <SearchIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No posts found for &ldquo;{query}&rdquo;
            </p>
            <p className="text-gray-500 dark:text-gray-500 mt-2">
              Try different keywords
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


