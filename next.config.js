// Patch Node.js 25+ Web Storage experimental API side-effects during SSR
if (typeof globalThis !== 'undefined' && globalThis.localStorage && typeof globalThis.localStorage.getItem !== 'function') {
  delete globalThis.localStorage;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.1.64'],
  images: {
    // The Cloudflare Pages deployment does not run the Next.js image optimizer
    // (it returns the original bytes unchanged). Post images are pre-optimized
    // to WebP by scripts/optimize-images.js, so we serve them directly. This
    // also removes the redundant /_next/image redirect hop.
    unoptimized: true,
  },
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
