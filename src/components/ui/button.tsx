'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'
import { useRipple, RippleEffect } from './ripple'
import { useMagneticHover } from '@/hooks/useMagneticHover'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary-600 text-white hover:bg-primary-700',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        outline: 'border border-gray-300 bg-white hover:bg-gray-50 hover:text-gray-900',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700',
        ghost: 'hover:bg-gray-100 hover:text-gray-900',
        link: 'text-primary-600 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  noRipple?: boolean
  noMagnetic?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      noRipple = false,
      noMagnetic = false,
      onClick,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    const { ripples, addRipple } = useRipple()
    const { elementRef, position } = useMagneticHover(0.15)

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!noRipple) {
        addRipple(e)
      }
      onClick?.(e)
    }

    const combinedRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        elementRef.current = node as HTMLElement
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      },
      [elementRef, ref]
    )

    if (asChild) {
      return (
        <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
      )
    }

    return (
      <motion.div
        style={
          noMagnetic
            ? {}
            : {
                x: position.x,
                y: position.y,
              }
        }
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="inline-block"
      >
        <Comp
          className={cn(buttonVariants({ variant, size, className }), 'relative overflow-hidden')}
          ref={combinedRef}
          onClick={handleClick}
          {...props}
        >
          {props.children}
          {!noRipple && <RippleEffect ripples={ripples} />}
        </Comp>
      </motion.div>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
