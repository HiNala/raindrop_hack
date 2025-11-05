'use client'

import Link from 'next/link'
import { WifiOff, RefreshCw, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Offline Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full flex items-center justify-center">
            <WifiOff className="w-10 h-10 text-orange-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-text-primary mb-3">
          You're offline
        </h1>

        {/* Description */}
        <p className="text-text-secondary mb-6">
          It looks like you've lost your internet connection.
          Some features may not be available until you're back online.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleRetry}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex-1 border-[#27272a] hover:bg-[#1a1a1d] text-text-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <Link href="/" className="flex-1">
              <Button
                variant="outline"
                className="w-full border-[#27272a] hover:bg-[#1a1a1d] text-text-primary"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-4 bg-[#1a1a1d] rounded-lg border border-[#27272a]">
          <h2 className="text-sm font-semibold text-text-primary mb-2">
            While you're offline, you can:
          </h2>
          <ul className="text-xs text-text-secondary space-y-1 text-left">
            <li>• Read previously loaded posts</li>
            <li>• View your drafts</li>
            <li>• Browse cached content</li>
            <li>• Write new drafts (sync when online)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
