// src/instrumentation.ts
// ─────────────────────────────────────────────────────────────
// Do NOT import Node-only modules at the top level.
// Instead, require them inside a function that only runs on the server.

import * as Sentry from '@sentry/react';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config');
  }
}

export const onRequestError = Sentry.captureRequestError;

// Lazy-load Node-only instrumentation so Turbopack does not attempt to bundle
// these dependencies for the browser or Edge runtimes.
export function registerInstrumentation() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  // These requires happen at runtime on the Node server:
  const { NodeSDK } = require('@opentelemetry/sdk-node');
  const { FirebasePerformanceInstrumentation } = require('@firebase/performance');
  const { getFirestore } = require('firebase-admin/firestore');

  const sdk = new NodeSDK({
    instrumentations: [new FirebasePerformanceInstrumentation()],
    // …other OpenTelemetry config…
  });
  sdk.start();
}
