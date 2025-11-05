'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Calendar, Heart, MessageCircle, Clock, ArrowRight } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { PostWithRelations } from '@/types/global'

interface PostCardProps {
  post: PostWithRelations
  className?: string
  priority?: boolean
}

export function PostCard({ post, className, priority = false }: PostCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [-100, 100], [5, -5])
  const rotateY = useTransform(mouseX, [-100, 100], [-5, 5])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    mouseX.set(e.clientX - centerX)
    mouseY.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  const initials =
    post.author.profile?.displayName
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || '?'

  return (
    <Link href={`/p/${post.slug}`} aria-label={`Read post: ${post.title}`}>
      <motion.article
        ref={cardRef}
        className="card-hover h-full flex flex-col group relative rounded-2xl overflow-hidden"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Shimmer overlay */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: 'linear',
              }}
            />
          </motion.div>
        )}
        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative aspect-video overflow-hidden">
            <motion.img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
              style={{
                transform: `translateZ(20px) scale(${isHovered ? 1.1 : 1})`,
              }}
              transition={{ duration: 0.5 }}
              loading={priority ? 'eager' : 'lazy'}
              sizes={priority ? "100vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-dark-card/20 to-transparent"></div>
          </div>
        )}

        {/* Content */}
        <div className="p-4 sm:p-6 flex-1 flex flex-col">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <motion.div
              className="flex flex-wrap gap-2 mb-3"
              style={{ transform: 'translateZ(30px)' }}
            >
              {post.tags.slice(0, 2).map((postTag, idx) => (
                <motion.div
                  key={postTag.tag.slug}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: isHovered ? idx * 0.05 : 0 }}
                >
                  <Badge className="px-2 py-1 text-xs bg-teal-500/10 text-teal-400 border-teal-500/30 hover:bg-teal-500/20 transition-colors">
                    {postTag.tag.name}
                  </Badge>
                </motion.div>
              ))}
              {post.tags.length > 2 && (
                <Badge className="px-2 py-1 text-xs bg-dark-bg text-text-tertiary border-dark-border">
                  +{post.tags.length - 2}
                </Badge>
              )}
            </motion.div>
          )}

          {/* Title */}
          <h3 className="text-responsive-lg font-bold text-text-primary mb-2 line-clamp-2 text-balance group-hover:text-gradient-teal transition-colors">
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-text-secondary text-sm mb-4 line-clamp-2 sm:line-clamp-3 flex-1 leading-relaxed text-pretty">
              {post.excerpt}
            </p>
          )}

          {/* Footer */}
          <div className="pt-3 sm:pt-4 border-t border-dark-border">
            {/* Author */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Avatar className="w-7 h-7 sm:w-8 sm:h-8 ring-2 ring-dark-border group-hover:ring-teal-500/30 transition-all flex-shrink-0">
                  <AvatarFallback className="bg-dark-bg text-text-primary text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-text-primary group-hover:text-teal-400 transition-colors truncate">
                    {post.author.profile?.displayName}
                  </span>
                  <span className="text-xs text-text-tertiary truncate">
                    @{post.author.profile?.username}
                  </span>
                </div>
              </div>

              {/* Read More - Hide on small screens */}
              <motion.div
                className="hidden sm:flex items-center gap-1 text-teal-400"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-sm font-medium">Read</span>
                <motion.div
                  animate={{ x: isHovered ? [0, 5, 0] : 0 }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </motion.div>
            </div>

            {/* Meta */}
            <div className="flex items-center justify-between text-xs text-text-tertiary">
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Date */}
                {post.publishedAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="truncate max-w-[80px] sm:max-w-none">
                      {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
                    </span>
                  </div>
                )}

                {/* Reading Time */}
                {post.readTimeMin && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>{post.readTimeMin}m</span>
                  </div>
                )}
              </div>

              {/* Engagement */}
              {post._count && (
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-1 text-text-tertiary group-hover:text-orange-400 transition-colors">
                    <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>{post._count.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>{post._count.comments}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  )
}
