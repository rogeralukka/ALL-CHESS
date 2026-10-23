import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.resolve(__dirname, '../../docs/screenshots/phase1_7b');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const baseUrl = 'http://localhost:5173';
  const themes = ['dusk', 'dawn'];
  const viewports = [
    { name: '1440', width: 1440, height: 900 },
    { name: '390', width: 390, height: 844 },
  ];

  for (const theme of themes) {
    for (const vp of viewports) {
      console.log(`\nCapturing ${theme} @ ${vp.name}...`);
      const page = await browser.newPage({
        viewport: { width: vp.width, height: vp.height },
      });

      // 1. Summary Table
      console.log('  1. Summary Table...');
      await page.goto(`${baseUrl}/review/game-01`, { waitUntil: 'networkidle' });
      await page.evaluate((th) => {
        const store = JSON.parse(localStorage.getItem('all_chess_settings') || '{}');
        store.state = { ...(store.state || {}), appTheme: th };
        localStorage.setItem('all_chess_settings', JSON.stringify(store));
        document.documentElement.classList.remove('theme-dusk', 'theme-dawn');
        document.documentElement.classList.add(`theme-${th}`);
      }, theme);
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(outDir, `summary-table-${theme}-${vp.name}.png`) });

      // 2. Review at 6. Bxf7+
      console.log('  2. Review at 6. Bxf7+...');
      const startReviewBtn = page.locator('button:has-text("Start Review")');
      if (await startReviewBtn.count() > 0) {
        await startReviewBtn.click();
        await page.waitForTimeout(400);
        for (let i = 0; i < 10; i++) {
          await page.keyboard.press('ArrowRight');
          await page.waitForTimeout(40);
        }
        await page.waitForTimeout(600);
        await page.screenshot({ path: path.join(outDir, `review-bxf7-${theme}-${vp.name}.png`) });
      }

      // 3. Play Coach after e4 f6 d4 c6 (Barnes Defense)
      console.log('  3. Play Coach Barnes Defense...');
      await page.goto(`${baseUrl}/play`, { waitUntil: 'networkidle' });
      const startMatchBtn = page.locator('button:has-text("Start Coaching Match")');
      if (await startMatchBtn.count() > 0) {
        await startMatchBtn.click();
        await page.waitForTimeout(400);

        // Move 1: e2 -> e4
        await page.locator('[data-square="e2"]').first().dispatchEvent('click');
        await page.waitForTimeout(150);
        await page.locator('[data-square="e4"]').first().dispatchEvent('click');
        await page.waitForTimeout(800);

        // Move 2: d2 -> d4
        await page.locator('[data-square="d2"]').first().dispatchEvent('click');
        await page.waitForTimeout(150);
        await page.locator('[data-square="d4"]').first().dispatchEvent('click');
        await page.waitForTimeout(800);

        await page.screenshot({ path: path.join(outDir, `play-barnes-${theme}-${vp.name}.png`) });
      }

      // 4. Puzzles: Wrong & Right & Phone Puzzle
      console.log('  4. Puzzles (wrong & right)...');
      await page.goto(`${baseUrl}/puzzles`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);

      // Wrong move: Rd1 to d5
      await page.locator('[data-square="d1"]').first().dispatchEvent('click');
      await page.waitForTimeout(150);
      await page.locator('[data-square="d5"]').first().dispatchEvent('click');
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(outDir, `puzzle-wrong-${theme}-${vp.name}.png`) });

      // Wait for reset (700ms), then solve: Rd1 to d8
      await page.waitForTimeout(1000);
      const retryBtn = page.locator('button:has-text("Retry Position")');
      if (await retryBtn.count() > 0) {
        await retryBtn.click();
        await page.waitForTimeout(200);
      }
      await page.locator('[data-square="d1"]').first().dispatchEvent('click');
      await page.waitForTimeout(150);
      await page.locator('[data-square="d8"]').first().dispatchEvent('click');
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(outDir, `puzzle-right-${theme}-${vp.name}.png`) });

      if (vp.name === '390') {
        await page.screenshot({ path: path.join(outDir, `phone-puzzle-${theme}-390.png`) });
      }

      // 5. Game Over with King Badges
      console.log('  5. Game Over with King Badges...');
      await page.goto(`${baseUrl}/play`, { waitUntil: 'networkidle' });
      const matchBtn = page.locator('button:has-text("Start Coaching Match")');
      if (await matchBtn.count() > 0) {
        await matchBtn.click();
        await page.waitForTimeout(300);

        // Click Flag (Resign) button in action row
        const flagBtn = page.locator('button[aria-label="Resign game"]').first();
        if (await flagBtn.count() > 0) {
          await flagBtn.click();
          await page.waitForTimeout(200);
          const confirmResign = page.locator('button:has-text("Yes, Resign")').first();
          if (await confirmResign.count() > 0) {
            await confirmResign.click();
            await page.waitForTimeout(700);
            await page.screenshot({ path: path.join(outDir, `game-over-${theme}-${vp.name}.png`) });
          }
        }
      }

      await page.close();
    }
  }

  await browser.close();
  console.log('\nAll screenshots captured successfully!');
}

run().catch(console.error);
