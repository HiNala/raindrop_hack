'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

interface LikeButtonProps {
  postId: string
  initialLikes: number
}

export function LikeButton({ postId, initialLikes }: LikeButtonProps) {
  const { isSignedIn, user } = useUser()
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Check if user has liked this post
  useEffect(() => {
    if (isSignedIn) {
      fetch(`/api/posts/${postId}/like/check`)
        .then((res) => res.json())
        .then((data) => setIsLiked(data.isLiked))
        .catch(() => {})
    }
  }, [isSignedIn, postId])

  const handleToggleLike = async () => {
    if (!isSignedIn) {
      toast.error('Please sign in to like posts')
      return
    }

    setIsLoading(true)

    // Optimistic update
    const newIsLiked = !isLiked
    const newLikes = newIsLiked ? likes + 1 : likes - 1
    setIsLiked(newIsLiked)
    setLikes(newLikes)

    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
      })

      if (!res.ok) {
        throw new Error('Failed to toggle like')
      }

      const data = await res.json()
      setLikes(data.likes)
      setIsLiked(data.isLiked)
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(!newIsLiked)
      setLikes(likes)
      toast.error('Failed to update like')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={isLiked ? 'default' : 'outline'}
      size="sm"
      onClick={handleToggleLike}
      disabled={isLoading}
      className={isLiked ? 'bg-red-500 hover:bg-red-600 text-white' : ''}
    >
      <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
      {likes}
    </Button>
  )
}


