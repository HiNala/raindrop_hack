'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Heart,
  Bookmark,
  Share2,
  Eye,
  MessageCircle,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'

interface PostInteractionsProps {
  postId: string
  initialLikes: number
  initialViews: number
  initialComments: number
  initialBookmarks: number
  isLiked?: boolean
  isBookmarked?: boolean
  readingTime?: number
  author?: {
    name: string
    username: string
  }
}

interface NextUpPost {
  id: string
  title: string
  excerpt: string
  author: string
  readTime: number
  coverImage?: string
}

export function PostInteractions({
  postId: _postId,
  initialLikes,
  initialViews,
  initialComments,
  initialBookmarks,
  isLiked: initialIsLiked = false,
  isBookmarked: initialIsBookmarked = false,
  readingTime,
  author,
}: PostInteractionsProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [views, setViews] = useState(initialViews)
  const [comments] = useState(initialComments)
  const [bookmarks, setBookmarks] = useState(initialBookmarks)
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked)
  const [showUndo, setShowUndo] = useState(false)
  const [lastAction, setLastAction] = useState<'like' | 'bookmark' | null>(null)
  const [nextUpPosts, setNextUpPosts] = useState<NextUpPost[]>([])
  const [showNextUp, setShowNextUp] = useState(false)

  const { toast } = useToast()

  // Mock next up posts
  useEffect(() => {
    const mockNextUp: NextUpPost[] = [
      {
        id: '1',
        title: 'Understanding React Server Components',
        excerpt: "A deep dive into React's new paradigm",
        author: 'React Expert',
        readTime: 12,
        coverImage: '/api/placeholder/400/200',
      },
      {
        id: '2',
        title: 'TypeScript Best Practices',
        excerpt: 'Write better TypeScript with these tips',
        author: 'TypeScript Guru',
        readTime: 8,
      },
      {
        id: '3',
        title: 'Modern CSS Layout Techniques',
        excerpt: 'Master Flexbox, Grid, and more',
        author: 'CSS Wizard',
        readTime: 10,
      },
    ]
    setNextUpPosts(mockNextUp)
  }, [])

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      if (scrolled > 100) {
        // User has scrolled down, increment views if not already counted
        if (views === initialViews) {
          setViews((prev) => prev + 1)
        }
      }

      // Show next up when near bottom
      const scrollPercentage = (scrolled / (documentHeight - windowHeight)) * 100
      if (scrollPercentage > 80 && !showNextUp) {
        setShowNextUp(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [views, initialViews, showNextUp])

  const handleLike = useCallback(() => {
    const newLikedState = !isLiked
    setIsLiked(newLikedState)
    setLikes((prev) => (newLikedState ? prev + 1 : prev - 1))

    setLastAction('like')
    setShowUndo(true)

    // Hide undo after 3 seconds
    setTimeout(() => setShowUndo(false), 3000)

    // Show toast
    toast.success(newLikedState ? 'Post liked!' : 'Like removed', {
      description: newLikedState ? 'Added to your likes' : 'Removed from your likes',
    })
  }, [isLiked, toast])

  const handleBookmark = useCallback(() => {
    const newBookmarkedState = !isBookmarked
    setIsBookmarked(newBookmarkedState)
    setBookmarks((prev) => (newBookmarkedState ? prev + 1 : prev - 1))

    setLastAction('bookmark')
    setShowUndo(true)

    // Hide undo after 3 seconds
    setTimeout(() => setShowUndo(false), 3000)

    // Show toast
    toast.success(newBookmarkedState ? 'Post saved!' : 'Bookmark removed', {
      description: newBookmarkedState
        ? 'Added to your reading list'
        : 'Removed from your reading list',
    })
  }, [isBookmarked, toast])

  const handleUndo = useCallback(() => {
    if (lastAction === 'like') {
      const revertLiked = !isLiked
      setIsLiked(revertLiked)
      setLikes((prev) => (revertLiked ? prev + 1 : prev - 1))
      toast.info('Like action undone')
    } else if (lastAction === 'bookmark') {
      const revertBookmarked = !isBookmarked
      setIsBookmarked(revertBookmarked)
      setBookmarks((prev) => (revertBookmarked ? prev + 1 : prev - 1))
      toast.info('Bookmark action undone')
    }
    setShowUndo(false)
    setLastAction(null)
  }, [lastAction, isLiked, isBookmarked, toast])

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this post',
          text: 'I found this interesting article',
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied to clipboard!')
      } catch (error) {
        toast.error('Failed to copy link')
      }
    }
  }, [toast])

  const UndoToast = () => {
    if (!showUndo || !lastAction) return null

    return (
      <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-3 animate-slide-up">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {lastAction === 'like' ? 'Post liked' : 'Post saved'}
        </span>
        <Button variant="outline" size="sm" onClick={handleUndo} className="text-xs">
          Undo
        </Button>
      </div>
    )
  }

  return (
    <>
      {/* Interaction Bar */}
      <div className="sticky bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 p-4 z-40">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Like Button with haptic-like feedback */}
              <button
                onClick={handleLike}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200',
                  isLiked
                    ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                )}
              >
                <Heart
                  className={cn(
                    'w-5 h-5 transition-transform duration-200',
                    isLiked && 'fill-current scale-110',
                  )}
                />
                <span className="font-medium">{likes}</span>
              </button>

              {/* Comment Button */}
              <button className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200">
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">{comments}</span>
              </button>

              {/* Bookmark Button */}
              <button
                onClick={handleBookmark}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200',
                  isBookmarked
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                )}
              >
                <Bookmark
                  className={cn(
                    'w-5 h-5 transition-transform duration-200',
                    isBookmarked && 'fill-current scale-110',
                  )}
                />
                <span className="font-medium">{bookmarks}</span>
              </button>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
              >
                <Share2 className="w-5 h-5" />
                <span className="font-medium">Share</span>
              </button>
            </div>

            {/* Reading Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{views} views</span>
              </div>
              {readingTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{readingTime} min read</span>
                </div>
              )}
              {author && <span>by {author.name}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Undo Toast */}
      <UndoToast />

      {/* Next Up Panel */}
      {showNextUp && nextUpPosts.length > 0 && (
        <div className="fixed bottom-24 left-0 right-0 z-30 px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Next up</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowNextUp(false)}>
                  ×
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {nextUpPosts.map((post, _index) => (
                  <a
                    key={post.id}
                    href={`/p/${post.id}`}
                    className="group block p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200 hover:shadow-md hover:-translate-y-1"
                  >
                    <div className="flex gap-3">
                      {post.coverImage && (
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {post.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <span>{post.author}</span>
                          <span>•</span>
                          <span>{post.readTime} min read</span>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </>
  )
}
