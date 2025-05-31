// next.config.ts
import type { NextConfig } from 'next';
import webpack from 'webpack'; // Import the webpack module

const isTurbopack = process.env.NEXT_TURBOPACK === '1';

// Define the webpack function with the correct signature.
const customWebpackConfig: NextConfig['webpack'] = (
  config: webpack.Configuration,
  // options: { isServer: boolean; dev: boolean; webpack: typeof import('webpack'); /* ...other NextJsWebpackConfigContext props */ }
) => {
  config.plugins = config.plugins || [];
  // Use the imported 'webpack' module for IgnorePlugin
  config.plugins.push(
    new webpack.IgnorePlugin({
      resourceRegExp: /^@opentelemetry\/exporter-jaeger$/,
    }),
  );
  config.plugins.push(
    new webpack.IgnorePlugin({ resourceRegExp: /^handlebars$/ }),
  );
  return config;
};

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
  // Conditionally apply webpack config
  ...(isTurbopack ? {} : { webpack: customWebpackConfig }),
};

export default nextConfig;
