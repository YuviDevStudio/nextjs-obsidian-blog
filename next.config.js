/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/posts/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
