'use client'

import { useState, useEffect, useRef } from 'react'
import { useUser } from '@clerk/nextjs'
import { Heart } from 'lucide-react'
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

interface LikeButtonProps {
  postId: string
  initialLikes: number
}

interface Particle {
  id: number
  x: number
  y: number
  angle: number
}

export function LikeButton({ postId, initialLikes }: LikeButtonProps) {
  const { isSignedIn, user } = useUser()
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const [showBurst, setShowBurst] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  
  // Spring animation for heart scale
  const scale = useSpring(1, { stiffness: 300, damping: 10 })
  const opacity = useSpring(1)

  // Check if user has liked this post
  useEffect(() => {
    if (isSignedIn) {
      fetch(`/api/posts/${postId}/like/check`)
        .then((res) => res.json())
        .then((data) => setIsLiked(data.isLiked))
        .catch(() => {})
    }
  }, [isSignedIn, postId])

  const createParticles = () => {
    const newParticles: Particle[] = []
    const particleCount = 12
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: 0,
        y: 0,
        angle: (360 / particleCount) * i,
      })
    }
    
    setParticles(newParticles)
    setShowBurst(true)
    
    setTimeout(() => {
      setShowBurst(false)
      setParticles([])
    }, 1000)
  }

  const handleToggleLike = async () => {
    if (!isSignedIn) {
      toast.error('Please sign in to like posts')
      return
    }

    setIsLoading(true)

    // Optimistic update
    const newIsLiked = !isLiked
    const newLikes = newIsLiked ? likes + 1 : likes - 1
    
    // Trigger animations
    if (newIsLiked) {
      scale.set(1.3)
      setTimeout(() => scale.set(1), 200)
      createParticles()
      
      // Haptic feedback (if supported)
      if ('vibrate' in navigator) {
        navigator.vibrate(50)
      }
    } else {
      scale.set(0.8)
      setTimeout(() => scale.set(1), 150)
    }
    
    setIsLiked(newIsLiked)
    setLikes(newLikes)

    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
      })

      if (!res.ok) {
        throw new Error('Failed to toggle like')
      }

      const data = await res.json()
      setLikes(data.likes)
      setIsLiked(data.isLiked)
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(!newIsLiked)
      setLikes(likes)
      scale.set(1)
      toast.error('Failed to update like')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative inline-block">
      {/* Particle burst effect */}
      <AnimatePresence>
        {showBurst && particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: 0, 
              y: 0, 
              opacity: 1, 
              scale: 0 
            }}
            animate={{
              x: Math.cos((particle.angle * Math.PI) / 180) * 40,
              y: Math.sin((particle.angle * Math.PI) / 180) * 40,
              opacity: 0,
              scale: [0, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.23, 1, 0.32, 1] 
            }}
            className="absolute top-1/2 left-1/2 pointer-events-none"
            style={{ transformOrigin: 'center' }}
          >
            <Heart className="w-2 h-2 fill-red-500 text-red-500" />
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          ref={buttonRef}
          variant={isLiked ? 'default' : 'outline'}
          size="sm"
          onClick={handleToggleLike}
          disabled={isLoading}
          className={`relative overflow-hidden transition-all duration-300 ${
            isLiked 
              ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-red-500/30' 
              : 'border-[#27272a] hover:border-red-500/50 text-text-primary hover:text-red-400'
          }`}
        >
          {/* Shimmer effect on hover */}
          {isLiked && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: 'linear',
              }}
            />
          )}
          
          <motion.div
            style={{ scale }}
            className="flex items-center gap-2"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <motion.span
              key={likes}
              initial={{ y: isLiked ? -10 : 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              {likes}
            </motion.span>
          </motion.div>
        </Button>
      </motion.div>
    </div>
  )
}


