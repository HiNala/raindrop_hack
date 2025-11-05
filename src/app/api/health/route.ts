import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`
    
    // Check environment variables
    const envs = {
      database: !!process.env.DATABASE_URL,
      clerk: !!process.env.CLERK_SECRET_KEY && !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      openai: !!process.env.OPENAI_API_KEY,
      uploadthing: !!process.env.UPLOADTHING_SECRET && !!process.env.UPLOADTHING_APP_ID,
    }
    
    const allConfigured = Object.values(envs).every(Boolean)
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: {
        node: process.env.NODE_ENV || 'development',
        configured: allConfigured,
        checks: envs,
      },
      database: {
        connected: true,
        provider: 'postgresql',
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

