// src/app/[locale]/faq/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import SEOConfig from '@/config/seo';
import { localizations } from '@/lib/localizations';
import { getSiteUrl, LOCALE_LANGUAGE_TAGS } from '@/lib/seo/site';

interface FaqPageParams {
  locale: 'en' | 'es';
}

const localizedContent = {
  en: {
    title: 'Frequently Asked Questions',
    description: 'Find answers to common questions about 123LegalDoc workflows, security, and billing.',
    intro: 'Find answers to common questions below.',
    searchPlaceholder: 'Search FAQs...',
    searchAriaLabel: 'Search FAQs',
    structuredDataName: '123LegalDoc Frequently Asked Questions',
    structuredDataDescription:
      'Key questions customers ask about creating, securing, and sharing legal documents with 123LegalDoc.',
    metadata: {
      title: 'Legal Document FAQs | 123LegalDoc',
      description:
        'Get quick answers about creating compliant legal documents, data security, state coverage, and plan options.',
      keywords: 'legal document faqs, document automation questions, legal templates support, legal tech help center',
      ogTitle: 'Legal Document Platform FAQ',
      ogDescription:
        'Learn how 123LegalDoc handles security, state-specific clauses, refunds, and more in our FAQ.',
    },
    faqs: [
      {
        question: 'How do I create a document?',
        answer: 'Choose a template, answer a few questions, and download your PDF.',
      },
      {
        question: 'Is my information secure?',
        answer: 'Yes. We use encryption, tenant isolation, and strict privacy practices.',
      },
      {
        question: 'Do you support all U.S. states?',
        answer: 'Yes, our templates adapt to state-specific requirements and compliance rules.',
      },
      {
        question: 'Can I edit my document after generating?',
        answer: 'Yes, customize clauses and regenerate PDFs as needed before exporting.',
      },
      {
        question: 'Do you offer refunds?',
        answer: 'If you encounter an issue, contact support within 7 days for resolution or refund options.',
      },
    ],
  },
  es: {
    title: 'Preguntas Frecuentes',
    description:
      'Encuentra respuestas a preguntas comunes sobre flujos de trabajo, seguridad y facturación de 123LegalDoc.',
    intro: 'Encuentra respuestas a preguntas comunes a continuación.',
    searchPlaceholder: 'Buscar en Preguntas Frecuentes...',
    searchAriaLabel: 'Buscar en Preguntas Frecuentes',
    structuredDataName: 'Preguntas Frecuentes de 123LegalDoc',
    structuredDataDescription:
      'Preguntas clave sobre cómo los clientes crean, protegen y comparten documentos legales con 123LegalDoc.',
    metadata: {
      title: 'Preguntas Frecuentes sobre Documentos Legales | 123LegalDoc',
      description:
        'Obtén respuestas rápidas sobre cómo crear documentos legales, seguridad de datos, cobertura estatal y opciones de planes.',
      keywords:
        'preguntas frecuentes documentos legales, preguntas automatización legal, soporte plantillas legales, ayuda legal tech',
      ogTitle: 'Preguntas Frecuentes de la Plataforma Legal',
      ogDescription:
        'Descubre cómo 123LegalDoc gestiona la seguridad, cláusulas por estado, reembolsos y más en nuestras preguntas frecuentes.',
    },
    faqs: [
      {
        question: '¿Cómo creo un documento?',
        answer: 'Elige una plantilla, responde algunas preguntas y descarga tu PDF.',
      },
      {
        question: '¿Mi información es segura?',
        answer: 'Sí. Usamos cifrado, aislamiento por inquilino y prácticas estrictas de privacidad.',
      },
      {
        question: '¿Soportan todos los estados de EE. UU.?',
        answer: 'Sí, nuestras plantillas se adaptan a los requisitos y normas de cada estado.',
      },
      {
        question: '¿Puedo editar mi documento después de generarlo?',
        answer: 'Sí, puedes personalizar cláusulas y regenerar PDFs según sea necesario antes de exportar.',
      },
      {
        question: '¿Ofrecen reembolsos?',
        answer:
          'Si tienes un problema, contacta a soporte dentro de los 7 días para obtener una resolución u opciones de reembolso.',
      },
    ],
  },
} as const;

function buildFaqStructuredData(locale: 'en' | 'es') {
  const siteUrl = getSiteUrl();
  const localizedUrl = `${siteUrl}/${locale}/faq/`;
  const content = localizedContent[locale];

  const mainEntity = content.faqs.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  }));

  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      name: content.structuredDataName,
      description: content.structuredDataDescription,
      mainEntity,
      url: localizedUrl,
    },
    null,
    0,
  ).replace(/</g, '\\u003c');
}

export async function generateMetadata({
  params,
}: {
  params: FaqPageParams;
}): Promise<Metadata> {
  const { locale } = params;

  const siteUrl = getSiteUrl();
  const metadataBase = new URL(siteUrl + '/');
  const canonicalPath = `/${locale}/faq/`;
  const supportedLocales = localizations as readonly ('en' | 'es')[];
  const languageAlternates = supportedLocales.reduce<Record<string, string>>((accumulator, supportedLocale) => {
    accumulator[supportedLocale] = `${siteUrl}/${supportedLocale}/faq/`;
    return accumulator;
  }, {});
  languageAlternates['x-default'] = `${siteUrl}/en/faq/`;
  const alternateOgLocales = supportedLocales
    .filter((supportedLocale) => supportedLocale !== locale)
    .map((supportedLocale) => LOCALE_LANGUAGE_TAGS[supportedLocale]);

  const localizedMetadata = localizedContent[locale].metadata;

  return {
    title: localizedMetadata.title,
    description: localizedMetadata.description,
    keywords: localizedMetadata.keywords,
    metadataBase,
    alternates: {
      canonical: canonicalPath,
      languages: languageAlternates,
    },
    openGraph: {
      title: localizedMetadata.ogTitle,
      description: localizedMetadata.ogDescription,
      type: 'website',
      url: siteUrl + canonicalPath,
      siteName: SEOConfig.openGraph?.site_name ?? '123LegalDoc',
      locale: LOCALE_LANGUAGE_TAGS[locale],
      alternateLocale: alternateOgLocales,
    },
    twitter: {
      card: 'summary_large_image',
      title: localizedMetadata.ogTitle,
      description: localizedMetadata.ogDescription,
    },
  };
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default async function FAQPage({ params }: { params: FaqPageParams }) {
  const { locale } = params;
  const content = localizedContent[locale];

  const faqStructuredData = buildFaqStructuredData(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: faqStructuredData,
        }}
      />
      <main className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-center mb-8 text-foreground">{content.title}</h1>
        <p className="text-lg text-muted-foreground text-center mb-12">{content.intro}</p>

        <div className="mb-6">
          <input
            type="search"
            placeholder={content.searchPlaceholder}
            className="w-full rounded-md border px-3 py-2"
            aria-label={content.searchAriaLabel}
          />
        </div>

        <div className="space-y-4">
          {content.faqs.map((item) => (
            <details key={item.question} className="bg-card border border-border rounded-lg shadow-sm p-4">
              <summary className="text-left font-semibold text-lg text-card-foreground cursor-pointer">
                {item.question}
              </summary>
              <div className="text-sm text-muted-foreground leading-relaxed pt-2">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </main>
    </>
  );
}
