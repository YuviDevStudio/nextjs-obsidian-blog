/**
 * Optimize all post images in posts/images/ to responsive WebP.
 *
 * The Cloudflare Pages deployment does NOT run the Next.js image optimizer
 * (it returns 400 / passes through full-size bytes), so we pre-generate
 * correctly-sized WebP variants at build time and serve them via `srcSet`.
 *
 * For every source image we emit:
 *   <base>.webp            (longest side capped at 1600px — the LCP/largest)
 *   <base>@480.webp        (small cards)
 *   <base>@640.webp        (thumbnails / small cards)
 *   <base>@960.webp        (mid cards)
 *   <base>@1280.webp       (hero / large cards)
 *
 * Widths are capped by the source width (no upscaling), so a small or portrait
 * source may not reach the nominal width. We therefore write
 * `manifest.json` with the *real* width of every generated file and the
 * `srcSet` in app/components/responsive-image.js uses those descriptors.
 * Without the manifest a browser can pick a file based on a lie and render a
 * blurry image (e.g. a 1024px portrait labelled 1280w).
 *
 * References point at `<base>.webp` (rewritten in lib/posts.js via
 * toWebpUrl); the `srcSet` is built from the `@<w>` variants. Already-WebP
 * source files are skipped. Idempotent.
 *
 * Run: node scripts/optimize-images.js
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');

const imagesDir = path.join(process.cwd(), 'posts', 'images');
const MAX_EDGE = 1600;
const WEBP_QUALITY = 78;
// Widths offered in the srcSet. Ordered ascending.
const WIDTHS = [480, 640, 960, 1280];

const SOURCE_EXT = /\.(jpe?g|png|gif)$/i;
// A base WebP (not already a width variant like foo@640.webp) can also act as
// the source when the originals have been deleted — we just derive the smaller
// variants from it.
const WIDTH_VARIANT = /@\d+\.webp$/i;
function isSourceFile(file) {
  if (SOURCE_EXT.test(file)) return true;
  if (file.endsWith('.webp') && !WIDTH_VARIANT.test(file)) return true;
  return false;
}

async function optimizeFile(file) {
  const src = path.join(imagesDir, file);
  const base = file.replace(/\.[^.]+$/, '');
  const dest = path.join(imagesDir, `${base}.webp`);

  const before = fs.statSync(src).size;
  try {
    await sharp(src, { failOn: 'none' }).metadata();
  } catch (err) {
    console.warn(`  SKIP ${file}: ${err.message}`);
    return null;
  }
  const writeVariant = async (width, outName) => {
    const outPath = path.join(imagesDir, outName);
    await sharp(src, { failOn: 'none' })
      .rotate() // honor EXIF orientation
      // Resize by width only. `fit: 'inside'` with two equal dimensions caps
      // the *longest* edge, which silently produces e.g. 1024px-wide files
      // that we then advertised as 1280w.
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 6 })
      .toFile(outPath);
    const outMeta = await sharp(outPath).metadata();
    return outMeta.width || 0;
  };

  // Largest variant (default `src`). Skip when the source already is that file
  // (e.g. deriving variants from an existing base .webp) to avoid the
  // "same file for input and output" error.
  if (dest !== src) {
    await writeVariant(MAX_EDGE, `${base}.webp`);
  }

  const baseMeta = await sharp(dest).metadata();

  // Responsive width variants. `withoutEnlargement` keeps small sources at their
  // natural size, so these always exist (no broken srcSet URLs) — but their
  // real width may be smaller than the requested one. Record it.
  const variants = {};
  for (const w of WIDTHS) {
    const actualWidth = await writeVariant(w, `${base}@${w}.webp`);
    variants[w] = actualWidth;
  }

  const after = fs.statSync(dest).size;
  // Remove the original now that the WebP variants exist (only for true
  // originals; never delete a generated base .webp).
  if (dest !== src && SOURCE_EXT.test(file)) fs.rmSync(src, { force: true });

  // Content hash of every emitted file, used as a `?v=` cache-buster. The base
  // name stays stable, so without this a long `immutable` cache would keep
  // serving old bytes after an image is re-optimized.
  const hash = crypto.createHash('sha1');
  for (const outName of [`${base}.webp`, ...WIDTHS.map((w) => `${base}@${w}.webp`)]) {
    const outPath = path.join(imagesDir, outName);
    if (fs.existsSync(outPath)) hash.update(fs.readFileSync(outPath));
  }
  const version = hash.digest('hex').slice(0, 8);

  return {
    file: `${base}.webp`,
    before,
    after,
    manifestEntry: {
      baseWidth: baseMeta.width || 0,
      variants,
      version,
    },
  };
}

async function main() {
  if (!fs.existsSync(imagesDir)) {
    console.error(`No images directory at ${imagesDir}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(imagesDir)
    .filter((f) => fs.statSync(path.join(imagesDir, f)).isFile());

  let totalBefore = 0;
  let totalAfter = 0;
  let converted = 0;
  const manifest = {};

  for (const file of files) {
    if (!isSourceFile(file)) continue; // already a width variant — leave untouched
    const r = await optimizeFile(file);
    if (!r) continue;
    manifest[r.file] = r.manifestEntry;
    totalBefore += r.before;
    totalAfter += r.after;
    converted += 1;
    const pct = (((r.before - r.after) / r.before) * 100).toFixed(1);
    console.log(
      `  ${r.file.padEnd(40)} ${(r.before / 1024).toFixed(0)}KB -> ${(r.after / 1024).toFixed(0)}KB (${pct}%)`
    );
  }

  const manifestPath = path.join(imagesDir, 'manifest.json');
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  const totalPct = totalBefore
    ? (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)
    : '0.0';
  console.log(
    `\nConverted ${converted} image(s). Original ${(
      totalBefore /
      1024 /
      1024
    ).toFixed(1)}MB -> largest variant ${(
      totalAfter /
      1024 /
      1024
    ).toFixed(1)}MB (${totalPct}% smaller); responsive @480/@640/@960/@1280 variants also emitted.`
  );
  console.log(`Wrote ${manifestPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
