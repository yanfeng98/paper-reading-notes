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
- `assets/fonts.css`：自托管字体声明（Lora + Noto Serif SC 分片 + Ma Shan Zheng 分片，后者用于 hero「读」字标与控件 K 图标）。
- `assets/hero-kimi-*.webp/.jpg`：Kimi 首屏与阅读页封面的云海图（由 `tools/hero-source.jpg` 生成，保持原图 4:3，由 CSS `object-fit: cover` 裁切）。源照片来自 Kimi K3.1 Pro 文章页（<https://www.kimi.ai/blog/kimi-k3-1-pro>），仅作版式参考，版权归原作者；页脚与 `CLAUDE.md` 已标注来源，公开部署前需确认授权。
- `site/tools/prepare_hero.py`：从 `site/tools/hero-source.jpg` 生成 hero 的离线脚本（需要 Pillow，不是构建依赖）；源图即原版 K3.1 hero 的云海照片，脚本只做轻度锐化，并用多倍频噪声生成纯白云朵 sprite，避免把山脊裁进云层。
- `vendor/`：marked / MathJax / Mermaid / 字体与许可证，构建时复制到 `_site/assets/vendor/`。

## 双皮肤

- `<html data-skin="classic|kimi">` 控制皮肤；`localStorage.prn-skin` 持久化，`?skin=kimi` / `?skin=classic` 可直接分享。默认 `kimi`，顶栏「经典风格 / Kimi 风格」按钮与 `Shift+K` 切换。
- 经典皮肤样式在 `site.css`；Kimi 皮肤只在 `skin-kimi.css` 里覆盖，HTML 中所有 Kimi 专用节点带 `.kimi-only`，经典皮肤下隐藏。
- 主题仍由 `data-theme` 控制（自动/浅色/深色）。Kimi 皮肤的文章页跟随系统主题（auto），可切换浅色/深色；首屏图片始终是深色电影感。
- 首页 Kimi 皮肤按原版 K3.1 文章页的 hero 生命周期组织：首屏只放「读」字标、`PAPER READING NOTES` 副标和 `Scroll to explore`，站点标题/说明移到首屏下方的文章式抬头（38px / 16px 24px 行高，对齐原版 800px 正文列）；3.2s 按笔顺写完后字标保留（intro 由 SVG 笔画完成；指针进入字标后交叉淡入 composite 中的同一字形，交互结束再淡回 SVG）。云、字标与代码带由 `hero-cloud.js` 的同一个 WebGL2 composite 输出：体积云 pass 用 MRT 同时输出后排云和前景云，composite 先按原版 `composeGlyphs` 画代码、再按 `composeTitle` 画字标。鼠标在 hero 内移动会按原版 ribbon 算法生成横向代码条（每条以指针为头、向左拖出 18–38 个字符，约 5 秒淡出、70px/s，指针每移动约 1.8×字格才以约 51% 概率生成一条，不做垂直扩散）；代码颜色由底层场景亮度决定，在 `#41be39` 与近白色之间插值。指针压到「读」字时，32×32 波动位移场做局部液体位移，16 段墨洗笔迹生成约 0.65 秒的擦除遮罩；不再有整体风摆/旋转。WebGL2 不可用时退回 CSS 径向遮罩擦除（无位移），reduced-motion 只保留静态字标。hero 底色为原版 `#1b2530`，云层首帧成功绘制后才加 `hero-cloud-ready`（照片保留在云层下方），避免首屏灰屏/闪烁；右下角 4 个玻璃控件悬停展开为 Cloud / Speed / Ink / Coverage 滑杆（默认 65% / 3.0× / 90% / 100%，运行时可调），设置存 `localStorage.prn-hero-settings`。
- 资源按皮肤按需加载：hero 图与 `hero-cloud.js` 的 WebGL composite（云、字标、代码带）只在 Kimi 皮肤初始化；经典皮肤仍加载 `skin-kimi.css` 以便随时切换，但不下载 hero 照片、不预载 Ma Shan Zheng，也不创建这些 WebGL context。Hero 的 WebP 由 `<head>` 里的内联脚本在 Kimi 分支提前 preload，`hero-cloud.js` 等 `<img>` 真正加载后再取它的 `currentSrc` 建纹理，避免同一张图先拉 JPEG 再拉 WebP。
- 首页卡片缩略图取笔记 `assets/` 下的第一张图，但只有滚动到距视口 600px 内才赋 `src`；不能直接给所有 `data-kimi-src` 赋地址，否则 `loading="lazy"` 会被绕过、手机首屏会一次拉完所有封面。
- 打印前 `beforeprint` 会展开 scroll-reveal 并把 `data-kimi-defer` 图片全部赋值；`@media print` 里也强制 `.kimi-reveal` 可见，避免打印出空白卡片。
- 阅读页采用原版文章页结构：整屏封面只放居中的 `Paper Reading Notes` 字标，标题与元信息在封面下方的文章区（32px 标题、800px 正文列、16px/24px 正文、1040px 图片、左侧 section 导航）；整屏封面只认笔记显式提供的 `assets/cover.*` / `assets/hero.*`（或 `cover-*` / `hero-*` 前缀），没有就回退 `hero-kimi-1600`。不要用「第一张图」当整屏封面：多数笔记第一张是白底图表，压暗后只剩近黑一片。卡片缩略图仍可用第一张图。
- 字体从 `site/vendor/fonts/` 本地加载：Lora（拉丁）、Noto Serif SC（按 `unicode-range` 分片）与 Ma Shan Zheng（hero「读」字标、控件 K 图标）。新增或替换字体时同时更新 `assets/fonts.css` 与 OFL 许可证。
- 首页「读」字标是用 Ma Shan Zheng 的 brush 字形填充，再套用 `hanzi-writer-data` 的笔顺 mask（Arphic Public License，许可证在 `vendor/licenses/hanzi-writer-data-ARPHICPL.txt`）逐笔写出；不再是纯 Kai 笔画轮廓。
- hero 由 `site/tools/prepare_hero.py` 从 `site/tools/hero-source.jpg`（原版 K3.1 hero 的云海照片）生成，导出 1600/2400 的 WebP/JPEG（保留 4:3），并用多倍频噪声生成 `cloud-sprite-1..4.webp` 供 hero 云层漂移。

