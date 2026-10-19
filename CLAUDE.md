# paper-reading-notes

论文阅读笔记仓库：根 `README.md` 是选读清单兼唯一索引，`notes/` 是笔记产物，`docs/` 是跨篇主题汇总，`site/` 是静态站点源码与构建脚本，`papers/` 是非 arXiv 来源的原文归档。

## 目录职责

| 路径 | 职责 | 谁维护 |
| --- | --- | --- |
| `README.md` | 唯一索引：按机构分组，列为 `编号\|论文\|年份\|论文单位\|笔记地址` | 人选读与分组；agent 默认只回写单个单元格（例外见「修改边界」） |
| `notes/` | 笔记产物（首次实际阅读时创建）：`notes/papers/<...>/note.md`、`notes/blogs/<...>/note.md` | read-paper-blog（生成）、check-paper-note（复核） |
| `docs/` | 跨篇主题汇总 Markdown（如 `docs/rsi-methods.md`）及同名 PDF；阅读页与站点资源在 `site/`，不是逐篇笔记 | summarize-paper-methods（生成与复核） |
| `site/` | 静态站点源码：`build.py`、`templates/`、`assets/`、`vendor/`；构建到 `_site/` | summarize-paper-methods / site build |
| `_site/` | GitHub Pages 构建产物，`.gitignore` 忽略，不手改 | `python3 site/build.py` |
| `papers/` | 非 arXiv 来源的原文归档，命名 `<5位编号>-<短标题>.pdf` | skill 归档新论文，已有文件不改 |
| `books/` | 书籍归档，独立编号（00001 起） | 人工 |

