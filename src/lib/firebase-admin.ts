// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';

let cachedAdmin: typeof admin | null = null;

export function getAdmin(): typeof admin {
  if (cachedAdmin) {
    return cachedAdmin;
  }

  // Check if Firebase Admin service account is available
  const serviceAccountKeyString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON;

  if (!serviceAccountKeyString) {
    console.warn(
      '[firebase-admin] FIREBASE_SERVICE_ACCOUNT_KEY_JSON not set. Returning uninitialized admin instance.',
    );
    // Return the uninitialized admin instance - will fail at runtime if used
    // but won't crash the build process
    cachedAdmin = admin;
    return cachedAdmin;
  }

  if (!admin.apps.length) {
    console.log(
      '[firebase-admin] Attempting to initialize Firebase Admin SDK...',
    );
    try {
      let serviceAccount;
      try {
        serviceAccount = JSON.parse(serviceAccountKeyString);
      } catch (parseError) {
        console.error(
          '[firebase-admin] CRITICAL: Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY_JSON. Ensure it is a valid JSON string.',
          parseError,
        );
        throw new Error(
          'Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY_JSON. Firebase Admin SDK cannot be initialized.',
        );
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log(
        '[firebase-admin] Firebase Admin SDK initialized successfully.',
      );
    } catch (error) {
      console.error(
        '[firebase-admin] Error during Firebase Admin SDK initialization:',
        error,
      );
      // Re-throw the error to make it clear that initialization failed and to halt execution if necessary
      throw error;
    }
  } else {
    console.log('[firebase-admin] Firebase Admin SDK already initialized.');
  }

  cachedAdmin = admin;
  return cachedAdmin;
}

// Provide safe, lazy proxies so importing modules don't eagerly initialize Admin.
// This avoids build-time crashes when env is missing and keeps API usage unchanged.
function createLazyProxy<T extends object>(resolve: () => T): T {
  return new Proxy({} as T, {
    get(_target, prop, _receiver) {
      const instance = resolve();
      return Reflect.get(
        instance as Record<PropertyKey, unknown>,
        prop,
        instance,
      );
    },
  });
}

export const auth: admin.auth.Auth = createLazyProxy(() => getAdmin().auth());

export const adminDb: FirebaseFirestore.Firestore = createLazyProxy(() =>
  getAdmin().firestore(),
);

// Direct firestore proxy for code importing { firestore } from this module
export const firestore: FirebaseFirestore.Firestore = createLazyProxy(() =>
  getAdmin().firestore(),
);

// Storage proxy (for code expecting { adminStorage })
export const adminStorage: admin.storage.Storage = createLazyProxy(() =>
  getAdmin().storage(),
);
