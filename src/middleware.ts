import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from './lib/prisma'

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/editor(.*)',
  '/settings(.*)',
  '/api/private(.*)',
  '/admin(.*)',
])

// Handle slug redirects
export async function middleware(request) {
  const { pathname } = request.nextUrl

  // Check if this is a potential post slug
  if (pathname.startsWith('/p/')) {
    const slug = pathname.replace('/p/', '')

    // Check if there's a redirect for this slug
    try {
      const redirect = await prisma.slugRedirect.findUnique({
        where: { fromSlug: slug },
        include: {
          post: {
            select: {
              slug: true,
              published: true,
            },
          },
        },
      })

      if (redirect && redirect.post.published) {
        // Redirect to the new slug with 301 (permanent redirect)
        const newUrl = new URL(`/p/${redirect.toSlug}`, request.url)
        return NextResponse.redirect(newUrl, { status: 301 })
      }
    } catch (error) {
      // If database is down, continue normally
      console.warn('Slug redirect check failed:', error)
    }
  }

  // Apply Clerk middleware for protected routes
  return clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
      await auth().protect()
    }

    return NextResponse.next()
  })(request)
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}