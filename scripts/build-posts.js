
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(process.cwd(), 'posts');

function contentObsidianToMD(content) {
  // Regular expression to match text in double brackets
  let linkRegex = /\[\[([^\]]+)\]\]/g;
  let imageRegex = /!\[\[([^\]]+)\]\]/g;

  const slugify = (text) =>
    String(text || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  // do images first (map to /images/<name>)
  let replacedImagesText = content.replace(imageRegex, (m, p1) => `![](/images/${p1})`);

  // convert [[Title]] -> [Title](/posts/title-slug)
  let replacedLinksText = replacedImagesText.replace(linkRegex, (m, p1) => {
    const slug = slugify(p1);
    return `[${p1}](/posts/${slug})`;
  });

  return replacedLinksText;
}

function frontMatterObsidianToMD(data) {
  if (!data) return {};
  const newData = { ...data };
  if (newData.date) {
    if (newData.date instanceof Date) {
      newData.date = newData.date.toISOString().split('T')[0];
    } else if (typeof newData.date === 'string') {
      newData.date = newData.date.split('T')[0];
    } else {
      newData.date = String(newData.date);
    }
  }
  return newData;
}

function getPostsData() {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    matterResult.content = contentObsidianToMD(matterResult.content);
    matterResult.data = frontMatterObsidianToMD(matterResult.data);

    return {
      id,
      ...matterResult.data,
      content: matterResult.content,
    };
  });
  return allPostsData;
}

// Previously this script wrote lib/posts.json which caused the app to use a
// committed/auto-generated JSON file. We no longer write that file. The
// application now reads markdown from the `posts/` directory directly.
// Keep this script as a harmless pre-build validator/converter if needed.
const allPostsData = getPostsData();
console.log(`Found ${allPostsData.length} markdown posts. Skipping JSON generation.`);
