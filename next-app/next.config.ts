import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: '/api/auth/:path*',
      },
      {
        source: '/api/data/:path*',
        destination: '/api/data/:path*',
      },
    ];
  },
};

export default nextConfig;
