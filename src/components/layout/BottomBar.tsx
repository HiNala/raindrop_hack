'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useUser } from '@clerk/nextjs'
import {
  Home,
  Search,
  PenTool,
  MessageCircle,
  User,
  Plus,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  requireAuth?: boolean
}

const navItems: NavItem[] = [
  {
    name: 'home',
    href: '/',
    icon: Home,
    label: 'Home',
  },
  {
    name: 'explore',
    href: '/explore',
    icon: Search,
    label: 'Explore',
  },
  {
    name: 'write',
    href: '/editor/new',
    icon: Plus,
    label: 'Write',
    requireAuth: true,
  },
  {
    name: 'messages',
    href: '/messages',
    icon: MessageCircle,
    label: 'Messages',
    requireAuth: true,
  },
  {
    name: 'profile',
    href: '/dashboard',
    icon: User,
    label: 'Profile',
    requireAuth: true,
  },
]

export function BottomBar() {
  const pathname = usePathname()
  const { isSignedIn } = useUser()

  // Filter items based on auth status
  const visibleItems = navItems.filter(item => !item.requireAuth || isSignedIn)

  const activeItem = visibleItems.find(item => item.href === pathname)

  return (
    <>
      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0b] backdrop-blur-lg border-t border-[#27272a] safe-pb">
        <nav className="flex items-center justify-around h-16 px-2">
          {visibleItems.map((item) => {
            const isActive = item.href === pathname

            return (
              <motion.div
                key={item.name}
                className="relative flex-1"
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg transition-all duration-200 relative min-w-[44px] min-h-[44px]',
                    isActive
                      ? 'text-teal-400'
                      : 'text-text-secondary hover:text-text-primary'
                  )}
                  aria-label={item.label}
                >
                  {/* Active indicator background */}
                  {isActive && (
                    <motion.div
                      layoutId="activeBottomNav"
                      className="absolute inset-0 bg-teal-500/10 rounded-lg border border-teal-500/30"
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}

                  {/* Icon */}
                  <item.icon
                    className={cn(
                      'w-5 h-5 relative z-10',
                      item.name === 'write' && 'w-6 h-6'
                    )}
                  />

                  {/* Label */}
                  <span
                    className={cn(
                      'text-xs font-medium relative z-10',
                      isActive && 'text-teal-400'
                    )}
                  >
                    {item.label}
                  </span>

                  {/* Special styling for Write button */}
                  {item.name === 'write' && (
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg opacity-0 hover:opacity-20 transition-opacity" />
                  )}
                </Link>
              </motion.div>
            )
          })}
        </nav>
      </div>

      {/* Spacer to prevent content overlap */}
      <div className="h-16 safe-pb" />
    </>
  )
}

// Hook to provide bottom bar padding to layouts
export function useBottomBarPadding() {
  return 'pb-[calc(4rem+var(--safe-bottom,0px))]'
}

export default BottomBar
