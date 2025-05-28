// src/app/[locale]/docs/[docId]/page.tsx
// This is a Server Component that defines static paths and renders the client component.

import fs from 'node:fs/promises';
import path from 'node:path';
import DocPageClient from './DocPageClient';
import { documentLibrary } from '@/lib/document-library';
import { localizations } from '@/lib/localizations'; // Ensure this path is correct
export const dynamic = 'force-dynamic';
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
  console.log('[generateStaticParams /docs] Starting generation...');
  if (!documentLibrary || documentLibrary.length === 0) {
    console.warn(
      '[generateStaticParams /docs] documentLibrary is empty or undefined. No paths will be generated.',
    );
    return [];
  }
  if (!localizations || localizations.length === 0) {
    console.warn(
      '[generateStaticParams /docs] localizations is empty or undefined. No paths will be generated.',
    );
    return [];
  }

  const params: DocPageParams[] = [];
  for (const locale of localizations) {
    for (const doc of documentLibrary) {
      // Ensure doc and doc.id are valid before pushing
      if (doc && doc.id && doc.id !== 'general-inquiry') {
        // Exclude general inquiry or other non-detail pages
        params!.push({ locale, docId: doc.id });
      } else if (!doc || !doc.id) {
        console.warn(
          `[generateStaticParams /docs] Encountered a document with missing id in locale ${locale}. Skipping.`,
        );
      }
    }
  }
  console.log(
    `[generateStaticParams /docs] Generated ${params!.length} paths.`,
  );
  return params;
}

// This Server Component now correctly passes params to the Client Component
export default async function DocPage({ params }: DocPageProps) {
  // Await a microtask to comply with Next.js dynamic param handling
  await Promise.resolve();

  const filePath = path.join(
    process.cwd(),
    'public',
    'templates',
    params.locale,
    `${params.docId}.md`,
  );
  let markdownContent: string | null = null;

  try {
    markdownContent = await fs.readFile(filePath, 'utf-8');
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') {
      console.warn(
        `Markdown template not found for ${params.docId} in locale ${params.locale}. Path: ${filePath}`,
      );
    } else {
      console.error(
        `Error reading markdown file for ${params.docId} in locale ${params.locale}. Path: ${filePath}`,
        err,
      );
    }
  }

  // The `params` prop is directly available here from Next.js
  // It's then passed down to the client component.
  return <DocPageClient params={params} markdownContent={markdownContent} />;
}

export function Head({ params }: { params: DocPageParams }) {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: vehicleBillOfSaleFaqs.map((faq, index) => ({
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
      url: 'https://{domain}/en/docs/bill-of-sale-vehicle',
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
