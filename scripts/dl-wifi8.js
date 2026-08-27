const fs = require('fs');
const path = require('path');
const https = require('https');

const imagesDir = path.join(__dirname, '..', 'posts', 'images');
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

// Real, freely-licensed Unsplash photos (Wi-Fi routers / wireless networking)
const downloads = [
  { url: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=1600&auto=format&fit=crop&q=85', dest: 'wifi8-portada.jpg' },
  { url: 'https://images.unsplash.com/photo-1745847768408-b7b83796cae6?w=1600&auto=format&fit=crop&q=85', dest: 'wifi8-router.jpg' },
  { url: 'https://images.unsplash.com/photo-1681383064412-171e5bee5f6e?w=1600&auto=format&fit=crop&q=85', dest: 'wifi8-access-points.jpg' },
  { url: 'https://images.unsplash.com/photo-1760799264651-2f24f42d2eae?w=1600&auto=format&fit=crop&q=85', dest: 'wifi8-6g.jpg' },
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`Status ${res.statusCode} for ${url}`));
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve()));
    }).on('error', reject);
  });
}

async function run() {
  for (const item of downloads) {
    const destPath = path.join(imagesDir, item.dest);
    try {
      await downloadFile(item.url, destPath);
      const kb = Math.round(fs.statSync(destPath).size / 1024);
      console.log(`Downloaded ${item.dest} (${kb} KB)`);
    } catch (err) {
      console.error(`Failed ${item.dest}: ${err.message}`);
    }
  }
  console.log('Done.');
}
run();
