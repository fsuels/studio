// Performance Monitoring and Budget Enforcement System
// Real-time performance tracking with actionable insights

'use client';

import { useEffect, useState, useCallback } from 'react';

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte

  // Bundle metrics
  bundleSize: number;
  initialLoadTime: number;
  routeLoadTime: number;

  // Resource metrics
  totalResources: number;
  cssSize: number;
  jsSize: number;
  imageSize: number;

  // User experience
  interactionTime: number;
  scrollResponsiveness: number;
  formResponsiveness: number;
}

export interface PerformanceBudgets {
  lcp: number; // 2.5s target
  fid: number; // 100ms target
  cls: number; // 0.1 target
  bundleSize: number; // 800KB target
  routeLoadTime: number; // 1s target
}

// Default performance budgets based on industry standards
export const DEFAULT_BUDGETS: PerformanceBudgets = {
  lcp: 2500, // 2.5 seconds
  fid: 100,  // 100ms
  cls: 0.1,  // 0.1 score
  bundleSize: 800000, // 800KB
  routeLoadTime: 1000, // 1 second
};

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private budgets: PerformanceBudgets = DEFAULT_BUDGETS;
  private observers: PerformanceObserver[] = [];
  private listeners: Array<(metrics: PerformanceMetrics) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers();
      this.trackBundleMetrics();
      this.trackUserInteractions();
    }
  }

  private initializeObservers() {
    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.updateMetric('lcp', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('LCP observer failed:', e);
      }

      // First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entry = list.getEntries()[0];
          this.updateMetric('fid', entry.processingStart - entry.startTime);
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn('FID observer failed:', e);
      }

      // Cumulative Layout Shift
      let clsValue = 0;
      try {
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          this.updateMetric('cls', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn('CLS observer failed:', e);
      }

      // First Contentful Paint & Navigation
      try {
        const navigationObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
              this.updateMetric('fcp', entry.startTime);
            }
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming;
              this.updateMetric('ttfb', navEntry.responseStart - navEntry.requestStart);
              this.updateMetric('initialLoadTime', navEntry.loadEventEnd - navEntry.navigationStart);
            }
          });
        });
        navigationObserver.observe({ entryTypes: ['paint', 'navigation'] });
        this.observers.push(navigationObserver);
      } catch (e) {
        console.warn('Navigation observer failed:', e);
      }
    }
  }

  private trackBundleMetrics() {
    // Track resource sizes
    window.addEventListener('load', () => {
      const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

      let totalSize = 0;
      let cssSize = 0;
      let jsSize = 0;
      let imageSize = 0;

      resourceEntries.forEach(entry => {
        const size = entry.transferSize || 0;
        totalSize += size;

        if (entry.name.includes('.css')) {
          cssSize += size;
        } else if (entry.name.includes('.js')) {
          jsSize += size;
        } else if (entry.name.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)) {
          imageSize += size;
        }
      });

      this.updateMetric('bundleSize', jsSize + cssSize);
      this.updateMetric('totalResources', totalSize);
      this.updateMetric('cssSize', cssSize);
      this.updateMetric('jsSize', jsSize);
      this.updateMetric('imageSize', imageSize);
    });
  }

  private trackUserInteractions() {
    let interactionStart = 0;

    // Track form interactions
    document.addEventListener('focusin', (e) => {
      if ((e.target as HTMLElement).tagName.match(/^(INPUT|TEXTAREA|SELECT)$/)) {
        interactionStart = performance.now();
      }
    });

    document.addEventListener('input', () => {
      if (interactionStart > 0) {
        const responseTime = performance.now() - interactionStart;
        this.updateMetric('formResponsiveness', responseTime);
        interactionStart = 0;
      }
    });

    // Track scroll responsiveness
    let scrollStart = 0;
    document.addEventListener('touchstart', () => {
      scrollStart = performance.now();
    });

    document.addEventListener('scroll', () => {
      if (scrollStart > 0) {
        const scrollTime = performance.now() - scrollStart;
        this.updateMetric('scrollResponsiveness', scrollTime);
        scrollStart = 0;
      }
    });
  }

  private updateMetric(key: keyof PerformanceMetrics, value: number) {
    this.metrics[key] = value;
    this.notifyListeners();
    this.checkBudgets();
  }

  private notifyListeners() {
    const completeMetrics = this.metrics as PerformanceMetrics;
    this.listeners.forEach(listener => listener(completeMetrics));
  }

  private checkBudgets() {
    const violations: string[] = [];

    if (this.metrics.lcp && this.metrics.lcp > this.budgets.lcp) {
      violations.push(`LCP exceeded: ${Math.round(this.metrics.lcp)}ms > ${this.budgets.lcp}ms`);
    }

    if (this.metrics.fid && this.metrics.fid > this.budgets.fid) {
      violations.push(`FID exceeded: ${Math.round(this.metrics.fid)}ms > ${this.budgets.fid}ms`);
    }

    if (this.metrics.cls && this.metrics.cls > this.budgets.cls) {
      violations.push(`CLS exceeded: ${this.metrics.cls.toFixed(3)} > ${this.budgets.cls}`);
    }

    if (this.metrics.bundleSize && this.metrics.bundleSize > this.budgets.bundleSize) {
      violations.push(`Bundle size exceeded: ${Math.round(this.metrics.bundleSize / 1024)}KB > ${Math.round(this.budgets.bundleSize / 1024)}KB`);
    }

    if (violations.length > 0) {
      console.warn('Performance Budget Violations:', violations);

      // Report to analytics in production
      if (process.env.NODE_ENV === 'production') {
        this.reportViolations(violations);
      }
    }
  }

  private reportViolations(violations: string[]) {
    // Send to analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      violations.forEach(violation => {
        (window as any).gtag('event', 'performance_budget_violation', {
          event_category: 'Performance',
          event_label: violation,
          custom_map: { metric_1: 'performance_score' }
        });
      });
    }
  }

  // Public methods
  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  setBudgets(budgets: Partial<PerformanceBudgets>) {
    this.budgets = { ...this.budgets, ...budgets };
  }

  getBudgets(): PerformanceBudgets {
    return { ...this.budgets };
  }

  subscribe(listener: (metrics: PerformanceMetrics) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  getPerformanceScore(): number {
    const { lcp, fid, cls } = this.metrics;

    if (!lcp || !fid || cls === undefined) return 0;

    // Calculate score based on Core Web Vitals
    const lcpScore = Math.max(0, Math.min(100, (4000 - lcp) / 15));
    const fidScore = Math.max(0, Math.min(100, (300 - fid) / 2));
    const clsScore = Math.max(0, Math.min(100, (0.25 - cls) * 400));

    return Math.round((lcpScore + fidScore + clsScore) / 3);
  }

  getRecommendations(): string[] {
    const recommendations: string[] = [];
    const { lcp, fid, cls, bundleSize, formResponsiveness } = this.metrics;

    if (lcp && lcp > 2500) {
      recommendations.push('Optimize images and use next-gen formats (WebP/AVIF)');
      recommendations.push('Implement lazy loading for below-fold content');
      recommendations.push('Use a CDN for faster resource delivery');
    }

    if (fid && fid > 100) {
      recommendations.push('Reduce JavaScript execution time');
      recommendations.push('Split long tasks into smaller chunks');
      recommendations.push('Use React.memo() and useMemo() for expensive operations');
    }

    if (cls && cls > 0.1) {
      recommendations.push('Set dimensions for images and videos');
      recommendations.push('Avoid inserting content above existing content');
      recommendations.push('Use transform animations instead of layout changes');
    }

    if (bundleSize && bundleSize > 800000) {
      recommendations.push('Enable tree shaking and remove unused code');
      recommendations.push('Implement code splitting for routes');
      recommendations.push('Use dynamic imports for non-critical features');
    }

    if (formResponsiveness && formResponsiveness > 50) {
      recommendations.push('Optimize form validation logic');
      recommendations.push('Use debouncing for real-time validation');
      recommendations.push('Consider virtualization for large forms');
    }

    return recommendations;
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.listeners = [];
  }
}

