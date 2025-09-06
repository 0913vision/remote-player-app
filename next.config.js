/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PLATFORM: process.platform === 'darwin' ? 'MAC' : 'RASPBERRY_PI'
  }
}

module.exports = nextConfig
