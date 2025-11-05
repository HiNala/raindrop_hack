'use client'

import { useState } from 'react'
import { Smartphone, Tablet, Monitor, Check, X, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface TestResult {
  id: string
  name: string
  description: string
  status: 'pass' | 'fail' | 'warning'
  details?: string
}

export function ResponsiveTest() {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<TestResult[]>([])

  const runTests = async () => {
    setIsRunning(true)
    const testResults: TestResult[] = []

    // Test 1: Viewport Meta Tag
    const viewportMeta = document.querySelector('meta[name="viewport"]')
    const hasViewportFit = viewportMeta?.getAttribute('content')?.includes('viewport-fit=cover')
    testResults.push({
      id: 'viewport',
      name: 'Viewport Meta Tag',
      description: 'Proper viewport configuration with safe-area support',
      status: hasViewportFit ? 'pass' : 'fail',
      details: hasViewportFit ? 'viewport-fit=cover found' : 'Missing viewport-fit=cover'
    })

    // Test 2: Safe Area CSS Variables
    const computedStyle = getComputedStyle(document.documentElement)
    const hasSafeAreas = computedStyle.getPropertyValue('--safe-top') &&
                        computedStyle.getPropertyValue('--safe-bottom')
    testResults.push({
      id: 'safe-areas',
      name: 'Safe Area Support',
      description: 'CSS variables for device notches and home indicators',
      status: hasSafeAreas ? 'pass' : 'warning',
      details: hasSafeAreas ? 'Safe area variables defined' : 'Safe area variables not found'
    })

    // Test 3: Font Size (iOS Zoom Prevention)
    const bodyFontSize = parseFloat(computedStyle.getPropertyValue('font-size'))
    const hasCorrectFontSize = bodyFontSize >= 15
    testResults.push({
      id: 'font-size',
      name: 'iOS Zoom Prevention',
      description: 'Font size >= 15px to prevent iOS zoom on input focus',
      status: hasCorrectFontSize ? 'pass' : 'fail',
      details: `Body font size: ${bodyFontSize}px`
    })

    // Test 4: Horizontal Scroll
    const bodyWidth = document.body.scrollWidth
    const viewportWidth = window.innerWidth
    const hasHorizontalScroll = bodyWidth > viewportWidth
    testResults.push({
      id: 'horizontal-scroll',
      name: 'Horizontal Scroll',
      description: 'No horizontal scrollbars on mobile',
      status: hasHorizontalScroll ? 'fail' : 'pass',
      details: hasHorizontalScroll ? `Body width: ${bodyWidth}px > Viewport: ${viewportWidth}px` : 'No horizontal scroll detected'
    })

    // Test 5: Touch Targets
    const buttons = document.querySelectorAll('button')
    const touchTargetsValid = Array.from(buttons).every(btn => {
      const rect = btn.getBoundingClientRect()
      return rect.width >= 44 && rect.height >= 44
    })
    testResults.push({
      id: 'touch-targets',
      name: 'Touch Targets',
      description: 'Buttons meet 44x44px minimum touch target size',
      status: touchTargetsValid ? 'pass' : 'warning',
      details: `${buttons.length} buttons checked`
    })

    // Test 6: Responsive Images
    const images = document.querySelectorAll('img')
    const hasResponsiveImages = Array.from(images).every(img =>
      img.hasAttribute('loading') || img.hasAttribute('srcset') || img.closest('picture')
    )
    testResults.push({
      id: 'responsive-images',
      name: 'Responsive Images',
      description: 'Images have proper loading optimization',
      status: hasResponsiveImages ? 'pass' : 'warning',
      details: `${images.length} images checked`
    })

    // Test 7: Service Worker
    const hasServiceWorker = 'serviceWorker' in navigator
    testResults.push({
      id: 'service-worker',
      name: 'Service Worker',
      description: 'Service Worker API available',
      status: hasServiceWorker ? 'pass' : 'fail',
      details: hasServiceWorker ? 'Service Worker supported' : 'Service Worker not supported'
    })

    // Test 8: PWA Manifest
    const hasManifest = document.querySelector('link[rel="manifest"]')
    testResults.push({
      id: 'manifest',
      name: 'PWA Manifest',
      description: 'Web App Manifest linked',
      status: hasManifest ? 'pass' : 'fail',
      details: hasManifest ? 'Manifest found' : 'Manifest not found'
    })

    setResults(testResults)
    setIsRunning(false)
  }

  const getStatusIcon = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass':
        return <Check className="w-4 h-4 text-green-400" />
      case 'fail':
        return <X className="w-4 h-4 text-red-400" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />
    }
  }

  const getStatusColor = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass':
        return 'border-green-500/30 bg-green-500/10'
      case 'fail':
        return 'border-red-500/30 bg-red-500/10'
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10'
    }
  }

  return (
    <div className="fixed bottom-20 left-4 z-40 max-w-sm">
      <Card className="glass-effect border-[#27272a] p-4">
        <div className="flex items-center gap-2 mb-3">
          <Smartphone className="w-4 h-4 text-teal-400" />
          <span className="text-sm font-medium text-text-primary">Mobile Test Suite</span>
        </div>

        <Button
          onClick={runTests}
          disabled={isRunning}
          size="sm"
          className="w-full bg-teal-500 hover:bg-teal-600 text-white mb-3"
        >
          {isRunning ? 'Running Tests...' : 'Run Mobile Tests'}
        </Button>

        {results.length > 0 && (
          <div className="space-y-2">
            {results.map((result) => (
              <div
                key={result.id}
                className={`flex items-start gap-2 p-2 rounded-lg border ${getStatusColor(result.status)}`}
              >
                {getStatusIcon(result.status)}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-primary">
                    {result.name}
                  </div>
                  <div className="text-xs text-text-secondary">
                    {result.description}
                  </div>
                  {result.details && (
                    <div className="text-xs text-text-tertiary mt-1">
                      {result.details}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
