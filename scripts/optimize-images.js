/**
 * Optimize all post images in posts/images/ to WebP.
 *
 * - Re-encodes every jpg/jpeg/png/gif to WebP at high quality (q82).
 * - Caps the longest side at 1600px (plenty for the largest on-site usage,
 *   which is a ~720px-wide hero / ~440px featured card).
 * - Keeps the original basename but swaps the extension to `.webp` and removes
 *   the now-unused original so the build only ships the optimized file.
 * - Idempotent: already-WebP files are skipped.
 *
 * References are rewritten to `.webp` in lib/posts.js (see toWebpUrl), so the
 * markdown content and frontmatter keep pointing at the right asset.
 *
 * Run: node scripts/optimize-images.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = path.join(process.cwd(), 'posts', 'images');
const MAX_EDGE = 1600;
const WEBP_QUALITY = 82;

const SOURCE_EXT = /\.(jpe?g|png|gif)$/i;

async function optimizeFile(file) {
  const src = path.join(imagesDir, file);
  const base = file.replace(/\.[^.]+$/, '');
  const dest = path.join(imagesDir, `${base}.webp`);

  const before = fs.statSync(src).size;
  try {
    await sharp(src, { failOn: 'none' })
      .rotate() // honor EXIF orientation
      .resize(MAX_EDGE, MAX_EDGE, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toFile(dest);
  } catch (err) {
    // Not a decodable image (e.g. a stray HTML/404 placeholder). Leave it
    // alone and skip so one bad file can't abort the whole run.
    console.warn(`  SKIP ${file}: ${err.message}`);
    return null;
  }
  const after = fs.statSync(dest).size;

  // Remove the original now that the WebP exists.
  if (dest !== src) fs.rmSync(src, { force: true });

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
    if (!SOURCE_EXT.test(file)) {
      // Already WebP/AVIF/etc — leave untouched.
      continue;
    }
    const r = await optimizeFile(file);
    if (!r) continue; // skipped (undecodable)
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
    `\nConverted ${converted} image(s). ${(
      totalBefore / 1024 /
      1024
    ).toFixed(1)}MB -> ${(totalAfter / 1024 / 1024).toFixed(1)}MB (${totalPct}% smaller).`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
