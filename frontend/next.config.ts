import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  turbopack: {
    root: path.join(__dirname),
  },
  // Hide the dev-only floating "N" Next.js badge (never present in production).
  devIndicators: false,
};

export default nextConfig;
