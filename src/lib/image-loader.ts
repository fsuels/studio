// Custom Image Loader for Enhanced Performance
// Supports WebP/AVIF, progressive loading, and device-aware optimization

export interface ImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export interface ImageOptimizationOptions {
  format?: 'auto' | 'webp' | 'avif' | 'jpeg' | 'png';
  quality?: number;
  progressive?: boolean;
  blur?: boolean;
}

/**
 * Custom image loader with modern format support
 */
export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  // For external URLs, return as-is (they handle their own optimization)
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // For local images, apply optimization parameters
  const params = new URLSearchParams();

  // Set width for responsive images
  params.set('w', width.toString());

  // Set quality (default: 80 for good balance of size/quality)
  params.set('q', (quality || 80).toString());

  // For static export, we'll handle this in the component level
  // since we can't do server-side image optimization
  return `${src}?${params.toString()}`;
}

/**
 * Generate responsive image sizes
 */
export function generateImageSizes(breakpoints: Record<string, number>) {
  return Object.entries(breakpoints)
    .map(([breakpoint, width]) => {
      if (breakpoint === 'default') {
        return `${width}px`;
      }
      return `(max-width: ${breakpoint}) ${width}px`;
    })
    .join(', ');
}

/**
 * Detect browser support for modern image formats
 */
export function getBrowserImageFormat(): 'avif' | 'webp' | 'jpeg' {
  if (typeof window === 'undefined') return 'jpeg';

  // Check for AVIF support
  const avifCanvas = document.createElement('canvas');
  avifCanvas.width = 1;
  avifCanvas.height = 1;

  if (avifCanvas.toDataURL('image/avif').indexOf('data:image/avif') === 0) {
    return 'avif';
  }

  // Check for WebP support
  const webpCanvas = document.createElement('canvas');
  webpCanvas.width = 1;
  webpCanvas.height = 1;

  if (webpCanvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
    return 'webp';
  }

  return 'jpeg';
}

/**
 * Generate blur placeholder for images
 */
export function generateBlurDataURL(width: number = 8, height: number = 8): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Create a subtle gradient for blur effect
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f3f4f6');
  gradient.addColorStop(1, '#e5e7eb');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  return canvas.toDataURL('image/jpeg', 0.1);
}

/**
 * Optimize image URL for different use cases
 */
export function optimizeImageUrl(
  src: string,
  options: ImageOptimizationOptions = {}
): string {
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  const {
    format = 'auto',
    quality = 80,
    progressive = true,
    blur = false,
  } = options;

  const params = new URLSearchParams();

  if (format !== 'auto') {
    params.set('format', format);
  }

  params.set('q', quality.toString());

  if (progressive) {
    params.set('progressive', 'true');
  }

  if (blur) {
    params.set('blur', '10');
  }

  return `${src}?${params.toString()}`;
}

/**
 * Get optimized image props for different device types
 */
export function getOptimizedImageProps(
  src: string,
  alt: string,
  options: {
    priority?: boolean;
    sizes?: string;
    quality?: number;
    fill?: boolean;
    width?: number;
    height?: number;
  } = {}
) {
  const {
    priority = false,
    sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    quality = 80,
    fill = false,
    width,
    height,
  } = options;

  const baseProps = {
    src,
    alt,
    quality,
    sizes,
    priority,
    placeholder: 'blur' as const,
    blurDataURL: generateBlurDataURL(),
    loading: priority ? ('eager' as const) : ('lazy' as const),
  };

  if (fill) {
    return {
      ...baseProps,
      fill: true,
      style: { objectFit: 'cover' as const },
    };
  }

  return {
    ...baseProps,
    width: width || 800,
    height: height || 600,
  };
}

/**
 * Preload critical images
 */
export function preloadImage(src: string, priority: 'high' | 'low' = 'low'): void {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  link.fetchPriority = priority;

  // Add modern format hints
  const format = getBrowserImageFormat();
  if (format === 'avif') {
    link.type = 'image/avif';
  } else if (format === 'webp') {
    link.type = 'image/webp';
  }

  document.head.appendChild(link);
}

/**
 * Lazy load images with Intersection Observer
 */
export function useLazyImageObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver | null {
  if (typeof window === 'undefined') return null;

  const defaultOptions = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  };

  return new IntersectionObserver(callback, defaultOptions);
}

/**
 * Calculate image dimensions for responsive layout
 */
export function calculateImageDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight?: number
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight;

  let width = Math.min(originalWidth, maxWidth);
  let height = width / aspectRatio;

  if (maxHeight && height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }

  return {
    width: Math.round(width),
    height: Math.round(height),
  };
}