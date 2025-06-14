'use client';
'use client';
// src/lib/firestore/documentActions.ts
'use client';

import { getDb } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

/**
 * Rename an existing user document.
 */
export async function renameDocument(
  userId: string,
  docId: string,
  name: string,
): Promise<void> {
  const db = await getDb();
  const colRef = collection(db, 'users', userId, 'documents');
  const q = query(colRef, where('name', '==', name));
  const snap = await getDocs(q);
  const exists = snap.docs.some((d) => d.id !== docId && !d.data().deletedAt);
  if (exists) {
    throw new Error('duplicate-name');
  }
  const ref = doc(db, 'users', userId, 'documents', docId);
  await updateDoc(ref, { name, updatedAt: serverTimestamp() });
}

/**
 * Duplicate a user document and return the new document ID.
 */
export async function duplicateDocument(
  userId: string,
  docId: string,
): Promise<string | null> {
  const db = await getDb();
  const srcRef = doc(db, 'users', userId, 'documents', docId);
  const snap = await getDoc(srcRef);
  if (!snap.exists()) return null;

  const data = snap.data() as Record<string, unknown>;
  const answers =
    (data as Record<string, unknown>)['formData'] ??
    (data as Record<string, unknown>)['data'];
  const newRef = doc(collection(db, 'users', userId, 'documents'));
  await setDoc(newRef, {
    ...data,
    ...(answers ? { formData: answers, data: answers } : {}),
    name: `${(data.name as string) || docId} Copy`,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return newRef.id;
}

/**
 * Soft-delete a user document by setting a deletedAt timestamp.
 */
export async function softDeleteDocument(
  userId: string,
  docId: string,
): Promise<void> {
  const db = await getDb();
  const ref = doc(db, 'users', userId, 'documents', docId);
  await updateDoc(ref, {
    deletedAt: Date.now(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateDocumentFolder(
  userId: string,
  docId: string,
  folderId: string | null,
): Promise<void> {
  const db = await getDb();
  const ref = doc(db, 'users', userId, 'documents', docId);
  await updateDoc(ref, { folderId: folderId || null, updatedAt: serverTimestamp() });
}

export async function bulkMoveDocuments(
  userId: string,
  docIds: string[],
  folderId: string | null,
): Promise<void> {
  const db = await getDb();
  const batch = (await import('firebase/firestore')).writeBatch(db);
  for (const id of docIds) {
    const ref = doc(db, 'users', userId, 'documents', id);
    batch.update(ref, { folderId: folderId || null, updatedAt: serverTimestamp() });
  }
  await batch.commit();
}
