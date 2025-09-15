'use client';
// src/lib/firestore/paymentActions.ts
// Lazy-load Firestore and our firebase wrapper to keep client bundles slim

export async function createPaymentRecord({
  userId,
  docId,
  session_id,
}: {
  userId: string;
  docId: string;
  session_id: string;
}): Promise<void> {
  const [{ getDb }, { collection, addDoc, serverTimestamp }] = await Promise.all([
    import('@/lib/firebase'),
    import('firebase/firestore'),
  ]);
  const db = await getDb();
  await addDoc(collection(db, 'users', userId, 'payments'), {
    documentId: docId,
    sessionId: session_id,
    date: serverTimestamp(),
  });
}

export async function hasUserPaidForDocument(
  userId: string,
  docId: string,
): Promise<boolean> {
  const [{ getDb }, { query, collection, where, getDocs, limit }] = await Promise.all([
    import('@/lib/firebase'),
    import('firebase/firestore'),
  ]);
  const db = await getDb();
  const q = query(
    collection(db, 'users', userId, 'payments'),
    where('documentId', '==', docId),
    limit(1),
  );
  const snap = await getDocs(q);
  return !snap.empty;
}
