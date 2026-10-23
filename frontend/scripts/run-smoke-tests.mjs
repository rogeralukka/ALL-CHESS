import { chromium } from 'playwright';
import { preview, createServer } from 'vite';
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
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    console.log(`Using Chrome from CHROME_PATH: ${process.env.CHROME_PATH}`);
    return { executablePath: process.env.CHROME_PATH, headless: true };
  }

  const candidatePaths = [
    // Windows standard locations
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
    // macOS standard locations
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    // Linux standard locations
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ];

  for (const candidate of candidatePaths) {
    if (candidate && fs.existsSync(candidate)) {
      console.log(`Using system Chrome executable: ${candidate}`);
      return { executablePath: candidate, headless: true };
    }
  }

  console.log('Falling back to default chromium/channel: chrome');
  return { channel: 'chrome', headless: true };
}

async function run() {
  console.log('1. Starting Vite preview server (production build)...');
  const previewServer = await preview({
    root: path.resolve(__dirname, '..'),
    preview: {
      port: 0,
      open: false,
    },
  });
  const previewUrl = previewServer.resolvedUrls.local[0].replace(/\/$/, '');
  console.log(`Preview server ready at ${previewUrl}`);

  console.log('2. Starting Vite dev server (StrictMode enabled)...');
  const devServer = await createServer({
    root: path.resolve(__dirname, '..'),
    server: {
      port: 0,
      open: false,
    },
  });
  await devServer.listen();
  const devUrl = devServer.resolvedUrls.local[0].replace(/\/$/, '');
  console.log(`Dev server ready at ${devUrl}`);

  const browser = await chromium.launch(getLaunchOptions());
  let totalFailures = 0;

  // Helper to verify coach bubble typing completeness
  const verifyTyping = async (page, routeDescription, consoleIssues) => {
    // Wait for typing to complete (up to 3 seconds)
    await page.waitForTimeout(3000);
    const bubbleContainer = page.locator('[data-testid="coach-bubble-text"]');
    const count = await bubbleContainer.count();
    if (count > 0) {
      const visibleSpan = bubbleContainer.first().locator('span[aria-hidden="true"]');
      let text = '';
      if (await visibleSpan.count() > 0) {
        text = (await visibleSpan.innerText()).trim();
      } else {
        text = (await bubbleContainer.first().innerText()).trim();
      }

      const srOnly = bubbleContainer.first().locator('.sr-only');
      let fullText = '';
      if (await srOnly.count() > 0) {
        fullText = (await srOnly.innerText()).trim();
      }

      // Check if text is longer than 25 characters OR matches full message
      if (text.length > 25 || (fullText && text.length === fullText.length)) {
        console.log(`  ✓ Coach typing on ${routeDescription}: finished (${text.length} chars).`);
      } else {
        consoleIssues.push(
          `[TYPEWRITER FROZEN] ${routeDescription}: Visible text is only ${text.length} chars ("${text}") after 3s (expected >25 chars or full message: "${fullText}")`
        );
      }
    }
  };

  // Helper to verify board piece counts
  const verifyBoardPieces = async (page, routeDescription, consoleIssues) => {
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

  try {
    // ========================================================================
    // SUITE 1: DEV SERVER TEST (StrictMode verification for Board & Typewriter)
    // ========================================================================
    console.log(`\n========================================`);
    console.log(`Running DEV SERVER Suite (StrictMode active at ${devUrl})`);
    console.log(`========================================`);

    const devContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const devPage = await devContext.newPage();
    const devConsoleIssues = [];

    devPage.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      // Ignore normal HMR logs
      if (text.includes('[vite]')) return;
      if (type === 'error' || type === 'warning') {
        devConsoleIssues.push(`[Dev Console ${type.toUpperCase()}] ${text}`);
      }
    });

    devPage.on('pageerror', (err) => {
      devConsoleIssues.push(`[DEV PAGE ERROR] ${err.message}`);
    });

    // 1. Dev / (Home)
    console.log('Testing dev / ...');
    await devPage.goto(`${devUrl}/`, { waitUntil: 'networkidle' });
    await verifyBoardPieces(devPage, 'dev /', devConsoleIssues);
    await verifyTyping(devPage, 'dev /', devConsoleIssues);

    // 2. Dev /puzzles
    console.log('Testing dev /puzzles ...');
    await devPage.goto(`${devUrl}/puzzles`, { waitUntil: 'networkidle' });
    await verifyBoardPieces(devPage, 'dev /puzzles', devConsoleIssues);
    await verifyTyping(devPage, 'dev /puzzles', devConsoleIssues);

    // 3. Dev /play (Play Lobby)
    console.log('Testing dev /play ...');
    await devPage.goto(`${devUrl}/play`, { waitUntil: 'networkidle' });
    await verifyTyping(devPage, 'dev /play lobby', devConsoleIssues);

    // 4. Dev /review/game-01 (Summary & Review Board)
    console.log('Testing dev /review/game-01 ...');
    await devPage.goto(`${devUrl}/review/game-01`, { waitUntil: 'networkidle' });
    await verifyBoardPieces(devPage, 'dev /review/game-01 summary', devConsoleIssues);
    await verifyTyping(devPage, 'dev /review/game-01 summary', devConsoleIssues);

    const devStartReview = devPage.locator('button:has-text("Start Review")');
    if (await devStartReview.count() > 0) {
      await devStartReview.click();
      await devPage.waitForTimeout(300);
      await verifyBoardPieces(devPage, 'dev /review/game-01 review board', devConsoleIssues);
      await verifyTyping(devPage, 'dev /review/game-01 review board', devConsoleIssues);
    }

    await devPage.close();
    await devContext.close();

    if (devConsoleIssues.length > 0) {
      console.error(`\n❌ FAILURES in Dev Server Suite:`);
      for (const issue of devConsoleIssues) {
        console.error(`  - ${issue}`);
      }
      totalFailures += devConsoleIssues.length;
    } else {
      console.log(`\n✅ Dev Server Suite passed with 0 console errors/warnings, pieces rendered, and typing complete.`);
    }

    // ========================================================================
    // SUITE 2: PRODUCTION PREVIEW MATRIX
    // ========================================================================
    for (const config of MATRIX) {
      console.log(`\n========================================`);
      console.log(`Running preview suite: ${config.name} (${config.width}x${config.height}, motion: ${config.reducedMotion})`);
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

      // 1. Route: /
      console.log('Testing / ...');
      await page.goto(`${previewUrl}/`, { waitUntil: 'networkidle' });
      await verifyBoardPieces(page, '/', consoleIssues);
      await verifyTyping(page, '/', consoleIssues);

      // 2. Route: /review
      console.log('Testing /review ...');
      await page.goto(`${previewUrl}/review`, { waitUntil: 'networkidle' });
      await verifyBoardPieces(page, '/review', consoleIssues);

      // 3. Route: /review/game-01
      console.log('Testing /review/game-01 ...');
      await page.goto(`${previewUrl}/review/game-01`, { waitUntil: 'networkidle' });
      await verifyBoardPieces(page, '/review/game-01 summary', consoleIssues);
      await verifyTyping(page, '/review/game-01 summary', consoleIssues);

      // Click "Start Review"
      const startReviewBtn = page.locator('button:has-text("Start Review")');
      await startReviewBtn.waitFor({ state: 'visible', timeout: 5000 });
      await startReviewBtn.click();
      await page.waitForTimeout(200);

      // Verify board is present with pieces and typing works
      await verifyBoardPieces(page, '/review/game-01 (Review Board)', consoleIssues);
      await verifyTyping(page, '/review/game-01 (Review Board)', consoleIssues);

      // Step to move 6 (which is White's blunder 6. Bxf7+, index 10)
      console.log('  Stepping to move 6 (6. Bxf7+)...');
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(40);
      }
      await page.waitForTimeout(300);

      // Check board has pieces
      await verifyBoardPieces(page, '/review/game-01 at move 6', consoleIssues);

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
      await page.goto(`${previewUrl}/play`, { waitUntil: 'networkidle' });
      await verifyTyping(page, '/play lobby', consoleIssues);

      // Start match
      const startMatchBtn = page.locator('button:has-text("Start Coaching Match")');
      await startMatchBtn.waitFor({ state: 'visible', timeout: 5000 });
      await startMatchBtn.click();
      await page.waitForTimeout(300);

      // Verify board has pieces
      await verifyBoardPieces(page, '/play (game in progress)', consoleIssues);

      // Make a move: e2 to e4
      console.log('  Making move e2 to e4 and verifying opponent reply within 1.5s...');
      const e2Piece = page.locator('[data-piece="true"][data-square="e2"]').first();
      await e2Piece.click();
      await page.waitForTimeout(150);
      const e4Square = page.locator('[data-square="e4"]').first();
      await e4Square.click({ force: true });
      
      // Wait for opponent reply within 1.5s (opponent move adds the 2nd move button)
      const moveStartTime = Date.now();
      try {
        await page.waitForFunction(
          () => {
            const moveButtons = document.querySelectorAll('[data-move-row="true"] button');
            return moveButtons.length >= 2;
          },
          { timeout: 1500 }
        );
        const elapsed = Date.now() - moveStartTime;
        console.log(`  ✓ Opponent replied in ${elapsed}ms (within 1.5s threshold).`);
      } catch {
        consoleIssues.push(`[PLAY ENGINE SLOW] Opponent did not reply within 1.5s after user move e2-e4`);
      }
      await verifyBoardPieces(page, '/play (after move e2-e4)', consoleIssues);

      // 5. Route: /puzzles
      console.log('Testing /puzzles ...');
      await page.goto(`${previewUrl}/puzzles`, { waitUntil: 'networkidle' });
      await verifyBoardPieces(page, '/puzzles', consoleIssues);
      await verifyTyping(page, '/puzzles', consoleIssues);

      // Solve puzzle #1: Rd1 to d8 (back-rank mate)
      console.log('  Solving back-rank mate: Rd1 to d8...');
      const d1Piece = page.locator('[data-piece="true"][data-square="d1"]');
      if (await d1Piece.count() > 0) {
        await d1Piece.click();
        await page.waitForTimeout(150);
        const d8Square = page.locator('[data-square="d8"]').first();
        await d8Square.click({ force: true });
        await page.waitForTimeout(400);

        // Check for success badge on destination square d8
        const d8Badge = page.locator('[data-testid="badge-d8"], [data-square="d8"][data-testid^="badge"]');
        const d8BadgeCount = await d8Badge.count();
        if (d8BadgeCount === 0) {
          consoleIssues.push(`[PUZZLE BADGE MISSING] Solved puzzle did not show success badge on destination square d8`);
        } else {
          console.log(`  ✓ Puzzle solved: success badge visible on d8.`);
        }
      }

      // 6. Route: /learn
      console.log('Testing /learn ...');
      await page.goto(`${previewUrl}/learn`, { waitUntil: 'networkidle' });
      const startLessonBtn = page.locator('button:has-text("Start lesson")').first();
      await startLessonBtn.waitFor({ state: 'visible', timeout: 5000 });
      await startLessonBtn.click();
      await page.waitForTimeout(300);
      await verifyBoardPieces(page, '/learn (inside lesson)', consoleIssues);

      // 7. Route: /profile
      console.log('Testing /profile ...');
      await page.goto(`${previewUrl}/profile`, { waitUntil: 'networkidle' });

      // 8. Route: /scout
      console.log('Testing /scout ...');
      await page.goto(`${previewUrl}/scout`, { waitUntil: 'networkidle' });

      // 9. Route: /settings
      console.log('Testing /settings ...');
      await page.goto(`${previewUrl}/settings`, { waitUntil: 'networkidle' });

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
    await previewServer.close();
    await devServer.close();
  }

  if (totalFailures > 0) {
    console.error(`\n❌ Smoke tests FAILED with ${totalFailures} issues.`);
    process.exit(1);
  } else {
    console.log(`\n🎉 All smoke tests passed across dev and production, viewports, and motion settings!`);
    process.exit(0);
  }
}

run().catch((err) => {
  console.error('Fatal error during smoke test run:', err);
  process.exit(1);
});
