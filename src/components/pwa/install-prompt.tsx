'use client'

import { useEffect, useState } from 'react'
import { X, Download, Smartphone, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(isIOSDevice)

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Show prompt after user engagement
      const pageViews = parseInt(localStorage.getItem('pageViews') || '0')
      if (pageViews >= 2) {
        setTimeout(() => setShowPrompt(true), 3000)
      }
    }

    // Track page views
    const currentViews = parseInt(localStorage.getItem('pageViews') || '0')
    localStorage.setItem('pageViews', String(currentViews + 1))

    // Check if recently dismissed
    const dismissedAt = localStorage.getItem('pwaPromptDismissedAt')
    if (dismissedAt) {
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
      if (parseInt(dismissedAt) > thirtyDaysAgo) {
        return
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        console.log('PWA installation accepted')
        setIsInstalled(true)
      } else {
        console.log('PWA installation dismissed')
      }

      setDeferredPrompt(null)
      setShowPrompt(false)
    } catch (error) {
      console.error('Error during PWA installation:', error)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwaPromptDismissedAt', Date.now().toString())
  }

  const showIOSInstructions = () => {
    setShowPrompt(true)
  }

  // Don't show if installed or no prompt available
  if (isInstalled || (!deferredPrompt && !isIOS)) {
    return null
  }

  return (
    <div className="fixed top-16 left-0 right-0 z-30 bg-gradient-to-r from-teal-500/10 to-orange-500/10 backdrop-blur-lg border-b border-teal-500/20 safe-pt">
      <div className="container-responsive py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-primary">
                {isIOS ? 'Add to Home Screen' : 'Install Raindrop'}
              </p>
              <p className="text-xs text-text-secondary">
                {isIOS
                  ? 'Install our app for the best experience'
                  : 'Get our app for offline access and more'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {!isIOS && deferredPrompt && (
              <Button
                onClick={handleInstall}
                size="sm"
                className="bg-teal-500 hover:bg-teal-600 text-white text-xs px-3 py-1.5 min-h-[44px]"
              >
                <Download className="w-3 h-3 mr-1" />
                Install
              </Button>
            )}

            {isIOS && (
              <Button
                onClick={showIOSInstructions}
                size="sm"
                className="bg-teal-500 hover:bg-teal-600 text-white text-xs px-3 py-1.5 min-h-[44px]"
              >
                <Download className="w-3 h-3 mr-1" />
                Install
              </Button>
            )}

            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="sm"
              className="text-text-secondary hover:text-text-primary p-2 min-h-[44px] min-w-[44px]"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// iOS Instructions Modal
export function IOSInstallInstructions({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 safe-px">
      <div className="bg-[#1a1a1d] rounded-2xl border border-[#27272a] p-6 max-w-sm w-full pb-safe-plus">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Install on iOS</h3>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-text-secondary hover:text-text-primary p-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-teal-500/10 rounded-lg flex items-center justify-center">
              <span className="text-teal-400 font-semibold">1</span>
            </div>
            <div>
              <p className="text-sm text-text-primary">Tap the Share button</p>
              <p className="text-xs text-text-tertiary">In Safari, tap the share icon at the bottom</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-teal-500/10 rounded-lg flex items-center justify-center">
              <span className="text-teal-400 font-semibold">2</span>
            </div>
            <div>
              <p className="text-sm text-text-primary">Find "Add to Home Screen"</p>
              <p className="text-xs text-text-tertiary">Scroll down and tap the action</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-teal-500/10 rounded-lg flex items-center justify-center">
              <span className="text-teal-400 font-semibold">3</span>
            </div>
            <div>
              <p className="text-sm text-text-primary">Tap "Add"</p>
              <p className="text-xs text-text-tertiary">Confirm to add to your home screen</p>
            </div>
          </div>
        </div>

        <Button
          onClick={onClose}
          className="w-full mt-6 bg-teal-500 hover:bg-teal-600 text-white"
        >
          Got it
        </Button>
      </div>
    </div>
  )
}

export default PWAInstallPrompt
