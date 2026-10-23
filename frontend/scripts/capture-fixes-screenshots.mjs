import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '../dist');
const outBaseDir = path.resolve(__dirname, '../../docs/screenshots/phase1/fixes');

if (!fs.existsSync(outBaseDir)) {
  fs.mkdirSync(outBaseDir, { recursive: true });
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

async function capture() {
  const { server, port } = await startServer();
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`Preview server started at ${baseUrl}`);

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const widths = [390, 820, 1440];
  const themes = ['dusk', 'dawn'];

  for (const theme of themes) {
    for (const width of widths) {
      const height = width === 390 ? 844 : width === 820 ? 1180 : 900;
      console.log(`\n=== Capturing theme: ${theme}, width: ${width} ===`);

      // 1. Review Board: Blunder, Show Best, Explain, Retry
      try {
        const page = await browser.newPage({ viewport: { width, height } });
        await page.goto(`${baseUrl}/review/game-01`, { waitUntil: 'networkidle' });
        await page.evaluate((th) => {
          document.documentElement.setAttribute('data-theme', th);
          localStorage.setItem('all_chess_settings', JSON.stringify({ appTheme: th }));
        }, theme);
        await page.waitForTimeout(300);

        // Click Start Review
        const startBtn = page.locator('button:has-text("Start Review")');
        if (await startBtn.isVisible()) {
          await startBtn.click();
          await page.waitForTimeout(400);
        }

        // Navigate to Move 6: Bxf7+
        const blunderBtn = page.locator('button:has-text("xf7+")').first();
        if (await blunderBtn.count() > 0) {
          await blunderBtn.scrollIntoViewIfNeeded();
          await blunderBtn.click({ force: true });
          await page.waitForTimeout(500);
        } else {
          for (let i = 0; i < 11; i++) {
            await page.keyboard.press('ArrowRight');
            await page.waitForTimeout(50);
          }
        }

        // Capture: review board on blunder
        await page.screenshot({
          path: path.join(outBaseDir, `review-blunder-${theme}-${width}.png`),
          fullPage: width <= 820,
        });
        console.log(`Saved: review-blunder-${theme}-${width}.png`);

        // Capture: Show Best
        const showBestBtn = page.locator('button:has-text("Show Best")');
        if (await showBestBtn.count() > 0) {
          await showBestBtn.scrollIntoViewIfNeeded();
          await showBestBtn.click({ force: true });
          await page.waitForTimeout(500);
          await page.screenshot({
            path: path.join(outBaseDir, `review-showbest-${theme}-${width}.png`),
            fullPage: width <= 820,
          });
          console.log(`Saved: review-showbest-${theme}-${width}.png`);
          // Resume
          const resumeBtn = page.locator('button:has-text("Resume Game")');
          if (await resumeBtn.count() > 0) {
            await resumeBtn.scrollIntoViewIfNeeded();
            await resumeBtn.click({ force: true });
            await page.waitForTimeout(300);
          }
        }

        // Capture: Explain
        const explainBtn = page.locator('button:has-text("Explain Move")');
        if (await explainBtn.count() > 0) {
          await explainBtn.scrollIntoViewIfNeeded();
          await explainBtn.click({ force: true });
          await page.waitForTimeout(500);
          await page.screenshot({
            path: path.join(outBaseDir, `review-explain-${theme}-${width}.png`),
            fullPage: width <= 820,
          });
          console.log(`Saved: review-explain-${theme}-${width}.png`);
          // Got it
          const gotItBtn = page.locator('button:has-text("Got it!")');
          if (await gotItBtn.count() > 0) {
            await gotItBtn.scrollIntoViewIfNeeded();
            await gotItBtn.click({ force: true });
            await page.waitForTimeout(300);
          }
        }

        // Capture: Retry
        const retryBtn = page.locator('button:has-text("Retry Mistake")');
        if (await retryBtn.count() > 0) {
          await retryBtn.scrollIntoViewIfNeeded();
          await retryBtn.click({ force: true });
          await page.waitForTimeout(500);
          await page.screenshot({
            path: path.join(outBaseDir, `review-retry-${theme}-${width}.png`),
            fullPage: width <= 820,
          });
          console.log(`Saved: review-retry-${theme}-${width}.png`);
        }

        await page.close();
      } catch (err) {
        console.error(`Error in review section:`, err);
      }

      // 2. Play Coach: In-game & Game-over modal
      try {
        const page = await browser.newPage({ viewport: { width, height } });
        await page.goto(`${baseUrl}/play`, { waitUntil: 'networkidle' });
        await page.evaluate((th) => {
          document.documentElement.setAttribute('data-theme', th);
          localStorage.setItem('all_chess_settings', JSON.stringify({ appTheme: th }));
        }, theme);
        await page.waitForTimeout(300);

        const startMatchBtn = page.locator('button:has-text("Start Coaching Match")').first();
        if (await startMatchBtn.count() > 0) {
          await startMatchBtn.scrollIntoViewIfNeeded();
          await startMatchBtn.click({ force: true });
          await page.waitForTimeout(600);
        }

        // Capture in-game
        await page.screenshot({
          path: path.join(outBaseDir, `play-ingame-${theme}-${width}.png`),
          fullPage: width <= 820,
        });
        console.log(`Saved: play-ingame-${theme}-${width}.png`);

        // Resign to show game-over modal
        const resignBtn = page.locator('button:has-text("Resign")').first();
        if (await resignBtn.count() > 0) {
          await resignBtn.scrollIntoViewIfNeeded();
          await resignBtn.click({ force: true });
          await page.waitForTimeout(300);
          const confirmBtn = page.locator('button:has-text("Resign")').nth(1);
          if (await confirmBtn.count() > 0) {
            await confirmBtn.click({ force: true });
          }
          await page.waitForTimeout(600);
          await page.screenshot({
            path: path.join(outBaseDir, `play-gameover-${theme}-${width}.png`),
            fullPage: width <= 820,
          });
          console.log(`Saved: play-gameover-${theme}-${width}.png`);
        }

        await page.close();
      } catch (err) {
        console.error(`Error in play section:`, err);
      }
    }
  }

  await browser.close();
  server.close();
  console.log('Capture script finished!');
}

capture().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
