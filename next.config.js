/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Docker 部署需要 standalone 输出
  output: process.env.DOCKER_BUILD === 'true' ? 'standalone' : undefined,
}

module.exports = nextConfig
