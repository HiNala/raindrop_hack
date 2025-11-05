import React from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Clock, Eye, Calendar, Sparkles } from 'lucide-react'
import { TiptapRenderer } from '@/components/post/TiptapRenderer'
import { LikeButton } from '@/components/engagement/LikeButton'
import { CommentSection } from '@/components/engagement/CommentSection'
import { TableOfContents } from '@/components/post/TableOfContents'
import { ReadingProgress } from '@/components/ui/reading-progress'
import { MobileTOC, useHeadings } from '@/components/post/MobileTOC'
import { ReadingProgress as MobileReadingProgress } from '@/components/post/ReadingProgress'
import { PostAnalyticsTracker } from '@/components/analytics/PostAnalyticsTracker'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  contentJson: Record<string, unknown>
  coverImage: string | null
  publishedAt: Date | null
  createdAt: Date
  readTimeMin: number | null
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
      color: string | null
    }
  }>
  _count: {
    likes: number
    comments: number
  }
}

interface PostPageProps {
  post: Post
  isPreview?: boolean
}

export default function PostPage({ post, isPreview = false }: PostPageProps) {
  const author = post.author
  const profile = author?.profile

  return (
    <article className="min-h-screen bg-[#0a0a0b]">
      <ReadingProgress />
      <PostAnalyticsTracker postId={post.id} />

      {/* Header */}
      <header className="relative">
        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/50 to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map(({ tag }) => (
                <Badge
                  key={tag.slug}
                  variant="secondary"
                  className="bg-teal-500/10 text-teal-400 hover:bg-teal-500/20"
                >
                  <Link href={`/tag/${tag.slug}`}>
                    {tag.name}
                  </Link>
                </Badge>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={profile?.avatarUrl || undefined} />
                <AvatarFallback>
                  {profile?.displayName?.charAt(0) || profile?.username?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>

              <div>
                <div className="font-medium text-white">
                  {profile?.displayName || profile?.username || 'Anonymous'}
                </div>
                <div className="text-sm text-gray-400 flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(post.publishedAt || post.createdAt, 'MMM dd, yyyy')}
                  </span>
                  {post.readTimeMin && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTimeMin} min read
                    </span>
                  )}
                  {isPreview && (
                    <span className="flex items-center gap-1 text-orange-400">
                      <Sparkles className="h-3 w-3" />
                      Preview
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Engagement */}
            <div className="flex items-center gap-6">
              <LikeButton
                postId={post.id}
                initialLikes={post._count.likes}
                size="lg"
              />
              <div className="flex items-center gap-1 text-gray-400">
                <Eye className="h-4 w-4" />
                <span className="text-sm">Reading...</span>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-700" />
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Table of Contents - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-8">
              <TableOfContents content={post.contentJson} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="prose prose-lg prose-invert max-w-none">
              <TiptapRenderer content={post.contentJson} />
            </div>

            {/* Comments */}
            <div className="mt-16">
              <CommentSection postId={post.id} />
            </div>
          </main>
        </div>
      </div>
    </article>
  )
}


