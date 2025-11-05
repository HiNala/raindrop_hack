import Link from 'next/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Calendar, Heart, MessageCircle, Clock, Edit, Trash2, Eye, FileText } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface DashboardPostCardProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt?: string | null
    coverImage?: string | null
    published: boolean
    publishedAt: Date | null
    createdAt: Date
    updatedAt: Date
    readTimeMin?: number | null
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
  onDelete?: (id: string) => void
}

export function DashboardPostCard({ post, onDelete }: DashboardPostCardProps) {
  return (
    <article className="card-hover group">
      <div className="flex gap-4 p-5">
        {/* Cover Image or Placeholder */}
        <div className="flex-shrink-0">
          {post.coverImage ? (
            <div className="relative w-32 h-32 rounded-lg overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-card/80 to-transparent"></div>
            </div>
          ) : (
            <div className="w-32 h-32 rounded-lg bg-dark-bg border border-dark-border flex items-center justify-center group-hover:border-teal-500/30 transition-colors">
              <FileText className="w-12 h-12 text-text-tertiary" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header with Status */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <Link href={post.published ? `/p/${post.slug}` : `/editor/${post.id}`}>
                <h3 className="text-lg font-bold text-text-primary line-clamp-2 group-hover:text-teal-400 transition-colors">
                  {post.title}
                </h3>
              </Link>
            </div>
            
            {/* Status Badge */}
            <Badge
              className={`flex-shrink-0 ${
                post.published
                  ? 'bg-teal-500/10 text-teal-400 border-teal-500/30'
                  : 'bg-orange-500/10 text-orange-400 border-orange-500/30'
              }`}
            >
              {post.published ? 'Published' : 'Draft'}
            </Badge>
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-sm text-text-secondary line-clamp-2 mb-3 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags.slice(0, 3).map((postTag) => (
                <Badge
                  key={postTag.tag.slug}
                  variant="outline"
                  className="px-2 py-0.5 text-xs bg-dark-bg text-text-tertiary border-dark-border hover:border-teal-500/30 transition-colors"
                >
                  {postTag.tag.name}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="px-2 py-0.5 text-xs bg-dark-bg text-text-tertiary">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            {/* Meta Info */}
            <div className="flex items-center gap-4 text-xs text-text-tertiary">
              {/* Date */}
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {post.published && post.publishedAt
                    ? formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })
                    : `Edited ${formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })}`}
                </span>
              </div>

              {/* Reading Time */}
              {post.readTimeMin && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{post.readTimeMin} min</span>
                </div>
              )}

              {/* Engagement (only for published) */}
              {post.published && post._count && (
                <>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5" />
                    <span>{post._count.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{post._count.comments}</span>
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* View */}
              {post.published && (
                <Link
                  href={`/p/${post.slug}`}
                  className="p-2 text-text-tertiary hover:text-teal-400 hover:bg-dark-hover rounded-lg transition-all"
                  title="View post"
                >
                  <Eye className="w-4 h-4" />
                </Link>
              )}
              
              {/* Edit */}
              <Link
                href={`/editor/${post.id}`}
                className="p-2 text-text-tertiary hover:text-teal-400 hover:bg-dark-hover rounded-lg transition-all"
                title="Edit post"
              >
                <Edit className="w-4 h-4" />
              </Link>

              {/* Delete */}
              {onDelete && (
                <button
                  onClick={() => onDelete(post.id)}
                  className="p-2 text-text-tertiary hover:text-orange-400 hover:bg-dark-hover rounded-lg transition-all"
                  title="Delete post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
