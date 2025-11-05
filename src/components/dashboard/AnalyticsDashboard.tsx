'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  Clock,
  Calendar,
  Users,
  Target,
  Award,
  Zap,
  Activity,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { NumberCounter } from '@/components/animations/NumberCounter'

// Mock analytics data
const mockAnalytics = {
  overview: {
    totalViews: 12547,
    totalReads: 8923,
    totalLikes: 345,
    totalComments: 78,
    avgReadTime: 4.2,
    topDay: '2024-01-15',
    topDayViews: 234,
  },
  posts: [
    {
      id: '1',
      title: 'Getting Started with Next.js 15',
      slug: 'getting-started-nextjs-15',
      publishedAt: '2024-01-10',
      views: 3200,
      reads: 2400,
      likes: 156,
      comments: 23,
      readTime: 5,
      avgReadTime: 4.8,
      viewTrend: 'up',
      viewChange: 12.5,
      readTrend: 'up',
      readChange: 8.3,
      dailyViews: [
        { date: '2024-01-10', views: 45 },
        { date: '2024-01-11', views: 67 },
        { date: '2024-01-12', views: 89 },
        { date: '2024-01-13', views: 123 },
        { date: '2024-01-14', views: 156 },
        { date: '2024-01-15', views: 234 },
        { date: '2024-01-16', views: 198 },
      ],
    },
    {
      id: '2',
      title: 'TypeScript Best Practices in 2024',
      slug: 'typescript-best-practices-2024',
      publishedAt: '2024-01-08',
      views: 2800,
      reads: 2100,
      likes: 134,
      comments: 31,
      readTime: 7,
      avgReadTime: 6.2,
      viewTrend: 'up',
      viewChange: 5.2,
      readTrend: 'down',
      readChange: -2.1,
      dailyViews: [
        { date: '2024-01-08', views: 78 },
        { date: '2024-01-09', views: 92 },
        { date: '2024-01-10', views: 145 },
        { date: '2024-01-11', views: 167 },
        { date: '2024-01-12', views: 189 },
        { date: '2024-01-13', views: 201 },
        { date: '2024-01-14', views: 178 },
      ],
    },
    {
      id: '3',
      title: 'Building Scalable React Applications',
      slug: 'building-scalable-react-applications',
      publishedAt: '2024-01-05',
      views: 2100,
      reads: 1650,
      likes: 98,
      comments: 15,
      readTime: 8,
      avgReadTime: 7.5,
      viewTrend: 'up',
      viewChange: 15.8,
      readTrend: 'up',
      readChange: 11.2,
      dailyViews: [
        { date: '2024-01-05', views: 34 },
        { date: '2024-01-06', views: 56 },
        { date: '2024-01-07', views: 78 },
        { date: '2024-01-08', views: 89 },
        { date: '2024-01-09', views: 112 },
        { date: '2024-01-10', views: 134 },
        { date: '2024-01-11', views: 123 },
      ],
    },
  ],
  recentActivity: [
    { type: 'view', post: 'Getting Started with Next.js 15', timestamp: '2 minutes ago', count: 3 },
    { type: 'like', post: 'TypeScript Best Practices in 2024', timestamp: '5 minutes ago', count: 1 },
    { type: 'comment', post: 'Building Scalable React Applications', timestamp: '12 minutes ago', count: 1 },
    { type: 'view', post: 'Getting Started with Next.js 15', timestamp: '18 minutes ago', count: 7 },
  ],
}

interface MiniChartProps {
  data: { date: string; views: number }[]
  className?: string
}

