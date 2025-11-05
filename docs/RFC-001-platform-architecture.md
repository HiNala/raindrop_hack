# RFC-001: Platform & Architecture Standards

**Status**: 🟡 PENDING APPROVAL  
**Author**: Raindrop Code  
**Reviewers**: Platform Team  
**Target**: Next.js 14 Blog Platform  
**Effective**: Upon Approval  

---

## Executive Summary

This RFC establishes the foundational architecture, design system, and development standards for the blog platform. It defines the design tokens, folder conventions, server/client boundaries, error handling patterns, and performance budgets that will ensure consistency, maintainability, and production readiness across the entire application.

---

## 1. Design System Specification

### 1.1 Color Palette (Dark-First)

```typescript
// src/lib/design/tokens.ts
export const tokens = {
  colors: {
    // Base palette
    base: {
      0:   '#000000', // Pure black
      50:  '#0a0a0b', // Primary background
      100: '#141417', // Elevated surfaces
      200: '#1a1a1d', // Cards and panels
      300: '#27272a', // Borders and dividers
      400: '#3f3f46', // Hover states
      500: '#52525b', // Secondary text
      600: '#71717a', // Tertiary text
      700: '#a1a1aa', // Muted text
      800: '#d4d4d8', // Light text
      900: '#fafafa', // Primary text
      950: '#ffffff', // Pure white
    },
    
    // Brand colors
    brand: {
      teal: {
        50:  '#f0fdfa',
        500: '#14b8a6',
        600: '#0d9488',
        700: '#0f766e',
      },
      orange: {
        50:  '#fff7ed',
        500: '#f97316',
        600: '#ea580c',
        700: '#c2410c',
      },
    },
    
    // Semantic colors
    semantic: {
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    }
  }
}
```

### 1.2 Typography Scale

```typescript
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Consolas', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  }
}
```

### 1.3 Spacing System

```typescript
export const spacing = {
  0: '0px',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
}
```

### 1.4 Border Radius & Shadows

```typescript
export const borders = {
  radius: {
    none: '0px',
    sm: '0.125rem',  // 2px
    base: '0.25rem', // 4px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    '2xl': '1rem',   // 16px
    full: '9999px',
  },
  
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    glow: '0 0 20px rgba(20, 184, 166, 0.3)',
  }
}
```

---

## 2. Folder Convention Specification

### 2.1 Feature-First Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Route groups
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (dashboard)/       # Protected routes
│   │   ├── dashboard/
│   │   ├── editor/
│   │   └── settings/
│   ├── (public)/          # Public routes
│   │   ├── [slug]/
│   │   └── tags/
│   ├── api/               # API routes
│   │   ├── posts/
│   │   ├── comments/
│   │   └── auth/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── sheet.tsx
│   ├── dashboard/        # Dashboard-specific components
│   │   ├── Dashboard.tsx
│   │   ├── PostPreview.tsx
│   │   └── QuickActions.tsx
│   ├── editor/           # Editor-specific components
│   │   ├── EditorForm.tsx
│   │   ├── Toolbar.tsx
│   │   └── PublishSheet.tsx
│   └── layout/           # Layout components
│       ├── Header.tsx
│       ├── Navigation.tsx
│       └── Footer.tsx
├── lib/                  # Utility libraries
│   ├── design/           # Design tokens
│   │   └── tokens.ts
│   ├── db/               # Database utilities
│   │   └── prisma.ts
│   ├── auth/             # Authentication utilities
│   │   └── clerk.ts
│   ├── ai/               # AI integration
│   │   └── openai.ts
│   ├── hn/               # Hacker News integration
│   │   └── context.ts
│   ├── validations/      # Zod schemas
│   │   └── schemas.ts
│   └── utils/            # General utilities
│       └── helpers.ts
├── hooks/                # React hooks
│   ├── use-autosave.ts
│   ├── use-like.ts
│   └── use-search.ts
└── types/                # TypeScript types
    ├── api.ts
    ├── editor.ts
    └── user.ts
