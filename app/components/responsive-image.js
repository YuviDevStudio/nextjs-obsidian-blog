/**
 * Responsive image that serves pre-generated WebP width variants
 * (see scripts/optimize-images.js) via `srcSet`. The Next.js image optimizer
 * is not available on this Cloudflare Pages deployment, so we do resizing at
 * build time and let the browser pick the right size per `sizes`/DPR.
 *
 * Expects `src` to be a `/posts/images/<name>.webp` URL; the `@640/@960/@1280`
 * variants are derived automatically. For non-local/optimized sources it simply
 * renders the given `src`.
 */
const WIDTHS = [640, 960, 1280];

export default function ResponsiveImage({
  src,
  alt = '',
  sizes = '100vw',
  priority = false,
  className = '',
}) {
  if (!src) return null;

  const isLocalWebp = /^\/posts\/images\/[^/]+\.webp$/.test(src);
  const srcSet = isLocalWebp
    ? WIDTHS.map((w) => `${src.replace(/\.webp$/, '')}@${w}.webp ${w}w`)
        .concat(`${src} 1600w`)
        .join(', ')
    : undefined;

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      className={className}
    />
  );
}
