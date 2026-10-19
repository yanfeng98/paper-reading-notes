#!/usr/bin/env node
/**
 * 用 Playwright + Chromium 把生成后的站点页面打印为 PDF。
 *
 * 先构建站点：
 *   python3 site/build.py --out _site
 * 再生成汇总 PDF：
 *   PLAYWRIGHT_MODULE=/path/to/playwright \
 *     node skills/summarize-paper-methods/scripts/render_pdf.mjs \
 *     --site _site --page docs/rsi-methods/index.html --out docs/rsi-methods.pdf
 *
 * 默认：_site、docs/rsi-methods/index.html、docs/rsi-methods.pdf。
 * 脚本会强制浅色 + print media、等待 window.__renderDone、检查渲染错误/计数/
 * 打印溢出，失败时不写出 PDF。CI 不运行本脚本；PDF 由本地生成并提交。
 */

import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { mkdir, readFile } from 'node:fs/promises';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..', '..', '..');
const PLAYWRIGHT =
  process.env.PLAYWRIGHT_MODULE ||
  '/home/luyanfeng/luyanfeng/nano-dnf/node_modules/playwright';

const argv = process.argv.slice(2);
function take(flag, fallback) {
  const index = argv.indexOf(flag);
  if (index < 0) return fallback;
  const value = argv[index + 1];
  if (!value) throw new Error(`${flag} 缺少参数`);
  argv.splice(index, 2);
  return value;
}

const SITE = resolve(REPO, take('--site', '_site'));
const PAGE = take('--page', 'docs/rsi-methods/index.html').replace(/^\/+/, '');
const positional = argv.find((value) => !value.startsWith('--'));
const OUT = resolve(REPO, take('--out', positional || 'docs/rsi-methods.pdf'));

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json'
};

function safePath(urlPath) {
  let clean = decodeURIComponent((urlPath || '/').split('?')[0]);
  if (clean.endsWith('/')) clean += 'index.html';
  const rel = normalize(clean)
    .replace(/^(\.\.(\/|\\|$))+/, '')
    .replace(/^[/\\]+/, '');
  const full = resolve(SITE, rel || 'index.html');
  if (full !== SITE && !full.startsWith(SITE + sep)) throw new Error('forbidden path');
  return full;
}

function startServer() {
  const server = createServer(async (req, res) => {
    try {
      const file = safePath(req.url === '/' ? '/index.html' : req.url);
      const data = await readFile(file);
      res.writeHead(200, {
        'Content-Type': MIME[extname(file)] || 'application/octet-stream',
        'Cache-Control': 'no-store'
      });
      res.end(data);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('not found');
    }
  });
  return new Promise((ok, fail) => {
    server.once('error', fail);
    server.listen(0, '127.0.0.1', () => ok(server));
  });
}

const require = createRequire(import.meta.url);
let playwright;
try {
  playwright = require(PLAYWRIGHT);
} catch {
  playwright = require('playwright');
}

if (!(await import('node:fs/promises').then((fs) => fs.stat(SITE)).catch(() => null))) {
  throw new Error(`站点目录不存在：${SITE}\n先运行：python3 site/build.py --out _site`);
}
await mkdir(dirname(OUT), { recursive: true });

