import React from 'react';
import { documentLibrary } from '@/lib/document-library';
import { vehicleBillOfSaleFaqs } from '@/app/[locale]/(legal)/documents/bill-of-sale-vehicle/faqs';

interface DocPageParams {
  locale: 'en' | 'es';
  docId: string;
}

export default async function Head({
  params,
}: {
  params: Promise<DocPageParams>;
}) {
  const { locale, docId } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const docConfig = documentLibrary.find((d) => d.id === docId);
  if (!docConfig) return null;

  const documentName =
    locale === 'es' && docConfig.translations?.es?.name
      ? docConfig.translations.es.name
      : docConfig.translations?.en?.name || docConfig.name;

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

