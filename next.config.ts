import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // sql.js uses WebAssembly — tell webpack to handle .wasm files
    config.experiments = { ...config.experiments, asyncWebAssembly: true };

    // Prevent sql.js from being bundled server-side (it's client-only)
    if (isServer) {
      config.externals = [...(config.externals ?? []), "sql.js"];
    }

    return config;
  },
};

export default nextConfig;
