/**
 * RSS Feed Generation
 * Creates RSS feed for blog posts
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
        visibility: 'PUBLIC',
      },
      orderBy: { publishedAt: 'desc' },
      take: 50,
      include: {
        author: {
          include: {
            profile: {
              select: {
                displayName: true,
                username: true,
              },
            },
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
    const siteName = 'AI Blog Platform'
    const siteDescription = 'AI-powered content creation platform for modern writers and creators'

    const buildDate = new Date().toUTCString()

    const feedItems = posts
      .map((post) => {
        const pubDate = new Date(post.publishedAt!).toUTCString()
        const authorName =
          post.author.profile?.displayName || post.author.profile?.username || 'Anonymous'
        const tags = post.tags.map((pt) => pt.tag.name).join(', ')

        return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/p/${post.slug}</link>
      <description><![CDATA[${post.excerpt || `Read ${post.title} on ${siteName}`.replace(/&/g, '&amp;')}]]></description>
      <author>${authorName}</author>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${siteUrl}/p/${post.slug}</guid>
      <category>${tags}</category>
      ${post.coverImage ? `<enclosure url="${siteUrl}${post.coverImage}" type="image/jpeg" />` : ''}
    </item>`
      })
      .join('')

    const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" 
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title><![CDATA[${siteName}]]></title>
    <description><![CDATA[${siteDescription}]]></description>
    <link>${siteUrl}</link>
    <language>en-us</language>
    <copyright><![CDATA[Copyright ${new Date().getFullYear()} ${siteName}. All rights reserved.]]></copyright>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <pubDate>${buildDate}</pubDate>
    <generator>${siteName} RSS Generator</generator>
    <docs>https://www.rssboard.org/rss-specification</docs>
    <ttl>60</ttl>
    <image>
      <url>${siteUrl}/og-image.png</url>
      <title>${siteName}</title>
      <link>${siteUrl}</link>
    </image>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${feedItems}
  </channel>
</rss>`

    return new Response(rssFeed, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    console.error('RSS Feed generation failed:', error)
    return new Response('Failed to generate RSS feed', { status: 500 })
  }
}

/**
 * JSON Feed for modern feed readers
 */
export async function GET_JSON() {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
        visibility: 'PUBLIC',
      },
      orderBy: { publishedAt: 'desc' },
      take: 50,
      include: {
        author: {
          include: {
            profile: {
              select: {
                displayName: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    })

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
    const siteName = 'AI Blog Platform'

    const jsonFeed = {
      version: 'https://jsonfeed.org/version/1.1',
      title: siteName,
      description: 'AI-powered content creation platform for modern writers and creators',
      home_page_url: siteUrl,
      feed_url: `${siteUrl}/feed.json`,
      language: 'en',
      items: posts.map((post) => ({
        id: `${siteUrl}/p/${post.slug}`,
        url: `${siteUrl}/p/${post.slug}`,
        title: post.title,
        summary: post.excerpt || `Read ${post.title} on ${siteName}`,
        content_html: post.contentHtml,
        date_published: post.publishedAt?.toISOString(),
        date_modified: post.updatedAt?.toISOString() || post.publishedAt?.toISOString(),
        authors: [
          {
            name: post.author.profile?.displayName || post.author.profile?.username || 'Anonymous',
            url: `${siteUrl}/u/${post.author.profile?.username}`,
            avatar: post.author.profile?.avatarUrl,
          },
        ],
        tags: post.tags.map((pt) => pt.tag.name),
        image: post.coverImage ? `${siteUrl}${post.coverImage}` : undefined,
      })),
    }

    return NextResponse.json(jsonFeed, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('JSON Feed generation failed:', error)
    return NextResponse.json({ error: 'Failed to generate feed' }, { status: 500 })
  }
}
