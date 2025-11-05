'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ReadingProgressProps {
  isActive?: boolean
  showTime?: boolean
  className?: string
}

export function ReadingProgress({
  isActive = true,
  showTime = false,
  className = ''
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0)
  const [readingTime, setReadingTime] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!isActive) return

    const startTime = Date.now()
    let animationFrame: number

    const updateProgress = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight - windowHeight
      const scrolled = window.scrollY
      const progressPercentage = Math.min((scrolled / documentHeight) * 100, 100)

      setProgress(progressPercentage)

      // Update reading time (in seconds)
      const currentTime = Math.floor((Date.now() - startTime) / 1000)
      setReadingTime(currentTime)

      // Show/hide based on scroll position
      setIsVisible(scrolled > 100)

      animationFrame = requestAnimationFrame(updateProgress)
    }

    // Initial update
    updateProgress()

    // Listen for scroll events
    const handleScroll = () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
      animationFrame = requestAnimationFrame(updateProgress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isActive])

  const formatReadingTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  if (!isActive) return null

  return (
    <>
      {/* Top Progress Bar */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`fixed top-0 left-0 right-0 z-50 ${className}`}
          >
            {/* Progress Bar */}
            <div className="h-0.5 bg-[#27272a]">
              <motion.div
                className="h-full bg-gradient-to-r from-teal-500 to-orange-500 origin-left"
                style={{ scaleX: progress / 100 }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>

            {/* Reading Time Badge (optional) */}
            {showTime && readingTime > 10 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-4 top-2 bg-[#0a0a0b]/90 backdrop-blur-sm border border-[#27272a] rounded-full px-3 py-1"
              >
                <span className="text-xs text-text-muted flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" />
                  {formatReadingTime(readingTime)}
                </span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Progress Indicator (Mobile) */}
      <div className="lg:hidden fixed bottom-24 right-4 z-30">
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative w-12 h-12 bg-[#0a0a0b]/90 backdrop-blur-sm border border-[#27272a] rounded-full flex items-center justify-center"
            >
              {/* Circular Progress */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#27272a"
                  strokeWidth="3"
                  fill="none"
                />
                <motion.circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Percentage */}
              <span className="text-xs font-medium text-text-primary z-10">
                {Math.round(progress)}%
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
