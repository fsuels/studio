'use client';
'use client';
// src/lib/firestore/saveFormProgress.ts
'use client';

/* -----------------------------------------------------------------------------
  Firestore helpers for “save & resume” + “recently used” logic
------------------------------------------------------------------------------*/

import { getDb } from '@/lib/firebase';
import type { Timestamp } from 'firebase/firestore';
import { auditService } from '@/services/firebase-audit-service';

/* ---------- types ------------------------------------------------------- */
export interface FormProgressDoc {
  /** e.g. “Residential Lease Agreement” */
  docType: string;
  /** two-letter state code or “NA” */
  state: string;
  /** raw field values keyed by FormField.id */
  formData: Record<string, unknown>;
  /** Firestore server timestamp */
  updatedAt: Timestamp;
}

/* ---------- helpers ----------------------------------------------------- */
function progressDocId(docType: string, state: string) {
  return `${encodeURIComponent(docType)}_${state}`;
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

  const db = await getDb(); // already cached singleton
  const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');

  const ref = doc(
    db,
    'users',
    userId,
    'documents',
    progressDocId(docType, state || 'NA'),
  );

  const payload: Partial<FormProgressDoc> = {
    docType,
    state: state || 'NA',
    updatedAt: serverTimestamp(),
  };
  if (Object.keys(formData || {}).length > 0) {
    payload.formData = formData;
  }

  console.debug('saveFormProgress payload', {
    userId,
    docType,
    state,
    keys: Object.keys(formData),
  });

  await setDoc(ref, payload, { merge: true });

  // Log form progress save
  await auditService.logDocumentEvent(
    'edit',
    progressDocId(docType, state || 'NA'),
    docType,
    {
      userId,
      action: 'form_save',
      state: state || 'NA',
      fieldCount: Object.keys(formData || {}).length,
      isAutoSave: true,
    },
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
  const { doc, getDoc } = await import('firebase/firestore');

  try {
    // Attempt to load the specific state
    const ref = doc(
      db,
      'users',
      userId,
      'documents',
      progressDocId(docType, effectiveState),
    );
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data() as FormProgressDoc;
      return (data?.formData as Record<string, unknown>) ?? {};
    }

    // Fallback to 'NA' if nothing for the specific state
    if (state && state !== 'NA') {
      const fallbackRef = doc(
        db,
        'users',
        userId,
        'documents',
        progressDocId(docType, 'NA'),
      );
      const fallbackSnap = await getDoc(fallbackRef);
      if (fallbackSnap.exists()) {
        const fallbackData = fallbackSnap.data() as FormProgressDoc;
        return (fallbackData?.formData as Record<string, unknown>) ?? {};
      }
    }
  } catch (err) {
    console.warn('[loadFormProgress] error, returning empty', err);
  }

  return {};
}

/* ---------- list-recent ------------------------------------------------- */
export async function listRecentProgress(
  userId: string,
  maxResults = 5,
): Promise<FormProgressDoc[]> {
  if (!userId) return [];

  const db = await getDb();
  const { collection, query, orderBy, limit, getDocs } = await import(
    'firebase/firestore'
  );

  try {
    /* -------------------------------------------------------------
       Firestore can serve this out of an index directly.
    ------------------------------------------------------------- */
    const colRef = collection(db, 'users', userId, 'documents');
    const q = query(colRef, orderBy('updatedAt', 'desc'), limit(maxResults));
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => d.data() as FormProgressDoc);
  } catch (err) {
    console.warn('[listRecentProgress] error, returning empty', err);
    return [];
  }
}
