// Temporarily simplified categories API for frontend development

import { NextResponse } from 'next/server'

const mockCategories = [
  { id: '1', name: 'Technology', slug: 'technology', description: 'Tech posts' },
  { id: '2', name: 'Design', slug: 'design', description: 'Design posts' },
  { id: '3', name: 'Programming', slug: 'programming', description: 'Programming tutorials' },
]

export async function GET() {
  return NextResponse.json(mockCategories)
}

export async function POST() {
  return NextResponse.json(
    { error: 'Category creation temporarily disabled' },
    { status: 503 },
  )
}
