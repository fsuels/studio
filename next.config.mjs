// next.config.mjs — Next 15 App Router friendly

import webpack from 'webpack';

/* -------------------------------------------------------------------------- */
/*  Core Next.js config                                                       */
/* -------------------------------------------------------------------------- */
const nextConfig = {
  turbopack: {},
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  /* —──────── Static-export image handling —──────── */
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
    ],
  },
  /* Add allowedDevOrigins here as instructed */
  allowedDevOrigins: ['*'],
};

// Export the plain Next.js configuration (Sentry removed)
export default nextConfig;
