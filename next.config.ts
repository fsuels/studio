// next.config.ts
import type { NextConfig } from 'next';
import type { Configuration as WebpackConfiguration } from 'webpack';

const isTurbopack = !!process.env.NEXT_TURBOPACK;

// Base configuration applicable to all environments
const config: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Temporarily ignore TS build errors
  },
  eslint: {
    ignoreDuringBuilds: true, // Avoid blocking builds on ESLint errors
  },
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
      // Removed placeholder image pattern as all hero assets are local
    ],
  },
  // No webpack property here by default for Turbopack
};

// Conditionally add webpack configuration if Next.js is running with Webpack (i.e., not Turbopack)
if (!isTurbopack) {
  // Lazy require webpack only when not using Turbopack
  const webpack = require('webpack');

  const customWebpackConfig = (
    webpackConfig: WebpackConfiguration,
    // options: any // Next.js provides options here, like buildId, dev, isServer etc.
  ): WebpackConfiguration => {
    webpackConfig.plugins = webpackConfig.plugins || [];
    webpackConfig.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^@opentelemetry\/exporter-jaeger$/,
      }),
    );
    webpackConfig.plugins.push(
      new webpack.IgnorePlugin({ resourceRegExp: /^handlebars$/ }),
    );
    return webpackConfig;
  };

  config.webpack = customWebpackConfig as any; // Cast to any if type signature needs to be relaxed
}

export default config;
