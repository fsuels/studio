
// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';

// Ensure this path is correct and the file is present,
// especially if deploying to environments like Vercel or Firebase Functions.
// You might need to load this from environment variables in production.
// const serviceAccount = require('../../serviceAccountKey.json'); // Path relative to this file if in the same project

if (!admin.apps.length) {
  try {
    const serviceAccountKeyString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON;
    if (!serviceAccountKeyString) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY_JSON environment variable is not set.');
    }
    const serviceAccount = JSON.parse(serviceAccountKeyString);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      // databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com` // Optional: if using Realtime Database
    });
    console.log('[firebase-admin] Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.error('[firebase-admin] Error initializing Firebase Admin SDK:', error);
    // Depending on your error handling strategy, you might re-throw or exit
  }
}

export { admin as трудоустроен_админ }; // Exporting admin with a unique alias to avoid potential conflicts
