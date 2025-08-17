import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');
const generatedJson = (() => {
  try {
    // Prefer prebuilt data/posts.json when available (generated at build time)
    // This avoids using fs in Edge bundles because JSON import is safe.
    const jsonPath = path.join(process.cwd(), 'data', 'posts.json');
    if (fs.existsSync(jsonPath)) {
      return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    }
  } catch (e) {
    // ignore
  }
  return null;
})();

export function getSortedPostsData() {
  if (generatedJson) {
    return generatedJson.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  // Fallback to reading from filesystem (dev/build time)
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    frontMatterObsidianToMD(matterResult.data);
    return {
      id,
      ...matterResult.data,
    };
  });
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllPostIds() {
  if (generatedJson) {
    return generatedJson.map((p) => ({ params: { id: p.id } }));
  }
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => ({ params: { id: fileName.replace(/\.md$/, '') } }));
}

export async function getPostData(id) {
  if (generatedJson) {
    const found = generatedJson.find((p) => p.id === id);
    if (found) return found;
    throw new Error('Post not found: ' + id);
  }

  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  matterResult.content = contentObsidianToMD(matterResult.content);
  matterResult.data = frontMatterObsidianToMD(matterResult.data);
  const content = matterResult.content;
  return {
    id,
    content,
    ...matterResult.data,
  };
}

function frontMatterObsidianToMD(data) {
  let newData = data
  if (typeof newData.date !== 'string') {
    newData.date = newData.date.toISOString().split('T')[0];
  }
  return newData
}

function contentObsidianToMD(content) {

  // Regular expression to match text in double brackets
  let linkRegex = /\[\[([^\]]+)\]\]/g;
  let imageRegex = /!\[\[([^\]]+)\]\]/g;

  // do images first
  let replacedImagesText = content.replace(imageRegex, '![](/images/$1)');
  let replacedLinksText = replacedImagesText.replace(linkRegex, '[$1](/$1)');

  return replacedLinksText
}