```

### 2.2 File Naming Conventions

- **Components**: PascalCase (`Dashboard.tsx`, `PostPreview.tsx`)
- **Pages**: `page.tsx`, `layout.tsx` (Next.js conventions)
- **API Routes**: `route.ts` (Next.js conventions)
- **Utilities**: kebab-case (`use-autosave.ts`, `api-helpers.ts`)
- **Types**: kebab-case (`user-types.ts`, `api-types.ts`)
- **Tests**: `.test.ts`, `.spec.ts` suffixes

---

## 3. Server/Client Boundary Specification

### 3.1 Server Components (Default)

```typescript
// ✅ Server Component (no "use client")
export default function PostPage({ params }: { params: { slug: string } }) {
  // Direct database access
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { author: true, tags: true }
  })
  
  return <PostView post={post} />
}
```

### 3.2 Client Components (Explicit)

```typescript
// ✅ Client Component (explicit "use client")
'use client'

import { useState } from 'react'

export function LikeButton({ postId }: { postId: string }) {
  const [isLiked, setIsLiked] = useState(false)
  
  // Client-side interactions only
  return (
    <button onClick={() => setIsLiked(!isLiked)}>
      {isLiked ? '❤️' : '🤍'}
    </button>
  )
}
```

### 3.3 Server Actions Boundary

```typescript
// ✅ Server Actions (server-side only)
'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db/prisma'

export async function createPost(data: CreatePostData) {
  const { userId } = auth()
  if (!userId) throw new Error('Unauthorized')
  
  // Server-side validation and database operations
  return await prisma.post.create({
    data: { ...data, authorId: userId }
  })
}
```

---

## 4. Error & Loading Patterns

### 4.1 Error Boundaries

```typescript
// src/app/error.tsx
'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Something went wrong!
        </h2>
        <button
          onClick={reset}
          className="btn-primary"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
```

### 4.2 Loading States (Skeletons)

```typescript
// src/components/ui/skeleton.tsx
export function Skeleton({ className }: { className?: string }) {
  return (
    <div 
      className={cn(
        'animate-pulse rounded-md bg-surface-100',
        className
      )}
    />
  )
}

// Usage in components
export function PostCardSkeleton() {
  return (
    <div className="card">
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-full mb-1" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  )
}
```

### 4.3 Toast Notifications

```typescript
// src/hooks/use-toast.ts
import { toast } from 'sonner'

export function useToast() {
  return {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    loading: (message: string) => toast.loading(message),
    dismiss: () => toast.dismiss()
  }
}
```

---

## 5. Performance Budgets

### 5.1 Core Web Vitals Targets

| Metric | Target | Current | Notes |
|--------|--------|---------|-------|
| LCP | < 2.5s | TBD | Largest Contentful Paint |
| FID | < 100ms | TBD | First Input Delay |
| CLS | < 0.1 | TBD | Cumulative Layout Shift |
| TTI | < 3.8s | TBD | Time to Interactive |

### 5.2 Bundle Size Budgets

| Asset | Budget | Measurement |
|-------|--------|-------------|
| JavaScript | < 250KB (gzipped) | webpack-bundle-analyzer |
| CSS | < 50KB (gzipped) | CSS size analysis |
| Images | WebP format, < 500KB | next/image optimization |
| Fonts | < 100KB (gzipped) | Inter + JetBrains Mono |

### 5.3 Performance Requirements

```typescript
// next.config.js
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Performance optimizations
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
}
```

---

## 6. Logging & Monitoring

### 6.1 Logging Levels

```typescript
// src/lib/logger.ts
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  userId?: string
  requestId?: string
  metadata?: Record<string, any>
}
```

### 6.2 Structured Logging

```typescript
// Usage examples
logger.info('User signed up', { userId, email })
logger.error('Database connection failed', { error: error.message })
logger.warn('Rate limit exceeded', { userId, endpoint, attempts })
```

### 6.3 Error Monitoring Integration

```typescript
// src/lib/monitoring.ts
export function captureError(error: Error, context?: Record<string, any>) {
  // Integration with Sentry, LogRocket, etc.
  console.error('Captured error:', error, context)
}
```

---

## 7. Security Standards

### 7.1 Input Validation

```typescript
// src/lib/validations/schemas.ts
import { z } from 'zod'

