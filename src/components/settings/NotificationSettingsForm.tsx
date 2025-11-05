'use client'

import { useState } from 'react'
import { useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Mail, Bell, MessageCircle, Heart } from 'lucide-react'

const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  newFollowers: z.boolean(),
  newComments: z.boolean(),
  newLikes: z.boolean(),
  weeklyDigest: z.boolean(),
  productUpdates: z.boolean(),
})

type NotificationSettingsValues = z.infer<typeof notificationSettingsSchema>

interface NotificationSettingsFormProps {
  userId: string
}

export default function NotificationSettingsForm({ userId: _userId }: NotificationSettingsFormProps) {
  const [isPending, startTransition] = useTransition()
  const [currentValues, setCurrentValues] = useState<NotificationSettingsValues>({
    emailNotifications: true,
    newFollowers: true,
    newComments: true,
    newLikes: false,
    weeklyDigest: true,
    productUpdates: false,
  })

  const form = useForm<NotificationSettingsValues>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: currentValues,
  })

  const onSubmit = async (values: NotificationSettingsValues) => {
    startTransition(async () => {
      try {
        const response = await fetch('/api/settings/notifications', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to update notification settings')
        }

        setCurrentValues(values)
        form.reset(values)
        toast.success('Notification settings updated successfully')
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Something went wrong')
      }
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Notifications
          </CardTitle>
          <CardDescription>
            Choose what emails you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email notifications about your account activity
              </p>
            </div>
            <Switch
              id="emailNotifications"
              checked={form.watch('emailNotifications')}
              onCheckedChange={(value) => form.setValue('emailNotifications', value)}
              disabled={isPending}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weeklyDigest">Weekly Digest</Label>
              <p className="text-sm text-muted-foreground">
                Get a weekly summary of popular posts and updates
              </p>
            </div>
            <Switch
              id="weeklyDigest"
              checked={form.watch('weeklyDigest')}
              onCheckedChange={(value) => form.setValue('weeklyDigest', value)}
              disabled={isPending}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="productUpdates">Product Updates</Label>
              <p className="text-sm text-muted-foreground">
                Stay informed about new features and improvements
              </p>
            </div>
            <Switch
              id="productUpdates"
              checked={form.watch('productUpdates')}
              onCheckedChange={(value) => form.setValue('productUpdates', value)}
              disabled={isPending}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Manage your real-time notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="newFollowers" className="flex items-center gap-2">
                New Followers
                <MessageCircle className="w-4 h-4" />
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified when someone follows you
              </p>
            </div>
            <Switch
              id="newFollowers"
              checked={form.watch('newFollowers')}
              onCheckedChange={(value) => form.setValue('newFollowers', value)}
              disabled={isPending}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="newComments" className="flex items-center gap-2">
                New Comments
                <MessageCircle className="w-4 h-4" />
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified when someone comments on your posts
              </p>
            </div>
            <Switch
              id="newComments"
              checked={form.watch('newComments')}
              onCheckedChange={(value) => form.setValue('newComments', value)}
              disabled={isPending}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="newLikes" className="flex items-center gap-2">
                New Likes
                <Heart className="w-4 h-4" />
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified when someone likes your posts
              </p>
            </div>
            <Switch
              id="newLikes"
              checked={form.watch('newLikes')}
              onCheckedChange={(value) => form.setValue('newLikes', value)}
              disabled={isPending}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
