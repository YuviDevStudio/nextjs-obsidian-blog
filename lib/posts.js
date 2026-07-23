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

    const matterResult = matter(fileContents);
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

function processContent(rawContent, title, titleSlugMap) {
  let content = stripDuplicateTitleHeading(rawContent, title);

  // 1. Obsidian image embeds → markdown images
  content = content.replace(/!\[\[([^\]]+)\]\]/g, (match, p1) => {
    return `![](/posts/images/${String(p1).trim()})`;
  });

  // 2. Wikilinks [[Title]] or [[Title|Custom text]]
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

  return {
    id: post.id,
    ...post.data,
    date,
    content,
  };
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
    return {
      id: post.id,
      ...post.data,
      date,
    };
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
