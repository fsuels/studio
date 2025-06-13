'use client';

import { getDb } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

export async function createFolder(
  userId: string,
  name: string,
): Promise<string> {
  const db = await getDb();
  const docRef = await addDoc(collection(db, 'users', userId, 'folders'), {
    name,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export interface UserFolder {
  id: string;
  name: string;
}

export async function getUserFolders(userId: string): Promise<UserFolder[]> {
  const db = await getDb();
  const col = collection(db, 'users', userId, 'folders');
  const q = query(col, orderBy('createdAt', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, name: (d.data().name as string) || d.id }));
}
