'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((_registration) => {
            // TODO: Add proper logging service
            // console.log('SW registered: ', registration)
          })
          .catch((_registrationError) => {
            // TODO: Add proper logging service
            // console.log('SW registration failed: ', registrationError)
          })
      })
    }
  }, [])

  return null
}
