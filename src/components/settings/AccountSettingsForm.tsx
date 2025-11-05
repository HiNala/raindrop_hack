'use client'

import { useState } from 'react'
import { useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

const accountSettingsSchema = z.object({
  displayName: z.string().min(1, 'Display name is required').max(50),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30).regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
})

type AccountSettingsValues = z.infer<typeof accountSettingsSchema>

interface AccountSettingsFormProps {
  userId: string
}

export default function AccountSettingsForm({ userId: _userId }: AccountSettingsFormProps) {
  const [isPending, startTransition] = useTransition()
  const [currentValues, setCurrentValues] = useState<AccountSettingsValues>({
    displayName: '',
    username: '',
  })

  const form = useForm<AccountSettingsValues>({
    resolver: zodResolver(accountSettingsSchema),
    defaultValues: currentValues,
  })

  const onSubmit = async (values: AccountSettingsValues) => {
    startTransition(async () => {
      try {
        const response = await fetch('/api/settings/account', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to update account settings')
        }

        setCurrentValues(values)
        form.reset(values)
        toast.success('Account settings updated successfully')
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Something went wrong')
      }
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            {...form.register('displayName')}
            placeholder="John Doe"
            disabled={isPending}
          />
          {form.formState.errors.displayName && (
            <p className="text-sm text-red-600">{form.formState.errors.displayName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            {...form.register('username')}
            placeholder="johndoe"
            disabled={isPending}
          />
          {form.formState.errors.username && (
            <p className="text-sm text-red-600">{form.formState.errors.username.message}</p>
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
