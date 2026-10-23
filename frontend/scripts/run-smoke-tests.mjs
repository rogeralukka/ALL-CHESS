import { chromium } from 'playwright';
import { preview } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

if (!fs.existsSync(path.join(distDir, 'index.html'))) {
  console.error('Error: dist/index.html not found. Please build the project before running smoke tests.');
  process.exit(1);
}

const MATRIX = [
  { name: 'desktop-no-pref', width: 1440, height: 900, reducedMotion: 'no-preference' },
  { name: 'desktop-reduced', width: 1440, height: 900, reducedMotion: 'reduce' },
  { name: 'mobile-no-pref', width: 390, height: 844, reducedMotion: 'no-preference' },
  { name: 'mobile-reduced', width: 390, height: 844, reducedMotion: 'reduce' },
];

function getLaunchOptions() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeX86Path = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
  if (fs.existsSync(chromePath)) {
    return { executablePath: chromePath, headless: true };
  }
  if (fs.existsSync(chromeX86Path)) {
    return { executablePath: chromeX86Path, headless: true };
  }
  return { channel: 'chrome', headless: true };
}

async function run() {
  console.log('Starting Vite preview server...');
  const server = await preview({
    root: path.resolve(__dirname, '..'),
    preview: {
      port: 0,
      open: false,
    },
  });

  const baseUrl = server.resolvedUrls.local[0].replace(/\/$/, '');
  console.log(`Preview server ready at ${baseUrl}`);

  const browser = await chromium.launch(getLaunchOptions());

  let totalFailures = 0;

  try {
    for (const config of MATRIX) {
      console.log(`\n========================================`);
      console.log(`Running suite: ${config.name} (${config.width}x${config.height}, motion: ${config.reducedMotion})`);
      console.log(`========================================`);

      const context = await browser.newContext({
        viewport: { width: config.width, height: config.height },
        reducedMotion: config.reducedMotion,
      });

      const page = await context.newPage();
      const consoleIssues = [];

      page.on('console', (msg) => {
        const type = msg.type();
        if (type === 'error' || type === 'warning') {
          consoleIssues.push(`[Console ${type.toUpperCase()}] ${msg.text()}`);
        }
      });

      page.on('pageerror', (err) => {
        consoleIssues.push(`[PAGE ERROR] ${err.message}`);
      });

      // Helper to check for piece counts on boards
      const verifyBoardPieces = async (routeDescription) => {
        const board = page.locator('[data-board="true"]');
        const count = await board.count();
        if (count > 0) {
          const pieces = await page.locator('[data-piece="true"]').count();
          if (pieces < 2) {
            consoleIssues.push(`[BOARD EMPTY] ${routeDescription}: Board found but has ${pieces} pieces (fewer than 2)`);
          } else {
            console.log(`  ✓ Board on ${routeDescription} has ${pieces} pieces.`);
          }
        }
      };

      // 1. Route: /
      console.log('Testing / ...');
      await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(100);
      await verifyBoardPieces('/');

      // 2. Route: /review
      console.log('Testing /review ...');
      await page.goto(`${baseUrl}/review`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(100);
      await verifyBoardPieces('/review');

      // 3. Route: /review/game-01
      console.log('Testing /review/game-01 ...');
      await page.goto(`${baseUrl}/review/game-01`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(100);

      // Click "Start Review"
      const startReviewBtn = page.locator('button:has-text("Start Review")');
      await startReviewBtn.waitFor({ state: 'visible', timeout: 5000 });
      await startReviewBtn.click();
      await page.waitForTimeout(200);

      // Verify board is present with pieces
      await verifyBoardPieces('/review/game-01 (Review Board)');

      // Step to move 6 (which is White's blunder 6. Bxf7+, index 10)
      console.log('  Stepping to move 6 (6. Bxf7+)...');
      // Step forward 10 moves using keyboard ArrowRight or Next Move button
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(40);
      }
      await page.waitForTimeout(300);

      // Check board has pieces
      await verifyBoardPieces('/review/game-01 at move 6');

      // Check ?? badge on f7
      const f7Badge = page.locator('[data-testid="badge-f7"], [data-square="f7"][data-testid^="badge"]');
      const badgeCount = await f7Badge.count();
      if (badgeCount === 0) {
        consoleIssues.push(`[BADGE MISSING] Review at move 6 does not show badge on square f7`);
      } else {
        const badgeText = await f7Badge.first().innerText();
        if (!badgeText.includes('??')) {
          consoleIssues.push(`[BADGE INCORRECT] Badge on f7 expected '??' but found '${badgeText}'`);
        } else {
          console.log(`  ✓ Move 6 shows '??' badge on f7.`);
        }
      }

      // 4. Route: /play
      console.log('Testing /play ...');
      await page.goto(`${baseUrl}/play`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(100);

      // Start match
      const startMatchBtn = page.locator('button:has-text("Start Coaching Match")');
      await startMatchBtn.waitFor({ state: 'visible', timeout: 5000 });
      await startMatchBtn.click();
      await page.waitForTimeout(300);

      // Verify board has pieces
      await verifyBoardPieces('/play (game in progress)');

      // Make a move: e2 to e4
      console.log('  Making move e2 to e4...');
      const e2Piece = page.locator('[data-piece="true"][data-square="e2"]');
      await e2Piece.click();
      await page.waitForTimeout(150);
      const e4Square = page.locator('[data-square="e4"]').first();
      await e4Square.click({ force: true });
      await page.waitForTimeout(400);
      await verifyBoardPieces('/play (after move e2-e4)');

      // 5. Route: /puzzles
      console.log('Testing /puzzles ...');
      await page.goto(`${baseUrl}/puzzles`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(200);
      await verifyBoardPieces('/puzzles');

      // 6. Route: /learn
      console.log('Testing /learn ...');
      await page.goto(`${baseUrl}/learn`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(200);

      // Open a lesson
      const startLessonBtn = page.locator('button:has-text("Start lesson")').first();
      await startLessonBtn.waitFor({ state: 'visible', timeout: 5000 });
      await startLessonBtn.click();
      await page.waitForTimeout(300);
      await verifyBoardPieces('/learn (inside lesson)');

      // 7. Route: /profile
      console.log('Testing /profile ...');
      await page.goto(`${baseUrl}/profile`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(100);

      // 8. Route: /scout
      console.log('Testing /scout ...');
      await page.goto(`${baseUrl}/scout`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(100);

      // 9. Route: /settings
      console.log('Testing /settings ...');
      await page.goto(`${baseUrl}/settings`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(100);

      await page.close();
      await context.close();

      if (consoleIssues.length > 0) {
        console.error(`\n❌ FAILURES in ${config.name}:`);
        for (const issue of consoleIssues) {
          console.error(`  - ${issue}`);
        }
        totalFailures += consoleIssues.length;
      } else {
        console.log(`\n✅ ${config.name} passed with 0 console errors/warnings and all assertions satisfied.`);
      }
    }
  } finally {
    await browser.close();
    await server.close();
  }

  if (totalFailures > 0) {
    console.error(`\n❌ Smoke tests FAILED with ${totalFailures} issues.`);
    process.exit(1);
  } else {
    console.log(`\n🎉 All smoke tests passed across all viewports and motion settings!`);
    process.exit(0);
  }
}

run().catch((err) => {
  console.error('Fatal error during smoke test run:', err);
  process.exit(1);
});
