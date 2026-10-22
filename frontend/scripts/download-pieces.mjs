import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PIECES = ['wP', 'wN', 'wB', 'wR', 'wQ', 'wK', 'bP', 'bN', 'bB', 'bR', 'bQ', 'bK'];
const targetDir = path.resolve(__dirname, '../public/pieces/cburnett');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function downloadPieces() {
  console.log('Downloading cburnett chess pieces...');
  for (const p of PIECES) {
    const url = `https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/${p}.svg`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to download ${p}.svg: ${res.statusText}`);
    }
    const svg = await res.text();
    fs.writeFileSync(path.join(targetDir, `${p}.svg`), svg, 'utf-8');
    console.log(`Saved ${p}.svg`);
  }

  const licenseContent = `Creative Commons Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)

Chess Pieces by Colin M.L. Burnett (cburnett)
Original work: https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces

You are free to:
- Share — copy and redistribute the material in any medium or format
- Adapt — remix, transform, and build upon the material for any purpose, even commercially.

Under the following terms:
- Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made.
- ShareAlike — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.
`;

  fs.writeFileSync(path.join(targetDir, 'LICENSE'), licenseContent, 'utf-8');
  console.log('Saved cburnett LICENSE');
}

downloadPieces().catch(err => {
  console.error('Download error:', err);
  process.exit(1);
});
