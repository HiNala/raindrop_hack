'use client'

import { useState, useEffect } from 'react'
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
  MessageCircle,
  Sparkles,
  Search,
  Filter,
  Grid,
  List,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PostCard } from '@/components/post/PostCard'
import { DashboardPostCard } from '@/components/dashboard/DashboardPostCard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ImportMarkdownDialog } from '@/components/dashboard/ImportMarkdownDialog'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'

// Mock data for development
const mockPosts = [
  {
    id: "1",
    title: "Getting Started with Next.js 15",
    slug: "getting-started-nextjs-15",
    excerpt: "A comprehensive guide to building modern web applications with Next.js 15, including the latest App Router features.",
    coverImage: null,
    publishedAt: new Date(),
    readTimeMin: 5,
    viewCount: 120,
    author: {
      profile: {
        username: "demo",
        displayName: "Demo User",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo"
      }
    },
    tags: [
      { tag: { name: "nextjs", slug: "nextjs" } },
      { tag: { name: "react", slug: "react" } }
    ],
    _count: { likes: 15, comments: 3 }
  },
  {
    id: "2",
    title: "TypeScript Best Practices in 2024",
    slug: "typescript-best-practices-2024",
    excerpt: "Learn the essential TypeScript patterns and practices that will make your code more maintainable and type-safe.",
    coverImage: null,
    publishedAt: new Date(),
    readTimeMin: 7,
    viewCount: 85,
    author: {
      profile: {
        username: "demo",
        displayName: "Demo User",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo"
      }
    },
    tags: [
      { tag: { name: "typescript", slug: "typescript" } },
      { tag: { name: "javascript", slug: "javascript" } }
    ],
    _count: { likes: 23, comments: 7 }
  },
  {
    id: "3",
    title: "Building Scalable React Applications",
    slug: "building-scalable-react-applications",
    excerpt: "Discover the architectural patterns and best practices for building React applications that can scale.",
    coverImage: null,
    publishedAt: new Date(),
    readTimeMin: 8,
    viewCount: 156,
    author: {
      profile: {
        username: "demo",
        displayName: "Demo User",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo"
      }
    },
    tags: [
      { tag: { name: "react", slug: "react" } },
      { tag: { name: "frontend", slug: "frontend" } }
    ],
    _count: { likes: 31, comments: 12 }
  }
]

const mockDrafts = [
  {
    id: "draft1",
    title: "My First Draft Post",
    slug: "my-first-draft-post",
    excerpt: "This is a work in progress that I'm excited to share...",
    coverImage: null,
    publishedAt: null,
    readTimeMin: 3,
    viewCount: 0,
    author: {
      profile: {
        username: "demo",
        displayName: "Demo User",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo"
      }
    },
    tags: [],
    _count: { likes: 0, comments: 0 }
  },
  {
    id: "draft2",
    title: "Understanding React Hooks",
    slug: "understanding-react-hooks",
    excerpt: "A deep dive into how React hooks work under the hood...",
    coverImage: null,
    publishedAt: null,
    readTimeMin: 6,
    viewCount: 0,
    author: {
      profile: {
        username: "demo",
        displayName: "Demo User",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo"
      }
    },
    tags: [
      { tag: { name: "react", slug: "react" } },
      { tag: { name: "hooks", slug: "hooks" } }
    ],
    _count: { likes: 0, comments: 0 }
  }
]

