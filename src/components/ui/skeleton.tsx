'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  lines?: number
}

export function Skeleton({ 
  className, 
  variant = 'rectangular', 
  width, 
  height, 
  lines = 1 
}: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 w-full',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg'
  }

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-4 bg-dark-card rounded animate-pulse',
              i === lines - 1 ? 'w-3/4' : 'w-full'
            )}
            style={{
              width: i === lines - 1 ? '75%' : width,
              height: height || '1rem'
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'bg-dark-card animate-pulse',
        variantClasses[variant],
        className
      )}
      style={{
        width,
        height
      }}
    />
  )
}

// Loading card skeleton
export function PostCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="h-48 bg-dark-card" />
      <div className="p-6 space-y-4">
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-dark-card rounded-full" />
          <div className="h-6 w-20 bg-dark-card rounded-full" />
        </div>
        <div className="h-6 bg-dark-card rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-dark-card rounded" />
          <div className="h-4 bg-dark-card rounded w-5/6" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-dark-card rounded-full" />
            <div className="h-4 w-24 bg-dark-card rounded" />
          </div>
          <div className="flex gap-4">
            <div className="h-4 w-8 bg-dark-card rounded" />
            <div className="h-4 w-8 bg-dark-card rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Dashboard skeleton
export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Quick actions skeleton */}
      <div className="card p-6">
        <div className="flex flex-wrap gap-4">
          <div className="h-10 w-32 bg-dark-card rounded-lg animate-pulse" />
          <div className="h-10 w-36 bg-dark-card rounded-lg animate-pulse" />
          <div className="h-10 w-40 bg-dark-card rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card p-6">
            <div className="h-6 w-24 bg-dark-card rounded mb-4 animate-pulse" />
            <div className="h-8 w-16 bg-dark-card rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Posts skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

// Content skeleton for article pages
export function ArticleSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-6">
        {/* Title skeleton */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="h-6 w-20 bg-dark-card rounded-full animate-pulse" />
            <div className="h-6 w-24 bg-dark-card rounded-full animate-pulse" />
          </div>
          <div className="h-12 w-3/4 bg-dark-card rounded animate-pulse" />
          <div className="h-6 w-full bg-dark-card rounded animate-pulse" />
        </div>

        {/* Author skeleton */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-dark-card rounded-full animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-dark-card rounded animate-pulse" />
            <div className="h-3 w-24 bg-dark-card rounded animate-pulse" />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className={cn(
                'h-4 bg-dark-card rounded animate-pulse',
                i % 3 === 0 && 'w-5/6'
              )} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Loading spinner component
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={cn('animate-spin', sizeClasses[size])}>
      <svg
        className="w-full h-full text-teal-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
}

// Full page loading
export function FullPageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-text-secondary">Loading...</p>
      </div>
    </div>
  )
}

// Inline loading for buttons
export function ButtonLoading({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex items-center gap-2">
      <LoadingSpinner size="sm" />
      <span>{text}</span>
    </div>
  )
}