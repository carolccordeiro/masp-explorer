import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // GitHub Pages serves the site at /masp-explorer/, so assets need that prefix.
  // Vercel serves at the apex domain (/), so base = "/".
  // process.env.VERCEL is set automatically inside Vercel's build environment.
  base: process.env.VERCEL ? "/" : (mode === "production" ? "/masp-explorer/" : "/"),
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
