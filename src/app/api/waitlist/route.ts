import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { handleAPIError, withErrorHandling } from '@/lib/errors'
import { applyRateLimit } from '@/lib/rate-limit-middleware'

const waitlistSchema = z.object({
  email: z.string().email('Valid email address is required'),
})

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    // Apply rate limiting for waitlist
    await applyRateLimit(request, 'AUTH_ATTEMPTS')

    const body = await request.json()
    const validatedData = waitlistSchema.parse(body)

    // Check if email already exists in waitlist (or users table)
    const existingEntry = await prisma.user.findFirst({
      where: {
        email: validatedData.email,
      },
    })

    if (existingEntry) {
      return NextResponse.json(
        {
          message: 'You are already on our waitlist! Keep an eye out for launch updates.',
          alreadyJoined: true
        },
        { status: 200 },
      )
    }

    // In a production app, you would save this to a dedicated waitlist table
    // For now, we'll log it and could optionally store it in a simple way

    // TODO: Add to your email marketing service (Resend, Mailchimp, ConvertKit, etc.)
    // await addToEmailService(validatedData.email)

    // TODO: Add proper logging service
    // console.log('Waitlist signup:', {
    //   email: validatedData.email,
    //   ip: request.ip,
    //   userAgent: request.headers.get('user-agent'),
    //   timestamp: new Date().toISOString()
    // })

    return NextResponse.json(
      {
        message: 'Successfully joined the waitlist! Get ready for exclusive early access.',
        email: validatedData.email,
        alreadyJoined: false
      },
      { status: 201 },
    )
  }, { route: '/api/waitlist' })
}

export async function GET() {
  return withErrorHandling(async () => {
    // Get basic waitlist info
    const userCount = await prisma.user.count()

    // In production, you'd get actual waitlist count from your waitlist table
    const waitlistCount = userCount // Placeholder - replace with actual waitlist count

    return NextResponse.json({
      message: 'Waitlist is open for early access',
      waitlistCount,
      available: waitlistCount < 10000, // Example limit
      status: waitlistCount < 10000 ? 'open' : 'full'
    })
  }, { route: '/api/waitlist' })
}
