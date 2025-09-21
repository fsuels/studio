// src/app/[locale]/(marketing)/signwell/page.tsx
export const revalidate = 3600; // Revalidate every hour

import type { Metadata } from 'next';
import React from 'react';
import SEOConfig from '@/config/seo';
import { localizations } from '@/lib/localizations';
import { getSiteUrl, LOCALE_LANGUAGE_TAGS } from '@/lib/seo/site';
import SignWellContent from './SignWellContent';

const META = {
  en: {
    title: 'eSign Documents Online Securely | 123LegalDoc',
    description:
      'Upload, prepare, and send documents for legally binding electronic signatures with 123LegalDoc, powered by SignWell. Fast, secure, and compliant.',
    keywords:
      'electronic signature, esign service, signwell integration, legal document signing, secure esign',
    ogTitle: 'Secure Electronic Signatures with SignWell + 123LegalDoc',
    ogDescription:
      'Collect legally binding eSignatures with audit trails, secure storage, and bilingual workflows using SignWell inside 123LegalDoc.',
  },
  es: {
    title: 'Firmar Documentos Electrónicamente | 123LegalDoc',
    description:
      'Sube, prepara y envía documentos para firmas electrónicas legalmente vinculantes con 123LegalDoc y SignWell. Rápido, seguro y conforme.',
    keywords:
      'firma electrónica, servicio de firma, integración signwell, firma de documentos legales, esign seguro',
    ogTitle: 'Firmas Electrónicas Seguras con SignWell y 123LegalDoc',
    ogDescription:
      'Recibe firmas electrónicas legalmente válidas con historial de auditoría, almacenamiento seguro y flujos bilingües dentro de 123LegalDoc.',
  },
} as const;

type SupportedLocale = keyof typeof META;

interface SignWellPageProps {
  params: { locale: SupportedLocale } & Record<string, string>;
}

function resolveLocale(locale?: string): SupportedLocale {
  return locale && locale in META ? (locale as SupportedLocale) : 'en';
}

function buildSignWellStructuredData(locale: SupportedLocale): string {
  const siteUrl = getSiteUrl();
  const localizedUrl = `${siteUrl}/${locale}/signwell/`;
  const copy = META[locale];

  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: copy.title,
      description: copy.description,
      url: localizedUrl,
      inLanguage: LOCALE_LANGUAGE_TAGS[locale],
      isPartOf: {
        '@type': 'WebSite',
        name: SEOConfig.openGraph?.site_name ?? '123LegalDoc',
        url: siteUrl,
      },
      mainEntity: {
        '@type': 'Service',
        name:
          locale === 'es'
            ? 'Servicio de firma electrónica con soporte de SignWell'
            : 'Electronic signature service with SignWell support',
        serviceType: locale === 'es' ? 'Firma electrónica' : 'Electronic signature',
        provider: {
          '@type': 'Organization',
          name: '123LegalDoc',
          url: siteUrl,
          areaServed: 'US',
        },
        availableChannel: {
          '@type': 'ServiceChannel',
          serviceUrl: `${siteUrl}/${locale}/signup`,
          name: locale === 'es' ? 'Canal de autoayuda en línea' : 'Online self-help channel',
        },
      },
      potentialAction: {
        '@type': 'Action',
        name: locale === 'es' ? 'Comenzar firma electrónica segura' : 'Start secure electronic signing',
        target: `${siteUrl}/${locale}/signup`,
      },
    },
    null,
    0,
  ).replace(/</g, '\u003c');
}

export async function generateStaticParams(): Promise<Array<{ locale: SupportedLocale }>> {
  return localizations.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: SupportedLocale };
}): Promise<Metadata> {
  const localeKey = resolveLocale(params?.locale);
  const copy = META[localeKey];

  const siteUrl = getSiteUrl();
  const metadataBase = new URL(siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`);
  const canonicalPath = `/${localeKey}/signwell/`;
  const supportedLocales = localizations as readonly SupportedLocale[];
  const languageAlternates = supportedLocales.reduce<Record<string, string>>(
    (accumulator, supportedLocale) => {
      accumulator[supportedLocale] = `${siteUrl}/${supportedLocale}/signwell/`;
      return accumulator;
    },
    {},
  );
  languageAlternates['x-default'] = `${siteUrl}/en/signwell/`;
  const alternateOgLocales = supportedLocales
    .filter((supportedLocale) => supportedLocale !== localeKey)
    .map((supportedLocale) => LOCALE_LANGUAGE_TAGS[supportedLocale]);

  return {
    title: copy.title,
    description: copy.description,
    keywords: copy.keywords,
    metadataBase,
    alternates: {
      canonical: canonicalPath,
      languages: languageAlternates,
    },
    openGraph: {
      title: copy.ogTitle,
      description: copy.ogDescription,
      type: 'website',
      url: siteUrl + canonicalPath,
      siteName: SEOConfig.openGraph?.site_name ?? '123LegalDoc',
      locale: LOCALE_LANGUAGE_TAGS[localeKey],
      alternateLocale: alternateOgLocales,
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.ogTitle,
      description: copy.ogDescription,
    },
  };
}

export default async function SignWellPage({ params }: SignWellPageProps) {
  const localeKey = resolveLocale(params?.locale);
  const structuredData = buildSignWellStructuredData(localeKey);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: structuredData,
        }}
      />
      <SignWellContent locale={localeKey} />
    </div>
  );
}
