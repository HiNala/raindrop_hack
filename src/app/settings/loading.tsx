/**
 * Settings Loading Component
 */

export default function SettingsLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="space-y-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="h-8 bg-gray-800 rounded w-48 animate-pulse" />
            <div className="h-4 bg-gray-800 rounded w-96 animate-pulse" />
          </div>

          {/* Form */}
          <div className="bg-gray-800 rounded-lg p-6 space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-24 animate-pulse" />
                <div className="h-10 bg-gray-700 rounded animate-pulse" />
              </div>
            ))}
            <div className="h-10 bg-gray-600 rounded w-32 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
