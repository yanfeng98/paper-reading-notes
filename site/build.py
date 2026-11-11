#!/usr/bin/env python3
"""Build the static GitHub Pages site for paper-reading-notes.

Usage:
    python3 site/build.py [--out _site]

The builder uses only the Python standard library. It discovers all notes under
notes/ and summary documents under docs/, reads their metadata from README.md,
copies the note-local assets, and writes a static site to _site/ (ignored by
git). The workflow uploads that directory to GitHub Pages.

The Markdown body is rendered in the browser by the vendored marked bundle;
this builder emits the library home (including a git-derived contribution
graph), per-document reader shells, manifests, and the copied source files.
"""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import math
import posixpath
import re
import shutil
import subprocess
import sys
import tempfile
from dataclasses import dataclass, field
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from typing import Iterable
from urllib.parse import urlsplit

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
README = ROOT / "README.md"
NOTES = ROOT / "notes"
DOCS = ROOT / "docs"
SITE = ROOT / "site"
REPO_URL = "https://github.com/yanfeng98/paper-reading-notes"
SITE_TITLE = "Paper Reading Notes"
SITE_DESCRIPTION = "论文阅读笔记：精读、方法拆解与横向对比。"
DEFAULT_OUT = ROOT / "_site"

# The contribution graph buckets commits by the day in UTC+8. GitHub uses each
# commit's own offset, so a commit just before/after midnight may land one day
# apart; the site keeps a single schedule so the graph is stable.
CONTRIB_TZ = timezone(timedelta(hours=8))

FENCE_OPEN = re.compile(r"^\s*(`{3,}|~{3,})(.*)$")
FENCE_CLOSE = re.compile(r"^\s*(`{3,}|~{3,})\s*$")
HEADING = re.compile(r"^ {0,3}(#{1,6})\s+(.+?)\s*#*\s*$")
H1 = re.compile(r"^ {0,3}#\s+(.+?)\s*#*\s*$")
H2_H3 = re.compile(r"^ {0,3}(#{2,3})\s+(.+?)\s*#*\s*$")
NOTE_ROW = re.compile(
    r"^\|\[(\d{5})\]\([^)]*\)\|\[(.+?)\]\(([^)]*)\)\|(\d{4})\|([^|]+)\|"
    r"\[笔记\]\(\./(notes/(?:papers|blogs)/[^/]+/note\.md)\)\|$"
)
LINK = re.compile(r"(?<!!)\[[^\]]*\]\(([^)]+)\)")
IMAGE = re.compile(r"!\[[^\]]*\]\(([^)]+)\)")
READ_DATE = re.compile(r"^\|\s*阅读日期\s*\|\s*(\d{4}-\d{2}-\d{2})\s*\|")
READ_DATE_BULLET = re.compile(r"^\s*(?:[-*]\s*)?(?:\*\*)?阅读日期(?:\*\*)?\s*[：:]\s*(\d{4}-\d{2}-\d{2})")
CJK = re.compile(r"[㐀-鿿]")
LATIN_WORD = re.compile(r"[A-Za-z0-9]+")
URL_PARTS = ("http://", "https://", "mailto:", "tel:", "data:", "//")


class BuildError(RuntimeError):
    pass


@dataclass
class Entry:
    source_path: str
    route: str
    kind: str
    title: str
    paper_title: str = ""
    doc_id: str = ""
    year: str = ""
    unit: str = ""
    original_url: str = ""
    read_date: str = ""
    reading_minutes: int = 1
    excerpt: str = ""
    headings: list[str] = field(default_factory=list)
    math_count: int = 0
    mermaid_count: int = 0
    image_count: int = 0
    cover_rel: str = ""
    source_hash: str = ""
    pdf_rel: str = ""
    prev_route: str = ""
    prev_title: str = ""
    next_route: str = ""
    next_title: str = ""

    @property
    def is_summary(self) -> bool:
        return self.kind == "summary"

    @property
    def kind_label(self) -> str:
        return {"paper": "论文笔记", "blog": "博客笔记", "summary": "主题汇总"}[self.kind]

    @property
    def depth(self) -> int:
        return len([p for p in self.route.strip("/").split("/") if p])

    @property
    def root(self) -> str:
        return "../" * self.depth


@dataclass
class HeatCell:
    day: date | None
    count: int
    level: int
    out: bool = False


@dataclass
class HeatRange:
    key: str
    label: str
    weeks: list[list[HeatCell]]
    months: list[tuple[int, int, str]]
    total: int
    active_days: int


def iter_outside_fences(text: str) -> Iterable[tuple[int, str]]:
    """Yield (lineno, line) for lines outside Markdown fences.

    Supports backtick and tilde fences, arbitrary indentation, and longer close
    fences. This is intentionally more permissive than a naive '^```' scan.
    """
    in_fence = False
    fence_char = ""
    fence_len = 0
    for lineno, line in enumerate(text.splitlines(), 1):
        if in_fence:
            match = FENCE_CLOSE.match(line)
            if (
                match
                and match.group(1)[0] == fence_char
                and len(match.group(1)) >= fence_len
            ):
                in_fence = False
            continue
        match = FENCE_OPEN.match(line)
        if match:
            in_fence = True
            fence_char = match.group(1)[0]
            fence_len = len(match.group(1))
            continue
        yield lineno, line


def fence_counts(text: str) -> tuple[int, int]:
    """Return (math_fences, mermaid_fences), including indented fences."""
    math_count = 0
    mermaid_count = 0
    in_fence = False
    fence_char = ""
    fence_len = 0
    for line in text.splitlines():
        if in_fence:
            match = FENCE_CLOSE.match(line)
            if (
                match
                and match.group(1)[0] == fence_char
                and len(match.group(1)) >= fence_len
            ):
                in_fence = False
            continue
        match = FENCE_OPEN.match(line)
        if not match:
            continue
        in_fence = True
        fence_char = match.group(1)[0]
        fence_len = len(match.group(1))
        info = match.group(2).strip().split()
        lang = info[0].lower() if info else ""
        if lang == "math":
            math_count += 1
        elif lang == "mermaid":
            mermaid_count += 1
    return math_count, mermaid_count


