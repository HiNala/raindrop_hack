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

export default function ProfileSettingsForm({ userId: _userId }: ProfileSettingsFormProps) {
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
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <Label htmlFor="bio" className="text-sm font-medium text-text-primary">
            Bio
          </Label>
          <Textarea
            id="bio"
            {...form.register('bio')}
            placeholder="Tell us about yourself..."
            disabled={isPending}
            rows={4}
            className="resize-none min-h-[100px] text-[16px]"
          />
          {form.formState.errors.bio && (
            <p className="text-sm text-red-600">{form.formState.errors.bio.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="websiteUrl" className="text-sm font-medium text-text-primary">
            Website URL
          </Label>
          <Input
            id="websiteUrl"
            {...form.register('websiteUrl')}
            placeholder="https://yourwebsite.com"
            disabled={isPending}
            className="text-[16px]"
          />
          {form.formState.errors.websiteUrl && (
            <p className="text-sm text-red-600">{form.formState.errors.websiteUrl.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="githubUrl" className="text-sm font-medium text-text-primary">
            GitHub URL
          </Label>
          <Input
            id="githubUrl"
            {...form.register('githubUrl')}
            placeholder="https://github.com/username"
            disabled={isPending}
            className="text-[16px]"
          />
          {form.formState.errors.githubUrl && (
            <p className="text-sm text-red-600">{form.formState.errors.githubUrl.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="twitterUrl" className="text-sm font-medium text-text-primary">
            Twitter URL
          </Label>
          <Input
            id="twitterUrl"
            {...form.register('twitterUrl')}
            placeholder="https://twitter.com/username"
            disabled={isPending}
            className="text-[16px]"
          />
          {form.formState.errors.twitterUrl && (
            <p className="text-sm text-red-600">{form.formState.errors.twitterUrl.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedinUrl" className="text-sm font-medium text-text-primary">
            LinkedIn URL
          </Label>
          <Input
            id="linkedinUrl"
            {...form.register('linkedinUrl')}
            placeholder="https://linkedin.com/in/username"
            disabled={isPending}
            className="text-[16px]"
          />
          {form.formState.errors.linkedinUrl && (
            <p className="text-sm text-red-600">{form.formState.errors.linkedinUrl.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-dark-border">
        <Button
          type="submit"
          disabled={isPending}
          className="min-h-[44px] px-6 text-[16px]"
        >
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
