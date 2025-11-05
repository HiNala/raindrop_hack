'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  FileText,
  Tag,
  User,
  Settings,
  Plus,
  TrendingUp,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CommandItem {
  id: string
  title: string
  description?: string
  icon: React.ReactNode
  category: 'posts' | 'tags' | 'users' | 'actions'
  action: () => void
}

export function CommandPalette() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [results, setResults] = useState<CommandItem[]>([])

  // Sample command items (in real app, fetch from API)
  const allCommands: CommandItem[] = [
    {
      id: 'new-post',
      title: 'Create New Post',
      icon: <Plus className="w-4 h-4" />,
      category: 'actions',
      action: () => router.push('/editor/new'),
    },
    {
      id: 'dashboard',
      title: 'Go to Dashboard',
      icon: <TrendingUp className="w-4 h-4" />,
      category: 'actions',
      action: () => router.push('/dashboard'),
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      category: 'actions',
      action: () => router.push('/settings/profile'),
    },
  ]

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }

      if (!isOpen) return

      if (e.key === 'Escape') {
        setIsOpen(false)
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % results.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length)
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault()
        results[selectedIndex].action()
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex])

  // Filter results based on search
  useEffect(() => {
    if (!search) {
      setResults(allCommands.slice(0, 5))
      return
    }

    const filtered = allCommands.filter((cmd) =>
      cmd.title.toLowerCase().includes(search.toLowerCase()),
    )
    setResults(filtered)
    setSelectedIndex(0)
  }, [search])

  const categoryIcons = {
    posts: <FileText className="w-4 h-4" />,
    tags: <Tag className="w-4 h-4" />,
    users: <User className="w-4 h-4" />,
    actions: <Plus className="w-4 h-4" />,
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Command Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
            }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
          >
            <div className="bg-[#1a1a1d] border border-[#27272a] rounded-xl shadow-2xl shadow-teal-500/10 overflow-hidden glass-effect">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[#27272a]">
                <Search className="w-5 h-5 text-text-tertiary" />
                <input
                  type="text"
                  placeholder="Search posts, tags, users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder:text-text-tertiary text-base"
                  autoFocus
                />
                <kbd className="px-2 py-1 text-xs rounded bg-dark-card text-text-tertiary border border-dark-border">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto py-2">
                {results.length === 0 ? (
                  <div className="px-4 py-8 text-center text-text-secondary">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No results found</p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {results.map((item, index) => (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => {
                          item.action()
                          setIsOpen(false)
                        }}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors relative',
                          selectedIndex === index
                            ? 'bg-teal-500/10 text-text-primary'
                            : 'text-text-secondary hover:bg-dark-card',
                        )}
                      >
                        {/* Sliding highlight indicator */}
                        {selectedIndex === index && (
                          <motion.div
                            layoutId="highlight"
                            className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500"
                            transition={{
                              type: 'spring',
                              stiffness: 400,
                              damping: 30,
                            }}
                          />
                        )}

                        <div className="flex-shrink-0 text-teal-400">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{item.title}</div>
                          {item.description && (
                            <div className="text-xs text-text-tertiary truncate">
                              {item.description}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-text-tertiary flex-shrink-0">
                          {categoryIcons[item.category]}
                        </div>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-[#27272a] flex items-center gap-4 text-xs text-text-tertiary">
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-dark-card border border-dark-border">
                    ↑↓
                  </kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-dark-card border border-dark-border">
                    ↵
                  </kbd>
                  <span>Select</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-dark-card border border-dark-border">
                    ESC
                  </kbd>
                  <span>Close</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Trigger button component
export function CommandPaletteTrigger() {
  const [, setIsOpen] = useState(false)

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-card border border-dark-border text-text-secondary hover:border-teal-500/50 hover:text-text-primary transition-colors"
    >
      <Search className="w-4 h-4" />
      <span className="text-sm">Search...</span>
      <kbd className="ml-auto px-1.5 py-0.5 text-xs rounded bg-dark-bg border border-dark-border">
        ⌘K
      </kbd>
    </button>
  )
}
