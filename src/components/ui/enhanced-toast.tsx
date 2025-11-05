'use client'

import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface EnhancedToastProps {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
  onDismiss: (id: string) => void
}

export function EnhancedToast({
  id,
  type,
  title,
  description,
  duration = 5000,
  onDismiss,
}: EnhancedToastProps) {
  const [progress, setProgress] = useState(100)
  const x = useMotionValue(0)
  const opacity = useTransform(x, [0, 150], [1, 0])
  const isDragging = useMotionValue(false)

  useEffect(() => {
    if (duration === Infinity) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          onDismiss(id)
          return 0
        }
        return prev - (100 / duration) * 100
      })
    }, 100)

    return () => clearInterval(interval)
  }, [duration, id, onDismiss])

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
      onDismiss(id)
    }
  }

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  }

  const colors = {
    success: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      icon: 'text-green-400',
      progress: 'bg-green-500',
    },
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      icon: 'text-red-400',
      progress: 'bg-red-500',
    },
    warning: {
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/30',
      icon: 'text-orange-400',
      progress: 'bg-orange-500',
    },
    info: {
      bg: 'bg-teal-500/10',
      border: 'border-teal-500/30',
      icon: 'text-teal-400',
      progress: 'bg-teal-500',
    },
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.8, transition: { duration: 0.2 } }}
      drag="x"
      dragConstraints={{ left: 0, right: 150 }}
      dragElastic={0.1}
      onDragEnd={handleDragEnd}
      style={{ x, opacity }}
      className={cn(
        'flex gap-3 p-4 rounded-lg border backdrop-blur-lg shadow-2xl min-w-[320px] max-w-md cursor-grab active:cursor-grabbing relative overflow-hidden',
        'bg-[#1a1a1d]',
        colors[type].border
      )}
    >
      {/* Animated icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 15,
          delay: 0.1,
        }}
        className={cn('flex-shrink-0', colors[type].icon)}
      >
        {icons[type]}
      </motion.div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <motion.h3
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="text-sm font-semibold text-text-primary"
        >
          {title}
        </motion.h3>
        {description && (
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-text-secondary mt-1"
          >
            {description}
          </motion.p>
        )}
      </div>

      {/* Close button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onDismiss(id)}
        className="flex-shrink-0 text-text-tertiary hover:text-text-primary transition-colors"
      >
        <X className="w-4 h-4" />
      </motion.button>

      {/* Progress bar */}
      {duration !== Infinity && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-dark-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className={cn('h-full', colors[type].progress)}
            style={{ width: `${progress}%` }}
            transition={{ ease: 'linear', duration: 0.1 }}
          />
        </motion.div>
      )}

      {/* Swipe indicator */}
      <motion.div
        className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-red-500/20 to-transparent pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isDragging.get() ? 1 : 0 }}
      />
    </motion.div>
  )
}

// Toast container
interface ToastContainerProps {
  toasts: Array<Omit<EnhancedToastProps, 'onDismiss'>>
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <EnhancedToast {...toast} onDismiss={onDismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}

