'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface NumberCounterProps {
  value: number
  duration?: number
  className?: string
}

export function NumberCounter({ value, duration = 1, className = '' }: NumberCounterProps) {
  const spring = useSpring(0, { duration: duration * 1000, bounce: 0 })
  const display = useTransform(spring, (current) => Math.round(current))
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  useEffect(() => {
    return display.on('change', (latest) => {
      setDisplayValue(latest)
    })
  }, [display])

  return (
    <motion.span className={className}>
      {displayValue.toLocaleString()}
    </motion.span>
  )
}

