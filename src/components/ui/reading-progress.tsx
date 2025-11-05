'use client'

import React, { useState, useEffect } from 'react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface ReadingProgressProps {
  className?: string
}

export function ReadingProgress({ className }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight - windowHeight
      const scrolled = window.scrollY
      const progressPercentage = (scrolled / documentHeight) * 100

      setProgress(Math.min(Math.max(progressPercentage, 0), 100))
    }

    // Add scroll listener with passive for performance
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Initial calculation
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-30 h-[2px] bg-gray-200 dark:bg-gray-800",
        "supports-backdrop-blur:bg-background/80 backdrop-blur-sm",
        className
      )}
    >
      <Progress
        value={progress}
        className="h-full rounded-none bg-transparent"
        // Respect reduced motion
        style={{
          transition: 'width 0.1s linear',
          ...(window.matchMedia('(prefers-reduced-motion: reduce)').matches && {
            transition: 'none'
          })
        }}
      />
    </div>
  )
}

export default ReadingProgress
