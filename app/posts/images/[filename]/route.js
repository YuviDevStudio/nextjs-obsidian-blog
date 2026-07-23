import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

export async function GET(_req, { params }) {
  const { filename: rawName } = await params;

  // Prevent path traversal: only allow a single basename under posts/images
  if (typeof rawName !== 'string' || !rawName || rawName.includes('\0')) {
    return new NextResponse('Not found', { status: 404 });
  }

  const filename = path.basename(rawName);
  if (filename !== rawName || filename === '.' || filename === '..') {
    return new NextResponse('Not found', { status: 404 });
  }

  const imagesDir = path.resolve(process.cwd(), 'posts', 'images');
  const filePath = path.resolve(imagesDir, filename);

  if (!filePath.startsWith(imagesDir + path.sep)) {
    return new NextResponse('Not found', { status: 404 });
  }

  try {
    const buffer = fs.readFileSync(filePath);
    const ext = path.extname(filename).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
