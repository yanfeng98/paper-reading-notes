# site

本目录是 GitHub Pages 的站点源码；构建产物写到仓库根的 `_site/`（已 gitignore，不提交）。

```bash
python3 site/build.py --out _site
python3 -m http.server 8000 --directory _site
```

## 结构

- `build.py`：仅 Python 标准库。解析 `README.md` 的 5 列表格，发现 `notes/papers/*/note.md`、`notes/blogs/*/note.md` 与 `docs/*.md`，生成资料库首页、阅读页、manifest、复制笔记图片与汇总 PDF；首页贡献热力图由 `git log` 生成，按 UTC+8 归日统计每天提交数。
- `templates/home.html`：资料库首页（贡献热力图、卡片、筛选、搜索、排序、三态主题、双皮肤切换）。
- `templates/doc.html`：独立阅读页（Markdown、MathJax、Mermaid、TOC、进度、图片/图表 lightbox 与图表缩放、双皮肤切换）。
- `assets/site.css`、`assets/site.js`：经典皮肤样式与两套皮肤共用的交互；不依赖 CDN。
- `assets/skin-kimi.css`：Kimi 皮肤，全部规则包在 `html[data-skin="kimi"]` 下，不影响经典皮肤。
- `assets/fonts.css`：自托管字体声明（Lora + Noto Serif SC 分片 + Ma Shan Zheng 分片，后者只用于控件 K 图标）。
- `assets/hero-kimi-*.webp/.jpg`：Kimi 首屏与阅读页封面的云海图（由 `tools/hero-source.jpg` 生成）。
- `site/tools/prepare_hero.py`：从 `site/tools/hero-source.jpg` 生成 hero 的离线脚本（需要 Pillow，不是构建依赖）。
- `vendor/`：marked / MathJax / Mermaid / 字体与许可证，构建时复制到 `_site/assets/vendor/`。

## 双皮肤

- `<html data-skin="classic|kimi">` 控制皮肤；`localStorage.prn-skin` 持久化，`?skin=kimi` / `?skin=classic` 可直接分享。默认 `kimi`，顶栏「经典风格 / Kimi 风格」按钮与 `Shift+K` 切换。
- 经典皮肤样式在 `site.css`；Kimi 皮肤只在 `skin-kimi.css` 里覆盖，HTML 中所有 Kimi 专用节点带 `.kimi-only`，经典皮肤下隐藏。
- 主题仍由 `data-theme` 控制（自动/浅色/深色）。Kimi 皮肤默认走浅色文章页（跟随系统），点「深色」可切到深色变体；首屏图片始终是深色电影感。
- 首页 Kimi 皮肤有一段 3.2s 的「读」笔顺写字 intro，写完后字标保留；鼠标在 hero 内移动会出现一个跟随鼠标的圆形 AI 代码洞（覆盖云、标题或字标）。hero 云层由 5 条云 track 持续漂移；右下角 `Hero appearance` 面板可调 Cloud / Speed / Ink / Coverage，设置存 `localStorage.prn-hero-settings`。
- 阅读页封面优先取笔记 `assets/` 下的第一张图，没有图时用 `hero-kimi-1600`；封面图会被压暗/模糊以保证标题可读。
- 字体从 `site/vendor/fonts/` 本地加载：Lora（拉丁）、Noto Serif SC（按 `unicode-range` 分片）与 Ma Shan Zheng（控件 K 图标）。新增或替换字体时同时更新 `assets/fonts.css` 与 OFL 许可证。
- 首页「读」字标不是字体渲染，而是内联 SVG：笔画路径/笔顺来自 `hanzi-writer-data`（Arphic Public License，许可证在 `vendor/licenses/hanzi-writer-data-ARPHICPL.txt`），按 stroke mask 逐笔写出，再加轻微 ink 滤镜。
- hero 由 `site/tools/prepare_hero.py` 从 `site/tools/hero-source.jpg`（用户 AI 生成的云海图）裁切并轻微调色，导出 1600/2400 的 WebP/JPEG，并裁出 `cloud-sprite-1..4.webp` 供 hero 云层漂移。

## 约定

- 笔记和汇总正文仍由 marked 在浏览器渲染；`data-expected-math` / `data-expected-mermaid` 由构建注入，页面和 PDF 脚本会核对渲染数量。
- 首页贡献热力图是构建时快照，每次推送 `main` 和每日定时构建时刷新：`git log` 按 UTC+8 归日，默认最近 12 个月，年份下拉只列有提交的自然年（当前年份截至今天，标签为「YYYY 年（至今）」）；浅克隆/无 `.git` 时隐藏并警告。GitHub Actions 的 checkout 使用 `fetch-depth: 0`，本地构建需要完整历史。
- 新笔记必须回写 README；构建会做 README 双向映射、图片和本地链接校验。新汇总放到 `docs/<slug>.md`，多篇汇总都会作为首页 featured 卡片；同名 PDF 会被复制到 `/docs/<slug>/<slug>.pdf`。
- 页面路由保留源文件深度：`/notes/papers/<slug>/`、`/notes/blogs/<slug>/`、`/docs/<slug>/`。笔记图片按原 `assets/` 目录复制，不能扁平化。
- 构建只写本地 `_site`；要上线必须 commit/push，由 Actions 构建部署。
- 旧 `docs/index.html`、`docs/assets` 已迁移/退役；`docs/` 只保留汇总 Markdown 与 PDF。旧 `?doc=rsi-methods.md` 由首页重定向，根级 `_site/rsi-methods.pdf` 作为旧 PDF 链接别名。
- GitHub Pages 只使用 Actions：`Settings → Pages → Source = GitHub Actions`；workflow 构建并上传 `_site`。分支部署 `main /docs` 已退役。
- PDF 由本地生成并提交；命令见 `skills/summarize-paper-methods/SKILL.md` 的〈渲染与发布〉。
