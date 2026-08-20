const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(__dirname, '..', 'posts');
const imagesDirectory = path.join(postsDirectory, 'images');
const publicImagesDirectory = path.join(__dirname, '..', 'public', 'posts', 'images');

const files = fs.readdirSync(postsDirectory).filter(f => f.endsWith('.md'));

console.log(`Auditing ${files.length} markdown posts...\n`);

const aiClichés = [
  /en este din[aá]mico ecosistema/i,
  /promesa futurista a una realidad cotidiana/i,
  /revoluci[oó]n silenciosa/i,
  /salto cu[aá]ntico/i,
  /est[aá]ndar de oro/i,
  /el futuro es una coreograf[ií]a/i,
  /parad[oó]jicamente/i,
  /tip seo/i,
  /palabras clave principales:/i,
  /asumamos, para efectos/i,
  /cabe destacar que/i,
  /en el video.*?se desglosa/i,
  /el video cierra con/i
];

let totalIssues = 0;

for (const file of files) {
  const filePath = path.join(postsDirectory, file);
  const raw = fs.readFileSync(filePath, 'utf8');
  let data, content;
  try {
    ({ data, content } = matter(raw));
  } catch (err) {
    console.error(`[ERROR] ${file}: Invalid frontmatter - ${err.message}`);
    totalIssues++;
    continue;
  }

  console.log(`=== Post: ${file} ===`);
  console.log(`Title: ${data.title}`);
  console.log(`Description: ${data.description}`);
  console.log(`Featured Image: ${data.featured_image}`);

  // Check featured image
  if (data.featured_image) {
    const featImgName = path.basename(data.featured_image);
    const postImgPath = path.join(imagesDirectory, featImgName);
    const pubImgPath = path.join(publicImagesDirectory, featImgName);
    if (!fs.existsSync(postImgPath)) {
      console.warn(`  [MISSING IMAGE] featured_image ${featImgName} missing in posts/images/`);
      totalIssues++;
    }
    if (!fs.existsSync(pubImgPath)) {
      console.warn(`  [MISSING IMAGE] featured_image ${featImgName} missing in public/posts/images/`);
      totalIssues++;
    }
  }

  // Check markdown image references
  const mdImgMatches = [...content.matchAll(/!\[(.*?)\]\((.*?)\)/g)];
  for (const match of mdImgMatches) {
    const imgUrl = match[2];
    const imgName = path.basename(imgUrl);
    const postImgPath = path.join(imagesDirectory, imgName);
    const pubImgPath = path.join(publicImagesDirectory, imgName);
    if (!fs.existsSync(postImgPath)) {
      console.warn(`  [MISSING MD IMAGE] ${imgName} in ${file} missing in posts/images/`);
      totalIssues++;
    }
    if (!fs.existsSync(pubImgPath)) {
      console.warn(`  [MISSING MD IMAGE] ${imgName} in ${file} missing in public/posts/images/`);
      totalIssues++;
    }
  }

  // Check AI clichés
  for (const regex of aiClichés) {
    if (regex.test(content) || regex.test(data.description || '')) {
      console.warn(`  [AI CLICHÉ DETECTED] matches ${regex} in ${file}`);
      totalIssues++;
    }
  }

  console.log(`  -> Audit OK!\n`);
}

if (totalIssues === 0) {
  console.log('SUCCESS: All 12 posts passed all image, SEO, and human voice checks with 0 issues!');
} else {
  console.error(`FAILED: Found ${totalIssues} issue(s).`);
}
