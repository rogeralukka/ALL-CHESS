import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const coachDir = path.resolve(__dirname, '../public/assets/coach');

const EXPRESSIONS = [
  { key: 'neutral', name: 'Aloof / Observant', srcBust: 'coach_neutral.png', srcFull: 'coach_neutral_full.png' },
  { key: 'thinking', name: 'Thoughtful', srcBust: 'coach_thinking.png', srcFull: 'coach_thinking_full.png' },
  { key: 'thumbsup', name: 'Cheerful Thumbs-Up', srcBust: 'coach_best.png', srcFull: 'coach_best_full.png' },
  { key: 'brilliant', name: 'Cheeky Finger-Gun', srcBust: 'coach_brilliant.png', srcFull: 'coach_brilliant_full.png' },
  { key: 'embarrassed', name: 'Embarrassed', srcBust: 'coach_blunder.png', srcFull: 'coach_blunder_full.png' },
  { key: 'wave', name: 'Friendly Waving', srcBust: 'coach_welcome.png', srcFull: 'coach_welcome_full.png' },
];

async function optimizeCoach() {
  console.log('Optimizing coach assets with sharp...');
  const manifest = {
    version: '1.0.0',
    expressions: {},
  };

  for (const exp of EXPRESSIONS) {
    const bustInput = path.join(coachDir, exp.srcBust);
    const fullInput = path.join(coachDir, exp.srcFull);

    const bustOutName = `coach_${exp.key}.webp`;
    const fullOutName = `coach_${exp.key}_full.webp`;
    const bustOutputPath = path.join(coachDir, bustOutName);
    const fullOutputPath = path.join(coachDir, fullOutName);

    if (fs.existsSync(bustInput)) {
      await sharp(bustInput)
        .resize({ width: 256, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(bustOutputPath);
      console.log(`Generated ${bustOutName}`);
    } else {
      console.warn(`Missing source: ${bustInput}`);
    }

    if (fs.existsSync(fullInput)) {
      await sharp(fullInput)
        .resize({ width: 768, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(fullOutputPath);
      console.log(`Generated ${fullOutName}`);
    } else {
      console.warn(`Missing source: ${fullInput}`);
    }

    manifest.expressions[exp.key] = {
      name: exp.name,
      bust: `/assets/coach/${bustOutName}`,
      full: `/assets/coach/${fullOutName}`,
      fallbackBust: `/assets/coach/${exp.srcBust}`,
      fallbackFull: `/assets/coach/${exp.srcFull}`,
    };
  }

  const manifestPath = path.join(coachDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log('Generated manifest.json at', manifestPath);
}

optimizeCoach().catch(err => {
  console.error('Optimization failed:', err);
  process.exit(1);
});
