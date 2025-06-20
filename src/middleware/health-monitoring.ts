// src/middleware/health-monitoring.ts
import { NextRequest, NextResponse } from 'next/server';
import { operationalHealth } from '@/lib/operational-health';

interface PerformanceData {
  startTime: number;
  route: string;
  method: string;
  userAgent?: string;
  ip?: string;
}

// Store performance data for ongoing requests
const performanceStore = new Map<string, PerformanceData>();

export function withHealthMonitoring(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const requestId = generateRequestId();
    const startTime = performance.now();
    const route = new URL(req.url).pathname;
    
    // Store request start data
    performanceStore.set(requestId, {
      startTime,
      route,
      method: req.method,
      userAgent: req.headers.get('user-agent') || undefined,
      ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined
    });

    let response: NextResponse;
    let error: Error | null = null;

    try {
      // Execute the handler
      response = await handler(req);
    } catch (err) {
      error = err instanceof Error ? err : new Error(String(err));
      
      // Create error response
      response = NextResponse.json(
        { 
          error: 'Internal Server Error',
          message: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 500 }
      );
    } finally {
      // Calculate metrics
      const endTime = performance.now();
      const duration = endTime - startTime;
      const success = !error && response.status < 400;
      
      // Record metrics
      await recordRequestMetrics(route, duration, success, response.status, error);
      
      // Clean up
      performanceStore.delete(requestId);
    }

    return response;
  };
}

async function recordRequestMetrics(
  endpoint: string,
  duration: number,
  success: boolean,
  statusCode: number,
  error: Error | null
): Promise<void> {
  try {
    // Record latency
    await operationalHealth.recordLatency(endpoint, duration, success);

    // Record additional metrics based on status code
    if (statusCode >= 500) {
      await operationalHealth.recordMetric({
        metricType: 'error_rate',
        value: 1,
        endpoint,
        metadata: { 
          statusCode, 
          errorMessage: error?.message,
          errorType: 'server_error'
        }
      });
    } else if (statusCode >= 400) {
      await operationalHealth.recordMetric({
        metricType: 'error_rate',
        value: 1,
        endpoint,
        metadata: { 
          statusCode,
          errorType: 'client_error'
        }
      });
    } else {
      await operationalHealth.recordMetric({
        metricType: 'success_rate',
        value: 1,
        endpoint,
        metadata: { statusCode }
      });
    }

    // Record specific endpoint metrics
    if (endpoint.includes('/api/generate-pdf')) {
      await operationalHealth.recordMetric({
        metricType: 'queue_depth',
        value: getCurrentPdfQueueDepth(),
        metadata: { 
          endpoint,
          operation: 'pdf_generation',
          duration,
          success
        }
      });
    }

    // Log slow requests
    if (duration > 5000) { // 5 seconds
      console.warn(`Slow request detected: ${endpoint} took ${duration.toFixed(2)}ms`);
    }

  } catch (metricError) {
    console.error('Failed to record request metrics:', metricError);
  }
}

function getCurrentPdfQueueDepth(): number {
  // This would integrate with your actual PDF generation queue
  // For now, return a simulated value
  return Math.floor(Math.random() * 10);
}

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// API Route wrapper for easy integration
export function createHealthMonitoredRoute(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return withHealthMonitoring(handler);
}

// Higher-order function for wrapping existing API routes
export function monitorApiRoute(routeHandler: any) {
  return async (req: NextRequest, context?: any) => {
    const wrappedHandler = withHealthMonitoring(async (request) => {
      // Call the original handler
      if (context) {
        return await routeHandler(request, context);
      } else {
        return await routeHandler(request);
      }
    });
    
    return wrappedHandler(req);
  };
}

// Express-style middleware for API routes
export function healthMonitoringMiddleware() {
  return (req: any, res: any, next: any) => {
    const startTime = performance.now();
    const originalSend = res.send;
    const originalJson = res.json;
    const route = req.route?.path || req.path || req.url;

    // Override response methods to capture metrics
    res.send = function(data: any) {
      recordResponseMetrics(route, startTime, this.statusCode);
      return originalSend.call(this, data);
    };

    res.json = function(data: any) {
      recordResponseMetrics(route, startTime, this.statusCode);
      return originalJson.call(this, data);
    };

    next();
  };
}

function recordResponseMetrics(route: string, startTime: number, statusCode: number) {
  const duration = performance.now() - startTime;
  const success = statusCode < 400;
  
  // Record metrics without await to avoid blocking response
  setImmediate(() => {
    recordRequestMetrics(route, duration, success, statusCode, null).catch(console.error);
  });
}

// Error boundary wrapper for React components
export function withErrorTracking<T extends object>(
  Component: React.ComponentType<T>,
  componentName?: string
) {
  return function WrappedComponent(props: T) {
    const handleError = async (error: Error, errorInfo: any) => {
      try {
        await operationalHealth.recordMetric({
          metricType: 'error_rate',
          value: 1,
          endpoint: `component:${componentName || Component.name}`,
          metadata: {
            errorMessage: error.message,
            errorStack: error.stack,
            componentStack: errorInfo.componentStack,
            errorType: 'react_error'
          }
        });
      } catch (metricError) {
        console.error('Failed to record component error:', metricError);
      }
    };

    // Simple error boundary logic
    try {
      return React.createElement(Component, props);
    } catch (error) {
      handleError(error as Error, { componentStack: 'Unknown' });
      throw error;
    }
  };
}

// Client-side performance monitoring
export function monitorClientPerformance() {
  if (typeof window === 'undefined') return;

  // Monitor page load performance
  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
        const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
        
        // Send to API endpoint
        fetch('/api/health/metrics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'client_performance',
            metrics: {
              pageLoadTime: loadTime,
              domContentLoaded,
              firstContentfulPaint: navigation.responseStart - navigation.fetchStart,
              route: window.location.pathname
            }
          })
        }).catch(console.error);
      }
    }, 1000);
  });

  // Monitor unhandled errors
  window.addEventListener('error', (event) => {
    fetch('/api/health/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'client_error',
        error: {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          route: window.location.pathname
        }
      })
    }).catch(console.error);
  });

  // Monitor unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    fetch('/api/health/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'client_error',
        error: {
          message: event.reason?.message || String(event.reason),
          type: 'unhandled_promise_rejection',
          route: window.location.pathname
        }
      })
    }).catch(console.error);
  });
}