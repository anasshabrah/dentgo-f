// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: { sourcemap: true },
  server: {
    port: 3000,
    proxy: {
      // any request to “/api/…” will get forwarded to your backend
      "/api": {
        target: import.meta.env.VITE_SERVER_URL,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
});
