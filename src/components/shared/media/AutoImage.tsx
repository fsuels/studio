'use client';

import React, { useEffect, useState } from 'react';
import Image, { type ImageProps } from 'next/image';
import type { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

// Enhanced AutoImage component with progressive loading and optimization
interface AutoImageProps
  extends Omit<ImageProps, 'width' | 'height' | 'src' | 'alt'> {
  width?: number | string;
  height?: number | string;
  src: string | StaticImport;
  alt?: string;
  showSkeleton?: boolean;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape' | number;
  lazy?: boolean;
}

const AutoImage: React.FC<AutoImageProps> = ({
  width,
  height,
  alt = '',
  showSkeleton = true,
  aspectRatio,
  lazy = true,
  className,
  placeholder = 'blur',
  blurDataURL,
  ...props
}) => {
  const [dims, setDims] = useState<{ width: number; height: number } | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Calculate aspect ratio
  const getAspectRatio = () => {
    if (typeof aspectRatio === 'number') return aspectRatio;
    switch (aspectRatio) {
      case 'square':
        return 1;
      case 'video':
        return 16 / 9;
      case 'landscape':
        return 4 / 3;
      case 'portrait':
        return 3 / 4;
      default:
        return undefined;
    }
  };

  const calculatedAspectRatio = getAspectRatio();

  useEffect(() => {
    if (width && height) return;
    if (typeof props.src === 'string') {
      const img = new window.Image();
      img.src = props.src;
      img.onload = () => {
        setDims({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        setHasError(true);
      };
    }
  }, [width, height, props.src]);

  let finalWidth =
    (typeof width === 'string' ? parseInt(width, 10) : width) ??
    dims?.width ??
    400;

  let finalHeight =
    (typeof height === 'string' ? parseInt(height, 10) : height) ??
    dims?.height ??
    400;

  // Apply aspect ratio if specified
  if (calculatedAspectRatio && width && !height) {
    finalHeight = Math.round(finalWidth / calculatedAspectRatio);
  } else if (calculatedAspectRatio && height && !width) {
    finalWidth = Math.round(finalHeight * calculatedAspectRatio);
  }

  // Generate a simple blur placeholder if none provided
  const defaultBlurDataURL =
    blurDataURL ||
    `data:image/svg+xml;base64,${Buffer.from(
      `<svg width="${finalWidth}" height="${finalHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
      </svg>`,
    ).toString('base64')}`;

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted text-muted-foreground rounded',
          className,
        )}
        style={{ width: finalWidth, height: finalHeight }}
      >
        <span className="text-xs">Image failed to load</span>
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {showSkeleton && isLoading && (
        <Skeleton
          className="absolute inset-0 z-10"
          style={{ width: finalWidth, height: finalHeight }}
        />
      )}
      <Image
        width={finalWidth}
        height={finalHeight}
        alt={alt}
        placeholder={placeholder}
        blurDataURL={defaultBlurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoading && showSkeleton ? 'opacity-0' : 'opacity-100',
        )}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        {...props}
      />
    </div>
  );
};

export default AutoImage;
