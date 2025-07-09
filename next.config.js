// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // biarkan build jalan walau ada error ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },

  // kalau pakai App Router, biarkan ini
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
