// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Agar build tidak gagal karena error ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Konfigurasi lain yang kamu butuhkan…
}

module.exports = nextConfig
