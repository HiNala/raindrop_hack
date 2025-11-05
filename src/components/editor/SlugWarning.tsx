'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, ExternalLink, CheckCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface SlugWarningProps {
  currentSlug: string
  newSlug: string
  onConfirm: () => void
  onCancel: () => void
}

export function SlugWarning({ currentSlug, newSlug, onConfirm, onCancel }: SlugWarningProps) {
  const [hasExistingRedirect, setHasExistingRedirect] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Check if slug change will break links
    const checkImpact = async () => {
      try {
        const response = await fetch(
          `/api/posts/check-slug-impact?current=${currentSlug}&new=${newSlug}`
        )
        const data = await response.json()
        setHasExistingRedirect(data.hasExistingRedirect)
      } catch (error) {
        console.error('Failed to check slug impact:', error)
      } finally {
        setChecking(false)
      }
    }

    if (currentSlug && newSlug && currentSlug !== newSlug) {
      checkImpact()
    } else {
      setChecking(false)
    }
  }, [currentSlug, newSlug])

  if (checking) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
      >
        <Card className="p-4 border-yellow-500/30 bg-yellow-500/5">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">Checking link impact...</p>
          </div>
        </Card>
      </motion.div>
    )
  }

  if (currentSlug === newSlug) {
    return null
  }

  const willBreakLinks = !hasExistingRedirect

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Card
        className={`p-4 border-2 ${
          willBreakLinks
            ? 'border-orange-500/50 bg-orange-500/5'
            : 'border-green-500/50 bg-green-500/5'
        }`}
      >
        <div className="flex items-start gap-3">
          {willBreakLinks ? (
            <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
          ) : (
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-sm">
                {willBreakLinks ? 'Slug Change Warning' : 'Safe Slug Change'}
              </h4>
              {hasExistingRedirect && (
                <Badge variant="secondary" className="text-xs">
                  Redirect Active
                </Badge>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-text-secondary">
                <span className="font-medium">From:</span>
                <code className="px-2 py-1 bg-dark-card rounded text-xs">{currentSlug}</code>
                <ExternalLink className="w-3 h-3" />
              </div>

              <div className="flex items-center gap-2 text-text-secondary">
                <span className="font-medium">To:</span>
                <code className="px-2 py-1 bg-dark-card rounded text-xs">{newSlug}</code>
                <ExternalLink className="w-3 h-3" />
              </div>
            </div>

            <p className="text-sm text-text-secondary mt-3">
              {willBreakLinks ? (
                <>
                  This change will break existing links to your post. A redirect will be created to
                  maintain link functionality.
                </>
              ) : (
                <>
                  This change is safe. An existing redirect will be updated to point to the new
                  slug.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-dark-border">
          <Button
            size="sm"
            onClick={onConfirm}
            className="bg-teal-500 hover:bg-teal-600 text-white"
          >
            Confirm Change
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onCancel}
            className="border-dark-border hover:bg-dark-card"
          >
            Cancel
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
