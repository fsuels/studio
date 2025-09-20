export interface FirebaseAuth {
  verifyIdToken(token: string): Promise<{ uid: string }>;
  getUserByEmail(email: string): Promise<{ uid: string }>;
  getUser(uid: string): Promise<{ uid: string; email?: string | null; displayName?: string | null; photoURL?: string | null }>;
}

export interface FirestoreDoc<T = unknown> {
  exists: boolean;
  data(): T | undefined;
  get(path: string): any;
}

export interface FirestoreCollectionRef<T = unknown> {
  doc(id: string): FirestoreDocRef<T>;
  get(): Promise<{ docs: Array<{ id: string; data(): T }> }>;
}

export interface FirestoreDocRef<T = unknown> {
  get(): Promise<FirestoreDoc<T>>;
  set(data: T): Promise<void>;
  update(data: Partial<T>): Promise<void>;
}

export interface Firestore {
  collection<T = unknown>(name: string): FirestoreCollectionRef<T>;
  runTransaction<T>(fn: (transaction: any) => Promise<T>): Promise<T>;
}

export interface FirebaseAdminApp {
  auth(): FirebaseAuth;
  firestore(): Firestore;
}

export declare function getAdmin(): FirebaseAdminApp;
