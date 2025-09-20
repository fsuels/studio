// src/app/[locale]/partners/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import { ArrowRight, Building2, Plug, Users } from 'lucide-react';
import SEOConfig from '@/config/seo';
import { localizations } from '@/lib/localizations';
import { getSiteUrl, LOCALE_LANGUAGE_TAGS } from '@/lib/seo/site';
import { PartnersCTA } from './PartnersCTA';

interface PartnersPageParams {
  locale: 'en' | 'es';
}

const localizedContent = {
  en: {
    heroTitle: 'Partner with 123LegalDoc',
    heroIntro:
      'Join our partner ecosystem to deliver compliant legal documents, integrations, and managed services to your clients.',
    metadata: {
      title: 'Partner Programs | 123LegalDoc',
      description:
        'Explore referral, reseller, and integration partnerships with 123LegalDoc to bring automated legal workflows to your customers.',
      keywords:
        'legal document partners, 123legaldoc partner program, legal tech integrations, document automation partners',
      ogTitle: '123LegalDoc Partner Ecosystem',
      ogDescription:
        'Collaborate with 123LegalDoc through referral, reseller, and integration programs to expand legal document offerings.',
    },
    structuredDataName: '123LegalDoc Partner Programs',
    structuredDataDescription:
      'Referral, reseller, and integration partner opportunities with 123LegalDoc for legal professionals and platforms.',
    programs: [
      {
        icon: <Users className="h-6 w-6 text-primary" aria-hidden="true" />,
        name: 'Referral Partners',
        description:
          'Introduce your audience to 123LegalDoc and earn commissions while they build compliant legal documents.',
      },
      {
        icon: <Building2 className="h-6 w-6 text-primary" aria-hidden="true" />,
        name: 'Reseller & White Label',
        description:
          'Embed our workflows within your practice or platform, complete with co-branded experiences and analytics.',
      },
      {
        icon: <Plug className="h-6 w-6 text-primary" aria-hidden="true" />,
        name: 'Integration Partners',
        description:
          'Connect 123LegalDoc to CRMs, document management systems, and signature tools with secure APIs.',
      },
    ],
    ctaPrimary: {
      label: 'Become a Partner',
      href: 'mailto:partners@123legaldoc.com',
    },
    ctaSecondary: {
      label: 'See Support Options',
      href: '/en/support',
    },
    statsHeading: 'Why partners choose us',
    stats: [
      {
        value: '350+',
        label: 'Ready-to-launch templates',
      },
      {
        value: '50+',
        label: 'U.S. jurisdictions supported',
      },
      {
        value: '2x',
        label: 'Faster document delivery for clients',
      },
    ],
  },
  es: {
    heroTitle: 'Asóciate con 123LegalDoc',
    heroIntro:
      'Únete a nuestro ecosistema de socios para ofrecer documentos legales conformes, integraciones y servicios gestionados a tus clientes.',
    metadata: {
      title: 'Programas de Socios | 123LegalDoc',
      description:
        'Explora alianzas de referidos, revendedores e integraciones con 123LegalDoc para llevar flujos legales automatizados a tus clientes.',
      keywords:
        'socios documentos legales, programa de socios 123legaldoc, integraciones legal tech, socios automatización documentos',
      ogTitle: 'Ecosistema de Socios 123LegalDoc',
      ogDescription:
        'Colabora con 123LegalDoc mediante programas de referidos, reventa e integraciones para ampliar tus servicios legales.',
    },
    structuredDataName: 'Programas de Socios de 123LegalDoc',
    structuredDataDescription:
      'Oportunidades de alianzas de referidos, reventa e integraciones con 123LegalDoc para profesionales y plataformas legales.',
    programs: [
      {
        icon: <Users className="h-6 w-6 text-primary" aria-hidden="true" />,
        name: 'Socios de Referidos',
        description:
          'Presenta 123LegalDoc a tu audiencia y gana comisiones mientras ellos crean documentos legales conformes.',
      },
      {
        icon: <Building2 className="h-6 w-6 text-primary" aria-hidden="true" />,
        name: 'Revendedores y Marca Blanca',
        description:
          'Integra nuestros flujos en tu práctica o plataforma, con experiencias co-marcadas y analíticas incluidas.',
      },
      {
        icon: <Plug className="h-6 w-6 text-primary" aria-hidden="true" />,
        name: 'Socios de Integración',
        description:
          'Conecta 123LegalDoc con CRMs, sistemas de gestión documental y firmas electrónicas mediante APIs seguras.',
      },
    ],
    ctaPrimary: {
      label: 'Hazte Socio',
      href: 'mailto:partners@123legaldoc.com',
    },
    ctaSecondary: {
      label: 'Ver Opciones de Soporte',
      href: '/es/support',
    },
    statsHeading: 'Por qué los socios nos eligen',
    stats: [
      {
        value: '350+',
        label: 'Plantillas listas para lanzar',
      },
      {
        value: '50+',
        label: 'Jurisdicciones de EE. UU. soportadas',
      },
      {
        value: '2x',
        label: 'Entrega de documentos más rápida para clientes',
      },
    ],
  },
} as const;

