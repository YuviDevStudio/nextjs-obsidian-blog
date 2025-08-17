import matter from 'gray-matter';

let generatedJson = null;
try {
  // Try a static require of the generated JSON. When `data/posts.json` is present
  // (created by the prebuild script) this will be bundled and is Edge-safe.
  // We use require to avoid top-level fs/path imports which trigger Node-only bundles.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  generatedJson = require('../data/posts.json');
} catch (e) {
  generatedJson = null;
}

const postsDirectory = 'posts';

export function getSortedPostsData() {
  if (generatedJson) {
    return generatedJson.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  // If we reach here the prebuilt JSON isn't present. The build environment
  // should run the prebuild script to generate data/posts.json. Throw a clear
  // error so CI/build logs show the missing artifact instead of bundling Node
  // built-ins into Edge runtimes.
  throw new Error('data/posts.json is missing. Run the prebuild script to generate post data.');
}

export function getAllPostIds() {
  if (generatedJson) {
    return generatedJson.map((p) => ({ params: { id: p.id } }));
  }
  throw new Error('data/posts.json is missing. Run the prebuild script to generate post data.');
}

export async function getPostData(id) {
  if (generatedJson) {
    const found = generatedJson.find((p) => p.id === id);
    if (found) return found;
    throw new Error('Post not found: ' + id);
  }
  throw new Error('data/posts.json is missing. Run the prebuild script to generate post data.');
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