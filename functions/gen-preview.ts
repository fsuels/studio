import * as functions from 'firebase-functions';
import { getFirestore } from 'firebase-admin/firestore';
import { renderMarkdown } from './lib/markdown-renderer'; // your existing util

export const onDraftWrite = functions.firestore
  .document('users/{uid}/documents/{docId}')
  .onWrite(async (change, ctx) => {
    const after = change.after.data();
    if (!after?.formData) return null;             // not a draft

    // Skip if content already exists
    if (after.contentMarkdown) return null;

    const markdown = await renderMarkdown(
      after.docType,
      after.formData,
      after.state || 'NA'
    );

    return change.after.ref.set(
      { contentMarkdown: markdown },
      { merge: true }
    );
  });
