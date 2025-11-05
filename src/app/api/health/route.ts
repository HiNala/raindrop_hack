import { healthCheckHandler, readinessCheck, livenessCheck, metricsHandler } from '@/lib/monitoring'

/**
 * Main health check endpoint
 * Returns comprehensive health status
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  switch (type) {
    case 'ready':
      return readinessCheck()
    case 'alive':
      return livenessCheck()
    case 'metrics':
      return metricsHandler()
    default:
      return healthCheckHandler()
  }
}
