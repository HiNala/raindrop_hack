/**
 * Enhanced Error Page
 * Better error handling with recovery options
 */

'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCcw, Home, Bug } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-bg">
      <div className="max-w-md w-full">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mb-6 inline-flex rounded-full bg-red-400/10 p-6">
            <AlertCircle className="h-12 w-12 text-red-400" />
          </div>

          {/* Error Title */}
          <h1 className="mb-4 text-2xl font-bold text-text-primary">
            Something went wrong
          </h1>

          {/* Error Message */}
          <p className="mb-6 text-text-secondary">
            We&apos;re sorry for the inconvenience. An unexpected error occurred while
            processing your request.
          </p>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="mb-6 rounded-lg border border-dark-border bg-dark-card p-4 text-left">
              <p className="mb-2 text-sm font-medium text-text-muted">Error Details:</p>
              <p className="text-sm text-text-secondary font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="mt-2 text-xs text-text-muted">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={reset} className="flex items-center gap-2">
              <RefreshCcw className="h-4 w-4" />
              Try Again
            </Button>

            <Button variant="outline" onClick={() => window.location.href = '/'}>
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>

            {process.env.NODE_ENV === 'development' && (
              <Button variant="outline" onClick={() => window.location.reload()}>
                <Bug className="mr-2 h-4 w-4" />
                Refresh Page
              </Button>
            )}
          </div>

          {/* Help Text */}
          <p className="mt-8 text-sm text-text-muted">
            If the problem persists, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  )
}
