import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

// Helper: Generate slug from title
function slugify(str) {
  return str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Build a map: { title: slug }
function getTitleSlugMap() {
  const fileNames = fs.readdirSync(postsDirectory);
  const map = {};
  fileNames.forEach((fileName) => {
    if (fileName.endsWith('.md')) {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      if (data.title) {
        map[data.title.trim()] = slugify(data.title);
      }
    }
  });
  return map;
}

function getFilenameBySlug(slug) {
  const fileNames = fs.readdirSync(postsDirectory);
  for (const fileName of fileNames) {
    if (fileName.endsWith('.md')) {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      if (data.title && slugify(data.title) === slug) {
        return fileName;
      }
    }
  }
  return null;
}

export function getPostData(id) {
  // Find the filename by slug
  const fileName = getFilenameBySlug(id);
  if (!fileName) {
    throw new Error(`Post not found for slug: ${id}`);
  }
  const fullPath = path.join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  // Get title-slug map
  const titleSlugMap = getTitleSlugMap();

  let content = matterResult.content;

  // 1. Replace Obsidian image syntax with Markdown image syntax FIRST
  content = content.replace(/!\[\[([^\]]+)\]\]/g, (match, p1) => {
    return `![](/images/${p1.trim()})`;
  });

  // 2. Replace Obsidian wikilinks ([[Post Title]]) with Markdown links
  content = content.replace(/\[\[([^\]]+)\]\]/g, (match, p1) => {
    // Support custom link text: [[Post Title|Custom Text]]
    const [linkTitle, customText] = p1.split('|').map(s => s.trim());
    const slug = titleSlugMap[linkTitle];
    const linkText = customText || linkTitle;
    if (slug) {
      return `[${linkText}](/${slug})`;
    }
    // If not found, return just the text
    return linkText;
  });

  // Ensure date is a string
  let date = matterResult.data.date;
  if (date instanceof Date) {
    date = date.toISOString().split('T')[0];
  } else if (typeof date === 'number') {
    date = new Date(date).toISOString().split('T')[0];
  } else if (typeof date !== 'string') {
    date = String(date);
  }

  return {
    id,
    ...matterResult.data,
    date,
    content,
  };
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      if (data.title) {
        return { params: { id: slugify(data.title) } };
      }
      return null;
    })
    .filter(Boolean);
}

export function getSortedPostsData() {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPosts = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      const id = slugify(data.title || fileName.replace(/\.md$/, ''));
      // Ensure date is a string
      let date = data.date;
      if (date instanceof Date) {
        date = date.toISOString().split('T')[0];
      } else if (typeof date === 'number') {
        date = new Date(date).toISOString().split('T')[0];
      } else if (typeof date !== 'string') {
        date = String(date);
      }
      return {
        id,
        ...data,
        date,
      };
    })
    .filter(Boolean);

  // Sort posts by date descending
  return allPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
}
