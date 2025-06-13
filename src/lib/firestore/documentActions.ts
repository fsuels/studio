'use client';

import { getDb } from '@/lib/firebase';
import { documentLibrary } from '@/lib/document-library';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  limit,
} from 'firebase/firestore';

export async function getUniqueDocumentName(
  userId: string,
  baseName: string,
): Promise<string> {
  const db = await getDb();
  let candidate = baseName;
  let counter = 1;
  while (true) {
    const q = query(
      collection(db, 'users', userId, 'documents'),
      where('name', '==', candidate),
      limit(1),
    );
    const snap = await getDocs(q);
    if (snap.empty) break;
    counter += 1;
    candidate = `${baseName} (${counter})`;
  }
  return candidate;
}

/**
 * Rename an existing user document.
 */
export async function renameDocument(
  userId: string,
  docId: string,
  name: string,
): Promise<string> {
  const db = await getDb();
  const ref = doc(db, 'users', userId, 'documents', docId);
  const uniqueName = await getUniqueDocumentName(userId, name);
  await updateDoc(ref, { name: uniqueName, updatedAt: serverTimestamp() });
  return uniqueName;
}

/**
 * Duplicate a user document and return the new document ID.
 */
export async function duplicateDocument(
  userId: string,
  docId: string,
): Promise<{ id: string; name: string } | null> {
  const db = await getDb();
  const srcRef = doc(db, 'users', userId, 'documents', docId);
  const snap = await getDoc(srcRef);
  if (!snap.exists()) return null;

  const data = snap.data() as Record<string, unknown>;
  const answers =
    (data as Record<string, unknown>)['formData'] ??
    (data as Record<string, unknown>)['data'];
  const newRef = doc(collection(db, 'users', userId, 'documents'));
  const docType =
    (data.originalDocId as string) || (data.docType as string) || docId;
  const baseConfig = documentLibrary.find((d) => d.id === docType);
  const baseName = (data.name as string) || baseConfig?.name || docId;
  const uniqueName = await getUniqueDocumentName(userId, `${baseName} Copy`);
  await setDoc(newRef, {
    ...data,
    ...(answers ? { formData: answers, data: answers } : {}),
    name: uniqueName,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { id: newRef.id, name: uniqueName };
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
    deletedAt: serverTimestamp(),
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
