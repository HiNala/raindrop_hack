# RFC 002: Content Editing & AI/Hacker News Enrichment

## Status: DRAFT
**Authors:** AI Assistant  
**Reviewers:** Pending  
**Target Date:** Implementation after RFC-001 approval  

## Abstract

This RFC defines the complete content editing experience, including the modern dashboard, enhanced editor with autosave, AI-powered content generation with optional Hacker News context enrichment, and the technical architecture for citation management and rate limiting.

## Background

The current editor lacks critical features like autosave, publish flow, and AI integration. The dashboard needs a unified experience for content management, and there's no system for enriching content with external context from Hacker News discussions.

## Overview

The solution consists of three interconnected systems:
1. **Dashboard & Authoring Experience** - Unified content management surface
2. **AI Content Generation** - OpenAI integration with optional HN context
3. **Hacker News Enrichment** - Automated context fetching and citation system

## 1. Dashboard & Authoring Experience

### 1.1 Dashboard Architecture

#### Surface Design
```
Dashboard Layout:
┌─────────────────────────────────────────┬─────────────────┐
│ Header (Logo, Search, Profile, Actions) │                 │
├─────────────────────────────────────────┤                 │
│ Reader/Writer Tabs                      │                 │
│ ┌─────────────────────────────────────┐ │                 │
│ │ Content Grid/List                    │ │ Side Panel      │
│ │ - Posts, Drafts, Analytics          │ │ - Preview       │
│ │ - Search/Filter                      │ │ - Quick Actions │
│ │ - Quick Actions                      │ │ - Status        │
│ └─────────────────────────────────────┘ │                 │
└─────────────────────────────────────────┴─────────────────┘
```

#### State Management
```typescript
// src/hooks/useDashboardState.ts
interface DashboardState {
  activeTab: 'reader' | 'writer'
  viewMode: 'grid' | 'list'
  selectedPost: Post | null
  searchQuery: string
  filters: {
    tags: string[]
    status: 'all' | 'published' | 'draft'
    dateRange: [Date, Date] | null
  }
}
```

### 1.2 Editor Experience

#### Top Bar Design
```typescript
// Editor top bar components:
// 1. Status indicator (saved/saving/error)
// 2. AI Assist button
// 3. Save button (manual)
// 4. Publish button (triggers sheet)
```

#### Autosave System
```typescript
// src/lib/autosave.ts
export class AutoSaver {
  private saveInterval = 3000 // 3 seconds
  private debounceTime = 1000
  private maxRetries = 3
  
  async save(content: EditorContent): Promise<SaveResult> {
    // 1. Validate content
    // 2. Check if changed
    // 3. Send to server
    // 4. Handle conflicts
    // 5. Update UI state
  }
}
```

#### Publish Sheet Flow
```typescript
// Publish workflow:
// 1. Validation (title, tags, content)
// 2. Preview generation
// 3. Metadata confirmation
// 4. Schedule options (if applicable)
// 5. One-click publish
```

### 1.3 Enhanced Features

#### Cover Upload System
```typescript
// Drag & drop with:
// - Multiple file formats (jpg, png, webp)
// - Auto-optimization and resizing
// - Progress indicators
// - Cloud storage integration (UploadThing)
```

#### Tag Picker
```typescript
// Features:
// - Type-ahead search
// - Create new tags inline
// - Popular tags suggestions
// - Visual tag management
```

## 2. AI Content Generation

### 2.1 Generation Pipeline

#### Input Processing
```typescript
// Generation options interface:
interface GenerationOptions {
  prompt: string
  tone: 'professional' | 'casual' | 'technical'
  length: 'short' | 'medium' | 'long'
  audience?: string
  includeHNContext: boolean
  hnContext?: HNContext
}
```

#### Model Integration
```typescript
// OpenAI API integration:
const modelConfig = {
  model: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 3000,
  timeout: 30000, // 30 seconds
}
```

#### Content Structuring
```typescript
// Expected markdown structure:
# [Compelling Title]

[Introduction with hook]

## Section 1
[Main content with examples]

## Section 2
[Additional insights]

## Conclusion
[Key takeaways]

[## Sources - if HN enabled]
```

