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
  X,
  Sparkles
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
    { name: 'Explore', href: '/explore', icon: Search },
    { name: 'Tags', href: '/tags', icon: Bookmark },
  ]

  const userMenu = [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <>
      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0b] backdrop-blur-lg border-b border-[#27272a] transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Main Nav */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 shadow-glow-teal">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-text-primary group-hover:text-teal-400 transition-colors">
                  Raindrop
                </span>
              </Link>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                {mainNav.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-text-secondary hover:text-text-primary font-medium transition-colors duration-200 flex items-center gap-2"
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
                    className="absolute left-3 top-2.5 w-4 h-4 text-text-muted cursor-pointer hover:text-teal-400 transition-colors"
                  />
                  <Input
                    type="search"
                    placeholder="Search posts... (⌘K)"
                    onClick={open}
                    className="w-64 pl-10 pr-4 h-10 bg-[#1a1a1d] border-[#27272a] focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 cursor-pointer input"
                    readOnly
                  />
                </div>
              </div>

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
                className="bg-teal-500 hover:bg-teal-600 text-white shadow-glow-teal hover:shadow-lg transition-all duration-200"
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
                      className="relative h-10 w-10 rounded-full overflow-hidden hover:ring-2 hover:ring-teal-500 transition-all duration-200"
                    >
                      <Avatar className="h-full w-full">
                        <AvatarImage src={user?.imageUrl} alt={user?.fullName || ''} />
                        <AvatarFallback className="bg-gradient-to-br from-teal-400 to-teal-600 text-white font-semibold">
                          {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress?.charAt(0) || 'U'}
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
                  className="border-[#27272a] hover:bg-[#1a1a1d] text-text-primary hover:text-teal-400 transition-colors"
                >
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden p-2 text-text-secondary hover:text-text-primary"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#27272a] bg-[#0a0a0b]">
            <div className="px-4 py-3 space-y-1">
              {mainNav.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-text-secondary hover:text-text-primary hover:bg-[#1a1a1d] rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Floating Write Button (mobile, signed-in users) */}
      {isSignedIn && (
        <div className="lg:hidden fixed bottom-6 right-6 z-30">
          <Button
            asChild
            size="lg"
            className="h-14 w-14 rounded-full bg-teal-500 hover:bg-teal-600 text-white shadow-glow-teal hover:shadow-lg transition-all duration-200 hover:scale-105"
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