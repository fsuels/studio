// next.config.mjs — Next 15 App Router friendly

import webpack from 'webpack';

/* -------------------------------------------------------------------------- */
/*  Core Next.js config                                                       */
/* -------------------------------------------------------------------------- */
const nextConfig = {
  turbo: {
    // Turbopack configuration replaces webpack config
    rules: {
      '*.ts': 'typescript',
      '*.tsx': 'typescript',
    },
  },
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },

  /* Performance budgets and optimization */
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-icons', 
      'lucide-react',
      '@tanstack/react-query',
      'recharts',
      'react-hook-form'
    ],
  },

  /* Bundle analysis configuration */
  webpack: (config, { dev, isServer }) => {
    // Add fallbacks for Node.js modules that shouldn't be in client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        dns: false,
        child_process: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }

    // Bundle analyzer in development
    if (dev && !isServer && process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          openAnalyzer: true,
        }),
      );
    }

    // Enhanced code splitting configuration  
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            // Admin components chunk
            admin: {
              test: /[\\/]components[\\/]admin[\\/]/,
              name: 'admin',
              chunks: 'async',
              priority: 10,
              enforce: true,
            },
            // Charts and analytics chunk
            charts: {
              test: /[\\/](recharts|chart\.js|d3)[\\/]/,
              name: 'charts',
              chunks: 'async',
              priority: 9,
              enforce: true,
            },
            // Collaboration features chunk
            collaboration: {
              test: /[\\/](collaboration|websocket|socket\.io)[\\/]/,
              name: 'collaboration',
              chunks: 'async',
              priority: 8,
              enforce: true,
            },
            // Form components chunk
            forms: {
              test: /[\\/]components[\\/](forms|wizard)[\\/]/,
              name: 'forms',
              chunks: 'async',
              priority: 7,
              enforce: true,
            },
            // Large UI libraries chunk
            uiLibs: {
              test: /[\\/]node_modules[\\/](@radix-ui|@monaco-editor|framer-motion)[\\/]/,
              name: 'ui-libs',
              chunks: 'async',
              priority: 6,
              enforce: true,
            },
            // Firebase services chunk (auth, firestore, admin)
            firebase: {
              test: /[\\/]node_modules[\\/](firebase|firebase-admin)[\\/]/,
              name: 'firebase',
              chunks: 'async',
              priority: 12,
              enforce: true,
            },
            // Payment processing chunk
            payment: {
              test: /[\\/](stripe|payment|@stripe)[\\/]/,
              name: 'payment',
              chunks: 'async',
              priority: 11,
              enforce: true,
            },
            // AI and ML libraries chunk
            aiLibs: {
              test: /[\\/]node_modules[\\/](openai|@google-cloud|@genkit-ai|@pinecone-database)[\\/]/,
              name: 'ai-libs',
              chunks: 'async',
              priority: 10,
              enforce: true,
            },
            // Collaboration real-time chunk
            realtime: {
              test: /[\\/]node_modules[\\/](yjs|y-|@hocuspocus|ioredis|socket\.io)[\\/]/,
              name: 'realtime',
              chunks: 'async',
              priority: 9,
              enforce: true,
            },
            // Analytics and monitoring chunk
            analytics: {
              test: /[\\/]node_modules[\\/](@sentry|@google-cloud\/pubsub)[\\/]/,
              name: 'analytics',
              chunks: 'async',
              priority: 8,
              enforce: true,
            },
            // Document types - split by category for better caching
            documentsEmployment: {
              test: /[\\/]documents[\\/]us[\\/](employment-contract|termination-letter|offer-letter|severance-agreement|non-compete-agreement)[\\/]/,
              name: 'docs-employment',
              chunks: 'async',
              priority: 15,
              enforce: true,
            },
            documentsRealEstate: {
              test: /[\\/]documents[\\/]us[\\/](rental-agreement|lease-agreement|property-deed|purchase-agreement|residential-lease-agreement)[\\/]/,
              name: 'docs-real-estate',
              chunks: 'async',
              priority: 15,
              enforce: true,
            },
            documentsLegal: {
              test: /[\\/]documents[\\/]us[\\/](power-of-attorney|living-trust|last-will-testament|living-will|advance-directive)[\\/]/,
              name: 'docs-legal',
              chunks: 'async',
              priority: 15,
              enforce: true,
            },
            documentsBusiness: {
              test: /[\\/]documents[\\/]us[\\/](business-contract|partnership-agreement|operating-agreement|consulting-agreement|service-agreement)[\\/]/,
              name: 'docs-business',
              chunks: 'async',
              priority: 15,
              enforce: true,
            },
            documentsFinancial: {
              test: /[\\/]documents[\\/]us[\\/](promissory-note|loan-agreement|invoice)[\\/]/,
              name: 'docs-financial',
              chunks: 'async',
              priority: 15,
              enforce: true,
            },
          },
        },
      };
    }

    // Performance budgets
    config.performance = {
      maxAssetSize: 300000, // 300KB
      maxEntrypointSize: 300000, // 300KB
      hints: dev ? false : 'warning',
    };

    return config;
  },

  /* —──────── Static-export image handling —──────── */
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.123legaldoc.com', pathname: '/**' },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
    ],
    // Formats for better compression (when optimization is enabled)
    formats: ['image/avif', 'image/webp'],
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Image sizes for different viewport widths
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Enable placeholder blur for better UX
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  /* Add allowedDevOrigins here as instructed */
  allowedDevOrigins: ['*'],

  /* Redirects for Firebase Auth actions */
  async redirects() {
    return [
      {
        source: '/__/auth/action',
        has: [
          {
            type: 'query',
            key: 'mode',
            value: 'resetPassword',
          },
        ],
        destination: '/en/auth/action?mode=resetPassword&oobCode=:oobCode&continueUrl=:continueUrl',
        permanent: false,
      },
      {
        source: '/__/auth/action',
        has: [
          {
            type: 'query',
            key: 'mode',
            value: 'verifyEmail',
          },
        ],
        destination: '/en/auth/action?mode=verifyEmail&oobCode=:oobCode&continueUrl=:continueUrl',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
