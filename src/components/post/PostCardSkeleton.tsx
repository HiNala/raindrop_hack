/**
 * Post Card Skeleton Component
 * Loading state for post cards
 */

export function PostCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-dark-border bg-dark-card animate-pulse">
      {/* Cover Image Skeleton */}
      <div className="h-48 bg-dark-border" />

      <div className="p-6 space-y-3">
        {/* Title Skeleton */}
        <div className="h-6 bg-dark-border rounded w-3/4" />

        {/* Excerpt Skeletons */}
        <div className="space-y-2">
          <div className="h-4 bg-dark-border rounded" />
          <div className="h-4 bg-dark-border rounded w-5/6" />
        </div>

        {/* Meta Info Skeleton */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-3">
            {/* Author Avatar */}
            <div className="h-8 w-8 rounded-full bg-dark-border" />
            {/* Author Name */}
            <div className="h-4 bg-dark-border rounded w-20" />
          </div>
          {/* Date */}
          <div className="h-4 bg-dark-border rounded w-16" />
        </div>

        {/* Tags Skeleton */}
        <div className="flex gap-2 pt-2">
          <div className="h-6 bg-dark-border rounded-full w-16" />
          <div className="h-6 bg-dark-border rounded-full w-20" />
        </div>
      </div>
    </div>
  )
}

/**
 * Dashboard Card Skeleton
 * Loading state for dashboard cards
 */
export function DashboardCardSkeleton() {
  return (
    <div className="rounded-2xl border border-dark-border bg-dark-card p-6 animate-pulse">
      <div className="space-y-4">
        {/* Icon */}
        <div className="h-10 w-10 bg-dark-border rounded-lg" />

        {/* Title */}
        <div className="h-6 bg-dark-border rounded w-1/3" />

        {/* Value */}
        <div className="h-8 bg-dark-border rounded w-1/4" />

        {/* Change */}
        <div className="h-4 bg-dark-border rounded w-20" />
      </div>
    </div>
  )
}

/**
 * Analytics Chart Skeleton
 * Loading state for analytics charts
 */
export function AnalyticsChartSkeleton() {
  return (
    <div className="rounded-2xl border border-dark-border bg-dark-card p-6 animate-pulse">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="h-6 bg-dark-border rounded w-24" />
          <div className="h-8 bg-dark-border rounded w-32" />
        </div>

        {/* Chart Area */}
        <div className="h-64 bg-dark-border rounded-lg" />

        {/* Legend */}
        <div className="flex justify-center gap-6">
          <div className="h-4 bg-dark-border rounded w-16" />
          <div className="h-4 bg-dark-border rounded w-16" />
          <div className="h-4 bg-dark-border rounded w-16" />
        </div>
      </div>
    </div>
  )
}

/**
 * Comment Skeleton
 * Loading state for comments
 */
export function CommentSkeleton() {
  return (
    <div className="rounded-2xl border border-dark-border bg-dark-card p-6 animate-pulse">
      <div className="space-y-4">
        {/* Comment Header */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-dark-border" />
          <div className="flex-1">
            <div className="h-4 bg-dark-border rounded w-24 mb-2" />
            <div className="h-3 bg-dark-border rounded w-16" />
          </div>
        </div>

        {/* Comment Content */}
        <div className="space-y-2">
          <div className="h-4 bg-dark-border rounded" />
          <div className="h-4 bg-dark-border rounded" />
          <div className="h-4 bg-dark-border rounded w-4/5" />
        </div>

        {/* Comment Actions */}
        <div className="flex gap-4 pt-2">
          <div className="h-6 bg-dark-border rounded w-16" />
          <div className="h-6 bg-dark-border rounded w-12" />
        </div>
      </div>
    </div>
  )
}

/**
 * User Profile Skeleton
 * Loading state for user profiles
 */
export function UserProfileSkeleton() {
  return (
    <div className="rounded-2xl border border-dark-border bg-dark-card p-8 animate-pulse">
      <div className="text-center space-y-4">
        {/* Avatar */}
        <div className="h-24 w-24 mx-auto rounded-full bg-dark-border" />

        {/* Name */}
        <div className="h-6 bg-dark-border rounded w-32 mx-auto" />

        {/* Username */}
        <div className="h-4 bg-dark-border rounded w-24 mx-auto" />

        {/* Bio */}
        <div className="space-y-2 mx-auto max-w-sm">
          <div className="h-4 bg-dark-border rounded" />
          <div className="h-4 bg-dark-border rounded" />
          <div className="h-4 bg-dark-border rounded w-3/4" />
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8">
          <div className="text-center">
            <div className="h-6 bg-dark-border rounded w-8 mx-auto mb-1" />
            <div className="h-3 bg-dark-border rounded w-12" />
          </div>
          <div className="text-center">
            <div className="h-6 bg-dark-border rounded w-8 mx-auto mb-1" />
            <div className="h-3 bg-dark-border rounded w-12" />
          </div>
          <div className="text-center">
            <div className="h-6 bg-dark-border rounded w-8 mx-auto mb-1" />
            <div className="h-3 bg-dark-border rounded w-12" />
          </div>
        </div>
      </div>
    </div>
  )
}
