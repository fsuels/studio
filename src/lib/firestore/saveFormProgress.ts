import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
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
