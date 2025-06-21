// src/sentry.edge.config.ts

import * as Sentry from '@sentry/nextjs';

// Only enable Sentry if DSN is provided
if (
  process.env.NEXT_PUBLIC_SENTRY_DSN &&
  process.env.NODE_ENV === 'production'
) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Performance Monitoring (reduced for edge runtime)
    tracesSampleRate: 0.05, // Lower sampling for edge functions

    // Configure environment
    environment: process.env.NODE_ENV || 'development',

    // Enhanced error tracking for edge runtime
    beforeSend(event, hint) {
      // Filter out edge runtime specific non-critical errors
      const error = hint.originalException;

      if (error instanceof Error) {
        // Don't send edge runtime cold start errors
        if (
          error.message?.includes('cold start') ||
          error.message?.includes('edge runtime')
        ) {
          return null;
        }
      }

      // Add edge runtime context
      if (event.contexts) {
        event.contexts.runtime = {
          type: 'edge',
          service: '123LegalDoc',
          timestamp: Date.now(),
        };
      }

      return event;
    },

    // Configure release tracking
    release: process.env.npm_package_version || '1.0.0',

    // Minimal integrations for edge runtime
    integrations: [
      // Only essential integrations for edge runtime
    ],

    // Configure error filtering for edge runtime
    ignoreErrors: [
      // Edge runtime specific errors
      'Edge runtime error',
      'Cold start timeout',

      // Network errors that aren't actionable
      'NetworkError',
      'Load failed',
      'Failed to fetch',
    ],
  });

  console.log('✅ Sentry initialized for edge runtime');
} else {
  console.log(
    'ℹ️  Sentry edge runtime disabled (set NEXT_PUBLIC_SENTRY_DSN to enable)',
  );
}
