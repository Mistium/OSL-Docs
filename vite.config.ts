import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { docs } from "./vite/docs.ts";

export default defineConfig({
  plugins: [preact(), docs()],
  publicDir: "public",
  server: { host: "0.0.0.0", port: 5180, strictPort: false, allowedHosts: true },
  preview: { host: "0.0.0.0", port: 4180, allowedHosts: true },
  build: { outDir: "dist", sourcemap: false, target: "es2022" },
  ssr: { noExternal: ["lucide-preact"] },
});
