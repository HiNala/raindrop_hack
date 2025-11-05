'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Command,
  FileText,
  Hash,
  User,
  Calendar,
  ArrowRight,
  X
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface SearchResult {
  id: string
  title: string
  type: 'post' | 'tag' | 'author' | 'date'
  url: string
  description?: string
  metadata?: {
    readTime?: number
    author?: string
    date?: string
  }
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Mock search function - replace with actual API call
  const searchContent = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))

    // Mock results
    const mockResults: SearchResult[] = [
      {
        id: '1',
        title: 'Getting Started with Next.js 15',
        type: 'post',
        url: '/p/getting-started-nextjs-15',
        description: 'A comprehensive guide to Next.js 15',
        metadata: {
          readTime: 5,
          author: 'John Doe',
          date: '2 days ago'
        }
      },
      {
        id: '2',
        title: 'react',
        type: 'tag',
        url: '/tag/react',
        description: 'Posts about React development'
      },
      {
        id: '3',
        title: 'Jane Smith',
        type: 'author',
        url: '/u/jane-smith',
        description: 'Frontend developer and writer'
      }
    ].filter(result =>
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    setResults(mockResults)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchContent(query)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, searchContent])

  useEffect(() => {
    setSelectedIndex(0)
  }, [results])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % results.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev === 0 ? results.length - 1 : prev - 1)
        break
      case 'Enter':
        e.preventDefault()
        if (results[selectedIndex]) {
          router.push(results[selectedIndex].url)
          onClose()
        }
        break
      case 'Escape':
        onClose()
        break
    }
  }, [results, selectedIndex, router, onClose])

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'post':
        return <FileText className="w-4 h-4" />
      case 'tag':
        return <Hash className="w-4 h-4" />
      case 'author':
        return <User className="w-4 h-4" />
      case 'date':
        return <Calendar className="w-4 h-4" />
      default:
        return <Search className="w-4 h-4" />
    }
  }

  const getResultColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'post':
        return 'text-teal-400 bg-teal-500/10 border-teal-500/30'
      case 'tag':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/30'
      case 'author':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30'
      case 'date':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30'
      default:
        return 'text-text-secondary bg-dark-bg border-dark-border'
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="top"
        className="h-[85vh] max-h-[600px] bg-[#0a0a0b] border-[#27272a] p-0 safe-px safe-pt"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader className="px-4 pt-4 pb-2 border-b border-[#27272a]">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-left text-text-primary flex items-center gap-2">
              <Search className="w-5 h-5 text-teal-400" />
              Search
            </SheetTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary p-2 h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="px-4 py-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
            <Input
              placeholder="Search posts, tags, authors..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10 pr-10 h-12 bg-[#1a1a1d] border-[#27272a] focus:border-teal-500 text-[16px] placeholder:text-text-muted"
              autoFocus
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <kbd className="px-2 py-1 text-xs bg-[#27272a] border border-[#3a3a3d] rounded text-text-muted">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 bg-[#1a1a1d] rounded-lg animate-pulse">
                  <div className="h-4 bg-[#27272a] rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-[#27272a] rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : results.length === 0 && query ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">
                No results found
              </h3>
              <p className="text-text-secondary text-sm">
                Try searching for posts, tags, or authors
              </p>
            </div>
          ) : !query ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-text-muted mb-2">Quick Actions</h3>
                <div className="space-y-1">
                  <Link href="/editor/new" onClick={onClose}>
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1a1a1d] transition-colors cursor-pointer">
                      <div className="w-8 h-8 bg-teal-500/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-teal-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-text-primary">New Post</div>
                        <div className="text-xs text-text-secondary">Create a new blog post</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-text-muted" />
                    </div>
                  </Link>
                  <Link href="/dashboard" onClick={onClose}>
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1a1a1d] transition-colors cursor-pointer">
                      <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
                        <Command className="w-4 h-4 text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-text-primary">Dashboard</div>
                        <div className="text-xs text-text-secondary">View your dashboard</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-text-muted" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={result.url} onClick={onClose}>
                    <div
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer ${
                        index === selectedIndex
                          ? 'bg-[#1a1a1d] border border-teal-500/30'
                          : 'hover:bg-[#1a1a1d]'
                      }`}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getResultColor(result.type)}`}>
                        {getResultIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-text-primary truncate">
                          {result.title}
                        </div>
                        {result.description && (
                          <div className="text-xs text-text-secondary truncate">
                            {result.description}
                          </div>
                        )}
                        {result.metadata && (
                          <div className="flex items-center gap-3 mt-1">
                            {result.metadata.readTime && (
                              <span className="text-xs text-text-muted">
                                {result.metadata.readTime} min read
                              </span>
                            )}
                            {result.metadata.author && (
                              <span className="text-xs text-text-muted">
                                by {result.metadata.author}
                              </span>
                            )}
                            {result.metadata.date && (
                              <span className="text-xs text-text-muted">
                                {result.metadata.date}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs border-[#27272a] text-text-muted">
                        {result.type}
                      </Badge>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
