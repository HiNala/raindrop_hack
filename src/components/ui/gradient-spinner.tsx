'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GradientSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function GradientSpinner({ size = 'md', className }: GradientSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      {/* Outer rotating gradient border */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-500 via-orange-500 to-teal-500"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          background: 'conic-gradient(from 0deg, #14b8a6, #f97316, #14b8a6)',
        }}
      />
      {/* Inner mask */}
      <div className="absolute inset-[2px] rounded-full bg-[#0a0a0b]" />
    </div>
  )
}

interface PulsingDotsProps {
  className?: string
}

export function PulsingDots({ className }: PulsingDotsProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-teal-500"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  )
}

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  className?: string
}

export function ProgressRing({
  progress,
  size = 60,
  strokeWidth = 4,
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg width={size} height={size} className={cn('transform -rotate-90', className)}>
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        className="text-dark-border"
      />
      {/* Progress circle */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="url(#gradient)"
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        style={{
          strokeDasharray: circumference,
        }}
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
    </svg>
  )
}
