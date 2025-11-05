import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { prisma } from '@/lib/prisma'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Clock, Eye, Calendar } from 'lucide-react'
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
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const url = `${baseUrl}/p/${post.slug}`
  const imageUrl = post.coverImage || `${baseUrl}/og-default.png`
  const authorName = post.author.profile?.displayName || 'Unknown'

  return {
    title: `${post.title} | Blog App`,
    description: post.excerpt || `Read ${post.title} by ${authorName}`,
    authors: [{ name: authorName }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: 'article',
      url,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [authorName],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || undefined,
      images: [imageUrl],
      creator: `@${post.author.profile?.username || 'blogapp'}`,
    },
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  const authorProfile = post.author.profile
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const url = `${baseUrl}/p/${post.slug}`

  // Generate JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.coverImage || undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: authorProfile?.displayName || 'Unknown',
      url: authorProfile?.username ? `${baseUrl}/u/${authorProfile.username}` : undefined,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Blog App',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: post.tags.map((pt) => pt.tag.name).join(', '),
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <article className="min-h-screen bg-dark-bg">
      {/* Cover Image */}
      {post.coverImage && (
        <div className="w-full h-[400px] relative bg-dark-card">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg to-transparent"></div>
        </div>
      )}

      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map(({ tag }) => (
              <Link key={tag.id} href={`/tag/${tag.slug}`}>
                <Badge variant="secondary" className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  {tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
          <Link href={`/u/${authorProfile?.username}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Avatar className="h-12 w-12">
              <AvatarImage src={authorProfile?.avatarUrl || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {authorProfile?.displayName?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {authorProfile?.displayName || 'Unknown Author'}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
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
        <div className="prose dark:prose-invert max-w-none mb-12">
          <TiptapRenderer content={post.contentJson} />
        </div>

        <Separator className="my-12" />

        {/* Author Bio */}
        {authorProfile && (
          <div className="mb-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={authorProfile.avatarUrl || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
                  {authorProfile.displayName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-2">
                  <Link href={`/u/${authorProfile.username}`} className="hover:text-purple-600 transition-colors">
                    {authorProfile.displayName}
                  </Link>
                </h3>
                {authorProfile.bio && (
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {authorProfile.bio}
                  </p>
                )}
                <Link href={`/u/${authorProfile.username}`}>
                  <span className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                    View Profile →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}

        <Separator className="my-12" />

        {/* Comments */}
        <CommentSection postId={post.id} />
      </div>
    </article>
  )
}


