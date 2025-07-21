// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';

let cachedAdmin: typeof admin | null = null;

export function getAdmin(): typeof admin {
  if (cachedAdmin) {
    return cachedAdmin;
  }

  if (!admin.apps.length) {
    console.log(
      '[firebase-admin] Attempting to initialize Firebase Admin SDK...',
    );
    try {
      const serviceAccountKeyString =
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON;
      if (!serviceAccountKeyString) {
        console.error(
          '[firebase-admin] CRITICAL: FIREBASE_SERVICE_ACCOUNT_KEY_JSON environment variable is not set.',
        );
        throw new Error(
          'FIREBASE_SERVICE_ACCOUNT_KEY_JSON environment variable is not set. Firebase Admin SDK cannot be initialized.',
        );
      }

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
