'use client'

import { useEffect, useRef } from 'react'

interface AnalyticsClientProps {
  postId: string
}

export function AnalyticsClient({ postId }: AnalyticsClientProps) {
  const sentRead = useRef(false)

  useEffect(() => {
    // Track view immediately
    fetch('/api/analytics/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }),
    }).catch(console.error)

    // Track read after 30 seconds
    const timer = setTimeout(() => {
      if (!sentRead.current) {
        sentRead.current = true
        fetch('/api/analytics/read', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId }),
        }).catch(console.error)
      }
    }, 30000)

    return () => clearTimeout(timer)
  }, [postId])

  return null
}
