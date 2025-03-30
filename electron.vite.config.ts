import react from "@vitejs/plugin-react";
import { defineConfig } from "electron-vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  main: {
    build: {
      lib: {
        entry: "src/main/index.mts",
        formats: ["es"],
      },
    },
  },
  preload: {
    build: {
      lib: {
        entry: "src/preload/index.mts",
        formats: ["es"],
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
