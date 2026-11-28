# Awesome RSI — 复核档案

> 本文件是维护性档案，不参与站点构建；读者版正文见同目录 `note.md`。

## 来源与版本

- **条目类型**：非论文条目（导读/博客），与论文共用编号序列；仓库编号 **00192**，无 PDF 可归档，清单编号列直接指向在线地址。
- **标题**：万字长文带你读懂 RSI（自进化，Self-Evolving）；英文版题名 *Understanding RSI: A Comprehensive Guide to Self-Evolving AI*。
- **署名**：Prism-Shadow（站点与仓库的署名，未披露个人姓名；仓库 README 的 BibTeX `author` 字段即 `Prism-Shadow`, 2026，正文亦以"我们"自称）。
- **站点**：[Awesome RSI](https://prism-shadow.github.io/awesome-rsi/#blog/understanding-rsi)，一个 RSI 论文精选集；站点自称收录 **100 篇 method、31 篇 benchmark、3 个 system**，另含引用图谱、书籍与课程。本文是其中「导读」栏目的文章。
- **在线地址**：<https://prism-shadow.github.io/awesome-rsi/#blog/understanding-rsi>
- **原文位置**：站点为 Vite 单页应用，正文以 markdown 字符串内嵌于 `/awesome-rsi/assets/index-B80jtE9h.js`。原始源文件为中文版 [`site/src/data/blog/rsi-guide.zh.md`](https://github.com/Prism-Shadow/awesome-rsi/blob/main/site/src/data/blog/rsi-guide.zh.md)（38,168 B，sha256 `22666c24e9b06bee…`）与英文版 [`rsi-guide.en.md`](https://github.com/Prism-Shadow/awesome-rsi/blob/main/site/src/data/blog/rsi-guide.en.md)（44,182 B）。
- **基准版本**：main 分支 commit [`36e91f8`](https://github.com/Prism-Shadow/awesome-rsi/commit/36e91f8fed67e2cd0c761126f91042513df5d6ae)（未指定版本，取阅读时的最新 main，2026-09-30）；复核时按同一 commit 重取中文源文件，sha256 与笔记一致。
- **发布日期**：2026-09-03（站点元数据文件 `blogPosts.zh.js` 的 `published` 字段）。
- **许可**：仓库与站点**未标注许可**（GitHub API 的 `license` 字段为 `null`）；`assets/` 下 4 张图版权归原作者，引用请注明出处。

## 阅读范围与核对手段

- **阅读范围**：中文版**全文 413 行**（§1–6 + 参考资料）；英文版全文取回并交叉核对——笔记引用的量化结论在两版中一致，两版差异仅在插图的 `-v1`/`-en` 语言变体。同站姊妹篇《Awesome RSI：递归自我改进基准与方法精选集》（2026-08-21）与仓库 `README.md`（46 KB）**部分阅读**，仅用于补充动机、定义与 explorer 用法。
- **配图**：文中 22 张插图取用 4 张存入 `assets/`（**整图复制，未做裁剪**，故无越界/黑边风险；4 张均已回看确认与站点中文版同图，文件名沿用原文）。取用的 4 张均为示意性结构图（框、箭头、拓扑），不含需要读数的曲线或柱状图，因此未做像素测量，笔记中也不含"图中读数"；未取用的 13 张编号图**未逐张检查**，抽查中至少发现 2 张含定量元素（`10-dgm-fig3.png` 带 SWE-bench 分数色标、`05-skillsmith-fig2.png` 内嵌小型柱状/折线图），本轮未从它们读取任何数值。
- **插图构成**：22 张分两类——**9 张作者自制的结构示意图**（`codex-*.png`，本次复制其中 4 张）与 **13 张从各被引论文截取的编号图**（`01-seal-fig1.png`…`14-evo-harness-fig3.png`；编号 01–14 之间跳号，缺 07 与 12，10 出现两次。这类图本次未复制）。
- **核对手段**：所引 13 篇 arXiv 论文的元信息（编号 / 标题 / 作者 / 日期）经 arXiv API 逐条核对，**13/13 一致**；13 篇的官方摘要逐篇取回，用于复核导读转引的量化结论；另对 MGM、DGM、ReasoningBank、Evo-Harness、GDPevo 取全文核对具体数字（MGM 与 ReasoningBank 的关键表格在**渲染页**逐格核对）。**仅核到摘要层面**：SEAL、Prime Agent 的实验细节。
- **未读**：那篇综述（arXiv:2607.07663）的全文（只核到摘要）。

## 复核记录

2026-10-06 依 check-paper-note 复核（基准：同 commit 的 `rsi-guide.zh.md`，重取 sha256 `22666c24e9b06bee…` 与笔记一致；英文版 44,182 B 同步取回；独立子 agent 审计）。手段：28 条导读级数字逐条回源检索、18 处 `§x.y` 归因逐条比对、9 条否定性断言在 zh/en 双向检索、13 篇论文 arXiv 元信息 API 复比（13/13）、11 篇摘要重取比对、MGM Table 1 与 ReasoningBank Table 1/2 在**渲染页**逐格核对并复算区间、DGM「2 weeks」与 Evo-Harness「超过基线」全文检索、4 张配图与站点文件 sha256 逐字节比对。

本轮修正：

1. 矩阵图位置（导言、§1 之前，原写"§1 之后"）；
2. 取消"所有插图均为示意图"的过宽表述，并点明两张含定量元素的编号图；
3. "不裁决术语"改标姊妹篇来源（导读 0 命中）；
4. Evo-Harness 的证据层级由"摘要"改为正文 Table 1；
5. MGM 预算改为 200 φ-evaluation + 24 Φ-expansion，并注明并行 worker 出自消融节；
6. GDPevo 的 240/24 与 MGM 的 200 标注为论文来源；
7. "SkillSmith 两个机制"改为三个；
8. §4.1 无代表工作的例外写进核心结论；
9. GDPevo 实验配置、Evo-Harness 五个 benchmark 名单、§2.1 两条边界、§3.3 末句两项结论补入；
10. GDPevo 的 50.63%/67.07% 本轮取全文闭环（原标"未取全文"），并查明 24.53 为论文中不存在的推导值。

## 原文自身的表述张力（若有）

以下各条都针对 **2026-09-30 的 main 分支版本**（中文版 sha256 `22666c24e9b06bee…`）。它们大多是导读**转引层面**的省略或推导，不是被引论文的错误。

1. **ReasoningBank 的 "+3.7–6.2 pp" 不是论文原话**，而是按论文表格计算的"相对各模型最强基线"增量（本笔记复算一致：WebArena Overall SR 相对最强基线为 +4.7 / +6.2 / +3.7；SWE-Bench 相对基线 Synapse 为 +3.4 / +4.0）。导读未称这是论文原话，但读者容易当成原文结论。这类"由表推导"的范围型数字在导读中可能还有其他，读到范围型数字时应回原文核对基线选择。
2. **MGM 的数字口径被省略**：导读写"相同评测预算下 Polyglot 50.8% → 93.2%"，未注明这是 **-60 子集**、backbone 为 Qwen3.6-35B-A3B、预算为 200 次 φ-evaluation + 24 次 Φ-expansion（Table 1 图注）。论文另报完整 Polyglot-225 上的 93.3%。
3. **两组 Polyglot 数字并列展示易被误读**：DGM 的 14.2% → 30.7%（§3.2）与 MGM 的 50.8% → 93.2%（§3.3）看似同一任务上的"代际飞跃"，实则初始 Agent、backbone 与评测子集都不同。导读没有提示这一点，我在核对时才确认。
4. **Evo-Harness 的证据层级**：官方摘要只列出 5 个 benchmark 并称 "demonstrates the effectiveness"，并未下"超过"的结论；"在五个 benchmark 上都超过其他经验复用方法"要到正文 Table 1 才能成立（原文为 "Evo-Harness improves over both No-Evolve and prior experience-based baselines across all five benchmarks" 与 "Compared with the strongest baseline, XSkill, Evo-Harness still improves on every benchmark"）。五个 benchmark 为 CL-Bench、TerminalBench-2、SWE-bench Lite、τ-bench、WebArena-Infinity；消融细节未展开。
5. **GDPevo 的 24.53 在论文中不存在**（全文 0 命中），是 91.6 − 67.07 的推导值，导读的算法正确；但 50.63% 与 67.07% 对应的是 **Opus-4.8 + Claude Code + fewshot 监督 + Skill Creator** 这一特定配置，导读写成了任务级结论。
6. **FinEvo-Bench 的评分口径未提**：全部输出由"以 Claude Opus 4.6 为后端的 Claude Code rubric judge"评分——这是理解该榜分数的一个前提（论文摘要给出，导读未提）。
7. **转引省略了若干更强的结果与限定词**：例如 TRACE 的隐藏集 Pass^3 70%、Mem²Evolve 相对标准 LLM 的 +18.53%、Prime Agent 摘要中的 ARC-AGI-3 RHAE Best@1 30%→95.5% 导读都未引；SkillSmith 的 OfficeQA +10.2 / SealQA +9.8 个百分点也被省略。
8. **一组未标来源的分类判断**：§4.1「自身更新」只有示意图、没有代表工作。这是四类主维度里唯一的空缺，导读未说明原因。

## 代表工作与核对结果（原节）

导读共点名 13 篇论文（另 1 条参考资料是 Awesome RSI 仓库自身）。核对用两个来源：**arXiv API 的元信息**（编号、标题、作者、日期）与**论文自身的摘要或正文**（用来判断导读转引的数字是否忠实）。

| # | 论文（导读归类） | 导读转引的关键数字 | 核对结果 |
| --- | --- | --- | --- |
| 1 | SEAL（参数进化，§2.1） | 无数值结论 | 摘要口径一致（self-edit → SFT → 以更新后模型下游表现为奖励的 RL） |
| 2 | Prime Agent（上下文进化，§2.2） | 无数值结论 | 摘要口径一致（IPython REPL、Continual Harness、递归子 Agent）；摘要另有 ARC-AGI-3 RHAE Best@1 30%→95.5%，导读未引 |
| 3 | ReasoningBank（记忆进化，§2.3） | WebArena 总体成功率 +3.7–6.2 pp；SWE-Bench Verified 解决率 +3.4–4.0 pp | **可由 v2 表格复算**：WebArena Overall SR 相对各模型最强基线为 +4.7 / +6.2 / +3.7；SWE-Bench 相对基线 Synapse 为 +3.4 / +4.0 ✅（导读未称此范围是论文原话，实为按表推导） |
| 4 | TRACE（Skill 进化，§2.4） | GPT-5.5 上连续三次全成功比例 59.9% → 94.5% | 摘要一致：Pass^3 **+34.6 点，59.9%→94.5%** ✅（"连续三次全成功"是 Pass^3 的中文转述）。摘要另有隐藏集 Pass^3 70% 与 4.0 点的 potential–reliable 差距，导读未引 |
| 5 | SkillSmith（Harness 代码进化，§2.5） | 3 个 Benchmark、5 个 Qwen3.5 规模 | 摘要一致：**五个 Qwen3.5 规模**，OfficeQA +10.2 / SealQA +9.8 个百分点（相对 EvoSkill），并在 WildClawBench 上持续超过 SkillClaw ✅ |
| 6 | SkillFlow（链，§3.1） | Claude Opus 4.6 任务成功率 62.65% → 71.08%；"部分配置持平或下降" | 摘要一致：**+8.43 点**；并明确给出反例——Kimi K2.5 技能使用率 66.87% 但仅 +0.60 点，Qwen-Coder-Next 仅 44.58% 且**相对 vanilla 回退** ✅（导读"部分配置持平或下降"有据） |
| 7 | DGM（树，§3.2） | SWE-bench 20.0% → 50.0%；Polyglot 14.2% → 30.7%；一次 SWE-bench 自进化实验约需两周 | 摘要给出两组数字 ✅；"约两周"经**全文核对**：原句为 "A single run of the DGM on SWE-bench … takes about 2 weeks and incurs significant API costs"，该句另注实验细节见 Section 4（API 成本细节在附录 E.1）✅ |
| 8 | MGM（图，§3.3） | 相同评测预算下 Polyglot 50.8% → 93.2%，单轨迹（树形）基线 77.9%；SWE-bench Verified 也超过该基线 | **全文 Table 1（渲染页）逐格核对** ✅：Initial 68.3 → HGM 73.3（+5.0）→ MGM **78.3**（+10.0，相对 Initial 的绝对百分点提升，原文以上标标注）（SWE-bench Verified-60）；Initial 50.8 → HGM 77.9（+27.1）→ MGM **93.2**（+42.4）（Polyglot-60）。**口径提示**：两组都是 **-60 子集**（导读未注明），backbone 为 Qwen3.6-35B-A3B，**预算 200 次 φ-evaluation + 24 次 Φ-expansion**（Table 1 图注；消融一节另说明同一预算下启用 2 个并行 worker）；论文另报**完整 Polyglot-225** 上的 93.3%（图 2 数据标签与正文 210/225） |
| 9 | Recuris（教师，§4.2） | 4 个长程 Benchmark × 10 个模型；37 个模型-Benchmark 组合中 **35 个**提升；最长任务最多 **+32.2 点** | 摘要一致 ✅（原文为 "35 of the 37 **completed** pairs"——4×10 中只有 37 组完成） |
| 10 | Evo-Harness（联合，§4.3） | 五个 Benchmark 上都超过其他经验复用方法；消融去掉 Solver 生成候选经验后效果下降 | **正文 Table 1 核对** ✅（摘要仅列出 5 个 benchmark 并称"demonstrates the effectiveness"，未下"超过"的结论）：§4.2 原文为 "Evo-Harness improves over both No-Evolve and prior experience-based baselines across all five benchmarks" 与 "Compared with the strongest baseline, XSkill, Evo-Harness still improves on every benchmark"；五个 benchmark 为 CL-Bench、TerminalBench-2、SWE-bench Lite、τ-bench、WebArena-Infinity。消融细节未展开 |
| 11 | GDPevo（离线，§5.1） | 120 任务 / 12 组；更新前 50.63% → 更新后 67.07%（+16.44）；oracle 上限 91.6%，差 24.53 | 摘要给出"**最多 +16.44 个百分点**"与 **91.6% oracle** ✅；**正文全文核对** ✅：50.63% 与 67.07% 原文可查（"Opus-4.8 has the highest base accuracy (50.63%) and the largest gain (+16.44 pp)"；表中 `fewshot Skill Creator 67.07\pm 6.22 \to +16.44`），即该组数字对应 **Opus-4.8 + Claude Code + fewshot 监督 + Skill Creator** 这一配置。**24.53 在论文中不存在**（全文 0 命中），是 91.6 − 67.07 的推导值，导读的算法正确 |
| 12 | FinEvo-Bench（在线，§5.2） | 平均 +9.33–19.37 分；同场景后三个任务比前三个高 6.10–8.70 分；顺序打乱三次 | 摘要逐项一致 ✅（原文为 within-scene **ranks 4–6** 超过 ranks 1–3；另有每任务减少 0.12–0.44 个合规问题，导读未引）。**口径补充**（摘要，导读未提）：全部输出由"以 Claude Opus 4.6 为后端的 Claude Code rubric judge"评分——这是理解该榜分数的一个前提 |
| 13 | Mem²Evolve（混合，§5.3） | 比只积累经验的方法高 **11.80%**，比只创建工具/专家 Agent 的方法高 **6.46%** | 摘要逐项一致 ✅（另有相对标准 LLM **+18.53%**，导读未引） |

**元信息核对**：13 篇的 arXiv 编号、标题、第一作者姓氏（Zweiger / Karten / Ouyang / Wu / Wei / Zhang / Zhang / Liu / Yu / Wei / Zhou / Deng / Cheng）与导读参考资料列出的作者姓氏**全部对应**；导读标注的日期等于各篇 **v1 提交日期**（如 MGM 2026-08-07、Recuris 2026-08-25），而其中多篇后来有 v2/v3（如 DGM v3 2026-03-12、TRACE v2 2026-09-03、SkillSmith v2 2026-09-26、FinEvo-Bench v2 2026-10-01）——**导读标注的是 v1 日期，核对时读的是各自最新版**。

**逐篇机制补充**（正文已压缩，此处保留细节）：

- **SEAL**：模型面对新输入时除了答案还生成 self-edit（重组原始信息、生成训练样本、指定优化超参、调用工具做数据增强或梯度更新）；系统按 self-edit 做 SFT；外层 RL 以更新后模型的下游表现为奖励。代价是候选 self-edit 的微调与评测开销高。
- **Prime Agent**：持久化 IPython REPL + Continual Harness（任务历史、记忆、Skill、Prompt、子 Agent 配置）；任务中断后后台进程保留现场；可派子 Agent 并行探索；**不更新模型参数**。论文摘要的定位是 *prevents harness failures from becoming model failures*。
- **TRACE**：按"一类具体情况"组织 Skill Bank，每轮评测后对调用过同一 Skill 的成败轨迹做对比式精修；部署时按当前对话状态在每一轮选择 Skill（摘要称 state-conditioned skill orchestration，导读未用此术语）。
- **SkillFlow**：基准含 **20 个任务族、166 个可执行任务**（金融、供应链、医疗、治理、数据处理），同一族内任务流程相似但输入与要求不同、难度递增；用例为 4 种 Agent Harness × 11 个模型。
- **DGM**：每轮从 archive 采样父代，修改提示词/工具/工作流代码；新版本通过基本检查后用 SWE-bench / Polyglot 评测；低分版本也保留；选父代与管理版本集合的规则目前是预设的、不随 Agent 更新。
- **MGM**：除 clonal mutation 外的两种更新——reaction-norm mutation（比较同一 Agent 在不同任务上的轨迹）与 cross-lineage hybridization（比较不同分支的 Agent 在同一任务上的表现）；导读 §3.3 末句另记录两个附带结论：**不同更新方式的 Token 消耗相近**，且 MGM 演化出的 Harness **在更换编程 Benchmark 或底层模型后仍能继续发挥作用**。
- **Recuris**：Working Memory + Experiential Memory；失败时把失败与本轮记忆组件关联定位；固定 Meta-Agent 对相关 Skill 提局部修改，验证后才写入。
- **Evo-Harness**：Solver 先总结候选经验并标明适用情况与依据，Evolver 每批任务后决定新增/合并/修改/舍弃；消融去掉 Solver 生成候选经验后效果低于完整方法。
- **GDPevo**：另有自动生成流程可在两天内扩到 V2 的 240 任务 / 24 组（导读只写"两天内生成另外 12 组"）；作者用四种 Agent 和四类反馈做实验。
- **FinEvo-Bench**：每场景 6 个任务共用同一流程但数据与问题不同，同场景任务交错出现，顺序独立随机打乱三次；状态重置对照组每任务前清空状态。
- **Mem²Evolve**：Experience Memory 存经验，Asset Memory 存工具与专家 Agent；新工具须先通过自动生成的单元测试；通过验证的组件与经验分别写回两类 Memory。

## 工程视角（原节）

**读一篇新论文的四步（导读 §1–§5 的直接用法）**：

1. **定位被改对象**（§2）：改的是参数还是上下文？若声称改了参数，被训练的是"执行任务的模型"还是"负责训练的另一个系统"？——这一步最容易错。
2. **看版本结构**（§3）：单线迭代（链）、保留 archive（树）、还是跨任务/跨分支汇合信息（图）？决定的是**评测预算量级**。
3. **看谁执行更新**（§4）：Student 自己、独立 Teacher、还是两者都碰了写回内容？若只有一方评分，就是"自身更新"或"教师更新"，不是联合。
4. **看更新时机**（§5）：离线 / 在线 / 混合？决定的是**评测协议**——离线的分数只有在训练-测试题设计合理时才可归因，在线的分数只有在沿序列观察且有重置对照时才可归因。

随后用 §6 的五个次级维度补齐"验收标准 / 反馈来源 / 反馈类型 / 更新频率 / 作用范围"，即可把一篇新工作和已有工作对齐。站点的 explorer 支持按这些维度**组合筛选**（仓库 README 的 "Use the explorer" 一节给出的例子即"更新 **Skill** + 运行模式 **Online** + 反馈来源 **Environment**"），是这套坐标系的落地形态。

**按预算选路线的粗略直觉（我的推断，非导读原文）**：

- **算力受限**：链式 + 完整轨迹或批次更新 + 环境/可执行验证器反馈，是最省的一条路（如 SkillFlow 的单线 patch 循环）；代价是错误会向后传播——SkillFlow 的"碎片化 Skill 库"正是这个失败的典型形态，工程上应对"不断新增相似 Skill"设硬约束（如强制合并、限制库规模）。
- **追求上限**：树/图能探索更宽的方向，但**每个分支都要一次真实评测**（DGM 单次 SWE-bench 自进化约两周〔导读 §3.2〕；MGM 用 200 次评测预算〔出自 MGM 论文〕），成本随分支线性增长。
- **想避免"改一处坏一处"**：SkillSmith 的做法可操作性强——**把改动成套生成并成套测试**（Skill 与工具一起改），并用历史失败模式做否决。
- **判断"是模型不行还是框架不行"**：可借用 Prime Agent 论文摘要的说法（**补充背景**）——好的 harness 应当 *prevent harness failures from becoming model failures*，让评测逼近模型的真实上限；这条对做自进化评测的人尤其重要，因为**经验积累的效果很容易被 harness 缺陷掩盖**。

## 局限与待确认问题（完整版）

**作者明确讨论的局限**

- 领域尚无统一技术范式，导读只用维度界定而不裁决术语（"尚未形成统一的技术范式"见开篇引言；"不试图裁决什么才算真正的 RSI"一句出自姊妹篇，非导读原文）。
- 分类标签需要分别判断，同一方法可在同一维度取多个值（§6 开头）。
- 树/图式方法的成本随分支增长，DGM 这类持续生成与评测多分支的搜索"通常需要投入更多时间和模型调用预算"（§3.2）。

**我的判断（读者视角，非作者观点）**

1. **分类边界是作者构造的坐标，不是领域共识**。同一工作能被合理地放在不同格子里：Prime Agent 被归入"上下文进化"（因它不改参数），但它实际上演化的是 Harness 的持续状态；SkillSmith 在导读的「修改对象 × 更新模式」矩阵图（`codex-rsi-artifact-mode-matrix-v1.png`，位于开篇引言末、**§1 之前**）中同时出现在"记忆 / Skill / Harness 代码"三行。**导读未给出判定优先级**（多个标签冲突时以谁为准），也没有随正文分发编码后的标签数据（标签可在站点 explorer 中按维度筛选，其数据在站点的 JS 构建产物里）。
2. **"自身更新"一节没有代表工作**（§4.1 只有示意图）。四类主维度中唯一空缺的格子，读者若想找该类的实例，需要另去站点目录检索。
3. **两组 Polyglot 数字并列展示易被误读**（详见「原文自身的表述张力」第 3 条）。
4. **可能的自我引用倾向**：GDPevo 的代码仓库位于 Prism-Shadow 组织下（[github.com/Prism-Shadow/GDPevo](https://github.com/Prism-Shadow/GDPevo)，arXiv 摘要中给出），而导读的"离线 RSI"代表工作正是 GDPevo，**导读由该组织维护**。这不构成错误，但读者应知道选例来源与维护方的关系。
5. **所有数字都是各论文自报，未做第三方复现**。我核对的是"**转引是否忠实**"，不是"结论是否成立"。此外导读转引时**省略了若干更强的结果**（TRACE 的隐藏集第一名、Mem²Evolve 相对标准 LLM 的 +18.53%），也有**省略了限定词**的情形（MGM 的 -60 子集）。
6. **一处口径未注明的转述**：ReasoningBank 的 "+3.7–6.2 pp" 并非论文原话，而是按论文表格计算的最强基线增量（我复算一致）。这类"由表推导"的数字在导读中可能还有其他，读到范围型数字时应回原文核对基线选择。

**尚无实验证据的问题**

- 导读提出的九维坐标**没有可执行的标注流程或定量验证**（例如：不同标注者对同一论文的一致性如何？），因此它是**阅读辅助框架**而非可复现的分类学。
- "参数进化 vs 非参数进化作用于同一输出分布"的统一视角（姊妹篇）是概念论证，**导读未提供二者在同一任务上的成本-收益对照实验**。
- 哪些维度组合在实践中真正有效，导读只给单点案例（每个格子一篇代表工作），**没有跨维度的系统性消融**——这是站点目录（100 篇）可以回答但导读未回答的问题。
- 领域发展快：导读发布于 2026-09-03，我读的站点 commit 为 2026-09-30（期间仓库仍在扩充 methods 目录），**较新版本可能已改动正文。**

## 参考资料

- 导读（本笔记主体）：[万字长文带你读懂 RSI](https://prism-shadow.github.io/awesome-rsi/#blog/understanding-rsi) · [中文源文件](https://github.com/Prism-Shadow/awesome-rsi/blob/main/site/src/data/blog/rsi-guide.zh.md) · [英文版](https://github.com/Prism-Shadow/awesome-rsi/blob/main/site/src/data/blog/rsi-guide.en.md)
- 姊妹篇（动机与定义，补充背景）：[Awesome RSI：递归自我改进基准与方法精选集](https://prism-shadow.github.io/awesome-rsi/#blog/introducing-awesome-rsi)（2026-08-21）
- 仓库与目录：[Prism-Shadow/awesome-rsi](https://github.com/Prism-Shadow/awesome-rsi)（README 的 Paper map / Methods & Systems / Benchmarks 三节即站点目录的 markdown 形态）
- 转引的综述：[arXiv:2607.07663](https://arxiv.org/abs/2607.07663)（仅核对摘要："We survey 1,250 arXiv papers (2024-2026)"；全文未读）
- 误判案例来源：[PostTrainBench，arXiv:2603.08640](https://arxiv.org/abs/2603.08640)

导读点名的 13 篇代表工作：SEAL ([2506.10943](https://arxiv.org/abs/2506.10943))、Prime Agent ([2608.23552](https://arxiv.org/abs/2608.23552))、ReasoningBank ([2509.25140](https://arxiv.org/abs/2509.25140))、TRACE ([2608.22793](https://arxiv.org/abs/2608.22793))、SkillSmith ([2606.01314](https://arxiv.org/abs/2606.01314))、SkillFlow ([2604.17308](https://arxiv.org/abs/2604.17308))、DGM ([2505.22954](https://arxiv.org/abs/2505.22954))、MGM ([2608.07645](https://arxiv.org/abs/2608.07645))、Recuris ([2608.24876](https://arxiv.org/abs/2608.24876))、Evo-Harness ([2608.15071](https://arxiv.org/abs/2608.15071))、GDPevo ([2608.03764](https://arxiv.org/abs/2608.03764))、FinEvo-Bench ([2608.06144](https://arxiv.org/abs/2608.06144))、Mem²Evolve ([2604.10923](https://arxiv.org/abs/2604.10923))。

## 迁移索引

2026-11-28 读者版重写时，以下内容从 `note.md` 移入本文件：

- 来源信息表中的站点细节、原文 JS 打包位置、两版文件大小与 sha256、基准 commit、发布日期、许可与配图说明；
- 原「阅读范围」整行与原「配图」整行（22 张插图的构成与未检查范围）；
- 原「核验」整行与原「复核记录」整行（2026-10-06，含 10 条修正）；
- 原「代表工作与核对结果」整节（13 行核对表、元信息核对、逐篇机制补充）；
- 原「工程视角：怎么用这套坐标系」整节（四步用法、explorer、按预算选路线的推断）；
- 原「局限与待确认问题」完整版（作者明说的 3 条、读者判断 6 条、尚无实验证据 4 条）；其中属于转引口径问题的条目重新整理为「原文自身的表述张力」；
- 原「参考资料」整节；
- 原正文中的公式化定义（`A_{t+1} = U(A_t, τ_t, f_t)`）与符号表——博客无公式，读者版改为文字闭环描述；
- 原「形式化定义与两个前提」「四个主维度」「五个次级维度」三节中的逐条机制细节，读者版按"核心论证链"压缩保留，逐篇数字与核对结论留在本文件。
