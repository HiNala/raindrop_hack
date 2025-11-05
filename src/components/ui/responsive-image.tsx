'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ResponsiveImageProps extends Omit<ImageProps, 'sizes'> {
  fallbackSrc?: string
  aspectRatio?: 'square' | 'video' | 'portrait' | '4/3' | '16/9' | '3/2' | '2/1'
  containerClassName?: string
}

export function ResponsiveImage({
  src,
  alt,
  fallbackSrc = '/images/placeholder.jpg',
  aspectRatio = 'auto',
  containerClassName,
  className,
  priority = false,
  ...props
}: ResponsiveImageProps) {
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Responsive sizes
  const sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'

  // Aspect ratio classes
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    '4/3': 'aspect-[4/3]',
    '16/9': 'aspect-[16/9]',
    '3/2': 'aspect-[3/2]',
    '2/1': 'aspect-[2/1]',
    auto: '',
  }

  const handleError = () => {
    setError(true)
    setIsLoading(false)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  if (error && !fallbackSrc) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gray-800 text-gray-400 text-sm',
          aspectClasses[aspectRatio],
          containerClassName
        )}
      >
        Image unavailable
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        aspectClasses[aspectRatio],
        isLoading && 'animate-pulse bg-gray-800',
        containerClassName
      )}
    >
      <Image
        src={error ? fallbackSrc : src}
        alt={alt}
        sizes={sizes}
        priority={priority}
        className={cn(
          'object-cover transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        onError={handleError}
        onLoad={handleLoad}
        fill={!!aspectClasses[aspectRatio]}
        {...(!aspectClasses[aspectRatio] && { width: props.width || '100%' })}
        {...(!aspectClasses[aspectRatio] && { height: props.height || 'auto' })}
        {...props}
      />
    </div>
  )
}

export default ResponsiveImage
