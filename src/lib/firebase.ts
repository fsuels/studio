// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

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


// Initialize Analytics conditionally (client-side only)
let analytics: Analytics | null = null;
if (typeof window !== 'undefined' && app) { // Ensure app is initialized before trying to get analytics
  isSupported().then((supported) => {
    if (supported) {
      try {
        analytics = getAnalytics(app);
        console.log("Firebase Analytics initialized.");
      } catch (error) {
         console.error("Firebase Analytics initialization failed:", error);
      }

    } else {
      console.log("Firebase Analytics is not supported in this environment.");
    }
  }).catch(error => {
     console.error("Error checking Firebase Analytics support:", error);
  });
}


export { app, analytics }; // Export initialized app and analytics (which might be null)
