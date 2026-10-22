import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const step = process.argv[2] || 'step1a';
const distDir = path.resolve(__dirname, '../dist');
const outBaseDir = path.resolve(__dirname, `../../docs/screenshots/phase1/${step}`);

if (!fs.existsSync(outBaseDir)) {
  fs.mkdirSync(outBaseDir, { recursive: true });
}

// Simple static HTTP server for `dist`
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

  const routes = [
    { name: 'playground', path: '/dev/playground' },
    { name: 'home', path: '/' },
  ];

  const widths = [390, 820, 1440];
  const themes = ['dusk', 'dawn'];

  for (const route of routes) {
    for (const theme of themes) {
      for (const width of widths) {
        const height = width === 390 ? 844 : width === 820 ? 1180 : 900;
        const page = await browser.newPage({
          viewport: { width, height },
        });

        await page.goto(`${baseUrl}${route.path}`, { waitUntil: 'networkidle' });

        // Set theme in HTML data-theme attribute and localStorage
        await page.evaluate((th) => {
          document.documentElement.setAttribute('data-theme', th);
          localStorage.setItem('all_chess_settings', JSON.stringify({ appTheme: th }));
        }, theme);

        // Wait a beat for transitions/fonts
        await page.waitForTimeout(400);

        const filename = `${route.name}-${theme}-${width}.png`;
        const filePath = path.join(outBaseDir, filename);

        await page.screenshot({ path: filePath, fullPage: width <= 820 });
        console.log(`Saved screenshot: ${filename}`);

        await page.close();
      }
    }
  }

  await browser.close();
  server.close();
  console.log('Capture completed successfully!');
}

capture().catch((err) => {
  console.error('Capture failed:', err);
  process.exit(1);
});
