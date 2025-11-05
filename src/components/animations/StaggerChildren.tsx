'use client'

import { motion, Variants } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

interface StaggerChildrenProps {
  children: React.ReactNode
  staggerDelay?: number
  className?: string
  triggerOnce?: boolean
}

export function StaggerChildren({
  children,
  staggerDelay = 0.1,
  className = '',
  triggerOnce = true,
}: StaggerChildrenProps) {
  const { elementRef, isVisible } = useScrollAnimation({ triggerOnce })

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  }

  return (
    <motion.div
      ref={elementRef as any}
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      className={className}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div key={index} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  )
}

