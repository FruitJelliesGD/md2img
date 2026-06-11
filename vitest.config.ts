import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["backend/src/**/*.test.ts", "packages/shared/src/**/*.test.ts"],
  },
});
