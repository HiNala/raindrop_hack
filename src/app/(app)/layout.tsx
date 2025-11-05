import { Suspense } from 'react'
import { flags } from '@/lib/feature-flags'
import { SettingsLayout } from '@/components/settings/SettingsLayout'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full space-y-6">
      <Suspense
        fallback={
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-48 mb-4" />
            <div className="h-4 bg-gray-800 rounded w-32" />
          </div>
        }
      >
        {flags.settings ? <SettingsLayout>{children}</SettingsLayout> : children}
      </Suspense>
    </div>
  )
}
