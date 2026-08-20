import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next's own optimizer (not a custom loader) so external photography gets
    // real AVIF/WebP conversion and a responsive srcset. Both hosts below
    // serve permissive CORS, which also lets them be used as WebGL textures.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "live.staticflickr.com" },
      { protocol: "https", hostname: "images.ctfassets.net" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
