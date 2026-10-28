#!/usr/bin/env python3
"""doc_lint.py — 跨论文方法汇总文档的机械检查（仅标准库，只读）。

用法:
    python3 -I doc_lint.py <doc.md> [<doc2.md> ...]

检查项:
  1. 代码围栏成对；统计围栏数与公式块数（含单行 $$…$$ 与 ```math 围栏）
  2. 以 | 开头（可缩进）的表格行：块内列数一致（按未转义 | 切分）；
     行内代码里的裸 | 也会拆列，按错误报出
  3. 围栏外的行内反引号成对（奇数报错）
  4. 围栏外的裸 HTML 标签（允许 <br>）
  5. $ 只出现在 $$…$$ 块内（围栏外、公式块外出现即报错；货币符号请放进代码段）
  6. 相对链接目标存在（跳过 http/https/#/mailto；代码段内的链接不检查）
  7. Mermaid 节点/边标签以 `1.`、`2.`、`1)` 这类有序列表标记开头、且同一标签内含 `<br`：
     站点阅读页用 `htmlLabels:false`，标签**较宽、需要自动换行**时，Mermaid 11.12 会抛
     `splitLineToFitWidth does not support newlines in the line`，导致整页渲染失败
     （标签较短时可能侥幸通过）。此项按「提示」输出，不改变退出码；建议改用
     `①②③`、`第 1 步` 或去掉 `<br>`。

约定：公式块首选 **```math 围栏**（GitHub 上最稳，列表项内也可用；新文档一律用它）；仅为兼容
旧文档才接受顶格的 $$ 起止（各自单独成行）。**单行 $$…$$ 与带缩进/列表项内的 $$ 在 GitHub 上
不可靠**，脚本会把它们报为问题，建议统一改为 ```math 围栏。Markdown 自动链接
<https://…>、<http://…>、<mailto:…> 与邮箱 <user@example.com> 不算裸 HTML。
已知限制：识别行首或缩进的 ``` 围栏（不识别 ~~~ 围栏）；链接标题里含 `)` 时可能误报。
退出码: 0 = 无问题；1 = 发现问题或读取失败；2 = 用法错误。
"""

from __future__ import annotations

import os
import re
import sys

TABLE_CELL_SEP = re.compile(r"(?<!\\)\|")
HTML_TAG = re.compile(r"<(/?[a-zA-Z][a-zA-Z0-9-]*)")
MD_LINK = re.compile(r"\[[^\]]*\]\(([^)]+)\)")
SKIP_LINK_PREFIXES = ("http://", "https://", "#", "mailto:")
MERMAID_NODE = re.compile(r"\[([^\]]*)\]|\(([^)]*)\)")
MERMAID_EDGE = re.compile(r"\|([^|]*)\|")


def mermaid_label_warning(lineno: int, line: str) -> str | None:
    """提示可能让站点阅读页整页渲染失败的 Mermaid 标签组合（与标签宽度有关）。"""
    candidates = [m.group(1) or m.group(2) or "" for m in MERMAID_NODE.finditer(line)]
    candidates += [m.group(1) or "" for m in MERMAID_EDGE.finditer(line)]
    for text in candidates:
        text = text.strip().strip('"').strip("'").strip()
        if "<br" in text.lower() and re.match(r"\s*\d+[.)]\s", text):
            return (
                f"行 {lineno}: Mermaid 标签以 `1.`/`1)` 这类有序列表标记开头且含 `<br>`；"
                "标签较宽、需要自动换行时，站点（htmlLabels:false）下 Mermaid 11.12 会抛 "
                "splitLineToFitWidth 错误、整页渲染失败（较短时可能侥幸通过）。"
                "建议改用 ①②③、`第 1 步` 或去掉 `<br>`"
            )
    return None


