import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { ProfileSettingsForm } from '@/components/settings/ProfileSettingsForm'

export default async function ProfileSettingsPage() {
  const user = await requireUser()

  if (!user.profile) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your public profile information</p>
        </div>

        <ProfileSettingsForm profile={user.profile} />
      </div>
    </div>
  )
}
