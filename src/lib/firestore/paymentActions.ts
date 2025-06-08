import { getDb } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function createPaymentRecord({
  docId,
  session_id,
}: {
  docId: string;
  session_id: string;
}): Promise<void> {
  const db = await getDb();
  // you may want to get the current user’s UID instead of hard-coding
  const userId = /* derive from auth context or pass in */;
  await addDoc(collection(db, 'users', userId, 'payments'), {
    documentId: docId,
    sessionId: session_id,
    date: serverTimestamp(),
  });
}
