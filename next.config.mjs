import webpack from 'webpack';

const nextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_SITE_URL:
      process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
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
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
  },
  transpilePackages: ['lucide-react'],

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
};

export default nextConfig;
