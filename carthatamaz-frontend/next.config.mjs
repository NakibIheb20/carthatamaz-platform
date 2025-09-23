/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // ✅ utile si tu ne veux pas utiliser le loader de Next.js
    domains: ['a0.muscache.com'], // ✅ autorisation pour images externes
  },
}

export default nextConfig