阅读、精读、整理笔记一律按 `skills/read-paper-blog/SKILL.md` 执行，复核既有笔记按 `skills/check-paper-note/SKILL.md` 执行，跨篇方法汇总的生成与复核按 `skills/summarize-paper-methods/SKILL.md` 执行；产物路径与回写规则都以对应 SKILL.md 为准。笔记与汇总中的公式统一用 ```math 围栏（不用行内 `$…$`、单行或列表内的 `$$`）；汇总的静态站点、PDF 与 Pages 发布按 summarize-paper-methods 的〈渲染与发布〉执行，构建命令为 `python3 site/build.py --out _site`。

## 编号

- 5 位零填充，**不保证连续**（编号数与条目数不必相等：00010 未分配给任何条目）。
- 编号来自上游归档仓库 [yanfeng98/paper-is-all-you-need](https://github.com/yanfeng98/paper-is-all-you-need)——本仓库的迁移来源，全部论文的 PDF 都在那里（含清单未引用的 `00010-Qwen2.5-Coder.pdf`），另含部分论文的 LaTeX 源码；本仓库接续同一序列。
- 一个编号只对应一个条目（论文或非论文），不复用、不跳号、不改号；**分配前现查** `papers/` 文件名、README 编号列与上游归档仓库三者的最大值，不凭记忆——只看一侧会在归档文件缺失时发出重复编号，上游又不收录非论文条目、序列会与本仓库错位。
- **非论文条目**（博客导读、系统，用户明确要求时才收录）与论文共用同一编号序列，按其署名方分组（归并规则见下条「分组规则」）；它们没有可归档的 PDF，编号单元格直接指向原文在线地址（例：00192 博客指向 Awesome RSI 站点、00215 系统指向 GitHub 仓库），不写 `papers/` 路径。
- **分组规则**：按机构粒度分组（论文看第一机构，非论文条目看署名方），组名用机构名——同一机构的子团队／子实验室并入该机构分组，不单独成组（如 Noah’s Ark Lab → Huawei、LongCat Team → Meituan）。新条目能归入既有同机构分组就追加到该组末尾；只有 1 个条目的单位**不新建分组**，直接追加到「### 其他」末尾——**新建分组一律只在用户明确要求时进行**。既有分组不因条目少而撤并——撤并、改名或在分组间搬迁既有行也只在用户明确要求时执行。归并分组不改写 `论文单位` 列：该列始终写原第一机构／署名方（如 00212 归入 Google 组，该列仍写 `Google Cloud AI Research`）。
- `论文单位` 列写**第一机构**（多机构论文取首位署名单位）；非论文条目写署名方或维护方。「年份」写发表年份，非论文条目写发布年份。
- README 编号列同时是原文入口：本仓库有归档的指向 `./papers/<编号>-<短标题>.pdf`，其余论文指向上游 `blob/main/papers/<编号>-<短标题>.pdf`，非论文条目指向原文在线地址；论文按用户要求改指其他渠道（如 arXiv 官方页）时按该渠道地址写（见「PDF 策略」的多渠道条）。
- **上游尚未归档的 arXiv 论文**编号单元格暂指 arXiv 官方页；归档到上游后改指 `blob/main/papers/<编号>-<短标题>.pdf`。
- **编号以本仓库为准**：上游给新论文归档时取本仓库的下一个空号（跳过已被非论文条目占用的号），文件名与本仓库编号一致，不覆盖已占用条目的编号。

## PDF 策略

按**来源**区分，不按论文本身是否上过 arXiv（同一篇论文可能同时存在 arXiv 版和其他站点版本，**以清单当行的指向为准**）：

- **arXiv 链接或编号**：不归档 PDF，只记官方链接。
- **其他来源**（GitHub、Hugging Face、Nature、OpenReview、ScienceDirect 等）：必须归档原文 PDF 到 `papers/`，编号接续递增。非论文条目（博客、系统）没有可归档的 PDF，编号单元格指向原文在线地址（见「编号」一节）。
- **多渠道与后续改指**：同一工作可能先后出现在多个渠道（项目页、arXiv、OpenReview、期刊等），且其 arXiv 版可能是比首次收录所用版本更新的版本（实际发生过：项目页版 36 页，arXiv v1 同日同内容、v2 已实质修订为 43 页）。**以清单当行的指向为准**，不以首次收录时的来源或笔记记录为准；需改指时按「修改边界」例外 ③ 处理——换链接、不复用编号、已归档 PDF 不删不改。

## 站点

- 源码在 `site/`：`build.py`（仅 Python 标准库）、`templates/home.html`、`templates/doc.html`、`assets/site.css`、`assets/site.js`、`vendor/`（marked/MathJax/Mermaid 与许可证）。构建输出 `_site/`，已加入 `.gitignore`，不提交。
- `python3 site/build.py --out _site` 会自动发现 `notes/papers/*/note.md`、`notes/blogs/*/note.md`、`docs/*.md`；每个 `note.md` 必须有 README 对应行，构建会做双向校验、图片/链接校验和公式/Mermaid 计数校验。`docs/` 支持多篇汇总，都会作为首页 featured 卡片。
- 阅读页按源文件深度生成：`/notes/papers/<slug>/`、`/notes/blogs/<slug>/`、`/docs/<slug>/`；首页 `_site/index.html` 是资料库。汇总同名 PDF 复制到 `_site/docs/<slug>/<slug>.pdf`，并为每篇汇总保留根级 `<slug>.pdf` 兼容别名。
- 本地构建与 PDF 只写 `_site`/`docs`，**不会自动上线**；要更新网站必须 commit/push，由 Actions 构建部署。
- 旧 `docs/index.html`、`docs/assets/reader.css` 与 `docs/.nojekyll` 已删除；旧 `?doc=rsi-methods.md` 由首页 JS 重定向到 `/docs/rsi-methods/`。
- GitHub Pages **只支持 GitHub Actions**：`.github/workflows/pages.yml` 构建并上传 `_site`；分支部署 `main /docs` 已退役。首次需在 Settings → Pages 选择 GitHub Actions。
- 本地预览：`python3 -m http.server 8000 --directory _site`。PDF：先构建，再用 `skills/summarize-paper-methods/scripts/render_pdf.mjs`（`--site _site --page docs/rsi-methods/index.html --out docs/rsi-methods.pdf`），最后重新构建以复制新 PDF。
- README 的在线链接仍遵守「只加一行主题汇总」的边界；站点构建不自动改 README。

## 修改边界

- `papers/`、`books/` 里已有的文件不覆盖、不重命名。
- `README.md` 只允许回写笔记所在行的「笔记地址」单元格（规则见 `skills/read-paper-blog/SKILL.md` 的「回写根 README」）：不重排分组、不改表头、不批量重写表格、不新增行。**例外**（均须用户明确要求）：① 为某条目（如博客导读、系统）收录并分配编号——可在既有分组内追加一行，或按用户确认的机构／署名方**新建分组**（新分组与既有分组同级、插在「### 其他」之前，不重排既有分组），编号与链接按「编号」一节的规则处理；② 分组结构性改动——撤并分组、给分组改名或在分组间搬迁既有行，按「编号」一节的分组规则执行；③ 更换某条目**编号单元格的来源指向**——如非 arXiv 来源的论文随后在 arXiv 发布，或原链接失效／改版，把编号单元格改指新地址（arXiv 则指向官方页、不再写 `papers/` 路径），已归档的 PDF 按上一条保留不动，笔记的来源信息注明改指原因与本次实际阅读的版本；④ 维护主题汇总链接行——仅在用户明确要求时，在编号说明 blockquote 之后、`## 论文` 之前新增或更新**一行**主题汇总链接（同步编号集合与篇数），不重排其他行。
- `skills/` 下的 skill（read-paper-blog、check-paper-note、summarize-paper-methods）经 `~/.claude/skills/` 同名符号链接全局加载：改这里的 SKILL.md 会影响本机所有会话，改动前先确认影响范围。

## Git

- 单人仓库，直接提交 `main`，不建分支、不走 PR。
- 提交由用户发起：`./push.sh` 即 `git add -A && git commit && git push`。生成笔记后默认不自动提交，用户明确要求时再提交。
- 署名沿用 `yanfeng98 <3555028709@qq.com>`（2026-10-06 由 `LuYF-Lemon-love` 改名，历史提交保留旧署名）。
