// src/app/[locale]/docs/[docId]/page.tsx

import { getMarkdown } from '@/lib/markdown-cache';
import DocPageClient from './DocPageClient';
import { getAllDocumentMetadata } from '@/lib/document-metadata-registry';
import { getRelatedDocuments } from '@/lib/internal-linking';
import { localizations } from '@/lib/localizations';
import { resolveDocSlug } from '@/lib/slug-alias';
import { redirect } from 'next/navigation';
import { loadWorkflowDocument } from '@/lib/workflow/document-workflow';

export const dynamic = 'force-static';

// Revalidate every hour
export const revalidate = 3600;

export interface DocPageParams {
  locale: 'en' | 'es';
  docId: string;
}

interface DocPageProps {
  params: DocPageParams;
}

export async function generateStaticParams(): Promise<DocPageParams[]> {
  if (process.env.LIMIT_SSG === 'true') {
    return [
      { locale: 'en', docId: 'affidavit-general' },
      { locale: 'es', docId: 'affidavit-general' },
      { locale: 'en', docId: 'dashboard' },
      { locale: 'es', docId: 'dashboard' },
    ];
  }

  const documentMetadata = getAllDocumentMetadata();
  if (!documentMetadata?.length || !localizations?.length) {
    console.warn(
      '[generateStaticParams /docs] documentMetadata or localizations empty',
    );
    return [];
  }

  const params: DocPageParams[] = [];
  for (const locale of localizations as Array<'en' | 'es'>) {
    for (const doc of documentMetadata) {
      if (doc.id && doc.id !== 'general-inquiry') {
        params.push({ locale, docId: doc.id });
      }
    }
  }
  return params;
}

// 🔑 Mark your Page component async and await params before using them
export default async function DocPage({ params }: DocPageProps) {
  const { locale, docId } = params;

  // Normalize legacy aliases to canonical slug and redirect if needed
  const canonical = resolveDocSlug(docId);
  if (canonical !== docId) {
    redirect(`/${locale}/docs/${canonical}/`);
  }

  const markdownContent = await getMarkdown(locale, docId);

  const doc = await loadWorkflowDocument(docId);
  const docMeta = doc
    ? {
        id: doc.id,
        basePrice: doc.basePrice || 0,
        translations: doc.translations,
        name: doc.name,
        description: doc.description,
      }
    : { id: docId, basePrice: 0 };

  // Compute related docs on the server to avoid heavy client imports
  const related = getRelatedDocuments(docId, 4).map((d) => {
    const translation = d.translations[locale] || d.translations.en;
    return {
      id: d.id,
      name: translation?.name || d.name,
      description: translation?.description || d.description,
    };
  });

  return (
    <DocPageClient
      params={{ locale, docId }}
      markdownContent={markdownContent}
      docMeta={docMeta}
      relatedDocs={related}
    />
  );
}

// 🔑 Mark Head async, await params, and use your NEXT_PUBLIC_SITE_URL env var
