/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite'

export default defineConfig({
  define: {},
  test: {
    globals: true,
    env: loadEnv("test", process.cwd(), ""),
  },
})