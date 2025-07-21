import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/private/',
          '/dashboard/',
          '/generate/',
          '/auth/',
          '/checkout/',
          '/*?*', // Block query parameters for clean SEO
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
          '/dashboard/',
          '/generate/',
          '/auth/',
          '/checkout/',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
          '/dashboard/',
          '/generate/',
          '/auth/',
          '/checkout/',
        ],
      },
    ],
    sitemap: 'https://123legaldoc.com/sitemap.xml',
    host: 'https://123legaldoc.com',
  };
}
