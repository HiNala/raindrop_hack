'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Save,
  Eye,
  Share2,
  Settings,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { HNToggle } from './HNToggle'
import { SchedulePublish } from './SchedulePublish'
import { toast } from 'sonner'

interface MobileEditorToolbarProps {
  postId: string
  title: string
  isPublished: boolean
  isDraft: boolean
  hnEnabled: boolean
  lastSaved: Date | null
  onSave: () => void
  onPreview: () => void
  onPublish: () => void
  onShare: () => void
  onSchedule: (data: {
    scheduledAt: Date
    timezone: string
  }) => void
  wordCount: number
  readingTime: number
}

export function MobileEditorToolbar({
  postId,
  title,
  isPublished,
  isDraft,
  hnEnabled,
  lastSaved,
  onSave,
  onPreview,
  onPublish,
  onShare,
  onSchedule: _onSchedule,
  wordCount,
  readingTime,
}: MobileEditorToolbarProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    try {
      await onSave()
      toast.success('Draft saved')
    } catch (error) {
      toast.error('Failed to save')
    } finally {
      setIsSaving(false)
    }
  }, [onSave])

  return (
    <>
      {/* Floating Action Button */}
      <div className="lg:hidden fixed bottom-20 right-4 z-40">
        <motion.div
          className="relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => setShowQuickActions(!showQuickActions)}
            size="lg"
            className="h-14 w-14 rounded-full bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/25"
          >
            {showQuickActions ? <Save className="w-6 h-6" /> : <Settings className="w-6 h-6" />}
          </Button>

          {/* Quick Actions */}
          {showQuickActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute bottom-16 right-0 space-y-2"
              >
                {isDraft && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      size="sm"
                      className="h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg"
                    >
                      <Save className="w-5 h-5" />
                    </Button>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    onClick={onPreview}
                    size="sm"
                    className="h-12 w-12 rounded-full bg-purple-500 hover:bg-purple-600 shadow-lg"
                  >
                    <Eye className="w-5 h-5" />
                  </Button>
                </motion.div>

                {isDraft && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button
                      onClick={onPublish}
                      size="sm"
                      className="h-12 w-12 rounded-full bg-green-500 hover:bg-green-600 shadow-lg"
                    >
                      <Zap className="w-5 h-5" />
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}
        </motion.div>
      </div>

      {/* Mobile Top Bar */}
      <div className="lg:hidden sticky top-14 z-30 bg-[#0a0a0b]/95 backdrop-blur-sm border-b border-[#27272a] safe-pt">
        <div className="px-4 py-3">
          {/* Title and Status */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-text-primary truncate">
                {title || 'Untitled Draft'}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-xs px-2 py-1 rounded border ${
                    isPublished
                      ? 'bg-green-500/10 text-green-400 border-green-500/30'
                      : 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                  }`}
                >
                  {isPublished ? 'Published' : 'Draft'}
                </span>
                {lastSaved && (
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    Saved {new Date(lastSaved).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                )}
              </div>
            </div>

            {/* Details Trigger */}
            <Button
              onClick={() => setIsDetailsOpen(!isDetailsOpen)}
              variant="ghost"
              size="sm"
              className="text-text-secondary hover:text-text-primary p-2"
            >
              <Settings className="w-5 h-5" />
            </Button>

            {isDetailsOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-[#0a0a0b] border border-[#27272a] rounded-lg shadow-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-text-primary font-medium">
                    Post Details
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <span>{wordCount} words</span>
                    <span>•</span>
                    <span>{readingTime} min read</span>
                  </div>
                </div>

                <div className="px-4 py-4 space-y-6 overflow-y-auto">
                  {/* HN Toggle */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-text-primary">
                      AI Enhancement
                    </h3>
                    <div className="bg-[#1a1a1d] rounded-lg p-4">
                      <HNToggle postId={postId} enabled={hnEnabled} />
                      <p className="text-xs text-text-muted mt-2">
                        Include Hacker News context in AI-generated content
                      </p>
                    </div>
                  </div>

                  {/* Scheduling */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-text-primary">
                      Publishing Options
                    </h3>
                    <div className="bg-[#1a1a1d] rounded-lg p-4">
                      <SchedulePublish postId={postId} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-text-primary">
                      Actions
                    </h3>
                    <div className="space-y-2">
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        variant="outline"
                        className="w-full border-[#27272a] hover:bg-[#1a1a1d] text-text-primary"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save Draft'}
                      </Button>

                      <Button
                        onClick={onPreview}
                        variant="outline"
                        className="w-full border-[#27272a] hover:bg-[#1a1a1d] text-text-primary"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>

                      <Button
                        onClick={onShare}
                        variant="outline"
                        className="w-full border-[#27272a] hover:bg-[#1a1a1d] text-text-primary"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>

                      {isDraft && (
                        <Button
                          onClick={onPublish}
                          className="w-full bg-green-500 hover:bg-green-600 text-white"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Publish Now
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-4 text-xs text-text-muted">
            <span>{wordCount} words</span>
            <span>{readingTime} min read</span>
            {hnEnabled && (
              <Badge className="text-xs bg-teal-500/10 text-teal-400 border-teal-500/30">
                HN Enabled
              </Badge>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
