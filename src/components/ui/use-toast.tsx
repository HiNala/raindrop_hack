'use client'

import * as React from 'react'
import { toast as sonnerToast, Toaster as SonnerToaster } from 'sonner'

type ToasterProps = React.ComponentProps<typeof SonnerToaster>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <SonnerToaster
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:background-background group-[.toaster]:text-text-primary group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-text-muted',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  )
}

// Export toast functions
export const toast = sonnerToast
export { Toaster }

// For backward compatibility
export const useToast = () => {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
  }
}

export default Toaster