'use client';

import { getDb } from '@/lib/firebase';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  where,
} from 'firebase/firestore';

export async function createFolder(
  userId: string,
  name: string,
): Promise<string> {
  const db = await getDb();
  const col = collection(db, 'users', userId, 'folders');
  const q = query(col, where('name', '==', name));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    throw new Error('A folder with that name already exists.');
  }
  const folderRef = doc(col, name);
  await setDoc(folderRef, {
    name,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return folderRef.id;
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
  return snap.docs.map((d) => ({
    id: d.id,
    name: (d.data().name as string) || d.id,
  }));
}
