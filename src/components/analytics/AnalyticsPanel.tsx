'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye, Clock, Heart, MessageCircle, TrendingUp } from 'lucide-react'
import { flags } from '@/lib/feature-flags'

interface AnalyticsData {
  date: string
  views: number
  reads: number
}

interface AnalyticsPanelProps {
  postId: string
  isOwner: boolean
}

export default function AnalyticsPanel({ postId, isOwner }: AnalyticsPanelProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([])
  const [loading, setLoading] = useState(true)
  const [totals, setTotals] = useState({
    views: 0,
    reads: 0,
    readRate: 0,
  })

  useEffect(() => {
    if (!isOwner || !flags.analytics) return

    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/analytics/${postId}`)
        if (response.ok) {
          const data = await response.json()
          setAnalytics(data)
          
          // Calculate totals
          const totalViews = data.reduce((sum: number, item: AnalyticsData) => sum + item.views, 0)
          const totalReads = data.reduce((sum: number, item: AnalyticsData) => sum + item.reads, 0)
          const readRate = totalViews > 0 ? (totalReads / totalViews) * 100 : 0
          
          setTotals({
            views: totalViews,
            reads: totalReads,
            readRate,
          })
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [postId, isOwner])

  if (!isOwner || !flags.analytics) {
    return null
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-8 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Analytics
        </CardTitle>
        <CardDescription>
          Track your post performance over the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Views</span>
            </div>
            <div className="text-2xl font-bold">{totals.views.toLocaleString()}</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Reads</span>
            </div>
            <div className="text-2xl font-bold">{totals.reads.toLocaleString()}</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Read Rate</span>
            </div>
            <div className="text-2xl font-bold">{totals.readRate.toFixed(1)}%</div>
          </div>
        </div>

        {analytics.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Recent Activity</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {analytics.slice(-7).reverse().map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-4">
                    <span>{item.views} views</span>
                    <span>{item.reads} reads</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {analytics.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No analytics data yet</p>
            <p className="text-sm">Analytics will appear once your post gets views</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}