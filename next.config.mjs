import webpack from 'webpack';
import fs from 'fs';
import path from 'path';

let redirects = [];
try {
  const redirectsJson = fs.readFileSync(path.join(process.cwd(), 'config', 'redirects.json'), 'utf-8');
  redirects = JSON.parse(redirectsJson);
} catch (e) {
  console.warn('[next.config.mjs] No redirects loaded:', e);
}

const nextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Generate source maps for production bundles so Lighthouse can access
  // original source when analyzing the site. This adds `.map` files next to
  // the JavaScript bundles and slightly increases build size.
  productionBrowserSourceMaps: true,

  images: {
    unoptimized: true, // Disable Image Optimization for static export
    // Only optimize remote images from specified patterns if unoptimized is false
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // webpack(config) {
  //   // Ignore unsupported Jaeger exporter import
  //   config.plugins.push(
  //     new webpack.IgnorePlugin({ resourceRegExp: /^@opentelemetry\/exporter-jaeger$/ })
  //   );
  //   // Stub out handlebars to avoid require.extensions usage
  //   config.plugins.push(
  //     new webpack.IgnorePlugin({ resourceRegExp: /^handlebars$/ })
  //   );
  //   return config;
  // },
  async redirects() {
    return redirects;
  },
};

export default nextConfig;
