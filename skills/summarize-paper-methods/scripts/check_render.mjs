#!/usr/bin/env node
/**
 * 用 Playwright + 真实时间加载一个站点页面并核对渲染结果。
 *
 * 阅读页对 Mermaid 延迟加载：首图距视口 >2.5 屏时 window.__renderDone 为真但图
 * 还没渲染。本脚本在 renderDone 后显式调用 window.__ensureMermaid()，再数 SVG，
 * 避免「还没加载」被误判成「渲染失败」；同时不使用 --virtual-time-budget，
 * 以免虚拟时钟冻结 Date.now() 让多图拿到相同 id（Mermaid 用它生成图表 id）。
 * 同时报告正文 `<img>` 数量（images）与加载失败数（brokenImages）；images 需与
 * 源文档里的 `![...]` 数量对照，brokenImages 必须为 0。
 *
 * 用法：
 *   python3 site/build.py --out _site
 *   node skills/summarize-paper-methods/scripts/check_render.mjs \
 *     --page notes/blogs/<slug>/index.html
 *   # 已部署的线上页面：
 *   node .../check_render.mjs --url https://example.com/notes/blogs/<slug>/
 *
 * Playwright 默认自动查找（本地 node_modules 与 npx 缓存）；
 * 找不到时用 PLAYWRIGHT_MODULE=/path/to/node_modules/playwright 指定。
 *
 * 退出码：0 = 全部通过；1 = 有未通过项。
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadPlaywright } from './load-playwright.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..', '..', '..');

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
const PAGE = take('--page', '').replace(/^\/+/, '');
const URL_ARG = take('--url', '');

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

if (!URL_ARG && !PAGE) throw new Error('需要 --page（本地 _site 相对路径）或 --url（已部署地址）');

const playwright = loadPlaywright();

let server = null;
let url = URL_ARG;
if (!url) {
  const stat = await import('node:fs/promises').then((fs) => fs.stat(SITE)).catch(() => null);
  if (!stat) throw new Error(`站点目录不存在：${SITE}\n先运行：python3 site/build.py --out _site`);
  server = await startServer();
  url = `http://127.0.0.1:${server.address().port}/${PAGE}`;
}

const pageErrors = [];
let browser;
let exitCode = 0;
try {
  browser = await playwright.chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: 'light' });
  const page = await context.newPage();
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });

  const report = await page.evaluate(async () => {
    const sleep = (ms) => new Promise((done) => setTimeout(done, ms));
    for (let i = 0; i < 300; i += 1) {
      if (window.__renderDone || window.__renderError) break;
      await sleep(200);
    }
    if (typeof window.__ensureMermaid === 'function') await window.__ensureMermaid();
    const content = document.querySelector('.prose') || document.body;
    const imgs = [...content.querySelectorAll('img')].filter(
      (img) => (img.getAttribute('src') || '').trim()
    );
    // 正文图常见 loading="lazy"；先强制 eager 并等 load/error，避免把未加载的
    // 底部配图误算成正常（只对已开始加载的图做 broken 判定会漏报）。
    imgs.forEach((img) => { img.loading = 'eager'; });
    await Promise.all(imgs.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolveImg) => {
        const done = () => resolveImg();
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
        setTimeout(done, 5000);
      });
    }));
    // 只统计正文文本节点里的 `**`：行内代码、代码块、公式与 Mermaid 里的 `**`
    // 是正常内容（例如文档在讲 Markdown 语法），不应算作未渲染的加粗标记。
    const countLiteralStars = () => {
      const skipTags = new Set(['CODE', 'PRE', 'MJX-CONTAINER']);
      let count = 0;
      const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        let skip = false;
        for (let el = node.parentElement; el; el = el.parentElement) {
          if (
            skipTags.has(el.tagName) ||
            el.classList.contains('math-display') ||
            el.classList.contains('mermaid')
          ) {
            skip = true;
            break;
          }
        }
        if (!skip) count += (node.nodeValue.match(/\*\*/g) || []).length;
      }
      return count;
    };
    return {
      title: document.title,
      pageKind: document.body.dataset.page || 'unknown',
      renderError: window.__renderError || (document.querySelector('.render-error')?.textContent || ''),
      done: window.__renderDone === true,
      math: content.querySelectorAll('.math-display mjx-container').length,
      mathExpected: Number(document.body.dataset.expectedMath || 0),
      mermaid: content.querySelectorAll('.mermaid svg').length,
      mermaidExpected: Number(document.body.dataset.expectedMermaid || 0),
      images: imgs.length,
      brokenImages: imgs.filter((img) => img.complete && img.naturalWidth === 0).length,
      leftovers: content.querySelectorAll('pre > code.language-mermaid, pre > code.language-math').length,
      toc: document.querySelectorAll('#toc-list a').length,
      headings: content.querySelectorAll('h2, h3').length,
      tables: content.querySelectorAll('table').length,
      literalStars: countLiteralStars()
    };
  });

  if (report.pageKind !== 'doc') {
    console.log(JSON.stringify({
      url, title: report.title, page: report.pageKind,
      note: '非阅读页（没有 __renderDone / .prose），跳过渲染计数', jsErrors: pageErrors
    }, null, 2));
    process.exit(pageErrors.length ? 1 : 0);
  }

  const problems = [];
  if (!report.done) problems.push('页面未完成渲染（__renderDone 未置真）');
  if (report.renderError) problems.push('渲染错误：' + report.renderError);
  if (pageErrors.length) problems.push('页面 JS 错误：' + pageErrors.join(' | '));
  if (report.math !== report.mathExpected) problems.push(`公式 ${report.math}/${report.mathExpected}`);
  if (report.mermaid !== report.mermaidExpected) problems.push(`Mermaid ${report.mermaid}/${report.mermaidExpected}`);
  if (report.brokenImages) problems.push(`配图加载失败：${report.brokenImages}/${report.images}`);
  if (report.leftovers) problems.push(`未转换的围栏：${report.leftovers}`);
  if (report.headings && !report.toc) problems.push('TOC 为空');
  if (report.literalStars) problems.push(`正文残留字面 **：${report.literalStars} 处`);

  console.log(JSON.stringify({ url, ...report, problems }, null, 2));
  if (problems.length) exitCode = 1;
} finally {
  if (browser) await browser.close();
  if (server) server.close();
}
process.exit(exitCode);
