// next.config.ts
import type { NextConfig } from 'next';
import webpack from 'webpack';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Temporarily ignore TS build errors
  },
  eslint: {
    ignoreDuringBuilds: true, // Avoid blocking builds on ESLint errors
  },
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
  webpack(config) {
    // Ignore unsupported Jaeger exporter import
    config.plugins?.push(
      new webpack.IgnorePlugin({ resourceRegExp: /^@opentelemetry\/exporter-jaeger$/ })
    );
    // Stub out handlebars to avoid require.extensions usage
    config.plugins?.push(
      new webpack.IgnorePlugin({ resourceRegExp: /^handlebars$/ })
    );
    return config;
  },
};

export default nextConfig;
