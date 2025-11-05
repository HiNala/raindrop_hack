'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Edit, Trash2, Eye, MoreVertical, EyeOff, Heart, MessageCircle } from 'lucide-react'
import { deletePost, unpublishPost } from '@/app/actions/post-actions'
import toast from 'react-hot-toast'

interface DashboardPostCardProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt: string | null
    coverImage: string | null
    published: boolean
    publishedAt: Date | null
    updatedAt: Date
    viewCount: number
    tags: Array<{
      tag: {
        name: string
      }
    }>
    _count?: {
      likes: number
      comments: number
    }
  }
  isDraft: boolean
}

export function DashboardPostCard({ post, isDraft }: DashboardPostCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return

    setIsDeleting(true)
    const result = await deletePost(post.id)

    if (result.success) {
      toast.success('Post deleted')
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to delete post')
      setIsDeleting(false)
    }
  }

  const handleUnpublish = async () => {
    if (!confirm('Are you sure you want to unpublish this post?')) return

    const result = await unpublishPost(post.id)

    if (result.success) {
      toast.success('Post unpublished')
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to unpublish post')
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      {post.coverImage && (
        <div className="h-40 w-full overflow-hidden rounded-t-2xl bg-gray-100 dark:bg-gray-800">
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>
      )}

      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-lg line-clamp-2 mb-2">{post.title}</h3>
            {post.excerpt && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {post.excerpt}
              </p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="ml-2">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/editor/${post.id}`} className="cursor-pointer">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Link>
              </DropdownMenuItem>
              
              {!isDraft && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href={`/p/${post.slug}`} className="cursor-pointer">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleUnpublish}>
                    <EyeOff className="w-4 h-4 mr-2" />
                    Unpublish
                  </DropdownMenuItem>
                </>
              )}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-red-600 dark:text-red-400"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 3).map(({ tag }, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          {isDraft ? (
            <span>
              Edited {format(new Date(post.updatedAt), 'MMM d, yyyy')}
            </span>
          ) : (
            <>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {post.viewCount}
              </span>
              {post._count && (
                <>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {post._count.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {post._count.comments}
                  </span>
                </>
              )}
            </>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Link href={`/editor/${post.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            <Edit className="w-4 h-4 mr-2" />
            {isDraft ? 'Continue Editing' : 'Edit Post'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}


