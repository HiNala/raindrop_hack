'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import {
  Home,
  Search,
  PenTool,
  Bookmark,
  BarChart3,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  requiresAuth?: boolean
}

export function BottomNavigation() {
  const { isSignedIn } = useUser()
  const pathname = usePathname()

  const navItems: NavItem[] = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Explore', href: '/explore', icon: Search },
    { name: 'Write', href: '/editor/new', icon: PenTool, requiresAuth: true },
    { name: 'Tags', href: '/tags', icon: Bookmark },
    { name: 'Profile', href: isSignedIn ? '/dashboard' : '/sign-in', icon: User },
  ]

  // Filter out auth-required items if not signed in
  const visibleNavItems = navItems.filter(item => !item.requiresAuth || isSignedIn)

  return (
    <>
      {/* Bottom padding to account for fixed bottom nav */}
      <div className="h-16 sm:h-0 flex-shrink-0" />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0b]/95 backdrop-blur-lg border-t border-[#27272a] safe-pb">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-around items-center h-16">
            {visibleNavItems.map((item) => {
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center justify-center w-full h-full',
                    'relative transition-colors duration-200',
                    'text-text-secondary hover:text-text-primary',
                    'min-h-[44px] min-w-[44px]', // 44px minimum touch target
                    isActive && 'text-teal-400'
                  )}
                >
                  <motion.div
                    className="flex flex-col items-center gap-1"
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon
                      className={cn(
                        'w-5 h-5 transition-transform duration-200',
                        isActive && 'scale-110'
                      )}
                    />
                    <span
                      className={cn(
                        'text-xs font-medium transition-all duration-200',
                        isActive ? 'text-teal-400 font-semibold' : 'text-text-secondary'
                      )}
                    >
                      {item.name}
                    </span>
                  </motion.div>

                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="bottomNavActive"
                      className="absolute inset-x-2 top-1 h-0.5 bg-teal-400 rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </>
  )
}
