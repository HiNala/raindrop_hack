/**
 * Application monitoring and health check utilities
 */

import { NextResponse } from 'next/server'
import { prisma } from './prisma'
import { rateLimitService } from './rate-limiting'
import { logger } from './logger'

interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded'
  timestamp: string
  version: string
  services: {
    database: ServiceHealth
    redis: ServiceHealth
    memory: ServiceHealth
    disk: ServiceHealth
  }
  metrics: {
    uptime: number
    responseTime: number
    errorRate: number
    activeConnections: number
  }
}

interface ServiceHealth {
  status: 'healthy' | 'unhealthy' | 'degraded'
  responseTime?: number
  error?: string
  lastChecked: string
}

interface SystemMetrics {
  cpu: number
  memory: {
    used: number
    total: number
    percentage: number
  }
  disk: {
    used: number
    total: number
    percentage: number
  }
  uptime: number
  loadAverage: number[]
}

/**
 * Check database health
 */
async function checkDatabaseHealth(): Promise<ServiceHealth> {
  const start = Date.now()

  try {
    // Simple database connectivity test
    await prisma.$queryRaw`SELECT 1`

    const responseTime = Date.now() - start

    // Check database performance with a more complex query
    const queryStart = Date.now()
    await prisma.post.count({ where: { published: true } })
    const queryTime = Date.now() - queryStart

    const status = responseTime < 100 && queryTime < 200 ? 'healthy' :
                   responseTime < 500 && queryTime < 1000 ? 'degraded' : 'unhealthy'

    return {
      status,
      responseTime,
      lastChecked: new Date().toISOString(),
    }
  } catch (error) {
    logger.error('Database health check failed', error)
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown database error',
      lastChecked: new Date().toISOString(),
    }
  }
}

/**
 * Check Redis/Rate limiter health
 */
async function checkRedisHealth(): Promise<ServiceHealth> {
  const start = Date.now()

  try {
    // Test rate limiting service
    const testKey = `health-check-${Date.now()}`
    const result = await rateLimitService.checkLimit(testKey, {
      requests: 1,
      window: '1m',
    })

    const responseTime = Date.now() - start

    const status = result.success && responseTime < 100 ? 'healthy' :
                   result.success && responseTime < 500 ? 'degraded' : 'unhealthy'

    return {
      status,
      responseTime,
      lastChecked: new Date().toISOString(),
    }
  } catch (error) {
    logger.error('Redis health check failed', error)
    return {
      status: 'degraded', // Redis issues shouldn't make the whole app unhealthy
      error: error instanceof Error ? error.message : 'Unknown Redis error',
      lastChecked: new Date().toISOString(),
    }
  }
}

/**
 * Get system memory usage
 */
function getMemoryHealth(): ServiceHealth {
  try {
    const memUsage = process.memoryUsage()
    const totalMemory = require('os').totalmem()
    const usedMemory = memUsage.heapUsed + memUsage.external

    const memoryPercentage = (usedMemory / totalMemory) * 100

    const status = memoryPercentage < 70 ? 'healthy' :
                   memoryPercentage < 85 ? 'degraded' : 'unhealthy'

    return {
      status,
      lastChecked: new Date().toISOString(),
      error: memoryPercentage > 85 ? `Memory usage: ${memoryPercentage.toFixed(1)}%` : undefined,
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: 'Failed to get memory usage',
      lastChecked: new Date().toISOString(),
    }
  }
}

/**
 * Get system disk usage (simplified)
 */
function getDiskHealth(): ServiceHealth {
  try {
    // This is a simplified check - in production you'd want actual disk monitoring
    return {
      status: 'healthy',
      lastChecked: new Date().toISOString(),
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: 'Failed to get disk usage',
      lastChecked: new Date().toISOString(),
    }
  }
}

/**
 * Get system metrics
 */
function getSystemMetrics() {
  const os = require('os')

  return {
    uptime: os.uptime(),
    loadAverage: os.loadavg(),
    memory: {
      total: os.totalmem(),
      free: os.freemem(),
    },
    cpu: os.cpus().length,
  }
}

