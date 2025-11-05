'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pen, Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FABAction {
  icon: React.ReactNode
  label: string
  onClick: () => void
  color?: string
}

export function FloatingActionButton() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Hide FAB on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY < 100) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false)
        setIsOpen(false)
      } else {
        setIsVisible(true)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const actions: FABAction[] = [
    {
      icon: <Pen className="w-5 h-5" />,
      label: 'Write Post',
      onClick: () => router.push('/editor/new'),
      color: 'from-teal-500 to-teal-600',
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      label: 'AI Generate',
      onClick: () => router.push('/#generate'),
      color: 'from-orange-500 to-orange-600',
    },
  ]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-6 right-6 z-40"
        >
          {/* Action Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={{
                  open: {
                    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
                  },
                  closed: {
                    transition: { staggerChildren: 0.05, staggerDirection: -1 },
                  },
                }}
                className="absolute bottom-20 right-0 flex flex-col gap-3 items-end"
              >
                {actions.map((action, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      open: { opacity: 1, y: 0, scale: 1 },
                      closed: { opacity: 0, y: 20, scale: 0.8 },
                    }}
                    className="flex items-center gap-3"
                  >
                    {/* Label */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="px-3 py-2 rounded-lg bg-[#1a1a1d] border border-[#27272a] text-text-primary text-sm font-medium shadow-lg whitespace-nowrap"
                    >
                      {action.label}
                    </motion.div>

                    {/* Action Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        action.onClick()
                        setIsOpen(false)
                      }}
                      className={cn(
                        'w-12 h-12 rounded-full bg-gradient-to-br shadow-lg flex items-center justify-center text-white',
                        action.color || 'from-teal-500 to-teal-600',
                      )}
                    >
                      {action.icon}
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main FAB */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-orange-500 shadow-2xl shadow-teal-500/50 flex items-center justify-center text-white relative"
          >
            <motion.div
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
            </motion.div>

            {/* Pulsing ring effect */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-teal-500"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

