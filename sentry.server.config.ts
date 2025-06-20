// src/sentry.server.config.ts

import * as Sentry from "@sentry/nextjs";

// Only enable Sentry if DSN is provided
if (process.env.NEXT_PUBLIC_SENTRY_DSN && process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Performance Monitoring
    tracesSampleRate: 0.1, // Capture 10% of transactions for performance monitoring
    
    // Set sampling rate for profiling
    profilesSampleRate: 0.1,
    
    // Configure environment
    environment: process.env.NODE_ENV || 'development',
    
    // Enhanced error tracking
    beforeSend(event, hint) {
      // Filter out known non-critical errors
      const error = hint.originalException;
      
      if (error instanceof Error) {
        // Don't send client-side navigation errors
        if (error.message?.includes('Navigation cancelled') || 
            error.message?.includes('Load failed')) {
          return null;
        }
        
        // Don't send network timeout errors from client
        if (error.message?.includes('fetch') && error.message?.includes('timeout')) {
          return null;
        }
      }
      
      // Add additional context for operational health integration
      if (event.contexts) {
        event.contexts.operational_health = {
          timestamp: Date.now(),
          service: '123LegalDoc',
          health_monitoring_enabled: true
        };
      }
      
      return event;
    },
    
    // Integrate with operational health monitoring
    beforeSendTransaction(event) {
      // Add performance context
      if (event.contexts) {
        event.contexts.performance = {
          service: '123LegalDoc',
          environment: process.env.NODE_ENV
        };
      }
      return event;
    },
    
    // Configure release tracking
    release: process.env.npm_package_version || '1.0.0',
    
    // Configure integrations
    integrations: [
      // Add tracing integration for better performance monitoring
      new Sentry.Integrations.Http({ tracing: true }),
    ],
    
    // Configure error filtering
    ignoreErrors: [
      // React hydration errors (common in SSR)
      'Text content does not match server-rendered HTML',
      'Hydration failed because the initial UI does not match',
      
      // Network errors that aren't actionable
      'NetworkError',
      'Load failed',
      'Failed to fetch',
      
      // Browser extension errors
      'Script error',
      'Non-Error promise rejection captured',
    ],
    
    // Configure data scrubbing for privacy
    beforeBreadcrumb(breadcrumb) {
      // Don't log sensitive API calls
      if (breadcrumb.category === 'fetch' && breadcrumb.data?.url) {
        // Scrub sensitive endpoints
        if (breadcrumb.data.url.includes('/api/auth') || 
            breadcrumb.data.url.includes('/api/user')) {
          breadcrumb.data.url = '[Filtered]';
        }
      }
      return breadcrumb;
    }
  });
  
  console.log('✅ Sentry initialized for production error tracking');
} else {
  console.log('ℹ️  Sentry disabled (set NEXT_PUBLIC_SENTRY_DSN to enable)');
}
