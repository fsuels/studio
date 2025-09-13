// Performance Monitoring Utilities
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