// src/lib/firebase.ts
// -----------------------------------------------------------------------------
// Firebase bootstrap (client + server safe) with forced HTTP long-polling and error-only logging
// -----------------------------------------------------------------------------

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import type { Analytics } from 'firebase/analytics';
import type { Firestore } from 'firebase/firestore';

/* ------------------------------------------------------------------ */
/* Fallback config (env vars override)                                */
/* ------------------------------------------------------------------ */
const defaultFirebaseConfig = {
  apiKey: 'AIzaSyDzchJQ-4ZypZ2Tscri3VfJEN2Ocqx0hU',
  authDomain: 'legaldoc-26ea8.firebaseapp.com',
  projectId: 'legaldoc-26ea8',
  storageBucket: 'legaldoc-26ea8.appspot.com',
  messagingSenderId: '584726654660',
  appId: '1:584726654660:web:82597df4ee5bc2098ba391',
  measurementId: 'G-3VR0TDX4ZK',
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
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID || defaultFirebaseConfig.appId,
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ||
    defaultFirebaseConfig.measurementId,
});

/* ------------------------------------------------------------------ */
/* Initialize the Firebase App (only once)                            */
/* ------------------------------------------------------------------ */
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(getFirebaseConfig());
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
/* Firestore – force HTTP long-polling and show only errors           */
/* ------------------------------------------------------------------ */
let dbInstance: Firestore | null = null;
export async function getDb(): Promise<Firestore> {
  if (dbInstance) return dbInstance;

  const { initializeFirestore, setLogLevel } = await import(
    'firebase/firestore'
  );

  dbInstance = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  });

  // Suppress all Firestore logs except errors
  setLogLevel('error');

  return dbInstance;
}

/* ------------------------------------------------------------------ */
/* Exports                                                            */
/* ------------------------------------------------------------------ */
export { app };
