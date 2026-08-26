import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { cache } from 'react';

const postsDirectory = path.join(process.cwd(), 'posts');

/** Slugify with accent stripping so Spanish titles stay readable (más → mas). */
export function slugify(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeDate(date) {
  if (date == null || date === '') return null;
  if (date instanceof Date) {
    return Number.isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
  }
  if (typeof date === 'number') {
    const d = new Date(date);
    return Number.isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
  }
  if (typeof date === 'string') {
    const trimmed = date.trim();
    if (!trimmed || trimmed === 'undefined' || trimmed === 'null') return null;
    return trimmed.split('T')[0];
  }
  return null;
}

function getMarkdownFileNames() {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs.readdirSync(postsDirectory).filter((fileName) => fileName.endsWith('.md'));
}

/**
 * Load all markdown posts once per request (React cache).
 * Builds title/filename → slug maps for wikilink resolution.
 * Invalid front matter is skipped with a console warning so one bad post
 * cannot take down the whole site.
 */
const loadPostsIndex = cache(function loadPostsIndex() {
  const fileNames = getMarkdownFileNames();
  const titleSlugMap = {};
  const posts = [];

  for (const fileName of fileNames) {
    const fullPath = path.join(postsDirectory, fileName);
    let fileContents;
    try {
      fileContents = fs.readFileSync(fullPath, 'utf8');
    } catch {
      continue;
    }

    let matterResult;
    try {
      matterResult = matter(fileContents);
    } catch (err) {
      console.error(
        `[posts] Skipping "${fileName}": invalid front matter — ${err.message}`
      );
      continue;
    }

    const title = matterResult.data?.title;
    const fileStem = fileName.replace(/\.md$/, '');
    const id = slugify(title || fileStem);

    if (title) {
      const trimmedTitle = String(title).trim();
      titleSlugMap[trimmedTitle] = id;
      titleSlugMap[slugify(trimmedTitle)] = id;
    }
    titleSlugMap[fileStem] = id;
    titleSlugMap[slugify(fileStem)] = id;

    posts.push({
      fileName,
      id,
      data: matterResult.data || {},
      content: matterResult.content,
    });
  }

  return { posts, titleSlugMap };
});

/** Remove a leading markdown H1 that duplicates the frontmatter title. */
function stripDuplicateTitleHeading(content, title) {
  if (!title || !content) return content;
  const trimmed = content.replace(/^\uFEFF/, '').trimStart();
  const match = trimmed.match(/^#\s+(.+?)(?:\r?\n|$)/);
  if (!match) return content;
  const heading = match[1].trim().replace(/^["']|["']$/g, '');
  if (heading === String(title).trim()) {
    return trimmed.slice(match[0].length).replace(/^\r?\n+/, '');
  }
  return content;
}

/**
 * Normalize markdown image URLs so relative Obsidian/export paths resolve
 * to the app's /posts/images/* route.
 * e.g. ./posts/images/foo.png → /posts/images/foo.png
 */
function normalizeImageUrl(url) {
  if (!url) return url;
  const trimmed = String(url).trim();
  // Already absolute site path or external URL
  if (/^(https?:|data:|\/\/)/i.test(trimmed) || trimmed.startsWith('/posts/images/')) {
    return toOptimizedImageUrl(trimmed);
  }
  // ./posts/images/foo.png, posts/images/foo.png, images/foo.png, or bare filename
  const match = trimmed.match(/(?:^\.?\/?(?:posts\/)?images\/)?([^/?#]+)$/);
  if (match) {
    return toOptimizedImageUrl(`/posts/images/${match[1]}`);
  }
  return trimmed;
}

/**
 * Prefer the optimized WebP variant shipped by scripts/optimize-images.js.
 * Source images are converted to `.webp`; extensions in markdown/frontmatter
 * are rewritten here so no content changes are required.
 */
function toOptimizedImageUrl(url) {
  if (typeof url !== 'string') return url;
  if (url.startsWith('/posts/images/') && /\.(jpe?g|png|gif)$/i.test(url)) {
    return url.replace(/\.(jpe?g|png|gif)$/i, '.webp');
  }
  return url;
}

/** Rewrite a post's `featured_image` to the optimized WebP variant, if any. */
function withOptimizedImages(post) {
  if (!post || typeof post !== 'object') return post;
  if (post.featured_image) {
    return { ...post, featured_image: toOptimizedImageUrl(post.featured_image) };
  }
  return post;
}

function processContent(rawContent, title, titleSlugMap) {
  let content = stripDuplicateTitleHeading(rawContent, title);

  // 1. Obsidian image embeds → markdown images
  content = content.replace(/!\[\[([^\]]+)\]\]/g, (match, p1) => {
    const src = normalizeImageUrl(String(p1).trim());
    return `![](${src})`;
  });

  // 2. Relative/absolute markdown image paths → /posts/images/*
  content = content.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (match, alt, url) => `![${alt}](${normalizeImageUrl(url)})`
  );

  // 3. Wikilinks [[Title]] or [[Title|Custom text]]
  content = content.replace(/\[\[([^\]]+)\]\]/g, (match, p1) => {
    const parts = String(p1).split('|').map((s) => s.trim());
    const linkTitle = parts[0];
    const customText = parts[1];
    const slug =
      titleSlugMap[linkTitle] ||
      titleSlugMap[slugify(linkTitle)];
    const linkText = customText || linkTitle;
    if (slug) {
      return `[${linkText}](/${slug})`;
    }
    return linkText;
  });

  return content;
}

/**
 * @returns {object|null} Post data or null if not found (callers should use notFound()).
 */
export function getPostData(id) {
  const { posts, titleSlugMap } = loadPostsIndex();
  const post =
    posts.find((p) => p.id === id) ||
    posts.find((p) => slugify(p.fileName.replace(/\.md$/, '')) === id);

  if (!post) {
    return null;
  }

  const date = normalizeDate(post.data.date);
  const content = processContent(post.content, post.data.title, titleSlugMap);

  return withOptimizedImages({
    id: post.id,
    ...post.data,
    date,
    content,
  });
}

export function getAllPostIds() {
  const { posts } = loadPostsIndex();
  return posts.map((post) => ({
    params: { id: post.id },
  }));
}

export function getSortedPostsData() {
  const { posts } = loadPostsIndex();
  const allPosts = posts.map((post) => {
    const date = normalizeDate(post.data.date);
    return withOptimizedImages({
      id: post.id,
      ...post.data,
      date,
    });
  });

  return allPosts.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date < b.date ? 1 : -1;
  });
}

export function getAllTags() {
  const allPosts = getSortedPostsData();
  const tags = new Set();
  for (const post of allPosts) {
    if (Array.isArray(post.tags)) {
      for (const tag of post.tags) {
        if (tag) tags.add(tag);
      }
    }
  }
  return Array.from(tags);
}

export function getPostsByTag(tag) {
  const allPosts = getSortedPostsData();
  return allPosts.filter(
    (post) => Array.isArray(post.tags) && post.tags.includes(tag)
  );
}

/** Lightweight list for client search (no full markdown body). */
export function getSearchIndex() {
  return getSortedPostsData().map(({ id, title, description, tags }) => ({
    id,
    title: title || '',
    description: description || '',
    tags: Array.isArray(tags) ? tags : [],
  }));
}

/**
 * Find related posts by shared tags (case-insensitive). Posts with more
 * overlapping tags rank first; ties keep the newest-first order from
 * getSortedPostsData(). The current post is always excluded. If fewer than
 * `limit` posts share tags, the most recent remaining posts are appended so
 * the list always has up to `limit` entries.
 */
export function getRelatedPosts(id, limit = 4) {
  const allPosts = getSortedPostsData();
  const current = allPosts.find((p) => p.id === id);
  if (!current) return [];

  const currentTags = new Set(
    (Array.isArray(current.tags) ? current.tags : []).map((t) =>
      String(t).toLowerCase()
    )
  );

  const scored = allPosts
    .filter((p) => p.id !== id)
    .map((post) => {
      const postTags = Array.isArray(post.tags) ? post.tags : [];
      const shared = postTags.filter((t) =>
        currentTags.has(String(t).toLowerCase())
      ).length;
      return { post, shared };
    });

  const byShared = scored
    .filter(({ shared }) => shared > 0)
    .sort((a, b) => b.shared - a.shared);

  const rest = scored.filter(({ shared }) => shared === 0);

  return byShared
    .concat(rest)
    .slice(0, limit)
    .map(({ post }) => post);
}
