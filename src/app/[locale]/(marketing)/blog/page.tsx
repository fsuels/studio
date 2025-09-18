// src/app/[locale]/blog/page.tsx
// Server-rendered blog index to keep client bundle lean
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { blogArticles } from '@/data/blogArticles';
import SEOConfig from '@/config/seo';
import { localizations } from '@/lib/localizations';
import { getSiteUrl, LOCALE_LANGUAGE_TAGS } from '@/lib/seo/site';

type BlogPageParams = {
  locale: 'en' | 'es';
};

type BlogPageProps = {
  params: Promise<BlogPageParams>;
};

const localizedContent = {
  en: {
    heading: 'Latest Legal Insights',
    metadata: {
      title: 'Legal Blog & Guides | 123LegalDoc',
      description:
        'Read expert articles on legal templates, compliance, and document automation best practices.',
      keywords:
        'legal blog, document automation tips, compliance updates, legal templates articles',
      ogTitle: 'Legal Templates Blog & Guides',
      ogDescription:
        'Stay ahead with legal document tips, compliance checklists, and automation strategies from 123LegalDoc.',
    },
    readMore: 'Read more →',
  },
  es: {
    heading: 'Últimas Novedades Legales',
    metadata: {
      title: 'Blog y Guías Legales | 123LegalDoc',
      description:
        'Lee artículos de expertos sobre plantillas legales, cumplimiento y mejores prácticas de automatización.',
      keywords:
        'blog legal, consejos automatización documentos, actualizaciones de cumplimiento, artículos plantillas legales',
      ogTitle: 'Blog y Guías de Documentos Legales',
      ogDescription:
        'Mantente al día con consejos sobre documentos legales, listas de cumplimiento y estrategias de automatización de 123LegalDoc.',
    },
    readMore: 'Leer más →',
  },
} as const;

function buildBlogStructuredData(locale: 'en' | 'es') {
  const siteUrl = getSiteUrl();
  const localizedUrl = `${siteUrl}/${locale}/blog/`;
  const topArticles = blogArticles.slice(0, 10);

  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: locale === 'es' ? 'Blog Legal de 123LegalDoc' : '123LegalDoc Legal Blog',
      description: localizedContent[locale].metadata.description,
      url: localizedUrl,
      inLanguage: LOCALE_LANGUAGE_TAGS[locale],
      blogPost: topArticles.map((article) => {
        const title = (article as Record<string, unknown>)[`title_${locale}`] as string;
        const summary = (article as Record<string, unknown>)[`summary_${locale}`] as string;
        return {
          '@type': 'BlogPosting',
          headline: title,
          description: summary,
          datePublished: article.date,
          url: `${siteUrl}/${locale}/blog/${article.slug}`,
          mainEntityOfPage: `${siteUrl}/${locale}/blog/${article.slug}`,
        };
      }),
    },
    null,
    0,
  ).replace(/</g, '\\u003c');
}

export async function generateMetadata({
  params,
}: {
  params: Promise<BlogPageParams>;
}): Promise<Metadata> {
  const { locale } = await params;

  const siteUrl = getSiteUrl();
  const metadataBase = new URL(siteUrl + '/');
  const canonicalPath = `/${locale}/blog/`;
  const supportedLocales = localizations as readonly ('en' | 'es')[];
  const languageAlternates = supportedLocales.reduce<Record<string, string>>((accumulator, supportedLocale) => {
    accumulator[supportedLocale] = `${siteUrl}/${supportedLocale}/blog/`;
    return accumulator;
  }, {});
  languageAlternates['x-default'] = `${siteUrl}/en/blog/`;
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

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  const langSuffix = locale === 'es' ? 'es' : 'en';
  const articles = blogArticles
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  const structuredData = buildBlogStructuredData(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: structuredData,
        }}
      />
      <main className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">{localizedContent[locale].heading}</h1>
        <div className="grid gap-4">
          {articles.map((article) => {
            const record = article as Record<string, unknown>;
            const title = record[`title_${langSuffix}`] as string;
            const summary = record[`summary_${langSuffix}`] as string;
            const date = new Date(article.date).toLocaleDateString(locale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });
            return (
              <Link
                key={article.slug}
                href={`/${locale}/blog/${article.slug}`}
                className="block border rounded-xl p-4 shadow hover:shadow-md transition hover:bg-muted"
                aria-label={`${title} — ${localizedContent[locale].readMore}`}
              >
                <h2 className="text-xl font-semibold mb-1">{title}</h2>
                <p className="text-sm text-muted-foreground mb-1">{date}</p>
                <p className="text-sm text-muted-foreground">{summary}</p>
                <span className="mt-2 inline-block text-primary text-sm underline">
                  {localizedContent[locale].readMore}
                </span>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
