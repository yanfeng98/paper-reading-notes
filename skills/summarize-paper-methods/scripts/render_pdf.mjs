#!/usr/bin/env node
/**
 * 用 Playwright + Chromium 把 docs/index.html（含 MathJax/Mermaid）打印为 PDF。
 *
 * 用法：
 *   PLAYWRIGHT_MODULE=/home/luyanfeng/luyanfeng/nano-dnf/node_modules/playwright \
 *     node skills/summarize-paper-methods/scripts/render_pdf.mjs [输出路径]
 *
 * 默认输出：docs/rsi-methods.pdf
 * 依赖：Node 22+、Playwright（本机已有；浏览器缓存在 ~/.cache/ms-playwright）。
 * 脚本会自己起一个临时静态服务器（127.0.0.1 随机端口），等 window.__renderDone
 * 置位（MathJax + Mermaid 完成）后调用 page.pdf()。
 */

import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..', '..', '..');
const DOCS = join(REPO, 'docs');
const OUT = resolve(process.argv[2] || join(DOCS, 'rsi-methods.pdf'));
const PLAYWRIGHT =
  process.env.PLAYWRIGHT_MODULE ||
  '/home/luyanfeng/luyanfeng/nano-dnf/node_modules/playwright';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.json': 'application/json'
};

function safePath(urlPath) {
  const clean = decodeURIComponent((urlPath || '/').split('?')[0]);
  const rel = normalize(clean).replace(/^(\.\.(\/|\\|$))+/, '').replace(/^[/\\]+/, '');
  const full = resolve(DOCS, rel || 'index.html');
  if (full !== DOCS && !full.startsWith(DOCS + sep)) throw new Error('forbidden path');
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

const server = await startServer();
const port = server.address().port;
let browser;
try {
  browser = await playwright.chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', (err) => errors.push('pageerror: ' + err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push('console: ' + msg.text());
  });

  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForFunction(() => window.__renderDone === true, null, { timeout: 120000 });
  await page.emulateMedia({ media: 'print' });

  const counts = await page.evaluate(() => ({
    math: document.querySelectorAll('.math-display mjx-container').length,
    mathExpected: document.querySelectorAll('.math-display').length,
    mathErrors: document.querySelectorAll('mjx-container[data-mjx-error]').length,
    leftoverMath: document.querySelectorAll('pre > code.language-math').length,
    mermaid: document.querySelectorAll('.mermaid svg').length,
    mermaidExpected: document.querySelectorAll('.mermaid').length,
    mermaidErrors: document.querySelectorAll('.mermaid svg[aria-roledescription="error"]').length,
    leftoverMermaid: document.querySelectorAll('pre > code.language-mermaid').length,
    tables: document.querySelectorAll('table').length,
    literalDollars: (document.body.innerText.match(/\$\$/g) || []).length
  }));

  console.log('rendered:', JSON.stringify(counts));
  if (errors.length) {
    console.error('page errors (' + errors.length + '):');
    for (const e of errors) console.error('  -', e);
  }

  // 渲染计数不对时不要写出一个“看起来成功”的 PDF：MathJax/Mermaid 失败会让
  // 公式或图静默缺失，必须让脚本非零退出。
  const problems = [];
  if (counts.math !== counts.mathExpected) {
    problems.push(`MathJax: ${counts.math}/${counts.mathExpected} 个显示公式已渲染`);
  }
  if (counts.mathErrors) {
    problems.push(`MathJax: ${counts.mathErrors} 个公式报错`);
  }
  if (counts.leftoverMath) {
    problems.push(`MathJax: ${counts.leftoverMath} 个 math 围栏未转换`);
  }
  if (counts.mermaid !== counts.mermaidExpected) {
    problems.push(`Mermaid: ${counts.mermaid}/${counts.mermaidExpected} 个图已渲染`);
  }
  if (counts.mermaidErrors) {
    problems.push(`Mermaid: ${counts.mermaidErrors} 个图报错`);
  }
  if (counts.leftoverMermaid) {
    problems.push(`Mermaid: ${counts.leftoverMermaid} 个 mermaid 围栏未转换`);
  }
  if (problems.length) {
    throw new Error('渲染未完成，未写出 PDF：' + problems.join('；'));
  }

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
  if (browser) await browser.close();
  server.close();
}
