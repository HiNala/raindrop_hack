'use client'

import { useState, useCallback, CSSProperties } from 'react'

interface Ripple {
  x: number
  y: number
  size: number
  id: number
}

export function useRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([])

  const addRipple = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const target = event.currentTarget
    const rect = target.getBoundingClientRect()
    
    const size = Math.max(rect.width, rect.height) * 2
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2

    const newRipple: Ripple = {
      x,
      y,
      size,
      id: Date.now(),
    }

    setRipples(prev => [...prev, newRipple])

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id))
    }, 800)
  }, [])

  return { ripples, addRipple }
}

interface RippleEffectProps {
  ripples: Ripple[]
}

export function RippleEffect({ ripples }: RippleEffectProps) {
  return (
    <span className="absolute inset-0 overflow-hidden rounded-md pointer-events-none">
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ripple"
          style={
            {
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              '--ripple-scale': 4,
            } as CSSProperties
          }
        />
      ))}
    </span>
  )
}

