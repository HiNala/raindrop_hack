'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CalendarIcon, Clock, Globe, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface SchedulePublishProps {
  postId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSchedule: (publishAt: Date, timezone: string) => void
  existingSchedule?: {
    publishAt: Date
    timezone: string
  }
}

const TIMEZONES = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT/AEST)' },
]

const QUICK_TIMES = [
  { label: 'In 1 hour', hours: 1 },
  { label: 'In 3 hours', hours: 3 },
  { label: 'In 6 hours', hours: 6 },
  { label: 'In 12 hours', hours: 12 },
  { label: 'In 24 hours', hours: 24 },
  { label: 'In 3 days', hours: 72 },
  { label: 'In 1 week', hours: 168 },
]

export function SchedulePublish({
  postId,
  open,
  onOpenChange,
  onSchedule,
  existingSchedule,
}: SchedulePublishProps) {
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState('12:00')
  const [timezone, setTimezone] = useState('UTC')
  const [isScheduling, setIsScheduling] = useState(false)
  const [selectedQuickTime, setSelectedQuickTime] = useState<number | null>(null)

  // Initialize with existing schedule or default
  useEffect(() => {
    if (existingSchedule) {
      setDate(existingSchedule.publishAt)
      setTimezone(existingSchedule.timezone)
      const hours = existingSchedule.publishAt.getHours().toString().padStart(2, '0')
      const minutes = existingSchedule.publishAt.getMinutes().toString().padStart(2, '0')
      setTime(`${hours}:${minutes}`)
    } else {
      const now = new Date()
      now.setHours(now.getHours() + 24) // Default to tomorrow
      setDate(now)
    }
  }, [existingSchedule])

  // Handle quick time selection
  const handleQuickTime = (hours: number) => {
    const now = new Date()
    const futureDate = new Date(now.getTime() + hours * 60 * 60 * 1000)
    setDate(futureDate)

    const futureHours = futureDate.getHours().toString().padStart(2, '0')
    const futureMinutes = futureDate.getMinutes().toString().padStart(2, '0')
    setTime(`${futureHours}:${futureMinutes}`)

    setSelectedQuickTime(hours)
  }

  // Get the final scheduled datetime
  const getScheduleDateTime = (): Date | null => {
    if (!date || !time) return null

    const [hours, minutes] = time.split(':').map(Number)
    const scheduledDate = new Date(date)
    scheduledDate.setHours(hours, minutes, 0, 0)

    // If the scheduled time is in the past, move to next day
    if (scheduledDate <= new Date()) {
      scheduledDate.setDate(scheduledDate.getDate() + 1)
    }

    return scheduledDate
  }

  // Format the scheduled date for display
  const formatScheduleDate = () => {
    const scheduledDate = getScheduleDateTime()
    if (!scheduledDate) return ''

    const localDate = format(scheduledDate, 'MMM d, yyyy')
    const localTime = format(scheduledDate, 'h:mm a')
    const timezoneInfo = TIMEZONES.find((tz) => tz.value === timezone)

    return `${localDate} at ${localTime} (${timezoneInfo?.label || timezone})`
  }

  // Handle schedule submission
  const handleSchedule = async () => {
    const scheduledDate = getScheduleDateTime()
    if (!scheduledDate) {
      toast.error('Please select a valid date and time')
      return
    }

    // Validate that the date is in the future
    if (scheduledDate <= new Date()) {
      toast.error('Scheduled time must be in the future')
      return
    }

    setIsScheduling(true)

    try {
      await onSchedule(scheduledDate, timezone)
      toast.success('Post scheduled successfully!')
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to schedule post:', error)
      toast.error('Failed to schedule post')
    } finally {
      setIsScheduling(false)
    }
  }

  // Get user's timezone
  useEffect(() => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const matchingTimezone = TIMEZONES.find((tz) =>
      tz.value.toLowerCase().includes(userTimezone.toLowerCase().split('/')[0])
    )
    if (matchingTimezone && !existingSchedule) {
      setTimezone(matchingTimezone.value)
    }
  }, [existingSchedule])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent-teal" />
            {existingSchedule ? 'Update Schedule' : 'Schedule Publish'}
          </DialogTitle>
          <DialogDescription>
            {existingSchedule
              ? 'Update when your post will be published'
              : 'Choose a date and time to publish your post automatically'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Times */}
          {!existingSchedule && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Quick Schedule</Label>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_TIMES.map((quickTime) => (
                  <Button
                    key={quickTime.hours}
                    variant={selectedQuickTime === quickTime.hours ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleQuickTime(quickTime.hours)}
                  >
                    {quickTime.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Date Selection */}
          <div className="space-y-3">
            <Label htmlFor="date" className="text-sm font-medium">
              <CalendarIcon className="w-4 h-4 inline mr-2" />
              Date
            </Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              className="rounded-md border"
            />
          </div>

          {/* Time Selection */}
          <div className="space-y-3">
            <Label htmlFor="time" className="text-sm font-medium">
              Time
            </Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => {
                setTime(e.target.value)
                setSelectedQuickTime(null)
              }}
              className="w-full"
            />
          </div>

          {/* Timezone Selection */}
          <div className="space-y-3">
            <Label htmlFor="timezone" className="text-sm font-medium">
              <Globe className="w-4 h-4 inline mr-2" />
              Timezone
            </Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Schedule Summary */}
          {getScheduleDateTime() && (
            <Card className="p-4 bg-surface-100 border-accent-teal/20">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent-teal mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-text-primary">Post will be published:</p>
                  <p className="text-sm text-text-secondary mt-1">{formatScheduleDate()}</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isScheduling}>
            Cancel
          </Button>
          <Button onClick={handleSchedule} disabled={!getScheduleDateTime() || isScheduling}>
            {isScheduling
              ? 'Scheduling...'
              : existingSchedule
                ? 'Update Schedule'
                : 'Schedule Publish'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
