'use client';

import { getDb } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function createFolder(userId: string, name: string): Promise<void> {
  const db = await getDb();
  await addDoc(collection(db, 'users', userId, 'folders'), {
    name,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
