import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { prisma } from '@/lib/prisma'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Clock, Eye, Calendar, Sparkles } from 'lucide-react'
import { TiptapRenderer } from '@/components/post/TiptapRenderer'
import { LikeButton } from '@/components/engagement/LikeButton'
import { CommentSection } from '@/components/engagement/CommentSection'

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
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
  })

  if (!post) return null

  // Increment view count
  await prisma.post.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  })

  return post
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.excerpt || undefined,
    authors: [{ name: post.author.profile?.displayName || 'Unknown' }],
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author.profile?.displayName || 'Unknown'],
      images: post.coverImage ? [post.coverImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || undefined,
      images: post.coverImage ? [post.coverImage] : [],
    },
  }
}

export const revalidate = 3600 // Revalidate every hour (ISR)

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  const authorProfile = post.author.profile

  return (
    <article className="min-h-screen bg-[#0a0a0b]">
      {/* Cover Image */}
      {post.coverImage && (
        <div className="w-full h-[400px] relative bg-[#1a1a1d]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/80 to-transparent"></div>
        </div>
      )}

      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map(({ tag }) => (
              <Link key={tag.id} href={`/tag/${tag.slug}`}>
                <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/30 hover:bg-teal-500/20 transition-colors">
                  {tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-text-secondary mb-8 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between mb-8 pb-8 border-b border-[#27272a]">
          <Link href={`/u/${authorProfile?.username}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Avatar className="h-12 w-12 ring-2 ring-[#27272a] hover:ring-teal-500/50 transition-all">
              <AvatarImage src={authorProfile?.avatarUrl || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
                {authorProfile?.displayName?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-text-primary hover:text-teal-400 transition-colors">
                {authorProfile?.displayName || 'Unknown Author'}
              </div>
              <div className="flex items-center gap-4 text-sm text-text-secondary">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {post.publishedAt && format(new Date(post.publishedAt), 'MMM d, yyyy')}
                </span>
                {post.readTimeMin && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTimeMin} min read
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {post.viewCount} views
                </span>
              </div>
            </div>
          </Link>

          <LikeButton postId={post.id} initialLikes={post._count.likes} />
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none mb-12 prose-headings:text-text-primary prose-p:text-text-secondary prose-code:text-teal-400 prose-blockquote:border-teal-500 prose-blockquote:text-text-secondary prose-a:text-teal-400 prose-strong:text-text-primary">
          <TiptapRenderer content={post.contentJson} />
        </div>

        <Separator className="my-12 bg-[#27272a]" />

        {/* Author Bio */}
        {authorProfile && (
          <div className="mb-12 p-6 glass-effect border border-[#27272a] rounded-2xl">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 ring-2 ring-teal-500/30">
                <AvatarImage src={authorProfile.avatarUrl || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-teal-500 to-teal-600 text-white text-lg">
                  {authorProfile.displayName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                  <Link href={`/u/${authorProfile.username}`} className="hover:text-teal-400 transition-colors text-text-primary">
                    {authorProfile.displayName}
                  </Link>
                  <Sparkles className="w-5 h-5 text-teal-400" />
                </h3>
                {authorProfile.bio && (
                  <p className="text-text-secondary mb-3 leading-relaxed">
                    {authorProfile.bio}
                  </p>
                )}
                <Link href={`/u/${authorProfile.username}`}>
                  <span className="text-sm text-teal-400 hover:text-teal-300 font-medium inline-flex items-center gap-1 group">
                    View Profile
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}

        <Separator className="my-12 bg-[#27272a]" />

        {/* Comments */}
        <CommentSection postId={post.id} />
      </div>
    </article>
  )
}