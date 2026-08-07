/**
 * Pre-build validator for markdown posts.
 * The app reads posts directly from `posts/*.md` via lib/posts.js —
 * this script no longer generates lib/posts.json.
 *
 * It also mirrors `posts/images/` into `public/posts/images/` so post images
 * are served as static assets (required on Cloudflare Pages, which runs the
 * Edge Runtime and cannot read the filesystem at request time).
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(process.cwd(), 'posts');
const legacyJsonPath = path.join(process.cwd(), 'lib', 'posts.json');

if (fs.existsSync(legacyJsonPath)) {
  console.error(
    'Legacy lib/posts.json detected. Remove it — posts are loaded from markdown at runtime.'
  );
  process.exit(1);
}

function slugify(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

if (!fs.existsSync(postsDirectory)) {
  console.error(`Posts directory not found: ${postsDirectory}`);
  process.exit(1);
}

const fileNames = fs
  .readdirSync(postsDirectory)
  .filter((name) => name.endsWith('.md'));

const seenIds = new Map();
let errors = 0;

for (const fileName of fileNames) {
  const fullPath = path.join(postsDirectory, fileName);
  let fileContents;
  try {
    fileContents = fs.readFileSync(fullPath, 'utf8');
  } catch (err) {
    console.error(`Cannot read ${fileName}: ${err.message}`);
    errors += 1;
    continue;
  }

  let data;
  try {
    ({ data } = matter(fileContents));
  } catch (err) {
    console.error(`Invalid front matter in ${fileName}: ${err.message}`);
    if (/mapping pair|bad indentation|can not read/i.test(err.message)) {
      console.error(
        `  Hint: quote values that contain ":" (colons), e.g. title: "My Title: Subtitle"`
      );
    }
    errors += 1;
    continue;
  }

  if (!data.title) {
    console.warn(
      `Missing title in ${fileName} — slug will fall back to filename`
    );
  }

  const id = slugify(data.title || fileName.replace(/\.md$/, ''));
  if (!id) {
    console.error(`Empty slug for ${fileName}`);
    errors += 1;
    continue;
  }

  if (seenIds.has(id)) {
    console.warn(
      `Duplicate slug "${id}" in ${fileName} (also ${seenIds.get(id)})`
    );
  } else {
    seenIds.set(id, fileName);
  }
}

if (errors > 0) {
  console.error(`Post validation failed with ${errors} error(s).`);
  process.exit(1);
}

// Mirror posts/images -> public/posts/images so images are static assets.
const imagesDir = path.join(postsDirectory, 'images');
const publicImagesDir = path.join(process.cwd(), 'public', 'posts', 'images');
if (fs.existsSync(imagesDir)) {
  fs.rmSync(publicImagesDir, { recursive: true, force: true });
  fs.mkdirSync(publicImagesDir, { recursive: true });
  let copied = 0;
  for (const file of fs.readdirSync(imagesDir)) {
    const src = path.join(imagesDir, file);
    if (!fs.statSync(src).isFile()) continue;
    fs.copyFileSync(src, path.join(publicImagesDir, file));
    copied += 1;
  }
  console.log(`Copied ${copied} image(s) to public/posts/images.`);
}

console.log(
  `Validated ${fileNames.length} markdown post(s). Skipping JSON generation.`
);
