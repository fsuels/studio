/* next.config.mjs — Next 15 App Router, Sentry + Turbopack friendly  */

import { withSentryConfig } from '@sentry/nextjs';
import webpack from 'webpack';

/* -------------------------------------------------------------------------- */
/*  Core Next.js config                                                       */
/* -------------------------------------------------------------------------- */
const nextConfig = {
  /* —──────── Build safety nets —──────── */
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  /* —──────── Source-maps in prod for Sentry / Lighthouse —──────── */
  productionBrowserSourceMaps: true,

  /* —──────── Static-export image handling —──────── */
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
    ],
  },

  /* —──────── Dev-server cross-origin (fix Turbopack warning) —──────── */
  experimental: {
    turbo: {
      allowedDevOrigins: ['*'], // dev-only; tighten if you proxy from another port
    },
  },

  /* —──────── Custom webpack tweaks —──────── */
  webpack(config) {
    /* Ignore Jaeger exporter that breaks in edge runtimes */
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^@opentelemetry\/exporter-jaeger$/,
      }),
    );

    /* Stub out ‘handlebars’ which relies on deprecated require.extensions */
    config.plugins.push(
      new webpack.IgnorePlugin({ resourceRegExp: /^handlebars$/ }),
    );

    return config;
  },
};

/* -------------------------------------------------------------------------- */
/*  Sentry wrapper                                                            */
/* -------------------------------------------------------------------------- */
export default withSentryConfig(
  nextConfig,
  {
    org: '123legaldoc',
    project: 'javascript-nextjs',

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
