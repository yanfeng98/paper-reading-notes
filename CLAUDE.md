# paper-reading-notes

论文阅读笔记仓库：根 `README.md` 是选读清单兼唯一索引，`notes/` 是笔记产物，`papers/` 是非 arXiv 来源的原文归档。

## 目录职责

| 路径 | 职责 | 谁维护 |
| --- | --- | --- |
| `README.md` | 唯一索引：按机构分组，列为 `编号\|论文\|年份\|论文单位\|笔记地址` | 人选读与分组，agent 只回写单个单元格 |
| `notes/` | 笔记产物（首次实际阅读时创建）：`notes/papers/<...>/note.md`、`notes/blogs/<...>/note.md` | read-paper-blog（生成）、check-paper-note（复核） |
| `papers/` | 非 arXiv 来源的原文归档，命名 `<5位编号>-<短标题>.pdf` | skill 归档新论文，已有文件不改 |
| `books/` | 书籍归档，独立编号（00001 起） | 人工 |

阅读、精读、整理笔记一律按 `skills/read-paper-blog/SKILL.md` 执行，复核既有笔记按 `skills/check-paper-note/SKILL.md` 执行；产物路径与回写规则都以对应 SKILL.md 为准。

## 编号

- 5 位零填充，**不保证连续**（编号数与条目数不必相等：00010 未分配给任何条目）。
- 编号来自上游归档仓库 [yanfeng98/paper-is-all-you-need](https://github.com/yanfeng98/paper-is-all-you-need)——本仓库的迁移来源，全部论文的 PDF 都在那里（含清单未引用的 `00010-Qwen2.5-Coder.pdf`），另含部分论文的 LaTeX 源码；本仓库接续同一序列。
- 一个编号只对应一个条目（论文或非论文），不复用、不跳号、不改号；**分配前现查** `papers/` 文件名、README 编号列与上游归档仓库三者的最大值，不凭记忆——只看一侧会在归档文件缺失时发出重复编号，上游又不收录非论文条目、序列会与本仓库错位。
- **非论文条目**（如博客导读，用户明确要求时才收录）与论文共用同一编号序列，排在「### 其他」分组；它们没有可归档的 PDF，编号单元格直接指向原文在线地址（例：00192 指向 Awesome RSI 站点的博客页），不写 `papers/` 路径。
- README 编号列同时是原文入口：本仓库有归档的指向 `./papers/<编号>-<短标题>.pdf`，其余论文指向上游 `blob/main/papers/<编号>-<短标题>.pdf`，非论文条目指向原文在线地址。
- **上游撞号时顺延**：从上游导入论文时若其分配的编号已被本仓库的非论文条目占用，取下一个空号，不覆盖已占用条目。

## PDF 策略

按**来源**区分，不按论文本身是否上过 arXiv（同一篇论文可能同时存在 arXiv 版和其他站点版本，以清单和本次阅读所用的来源为准）：

- **arXiv 链接或编号**：不归档 PDF，只记官方链接。
- **其他来源**（GitHub、Hugging Face、Nature、OpenReview、ScienceDirect 等）：必须归档原文 PDF 到 `papers/`，编号接续递增。

## 修改边界

- `papers/`、`books/` 里已有的文件不覆盖、不重命名。
- `README.md` 只允许回写笔记所在行的「笔记地址」单元格（规则见 SKILL.md 的「回写根 README」）：不重排分组、不改表头、不批量重写表格、不新增行。**唯一例外**：用户明确要求为某条目（如博客导读）收录并分配编号时，可在既有分组内追加一行，并按「编号」一节的规则处理编号与链接。
- `skills/` 下的 skill（read-paper-blog、check-paper-note）经 `~/.claude/skills/` 同名符号链接全局加载：改这里的 SKILL.md 会影响本机所有会话，改动前先确认影响范围。

## Git

- 单人仓库，直接提交 `main`，不建分支、不走 PR。
- 提交由用户发起：`./push.sh` 即 `git add -A && git commit && git push`。生成笔记后默认不自动提交，用户明确要求时再提交。
- 署名沿用 `LuYF-Lemon-love <3555028709@qq.com>`。
