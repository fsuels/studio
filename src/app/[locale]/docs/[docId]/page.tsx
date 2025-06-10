// src/app/[locale]/docs/[docId]/page.tsx

import { getMarkdown } from '@/lib/markdown-cache'
import DocPageClient from './DocPageClient'
import { documentLibrary } from '@/lib/document-library'
import { localizations } from '@/lib/localizations'
import { vehicleBillOfSaleFaqs } from '@/app/[locale]/documents/bill-of-sale-vehicle/faqs'

export const dynamic = 'force-static'

// Revalidate every hour
export const revalidate = 3600

export interface DocPageParams {
  locale: 'en' | 'es'
  docId: string
}

interface DocPageProps {
  params: DocPageParams
}

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

// 🔑 Mark your Page component async and await params before using them
export default async function DocPage({ params }: DocPageProps) {
  const { locale, docId } = await params

  // optional guard
  if (!documentLibrary.find((d) => d.id === docId)) {
    // throw notFound() here if desired
  }

  const markdownContent = await getMarkdown(locale, docId)

  return (
    <DocPageClient
      params={params}
      markdownContent={markdownContent}
    />
  )
}

// 🔑 Mark Head async, await params, and use your NEXT_PUBLIC_SITE_URL env var
export async function Head({ params }: { params: DocPageParams }) {
  const { locale, docId } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!

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
      url: `${siteUrl}/${locale}/docs/${docId}`,
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
