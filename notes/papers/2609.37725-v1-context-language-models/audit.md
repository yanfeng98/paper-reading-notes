# Context Language Models — 复核档案

> 本文件是维护性档案，不参与站点构建；读者版正文见同目录 `note.md`。

## 来源与版本

- **标题**：Context Language Models。
- **作者**：Rulin Shao、Shannon Zejiang Shen、Junjie Oscar Yin、Yuetai Li、Minheng Wang、Hamish Ivison、Radha Poovendran、Nathan Lambert、Teng Xiao、Mike Lewis、Wen-tau Yih、Luke Zettlemoyer、Pang Wei Koh（共 13 人）。原文没有共同一作标注。
- **机构**：University of Washington（第一机构）、Meta Superintelligence Labs、MIT、Trillium Labs。Rulin Shao、Junjie Oscar Yin、Luke Zettlemoyer 同时署 UW 与 Meta Superintelligence Labs，Mike Lewis、Wen-tau Yih 只署 Meta；p.1 的 Correspondence 行给出 `rulin@cs.washington.edu`。
- **来源**：[arXiv:2609.37725](https://arxiv.org/abs/2609.37725)，版本 **v1**。abs 页只有这一条提交记录（2026-09-29），PDF 首页另标 `Date: September 30, 2026`。Subjects：cs.AI; cs.CL; cs.LG。
- **阅读基准**：arXiv 官方 PDF `https://arxiv.org/pdf/2609.37725v1`，27 页，sha256 `ac5c926814434d8ad2f499183cd2a81e53b4c14f327587f99980ade9157db01b`（2026-11-19 抓取，下载字节数与 `Content-Length` 2,814,205 一致、文件尾有 `%%EOF`）。arXiv 论文不归档 PDF。
- **许可**：arXiv 页为 [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/)；代码仓库另用 CC BY-NC 4.0。两处不同，引用代码/图时按各自许可理解。
- **代码仓库**：[facebookresearch/context-language-models](https://github.com/facebookresearch/context-language-models)，核验于 2026-11-19：默认分支 `main` 的 HEAD 为 `3c89408be27d34e9e8d14eade365a8d440b041e9`（2026-11-17），仓库创建于 2026-09-18，903 stars。README 声明的模块包括 `clm/clm_harness`（基于 Harbor）、`clm/clm_icl`、`clm/clm_rl`、`clm/clm_contextbench`，以及 `suffix_cache_reuse/{sglang,vllm}`；另给出 `pi install npm:@lolipopshock/pi-clm` 与社区维护的 OpenCode 插件。
- **诊断集仓库**：[RulinShao/ContextBench](https://github.com/RulinShao/ContextBench)（Apache-2.0，2026-10-11 创建，同日最后一次 push，1 star，2026-11-19 核验）。论文 README 另称数据集发布在 Hugging Face；本次请求超时，未验证可达性。
- **仓库编号**：00233（根 README 第 408 行；年份、机构与该行一致）。
- **版本关系**：arXiv 只有 v1，无更早/更新版本可比。所有「原文」指 v1 的 27 页 PDF；HTML 版与 PDF 图号不一致，见下节。

### HTML 版的图号偏移（重要）

arXiv HTML 版完整（421,909 B，与 `Content-Length` 一致），但**图号与 PDF 不一致，且偏移随子图组增大**：HTML 把 EdgeBench/Software World 的 (a)/(b) 子图各计一个 Figure——PDF Figure 6 = HTML Figure 8（+2）；PDF Figure 18 = HTML 24（+6）；PDF Figure 19 = HTML 27（+8）。**本档案与 `note.md` 的图号一律按 PDF。**

## 阅读范围与核对手段

- 已通读 PDF 全部 27 页（正文 §1–§6、附录 A–G）与 arXiv HTML 版。
- **已渲染并逐项核对**：p.2 Figure 1、p.4 Figure 2、p.5 Figure 3、p.6 Figure 4 与式 (5)(6)、p.7 Figure 5 与 Table 1、p.9 Figure 7/8/9 与 Table 2；p.8 Figure 6 只读 PDF 文字层，未单独渲染。
- **只按正文/图注/表格引用、未逐张渲染**：附录 Figure 10–22（含 K 敏感性、128K EdgeBench、RL 曲线、context-length 校准图）；其数字均来自正文或图注，未做像素读数。
- **未做**：复现实验、运行仓库代码、逐题重跑评测。
- 配图（`assets/`）：`fig1-overview.png`（Figure 1，p.2）、`fig4-scr.png`（Figure 4，p.6）。

## 复核记录

**2026-11-20，第 1 轮**（依 check-paper-note 流程）

- **基准**：arXiv v1 官方 PDF 重新下载并校验（2,814,205 B、`%%EOF`、27 页、sha256 `ac5c9268…7db01b`，与初读一致）；HTML 421,909 B。核对覆盖全文与附录 A–G。
- **方式**：逐项核对元数据、数字、公式、引用定位、声称 vs 证据、读图、遗漏与内部一致性；本机复读 Figure 9 右图与 Figure 5(b) 的 600 dpi 裁剪；独立审计另渲染 p.4 / p.7 / p.9（300 dpi 整页）与 p.19 的局部图表（含 Figure 15），并用字体信息复核 Table 1 加粗。
- **修正**：
  1. Figure 9 的 7.3%/28.3% → **7.8%/28.2%**；
  2. Figure 5(b) 由「两点几乎重合」改为「准确率相同、CLM 的 FLOPs 更低」；
  3. 163 次原地编辑不再绑定 Erdős 第 455 步；
  4. 删去「成功案例」推断；
  5. 一句话总结把 Software World 从 prefix-reuse FLOPs 口径拆出、并给 EdgeBench 加 32K 限定；
  6. BCP 两次运行改为「同一 830 题、0.8 分差异来源未说明」；
  7. 补充 ContextBench seeds 与 method-specific skill、EdgeBench 评分/无 turn 上限、Software World 的 executed-instructions 指标、RL checkpoint 选择、Figure 7 样本量、数学优化 baseline 设置、PDF 首页日期；
  8. 修正 p.1「Correspondence」措辞、`§4.2` 指代、DPI 凭据与 Table 1 加粗范围；
  9. 新增 Figure 5 avg. context 的表述张力。
- **复查**：2026-11-20 重跑 GitHub API，代码仓库仍为 903 stars、pushed_at 2026-11-17，ContextBench 仓库仍为 1 star；README 的 `00233` 行与笔记单位一致。
- **沉淀到 skill**（`read-paper-blog` / `check-paper-note` / `summarize-paper-methods`）：HTML 图号可能从正文中段开始偏移、幅度随子图组增大（+2 → +6 → +8）；堆叠条形图小号段标签在 170 dpi 全页会抄错一位（并用段标签加总复核）；Pareto 图「两点重合」要分别看两轴；同一段效率结论可能混用 FLOPs/USD/active hours；`qualitative examples` 不等于成功案例、计数可能只归到面板整体；`Correspondence:` 行按行类型记，不写成脚注。
- **补记（2026-11-20 复核 skill 时）**：上一版把 HTML 图号偏移写成「只在附录」，实际从 PDF Figure 6 起就 +2；已同步修正阅读范围与三个 skill。
- **未修/未核**：Hugging Face 数据集仍请求超时；附录 Figure 10–22 未逐张渲染；未运行代码、未复现实验。

**2026-11-28，读者版重写**

- 只重组结构与行文：正文按「来源信息 / 核心结论 / 问题 / 核心想法 / 方法 / 主要结果 / 边界与局限 / 与其他工作的关系」重排；复核记录、凭据、张力、工程细节、逐表逐图内容迁入本文件。未重新下载原文，未改动任何数字与判断。
- 重写时新增的少量解释性表述（如「改坏会被任务本身惩罚」「CLM 的价值在于整理已经进入 context 的内容」）都写在机制解释的位置，不是原文实验结论，也没有被写成作者主张。

## 核对凭据（原第 11 节）

- PDF：27 页，sha256 见「来源与版本」；文本抽取使用 Miniconda 的 `pymupdf`，页数用 `pymupdf.open(...)` 复核。
- 渲染：`pymupdf` 渲染并目视核对 p.2（Figure 1，150 dpi）、p.4（Figure 2，200 dpi）、p.5（Figure 3，170 dpi）、p.6（Figure 4 / 式 5 / 式 6，200 dpi）、p.7（Figure 5 / Table 1，200 dpi）、p.9（Figure 7/8/9、Table 2，整页 170 dpi；Figure 7 另以 300 dpi 局部裁剪读数）；p.8（Figure 6）未单独渲染，1.026 / 1.044 取自该页 PDF 文字层。
- 表格加粗：用 `page.get_text('dict')` 的 span `font` 核对 Table 1（`OptimisticDisp-Bd` 为加粗），确认 2.636 与 (CLM, SA) 的 0.07758 为加粗，2.618 未加粗。
- 公式：式 (2)(3)(6) 与渲染页逐条对照；式 (6) 的分段、`clip(...,−1,1)` 与「成功轨迹少于两条时置 0」均按 p.6 原文。
- 图内读数：Figure 7 的 0.34 / 0.40 / 0.77 / 0.88、0.68 / +0.09、16.0k / 23.6k / 30.9k 取自 300 dpi 裁剪；Figure 6b 的 1.026 / 1.044 取自 p.8 的 PDF 文字层（未单独渲染该页）。
- 代码仓库信息：GitHub REST API 于 2026-11-19 查询（`/repos/facebookresearch/context-language-models`、`/commits/main`、`/license`；`/repos/RulinShao/ContextBench`）；未运行仓库代码，未验证其与论文实验的可复现性对应。
- 未核：Hugging Face 上的 ContextBench 数据集（请求超时）；附录 Figure 10–22 未逐张渲染；未做带定标的像素测量——上列图内读数均为 300 dpi 裁剪的目视读数。

## 原文自身的表述张力

- **Software World 的 65%**：图内标签是 1.026 与 1.044，按「改进量之比」复算约 69%，按「加速比之比」只有 1.75%。原文用「65% greater improvement / 65% greater end-to-end speedup」两种措辞，读者容易把后者理解成加速比高 65%。同一段还分别用 same compute（摘要、引言）、same spend（§5.1.2）描述「同等投入」，而 Figure 6b 的横轴是 active hours，三种口径未对齐。
- **TB2.1 的 FLOPs**：引言写「29.5% fewer FLOPs」，§5.1.1 写「only 70% of its FLOPs」（即少 30%）；两者在取整范围内一致，但同一事实用了两种口径。
- **BCP 的两个准确率**：主结果（Figure 5、§5.1.1）是 59.4%，SCR 实验（Figure 9）里标准 serving 与 SCR 都是 60.2%。两次都是同一 830 题（附录 E 与 Figure 12 图注），按附录 E 的统一设置 judge 是 Qwen3.5-27B；但 0.8 分的差异来源（serving 设置、预算或随机性）未说明，引用时不要混用。
- **轮数上限**：Figure 5 图注写「All methods ... a 100-turn cap」，附录 E 的 TerminalBench 2.1 与 TBLite 却是「Every method is limited to 64 turns」；BCP 的 100 轮与附录一致。按各基准的附录设置复现更稳妥。
- **「CLM 在四个数学问题上都最高」**：circle packing 的最高分 2.636 来自 CLM(SA)，单 agent CLM 是 2.618；表格加粗也标在 CLM(SA) 的 2.636 上。本笔记理解正文的「CLM」在这里是包含 subagent 变体的统称。
- **「up to 35.9 points」**：指 KV Store 的 held-out test（38.3→74.2），不是 dev 上更大的 Log Triage（0→100）或 Sudoku（45.3→65.8）；摘要只说「on a context-management task」，没有点名 KV Store，容易被读成四个任务的平均或最大值。
- **ContextBench 的「24×」**：只有 Needle 与 KV 推到 24×，Sudoku 到 8×、Log Triage 到 16×；「up to 24×」是全集上限，不是每个任务都到 24×。
- **Figure 5 的 avg. context**：三个面板分别标 `avg. context 97K / 47K / 33K`，但实验写的是 32K context limit（BCP 附录还写 23,560 token budget）；这个「平均 context」的口径原文没有解释，不能直接当成 context window。
- **163 次原地编辑的归属**：正文说这类状态更新累计 163 次后 context 仍只有 6–8K token，但 Figure 3(a) 同时含 Erdős 与 Circle packing 两个例子，正文没有把 163 次对应到某个具体任务或步骤；只能记成该面板整体的统计。

## 工程实现与外部资料（原「工程视角」）

**系统组成**（据仓库 README 与目录，未运行代码）：

- `clm/clm_harness`：基于 Harbor 的 CLM agent，目录含 `context_env`、`context_utils`、`flops_metrics`、`task_templates` 等（具体职责未逐个读代码，仅按 README 与目录名定位）。
- `clm/clm_icl`：in-context 策略进化；`clm/clm_rl`：RL 训练；`clm/clm_contextbench`：ContextBench 接入。
- `suffix_cache_reuse/sglang` 与 `suffix_cache_reuse/vllm`：两种 serving 后端的 SCR 实现。

**关键接口与数据流**：agent 每轮生成 → 若调用 Bash 修改 context 文件 → 同步层把新文件内容作为下一轮 prompt 发给 server → server 端 prefix cache 命中相同前缀，SCR 再迁移存活后缀。两个容易出问题的点：

1. **同步语义**：文件写入必须原子地反映到下一次请求；如果模型在一次生成中多次修改，需要明确哪一版是下一轮的输入。论文只描述了「每次修改立即同步」，没有展开并发 / 中途修改的细节。
2. **成本模型依赖 tokenizer 与模型结构**：附录 C 的常数是按 Qwen3.6-27B 的结构算的，换模型要重算 $C_{\mathrm{token}}$、$C_{\mathrm{attn}}$；论文的跨方法比较都在同一 base LM 下进行，不能把绝对 PFLOPs 直接搬到别的模型。

**失败模式**（论文提到或可直接推出）：

- SCR 复用旧前缀下算出的状态，是近似；$K$ 越大、一次编辑的存活 span 越多，近似累积越明显。论文的敏感性分析只到 64 题规模，且只报告「没有观察到性能下降」。
- 分配不到 session-private slot 时回退到完整 re-prefill，最坏情况退化为标准 serving。
- 模型可能做出破坏 prefix reuse 的编辑（例如频繁改开头），效率奖励正是为了抑制这类行为；但奖励只作用于成功轨迹，失败轨迹里的低效编辑不会被直接纠正。
- **安全**：模型对自己的 context 有写权限，prompt injection 或模型自己生成的指令可以跨轮持久化。作者在 §6 明确把这一点列为新的攻击面，并引用已有观察（模型在压缩摘要里插入未授权指令），但没有给出防御或评测。

**外部资料**：代码仓库与 ContextBench 仓库的元数据经 GitHub REST API 查询（见「来源与版本」）；Hugging Face 数据集未验证。除仓库 README 外没有引用其他外部资料。

## 实验与证据细节（原「实验结果」逐表逐图内容）

### ContextBench 的四个任务（Table 3）

| 任务 | 输入流 | 查询 | 指标 |
| --- | --- | --- | --- |
| Needle Retention | 约 4K token 的块，每块 2–8 行 needle、140 行 filler | 无 | 最终 context 中逐字保留的 needle 行 |
| Sudoku Sketchpad | 每轮一个 16×16 棋盘移动 | 每次移动后的当前棋盘 | 精确复现的棋盘版本数 |
| KV Store | 每批 100 条 SET，值为随机 24 词 | 24 个 GET | 精确值准确率 |
| Log Triage | 每批 14–54 行服务日志 | 24 个查找/计数查询 | 精确答案准确率 |

- 输入以**连续对话中的新 user message** 形式逐条到达，操作在 agent 能处理之前就已经进入 context，任何 harness 都无法在入口处截断或卸载。
- agent 只控制「下一条操作什么时候来」：处理完当前操作后执行 `echo READY_FOR_NEXT_OP`。
- 32,768 token 的 context 上限中预留 2,048 给回答，可用预算 30,720；单条操作不超过可用预算的 1/5，任务要求保留的内容不超过 1/2，各留 10% 余量。
- 指标只从 agent 的 context 计算，**只存在文件里的答案不算分**。
- 比较对象：Base（Mini-SWE-Agent）、Codex-style Summary、Context Folding、RLM、Self-Compact、ACM、CLM；GPT-5.4、32K 上限；每个方法收到与自身机制配套的 skill（四类指导相同，附录 D）；每个压力档 4 个 seed，部分档 8 个。
- 结论：没有一个现有方法能在这些简单任务上做到完美（Figure 2）；CLM 是唯一在四个任务所有压力档上保持 1.0 的方法。

### 零样本涌现行为（Figure 3，定性例子）

Figure 3 给出五个来自 §5.1 零样本实验的具体例子（均为定性案例）：

- **多 agent 编排**：Figure 3(a) 展示 CLM 用 in-place 编辑维护 in-context scoreboard 和 agent 状态（图中例子包括 Erdős minimum overlap 第 455 步、Circle packing 第 194/198 步）；正文说这类状态更新累计 **163 次原地编辑**后 context 仍只有 6–8K token，但没有把 163 次对应到某个具体任务或步骤。
- **自造角色**：在 BrowseComp-Plus 第 40 步，它用正则把某段对话改写成 `role=notes`，在原模板角色之外创建一个「内部笔记」角色。
- **写循环做批量压缩**：在 BrowseComp-Plus 第 1509 步，用 for 循环把无关搜索结果替换成「Searched: … No relevant results.」；第 13 步用 while 循环按长度截断过长的工具输出。
- **定义并复用函数**：第 109 步定义 `compact_turns`，之后调用 37 次，在压缩细节观察的同时维护一条 progress note。
- **复现已有基线的有效行为**：第 20 步把 21K token 压成与答案相关的摘要；Circle packing 第 332 步保留 untried ideas 供后续探索。

这些例子说明 CLM 可以发明新的 context 结构（记分板、内部角色、可复用函数）；但它们是论文挑选出来的定性示例（未说明是否来自成功轨迹），也没有统计这类行为出现的频率或与成绩的因果关系。

### 零样本编码 / 深搜（Figure 5、Table 1）

- 设置：Qwen3.6-27B、32K context；所有方法共用 Mini-SWE-Agent backbone；比较 MEM1、Self-Compact、ACM、RLM 与 Codex-style Summary。
- baseline harness 设置：Summary 在 75% 预算压缩，Self-Compact 超过 37% 后每两轮询问，MEM1 是作者复现的推理循环，RLM/ACM 用 released code。
- 结果：BCP（830 题）59.4%，比 Summary 相对高 11.4%（由相对差反推 Summary 约 53.3%，本笔记复算），比 Summary 少 21.5% FLOPs、比 MEM1 少 28.9%；TB2.1（89 题）与 Summary 持平（正文未给具体准确率），为 Summary 的 70% FLOPs（引言写「29.5% fewer」）；TBLite 73.7% vs Summary 67.0%（+6.7 个百分点，+10.0% 相对），为 Summary 的 91% FLOPs。
- Figure 5 三面板：准确率对 prefix-reuse PFLOPs，CLM 在三个基准上都位于 Pareto 前沿；TB2.1 面板里两者准确率相同、CLM 的 FLOPs 更低（§5.1.1 写 70%）。正文只说「match」，未给准确率，本笔记不据图反推数值。
- 小模型对照（附录 F）：Qwen3.5-9B 在 BCP 上 CLM 39.9% vs Summary 37.7%；TB2.1 上 9B 平均每题只编辑 1.4 次、一半任务完全不编辑，27B 是 2.6 次；9B context 峰值中位数 30.2K（32K 上限），27B 为 17.6K。作者据此认为收益随模型「决定何时编辑」的能力增长。

### Prompt 指令实验（Figure 7）

- 设置：Claude 4.6 Sonnet、BCP、无预算提醒。阈值实验 30 道长题 / 48K / 200 轮；边界实验 189 sessions/条件、131 个含边界、24K / 1,000 轮；备份实验 200 题、91 对、16K。

| 指令 | 度量 | 无指令 | 有指令 |
| --- | --- | --- | --- |
| 「超过 Y token 就压到约 4K」 | 首次压缩时的 context 中位数（Y=16k/24k/32k） | 未触发压缩（图中以 40k 上限虚线表示） | 16.0k / 23.6k / 30.9k |
| 「只在子问题边界压缩」 | 边界当轮压缩率；边界后 2 轮内压缩率 | 0.34；0.40 | 0.77；0.88 |
| 「压缩前先备份」 | 编辑前有完整备份的比例 | 0.00 | 0.68（另有 0.09 为部分备份） |

- 论文没有报告指令不生效的比例。

### 文本进化

- assisted evolution：Qwen3.6-27B 作 agent、Claude Fable 5.1 作 proposer。dev 准确率 Needle 97.6→100.0、Sudoku 45.3→65.8、KV Store 22.3→83.8、Log Triage 0.0→100.0。
- held-out test：KV Store 38.3→74.2，即摘要里的「up to 35.9 points」——留出集上 KV Store 单任务的提升，不是四任务平均，也不是 dev 上的最大提升。
- self-evolution：Opus 5 同时作 agent 与 proposer，起点已在 94–100%，进化主要是在同准确率下降成本，或继续小幅提分。

### 在线 RL（Table 2）

- 训练配置（附录 E）：Qwen3.5-9B，3,040 条 OpenResearcher 深搜 prompt；GRPO，截断重要性采样、KL 系数 0.01、动态采样去掉无奖励方差的组；每步 8 个 prompt × 32 rollouts；学习率 `1e-6`、weight decay 0.1、clip `[0.2,0.28]`，训练 70 步；28K context 预算、2,048 预留、80 轮；奖励为 GPT-5.4-nano 按 DeepSearchQA rubric 打的二值分，另有失败工具调用与格式错误的惩罚。
- 资源：策略 16 张 H200，rollout 48 张。checkpoint 按 500 道 held-out OpenResearcher 题选择，最终在全部 830 道 BCP 上评测；summary harness 在 28,672 token 压缩、最多 100 轮。

| 方法 | 训练前 → 训练后准确率 | 每问 PFLOPs（前 → 后） |
| --- | --- | --- |
| Summary harness | 34.7 → 42.1 | 4.01 → 2.19 |
| CLM | 28.8 → 42.5 | 1.52 → 1.34 |

- 本笔记复算：CLM 相对自身提升 47.6%（42.5/28.8−1），FLOPs 降 11.8%；相对训练后的 summary harness 高 0.4 个百分点，同时少 38.8% FLOPs。训练前 CLM 比 summary 低约 6 个百分点。

### 数学开放问题（四项开放题）

四个 AlphaEvolve/OpenEvolve 风格问题，Claude 4.6 Sonnet、32K、100 次评分尝试或 5 小时，每种方法**只跑一次**：

| 方法 | Circle packing ↑ | Heilbronn ↑ | Min-max/min-dist ↑ | Erdős overlap ↓ |
| --- | --- | --- | --- | --- |
| OpenEvolve（OE） | 2.541 | 0.03127 | 0.07690 | 0.38123 |
| OE-Agent | 2.525 | 0.03053 | 0.07724 | 0.38167 |
| CLM | 2.618 | 0.03653 | 0.07758 | 0.38094 |
| CLM（SA，subagents） | **2.636** | 0.03617 | 0.07758 | 0.38109 |

- OpenEvolve 用 population 60 / 4 islands；OE-Agent 的 proposer 每个候选 25 轮；CLM(SA) 最多 5 个 subagent × 40 轮。
- CLM/CLM(SA) 在四个问题上都取得最高分：单 agent CLM 已高于 OE 的 2.541（+3.0%），Heilbronn +16.8%，min-max 略高，Erdős overlap 略低。每种方法只有一次运行，差异没有方差信息。

### EdgeBench-10

10 个（共 48 个可运行任务中选出）EdgeBench 任务，每个 3 个 seed，跑 12 小时，32K 预算；run 分数取最佳提交与最终仓库分中较高者；无 turn 上限；超预算时回滚上一轮最多 50 次；CLM+subagents 最多 6 个并发 subagent × 40 轮。

| 模型 / 方法 | 分数 | 每 trial prefix-reuse PFLOPs |
| --- | --- | --- |
| Qwen3.6-27B / Summary | 42.3 | 437 |
| Qwen3.6-27B / CLM | 44.6 | 179 |
| Qwen3.6-27B / CLM + subagents | 44.2 | 181 |
| Claude 4.6 Sonnet / Summary | 42.3 | — |
| Claude 4.6 Sonnet / CLM | 51.0 | — |
| Claude 4.6 Sonnet / CLM + subagents | 50.4 | — |

- 摘要的「5% higher with 59% fewer FLOPs」对应 Qwen3.6-27B 的 44.6 vs 42.3（+2.3 分，+5.4% 相对；本笔记复算）与 179 vs 437 PFLOPs（−59.0%）。
- 32K 预算下 subagent 在单仓库任务上几乎没有额外收益（44.2 < 44.6；50.4 < 51.0）。
- 128K 预算补充（附录 F）：CLM 47.3、CLM+subagents 50.2、Summary 47.8，分别用 142、219、222 PFLOPs。单 agent CLM 分数略低于 Summary 但便宜约 36%；只有加 subagent 才在分数上明显领先。

### Software World（Figure 6）

- 六个 agent 各负责一个仓库并行优化 24 小时以上；评估四个 agent 从未见过的下游包的 17 个 CPU benchmark；指标是 executed instructions 的几何平均加速比，坏掉的 benchmark 记 1.0；成本是累计 API 花费（USD）。模型 GPT-5.6-Sol、272K context、Pi harness。
- Figure 6b：Summary swarm 1.026×，CLM swarm 1.044×。
- 摘要/引言把这写成「same compute 下 65% greater improvement（或 65% greater end-to-end speedup）」。按图内标签复算，改进量之比为 $(1.044-1)/(1.026-1)\approx1.69$（约 69%），与 65% 的差异可能来自未取整的原始值；按加速比本身比只高 1.75%。

### 推理效率 SCR（Figure 9）

- BCP、Qwen3.6-27B：SCR 与标准 SGLang 的任务准确率同为 60.2%，每问 prefix-reuse FLOPs 从 10.98 降到 7.14 PFLOPs（本笔记复算：为原来的 65.0%，即减少 35.0%），与摘要里「server-side compute 降低 35%」一致。
- Figure 9 右图把 prompt token 拆成 prefix-cache hit、SCR 复用、prefill 三类：所有轮次里 SCR 额外复用 7.8% 的 token，编辑后的轮次里复用 28.2%。
- 这 7.8% 中有 5.3 个百分点来自 reasoning 剥离，只有 2.5 个百分点来自其他 context 编辑——**SCR 的收益很大一部分与 CLM 无关，普通 chat serving 也能吃到**（PDF Figure 12 / HTML Figure 14）。
- 剩余冗余主要来自混合模型下 SGLang 只在 request 边界存 recurrent state，导致缓存匹配在分支点附近回退到更短前缀；作者明确说这是当前 SGLang 实现的限制，不是 SCR 本身。
- K 敏感性：在 64 道 BCP 题上对 $K\in\{1,2,3,6,12,64\}$ 扫描，正文取 $K=6$，增益在 $K=6$ 基本饱和。

## 局限与待确认（完整版）

**作者明确讨论的**：

- **安全**：可编辑 context 是新的注入/持久化通道，防御留作未来工作。
- **Context length awareness**：现有 LM 估计自己用了多少 context 的能力很弱，长 context 下会给出 6.2K、9.8K、10.4K 这类「分桶」估计；Claude 4.6 Sonnet 倾向低估，GPT-5.4 最准。论文因此用「预算前 2,048 token 提醒」这种环境提示作为临时补丁，并指出未来应把这种信号学进模型（附录 G）。
- **serving 仍有冗余**：混合模型的 recurrent state 只在 request 边界存 checkpoint，导致 SCR 之外仍有大量可复用前缀被重算。

**读者视角的判断**：

- **ContextBench 是合成诊断集**，任务不需要搜索或推理；它证明了「固定策略会失败」，但不能证明真实任务上的收益来自同一机制。
- **数学优化每种方法只跑一次**，EdgeBench 只有 10/48 个任务、3 个 seed；跨方法的分数差异没有置信区间。
- **BCP 的预算口径**：正文与 Figure 5 写 32K context，附录 E 写 23,560-token budget；两者关系未解释，复现时需要先确认。
- **评测判分依赖模型**：BCP 用 Qwen3.5-27B 作 judge，RL 用 GPT-5.4-nano；判分模型的偏差没有单独分析。
- **RL 只在一个 9B 模型、一个训练集（OpenResearcher）上验证**，没有规模扫描或跨任务迁移实验。
- **TB2.1 的具体准确率未在正文给出**，只能确认「与最强基线持平」和 FLOPs 比例。
- **SCR 的近似性只在 64 题上做过 K 敏感性**，且只报告「没有观察到性能下降」；更大 K、更密集编辑下的行为未测。
- **同步语义未展开**：一次生成中多次修改文件时，哪一版进入下一轮，论文没有说明。

**未核实事项**：未运行仓库代码、未复现任何实验；Hugging Face 数据集可达性未验证；附录 Figure 10–22 未逐张渲染。

## 与本仓库其他条目的关系

（本笔记补充，仅作定位，不是原文内容。）

- 本仓库已读的 [HarnessX](../2606.14249-v3-harnessx/note.md)、[HarnessPro](../2610.26770-v2-harnesspro/note.md)、[Self-Harness](../2606.09498-v3-self-harness/note.md)、[HarnessPAI](../2609.29166-v2-harnesspai/note.md) 等条目，主线是**自动优化 harness**；CLM 的方向相反：把 context 更新权从 harness 移到模型，再用 in-context skill 进化或 RL 把策略学回去。两者可以在「harness-to-CLM distillation」这个未来方向上接上（§6 明确提出）。
- 与 [Harness^2](../2610.14224-v1-harness2/note.md) 一类「递归/自指 harness」相比，CLM 的自指发生在 **context 文件**这一层，而不是 harness 代码层；它的「自造角色、自造函数」是这种自指的轻量形态。
- 与 RLM（Recursive Language Models）是互补关系：RLM 把长输入放到 context 外按需读取，CLM 管理已经进入 context 的内容；论文在 §2 与附录 A 明确区分了「read-only 的 REPL 变量」与「read–write 的 live context」。

## 迁移索引

2026-11-28 读者版重写时，以下内容从 `note.md` 移入本文件：

- 原「来源信息」中的作者分工、通讯作者与邮箱、Subjects、许可差异、两个仓库的 star / commit / 创建日期、Hugging Face 未验证说明、PDF 页数与 sha256、HTML 版图号偏移；
- 原「阅读范围」整节（渲染清单、未渲染清单、未做事项）；
- 原「复核记录（2026-11-20，第 1 轮）」整节，另加 2026-11-28 重写记录；
- 原「§11 核对凭据」整节；
- 原「§9 原文自身的表述张力」整节，并补「163 次原地编辑的归属」一条；
- 原「§7 工程视角」整节（系统组成、接口与数据流、失败模式、安全）；
- 原「§6 实验结果」中的 ContextBench 任务表与预算细则、零样本设置与逐基准数字、Figure 5 读法、小模型对照、指令实验样本量与读数表、文本进化细节、RL 训练配置与 Table 2、数学优化四方法表与基线下设置、EdgeBench 六行表与 128K 补充、Software World 口径与复算、SCR 的 Figure 9 读数与 K 敏感性；
- 原「§8 局限与待确认」完整版（作者明说 + 读者判断 + 未核实事项），并补 SCR 近似性与同步语义两条；
- 原「§10 与本仓库其他条目的关系」整节。

`note.md` 保留的内容：来源信息表（标题、作者、机构、来源、版本、许可与代码、阅读日期）、一句话结论与 5 条要点、三层现有做法的瓶颈与诊断动机、核心想法（直觉、成立原因、对比表、`compact_turns` 例子、代价）、符号表与四条公式的逐项读法、ContextBench 设计、数据流、SCR 机制、指令 / 进化 / RL 三种学习方式、结构差异表、主结果表与 6 条结论、边界与局限、与其他工作的关系。
