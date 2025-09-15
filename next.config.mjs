// next.config.mjs — Optimized configuration for production builds
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/* -------------------------------------------------------------------------- */
/*  Core Next.js config                                                       */
/* -------------------------------------------------------------------------- */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  /* Optimizations for large codebases */
  experimental: {
    // Use webpack's persistent cache for faster builds
    webpackBuildWorker: true,
  },


  /* Optimized webpack configuration for large codebases */
  webpack: (config, { isServer, dev }) => {
    // Essential Node.js polyfills for client bundle
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        child_process: false,
      };
    }

    // Externalize problematic server-only deps
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push(
        { handlebars: 'commonjs2 handlebars' },
        { '@pinecone-database/pinecone': 'commonjs2 @pinecone-database/pinecone' },
        { openai: 'commonjs2 openai' },
        { '@google-cloud/aiplatform': 'commonjs2 @google-cloud/aiplatform' }
      );
    }

    // Production-ready bundle splitting with aggressive optimization
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,  // 20KB min - avoid too many tiny chunks
          maxSize: 244000, // ~240KB - optimal for HTTP/2
          maxAsyncRequests: 30,
          maxInitialRequests: 10,
          cacheGroups: {
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
              maxSize: 244000,
            },
            // Split vendors into smaller chunks
            vendorsReact: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'vendors-react',
              priority: 20,
              chunks: 'all',
              maxSize: 244000,
            },
            vendorsUI: {
              test: /[\\/]node_modules[\\/](@radix-ui|lucide-react|class-variance-authority|clsx|tailwind-merge)[\\/]/,
              name: 'vendors-ui',
              priority: 19,
              chunks: 'all',
              maxSize: 244000,
            },
            vendorsFirebase: {
              test: /[\\/]node_modules[\\/](firebase|@firebase)[\\/]/,
              name: 'vendors-firebase',
              priority: 18,
              chunks: 'all',
              maxSize: 244000,
            },
            vendorsPDF: {
              test: /[\\/]node_modules[\\/](pdf-lib|@react-pdf|jspdf)[\\/]/,
              name: 'vendors-pdf',
              priority: 17,
              chunks: 'all',
              maxSize: 244000,
            },
            vendorsI18n: {
              test: /[\\/]node_modules[\\/](i18next|react-i18next)[\\/]/,
              name: 'vendors-i18n',
              priority: 16,
              chunks: 'all',
              maxSize: 244000,
            },
            vendorsQuery: {
              test: /[\\/]node_modules[\\/](@tanstack|react-query)[\\/]/,
              name: 'vendors-query',
              priority: 15,
              chunks: 'all',
              maxSize: 244000,
            },
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: -10,
              chunks: 'all',
              maxSize: 244000,
            },
            // Split document lib by feature
            documentsCompliance: {
              test: /[\\/]lib[\\/]documents[\\/].*[\\/]compliance\.ts$/,
              name: 'documents-compliance',
              priority: 12,
              chunks: 'async',
              enforce: true,
            },
            documentsPDF: {
              test: /[\\/]lib[\\/](pdf|state-forms)[\\/]/,
              name: 'documents-pdf',
              priority: 11,
              chunks: 'async',
              enforce: true,
            },
            documentsGeneral: {
              test: /[\\/]lib[\\/]documents[\\/]/,
              name: 'documents',
              priority: 10,
              chunks: 'async',
              enforce: true,
            },
            // Split components by category
            componentsShared: {
              test: /[\\/]components[\\/]shared[\\/]/,
              name: 'components-shared',
              priority: 9,
              chunks: 'async',
              minSize: 20000,
            },
            componentsDocument: {
              test: /[\\/]components[\\/]document[\\/]/,
              name: 'components-document',
              priority: 8,
              chunks: 'async',
              minSize: 20000,
            },
          },
        },
      };
    }

    // Set realistic performance constraints for large application
    config.performance = {
      hints: dev ? false : 'warning',
      maxAssetSize: 2000000, // 2MB - more realistic for individual assets
      maxEntrypointSize: 1500000, // 1.5MB - more realistic for entry points
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

  /* Headers for CSP - disable strict CSP in development for PDF viewing */
  // Note: CSP is handled in middleware.ts to avoid conflicts
  async headers() {
    return [];
  },

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

export default withBundleAnalyzer(nextConfig);
