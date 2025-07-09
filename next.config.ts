// next.config.ts
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // agar build tetap lanjut walau ada error lint
  eslint: {
    ignoreDuringBuilds: true,
  },

  // opsi Next.js standar yang mungkin sudah ada
  reactStrictMode: true,
  swcMinify: true,

  // kalau kamu memakai App Router (app directory)
  experimental: {
    appDir: true,
  },

  // tambahkan konfigurasi lain yang sudah kamu pakai sebelumnya...
}

export default nextConfig
