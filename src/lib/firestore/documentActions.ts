import { getDb } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

export async function renameDocument(
  userId: string,
  docId: string,
  name: string,
): Promise<void> {
  const db = await getDb();
  const ref = doc(db, 'users', userId, 'documents', docId);
  await updateDoc(ref, { name, updatedAt: serverTimestamp() });
}

export async function duplicateDocument(
  userId: string,
  docId: string,
): Promise<string | null> {
  const db = await getDb();
  const srcRef = doc(db, 'users', userId, 'documents', docId);
  const snap = await getDoc(srcRef);
  if (!snap.exists()) return null;
  const data = snap.data() as Record<string, unknown>;
  const newRef = doc(collection(db, 'users', userId, 'documents'));
  await setDoc(newRef, {
    ...data,
    name: `${data.name || docId} Copy`,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return newRef.id;
}

export async function softDeleteDocument(
  userId: string,
  docId: string,
): Promise<void> {
  const db = await getDb();
  const ref = doc(db, 'users', userId, 'documents', docId);
  await updateDoc(ref, { deletedAt: serverTimestamp(), updatedAt: serverTimestamp() });
}