### 2.2 Rate Limiting & Usage

#### Per-User Limits
```typescript
// Rate limits per user:
const limits = {
  freeUser: { perDay: 3, perHour: 5 },
  paidUser: { perDay: 50, perHour: 20 },
  anonymous: { total: 3, perHour: 1 }
}
```

#### Usage Tracking
```typescript
// Track:
// - Generation count per user
// - Tokens consumed
// - HN context usage
// - Quality metrics (publish rate)
```

## 3. Hacker News Enrichment System

### 3.1 Context Fetching Pipeline

#### Query Builder
```typescript
// src/lib/hn/queryBuilder.ts
export class HNQueryBuilder {
  buildQuery(prompt: string): string {
    // 1. Extract keywords using NLP
    // 2. Remove stop words
    // 3. Prioritize technical terms
    // 4. Add context modifiers
    return optimizedQuery
  }
}
```

#### API Integration
```typescript
// Hacker News Algolia API:
const hnAPI = {
  endpoint: 'https://hn.algolia.com/api/v1',
  appId: 'HYI9B2GI1O',
  apiKey: '39dd00ce238cbf8d556b3b4ae1c2d1ab',
  rateLimit: 1000 // requests per hour
}
```

#### Result Processing
```typescript
// Processing pipeline:
export class HNProcessor {
  processResults(raw: HNResult[]): ProcessedResult[] {
    return raw
      .filter(result => result.points >= 5) // Quality threshold
      .sort((a, b) => this.calculateScore(b) - this.calculateScore(a))
      .slice(0, 10) // Top 10 results
  }
  
  private calculateScore(result: HNResult): number {
    return result.points + (result.numComments * 0.5)
  }
}
```

### 3.2 Citation System

#### Inline Markers
```typescript
// Citation format in content:
"According to recent discussions [HN-1], many developers prefer..."

// Marker definition:
interface CitationMarker {
  id: string // HN-1, HN-2, etc.
  title: string
  url: string
  author: string
  points: number
  comments: number
  date: string
}
```

#### Sources Section Generation
```typescript
// Auto-generated sources section:
const generateSourcesSection = (citations: CitationMarker[]): string => {
  return `
## Sources

${citations.map(citation => 
  `[${citation.id}] ${citation.title} by ${citation.author} (${citation.points} points, ${citation.comments} comments). ${citation.url}`
).join('\n')}
  `
}
```

### 3.3 Caching Strategy

#### Cache Configuration
```typescript
// Redis caching:
const cacheConfig = {
  hnContext: { ttl: 300 }, // 5 minutes
  queryResults: { ttl: 600 }, // 10 minutes
  userGenerations: { ttl: 86400 } // 24 hours
}
```

#### Cache Invalidation
```typescript
// Invalidation triggers:
// - New HN posts (hourly)
// - User rate limit reset
// - Manual refresh by admin
```

## 4. Technical Architecture

### 4.1 Server Actions

#### Generation Action
```typescript
// app/actions/generatePost.ts
export async function generatePost(options: GenerationOptions): Promise<GenerationResult> {
  // 1. Rate limiting check
  // 2. Fetch HN context if enabled
  // 3. Call OpenAI API
  // 4. Process and cache results
  // 5. Return structured data
}
```

#### Autosave Action
```typescript
// app/actions/autosavePost.ts
export async function autosavePost(postId: string, content: EditorContent): Promise<AutosaveResult> {
  // 1. Validate content
  // 2. Check for conflicts
  // 3. Save to database
  // 4. Update cache
  // 5. Return status
}
```

### 4.2 Component Architecture

#### Editor Components
```
src/components/editor/
├── EditorContainer.tsx    # Main editor wrapper
├── EditorTopBar.tsx       # Status and actions
├── TipTapEditor.tsx       # Rich text editor
├── CoverUpload.tsx        # Image upload
├── TagSelector.tsx        # Tag management
├── PublishSheet.tsx       # Publish workflow
└── AISheet.tsx           # AI generation UI
```