// Singleton instance
let performanceMonitor: PerformanceMonitor | null = null;

export function getPerformanceMonitor(): PerformanceMonitor {
  if (!performanceMonitor) {
    performanceMonitor = new PerformanceMonitor();
  }
  return performanceMonitor;
}

// React hook for performance monitoring
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const monitor = getPerformanceMonitor();

    const unsubscribe = monitor.subscribe((newMetrics) => {
      setMetrics(newMetrics);
      setScore(monitor.getPerformanceScore());
    });

    // Get initial metrics
    setMetrics(monitor.getMetrics());
    setScore(monitor.getPerformanceScore());

    return () => {
      unsubscribe();
    };
  }, []);

  const setBudgets = useCallback((budgets: Partial<PerformanceBudgets>) => {
    getPerformanceMonitor().setBudgets(budgets);
  }, []);

  const getRecommendations = useCallback(() => {
    return getPerformanceMonitor().getRecommendations();
  }, [metrics]);

  return {
    metrics,
    score,
    setBudgets,
    getRecommendations,
    budgets: getPerformanceMonitor().getBudgets(),
  };
}
// Tracks page load times, bundle sizes, and optimization metrics

interface PerformanceMetrics {
  pageLoadTime: number;
  timeToInteractive: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  totalBundleSize: number;
  cachedResources: number;
  networkRequests: number;
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'performance' in window) {
      this.initializeObservers();
    }
  }

  private initializeObservers() {
    // Track paint timings
    try {
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.firstContentfulPaint = entry.startTime;
          }
        }
      });
      paintObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(paintObserver);
    } catch (e) {
      console.warn('Paint observer not supported');
    }

    // Track Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.largestContentfulPaint = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
    } catch (e) {
      console.warn('LCP observer not supported');
    }

    // Track page load
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
        this.metrics.timeToInteractive = navigation.domInteractive - navigation.fetchStart;
      }
    });

    // Track network requests
    const resourceObserver = new PerformanceObserver((list) => {
      const resources = list.getEntries() as PerformanceResourceTiming[];
      this.metrics.networkRequests = (this.metrics.networkRequests || 0) + resources.length;

      // Calculate total bundle size
      let totalSize = 0;
      let cachedCount = 0;

      resources.forEach((resource) => {
        totalSize += resource.transferSize || 0;
        if (resource.transferSize === 0 && resource.decodedBodySize > 0) {
          cachedCount++;
        }
      });

      this.metrics.totalBundleSize = (this.metrics.totalBundleSize || 0) + totalSize;
      this.metrics.cachedResources = (this.metrics.cachedResources || 0) + cachedCount;
    });

    resourceObserver.observe({ entryTypes: ['resource'] });
    this.observers.push(resourceObserver);
  }

  public getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  public logMetrics() {
    const metrics = this.getMetrics();
    console.group('🚀 Performance Metrics');
    console.table({
      'Page Load Time': `${Math.round(metrics.pageLoadTime || 0)}ms`,
      'Time to Interactive': `${Math.round(metrics.timeToInteractive || 0)}ms`,
      'First Contentful Paint': `${Math.round(metrics.firstContentfulPaint || 0)}ms`,
      'Largest Contentful Paint': `${Math.round(metrics.largestContentfulPaint || 0)}ms`,
      'Total Bundle Size': `${Math.round((metrics.totalBundleSize || 0) / 1024)}KB`,
      'Cached Resources': metrics.cachedResources || 0,
      'Network Requests': metrics.networkRequests || 0,
    });
    console.groupEnd();
  }

  public sendToAnalytics(endpoint?: string) {
    const metrics = this.getMetrics();
    const analyticsData = {
      ...metrics,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };

    // Send to analytics endpoint
    if (endpoint) {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analyticsData),
      }).catch((err) => console.error('Failed to send performance metrics:', err));
    }

    // Also send to Google Analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance', {
        event_category: 'Web Vitals',
        event_label: 'Page Load',
        value: Math.round(metrics.pageLoadTime || 0),
        custom_map: {
          metric1: metrics.firstContentfulPaint,
          metric2: metrics.largestContentfulPaint,
          metric3: metrics.timeToInteractive,
        },
      });
    }
  }

  public cleanup() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
let performanceMonitor: PerformanceMonitor | null = null;

export function getPerformanceMonitor(): PerformanceMonitor {
  if (!performanceMonitor && typeof window !== 'undefined') {
    performanceMonitor = new PerformanceMonitor();
  }
  return performanceMonitor!;
}

// Auto-log metrics in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const monitor = getPerformanceMonitor();
      monitor.logMetrics();
    }, 2000);
  });
}

// Export utility functions
export function measurePerformance(label: string, fn: () => void | Promise<void>) {
  const start = performance.now();
  const result = fn();

  if (result instanceof Promise) {
    return result.finally(() => {
      const duration = performance.now() - start;
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    });
  } else {
    const duration = performance.now() - start;
    console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    return result;
  }
}

export function reportWebVitals(metric: any) {
  // Report to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`Web Vital: ${metric.name}`, metric.value);
  }

  // Send to analytics
  const monitor = getPerformanceMonitor();
  monitor.sendToAnalytics('/api/analytics/performance');
}