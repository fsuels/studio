import webpack from 'webpack';

const nextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: true,

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
};

export default nextConfig;
