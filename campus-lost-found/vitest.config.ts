import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  root: __dirname,
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  test: {
    environment: "node",
    setupFiles: ["./tests/setup-env.ts"],
    include: ["tests/**/*.test.ts"],
    hookTimeout: 30000,
    testTimeout: 30000,
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      thresholds: { lines: 60, functions: 0, branches: 0, statements: 0 },
      all: true,
      exclude: [
        "node_modules/**",
        "tests/**",
        "prisma/**",
        "**/*.d.ts"
      ],
    },
  },
});
