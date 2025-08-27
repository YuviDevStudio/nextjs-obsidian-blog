import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getAllPosts() {
  const fileNames = fs.readdirSync(postsDirectory).filter((f) => f.endsWith('.md'));
  return fileNames.map((fileName) => {
    const rawName = fileName.replace(/\.md$/, '');
    const id = slugify(rawName);
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    // Ensure date is always a string
    let dateStr = data.date;
    if (dateStr instanceof Date) {
      dateStr = dateStr.toISOString().split('T')[0];
    }
    // Convert Obsidian image syntax to Markdown image syntax
    const formattedContent = content.replace(/!\[\[([^\]]+)\]\]/g, '![](/images/$1)');
    return {
      id,
      ...data,
      date: dateStr,
      content: formattedContent,
    };
  });
}

export function getSortedPostsData() {
  const posts = getAllPosts();
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllPostIds() {
  const posts = getAllPosts();
  return posts.map((post) => ({ params: { id: post.id } }));
}

export async function getPostData(id) {
  const posts = getAllPosts();
  const post = posts.find((post) => post.id === id);
  if (!post) return null;
  return { id, ...post };
}
