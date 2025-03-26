import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    testTimeout: 15000,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "json-summary"],
      reportOnFailure: true,
      include: ["**/src/**/*.?(ts|mts|tsx)"],
      exclude: [
        "**/src/i18n/**",
        "**/*.dto.ts",
        "**/*.interface.ts",
        "**/*.d.ts",
      ],
    },
  },
});