def plain_text(value: str) -> str:
    text = value
    text = re.sub(r"!\[([^\]]*)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"<https?://[^>]+>", "", text)
    text = re.sub(r"<[^>]+>", "", text)
    text = re.sub(r"`([^`]*)`", r"\1", text)
    text = re.sub(r"\*\*|__", "", text)
    text = re.sub(r"(?<!\w)[*_]|[*_](?!\w)", "", text)
    text = re.sub(r"^#{1,6}\s*", "", text, flags=re.MULTILINE)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def extract_h1(text: str) -> str:
    for _, line in iter_outside_fences(text):
        match = H1.match(line)
        if match:
            return plain_text(match.group(1))
    return ""


def extract_headings(text: str) -> list[str]:
    headings: list[str] = []
    for _, line in iter_outside_fences(text):
        match = H2_H3.match(line)
        if match:
            label = plain_text(match.group(2))
            if label:
                headings.append(label)
    return headings


def section_lines(text: str, names: tuple[str, ...]) -> list[str]:
    """Return the body lines of the first matching H2 section (fence-aware)."""
    outside = list(iter_outside_fences(text))
    start = -1
    level = 2
    for index, (_, line) in enumerate(outside):
        match = HEADING.match(line)
        if not match:
            continue
        title = plain_text(match.group(2)).rstrip("：:")
        if any(name in title for name in names):
            start = index + 1
            level = len(match.group(1))
            break
    if start < 0:
        return []
    body: list[str] = []
    for _, line in outside[start:]:
        match = HEADING.match(line)
        if match and len(match.group(1)) <= level:
            break
        body.append(line)
    return body


def first_paragraph(lines: list[str]) -> str:
    collected: list[str] = []
    started = False
    for line in lines:
        stripped = line.strip()
        if not stripped:
            if started:
                break
            continue
        if stripped.startswith("#"):
            # A heading is not a paragraph: skip it instead of using the title
            # as the card excerpt when the document has no 核心结论 section.
            if started:
                break
            continue
        if stripped.startswith("|"):
            if started:
                break
            continue
        if stripped.startswith("```") or stripped.startswith("~~~"):
            continue
        if stripped.startswith(">"):
            stripped = stripped.lstrip("> ").strip()
        if not stripped:
            continue
        collected.append(stripped)
        started = True
    return plain_text(" ".join(collected))


def extract_excerpt(text: str, kind: str) -> str:
    if kind == "summary":
        for _, line in iter_outside_fences(text):
            if "一句话预告" in line:
                candidate = line.split("：", 1)[-1] if "：" in line else line
                candidate = candidate.split(":", 1)[-1] if ":" in candidate else candidate
                candidate = plain_text(candidate)
                if candidate:
                    return truncate(candidate)
        excerpt = first_paragraph(section_lines(text, ("关于这份文档",)))
        if excerpt:
            return truncate(excerpt)
    # Choose the earliest matching section in document order: HarnessX has a
    # one-line section before its numbered "1. 核心结论", and the one-liner is
    # the better card summary.
    excerpt = first_paragraph(
        section_lines(text, ("核心结论", "一句话", "一句话备忘"))
    )
    if excerpt:
        excerpt = re.sub(r"^一句话[：:]\s*", "", excerpt)
        return truncate(excerpt)
    # Fallback: first prose paragraph outside source-info tables.
    lines = [line for _, line in iter_outside_fences(text)]
    return truncate(first_paragraph(lines))


def truncate(text: str, limit: int = 180) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) <= limit:
        return text
    return text[: limit - 1].rstrip() + "…"


def extract_read_date(text: str) -> str:
    for _, line in iter_outside_fences(text):
        for pattern in (READ_DATE, READ_DATE_BULLET):
            match = pattern.match(line)
            if match:
                return match.group(1)
    return ""


def estimate_reading_minutes(text: str) -> int:
    cjk = 0
    words = 0
    for _, line in iter_outside_fences(text):
        stripped = line.strip()
        if not stripped or stripped.startswith("|") or stripped.startswith("#"):
            continue
        cjk += len(CJK.findall(stripped))
        words += len(LATIN_WORD.findall(stripped))
    return max(1, math.ceil(cjk / 400 + words / 220))


def strip_inline_code(line: str) -> str:
    return re.sub(r"`[^`]*`", "", line)


def link_targets(text: str) -> tuple[list[str], list[str]]:
    links: list[str] = []
    images: list[str] = []
    for _, line in iter_outside_fences(text):
        clean = strip_inline_code(line)
        for match in IMAGE.finditer(clean):
            images.append(match.group(1).strip())
        for match in LINK.finditer(clean):
            links.append(match.group(1).strip())
    return links, images


def normalize_target(target: str) -> str:
    target = target.strip()
    target = re.sub(r"\s+(['\"]).*\1$", "", target).strip()
    if target.startswith("<") and target.endswith(">"):
        target = target[1:-1].strip()
    return target


def is_external(target: str) -> bool:
    lowered = target.lower()
    return lowered.startswith(URL_PARTS) or target.startswith("#")


def resolve_repo_path(source_path: str, target: str) -> tuple[str | None, str]:
    """Resolve a relative Markdown target to a repo-relative path.

    Returns (repo_path, status) where status is external/fragment/relative.
    Root-absolute local paths are rejected by the validator.
    """
    target = normalize_target(target)
    if not target:
        return None, "empty"
    if target.startswith("#"):
        return None, "fragment"
    if is_external(target):
        return None, "external"
    parts = urlsplit(target)
    if not parts.path:
        return None, "fragment"
    if parts.path.startswith("/"):
        return parts.path.lstrip("/"), "root"
    resolved = posixpath.normpath(
        posixpath.join(posixpath.dirname(source_path), parts.path)
    )
    return resolved, "relative"


