import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import { Skeleton } from '@/components/ui/skeleton';
import SEOConfig from '@/config/seo';
import { localizations } from '@/lib/localizations';
import { getSiteUrl, LOCALE_LANGUAGE_TAGS } from '@/lib/seo/site';

// Dynamic import for route-based code splitting
const TemplatesClientContent = dynamic(() => import('./templates-client-content'), {
  loading: () => (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-80 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Featured Templates Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border rounded-lg p-6 space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
});

interface TemplatesPageParams {
  locale: 'en' | 'es';
}

const localizedContent = {
  en: {
    metadata: {
      title: 'Legal Document Templates | 123LegalDoc',
      description:
        'Browse 350+ attorney-reviewed legal document templates covering business, real estate, family, and personal matters.',
      keywords:
        'legal templates, legal document templates, business contracts, real estate templates, family legal forms',
      ogTitle: 'Download Legal Document Templates Instantly',
      ogDescription:
        'Generate attorney-reviewed legal documents with bilingual support, clause customization, and instant PDF delivery.',
    },
    structuredDataName: '123LegalDoc Template Library',
    structuredDataDescription:
      'A collection of business, real estate, family, and personal legal document templates available through 123LegalDoc.',
    collections: [
      {
        name: 'Business & Startups',
        description: 'Operating agreements, NDAs, service contracts, and HR forms.',
      },
      {
        name: 'Real Estate',
        description: 'Leases, purchase agreements, eviction notices, and disclosures.',
      },
      {
        name: 'Family & Personal',
        description: 'Power of attorney, healthcare directives, guardianship forms, and more.',
      },
    ],
  },
  es: {
    metadata: {
      title: 'Plantillas de Documentos Legales | 123LegalDoc',
      description:
        'Explora más de 350 plantillas legales revisadas por abogados para negocios, bienes raíces, familia y asuntos personales.',
      keywords:
        'plantillas legales, documentos legales, contratos de negocios, plantillas inmobiliarias, formularios legales',
      ogTitle: 'Descarga Plantillas de Documentos Legales al Instante',
      ogDescription:
        'Genera documentos legales revisados por abogados con soporte bilingüe, personalización de cláusulas y PDFs instantáneos.',
    },
    structuredDataName: 'Biblioteca de Plantillas 123LegalDoc',
    structuredDataDescription:
      'Colección de plantillas legales empresariales, inmobiliarias, familiares y personales disponibles en 123LegalDoc.',
    collections: [
      {
        name: 'Negocios y Startups',
        description: 'Acuerdos operativos, NDAs, contratos de servicios y formularios de RR. HH.',
      },
      {
        name: 'Bienes Raíces',
        description: 'Arrendamientos, contratos de compra, avisos de desalojo y divulgaciones.',
      },
      {
        name: 'Familia y Personal',
        description: 'Poderes notariales, directrices médicas, formularios de tutela y más.',
      },
    ],
  },
} as const;

function buildTemplatesStructuredData(locale: 'en' | 'es') {
  const siteUrl = getSiteUrl();
  const localizedUrl = `${siteUrl}/${locale}/templates/`;
  const content = localizedContent[locale];

  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: content.structuredDataName,
      description: content.structuredDataDescription,
      url: localizedUrl,
      inLanguage: LOCALE_LANGUAGE_TAGS[locale],
      about: content.collections.map((collection) => ({
        '@type': 'DefinedTerm',
        name: collection.name,
        description: collection.description,
      })),
    },
    null,
    0,
  ).replace(/</g, '\\u003c');
}

export async function generateMetadata({
  params,
}: {
  params: Promise<TemplatesPageParams>;
}): Promise<Metadata> {
  const { locale } = params;

  const siteUrl = getSiteUrl();
  const metadataBase = new URL(siteUrl + '/');
  const canonicalPath = `/${locale}/templates/`;
  const supportedLocales = localizations as readonly ('en' | 'es')[];
  const languageAlternates = supportedLocales.reduce<Record<string, string>>((accumulator, supportedLocale) => {
    accumulator[supportedLocale] = `${siteUrl}/${supportedLocale}/templates/`;
    return accumulator;
  }, {});
  languageAlternates['x-default'] = `${siteUrl}/en/templates/`;
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

// Generate static params for both locales
export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default async function TemplatesPage({
  params,
}: {
  params: Promise<TemplatesPageParams>;
}) {
  const { locale } = params;
  const structuredData = buildTemplatesStructuredData(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: structuredData,
        }}
      />
      <TemplatesClientContent locale={locale} />
    </>
  );
}