function MiniChart({ data, className }: MiniChartProps) {
  const maxValue = Math.max(...data.map(d => d.views))
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = ((maxValue - d.views) / maxValue) * 100
    return `${x},${y}`
  }).join(' ')

  return (
    <svg viewBox="0 0 100 100" className={`w-full h-16 ${className}`}>
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        points={points}
        className="text-teal-400"
      />
      <polyline
        fill="url(#gradient)"
        stroke="none"
        points={`0,100 ${points} 100,100`}
        className="opacity-20"
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function AnalyticsDashboard() {
  const [selectedPost, setSelectedPost] = useState(mockAnalytics.posts[0])
  const [timeRange, setTimeRange] = useState('7d')

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 glass-effect border-[#27272a] hover:border-teal-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <Eye className="w-8 h-8 text-teal-400" />
              <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/30">
                +12%
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-text-secondary">Total Views</p>
              <NumberCounter
                value={mockAnalytics.overview.totalViews}
                className="text-2xl font-bold text-text-primary"
              />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 glass-effect border-[#27272a] hover:border-orange-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-orange-400" />
              <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/30">
                +8%
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-text-secondary">Total Reads</p>
              <NumberCounter
                value={mockAnalytics.overview.totalReads}
                className="text-2xl font-bold text-text-primary"
              />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 glass-effect border-[#27272a] hover:border-red-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <Heart className="w-8 h-8 text-red-400" />
              <Badge className="bg-red-500/10 text-red-400 border-red-500/30">
                +15%
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-text-secondary">Total Likes</p>
              <NumberCounter
                value={mockAnalytics.overview.totalLikes}
                className="text-2xl font-bold text-text-primary"
              />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 glass-effect border-[#27272a] hover:border-blue-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <MessageCircle className="w-8 h-8 text-blue-400" />
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                +22%
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-text-secondary">Total Comments</p>
              <NumberCounter
                value={mockAnalytics.overview.totalComments}
                className="text-2xl font-bold text-text-primary"
              />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Top Performing Post */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6 glass-effect border-[#27272a]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-bold text-text-primary">Top Performing Post</h2>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 bg-[#1a1a1d] border-[#27272a]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {mockAnalytics.posts[0].title}
              </h3>
              <div className="flex items-center gap-6 text-sm text-text-secondary mb-4">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{mockAnalytics.posts[0].views.toLocaleString()} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  <span>{mockAnalytics.posts[0].reads.toLocaleString()} reads</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span>{mockAnalytics.posts[0].likes} likes</span>
                </div>
              </div>
            </div>
            <div className="w-32">
              <MiniChart data={mockAnalytics.posts[0].dailyViews} />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Post Performance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6 glass-effect border-[#27272a]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text-primary">Post Performance</h2>
            <Button variant="outline" className="border-[#27272a] hover:bg-[#1a1a1d] text-text-primary">
              Export Report
            </Button>
          </div>

          <div className="space-y-4">
            {mockAnalytics.posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between p-4 rounded-lg bg-[#1a1a1d] border border-[#27272a] hover:border-teal-500/30 transition-all cursor-pointer"
                onClick={() => setSelectedPost(post)}
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-text-primary mb-1 truncate">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-text-secondary">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {post.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      {post.reads.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center gap-2">
                    {post.viewTrend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                    <span className={`text-sm font-medium ${
                      post.viewTrend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {post.viewChange > 0 ? '+' : ''}{post.viewChange}%
                    </span>
                  </div>

                  <div className="w-24">
                    <MiniChart data={post.dailyViews} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="p-6 glass-effect border-[#27272a]">
          <h2 className="text-xl font-bold text-text-primary mb-6">Recent Activity</h2>

          <div className="space-y-4">
            <AnimatePresence>
              {mockAnalytics.recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-[#1a1a1d] border border-[#27272a]"
                >
                  <div className={`p-2 rounded-full ${
                    activity.type === 'view' ? 'bg-teal-500/10' :
                      activity.type === 'like' ? 'bg-red-500/10' : 'bg-blue-500/10'
                  }`}>
                    {activity.type === 'view' && <Eye className="w-4 h-4 text-teal-400" />}
                    {activity.type === 'like' && <Heart className="w-4 h-4 text-red-400" />}
                    {activity.type === 'comment' && <MessageCircle className="w-4 h-4 text-blue-400" />}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-text-primary">
                      {activity.count} {activity.type}{activity.count > 1 ? 's' : ''} on{' '}
                      <span className="font-medium">"{activity.post}"</span>
                    </p>
                    <p className="text-xs text-text-tertiary">{activity.timestamp}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
