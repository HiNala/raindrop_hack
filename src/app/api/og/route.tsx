/**
 * Dynamic OG Image Generation
 * Creates custom Open Graph images for posts and pages
 */

import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

// Color palette
const colors = {
  background: '#0a0a0b',
  gradient: 'linear-gradient(to bottom right, rgba(20, 184, 166, 0.1), rgba(249, 115, 22, 0.1))',
  primary: '#14b8a6',
  secondary: '#f97316',
  text: '#f8fafc',
  textSecondary: '#94a3b8',
  border: '#1e293b',
}

// Load font with better error handling
async function loadFont() {
  try {
    const fontData = await fetch(
      new URL(
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap',
        import.meta.url
      )
    ).then((res) => res.text())
    return fontData
  } catch {
    return '' // Fallback to system fonts
  }
}

// Generate OG Image for Blog Posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const title = searchParams.get('title') || 'Untitled Post'
    const author = searchParams.get('author') || 'Anonymous'
    const tag = searchParams.get('tag') || null
    const type = searchParams.get('type') || 'post'

    // Truncate very long titles
    const truncatedTitle = title.length > 60 ? title.slice(0, 60) + '...' : title

    // Different layouts for different types
    if (type === 'tag') {
      return generateTagImage(title)
    }

    if (type === 'author') {
      return generateAuthorImage(title)
    }

    return generatePostImage(truncatedTitle, author, tag)
  } catch (error) {
    console.error('OG Image generation failed:', error)
    return new Response('Failed to generate image', { status: 500 })
  }
}

async function generatePostImage(title: string, author: string, tag?: string | null) {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background,
          backgroundImage: colors.gradient,
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              radial-gradient(circle at 20% 20%, ${colors.primary}20 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, ${colors.secondary}20 0%, transparent 50%)
            `,
            opacity: 0.3,
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '60px',
            width: '100%',
            maxWidth: '1000px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Tag Badge */}
          {tag && (
            <div
              style={{
                marginBottom: '24px',
                padding: '8px 16px',
                backgroundColor: `${colors.primary}20`,
                border: `1px solid ${colors.primary}40`,
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: '500',
                color: colors.primary,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {tag}
            </div>
          )}

          {/* Title */}
          <h1
            style={{
              fontSize: title.length > 40 ? '56px' : '64px',
              fontWeight: '800',
              color: colors.text,
              lineHeight: 1.2,
              marginBottom: '24px',
              maxWidth: '900px',
              textShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            {title}
          </h1>

          {/* Author */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 24px',
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              border: `1px solid ${colors.border}`,
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.text,
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              {author.charAt(0).toUpperCase()}
            </div>

            {/* Author Name */}
            <span
              style={{
                color: colors.textSecondary,
                fontSize: '16px',
                fontWeight: '500',
              }}
            >
              by {author}
            </span>
          </div>

          {/* Logo/Brand */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '60px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              }}
            />
            <span
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: colors.textSecondary,
              }}
            >
              AI Blog Platform
            </span>
          </div>

          {/* URL */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '60px',
              fontSize: '14px',
              color: colors.textSecondary,
            }}
          >
            {new URL(request.url).origin}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}

async function generateTagImage(tagName: string) {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background,
          backgroundImage: colors.gradient,
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          position: 'relative',
        }}
      >
        {/* Tag Icon */}
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '32px',
            fontSize: '36px',
            color: colors.text,
          }}
        >
          🏷️
        </div>

        <h1
          style={{
            fontSize: '48px',
            fontWeight: '700',
            color: colors.text,
            marginBottom: '16px',
            textAlign: 'center',
          }}
        >
          {tagName}
        </h1>

        <p
          style={{
            fontSize: '20px',
            color: colors.textSecondary,
            textAlign: 'center',
            marginBottom: '40px',
          }}
        >
          Browse all {tagName.toLowerCase()} content
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: colors.textSecondary,
            fontSize: '16px',
          }}
        >
          <div
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '4px',
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            }}
          />
          AI Blog Platform
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}

async function generateAuthorImage(authorName: string) {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background,
          backgroundImage: colors.gradient,
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          position: 'relative',
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '32px',
            fontSize: '48px',
            color: colors.text,
            fontWeight: '700',
          }}
        >
          {authorName.charAt(0).toUpperCase()}
        </div>

        <h1
          style={{
            fontSize: '48px',
            fontWeight: '700',
            color: colors.text,
            marginBottom: '16px',
            textAlign: 'center',
          }}
        >
          {authorName}
        </h1>

        <p
          style={{
            fontSize: '20px',
            color: colors.textSecondary,
            textAlign: 'center',
            marginBottom: '40px',
          }}
        >
          Writer & Creator
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: colors.textSecondary,
            fontSize: '16px',
          }}
        >
          <div
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '4px',
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            }}
          />
          AI Blog Platform
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
