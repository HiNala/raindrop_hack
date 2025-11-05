import { useRef, useState, useEffect, MouseEvent } from 'react'

export function useMagneticHover(strength: number = 0.3) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const elementRef = useRef<HTMLElement | null>(null)

  const handleMouseMove = (e: globalThis.MouseEvent) => {
    if (!elementRef.current) return

    const rect = elementRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distance = Math.sqrt(
      Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2),
    )

    const maxDistance = 150 // pixels

    if (distance < maxDistance) {
      const deltaX = (e.clientX - centerX) * strength
      const deltaY = (e.clientY - centerY) * strength
      setPosition({ x: deltaX, y: deltaY })
    } else {
      setPosition({ x: 0, y: 0 })
    }
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  useEffect(() => {
    const element = elementRef.current
    if (element) {
      window.addEventListener('mousemove', handleMouseMove)
      element.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        element.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  return { elementRef, position }
}

