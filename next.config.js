// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Abaikan error ESLint saat build (Vercel)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Jika Anda masih menggunakan App Router, pindahkan saja ke pages/
  // Untuk Pages Router, tidak perlu experimental.appDir

  // Jika nanti upgrade ke Next.js 14+ App Router, restore experimental.appDir:
  // experimental: { appDir: true },
}

module.exports = nextConfig
