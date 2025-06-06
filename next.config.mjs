/* next.config.mjs — Next 15 App Router with bundle analysis support */

import createAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = createAnalyzer({ enabled: process.env.ANALYZE === 'true' });

/* -------------------------------------------------------------------------- */
/*  Core Next.js config                                                       */
/* -------------------------------------------------------------------------- */
const nextConfig = {
  turbopack: {},
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  /* —──────── Source-maps in prod for Sentry / Lighthouse —──────── */
  productionBrowserSourceMaps: true,

  /* —──────── Static-export image handling —──────── */
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
    ],
  },
  /* Add allowedDevOrigins here as instructed */
  allowedDevOrigins: ['*'],

  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: false,
      },
    ];
  },

};

/* -------------------------------------------------------------------------- */
/*  Sentry wrapper                                                            */
/* -------------------------------------------------------------------------- */
const config = nextConfig;

export default process.env.ANALYZE === 'true'
  ? withBundleAnalyzer(config)
  : config;
