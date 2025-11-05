import Link from 'next/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Calendar, Heart, MessageCircle, Clock, ArrowRight } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface PostCardProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt?: string | null
    coverImage?: string | null
    publishedAt: Date | null
    readTimeMin?: number | null
    author: {
      profile: {
        username: string
        displayName: string
        avatarUrl?: string | null
      } | null
    }
    tags?: Array<{
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
  const initials = post.author.profile?.displayName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || '?'

  return (
    <Link href={`/p/${post.slug}`}>
      <article className="card-hover h-full flex flex-col group">
        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-dark-card/20 to-transparent"></div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.slice(0, 2).map((postTag) => (
                <Badge
                  key={postTag.tag.slug}
                  className="px-2.5 py-0.5 text-xs bg-teal-500/10 text-teal-400 border-teal-500/30 hover:bg-teal-500/20 transition-colors"
                >
                  {postTag.tag.name}
                </Badge>
              ))}
              {post.tags.length > 2 && (
                <Badge className="px-2.5 py-0.5 text-xs bg-dark-bg text-text-tertiary border-dark-border">
                  +{post.tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className="text-xl font-bold text-text-primary mb-2 line-clamp-2 group-hover:text-gradient-teal transition-colors">
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-text-secondary text-sm mb-4 line-clamp-3 flex-1 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Footer */}
          <div className="pt-4 border-t border-dark-border">
            {/* Author */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8 ring-2 ring-dark-border group-hover:ring-teal-500/30 transition-all">
                  <AvatarFallback className="bg-dark-bg text-text-primary text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-text-primary group-hover:text-teal-400 transition-colors">
                    {post.author.profile?.displayName}
                  </span>
                  <span className="text-xs text-text-tertiary">
                    @{post.author.profile?.username}
                  </span>
                </div>
              </div>

              {/* Read More */}
              <div className="flex items-center gap-1 text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-medium">Read</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Meta */}
            <div className="flex items-center justify-between text-xs text-text-tertiary">
              <div className="flex items-center gap-4">
                {/* Date */}
                {post.publishedAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
                    </span>
                  </div>
                )}

                {/* Reading Time */}
                {post.readTimeMin && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readTimeMin} min</span>
                  </div>
                )}
              </div>

              {/* Engagement */}
              {post._count && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-text-tertiary group-hover:text-orange-400 transition-colors">
                    <Heart className="w-3.5 h-3.5" />
                    <span>{post._count.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{post._count.comments}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
