import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* other config options */
  allowedDevOrigins: [
    'http://localhost:3000',
  ],
};

// This is the correct way to export a Next.js configuration in a mixed JS/TS environment.
module.exports = nextConfig;