// Temporarily simplified posts API for frontend development
// TODO: Implement full API when database is connected

import { NextRequest, NextResponse } from 'next/server'

const mockPosts = [
  {
    id: "1",
    title: "Welcome to the Blog",
    slug: "welcome-to-the-blog",
    excerpt: "This is a sample post for frontend development.",
    contentJson: {},
    contentHtml: "<p>This is a sample post for frontend development.</p>",
    coverImage: null,
    published: true,
    publishedAt: new Date().toISOString(),
    featured: false,
    readTimeMin: 5,
    author: {
      id: "1",
      clerkId: "user_123",
      email: "demo@example.com",
      profile: {
        username: "demo_user",
        displayName: "Demo User",
        avatarUrl: null
      }
    },
    tags: [
      { tag: { name: "demo", slug: "demo" } }
    ],
    _count: {
      likes: 5,
      comments: 2
    }
  },
  {
    id: "2",
    title: "Getting Started with Modern Web Development",
    slug: "getting-started-with-modern-web-development",
    excerpt: "A comprehensive guide to modern web development tools and practices.",
    contentJson: {},
    contentHtml: "<p>A comprehensive guide to modern web development tools and practices.</p>",
    coverImage: null,
    published: true,
    publishedAt: new Date().toISOString(),
    featured: true,
    readTimeMin: 8,
    author: {
      id: "1",
      clerkId: "user_123", 
      email: "demo@example.com",
      profile: {
        username: "demo_user",
        displayName: "Demo User",
        avatarUrl: null
      }
    },
    tags: [
      { tag: { name: "webdev", slug: "webdev" } },
      { tag: { name: "tutorial", slug: "tutorial" } }
    ],
    _count: {
      likes: 12,
      comments: 4
    }
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const slug = searchParams.get('slug')

    if (slug) {
      const post = mockPosts.find(p => p.slug === slug)
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      }
      return NextResponse.json(post)
    }

    // Return paginated results
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPosts = mockPosts.slice(startIndex, endIndex)

    return NextResponse.json({
      posts: paginatedPosts,
      pagination: {
        page,
        limit,
        total: mockPosts.length,
        pages: Math.ceil(mockPosts.length / limit)
      }
    })
  } catch (error) {
    console.error('Posts API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'Post creation temporarily disabled' },
    { status: 503 }
  )
}