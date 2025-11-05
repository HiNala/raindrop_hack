'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useUser } from '@clerk/nextjs'
import {
  Search,
  Bell,
  Settings,
  LogOut,
  User,
  PenTool,
  Home,
  Bookmark,
  BarChart3,
  Menu,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { CommandPalette } from '@/components/search/CommandPalette'
import { flags } from '@/lib/feature-flags'

interface HeaderProps {
  onSearchOpen?: () => void
  className?: string
}

export function Header({ onSearchOpen, className }: HeaderProps) {
  const { isSignedIn, user } = useUser()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const [hoveredNav, setHoveredNav] = useState<string | null>(null)
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [_isScrolled, setIsScrolled] = useState(false)

  const openCommandPalette = () => setIsCommandOpen(true)
  const closeCommandPalette = () => setIsCommandOpen(false)

  const handleSearchClick = () => {
    if (onSearchOpen) {
      onSearchOpen()
    } else {
      openCommandPalette()
    }
  }

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Global keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        openCommandPalette()
      }
      if (e.key === 'Escape' && isCommandOpen) {
        closeCommandPalette()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCommandOpen])

  const mainNav = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Explore', href: '/explore', icon: Search },
    ...(flags.analytics ? [{ name: 'Tags', href: '/tags', icon: Bookmark }] : []),
  ].filter(Boolean)

  const userMenu = [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    ...(flags.settings ? [{ name: 'Settings', href: '/settings', icon: Settings }] : []),
  ].filter(Boolean)

  return (
    <>
      {/* Main Header */}
      <header className={`sticky top-0 z-40 bg-[#0a0a0b]/80 backdrop-blur-lg border-b border-[#27272a] transition-all duration-200 safe-pt ${className || ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo and Main Nav */}
            <div className="flex items-center space-x-4 sm:space-x-8">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 shadow-glow-teal">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="font-bold text-lg sm:text-xl text-text-primary group-hover:text-teal-400 transition-colors">
                  Raindrop
                </span>
              </Link>

              {/* Desktop Navigation with sliding indicator */}
              <nav className="hidden md:flex items-center gap-1 relative">
                {mainNav.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <motion.div
                      key={item.name}
                      onHoverStart={() => setHoveredNav(item.name)}
                      onHoverEnd={() => setHoveredNav(null)}
                      whileHover={{ y: -2 }}
                      className="relative"
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          'px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 relative z-10 focus:outline-none focus:ring-2 focus:ring-teal-500/50',
                          isActive
                            ? 'text-text-primary'
                            : 'text-text-secondary hover:text-text-primary'
                        )}
                      >
                        {item.icon && <item.icon className="w-4 h-4" />}
                        {item.name}
                      </Link>

                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 bg-teal-500/10 rounded-lg border border-teal-500/30"
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}

                      {/* Hover effect */}
                      {hoveredNav === item.name && !isActive && (
                        <motion.div
                          layoutId="hoverNav"
                          className="absolute inset-0 bg-dark-card rounded-lg"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                    </motion.div>
                  )
                })}
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Search - Desktop */}
              <div className="hidden lg:block">
                <div className="relative">
                  <Search
                    onClick={handleSearchClick}
                    className="absolute left-3 top-2.5 w-4 h-4 text-text-muted cursor-pointer hover:text-teal-400 transition-colors"
                    aria-label="Open search"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleSearchClick()
                      }
                    }}
                  />
                  <Input
                    type="search"
                    placeholder="Search posts... (⌘K)"
                    onClick={handleSearchClick}
                    className="w-48 sm:w-64 pl-10 pr-4 h-10 bg-[#1a1a1d] border-[#27272a] focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 cursor-pointer input text-[16px]"
                    readOnly
                    aria-label="Search posts and articles"
                  />
                </div>
              </div>

              {/* Mobile Search */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-2 text-text-secondary hover:text-text-primary"
                onClick={handleSearchClick}
                aria-label="Open search"
              >
                <Search className="w-5 h-5" />
              </Button>

              {/* Notifications (for signed-in users) */}
              {isSignedIn && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative p-2 hover:bg-[#1a1a1d] transition-colors text-text-secondary hover:text-text-primary"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
                </Button>
              )}

              {/* Write Button */}
              <Button
                asChild
                className="bg-teal-500 hover:bg-teal-600 text-white shadow-glow-teal hover:shadow-lg transition-all duration-200 h-9 px-3 sm:h-10 sm:px-4"
              >
                <Link href="/editor/new" className="flex items-center gap-2">
                  <PenTool className="w-4 h-4" />
                  <span className="hidden sm:inline">Write</span>
                </Link>
              </Button>

              {/* User Avatar / Sign In */}
              {isSignedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full overflow-hidden hover:ring-2 hover:ring-teal-500 transition-all duration-200 p-0"
                    >
                      <Avatar className="h-full w-full">
                        <AvatarImage src={user?.imageUrl} alt={user?.fullName || ''} />
                        <AvatarFallback className="bg-gradient-to-br from-teal-400 to-teal-600 text-white font-semibold text-sm">
                          {user?.firstName?.charAt(0) ||
                            user?.emailAddresses[0]?.emailAddress?.charAt(0) ||
                            'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-[#1a1a1d] border-[#27272a]">
                    <div className="px-2 py-1.5 text-sm font-semibold text-text-primary border-b border-[#27272a]">
                      {user?.fullName || user?.emailAddresses[0]?.emailAddress}
                    </div>
                    <DropdownMenuSeparator className="bg-[#27272a]" />
                    {userMenu.map((item) => (
                      <DropdownMenuItem key={item.name} asChild>
                        <Link
                          href={item.href}
                          className="flex items-center gap-3 px-2 py-2 text-sm cursor-pointer hover:bg-[#2a2a2d] transition-colors text-text-primary"
                        >
                          <item.icon className="w-4 h-4 text-text-muted" />
                          {item.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator className="bg-[#27272a]" />
                    <DropdownMenuItem className="flex items-center gap-3 px-2 py-2 text-sm cursor-pointer hover:bg-[#2a2a2d] transition-colors text-text-primary">
                      <LogOut className="w-4 h-4 text-text-muted" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="outline"
                  asChild
                  className="border-[#27272a] hover:bg-[#1a1a1d] text-text-primary hover:text-teal-400 transition-colors h-9 px-3 sm:h-10 sm:px-4 text-[16px]"
                >
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              )}

              {/* Mobile Menu Toggle - Sheet */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 text-text-secondary hover:text-text-primary h-9 w-9"
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] bg-[#0a0a0b] border-[#27272a] p-0 safe-pt">
                  <SheetHeader className="p-4 pb-0">
                    <SheetTitle className="text-left text-text-primary">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl">Raindrop</span>
                      </div>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="px-4 py-4 space-y-2">
                    <div className="space-y-1">
                      {mainNav.map((item) => {
                        const isActive = pathname === item.href
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 text-base font-medium rounded-lg transition-colors ${
                              isActive
                                ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                                : 'text-text-secondary hover:text-text-primary hover:bg-[#1a1a1d]'
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                          </Link>
                        )
                      })}
                    </div>

                    {isSignedIn && (
                      <>
                        <div className="border-t border-[#27272a] pt-4 mt-4">
                          <div className="px-3 py-2">
                            <div className="flex items-center gap-3 mb-4">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={user?.imageUrl} alt={user?.fullName || ''} />
                                <AvatarFallback className="bg-gradient-to-br from-teal-400 to-teal-600 text-white font-semibold">
                                  {user?.firstName?.charAt(0) ||
                                    user?.emailAddresses[0]?.emailAddress?.charAt(0) ||
                                    'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-text-primary truncate">
                                  {user?.fullName || 'User'}
                                </div>
                                <div className="text-xs text-text-muted truncate">
                                  {user?.emailAddresses[0]?.emailAddress}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1">
                            {userMenu.map((item) => (
                              <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center gap-3 px-3 py-2 text-base font-medium text-text-secondary hover:text-text-primary hover:bg-[#1a1a1d] rounded-lg transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Command Palette */}
      <CommandPalette isOpen={isCommandOpen} onClose={closeCommandPalette} />
    </>
  )
}
