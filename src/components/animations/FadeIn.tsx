'use client'

import { motion, Variants } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

interface FadeInProps {
  children: React.ReactNode
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  delay?: number
  duration?: number
  distance?: number
  triggerOnce?: boolean
  className?: string
}

export function FadeIn({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.5,
  distance = 30,
  triggerOnce = true,
  className = '',
}: FadeInProps) {
  const { elementRef, isVisible } = useScrollAnimation({ triggerOnce })

  const directionOffset = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  }

  const variants: Variants = {
    hidden: {
      opacity: 0,
      ...directionOffset[direction],
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  }

  return (
    <motion.div
      ref={elementRef as any}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  )
}
