'use client'

import { useState, useEffect } from 'react'
import {
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Users,
  Clock,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  ExternalLink,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { format, subDays } from 'date-fns'

interface AnalyticsData {
  views: number
  reads: number
  likes: number
  comments: number
  shares: number
  followers: number
  readTime: number
  subscribers: number
  viewsByDay: { date: string; views: number; reads: number }[]
  topPosts: Array<{
    id: string
    title: string
    views: number
    reads: number
    likes: number
    comments: number
    readRate: number
  }>
  trafficSources: Array<{
    source: string
    visits: number
    percentage: number
  }>
  devices: Array<{
    device: string
    visits: number
    percentage: number
  }>
}

interface AnalyticsPanelProps {
  authorId: string
  timeRange?: '7d' | '30d' | '90d'
  compact?: boolean
}

export function AnalyticsPanel({ authorId, timeRange = '30d', compact = false }: AnalyticsPanelProps) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange)

  // Mock data generation
  useEffect(() => {
    const generateMockData = (): AnalyticsData => {
      const days = selectedTimeRange === '7d' ? 7 : selectedTimeRange === '30d' ? 30 : 90
      const baseViews = selectedTimeRange === '7d' ? 100 : selectedTimeRange === '30d' ? 500 : 1500

      const viewsByDay = Array.from({ length: days }, (_, i) => {
        const date = format(subDays(new Date(), days - i), 'MMM d')
        const views = baseViews + Math.floor(Math.random() * 200) - 100
        const reads = Math.floor(views * (0.3 + Math.random() * 0.4))
        return { date, views, reads }
      }).reverse()

      const totalViews = viewsByDay.reduce((sum, day) => sum + day.views, 0)
      const totalReads = viewsByDay.reduce((sum, day) => sum + day.reads, 0)

      return {
        views: totalViews,
        reads: totalReads,
        likes: Math.floor(totalViews * 0.05),
        comments: Math.floor(totalViews * 0.02),
        shares: Math.floor(totalViews * 0.01),
        followers: 1200 + Math.floor(Math.random() * 500),
        readTime: 6.5 + Math.random() * 3,
        subscribers: 450 + Math.floor(Math.random() * 200),
        viewsByDay,
        topPosts: [
          {
            id: '1',
            title: 'Getting Started with Modern Web Development',
            views: 450,
            reads: 180,
            likes: 32,
            comments: 8,
            readRate: 40,
          },
          {
            id: '2',
            title: 'The Future of AI in Software Development',
            views: 320,
            reads: 160,
            likes: 45,
            comments: 14,
            readRate: 50,
          },
          {
            id: '3',
            title: 'Understanding React Server Components',
            views: 280,
            reads: 140,
            likes: 28,
            comments: 6,
            readRate: 50,
          },
        ],
        trafficSources: [
          { source: 'Direct', visits: 1200, percentage: 40 },
          { source: 'Search', visits: 750, percentage: 25 },
          { source: 'Social', visits: 600, percentage: 20 },
          { source: 'Referral', visits: 450, percentage: 15 },
        ],
        devices: [
          { device: 'Desktop', visits: 1800, percentage: 60 },
          { device: 'Mobile', visits: 900, percentage: 30 },
          { device: 'Tablet', visits: 300, percentage: 10 },
        ],
      }
    }

    setLoading(true)
    setTimeout(() => {
      setData(generateMockData())
      setLoading(false)
    }, 1000)
  }, [selectedTimeRange])

  const MetricCard = ({
    title,
    value,
    change,
    icon: Icon,
    color = 'blue',
    format = 'number',
  }: {
    title: string
    value: number | string
    change?: number
    icon: any
    color?: string
    format?: 'number' | 'percentage' | 'time'
  }) => {
    const colorClasses = {
      blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
      green: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
      purple: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20',
      orange: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20',
    }

    const formatValue = (val: number | string) => {
      if (typeof val === 'string') return val
      if (format === 'percentage') return `${val}%`
      if (format === 'time') return `${val} min`
      return val.toLocaleString()
    }

    return (
      <Card className={cn('p-6', compact && 'p-4')}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className={cn(
              'text-2xl font-bold mt-2',
              colorClasses[color as keyof typeof colorClasses]?.split(' ')[0],
            )}>
              {formatValue(value)}
            </p>
            {change !== undefined && (
              <div className={cn(
                'flex items-center gap-1 mt-2 text-sm',
                change >= 0 ? 'text-green-600' : 'text-red-600',
              )}>
                <TrendingUp className="w-4 h-4" />
                <span>{Math.abs(change)}% from last period</span>
              </div>
            )}
          </div>
          <div className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center',
            colorClasses[color as keyof typeof colorClasses],
          )}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </Card>
    )
  }

  const SparklineChart = ({ data }: { data: { date: string; value: number }[] }) => {
    const max = Math.max(...data.map(d => d.value))
    const min = Math.min(...data.map(d => d.value))
    const range = max - min || 1

    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - ((point.value - min) / range) * 100
      return `${x},${y}`
    }).join(' ')

    return (
      <div className="relative h-20">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polyline
            points={points}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary-500"
          />
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
          <polygon
            points={`${points}, 100,100, 0,100`}
            fill="url(#gradient)"
            className="text-primary-500"
          />
        </svg>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className={cn('font-bold text-gray-900 dark:text-white', compact ? 'text-lg' : 'text-2xl')}>
          {compact ? 'Performance' : 'Analytics Dashboard'}
        </h2>
        <div className="flex items-center gap-3">
          <Select value={selectedTimeRange} onValueChange={(value: any) => setSelectedTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className={cn(
        'grid gap-6',
        compact ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
      )}>
        <MetricCard
          title="Total Views"
          value={data.views}
          change={12.5}
          icon={Eye}
          color="blue"
        />
        <MetricCard
          title="Reads"
          value={data.reads}
          change={8.3}
          icon={Clock}
          color="green"
        />
        <MetricCard
          title="Likes"
          value={data.likes}
          change={15.7}
          icon={Heart}
          color="purple"
        />
        <MetricCard
          title="Comments"
          value={data.comments}
          change={-2.4}
          icon={MessageCircle}
          color="orange"
        />
      </div>

      {!compact && (
        <>
          {/* Views Over Time */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Views Over Time</h3>
            <SparklineChart data={data.viewsByDay.map(d => ({ date: d.date, value: d.views }))} />
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600 dark:text-gray-400">
              <span>{format(subDays(new Date(), selectedTimeRange === '7d' ? 7 : selectedTimeRange === '30d' ? 30 : 90), 'MMM d')}</span>
              <span>{format(new Date(), 'MMM d')}</span>
            </div>
          </Card>

          {/* Top Posts */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Top Performing Posts</h3>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {data.topPosts.map((post, index) => (
                <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 line-clamp-1">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {post.comments}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="mb-1">
                      {post.readRate}% read rate
                    </Badge>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {post.reads} reads
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Traffic Sources and Devices */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Traffic Sources</h3>
              <div className="space-y-3">
                {data.trafficSources.map((source) => (
                  <div key={source.source} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{source.source}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full"
                          style={{ width: `${source.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                        {source.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Device Breakdown</h3>
              <div className="space-y-3">
                {data.devices.map((device) => (
                  <div key={device.device} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{device.device}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${device.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                        {device.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
