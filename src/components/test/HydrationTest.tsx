'use client'

import { useEffect, useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

export function HydrationTest() {
  const [isClient, setIsClient] = useState(false)
  const [count, setCount] = useLocalStorage('test-count', 0)
  const [windowWidth, setWindowWidth] = useState(0)

  useEffect(() => {
    setIsClient(true)
    setWindowWidth(window.innerWidth)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isClient])

  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <div className="fixed top-20 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-xs">
      <h3 className="font-bold text-sm mb-2">✅ Hydration Test</h3>
      <div className="text-xs space-y-1">
        <p>Client: {isClient ? '✅' : '❌'}</p>
        <p>Window Width: {windowWidth}px</p>
        <p>Storage Count: {count}</p>
        <button
          onClick={() => setCount(count + 1)}
          className="mt-2 px-2 py-1 bg-white text-green-500 rounded text-xs"
        >
          Test Storage
        </button>
      </div>
    </div>
  )
}
