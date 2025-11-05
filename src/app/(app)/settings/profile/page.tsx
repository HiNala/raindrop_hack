import { auth } from '@clerk/nextjs/server'
import { flags } from '@/lib/feature-flags'
import SettingsLayout from '@/components/settings/SettingsLayout'
import ProfileSettingsForm from '@/components/settings/ProfileSettingsForm'

export default async function ProfileSettingsPage() {
  if (!flags.settings) return null
  
  const { userId } = await auth()
  if (!userId) return null

  return (
    <SettingsLayout title="Profile Settings">
      <ProfileSettingsForm userId={userId} />
    </SettingsLayout>
  )
}