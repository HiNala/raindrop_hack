'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TOCItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content?: string
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Extract headings from the article
    const article = document.querySelector('article')
    if (!article) return

    const headingElements = article.querySelectorAll('h1, h2, h3')
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
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 1,
      }
    )

    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [headings])

  // Hide TOC when scrolled to bottom
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const clientHeight = window.innerHeight
      
      // Hide when near bottom (within 300px)
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 300
      setIsVisible(!isNearBottom)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  if (headings.length === 0) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="hidden lg:block fixed right-8 top-32 w-64 max-h-[calc(100vh-200px)] overflow-y-auto"
        >
          <div className="glass-effect p-4 rounded-lg border border-[#27272a]">
            <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-teal-500 rounded-full"></span>
              Table of Contents
            </h3>
            
            <nav className="space-y-1">
              {headings.map((heading) => (
                <motion.button
                  key={heading.id}
                  onClick={() => scrollToHeading(heading.id)}
                  className={cn(
                    'w-full text-left text-sm py-1.5 px-2 rounded transition-all duration-200 relative',
                    'hover:bg-dark-card',
                    activeId === heading.id
                      ? 'text-teal-400 font-medium'
                      : 'text-text-secondary hover:text-text-primary',
                    heading.level === 2 && 'pl-2',
                    heading.level === 3 && 'pl-6 text-xs'
                  )}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Active indicator */}
                  {activeId === heading.id && (
                    <motion.div
                      layoutId="activeTOC"
                      className="absolute left-0 top-0 bottom-0 w-0.5 bg-teal-500 rounded-full"
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  
                  <span className="flex items-center gap-1.5">
                    {heading.level === 3 && (
                      <ChevronRight className="w-3 h-3 flex-shrink-0 opacity-50" />
                    )}
                    <span className="line-clamp-2">{heading.text}</span>
                  </span>
                </motion.button>
              ))}
            </nav>

            {/* Progress indicator */}
            <div className="mt-4 pt-3 border-t border-dark-border">
              <div className="flex items-center justify-between text-xs text-text-tertiary mb-1.5">
                <span>Reading progress</span>
                <span>{Math.round((headings.findIndex(h => h.id === activeId) + 1) / headings.length * 100)}%</span>
              </div>
              <div className="h-1 bg-dark-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-teal-500 to-orange-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((headings.findIndex(h => h.id === activeId) + 1) / headings.length) * 100}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

