import { NextRequest, NextResponse } from 'next/server'
import { publishScheduledPosts } from '@/lib/actions/schedule-actions'

export async function POST(_request: NextRequest) {
  try {
    // Verify this is a cron job request (you should add proper authentication)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await publishScheduledPosts()

    return NextResponse.json({
      success: true,
      published: result.published,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error in cron job:', error)
    return NextResponse.json({ error: 'Failed to publish scheduled posts' }, { status: 500 })
  }
}

export async function GET(_request: NextRequest) {
  return NextResponse.json({
    message: 'Cron endpoint for publishing scheduled posts',
    method: 'POST',
    usage: 'Call with Authorization: Bearer CRON_SECRET',
  })
}
