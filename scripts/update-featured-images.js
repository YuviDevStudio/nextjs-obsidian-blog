const fs = require('fs');
const path = require('path');
const https = require('https');

const postsImagesDir = path.join(__dirname, '..', 'posts', 'images');
const publicImagesDir = path.join(__dirname, '..', 'public', 'posts', 'images');

const featuredReplacements = [
  // 1. Matthew McConaughey: Real portrait from Toronto Film Festival (Wikimedia)
  {
    name: 'mcconaughey-joel-portada.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Matthew_McConaughey_at_the_2025_Toronto_Film_Festival_%28Cropped%29.jpg',
    source: 'wikimedia'
  },
  // 7. Arquitectura de IA / LLMs: Real code & AI development environment
  {
    name: 'analisis-llms-portada.jpg',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1400&auto=format&fit=crop&q=85',
    source: 'unsplash'
  },
  // 8. Tadalafilo / Farmacología / Salud Vascular: Blister pack / capsules
  {
    name: 'tadalafilo-portada.jpg',
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1400&auto=format&fit=crop&q=85',
    source: 'unsplash'
  },
  // 9. Ganar Masa Muscular / Hipertrofia: Athlete lifting heavy barbell
  {
    name: 'foto-entrenamiento.jpg',
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1400&auto=format&fit=crop&q=85',
    source: 'unsplash'
  },
  // 10. Recomposición Corporal: High-protein nutrition & meal prep
  {
    name: 'recomposicion-portada.jpg',
    url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1400&auto=format&fit=crop&q=85',
    source: 'unsplash'
  },
  // 12. Atractivo y Presencia: Confident, charismatic natural portrait with warm lighting
  {
    name: 'atractivo-portada.jpg',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&auto=format&fit=crop&q=85',
    source: 'unsplash'
  }
];

function download(item) {
  return new Promise((resolve, reject) => {
    const dest = path.join(postsImagesDir, item.name);
    const headers = {
      'User-Agent': 'JotaEdraBot/1.0 (https://jotaedra.com; contact@jotaedra.com) Mozilla/5.0'
    };

    function fetchUrl(u) {
      https.get(u, { headers }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetchUrl(res.headers.location);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`Failed to download ${item.name}: status ${res.statusCode}`));
        }
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => {
          file.close(() => {
            const stat = fs.statSync(dest);
            console.log(`[SUCCESS] Downloaded ${item.name} (${Math.round(stat.size / 1024)} KB)`);
            resolve();
          });
        });
      }).on('error', reject);
    }

    fetchUrl(item.url);
  });
}

async function run() {
  console.log('Replacing main featured images for the posts with real related images...\n');
  for (const item of featuredReplacements) {
    try {
      await download(item);
    } catch (e) {
      console.error(`[ERROR] ${item.name}: ${e.message}`);
    }
  }
  console.log('\nAll replacements finished.');
}

run();
