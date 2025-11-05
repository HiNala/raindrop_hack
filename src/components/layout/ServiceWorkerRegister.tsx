'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // In development, unregister any existing service workers
      if (process.env.NODE_ENV === 'development') {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister()
            console.log('Service worker unregistered in development')
          }
        })
        // Clear all caches
        if ('caches' in window) {
          caches.keys().then((names) => {
            names.forEach((name) => {
              caches.delete(name)
            })
          })
        }
        return
      }

      // In production, register the service worker
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((_registration) => {
            console.log('Service worker registered')
          })
          .catch((_registrationError) => {
            console.log('Service worker registration failed')
          })
      })
    }
  }, [])

  return null
}
