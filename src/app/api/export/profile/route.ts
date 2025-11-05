import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const user = await requireUser()

    // Fetch user profile and stats
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    })

    const postCount = await prisma.post.count({
      where: { authorId: user.id, published: true },
    })

    const totalLikes = await prisma.like.count({
      where: { post: { authorId: user.id } },
    })

    const totalComments = await prisma.comment.count({
      where: { post: { authorId: user.id } },
    })

    // Format the data
    const exportData = {
      exportDate: new Date().toISOString(),
      user: {
        id: user.id,
        clerkId: user.clerkId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      profile: profile
        ? {
            username: profile.username,
            displayName: profile.displayName,
            bio: profile.bio,
            avatarUrl: profile.avatarUrl,
            websiteUrl: profile.websiteUrl,
            twitterHandle: profile.twitterHandle,
            githubUsername: profile.githubUsername,
            location: profile.location,
          }
        : null,
      stats: {
        totalPublishedPosts: postCount,
        totalLikesReceived: totalLikes,
        totalCommentsReceived: totalComments,
      },
    }

    // Return as JSON download
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="profile-export-${new Date().toISOString().split('T')[0]}.json"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 })
  }
}

