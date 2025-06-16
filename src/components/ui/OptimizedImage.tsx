import React from 'react'
import Image, { type ImageProps } from 'next/image'
import { cn } from '@/lib/utils'
import { Skeleton } from './skeleton'

interface OptimizedImageProps extends Omit<ImageProps, 'loading'> {
  priority?: boolean
  lazy?: boolean
  showSkeleton?: boolean
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape' | number
  fallback?: React.ReactNode
}

export function OptimizedImage({
  alt,
  className,
  priority = false,
  lazy = true,
  showSkeleton = true,
  aspectRatio,
  fallback,
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = React.useState(true)
  const [hasError, setHasError] = React.useState(false)

  const handleLoad = React.useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false)
    onLoad?.(event)
  }, [onLoad])

  const handleError = React.useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false)
    setHasError(true)
    onError?.(event)
  }, [onError])

  // Calculate responsive sizes based on common layout patterns
  const getResponsiveSizes = () => {
    // Default responsive sizes that work well for most use cases
    return "(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 60vw, 40vw"
  }

  // Get aspect ratio value
  const getAspectRatioValue = () => {
    if (typeof aspectRatio === 'number') return aspectRatio
    switch (aspectRatio) {
      case 'square': return 1
      case 'video': return 16/9
      case 'landscape': return 4/3
      case 'portrait': return 3/4
      default: return undefined
    }
  }

  if (hasError && fallback) {
    return <>{fallback}</>
  }

  if (hasError) {
    return (
      <div 
        className={cn(
          'flex items-center justify-center bg-muted text-muted-foreground rounded text-xs',
          className
        )}
        style={{ 
          aspectRatio: getAspectRatioValue(),
          width: props.width,
          height: props.height 
        }}
      >
        Failed to load image
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {showSkeleton && isLoading && (
        <Skeleton 
          className="absolute inset-0 z-10"
          style={{ 
            aspectRatio: getAspectRatioValue(),
            width: props.width,
            height: props.height 
          }}
        />
      )}
      <Image
        alt={alt}
        loading={priority ? 'eager' : (lazy ? 'lazy' : 'eager')}
        priority={priority}
        sizes={props.sizes || getResponsiveSizes()}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoading && showSkeleton ? 'opacity-0' : 'opacity-100',
          aspectRatio && 'w-full h-auto object-cover'
        )}
        style={{
          aspectRatio: getAspectRatioValue(),
          ...props.style
        }}
        {...props}
      />
    </div>
  )
}

// Preset components for common use cases
export function AvatarImage({ className, ...props }: OptimizedImageProps) {
  return (
    <OptimizedImage
      aspectRatio="square"
      className={cn('rounded-full', className)}
      {...props}
    />
  )
}

export function CardImage({ className, ...props }: OptimizedImageProps) {
  return (
    <OptimizedImage
      aspectRatio="landscape"
      className={cn('rounded-lg', className)}
      lazy={true}
      {...props}
    />
  )
}

export function HeroImage({ className, ...props }: OptimizedImageProps) {
  return (
    <OptimizedImage
      priority={true}
      lazy={false}
      className={cn('w-full h-auto', className)}
      {...props}
    />
  )
}

export function ThumbnailImage({ className, ...props }: OptimizedImageProps) {
  return (
    <OptimizedImage
      aspectRatio="square"
      className={cn('rounded', className)}
      sizes="(max-width: 640px) 25vw, (max-width: 768px) 20vw, 15vw"
      {...props}
    />
  )
}