export const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(50000),
  tags: z.array(z.string()).max(5),
  published: z.boolean().default(false)
})
```

### 7.2 Rate Limiting

```typescript
// src/lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
  analytics: true,
})
```

### 7.3 Security Headers

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]
```

---

## 8. Testing Requirements

### 8.1 Test Structure

```
src/
├── __tests__/           # Integration tests
├── components/
│   └── __tests__/       # Component tests
├── lib/
│   └── __tests__/       # Unit tests
└── e2e/                 # E2E tests (Playwright)
```

### 8.2 Coverage Requirements

| Type | Minimum Coverage | Critical Paths |
|------|------------------|----------------|
| Unit Tests | 80% | All utilities, hooks |
| Integration Tests | 70% | API routes, auth flows |
| E2E Tests | 100% | Critical user journeys |

### 8.3 Testing Stack

- **Unit**: Jest + React Testing Library
- **Integration**: Next.js testing utilities
- **E2E**: Playwright
- **Visual**: Chromatic (optional)

---

## 9. Acceptance Criteria

### 9.1 Must-Have

- ✅ All components use design tokens
- ✅ TypeScript strict mode enabled
- ✅ ESLint + Prettier configured
- ✅ Error boundaries implemented
- ✅ Loading states with skeletons
- ✅ Server/client boundaries respected
- ✅ Security headers configured
- ✅ Rate limiting implemented
- ✅ Core Web Vitals targets met

### 9.2 Should-Have

- ✅ Comprehensive test coverage
- ✅ Performance monitoring
- ✅ Accessibility AA compliance
- ✅ Bundle size optimization
- ✅ Image optimization

### 9.3 Could-Have

- ✅ Advanced error tracking
- ✅ Real user monitoring
- ✅ A/B testing framework
- ✅ Advanced caching strategies

---

## 10. Implementation Timeline

| Phase | Duration | Deliverables |
|-------|----------|-------------|
| Design System | 2 days | Tokens, components, documentation |
| Architecture Setup | 2 days | Folder structure, boundaries, configs |
| Security & Performance | 2 days | Headers, rate limiting, optimization |
| Testing & Quality | 2 days | Test suite, CI/CD setup |
| Documentation | 1 day | README, deployment guide, API docs |

**Total Estimated Time: 9 days**

---

## 11. Migration Strategy

### 11.1 Backward Compatibility

- Existing components will be gradually migrated
- Legacy styles will be supported during transition
- Feature flags will control new vs old implementations

### 11.2 Rollout Plan

1. **Phase 1**: Design tokens and base components
2. **Phase 2**: Core page migrations
3. **Phase 3**: Feature-specific migrations
4. **Phase 4**: Cleanup and optimization

---

## 12. Conclusion

This RFC establishes a comprehensive foundation for the blog platform that ensures:

- **Consistency**: Unified design system and patterns
- **Maintainability**: Clear structure and boundaries
- **Performance**: Optimized for Core Web Vitals
- **Security**: Best practices and protections
- **Accessibility**: WCAG AA compliance
- **Quality**: Comprehensive testing strategy

**Approval of this RFC will enable systematic implementation of all platform improvements while maintaining stability and performance.**

---

**Next Steps**:
1. Review and approve this RFC
2. Proceed with RFC-002 (Authoring & AI Enrichment)
3. Execute orchestrator script for implementation
4. Monitor and iterate based on metrics

---

*This RFC will be version-controlled and updated as the platform evolves.*