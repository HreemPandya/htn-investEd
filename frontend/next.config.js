/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: "/api/videos", destination: "http://localhost:8000/videos" },
      { source: "/api/videos/:id", destination: "http://localhost:8000/videos/:id" },
      { source: "/api/chat", destination: "http://localhost:8000/chat" },
    ];
  },
};

module.exports = nextConfig;
