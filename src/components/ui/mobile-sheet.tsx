'use client'

import * as React from 'react'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const MobileSheet = SheetPrimitive.Root

const MobileSheetTrigger = SheetPrimitive.Trigger

const MobileSheetClose = SheetPrimitive.Close

const MobileSheetPortal = SheetPrimitive.Portal

const mobileSheetVariants = cva(
  'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top max-h-[50vh]',
        bottom:
          'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom max-h-[85vh]',
        left: 'inset-y-0 left-0 h-full w-4/5 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
        right:
          'inset-y-0 right-0 h-full w-4/5 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
      },
      size: {
        default: 'h-auto',
        full: 'h-[90vh]',
        compact: 'h-auto max-h-[60vh]',
      },
    },
    defaultVariants: {
      side: 'bottom',
      size: 'default',
    },
  },
)

interface MobileSheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof mobileSheetVariants> {}

const MobileSheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  MobileSheetContentProps
>(({ side = 'bottom', size = 'default', className, children, ...props }, ref) => (
  <MobileSheetPortal>
    <MobileSheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(mobileSheetVariants({ side, size }), className, 'rounded-t-2xl')}
      {...props}
    >
      {/* Drag Handle for Bottom Sheets */}
      {side === 'bottom' && (
        <div className="absolute left-1/2 top-2 -translate-x-1/2 w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full touch-none" />
      )}

      {children}

      {/* Enhanced Close Button */}
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-full p-2 opacity-70 ring-offset-background transition-opacity hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary min-h-[44px] min-w-[44px] flex items-center justify-center">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </MobileSheetPortal>
))
MobileSheetContent.displayName = SheetPrimitive.Content.displayName

const MobileSheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      'fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
    ref={ref}
  />
))
MobileSheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const MobileSheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-2 text-center sm:text-left pb-4 border-b border-gray-200 dark:border-gray-700',
      className,
    )}
    {...props}
  />
)
MobileSheetHeader.displayName = 'MobileSheetHeader'

const MobileSheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700 pb-safe-plus',
      className,
    )}
    {...props}
  />
)
MobileSheetFooter.displayName = 'MobileSheetFooter'

const MobileSheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold text-foreground', className)}
    {...props}
  />
))
MobileSheetTitle.displayName = SheetPrimitive.Title.displayName

const MobileSheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
MobileSheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  MobileSheet,
  MobileSheetPortal,
  MobileSheetOverlay,
  MobileSheetTrigger,
  MobileSheetClose,
  MobileSheetContent,
  MobileSheetHeader,
  MobileSheetFooter,
  MobileSheetTitle,
  MobileSheetDescription,
}
