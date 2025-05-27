// src/app/[locale]/docs/[docId]/page.tsx
// This is a Server Component that defines static paths and renders the client component.

import fs from 'node:fs/promises';
import path from 'node:path';
import DocPageClient from './DocPageClient';
import { allDocuments } from '@/lib/document-library'; // Changed from documentLibrary to allDocuments
import { localizations } from '@/lib/localizations'; // Ensure this path is correct
import { vehicleBillOfSaleFaqs } from '@/app/[locale]/documents/bill-of-sale-vehicle/faqs';
import MarkdownPreview from '@/components/MarkdownPreview'; // Added import for MarkdownPreview

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
  // Use allDocuments instead of documentLibrary
  if (!allDocuments || allDocuments.length === 0) {
    console.warn(
      '[generateStaticParams /docs] allDocuments is empty or undefined. No paths will be generated.',
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
    for (const doc of allDocuments) { // Use allDocuments
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
  // Cache param values BEFORE any await
  const { docId, locale } = params;

  // Find the document in allDocuments
  const doc = allDocuments.find((d) => d.id === docId);

  // If the document is not found, display a "Coming soon" message
  if (!doc) {
    return <h2>Coming soon</h2>;
  }

  // Determine the filePath
  // If doc and doc.templatePath exist, call doc.templatePath(locale).
  // Otherwise, fall back to path.join(process.cwd(), 'public', 'templates', locale, `${docId}.md`).
  const filePath =
    doc?.templatePath?.(locale) ??
    path.join(process.cwd(), 'public', 'templates', locale, `${docId}.md`);

  let markdownContent: string | null = null;

  try {
    markdownContent = await fs.readFile(filePath, 'utf-8');
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') {
      console.warn(
        `Markdown template not found for ${docId} in locale ${locale}. Path: ${filePath}`,
      );
      // Set markdownContent to a specific message or leave as null if preferred
      // For example: markdownContent = `# Template Not Found\n\nCould not find the document template for ${docId} in ${locale}.`;
    } else {
      console.error(
        `Error reading markdown file for ${docId} in locale ${locale}. Path: ${filePath}`,
        err,
      );
    }
  }

  // Pass docId, locale, and markdownContent to the MarkdownPreview component,
  // which is a child of DocPageClient
  return (
    <DocPageClient params={params}>
      <MarkdownPreview
        markdown={markdownContent ?? ''} // Ensure markdownContent is not null
        docId={docId}
        locale={locale} // locale is already 'en' | 'es' from DocPageParams
      />
    </DocPageClient>
  );
}

export function Head({ params }: { params: DocPageParams }) {
  // Cache params for safety, though in this sync function it's less critical
  const { locale, docId } = params; // Destructure docId as well

  // Find the document to potentially use its metadata in Head
  const doc = allDocuments.find((d) => d.id === docId);

  // Default metadata or based on doc
  const docTitle = doc?.metadata?.[locale]?.title ?? doc?.id ?? 'Document';
  const docDescription = doc?.metadata?.[locale]?.description ?? 'View and download your document.';


  const faqJsonLd = {
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
  };

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: docTitle, 
    description: docDescription,
    offers: {
      '@type': 'Offer',
      price: '19.95', // This might need to be dynamic based on doc
      priceCurrency: 'USD',
      url: `https://{domain}/${locale}/docs/${docId}`, 
    },
    aggregateRating: { // This should ideally be dynamic based on actual reviews for the doc
      '@type': 'AggregateRating',
      ratingValue: '4.8', 
      reviewCount: '2026',
    },
  };
  
  // Conditionally add FAQ if it's the vehicle bill of sale
  const scripts = [];
  if (docId === 'bill-of-sale-vehicle') {
    scripts.push(
      <script
        key="faq-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
        }}
      />
    );
  }
  scripts.push(
    <script
      key="product-json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(productJsonLd),
      }}
    />
  );


  return (
    <>
      {scripts}
    </>
  );
}