export function Dashboard() {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState("writer")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedPost, setSelectedPost] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")

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
      id: "trending", 
      title: "Trending", 
      description: "Popular posts this week",
      posts: mockPosts,
      icon: BarChart3 
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
      id: "published",
      title: "Published",
      description: "Your published posts",
      posts: mockPosts,
      icon: BookOpen,
      count: mockPosts.length
    },
    {
      id: "analytics",
      title: "Analytics",
      description: "Performance insights",
      posts: [],
      icon: BarChart3,
      count: 0
    }
  ]

  const totalViews = mockPosts.reduce((sum, post) => sum + post.viewCount, 0)
  const totalLikes = mockPosts.reduce((sum, post) => sum + post._count.likes, 0)
  const totalComments = mockPosts.reduce((sum, post) => sum + post._count.comments, 0)

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex">
      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto">
        {/* Header */}
        <div className="px-6 py-8 border-b border-[#27272a]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-teal-400" />
                Dashboard
              </h1>
              <p className="text-lg text-text-secondary">
                Create, manage, and discover great content
              </p>
            </div>
            
            <Avatar className="w-12 h-12 ring-2 ring-teal-500/30">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
                {user?.firstName?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Link href="/editor/new">
              <Button className="bg-teal-500 hover:bg-teal-600 text-white shadow-glow-teal hover:shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                New Draft
              </Button>
            </Link>
            <Link href="/editor/new?ai=true">
              <Button variant="outline" className="border-[#27272a] hover:bg-[#1a1a1d] hover:text-teal-400 text-text-primary">
                <Wand2 className="w-4 h-4 mr-2" />
                Start with AI
              </Button>
            </Link>
            <ImportMarkdownDialog />
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-6 mt-6 text-sm text-text-secondary">
            <div className="flex items-center gap-2 hover:text-teal-400 transition-colors">
              <Eye className="w-4 h-4" />
              <span>{totalViews.toLocaleString()} views</span>
            </div>
            <div className="flex items-center gap-2 hover:text-orange-400 transition-colors">
              <Heart className="w-4 h-4" />
              <span>{totalLikes} likes</span>
            </div>
            <div className="flex items-center gap-2 hover:text-text-primary transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>{totalComments} comments</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex">
          {/* Left Panel - Main Content */}
          <div className="flex-1 px-6 py-6">
            {/* Search and Filter */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#1a1a1d] border-[#27272a] focus:border-teal-500"
                />
              </div>
              
              {activeTab === "writer" && (
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={viewMode === "grid" ? "bg-teal-500 text-white" : "border-[#27272a] text-text-primary"}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={viewMode === "list" ? "bg-teal-500 text-white" : "border-[#27272a] text-text-primary"}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Reader/Writer Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 h-12 bg-[#1a1a1d] border border-[#27272a] p-1">
                <TabsTrigger 
                  value="reader" 
                  className="data-[state=active]:bg-[#0a0a0b] data-[state=active]:text-teal-400 data-[state=active]:shadow-glow-teal transition-all duration-200 text-text-secondary"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Reader
                </TabsTrigger>
                <TabsTrigger 
                  value="writer" 
                  className="data-[state=active]:bg-[#0a0a0b] data-[state=active]:text-orange-400 data-[state=active]:shadow-glow-orange transition-all duration-200 text-text-secondary"
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
                          <section.icon className="w-5 h-5 text-teal-400" />
                          <h2 className="text-xl font-semibold text-text-primary">
                            {section.title}
                          </h2>
                          {section.posts.length > 0 && (
                            <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/30 text-xs">
                              {section.posts.length}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-text-secondary">
                          {section.description}
                        </p>
                      </div>
                    </div>

                    {section.posts.length === 0 ? (
                      <Card className="p-12 text-center glass-effect border-[#27272a]">
                        <div className="max-w-md mx-auto">
                          <section.icon className="w-12 h-12 text-text-muted mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-text-primary mb-2">
                            No posts yet
                          </h3>
                          <p className="text-text-secondary mb-4">
                            {section.id === 'foryou' && "Start following authors and tags to see personalized content"}
                            {section.id === 'following' && "Follow authors and tags to see their latest posts here"}
                            {section.id === 'trending' && "Popular posts will appear here as they gain traction"}
                          </p>
                          {section.id === 'foryou' && (
                            <Link href="/tags">
                              <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                                Discover Topics
                              </Button>
                            </Link>
                          )}
                        </div>
                      </Card>
                    ) : (
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {section.posts.map((post) => (
                          <div 
                            key={post.id} 
                            className="cursor-pointer"
                            onClick={() => setSelectedPost(post)}
                          >
                            <PostCard post={post} />
                          </div>
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
                          <section.icon className="w-5 h-5 text-orange-400" />
                          <h2 className="text-xl font-semibold text-text-primary">
                            {section.title}
                          </h2>
                          <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/30 text-xs">
                            {section.count}
                          </Badge>
                        </div>
                        <p className="text-sm text-text-secondary">
                          {section.description}
                        </p>
                      </div>
                      
                      {section.id === 'drafts' && section.count > 0 && (
                        <Button size="sm" variant="outline" className="border-[#27272a] hover:bg-[#1a1a1d] text-text-primary">
                          View All
                        </Button>
                      )}
                    </div>

                    {section.posts.length === 0 ? (
                      <Card className="p-12 text-center glass-effect border-[#27272a]">
                        <div className="max-w-md mx-auto">
                          <section.icon className="w-12 h-12 text-text-muted mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-text-primary mb-2">
                            No {section.title.toLowerCase()}
                          </h3>
                          <p className="text-text-secondary mb-4">
                            {section.id === 'drafts' && "Start writing your first draft and it will appear here"}
                            {section.id === 'published' && "Your published posts will appear here for easy access"}
                            {section.id === 'analytics' && "Publish some posts to see analytics and insights"}
                          </p>
                          {section.id === 'drafts' && (
                            <Link href="/editor/new">
                              <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                                <Plus className="w-4 h-4 mr-2" />
                                Create Draft
                              </Button>
                            </Link>
                          )}
                        </div>
                      </Card>
                    ) : (
                      <div className={viewMode === "grid" ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
                        {section.posts.map((post) => (
                          <div 
                            key={post.id} 
                            className="cursor-pointer"
                            onClick={() => setSelectedPost(post)}
                          >
                            {viewMode === "grid" ? (
                              <DashboardPostCard post={post} />
                            ) : (
                              <DashboardPostCard post={post} />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Panel - Post Preview */}
          <div className="w-96 border-l border-[#27272a] p-6 hidden lg:block">
            {selectedPost ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-text-primary">Preview</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPost(null)}
                    className="text-text-secondary hover:text-text-primary"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>

                <Card className="glass-effect border-[#27272a] overflow-hidden">
                  {selectedPost.coverImage && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={selectedPost.coverImage}
                        alt={selectedPost.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={`${
                        selectedPost.published 
                          ? 'bg-teal-500/10 text-teal-400 border-teal-500/30'
                          : 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                      }`}>
                        {selectedPost.published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>

                    <h4 className="text-xl font-bold text-text-primary mb-3 line-clamp-2">
                      {selectedPost.title}
                    </h4>

                    {selectedPost.excerpt && (
                      <p className="text-text-secondary text-sm mb-4 line-clamp-3">
                        {selectedPost.excerpt}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-text-secondary mb-4">
                      <span>{selectedPost.readTimeMin} min read</span>
                      {selectedPost.published && (
                        <>
                          <span>•</span>
                          <span>{selectedPost.viewCount} views</span>
                          <span>•</span>
                          <span>{selectedPost._count.likes} likes</span>
                        </>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Link href={selectedPost.published ? `/p/${selectedPost.slug}` : `/editor/${selectedPost.id}`}>
                        <Button size="sm" className="flex-1 bg-teal-500 hover:bg-teal-600 text-white">
                          {selectedPost.published ? 'View' : 'Edit'}
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="border-[#27272a] text-text-primary">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-[#1a1a1d] rounded-full flex items-center justify-center mb-4">
                  <Eye className="w-8 h-8 text-text-muted" />
                </div>
                <h3 className="text-lg font-medium text-text-primary mb-2">No Preview</h3>
                <p className="text-sm text-text-secondary mb-4">
                  Select a post to see its preview and quick actions
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}