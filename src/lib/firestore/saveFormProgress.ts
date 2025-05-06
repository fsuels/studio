// src/lib/firestore/saveFormProgress.ts
// -------------------------------------
// Firestore helpers for “save & resume” + “recently used” logic.
// – Stores progress per‑user in a sub‑collection to keep data tidy
// – Uses { merge:true } so partial saves don’t overwrite the whole doc
// – Adds a handy listRecentProgress() for the upcoming home‑page widget

import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

/* ---------- types ------------------------------------------------------- */

export interface FormProgressDoc {
  /** e.g. “Residential Lease Agreement” */
  docType: string;
  /** two‑letter state code or “NA” */
  state: string;
  /** raw field values keyed by FormField.id */
  formData: Record<string, any>;
  /** Firestore server timestamp */
  updatedAt: ReturnType<typeof serverTimestamp>;
}

/* ---------- collection helpers ----------------------------------------- */

const userProgressCollection = (userId: string) =>
  collection(db, 'users', userId, 'formProgress');

/**
 * Builds a deterministic doc‑id so one user can have
 * multiple states of the same document type without clobbering.
 */
const progressDocId = ({
  docType,
  state,
}: {
  docType: string;
  state?: string;
}) =>
  // keep IDs filesystem‑safe and compact
  `${encodeURIComponent(docType)}_${state || 'NA'}`;

/* ---------- save -------------------------------------------------------- */

/**
 * Save (or merge) form progress for a user.
 * Uses setDoc(..., { merge:true }) so you can call it on every keystroke
 * without losing previously‑saved keys.
 */
export async function saveFormProgress({
  userId,
  docType,
  formData,
  state,
}: {
  userId: string;
  docType: string;
  formData: Record<string, any>;
  state?: string; // state filter is optional
}): Promise<void> {
  const ref = doc(userProgressCollection(userId), progressDocId({ docType, state }));
  await setDoc(
    ref,
    {
      docType,
      state: state || 'NA',
      formData,
      updatedAt: serverTimestamp(),
    } satisfies Partial<FormProgressDoc>,
    { merge: true }
  );
}

/* ---------- load -------------------------------------------------------- */

/**
 * Load the *latest* saved progress for a given docType (+optional state).
 * Returns an empty object if nothing exists so calling code can spread it.
 */
export async function loadFormProgress({
  userId,
  docType,
  state,
}: {
  userId: string;
  docType: string;
  state?: string;
}): Promise<Record<string, any>> {
  // Fast path — exact ID lookup
  const ref = doc(userProgressCollection(userId), progressDocId({ docType, state }));
  const snap = await getDoc(ref);
  if (snap.exists()) return (snap.data() as FormProgressDoc).formData || {};

  // Fallback: maybe the user saved without a state filter
  if (state) {
    const altRef = doc(userProgressCollection(userId), progressDocId({ docType }));
    const altSnap = await getDoc(altRef);
    if (altSnap.exists()) return (altSnap.data() as FormProgressDoc).formData || {};
  }

  return {};
}

/* ---------- list‑recent ------------------------------------------------- */

/**
 * Returns the N most‑recent documents a user has worked on
 * — perfect for a “Recently used” section on the homepage.
 */
export async function listRecentProgress(
  userId: string,
  maxResults = 5
): Promise<FormProgressDoc[]> {
  const q = query(
    userProgressCollection(userId),
    orderBy('updatedAt', 'desc'),
    limit(maxResults)
  );
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => d.data() as FormProgressDoc);
}
