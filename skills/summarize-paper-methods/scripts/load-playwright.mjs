// 定位并加载 Playwright。
//
// 顺序：
//   1. 环境变量 PLAYWRIGHT_MODULE（显式指定；./ 或 ../ 开头的相对路径按当前工作目录解析）；
//   2. 常规解析 `playwright` / `playwright-core`；
//   3. npm 的 _npx 缓存（默认 ~/.npm/_npx，可用 npm_config_cache 覆盖；按修改时间从新到旧）。
//
// 找不到时给出可操作的报错；找到路径但加载失败时保留原始错误，便于排查。
import { createRequire } from 'node:module';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { isAbsolute, join, resolve } from 'node:path';

const require = createRequire(import.meta.url);

function tryLoad(id) {
  try {
    return { mod: require(id), error: null };
  } catch (error) {
    return { mod: null, error };
  }
}

function firstLine(error) {
  return error ? String(error.message).split('\n')[0] : '';
}

function usable(mod) {
  return !!(mod && mod.chromium);
}

function npxCandidates() {
  const cache = process.env.npm_config_cache || join(homedir(), '.npm');
  const root = join(cache, '_npx');
  if (!existsSync(root)) return [];
  let entries = [];
  try {
    entries = readdirSync(root, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => {
        const dir = join(root, entry.name);
        let mtime = 0;
        try {
          mtime = statSync(dir).mtimeMs;
        } catch {
          // 忽略读不到时间戳的目录，保持排序稳定。
        }
        return { dir, mtime };
      })
      .sort((a, b) => b.mtime - a.mtime);
  } catch {
    return [];
  }
  const out = [];
  for (const { dir } of entries) {
    out.push(join(dir, 'node_modules', 'playwright'));
    out.push(join(dir, 'node_modules', 'playwright-core'));
  }
  return out;
}

export function loadPlaywright() {
  const explicit = process.env.PLAYWRIGHT_MODULE;
  if (explicit) {
    // 绝对路径或以 ./、../ 开头的相对路径按路径解析；其余（含 @scope/name）
    // 仍按模块名交给 require，避免把作用域包误当成文件路径。
    const looksLikePath = isAbsolute(explicit) || explicit.startsWith('.');
    const id = looksLikePath ? resolve(process.cwd(), explicit) : explicit;
    const { mod, error } = tryLoad(id);
    if (usable(mod)) return mod;
    const reason = mod ? '模块未导出 chromium' : firstLine(error);
    throw new Error(
      `PLAYWRIGHT_MODULE 指向的模块无法加载：${explicit}` +
        (reason ? `（${reason}）` : '')
    );
  }

  for (const id of ['playwright', 'playwright-core']) {
    const { mod } = tryLoad(id);
    if (usable(mod)) return mod;
  }

  let lastError = null;
  for (const candidate of npxCandidates()) {
    if (!existsSync(candidate)) continue;
    const { mod, error } = tryLoad(candidate);
    if (usable(mod)) return mod;
    lastError = error || new Error('模块未导出 chromium');
  }

  const hint =
    '请设置 PLAYWRIGHT_MODULE=/path/to/node_modules/playwright，' +
    '或在项目里安装 playwright（npm i -D playwright）。';
  if (lastError) {
    throw new Error(`找到 Playwright 路径但加载失败：${firstLine(lastError)}\n${hint}`);
  }
  throw new Error(`找不到 Playwright 模块。${hint}`);
}
