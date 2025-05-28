// -----------------------------------------------------------------------------
// Firebase bootstrap (client + server safe)
// -----------------------------------------------------------------------------

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import type { Analytics } from 'firebase/analytics';
import type { Firestore } from 'firebase/firestore'; // ← keep the type only

/* ------------------------------------------------------------------ */
/* Fallback config (env vars override)                                */
/* ------------------------------------------------------------------ */

const defaultFirebaseConfig = {
  apiKey: 'AIzaSyDzchJQ-4ZypZ2Tscri3VYfJEN2Ocqx0hU',
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
/* Initialise the Firebase **App** (only once)                        */
/* ------------------------------------------------------------------ */

let app: FirebaseApp;

if (typeof window !== 'undefined') {
  // Client
  app = getApps().length ? getApp() : initializeApp(getFirebaseConfig());
} else {
  // Server / SSR
  app = getApps().length ? getApp() : initializeApp(getFirebaseConfig());
}

/* ------------------------------------------------------------------ */
/* Lazy Analytics (client only)                                       */
/* ------------------------------------------------------------------ */

let analytics: Analytics | null = null;

export async function getAnalyticsInstance(): Promise<Analytics | null> {
  if (analytics || typeof window === 'undefined') return analytics;

  const { getAnalytics, isSupported } = await import('firebase/analytics');
  if (await isSupported()) analytics = getAnalytics(app);
  return analytics;
}

/* ------------------------------------------------------------------ */
/* Firestore – force long-polling (solves WebChannel transport errors)*/
/* ------------------------------------------------------------------ */

let dbInstance: Firestore | null = null;

/**
 * Returns a singleton Firestore instance.
 * Forces long-polling so it works inside Firebase Studio / Cloud Workstations
 * where WebChannel streaming is blocked.
 */
export async function getDb(): Promise<Firestore> {
  if (dbInstance) return dbInstance;

  // Lazily load Firestore and configure long-polling **before any other import
  // can create a default instance**.
  const { initializeFirestore } = await import('firebase/firestore');

  dbInstance = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    // For SDK ≥ 11.15 you could use:
    // experimentalAutoDetectLongPolling: true,
  });

  return dbInstance;
}

/* ------------------------------------------------------------------ */
/* Exports                                                            */
/* ------------------------------------------------------------------ */

export { app };
