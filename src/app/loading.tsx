/**
 * Global Loading Page
 * Shows skeleton loading for all posts
 */

import { PostCardSkeleton } from '@/components/post/PostCardSkeleton'

export default function Loading() {
  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4">
        {/* Loading Header */}
        <div className="mb-8 text-center">
          <div className="h-8 bg-dark-border rounded w-48 mx-auto mb-4 animate-pulse" />
          <div className="h-6 bg-dark-border rounded w-96 mx-auto animate-pulse" />
        </div>

        {/* Loading Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
