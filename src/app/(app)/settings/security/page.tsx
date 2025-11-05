import { auth } from '@clerk/nextjs/server'
import { flags } from '@/lib/feature-flags'
import SettingsLayout from '@/components/settings/SettingsLayout'
import SecuritySettingsForm from '@/components/settings/SecuritySettingsForm'

export default async function SecuritySettingsPage(): Promise<JSX.Element | null> {
  if (!flags.settings) return null

  const { userId } = await auth()
  if (!userId) return null

  return (
    <SettingsLayout title="Security Settings">
      <SecuritySettingsForm />
    </SettingsLayout>
  )
}
