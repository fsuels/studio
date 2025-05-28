// -----------------------------------------------------------------------------
// Firestore helpers for “save & resume” + “recently used” logic.
//
// • Saves progress per-user in a sub-collection   users/{uid}/documents
// • setDoc(..., { merge:true }) lets you call it repeatedly without clobbering
// • loadFormProgress retrieves the latest draft (with state fallback)
// • listRecentProgress lists the N most-recent documents for a home-page widget
// -----------------------------------------------------------------------------

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
  type Timestamp,
  type Firestore,
} from 'firebase/firestore';
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
  updatedAt: ReturnType<typeof serverTimestamp> | Timestamp;
}

/* ---------- collection helpers ----------------------------------------- */

const userProgressCollection = (db: Firestore, userId: string) => collection(db, 'users', userId, 'documents'); // <— match Dashboard

const progressDocId = ({
  docType,
  state,
}: {
  docType: string;
  state: string;
}) => `${encodeURIComponent(docType)}_${state}`;

/* ---------- save -------------------------------------------------------- */

/**
 * Save (or merge) form progress for a user.
 */
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
  if (!userId || !docType) {
    console.error(
      '[saveFormProgress] Missing userId or docType. Aborting save.',
    );
    return;
  }

  const db = await getDb();
  const ref = doc( // in saveFormProgress
    userProgressCollection(db, userId), // was userDocumentsCollection, should be userProgressCollection
    progressDocId({ docType, state }),
  );

  await setDoc(
    ref,
    {
      docType,
      state,
      formData,
      updatedAt: serverTimestamp(),
    } satisfies Partial<FormProgressDoc>,
    { merge: true },
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
}): Promise<Record<string, unknown>> {
  if (!userId || !docType) {
    console.error(
      '[loadFormProgress] Missing userId or docType. Cannot load draft.',
    );
    return {};
  }

  const effectiveState = state || 'NA';
  const db = await getDb();

  // exact-match first
  const ref = doc( // in loadFormProgress
    userProgressCollection(db, userId), // was userDocumentsCollection, should be userProgressCollection
    progressDocId({ docType, state: effectiveState }),
  );
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const data = snap.data() as FormProgressDoc;
    return data.formData || {};
  }

  // fallback to generic state 'NA'
  if (state && state !== 'NA') {
    const fallbackRef = doc(
      userProgressCollection(db, userId), // was userDocumentsCollection, should be userProgressCollection
      progressDocId({ docType, state: 'NA' }),
    );
    const fallbackSnap = await getDoc(fallbackRef);
    if (fallbackSnap.exists()) {
      const data = fallbackSnap.data() as FormProgressDoc;
      return data.formData || {};
    }
  }

  return {};
}

/* ---------- list-recent ------------------------------------------------- */

/**
 * Returns the N most-recent documents a user has worked on.
 */
export async function listRecentProgress(
  userId: string,
  maxResults = 5,
): Promise<FormProgressDoc[]> {
  if (!userId) {
    console.warn(
      '[listRecentProgress] No userId provided. Cannot list recent progress.',
    );
    return [];
  }

  const db = await getDb();
  const q = query(
    userProgressCollection(db, userId), // was userDocumentsCollection, should be userProgressCollection
    orderBy('updatedAt', 'desc'),
    limit(maxResults),
  );
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => d.data() as FormProgressDoc);
}

/* ---------- module surface --------------------------------------------- */

export { saveFormProgress, loadFormProgress, listRecentProgress };
