// next.config.ts
import type { NextConfig } from 'next';
// Webpack module will be imported conditionally only if needed.

const isTurbopack = process.env.NEXT_TURBOPACK === '1';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Temporarily ignore TS build errors
  },
  eslint: {
    ignoreDuringBuilds: true, // Avoid blocking builds on ESLint errors
  },
  swcMinify: true,
  // Generate source maps for production bundles so Lighthouse can access the
  // original TypeScript sources. This adds `.map` files next to the compiled
  // JavaScript output and slightly increases build size.
  productionBrowserSourceMaps: true,
  images: {
    unoptimized: true, // Disable Next.js image optimization for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

if (!isTurbopack) {
  // Only define and use webpack config if not using Turbopack
  // This ensures 'webpack' module and its types are only referenced when needed.
  const webpack = require('webpack'); // Using require for truly conditional loading

  const customWebpackConfig = (
    config: any, // Changed type from import('webpack').Configuration
  ): any => { // Changed return type
    config.plugins = config.plugins || [];
    // Use the imported 'webpack' module for IgnorePlugin
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^@opentelemetry\/exporter-jaeger$/,
      }),
    );
    config.plugins.push(
      new webpack.IgnorePlugin({ resourceRegExp: /^handlebars$/ }),
    );
    return config;
  };
  nextConfig.webpack = customWebpackConfig;
}

export default nextConfig;
