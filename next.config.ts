import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./lib/contentful/imageLoader.ts",
  },
};

export default nextConfig;
