import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // output: 'export', // Removed: Incompatible with Server Actions/Genkit
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // unoptimized: true, // Removed: Only needed for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
