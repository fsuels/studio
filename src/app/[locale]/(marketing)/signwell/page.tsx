// src/app/[locale]/signwell/page.tsx
export const revalidate = 3600; // Revalidate every hour

import type { Metadata } from 'next';
import React from 'react';
import SEOConfig from '@/config/seo';
import { localizations } from '@/lib/localizations';
import { getSiteUrl, LOCALE_LANGUAGE_TAGS } from '@/lib/seo/site';

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
  params: Promise<{ locale: SupportedLocale } & Record<string, string>>;
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
        name:
          locale === 'es'
            ? 'Comenzar firma electrónica segura'
            : 'Start secure electronic signing',
        target: `${siteUrl}/${locale}/signup`,
      },
    },
    null,
    0,
  ).replace(/</g, '\u003c');
}

export async function generateStaticParams() {
  return (localizations as SupportedLocale[]).map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: SupportedLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const copy = META[locale] ?? META.en;

  const siteUrl = getSiteUrl();
  const metadataBase = new URL(siteUrl + '/');
  const canonicalPath = `/${locale}/signwell/`;
  const supportedLocales = localizations as readonly SupportedLocale[];
  const languageAlternates = supportedLocales.reduce<Record<string, string>>((accumulator, supportedLocale) => {
    accumulator[supportedLocale] = `${siteUrl}/${supportedLocale}/signwell/`;
    return accumulator;
  }, {});
  languageAlternates['x-default'] = `${siteUrl}/en/signwell/`;
  const alternateOgLocales = supportedLocales
    .filter((supportedLocale) => supportedLocale !== locale)
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
      locale: LOCALE_LANGUAGE_TAGS[locale],
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
  const { locale } = await params;
  const localeKey: SupportedLocale = locale in META ? locale : 'en';
  const structuredData = buildSignWellStructuredData(localeKey);
  const t = (en: string, es?: string) => (localeKey === 'es' && es ? es : en);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: structuredData,
        }}
      />
      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Hero */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            {t('eSign Documents Online', 'Firmar Documentos en Línea')}
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            {t(
              'Upload, prepare, and send documents for legally binding e-signatures. Fast, secure, and compliant across the U.S.',
              'Sube, prepara y envía documentos para firmas electrónicas legalmente vinculantes. Rápido, seguro y conforme en EE. UU.',
            )}
          </p>
          <div className="flex justify-center gap-3">
            <a
              href={`/${localeKey}/signup`}
              className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90"
            >
              {t('Start eSigning', 'Comenzar Firma')}
            </a>
            <a
              href={`/${localeKey}/templates`}
              className="inline-flex items-center justify-center rounded-md border border-primary text-primary px-4 py-2 bg-white hover:bg-primary/5"
            >
              {t('Browse Templates', 'Explorar Plantillas')}
            </a>
          </div>
        </section>

        {/* Benefits */}
        <section className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: t('Legally Binding', 'Legalmente Válido'),
              desc: t('Meets U.S. ESIGN and UETA requirements.', 'Cumple con ESIGN y UETA en EE. UU.'),
            },
            {
              title: t('Secure & Private', 'Seguro y Privado'),
              desc: t('Encrypted storage and access controls.', 'Almacenamiento cifrado y controles de acceso.'),
            },
            {
              title: t('Easy to Use', 'Fácil de Usar'),
              desc: t('Guide signers step-by-step on any device.', 'Guía a los firmantes paso a paso en cualquier dispositivo.'),
            },
          ].map((benefit, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{benefit.title}</h3>
              <p className="text-sm text-gray-700">{benefit.desc}</p>
            </div>
          ))}
        </section>

        {/* How it works */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
            {t('How It Works', 'Cómo Funciona')}
          </h2>
          <ol className="grid md:grid-cols-3 gap-4 text-sm text-gray-800">
            <li className="bg-white p-4 rounded-lg border">1) {t('Upload your document', 'Sube tu documento')}</li>
            <li className="bg-white p-4 rounded-lg border">2) {t('Add fields and recipients', 'Agrega campos y destinatarios')}</li>
            <li className="bg-white p-4 rounded-lg border">3) {t('Send for signature and download', 'Envía para firmar y descarga')}</li>
          </ol>
        </section>

        {/* Compliance blurb */}
        <section className="text-center bg-white p-8 rounded-lg border max-w-3xl mx-auto space-y-3">
          <p className="text-sm text-gray-700">
            {t(
              'Built with leading eSignature infrastructure. Compliant with ESIGN, UETA and industry best practices.',
              'Construido con infraestructura líder de firmas electrónicas. Cumple con ESIGN, UETA y mejores prácticas.',
            )}
          </p>
          <p className="text-xs text-gray-500">
            {t(
              '123LegalDoc provides self-help services and does not offer legal advice. Using SignWell with 123LegalDoc does not create an attorney-client relationship.',
              '123LegalDoc ofrece servicios de autoayuda y no brinda asesoría legal. El uso de SignWell con 123LegalDoc no crea una relación abogado-cliente.',
            )}
          </p>
        </section>
      </div>
    </div>
  );
}
