import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "1mb", // You can set this to your desired limit
    },
  },
};

export default nextConfig;
