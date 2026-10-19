# site

本目录是 GitHub Pages 的站点源码；构建产物写到仓库根的 `_site/`（已 gitignore，不提交）。

```bash
python3 site/build.py --out _site
python3 -m http.server 8000 --directory _site
```

## 结构

- `build.py`：仅 Python 标准库。解析 `README.md` 的 5 列表格，发现 `notes/papers/*/note.md`、`notes/blogs/*/note.md` 与 `docs/*.md`，生成资料库首页、阅读页、manifest、复制笔记图片与汇总 PDF。
- `templates/home.html`：资料库首页（卡片、筛选、搜索、排序、三态主题）。
- `templates/doc.html`：独立阅读页（Markdown、MathJax、Mermaid、TOC、进度、lightbox）。
- `assets/site.css`、`assets/site.js`：站点样式与交互；不依赖 CDN/web font。
- `vendor/`：marked / MathJax / Mermaid 与许可证，构建时复制到 `_site/assets/vendor/`。

## 约定

- 笔记和汇总正文仍由 marked 在浏览器渲染；`data-expected-math` / `data-expected-mermaid` 由构建注入，页面和 PDF 脚本会核对渲染数量。
- 新笔记必须回写 README；构建会做 README 双向映射、图片和本地链接校验。新汇总放到 `docs/<slug>.md`，多篇汇总都会作为首页 featured 卡片；同名 PDF 会被复制到 `/docs/<slug>/<slug>.pdf`。
- 页面路由保留源文件深度：`/notes/papers/<slug>/`、`/notes/blogs/<slug>/`、`/docs/<slug>/`。笔记图片按原 `assets/` 目录复制，不能扁平化。
- 构建只写本地 `_site`；要上线必须 commit/push，由 Actions 构建部署。
- 旧 `docs/index.html`、`docs/assets` 已迁移/退役；`docs/` 只保留汇总 Markdown 与 PDF。旧 `?doc=rsi-methods.md` 由首页重定向，根级 `_site/rsi-methods.pdf` 作为旧 PDF 链接别名。
- GitHub Pages 只使用 Actions：`Settings → Pages → Source = GitHub Actions`；workflow 构建并上传 `_site`。分支部署 `main /docs` 已退役。
- PDF 由本地生成并提交；命令见 `skills/summarize-paper-methods/SKILL.md` 的〈渲染与发布〉。
