import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { usStates } from '@/lib/usStates';
import SEOConfig from '@/config/seo';
import { localizations } from '@/lib/localizations';
import { getSiteUrl, LOCALE_LANGUAGE_TAGS } from '@/lib/seo/site';
import { OnlineNotaryCTA } from './OnlineNotaryCTA';

interface OnlineNotaryPageParams {
  locale: 'en' | 'es';
}

const localizedContent = {
  en: {
    heroTitle: 'Online Notary: Secure Remote Notarization in All 50 States',
    heroCta: 'Add Document',
    heroSubtitle:
      'E-sign and notarize documents from anywhere using secure video sessions that satisfy every state requirement.',
    valueCopy:
      'An online notary allows you to complete notarizations remotely through encrypted video. Your identity is verified and every session is recorded for compliance.',
    metadata: {
      title: 'Online Notary Service | Remote Online Notarization | 123LegalDoc',
      description:
        'Get documents notarized online with encrypted video sessions, compliant ID checks, and nationwide coverage.',
      keywords:
        'online notary, remote online notarization, digital notary service, online document notarization',
      ogTitle: 'Remote Online Notary for Every State',
      ogDescription:
        'Legally notarize documents online with encrypted sessions, identity verification, and instant PDF delivery.',
    },
    structuredDataName: 'Remote Online Notary Service',
    structuredDataDescription:
      'Secure remote online notarization with identity verification and digital seals compliant across the United States.',
    howItWorksHeading: 'How it works',
    howItWorksSteps: [
      'Upload the document.',
      'Connect with a notary via secure video.',
      'Pay and download the notarized document.',
    ],
    pricingHeading: 'Pricing',
    pricingCopy: '$25 for the first seal and $10 for each additional seal.',
    legalHeading: 'Legal Across the U.S.',
    legalCopy: 'Our partner service is legal in all 50 states.',
    securityHeading: 'Security & Compliance',
    securityCopy:
      'Our notary partner uses end-to-end encryption, multi-factor verification, and logs every action for compliance.',
    learnHeading: 'Learn More',
    learnLinks: [
      { hrefSuffix: 'faq', label: 'Online Notary FAQs' },
      { hrefSuffix: 'blog', label: 'Articles about remote notarization' },
    ],
  },
  es: {
    heroTitle: 'Notaría en Línea: Legal en los 50 Estados con Seguridad Garantizada',
    heroCta: 'Agregar Documento',
    heroSubtitle:
      'Firma y notariza documentos desde cualquier lugar mediante sesiones de video seguras que cumplen los requisitos estatales.',
    valueCopy:
      'Una notaría en línea te permite completar notarizaciones de forma remota mediante video cifrado. Tu identidad se verifica y cada sesión queda registrada para cumplir con la normativa.',
    metadata: {
      title: 'Servicio de Notaría en Línea | Notarización Remota | 123LegalDoc',
      description:
        'Legaliza documentos en línea con sesiones cifradas, verificación de identidad y cobertura nacional.',
      keywords:
        'notaría en línea, notarización remota, servicio notarial digital, notarizar documentos en línea',
      ogTitle: 'Notaría Remota para Todos los Estados',
      ogDescription:
        'Notariza documentos legalmente en línea con sesiones cifradas, verificación de identidad y entrega instantánea de PDFs.',
    },
    structuredDataName: 'Servicio de Notaría en Línea',
    structuredDataDescription:
      'Notarización remota segura con verificación de identidad y sellos digitales conformes en Estados Unidos.',
    howItWorksHeading: 'Cómo funciona',
    howItWorksSteps: [
      'Sube el documento.',
      'Conéctate con un notario por video seguro.',
      'Paga y descarga el documento notarizado.',
    ],
    pricingHeading: 'Precios',
    pricingCopy: '$25 por el primer sello y $10 por cada sello adicional.',
    legalHeading: 'Válido en EE. UU.',
    legalCopy: 'Nuestro servicio asociado es legal en los 50 estados.',
    securityHeading: 'Seguridad y Cumplimiento',
    securityCopy:
      'Nuestro socio notarial usa cifrado de extremo a extremo, verificación multifactor y registra cada acción para el cumplimiento.',
    learnHeading: 'Más Información',
    learnLinks: [
      { hrefSuffix: 'faq', label: 'Preguntas Frecuentes sobre Notaría en Línea' },
      { hrefSuffix: 'blog', label: 'Artículos sobre notarización remota' },
    ],
  },
} as const;

