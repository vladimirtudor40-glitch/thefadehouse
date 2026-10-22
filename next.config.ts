import type { NextConfig } from "next";

/**
 * Production builds are exported as static files for GitHub Pages, served at
 * https://vladimirtudor40-glitch.github.io/thefadehouse/ — hence the basePath.
 * `npm run dev` keeps serving from the root.
 */
const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? "/thefadehouse" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  turbopack: { root: process.cwd() },
  images: {
    // GitHub Pages has no image optimizer; Unsplash URLs are already sized via `w=`.
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
