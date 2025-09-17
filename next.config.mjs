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

            // ROUTE-BASED CODE SPLITTING - Aggressive optimization
            // Marketing routes (landing, blog, templates)
            routeMarketing: {
              test: /[\\/]app[\\/]\[locale\][\\/]\(marketing\)[\\/]/,
              name: 'route-marketing',
              priority: 25,
              chunks: 'async',
              enforce: true,
              maxSize: 150000, // 150KB chunks for marketing
            },

            // Legal document routes (documents, forms)
            routeLegal: {
              test: /[\\/]app[\\/]\[locale\][\\/]\(legal\)[\\/]/,
              name: 'route-legal',
              priority: 24,
              chunks: 'async',
              enforce: true,
              maxSize: 200000, // 200KB chunks for legal
            },

            // Dashboard and admin routes
            routeApp: {
              test: /[\\/]app[\\/]\[locale\][\\/]\(app\)[\\/]/,
              name: 'route-app',
              priority: 23,
              chunks: 'async',
              enforce: true,
              maxSize: 180000, // 180KB chunks for app
            },

            // Auth routes (login, signup)
            routeAuth: {
              test: /[\\/]app[\\/]\[locale\][\\/]\(auth\)[\\/]/,
              name: 'route-auth',
              priority: 22,
              chunks: 'async',
              enforce: true,
              maxSize: 120000, // 120KB chunks for auth
            },

            // API routes - separate bundles
            routeAPI: {
              test: /[\\/]app[\\/]api[\\/]/,
              name: 'route-api',
              priority: 21,
              chunks: 'async',
              enforce: true,
              maxSize: 300000, // 300KB chunks for API
            },

            // Critical vendors - smaller chunks for initial load
            vendorsCritical: {
              test: /[\\/]node_modules[\\/](next|react|react-dom)[\\/]/,
              name: 'vendors-critical',
              priority: 30,
              chunks: 'initial',
              maxSize: 150000, // Keep critical vendors small
            },

            // UI vendors - lazy loaded
            vendorsUILazy: {
              test: /[\\/]node_modules[\\/](@radix-ui|framer-motion|embla-carousel)[\\/]/,
              name: 'vendors-ui-lazy',
              priority: 18,
              chunks: 'async',
              maxSize: 200000,
            },

            // Form vendors - only for form routes
            vendorsForms: {
              test: /[\\/]node_modules[\\/](react-hook-form|@hookform|zod)[\\/]/,
              name: 'vendors-forms',
              priority: 17,
              chunks: 'async',
              maxSize: 150000,
            },

            // PDF vendors - only for document routes
            vendorsPDFLazy: {
              test: /[\\/]node_modules[\\/](pdf-lib|@pdf-lib)[\\/]/,
              name: 'vendors-pdf-lazy',
              priority: 16,
              chunks: 'async',
              maxSize: 250000,
            },

            // Analytics and monitoring - non-critical
            vendorsAnalytics: {
              test: /[\\/]node_modules[\\/](@sentry|@opentelemetry|prom-client)[\\/]/,
              name: 'vendors-analytics',
              priority: 5,
              chunks: 'async',
              maxSize: 200000,
            },

            // MICRO-SPLITTING - Granular vendor optimization
            // Split individual large libraries
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
      hints: dev ? false : 'warning', // Show warnings instead of failing build
      maxAssetSize: 800000, // 800KB - temporarily relaxed for analysis
      maxEntrypointSize: 1200000, // 1.2MB - temporarily relaxed to see improvements
      // Set route-specific budgets
      assetFilter: function(assetFilename) {
        // Be more lenient with certain asset types
        if (assetFilename.endsWith('.woff2') || assetFilename.endsWith('.woff')) {
          return false; // Skip font files from size checks
        }
        if (assetFilename.includes('vendors-firebase') && assetFilename.includes('.js')) {
          return false; // Firebase chunks can be larger but lazy-loaded
        }
        return true;
      }
    };

    return config;
  },

  /* —──────── Enhanced image optimization —──────── */
  images: {
    unoptimized: true, // Required for static export
    loader: 'custom',
    loaderFile: './image-loader.cjs',
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

export default withBundleAnalyzer(nextConfig);
