import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PostCard } from '@/components/post/PostCard'
import { Edit, MapPin, Link as LinkIcon, Calendar } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

async function getProfile(username: string) {
  const profile = await prisma.profile.findUnique({
    where: { username },
    include: {
      user: {
        include: {
          posts: {
            where: { published: true },
            include: {
              tags: {
                include: {
                  tag: true,
                },
              },
              _count: {
                select: {
                  likes: true,
                  comments: true,
                },
              },
            },
            orderBy: {
              publishedAt: 'desc',
            },
          },
        },
      },
    },
  })

  if (!profile) return null

  const totalViews = await prisma.post.aggregate({
    where: {
      authorId: profile.userId,
      published: true,
    },
    _sum: {
      viewCount: true,
    },
  })

  return { ...profile, totalViews: totalViews._sum.viewCount || 0 }
}

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const profile = await getProfile(params.username)

  if (!profile) {
    return { title: 'User Not Found' }
  }

  return {
    title: `${profile.displayName} (@${profile.username})`,
    description: profile.bio || `Check out ${profile.displayName}'s posts`,
  }
}

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const profile = await getProfile(params.username)
  const currentUser = await getCurrentUser()

  if (!profile) {
    notFound()
  }

  const isOwnProfile = currentUser?.id === profile.userId
  const posts = profile.user.posts

  // Parse social links
  const socialLinks = profile.socialLinks as any || {}

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 h-48" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-12">
        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-32 w-32 border-4 border-white dark:border-gray-900">
              <AvatarImage src={profile.avatarUrl || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-4xl">
                {profile.displayName.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {profile.displayName}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    @{profile.username}
                  </p>
                </div>

                {isOwnProfile && (
                  <Link href="/settings/profile">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                )}
              </div>

              {profile.bio && (
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {profile.bio}
                </p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                {profile.websiteUrl && (
                  <a
                    href={profile.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-purple-600 transition-colors"
                  >
                    <LinkIcon className="w-4 h-4" />
                    Website
                  </a>
                )}
                
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {format(new Date(profile.createdAt), 'MMM yyyy')}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {posts.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {profile.totalViews.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {posts.reduce((sum, p) => sum + (p._count?.likes || 0), 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Likes</div>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Published Posts
          </h2>

          {posts.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl">
              <p className="text-gray-600 dark:text-gray-400">
                {isOwnProfile ? "You haven't published any posts yet" : 'No posts yet'}
              </p>
              {isOwnProfile && (
                <Link href="/editor/new" className="mt-4 inline-block">
                  <Button>Write Your First Post</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={{
                    ...post,
                    author: {
                      profile: {
                        username: profile.username,
                        displayName: profile.displayName,
                        avatarUrl: profile.avatarUrl,
                      },
                    },
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

