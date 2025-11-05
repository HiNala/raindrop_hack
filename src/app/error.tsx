'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg px-4">
      <div className="max-w-md w-full glass-card p-8 text-center">
        <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-orange-400" />
        </div>

        <h1 className="text-2xl font-bold text-text-primary mb-2">Something went wrong</h1>

        <p className="text-text-secondary mb-6">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>

        {error.digest && (
          <p className="text-xs text-text-tertiary mb-6 font-mono">Error ID: {error.digest}</p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} className="btn-primary">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>

          <Link href="/">
            <Button className="btn-secondary">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