def lint(path: str) -> tuple[list[str], list[str], int, int]:
    """返回 (问题列表, 提示列表, 围栏行数, 公式块数)。"""
    with open(path, encoding="utf-8") as fh:
        lines = fh.read().split("\n")

    problems: list[str] = []
    warnings: list[str] = []
    in_fence = False
    in_mermaid = False
    fence_lines: list[int] = []
    in_math = False
    math_blocks = 0
    table: list[tuple[int, int]] = []

    def flush_table() -> None:
        if len(table) > 1:
            counts = {n for _, n in table}
            if len(counts) != 1:
                rows = [lineno for lineno, _ in table]
                problems.append(
                    f"表格列数不一致（行 {rows}，列数 {sorted(counts)}）"
                )
        table.clear()

    for lineno, line in enumerate(lines, 1):
        if line.lstrip().startswith("```"):
            flush_table()
            opening = not in_fence
            info = line.strip().lower()
            if opening:
                if info.startswith("```math"):
                    math_blocks += 1
                in_mermaid = info.startswith("```mermaid")
            else:
                in_mermaid = False
            in_fence = opening
            fence_lines.append(lineno)
            continue
        if in_fence:
            if in_mermaid:
                warning = mermaid_label_warning(lineno, line)
                if warning:
                    warnings.append(warning)
            continue

        stripped = line.strip()
        if stripped == "$$":
            flush_table()
            if in_math:
                math_blocks += 1
            elif line != line.lstrip():
                # 列表项/缩进内的 $$ 在 GitHub 上经常不被识别，而 ```math 围栏不受缩进影响。
                problems.append(
                    f"行 {lineno}: 缩进/列表内的 $$ 公式块在 GitHub 上不可靠，请改用 ```math 围栏"
                )
            in_math = not in_math
            continue
        if in_math:
            continue
        # 单行显示公式：整行恰好是一个 $$…$$（内部不再含 $）。混有其他内容时不按块处理，
        # 交给后面的 $ 检查与链接检查，避免"整行跳过"造成漏检。
        if re.fullmatch(r"\$\$[^$]+\$\$", stripped):
            flush_table()
            math_blocks += 1
            problems.append(
                f"行 {lineno}: 单行 $$…$$ 在 GitHub 上不可靠，请改用 ```math 围栏"
            )
            continue

        if line.lstrip().startswith("|"):
            inner = line.strip().strip("|")
            # GFM 在解析行内内容之前按未转义 | 切列：代码段里的裸 | 同样会拆列，
            # 必须写成 \|。这里按原文切分，让这类行以列数不一致的形式暴露。
            table.append((lineno, len(TABLE_CELL_SEP.split(inner))))
            for span in re.finditer(r"`([^`]*)`", line):
                if re.search(r"(?<!\\)\|", span.group(1)):
                    problems.append(
                        f"行 {lineno}: 表格行内代码含未转义 '|'（会拆列，应写 \\|）"
                    )
        else:
            flush_table()

        if line.count("`") % 2 == 1:
            problems.append(f"行 {lineno}: 反引号数为奇数")

        # 行内代码里的内容不算正文：先剥掉再查裸 HTML 与 $，
        # 避免把 `$$…$$`、`<slug>` 这类记号误报成渲染问题。
        prose = re.sub(r"`[^`]*`", "", line)
        # Markdown 自动链接（URL / mailto / 邮箱）是合法写法，不算裸 HTML。
        prose_no_autolink = re.sub(
            r"<(?:https?://[^>]*|mailto:[^>]*|[^<>\s]+@[^<>\s]+)>", "", prose
        )
        # `[x](<path with space>)` 里的尖括号是链接目标定界符，不是 HTML。
        prose_no_link_target = re.sub(
            r"\]\(\s*<[^>]*>(?:\s+(['\"]).*?\1)?\s*\)", "]", prose_no_autolink
        )

        for match in HTML_TAG.finditer(prose_no_link_target):
            tag = match.group(1).lower()
            if tag != "br":
                problems.append(f"行 {lineno}: 疑似裸 HTML 标签 <{tag}>")

        if "$" in prose:
            problems.append(f"行 {lineno}: 公式块外出现 '$'（行内公式？）")

        for match in MD_LINK.finditer(prose):
            target = match.group(1).strip()
            # 支持 [x](<path with space>) 与 [x](path "title") 两种合法写法：
            # 先去掉可选的 title，再剥掉尖括号。
            target = re.sub(r"\s+(['\"]).*\1$", "", target).strip()
            if target.startswith("<") and target.endswith(">"):
                target = target[1:-1].strip()
            if target.startswith(SKIP_LINK_PREFIXES):
                continue
            target = target.split("#", 1)[0].split("?", 1)[0]
            if not target:
                continue
            base = os.path.dirname(os.path.abspath(path))
            resolved = os.path.normpath(os.path.join(base, target))
            if not os.path.exists(resolved):
                problems.append(f"行 {lineno}: 相对链接目标不存在: {target}")

    flush_table()
    if in_fence:
        problems.append("代码围栏未闭合")
    if in_math:
        problems.append("$$ 公式块未闭合")
    return problems, warnings, len(fence_lines), math_blocks


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print(__doc__)
        return 2

    exit_code = 0
    for path in argv[1:]:
        try:
            problems, warnings, fences, math_blocks = lint(path)
        except OSError as exc:
            print(f"== {path} ==\n无法读取: {exc}")
            exit_code = 1
            continue

        print(f"== {path} ==")
        fence_state = "成对" if fences % 2 == 0 else "未闭合"
        print(f"代码围栏: {fences} 行（{fence_state}）；独立公式块: {math_blocks} 个")
        if problems:
            exit_code = 1
            for problem in problems:
                print(f"  - {problem}")
        else:
            print("问题：无")
        if warnings:
            print("提示（不阻断）：")
            for warning in warnings:
                print(f"  - {warning}")

    return exit_code


if __name__ == "__main__":
    sys.exit(main(sys.argv))
