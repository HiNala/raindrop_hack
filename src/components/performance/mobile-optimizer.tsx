'use client'

import { useEffect, useRef } from 'react'

interface MobilePerformanceOptimizerProps {
  children: React.ReactNode
  deferScripts?: boolean
  lazyImages?: boolean
}

export function MobilePerformanceOptimizer({
  children,
  deferScripts = true,
  lazyImages = true
}: MobilePerformanceOptimizerProps) {
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true

    // Detect mobile device
    const isMobile = window.innerWidth < 768
    const isSlowDevice = navigator.hardwareConcurrency <= 4 ||
                        (navigator as any).deviceMemory <= 4

    if (isMobile || isSlowDevice) {
      // Disable heavy animations
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || isSlowDevice) {
        document.documentElement.style.setProperty('--animation-duration', '0.01ms')
      }

      // Optimize scroll performance
      let ticking = false
      const updateScroll = () => {
        ticking = false
      }

      const onScroll = () => {
        if (!ticking) {
          requestAnimationFrame(updateScroll)
          ticking = true
        }
      }

      window.addEventListener('scroll', onScroll, { passive: true })

      // Lazy load images
      if (lazyImages) {
        const images = document.querySelectorAll('img[data-src]')
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement
              if (img.dataset.src) {
                img.src = img.dataset.src
                img.removeAttribute('data-src')
                imageObserver.unobserve(img)
              }
            }
          })
        }, { rootMargin: '50px' })

        images.forEach((img) => imageObserver.observe(img))
      }

      // Defer non-critical scripts
      if (deferScripts) {
        const scripts = document.querySelectorAll('script[data-defer]')
        const loadScript = (script: HTMLScriptElement) => {
          const newScript = document.createElement('script')
          newScript.src = script.dataset.src || script.src
          newScript.async = true
          document.head.appendChild(newScript)
          script.remove()
        }

        // Load scripts after initial paint
        requestIdleCallback(() => {
          scripts.forEach(loadScript)
        })
      }

      // Reduce parallax effects on mobile
      document.querySelectorAll('[data-parallax]').forEach(el => {
        (el as HTMLElement).style.transform = 'none'
      })

      return () => {
        window.removeEventListener('scroll', onScroll)
      }
    }
  }, [deferScripts, lazyImages])

  return <>{children}</>
}

export default MobilePerformanceOptimizer
