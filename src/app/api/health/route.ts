import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`

    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      tables,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
