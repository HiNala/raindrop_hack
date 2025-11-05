import { NextResponse } from 'next/server'
import { checkSlugChangeImpact } from '@/lib/slug'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const currentSlug = searchParams.get('current')
    const newSlug = searchParams.get('new')

    if (!currentSlug || !newSlug) {
      return NextResponse.json(
        { error: 'Both current and new slug parameters are required' },
        { status: 400 }
      )
    }

    const impact = await checkSlugChangeImpact(currentSlug, newSlug)

    return NextResponse.json(impact)
  } catch (error) {
    console.error('Slug impact check error:', error)
    return NextResponse.json({ error: 'Failed to check slug impact' }, { status: 500 })
  }
}

