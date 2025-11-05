import Link from 'next/link'
import { format } from 'date-fns'
import { Tag, ArrowRight, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

async function getCategories() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/categories`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      return []
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

async function getRecentPosts() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/posts?published=true&limit=6`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.posts || []
  } catch (error) {
    console.error('Error fetching recent posts:', error)
    return []
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories()
  const recentPosts = await getRecentPosts()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Browse Categories
            </h1>
            <p className="text-xl text-gray-600">
              Explore our organized collection of articles across different topics and interests
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tag className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No categories available</h3>
              <p className="text-gray-600">
                Categories will appear here once they are created.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category: any, index: number) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group"
                >
                  <Card className="hover:shadow-lg transition-all duration-300 h-full group-hover:border-primary-300 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Tag className="w-6 h-6 text-primary-600" />
                        </div>
                        <span className="text-sm text-gray-500 font-medium">
                          {category._count?.posts || 0} articles
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="text-xl mb-2 group-hover:text-primary-600 transition-colors">
                        {category.name}
                      </CardTitle>
                      {category.description && (
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                          {category.description}
                        </p>
                      )}
                      <div className="flex items-center text-primary-600 group-hover:text-primary-700 font-medium">
                        <span>Explore articles</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent Articles */}
      {recentPosts.length > 0 && (
        <section className="py-16 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Recent Articles
              </h2>
              <p className="text-xl text-gray-600">
                Check out the latest content from our community
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentPosts.slice(0, 6).map((post: any, _index: number) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                        {post.category?.name || 'Uncategorized'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {Math.ceil(post.content?.length / 1000) || 5} min read
                      </span>
                    </div>

                    <Link href={`/posts/${post.slug}`}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {post.author?.name || 'Anonymous'}
                      </span>
                      <span className="text-gray-500">
                        {format(new Date(post.createdAt), 'MMM d')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button asChild size="lg">
                <Link href="/posts">
                  <BookOpen className="w-4 h-4 mr-2" />
                  View All Articles
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
