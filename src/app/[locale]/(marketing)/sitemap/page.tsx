import Link from 'next/link';
import type { Metadata } from 'next';
import SEOConfig from '@/config/seo';
import { localizations } from '@/lib/localizations';
import { getSiteUrl, LOCALE_LANGUAGE_TAGS } from '@/lib/seo/site';
import {
  buildSitemapStructuredData,
  getLocalizedSections,
  localizedContent,
} from './utils';
import type { SitemapLocale } from './utils';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: SitemapLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = localizedContent[locale];

  const siteUrl = getSiteUrl();
  const metadataBase = new URL(siteUrl + '/');
  const canonicalPath = '/' + locale + '/sitemap/';
  const supportedLocales = localizations as readonly SitemapLocale[];
  const languageAlternates = supportedLocales.reduce<Record<string, string>>(
    (accumulator, supportedLocale) => {
      accumulator[supportedLocale] =
        siteUrl + '/' + supportedLocale + '/sitemap/';
      return accumulator;
    },
    {},
  );
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

export function generateStaticParams() {
  return (localizations as readonly SitemapLocale[]).map((locale) => ({ locale }));
}

export default async function SitemapPage({
  params,
}: {
  params: Promise<{ locale: SitemapLocale }>;
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
