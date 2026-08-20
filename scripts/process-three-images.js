const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processImages() {
  const imagesDir = path.join(__dirname, '..', 'posts', 'images');
  const publicDir = path.join(__dirname, '..', 'public', 'posts', 'images');

  // 1. Matthew McConaughey + Pedro Pascal composite (1280 x 720)
  console.log('Generating McConaughey vs Pascal side-by-side hero image...');
  const mcPath = '/tmp/mcconaughey.jpg';
  const ppPath = '/tmp/pedro-pascal.jpg';
  const mcOut = path.join(imagesDir, 'mcconaughey-joel-portada.jpg');

  const width = 1280;
  const height = 720;
  const halfWidth = 640;

  const mcBuffer = await sharp(mcPath)
    .resize(halfWidth, height, { fit: 'cover', position: 'north' })
    .toBuffer();

  const ppBuffer = await sharp(ppPath)
    .resize(halfWidth, height, { fit: 'cover', position: 'north' })
    .toBuffer();

  await sharp({
    create: {
      width: width,
      height: height,
      channels: 3,
      background: { r: 20, g: 20, b: 20 }
    }
  })
  .composite([
    { input: mcBuffer, top: 0, left: 0 },
    { input: ppBuffer, top: 0, left: halfWidth }
  ])
  .jpeg({ quality: 92 })
  .toFile(mcOut);

  console.log('-> Generated:', mcOut, fs.statSync(mcOut).size);

  // 2. Real PS5 Controller & Analog Sticks for Calibrar Mandos (1280 x 720)
  console.log('Generating PS5 Controller hero image...');
  const ps5In = '/tmp/ps5-1.jpg';
  const ps5Out = path.join(imagesDir, 'calibrar-mando-portada.jpg');

  await sharp(ps5In)
    .resize(1280, 720, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 92 })
    .toFile(ps5Out);

  console.log('-> Generated:', ps5Out, fs.statSync(ps5Out).size);

  // 3. Real AI Processor & Neural Compute Chip for Qwen 3.8 (1280 x 720)
  console.log('Generating Qwen 3.8 AI Hardware / Processor hero image...');
  const qwenIn = '/tmp/real-qwen-ai-chip.jpg';
  const qwenOut = path.join(imagesDir, 'qwen38-portada.jpg');

  await sharp(qwenIn)
    .resize(1280, 720, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 92 })
    .toFile(qwenOut);

  console.log('-> Generated:', qwenOut, fs.statSync(qwenOut).size);

  // Copy to public/posts/images
  fs.copyFileSync(mcOut, path.join(publicDir, 'mcconaughey-joel-portada.jpg'));
  fs.copyFileSync(ps5Out, path.join(publicDir, 'calibrar-mando-portada.jpg'));
  fs.copyFileSync(qwenOut, path.join(publicDir, 'qwen38-portada.jpg'));
  console.log('Copied all 3 new featured images to public/posts/images/');
}

processImages().catch(console.error);
