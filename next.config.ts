import type { NextConfig } from "next";

import path from "path";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8000";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname),
  async rewrites() {
    return [
      {
        source: "/api/otp/:path*",
        destination: `${BACKEND_URL}/api/otp/:path*`,
      },
      {
        source: "/api/recruitment/:path*",
        destination: `${BACKEND_URL}/api/recruitment/:path*`,
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        net: false,
        tls: false,
        child_process: false,
        "fs/promises": false,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
