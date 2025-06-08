// src/app/[locale]/docs/[docId]/page.tsx
// This is a Server Component that defines static paths and renders the client component.

import React from 'react';
import { getMarkdown } from '@/lib/markdown-cache';
import DocPageClient from './DocPageClient';
import { documentLibrary } from '@/lib/document-library';
import { localizations } from '@/lib/localizations';
export const dynamic = 'force-static';
import { vehicleBillOfSaleFaqs } from '@/app/[locale]/documents/bill-of-sale-vehicle/faqs';

export interface DocPageParams {
  locale: 'en' | 'es';
  docId: string;
}

interface DocPageProps {
  params: DocPageParams;
}

// Revalidate this page every hour for fresh content while caching aggressively
export const revalidate = 3600;

// generateStaticParams is crucial for static export of dynamic routes
export async function generateStaticParams(): Promise<DocPageParams[]> {
  // 1) In CI with LIMIT_SSG, only build these “critical” pages:
  if (process.env.LIMIT_SSG === 'true') {
    return [
      { locale: 'en', docId: 'affidavit-general' },
      { locale: 'es', docId: 'affidavit-general' },
      { locale: 'en', docId: 'dashboard' },
      { locale: 'es', docId: 'dashboard' },
      // → add more page pairs here if needed
    ];
  }

  // 2) Otherwise (normal build), build them all:
  if (!documentLibrary || documentLibrary.length === 0) {
    console.warn(
      '[generateStaticParams /docs] documentLibrary is empty or undefined. No paths will be generated.'
    );
    return [];
  }
  if (!localizations || localizations.length === 0) {
    console.warn(
      '[generateStaticParams /docs] localizations is empty or undefined. No paths will be generated.'
    );
    return [];
  }

  const params: DocPageParams[] = [];
  for (const locale of localizations) {
    for (const doc of documentLibrary) {
      if (doc && doc.id && doc.id !== 'general-inquiry') {
        params.push({ locale, docId: doc.id });
      } else {
        console.warn(
          `[generateStaticParams /docs] Skipping invalid doc entry for locale ${locale}`
        );
      }
    }
  }
  return params;
}

// This Server Component now correctly passes params + markdown to the Client Component
export default async function DocPage({ params }: DocPageProps) {
  // satisfy Next.js server component requirements
  await Promise.resolve();

  const markdownContent = await getMarkdown(params.locale, params.docId);
  return (
    <DocPageClient
      params={params}
      markdownContent={markdownContent}
    />
  );
}

export function Head({ params }: { params: DocPageParams }) {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: vehicleBillOfSaleFaqs.map((faq) => ({
      '@type': 'Question',
      name: params.locale === 'es' ? faq.questionEs : faq.questionEn,
      acceptedAnswer: {
        '@type': 'Answer',
        text: params.locale === 'es' ? faq.answerEs : faq.answerEn,
      },
    })),
  };

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Vehicle Bill of Sale',
    description: 'Attorney-approved template for transferring a vehicle.',
    offers: {
      '@type': 'Offer',
      price: '19.95',
      priceCurrency: 'USD',
      url: `https://your-domain.com/${params.locale}/docs/${params.docId}`,
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
        }}
      />
    </>
  );
}
