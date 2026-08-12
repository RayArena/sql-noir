import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 16: Turbopack is now default — add turbopack config to silence error
  // and configure WASM support (needed for sql.js)
  turbopack: {
    rules: {
      "*.wasm": {
        loaders: [],
        as: "*.wasm",
      },
    },
  },

  // Keep webpack config for any non-Turbopack builds (e.g. CI, older tooling)
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
