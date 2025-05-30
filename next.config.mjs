import {withSentryConfig} from '@sentry/nextjs';
import webpack from 'webpack';

const nextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
  // Generate source maps for production bundles so Lighthouse can access
  // original source when analyzing the site. This adds `.map` files next to
  // the JavaScript bundles and slightly increases build size.
  productionBrowserSourceMaps: true,

  images: {
    unoptimized: true, // Disable Image Optimization for static export
    // Only optimize remote images from specified patterns if unoptimized is false
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // webpack(config) {
  //   // Ignore unsupported Jaeger exporter import
  //   config.plugins.push(
  //     new webpack.IgnorePlugin({ resourceRegExp: /^@opentelemetry\/exporter-jaeger$/ })
  //   );
  //   // Stub out handlebars to avoid require.extensions usage
  //   config.plugins.push(
  //     new webpack.IgnorePlugin({ resourceRegExp: /^handlebars$/ })
  //   );
  //   return config;
  // },
};

export default withSentryConfig(nextConfig, {
// For all available options, see:
// https://www.npmjs.com/package/@sentry/webpack-plugin#options

org: "123legaldoc",
project: "javascript-nextjs",

// Only print logs for uploading source maps in CI
silent: !process.env.CI,

// For all available options, see:
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

// Upload a larger set of source maps for prettier stack traces (increases build time)
widenClientFileUpload: true,

// Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
// This can increase your server load as well as your hosting bill.
// Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
// side errors will fail.
tunnelRoute: "/monitoring",

// Automatically tree-shake Sentry logger statements to reduce bundle size
disableLogger: true,

// Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
// See the following for more information:
// https://docs.sentry.io/product/crons/
// https://vercel.com/docs/cron-jobs
automaticVercelMonitors: true,
});