function buildOnlineNotaryStructuredData(locale: 'en' | 'es') {
  const siteUrl = getSiteUrl();
  const localizedUrl = `${siteUrl}/${locale}/online-notary/`;
  const content = localizedContent[locale];

  const steps = content.howItWorksSteps.map((step, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    name: step,
  }));

  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: content.structuredDataName,
      description: content.structuredDataDescription,
      provider: {
        '@type': 'Organization',
        name: '123LegalDoc',
        url: siteUrl,
      },
      serviceType: locale === 'es' ? 'Notaría en Línea' : 'Online Notary',
      areaServed: {
        '@type': 'Country',
        name: 'United States',
      },
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceLocation: {
          '@type': 'VirtualLocation',
          url: localizedUrl,
        },
      },
      url: localizedUrl,
      inLanguage: LOCALE_LANGUAGE_TAGS[locale],
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: '25.00',
        description: locale === 'es'
          ? '$25 por la primera notarización y $10 por cada sello adicional.'
          : '$25 for the first notarization and $10 for each additional seal.',
      },
      hasProcedure: {
        '@type': 'HowTo',
        name: locale === 'es' ? 'Cómo notarizar documentos en línea' : 'How to notarize documents online',
        step: steps,
      },
    },
    null,
    0,
  ).replace(/</g, '\\u003c');
}

export async function generateMetadata({
  params,
}: {
  params: Promise<OnlineNotaryPageParams>;
}): Promise<Metadata> {
  const { locale } = await params;

  const siteUrl = getSiteUrl();
  const metadataBase = new URL(siteUrl + '/');
  const canonicalPath = `/${locale}/online-notary/`;
  const supportedLocales = localizations as readonly ('en' | 'es')[];
  const languageAlternates = supportedLocales.reduce<Record<string, string>>((accumulator, supportedLocale) => {
    accumulator[supportedLocale] = `${siteUrl}/${supportedLocale}/online-notary/`;
    return accumulator;
  }, {});
  languageAlternates['x-default'] = `${siteUrl}/en/online-notary/`;
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

export default async function OnlineNotaryPage({
  params,
}: {
  params: Promise<OnlineNotaryPageParams>;
}) {
  const { locale } = await params;
  const content = localizedContent[locale];
  const structuredData = buildOnlineNotaryStructuredData(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: structuredData,
        }}
      />
      <main className="container mx-auto px-4 py-8 space-y-12">
        <section className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">{content.heroTitle}</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">{content.heroSubtitle}</p>
          <OnlineNotaryCTA
            locale={locale}
            href={`/${locale}/templates`}
            surface="hero"
            ctaId="add_document"
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90"
          >
            {content.heroCta}
          </OnlineNotaryCTA>
        </section>

        <section className="md:flex md:items-start gap-4">
          <div className="text-primary text-2xl" aria-hidden="true">
            🔒
          </div>
          <p className="text-muted-foreground max-w-xl">{content.valueCopy}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">{content.howItWorksHeading}</h2>
          <ol className="list-decimal ml-6 space-y-2 text-muted-foreground">
            {content.howItWorksSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">{content.pricingHeading}</h2>
          <p className="text-muted-foreground">{content.pricingCopy}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">{content.securityHeading}</h2>
          <p className="text-muted-foreground">{content.securityCopy}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">{content.legalHeading}</h2>
          <p className="text-muted-foreground mb-4">{content.legalCopy}</p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 text-sm text-muted-foreground">
            {usStates.map((s) => (
              <li key={s.value}>{s.label}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">{content.learnHeading}</h2>
          <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
            {content.learnLinks.map((link) => (
              <li key={link.hrefSuffix}>
                <Link href={`/${locale}/${link.hrefSuffix}`} className="hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
