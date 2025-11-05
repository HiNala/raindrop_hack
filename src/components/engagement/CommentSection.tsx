'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { format } from 'date-fns'
import { MessageCircle, Send, Trash2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import toast from 'react-hot-toast'

interface Comment {
  id: string
  body: string
  createdAt: string
  author: {
    profile: {
      username: string
      displayName: string
      avatarUrl: string | null
    } | null
  }
}

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { isSignedIn, user } = useUser()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load comments
  useEffect(() => {
    fetch(`/api/posts/${postId}/comments`)
      .then((res) => res.json())
      .then((data) => {
        setComments(data.comments || [])
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [postId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isSignedIn) {
      toast.error('Please sign in to comment')
      return
    }

    if (!newComment.trim()) {
      toast.error('Please write a comment')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: newComment }),
      })

      if (!res.ok) {
        throw new Error('Failed to post comment')
      }

      const data = await res.json()
      setComments([data.comment, ...comments])
      setNewComment('')
      toast.success('Comment posted!')
    } catch (error) {
      toast.error('Failed to post comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return

    try {
      const res = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete comment')
      }

      setComments(comments.filter((c) => c.id !== commentId))
      toast.success('Comment deleted')
    } catch (error) {
      toast.error('Failed to delete comment')
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageCircle className="w-6 h-6" />
        Comments ({comments.length})
      </h2>

      {/* Comment Form */}
      {isSignedIn ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <Textarea
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mb-3"
            rows={3}
          />
          <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
            {isSubmitting ? (
              'Posting...'
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Post Comment
              </>
            )}
          </Button>
        </form>
      ) : (
        <Card className="p-6 mb-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Sign in to leave a comment
          </p>
          <Button asChild>
            <a href="/sign-in">Sign In</a>
          </Button>
        </Card>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <Card className="p-8 text-center">
          <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">
            No comments yet. Be the first to share your thoughts!
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <Card key={comment.id} className="p-6">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={comment.author.profile?.avatarUrl || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {comment.author.profile?.displayName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-sm">
                        {comment.author.profile?.displayName || 'Unknown User'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {format(new Date(comment.createdAt), 'MMM d, yyyy • h:mm a')}
                      </div>
                    </div>

                    {user && comment.author.profile?.username === user.username && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(comment.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {comment.body}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


