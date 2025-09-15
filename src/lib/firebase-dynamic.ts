// Dynamic Firebase Service - Lazy loading for optimal bundle splitting
// Reduces initial bundle size by ~300KB by loading Firebase modules on demand

import type {
  FirebaseApp,
  FirebaseOptions
} from 'firebase/app';

import type {
  Firestore,
  DocumentReference,
  CollectionReference,
  QuerySnapshot,
  DocumentSnapshot
} from 'firebase/firestore';

import type {
  Auth,
  User,
  UserCredential
} from 'firebase/auth';

// Cached module promises to avoid duplicate imports
let firebaseAppPromise: Promise<typeof import('firebase/app')> | null = null;
let firestorePromise: Promise<typeof import('firebase/firestore')> | null = null;
let authPromise: Promise<typeof import('firebase/auth')> | null = null;
let storagePromise: Promise<typeof import('firebase/storage')> | null = null;

// Cached instances
let appInstance: FirebaseApp | null = null;
let firestoreInstance: Firestore | null = null;
let authInstance: Auth | null = null;

/**
 * Firebase configuration
 */
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Dynamic Firebase App loader
 */
async function loadFirebaseApp() {
  if (!firebaseAppPromise) {
    firebaseAppPromise = import('firebase/app');
  }
  return firebaseAppPromise;
}

/**
 * Dynamic Firestore loader
 */
async function loadFirestore() {
  if (!firestorePromise) {
    firestorePromise = import('firebase/firestore');
  }
  return firestorePromise;
}

/**
 * Dynamic Auth loader
 */
async function loadAuth() {
  if (!authPromise) {
    authPromise = import('firebase/auth');
  }
  return authPromise;
}

/**
 * Dynamic Storage loader
 */
async function loadStorage() {
  if (!storagePromise) {
    storagePromise = import('firebase/storage');
  }
  return storagePromise;
}

/**
 * Initialize Firebase App (lazy)
 */
async function getApp(): Promise<FirebaseApp> {
  if (appInstance) return appInstance;

  const { initializeApp, getApps } = await loadFirebaseApp();

  // Check if app already exists
  const existingApps = getApps();
  if (existingApps.length > 0) {
    appInstance = existingApps[0];
    return appInstance;
  }

  appInstance = initializeApp(firebaseConfig);
  return appInstance;
}

/**
 * Firebase Dynamic Service Class
 */
export class FirebaseDynamicService {
  private static instance: FirebaseDynamicService;

  static getInstance(): FirebaseDynamicService {
    if (!FirebaseDynamicService.instance) {
      FirebaseDynamicService.instance = new FirebaseDynamicService();
    }
    return FirebaseDynamicService.instance;
  }

  /**
   * Get Firestore instance (lazy)
   */
  async getFirestore(): Promise<Firestore> {
    if (firestoreInstance) return firestoreInstance;

    const [app, { getFirestore }] = await Promise.all([
      getApp(),
      loadFirestore()
    ]);

    firestoreInstance = getFirestore(app);
    return firestoreInstance;
  }

  /**
   * Get Auth instance (lazy)
   */
  async getAuth(): Promise<Auth> {
    if (authInstance) return authInstance;

    const [app, { getAuth }] = await Promise.all([
      getApp(),
      loadAuth()
    ]);

    authInstance = getAuth(app);
    return authInstance;
  }

  /**
   * Firestore operations with dynamic loading
   */
  async doc(path: string): Promise<DocumentReference> {
    const [db, { doc }] = await Promise.all([
      this.getFirestore(),
      loadFirestore()
    ]);
    return doc(db, path);
  }

  async collection(path: string): Promise<CollectionReference> {
    const [db, { collection }] = await Promise.all([
      this.getFirestore(),
      loadFirestore()
    ]);
    return collection(db, path);
  }

  async getDoc(docRef: DocumentReference): Promise<DocumentSnapshot> {
    const { getDoc } = await loadFirestore();
    return getDoc(docRef);
  }

  async getDocs(query: any): Promise<QuerySnapshot> {
    const { getDocs } = await loadFirestore();
    return getDocs(query);
  }

  async setDoc(docRef: DocumentReference, data: any, options?: any): Promise<void> {
    const { setDoc } = await loadFirestore();
    return setDoc(docRef, data, options);
  }

  async updateDoc(docRef: DocumentReference, data: any): Promise<void> {
    const { updateDoc } = await loadFirestore();
    return updateDoc(docRef, data);
  }

  async deleteDoc(docRef: DocumentReference): Promise<void> {
    const { deleteDoc } = await loadFirestore();
    return deleteDoc(docRef);
  }

  async addDoc(collection: CollectionReference, data: any): Promise<DocumentReference> {
    const { addDoc } = await loadFirestore();
    return addDoc(collection, data);
  }

