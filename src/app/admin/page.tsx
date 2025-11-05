import Link from 'next/link'
import {
  TrendingUp,
  TrendingDown,
  FileText,
  Eye,
  Heart,
  MessageCircle,
  Users,
  Calendar,
  BarChart3,
  Activity,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
} from 'lucide-react'

export default function AdminDashboard() {
  const stats = [
    {
      name: 'Total Posts',
      value: '127',
      change: '+12.5%',
      changeType: 'increase',
      icon: FileText,
      color: 'blue',
      description: 'Published and draft posts',
    },
    {
      name: 'Total Views',
      value: '45.2K',
      change: '+23.1%',
      changeType: 'increase',
      icon: Eye,
      color: 'green',
      description: 'Last 30 days',
    },
    {
      name: 'Comments',
      value: '892',
      change: '+8.2%',
      changeType: 'increase',
      icon: MessageCircle,
      color: 'purple',
      description: 'Approved and pending',
    },
    {
      name: 'Users',
      value: '3,847',
      change: '-2.4%',
      changeType: 'decrease',
      icon: Users,
      color: 'orange',
      description: 'Registered users',
    },
  ]

  const recentPosts = [
    {
      id: '1',
      title: 'The Future of Web Development: Trends to Watch in 2024',
      slug: 'future-web-development-2024',
      status: 'Published',
      author: 'Sarah Chen',
      category: 'Technology',
      views: 1250,
      likes: 45,
      comments: 12,
      publishedAt: '2024-01-15',
      trend: 'up',
    },
    {
      id: '2',
      title: 'Building Scalable Applications with Microservices Architecture',
      slug: 'scalable-microservices-architecture',
      status: 'Published',
      author: 'Michael Rodriguez',
      category: 'Architecture',
      views: 980,
      likes: 32,
      comments: 8,
      publishedAt: '2024-01-14',
      trend: 'up',
    },
    {
      id: '3',
      title: 'Mastering React Hooks: Advanced Patterns and Best Practices',
      slug: 'mastering-react-hooks',
      status: 'Draft',
      author: 'Emily Johnson',
      category: 'React',
      views: 0,
      likes: 0,
      comments: 0,
      publishedAt: null,
      trend: 'neutral',
    },
    {
      id: '4',
      title: 'TypeScript Performance: Tips for Large-Scale Applications',
      slug: 'typescript-performance-tips',
      status: 'Published',
      author: 'David Kim',
      category: 'TypeScript',
      views: 750,
      likes: 28,
      comments: 5,
      publishedAt: '2024-01-13',
      trend: 'down',
    },
  ]

  const recentComments = [
    {
      id: '1',
      content: 'This is an incredibly comprehensive overview of the trends! I particularly appreciate the practical examples.',
      author: 'John Doe',
      email: 'john@example.com',
      post: 'The Future of Web Development: Trends to Watch in 2024',
      status: 'Approved',
      createdAt: '2 hours ago',
      avatar: 'JD',
    },
    {
      id: '2',
      content: 'Great article! I\'m curious about your thoughts on the practical challenges of implementing edge computing.',
      author: 'Jane Smith',
      email: 'jane@example.com',
      post: 'Building Scalable Applications with Microservices Architecture',
      status: 'Pending',
      createdAt: '5 hours ago',
      avatar: 'JS',
    },
    {
      id: '3',
      content: 'The WebAssembly section is particularly interesting. We\'ve been experimenting with Rust...',
      author: 'Bob Wilson',
      email: 'bob@example.com',
      post: 'The Future of Web Development: Trends to Watch in 2024',
      status: 'Approved',
      createdAt: '1 day ago',
      avatar: 'BW',
    },
  ]

  const analytics = [
    { metric: 'Avg. Read Time', value: '5m 23s', change: '+12s' },
    { metric: 'Bounce Rate', value: '34.2%', change: '-2.1%' },
    { metric: 'Page Views', value: '8.7K', change: '+15.3%' },
    { metric: 'New Visitors', value: '65%', change: '+3.2%' },
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here\'s what\'s happening with your blog today.</p>
          </div>
          <div className="flex items-center space-x-3">
            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Last year</option>
            </select>
            <button className="btn btn-primary">
              <BarChart3 className="w-4 h-4 mr-2" />
              Full Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <div className={`flex items-center text-sm font-medium ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.changeType === 'increase' ? (
                  <ArrowUp className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDown className="w-4 h-4 mr-1" />
                )}
                {stat.change}
              </div>
            </div>

            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Posts */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Posts</h2>
                <Link href="/admin/posts" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  View all →
                </Link>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {recentPosts.map((post) => (
                <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          post.status === 'Published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {post.status}
                        </span>
                        <span className="text-sm text-gray-500">{post.category}</span>
                        {post.trend !== 'neutral' && (
                          <div className={`flex items-center text-sm ${
                            post.trend === 'up' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {post.trend === 'up' ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingDown className="w-4 h-4" />
                            )}
                          </div>
                        )}
                      </div>

                      <Link href={`/posts/${post.slug}`} className="group">
                        <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                          {post.title}
                        </h3>
                      </Link>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>By {post.author}</span>
                        {post.publishedAt && (
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {post.publishedAt}
                          </span>
                        )}
                      </div>
                    </div>

                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  {post.status === 'Published' && (
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {post.views.toLocaleString()} views
                      </span>
                      <span className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {post.likes} likes
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {post.comments} comments
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Comments */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Comments</h2>
                <Link href="/admin/comments" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  View all →
                </Link>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {recentComments.map((comment) => (
                <div key={comment.id} className="p-4">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      comment.status === 'Approved'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      <span className="text-xs font-medium">{comment.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {comment.author}
                        </h4>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          comment.status === 'Approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {comment.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{comment.createdAt}</p>
                      <p className="text-sm text-gray-700 line-clamp-3">{comment.content}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        On: <span className="text-gray-700">{comment.post}</span>
                      </p>
                    </div>
                  </div>

                  {comment.status === 'Pending' && (
                    <div className="flex space-x-2 ml-11">
                      <button className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors">
                        Approve
                      </button>
                      <button className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors">
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Analytics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Analytics</h2>
            <div className="space-y-4">
              {analytics.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{item.metric}</p>
                    <p className="text-lg font-semibold text-gray-900">{item.value}</p>
                  </div>
                  <div className={`text-sm font-medium ${
                    item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.change}
                  </div>
                </div>
              ))}
            </div>

            <Link href="/admin/analytics" className="w-full mt-4 btn btn-outline text-sm">
              View Detailed Analytics
            </Link>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <Activity className="w-5 h-5 text-gray-400" />
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Sarah Chen</span> published a new post
                <span className="text-primary-600 font-medium"> "The Future of Web Development"</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                <span className="font-medium">John Doe</span> commented on
                <span className="text-primary-600 font-medium"> "Building Scalable Applications"</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Emily Johnson</span> created a draft
                <span className="text-primary-600 font-medium"> "Mastering React Hooks"</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
