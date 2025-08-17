const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(process.cwd(), 'posts');
const outDir = path.join(process.cwd(), 'data');
const outFile = path.join(outDir, 'posts.json');

function frontMatterObsidianToMD(data) {
  let newData = data || {};
  if (newData.date && typeof newData.date !== 'string') {
    newData.date = newData.date.toISOString().split('T')[0];
  }
  return newData;
}

function contentObsidianToMD(content) {
  let linkRegex = /\[\[([^\]]+)\]\]/g;
  let imageRegex = /!\[\[([^\]]+)\]\]/g;
  let replacedImagesText = content.replace(imageRegex, '![](/images/$1)');
  let replacedLinksText = replacedImagesText.replace(linkRegex, '[$1](/$1)');
  return replacedLinksText;
}

function build() {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const fileNames = fs.readdirSync(postsDirectory).filter((f) => f.endsWith('.md'));
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    const content = contentObsidianToMD(matterResult.content || '');
    const data = frontMatterObsidianToMD(matterResult.data || {});
    return {
      id,
      content,
      ...data,
    };
  });

  // sort by date desc
  allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));

  fs.writeFileSync(outFile, JSON.stringify(allPostsData, null, 2), 'utf8');
  console.log('Generated', outFile);
}

build();
