// Optimized Image Component with Modern Format Support
// Automatically handles WebP/AVIF, lazy loading, and responsive sizing

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  getOptimizedImageProps,
  getBrowserImageFormat,
  generateBlurDataURL,
  calculateImageDimensions,
  useLazyImageObserver as createLazyImageObserver
} from '@/lib/image-loader';

export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: 'blur' | 'empty';
  onLoad?: () => void;
  onError?: () => void;
  // Device-specific optimization
  mobileQuality?: number;
  tabletQuality?: number;
  desktopQuality?: number;
  // Responsive breakpoints
  breakpoints?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  // Loading behavior
  lazy?: boolean;
  fadeIn?: boolean;
  // Aspect ratio maintenance
  aspectRatio?: number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

/**
 * High-performance image component with automatic optimization
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  sizes,
  priority = false,
  quality,
  className,
  style,
  placeholder = 'blur',
  onLoad,
  onError,
  mobileQuality = 60,
  tabletQuality = 75,
  desktopQuality = 85,
  breakpoints,
  lazy = true,
  fadeIn = true,
  aspectRatio,
  objectFit = 'cover',
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const [currentFormat, setCurrentFormat] = useState<string>('jpeg');
  const [deviceQuality, setDeviceQuality] = useState(quality || desktopQuality);
  const imageRef = useRef<HTMLDivElement>(null);

  // Detect browser capabilities
  useEffect(() => {
    setCurrentFormat(getBrowserImageFormat());

    // Set quality based on device
    const updateQuality = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceQuality(quality || mobileQuality);
      } else if (width < 1024) {
        setDeviceQuality(quality || tabletQuality);
      } else {
        setDeviceQuality(quality || desktopQuality);
      }
    };

    updateQuality();
    window.addEventListener('resize', updateQuality);
    return () => window.removeEventListener('resize', updateQuality);
  }, [quality, mobileQuality, tabletQuality, desktopQuality]);

  // Lazy loading with Intersection Observer
  useEffect(() => {
    if (!lazy || priority || isInView) return;

    const observer = createLazyImageObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer?.disconnect();
          }
        });
      },
      { rootMargin: '50px' }
    );

    if (imageRef.current && observer) {
      observer.observe(imageRef.current);
    }

    return () => observer?.disconnect();
  }, [lazy, priority, isInView]);

  // Calculate responsive dimensions
  const dimensions = width && height && aspectRatio
    ? calculateImageDimensions(width, height, width)
    : { width: width || 800, height: height || 600 };

  // Generate responsive sizes
  const responsiveSizes = sizes || (() => {
    if (breakpoints) {
      const { mobile = 100, tablet = 50, desktop = 33 } = breakpoints;
      return `(max-width: 768px) ${mobile}vw, (max-width: 1024px) ${tablet}vw, ${desktop}vw`;
    }
    return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';
  })();

  // Get optimized props
  const imageProps = getOptimizedImageProps(src, alt, {
    priority,
    sizes: responsiveSizes,
    quality: deviceQuality,
    fill,
    width: dimensions.width,
    height: dimensions.height,
  });

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    console.warn(`Failed to load image: ${src}`);
    onError?.();
  };

  // Render placeholder if not in view
  if (!isInView) {
    return (
      <div
        ref={imageRef}
        className={cn(
          'bg-muted animate-pulse',
          fill ? 'absolute inset-0' : '',
          className
        )}
        style={{
          width: fill ? undefined : dimensions.width,
          height: fill ? undefined : dimensions.height,
          aspectRatio: aspectRatio || dimensions.width / dimensions.height,
          ...style,
        }}
        aria-label={`Loading ${alt}`}
      />
    );
  }

  const imageElement = (
    <Image
      {...imageProps}
      src={src}
      alt={alt}
      className={cn(
        'transition-opacity duration-300',
        fadeIn && !isLoaded ? 'opacity-0' : 'opacity-100',
        className
      )}
      style={{
        objectFit: fill ? objectFit : undefined,
        ...style,
      }}
      onLoad={handleLoad}
      onError={handleError}
      unoptimized={process.env.NODE_ENV === 'development'}
    />
  );

  if (fill) {
    return (
      <div
        ref={imageRef}
        className="relative overflow-hidden"
        style={{ aspectRatio: aspectRatio || 'auto' }}
      >
        {imageElement}
      </div>
    );
  }

  return (
    <div ref={imageRef} className="relative">
      {imageElement}
    </div>
  );
}

/**
 * Optimized avatar image component
 */
export function OptimizedAvatar({
  src,
  alt,
  size = 40,
  className,
  fallback,
}: {
  src?: string;
  alt: string;
  size?: number;
  className?: string;
  fallback?: React.ReactNode;
}) {
  if (!src) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted rounded-full',
          className
        )}
        style={{ width: size, height: size }}
      >
        {fallback || <span className="text-xs font-medium">{alt[0]?.toUpperCase()}</span>}
      </div>
    );
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn('rounded-full', className)}
      quality={90} // Higher quality for small avatars
      priority={size > 80} // Prioritize larger avatars
      objectFit="cover"
    />
  );
}

/**
 * Optimized hero image component
 */
export function OptimizedHeroImage({
  src,
  alt,
  className,
  overlay = false,
  children,
}: {
  src: string;
  alt: string;
  className?: string;
  overlay?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        priority
        quality={90}
        sizes="100vw"
        objectFit="cover"
        breakpoints={{ mobile: 100, tablet: 100, desktop: 100 }}
      />
      {overlay && (
        <div className="absolute inset-0 bg-black/40" />
      )}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * Optimized gallery image component
 */
export function OptimizedGalleryImage({
  src,
  alt,
  aspectRatio = 1,
  className,
  onClick,
}: {
  src: string;
  alt: string;
  aspectRatio?: number;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity',
        className
      )}
      style={{ aspectRatio }}
      onClick={onClick}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        quality={80}
        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        objectFit="cover"
        lazy
        fadeIn
      />
    </div>
  );
}

export default OptimizedImage;
