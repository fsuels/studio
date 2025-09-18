// src/app/[locale]/HomePageStructuredData.tsx
import { getSiteUrl, LOCALE_LANGUAGE_TAGS } from '@/lib/seo/site';

interface HomePageStructuredDataProps {
  locale: 'en' | 'es';
}

export function HomePageStructuredData({ locale }: HomePageStructuredDataProps) {
  const siteUrl = getSiteUrl();
  const languageTag = LOCALE_LANGUAGE_TAGS[locale];
  const localizedHomepage = siteUrl + '/' + locale + '/';
  const organizationId = siteUrl + '/#organization';

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': organizationId,
      name: '123LegalDoc',
      url: localizedHomepage,
      logo: siteUrl + '/favicon.ico',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': siteUrl + '/#website',
      name: '123LegalDoc',
      url: siteUrl + '/',
      inLanguage: languageTag,
      publisher: {
        '@id': organizationId,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: localizedHomepage + '?search={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
