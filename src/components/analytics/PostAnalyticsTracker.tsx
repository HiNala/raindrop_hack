'use client'

import { useEffect, useRef } from 'react'
import { trackPostView, trackPostRead, trackReadingTime, getReferrerFromHeaders } from '@/lib/analytics'

interface PostAnalyticsTrackerProps {
  postId: string
  readThreshold?: number // percentage of post that needs to be read (default: 75%)
}

export function PostAnalyticsTracker({ postId, readThreshold = 75 }: PostAnalyticsTrackerProps) {
  const hasTrackedView = useRef(false)
  const hasTrackedRead = useRef(false)
  const readStartTime = useRef<number | null>(null)
  const totalTimeSpent = useRef(0)

  useEffect(() => {
    // Track view on mount
    if (!hasTrackedView.current) {
      const referrer = getReferrerFromHeaders(new Request(window.location.href))
      trackPostView(postId, undefined, referrer)
      hasTrackedView.current = true
      readStartTime.current = Date.now()
    }

    // Track reading progress
    const handleScroll = () => {
      if (hasTrackedRead.current) return

      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100

      if (scrollPercent >= readThreshold) {
        trackPostRead(postId)
        hasTrackedRead.current = true

        // Track reading time
        if (readStartTime.current) {
          const timeSpent = Math.round((Date.now() - readStartTime.current) / 1000)
          totalTimeSpent.current += timeSpent
          trackReadingTime(postId, timeSpent)
        }
      }
    }

    // Track time spent on page before unload
    const handleBeforeUnload = () => {
      if (readStartTime.current && !hasTrackedRead.current) {
        const timeSpent = Math.round((Date.now() - readStartTime.current) / 1000)
        totalTimeSpent.current += timeSpent
        trackReadingTime(postId, timeSpent)
      }
    }

    // Track time spent when visibility changes (tab switch)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab became hidden - pause timer
        if (readStartTime.current) {
          const timeSpent = Math.round((Date.now() - readStartTime.current) / 1000)
          totalTimeSpent.current += timeSpent
          readStartTime.current = null
        }
      } else {
        // Tab became visible - resume timer
        readStartTime.current = Date.now()
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)

      // Final time tracking
      if (readStartTime.current) {
        const timeSpent = Math.round((Date.now() - readStartTime.current) / 1000)
        totalTimeSpent.current += timeSpent
        if (totalTimeSpent.current > 0) {
          trackReadingTime(postId, totalTimeSpent.current)
        }
      }
    }
  }, [postId, readThreshold])

  return null // This component doesn't render anything
}


