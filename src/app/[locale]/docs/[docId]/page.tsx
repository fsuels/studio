// src/app/[locale]/docs/[docId]/page.tsx

import { getMarkdown } from '@/lib/markdown-cache'
import DocPageClient from './DocPageClient'
import { documentLibrary } from '@/lib/document-library'
import { localizations } from '@/lib/localizations'
export const dynamic = 'force-static'
import { vehicleBillOfSaleFaqs } from '@/app/[locale]/documents/bill-of-sale-vehicle/faqs'

export interface DocPageParams {
  locale: 'en' | 'es'
  docId: string
}

interface DocPageProps {
  params: DocPageParams
}

// Revalidate every hour
export const revalidate = 3600

export async function generateStaticParams(): Promise<DocPageParams[]> {
  if (process.env.LIMIT_SSG === 'true') {
    return [
      { locale: 'en', docId: 'affidavit-general' },
      { locale: 'es', docId: 'affidavit-general' },
      { locale: 'en', docId: 'dashboard' },
      { locale: 'es', docId: 'dashboard' },
    ]
  }

  if (!documentLibrary?.length || !localizations?.length) {
    console.warn(
      '[generateStaticParams /docs] documentLibrary or localizations empty'
    )
    return []
  }

  const params: DocPageParams[] = []
  for (const locale of localizations as Array<'en' | 'es'>) {
    for (const doc of documentLibrary) {
      if (doc.id && doc.id !== 'general-inquiry' && doc.schema) {
        params.push({ locale, docId: doc.id })
      }
    }
  }
  return params
}

// 🔑 Also mark your Page component async
export default async function DocPage({ params }: DocPageProps) {
  // no-op await to satisfy Next.js
  await Promise.resolve()

  const { locale, docId } = params

  // optional guard
  if (!documentLibrary.find((d) => d.id === docId)) {
    // you can throw notFound() here if you import it from 'next/navigation'
  }

  const markdownContent = await getMarkdown(locale, docId)

  return (
    <DocPageClient
      params={params}
      markdownContent={markdownContent}
    />
  )
}

export async function Head({ params }: { params: DocPageParams }) {
  await Promise.resolve();
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
  }

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Vehicle Bill of Sale',
    description: 'Attorney-approved template for transferring a vehicle.',
    offers: {
      '@type': 'Offer',
      price: '19.95',
      priceCurrency: 'USD',
      url: `https://{domain}/${params.locale}/docs/bill-of-sale-vehicle`,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '2026',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  )
}
