import path from "path";
import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler' // or "modern"
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
