# RFC 001: Platform Architecture & Standards

## Status: DRAFT
**Authors:** AI Assistant  
**Reviewers:** Pending  
**Target Date:** Immediate implementation  

## Abstract

This RFC establishes the foundational architecture standards for the blog platform, including design tokens, routing conventions, API boundaries, error handling, logging, and security posture. These standards will ensure consistency, maintainability, and production readiness across the entire codebase.

## Background

The current codebase shows mixed production readiness with several critical gaps:
- Mock database client preventing production functionality
- Inconsistent UI component patterns
- Missing security configurations
- Ad-hoc rate limiting and error handling

This RFC locks in decisions that will guide all future development and automated tooling.

## Decisions

### 1. Design System & UI Standards

#### 1.1 Design Tokens
```typescript
// src/lib/design/tokens.ts
export const tokens = {
  colors: {
    // Dark-first palette (Capacity.so inspired)
    primary: {
      teal: '#14b8a6',
      tealHover: '#0d9488',
    },
    accent: {
      orange: '#f97316',
      orangeHover: '#ea580c',
    },
    dark: {
      bg: '#0a0a0b',
      surface: '#1a1a1d',
      border: '#27272a',
    },
    text: {
      primary: '#fafafa',
      secondary: '#a1a1aa',
      muted: '#71717a',
    }
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    scale: [0.75, 0.875, 1, 1.125, 1.25, 1.5, 1.875, 2.25, 3],
  }
}
```

#### 1.2 Component Standards
- **Single Source of Truth**: All UI components must extend from `/components/ui/base`
- **Dark-first Design**: All components must support dark theme as default
- **Mobile-first Responsive**: Use Tailwind mobile-first approach
- **Accessibility**: WCAG AA compliance minimum, semantic HTML5

#### 1.3 shadcn/ui Integration
```typescript
// Component generation standard
npx shadcn-ui@latest add [component-name] --yes --overwrite
```

### 2. Routing & URL Conventions

#### 2.1 URL Structure
```
/                          # Home page (discover content)
/dashboard                 # User dashboard (Reader/Writer tabs)
/editor/new               # New post creation
/editor/[id]              # Edit existing post
/p/[slug]                 # Public post view
/u/[username]             # User profile
/tag/[slug]               # Tag page
/search                   # Search results
/settings                 # User settings (drawer modal)
/api/posts                # Posts API
/api/posts/[id]           # Single post API
/api/hn-context           # Hacker News context API
```

#### 2.2 Route Protection
```typescript
// src/middleware.ts
const protectedRoutes = [
  '/dashboard(.*)',
  '/editor(.*)',
  '/settings(.*)',
  '/api/private(.*)',
]
```

#### 2.3 Canonical URLs & SEO
- All posts must have slugs (`/p/[slug]`)
- Username-based profiles (`/u/[username]`)
- Tag-based discovery (`/tag/[slug]`)
- Automatic redirect mapping for slug changes

### 3. API & Server Action Boundaries

#### 3.1 API Route Standards
```typescript
// src/app/api/[route]/route.ts
export async function GET(request: Request) {
  try {
    // 1. Validate request
    const validated = validateRequest(request)
    
    // 2. Check permissions
    await requirePermission(validated.user, 'read')
    
    // 3. Execute business logic
    const result = await businessLogic(validated.data)
    
    // 4. Return standardized response
    return NextResponse.json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString() }
    })
  } catch (error) {
    return handleError(error)
  }
}
```

#### 3.2 Server Action Standards
```typescript
// Maximum 5 second execution time
// Always return { success: boolean, data?: any, error?: string }
// Include optimistic update support
```

#### 3.3 Error Handling Contract
```typescript
// src/lib/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = 'AppError'
  }
}

// Standard error codes
export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const
```

### 4. Database & Data Layer

#### 4.1 Connection Management
```typescript
// src/lib/database.ts
export const db = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL }
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
})

// Connection pooling for production
if (process.env.NODE_ENV === 'production') {
  // Configure connection limits
}
```

#### 4.2 Query Standards
- Always use indexes for filtered queries
- Implement pagination with cursor-based navigation
- Use `select` to limit returned fields
- Include query performance monitoring

#### 4.3 Migration Strategy
```typescript
// All migrations must be:
// 1. Backward compatible
// 2. Reversible
// 3. Tested on production data copy
// 4. Include data validation
```

### 5. Authentication & Security

#### 5.1 Clerk Integration
```typescript
// src/lib/auth.ts
export const authConfig = {
  protectRoutes: ['/dashboard', '/editor', '/settings'],
  redirectUrl: '/sign-in',
  afterSignInUrl: '/dashboard',
  sessionTimeout: '7d',
}
```

#### 5.2 Security Headers
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

#### 5.3 Rate Limiting
```typescript
// Redis-based rate limiting
export const rateLimits = {
  aiGeneration: { requests: 10, window: '24h' },
  postCreation: { requests: 100, window: '1h' },
  comments: { requests: 50, window: '1h' },
  apiCalls: { requests: 1000, window: '1h' },
}
```

### 6. Logging & Observability

#### 6.1 Logging Standards
```typescript
// src/lib/logger.ts
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(JSON.stringify({ level: 'info', message, meta, timestamp: new Date().toISOString() }))
  },
  warn: (message: string, meta?: any) => {
    console.warn(JSON.stringify({ level: 'warn', message, meta, timestamp: new Date().toISOString() }))
  },
  error: (message: string, error?: Error, meta?: any) => {
    console.error(JSON.stringify({ 
      level: 'error', 
      message, 
      error: error?.stack, 
      meta, 
      timestamp: new Date().toISOString() 
    }))
  }
}
```

#### 6.2 Performance Monitoring
- Track API response times
- Monitor database query performance
- Log user interactions for analytics
- Error rate tracking per endpoint

### 7. Development & Tooling

#### 7.1 Code Quality Standards
```json
// .eslintrc.json
{
  "extends": ["@next/eslint-config-next", "@typescript-eslint/recommended"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "prefer-const": "error"
  }
}
```

#### 7.2 TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

## Implementation Plan

### Phase 1: Foundation (Week 1)
1. Replace mock Prisma client
2. Implement security headers
3. Set up logging infrastructure
4. Create design tokens system

### Phase 2: Standards (Week 2)
1. Standardize API routes
2. Implement error handling
3. Set up rate limiting
4. Component system unification

### Phase 3: Tooling (Week 3)
1. Configure ESLint/Prettier
2. Set up TypeScript strict mode
3. Implement automated testing
4. Create development scripts

## Backwards Compatibility

- All existing URLs will remain functional
- API responses maintain current structure
- Component props remain stable
- Database schema changes are additive

## Testing Strategy

- Unit tests for all business logic
- Integration tests for API routes
- E2E tests for critical user flows
- Performance tests for database queries

## Security Considerations

- All private routes protected by middleware
- Input validation on all endpoints
- SQL injection prevention via Prisma
- XSS prevention via TipTap JSON rendering

## Conclusion

This RFC establishes a comprehensive set of standards that will guide the platform's development. By implementing these standards consistently, we ensure maintainability, security, and performance at scale.

Approval of this RFC will enable the automated orchestrator to implement these changes systematically across the entire codebase.