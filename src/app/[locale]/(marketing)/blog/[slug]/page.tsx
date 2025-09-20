// src/app/[locale]/blog/[slug]/page.tsx
// Server-rendered blog post to keep client bundle lean
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { RelatedDocumentLink } from './RelatedDocumentLink';
import { blogArticles, type BlogArticle } from '@/data/blogArticles';
import SEOConfig from '@/config/seo';
import { localizations } from '@/lib/localizations';
import { getSiteUrl, LOCALE_LANGUAGE_TAGS } from '@/lib/seo/site';
type BlogRouteParams = { locale: 'en' | 'es'; slug: string };
const SUPPORTED_LOCALES = localizations as readonly ('en' | 'es')[];
const BLOG_AUTHOR_BY_LOCALE = {
  en: '123LegalDoc Legal Team',
  es: 'Equipo Legal de 123LegalDoc',
} as const;
const NOT_FOUND_TITLES = {
  en: 'Article Not Found | 123LegalDoc',
  es: 'Articulo no encontrado | 123LegalDoc',
} as const;
const NOT_FOUND_DESCRIPTIONS = {
  en: 'This article is not available yet. Explore other legal resources from 123LegalDoc.',
  es: 'Este articulo no esta disponible todavia. Explora otros recursos legales de 123LegalDoc.',
} as const;
const NOT_FOUND_HEADINGS = {
  en: 'Article Not Found',
  es: 'Articulo no encontrado',
} as const;
function getLocalizedArticleField(article: BlogArticle, field: 'title' | 'summary' | 'content', locale: 'en' | 'es'): string {
  const key = `${field}_${locale}` as keyof BlogArticle;
  return article[key] as string;
}
function buildArticleKeywords(slug: string, locale: 'en' | 'es'): string[] {
  const slugKeywords = slug.replace(/-/g, ' ');
  if (locale === 'es') {
    return [slugKeywords, 'documentos legales', 'automatizacion legal', 'blog 123LegalDoc'];
  }
  return [slugKeywords, 'legal documents', 'document automation', '123LegalDoc blog'];
}
function buildBlogPostStructuredData(locale: 'en' | 'es', article: BlogArticle, canonicalUrl: string): string {
  const title = getLocalizedArticleField(article, 'title', locale);
  const description = getLocalizedArticleField(article, 'summary', locale);
  const content = getLocalizedArticleField(article, 'content', locale);
  const publishedDateIso = new Date(article.date).toISOString();
  const textContent = content.replace(/<[^>]+>/g, ' ');
  const wordCount = textContent.trim().split(/\s+/).filter(Boolean).length;
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description,
      datePublished: publishedDateIso,
      dateModified: publishedDateIso,
      author: {
        '@type': 'Organization',
        name: BLOG_AUTHOR_BY_LOCALE[locale],
      },
      publisher: {
        '@type': 'Organization',
        name: '123LegalDoc',
        url: getSiteUrl(),
      },
      inLanguage: LOCALE_LANGUAGE_TAGS[locale],
      mainEntityOfPage: canonicalUrl,
      url: canonicalUrl,
      wordCount,
    },
    null,
    0,
  ).replace(/</g, '\u003c');
}
export async function generateMetadata({
  params,
}: {
  params: Promise<BlogRouteParams>;
}): Promise<Metadata> {
  const { locale, slug } = params;
  const article = blogArticles.find((entry) => entry.slug === slug);
  const siteUrl = getSiteUrl();
  const metadataBase = new URL(siteUrl + '/');
  const canonicalPath = `/${locale}/blog/${slug}/`;
  const canonicalUrl = siteUrl + canonicalPath;
  const languageAlternates = SUPPORTED_LOCALES.reduce<Record<string, string>>((accumulator, supportedLocale) => {
    accumulator[supportedLocale] = `${siteUrl}/${supportedLocale}/blog/${slug}/`;
    return accumulator;
  }, {});
  languageAlternates['x-default'] = `${siteUrl}/en/blog/${slug}/`;
  const alternateOgLocales = SUPPORTED_LOCALES
    .filter((supportedLocale) => supportedLocale !== locale)
    .map((supportedLocale) => LOCALE_LANGUAGE_TAGS[supportedLocale]);
  if (!article) {
    const fallbackTitle = NOT_FOUND_TITLES[locale];
    const fallbackDescription = NOT_FOUND_DESCRIPTIONS[locale];
    return {
      metadataBase,
      title: fallbackTitle,
      description: fallbackDescription,
      alternates: {
        canonical: canonicalPath,
        languages: languageAlternates,
      },
      openGraph: {
        type: 'article',
        title: NOT_FOUND_HEADINGS[locale],
        description: fallbackDescription,
        url: canonicalUrl,
        siteName: SEOConfig.openGraph?.site_name ?? '123LegalDoc',
        locale: LOCALE_LANGUAGE_TAGS[locale],
        alternateLocale: alternateOgLocales,
      },
      twitter: {
        card: 'summary_large_image',
        title: NOT_FOUND_HEADINGS[locale],
        description: fallbackDescription,
      },
    };
  }
  const localizedTitle = getLocalizedArticleField(article, 'title', locale);
  const localizedSummary = getLocalizedArticleField(article, 'summary', locale);
  const keywords = buildArticleKeywords(slug, locale);
  const publishedTime = new Date(article.date).toISOString();
  const author = BLOG_AUTHOR_BY_LOCALE[locale];
  return {
    metadataBase,
    title: `${localizedTitle} | 123LegalDoc`,
    description: localizedSummary,
    keywords,
    alternates: {
      canonical: canonicalPath,
      languages: languageAlternates,
    },
    openGraph: {
      type: 'article',
      title: localizedTitle,
      description: localizedSummary,
      url: canonicalUrl,
      siteName: SEOConfig.openGraph?.site_name ?? '123LegalDoc',
      locale: LOCALE_LANGUAGE_TAGS[locale],
      alternateLocale: alternateOgLocales,
      publishedTime,
      authors: [author],
    },
    twitter: {
      card: 'summary_large_image',
      title: localizedTitle,
      description: localizedSummary,
    },
  };
}
export async function generateStaticParams() {
  const params: BlogRouteParams[] = [];
  for (const locale of ['en', 'es']) {
    for (const article of blogArticles) {
      params.push({ locale: locale as BlogRouteParams['locale'], slug: article.slug });
    }
  }
  return params;
}
export default async function BlogPostPage({
  params,
}: {
  params: Promise<BlogRouteParams>;
}) {
  const { locale, slug } = params;
  const backToBlogLabel = locale === 'es' ? 'Volver al blog' : 'Back to Blog';
  const article = blogArticles.find((a) => a.slug === slug);
  if (!article) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold mb-4 text-destructive">{NOT_FOUND_HEADINGS[locale]}</h1>
        <p className="text-muted-foreground">
          {NOT_FOUND_DESCRIPTIONS[locale]}{' '}
          <span className="font-mono bg-muted px-1">{slug}</span>
        </p>
        <div className="mt-4">
          <Link href={`/${locale}/blog`} className="underline">{backToBlogLabel}</Link>
        </div>
      </main>
    );
  }
  const langSuffix = locale === 'es' ? 'es' : 'en';
  const title = article[`title_${langSuffix}` as keyof BlogArticle] as string;
  const content = article[`content_${langSuffix}` as keyof BlogArticle] as string;
  const formattedDate = new Date(article.date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/${locale}/blog/${slug}/`;
  const structuredData = buildBlogPostStructuredData(locale, article, canonicalUrl);
  const related = getRelatedDocuments(article, locale);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: structuredData,
        }}
      />
      <main className="max-w-3xl mx-auto px-6 py-12 md:py-20">
      <div className="mb-4">
        <Link href={`/${locale}/blog`} className="text-sm text-primary underline">
          &larr; {backToBlogLabel}
        </Link>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{title}</h1>
      <p className="text-sm text-muted-foreground mb-8">{formattedDate}</p>
      <article className="prose prose-primary dark:prose-invert max-w-none text-foreground mb-16">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </article>
      {related.length > 0 && (
        <section className="mb-16">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Related Legal Documents</h2>
            <div className="grid gap-4">
              {related.map((doc) => (
                <RelatedDocumentLink
                  key={doc.id}
                  locale={locale}
                  href={doc.href}
                  documentId={doc.id}
                  title={doc.title}
                  description={doc.description}
                />
              ))}
            </div>
          </div>
        </section>
      )}
      <nav className="flex justify-between items-center border-t pt-6">
        <div>
          {article.prev && (
            <Link href={`/${locale}/blog/${article.prev}`} className="text-primary underline">
              &larr; Previous
            </Link>
          )}
        </div>
        <div>
          {article.next && (
            <Link href={`/${locale}/blog/${article.next}`} className="text-primary underline">
              Next &rarr;
            </Link>
          )}
        </div>
      </nav>
    </main>
    </>
  );
}
function getRelatedDocuments(article: BlogArticle, locale: 'en' | 'es') {
  const langSuffix = locale === 'es' ? '_es' : '_en';
  const title = ((article as any)[`title${langSuffix}`] as string || '').toLowerCase();
  const content = ((article as any)[`content${langSuffix}`] as string || '').toLowerCase();
  const full = `${title} ${content}`;
  const docs: Array<{ id: string; title: string; description: string; href: string }> = [];
  const add = (id: string, en: string, es: string, enDesc: string, esDesc: string) =>
    docs.push({
      id,
      title: locale === 'es' ? es : en,
      description: locale === 'es' ? esDesc : enDesc,
      href: `/${locale}/docs/${id}`,
    });
  if (/lease|rent|property|landlord|tenant/.test(full)) {
    add('lease-agreement', 'Lease Agreement', 'Contrato de Arrendamiento', 'Rental agreements for residential/commercial use', 'Contratos de alquiler residenciales/comerciales');
    add('eviction-notice', 'Eviction Notice', 'Aviso de Desalojo', 'Legal notice to tenants', 'Notificación legal a inquilinos');
  }
  if (/business|company|startup|llc|corporation/.test(full)) {
    add('llc-operating-agreement', 'LLC Operating Agreement', 'Acuerdo Operativo de LLC', 'Structure your LLC governance', 'Estructura la gobernanza de tu LLC');
    add('non-disclosure-agreement', 'Non-Disclosure Agreement', 'Acuerdo de Confidencialidad', 'Protect confidential information', 'Protege información confidencial');
  }
  if (/employ|hire|job|work/.test(full)) {
    add('employment-contract', 'Employment Contract', 'Contrato de Trabajo', 'Define terms and responsibilities', 'Define términos y responsabilidades');
    add('independent-contractor-agreement', 'Independent Contractor Agreement', 'Acuerdo de Contratista Independiente', 'Hire freelancers with clear scope', 'Contrata freelancers con alcance claro');
  }
  if (/service|contract|agreement|client/.test(full)) {
    add('service-agreement', 'Service Agreement', 'Acuerdo de Servicios', 'Structure professional services', 'Estructura servicios profesionales');
  }
  if (/nda|confidential|non-disclosure|secret/.test(full)) {
    if (!docs.find((d) => d.id === 'non-disclosure-agreement')) {
      add('non-disclosure-agreement', 'Non-Disclosure Agreement', 'Acuerdo de Confidencialidad', 'Protect confidential information', 'Protege información confidencial');
    }
  }
  if (/will|estate|probate|inherit/.test(full)) {
    add('last-will', 'Last Will & Testament', 'Última Voluntad y Testamento', 'Plan your estate properly', 'Planifica tu herencia adecuadamente');
  }
  return docs;
}
