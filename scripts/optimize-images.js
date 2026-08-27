/**
 * Optimize all post images in posts/images/ to responsive WebP.
 *
 * The Cloudflare Pages deployment does NOT run the Next.js image optimizer
 * (it returns 400 / passes through full-size bytes), so we pre-generate
 * correctly-sized WebP variants at build time and serve them via `srcSet`.
 *
 * For every source image we emit:
 *   <base>.webp            (longest side capped at 1600px — the LCP/largest)
 *   <base>@640.webp        (thumbnails / small cards)
 *   <base>@960.webp        (mid cards)
 *   <base>@1280.webp       (hero / large cards)
 *
 * References point at `<base>.webp` (rewritten in lib/posts.js via
 * toWebpUrl); the `srcSet` is built from the `@<w>` variants. Already-WebP
 * source files are skipped. Idempotent.
 *
 * Run: node scripts/optimize-images.js
 */
const fs = require('fs');
const path = require('path');
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
  let meta;
  try {
    meta = await sharp(src, { failOn: 'none' }).metadata();
  } catch (err) {
    console.warn(`  SKIP ${file}: ${err.message}`);
    return null;
  }
  const srcWidth = meta.width || 0;

  const writeVariant = async (width, outName) => {
    await sharp(src, { failOn: 'none' })
      .rotate() // honor EXIF orientation
      .resize(width, width, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 6 })
      .toFile(path.join(imagesDir, outName));
  };

  // Largest variant (default `src`). Skip when the source already is that file
  // (e.g. deriving variants from an existing base .webp) to avoid the
  // "same file for input and output" error.
  if (dest !== src) {
    await writeVariant(MAX_EDGE, `${base}.webp`);
  }
  // Responsive width variants. `withoutEnlargement` keeps small sources at their
  // natural size, so these always exist (no broken srcSet URLs).
  for (const w of WIDTHS) {
    await writeVariant(w, `${base}@${w}.webp`);
  }

  const after = fs.statSync(dest).size;
  // Remove the original now that the WebP variants exist (only for true
  // originals; never delete a generated base .webp).
  if (dest !== src && SOURCE_EXT.test(file)) fs.rmSync(src, { force: true });

  return { file: `${base}.webp`, before, after };
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

  for (const file of files) {
    if (!isSourceFile(file)) continue; // already a width variant — leave untouched
    const r = await optimizeFile(file);
    if (!r) continue;
    totalBefore += r.before;
    totalAfter += r.after;
    converted += 1;
    const pct = (((r.before - r.after) / r.before) * 100).toFixed(1);
    console.log(
      `  ${r.file.padEnd(40)} ${(r.before / 1024).toFixed(0)}KB -> ${(r.after / 1024).toFixed(0)}KB (${pct}%)`
    );
  }

  const totalPct = totalBefore
    ? (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)
    : '0.0';
  console.log(
    `\nConverted ${converted} image(s). Original ${(
      totalBefore /
      1024 /
      1024
    ).toFixed(1)}MB -> largest variant ${(
      totalAfter / 1024 /
      1024
    ).toFixed(1)}MB (${totalPct}% smaller); responsive @640/@960/@1280 variants also emitted.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
