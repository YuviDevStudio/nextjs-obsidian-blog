/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Only rewrite single-segment root slugs (e.g. /my-post -> /posts/my-post)
      // This prevents double-rewriting paths that already start with /posts or special Next.js paths.
      {
        source: '/:slug',
        has: [],
        destination: '/posts/:slug',
      },
    ];
  },
};

module.exports = nextConfig;
