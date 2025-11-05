'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, Trash2, Edit2, X, Check } from 'lucide-react'
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
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

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

  const handleEdit = (comment: Comment) => {
    setEditingId(comment.id)
    setEditText(comment.body)
  }

  const handleSaveEdit = async (commentId: string) => {
    if (!editText.trim()) {
      toast.error('Comment cannot be empty')
      return
    }

    try {
      const res = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: editText }),
      })

      if (!res.ok) {
        throw new Error('Failed to update comment')
      }

      const data = await res.json()
      setComments(comments.map((c) => (c.id === commentId ? data.comment : c)))
      setEditingId(null)
      setEditText('')
      toast.success('Comment updated')
    } catch (error) {
      toast.error('Failed to update comment')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditText('')
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
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 glass-effect border-[#27272a] hover:border-teal-500/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10 ring-2 ring-[#27272a]">
                      <AvatarImage src={comment.author.profile?.avatarUrl || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
                        {comment.author.profile?.displayName?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-semibold text-sm text-text-primary">
                            {comment.author.profile?.displayName || 'Unknown User'}
                          </div>
                          <div className="text-xs text-text-tertiary">
                            {format(new Date(comment.createdAt), 'MMM d, yyyy • h:mm a')}
                          </div>
                        </div>

                        {user && comment.author.profile?.username === user.username && (
                          <div className="flex items-center gap-1">
                            {editingId !== comment.id && (
                              <>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEdit(comment)}
                                    className="h-8 w-8 p-0 text-text-secondary hover:text-teal-400"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(comment.id)}
                                    className="h-8 w-8 p-0 text-text-secondary hover:text-red-400"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </motion.div>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {editingId === comment.id ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-2"
                        >
                          <Textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="min-h-[80px] bg-[#0a0a0b] border-[#27272a] focus:border-teal-500"
                          />
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleSaveEdit(comment.id)}
                              className="bg-teal-500 hover:bg-teal-600"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleCancelEdit}
                              className="text-text-secondary"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </motion.div>
                      ) : (
                        <p className="text-text-secondary whitespace-pre-wrap leading-relaxed">
                          {comment.body}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}


