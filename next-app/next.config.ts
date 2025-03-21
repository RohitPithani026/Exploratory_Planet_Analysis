import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "/api/auth/:path*",
      },
      {
        source: "/api/data/:path*",
        destination: "/api/data/:path*",
      },
      {
        source: "/dashboard/:path*",
        destination: "/dashboard/:path*",
      },
      {
        source: "/profile/:path*",
        destination: "/profile/:path*",
      },
      {
        source: "/signin",
        destination: "/signin",
      },
      {
        source: "/signup",
        destination: "/signup",
      },
    ]
  },
}

export default nextConfig