def parse_readme() -> tuple[dict[str, dict[str, str]], dict[str, int]]:
    text = README.read_text(encoding="utf-8")
    rows = [line for line in text.splitlines() if line.startswith("|[")]
    note_rows = [line for line in rows if "[笔记](" in line]
    mapping: dict[str, dict[str, str]] = {}
    ids: set[str] = set()
    for line in note_rows:
        match = NOTE_ROW.match(line)
        if not match:
            raise BuildError(f"无法解析 README 笔记行: {line[:160]}")
        doc_id, title, original_url, year, unit, note_path = match.groups()
        note_path = posixpath.normpath(note_path)
        if doc_id in ids:
            raise BuildError(f"README 编号重复: {doc_id}")
        if note_path in mapping:
            raise BuildError(f"README 笔记路径重复: {note_path}")
        ids.add(doc_id)
        mapping[note_path] = {
            "id": doc_id,
            "title": plain_text(title),
            "original_url": original_url,
            "year": year,
            "unit": plain_text(unit),
        }
    stats = {
        "rows": len(rows),
        "notes": len(note_rows),
        "pending": len(rows) - len(note_rows),
    }
    return mapping, stats


def file_hash(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()[:12]


def route_for(source: Path) -> str:
    rel = source.relative_to(ROOT).as_posix()
    if rel.endswith("/note.md"):
        return rel[: -len("note.md")]
    if rel.startswith("docs/") and rel.endswith(".md"):
        return f"docs/{source.stem}/"
    raise BuildError(f"无法为 {rel} 生成路由")


COVER_SUFFIXES = {".avif", ".gif", ".jpeg", ".jpg", ".png", ".svg", ".webp"}
# A transparent 1x1 GIF keeps Kimi-only <img> elements from showing a broken
# icon before site.js hydrates their real data-kimi-src.
KIMI_PLACEHOLDER = (
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
)


def first_cover_image(source_path: str, images: list[str]) -> str:
    """Return the first local note asset suitable for a Kimi cover.

    Only images under the note's own ``assets/`` directory are used: that is
    the directory the builder copies next to the generated page, so the URL is
    guaranteed to resolve on both the home card and the reader page.
    """
    asset_prefix = posixpath.join(posixpath.dirname(source_path), "assets") + "/"
    for target in images:
        repo_path, status = resolve_repo_path(source_path, target)
        if status != "relative" or not repo_path:
            continue
        if not repo_path.startswith(asset_prefix):
            continue
        if Path(repo_path).suffix.lower() not in COVER_SUFFIXES:
            continue
        if (ROOT / repo_path).is_file():
            return repo_path
    return ""


def analyze(
    source: Path,
    kind: str,
    readme_meta: dict[str, str] | None,
    docs_pdf: Path | None = None,
) -> Entry:
    text = source.read_text(encoding="utf-8")
    source_path = source.relative_to(ROOT).as_posix()
    route = route_for(source)
    title = extract_h1(text)
    if not title:
        title = (readme_meta or {}).get("title", source.stem)
    paper_title = (readme_meta or {}).get("title", "") if kind != "summary" else ""
    excerpt = extract_excerpt(text, kind)
    math_count, mermaid_count = fence_counts(text)
    links, images = link_targets(text)
    pdf_rel = ""
    if docs_pdf and docs_pdf.exists():
        pdf_rel = f"{route}{docs_pdf.name}"
    entry = Entry(
        source_path=source_path,
        route=route,
        kind=kind,
        title=title,
        paper_title=paper_title,
        doc_id=(readme_meta or {}).get("id", ""),
        year=(readme_meta or {}).get("year", ""),
        unit=(readme_meta or {}).get("unit", "跨篇汇总"),
        original_url=(readme_meta or {}).get("original_url", ""),
        read_date=extract_read_date(text) if kind != "summary" else "",
        reading_minutes=estimate_reading_minutes(text),
        excerpt=excerpt,
        headings=extract_headings(text),
        math_count=math_count,
        mermaid_count=mermaid_count,
        image_count=len(images),
        cover_rel=first_cover_image(source_path, images) if kind != "summary" else "",
        source_hash=file_hash(source),
        pdf_rel=pdf_rel,
    )
    return entry


def discover_entries() -> tuple[list[Entry], list[Entry], dict[str, Entry], dict[str, int]]:
    readme_map, stats = parse_readme()
    note_files = sorted(NOTES.glob("papers/*/note.md")) + sorted(
        NOTES.glob("blogs/*/note.md")
    )
    discovered: dict[str, Path] = {
        path.relative_to(ROOT).as_posix(): path for path in note_files
    }
    missing_rows = sorted(set(discovered) - set(readme_map))
    if missing_rows:
        raise BuildError("以下笔记没有 README 行: " + ", ".join(missing_rows))
    missing_files = sorted(set(readme_map) - set(discovered))
    if missing_files:
        raise BuildError("README 指向不存在的笔记: " + ", ".join(missing_files))

    notes: list[Entry] = []
    routes: dict[str, Entry] = {}
    for source_path, path in discovered.items():
        kind = "blog" if "/blogs/" in source_path else "paper"
        entry = analyze(path, kind, readme_map[source_path])
        if entry.route in routes:
            raise BuildError(f"路由重复: {entry.route}")
        routes[entry.route] = entry
        notes.append(entry)

    docs_paths = sorted(DOCS.glob("*.md"))
    docs_paths = [path for path in docs_paths if path.name.lower() != "readme.md"]
    if not docs_paths:
        raise BuildError("docs/ 下没有汇总文档")
    summaries: list[Entry] = []
    for path in docs_paths:
        pdf = path.with_suffix(".pdf")
        entry = analyze(path, "summary", None, pdf if pdf.exists() else None)
        if entry.route in routes:
            raise BuildError(f"路由重复: {entry.route}")
        routes[entry.route] = entry
        summaries.append(entry)

    notes.sort(
        key=lambda item: (item.read_date or "", item.year or "", item.doc_id or ""),
        reverse=True,
    )
    for index, entry in enumerate(notes):
        if index:
            entry.prev_route, entry.prev_title = notes[index - 1].route, notes[index - 1].title
        if index + 1 < len(notes):
            entry.next_route, entry.next_title = notes[index + 1].route, notes[index + 1].title

    entries = [*summaries, *notes]
    validate_links(entries)
    return entries, summaries, routes, stats


def validate_links(entries: list[Entry]) -> None:
    known_sources = {entry.source_path for entry in entries}
    pdf_paths = {entry.pdf_rel for entry in entries if entry.pdf_rel}
    for entry in entries:
        source = ROOT / entry.source_path
        text = source.read_text(encoding="utf-8")
        links, images = link_targets(text)
        for target in images:
            repo_path, status = resolve_repo_path(entry.source_path, target)
            if status in ("external", "fragment"):
                continue
            if status == "root":
                raise BuildError(f"{entry.source_path}: 不支持根绝对图片路径 {target!r}")
            assert repo_path is not None
            if repo_path.startswith("../") or repo_path == "..":
                raise BuildError(f"{entry.source_path}: 图片越出仓库 {target!r}")
            image_path = ROOT / repo_path
            if image_path.is_dir():
                raise BuildError(f"{entry.source_path}: 图片路径指向目录: {target!r}")
            if not image_path.exists():
                raise BuildError(f"{entry.source_path}: 图片不存在: {target!r} -> {repo_path}")
        for target in links:
            repo_path, status = resolve_repo_path(entry.source_path, target)
            if status in ("external", "fragment"):
                continue
            if status == "root":
                raise BuildError(f"{entry.source_path}: 不支持根绝对链接 {target!r}")
            assert repo_path is not None
            if repo_path.startswith("../") or repo_path == "..":
                raise BuildError(f"{entry.source_path}: 链接越出仓库 {target!r}")
            if repo_path in known_sources:
                continue
            if repo_path in pdf_paths:
                continue
            link_path = ROOT / repo_path
            if link_path.is_dir():
                raise BuildError(f"{entry.source_path}: 链接指向目录: {target!r}；请链接到具体文件")
            if not link_path.exists():
                raise BuildError(f"{entry.source_path}: 链接目标不存在: {target!r} -> {repo_path}")


def readme_stats_html(stats: dict[str, int]) -> str:
    return (
        f'<span><strong>{stats["rows"]}</strong> 条论文索引</span>'
        f'<span><strong>{stats["notes"]}</strong> 篇已读笔记</span>'
        f'<span><strong>{stats["pending"]}</strong> 条待读</span>'
    )


def warn_contribution(message: str) -> None:
    print(f"WARNING: 贡献热力图未生成：{message}", file=sys.stderr)


def collect_commit_days() -> dict[date, int] | None:
    """Count commits per UTC+8 day for the current branch.

    Returns None when git history is unavailable or shallow; the home page then
    omits the panel instead of showing a misleading graph.
    """
    if not (ROOT / ".git").exists():
        warn_contribution("仓库没有 .git，无法读取提交历史")
        return None
    try:
        shallow = subprocess.run(
            ["git", "-C", str(ROOT), "rev-parse", "--is-shallow-repository"],
            capture_output=True,
            text=True,
            check=False,
        )
        if shallow.returncode == 0 and shallow.stdout.strip() == "true":
            warn_contribution("浅克隆只有最近提交；请用 fetch-depth: 0 完整克隆")
            return None
        log = subprocess.run(
            ["git", "-C", str(ROOT), "log", "--pretty=format:%aI"],
            capture_output=True,
            text=True,
            check=False,
        )
        if log.returncode != 0:
            message = log.stderr.strip() or "未知错误"
            warn_contribution(f"git log 失败：{message}")
            return None
    except OSError as exc:
        warn_contribution(f"无法运行 git：{exc}")
        return None

    counts: dict[date, int] = {}
    for line in log.stdout.splitlines():
        raw = line.strip()
        if not raw:
            continue
        try:
            stamp = datetime.fromisoformat(raw)
        except ValueError:
            continue
        if stamp.tzinfo is None:
            stamp = stamp.replace(tzinfo=timezone.utc)
        day = stamp.astimezone(CONTRIB_TZ).date()
        counts[day] = counts.get(day, 0) + 1
    return counts


def heat_level(count: int) -> int:
    if count <= 0:
        return 0
    if count == 1:
        return 1
    if count <= 3:
        return 2
    if count <= 6:
        return 3
    return 4


def heat_month_labels(weeks: list[list[HeatCell]]) -> list[tuple[int, int, str]]:
    starts: list[tuple[int, str]] = []
    last_month = None
    last_col = -99
    for col, week in enumerate(weeks):
        first = next((cell.day for cell in week if cell.day is not None), None)
        if first is None or first.month == last_month:
            continue
        # Keep at least three columns between labels so month names never collide.
        if last_month is None or col - last_col >= 3:
            starts.append((col, f"{first.month}月"))
            last_month = first.month
            last_col = col
    labels: list[tuple[int, int, str]] = []
    for index, (col, label) in enumerate(starts):
        end = starts[index + 1][0] if index + 1 < len(starts) else len(weeks)
        labels.append((col, max(1, end - col), label))
    return labels


def build_heat_range(
    key: str,
    label: str,
    start: date,
    end: date,
    today: date,
    counts: dict[date, int],
) -> HeatRange:
    # Sunday-first columns, matching GitHub's contribution graph.
    grid_start = start - timedelta(days=(start.weekday() + 1) % 7)
    grid_end = end + timedelta(days=6 - ((end.weekday() + 1) % 7))
    weeks: list[list[HeatCell]] = []
    cursor = grid_start
    while cursor <= grid_end:
        week: list[HeatCell] = []
        for offset in range(7):
            day = cursor + timedelta(days=offset)
            if day < start or day > end or day > today:
                week.append(HeatCell(None, 0, 0, out=True))
            else:
                count = counts.get(day, 0)
                week.append(HeatCell(day, count, heat_level(count)))
        weeks.append(week)
        cursor += timedelta(days=7)
    total = sum(cell.count for week in weeks for cell in week if not cell.out)
    active = sum(
        1 for week in weeks for cell in week if not cell.out and cell.count > 0
    )
    return HeatRange(key, label, weeks, heat_month_labels(weeks), total, active)


def build_heat_ranges(counts: dict[date, int], today: date) -> list[HeatRange]:
    ranges = [
        build_heat_range(
            "last-12",
            "最近 12 个月",
            today - timedelta(days=364),
            today,
            today,
            counts,
        )
    ]
    for year in sorted({day.year for day in counts}, reverse=True):
        start = date(year, 1, 1)
        if start > today:
            continue
        is_current = year == today.year
        ranges.append(
            build_heat_range(
                str(year),
                f"{year} 年（至今）" if is_current else f"{year} 年",
                start,
                today if is_current else date(year, 12, 31),
                today,
                counts,
            )
        )
    return ranges


def render_heat_view(item: HeatRange, hidden: bool) -> str:
    months = "".join(
        f'<span style="grid-column:{col + 1} / span {span}">{html.escape(label)}</span>'
        for col, span, label in item.months
    )
    weeks: list[str] = []
    for week in item.weeks:
        cells: list[str] = []
        for cell in week:
            if cell.out or cell.day is None:
                cells.append('<span class="contrib-cell is-out" aria-hidden="true"></span>')
                continue
            detail = f"{cell.count} 次提交" if cell.count else "无提交"
            title = f"{cell.day.year}年{cell.day.month}月{cell.day.day}日 · {detail}"
            cells.append(
                f'<span class="contrib-cell" data-level="{cell.level}" '
                f'data-date="{cell.day.isoformat()}" data-count="{cell.count}" '
                f'title="{html.escape(title, quote=True)}" aria-hidden="true"></span>'
            )
        weeks.append(f'<div class="contrib-week">{"".join(cells)}</div>')
    aria = f"{item.label}：共 {item.total} 次提交，{item.active_days} 天有提交"
    hidden_attr = " hidden" if hidden else ""
    return (
        f'<div class="contrib-view" data-range="{html.escape(item.key)}" '
        f'data-label="{html.escape(item.label)}" data-total="{item.total}" '
        f'data-active="{item.active_days}" role="img" '
        f'aria-label="{html.escape(aria, quote=True)}"{hidden_attr}>'
        f'<div class="contrib-months" aria-hidden="true" '
        f'style="--contrib-weeks:{len(item.weeks)}">{months}</div>'
        f'<div class="contrib-weeks">{"".join(weeks)}</div>'
        f"</div>"
    )


def render_contribution_panel() -> str:
    counts = collect_commit_days()
    if counts is None:
        return ""
    today = datetime.now(CONTRIB_TZ).date()
    ranges = build_heat_ranges(counts, today)
    primary = ranges[0]
    select = ""
    if len(ranges) > 1:
        options = "".join(
            f'<option value="{html.escape(item.key)}">{html.escape(item.label)}</option>'
            for item in ranges
        )
        select = (
            '<label class="contrib-range" data-contrib-range hidden>'
            "<span>范围</span>"
            '<select data-contrib-select autocomplete="off" aria-label="选择贡献统计范围">'
            f"{options}</select></label>"
        )
    views = "".join(
        render_heat_view(item, hidden=index > 0)
        for index, item in enumerate(ranges)
    )
    return (
        '<section class="contrib" data-contribution aria-labelledby="contrib-title">'
        '<div class="contrib-card">'
        '<div class="contrib-head">'
        '<div class="contrib-heading">'
        '<p class="contrib-eyebrow">ACTIVITY</p>'
        '<h2 class="contrib-title" id="contrib-title">提交热力图</h2>'
        '<p class="contrib-summary" aria-live="polite" aria-atomic="true">'
        f'<span data-contrib-label>{html.escape(primary.label)}</span> · 共 '
        f'<strong data-contrib-total>{primary.total}</strong> 次提交 · '
        f'<strong data-contrib-active>{primary.active_days}</strong> 天有提交'
        "</p></div>"
        f"{select}</div>"
        '<div class="contrib-body">'
        '<div class="contrib-weekdays" aria-hidden="true">'
        "<span>日</span><span>一</span><span>二</span><span>三</span>"
        "<span>四</span><span>五</span><span>六</span></div>"
        '<div class="contrib-scroll" data-contrib-scroll tabindex="0" '
        'role="region" aria-label="提交热力图，可横向滚动">'
        f"{views}</div></div>"
        '<div class="contrib-foot">'
        f'<a class="contrib-link" href="{REPO_URL}/commits/main" '
        'target="_blank" rel="noopener noreferrer">在 GitHub 查看提交历史 '
        '<span aria-hidden="true">↗</span></a>'
        '<div class="contrib-legend" aria-hidden="true">'
        "<span>少</span>"
        '<span class="contrib-cell" data-level="0"></span>'
        '<span class="contrib-cell" data-level="1"></span>'
        '<span class="contrib-cell" data-level="2"></span>'
        '<span class="contrib-cell" data-level="3"></span>'
        '<span class="contrib-cell" data-level="4"></span>'
        "<span>多</span></div></div></div></section>"
    )


def card_search_text(entry: Entry) -> str:
    return " ".join(
        [
            entry.doc_id,
            entry.title,
            entry.paper_title,
            entry.year,
            entry.unit,
            entry.excerpt,
            " ".join(entry.headings),
        ]
    ).lower()


def render_card(entry: Entry, root: str = "") -> str:
    href = html.escape(f"{root}{entry.route}")
    paper = ""
    if entry.paper_title and entry.paper_title != entry.title:
        paper = f'<p class="card-paper">{html.escape(entry.paper_title)}</p>'
    read_date = f'<span>读于 {html.escape(entry.read_date)}</span>' if entry.read_date else ""
    doc_id = f'<span class="card-id">{html.escape(entry.doc_id)}</span>' if entry.doc_id else '<span class="card-id">专题</span>'
    if entry.cover_rel:
        media = (
            f'<div class="card-media kimi-only"><img data-kimi-src="{html.escape(root + entry.cover_rel)}" '
            f'src="{KIMI_PLACEHOLDER}" alt="" loading="lazy" decoding="async"></div>'
        )
    else:
        glyph = {"paper": "文", "blog": "博", "summary": "汇"}.get(entry.kind, "记")
        media = (
            f'<div class="card-media card-media-fallback kimi-only" data-kind="{entry.kind}" '
            f'aria-hidden="true"><span>{glyph}</span></div>'
        )
    return f"""<article class="card" data-kind="{entry.kind}" data-title="{html.escape(entry.title)}" data-year="{html.escape(entry.year)}" data-read-date="{html.escape(entry.read_date)}" data-search="{html.escape(card_search_text(entry))}">
  <a class="card-link" href="{href}">
    {media}
    <div class="card-top">{doc_id}<span class="card-kind">{entry.kind_label}</span></div>
    <h3>{html.escape(entry.title)}</h3>
    {paper}
    <p class="card-excerpt">{html.escape(entry.excerpt)}</p>
    <div class="card-meta"><span>{html.escape(entry.year)}</span><span>{html.escape(entry.unit)}</span>{read_date}<span>约 {entry.reading_minutes} 分钟</span></div>
    <span class="card-arrow" aria-hidden="true">→</span>
  </a>
</article>"""


def render_featured(summaries: list[Entry]) -> str:
    cards: list[str] = []
    for summary in summaries:
        pdf = ""
        if summary.pdf_rel:
            pdf = f'<a class="button button-ghost" href="{html.escape(summary.pdf_rel)}" target="_blank" rel="noopener">PDF</a>'
        cover = summary.cover_rel or "assets/hero-kimi-1600.webp"
        cards.append(
            f"""<article class="featured-card" data-kind="summary" data-title="{html.escape(summary.title)}" data-year="" data-read-date="" data-search="{html.escape(card_search_text(summary))}">
  <div class="featured-media kimi-only" aria-hidden="true"><img data-kimi-src="{html.escape(cover)}" src="{KIMI_PLACEHOLDER}" alt="" loading="lazy" decoding="async"></div>
  <div class="featured-main">
    <div class="card-top"><span class="card-id">专题</span><span class="card-kind">主题汇总</span><span class="featured-count">跨篇方法汇总</span></div>
    <h2><a href="{html.escape(summary.route)}">{html.escape(summary.title)}</a></h2>
    <p>{html.escape(summary.excerpt)}</p>
    <div class="card-meta"><span>{html.escape(summary.unit)}</span><span>约 {summary.reading_minutes} 分钟</span></div>
  </div>
  <div class="featured-actions">
    {pdf}
    <a class="button" href="{html.escape(summary.route)}">阅读汇总 <span aria-hidden="true">→</span></a>
  </div>
</article>"""
        )
    return "\n".join(cards)


def doc_meta_html(entry: Entry) -> str:
    bits: list[str] = []
    if entry.doc_id:
        bits.append(f"<span>{html.escape(entry.doc_id)}</span>")
    if entry.year:
        bits.append(f"<span>{html.escape(entry.year)}</span>")
    if entry.unit:
        bits.append(f"<span>{html.escape(entry.unit)}</span>")
    if entry.read_date:
        bits.append(f"<span>读于 {html.escape(entry.read_date)}</span>")
    bits.append(f"<span>约 {entry.reading_minutes} 分钟</span>")
    if entry.image_count:
        bits.append(f"<span>{entry.image_count} 张配图</span>")
    return "".join(bits)


def subtitle_html(entry: Entry) -> str:
    if entry.paper_title and entry.paper_title != entry.title:
        return f'<p class="doc-paper-title">{html.escape(entry.paper_title)}</p>'
    return ""


def nav_links(entry: Entry) -> tuple[str, str]:
    prev_html = ""
    next_html = ""
    if entry.prev_route:
        prev_html = f'<a class="page-nav prev" href="{html.escape(entry.root + entry.prev_route)}"><span>上一篇</span><strong>{html.escape(entry.prev_title)}</strong></a>'
    if entry.next_route:
        next_html = f'<a class="page-nav next" href="{html.escape(entry.root + entry.next_route)}"><span>下一篇</span><strong>{html.escape(entry.next_title)}</strong></a>'
    return prev_html, next_html


def pdf_button(entry: Entry) -> str:
    if not entry.pdf_rel:
        return ""
    return f'<a class="nav-action pdf-action" href="./{html.escape(Path(entry.pdf_rel).name)}" target="_blank" rel="noopener">PDF</a>'


def json_for_script(value: object) -> str:
    raw = json.dumps(value, ensure_ascii=False, separators=(",", ":"))
    return raw.replace("<", "\\u003c").replace(">", "\\u003e").replace("&", "\\u0026")


def fill_template(template: str, mapping: dict[str, str]) -> str:
    output = template
    for key, value in mapping.items():
        output = output.replace("{{" + key + "}}", str(value))
    leftover = re.search(r"\{\{[A-Z0-9_]+\}\}", output)
    if leftover:
        raise BuildError(f"模板占位符未替换: {leftover.group(0)}")
    return output


def copy_file(source: Path, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, destination)


def build_site(out_dir: Path) -> None:
    entries, summaries, routes, stats = discover_entries()
    site_css = SITE / "assets" / "site.css"
    site_js = SITE / "assets" / "site.js"
    if not site_css.exists() or not site_js.exists():
        raise BuildError("site/assets/site.css 或 site.js 不存在")
    asset_digest = hashlib.sha256()
    for asset in sorted((SITE / "assets").iterdir()):
        if asset.is_file() and asset.suffix in {".css", ".js"}:
            asset_digest.update(asset.name.encode("utf-8"))
            asset_digest.update(asset.read_bytes())
    asset_version = asset_digest.hexdigest()[:10]
    # Vendor bundles are large (mermaid 2.7 MB); version them by their own
    # content so a site.css/site.js edit does not invalidate their cache.
    vendor_digest = hashlib.sha256()
    for path in sorted((SITE / "vendor").rglob("*")):
        if path.is_file():
            vendor_digest.update(path.relative_to(SITE / "vendor").as_posix().encode())
            vendor_digest.update(path.read_bytes())
    vendor_version = vendor_digest.hexdigest()[:10]

    home_template = (SITE / "templates" / "home.html").read_text(encoding="utf-8")
    doc_template = (SITE / "templates" / "doc.html").read_text(encoding="utf-8")

    notes = [entry for entry in entries if not entry.is_summary]
    cards = "\n".join(render_card(entry) for entry in notes)
    legacy_map = {entry.source_path: entry.route for entry in entries}
    for entry in entries:
        if entry.is_summary:
            legacy_map[Path(entry.source_path).name] = entry.route
    filter_counts = {
        "all": len(entries),
        "paper": sum(1 for e in entries if e.kind == "paper"),
        "blog": sum(1 for e in entries if e.kind == "blog"),
        "summary": sum(1 for e in entries if e.kind == "summary"),
    }
    home_html = fill_template(
        home_template,
        {
            "PAGE_TITLE": html.escape(f"{SITE_TITLE} · 论文阅读笔记"),
            "PAGE_DESCRIPTION": html.escape(SITE_DESCRIPTION),
            "ROOT": "./",
            "ASSET_VERSION": asset_version,
            "VENDOR_VERSION": vendor_version,
            "REPO_URL": REPO_URL,
            "STATS_HTML": readme_stats_html(stats),
            "CONTRIB_HTML": render_contribution_panel(),
            "FEATURED_HTML": render_featured(summaries),
            "CARDS_HTML": cards,
            "FILTER_COUNTS_JSON": json_for_script(filter_counts),
            "LEGACY_MAP_JSON": json_for_script(legacy_map),
            "COUNT_ALL": str(filter_counts["all"]),
            "COUNT_PAPER": str(filter_counts["paper"]),
            "COUNT_BLOG": str(filter_counts["blog"]),
            "COUNT_SUMMARY": str(filter_counts["summary"]),
        },
    )

    doc_pages: dict[str, str] = {}
    for entry in entries:
        prev_html, next_html = nav_links(entry)
        source_url = f"{REPO_URL}/blob/main/{entry.source_path}"
        original_link = ""
        if entry.original_url:
            original_link = f'<a class="doc-link" href="{html.escape(entry.original_url)}" target="_blank" rel="noopener">原文 ↗</a>'
        source_link = f'<a class="doc-link" href="{html.escape(source_url)}" target="_blank" rel="noopener">GitHub 源 ↗</a>'
        if entry.cover_rel:
            cover_image = posixpath.relpath(
                entry.cover_rel, posixpath.dirname(entry.source_path)
            )
        else:
            cover_image = entry.root + "assets/hero-kimi-1600.webp"
        route_map = {item.source_path: item.route for item in entries}
        doc_data = {
            "source": entry.source_path,
            "sourceHash": entry.source_hash,
            "mdUrl": f"./{Path(entry.source_path).name}?v={entry.source_hash}",
            "root": entry.root,
            "repo": REPO_URL,
            "kind": entry.kind,
            "title": entry.title,
            "pdfUrl": f"./{Path(entry.pdf_rel).name}" if entry.pdf_rel else "",
            "readDate": entry.read_date,
            "routes": route_map,
            "pdfFiles": {
                key: value.pdf_rel
                for value in routes.values()
                if value.pdf_rel
                for key in (
                    f"docs/{Path(value.source_path).stem}.pdf",
                    value.pdf_rel,
                )
            },
            "assetVersion": asset_version,
            "vendorVersion": vendor_version,
            "expectedMath": entry.math_count,
            "expectedMermaid": entry.mermaid_count,
        }
        doc_html = fill_template(
            doc_template,
            {
                "PAGE_TITLE": html.escape(f"{entry.title} · {SITE_TITLE}"),
                "PAGE_DESCRIPTION": html.escape(entry.excerpt or SITE_DESCRIPTION),
                "ROOT": entry.root,
                "ASSET_VERSION": asset_version,
                "VENDOR_VERSION": vendor_version,
                "REPO_URL": REPO_URL,
                "KIND": entry.kind,
                "KIND_LABEL": entry.kind_label,
                "DOC_ID": html.escape(entry.doc_id),
                "DOC_YEAR": html.escape(entry.year),
                "DOC_UNIT": html.escape(entry.unit),
                "READ_DATE": html.escape(entry.read_date),
                "READING_MINUTES": str(entry.reading_minutes),
                "TITLE": html.escape(entry.title),
                "SUBTITLE_HTML": subtitle_html(entry),
                "META_HTML": doc_meta_html(entry),
                "ORIGINAL_LINK": original_link,
                "SOURCE_LINK": source_link,
                "COVER_IMAGE": html.escape(cover_image),
                "COVER_CLASS": " is-custom" if entry.cover_rel else "",
                "SOURCE_PATH": html.escape(entry.source_path),
                "SOURCE_HASH": entry.source_hash,
                "MD_URL": f"./{html.escape(Path(entry.source_path).name)}?v={entry.source_hash}",
                "PDF_BUTTON": pdf_button(entry),
                "EXPECTED_MATH": str(entry.math_count),
                "EXPECTED_MERMAID": str(entry.mermaid_count),
                "PREV_HTML": prev_html,
                "NEXT_HTML": next_html,
                "DOC_JSON": json_for_script(doc_data),
                "SOURCE_URL": html.escape(source_url),
            },
        )
        if entry.route in doc_pages:
            raise BuildError(f"重复页面路由: {entry.route}")
        doc_pages[entry.route] = doc_html

    out_parent = out_dir.parent
    out_parent.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix=f".{out_dir.name}-build-", dir=out_parent))
    try:
        (tmp / "index.html").write_text(home_html, encoding="utf-8")
        (tmp / ".nojekyll").write_text("", encoding="utf-8")
        (tmp / "404.html").write_text(
            "<!doctype html><meta charset=\"utf-8\"><title>页面不存在</title>"
            f"<p>页面不存在。<a href=\"{REPO_URL}\">返回仓库</a> 或 "
            f"<a href=\"https://yanfeng98.github.io/paper-reading-notes/\">返回笔记库</a>。</p>",
            encoding="utf-8",
        )

        for entry in entries:
            page_dir = tmp / entry.route
            page_dir.mkdir(parents=True, exist_ok=True)
            (page_dir / "index.html").write_text(doc_pages[entry.route], encoding="utf-8")
            source = ROOT / entry.source_path
            copy_file(source, page_dir / source.name)
            if entry.kind != "summary":
                assets_dir = source.parent / "assets"
                if assets_dir.exists():
                    shutil.copytree(assets_dir, page_dir / "assets", dirs_exist_ok=True)
            if entry.pdf_rel:
                pdf_source = (ROOT / entry.source_path).with_suffix(".pdf")
                if pdf_source.exists():
                    copy_file(pdf_source, tmp / entry.pdf_rel)
                    if entry.kind == "summary":
                        copy_file(pdf_source, tmp / Path(entry.pdf_rel).name)

        assets_out = tmp / "assets"
        assets_out.mkdir(parents=True, exist_ok=True)
        for asset in sorted((SITE / "assets").iterdir()):
            if asset.is_file():
                copy_file(asset, assets_out / asset.name)
        shutil.copytree(SITE / "vendor", assets_out / "vendor", dirs_exist_ok=True)

        manifest = {
            "repo": REPO_URL,
            "assetVersion": asset_version,
            "docs": [
                {
                    "source": entry.source_path,
                    "route": entry.route,
                    "kind": entry.kind,
                    "title": entry.title,
                    "paperTitle": entry.paper_title,
                    "id": entry.doc_id,
                    "year": entry.year,
                    "unit": entry.unit,
                    "readDate": entry.read_date,
                    "readingMinutes": entry.reading_minutes,
                    "excerpt": entry.excerpt,
                    "headings": entry.headings,
                    "math": entry.math_count,
                    "mermaid": entry.mermaid_count,
                    "images": entry.image_count,
                    "pdf": entry.pdf_rel,
                }
                for entry in entries
            ],
        }
        (tmp / "manifest.json").write_text(
            json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )

        if out_dir.exists():
            shutil.rmtree(out_dir)
        tmp.replace(out_dir)
    except BaseException:
        shutil.rmtree(tmp, ignore_errors=True)
        raise

    print(
        f"Built {out_dir}: {len(entries)} documents "
        f"({filter_counts['paper']} papers, {filter_counts['blog']} blog, "
        f"{filter_counts['summary']} summaries); {stats['rows']} README rows "
        f"({stats['notes']} read, {stats['pending']} pending); "
        f"{sum(e.math_count for e in notes)} note math + "
        f"{sum(e.math_count for e in summaries)} summary math; "
        f"{sum(e.mermaid_count for e in notes)} note Mermaid + "
        f"{sum(e.mermaid_count for e in summaries)} summary Mermaid."
    )
    for entry in entries:
        print(f"  {entry.route}  {entry.title}")
    for summary in summaries:
        if not summary.pdf_rel:
            continue
        pdf = (ROOT / summary.source_path).with_suffix(".pdf")
        newest = max(
            (ROOT / summary.source_path).stat().st_mtime,
            site_css.stat().st_mtime,
            site_js.stat().st_mtime,
        )
        if pdf.exists() and pdf.stat().st_mtime < newest:
            print(
                f"WARNING: {summary.pdf_rel} 比汇总 Markdown/站点样式旧；"
                "请重新生成 PDF（见 render_pdf.mjs）。",
                file=sys.stderr,
            )


def safe_output(value: str) -> Path:
    out = Path(value).expanduser().resolve()
    if out == ROOT:
        raise BuildError("拒绝把仓库根作为输出目录")
    if ROOT.is_relative_to(out):
        raise BuildError("拒绝把仓库根的祖先作为输出目录")
    for protected in (SITE, NOTES, DOCS, ROOT / "papers", ROOT / "books", ROOT / "skills"):
        if out == protected or out.is_relative_to(protected):
            raise BuildError(f"拒绝把源目录或源目录内部作为输出: {out}")
    return out


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", default=str(DEFAULT_OUT), help="输出目录（默认 _site）")
    args = parser.parse_args(argv[1:])
    try:
        out = safe_output(args.out)
        build_site(out)
    except BuildError as exc:
        print(f"BUILD FAILED: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
