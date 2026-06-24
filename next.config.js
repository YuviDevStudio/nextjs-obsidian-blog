// Patch Node.js 25+ Web Storage experimental API side-effects during SSR
if (typeof globalThis !== 'undefined' && globalThis.localStorage && typeof globalThis.localStorage.getItem !== 'function') {
  delete globalThis.localStorage;
}

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
