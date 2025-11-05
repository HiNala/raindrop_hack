'use client'

import { useEffect, useRef } from 'react'

interface PerformanceMetrics {
  loadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  firstInputDelay: number
  cumulativeLayoutShift: number
}

export function useMobilePerformance() {
  const metricsRef = useRef<PerformanceMetrics>({
    loadTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    firstInputDelay: 0,
    cumulativeLayoutShift: 0,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Track page load time
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigation) {
      metricsRef.current.loadTime = navigation.loadEventEnd - navigation.navigationStart
    }

    // Track First Contentful Paint
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          metricsRef.current.firstContentfulPaint = entry.startTime
        }
      }
    })
    observer.observe({ entryTypes: ['paint'] })

    // Track Largest Contentful Paint
    let lcpValue = 0
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      lcpValue = lastEntry.startTime
      metricsRef.current.largestContentfulPaint = lcpValue
    })
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

    // Track First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-input') {
          const fidEntry = entry as PerformanceEventTiming
          metricsRef.current.firstInputDelay = fidEntry.processingStart - fidEntry.startTime
        }
      }
    })
    fidObserver.observe({ entryTypes: ['first-input'] })

    // Track Cumulative Layout Shift
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as PerformanceEntry).hadRecentInput) {
          clsValue += (entry as any).value
        }
      }
      metricsRef.current.cumulativeLayoutShift = clsValue
    })
    clsObserver.observe({ entryTypes: ['layout-shift'] })

    // Cleanup
    return () => {
      observer.disconnect()
      lcpObserver.disconnect()
      fidObserver.disconnect()
      clsObserver.disconnect()
    }
  }, [])

  // Send metrics to analytics
  useEffect(() => {
    const sendMetrics = () => {
      const metrics = metricsRef.current

      // Only send if we have meaningful data
      if (metrics.loadTime > 0) {
        // Send to your analytics service
        if (process.env.NODE_ENV === 'production') {
          fetch('/api/analytics/performance', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...metrics,
              userAgent: navigator.userAgent,
              viewport: {
                width: window.innerWidth,
                height: window.innerHeight,
              },
              devicePixelRatio: window.devicePixelRatio,
              isMobile: window.innerWidth < 768,
              timestamp: Date.now(),
            }),
          }).catch(() => {
            // Silently fail for analytics
          })
        }

        // Console log for development
        if (process.env.NODE_ENV === 'development') {
          console.group('🚀 Mobile Performance Metrics')
          console.log('Load Time:', `${metrics.loadTime.toFixed(0)}ms`)
          console.log('FCP:', `${metrics.firstContentfulPaint.toFixed(0)}ms`)
          console.log('LCP:', `${metrics.largestContentfulPaint.toFixed(0)}ms`)
          console.log('FID:', `${metrics.firstInputDelay.toFixed(0)}ms`)
          console.log('CLS:', metrics.cumulativeLayoutShift.toFixed(3))

          // Check against Web Vitals thresholds
          console.group('📊 Web Vitals Assessment')
          console.log('LCP Good:', metrics.largestContentfulPaint <= 2500 ? '✅' : '❌')
          console.log('FID Good:', metrics.firstInputDelay <= 100 ? '✅' : '❌')
          console.log('CLS Good:', metrics.cumulativeLayoutShift <= 0.1 ? '✅' : '❌')
          console.groupEnd()
          console.groupEnd()
        }
      }
    }

    // Send metrics after page load
    if (document.readyState === 'complete') {
      sendMetrics()
    } else {
      window.addEventListener('load', sendMetrics)
      return () => window.removeEventListener('load', sendMetrics)
    }
  }, [])

  return metricsRef.current
}

// Hook for detecting mobile-specific performance issues
export function useMobilePerformanceOptimizations() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const isMobile = window.innerWidth < 768
    const isSlowDevice = navigator.hardwareConcurrency <= 4 ||
                        (navigator as any).deviceMemory <= 4

    if (isMobile || isSlowDevice) {
      // Reduce animations on mobile/slow devices
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--animation-duration', '0.01ms')
      }

      // Optimize images for mobile
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

      // Disable hover effects on touch devices
      if ('ontouchstart' in window) {
        document.body.classList.add('touch-device')
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

      return () => {
        window.removeEventListener('scroll', onScroll)
        imageObserver.disconnect()
      }
    }
  }, [])
}
