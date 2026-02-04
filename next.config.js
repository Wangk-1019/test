/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Koyeb/AI Builders 部署需要 standalone 输出
  output: 'standalone',
}

module.exports = nextConfig
