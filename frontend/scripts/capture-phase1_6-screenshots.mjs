import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '../dist');
const screenshotsDir = path.resolve(__dirname, '../../docs/screenshots/phase1_6');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqPath = req.url.split('?')[0];
      let filePath = path.join(distDir, reqPath === '/' ? 'index.html' : reqPath);

      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(distDir, 'index.html');
      }

      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.woff2': 'font/woff2',
        '.woff': 'font/woff',
        '.mp3': 'audio/mpeg',
        '.ogg': 'audio/ogg',
      };

      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
    });

    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      resolve({ server, port });
    });
  });
}

async function capturePhase1_6() {
  const { server, port } = await startServer();
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`Phase 1.6 screenshot server running at ${baseUrl}`);

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const viewports = [
    { name: 'mobile', width: 390, height: 844 },
    { name: 'desktop', width: 1440, height: 900 },
  ];
  const themes = ['dusk', 'dawn'];

  for (const theme of themes) {
    for (const vp of viewports) {
      console.log(`\n=== Capturing Phase 1.6 screenshots: theme=${theme}, viewport=${vp.name} (${vp.width}x${vp.height}) ===`);
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });

      const applyTheme = async () => {
        await page.evaluate((th) => {
          document.documentElement.setAttribute('data-theme', th);
          localStorage.setItem('all_chess_settings', JSON.stringify({ appTheme: th, motionLevel: 'full' }));
        }, theme);
        await page.waitForTimeout(250);
      };

      // 1. HOME SCREEN
      console.log('  Capturing Home...');
      await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
      await applyTheme();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(screenshotsDir, `01-home-${theme}-${vp.name}.png`) });

      // 2. REVIEW: SUMMARY
      console.log('  Capturing Review Summary...');
      await page.goto(`${baseUrl}/review/game-01`, { waitUntil: 'networkidle' });
      await applyTheme();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(screenshotsDir, `02-review-summary-${theme}-${vp.name}.png`) });

      // 3. REVIEW: BOARD (Key moment at move 6)
      console.log('  Capturing Review Board (Move 6)...');
      try {
        const startBtn = page.locator('button:has-text("Start Review")');
        if (await startBtn.isVisible()) {
          await startBtn.click({ force: true });
          await page.waitForTimeout(300);
        }
        for (let i = 0; i < 10; i++) {
          await page.keyboard.press('ArrowRight');
          await page.waitForTimeout(60);
        }
        await page.waitForTimeout(400);
      } catch (e) {
        console.log('    (review board step note)', e.message);
      }
      await page.screenshot({ path: path.join(screenshotsDir, `03-review-board-${theme}-${vp.name}.png`) });

      // 4. PLAY COACH: LOBBY
      console.log('  Capturing Play Coach Lobby...');
      await page.goto(`${baseUrl}/play`, { waitUntil: 'networkidle' });
      await applyTheme();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(screenshotsDir, `04-play-lobby-${theme}-${vp.name}.png`) });

      // 5. PLAY COACH: IN-GAME
      console.log('  Capturing Play Coach In-Game...');
      try {
        const startMatch = page.locator('button:has-text("Start Coaching Match")');
        if (await startMatch.isVisible()) {
          await startMatch.click({ force: true });
          await page.waitForTimeout(400);
        }
        const e2Piece = page.locator('[data-piece="true"][data-square="e2"]').first();
        if ((await e2Piece.count()) > 0) {
          await e2Piece.click({ force: true });
          await page.waitForTimeout(100);
          const e4Square = page.locator('[data-square="e4"]').first();
          if ((await e4Square.count()) > 0) {
            await e4Square.click({ force: true });
          }
        }
        await page.waitForTimeout(900); // Wait for opponent reply + live opening detection
      } catch (e) {
        console.log('    (play move note)', e.message);
      }
      await page.screenshot({ path: path.join(screenshotsDir, `05-play-ingame-${theme}-${vp.name}.png`) });

      // 6. PUZZLES
      console.log('  Capturing Puzzles...');
      await page.goto(`${baseUrl}/puzzles`, { waitUntil: 'networkidle' });
      await applyTheme();
      await page.waitForTimeout(400);
      try {
        // Solve puzzle Rd1 to d8
        const rd1 = page.locator('[data-piece="true"][data-square="d1"]').first();
        if ((await rd1.count()) > 0) {
          await rd1.click({ force: true });
          await page.waitForTimeout(100);
          const d8 = page.locator('[data-square="d8"]').first();
          if ((await d8.count()) > 0) {
            await d8.click({ force: true });
            await page.waitForTimeout(600); // Capture celebration reward cascade
          }
        }
      } catch (e) {
        console.log('    (puzzle solve note)', e.message);
      }
      await page.screenshot({ path: path.join(screenshotsDir, `06-puzzles-${theme}-${vp.name}.png`) });

      // 7. LEARN ROADMAP
      console.log('  Capturing Learn Roadmap...');
      await page.goto(`${baseUrl}/learn`, { waitUntil: 'networkidle' });
      await applyTheme();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(screenshotsDir, `07-learn-${theme}-${vp.name}.png`) });

      // 8. PROFILE
      console.log('  Capturing Profile...');
      await page.goto(`${baseUrl}/profile`, { waitUntil: 'networkidle' });
      await applyTheme();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(screenshotsDir, `08-profile-${theme}-${vp.name}.png`) });

      // 9. SETTINGS
      console.log('  Capturing Settings...');
      await page.goto(`${baseUrl}/settings`, { waitUntil: 'networkidle' });
      await applyTheme();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(screenshotsDir, `09-settings-${theme}-${vp.name}.png`) });

      await page.close();
    }
  }

  await browser.close();
  server.close();
  console.log(`\n🎉 All Phase 1.6 screenshots captured successfully in ${screenshotsDir}!`);
}

capturePhase1_6().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
