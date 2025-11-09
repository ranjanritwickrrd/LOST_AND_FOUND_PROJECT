import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.{js,ts}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      all: true,
      lines: 60,
      branches: 60,
      functions: 60,
      statements: 60
    }
  }
});
