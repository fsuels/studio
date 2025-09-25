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
const isBrowser = typeof window !== 'undefined';

const validateConfig = () => {
  const config = getFirebaseConfig();
  if (!config.apiKey || config.apiKey === 'YOUR_FIREBASE_API_KEY') {
    throw new Error('[firebase] Missing NEXT_PUBLIC_FIREBASE_* environment variables.');
  }
  return config;
};

let clientApp: FirebaseApp | null = null;

const ensureClientApp = (): FirebaseApp => {
  if (clientApp) return clientApp;

  const config = validateConfig();
  clientApp = getApps().length ? getApp() : initializeApp(config);
  if (isBrowser) {
    console.log('[firebase] Initialized client SDK');
  }
  return clientApp;
};

/* ------------------------------------------------------------------ */
/* Lazy Analytics (client only)                                       */
/* ------------------------------------------------------------------ */
let analytics: Analytics | null = null;
export async function getAnalyticsInstance(): Promise<Analytics | null> {
  if (analytics || !isBrowser) return analytics;
  const { getAnalytics, isSupported } = await import('firebase/analytics');
  if (await isSupported()) {
    analytics = getAnalytics(ensureClientApp());
  }
  return analytics;
}

/* ------------------------------------------------------------------ */
/* Firestore - optional HTTP long-polling and show only errors        */
/* ------------------------------------------------------------------ */
let dbInstance: Firestore | null = null;
const ensureClientDb = (): Firestore => {
  if (dbInstance) return dbInstance;

  const forcePolling =
    process.env.NEXT_PUBLIC_FIRESTORE_FORCE_POLLING === 'true';

  const settings = forcePolling
    ? { experimentalForceLongPolling: true }
    : isBrowser
      ? { experimentalAutoDetectLongPolling: true }
      : {};

  dbInstance = initializeFirestore(ensureClientApp(), settings as any);
  setLogLevel('error');
  return dbInstance;
};

export function getDb(): Firestore {
  return ensureClientDb();
}

/* ------------------------------------------------------------------ */
/* Auth - Synchronous initialization for better compatibility         */
/* ------------------------------------------------------------------ */
import { getAuth as getFirebaseAuth } from 'firebase/auth';

export function getClientAuth() {
  return getFirebaseAuth(ensureClientApp());
}

/* ------------------------------------------------------------------ */
/* Exports                                                            */
/* ------------------------------------------------------------------ */
const appProxy = new Proxy({} as FirebaseApp, {
  get(_target, prop) {
    const instance = ensureClientApp() as any;
    const value = instance[prop as keyof FirebaseApp];
    return typeof value === 'function' ? value.bind(instance) : value;
  },
});

const dbProxy = new Proxy({} as Firestore, {
  get(_target, prop) {
    const instance = ensureClientDb() as any;
    const value = instance[prop as keyof Firestore];
    return typeof value === 'function' ? value.bind(instance) : value;
  },
});

export { appProxy as app };
export { dbProxy as db };

