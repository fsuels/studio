// src/lib/firestore/saveFormProgress.ts
// -----------------------------------------------------------------------------
// Firestore helpers for “save & resume” + “recently used” logic with long-polling fix
// -----------------------------------------------------------------------------

import type { Firestore } from 'firebase/firestore';
import type { Timestamp } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';

/* ---------- types ------------------------------------------------------- */
export interface FormProgressDoc {
  /** e.g. “Residential Lease Agreement” */
  docType: string;
  /** two-letter state code or “NA” */
  state: string;
  /** raw field values keyed by FormField.id */
  formData: Record<string, unknown>;
  /** Firestore server timestamp */
  updatedAt: ReturnType<() => Timestamp> | Timestamp;
}

/* ---------- helpers ----------------------------------------------------- */
const userProgressCollection = (db: Firestore, userId: string) =>
  db.collection?.( 'users', userId, 'documents') ??
  // fallback if using v9 modular API
  (db as any).collection('users').doc(userId).collection('documents');

const progressDocId = ({ docType, state }: { docType: string; state: string }) =>
  `${encodeURIComponent(docType)}_${state}`;

// Dynamically import Firestore functions after long-polling init
async function getFirestoreFns() {
  const mod = await import('firebase/firestore');
  return {
    collection: mod.collection,
    doc: mod.doc,
    setDoc: mod.setDoc,
    getDoc: mod.getDoc,
    getDocs: mod.getDocs,
    query: mod.query,
    orderBy: mod.orderBy,
    limit: mod.limit,
    serverTimestamp: mod.serverTimestamp,
    // types for internal use
    Timestamp: mod.Timestamp,
    Firestore: mod.Firestore,
  };
}

/* ---------- save -------------------------------------------------------- */
export async function saveFormProgress({
  userId,
  docType,
  formData,
  state = 'NA',
}: {
  userId: string;
  docType: string;
  formData: Record<string, unknown>;
  state?: string | null;
}): Promise<void> {
  if (!userId || !docType) return;

  const db = await getDb();
  const {
    collection,
    doc,
    setDoc,
    serverTimestamp,
  } = await getFirestoreFns();

  const colRef = collection(db, 'users', userId, 'documents');
  const docRef = doc(colRef, progressDocId({ docType, state }));

  await setDoc(
    docRef,
    {
      docType,
      state,
      formData,
      updatedAt: serverTimestamp(),
    } satisfies Partial<FormProgressDoc>,
    { merge: true }
  );
}

/* ---------- load -------------------------------------------------------- */
export async function loadFormProgress({
  userId,
  docType,
  state,
}: {
  userId: string;
  docType: string;
  state?: string | null;
}): Promise<Record<string, unknown>> {
  if (!userId || !docType) return {};

  const effectiveState = state || 'NA';
  const db = await getDb();
  const { collection, doc, getDoc } = await getFirestoreFns();

  const colRef = collection(db, 'users', userId, 'documents');
  const docRef = doc(colRef, progressDocId({ docType, state: effectiveState }));
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    const data = snap.data() as FormProgressDoc;
    return data.formData || {};
  }

  // fallback to generic state 'NA'
  if (state && state !== 'NA') {
    const fallbackRef = doc(colRef, progressDocId({ docType, state: 'NA' }));
    const fallbackSnap = await getDoc(fallbackRef);
    if (fallbackSnap.exists()) {
      const data = fallbackSnap.data() as FormProgressDoc;
      return data.formData || {};
    }
  }

  return {};
}

/* ---------- list-recent ------------------------------------------------- */
export async function listRecentProgress(
  userId: string,
  maxResults = 5
): Promise<FormProgressDoc[]> {
  if (!userId) return [];

  const db = await getDb();
  const { collection, query, orderBy, limit, getDocs } = await getFirestoreFns();

  const colRef = collection(db, 'users', userId, 'documents');
  const q = query(colRef, orderBy('updatedAt', 'desc'), limit(maxResults));
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => d.data() as FormProgressDoc);
}