#### Dashboard Components
```
src/components/dashboard/
├── DashboardContainer.tsx # Main dashboard
├── ReaderTab.tsx         # Content discovery
├── WriterTab.tsx         # Content management
├── PostCard.tsx          # Post display
├── QuickActions.tsx      # Action buttons
└── SearchBar.tsx         # Search interface
```

### 4.3 Data Flow

#### Generation Flow
```
User Input → Query Builder → HN API → Context Builder → OpenAI API → Content Processor → Editor
```

#### Autosave Flow
```
Editor Changes → Debounce → Validation → Server Action → Database → Status Update → UI Update
```

#### Publish Flow
```
Publish Click → Validation Sheet → Preview Generation → Confirmation → Server Action → Database Update → Redirect
```

## 5. Security & Performance

### 5.1 Security Measures

#### Input Validation
```typescript
// Validate all inputs:
// - Prompt length and content
// - File uploads (type, size)
// - Tag names and descriptions
// - URLs in citations
```

#### Rate Limiting
```typescript
// Multi-level rate limiting:
// - Per user (Redis)
// - Per IP (server)
// - Global (OpenAI API)
```

#### Content Sanitization
```typescript
// TipTap JSON validation
// HTML sanitization for citations
// XSS prevention in all content
```

### 5.2 Performance Optimizations

#### Database Optimizations
```typescript
// Indexes for common queries:
// - posts(published, publishedAt)
// - posts(author_id, published)
// - post_tags(tag_id)
// - comments(post_id, created_at)
```

#### Caching Strategy
```typescript
// Multi-level caching:
// - Redis for API responses
// - CDN for static assets
// - Browser cache for content
```

#### Lazy Loading
```typescript
// Component lazy loading
// Image lazy loading
// Code splitting for large components
```

## 6. Monitoring & Analytics

### 6.1 Metrics to Track

#### Generation Metrics
```typescript
interface GenerationMetrics {
  totalGenerations: number
  successRate: number
  averageGenerationTime: number
  hnContextUsage: number
  publishRate: number
  userSatisfactionScore: number
}
```

#### Performance Metrics
```typescript
interface PerformanceMetrics {
  editorLoadTime: number
  autosaveLatency: number
  publishSuccessRate: number
  cacheHitRate: number
  databaseQueryTime: number
}
```

### 6.2 Error Handling

#### Error Categories
```typescript
// Generation errors: API failures, rate limits, content validation
// Autosave errors: Network issues, conflicts, validation failures
// Publish errors: Validation failures, database errors, permission issues
```

#### Error Reporting
```typescript
// Structured error logging:
// - Error category and code
// - User context and session info
// - Stack traces for debugging
// - Impact assessment
```

## Implementation Plan

### Phase 1: Foundation (Week 1)
1. Dashboard component structure
2. Basic editor top bar
3. Autosave system implementation
4. Tag picker component

### Phase 2: AI Integration (Week 2)
1. OpenAI API integration
2. Generation pipeline
3. Rate limiting system
4. Basic content generation UI

### Phase 3: HN Enrichment (Week 3)
1. Hacker News API integration
2. Context fetching and processing
3. Citation system implementation
4. Sources section generation

### Phase 4: Polish & Testing (Week 4)
1. Publish sheet implementation
2. Error handling improvements
3. Performance optimization
4. Comprehensive testing

## Backwards Compatibility

- Existing editor content format maintained
- API endpoints remain stable
- Database schema changes are additive
- Component props remain compatible

## Testing Strategy

### Unit Tests
- All server actions
- Component rendering
- Utility functions
- Error handling

### Integration Tests
- API endpoints
- Database operations
- External API integrations
- Cache operations

### E2E Tests
- Complete editor workflow
- Publish flow
- AI generation with HN context
- Autosave functionality

## Conclusion

This RFC defines a comprehensive content editing and AI enrichment system that will significantly enhance the user experience. The modular architecture allows for incremental implementation and testing while maintaining security and performance standards.

Approval of this RFC will enable the systematic implementation of these features through the automated orchestrator.