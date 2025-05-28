import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';

/**
 * Upserts a wizard draft at users/{uid}/documents/{docId}
 */
export async function saveFormProgress(
  uid: string,
  docId: string,
  data: Record<string, unknown>
) {
  if (!uid) throw new Error('UID missing');
  if (!docId) throw new Error('docId missing');

  const db = await getDb();
  await setDoc(
    doc(db, 'users', uid, 'documents', docId),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

/**
 * Load a wizard draft from users/{uid}/documents/{docId}
 */
export async function loadFormProgress(options: {
  userId: string;
  docType: string;
  state?: string;
}): Promise<Record<string, unknown> | null> {
  const { userId, docType } = options;
  if (!userId) throw new Error('userId missing');
  if (!docType) throw new Error('docType missing');

  const db = await getDb();
  const ref = doc(db, 'users', userId, 'documents', docType);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const data = snap.data() as Record<string, unknown>;
  // remove metadata fields that shouldn't be part of the form values
  delete data.updatedAt;
  return data;
}
