# site

本目录是 GitHub Pages 的站点源码；构建产物写到仓库根的 `_site/`（已 gitignore，不提交）。

```bash
python3 site/build.py --out _site
python3 -m http.server 8000 --directory _site
```

## 结构

- `build.py`：仅 Python 标准库。解析 `README.md` 的 5 列表格，发现 `notes/papers/*/note.md`、`notes/blogs/*/note.md` 与 `docs/*.md`，生成资料库首页、阅读页、manifest、复制笔记图片与汇总 PDF；首页贡献热力图由 `git log` 生成，按 UTC+8 归日统计每天提交数。
- `templates/home.html`：资料库首页（贡献热力图、卡片分页、筛选、搜索、排序、三态主题、双皮肤切换）。
- `templates/doc.html`：独立阅读页（Markdown、MathJax、Mermaid、TOC、进度、图片/图表 lightbox 与图表缩放、双皮肤切换）。
- `assets/site.css`、`assets/site.js`：经典皮肤样式与两套皮肤共用的交互；不依赖 CDN。
- `assets/skin-kimi.css`：Kimi 皮肤，全部规则包在 `html[data-skin="kimi"]` 下，不影响经典皮肤。
- `assets/fonts.css`：自托管字体声明（Lora + Noto Serif SC 分片 + Ma Shan Zheng 分片 + Sentient，后两者分别用于 hero「读」字标/控件 K 图标与副标）。
- `assets/hero-kimi-*.webp/.jpg`：Kimi 首屏与阅读页封面的云海图（`hero-kimi-*` 由 `tools/hero-source.jpg` 生成，保持原图 4:3；`hero-kimi-yunhai-*` 由 `tools/yunhai-source.jpg` 生成，保持 16:9，均由 CSS `object-fit: cover` 裁切）。首张源照片来自 Kimi K3.1 Pro 文章页（<https://www.kimi.ai/blog/kimi-k3-1-pro>），仅作版式参考，版权归原作者，公开部署前需确认授权；第二张是站点作者提供的云海照片，参与首页 hero 轮换。
- `site/tools/prepare_hero.py`：从 `site/tools/hero-source.jpg` 与 `site/tools/yunhai-source.jpg` 生成 hero 的离线脚本（需要 Pillow，不是构建依赖）；脚本只做轻度锐化，并用多倍频噪声生成纯白云朵 sprite，避免把山脊裁进云层。
- `vendor/`：marked / MathJax / Mermaid / 字体与许可证，构建时复制到 `_site/assets/vendor/`。

## 双皮肤

