import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  base: "/",
  server: { host: true, port: 8080 },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icons/*.png"],
      manifest: {
        name: "KORA · Museus inteligentes",
        short_name: "KORA",
        description: "Guia inteligente para museus: scanner de obras, roteiros, assistente de IA e acessibilidade.",
        lang: "pt-BR",
        start_url: "/museus",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#F5F5F7",
        theme_color: "#0B0B0F",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,woff2}"],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        navigateFallback: "/index.html",
        runtimeCaching: [
          {
            // Imagens das obras: cache primeiro, rede como reserva
            urlPattern: ({ url }) => url.pathname.startsWith("/museums/"),
            handler: "CacheFirst",
            options: { cacheName: "kora-art", expiration: { maxEntries: 600, maxAgeSeconds: 60 * 60 * 24 * 30 } },
          },
          {
            // Motor de IA no navegador (ONNX Runtime em WebAssembly, servido pelo CDN)
            urlPattern: ({ url }) => url.hostname === "cdn.jsdelivr.net",
            handler: "CacheFirst",
            options: { cacheName: "kora-runtime", expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
          // Obs.: o modelo do scanner (/models, 23 MB) fica no cache HTTP do navegador (Cache-Control imutável),
          // fora do service worker: gravar arquivos grandes no Cache Storage falha em aparelhos com pouca cota.
        ],
      },
    }),
  ],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  build: {
    target: "es2020",
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@huggingface") || id.includes("onnxruntime")) return "ml";
            if (id.includes("recharts") || id.includes("d3-")) return "charts";
            if (id.includes("@supabase")) return "supabase";
            if (id.includes("framer-motion")) return "motion";
            if (id.includes("react-markdown") || id.includes("micromark") || id.includes("mdast") || id.includes("hast")) return "markdown";
          }
        },
      },
    },
  },
  optimizeDeps: { exclude: ["@huggingface/transformers"] },
});
