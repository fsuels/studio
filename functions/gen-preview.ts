import * as functions from 'firebase-functions';
import { getDocumentMetadata } from './document-manifest';

function renderMarkdownPreview(
  docType: string,
  formData: Record<string, unknown>,
  locale: 'en' | 'es',
): string {
  const entries = Object.entries(formData || {});
  if (!entries.length) {
    return '';
  }

  const heading = `# ${docType}`;
  const lines = entries.map(([key, value]) => {
    if (value === undefined || value === null) {
      return `- **${key}**: ____`;
    }
    if (Array.isArray(value)) {
      const list = value.filter(Boolean).join(', ');
      return `- **${key}**: ${list || '____'}`;
    }
    return `- **${key}**: ${String(value).trim() || '____'}`;
  });

  return [heading, '', ...lines].join('\n');
}

export const onDraftWrite = functions.firestore
  .document('users/{uid}/documents/{docId}')
  .onWrite(async (change, ctx) => {
    const after = change.after.data();
    if (!after?.formData) return null;

    if (after.contentMarkdown) return null;

    const docType: string = (after.docType || '').trim();
    if (!docType) {
      functions.logger.warn('Draft missing docType; skipping preview', {
        documentPath: change.after.ref.path,
      });
      return null;
    }

    const metadata = getDocumentMetadata(docType);
    if (!metadata) {
      functions.logger.warn('Unknown docType for preview generation', {
        docType,
        documentPath: change.after.ref.path,
      });
      return null;
    }

    const requestedLocale: 'en' | 'es' = after.locale === 'es' ? 'es' : 'en';
    const locale = metadata.translations[requestedLocale]
      ? requestedLocale
      : 'en';

    const markdown = renderMarkdownPreview(docType, after.formData, locale);

    const translation = metadata.translations[locale];
    const fallbackMarkdown = `# ${translation.name}\n\n${
      translation.description || 'Preview will be available soon.'
    }`;

    return change.after.ref.set(
      {
        contentMarkdown: markdown || fallbackMarkdown,
        contentLocale: locale,
        contentTitle: translation.name,
      },
      { merge: true },
    );
  });