- `<html data-skin="classic|kimi">` 控制皮肤；`localStorage.prn-skin` 持久化，`?skin=kimi` / `?skin=classic` 可直接分享。默认 `kimi`，顶栏「经典风格 / Kimi 风格」按钮与 `Shift+K` 切换。
- 经典皮肤样式在 `site.css`；Kimi 皮肤只在 `skin-kimi.css` 里覆盖，HTML 中所有 Kimi 专用节点带 `.kimi-only`，经典皮肤下隐藏。
- 主题仍由 `data-theme` 控制（自动/浅色/深色）。Kimi 皮肤的文章页跟随系统主题（auto），可切换浅色/深色；首屏图片始终是深色电影感。
- 首页 Kimi 皮肤按原版 K3.1 文章页的 hero 生命周期组织：首屏只放「读」字标、`Paper Reading Notes` 副标和 `Scroll to explore`，副标随字标等比缩放（约 0.1085×字标宽，small caps 0.833em，与原版标题图的比例一致），并采用原版标题图里的 Sentient 常规字重（字距≈0）；副标与「读」字烘进同一张 WebGL 字模纹理（rect 取两者 DOM 盒的并集加透明留白），共享同一套液态位移场和墨迹 `designReveal` 遮罩（位移场按原版 0.22×「读」字宽归一化到像素空间，并集/留白不会放大鼠标影响范围），因此指针扫过副标时也会像「读」字一样被擦除；站点标题/说明移到首屏下方的文章式抬头（38px / 16px 24px 行高，对齐原版 800px 正文列）；3.2s 按笔顺写完后字标保留（intro 用 SVG；交互时延迟到 `titleActive > 0.985` 再交叉到 WebGL 字模）。云、代码带与字模由 `hero-cloud.js` 的 WebGL2 composite 输出：体积云 pass 用 MRT 同时输出后排云和前景云，composite 画代码带和字模；字模用 `titleOpacity=0.8*settings.ink`、不叠加前景云，且在 `titleActive > 0.985` 后才隐藏 SVG、交叉到 WebGL 字模，避免同色/闪烁问题。指针在字模（「读」字与副标）上移动时，WebGL `surface` 位移场做局部液体位移；指针仍影响云层和代码带。WebGL2 不可用时另有 CSS 径向遮罩兜底。鼠标在 hero 内移动会按原版 ribbon 算法生成横向代码条（每条以指针为头、向左拖出 18–38 个字符，约 5 秒淡出、70px/s，指针每移动约 1.8×字格才以约 51% 概率生成一条，不做垂直扩散）；代码颜色由底层场景亮度决定，在 `#41be39` 与近白色之间插值。WebGL2 不可用时退回 CSS 径向遮罩擦除，reduced-motion 只保留静态字标。hero 底色为原版 `#1b2530`，云层首帧成功绘制后才加 `hero-cloud-ready`（照片保留在云层下方），避免首屏灰屏/闪烁；右下角 4 个玻璃控件悬停展开为 Cloud / Speed / Ink / Coverage 滑杆（默认 65% / 3.0× / 90% / 100%，运行时可调），设置存 `localStorage.prn-hero-settings`。
- 首页 hero→资料库的交接按原版 K3.1 的 exit pass 实现（仅 Kimi 皮肤、WebGL2 就绪后）：`main.home-stage` 加 `data-reveal-enabled`，`.home-pin` 变 sticky、hero 绝对定位、`.home-stage::after` 补 100svh；滚过 8px 时截获 wheel/touch/key，用 800ms（冷却 100ms）把过渡进度钉在起点播放，结束后再跳到终点。合成结果先写进 RGBA8 FBO，再由 exit pass 输出预乘 alpha：细行 3–9px、粗行 18–38px 整行横向错位（≤125/190px），双采样重影染 `#9DBBC7`，粗行里写代码字形，再按 5–13px 行、28–120px 宽开洞；洞里露出 `.home-reveal`（以 `--article-reveal` 做 opacity + 50svh 上浮），hero 的 scrim/inner 以 `--hero-tear` 淡出。向上回到边界会反向播放；点「Scroll to explore」或 `#library` 锚点会先播完交接再滚到目标。WebGL2 不可用、reduced-motion、经典皮肤都不加 `data-reveal-enabled`，保持普通文档流；交接时照片在 `hero-cloud-ready` 后隐藏，避免洞露出照片而不是正文。
- 资源按皮肤按需加载：hero 图与 `hero-cloud.js` 的 WebGL composite（云、代码带）只在 Kimi 皮肤初始化；经典皮肤仍加载 `skin-kimi.css` 以便随时切换，但不下载 hero 照片、不预载 Ma Shan Zheng/Sentient，也不创建这些 WebGL context。Hero 的 WebP 由 `<head>` 里的内联脚本在 Kimi 分支提前 preload，`hero-cloud.js` 等 `<img>` 真正加载后再取它的 `currentSrc` 建纹理，避免同一张图先拉 JPEG 再拉 WebP。
- 首页卡片缩略图取笔记 `assets/` 下的第一张图，但只有滚动到距视口 600px 内才赋 `src`；不能直接给所有 `data-kimi-src` 赋地址，否则 `loading="lazy"` 会被绕过、手机首屏会一次拉完所有封面。
- 首页资料库在浏览器端分页，每页 12 张笔记卡（第 1 页另含主题汇总 featured 卡）：先排序、再过滤、最后切页；主题汇总 featured 卡只出现在第 1 页；`?page=` 可分享，搜索/筛选/排序会回到第 1 页；只有一页或结果为空时分页条隐藏，无 JS 时全部卡片可见。
- 打印前 `beforeprint` 会展开 scroll-reveal 并把 `data-kimi-defer` 图片全部赋值；`@media print` 里也强制 `.kimi-reveal` 可见，避免打印出空白卡片。分页隐藏的卡片带 `data-page-hidden`，打印时重新展开（当前筛选/搜索仍然生效）。
- 阅读页采用原版文章页结构：封面（约 64svh）只放居中的 `Paper Reading Notes` 字标，标题与元信息在封面下方的文章区（40px 标题、720px 正文列、17px/1.8 正文、1040px 图片；≥1280px 显示左侧 164px section 导航时图片相应收窄（1280–1359px 880–959px，≥1360px 960px））；封面只认笔记显式提供的 `assets/cover.*` / `assets/hero.*`（或 `cover-*` / `hero-*` 前缀），没有就回退 `hero-kimi-1600`。不要用「第一张图」当整屏封面：多数笔记第一张是白底图表，压暗后只剩近黑一片。卡片缩略图仍可用第一张图。
- 阅读页章节云（Kimi 皮肤）：`assets/reader-clouds.js` 按原版 `BlogV2Motion` 实现，每个 `.prose > h2` 一朵 WebGL2 体积云，云心绑在标题中心线；标题中心进入 90% 视口时 0.8s 从左右交替飘入（宽 720–980px、透明度 0.52–0.60、旋转 ±9°），越过 65% 视口后再滚 4% 视口，2.4s 飘出并淡出。云层是 `.prose` 内 `z-index:-1` 的全幅绝对层，向上延伸 360px 让第一朵云不被正文顶部裁切（标题区 `z-index:1` 盖在云层上），不挡文字；浅色峰值不透明度 1（白云），深色用 0.52–0.60 的蓝灰云；≤700px 云宽 420px、透明度 ×0.8、漂移 ×0.6；reduced-motion 与打印隐藏。脚本只在 Kimi 皮肤 + 阅读页按需加载，切回经典皮肤时销毁全部 renderer。
- 阅读页的中文密度与原版英文博客不同：正文两端对齐，但含行内代码/长拉丁词的段落保持左对齐，避免 justified 产生的词间大洞。开头的「来源信息」表在 Kimi 皮肤下由 `site.js` 转成定义列表卡片（默认显示前 4 项，长字段折叠，「展开全部信息」展开其余项）；原表保留在 DOM 里供经典皮肤使用。手机（≤700px）的表格按行折成带列名的卡片，不再横向滚动。
- 字体从 `site/vendor/fonts/` 本地加载：Lora（拉丁）、Noto Serif SC（按 `unicode-range` 分片）、Ma Shan Zheng（hero「读」字标、控件 K 图标）与 Sentient（hero 副标，small caps）。新增或替换字体时同时更新 `assets/fonts.css` 与对应许可证（Sentient 使用 ITF Free Font License，不是 OFL）。
- 首页「读」字标使用从 `ma-shan-zheng-slice.woff2` 提取的轮廓 path（不用 `<text>`：Firefox 会把带 mask 的 `<text>` 裁到 em box，切掉字形下部的笔锋），再套用 `hanzi-writer-data` 的笔顺 mask（Arphic Public License，许可证在 `vendor/licenses/hanzi-writer-data-ARPHICPL.txt`）逐笔写出；「卖」的下半部由新增的 m10–m12 三条 mask 写出；右下角的「点」用黑色轮廓从 m0–m11 中挖掉，只由最后一条 m12 单独写出；点旁边的「撇」也用黑色区域从除 m11 外的 mask 中挖掉，只由 m11 一笔写出。最后淡入无 mask 的完整字形补上残余笔锋，保证静止状态的 SVG 字标与 WebGL 字模形状一致。
- hero 由 `site/tools/prepare_hero.py` 从 `site/tools/hero-source.jpg`（原版 K3.1 hero 的云海照片，保留 4:3）与 `site/tools/yunhai-source.jpg`（站点作者的云海照片，保留 16:9）生成，各导出 1600/2400 的 WebP/JPEG，并用多倍频噪声生成 `cloud-sprite-1..4.webp` 供 hero 云层漂移。首页 hero 每 12 秒在两张照片之间做 1.6 秒交叉淡化：WebGL 用双纹理在 composite 内溶解，CSS 两层 `<picture>` 负责无 WebGL 的兜底；第二张在首帧后延迟加载，标签页隐藏、hero 离开视口或 exit 交接播放时暂停计时，reduced-motion 只保留首张。

