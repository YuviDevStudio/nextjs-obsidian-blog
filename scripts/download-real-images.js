const fs = require('fs');
const path = require('path');
const https = require('https');

const postsImagesDir = path.join(__dirname, '..', 'posts', 'images');
const brainDir = path.join('/Users/kiketion/.gemini/antigravity/brain/bb49f331-157b-4bac-b65f-8bbd7b5b432d');

if (!fs.existsSync(postsImagesDir)) {
  fs.mkdirSync(postsImagesDir, { recursive: true });
}

// First, copy our high-resolution AI generated images from brain dir
const brainCopies = [
  { src: 'calibrar_mando_portada_1786747389462.jpg', dest: 'calibrar-mando-portada.jpg' },
  { src: 'calibrar_mando_stickdrift_1786747400665.jpg', dest: 'calibrar-mando-stickdrift.jpg' },
  { src: 'calibrar_mando_pasos_1786747429136.jpg', dest: 'calibrar-mando-pasos.jpg' },
  { src: 'calibrar_mando_compatibles_1786747446498.jpg', dest: 'calibrar-mando-compatibles.jpg' },
  { src: 'magnesio_portada_1786747465526.jpg', dest: 'magnesio-portada.jpg' },
  { src: 'magnesio_longevidad_1786747479667.jpg', dest: 'magnesio-longevidad.jpg' },
];

for (const { src, dest } of brainCopies) {
  const srcPath = path.join(brainDir, src);
  const destPath = path.join(postsImagesDir, dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied brain image: ${src} -> ${dest}`);
  }
}

// Curated high-res Unsplash photos for each post topic
const downloads = [
  // Gemini 3.7 Flash
  { url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1400&auto=format&fit=crop&q=85', dest: 'gemini37-portada.jpg' },
  { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&auto=format&fit=crop&q=85', dest: 'gemini37-precios.jpg' },
  { url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1400&auto=format&fit=crop&q=85', dest: 'gemini37-benchmarks.jpg' },

  // Grok 4.6 & Supercomputing
  { url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1400&auto=format&fit=crop&q=85', dest: 'grok46-portada.jpg' },
  { url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1400&auto=format&fit=crop&q=85', dest: 'grok46-arquitectura.jpg' },
  { url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1400&auto=format&fit=crop&q=85', dest: 'grok46-benchmarks.jpg' },

  // Qwen 3.8 & Alibaba
  { url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1400&auto=format&fit=crop&q=85', dest: 'qwen38-portada.jpg' },
  { url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1400&auto=format&fit=crop&q=85', dest: 'qwen38-multimodal.jpg' },
  { url: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1400&auto=format&fit=crop&q=85', dest: 'qwen38-benchmarks.jpg' },

  // ChatGPT 5.6 & Comparativa
  { url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1400&auto=format&fit=crop&q=85', dest: 'chatgpt56-revolucion-portada.jpg' },
  { url: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=1400&auto=format&fit=crop&q=85', dest: 'chatgpt56-multimodal.jpg' },
  { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&auto=format&fit=crop&q=85', dest: 'chatgpt56-arquitectura.jpg' },
  { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1400&auto=format&fit=crop&q=85', dest: 'chatgpt56-comparativa.jpg' },

  // Matthew McConaughey & Joel The Last of Us
  { url: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1400&auto=format&fit=crop&q=85', dest: 'mcconaughey-joel-portada.jpg' },
  { url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1400&auto=format&fit=crop&q=85', dest: 'mcconaughey-joel-casting.jpg' },
  { url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1400&auto=format&fit=crop&q=85', dest: 'mcconaughey-joel-razones.jpg' },

  // Magnesio (rest of images)
  { url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1400&auto=format&fit=crop&q=85', dest: 'magnesio-cardiovascular.jpg' },
  { url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1400&auto=format&fit=crop&q=85', dest: 'magnesio-tipos-suplemento.jpg' },

  // Ganar Masa Muscular & Hipertrofia
  { url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1400&auto=format&fit=crop&q=85', dest: 'foto-entrenamiento.jpg' },
  { url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400&auto=format&fit=crop&q=85', dest: 'hipertrofia-volumen.jpg' },
  { url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1400&auto=format&fit=crop&q=85', dest: 'hipertrofia-intensidad.jpg' },

  // Perder Grasa y Ganar Musculo (Recomposición)
  { url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1400&auto=format&fit=crop&q=85', dest: 'recomposicion-portada.jpg' },
  { url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1400&auto=format&fit=crop&q=85', dest: 'recomposicion-entrenamiento.jpg' },
  { url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1400&auto=format&fit=crop&q=85', dest: 'recomposicion-nutricion.jpg' },
  { url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1400&auto=format&fit=crop&q=85', dest: 'recomposicion-metabolismo.jpg' },

  // Tadalafilo
  { url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&auto=format&fit=crop&q=85', dest: 'tadalafilo-portada.jpg' },
  { url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1400&auto=format&fit=crop&q=85', dest: 'tadalafilo-cardiovascular.jpg' },
  { url: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1400&auto=format&fit=crop&q=85', dest: 'tadalafilo-cerebro.jpg' },

  // Analisis LLMs & Arquitectura IA
  { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&auto=format&fit=crop&q=85', dest: 'analisis-llms-portada.jpg' },
  { url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1400&auto=format&fit=crop&q=85', dest: 'analisis-llms-mapa.jpg' },
  { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400&auto=format&fit=crop&q=85', dest: 'analisis-llms-agentes.jpg' },

  // 5 Consejos Atractivo
  { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1400&auto=format&fit=crop&q=85', dest: 'atractivo-portada.jpg' },
  { url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1400&auto=format&fit=crop&q=85', dest: 'atractivo-piel.jpg' },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&auto=format&fit=crop&q=85', dest: 'atractivo-postura.jpg' },
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode} for ${url}`));
      }
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve());
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log(`Starting download of ${downloads.length} curated images...`);
  for (const item of downloads) {
    const destPath = path.join(postsImagesDir, item.dest);
    try {
      await downloadFile(item.url, destPath);
      const stat = fs.statSync(destPath);
      console.log(`Downloaded ${item.dest} (${Math.round(stat.size / 1024)} KB)`);
    } catch (err) {
      console.error(`Failed ${item.dest}: ${err.message}`);
    }
  }
  console.log('All image downloads completed.');
}

run();
