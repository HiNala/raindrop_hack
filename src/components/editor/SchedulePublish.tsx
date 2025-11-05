'use client'

import { useState } from 'react'
import { useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, ExternalLink, Trash2 } from 'lucide-react'
import { schedulePost, unschedulePost } from '@/lib/actions/schedule-actions'
import { flags } from '@/lib/feature-flags'
import { toast } from 'sonner'

interface SchedulePublishProps {
  postId: string
  currentSchedule?: {
    id: string
    publishAt: Date
    timezone: string
    status: string
  }
}

export default function SchedulePublish({ postId, currentSchedule }: SchedulePublishProps) {
  const [pending, start] = useTransition()
  const [publishAt, setPublishAt] = useState('')
  const [timezone, setTimezone] = useState('UTC')

  if (!flags.schedule) return null

  const handleSchedule = () => {
    if (!publishAt) {
      toast.error('Please select a publish date and time')
      return
    }

    start(async () => {
      try {
        await schedulePost({
          postId,
          publishAtISO: publishAt,
          timezone,
        })
        toast.success('Post scheduled successfully')
        setPublishAt('')
      } catch (error) {
        toast.error('Failed to schedule post')
      }
    })
  }

  const handleUnschedule = () => {
    start(async () => {
      try {
        await unschedulePost(postId)
        toast.success('Schedule removed')
      } catch (error) {
        toast.error('Failed to remove schedule')
      }
    })
  }

  const getMinDateTime = () => {
    const now = new Date()
    now.setMinutes(now.getMinutes() + 5) // Minimum 5 minutes from now
    return now.toISOString().slice(0, 16)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Schedule Publication
        </CardTitle>
        <CardDescription>
          Set a specific date and time to publish your post
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentSchedule ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="space-y-1">
                <p className="text-sm font-medium">Scheduled for</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(currentSchedule.publishAt).toLocaleString()}
                </p>
                <Badge variant="secondary">
                  {currentSchedule.timezone}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleUnschedule}
                disabled={pending}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="publishAt">Publish Date & Time</Label>
              <Input
                id="publishAt"
                type="datetime-local"
                value={publishAt}
                onChange={(e) => setPublishAt(e.target.value)}
                min={getMinDateTime()}
                disabled={pending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <select
                id="timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full p-2 border rounded-md"
                disabled={pending}
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Asia/Tokyo">Tokyo</option>
              </select>
            </div>

            <Button
              onClick={handleSchedule}
              disabled={pending || !publishAt}
              className="w-full"
            >
              <Clock className="w-4 h-4 mr-2" />
              {pending ? 'Scheduling...' : 'Schedule Post'}
            </Button>
          </div>
        )}

        <div className="pt-3 border-t">
          <p className="text-xs text-muted-foreground">
            Posts will be automatically published at the scheduled time. 
            You can cancel or reschedule at any time before publication.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}