// next.config.mjs — Next 15 App Router friendly

import webpack from 'webpack';

/* -------------------------------------------------------------------------- */
/*  Core Next.js config                                                       */
/* -------------------------------------------------------------------------- */
const nextConfig = {
  turbopack: {},
  typescript: { ignoreBuildErrors: false },
  eslint:       { ignoreDuringBuilds: false },

  /* —──────── Static-export image handling —──────── */
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.123legaldoc.com', pathname: '/**' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com', pathname: '/**' },
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
};

export default nextConfig;
