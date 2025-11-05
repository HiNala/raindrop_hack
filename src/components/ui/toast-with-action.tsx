/**
 * Enhanced Toast System
 * Better notifications with actions and custom styling
 */

import { toast as sonnerToast } from 'sonner'
import { CheckCircle, XCircle, AlertCircle, Info, Loader2 } from 'lucide-react'

interface ToastOptions {
  duration?: number
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center'
  action?: {
    label: string
    onClick: () => void
  }
}

export const toast = {
  success: (message: string, options?: ToastOptions) => {
    return sonnerToast.success(message, {
      icon: <CheckCircle className="h-5 w-5 text-green-400" />,
      duration: options?.duration || 4000,
      position: options?.position || 'bottom-right',
      action: options?.action,
    })
  },

  error: (message: string, options?: Omit<ToastOptions, 'action'>) => {
    return sonnerToast.error(message, {
      icon: <XCircle className="h-5 w-5 text-red-400" />,
      duration: options?.duration || 6000,
      position: options?.position || 'bottom-right',
    })
  },

  warning: (message: string, options?: ToastOptions) => {
    return sonnerToast.warning(message, {
      icon: <AlertCircle className="h-5 w-5 text-orange-400" />,
      duration: options?.duration || 5000,
      position: options?.position || 'bottom-right',
      action: options?.action,
    })
  },

  info: (message: string, options?: ToastOptions) => {
    return sonnerToast.info(message, {
      icon: <Info className="h-5 w-5 text-blue-400" />,
      duration: options?.duration || 4000,
      position: options?.position || 'bottom-right',
      action: options?.action,
    })
  },

  loading: (message: string, options?: Omit<ToastOptions, 'action'>) => {
    return sonnerToast.loading(message, {
      icon: <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />,
      duration: options?.duration || 10000, // Longer for loading
      position: options?.position || 'bottom-right',
    })
  },

  promise: <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    },
    options?: Omit<ToastOptions, 'action'>
  ) => {
    return sonnerToast.promise(promise, {
      loading: {
        icon: <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />,
        message: loading,
      },
      success: (data) => ({
        icon: <CheckCircle className="h-5 w-5 text-green-400" />,
        message: typeof success === 'function' ? success(data) : success,
      }),
      error: (err) => ({
        icon: <XCircle className="h-5 w-5 text-red-400" />,
        message: typeof error === 'function' ? error(err) : error,
      }),
      duration: options?.duration,
      position: options?.position || 'bottom-right',
    })
  },

  // Specialized toasts for common actions
  postPublished: (title: string) => {
    return toast.success(`"${title}" published successfully!`, {
      action: {
        label: 'View Post',
        onClick: () => {
          // Navigate to the post (would need router implementation)
          // TODO: Add proper navigation
          // console.log('Navigate to post')
        }
      }
    })
  },

  postSaved: () => {
    return toast.success('Draft saved successfully')
  },

  commentPosted: () => {
    return toast.success('Comment posted successfully')
  },

  profileUpdated: () => {
    return toast.success('Profile updated successfully')
  },

  // Error toasts with context
  networkError: (action: string) => {
    return toast.error(`Failed to ${action}. Please check your connection and try again.`)
  },

  authError: () => {
    return toast.error('Authentication required. Please sign in to continue.', {
      action: {
        label: 'Sign In',
        onClick: () => {
          // Navigate to sign in page
          window.location.href = '/sign-in'
        }
      }
    })
  },

  // Permission errors
  permissionError: (action: string) => {
    return toast.error(`You don't have permission to ${action}`)
  },

  // Rate limit error
  rateLimitError: (resetTime?: number) => {
    const message = resetTime
      ? `Too many requests. Try again in ${Math.ceil(resetTime / 1000)} seconds.`
      : 'Too many requests. Please try again later.'

    return toast.warning(message)
  }
}

// Export default for convenience
export default toast
