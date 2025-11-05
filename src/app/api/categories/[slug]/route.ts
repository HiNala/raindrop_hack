import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface Params {
  params: { slug: string }
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: params.slug },
      include: {
        _count: {
          select: {
            posts: {
              where: { published: true },
            },
          },
        },
      },
    })

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 })
  }
}
