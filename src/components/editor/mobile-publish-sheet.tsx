'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Calendar,
  Clock,
  Eye,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  X,
  Sparkles,
  Bell,
  Users
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PublishSheetProps {
  isOpen: boolean
  onClose: () => void
  title: string
  excerpt: string | undefined
  tags: Array<{ id: string; name: string }>
  content: Record<string, unknown>
  onPublish: (options: PublishOptions) => Promise<void>
  isPublishing: boolean
}

interface PublishOptions {
  publishNow: boolean
  scheduledAt?: string
  notifyFollowers: boolean
}

export function MobilePublishSheet({
  isOpen,
  onClose,
  title,
  excerpt,
  tags,
  content,
  onPublish,
  isPublishing
}: PublishSheetProps) {
  const [options, setOptions] = useState<PublishOptions>({
    publishNow: true,
    scheduledAt: '',
    notifyFollowers: true,
  })
  const [activeTab, setActiveTab] = useState<'details' | 'schedule'>('details')

  const handlePublish = async () => {
    await onPublish(options)
    onClose()
  }

  const isValid = title.trim() && tags.length > 0 && content

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="h-[85vh] bg-[#1a1a1d] border-[#27272a] pb-safe-plus"
      >
        <SheetHeader className="pb-4 border-b border-[#27272a]">
          <SheetTitle className="text-text-primary">Publish Post</SheetTitle>
          <SheetDescription className="text-text-secondary">
            Review and configure your post before publishing
          </SheetDescription>
        </SheetHeader>

        {/* Tabs */}
        <div className="flex border-b border-[#27272a] mt-4">
          <button
            onClick={() => setActiveTab('details')}
            className={cn(
              "flex-1 py-3 px-4 text-sm font-medium transition-colors min-h-[44px]",
              activeTab === 'details'
                ? "text-teal-400 border-b-2 border-teal-400"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={cn(
              "flex-1 py-3 px-4 text-sm font-medium transition-colors min-h-[44px]",
              activeTab === 'schedule'
                ? "text-teal-400 border-b-2 border-teal-400"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            Schedule
          </button>
        </div>

        <ScrollArea className="flex-1 py-4">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Post Preview */}
              <div className="bg-[#0a0a0b] rounded-lg p-4 border border-[#27272a]">
                <h3 className="font-semibold text-text-primary mb-2 line-clamp-2 text-responsive-base">
                  {title}
                </h3>
                {excerpt && (
                  <p className="text-sm text-text-secondary mb-3 line-clamp-3 leading-relaxed">
                    {excerpt}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 3).map((tag) => (
                    <Badge key={tag.id} variant="secondary" className="text-xs">
                      {tag.name}
                    </Badge>
                  ))}
                  {tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{tags.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Publishing Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <div className="space-y-1 flex-1">
                    <Label className="text-text-primary text-sm font-medium">
                      Publish now
                    </Label>
                    <p className="text-xs text-text-secondary">
                      Make post visible immediately
                    </p>
                  </div>
                  <Switch
                    checked={options.publishNow}
                    onCheckedChange={(checked) =>
                      setOptions(prev => ({ ...prev, publishNow: checked }))
                    }
                  />
                </div>

                <Separator className="bg-[#27272a]" />

                <div className="flex items-center justify-between py-3">
                  <div className="space-y-1 flex-1">
                    <Label className="text-text-primary text-sm font-medium">
                      Notify followers
                    </Label>
                    <p className="text-xs text-text-secondary">
                      Send notification to your followers
                    </p>
                  </div>
                  <Switch
                    checked={options.notifyFollowers}
                    onCheckedChange={(checked) =>
                      setOptions(prev => ({ ...prev, notifyFollowers: checked }))
                    }
                  />
                </div>
              </div>

              {/* Validation Checklist */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-text-primary">Ready to publish?</h4>

                <div className="space-y-2">
                  {title.trim() && (
                    <div className="flex items-center gap-2 text-sm text-teal-400">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Title added</span>
                    </div>
                  )}

                  {tags.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-teal-400">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{tags.length} tag{tags.length > 1 ? 's' : ''} added</span>
                    </div>
                  )}

                  {content && JSON.stringify(content) !== '{"type":"doc","content":[]}' && (
                    <div className="flex items-center gap-2 text-sm text-teal-400">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Content added</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-6">
              {/* Publish Now / Schedule Toggle */}
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <div className="space-y-1 flex-1">
                    <Label className="text-text-primary text-sm font-medium">
                      Schedule for later
                    </Label>
                    <p className="text-xs text-text-secondary">
                      Set a specific date and time to publish
                    </p>
                  </div>
                  <Switch
                    checked={!options.publishNow}
                    onCheckedChange={(checked) =>
                      setOptions(prev => ({ ...prev, publishNow: !checked }))
                    }
                  />
                </div>

                {!options.publishNow && (
                  <div className="space-y-4 pt-4 border-t border-[#27272a]">
                    <div>
                      <Label htmlFor="publish-date" className="text-text-primary text-sm font-medium">
                        Publish Date
                      </Label>
                      <Input
                        id="publish-date"
                        type="date"
                        value={options.scheduledAt?.split('T')[0] || ''}
                        onChange={(e) => {
                          const time = options.scheduledAt?.split('T')[1] || '12:00'
                          setOptions(prev => ({
                            ...prev,
                            scheduledAt: `${e.target.value}T${time}`
                          }))
                        }}
                        className="mt-2 bg-[#0a0a0b] border-[#27272a] focus:border-teal-500 text-base"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div>
                      <Label htmlFor="publish-time" className="text-text-primary text-sm font-medium">
                        Publish Time
                      </Label>
                      <Input
                        id="publish-time"
                        type="time"
                        value={options.scheduledAt?.split('T')[1] || '12:00'}
                        onChange={(e) => {
                          const date = options.scheduledAt?.split('T')[0] || new Date().toISOString().split('T')[0]
                          setOptions(prev => ({
                            ...prev,
                            scheduledAt: `${date}T${e.target.value}`
                          }))
                        }}
                        className="mt-2 bg-[#0a0a0b] border-[#27272a] focus:border-teal-500 text-base"
                      />
                    </div>

                    {/* Timezone Info */}
                    <div className="flex items-center gap-2 p-3 bg-[#0a0a0b] rounded-lg border border-[#27272a]">
                      <Clock className="w-4 h-4 text-text-tertiary" />
                      <span className="text-xs text-text-tertiary">
                        {new Date().toLocaleTimeString('en-US', {
                          timeZoneName: 'short'
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Preview Schedule */}
              {options.scheduledAt && !options.publishNow && (
                <div className="bg-[#0a0a0b] rounded-lg p-4 border border-[#27272a]">
                  <h4 className="text-sm font-medium text-text-primary mb-2">
                    Scheduled Publish
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(options.scheduledAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Bottom Actions */}
        <div className="border-t border-[#27272a] pt-4 pb-safe-plus">
          <div className="space-y-3">
            {/* Preview Button */}
            <Button
              variant="outline"
              className="w-full border-[#27272a] hover:bg-[#1a1a1d] text-text-primary min-h-[44px]"
              onClick={() => {
                // Open preview logic
              }}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview Post
            </Button>

            {/* Publish Button */}
            <Button
              onClick={handlePublish}
              disabled={!isValid || isPublishing}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white min-h-[44px]"
            >
              {isPublishing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="mr-2"
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                  Publishing...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  {options.publishNow ? 'Publish Now' : 'Schedule Post'}
                </>
              )}
            </Button>

            {!isValid && (
              <p className="text-xs text-orange-400 text-center">
                {title.trim() ?
                  tags.length > 0 ?
                  'Please add content to your post' :
                  'Please add at least one tag' :
                  'Please add a title'
                }
              </p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MobilePublishSheet
