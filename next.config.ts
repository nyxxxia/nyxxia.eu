import type { NextConfig } from "next";

// Export a fully static site so Cloudflare Pages can deploy it as plain assets.
const nextConfig: NextConfig = {
  output: "export",
  images: {
    // Disable the Image Optimization API since we're exporting static assets.
    unoptimized: true,
  },
};

export default nextConfig;
