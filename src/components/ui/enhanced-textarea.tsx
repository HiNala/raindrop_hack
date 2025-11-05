'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface EnhancedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  success?: string
  showCharCount?: boolean
  maxLength?: number
  autoResize?: boolean
}

const EnhancedTextarea = React.forwardRef<HTMLTextAreaElement, EnhancedTextareaProps>(
  (
    { className, label, error, success, showCharCount, maxLength, autoResize = false, ...props },
    ref,
  ) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [value, setValue] = React.useState(props.value?.toString() || '')
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value)

      // Auto-resize
      if (autoResize && textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
      }

      props.onChange?.(e)
    }

    React.useEffect(() => {
      if (autoResize && textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
      }
    }, [autoResize])

    const combinedRef = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        textareaRef.current = node
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      },
      [ref],
    )

    const hasValue = value.length > 0 || isFocused
    const charCount = value.length
    const showLabel = label && (hasValue || props.placeholder)

    return (
      <div className="relative w-full">
        {/* Textarea field */}
        <div className="relative">
          <textarea
            className={cn(
              'flex min-h-[120px] w-full rounded-lg border border-[#27272a] bg-[#1a1a1d] px-4 py-3 text-base text-text-primary transition-all duration-200 resize-none',
              'placeholder:text-text-tertiary',
              'focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20',
              'disabled:cursor-not-allowed disabled:opacity-50',
              isFocused && !error && 'shadow-glow-teal border-teal-500',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              success && 'border-green-500 focus:border-green-500 focus:ring-green-500/20',
              showLabel && 'pt-6',
              autoResize && 'overflow-hidden',
              className,
            )}
            ref={combinedRef}
            value={value}
            onChange={handleChange}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            maxLength={maxLength}
            {...props}
          />

          {/* Floating label */}
          <AnimatePresence>
            {label && (
              <motion.label
                initial={{ y: 12, fontSize: '1rem' }}
                animate={{
                  y: hasValue ? 0 : 12,
                  fontSize: hasValue ? '0.75rem' : '1rem',
                }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'absolute left-4 pointer-events-none transition-colors duration-200',
                  hasValue ? 'top-2' : 'top-3',
                  isFocused ? 'text-teal-400' : error ? 'text-red-400' : 'text-text-tertiary',
                )}
              >
                {label}
              </motion.label>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom row: Error/Success message and char count */}
        <AnimatePresence mode="wait">
          {(error || success || (showCharCount && maxLength)) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between mt-2 px-1"
            >
              {/* Error or Success message */}
              {error && (
                <motion.p
                  initial={{ x: -10 }}
                  animate={{ x: [0, -5, 5, -5, 5, 0] }}
                  transition={{ duration: 0.4 }}
                  className="text-sm text-red-400 flex items-center gap-1"
                >
                  <span className="text-red-500">⚠</span>
                  {error}
                </motion.p>
              )}

              {success && !error && (
                <motion.p
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-sm text-green-400 flex items-center gap-1"
                >
                  <span className="text-green-500">✓</span>
                  {success}
                </motion.p>
              )}

              {/* Character count */}
              {showCharCount && maxLength && (
                <span
                  className={cn(
                    'text-xs transition-colors ml-auto',
                    charCount > maxLength * 0.9 ? 'text-orange-400' : 'text-text-tertiary',
                  )}
                >
                  {charCount}/{maxLength}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  },
)
EnhancedTextarea.displayName = 'EnhancedTextarea'

export { EnhancedTextarea }
