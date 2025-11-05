import { auth } from '@clerk/nextjs/server'
import { flags } from '@/lib/feature-flags'
import SettingsLayout from '@/components/settings/SettingsLayout'
import AccountSettingsForm from '@/components/settings/AccountSettingsForm'

export default async function AccountSettingsPage() {
  if (!flags.settings) return null
  
  const { userId } = await auth()
  if (!userId) return null

  return (
    <SettingsLayout title="Account Settings">
      <AccountSettingsForm userId={userId} />
    </SettingsLayout>
  )
}