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
import { auditService } from '@/services/firebase-audit-service';

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

  // Log document rename
  await auditService.logDocumentEvent('edit', docId, 'document', {
    userId,
    action: 'rename',
    newName: name,
    oldName: 'unknown', // We could fetch this if needed
  });
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

  // Log document duplication
  await auditService.logDocumentEvent(
    'create',
    newRef.id,
    (data.docType as string) || 'document',
    {
      userId,
      action: 'duplicate',
      originalDocId: docId,
      originalName: (data.name as string) || docId,
    },
  );

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
    deletedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Log document deletion
  await auditService.logDocumentEvent('delete', docId, 'document', {
    userId,
    action: 'soft_delete',
  });
}

/**
 * Bulk soft-delete multiple user documents by setting deletedAt timestamp.
 */
export async function bulkSoftDeleteDocuments(
  userId: string,
  docIds: string[],
): Promise<void> {
  const db = await getDb();
  const promises = docIds.map(async (docId) => {
    const ref = doc(db, 'users', userId, 'documents', docId);
    await updateDoc(ref, {
      deletedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Log document deletion
    await auditService.logDocumentEvent('delete', docId, 'document', {
      userId,
      action: 'bulk_soft_delete',
    });
  });

  await Promise.all(promises);
}

export async function updateDocumentFolder(
  userId: string,
  docId: string,
  folderId: string | null,
): Promise<void> {
  const db = await getDb();
  const ref = doc(db, 'users', userId, 'documents', docId);
  await updateDoc(ref, {
    folderId: folderId || null,
    updatedAt: serverTimestamp(),
  });

  // Log document folder change
  await auditService.logDocumentEvent('edit', docId, 'document', {
    userId,
    action: 'move_folder',
    newFolderId: folderId || 'root',
    oldFolderId: 'unknown', // We could fetch this if needed
  });
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
    batch.update(ref, {
      folderId: folderId || null,
      updatedAt: serverTimestamp(),
    });
  }
  await batch.commit();

  // Log bulk document move
  await auditService.logDocumentEvent(
    'edit',
    `bulk-${Date.now()}`,
    'document',
    {
      userId,
      action: 'bulk_move',
      documentIds: docIds,
      newFolderId: folderId || 'root',
      count: docIds.length,
    },
  );
}
