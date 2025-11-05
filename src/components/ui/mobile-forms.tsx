'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface MobileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const MobileInput = forwardRef<HTMLInputElement, MobileInputProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-sm font-medium text-text-primary block">
            {label}
          </label>
        )}

        <input
          className={cn(
            // Mobile-first sizing with 16px minimum
            'flex h-12 w-full rounded-lg border border-[#27272a] bg-[#1a1a1d]',
            'px-4 py-3 text-base text-text-primary placeholder:text-text-tertiary',
            'focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-colors duration-200',
            // Error states
            error && 'border-red-500 focus:ring-red-500/20 focus:border-red-500',
            // Touch-friendly
            'min-h-[44px] touch-manipulation',
            className
          )}
          ref={ref}
          {...props}
        />

        {error && (
          <p className="text-[13px] text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-[13px] text-text-tertiary">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
MobileInput.displayName = 'MobileInput'

export interface MobileTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

const MobileTextarea = forwardRef<HTMLTextAreaElement, MobileTextareaProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-sm font-medium text-text-primary block">
            {label}
          </label>
        )}

        <textarea
          className={cn(
            'flex min-h-[120px] w-full rounded-lg border border-[#27272a] bg-[#1a1a1d]',
            'px-4 py-3 text-base text-text-primary placeholder:text-text-tertiary',
            'focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-colors duration-200 resize-y',
            'touch-manipulation',
            error && 'border-red-500 focus:ring-red-500/20 focus:border-red-500',
            className
          )}
          ref={ref}
          {...props}
        />

        {error && (
          <p className="text-[13px] text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-[13px] text-text-tertiary">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
MobileTextarea.displayName = 'MobileTextarea'

// Import AlertCircle for error messages
import { AlertCircle } from 'lucide-react'

export { MobileInput, MobileTextarea }
