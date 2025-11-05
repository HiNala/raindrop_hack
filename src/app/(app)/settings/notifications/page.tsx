import { auth } from '@clerk/nextjs/server'
import { flags } from '@/lib/feature-flags'
import SettingsLayout from '@/components/settings/SettingsLayout'
import NotificationSettingsForm from '@/components/settings/NotificationSettingsForm'

export default async function NotificationSettingsPage(): Promise<JSX.Element | null> {
  if (!flags.settings) return null

  const { userId } = await auth()
  if (!userId) return null

  return (
    <SettingsLayout title="Notification Settings">
      <NotificationSettingsForm userId={userId} />
    </SettingsLayout>
  )
}
