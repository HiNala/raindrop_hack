'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { 
  Search, 
  FileText, 
  User, 
  Tag, 
  Clock, 
  TrendingUp,
  Command,
  X,
  ArrowRight
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface SearchResult {
  id: string
  type: 'post' | 'user' | 'tag'
  title: string
  description?: string
  url: string
  metadata?: {
    author?: string
    readTime?: number
    likes?: number
    comments?: number
    followers?: number
    posts?: number
    createdAt?: string
  }
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    type: 'post',
    title: 'Getting Started with Modern Web Development',
    description: 'A comprehensive guide to modern web development tools and practices',
    url: '/p/getting-started-modern-web-development',
    metadata: {
      author: 'Tech Writer',
      readTime: 8,
      likes: 32,
      comments: 8
    }
  },
  {
    id: '2',
    type: 'post',
    title: 'The Future of AI in Software Development',
    description: 'Exploring how artificial intelligence is reshaping the way we write code',
    url: '/p/future-ai-software-development',
    metadata: {
      author: 'AI Expert',
      readTime: 10,
      likes: 67,
      comments: 14
    }
  },
  {
    id: '3',
    type: 'user',
    title: 'Tech Writer',
    description: 'Web development enthusiast and tutorial creator',
    url: '/u/tech-writer',
    metadata: {
      followers: 1200,
      posts: 45
    }
  },
  {
    id: '4',
    type: 'user',
    title: 'AI Expert',
    description: 'Machine learning researcher and AI advocate',
    url: '/u/ai-expert',
    metadata: {
      followers: 3400,
      posts: 23
    }
  },
  {
    id: '5',
    type: 'tag',
    title: 'React',
    description: '235 posts • Popular this week',
    url: '/tag/react',
    metadata: {
      posts: 235
    }
  },
  {
    id: '6',
    type: 'tag',
    title: 'TypeScript',
    description: '189 posts • Growing fast',
    url: '/tag/typescript',
    metadata: {
      posts: 189
    }
  }
]

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'posts' | 'people' | 'tags'>('posts')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [results, setResults] = useState<SearchResult[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Filter results based on query and active tab
  useEffect(() => {
    const filtered = mockSearchResults.filter(result => {
      const matchesQuery = result.title.toLowerCase().includes(query.toLowerCase()) ||
                          result.description?.toLowerCase().includes(query.toLowerCase())
      
      switch (activeTab) {
        case 'posts': return matchesQuery && result.type === 'post'
        case 'people': return matchesQuery && result.type === 'user'
        case 'tags': return matchesQuery && result.type === 'tag'
        default: return matchesQuery
      }
    })
    
    setResults(filtered)
    setSelectedIndex(0)
  }, [query, activeTab])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return

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
        e.preventDefault()
        onClose()
        break
      case 'Tab':
        e.preventDefault()
        const tabs: Array<'posts' | 'people' | 'tags'> = ['posts', 'people', 'tags']
        const currentIndex = tabs.indexOf(activeTab)
        const nextIndex = (currentIndex + 1) % tabs.length
        setActiveTab(tabs[nextIndex])
        break
    }
  }, [isOpen, results, selectedIndex, router, onClose, activeTab])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'post': return <FileText className="w-4 h-4" />
      case 'user': return <User className="w-4 h-4" />
      case 'tag': return <Tag className="w-4 h-4" />
      default: return <Search className="w-4 h-4" />
    }
  }

  const getResultMetadata = (result: SearchResult) => {
    if (result.type === 'post') {
      return (
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span>by {result.metadata?.author}</span>
          <span>•</span>
          <span>{result.metadata?.readTime} min read</span>
          <span>•</span>
          <span>{result.metadata?.likes} likes</span>
        </div>
      )
    }
    
    if (result.type === 'user') {
      return (
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span>{result.metadata?.followers} followers</span>
          <span>•</span>
          <span>{result.metadata?.posts} posts</span>
        </div>
      )
    }
    
    if (result.type === 'tag') {
      return (
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span>{result.metadata?.posts} posts</span>
          <span>•</span>
          <Badge variant="secondary" className="text-xs">
            Popular
          </Badge>
        </div>
      )
    }
    
    return null
  }

  const tabs = [
    { id: 'posts' as const, label: 'Posts', icon: FileText },
    { id: 'people' as const, label: 'People', icon: User },
    { id: 'tags' as const, label: 'Tags', icon: Tag }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Command Palette */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
          <Search className="w-5 h-5 text-gray-400" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts, people, or tags..."
            className="border-0 shadow-none focus:ring-0 flex-1"
          />
          <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">
            ESC
          </kbd>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  activeTab === tab.id
                    ? "bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {query ? 'No results found' : 'Start typing to search...'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Try searching for posts, people, or tags
              </p>
            </div>
          ) : (
            <div className="py-2">
              {results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => {
                    router.push(result.url)
                    onClose()
                  }}
                  className={cn(
                    "w-full flex items-start gap-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                    index === selectedIndex && "bg-gray-50 dark:bg-gray-800"
                  )}
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mt-0.5">
                    {getResultIcon(result.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {result.title}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {result.type}
                      </Badge>
                    </div>
                    
                    {result.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                        {result.description}
                      </p>
                    )}
                    
                    {getResultMetadata(result)}
                  </div>
                  
                  <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Command className="w-3 h-3" />
            <span>Tab to switch tabs</span>
            <span>•</span>
            <span>↑↓ to navigate</span>
            <span>•</span>
            <span>Enter to select</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {results.length} {activeTab === 'posts' ? 'posts' : activeTab === 'people' ? 'people' : 'tags'} found
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook to manage command palette
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  // Global keyboard shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        toggle()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [toggle])

  return {
    isOpen,
    open,
    close,
    toggle
  }
}