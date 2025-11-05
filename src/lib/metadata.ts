/**
 * Enhanced Metadata Configuration
 * Centralized SEO and social media optimization
 */

import { Metadata } from 'next'

const siteConfig = {
  name: 'AI Blog Platform',
  description: 'AI-powered content creation platform for modern writers and creators',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com',
  ogImage: '/og-image.png',
  links: {
    twitter: 'https://twitter.com/yourhandle',
    github: 'https://github.com/yourrepo',
    linkedin: 'https://linkedin.com/company/yourcompany',
  },
  author: {
    name: 'Your Company',
    email: 'contact@yourdomain.com',
  },
}

interface SEOOptions {
  title?: string
  description?: string
  image?: string
  noIndex?: boolean
  canonical?: string
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  keywords?: string[]
  locale?: string
  type?: 'website' | 'article'
}

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  noIndex = false,
  canonical,
  publishedTime,
  modifiedTime,
  authors,
  keywords = [],
  locale = 'en_US',
  type = 'website',
}: SEOOptions = {}): Metadata {
  const fullTitle = title === siteConfig.name ? title : `${title} | ${siteConfig.name}`
  const imageUrl = image.startsWith('http') ? image : `${siteConfig.url}${image}`

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors,
    creator: siteConfig.author.name,
    publisher: siteConfig.author.name,
    robots: noIndex ? 'noindex,nofollow' : 'index,follow',
    canonical: canonical || `${siteConfig.url}${canonical}`,
    alternates: {
      canonical: canonical || `${siteConfig.url}${canonical}`,
    },

    // Open Graph
    openGraph: {
      type,
      title: fullTitle,
      description,
      url: canonical || siteConfig.url,
      siteName: siteConfig.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        },
      ],
      locale,
      publishedTime,
      modifiedTime,
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
      creator: siteConfig.links.twitter?.replace('https://twitter.com/', '@'),
      site: siteConfig.links.twitter?.replace('https://twitter.com/', '@'),
    },

    // App Indexing
    appleWebApp: {
      capable: true,
      title: siteConfig.name,
      statusBarStyle: 'default',
    },

    // Verification
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      bing: process.env.BING_VERIFICATION,
    },

    // App metadata
    applicationName: siteConfig.name,
    referrer: 'origin-when-cross-origin',

    // Icons
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },

    // Manifest
    manifest: '/site.webmanifest',

    // Additional meta tags
    other: {
      'theme-color': '#14b8a6',
      'msapplication-TileColor': '#14b8a6',
      'format-detection': 'telephone=no',
    },
  }
}

/**
 * Generate metadata for blog posts
 */
export function generatePostMetadata({
  title,
  excerpt,
  slug,
  author,
  coverImage,
  publishedAt,
  updatedAt,
  tags = [],
}: {
  title: string
  excerpt: string
  slug: string
  author: string
  coverImage?: string
  publishedAt: string
  updatedAt?: string
  tags?: string[]
}) {
  return constructMetadata({
    title,
    description: excerpt,
    image: coverImage || `/api/og?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`,
    canonical: `/p/${slug}`,
    publishedTime: publishedAt,
    modifiedTime: updatedAt,
    keywords: tags,
    type: 'article',
  })
}

/**
 * Generate metadata for tag/category pages
 */
export function generateTagMetadata({
  name,
  description,
  slug,
}: {
  name: string
  description: string
  slug: string
}) {
  return constructMetadata({
    title: `${name} Posts`,
    description: `Browse all ${name.toLowerCase()} articles on our platform. ${description}`,
    canonical: `/tag/${slug}`,
    keywords: [name, 'blog', 'articles', 'posts'],
  })
}

/**
 * Generate metadata for author profiles
 */
export function generateAuthorMetadata({
  name,
  username,
  bio,
}: {
  name: string
  username: string
  bio: string
}) {
  return constructMetadata({
    title: `${name} - Author Profile`,
    description: bio,
    canonical: `/u/${username}`,
    keywords: [name, username, 'author', 'writer', 'blogger'],
  })
}

/**
 * Default metadata for different page types
 */
export const defaultMetadata = {
  home: constructMetadata({
    title: siteConfig.name,
    description: siteConfig.description,
    keywords: [
      'AI writing',
      'content creation',
      'blog platform',
      'AI assistant',
      'content generation',
      'blogging',
      'writer tools',
    ],
  }),

  pricing: constructMetadata({
    title: 'Pricing',
    description: 'Simple, transparent pricing for creators and teams. Choose the plan that\'s right for you.',
    canonical: '/pricing',
    keywords: ['pricing', 'plans', 'cost', 'subscription', 'free trial'],
  }),

  about: constructMetadata({
    title: 'About Us',
    description: 'Learn about our mission to empower creators with AI-powered writing tools.',
    canonical: '/about',
    keywords: ['about', 'team', 'mission', 'company', 'story'],
  }),

  features: constructMetadata({
    title: 'Features',
    description: 'Discover powerful features for modern content creators.',
    canonical: '/features',
    keywords: ['features', 'tools', 'AI writing', 'editor', 'analytics'],
  }),

  terms: constructMetadata({
    title: 'Terms of Service',
    description: 'Read our terms of service to understand your rights and responsibilities.',
    canonical: '/terms',
    noIndex: true,
  }),

  privacy: constructMetadata({
    title: 'Privacy Policy',
    description: 'Learn how we collect, use, and protect your personal information.',
    canonical: '/privacy',
    noIndex: true,
  }),

  signIn: constructMetadata({
    title: 'Sign In',
    description: 'Sign in to your account to continue creating amazing content.',
    canonical: '/sign-in',
    noIndex: true,
  }),

  signUp: constructMetadata({
    title: 'Sign Up',
    description: 'Create your free account and start writing with AI assistance.',
    canonical: '/sign-up',
    keywords: ['sign up', 'register', 'create account', 'free trial'],
  }),
}

export default siteConfig
