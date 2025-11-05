import { NextRequest, NextResponse } from 'next/server'

interface PerformanceData {
  loadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  firstInputDelay: number
  cumulativeLayoutShift: number
  userAgent: string
  viewport: { width: number; height: number }
  devicePixelRatio: number
  isMobile: boolean
  timestamp: number
}

// In-memory storage for demo (use Redis/DB in production)
const performanceData: PerformanceData[] = []

export async function POST(request: NextRequest) {
  try {
    const data: PerformanceData = await request.json()

    // Validate required fields
    if (!data.loadTime || !data.timestamp) {
      return NextResponse.json(
        { error: 'Missing required performance metrics' },
        { status: 400 }
      )
    }

    // Store performance data
    performanceData.push(data)

    // Keep only last 1000 entries
    if (performanceData.length > 1000) {
      performanceData.splice(0, performanceData.length - 1000)
    }

    // Calculate aggregated metrics
    const mobileData = performanceData.filter(d => d.isMobile)
    const recentData = performanceData.filter(d =>
      Date.now() - d.timestamp < 24 * 60 * 60 * 1000 // Last 24 hours
    )

    const getAverage = (arr: number[]) =>
      arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0

    const getPercentile = (arr: number[], percentile: number) => {
      if (arr.length === 0) return 0
      const sorted = arr.sort((a, b) => a - b)
      const index = Math.ceil((percentile / 100) * sorted.length) - 1
      return sorted[index]
    }

    // Mobile-specific metrics
    const mobileMetrics = mobileData.length > 0 ? {
      averageLoadTime: getAverage(mobileData.map(d => d.loadTime)),
      p95LoadTime: getPercentile(mobileData.map(d => d.loadTime), 95),
      averageLCP: getAverage(mobileData.map(d => d.largestContentfulPaint)),
      p95LCP: getPercentile(mobileData.map(d => d.largestContentfulPaint), 95),
      averageFID: getAverage(mobileData.map(d => d.firstInputDelay)),
      p95FID: getPercentile(mobileData.map(d => d.firstInputDelay), 95),
      averageCLS: getAverage(mobileData.map(d => d.cumulativeLayoutShift)),
      p95CLS: getPercentile(mobileData.map(d => d.cumulativeLayoutShift), 95),
      sampleSize: mobileData.length,
    } : null

    // Web Vitals assessment
    const webVitalsPass = {
      lcp: mobileMetrics ? mobileMetrics.averageLCP <= 2500 : false,
      fid: mobileMetrics ? mobileMetrics.averageFID <= 100 : false,
      cls: mobileMetrics ? mobileMetrics.averageCLS <= 0.1 : false,
    }

    // TODO: Add proper logging service
    // console.log('📊 Mobile Performance Metrics Received:', {
    //   userAgent: data.userAgent.split(' ')[0],
    //   isMobile: data.isMobile,
    //   loadTime: `${data.loadTime.toFixed(0)}ms`,
    //   lcp: `${data.largestContentfulPaint.toFixed(0)}ms`,
    //   cls: data.cumulativeLayoutShift.toFixed(3),
    // })

    // Return success with metrics summary
    return NextResponse.json({
      success: true,
      message: 'Performance metrics recorded',
      metrics: {
        mobile: mobileMetrics,
        webVitals: webVitalsPass,
        recent: {
          totalSamples: recentData.length,
          mobileSamples: recentData.filter(d => d.isMobile).length,
        }
      }
    })

  } catch (error) {
    console.error('Error recording performance metrics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') // 'mobile' | 'recent' | 'all'

    let data = performanceData

    if (filter === 'mobile') {
      data = data.filter(d => d.isMobile)
    } else if (filter === 'recent') {
      data = data.filter(d => Date.now() - d.timestamp < 24 * 60 * 60 * 1000)
    }

    // Calculate summary statistics
    const getAverage = (arr: number[]) =>
      arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0

    const summary = {
      totalSamples: data.length,
      mobileSamples: data.filter(d => d.isMobile).length,
      averageLoadTime: getAverage(data.map(d => d.loadTime)),
      averageLCP: getAverage(data.map(d => d.largestContentfulPaint)),
      averageFID: getAverage(data.map(d => d.firstInputDelay)),
      averageCLS: getAverage(data.map(d => d.cumulativeLayoutShift)),
      webVitalsPass: {
        lcp: getAverage(data.map(d => d.largestContentfulPaint)) <= 2500,
        fid: getAverage(data.map(d => d.firstInputDelay)) <= 100,
        cls: getAverage(data.map(d => d.cumulativeLayoutShift)) <= 0.1,
      },
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      summary,
      // Return raw data for debugging (remove in production)
      ...(process.env.NODE_ENV === 'development' && {
        samples: data.slice(-10) // Last 10 samples
      })
    })

  } catch (error) {
    console.error('Error fetching performance metrics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
