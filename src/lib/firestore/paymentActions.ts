'use client';
'use client';
// src/lib/firestore/paymentActions.ts
'use client';

import { getDb } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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
