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
  
  // Prevent Next from generating vendor-chunks for packages in dev
  // Disable optimizePackageImports by providing an empty array (boolean is invalid)
  experimental: {
    optimizePackageImports: [],
    webpackBuildWorker: false,
  },

  // Note: If the vendor-chunk issue persists, we can consider
  // adding a modularizeImports rule for lucide-react. Leaving it
  // off by default to avoid case-mapping pitfalls across icons.
  

  /* Webpack config attached conditionally below for production builds */

  /* —──────── Enhanced image optimization —──────── */
  images: {
    unoptimized: process.env.USE_NEXT_IMAGE_OPTIMIZATION === 'true' ? false : true, // Required for static export
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

  // Note: We no longer set custom non-standard dev options here

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
      {
        source: '/docs/:docId/:state',
        destination: '/en/docs/:docId/:state',
        permanent: true,
      },
      {
        source: '/docs/:docId/view',
        destination: '/en/docs/:docId/view',
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/share/:linkId',
        destination: '/share?linkId=:linkId',
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

    return config;
  };
}

export default withBundleAnalyzer(nextConfig);

