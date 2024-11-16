import react from "@vitejs/plugin-react";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: {
        entry: "src/main/index.mts",
        formats: ["cjs"],
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: {
        entry: "src/preload/index.mts",
        formats: ["cjs"],
      },
    },
  },
  renderer: {
    plugins: [react(), tsconfigPaths()],
    build: {
      rollupOptions: {
        input: "src/renderer/index.html",
      },
    },
  },
});
