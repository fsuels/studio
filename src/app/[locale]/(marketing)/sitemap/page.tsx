import Link from 'next/link';
import type { Metadata } from 'next';
import SEOConfig from '@/config/seo';
import { localizations } from '@/lib/localizations';
import { getSiteUrl, LOCALE_LANGUAGE_TAGS } from '@/lib/seo/site';

type SitemapLocale = 'en' | 'es';

interface SitemapPageParams {
  locale: SitemapLocale;
}

export const localizedContent = {
  en: {
    heading: 'Sitemap',
    intro: 'Jump to the pages you need across our product, resources, and policy hubs.',
    metadata: {
      title: 'Sitemap | 123LegalDoc',
      description: 'Browse 123LegalDoc pages and resources.',
      keywords: '123legaldoc sitemap, legal document sitemap, legal template links',
      ogTitle: '123LegalDoc Site Map',
      ogDescription: 'Jump to legal document templates, pricing, support, and policy resources.',
    },
    sections: [
      {
        title: 'Product',
        links: [
          { href: '', label: 'Home' },
          { href: 'templates', label: 'Templates' },
          { href: 'pricing', label: 'Pricing' },
          { href: 'signwell', label: 'eSignatures' },
          { href: 'online-notary', label: 'Online Notary' },
          { href: 'partners', label: 'Partners' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { href: 'blog', label: 'Blog' },
          { href: 'faq', label: 'FAQ' },
          { href: 'support', label: 'Support' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { href: 'disclaimer', label: 'Disclaimer' },
          { href: 'terms-of-service', label: 'Terms of Service' },
          { href: 'privacy-policy', label: 'Privacy Policy' },
          { href: 'refund-policy', label: 'Refund Policy' },
        ],
      },
    ],
  },
  es: {
    heading: 'Mapa del Sitio',
    intro: 'Encuentra rápidamente las secciones clave del producto, los recursos y las políticas.',
    metadata: {
      title: 'Mapa del Sitio | 123LegalDoc',
      description: 'Explora las páginas y recursos de 123LegalDoc.',
      keywords: 'mapa del sitio 123legaldoc, mapa documentos legales, enlaces plantillas legales',
      ogTitle: 'Mapa del Sitio 123LegalDoc',
      ogDescription: 'Accede a plantillas legales, precios, soporte y recursos de políticas.',
    },
    sections: [
      {
        title: 'Producto',
        links: [
          { href: '', label: 'Inicio' },
          { href: 'templates', label: 'Plantillas' },
          { href: 'pricing', label: 'Precios' },
          { href: 'signwell', label: 'Firmas Electrónicas' },
          { href: 'online-notary', label: 'Notaría en Línea' },
          { href: 'partners', label: 'Socios' },
        ],
      },
      {
        title: 'Recursos',
        links: [
          { href: 'blog', label: 'Blog' },
          { href: 'faq', label: 'Preguntas Frecuentes' },
          { href: 'support', label: 'Soporte' },
        ],
      },
      {
        title: 'Legales',
        links: [
          { href: 'disclaimer', label: 'Aviso Legal' },
          { href: 'terms-of-service', label: 'Términos del Servicio' },
          { href: 'privacy-policy', label: 'Política de Privacidad' },
          { href: 'refund-policy', label: 'Política de Reembolsos' },
        ],
      },
    ],
  },
} as const;

function buildLocaleHref(locale: SitemapLocale, href: string): string {
  if (!href) {
    return '/' + locale;
  }

  if (href.startsWith('/')) {
    return ('/' + locale + href).replace('//', '/');
  }

  return '/' + locale + '/' + href;
}

function getLocalizedSections(locale: SitemapLocale) {
  const content = localizedContent[locale];

  return content.sections.map((section) => ({
    title: section.title,
    links: section.links.map((link) => {
      const href = buildLocaleHref(locale, link.href);
      return { ...link, href };
    }),
  }));
}

export function buildSitemapStructuredData(locale: SitemapLocale): string {
  const siteUrl = getSiteUrl();
  const content = localizedContent[locale];
  const sections = getLocalizedSections(locale);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: content.metadata.title,
    description: content.metadata.description,
    url: siteUrl + '/' + locale + '/sitemap/',
    inLanguage: LOCALE_LANGUAGE_TAGS[locale],
    hasPart: sections.map((section) => ({
      '@type': 'ItemList',
      name: section.title,
      itemListElement: section.links.map((link, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: link.label,
        url: siteUrl + link.href,
      })),
    })),
  };

  return JSON.stringify(structuredData).replace(/</g, '\\u003c');
}

export async function generateMetadata({
  params,
}: {
  params: Promise<SitemapPageParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = localizedContent[locale];

  const siteUrl = getSiteUrl();
  const metadataBase = new URL(siteUrl + '/');
  const canonicalPath = '/' + locale + '/sitemap/';
  const supportedLocales = localizations as readonly SitemapLocale[];
  const languageAlternates = supportedLocales.reduce<Record<string, string>>((accumulator, supportedLocale) => {
    accumulator[supportedLocale] = siteUrl + '/' + supportedLocale + '/sitemap/';
    return accumulator;
  }, {});
  languageAlternates['x-default'] = siteUrl + '/en/sitemap/';
  const alternateOgLocales = supportedLocales
    .filter((supportedLocale) => supportedLocale !== locale)
    .map((supportedLocale) => LOCALE_LANGUAGE_TAGS[supportedLocale]);

  return {
    title: content.metadata.title,
    description: content.metadata.description,
    keywords: content.metadata.keywords,
    metadataBase,
    alternates: {
      canonical: canonicalPath,
      languages: languageAlternates,
    },
    openGraph: {
      title: content.metadata.ogTitle,
      description: content.metadata.ogDescription,
      type: 'website',
      url: siteUrl + canonicalPath,
      siteName: SEOConfig.openGraph?.site_name ?? '123LegalDoc',
      locale: LOCALE_LANGUAGE_TAGS[locale],
      alternateLocale: alternateOgLocales,
    },
    twitter: {
      card: 'summary_large_image',
      title: content.metadata.ogTitle,
      description: content.metadata.ogDescription,
    },
  };
}

export async function generateStaticParams() {
  return (localizations as readonly SitemapLocale[]).map((locale) => ({ locale }));
}

export default async function SitemapPage({
  params,
}: {
  params: Promise<SitemapPageParams>;
}) {
  const { locale } = await params;
  const content = localizedContent[locale];
  const sections = getLocalizedSections(locale);
  const structuredData = buildSitemapStructuredData(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: structuredData,
        }}
      />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-4 text-foreground">{content.heading}</h1>
        <p className="text-muted-foreground mb-8">{content.intro}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <div key={section.title} className="p-4 rounded-lg border bg-card">
              <h2 className="font-semibold mb-3 text-card-foreground">{section.title}</h2>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-primary hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
