// Mobile Performance Optimization Suite
import { useEffect, useState, useCallback } from 'react';

// Device detection and capabilities
export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  hasHighDensityScreen: boolean;
  hasSlowConnection: boolean;
  hasLimitedMemory: boolean;
  screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  orientation: 'portrait' | 'landscape';
}

// Hook for device detection
export function useDeviceInfo(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouchDevice: false,
    hasHighDensityScreen: false,
    hasSlowConnection: false,
    hasLimitedMemory: false,
    screenSize: 'lg',
    orientation: 'landscape',
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const userAgent = navigator.userAgent;

      // Screen size detection
      const screenSize =
        width < 640
          ? 'xs'
          : width < 768
            ? 'sm'
            : width < 1024
              ? 'md'
              : width < 1280
                ? 'lg'
                : 'xl';

      // Device type detection
      const isMobile = width < 768 || /Mobi|Android/i.test(userAgent);
      const isTablet = width >= 768 && width < 1024 && isMobile;
      const isDesktop = !isMobile && !isTablet;

      // Capabilities detection
      const isTouchDevice =
        'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const hasHighDensityScreen = window.devicePixelRatio > 1.5;

      // Network detection
      const connection = (navigator as any).connection;
      const hasSlowConnection =
        connection &&
        (connection.effectiveType === 'slow-2g' ||
          connection.effectiveType === '2g');

      // Memory detection
      const hasLimitedMemory =
        (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;

      // Orientation
      const orientation = height > width ? 'portrait' : 'landscape';

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        isTouchDevice,
        hasHighDensityScreen,
        hasSlowConnection,
        hasLimitedMemory,
        screenSize,
        orientation,
      });
    };

    updateDeviceInfo();
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  return deviceInfo;
}

// Adaptive loading based on device capabilities
export function useAdaptiveLoading() {
  const deviceInfo = useDeviceInfo();

  const shouldLazyLoad = useCallback(
    (priority: 'high' | 'medium' | 'low' = 'medium') => {
      if (priority === 'high') return false;

      if (deviceInfo.hasSlowConnection || deviceInfo.hasLimitedMemory) {
        return true;
      }

      if (deviceInfo.isMobile && priority === 'low') {
        return true;
      }

      return false;
    },
    [deviceInfo],
  );

  const getImageQuality = useCallback(() => {
    if (deviceInfo.hasSlowConnection) return 'low';
    if (deviceInfo.hasLimitedMemory) return 'medium';
    if (deviceInfo.hasHighDensityScreen) return 'high';
    return 'medium';
  }, [deviceInfo]);

  const getAnimationLevel = useCallback(() => {
    if (deviceInfo.hasLimitedMemory || deviceInfo.hasSlowConnection) {
      return 'reduced';
    }
    return 'full';
  }, [deviceInfo]);

  return {
    shouldLazyLoad,
    getImageQuality,
    getAnimationLevel,
    deviceInfo,
  };
}

// Touch optimization for mobile forms
export function useTouchOptimization() {
  const deviceInfo = useDeviceInfo();

  const getTouchProps = useCallback(() => {
    if (!deviceInfo.isTouchDevice) return {};

    return {
      // Increase touch target size
      style: {
        minHeight: '44px',
        minWidth: '44px',
      },
      // Prevent zoom on input focus (iOS)
      onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
        if (deviceInfo.isMobile) {
          e.target.style.fontSize = '16px';
        }
      },
    };
  }, [deviceInfo]);

  const preventZoom = useCallback(
    (inputProps: any) => {
      if (deviceInfo.isMobile) {
        return {
          ...inputProps,
          style: {
            ...inputProps.style,
            fontSize: '16px', // Prevents zoom on iOS
          },
        };
      }
      return inputProps;
    },
    [deviceInfo],
  );

  return {
    getTouchProps,
    preventZoom,
  };
}

// Viewport optimization
export function useViewportOptimization() {
  const [viewport, setViewport] = useState({
    width: 0,
    height: 0,
    scale: 1,
  });

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
        scale: window.devicePixelRatio || 1,
      });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, []);

  return viewport;
}

// Performance monitoring
export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = useState({
    lcp: 0,
    fid: 0,
    cls: 0,
    fcp: 0,
    ttfb: 0,
  });

  useEffect(() => {
    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      setMetrics((prev) => ({ ...prev, lcp: lastEntry.startTime }));
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((list) => {
      const entry = list.getEntries()[0];
      setMetrics((prev) => ({
        ...prev,
        fid: entry.processingStart - entry.startTime,
      }));
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      setMetrics((prev) => ({ ...prev, cls: clsValue }));
    }).observe({ entryTypes: ['layout-shift'] });

    // First Contentful Paint
    new PerformanceObserver((list) => {
      const entry = list.getEntries()[0];
      setMetrics((prev) => ({ ...prev, fcp: entry.startTime }));
    }).observe({ entryTypes: ['paint'] });
  }, []);

  return metrics;
}

// Bundle splitting optimization - Static patterns only
export const DynamicImportPatterns = {
  // Predefined safe import patterns
  preloadFirebase: () => import('@/lib/firebase-dynamic'),
  preloadPDF: () => import('@/lib/pdf/pdf-service'),
  preloadForms: () => import('@/components/forms/DynamicForm'),
  preloadSearch: () => import('@/services/vectorSearch'),

  // Conditional preloading based on device capabilities
  conditionalPreload: async (deviceInfo: DeviceInfo) => {
    if (!deviceInfo.hasSlowConnection && !deviceInfo.hasLimitedMemory) {
      // Only preload on capable devices
      return Promise.all([
        import('@/lib/firebase-dynamic'),
        import('@/components/forms/DynamicForm')
      ]);
    }
    return Promise.resolve([]);
  }
};

// Image optimization for mobile
export function useOptimizedImageProps(
  src: string,
  options?: {
    quality?: 'low' | 'medium' | 'high';
    sizes?: string;
    priority?: boolean;
  },
) {
  const { getImageQuality } = useAdaptiveLoading();
  const quality = options?.quality || getImageQuality();

  const qualityMap = {
    low: 60,
    medium: 75,
    high: 90,
  };

  return {
    src,
    quality: qualityMap[quality],
    sizes:
      options?.sizes ||
      '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    priority: options?.priority || false,
    loading: options?.priority ? 'eager' : 'lazy',
  };
}

// Service Worker registration for offline support
export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}

// Critical CSS inlining utility
export function inlineCriticalCSS(css: string) {
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }
}

// Font loading optimization
export function useOptimizeFontLoading() {
  useEffect(() => {
    // Preload critical fonts
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = '/fonts/inter.woff2';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);

    // Use font display swap
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Inter';
        src: url('/fonts/inter.woff2') format('woff2');
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
  }, []);
}

// Export all utilities
export const MobileOptimization = {
  useDeviceInfo,
  useAdaptiveLoading,
  useTouchOptimization,
  useViewportOptimization,
  usePerformanceMonitoring,
  DynamicImportPatterns,
  useOptimizedImageProps,
  registerServiceWorker,
  inlineCriticalCSS,
  useOptimizeFontLoading,
};
