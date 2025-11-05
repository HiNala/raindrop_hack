/**
 * Enhanced 404 Not Found Page
 * Better UX with helpful navigation options
 */

'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft, Search, FileText } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-bg">
      <div className="max-w-md w-full px-4">
        <div className="text-center">
          {/* 404 Number */}
          <div className="mb-6">
            <h1 className="text-9xl font-bold text-teal-400">404</h1>
          </div>

          {/* Error Message */}
          <h2 className="mb-4 text-3xl font-bold text-text-primary">
            Page not found
          </h2>

          <p className="mb-8 text-text-secondary">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          {/* Helpful Actions */}
          <div className="space-y-4">
            {/* Primary Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>

              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>

            {/* Secondary Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="ghost" asChild>
                <Link href="/search">
                  <Search className="mr-2 h-4 w-4" />
                  Search Content
                </Link>
              </Button>

              <Button variant="ghost" asChild>
                <Link href="/posts">
                  <FileText className="mr-2 h-4 w-4" />
                  Browse Posts
                </Link>
              </Button>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-12 rounded-lg border border-dark-border bg-dark-card p-4">
            <p className="text-sm text-text-muted mb-2">
              Looking for something specific?
            </p>
            <p className="text-sm text-text-secondary">
              Try using the search bar or check out our popular posts and categories.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
