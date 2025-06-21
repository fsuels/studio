// next.config.ts
import type { NextConfig } from 'next';
import type { Configuration as WebpackConfiguration } from 'webpack';

const isTurbopack = !!process.env.NEXT_TURBOPACK;

const config: NextConfig = {
  // Enable static generation for better SEO and performance
  trailingSlash: false,
  generateEtags: true,

  // Optimize for SEO and performance
  poweredByHeader: false,
  compress: true,

  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    allowedDevOrigins: [
      'https://9000-idx-studio-1746374904264.cluster-ux5mmlia3zhhask7riihruxydo.cloudworkstations.dev',
    ],
  },

  // Headers for SEO and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
        ],
      },
    ];
  },

  // Redirects for SEO consolidation
  async redirects() {
    return [
      // Redirect old URLs to new SEO-friendly structure
      {
        source: '/documents/:document',
        destination: '/en/docs/:document',
        permanent: true,
      },
      {
        source: '/template/:document',
        destination: '/en/docs/:document',
        permanent: true,
      },
      // Ensure www redirects to non-www
      {
        source: '/(.*)',
        has: [
          {
            type: 'host',
            value: 'www.123legaldoc.com',
          },
        ],
        destination: 'https://123legaldoc.com/:path*',
        permanent: true,
      },
    ];
  },

  typescript: {
    ignoreBuildErrors: true, // Temporarily ignore TS build errors
  },
  eslint: {
    ignoreDuringBuilds: true, // Avoid blocking builds on ESLint errors
  },
  productionBrowserSourceMaps: false, // Disable in production for performance

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
    webpackConfig: WebpackConfiguration,
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
  // @ts-ignore: relax typing to assign custom webpack config
  config.webpack = customWebpackConfig;
}

export default config;
