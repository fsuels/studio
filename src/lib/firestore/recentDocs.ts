'use client';

//--------------------------------------------------------------
// Firestore convenience helpers for the “recently used” widget
//--------------------------------------------------------------

import { getDb } from '@/lib/firebase';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';

export interface RecentDocEntry {
  id: string; // template / document id
  name: string;
  lastOpened: number; // epoch ms
}

/* ----------------------------------------------------------- */
/*  Load the latest N items for a user                          */
/* ----------------------------------------------------------- */
export async function loadRecentDocs(
  userId: string,
  max: number = 20,
): Promise<RecentDocEntry[]> {
  const db = await getDb();
  const col = collection(db, 'users', userId, 'recentDocs');
  const q = query(col, orderBy('lastOpened', 'desc'), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as RecentDocEntry);
}

/* ----------------------------------------------------------- */
/*  Upsert one entry                                            */
/* ----------------------------------------------------------- */
export async function saveRecentDoc(
  userId: string,
  entry: RecentDocEntry,
): Promise<void> {
  const db = await getDb();
  const ref = doc(db, 'users', userId, 'recentDocs', entry.id);
  await setDoc(
    ref,
    {
      ...entry,
      lastOpened: entry.lastOpened || Date.now(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

/* ----------------------------------------------------------- */
/*  (utility) merge localStorage-based list with Firestore      */
/* ----------------------------------------------------------- */
export function mergeRecentLists(
  local: RecentDocEntry[],
  remote: RecentDocEntry[],
  max: number = 20,
): RecentDocEntry[] {
  const map = new Map<string, RecentDocEntry>();
  [...local, ...remote].forEach((e) => map.set(e.id, e));
  return Array.from(map.values())
    .sort((a, b) => b.lastOpened - a.lastOpened)
    .slice(0, max);
}
