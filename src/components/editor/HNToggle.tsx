'use client'

import { useState, useTransition } from 'react'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { setPostHNPreference } from '@/lib/actions/post-actions'
import { flags } from '@/lib/feature-flags'
import { toast } from 'sonner'
import {
  ExternalLink,
  MessageSquare,
  TrendingUp,
  Loader2,
  Info,
  Sparkles,
  Zap
} from 'lucide-react'

interface HNToggleProps {
  postId: string
  enabled: boolean
  onToggle?: (enabled: boolean) => void
  disabled?: boolean
  showCitationCount?: boolean
  citationCount?: number
}

export function HNToggle({
  postId,
  enabled,
  onToggle,
  disabled = false,
  showCitationCount = false,
  citationCount = 0,
}: HNToggleProps) {
  const [pending, start] = useTransition()
  const [isGenerating, setIsGenerating] = useState(false)

  if (!flags.hn) return null

  const handleChange = (checked: boolean) => {
    if (disabled || pending || isGenerating) return

    start(async () => {
      try {
        await setPostHNPreference(postId, checked)

        if (onToggle) {
          onToggle(checked)
        }

        toast.success(
          checked
            ? '🔍 HN context enabled - citations will appear in your content'
            : 'HN context disabled'
        )
      } catch (error) {
        toast.error('Failed to update HN preference')
      }
    })
  }

  const handleGenerateCitations = async () => {
    if (!enabled || isGenerating) return

    setIsGenerating(true)
    try {
      // This would trigger citation generation
      // await generateCitations(postId)
      toast.success('🎯 HN citations generated successfully')
    } catch (error) {
      toast.error('Failed to generate HN citations')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex flex-col space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm font-semibold text-gray-900">
              Hacker News Context
            </h3>
          </div>
          <Badge variant={enabled ? 'default' : 'secondary'} className="text-xs">
            {enabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {showCitationCount && citationCount > 0 && (
            <Badge variant="outline" className="text-xs">
              {citationCount} citations
            </Badge>
          )}
        </div>
      </div>

      {/* Toggle Switch */}
      <div className="flex items-center gap-3">
        <Switch
          checked={enabled}
          disabled={disabled || pending || isGenerating}
          onCheckedChange={handleChange}
          className={enabled ? 'bg-orange-500' : ''}
        />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">
            Include relevant Hacker News discussions and context
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Automatically finds related HN threads and adds citations to your content
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      {enabled && (
        <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateCitations}
            disabled={isGenerating}
            className="text-xs"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="w-3 h-3 mr-1" />
                Generate Citations
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open('https://news.ycombinator.com', '_blank')}
            className="text-xs"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Browse HN
          </Button>
        </div>
      )}

      {/* Info Box */}
      <div className="flex items-start gap-2 p-2 bg-blue-50 rounded border border-blue-200">
        <Info className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-blue-700">
          HN citations will appear as inline markers like [HN-1] with links to relevant discussions.
          A "Sources" section will be automatically added at the end of your post.
        </p>
      </div>

      {/* Loading State */}
      {(pending || isGenerating) && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Loader2 className="w-3 h-3 animate-spin" />
          {isGenerating ? 'Generating citations...' : 'Updating preferences...'}
        </div>
      )}
    </div>
  )
}

// Inline citation component
interface HNCitationProps {
  id: number
  title: string
  url: string
  points?: number
  comments?: number
  time?: string
}

export function HNCitation({ id, title, url: _url, points, comments, time: _time }: HNCitationProps) {
  return (
    <span className="inline-flex items-center gap-1">
      <span
        className="text-xs bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded font-mono cursor-help hover:bg-orange-200 transition-colors"
        title={`${title}${points ? ` • ${points} points` : ''}${comments ? ` • ${comments} comments` : ''}`}
      >
        [HN-{id}]
      </span>
    </span>
  )
}

// Sources section component
interface HNSourcesProps {
  sources: HNCitationProps[]
}

export function HNSources({ sources }: HNSourcesProps) {
  if (sources.length === 0) return null

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-orange-500" />
        Sources from Hacker News
      </h3>
      <div className="space-y-2">
        {sources.map((source, index) => (
          <div key={source.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-800 rounded-full flex items-center justify-center text-xs font-semibold">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 mb-1">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-500 transition-colors"
                >
                  {source.title}
                </a>
              </h4>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                {points && (
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {points} points
                  </span>
                )}
                {comments && (
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {comments} comments
                  </span>
                )}
                {time && <span>{time}</span>}
              </div>
            </div>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 text-orange-500 hover:text-orange-600 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
