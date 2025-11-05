'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, BookOpen, Scroll } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TOCItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content?: string
  className?: string
}

export function TableOfContents({ content, className }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isVisible, setIsVisible] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Extract headings from the article
    const article = document.querySelector('article, [data-article-content]')
    if (!article) return

    const headingElements = article.querySelectorAll('h1, h2, h3, h4')
    const items: TOCItem[] = Array.from(headingElements).map((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1))
      const text = heading.textContent || ''
      const id = heading.id || `heading-${index}`

      // Add ID to heading if it doesn't have one
      if (!heading.id) {
        heading.id = id
      }

      return { id, text, level }
    })

    setHeadings(items)
  }, [content])

  useEffect(() => {
    if (typeof window === 'undefined' || headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-100px 0px -70% 0px',
        threshold: [0, 0.1, 0.5, 1],
      },
    )

    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [headings])

  // Calculate scroll progress
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min(scrollTop / docHeight, 1)
      setScrollProgress(progress)

      // Hide TOC when scrolled to bottom (within 200px)
      const isNearBottom = scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 200
      setIsVisible(!isNearBottom)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToHeading = (id: string) => {
    if (typeof window === 'undefined') return

    const element = document.getElementById(id)
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 100
      const scrollOptions: ScrollToOptions = {
        top,
        behavior: isReducedMotion ? 'auto' : 'smooth'
      }
      window.scrollTo(scrollOptions)
    }
  }

  const getLevelIndent = (level: number) => {
    switch (level) {
      case 1: return 'pl-0'
      case 2: return 'pl-3'
      case 3: return 'pl-6'
      case 4: return 'pl-9'
      default: return 'pl-3'
    }
  }

  const getLevelSize = (level: number) => {
    switch (level) {
      case 1: return 'text-sm font-medium'
      case 2: return 'text-sm'
      case 3: return 'text-xs'
      case 4: return 'text-xs'
      default: return 'text-sm'
    }
  }

  if (headings.length === 0) return null

  const activeIndex = headings.findIndex((h) => h.id === activeId)
  const progressPercentage = activeIndex >= 0 ? ((activeIndex + 1) / headings.length) * 100 : 0

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: isReducedMotion ? 0 : 0.3 }}
          className={cn('hidden lg:block', className)}
        >
          <div className="sticky top-24 w-64 max-h-[calc(100vh-120px)] overflow-y-auto">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
              {/* Header */}
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-gray-700" />
                <h3 className="text-sm font-semibold text-gray-900">
                  Table of Contents
                </h3>
              </div>

              {/* Navigation */}
              <nav className="space-y-1 mb-4">
                {headings.map((heading) => {
                  const isActive = activeId === heading.id
                  return (
                    <motion.button
                      key={heading.id}
                      onClick={() => scrollToHeading(heading.id)}
                      className={cn(
                        'w-full text-left py-2 px-3 rounded-md transition-all duration-200 relative group',
                        getLevelIndent(heading.level),
                        getLevelSize(heading.level),
                        isActive
                          ? 'text-blue-600 bg-blue-50 font-medium'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                      )}
                      whileHover={!isReducedMotion ? { x: 4 } : undefined}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTOC"
                          className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-600 rounded-full"
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}

                      <span className="flex items-start gap-2">
                        {heading.level > 2 && (
                          <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0 opacity-50" />
                        )}
                        <span className="line-clamp-2 leading-tight">{heading.text}</span>
                      </span>

                      {/* Hover indicator for non-active items */}
                      {!isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-300 scale-y-0 group-hover:scale-y-100 transition-transform duration-200 rounded-full" />
                      )}
                    </motion.button>
                  )
                })}
              </nav>

              {/* Progress Section */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Scroll className="w-4 h-4 text-gray-500" />
                  <span className="text-xs font-medium text-gray-700">Reading Progress</span>
                </div>

                <div className="space-y-2">
                  {/* Overall scroll progress */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Scroll</span>
                      <span>{Math.round(scrollProgress * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${scrollProgress * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>

                  {/* Content progress */}
                  {headings.length > 1 && (
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Content</span>
                        <span>{Math.round(progressPercentage)}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercentage}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick navigation */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => scrollToHeading(headings[0].id)}
                    className="flex-1 text-xs py-1.5 px-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Top
                  </button>
                  {activeIndex < headings.length - 1 && (
                    <button
                      onClick={() => scrollToHeading(headings[activeIndex + 1].id)}
                      className="flex-1 text-xs py-1.5 px-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

// Mobile TOC component
export function MobileTableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const article = document.querySelector('article, [data-article-content]')
    if (!article) return

    const headingElements = article.querySelectorAll('h1, h2, h3')
    const items: TOCItem[] = Array.from(headingElements).map((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1))
      const text = heading.textContent || ''
      const id = heading.id || `heading-${index}`

      if (!heading.id) {
        heading.id = id
      }

      return { id, text, level }
    })

    setHeadings(items)
  }, [content])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
      setIsOpen(false)
    }
  }

  if (headings.length === 0) return null

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors mb-4"
      >
        <BookOpen className="w-4 h-4" />
        <span className="text-sm font-medium">Table of Contents</span>
        <span className="text-xs text-gray-500">({headings.length})</span>
      </button>

      {isOpen && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
          <nav className="space-y-2">
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => scrollToHeading(heading.id)}
                className={cn(
                  'w-full text-left py-2 px-3 rounded-md text-sm',
                  'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                  heading.level === 3 && 'pl-6',
                  heading.level === 4 && 'pl-9',
                )}
              >
                {heading.text}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}
