import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["motion/react"],
  },
  images: {
    qualities: [75, 90],
  },
};

export default withBundleAnalyzer(nextConfig);
