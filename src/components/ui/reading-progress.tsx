'use client'

import { motion } from 'framer-motion'
import { useScrollProgress } from '@/hooks/useScrollAnimation'

export function ReadingProgress() {
  const progress = useScrollProgress()

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-50 bg-gradient-to-r from-teal-500 via-teal-400 to-orange-500 origin-left"
      style={{
        scaleX: progress / 100,
        transformOrigin: '0%',
      }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: progress / 100 }}
      transition={{ ease: 'linear', duration: 0.1 }}
    />
  )
}
