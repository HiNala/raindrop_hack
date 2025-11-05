import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { flags } from '@/lib/feature-flags'

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your account settings and preferences',
}

export default async function SettingsPage() {
  if (!flags.settings) {
    redirect('/dashboard')
  }

  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  // Redirect to account settings by default
  redirect('/settings/account')
}