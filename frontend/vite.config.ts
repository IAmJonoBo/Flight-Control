import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: 'public/index.html',
    },
  },
  server: {
    port: 3000,
  },
});
