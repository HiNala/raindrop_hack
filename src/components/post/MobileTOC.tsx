'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { List, ChevronUp, Hash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

interface TOCItem {
  id: string
  title: string
  level: number
}

interface MobileTOCProps {
  headings: TOCItem[]
  activeId?: string
}

export function MobileTOC({ headings, activeId }: MobileTOCProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      // Show TOC button after scrolling past first heading
      const firstHeading = document.querySelector('h1, h2, h3')
      if (firstHeading) {
        const rect = firstHeading.getBoundingClientRect()
        setIsVisible(rect.top < 0)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial state

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 80 // Account for header
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      })
      setIsOpen(false)
    }
  }

  const getHeadingStyle = (level: number) => {
    const baseStyles = 'transition-all duration-200 hover:text-teal-400'
    const indentStyles = {
      1: 'font-semibold',
      2: 'pl-4 text-sm',
      3: 'pl-8 text-sm text-text-muted'
    }
    return `${baseStyles} ${indentStyles[level as keyof typeof indentStyles] || ''}`
  }

  if (headings.length === 0) return null

  return (
    <>
      {/* Floating TOC Button */}
      <AnimatePresence>
        {isVisible && !isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="lg:hidden fixed bottom-24 left-4 z-30"
          >
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  size="sm"
                  className="h-12 px-4 bg-[#0a0a0b]/90 backdrop-blur-sm border border-[#27272a] text-text-primary hover:bg-[#1a1a1d] shadow-lg"
                >
                  <List className="w-4 h-4 mr-2" />
                  <span className="text-sm">Contents</span>
                  <ChevronUp className="w-4 h-4 ml-1 rotate-180" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="bottom"
                className="h-[70vh] max-h-[500px] bg-[#0a0a0b] border-[#27272a] rounded-t-2xl safe-pb"
                onInteractOutside={(e) => e.preventDefault()}
              >
                <SheetHeader className="px-4 pt-4 pb-2 border-b border-[#27272a]">
                  <SheetTitle className="text-left text-text-primary flex items-center gap-2">
                    <Hash className="w-5 h-5 text-teal-400" />
                    Table of Contents
                  </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-4 py-4">
                  {headings.length === 0 ? (
                    <div className="text-center py-8">
                      <Hash className="w-12 h-12 text-text-muted mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-text-primary mb-2">
                        No headings found
                      </h3>
                      <p className="text-text-secondary text-sm">
                        This article doesn't have any headings to display in the table of contents.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {headings.map((heading, index) => {
                        const isActive = activeId === heading.id
                        return (
                          <motion.button
                            key={heading.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => scrollToHeading(heading.id)}
                            className={cn(
                              'w-full text-left p-3 rounded-lg transition-all duration-200',
                              getHeadingStyle(heading.level),
                              isActive
                                ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                                : 'hover:bg-[#1a1a1d] text-text-secondary'
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                'w-1 h-1 rounded-full',
                                isActive ? 'bg-teal-400' : 'bg-[#27272a]'
                              )} />
                              <span className="line-clamp-2">{heading.title}</span>
                            </div>
                          </motion.button>
                        )
                      })}
                    </div>
                  )}

                  {/* Reading Progress */}
                  <div className="mt-6 pt-6 border-t border-[#27272a]">
                    <div className="text-center">
                      <p className="text-xs text-text-muted mb-2">
                        {headings.length} section{headings.length !== 1 ? 's' : ''}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="border-[#27272a] hover:bg-[#1a1a1d] text-text-primary"
                      >
                        Back to top
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop TOC (for reference, hidden on mobile) */}
      <div className="hidden lg:block" ref={containerRef}>
        {/* Desktop TOC implementation would go here */}
      </div>
    </>
  )
}

// Hook to extract headings from content
export function useHeadings(containerSelector = '.prose') {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const extractHeadings = () => {
      const container = document.querySelector(containerSelector)
      if (!container) return

      const headingElements = container.querySelectorAll('h1, h2, h3')
      const extractedHeadings: TOCItem[] = Array.from(headingElements).map((heading) => ({
        id: heading.id || `heading-${Math.random().toString(36).substr(2, 9)}`,
        title: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1)),
      }))

      setHeadings(extractedHeadings)
    }

    extractHeadings()

    // Re-extract when content changes
    const observer = new MutationObserver(extractHeadings)
    const container = document.querySelector(containerSelector)
    if (container) {
      observer.observe(container, {
        childList: true,
        subtree: true,
      })
    }

    return () => observer.disconnect()
  }, [containerSelector])

  // Track active heading based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map(heading => ({
        ...heading,
        element: document.getElementById(heading.id),
      }))

      const visibleHeadings = headingElements.filter(({ element }) => {
        if (!element) return false
        const rect = element.getBoundingClientRect()
        return rect.top <= 100 // Account for header height
      })

      if (visibleHeadings.length > 0) {
        setActiveId(visibleHeadings[visibleHeadings.length - 1].id)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [headings])

  return { headings, activeId }
}
