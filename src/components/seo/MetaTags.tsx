'use client';

import Head from 'next/head';

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
      width?: number;
      height?: number;
      alt?: string;
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
  const keywordContent = keywords.filter(Boolean).join(', ');
  const geoRegion = state || 'US';
  const geoPlacename = city || state || 'United States';
  const ogTitle = openGraph?.title || title;
  const ogDescription = openGraph?.description || description;
  const ogType = openGraph?.type || 'website';
  const ogImage = openGraph?.images?.[0]?.url;

  return (
    <>
      <Head>
        {canonical && <link rel="canonical" href={canonical} />}
        {alternateLanguages.map((lang) => (
          <link
            key={lang.hrefLang}
            rel="alternate"
            hrefLang={lang.hrefLang}
            href={lang.href}
          />
        ))}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="author" content="123LegalDoc" />
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta name="googlebot" content="index, follow" />
        <meta property="article:publisher" content="https://123legaldoc.com" />
        <meta name="geo.region" content={geoRegion} />
        <meta name="geo.placename" content={geoPlacename} />
        {documentType && <meta name="document-type" content={documentType} />}
        {keywordContent && <meta name="keywords" content={keywordContent} />}
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:type" content={ogType} />
        <meta property="og:site_name" content="123LegalDoc" />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@123legaldoc" />
        <meta name="twitter:creator" content="@123legaldoc" />
      </Head>

      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
    </>
  );
}
