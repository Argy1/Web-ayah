import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Agar build tetap lanjut meski ada error ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Opsi Next.js umum
  reactStrictMode: true,
  swcMinify: true,

  // Jika menggunakan App Router
  experimental: {
    appDir: true,
  },

  // Tambahkan setting lain yang diperlukan...
}

export default nextConfig
