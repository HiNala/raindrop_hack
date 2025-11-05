// Temporarily simplified tags API for frontend development

import { NextResponse } from 'next/server'

const mockTags = [
  { id: "1", name: "JavaScript", slug: "javascript", _count: { posts: 10 } },
  { id: "2", name: "React", slug: "react", _count: { posts: 8 } },
  { id: "3", name: "TypeScript", slug: "typescript", _count: { posts: 6 } },
  { id: "4", name: "Next.js", slug: "nextjs", _count: { posts: 5 } },
  { id: "5", name: "CSS", slug: "css", _count: { posts: 4 } }
]

export async function GET() {
  return NextResponse.json(mockTags)
}