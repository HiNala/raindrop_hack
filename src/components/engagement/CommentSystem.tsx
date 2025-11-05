'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  MessageCircle, 
  Heart, 
  MoreHorizontal, 
  Reply, 
  Pin,
  Check,
  Flag,
  Trash2,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

interface Comment {
  id: string
  body: string
  createdAt: Date
  updatedAt: Date
  author: {
    id: string
    username: string
    displayName: string
    avatarUrl?: string
  }
  postId: string
  parentId?: string
  likes: number
  isLiked: boolean
  isPinned?: boolean
  replies?: Comment[]
  _count?: {
    replies: number
  }
}

interface CommentSystemProps {
  postId: string
  initialComments?: Comment[]
  currentUser?: {
    id: string
    username: string
    displayName: string
    avatarUrl?: string
  }
}

export function CommentSystem({ postId, initialComments = [], currentUser }: CommentSystemProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [mentionQuery, setMentionQuery] = useState('')
  const [showMentions, setShowMentions] = useState(false)
  const [mentionIndex, setMentionIndex] = useState(0)
  
  const commentTextareaRef = useRef<HTMLTextAreaElement>(null)
  const replyTextareaRef = useRef<HTMLTextAreaElement>(null)

  // Mock users for mentions
  const mockUsers = [
    { id: '1', username: 'tech_writer', displayName: 'Tech Writer' },
    { id: '2', username: 'ai_expert', displayName: 'AI Expert' },
    { id: '3', username: 'design_guru', displayName: 'Design Guru' },
  ]

  const filteredMentions = mockUsers.filter(user =>
    user.username.toLowerCase().includes(mentionQuery.toLowerCase()) ||
    user.displayName.toLowerCase().includes(mentionQuery.toLowerCase())
  )

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !currentUser) return

    const comment: Comment = {
      id: Date.now().toString(),
      body: newComment,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: currentUser,
      postId,
      likes: 0,
      isLiked: false,
      replies: [],
      _count: { replies: 0 }
    }

    setComments(prev => [comment, ...prev])
    setNewComment('')
  }

  const handleReplySubmit = async (parentId: string) => {
    if (!replyText.trim() || !currentUser) return

    const reply: Comment = {
      id: Date.now().toString(),
      body: replyText,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: currentUser,
      postId,
      parentId,
      likes: 0,
      isLiked: false,
      replies: []
    }

    setComments(prev => prev.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply],
          _count: { 
            replies: (comment._count?.replies || 0) + 1 
          }
        }
      }
      return comment
    }))

    setReplyText('')
    setReplyingTo(null)
    setMentionQuery('')
  }

  const handleLike = async (commentId: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
        }
      }
      if (comment.replies) {
        return {
          ...comment,
          replies: comment.replies.map(reply =>
            reply.id === commentId
              ? { ...reply, isLiked: !reply.isLiked, likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1 }
              : reply
          )
        }
      }
      return comment
    }))
  }

  const handleTextareaChange = (value: string, isReply = false) => {
    if (isReply) {
      setReplyText(value)
    } else {
      setNewComment(value)
    }

    // Check for mentions
    const cursorPos = isReply 
      ? replyTextareaRef.current?.selectionStart || 0
      : commentTextareaRef.current?.selectionStart || 0
    
    const textBeforeCursor = value.slice(0, cursorPos)
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/)
    
    if (mentionMatch) {
      setMentionQuery(mentionMatch[1])
      setShowMentions(true)
      setMentionIndex(0)
    } else {
      setShowMentions(false)
      setMentionQuery('')
    }
  }

  const insertMention = (user: any, isReply = false) => {
    const mention = `@${user.username}`
    const text = isReply ? replyText : newComment
    const cursorPos = isReply 
      ? replyTextareaRef.current?.selectionStart || 0
      : commentTextareaRef.current?.selectionStart || 0
    
    const textBeforeCursor = text.slice(0, cursorPos)
    const textAfterCursor = text.slice(cursorPos)
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/)
    
    if (mentionMatch) {
      const beforeMention = textBeforeCursor.slice(0, -mentionMatch[0].length)
      const newText = beforeMention + mention + ' ' + textAfterCursor
      
      if (isReply) {
        setReplyText(newText)
        setTimeout(() => {
          replyTextareaRef.current?.focus()
          replyTextareaRef.current?.setSelectionRange(
            beforeMention.length + mention.length + 1,
            beforeMention.length + mention.length + 1
          )
        }, 0)
      } else {
        setNewComment(newText)
        setTimeout(() => {
          commentTextareaRef.current?.focus()
          commentTextareaRef.current?.setSelectionRange(
            beforeMention.length + mention.length + 1,
            beforeMention.length + mention.length + 1
          )
        }, 0)
      }
    }
    
    setShowMentions(false)
    setMentionQuery('')
  }

  const handleKeyDown = (e: React.KeyboardEvent, isReply = false) => {
    if (!showMentions) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setMentionIndex(prev => (prev + 1) % filteredMentions.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setMentionIndex(prev => prev === 0 ? filteredMentions.length - 1 : prev - 1)
        break
      case 'Enter':
        e.preventDefault()
        if (filteredMentions[mentionIndex]) {
          insertMention(filteredMentions[mentionIndex], isReply)
        }
        break
      case 'Escape':
        e.preventDefault()
        setShowMentions(false)
        setMentionQuery('')
        break
    }
  }

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={cn("group", isReply && "ml-8")}>
      <div className="flex gap-3">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={comment.author.avatarUrl} />
          <AvatarFallback className="bg-gradient-to-br from-primary-400 to-primary-600 text-white text-xs">
            {comment.author.displayName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm text-gray-900 dark:text-white">
              {comment.author.displayName}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              @{comment.author.username}
            </span>
            {comment.isPinned && (
              <Badge variant="secondary" className="text-xs">
                <Pin className="w-3 h-3 mr-1" />
                Pinned
              </Badge>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {format(comment.createdAt, 'MMM d, yyyy')}
            </span>
          </div>
          
          <div className="prose prose-sm dark:prose-invert max-w-none mb-3">
            <p>{comment.body}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLike(comment.id)}
              className={cn(
                "text-xs gap-1 px-2 py-1",
                comment.isLiked && "text-red-600 dark:text-red-400"
              )}
            >
              <Heart className={cn("w-3 h-3", comment.isLiked && "fill-current")} />
              {comment.likes}
            </Button>
            
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(comment.id)}
                className="text-xs gap-1 px-2 py-1"
              >
                <Reply className="w-3 h-3" />
                Reply
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-xs p-1 opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Flag className="w-4 h-4 mr-2" />
                  Report
                </DropdownMenuItem>
                {currentUser?.id === comment.author.id && (
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Reply Form */}
          {replyingTo === comment.id && (
            <div className="mt-4 space-y-2">
              <div className="relative">
                <Textarea
                  ref={replyTextareaRef}
                  value={replyText}
                  onChange={(e) => handleTextareaChange(e.target.value, true)}
                  onKeyDown={(e) => handleKeyDown(e, true)}
                  placeholder={`Reply to @${comment.author.username}...`}
                  className="min-h-[80px] resize-none"
                />
                
                {/* Mentions Dropdown */}
                {showMentions && filteredMentions.length > 0 && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {filteredMentions.map((user, index) => (
                      <button
                        key={user.id}
                        onClick={() => insertMention(user, true)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800",
                          index === mentionIndex && "bg-gray-50 dark:bg-gray-800"
                        )}
                      >
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="bg-gradient-to-br from-primary-400 to-primary-600 text-white text-xs">
                            {user.displayName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{user.displayName}</div>
                          <div className="text-xs text-gray-500">@{user.username}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setReplyingTo(null)
                    setReplyText('')
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleReplySubmit(comment.id)}
                  disabled={!replyText.trim()}
                >
                  Reply
                </Button>
              </div>
            </div>
          )}
          
          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map(reply => (
                <CommentItem key={reply.id} comment={reply} isReply />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      {currentUser ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Leave a comment</h3>
          <div className="relative">
            <Textarea
              ref={commentTextareaRef}
              value={newComment}
              onChange={(e) => handleTextareaChange(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)}
              placeholder="Share your thoughts..."
              className="min-h-[100px] resize-none"
            />
            
            {/* Mentions Dropdown */}
            {showMentions && filteredMentions.length > 0 && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                {filteredMentions.map((user, index) => (
                  <button
                    key={user.id}
                    onClick={() => insertMention(user)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800",
                      index === mentionIndex && "bg-gray-50 dark:bg-gray-800"
                    )}
                  >
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-gradient-to-br from-primary-400 to-primary-600 text-white text-xs">
                        {user.displayName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{user.displayName}</div>
                      <div className="text-xs text-gray-500">@{user.username}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button
              onClick={handleCommentSubmit}
              disabled={!newComment.trim()}
              className="flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Comment
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 border border-gray-200 dark:border-gray-700 rounded-lg">
          <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Sign in to join the conversation
          </p>
          <Button>Sign In</Button>
        </div>
      )}
      
      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  )
}