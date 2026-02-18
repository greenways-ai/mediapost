import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export only for production builds
  // Dev mode needs server for middleware to work
  ...(process.env.NODE_ENV === 'production' ? {
    output: 'export',
    distDir: 'dist',
  } : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
