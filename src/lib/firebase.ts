// src/lib/firebase.ts
// -----------------------------------------------------------------------------
// Firebase bootstrap (client + server safe) with optional HTTP long-polling and error-only logging
// -----------------------------------------------------------------------------

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import type { Analytics } from 'firebase/analytics';
import {
  initializeFirestore,
  setLogLevel,
  type Firestore,
} from 'firebase/firestore';

/* ------------------------------------------------------------------ */
/* Fallback config (env vars override)                                */
/* ------------------------------------------------------------------ */
const defaultFirebaseConfig = {
  apiKey: 'YOUR_FIREBASE_API_KEY',
  authDomain: 'YOUR_FIREBASE_AUTH_DOMAIN',
  projectId: 'YOUR_FIREBASE_PROJECT_ID',
  storageBucket: 'YOUR_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'YOUR_FIREBASE_APP_ID',
  measurementId: 'YOUR_FIREBASE_MEASUREMENT_ID',
};

const getFirebaseConfig = () => ({
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY || defaultFirebaseConfig.apiKey,
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    defaultFirebaseConfig.authDomain,
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    defaultFirebaseConfig.projectId,
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    defaultFirebaseConfig.storageBucket,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    defaultFirebaseConfig.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || defaultFirebaseConfig.appId,
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ||
    defaultFirebaseConfig.measurementId,
});

/* ------------------------------------------------------------------ */
/* Initialize the Firebase App (only once)                            */
/* ------------------------------------------------------------------ */
let app: FirebaseApp;
if (!getApps().length) {
  const config = getFirebaseConfig();
  app = initializeApp(config);
  console.log('[firebase] Initialized client SDK');
} else {
  app = getApp();
}

/* ------------------------------------------------------------------ */
/* Lazy Analytics (client only)                                       */
/* ------------------------------------------------------------------ */
let analytics: Analytics | null = null;
export async function getAnalyticsInstance(): Promise<Analytics | null> {
  if (analytics || typeof window === 'undefined') return analytics;
  const { getAnalytics, isSupported } = await import('firebase/analytics');
  if (await isSupported()) {
    analytics = getAnalytics(app);
  }
  return analytics;
}

/* ------------------------------------------------------------------ */
/* Firestore – optional HTTP long-polling and show only errors        */
/* ------------------------------------------------------------------ */
let dbInstance: Firestore | null = null;
export function getDb(): Firestore {
  if (dbInstance) return dbInstance;

  const forcePolling =
    process.env.NEXT_PUBLIC_FIRESTORE_FORCE_POLLING === 'true';

  /* -------------------------------------------------------------
     ?  initializeFirestore **requires** a settings object.
        If we omit it (i.e. pass `undefined`) the SDK dereferences
        `settings.cacheSizeBytes` and crashes.
     ------------------------------------------------------------- */
  // Auto-detect whether the network requires long polling. Allow forcing
  // polling via environment variable when gRPC is blocked.
  const settings = forcePolling
    ? { experimentalForceLongPolling: true }
    : { experimentalAutoDetectLongPolling: true };

  dbInstance = initializeFirestore(app, settings);

  // Suppress all Firestore logs except errors
  setLogLevel('error');

  return dbInstance;
}

/* ------------------------------------------------------------------ */
/* Auth - Synchronous initialization for better compatibility         */
/* ------------------------------------------------------------------ */
import { getAuth as getFirebaseAuth } from 'firebase/auth';

// Initialize auth synchronously to avoid timing issues
export const auth = getFirebaseAuth(app);

/* ------------------------------------------------------------------ */
/* Exports                                                            */
/* ------------------------------------------------------------------ */
export { app };
// Export a Firestore instance getter to avoid collection() errors
export const db = getDb();

