// next.config.ts
import type { NextConfig } from 'next';
import type { Configuration as WebpackConfiguration } from 'webpack';

const isTurbopack = !!process.env.NEXT_TURBOPACK;

const config: NextConfig = {
  // Enable static export in Next.js 15+
  output: 'export',

  // Allow your Studio preview origin to load _next assets
  experimental: {
    allowedDevOrigins: [
      'https://9000-idx-studio-1746374904264.cluster-ux5mmlia3zhhask7riihruxydo.cloudworkstations.dev'
    ],
  },

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
    ],
  },
};

// Conditionally add Webpack plugins when not using Turbopack
if (!isTurbopack) {
  const webpack = require('webpack');
  const customWebpackConfig = (
    webpackConfig: WebpackConfiguration
  ): WebpackConfiguration => {
    webpackConfig.plugins = webpackConfig.plugins || [];
    webpackConfig.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^@opentelemetry\/exporter-jaeger$/,
      })
    );
    webpackConfig.plugins.push(
      new webpack.IgnorePlugin({ resourceRegExp: /^handlebars$/ })
    );
    return webpackConfig;
  };
  // @ts-ignore: relax typing to assign custom webpack config
  config.webpack = customWebpackConfig;
}

export default config;
