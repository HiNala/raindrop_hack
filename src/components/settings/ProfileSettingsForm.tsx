'use client'

import { useState } from 'react'
import { useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'

const profileSettingsSchema = z.object({
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  websiteUrl: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
  githubUrl: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
  twitterUrl: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
  linkedinUrl: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
})

type ProfileSettingsValues = z.infer<typeof profileSettingsSchema>

interface ProfileSettingsFormProps {
  userId: string
}

export default function ProfileSettingsForm({ userId }: ProfileSettingsFormProps) {
  const [isPending, startTransition] = useTransition()
  const [currentValues, setCurrentValues] = useState<ProfileSettingsValues>({
    bio: '',
    websiteUrl: '',
    githubUrl: '',
    twitterUrl: '',
    linkedinUrl: '',
  })

  const form = useForm<ProfileSettingsValues>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: currentValues,
  })

  const onSubmit = async (values: ProfileSettingsValues) => {
    startTransition(async () => {
      try {
        const response = await fetch('/api/settings/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to update profile settings')
        }

        setCurrentValues(values)
        form.reset(values)
        toast.success('Profile settings updated successfully')
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Something went wrong')
      }
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            {...form.register('bio')}
            placeholder="Tell us about yourself..."
            disabled={isPending}
            rows={4}
          />
          {form.formState.errors.bio && (
            <p className="text-sm text-red-600">{form.formState.errors.bio.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="websiteUrl">Website URL</Label>
          <Input
            id="websiteUrl"
            {...form.register('websiteUrl')}
            placeholder="https://yourwebsite.com"
            disabled={isPending}
          />
          {form.formState.errors.websiteUrl && (
            <p className="text-sm text-red-600">{form.formState.errors.websiteUrl.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input
            id="githubUrl"
            {...form.register('githubUrl')}
            placeholder="https://github.com/username"
            disabled={isPending}
          />
          {form.formState.errors.githubUrl && (
            <p className="text-sm text-red-600">{form.formState.errors.githubUrl.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="twitterUrl">Twitter URL</Label>
          <Input
            id="twitterUrl"
            {...form.register('twitterUrl')}
            placeholder="https://twitter.com/username"
            disabled={isPending}
          />
          {form.formState.errors.twitterUrl && (
            <p className="text-sm text-red-600">{form.formState.errors.twitterUrl.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
          <Input
            id="linkedinUrl"
            {...form.register('linkedinUrl')}
            placeholder="https://linkedin.com/in/username"
            disabled={isPending}
          />
          {form.formState.errors.linkedinUrl && (
            <p className="text-sm text-red-600">{form.formState.errors.linkedinUrl.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}