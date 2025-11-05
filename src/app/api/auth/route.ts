// Temporarily disabled - using Clerk for authentication
// TODO: Remove this file entirely when Clerk is fully configured

import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'Authentication handled by Clerk' },
    { status: 503 },
  )
}

export async function GET() {
  return NextResponse.json(
    { error: 'Authentication handled by Clerk' },
    { status: 503 },
  )
}
