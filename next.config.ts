import type { NextConfig } from "next";

import path from "path";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8000";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname),
  async rewrites() {
    // Only the unguarded / JWT-based calls are forwarded to the backend for
    // dev (when NEXT_PUBLIC_API_URL is empty and the client uses relative
    // paths). The key-guarded reads are served by the route handlers under
    // src/app/api/recruitment, so they must NOT be captured here — array
    // rewrites run before dynamic routes and would otherwise shadow
    // /api/recruitment/email/[email].
    return [
      {
        source: "/api/otp/:path*",
        destination: `${BACKEND_URL}/api/otp/:path*`,
      },
      {
        source: "/api/recruitment/apply",
        destination: `${BACKEND_URL}/api/recruitment/apply`,
      },
      {
        source: "/api/recruitment/submit",
        destination: `${BACKEND_URL}/api/recruitment/submit`,
      },
      {
        source: "/api/team/:path*",
        destination: `${BACKEND_URL}/api/team/:path*`,
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
