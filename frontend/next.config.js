/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BACKEND_URL: process.env.BACKEND_URL || "http://localhost:8000",
  },
  async rewrites() {
    return [
      // Proxy video files directly to backend
      {
        source: "/videos/:path*",
        destination: "http://localhost:8000/videos/:path*",
      },
      // Keep other API routes
      { source: "/api/chat", destination: "http://localhost:8000/chat" },
    ];
  },
};

module.exports = nextConfig;