  /**
   * Auth operations with dynamic loading
   */
  async signInWithEmailAndPassword(email: string, password: string): Promise<UserCredential> {
    const [auth, { signInWithEmailAndPassword }] = await Promise.all([
      this.getAuth(),
      loadAuth()
    ]);
    return signInWithEmailAndPassword(auth, email, password);
  }

  async createUserWithEmailAndPassword(email: string, password: string): Promise<UserCredential> {
    const [auth, { createUserWithEmailAndPassword }] = await Promise.all([
      this.getAuth(),
      loadAuth()
    ]);
    return createUserWithEmailAndPassword(auth, email, password);
  }

  async signOut(): Promise<void> {
    const [auth, { signOut }] = await Promise.all([
      this.getAuth(),
      loadAuth()
    ]);
    return signOut(auth);
  }

  async onAuthStateChanged(callback: (user: User | null) => void): Promise<() => void> {
    const [auth, { onAuthStateChanged }] = await Promise.all([
      this.getAuth(),
      loadAuth()
    ]);
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Storage operations with dynamic loading
   */
  async getStorage() {
    const [app, { getStorage }] = await Promise.all([
      getApp(),
      loadStorage()
    ]);
    return getStorage(app);
  }

  async ref(storage: any, path: string) {
    const { ref } = await loadStorage();
    return ref(storage, path);
  }

  async uploadBytes(storageRef: any, data: any) {
    const { uploadBytes } = await loadStorage();
    return uploadBytes(storageRef, data);
  }

  async getDownloadURL(storageRef: any) {
    const { getDownloadURL } = await loadStorage();
    return getDownloadURL(storageRef);
  }

  /**
   * Real-time listeners with dynamic loading
   */
  async onSnapshot(query: any, callback: (snapshot: any) => void) {
    const { onSnapshot } = await loadFirestore();
    return onSnapshot(query, callback);
  }

  /**
   * Query building with dynamic loading
   */
  async where(fieldPath: string, opStr: any, value: any) {
    const { where } = await loadFirestore();
    return where(fieldPath, opStr, value);
  }

  async orderBy(fieldPath: string, directionStr?: 'asc' | 'desc') {
    const { orderBy } = await loadFirestore();
    return orderBy(fieldPath, directionStr);
  }

  async limit(limit: number) {
    const { limit: limitQuery } = await loadFirestore();
    return limitQuery(limit);
  }

  async query(collectionRef: CollectionReference, ...queryConstraints: any[]) {
    const { query } = await loadFirestore();
    return query(collectionRef, ...queryConstraints);
  }
}

// Singleton instance
export const firebaseDynamic = FirebaseDynamicService.getInstance();

/**
 * Convenience functions for common operations
 */

/**
 * Get database with lazy loading
 */
export async function getDb(): Promise<Firestore> {
  return firebaseDynamic.getFirestore();
}

/**
 * Get auth with lazy loading
 */
export async function getAuthInstance(): Promise<Auth> {
  return firebaseDynamic.getAuth();
}

/**
 * Document operations
 */
export async function getDocument(path: string) {
  const docRef = await firebaseDynamic.doc(path);
  return firebaseDynamic.getDoc(docRef);
}

export async function setDocument(path: string, data: any, options?: any) {
  const docRef = await firebaseDynamic.doc(path);
  return firebaseDynamic.setDoc(docRef, data, options);
}

export async function updateDocument(path: string, data: any) {
  const docRef = await firebaseDynamic.doc(path);
  return firebaseDynamic.updateDoc(docRef, data);
}

export async function deleteDocument(path: string) {
  const docRef = await firebaseDynamic.doc(path);
  return firebaseDynamic.deleteDoc(docRef);
}

/**
 * Collection operations
 */
export async function getCollection(path: string) {
  const collectionRef = await firebaseDynamic.collection(path);
  return firebaseDynamic.getDocs(collectionRef);
}

export async function addToCollection(path: string, data: any) {
  const collectionRef = await firebaseDynamic.collection(path);
  return firebaseDynamic.addDoc(collectionRef, data);
}

/**
 * Preload Firebase modules for critical operations
 */
export async function preloadFirebaseModules(modules: ('app' | 'firestore' | 'auth' | 'storage')[] = ['app', 'firestore']) {
  const promises: Promise<any>[] = [];

  if (modules.includes('app')) {
    promises.push(loadFirebaseApp());
  }
  if (modules.includes('firestore')) {
    promises.push(loadFirestore());
  }
  if (modules.includes('auth')) {
    promises.push(loadAuth());
  }
  if (modules.includes('storage')) {
    promises.push(loadStorage());
  }

  await Promise.all(promises);
}

export default firebaseDynamic;