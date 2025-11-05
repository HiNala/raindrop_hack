'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Menu,
  X,
  Home,
  FileText,
  Folder,
  MessageSquare,
  Users,
  Settings,
  BarChart3,
  Bell,
  Search,
  UserCircle,
  ChevronDown,
} from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: Home,
      current: true,
      description: 'Overview and statistics',
    },
    {
      name: 'Posts',
      href: '/admin/posts',
      icon: FileText,
      current: false,
      description: 'Manage blog posts',
    },
    {
      name: 'Categories',
      href: '/admin/categories',
      icon: Folder,
      current: false,
      description: 'Organize content',
    },
    {
      name: 'Comments',
      href: '/admin/comments',
      icon: MessageSquare,
      current: false,
      description: 'Moderate discussions',
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
      current: false,
      description: 'User management',
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      current: false,
      description: 'View insights',
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      current: false,
      description: 'Configure site',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <span className="font-bold text-xl text-gray-900">Admin Panel</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* User info */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">A</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
                  <p className="text-xs text-gray-500 truncate">admin@blogapp.com</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200
                    ${item.current
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
                  `}
                >
                  <item.icon className={`
                    mr-3 h-5 w-5 flex-shrink-0
                    ${item.current ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'}
                  `} />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                  </div>
                </Link>
              ))}
            </nav>

            {/* Quick Actions */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Link
                  href="/admin/posts/new"
                  className="flex items-center px-3 py-2 text-sm text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  New Post
                </Link>
                <Link
                  href="/admin/comments/pending"
                  className="flex items-center px-3 py-2 text-sm text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Review Comments
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 lg:ml-0">
          {/* Top bar */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  <Menu className="w-6 h-6" />
                </button>

                {/* Search */}
                <div className="hidden md:block ml-4 flex-1 max-w-lg">
                  <div className="relative">
                    <input
                      type="search"
                      placeholder="Search posts, users, or comments..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                    />
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <UserCircle className="w-5 h-5" />
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* Dropdown menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <div className="py-1">
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Profile
                      </a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Settings
                      </a>
                      <hr className="my-1 border-gray-200" />
                      <a href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        View Site
                      </a>
                      <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                        Sign Out
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
