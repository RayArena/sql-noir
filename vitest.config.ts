import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // sql.js runs against the Node WASM build; no DOM needed.
    environment: "node",
    include: ["scripts/**/*.test.ts", "src/**/*.test.ts"],
  },
});