/**
 * Overall health check
 */
export async function performHealthCheck(): Promise<HealthCheck> {
  const startTime = Date.now()

  const [database, redis, memory, disk] = await Promise.all([
    checkDatabaseHealth(),
    checkRedisHealth(),
    getMemoryHealth(),
    getDiskHealth(),
  ])

  const systemMetrics = getSystemMetrics()
  const responseTime = Date.now() - startTime

  // Determine overall health
  const unhealthyServices = [database, redis, memory, disk].filter(s => s.status === 'unhealthy')
  const degradedServices = [database, redis, memory, disk].filter(s => s.status === 'degraded')

  const overallStatus = unhealthyServices.length > 0 ? 'unhealthy' :
                        degradedServices.length > 0 ? 'degraded' : 'healthy'

  return {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    services: {
      database,
      redis,
      memory,
      disk,
    },
    metrics: {
      uptime: systemMetrics.uptime,
      responseTime,
      errorRate: 0, // This would come from your error tracking system
      activeConnections: 0, // This would come from your connection pool
    },
  }
}

/**
 * Health check API endpoint handler
 */
export async function healthCheckHandler() {
  try {
    const health = await performHealthCheck()

    const statusCode = health.status === 'healthy' ? 200 :
                      health.status === 'degraded' ? 200 : 503

    return NextResponse.json(health, {
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Health-Status': health.status,
      },
    })
  } catch (error) {
    logger.error('Health check failed', error)

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Health-Status': 'unhealthy',
        },
      },
    )
  }
}

/**
 * Readiness check (for Kubernetes/Docker)
 */
export async function readinessCheck() {
  try {
    // Check if critical services are ready
    const database = await checkDatabaseHealth()

    if (database.status === 'unhealthy') {
      return NextResponse.json(
        { status: 'not ready', database: database.status },
        { status: 503 },
      )
    }

    return NextResponse.json(
      { status: 'ready' },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      { status: 'not ready', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 503 },
    )
  }
}

/**
 * Liveness check (for Kubernetes/Docker)
 */
export async function livenessCheck() {
  // Simple liveness check - just respond successfully
  return NextResponse.json(
    {
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    { status: 200 },
  )
}

/**
 * Application metrics endpoint
 */
export async function metricsHandler() {
  try {
    const systemMetrics = getSystemMetrics()
    const memUsage = process.memoryUsage()

    const metrics = {
      application: {
        name: process.env.npm_package_name || 'blog-app',
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime(),
        processId: process.pid,
      },
      memory: {
        rss: memUsage.rss,
        heapTotal: memUsage.heapTotal,
        heapUsed: memUsage.heapUsed,
        external: memUsage.external,
        arrayBuffers: memUsage.arrayBuffers,
      },
      system: {
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
        cpuCount: systemMetrics.cpu,
        totalMemory: systemMetrics.memory.total,
        freeMemory: systemMetrics.memory.free,
        loadAverage: systemMetrics.loadAverage,
      },
    }

    return NextResponse.json(metrics)
  } catch (error) {
    logger.error('Metrics endpoint failed', error)
    return NextResponse.json(
      { error: 'Failed to get metrics' },
      { status: 500 },
    )
  }
}

/**
 * Performance monitoring middleware
 */
export function withPerformanceMonitoring(
  handler: (request: Request) => Promise<Response>,
  route: string,
) {
  return async (request: Request): Promise<Response> => {
    const start = Date.now()
    const method = request.method
    const url = request.url

    try {
      const response = await handler(request)
      const duration = Date.now() - start

      // Log performance metrics
      logger.performanceMetric(`API ${method} ${route}`, duration, {
        method,
        url,
        statusCode: response.status,
      })

      // Add performance headers
      response.headers.set('X-Response-Time', `${duration}ms`)
      response.headers.set('X-Server-Timing', `app;dur=${duration}`)

      return response
    } catch (error) {
      const duration = Date.now() - start

      logger.error(`API ${method} ${route} failed`, error, {
        method,
        url,
        duration,
      })

      throw error
    }
  }
}
