// src/app/[locale]/support/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Clock, HelpCircle, LifeBuoy } from 'lucide-react';
import SEOConfig from '@/config/seo';
import { localizations } from '@/lib/localizations';
import { getSiteUrl, LOCALE_LANGUAGE_TAGS } from '@/lib/seo/site';
import { SupportCTA } from './SupportCTA';

interface SupportPageParams {
  locale: 'en' | 'es';
}

const SUPPORT_EMAIL = 'support@123legaldoc.com';

const localizedContent = {
  en: {
    title: 'Support',
    subheading: 'How can we help you?',
    structuredDataName: '123LegalDoc Support Center',
    structuredDataDescription: 'Support options for 123LegalDoc customers, including email assistance and self-help topics.',
    metadata: {
      title: 'Customer Support | 123LegalDoc',
      description:
        'Get help with your 123LegalDoc account, templates, and billing. Contact support or review common help topics.',
      keywords: '123legaldoc support, legal document help, legal template support, customer assistance',
      ogTitle: '123LegalDoc Customer Support',
      ogDescription: 'Reach our legal document support team or browse common help topics for faster answers.',
    },
    contactCardTitle: 'Contact Us',
    helpTopicsTitle: 'Help Topics',
    helpTopics: ['Account & billing', 'Using templates', 'Editing documents', 'Privacy & security'],
    faqPrompt: 'Check our FAQ for quick answers.',
    faqCta: 'Go to FAQ →',
    hoursLabel: 'Mon–Fri, 9am–6pm (ET)',
    contactType: 'Customer Support',
  },
  es: {
    title: 'Soporte',
    subheading: '¿Cómo podemos ayudarte?',
    structuredDataName: 'Centro de Soporte de 123LegalDoc',
    structuredDataDescription:
      'Opciones de soporte para clientes de 123LegalDoc, incluyendo asistencia por correo y temas de autoayuda.',
    metadata: {
      title: 'Soporte al Cliente | 123LegalDoc',
      description:
        'Obtén ayuda con tu cuenta, plantillas y facturación de 123LegalDoc. Contacta a soporte o revisa temas de ayuda comunes.',
      keywords:
        'soporte 123legaldoc, ayuda documentos legales, soporte plantillas legales, asistencia al cliente',
      ogTitle: 'Soporte al Cliente de 123LegalDoc',
      ogDescription:
        'Contacta a nuestro equipo de soporte de documentos legales o revisa temas de ayuda comunes para respuestas rápidas.',
    },
    contactCardTitle: 'Contáctanos',
    helpTopicsTitle: 'Temas de Ayuda',
    helpTopics: ['Cuenta y facturación', 'Uso de plantillas', 'Edición de documentos', 'Privacidad y seguridad'],
    faqPrompt: 'Consulta nuestras Preguntas Frecuentes.',
    faqCta: 'Ir a FAQ →',
    hoursLabel: 'Lun–Vie, 9am–6pm (ET)',
    contactType: 'Soporte al Cliente',
  },
} as const;

function buildSupportStructuredData(locale: 'en' | 'es') {
  const siteUrl = getSiteUrl();
  const localizedUrl = `${siteUrl}/${locale}/support/`;
  const content = localizedContent[locale];

  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: content.structuredDataName,
      description: content.structuredDataDescription,
      url: localizedUrl,
      inLanguage: LOCALE_LANGUAGE_TAGS[locale],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: content.contactType,
          email: SUPPORT_EMAIL,
          areaServed: 'US',
          availableLanguage: ['en-US', 'es-US'],
          hoursAvailable: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '09:00',
              closes: '18:00',
            },
          ],
        },
      ],
    },
    null,
    0,
  ).replace(/</g, '\\u003c');
}

export async function generateMetadata({
  params,
}: {
  params: SupportPageParams;
}): Promise<Metadata> {
  const { locale } = params;

  const siteUrl = getSiteUrl();
  const metadataBase = new URL(siteUrl + '/');
  const canonicalPath = `/${locale}/support/`;
  const supportedLocales = localizations as readonly ('en' | 'es')[];
  const languageAlternates = supportedLocales.reduce<Record<string, string>>((accumulator, supportedLocale) => {
    accumulator[supportedLocale] = `${siteUrl}/${supportedLocale}/support/`;
    return accumulator;
  }, {});
  languageAlternates['x-default'] = `${siteUrl}/en/support/`;
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

export default async function SupportPage({
  params,
}: {
  params: SupportPageParams;
}) {
  const { locale } = params;
  const content = localizedContent[locale];

  const supportJsonLd = buildSupportStructuredData(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: supportJsonLd,
        }}
      />
      <main className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-center mb-6 text-foreground">{content.title}</h1>
        <p className="text-lg text-muted-foreground text-center mb-12">{content.subheading}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="shadow-lg rounded-xl bg-card border border-border">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Mail className="h-6 w-6 text-primary" aria-hidden="true" />
                <CardTitle className="text-xl font-semibold text-card-foreground">
                  {content.contactCardTitle}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-muted-foreground text-sm flex items-center gap-2">
                <Mail className="h-4 w-4" aria-hidden="true" /> {SUPPORT_EMAIL}
              </p>
              <p className="text-muted-foreground text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" aria-hidden="true" /> {content.hoursLabel}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg rounded-xl bg-card border border-border">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <LifeBuoy className="h-6 w-6 text-primary" aria-hidden="true" />
                <CardTitle className="text-xl font-semibold text-card-foreground">
                  {content.helpTopicsTitle}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground list-none space-y-2">
                {content.helpTopics.map((topic) => (
                  <li key={topic} className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-primary/70" aria-hidden="true" />
                    {topic}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center bg-secondary/50 p-6 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-3">📌 {content.faqPrompt}
          </p>
          <SupportCTA
            locale={locale}
            href={`/${locale}/faq`}
            ctaId="faq_link"
            surface="faq_prompt"
            className="inline-block text-primary hover:underline text-sm font-medium"
          >
            {content.faqCta}
          </SupportCTA>
        </div>
      </main>
    </>
  );
}
