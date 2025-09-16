// Optimized Firebase Admin SDK wrapper with lazy loading
// Reduces bundle size by dynamically importing firebase-admin only when needed

let cachedAdmin: any = null;
let adminModule: any = null;

export async function getAdmin(): Promise<any> {
  if (cachedAdmin) {
    return cachedAdmin;
  }

  // Lazy load firebase-admin
  if (!adminModule) {
    adminModule = await import('firebase-admin');
  }

  const admin = adminModule.default || adminModule;

  if (!admin.apps.length) {
    console.log('[firebase-admin] Initializing Firebase Admin SDK...');

    try {
      const serviceAccountKeyString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON;

      if (!serviceAccountKeyString) {
        console.error('[firebase-admin] FIREBASE_SERVICE_ACCOUNT_KEY_JSON not set');
        throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY_JSON environment variable is not set');
      }

      const serviceAccount = JSON.parse(serviceAccountKeyString);

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      console.log('[firebase-admin] Firebase Admin SDK initialized successfully');
    } catch (error) {
      console.error('[firebase-admin] Failed to initialize:', error);
      throw error;
    }
  }

  cachedAdmin = admin;
  return cachedAdmin;
}

// Helper functions that wrap common operations
export async function getFirestore() {
  const admin = await getAdmin();
  return admin.firestore();
}

export async function getAuth() {
  const admin = await getAdmin();
  return admin.auth();
}

export async function getStorage() {
  const admin = await getAdmin();
  return admin.storage();
}