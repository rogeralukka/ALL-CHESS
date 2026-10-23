import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '../dist');
const screenshotsDir = path.resolve(__dirname, '../../docs/screenshots/phase1_5');
const recordingsDir = path.resolve(__dirname, '../../docs/recordings');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}
if (!fs.existsSync(recordingsDir)) {
  fs.mkdirSync(recordingsDir, { recursive: true });
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

async function captureAll() {
  const { server, port } = await startServer();
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`Preview server running at ${baseUrl}`);

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const widths = [390, 1440];
  const themes = ['dusk', 'dawn'];

  // 1. Capture Screenshots
  for (const theme of themes) {
    for (const width of widths) {
      const height = width === 390 ? 844 : 900;
      console.log(`\n=== Capturing screenshots: theme=${theme}, width=${width} ===`);

      const page = await browser.newPage({ viewport: { width, height } });

      const setTheme = async () => {
        await page.evaluate((th) => {
          document.documentElement.setAttribute('data-theme', th);
          localStorage.setItem('all_chess_settings', JSON.stringify({ appTheme: th, motionLevel: 'full' }));
        }, theme);
        await page.waitForTimeout(200);
      };

      // 1.1 Review Summary
      console.log('  Capturing review-summary...');
      await page.goto(`${baseUrl}/review/game-01`, { waitUntil: 'networkidle' });
      await setTheme();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(screenshotsDir, `review-summary-${theme}-${width}.png`) });

      // 1.2 Review at Move 6 (6. Bxf7+)
      console.log('  Capturing review-move6...');
      const startBtn = page.locator('button:has-text("Start Review")');
      if (await startBtn.isVisible()) {
        await startBtn.click();
        await page.waitForTimeout(300);
      }
      // Step to move 6 (index 10)
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(60);
      }
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(screenshotsDir, `review-move6-${theme}-${width}.png`) });

      // 1.3 Show Best
      console.log('  Capturing review-showbest...');
      const bestBtn = page.locator('button:has-text("Best"), button:has-text("Show Best")').first();
      if (await bestBtn.isVisible()) {
        await bestBtn.click();
        await page.waitForTimeout(400);
        await page.screenshot({ path: path.join(screenshotsDir, `review-showbest-${theme}-${width}.png`) });
        // Resume
        const resumeBtn = page.locator('button:has-text("Resume Game")').first();
        if (await resumeBtn.isVisible()) {
          await resumeBtn.click();
          await page.waitForTimeout(300);
        }
      }

      // 1.4 Explain Move
      console.log('  Capturing review-explain...');
      const explainBtn = page.locator('button:has-text("Explain")').first();
      if (await explainBtn.isVisible()) {
        await explainBtn.click();
        await page.waitForTimeout(400);
        await page.screenshot({ path: path.join(screenshotsDir, `review-explain-${theme}-${width}.png`) });
        // Exit Explain
        const gotItBtn = page.locator('button:has-text("Got it!"), button:has-text("Close")').first();
        if (await gotItBtn.isVisible()) {
          await gotItBtn.click();
          await page.waitForTimeout(200);
        }
      }

      // 1.5 Game in Progress
      console.log('  Capturing play-ingame...');
      await page.goto(`${baseUrl}/play`, { waitUntil: 'networkidle' });
      await setTheme();
      const startMatchBtn = page.locator('button:has-text("Start Coaching Match")');
      if (await startMatchBtn.isVisible()) {
        await startMatchBtn.click();
        await page.waitForTimeout(400);
      }
      // Make a move e2 to e4
      const e2Piece = page.locator('[data-piece="true"][data-square="e2"]').first();
      if (await e2Piece.count() > 0) {
        await e2Piece.click();
        await page.waitForTimeout(150);
        const e4Sq = page.locator('[data-square="e4"]').first();
        await e4Sq.click({ force: true });
        await page.waitForTimeout(700);
      }
      await page.screenshot({ path: path.join(screenshotsDir, `play-ingame-${theme}-${width}.png`) });

      // 1.6 Puzzle Solved State
      console.log('  Capturing puzzle-solved...');
      await page.goto(`${baseUrl}/puzzles`, { waitUntil: 'networkidle' });
      await setTheme();
      await page.waitForTimeout(300);
      // First puzzle solution: Rd8# (d1 to d8)
      const d1Piece = page.locator('[data-piece="true"][data-square="d1"]').first();
      if (await d1Piece.count() > 0) {
        await d1Piece.click();
        await page.waitForTimeout(150);
        const d8Sq = page.locator('[data-square="d8"]').first();
        await d8Sq.click({ force: true });
        await page.waitForTimeout(800);
      }
      await page.screenshot({ path: path.join(screenshotsDir, `puzzle-solved-${theme}-${width}.png`) });

      // 1.7 Learn Path
      console.log('  Capturing learn-path...');
      await page.goto(`${baseUrl}/learn`, { waitUntil: 'networkidle' });
      await setTheme();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(screenshotsDir, `learn-path-${theme}-${width}.png`) });

      // 1.8 Learn Lesson
      console.log('  Capturing learn-lesson...');
      await page.goto(`${baseUrl}/learn/stage-01`, { waitUntil: 'networkidle' });
      await setTheme();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(screenshotsDir, `learn-lesson-${theme}-${width}.png`) });

      await page.close();
    }
  }

  // 2. Capture Screen Recordings
  console.log('\n=== Capturing screen recordings ===');

  // 2.1 Stepping moves 1 to 8 in review
  console.log('Recording stepping moves 1 to 8 in review...');
  const recContext1 = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: recordingsDir, size: { width: 1280, height: 720 } },
  });
  const recPage1 = await recContext1.newPage();
  await recPage1.goto(`${baseUrl}/review/game-01`, { waitUntil: 'networkidle' });
  await recPage1.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dusk');
    localStorage.setItem('all_chess_settings', JSON.stringify({ appTheme: 'dusk', motionLevel: 'full' }));
  });
  await recPage1.waitForTimeout(400);
  const startRev = recPage1.locator('button:has-text("Start Review")');
  if (await startRev.isVisible()) {
    await startRev.click();
    await recPage1.waitForTimeout(400);
  }

  // Step moves 1 to 8 (16 plies) over ~5 seconds
  for (let i = 0; i < 16; i++) {
    await recPage1.keyboard.press('ArrowRight');
    await recPage1.waitForTimeout(300);
  }
  await recPage1.waitForTimeout(600);
  const videoPath1 = await recPage1.video().path();
  await recPage1.close();
  await recContext1.close();

  const destVideo1 = path.join(recordingsDir, 'review-stepping-moves1-8.webm');
  if (fs.existsSync(destVideo1)) fs.unlinkSync(destVideo1);
  fs.renameSync(videoPath1, destVideo1);
  console.log(`Saved review recording: ${destVideo1}`);

  // 2.2 Solving the first puzzle
  console.log('Recording solving the first puzzle...');
  const recContext2 = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: recordingsDir, size: { width: 1280, height: 720 } },
  });
  const recPage2 = await recContext2.newPage();
  await recPage2.goto(`${baseUrl}/puzzles`, { waitUntil: 'networkidle' });
  await recPage2.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dusk');
    localStorage.setItem('all_chess_settings', JSON.stringify({ appTheme: 'dusk', motionLevel: 'full' }));
  });
  await recPage2.waitForTimeout(1000);

  // Solve the puzzle: click d1, wait, click d8
  const puzD1 = recPage2.locator('[data-piece="true"][data-square="d1"]').first();
  await puzD1.click();
  await recPage2.waitForTimeout(400);
  const puzD8 = recPage2.locator('[data-square="d8"]').first();
  await puzD8.click({ force: true });
  await recPage2.waitForTimeout(3500); // Wait for celebration / sound / banner

  const videoPath2 = await recPage2.video().path();
  await recPage2.close();
  await recContext2.close();

  const destVideo2 = path.join(recordingsDir, 'puzzle-solve-animation.webm');
  if (fs.existsSync(destVideo2)) fs.unlinkSync(destVideo2);
  fs.renameSync(videoPath2, destVideo2);
  console.log(`Saved puzzle solve recording: ${destVideo2}`);

  await browser.close();
  server.close();
  console.log('\n🎉 Artifact capture complete!');
}

captureAll().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});
