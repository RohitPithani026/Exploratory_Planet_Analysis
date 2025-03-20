import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  rewrites: async () => [
    {
      source: '/api/auth/:path*',
      destination: '/api/auth/:path*',
    },
  ],
};

export default nextConfig;
