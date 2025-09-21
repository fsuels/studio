import React from 'react';
import { getDocumentMetadata } from '@/lib/document-metadata-registry';
import { vehicleBillOfSaleFaqs } from '@/app/[locale]/(legal)/documents/bill-of-sale-vehicle/faqs';

interface DocPageParams {
  locale: 'en' | 'es';
  docId: string;
}

export default async function Head({
  params,
}: {
  params: DocPageParams;
}) {
  const { locale, docId } = params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const docConfig = getDocumentMetadata(docId);
  if (!docConfig) return null;

  const documentName =
    locale === 'es' && docConfig.translations?.es?.name
      ? docConfig.translations.es.name
      : docConfig.translations?.en?.name || docConfig.title;

  const documentDescription =
    locale === 'es' && docConfig.translations?.es?.description
      ? docConfig.translations.es.description
      : docConfig.translations?.en?.description || docConfig.description;

  const shouldIncludeFAQ =
    docId === 'vehicle-bill-of-sale' || docId === 'bill-of-sale-vehicle';
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
      price: '0', // Free for now, will be updated when pricing is implemented
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

