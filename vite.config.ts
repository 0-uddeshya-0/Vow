import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "/" for the custom domain; the Pages workflow overrides with
// VITE_BASE=/Vow/ while the site is served from the project subpath.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? "/",
  server: { port: 4974, strictPort: true },
  build: { target: "es2022" },
});
