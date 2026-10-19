#!/usr/bin/env python3
"""github_render_check.py — 用 GitHub Markdown API 验证公式与 Mermaid 能否原生渲染。

用法:
    python3 -I github_render_check.py <file.md> [<file2.md> ...]

对每个文件:
  1. 统计 ```math / ```mermaid 围栏块数；为兼容旧文档，也统计 $$ 起止块（含缩进/
     列表内的）与整行 $$…$$（不把普通代码围栏算进去）；
  2. 把整篇 Markdown POST 到 https://api.github.com/markdown（mode=gfm）；
  3. 统计返回 HTML 中的 <math-renderer>、highlight-source-mermaid，以及未转换的
     language-math / language-mermaid 残留；
  4. 源块数必须与渲染数一致、且无残留，否则退出码为 1。

说明:
  - 需要联网；只用于本仓库的公开笔记/汇总，不要把私有内容发到公开 API。
  - 未认证 API 限 60 次/小时；设置 GITHUB_TOKEN 可提高限额（不会打印 token）。
  - 新文档请统一用 ```math / ```mermaid 围栏。旧文档的 $$ 块（含缩进/列表内）会被
    计数并验证是否真的渲染；若 GitHub 不识别，会以“源 1、渲染 0”报错，提示改写。
  - 退出码: 0 = 全部通过；1 = 有文件不通过或请求失败；2 = 用法错误。
"""

from __future__ import annotations

import json
import os
import re
import sys
import time
import urllib.error
import urllib.request

API = "https://api.github.com/markdown"
FENCE_OPEN = re.compile(r"^\s*```(\S*)\s*$")
FENCE_CLOSE = re.compile(r"^\s*```\s*$")
BLOCK_LANGS = ("math", "mermaid")


def count_blocks(text: str) -> dict[str, int]:
    """统计 math/mermaid 围栏；兼容旧文档的 $$ 块（含缩进）与整行 $$…$$。"""
    counts = {lang: 0 for lang in BLOCK_LANGS}
    in_fence = False
    in_math = False
    for line in text.split("\n"):
        if in_fence:
            if FENCE_CLOSE.match(line):
                in_fence = False
            continue
        match = FENCE_OPEN.match(line)
        if match:
            in_fence = True
            lang = match.group(1).lower()
            if lang in counts:
                counts[lang] += 1
            continue

        stripped = line.strip()
        if stripped == "$$":
            if not in_math:
                counts["math"] += 1
            in_math = not in_math
            continue
        if in_math:
            continue
        if re.fullmatch(r"\$\$[^$]+\$\$", stripped):
            counts["math"] += 1
    return counts


def render_on_github(text: str, token: str | None) -> tuple[str, str | None]:
    """调用 GitHub Markdown API，返回 (HTML, X-RateLimit-Remaining)。"""
    payload = json.dumps({"text": text, "mode": "gfm"}).encode("utf-8")
    headers = {
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json",
        "User-Agent": "paper-reading-notes-render-check",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"

    last_error: Exception | None = None
    for attempt in range(3):
        request = urllib.request.Request(API, data=payload, headers=headers)
        try:
            with urllib.request.urlopen(request, timeout=60) as response:
                return response.read().decode("utf-8"), response.headers.get(
                    "X-RateLimit-Remaining"
                )
        except urllib.error.HTTPError as exc:
            last_error = exc
            if exc.code in (429, 500, 502, 503, 504) and attempt < 2:
                time.sleep(3 * (attempt + 1))
                continue
            detail = exc.read().decode("utf-8", "replace")[:300]
            raise RuntimeError(f"HTTP {exc.code}: {detail}") from exc
        except urllib.error.URLError as exc:
            last_error = exc
            if attempt < 2:
                time.sleep(3 * (attempt + 1))
                continue
            raise RuntimeError(f"网络请求失败: {exc.reason}") from exc
    raise RuntimeError(f"请求失败: {last_error}")


def check(path: str, token: str | None) -> tuple[bool, list[str]]:
    try:
        with open(path, encoding="utf-8") as handle:
            text = handle.read()
    except OSError as exc:
        return False, [f"无法读取: {exc}"]

    source = count_blocks(text)
    try:
        html, remaining = render_on_github(text, token)
    except RuntimeError as exc:
        return False, [str(exc)]

    rendered_math = html.count("<math-renderer")
    rendered_mermaid = html.count("highlight-source-mermaid")
    leftover_math = html.count("language-math")
    leftover_mermaid = html.count("language-mermaid")

    problems: list[str] = []
    if source["math"] != rendered_math:
        problems.append(
            f"公式: 源 {source['math']} 块，GitHub 渲染 {rendered_math} 个"
        )
    if source["mermaid"] != rendered_mermaid:
        problems.append(
            f"Mermaid: 源 {source['mermaid']} 块，GitHub 渲染 {rendered_mermaid} 个"
        )
    if leftover_math:
        problems.append(f"有 {leftover_math} 个 math 围栏未被识别（language-math 残留）")
    if leftover_mermaid:
        problems.append(
            f"有 {leftover_mermaid} 个 mermaid 围栏未被识别（language-mermaid 残留）"
        )

    status = "OK" if not problems else "FAIL"
    limit = f"; API remaining={remaining}" if remaining is not None else ""
    print(
        f"== {path} ==\n"
        f"  source: math={source['math']} mermaid={source['mermaid']}\n"
        f"  github: math={rendered_math} mermaid={rendered_mermaid} "
        f"leftover={leftover_math}/{leftover_mermaid}{limit}\n"
        f"  {status}"
    )
    if problems:
        for problem in problems:
            print(f"  - {problem}")
    return not problems, problems


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print(__doc__)
        return 2

    token = os.environ.get("GITHUB_TOKEN") or None
    if not token:
        print("提示: 未设置 GITHUB_TOKEN，使用未认证 API（60 次/小时）。", file=sys.stderr)

    exit_code = 0
    for path in argv[1:]:
        ok, problems = check(path, token)
        if not ok and problems:
            exit_code = 1
    return exit_code


if __name__ == "__main__":
    sys.exit(main(sys.argv))
