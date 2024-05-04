import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    cors: false,
  },
  build: {
    // Should match package.json.
    outDir: "../dist/frontend",
    // https://vitejs.dev/config/build-options#build-minify
    // minify: false,
  }
});
