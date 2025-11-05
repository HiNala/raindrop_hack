'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { List, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TOCItem {
  id: string
  title: string
  level: number
}

interface MobileTOCProps {
  items: TOCItem[]
  activeId: string
  className?: string
}

export function MobileTOC({ items, activeId, className }: MobileTOCProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 80 // Account for header
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
    setIsOpen(false)
  }

  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className={cn("sticky top-20 z-20", className)}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden w-full justify-between bg-[#1a1a1d] border-[#27272a] hover:bg-[#2a2a2d] text-text-primary min-h-[44px]"
          >
            <span className="flex items-center gap-2">
              <List className="w-4 h-4" />
              Contents
            </span>
            <span className="text-xs text-text-tertiary">
              {items.length} sections
            </span>
          </Button>
        </SheetTrigger>

        <SheetContent
          side="bottom"
          className="h-[75vh] bg-[#1a1a1d] border-[#27272a] pb-safe-plus"
        >
          <SheetHeader className="pb-4 border-b border-[#27272a]">
            <SheetTitle className="text-text-primary flex items-center justify-between">
              <span>Table of Contents</span>
              <span className="text-sm text-text-tertiary">
                {items.length} sections
              </span>
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1">
              {items.map((item, index) => {
                const isActive = activeId === item.id
                const paddingLeft = (item.level - 1) * 16

                return (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToHeading(item.id)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-lg transition-all duration-200",
                      "hover:bg-[#2a2a2d] focus:bg-[#2a2a2d]",
                      "focus:outline-none focus:ring-2 focus:ring-teal-500/20",
                      "min-h-[44px] flex items-center",
                      isActive
                        ? "bg-teal-500/10 text-teal-400 border-l-2 border-teal-400"
                        : "text-text-secondary hover:text-text-primary"
                    )}
                    style={{ paddingLeft: `${16 + paddingLeft}px` }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <span className="text-sm font-medium">{item.title}</span>
                  </motion.button>
                )
              })}
            </nav>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default MobileTOC
