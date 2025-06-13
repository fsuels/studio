'use client';
'use client';
// src/lib/firestore/paymentActions.ts
'use client';

import { getDb } from '@/lib/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  limit,
} from 'firebase/firestore';

export async function createPaymentRecord({
  userId,
  docId,
  session_id,
}: {
  userId: string;
  docId: string;
  session_id: string;
}): Promise<void> {
  const db = await getDb();
  await addDoc(
    collection(db, 'users', userId, 'payments'),
    {
      documentId: docId,
      sessionId: session_id,
      date: serverTimestamp(),
    }
  );
}

export async function hasUserPaidForDocument(
  userId: string,
  docId: string,
): Promise<boolean> {
  const db = await getDb();
  const q = query(
    collection(db, 'users', userId, 'payments'),
    where('documentId', '==', docId),
    limit(1),
  );
  const snap = await getDocs(q);
  return !snap.empty;
}