## 约定

- 笔记和汇总正文仍由 marked 在浏览器渲染；`data-expected-math`（`math` 围栏）/ `data-expected-inline-math`（正文 `$…$`）/ `data-expected-mermaid` 由构建注入，页面和 PDF 脚本会核对渲染数量。行内公式在 marked 解析前用私有区占位符保护，解析后还原并交给 MathJax；`$` 必须紧贴非空白字符，数字开头且无数学记号的内容按货币处理。`enhanceSourceInfo` 会把来源表复制成卡片，校验时排除 `.source-card` 里的副本，避免同一公式被计两次。
- 首页贡献热力图是构建时快照，每次推送 `main` 和每日定时构建时刷新：`git log` 按 UTC+8 归日，默认最近 12 个月，年份下拉只列有提交的自然年（当前年份截至今天，标签为「YYYY 年（至今）」）；浅克隆/无 `.git` 时隐藏并警告。GitHub Actions 的 checkout 使用 `fetch-depth: 0`，本地构建需要完整历史。两种皮肤下热力图都位于资料库之前；Kimi 皮肤用细分隔线条带呈现，经典皮肤用卡片呈现。
- 新笔记必须回写 README；构建会做 README 双向映射、图片和本地链接校验。新汇总放到 `docs/<slug>.md`，多篇汇总都会作为首页 featured 卡片；同名 PDF 会被复制到 `/docs/<slug>/<slug>.pdf`。
- `docs/*.pdf` 是阅读页渲染出来的离线产物（Chromium/Skia），重新生成会写入新的 creationDate 和版式细节；只在汇总内容或阅读页版面确实变化时重生成，并放进 `docs:` 提交，不要混进纯站点改动，否则 review 里会出现无法阅读的 MB 级二进制 diff。
- 页面路由保留源文件深度：`/notes/papers/<slug>/`、`/notes/blogs/<slug>/`、`/docs/<slug>/`。笔记图片按原 `assets/` 目录复制，不能扁平化。
- 构建只写本地 `_site`；要上线必须 commit/push，由 Actions 构建部署。
- 旧 `docs/index.html`、`docs/assets` 已迁移/退役；`docs/` 只保留汇总 Markdown 与 PDF。旧 `?doc=rsi-methods.md` 由首页重定向，根级 `_site/rsi-methods.pdf` 作为旧 PDF 链接别名。
- GitHub Pages 只使用 Actions：`Settings → Pages → Source = GitHub Actions`；workflow 构建并上传 `_site`。分支部署 `main /docs` 已退役。
- PDF 由本地生成并提交；命令见 `skills/summarize-paper-methods/SKILL.md` 的〈渲染与发布〉。
