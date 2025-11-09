/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  transform: { "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.json" }] },
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.ts"],
  testMatch: ["**/tests/**/*.test.ts"],
  collectCoverageFrom: [
    "src/app/api/**/*.{ts,tsx}",
    "src/lib/**/*.{ts,tsx}"
  ],
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: { lines: 60 }
  }
};
