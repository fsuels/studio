/* next.config.mjs — Next 15 App Router, Sentry + Turbopack friendly  */

import { withSentryConfig } from '@sentry/nextjs';
import webpack from 'webpack';

/* -------------------------------------------------------------------------- */
/*  Core Next.js config                                                       */
/* -------------------------------------------------------------------------- */
const nextConfig = {
  turbopack: {},
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  /* —──────── Static-export image handling —──────── */
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
    ],
  },
  /* Add allowedDevOrigins here as instructed */
  allowedDevOrigins: ['*'],

};

<<<<<<< HEAD
/* -------------------------------------------------------------------------- */
/*  Sentry wrapper                                                            */
/* -------------------------------------------------------------------------- */
export default withSentryConfig(
  nextConfig,
  {
    org: '123legaldoc',
    project: 'javascript-nextjs',
=======
const config = nextConfig;
>>>>>>> 9ce587d (removing sentry)

    /* quieter local builds, verbose in CI */
    silent: !process.env.CI,

    /* upload more source-maps for cleaner stack traces */
    widenClientFileUpload: true,

    /* client-side tunnel to dodge ad-blockers */
    tunnelRoute: '/monitoring',

    /* strip Sentry logger calls from bundles */
    disableLogger: true,

    /* auto-instrument Vercel Cron monitors (non-blocking if unsupported) */
    automaticVercelMonitors: true,
  },
  /* Sentry Webpack Plugin options (leave empty → defaults) */
  {},
);