## 约定

- 笔记和汇总正文仍由 marked 在浏览器渲染；`data-expected-math` / `data-expected-mermaid` 由构建注入，页面和 PDF 脚本会核对渲染数量。
- 首页贡献热力图是构建时快照，每次推送 `main` 和每日定时构建时刷新：`git log` 按 UTC+8 归日，默认最近 12 个月，年份下拉只列有提交的自然年（当前年份截至今天，标签为「YYYY 年（至今）」）；浅克隆/无 `.git` 时隐藏并警告。GitHub Actions 的 checkout 使用 `fetch-depth: 0`，本地构建需要完整历史。
- 新笔记必须回写 README；构建会做 README 双向映射、图片和本地链接校验。新汇总放到 `docs/<slug>.md`，多篇汇总都会作为首页 featured 卡片；同名 PDF 会被复制到 `/docs/<slug>/<slug>.pdf`。
- `docs/*.pdf` 是阅读页渲染出来的离线产物（Chromium/Skia），重新生成会写入新的 creationDate 和版式细节；只在汇总内容或阅读页版面确实变化时重生成，并放进 `docs:` 提交，不要混进纯站点改动，否则 review 里会出现无法阅读的 MB 级二进制 diff。
- 页面路由保留源文件深度：`/notes/papers/<slug>/`、`/notes/blogs/<slug>/`、`/docs/<slug>/`。笔记图片按原 `assets/` 目录复制，不能扁平化。
- 构建只写本地 `_site`；要上线必须 commit/push，由 Actions 构建部署。
- 旧 `docs/index.html`、`docs/assets` 已迁移/退役；`docs/` 只保留汇总 Markdown 与 PDF。旧 `?doc=rsi-methods.md` 由首页重定向，根级 `_site/rsi-methods.pdf` 作为旧 PDF 链接别名。
- GitHub Pages 只使用 Actions：`Settings → Pages → Source = GitHub Actions`；workflow 构建并上传 `_site`。分支部署 `main /docs` 已退役。
- PDF 由本地生成并提交；命令见 `skills/summarize-paper-methods/SKILL.md` 的〈渲染与发布〉。
