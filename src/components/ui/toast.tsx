'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toast: (toast: Omit<Toast, 'id'>) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = (newToast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const toastWithId = { ...newToast, id }

    setToasts(prev => [...prev, toastWithId])

    // Auto-dismiss after duration (default 5 seconds)
    const duration = newToast.duration ?? 5000
    setTimeout(() => {
      dismiss(id)
    }, duration)
  }

  const dismiss = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast, index) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={onDismiss}
          style={{
            animation: `slideIn 0.3s ease-out ${index * 0.1}s both`,
          }}
        />
      ))}
    </div>
  )
}

interface ToastItemProps {
  toast: Toast
  onDismiss: (id: string) => void
  style?: React.CSSProperties
}

function ToastItem({ toast, onDismiss, style }: ToastItemProps) {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
      case 'info':
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
    }
  }

  return (
    <div
      className={cn(
        'relative flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm',
        'transform transition-all duration-300 ease-out',
        getBackgroundColor(),
      )}
      style={style}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
          {toast.title}
        </h4>
        {toast.description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
            {toast.description}
          </p>
        )}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="mt-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

// Convenience functions
export const createToast = () => {
  const { toast } = useToast()

  return {
    success: (title: string, description?: string) =>
      toast({ type: 'success', title, description }),
    error: (title: string, description?: string) =>
      toast({ type: 'error', title, description }),
    warning: (title: string, description?: string) =>
      toast({ type: 'warning', title, description }),
    info: (title: string, description?: string) =>
      toast({ type: 'info', title, description }),
    custom: (options: Omit<Toast, 'id'>) => toast(options),
  }
}

// Add CSS animations
const style = document.createElement('style')
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`
if (!document.head.querySelector('style[data-toast-animations]')) {
  style.setAttribute('data-toast-animations', 'true')
  document.head.appendChild(style)
}