function buildPartnersStructuredData(locale: 'en' | 'es') {
  const siteUrl = getSiteUrl();
  const localizedUrl = `${siteUrl}/${locale}/partners/`;
  const content = localizedContent[locale];

  const aboutItems = content.programs.map((program) => ({
    '@type': 'DefinedTerm',
    name: program.name,
    description: program.description,
  }));

  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: content.structuredDataName,
      description: content.structuredDataDescription,
      url: localizedUrl,
      inLanguage: LOCALE_LANGUAGE_TAGS[locale],
      about: aboutItems,
      potentialAction: {
        '@type': 'CommunicateAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'mailto:partners@123legaldoc.com',
          actionPlatform: ['email'],
        },
        name: locale === 'es' ? 'Enviar correo a 123LegalDoc Partners' : 'Email 123LegalDoc Partners',
      },
    },
    null,
    0,
  ).replace(/</g, '\\u003c');
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PartnersPageParams>;
}): Promise<Metadata> {
  const { locale } = await params;

  const siteUrl = getSiteUrl();
  const metadataBase = new URL(siteUrl + '/');
  const canonicalPath = `/${locale}/partners/`;
  const supportedLocales = localizations as readonly ('en' | 'es')[];
  const languageAlternates = supportedLocales.reduce<Record<string, string>>((accumulator, supportedLocale) => {
    accumulator[supportedLocale] = `${siteUrl}/${supportedLocale}/partners/`;
    return accumulator;
  }, {});
  languageAlternates['x-default'] = `${siteUrl}/en/partners/`;
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

export default async function PartnersPage({
  params,
}: {
  params: Promise<PartnersPageParams>;
}) {
  const { locale } = await params;
  const content = localizedContent[locale];
  const partnersJsonLd = buildPartnersStructuredData(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: partnersJsonLd,
        }}
      />
      <main className="container mx-auto px-4 py-16">
        <header className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-sm uppercase tracking-wide text-primary/80 mb-2">
            {locale === 'es' ? 'Programas de Alianzas' : 'Partner Programs'}
          </p>
          <h1 className="text-4xl font-bold mb-4 text-foreground">{content.heroTitle}</h1>
          <p className="text-muted-foreground text-lg">{content.heroIntro}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {content.programs.map((program) => (
            <div key={program.name} className="rounded-2xl border border-border bg-card p-6 shadow-sm h-full">
              <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3 mb-4">
                {program.icon}
              </div>
              <h2 className="text-xl font-semibold text-card-foreground mb-2">{program.name}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{program.description}</p>
            </div>
          ))}
        </div>

        <section className="bg-secondary/40 border border-border rounded-2xl p-8 mb-12 text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-4">{content.statsHeading}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-4xl font-bold text-primary">{stat.value}</span>
                <span className="text-sm text-muted-foreground text-center mt-2">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <PartnersCTA
            locale={locale}
            href={content.ctaPrimary.href}
            ctaId="become_partner"
            surface="hero_primary"
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-3 text-sm font-medium shadow transition hover:bg-primary/90"
            as="anchor"
          >
            {content.ctaPrimary.label} <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </PartnersCTA>
          <PartnersCTA
            locale={locale}
            href={content.ctaSecondary.href}
            ctaId="support_options"
            surface="hero_secondary"
            className="inline-flex items-center justify-center rounded-md border border-primary px-6 py-3 text-sm font-medium text-primary transition hover:bg-primary/10"
          >
            {content.ctaSecondary.label}
          </PartnersCTA>
        </div>
      </main>
    </>
  );
}


