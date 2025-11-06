'use client'

import { useState, useEffect } from 'react'

const MAX_ANONYMOUS_POSTS = 3
const STORAGE_KEY = 'anonymous_post_count'

export function useAnonymousPosts() {
  const [postCount, setPostCount] = useState(0)
  const [canCreatePost, setCanCreatePost] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
      const count = stored ? parseInt(stored, 10) : 0
      setPostCount(count)
      setCanCreatePost(count < MAX_ANONYMOUS_POSTS)
    }
  }, [])

  const incrementPostCount = () => {
    if (typeof window !== 'undefined') {
      const newCount = postCount + 1
      setPostCount(newCount)
      localStorage.setItem(STORAGE_KEY, newCount.toString())
      setCanCreatePost(newCount < MAX_ANONYMOUS_POSTS)
      return newCount
    }
    return postCount
  }

  const resetPostCount = () => {
    if (typeof window !== 'undefined') {
      setPostCount(0)
      localStorage.setItem(STORAGE_KEY, '0')
      setCanCreatePost(true)
    }
  }

  const getRemainingPosts = () => {
    return Math.max(0, MAX_ANONYMOUS_POSTS - postCount)
  }

  return {
    postCount,
    canCreatePost,
    remainingPosts: getRemainingPosts(),
    maxPosts: MAX_ANONYMOUS_POSTS,
    incrementPostCount,
    resetPostCount,
    isClient,
  }
}

