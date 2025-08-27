
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(process.cwd(), 'posts');
const outputFilePath = path.join(process.cwd(), 'lib/posts.json');

function contentObsidianToMD(content) {
  // Regular expression to match text in double brackets
  let linkRegex = /\[\[([^\]]+)\]\]/g;
  let imageRegex = /!\[\[([^\]]+)\]\]/g;

  // do images first
  let replacedImagesText = content.replace(imageRegex, '![](/images/$1)');
  let replacedLinksText = replacedImagesText.replace(linkRegex, '[$1](/$1)');

  return replacedLinksText;
}

function frontMatterObsidianToMD(data) {
  let newData = data;
  if (typeof newData.date !== 'string') {
    newData.date = newData.date.toISOString().split('T')[0];
  }
  return newData;
}

function getPostsData() {
  const fileNames = fs.readdirSync(postsDirectory);
  const slugify = (str) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const allPostsData = fileNames.map((fileName) => {
    const rawName = fileName.replace(/\.md$/, '');
    const id = slugify(rawName);
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

const allPostsData = getPostsData();
fs.writeFileSync(outputFilePath, JSON.stringify(allPostsData));
