// src/app/[locale]/docs/[docId]/page.tsx

import { getMarkdown } from '@/lib/markdown-cache';
import DocPageClient from './DocPageClient';
import { documentLibrary } from '@/lib/document-library';
import { localizations } from '@/lib/localizations';
import { vehicleBillOfSaleFaqs } from '@/app/[locale]/(legal)/documents/bill-of-sale-vehicle/faqs';
import { resolveDocSlug } from '@/lib/slug-alias';
import { redirect } from 'next/navigation';

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

  if (!documentLibrary?.length || !localizations?.length) {
    console.warn(
      '[generateStaticParams /docs] documentLibrary or localizations empty',
    );
    return [];
  }

  const params: DocPageParams[] = [];
  for (const locale of localizations as Array<'en' | 'es'>) {
    for (const doc of documentLibrary) {
      if (doc.id && doc.id !== 'general-inquiry' && doc.schema) {
        params.push({ locale, docId: doc.id });
      }
    }
  }
  return params;
}

// 🔑 Mark your Page component async and await params before using them
export default async function DocPage({ params }: DocPageProps) {
  let { locale, docId } = await params;

  // Normalize legacy aliases to canonical slug and redirect if needed
  const canonical = resolveDocSlug(docId);
  if (canonical !== docId) {
    redirect(`/${locale}/docs/${canonical}`);
  }

  // optional guard
  if (!documentLibrary.find((d) => d.id === docId)) {
    // throw notFound() here if desired
  }

  const markdownContent = await getMarkdown(locale, docId);

  // Prepare lightweight doc meta for client to avoid bundling full library there
  const doc = documentLibrary.find((d) => d.id === docId);
  const docMeta = doc
    ? {
        id: doc.id,
        basePrice: doc.basePrice || 0,
        translations: doc.translations,
        name: doc.name,
        description: doc.description,
      }
    : { id: docId, basePrice: 0 };

  return (
    <DocPageClient
      params={{ locale, docId }}
      markdownContent={markdownContent}
      docMeta={docMeta}
    />
  );
}

// 🔑 Mark Head async, await params, and use your NEXT_PUBLIC_SITE_URL env var
export async function Head({ params }: { params: DocPageParams }) {
  const { locale, docId } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  // Find the document configuration
  const docConfig = documentLibrary.find((d) => d.id === docId);
  if (!docConfig) {
    return null;
  }

  const documentName =
    locale === 'es' && docConfig.translations?.es?.name
      ? docConfig.translations.es.name
      : docConfig.translations?.en?.name || docConfig.name;

  const documentDescription =
    locale === 'es' && docConfig.translations?.es?.description
      ? docConfig.translations.es.description
      : docConfig.translations?.en?.description || docConfig.description;

  // Use vehicle bill of sale FAQs only for that specific document
  const shouldIncludeFAQ = docId === 'vehicle-bill-of-sale' || docId === 'bill-of-sale-vehicle';
  const faqJsonLd = shouldIncludeFAQ
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: vehicleBillOfSaleFaqs.map((faq) => ({
          '@type': 'Question',
          name: locale === 'es' ? faq.questionEs : faq.questionEn,
          acceptedAnswer: {
            '@type': 'Answer',
            text: locale === 'es' ? faq.answerEs : faq.answerEn,
          },
        })),
      }
    : null;

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: documentName,
    description: documentDescription,
    offers: {
      '@type': 'Offer',
      price: docConfig.basePrice.toString(),
      priceCurrency: 'USD',
      url: `${siteUrl}/${locale}/docs/${docId}`,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '2026',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
    </>
  );
}
