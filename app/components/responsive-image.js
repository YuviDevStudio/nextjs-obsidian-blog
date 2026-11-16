/**
 * Responsive image that serves pre-generated WebP width variants
 * (see scripts/optimize-images.js) via `srcSet`. The Next.js image optimizer
 * is not available on this Cloudflare Pages deployment, so we do resizing at
 * build time and let the browser pick the right size per `sizes`/DPR.
 *
 * The width descriptors come from `posts/images/manifest.json`, which records
 * the *actual* width of every generated file. Sources that are smaller than the
 * requested variant stay at their natural width, so we cannot assume that
 * `@1280.webp` really is 1280px wide.
 *
 * Each entry also carries a content hash used as `?v=` so the immutable cache
 * on /posts/images/* cannot serve stale bytes after a re-optimization.
 */
import imageManifest from '../../posts/images/manifest.json';

const WIDTHS = [480, 640, 960, 1280];

export function getImageVersion(src) {
  const entry = imageManifest[src.replace(/^\/posts\/images\//, '')];
  return entry?.version || null;
}

function buildSrcSet(src, version) {
  const key = src.replace(/^\/posts\/images\//, '');
  const entry = imageManifest[key];
  if (!entry) return undefined;

  const query = version ? `?v=${version}` : '';
  const base = src.replace(/\.webp$/, '');

  // Several nominal variants can resolve to the same real width when the
  // source is small (e.g. @640/@960/@1280 all end up 500px). Keep the smallest
  // file for each real width so the browser never gets duplicate descriptors.
  const byWidth = new Map();
  for (const w of WIDTHS) {
    const actualWidth = entry.variants?.[w];
    if (!actualWidth) continue;
    const url = `${base}@${w}.webp${query}`;
    if (!byWidth.has(actualWidth)) byWidth.set(actualWidth, url);
  }

  // Only the pre-generated @<w> variants go in the srcSet. The base file stays
  // as the `src` fallback: adding it as a 1600w candidate duplicates the
  // image-preload request the browser makes for high-priority images.
  if (byWidth.size === 0) return undefined;
  return [...byWidth.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([width, url]) => `${url} ${width}w`)
    .join(', ');
}

export default function ResponsiveImage({
  src,
  alt = '',
  sizes = '100vw',
  priority = false,
  className = '',
}) {
  if (!src) return null;

  const isLocalWebp = /^\/posts\/images\/[^/]+\.webp$/.test(src);
  const version = isLocalWebp ? getImageVersion(src) : null;
  const href = version ? `${src}?v=${version}` : src;
  const srcSet = isLocalWebp ? buildSrcSet(src, version) : undefined;

  return (
    <img
      src={href}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      className={className}
    />
  );
}
