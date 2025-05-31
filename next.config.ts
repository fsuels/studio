// next.config.ts
import type { NextConfig } from 'next';

const isTurbopack = process.env.NEXT_TURBOPACK === '1';

// Base configuration applicable to both Webpack and Turbopack
const baseConfig: Omit<NextConfig, 'webpack'> = {
  typescript: {
    ignoreBuildErrors: true, // Temporarily ignore TS build errors
  },
  eslint: {
    ignoreDuringBuilds: true, // Avoid blocking builds on ESLint errors
  },
  swcMinify: true,
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

let finalConfig: NextConfig;

if (!isTurbopack) {
  // Only define and use webpack config if not using Turbopack
  const webpack = require('webpack'); // Using require for truly conditional loading

  const customWebpackConfig = (
    config: any, // Webpack config type
  ): any => { // Return Webpack config type
    config.plugins = config.plugins || [];
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

  finalConfig = {
    ...baseConfig,
    webpack: customWebpackConfig,
  };
} else {
  // For Turbopack, do not include the webpack property
  finalConfig = {
    ...baseConfig,
  };
}

export default finalConfig;
