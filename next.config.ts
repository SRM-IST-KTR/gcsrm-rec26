import type { NextConfig } from "next";

import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname),
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
