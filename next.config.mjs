// next.config.mjs — Optimized configuration for production builds
import bundleAnalyzer from '@next/bundle-analyzer';
import { createRequire } from 'module';
import path from 'path';

const require = createRequire(import.meta.url);

const resolvePackagePath = (pkgName, ...segments) => {
  const pkgDir = path.dirname(require.resolve(`${pkgName}/package.json`));
  return path.join(pkgDir, ...segments);
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/* -------------------------------------------------------------------------- */
/*  Core Next.js config                                                       */
/* -------------------------------------------------------------------------- */
const nextConfig = {
  // SSR deployment on Firebase Web Frameworks (no static export)
  trailingSlash: true,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  /* Optimizations for large codebases */
  experimental: {
    // Disable build worker to avoid SIGBUS crashes in constrained environments
    webpackBuildWorker: false,
  },


  /* Webpack config attached conditionally below for production builds */

  /* —──────── Enhanced image optimization —──────── */
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
    // Modern formats for better compression
    formats: ['image/avif', 'image/webp'],
    // Optimized device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
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

// Attach the custom webpack configuration only for production builds
// and when not running under Turbopack (dev).
if (process.env.NODE_ENV === 'production' && !process.env.NEXT_TURBOPACK) {
  // eslint-disable-next-line no-unused-vars
  nextConfig.webpack = (config, { isServer, dev }) => {
    // Essential Node.js polyfills for client bundle
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        child_process: false,
      };
    }

    // Ensure module resolution for Firebase SDK treeshaking and framer-motion ESM
    config.resolve.alias = {
      ...config.resolve.alias,
      '@firebase/firestore': resolvePackagePath('@firebase/firestore', 'dist', 'index.esm2017.js'),
      '@firebase/firestore/lite': resolvePackagePath('@firebase/firestore', 'dist', 'lite', 'index.browser.esm2017.js'),
    };

    // Externalize problematic server-only deps
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push(
        { handlebars: 'commonjs2 handlebars' },
        { '@pinecone-database/pinecone': 'commonjs2 @pinecone-database/pinecone' },
        { openai: 'commonjs2 openai' },
        { '@google-cloud/aiplatform': 'commonjs2 @google-cloud/aiplatform' },
        { 'pdf-lib': 'commonjs2 pdf-lib' },
        { '@pdf-lib/fontkit': 'commonjs2 @pdf-lib/fontkit' }
      );
    }

    // Production-ready bundle splitting with aggressive optimization
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          maxAsyncRequests: 30,
          maxInitialRequests: 10,
          cacheGroups: {
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
              maxSize: 244000,
            },
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
              test: /[\\/]node_modules[\\/](pdf-lib|@pdf-lib)[\\/]/,
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
            routeMarketing: {
              test: /[\\/]app[\\/]\[locale\][\\/]\(marketing\)[\\/]/,
              name: 'route-marketing',
              priority: 25,
              chunks: 'async',
              enforce: true,
              maxSize: 150000,
            },
            routeLegal: {
              test: /[\\/]app[\\/]\[locale\][\\/]\(legal\)[\\/]/,
              name: 'route-legal',
              priority: 24,
              chunks: 'async',
              enforce: true,
              maxSize: 200000,
            },
            routeApp: {
              test: /[\\/]app[\\/]\[locale\][\\/]\(app\)[\\/]/,
              name: 'route-app',
              priority: 23,
              chunks: 'async',
              enforce: true,
              maxSize: 180000,
            },
            routeAuth: {
              test: /[\\/]app[\\/]\[locale\][\\/]\(auth\)[\\/]/,
              name: 'route-auth',
              priority: 22,
              chunks: 'async',
              enforce: true,
              maxSize: 120000,
            },
            routeAPI: {
              test: /[\\/]app[\\/]api[\\/]/,
              name: 'route-api',
              priority: 21,
              chunks: 'async',
              enforce: true,
              maxSize: 300000,
            },
            vendorsCritical: {
              test: /[\\/]node_modules[\\/](next|react|react-dom)[\\/]/,
              name: 'vendors-critical',
              priority: 30,
              chunks: 'initial',
              maxSize: 150000,
            },
            vendorsUILazy: {
              test: /[\\/]node_modules[\\/](@radix-ui|framer-motion|embla-carousel)[\\/]/,
              name: 'vendors-ui-lazy',
              priority: 18,
              chunks: 'async',
              maxSize: 200000,
            },
            vendorsForms: {
              test: /[\\/]node_modules[\\/](react-hook-form|@hookform|zod)[\\/]/,
              name: 'vendors-forms',
              priority: 17,
              chunks: 'async',
              maxSize: 150000,
            },
            vendorsPDFLazy: {
              test: /[\\/]node_modules[\\/](pdf-lib|@pdf-lib)[\\/]/,
              name: 'vendors-pdf-lazy',
              priority: 16,
              chunks: 'async',
              maxSize: 250000,
            },
            vendorsAnalytics: {
              test: /[\\/]node_modules[\\/](@sentry|@opentelemetry|prom-client)[\\/]/,
              name: 'vendors-analytics',
              priority: 5,
              chunks: 'async',
              maxSize: 200000,
            },
            vendorsLucide: {
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
              name: 'vendors-lucide',
              priority: 14,
              chunks: 'async',
              maxSize: 150000,
            },
            vendorsFramer: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: 'vendors-framer',
              priority: 13,
              chunks: 'async',
              maxSize: 180000,
            },
            vendorsDateFns: {
              test: /[\\/]node_modules[\\/]date-fns[\\/]/,
              name: 'vendors-date-fns',
              priority: 12,
              chunks: 'async',
              maxSize: 100000,
            },
            vendorsI18nCore: {
              test: /[\\/]node_modules[\\/](i18next|react-i18next)[\\/]/,
              name: 'vendors-i18n-core',
              priority: 11,
              chunks: 'async',
              maxSize: 120000,
            },
            vendorsUtility: {
              test: /[\\/]node_modules[\\/](lodash|ramda|clsx|class-variance-authority)[\\/]/,
              name: 'vendors-utility',
              priority: 10,
              chunks: 'async',
              maxSize: 80000,
            },
            vendorsCharts: {
              test: /[\\/]node_modules[\\/](recharts|d3)[\\/]/,
              name: 'vendors-charts',
              priority: 9,
              chunks: 'async',
              maxSize: 200000,
            },
            vendorsMarkdown: {
              test: /[\\/]node_modules[\\/](react-markdown|remark|rehype)[\\/]/,
              name: 'vendors-markdown',
              priority: 8,
              chunks: 'async',
              maxSize: 150000,
            },
            vendorsCarousel: {
              test: /[\\/]node_modules[\\/]embla-carousel[\\/]/,
              name: 'vendors-carousel',
              priority: 7,
              chunks: 'async',
              maxSize: 100000,
            },
            vendorsToast: {
              test: /[\\/]node_modules[\\/](sonner|react-hot-toast)[\\/]/,
              name: 'vendors-toast',
              priority: 6,
              chunks: 'async',
              maxSize: 50000,
            },
          },
        },
      };
    }

    // Aggressive performance constraints for route-based optimization
    config.performance = {
      hints: dev ? false : 'warning',
      maxAssetSize: 800000,
      maxEntrypointSize: 1200000,
      assetFilter: function (assetFilename) {
        if (assetFilename.endsWith('.woff2') || assetFilename.endsWith('.woff')) {
          return false;
        }
        if (assetFilename.includes('vendors-firebase') && assetFilename.includes('.js')) {
          return false;
        }
        return true;
      },
    };

    return config;
  };
}

export default withBundleAnalyzer(nextConfig);
