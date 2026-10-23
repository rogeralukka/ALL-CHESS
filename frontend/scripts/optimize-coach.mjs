import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const avatarDir = path.resolve(__dirname, '../../avatar');
const coachOutDir = path.resolve(__dirname, '../public/assets/coach');

const EXPRESSIONS = [
  { key: 'neutral', name: 'Aloof / Observant', file: 'Aloof Cartoon Boy in Floral Shirt.png' },
  { key: 'thinking', name: 'Thoughtful', file: 'Thoughtful Boy in Floral Shirt.png' },
  { key: 'thumbsup', name: 'Cheerful Thumbs-Up', file: 'Cheerful Chibi Boy Thumbs-Up Cutout.png' },
  { key: 'brilliant', name: 'Cheeky Finger-Gun', file: 'Cheeky Floral Shirt Finger-Gun Kid.png' },
  { key: 'embarrassed', name: 'Embarrassed', file: 'Embarrassed Chibi Boy in Floral Shirt.png' },
  { key: 'wave', name: 'Friendly Waving', file: 'Friendly Waving Boy in Floral Shirt.png' },
];

async function optimizeCoach() {
  console.log('Optimizing coach assets from avatar/ to public/assets/coach/...');
  fs.mkdirSync(coachOutDir, { recursive: true });

  const manifest = {
    version: '1.0.0',
    expressions: {},
  };

  for (const exp of EXPRESSIONS) {
    const srcPath = path.join(avatarDir, exp.file);
    if (!fs.existsSync(srcPath)) {
      console.warn(`Warning: source file not found: ${srcPath}`);
      continue;
    }

    const bustWebp = `coach_${exp.key}.webp`;
    const fullWebp = `coach_${exp.key}_full.webp`;
    const bustPng = `coach_${exp.key}.png`;
    const fullPng = `coach_${exp.key}_full.png`;

    // Face-centred head-and-shoulders crop: find the figure's top from the alpha channel,
    // centre on the head (mean x of opaque pixels in the top 20% of the figure), and take a
    // square of 44% of the figure height starting just above the hair.
    const { data, info } = await sharp(srcPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const W = info.width;
    const Hh = info.height;
    const alphaAt = (x, y) => data[(y * W + x) * info.channels + 3];
    let top = -1;
    let bottom = -1;
    for (let y = 0; y < Hh && top < 0; y++) for (let x = 0; x < W; x += 2) if (alphaAt(x, y) > 40) { top = y; break; }
    for (let y = Hh - 1; y >= 0 && bottom < 0; y--) for (let x = 0; x < W; x += 2) if (alphaAt(x, y) > 40) { bottom = y; break; }
    const figH = bottom - top;
    let sumX = 0;
    let n = 0;
    for (let y = top; y < top + figH * 0.2; y++) for (let x = 0; x < W; x += 2) if (alphaAt(x, y) > 40) { sumX += x; n++; }
    const headCx = Math.round(sumX / Math.max(1, n));
    const side = Math.round(figH * 0.44);
    const cropTop = Math.max(0, top - Math.round(figH * 0.03));
    const cropLeft = Math.max(0, Math.min(W - side, headCx - Math.round(side / 2)));
    const bustCrop = { top: cropTop, left: cropLeft, width: Math.min(side, W - cropLeft), height: Math.min(side, Hh - cropTop) };

    // 1. Bust WebP (320x320 head-and-shoulders crop; shown at 64-96px, sharp on 2x/3x screens)
    await sharp(srcPath)
      .extract(bustCrop)
      .resize(320, 320, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 90 })
      .toFile(path.join(coachOutDir, bustWebp));

    // 2. Full WebP (768px, keeping full-body for hero and empty states)
    await sharp(srcPath)
      .resize({ width: 768, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(path.join(coachOutDir, fullWebp));

    // 3. Bust PNG fallback (same crop)
    await sharp(srcPath)
      .extract(bustCrop)
      .resize(320, 320, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9, effort: 8 })
      .toFile(path.join(coachOutDir, bustPng));

    // 4. Resized Full PNG fallback (768px, compressed)
    await sharp(srcPath)
      .resize({ width: 768, fit: 'inside', withoutEnlargement: true })
      .png({ compressionLevel: 9, effort: 8 })
      .toFile(path.join(coachOutDir, fullPng));

    console.log(`Generated optimized assets for ${exp.key}`);

    manifest.expressions[exp.key] = {
      name: exp.name,
      bust: `/assets/coach/${bustWebp}`,
      full: `/assets/coach/${fullWebp}`,
      fallbackBust: `/assets/coach/${bustPng}`,
      fallbackFull: `/assets/coach/${fullPng}`,
    };
  }

  // Clean up any old redundant unresized PNG files that had different names
  const legacyFiles = [
    'coach_best.png', 'coach_best_full.png',
    'coach_blunder.png', 'coach_blunder_full.png',
    'coach_welcome.png', 'coach_welcome_full.png'
  ];
  for (const leg of legacyFiles) {
    const legPath = path.join(coachOutDir, leg);
    if (fs.existsSync(legPath)) {
      fs.unlinkSync(legPath);
    }
  }

  const manifestPath = path.join(coachOutDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log('Generated manifest.json at', manifestPath);

  const srcDataManifest = path.resolve(__dirname, '../src/data/coachManifestData.json');
  fs.writeFileSync(srcDataManifest, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log('Generated coachManifestData.json at', srcDataManifest);
}

optimizeCoach().catch((err) => {
  console.error('Optimization failed:', err);
  process.exit(1);
});
