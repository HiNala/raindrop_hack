'use client'

import { useTransition } from 'react'
import { Switch } from '@/components/ui/switch'
import { setPostHNPreference } from '@/lib/actions/post-actions'
import { flags } from '@/lib/feature-flags'
import { toast } from 'sonner'

interface HNToggleProps {
  postId: string
  enabled: boolean
}

export function HNToggle({ postId, enabled }: HNToggleProps) {
  const [pending, start] = useTransition()

  if (!flags.hn) return null

  const handleChange = (checked: boolean) => {
    start(async () => {
      try {
        await setPostHNPreference(postId, checked)
        toast.success(checked ? 'HN context enabled' : 'HN context disabled')
      } catch (error) {
        toast.error('Failed to update HN preference')
      }
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={enabled}
        disabled={pending}
        onCheckedChange={handleChange}
      />
      <span className="text-sm text-text-secondary">
        Include Hacker News context
      </span>
    </div>
  )
}