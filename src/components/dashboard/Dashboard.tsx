'use client'

import { useState } from 'react'
import { 
  BookOpen, 
  PenTool, 
  Plus, 
  Wand2, 
  FileText,
  Clock,
  BarChart3,
  TrendingUp,
  Bookmark,
  Eye,
  Heart,
  MessageCircle
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { PostCard } from '@/components/post/PostCard'

// Mock data for development
const mockPosts = [
  {
    id: "1",
    title: "Welcome to the Blog",
    slug: "welcome-to-the-blog",
    excerpt: "This is a sample post for frontend development.",
    coverImage: null,
    publishedAt: new Date(),
    readTimeMin: 5,
    viewCount: 120,
    author: {
      profile: {
        username: "demo_user",
        displayName: "Demo User",
        avatarUrl: null
      }
    },
    tags: [{ tag: { name: "demo", slug: "demo" } }],
    _count: { likes: 15, comments: 3 }
  },
  {
    id: "2",
    title: "Getting Started with Modern Web Development",
    slug: "getting-started-with-modern-web-development",
    excerpt: "A comprehensive guide to modern web development tools and practices.",
    coverImage: null,
    publishedAt: new Date(),
    readTimeMin: 8,
    viewCount: 250,
    author: {
      profile: {
        username: "tech_writer",
        displayName: "Tech Writer",
        avatarUrl: null
      }
    },
    tags: [{ tag: { name: "webdev", slug: "webdev" } }],
    _count: { likes: 32, comments: 8 }
  }
]

const mockDrafts = [
  {
    id: "draft1",
    title: "My First Draft",
    slug: "my-first-draft",
    excerpt: "This is a work in progress...",
    coverImage: null,
    publishedAt: null,
    readTimeMin: 3,
    viewCount: 0,
    author: {
      profile: {
        username: "demo_user",
        displayName: "Demo User",
        avatarUrl: null
      }
    },
    tags: [],
    _count: { likes: 0, comments: 0 }
  }
]

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("reader")
  const [selectedPost, setSelectedPost] = useState<any>(null)

  const readerSections = [
    { 
      id: "foryou", 
      title: "For you", 
      description: "Personalized based on your interests",
      posts: mockPosts,
      icon: TrendingUp 
    },
    { 
      id: "following", 
      title: "Following", 
      description: "From authors and tags you follow",
      posts: mockPosts.slice(0, 1),
      icon: Bookmark 
    },
    { 
      id: "saved", 
      title: "Saved", 
      description: "Posts you've saved for later",
      posts: [],
      icon: Bookmark 
    }
  ]

  const writerSections = [
    {
      id: "drafts",
      title: "Drafts",
      description: "Works in progress",
      posts: mockDrafts,
      icon: FileText,
      count: mockDrafts.length
    },
    {
      id: "scheduled",
      title: "Scheduled",
      description: "Posts scheduled to publish",
      posts: [],
      icon: Clock,
      count: 0
    },
    {
      id: "published",
      title: "Published",
      description: "Your published posts",
      posts: mockPosts,
      icon: BookOpen,
      count: mockPosts.length
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your content and discover great stories
          </p>
        </div>

        {/* Quick Actions Bar */}
        <Card className="mb-8 p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3">
              <Button
                className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white"
                onClick={() => window.location.href = '/editor/new'}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Draft
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/editor/new?ai=true'}
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Start with AI
              </Button>
              <Button variant="outline" disabled>
                <FileText className="w-4 h-4 mr-2" />
                Import Markdown
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>1.2k views</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>47 likes</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>11 comments</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-12 bg-gray-100 dark:bg-gray-800 p-1">
            <TabsTrigger 
              value="reader" 
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm transition-all duration-200"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Reader
            </TabsTrigger>
            <TabsTrigger 
              value="writer" 
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm transition-all duration-200"
            >
              <PenTool className="w-4 h-4 mr-2" />
              Writer
            </TabsTrigger>
          </TabsList>

          {/* Reader Tab */}
          <TabsContent value="reader" className="space-y-8">
            {readerSections.map((section) => (
              <div key={section.id}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <section.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {section.title}
                      </h2>
                      {section.posts.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {section.posts.length}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {section.description}
                    </p>
                  </div>
                </div>

                {section.posts.length === 0 ? (
                  <Card className="p-12 text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <div className="max-w-md mx-auto">
                      <section.icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No posts yet
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {section.id === 'foryou' && "Start following authors and tags to see personalized content"}
                        {section.id === 'following' && "Follow authors and tags to see their latest posts here"}
                        {section.id === 'saved' && "Save posts you want to read later and they'll appear here"}
                      </p>
                      {section.id === 'foryou' && (
                        <Button onClick={() => window.location.href = '/categories'}>
                          Discover Topics
                        </Button>
                      )}
                    </div>
                  </Card>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {section.posts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </TabsContent>

          {/* Writer Tab */}
          <TabsContent value="writer" className="space-y-8">
            {writerSections.map((section) => (
              <div key={section.id}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <section.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {section.title}
                      </h2>
                      <Badge variant="secondary" className="text-xs">
                        {section.count}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {section.description}
                    </p>
                  </div>
                  {section.id === 'drafts' && section.count > 0 && (
                    <Button size="sm" variant="outline">
                      View All
                    </Button>
                  )}
                </div>

                {section.posts.length === 0 ? (
                  <Card className="p-12 text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <div className="max-w-md mx-auto">
                      <section.icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No {section.title.toLowerCase()}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {section.id === 'drafts' && "Start writing your first draft and it will appear here"}
                        {section.id === 'scheduled' && "Schedule posts to publish automatically at specific times"}
                        {section.id === 'published' && "Your published posts will appear here for easy access"}
                      </p>
                      {section.id === 'drafts' && (
                        <Button onClick={() => window.location.href = '/editor/new'}>
                          <Plus className="w-4 h-4 mr-2" />
                          Create Draft
                        </Button>
                      )}
                    </div>
                  </Card>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {section.posts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}