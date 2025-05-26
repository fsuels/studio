export default {
  title: '123LegalDoc',
  description: 'AI-Powered Legal Document Generation',
  openGraph: {
    type: 'website',
    locale: 'en_US', // Default locale
    url: 'https://www.123legaldoc.com/', // Replace with your actual domain
    site_name: '123LegalDoc',
    images: [
      {
        url: 'https://www.123legaldoc.com/og-image.png', // Replace with your actual OG image URL
        width: 1200,
        height: 630,
        alt: '123LegalDoc - AI-Powered Legal Document Generation',
      },
    ],
  },
  twitter: {
    handle: '@yourtwitterhandle', // Replace with your Twitter handle
    site: '@yourtwitterhandle', // Replace with your Twitter handle
    cardType: 'summary_large_image',
  },
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico', // Ensure your favicon is at public/favicon.ico
    },
    // You can add more link tags here, e.g., for different favicon sizes or apple-touch-icon
  ],
  // You can add more default SEO configurations here
  // For example, if you want to specify default canonical URLs or noindex/nofollow for certain conditions
};
