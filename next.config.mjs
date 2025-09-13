// next.config.mjs — Minimal configuration for stable builds

/* -------------------------------------------------------------------------- */
/*  Core Next.js config                                                       */
/* -------------------------------------------------------------------------- */
const nextConfig = {
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },

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

    // Production-ready bundle splitting
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 200000,
          cacheGroups: {
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: -10,
              chunks: 'all',
              maxSize: 150000,
            },
            documents: {
              test: /[\\/]lib[\\/]documents[\\/]/,
              name: 'documents',
              priority: 10,
              chunks: 'async',
              enforce: true,
            },
            firebase: {
              test: /[\\/]node_modules[\\/](firebase|@firebase)[\\/]/,
              name: 'firebase',
              priority: 15,
              chunks: 'all',
            },
          },
        },
      };
    }

    // Relax performance constraints
    config.performance = {
      hints: dev ? false : 'warning',
      maxAssetSize: 1000000, // 1MB
      maxEntrypointSize: 1000000, // 1MB
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

export default nextConfig;
