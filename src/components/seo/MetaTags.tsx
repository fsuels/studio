'use client';

import { NextSeo } from 'next-seo';
import { useTranslation } from 'react-i18next';

interface MetaTagsProps {
  title: string;
  description: string;
  keywords?: string[];
  documentType?: string;
  state?: string;
  city?: string;
  canonical?: string;
  alternateLanguages?: Array<{
    hrefLang: string;
    href: string;
  }>;
  structuredData?: object;
  openGraph?: {
    title?: string;
    description?: string;
    images?: Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
    }>;
    type?: string;
  };
}

export function MetaTags({
  title,
  description,
  keywords = [],
  documentType,
  state,
  city,
  canonical,
  alternateLanguages = [],
  structuredData,
  openGraph,
}: MetaTagsProps) {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language || 'en';

  // Generate enhanced keywords based on document and location
  const generateKeywords = () => {
    const baseKeywords = [...keywords];

    if (documentType) {
      baseKeywords.push(
        `${documentType} template`,
        `free ${documentType}`,
        `${documentType} form`,
        `${documentType} generator`,
      );

      if (state) {
        baseKeywords.push(
          `${state} ${documentType}`,
          `${documentType} ${state}`,
          `${state} legal forms`,
        );
      }

      if (city) {
        baseKeywords.push(
          `${documentType} ${city}`,
          `legal documents ${city}`,
          `${documentType} near me`,
        );
      }
    }

    return baseKeywords.slice(0, 15); // Limit to 15 keywords for best practices
  };

  // Generate enhanced title with location and branding
  const enhanceTitle = () => {
    let enhancedTitle = title;

    if (state && documentType && !title.includes(state)) {
      enhancedTitle = `${state} ${documentType} - Free Template 2025 | 123LegalDoc`;
    } else if (!title.includes('123LegalDoc')) {
      enhancedTitle = `${title} | 123LegalDoc`;
    }

    return enhancedTitle;
  };

  // Generate enhanced description with local SEO
  const enhanceDescription = () => {
    let enhancedDescription = description;

    if (state && documentType && !description.includes(state)) {
      enhancedDescription = `Create your ${state} ${documentType.toLowerCase()} instantly. Free template with state-specific requirements. ${description}`;
    }

    // Ensure description is under 160 characters
    return enhancedDescription.length > 160
      ? enhancedDescription.substring(0, 157) + '...'
      : enhancedDescription;
  };

  const finalTitle = enhanceTitle();
  const finalDescription = enhanceDescription();
  const finalKeywords = generateKeywords();

  return (
    <>
      <NextSeo
        title={finalTitle}
        description={finalDescription}
        canonical={canonical}
        languageAlternates={alternateLanguages}
        openGraph={{
          title: openGraph?.title || finalTitle,
          description: openGraph?.description || finalDescription,
          type: openGraph?.type || 'website',
          locale: currentLocale,
          site_name: '123LegalDoc',
          images: openGraph?.images || [
            {
              url: 'https://123legaldoc.com/images/og-default.png',
              width: 1200,
              height: 630,
              alt: '123LegalDoc - Free Legal Document Templates',
            },
          ],
        }}
        twitter={{
          handle: '@123legaldoc',
          site: '@123legaldoc',
          cardType: 'summary_large_image',
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: finalKeywords.join(', '),
          },
          {
            name: 'author',
            content: '123LegalDoc',
          },
          {
            name: 'robots',
            content:
              'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
          },
          {
            name: 'googlebot',
            content: 'index, follow',
          },
          {
            property: 'article:publisher',
            content: 'https://123legaldoc.com',
          },
          {
            name: 'geo.region',
            content: state || 'US',
          },
          {
            name: 'geo.placename',
            content: city || state || 'United States',
          },
          ...(documentType
            ? [
                {
                  name: 'document-type',
                  content: documentType,
                },
              ]
            : []),
          ...(state
            ? [
                {
                  name: 'geo.region',
                  content: state,
                },
              ]
            : []),
        ]}
        additionalLinkTags={[
          {
            rel: 'dns-prefetch',
            href: '//fonts.googleapis.com',
          },
          {
            rel: 'dns-prefetch',
            href: '//www.google-analytics.com',
          },
          {
            rel: 'preconnect',
            href: 'https://fonts.gstatic.com',
            crossOrigin: 'anonymous',
          },
        ]}
      />

      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}

      {/* Hreflang tags for international SEO */}
      {alternateLanguages.map((lang) => (
        <link
          key={lang.hrefLang}
          rel="alternate"
          hrefLang={lang.hrefLang}
          href={lang.href}
        />
      ))}
    </>
  );
}

// Helper function to generate meta tags for document pages
export function generateDocumentMetaTags(
  documentType: string,
  state?: string,
  city?: string,
  locale = 'en',
) {
  const isSpanish = locale === 'es';

  const title = isSpanish
    ? `${state ? `${state} ` : ''}${documentType} - Plantilla Gratuita 2025`
    : `${state ? `${state} ` : ''}${documentType} - Free Template 2025`;

  const description = isSpanish
    ? `Crea tu ${documentType.toLowerCase()} ${state ? `de ${state}` : ''} al instante. Plantilla gratuita con requisitos específicos del estado. Descarga en PDF y Word.`
    : `Create your ${state ? `${state} ` : ''}${documentType.toLowerCase()} instantly. Free template with ${state ? 'state-specific' : 'legal'} requirements. Download in PDF and Word formats.`;

  const keywords = isSpanish
    ? [
        `${documentType} plantilla`,
        `${documentType} gratis`,
        `formulario ${documentType}`,
        `documentos legales`,
        ...(state
          ? [`${documentType} ${state}`, `formularios legales ${state}`]
          : []),
        ...(city
          ? [`${documentType} ${city}`, `documentos legales ${city}`]
          : []),
      ]
    : [
        `${documentType} template`,
        `free ${documentType}`,
        `${documentType} form`,
        `legal documents`,
        ...(state ? [`${state} ${documentType}`, `${state} legal forms`] : []),
        ...(city ? [`${documentType} ${city}`, `legal documents ${city}`] : []),
      ];

  return {
    title,
    description,
    keywords,
    documentType,
    state,
    city,
  };
}
