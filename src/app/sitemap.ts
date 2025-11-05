import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  // Get all published posts
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      publishedAt: {
        not: null,
      },
    },
    select: {
      slug: true,
      updatedAt: true,
      publishedAt: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
  })

  // Get all tags
  const tags = await prisma.tag.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  // Get all users with profiles
  const users = await prisma.profile.findMany({
    select: {
      username: true,
      updatedAt: true,
    },
  })

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  // Post routes
  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/p/${post.slug}`,
    lastModified: post.updatedAt || post.publishedAt || new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  // Tag routes
  const tagRoutes: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${baseUrl}/tag/${tag.slug}`,
    lastModified: tag.updatedAt || new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // User profile routes
  const userRoutes: MetadataRoute.Sitemap = users.map((user) => ({
    url: `${baseUrl}/u/${user.username}`,
    lastModified: user.updatedAt || new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...postRoutes, ...tagRoutes, ...userRoutes]
}
