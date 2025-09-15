// Performance Optimization Provider
// Initializes intelligent preloading and performance monitoring

'use client';

import React, { useEffect } from 'react';
import { intelligentPreloader } from '@/lib/intelligent-preloader';

interface PerformanceProviderProps {
  children: React.ReactNode;
}

export function PerformanceProvider({ children }: PerformanceProviderProps) {
  useEffect(() => {
    // Initialize intelligent preloader
    intelligentPreloader.initialize();

    // Performance monitoring
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          console.log('Navigation Performance:', {
            domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
            loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
            firstContentfulPaint: navEntry.responseStart - navEntry.requestStart,
          });
        }

        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime);
        }

        if (entry.entryType === 'first-input') {
          console.log('FID:', entry.processingStart - entry.startTime);
        }
      });
    });

    // Observe performance metrics
    if (typeof PerformanceObserver !== 'undefined') {
      try {
        observer.observe({ entryTypes: ['navigation', 'largest-contentful-paint', 'first-input'] });
      } catch (e) {
        // Fallback for browsers that don't support all entry types
        console.log('Performance Observer not fully supported');
      }
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return <>{children}</>;
}

export default PerformanceProvider;