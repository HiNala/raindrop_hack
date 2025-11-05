import Link from 'next/link'
import { format } from 'date-fns'
import { Clock, Heart, MessageCircle, Eye } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface PostCardProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt: string | null
    coverImage: string | null
    publishedAt: Date | null
    readTimeMin: number | null
    viewCount: number
    author: {
      profile: {
        username: string
        displayName: string
        avatarUrl: string | null
      } | null
    }
    tags: Array<{
      tag: {
        name: string
        slug: string
      }
    }>
    _count?: {
      likes: number
      comments: number
    }
  }
}

export function PostCard({ post }: PostCardProps) {
  const authorProfile = post.author.profile

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {post.coverImage && (
        <Link href={`/p/${post.slug}`}>
          <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>
      )}

      <div className="p-6">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 3).map(({ tag }) => (
              <Link key={tag.slug} href={`/tag/${tag.slug}`}>
                <Badge
                  variant="secondary"
                  className="text-xs hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <Link href={`/p/${post.slug}`}>
          <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
          {/* Author */}
          <Link
            href={`/u/${authorProfile?.username}`}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={authorProfile?.avatarUrl || undefined} />
              <AvatarFallback className="text-xs bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                {authorProfile?.displayName?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {authorProfile?.displayName || 'Unknown'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {post.publishedAt && format(new Date(post.publishedAt), 'MMM d, yyyy')}
              </span>
            </div>
          </Link>

          {/* Meta */}
          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
            {post.readTimeMin && (
              <span className="flex items-center gap-1 text-xs">
                <Clock className="w-3 h-3" />
                {post.readTimeMin}m
              </span>
            )}
            {post._count && (
              <>
                <span className="flex items-center gap-1 text-xs">
                  <Heart className="w-3 h-3" />
                  {post._count.likes}
                </span>
                <span className="flex items-center gap-1 text-xs">
                  <MessageCircle className="w-3 h-3" />
                  {post._count.comments}
                </span>
              </>
            )}
            {post.viewCount > 0 && (
              <span className="flex items-center gap-1 text-xs">
                <Eye className="w-3 h-3" />
                {post.viewCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}


