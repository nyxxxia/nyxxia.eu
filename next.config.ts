import type { NextConfig } from "next";

// Export a static site; Cloudflare Pages Functions provide the backend.
const nextConfig: NextConfig = {
  output: "export",
  images: {
    // Disable the Image Optimization API to avoid extra runtime requirements.
    unoptimized: true,
  },
};

export default nextConfig;
