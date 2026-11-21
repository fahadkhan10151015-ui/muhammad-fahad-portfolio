import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: pre-rendered HTML in /out, served from Vercel's CDN.
  output: "export",
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  trailingSlash: false,
  experimental: {
    optimizePackageImports: ["lucide-react", "three"],
    // Inline the (small) stylesheet into the HTML: no render-blocking CSS request.
    inlineCss: true,
  },
};

export default nextConfig;
