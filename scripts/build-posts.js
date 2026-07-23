/**
 * Pre-build validator for markdown posts.
 * The app reads posts directly from `posts/*.md` via lib/posts.js —
 * this script no longer generates lib/posts.json.
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
    errors += 1;
    continue;
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

console.log(
  `Validated ${fileNames.length} markdown post(s). Skipping JSON generation.`
);
