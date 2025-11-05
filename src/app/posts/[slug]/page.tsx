'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { 
  Calendar, 
  Clock, 
  Eye, 
  Heart, 
  MessageCircle,
  Share2,
  ArrowLeft,
  User
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { TextSelection } from '@/components/engagement/TextSelection'
import { CommentSystem } from '@/components/engagement/CommentSystem'
import { PostInteractions } from '@/components/engagement/PostInteractions'
import { format } from 'date-fns'

// Mock post data
const mockPost = {
  id: '1',
  title: 'Getting Started with Modern Web Development',
  slug: 'getting-started-with-modern-web-development',
  content: `
    <h2>Introduction</h2>
    <p>Modern web development has evolved significantly over the past few years. With the rise of frameworks like React, Vue, and Angular, developers now have powerful tools at their disposal to build complex, interactive web applications.</p>
    
    <h2>The JavaScript Ecosystem</h2>
    <p>JavaScript continues to be the backbone of web development. ES6+ features have made the language more expressive and easier to work with. Let's explore some key concepts:</p>
    
    <h3>Arrow Functions</h3>
    <p>Arrow functions provide a concise syntax for writing function expressions. They're especially useful for callbacks and maintaining the lexical this context.</p>
    
    <blockquote>
      <p>"Arrow functions are not just syntactic sugar - they fundamentally change how 'this' works in JavaScript."</p>
    </blockquote>
    
    <h3>Destructuring</h3>
    <p>Destructuring allows you to unpack values from arrays or properties from objects into distinct variables. This makes your code more readable and concise.</p>
    
    <h2>Build Tools and Bundlers</h2>
    <p>Modern web development relies heavily on build tools. Webpack, Vite, and Parcel help optimize and bundle your code for production deployment.</p>
    
    <h3>Why Use Build Tools?</h3>
    <p>Build tools offer several advantages: code splitting, tree shaking, minification, and transpilation. These optimizations significantly improve your application's performance.</p>
    
    <h2>Component-Based Architecture</h2>
    <p>The shift to component-based architecture has revolutionized how we build user interfaces. Components promote reusability, maintainability, and separation of concerns.</p>
    
    <h2>Conclusion</h2>
    <p>Modern web development is an exciting field with constantly evolving tools and practices. By staying current with these technologies, you'll be well-equipped to build amazing web applications that delight users.</p>
  `,
  excerpt: 'A comprehensive guide to modern web development tools and practices.',
  coverImage: null,
  publishedAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
  readTimeMin: 8,
  viewCount: 1250,
  author: {
    id: '1',
    username: 'tech_writer',
    displayName: 'Tech Writer',
    avatarUrl: null,
    bio: 'Web development enthusiast and tutorial creator'
  },
  tags: [
    { tag: { name: 'JavaScript', slug: 'javascript' } },
    { tag: { name: 'React', slug: 'react' } },
    { tag: { name: 'Web Development', slug: 'web-development' } }
  ],
  likes: 67,
  comments: 14,
  shares: 8
}

// Mock comments
const mockComments = [
  {
    id: '1',
    body: 'Great article! This really helped me understand modern web development concepts.',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    author: {
      id: '2',
      username: 'learner123',
      displayName: 'Curious Learner',
      avatarUrl: null
    },
    postId: '1',
    likes: 5,
    isLiked: false,
    replies: [
      {
        id: '2',
        body: 'I agree! The section on build tools was particularly helpful.',
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-16'),
        author: {
          id: '3',
          username: 'dev_guru',
          displayName: 'Dev Guru',
          avatarUrl: null
        },
        postId: '1',
        parentId: '1',
        likes: 2,
        isLiked: false,
        replies: []
      }
    ],
    _count: { replies: 1 }
  }
]

export default function PostDetailPage() {
  const params = useParams()
  const [post, setPost] = useState(mockPost)
  const [comments, setComments] = useState(mockComments)
  const [currentUser] = useState({
    id: '4',
    username: 'current_user',
    displayName: 'Current User',
    avatarUrl: null
  })

  const handleTextAction = (action: string, text: string, range: Range) => {
    // Handle text selection actions (bold, italic, quote)
    console.log(`${action} action on text:`, text)
  }

  const handleComment = (text: string, rect: DOMRect) => {
    // Handle inline comment creation
    console.log('Comment on selection:', text, rect)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Back Navigation */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Button
          variant="ghost"
          asChild
          className="mb-6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Posts
          </Link>
        </Button>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            {post.tags.map((tagItem) => (
              <Badge key={tagItem.tag.slug} variant="secondary" className="text-xs">
                {tagItem.tag.name}
              </Badge>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            {post.excerpt}
          </p>
          
          {/* Author Info and Meta */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={post.author.avatarUrl} />
                <AvatarFallback className="bg-gradient-to-br from-primary-400 to-primary-600 text-white">
                  {post.author.displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {post.author.displayName}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    @{post.author.username}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(post.publishedAt, 'MMM d, yyyy')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTimeMin} min read
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {post.viewCount.toLocaleString()} views
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {post.likes} likes
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {post.comments} comments
              </span>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-8">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-xl"
            />
          </div>
        )}

        {/* Article Content with Text Selection */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <TextSelection
            content={post.content}
            onTextAction={handleTextAction}
            onComment={handleComment}
          />
        </div>

        {/* Article Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800 pt-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Share this post:</span>
              <Button variant="outline" size="sm">
                Twitter
              </Button>
              <Button variant="outline" size="sm">
                LinkedIn
              </Button>
              <Button variant="outline" size="sm">
                Copy Link
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Written by {post.author.displayName}
              </span>
            </div>
          </div>
        </footer>
      </article>

      {/* Post Interactions (sticky bottom bar) */}
      <PostInteractions
        postId={post.id}
        initialLikes={post.likes}
        initialViews={post.viewCount}
        initialComments={post.comments}
        initialBookmarks={23}
        readingTime={post.readTimeMin}
        author={{
          name: post.author.displayName,
          username: post.author.username
        }}
      />

      {/* Comments Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Discussion ({comments.length})
          </h2>
          
          <CommentSystem
            postId={post.id}
            initialComments={comments}
            currentUser={currentUser}
          />
        </div>
      </section>

      {/* Related Posts */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Related Posts
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Understanding React Server Components
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                A deep dive into React's new Server Components paradigm...
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>React Expert</span>
                <span>•</span>
                <span>12 min read</span>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                TypeScript Best Practices
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Write better TypeScript with these essential tips...
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>TypeScript Guru</span>
                <span>•</span>
                <span>8 min read</span>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}