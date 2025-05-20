// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import type { Analytics } from "firebase/analytics";
import type { Firestore } from "firebase/firestore";

// Default Firebase configuration provided by the user
// Used as fallbacks if environment variables are not set.
const defaultFirebaseConfig = {
  apiKey: "AIzaSyDzchJQ-4ZypZ2Tscri3VYfJEN2Ocqx0hU",
  authDomain: "legaldoc-26ea8.firebaseapp.com",
  projectId: "legaldoc-26ea8",
  storageBucket: "legaldoc-26ea8.appspot.com", // Corrected potential typo from .firebasestorage.app
  messagingSenderId: "584726654660",
  appId: "1:584726654660:web:82597df4ee5bc2098ba391",
  measurementId: "G-3VR0TDX4ZK" // Optional
};

// Function to get Firebase config, prioritizing environment variables
const getFirebaseConfig = () => {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || defaultFirebaseConfig.apiKey,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || defaultFirebaseConfig.authDomain,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || defaultFirebaseConfig.projectId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || defaultFirebaseConfig.storageBucket,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || defaultFirebaseConfig.messagingSenderId,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || defaultFirebaseConfig.appId,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || defaultFirebaseConfig.measurementId
  };

  // Basic validation: Check if essential keys are present
  if (!config.apiKey || !config.projectId) {
    console.error("Firebase config error: apiKey or projectId is missing. Check environment variables or default config.");
    // Depending on requirements, you might throw an error or return null
    // For now, log the error and proceed with potentially incomplete config
    // throw new Error("Firebase configuration is incomplete.");
  }

  // Log which config source is being used (env vars or defaults)
  const usingEnvVars = Object.keys(defaultFirebaseConfig).some(key => process.env[`NEXT_PUBLIC_FIREBASE_${key.toUpperCase()}`]);
  console.log(`Firebase config loaded. Using ${usingEnvVars ? 'environment variables' : 'default values'}. Project ID: ${config.projectId}`);


  return config;
};


// Initialize Firebase App
let app: FirebaseApp;
if (typeof window !== 'undefined' && !getApps().length) {
  // Client-side initialization
  console.log("Initializing Firebase on the client...");
  try {
     const firebaseConfig = getFirebaseConfig();
     app = initializeApp(firebaseConfig);
     console.log("Firebase initialized successfully on the client.");
  } catch (error) {
     console.error("Firebase client initialization failed:", error);
     // Handle client-side initialization failure appropriately
  }

} else if (typeof window !== 'undefined') {
  // Client-side, app already initialized
  app = getApp();
   // console.log("Firebase app already initialized on the client."); // Avoid excessive logging
} else if (!getApps().length) {
   // Server-side initialization
   console.log("Initializing Firebase on the server...");
    try {
       const firebaseConfig = getFirebaseConfig();
       app = initializeApp(firebaseConfig);
       console.log("Firebase initialized successfully on the server.");
    } catch (error) {
        console.error("Firebase server initialization failed:", error);
        // Handle server-side initialization failure appropriately
        // Potentially rethrow or set app to a state indicating failure
    }
} else {
  // Server-side, app already initialized
  app = getApp();
  // console.log("Firebase app already initialized on the server."); // Avoid excessive logging
}


let analytics: Analytics | null = null;
let dbInstance: Firestore | null = null;

/**
 * Lazily load Firebase Analytics on the client.
 */
export async function getAnalyticsInstance(): Promise<Analytics | null> {
  if (analytics || typeof window === 'undefined') {
    return analytics;
  }
  const { getAnalytics, isSupported } = await import('firebase/analytics');
  if (await isSupported()) {
    analytics = getAnalytics(app);
  }
  return analytics;
}

/**
 * Lazily obtain the Firestore instance.
 */
export async function getDb(): Promise<Firestore> {
  if (dbInstance) {
    return dbInstance;
  }
  const { getFirestore } = await import('firebase/firestore');
  dbInstance = getFirestore(app);
  return dbInstance;
}

export { app };
