import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
