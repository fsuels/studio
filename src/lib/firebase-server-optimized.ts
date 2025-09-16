// Server-Side Firebase Optimization for API Routes
// Minimizes Firebase bundle size in server-side routes

import type { DocumentReference, QuerySnapshot, DocumentSnapshot } from 'firebase/firestore';

// Singleton pattern for server-side Firebase operations
class ServerFirebaseOptimized {
  private static instance: ServerFirebaseOptimized;
  private firestoreModule: any = null;

  static getInstance(): ServerFirebaseOptimized {
    if (!ServerFirebaseOptimized.instance) {
      ServerFirebaseOptimized.instance = new ServerFirebaseOptimized();
    }
    return ServerFirebaseOptimized.instance;
  }

  // Lazy load Firestore module only when needed
  private async loadFirestore() {
    if (!this.firestoreModule) {
      this.firestoreModule = await import('firebase/firestore');
    }
    return this.firestoreModule;
  }

  // Get database instance with lazy loading
  async getDb() {
    const { getFirestore } = await this.loadFirestore();
    const { getApps, initializeApp } = await import('firebase/app');

    const apps = getApps();
    if (apps.length === 0) {
      const app = initializeApp({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      });
      return getFirestore(app);
    }

    return getFirestore(apps[0]);
  }

  // Optimized document operations
  async getDocument(path: string): Promise<DocumentSnapshot> {
    const [db, { doc, getDoc }] = await Promise.all([
      this.getDb(),
      this.loadFirestore()
    ]);

    const docRef = doc(db, path);
    return getDoc(docRef);
  }

  async setDocument(path: string, data: any): Promise<void> {
    const [db, { doc, setDoc }] = await Promise.all([
      this.getDb(),
      this.loadFirestore()
    ]);

    const docRef = doc(db, path);
    return setDoc(docRef, data);
  }

  async updateDocument(path: string, data: any): Promise<void> {
    const [db, { doc, updateDoc }] = await Promise.all([
      this.getDb(),
      this.loadFirestore()
    ]);

    const docRef = doc(db, path);
    return updateDoc(docRef, data);
  }

  async deleteDocument(path: string): Promise<void> {
    const [db, { doc, deleteDoc }] = await Promise.all([
      this.getDb(),
      this.loadFirestore()
    ]);

    const docRef = doc(db, path);
    return deleteDoc(docRef);
  }

  // Optimized collection operations
  async getCollection(path: string): Promise<QuerySnapshot> {
    const [db, { collection, getDocs }] = await Promise.all([
      this.getDb(),
      this.loadFirestore()
    ]);

    const collectionRef = collection(db, path);
    return getDocs(collectionRef);
  }

  async addToCollection(path: string, data: any): Promise<DocumentReference> {
    const [db, { collection, addDoc }] = await Promise.all([
      this.getDb(),
      this.loadFirestore()
    ]);

    const collectionRef = collection(db, path);
    return addDoc(collectionRef, data);
  }

  // Optimized query operations
  async queryCollection(
    path: string,
    constraints: Array<{
      type: 'where' | 'orderBy' | 'limit';
      field?: string;
      operator?: any;
      value?: any;
      direction?: 'asc' | 'desc';
      limitValue?: number;
    }>
  ): Promise<QuerySnapshot> {
    const [db, firestore] = await Promise.all([
      this.getDb(),
      this.loadFirestore()
    ]);

    const { collection, query, where, orderBy, limit: limitQuery } = firestore;
    const collectionRef = collection(db, path);

    const queryConstraints = constraints.map(constraint => {
      switch (constraint.type) {
        case 'where':
          return where(constraint.field!, constraint.operator, constraint.value);
        case 'orderBy':
          return orderBy(constraint.field!, constraint.direction || 'asc');
        case 'limit':
          return limitQuery(constraint.limitValue!);
        default:
          throw new Error(`Unknown constraint type: ${constraint.type}`);
      }
    });

    const q = query(collectionRef, ...queryConstraints);
    return firestore.getDocs(q);
  }

  // Batch operations for efficiency
  async batchOperations(operations: Array<{
    type: 'set' | 'update' | 'delete';
    path: string;
    data?: any;
  }>): Promise<void> {
    const [db, { doc, writeBatch }] = await Promise.all([
      this.getDb(),
      this.loadFirestore()
    ]);

    const batch = writeBatch(db);

    operations.forEach(operation => {
      const docRef = doc(db, operation.path);

      switch (operation.type) {
        case 'set':
          batch.set(docRef, operation.data);
          break;
        case 'update':
          batch.update(docRef, operation.data);
          break;
        case 'delete':
          batch.delete(docRef);
          break;
      }
    });

    return batch.commit();
  }

  // Server timestamp helper
  async getServerTimestamp() {
    const { serverTimestamp } = await this.loadFirestore();
    return serverTimestamp();
  }
}

// Export singleton instance
export const serverFirebase = ServerFirebaseOptimized.getInstance();

// Convenience functions for common operations
export async function getServerDocument(path: string) {
  return serverFirebase.getDocument(path);
}

export async function setServerDocument(path: string, data: any) {
  return serverFirebase.setDocument(path, data);
}

export async function updateServerDocument(path: string, data: any) {
  return serverFirebase.updateDocument(path, data);
}

export async function deleteServerDocument(path: string) {
  return serverFirebase.deleteDocument(path);
}

export async function getServerCollection(path: string) {
  return serverFirebase.getCollection(path);
}

export async function addToServerCollection(path: string, data: any) {
  return serverFirebase.addToCollection(path, data);
}

export async function queryServerCollection(
  path: string,
  constraints: Array<{
    type: 'where' | 'orderBy' | 'limit';
    field?: string;
    operator?: any;
    value?: any;
    direction?: 'asc' | 'desc';
    limitValue?: number;
  }>
) {
  return serverFirebase.queryCollection(path, constraints);
}

export async function getServerTimestamp() {
  return serverFirebase.getServerTimestamp();
}

export default serverFirebase;