const server = await startServer();
const port = server.address().port;
let browser;
let context;
const pageErrors = [];
const consoleErrors = [];
try {
  browser = await playwright.chromium.launch({ headless: true });
  context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    colorScheme: 'light'
  });
  const page = await context.newPage();
  page.on('pageerror', (err) => pageErrors.push(err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  await page.addInitScript(() => {
    try { localStorage.setItem('prn-theme', 'light'); } catch { /* ignore */ }
  });
  await page.emulateMedia({ media: 'print' });
  await page.goto(`http://127.0.0.1:${port}/${PAGE}`, {
    waitUntil: 'load',
    timeout: 60000
  });
  await page.waitForFunction(
    () => window.__renderDone === true || !!window.__renderError,
    null,
    { timeout: 120000 }
  );

  const renderError = await page.evaluate(
    () => window.__renderError ||
      (document.querySelector('.render-error')?.textContent || '')
  );
  if (pageErrors.length) {
    throw new Error('页面 JS 错误：' + pageErrors.join(' | '));
  }
  if (renderError) throw new Error('正文渲染失败：' + renderError);

  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    const images = Array.from(document.images);
    images.forEach((image) => { image.loading = 'eager'; });
    await Promise.all(images.map((image) => {
      if (image.complete) return Promise.resolve();
      return new Promise((resolveImage) => {
        image.addEventListener('load', resolveImage, { once: true });
        image.addEventListener('error', resolveImage, { once: true });
      });
    }));
  });

  const counts = await page.evaluate(() => {
    const content = document.getElementById('doc-content');
    const expectedMath = Number(document.body.dataset.expectedMath || 0);
    const expectedMermaid = Number(document.body.dataset.expectedMermaid || 0);
    const mm250 = (250 / 25.4) * 96;
    const contentWidth = content.getBoundingClientRect().width;
    const overflow = [];
    content.querySelectorAll('table, pre, .math-display, .mermaid, img').forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.width > contentWidth + 1 || rect.right > content.getBoundingClientRect().right + 1 ||
          element.scrollWidth > element.clientWidth + 1) {
        overflow.push({
          tag: element.tagName.toLowerCase(),
          cls: element.className || '',
          width: Math.round(rect.width),
          scrollWidth: element.scrollWidth,
          clientWidth: element.clientWidth
        });
      }
    });
    const mermaidTooTall = Array.from(content.querySelectorAll('.mermaid svg'))
      .filter((svg) => svg.getBoundingClientRect().height > mm250 + 1)
      .map((svg) => Math.round(svg.getBoundingClientRect().height));
    return {
      math: content.querySelectorAll('.math-display mjx-container').length,
      mathExpected: expectedMath,
      mathErrors: content.querySelectorAll('mjx-container[data-mjx-error]').length,
      leftoverMath: content.querySelectorAll('pre > code.language-math').length,
      mermaid: content.querySelectorAll('.mermaid svg').length,
      mermaidExpected: expectedMermaid,
      mermaidErrors: content.querySelectorAll('.mermaid svg[aria-roledescription="error"]').length,
      leftoverMermaid: content.querySelectorAll('pre > code.language-mermaid').length,
      tables: content.querySelectorAll('table').length,
      overflow,
      mermaidTooTall,
      literalDollars: (document.body.innerText.match(/\$\$/g) || []).length
    };
  });

  console.log('rendered:', JSON.stringify(counts));
  if (consoleErrors.length) {
    console.error('console errors (' + consoleErrors.length + '):');
    for (const error of consoleErrors) console.error('  -', error);
  }

  const problems = [];
  if (counts.math !== counts.mathExpected) {
    problems.push(`MathJax: ${counts.math}/${counts.mathExpected} 个显示公式已渲染`);
  }
  if (counts.mathErrors) problems.push(`MathJax: ${counts.mathErrors} 个公式报错`);
  if (counts.leftoverMath) problems.push(`MathJax: ${counts.leftoverMath} 个 math 围栏未转换`);
  if (counts.mermaid !== counts.mermaidExpected) {
    problems.push(`Mermaid: ${counts.mermaid}/${counts.mermaidExpected} 个图已渲染`);
  }
  if (counts.mermaidErrors) problems.push(`Mermaid: ${counts.mermaidErrors} 个图报错`);
  if (counts.leftoverMermaid) problems.push(`Mermaid: ${counts.leftoverMermaid} 个 mermaid 围栏未转换`);
  if (counts.overflow.length) problems.push('打印内容溢出: ' + JSON.stringify(counts.overflow));
  if (counts.mermaidTooTall.length) problems.push('Mermaid 超过 250mm: ' + counts.mermaidTooTall.join(','));
  if (problems.length) throw new Error('渲染未通过，未写出 PDF：' + problems.join('；'));

  await page.pdf({
    path: OUT,
    format: 'A4',
    printBackground: true,
    margin: { top: '16mm', bottom: '16mm', left: '14mm', right: '14mm' },
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate:
      '<div style="width:100%;text-align:center;font-size:8px;color:#999">' +
      '<span class="pageNumber"></span> / <span class="totalPages"></span></div>'
  });

  console.log('PDF:', OUT);
} finally {
  if (context) await context.close();
  if (browser) await browser.close();
  server.close();
}
