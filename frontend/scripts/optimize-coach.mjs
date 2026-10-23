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

    // 1. Bust WebP (256px)
    await sharp(srcPath)
      .resize({ width: 256, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(path.join(coachOutDir, bustWebp));

    // 2. Full WebP (768px)
    await sharp(srcPath)
      .resize({ width: 768, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(path.join(coachOutDir, fullWebp));

    // 3. Resized Bust PNG fallback (256px, compressed)
    await sharp(srcPath)
      .resize({ width: 256, fit: 'inside', withoutEnlargement: true })
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
}

optimizeCoach().catch((err) => {
  console.error('Optimization failed:', err);
  process.exit(1);
});
