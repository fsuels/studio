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
  swcMinify: true,
  // Generate source maps for production bundles so Lighthouse can access the
  // original TypeScript sources. This adds `.map` files next to the compiled
  // JavaScript output and slightly increases build size.
  productionBrowserSourceMaps: true,
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
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
  },
  transpilePackages: ['lucide-react'],
  webpack(config) {
    // Ignore unsupported Jaeger exporter import
    config.plugins?.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^@opentelemetry\/exporter-jaeger$/,
      }),
    );
    // Stub out handlebars to avoid require.extensions usage
    config.plugins?.push(
      new webpack.IgnorePlugin({ resourceRegExp: /^handlebars$/ }),
    );
    return config;
  },
};

export default nextConfig;
