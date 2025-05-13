// next-seo.config.ts
import type { DefaultSeoProps } from 'next-seo';

const SEOConfig: DefaultSeoProps = {
  title: '123LegalDoc',
  description: 'AI-Powered Legal Document Generation',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.123legaldoc.com/',
    site_name: '123LegalDoc',
    images: [
      {
        url: 'https://www.123legaldoc.com/og-image.png',
        width: 1200,
        height: 630,
        alt: '123LegalDoc - AI-Powered Legal Document Generation',
      },
    ],
  },
  twitter: {
    handle: '@yourtwitterhandle',
    site: '@yourtwitterhandle',
    cardType: 'summary_large_image',
  },
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    // Optional: Add Apple Touch Icon, manifest, etc.
  ],
};

export default SEOConfig;
