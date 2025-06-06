// next.config.ts
import type { NextConfig } from 'next';
import type { Configuration as WebpackConfiguration } from 'webpack';

// Base configuration applicable to all environments
const config: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Temporarily ignore TS build errors
  },
  eslint: {
    ignoreDuringBuilds: true, // Avoid blocking builds on ESLint errors
  },
  swcMinify: true,
  productionBrowserSourceMaps: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co', // Added for placeholder images
        port: '',
        pathname: '/**',
      }
    ],
  },
  // No webpack property here by default for Turbopack
};

// Conditionally add webpack configuration if Next.js is running with Webpack
if (process.env.NEXT_WEBPACK === '1') {
  const webpack = require('webpack'); // Lazy require for webpack

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
