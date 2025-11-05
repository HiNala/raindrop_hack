export default function SettingsLayout({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-4">{title}</h1>
      <div className="rounded-2xl border border-dark-border bg-dark-card p-4">
        {children}
      </div>
    </div>
  )
}
