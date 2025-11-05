/**
 * Editor Loading Component
 */

export default function EditorLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
      {/* Title Input */}
      <div className="space-y-4">
        <div className="h-6 bg-gray-700 rounded w-24" />
        <div className="h-12 bg-gray-800 rounded-lg" />
      </div>

      {/* Editor Toolbar */}
      <div className="flex items-center space-x-2 border-b border-gray-700 pb-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-8 w-8 bg-gray-700 rounded" />
        ))}
      </div>

      {/* Editor Content */}
      <div className="min-h-[400px] space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-700 rounded" style={{ width: `${Math.random() * 40 + 60}%` }} />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="h-10 w-32 bg-gray-700 rounded-lg" />
        <div className="flex space-x-3">
          <div className="h-10 w-24 bg-gray-700 rounded-lg" />
          <div className="h-10 w-24 bg-gray-600 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
