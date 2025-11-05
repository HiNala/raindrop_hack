// Enhanced header with user shell and navigation
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useUser, UserButton } from '@clerk/nextjs'
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
  X
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
import { useCommandPalette } from '@/components/search/CommandPalette'

interface HeaderProps {
  onSearchOpen?: () => void
}

export function Header({ onSearchOpen }: HeaderProps) {
  const { isSignedIn, user } = useUser()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isOpen, open, close } = useCommandPalette()

  const mainNav = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Categories', href: '/categories', icon: null },
    { name: 'About', href: '/about', icon: null },
    { name: 'Contact', href: '/contact', icon: null },
  ]

  const userMenu = [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Sign out', href: '/sign-out', icon: LogOut, action: 'signout' },
  ]

  const sidebarNav = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Following', href: '/following', icon: User },
    { name: 'Tags', href: '/tags', icon: Bookmark },
    { name: 'Drafts', href: '/drafts', icon: PenTool },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ]

  return (
    <>
      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Main Nav */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <span className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  Blog App
                </span>
              </Link>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                {mainNav.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors duration-200 flex items-center gap-2"
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            
            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="hidden md:block">
                <div className="relative">
                  <Search
                    onClick={open}
                    className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  />
                  <Input
                    type="search"
                    placeholder="Search posts... (⌘K)"
                    onClick={open}
                    className="w-64 pl-10 pr-4 h-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-primary-500 cursor-pointer"
                    readOnly
                  />
                </div>
              </div>

              {/* Notifications (for signed-in users) */}
              {isSignedIn && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
              )}

              {/* Write Button */}
              <Button
                asChild
                className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
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
                      className="relative h-10 w-10 rounded-full overflow-hidden hover:ring-2 hover:ring-primary-500 transition-all duration-200"
                    >
                      <Avatar className="h-full w-full">
                        <AvatarImage src={user?.imageUrl} alt={user?.fullName || ''} />
                        <AvatarFallback className="bg-gradient-to-br from-primary-400 to-primary-600 text-white font-semibold">
                          {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
                      {user?.fullName || user?.emailAddresses[0]?.emailAddress}
                    </div>
                    <DropdownMenuSeparator />
                    {userMenu.map((item) => (
                      <DropdownMenuItem key={item.name} asChild>
                        <Link 
                          href={item.href} 
                          className="flex items-center gap-3 px-2 py-2 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <item.icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          {item.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="outline"
                  asChild
                  className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="px-4 py-3 space-y-1">
              {mainNav.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Expandable Sidebar Rail (for desktop, signed-in users) */}
      {isSignedIn && (
        <div className="hidden lg:block fixed left-0 top-16 h-full w-16 hover:w-64 transition-all duration-300 ease-out z-30 group">
          <div className="h-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-r border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-3">
              <div className="space-y-2">
                {sidebarNav.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 group"
                    title={item.name}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200">
                      {item.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Write Button (mobile, signed-in users) */}
      {isSignedIn && (
        <div className="lg:hidden fixed bottom-6 right-6 z-30">
          <Button
            asChild
            size="lg"
            className="h-14 w-14 rounded-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <Link href="/editor/new">
              <PenTool className="w-6 h-6" />
            </Link>
          </Button>
        </div>
      )}
    </>
  )
}