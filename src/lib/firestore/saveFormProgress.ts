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
  type Timestamp // Import Timestamp type
} from 'firebase/firestore';
import { getDb } from '@/lib/firebase'; // lazily obtain Firestore instance

/* ---------- types ------------------------------------------------------- */

export interface FormProgressDoc {
  /** e.g. “Residential Lease Agreement” */
  docType: string;
  /** two‑letter state code or “NA” */
  state: string;
  /** raw field values keyed by FormField.id */
  formData: Record<string, any>; // Changed from `unknown` to `Record<string, any>`
  /** Firestore server timestamp */
  updatedAt: ReturnType<typeof serverTimestamp> | Timestamp; // Allow both server and client Timestamp
}

/* ---------- collection helpers ----------------------------------------- */

const userProgressCollection = (db: Firestore, userId: string) =>
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
  state?: string | null; // Allow null for state
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
  formData: Record<string, any>; // Ensure formData is an object
  state?: string | null; 
}): Promise<void> {
  if (!userId || !docType) {
    console.error('[saveFormProgress] Missing userId or docType. Aborting save.');
    return;
  }
  if (typeof formData !== 'object' || formData === null) {
    console.error('[saveFormProgress] formData is not an object. Aborting save. Received:', formData);
    return;
  }

  const db = await getDb();
  const ref = doc(userProgressCollection(db, userId), progressDocId({ docType, state: state || 'NA' }));
  console.log(`[saveFormProgress] Saving progress for user: ${userId}, docId: ${progressDocId({ docType, state: state || 'NA' })}`);
  await setDoc(
    ref,
    {
      docType,
      state: state || 'NA',
      formData,
      updatedAt: serverTimestamp(),
    } satisfies Partial<FormProgressDoc>, // Use satisfies for type checking without altering the object structure
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
  state?: string | null;
}): Promise<Record<string, any>> {
   if (!userId || !docType) {
    console.error('[loadFormProgress] Missing userId or docType. Cannot load draft.');
    return {};
  }
  const effectiveState = state || 'NA';
  const docIdToLoad = progressDocId({ docType, state: effectiveState });
  console.log(`[loadFormProgress] Attempting to load progress for user: ${userId}, docId: ${docIdToLoad}`);

  // Fast path — exact ID lookup
  const db = await getDb();
  const ref = doc(userProgressCollection(db, userId), docIdToLoad);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data() as FormProgressDoc;
    console.log(`[loadFormProgress] Draft found for docId: ${docIdToLoad}. Data:`, data.formData);
    return data.formData || {};
  }
  console.log(`[loadFormProgress] No exact match found for docId: ${docIdToLoad}.`);

  // Fallback: if state was provided and not found, try without state (NA)
  // This case is mostly covered if effectiveState already defaults to 'NA',
  // but good for robustness if `state` was an actual value that didn't match.
  if (state && state !== 'NA') {
    const altDocIdToLoad = progressDocId({ docType, state: 'NA' });
    console.log(`[loadFormProgress] Attempting fallback load for user: ${userId}, docId (no state): ${altDocIdToLoad}`);
    const altRef = doc(userProgressCollection(db, userId), altDocIdToLoad);
    const altSnap = await getDoc(altRef);
    if (altSnap.exists()) {
      const data = altSnap.data() as FormProgressDoc;
      console.log(`[loadFormProgress] Fallback draft found for docId (no state): ${altDocIdToLoad}. Data:`, data.formData);
      return data.formData || {};
    }
    console.log(`[loadFormProgress] No fallback draft found for docId (no state): ${altDocIdToLoad}.`);
  }
  
  console.log(`[loadFormProgress] No draft found for user ${userId}, docType ${docType}, state ${effectiveState}. Returning empty object.`);
  return {};
}

/* ---------- list‑recent ------------------------------------------------- */

/**
 * Returns the N most‑recent documents a user has worked on
 * — perfect for a “Recently used” section on the homepage.
 */
export async function listRecentProgress(
  userId: string,
  maxResults = 5
): Promise<FormProgressDoc[]> {
  if (!userId) {
    console.warn('[listRecentProgress] No userId provided. Cannot list recent progress.');
    return [];
  }
  console.log(`[listRecentProgress] Listing recent progress for user: ${userId}, max: ${maxResults}`);
  const db = await getDb();
  const q = query(
    userProgressCollection(db, userId),
    orderBy('updatedAt', 'desc'),
    limit(maxResults)
  );
  const snaps = await getDocs(q);
  const results = snaps.docs.map((d) => d.data() as FormProgressDoc);
  console.log(`[listRecentProgress] Found ${results.length} recent documents for user ${userId}.`);
  return results;
}

