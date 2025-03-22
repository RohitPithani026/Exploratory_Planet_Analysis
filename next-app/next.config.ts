/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disables React Strict Mode
  images: {
    domains: ["picsum.photos"], 
  },
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
        source: "/api/ai/:path*",
        destination: "/api/ai/:path*",
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
    ];
  },
};

export default nextConfig;
