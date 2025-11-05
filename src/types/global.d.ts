// Global type definitions for the Raindrop blog application
declare global {
  namespace App {
    interface Window {
      // Performance monitoring
      __PERFORMANCE_METRICS__?: {
        loadTime: number
        firstContentfulPaint: number
        largestContentfulPaint: number
        firstInputDelay: number
        cumulativeLayoutShift: number
      }
      
      // PWA install prompt
      beforeinstallprompt?: BeforeInstallPromptEvent
      
      // Service Worker
      serviceWorker?: ServiceWorkerContainer
    }
  }
}

// PWA Install Prompt Event
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

// Enhanced User Profile types
interface UserProfile {
  id: string
  username: string
  displayName: string
  avatarUrl?: string | null
  bio?: string | null
  website?: string | null
  location?: string | null
  createdAt: Date
  updatedAt: Date
}

// Post type enhancements
interface PostWithRelations {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  content: string
  contentJson?: any
  coverImage?: string | null
  publishedAt: Date | null
  readTimeMin?: number | null
  viewCount?: number
  createdAt: Date
  updatedAt: Date
  author: {
    profile: UserProfile | null
  }
  tags?: Array<{
    tag: {
      id: string
      name: string
      slug: string
    }
  }>
  _count?: {
    likes: number
    comments: number
    views: number
  }
}

// Server Action Response Types
interface ServerActionResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  errors?: Record<string, string[]>
}

// API Response Types
interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  status?: number
}

// Search and Filter Types
interface SearchParams {
  q?: string
  tag?: string
  author?: string
  sort?: 'newest' | 'oldest' | 'popular' | 'trending'
  limit?: number
  offset?: number
}

// Component Props Types
interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

// Animation Types
interface AnimationProps {
  initial?: any
  animate?: any
  exit?: any
  transition?: any
  variants?: any
}

// Form Types
interface FormFieldProps {
  name: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  helperText?: string
}

// Dashboard Analytics Types
interface DashboardStats {
  totalPosts: number
  totalViews: number
  totalLikes: number
  totalComments: number
  recentViews: number[]
  engagementRate: number
}

// Editor Types
interface EditorState {
  title: string
  content: any
  excerpt?: string
  coverImage?: string | null
  tags: Array<{ id: string; name: string; slug: string }>
  isDirty: boolean
  lastSaved?: Date
  publishStatus: 'draft' | 'published' | 'scheduled'
}

// Notification Types
interface Notification {
  id: string
  userId: string
  type: 'like' | 'comment' | 'follow' | 'mention' | 'system'
  title: string
  message: string
  read: boolean
  createdAt: Date
  data?: any
}

// Theme Types
interface ThemeConfig {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
  }
  typography: {
    fontFamily: string
    fontSize: Record<string, string>
    lineHeight: Record<string, string>
  }
  spacing: Record<string, string>
}

// Mobile Device Types
interface MobileDevice {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  screenWidth: number
  screenHeight: number
  orientation: 'portrait' | 'landscape'
}

// Error Types
interface AppError {
  code: string
  message: string
  details?: any
  stack?: string
  timestamp: Date
}

// Utility Types
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// Export for use throughout the app
export type {
  BeforeInstallPromptEvent,
  UserProfile,
  PostWithRelations,
  ServerActionResponse,
  APIResponse,
  SearchParams,
  BaseComponentProps,
  AnimationProps,
  FormFieldProps,
  DashboardStats,
  EditorState,
  Notification,
  ThemeConfig,
  MobileDevice,
  AppError,
  Optional,
  RequiredFields,
}

// Default exports
export {}