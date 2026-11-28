# Context Language Models

## 来源信息

- **标题**：Context Language Models
- **作者**：Rulin Shao、Shannon Zejiang Shen、Junjie Oscar Yin、Yuetai Li、Minheng Wang、Hamish Ivison、Radha Poovendran、Nathan Lambert、Teng Xiao、Mike Lewis、Wen-tau Yih、Luke Zettlemoyer、Pang Wei Koh（共 13 人）
- **机构**：University of Washington（第一机构）、Meta Superintelligence Labs、MIT、Trillium Labs。Rulin Shao、Junjie Oscar Yin、Luke Zettlemoyer 同时署 UW 与 Meta Superintelligence Labs，Mike Lewis、Wen-tau Yih 只署 Meta；通讯作者为 Rulin Shao（p.1 的 Correspondence 行给出 `rulin@cs.washington.edu`）。原文没有共同一作标注。
- **arXiv**：[arXiv:2609.37725](https://arxiv.org/abs/2609.37725)，版本 **v1**（2026-09-29 提交，abs 页只有这一条提交记录；PDF 首页另标 `Date: September 30, 2026`）
- **Subjects**：cs.AI; cs.CL; cs.LG
- **许可**：arXiv 页为 [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/)；代码仓库另用 CC BY-NC 4.0
- **代码**：[facebookresearch/context-language-models](https://github.com/facebookresearch/context-language-models)，核验于 2026-11-19，默认分支 `main` 的 HEAD 为 `3c89408be27d34e9e8d14eade365a8d440b041e9`（2026-11-17），仓库创建于 2026-09-18，903 stars，许可 CC BY-NC 4.0。README 声明的模块包括 `clm/clm_harness`（基于 Harbor）、`clm/clm_icl`、`clm/clm_rl`、`clm/clm_contextbench`，以及 `suffix_cache_reuse/{sglang,vllm}`。
- **ContextBench**：代码仓库 [RulinShao/ContextBench](https://github.com/RulinShao/ContextBench)（Apache-2.0，2026-10-11 创建，同日最后一次 push，1 star，2026-11-19 核验）；论文 README 另称数据集发布在 Hugging Face，本次请求超时，未验证可达性。
- **原文**：阅读与核对使用 arXiv 官方 PDF `https://arxiv.org/pdf/2609.37725v1`，27 页，sha256 `ac5c926814434d8ad2f499183cd2a81e53b4c14f327587f99980ade9157db01b`（2026-11-19 抓取，下载字节数与 `Content-Length` 2,814,205 一致、文件尾有 `%%EOF`）。arXiv 论文不归档 PDF。
- **阅读日期**：2026-11-19

**阅读范围**

- 已通读 PDF 全部 27 页（正文 §1–§6、附录 A–G）与 arXiv HTML 版；HTML 版本完整（421,909 B，与 `Content-Length` 一致），但其图号与 PDF 不一致，且偏移随子图组增大（HTML 把 EdgeBench/Software World 的 (a)/(b) 子图各计一个 Figure：PDF Figure 6 = HTML Figure 8，+2；PDF Figure 18 = HTML 24，+6；PDF Figure 19 = HTML 27，+8），**本笔记的图号一律按 PDF**。
- 已渲染并逐项核对：p.2 Figure 1、p.4 Figure 2、p.5 Figure 3、p.6 Figure 4 与式 (5)(6)、p.7 Figure 5 与 Table 1、p.9 Figure 7/8/9 与 Table 2；p.8 Figure 6 只读 PDF 文字层，未单独渲染。
- 只按正文/图注/表格引用、未逐张渲染：附录 Figure 10–22（含 K 敏感性、128K EdgeBench、RL 曲线、context-length 校准图）；其数字均来自正文或图注，未做像素读数。
- 未做：复现实验、运行仓库代码、逐题重跑评测。

**复核记录（2026-11-20，第 1 轮）**

- 基准：arXiv v1 官方 PDF 重新下载并校验（2,814,205 B、`%%EOF`、27 页、sha256 `ac5c9268…7db01b`，与初读一致）；HTML 421,909 B。核对覆盖全文与附录 A–G。
- 方式：逐项核对元数据、数字、公式、引用定位、声称 vs 证据、读图、遗漏与内部一致性；本机复读 Figure 9 右图与 Figure 5(b) 的 600 dpi 裁剪；独立审计另渲染 p.4/p.7/p.9（300 dpi 整页）与 p.19 的局部图表（含 Figure 15），并用字体信息复核 Table 1 加粗。
- 修正：Figure 9 的 7.3%/28.3% → **7.8%/28.2%**；Figure 5(b) 由「两点几乎重合」改为「准确率相同、CLM 的 FLOPs 更低」；163 次原地编辑不再绑定 Erdős 第 455 步；删去「成功案例」推断；一句话总结把 Software World 从 prefix-reuse FLOPs 口径拆出、并给 EdgeBench 加 32K 限定；BCP 两次运行改为「同一 830 题、0.8 分差异来源未说明」；补充 ContextBench seeds 与 method-specific skill、EdgeBench 评分/无 turn 上限、Software World 的 executed-instructions 指标、RL checkpoint 选择、Figure 7 样本量、数学优化 baseline 设置、PDF 首页日期；修正 p.1「Correspondence」措辞、`§4.2` 指代、DPI 凭据与 Table 1 加粗范围；新增 Figure 5 avg. context 的表述张力。
- 复查：2026-11-20 重跑 GitHub API，代码仓库仍为 903 stars、pushed_at 2026-11-17，ContextBench 仓库仍为 1 star；README 的 `00233` 行与笔记单位一致。
- 沉淀到 skill（`read-paper-blog` / `check-paper-note` / `summarize-paper-methods`）：HTML 图号可能从正文中段开始偏移、幅度随子图组增大（+2 → +6 → +8）；堆叠条形图小号段标签在 170 dpi 全页会抄错一位（并用段标签加总复核）；Pareto 图「两点重合」要分别看两轴；同一段效率结论可能混用 FLOPs/USD/active hours；`qualitative examples` 不等于成功案例、计数可能只归到面板整体；`Correspondence:` 行按行类型记，不写成脚注。
- 补记（2026-11-20 复核 skill 时）：上一版把 HTML 图号偏移写成「只在附录」，实际 HTML 把 (a)/(b) 子图各计一个 Figure，PDF Figure 6 起 +2、PDF 18 起 +6、PDF 19 起 +8；已同步修正本笔记的阅读范围与三个 skill。
- 未修/未核：Hugging Face 数据集仍请求超时；附录 Figure 10–22 未逐张渲染；未运行代码、未复现实验。

## 一句话总结

CLM 把「上下文怎么维护」从外部 harness 的固定策略改成模型自己的原生能力：把当前 context 映射成一个可读写文件，模型用普通 Bash 命令任意改写它，改动即时同步回下一轮输入；在 BrowseComp-Plus、TerminalBench 与 32K 主设置的 EdgeBench 上，零样本 CLM 在同等或更低 prefix-reuse FLOPs 下达到或超过 Codex 式摘要、Self-Compact、ACM、RLM 等基线；24 小时六仓库任务则在同等 API 花费下取得更大的 held-out 加速改进。这套策略还能通过自然语言指令、文本进化与在线 RL 继续学。

![Figure 1：CLM 总览。(a) 定性例子；(b) 零样本在 BrowseComp-Plus 与 Software World 上更好且更省；(c) 用一句话指令或 skill 进化改变 context 策略；(d) 用 success-gated efficiency advantage 做 stepwise GRPO。](assets/fig1-overview.png)

## 1. 问题与动机

论文的出发点是：**context 是 LM 处理长程信息的基础，但 context 管理一直不是 LM 的原生能力**。现有做法主要有三层：

1. **harness 调度**：Cursor、Codex、Terminus2 等按预设长度阈值触发压缩，压缩流程也由 harness 规定；MEM1 则每轮都重写 context。RL 可以训练模型在压缩下保住信息，但「何时压缩、怎么压缩」仍由 harness 决定。
2. **受限动作空间**：AutoCompact、Self-Compact 让模型决定何时压缩；Context-as-a-Tool 暴露模型可触发的压缩；ACM 增加 offload/retrieval；Sculptor 允许选择片段操作。模型自主性逐步提高，但动作仍是人预先定义的。
3. **context 作为环境变量**：RLM 把长输入放进 REPL 变量供模型按需读取，解决了「读什么进来」，但没有让模型编辑**正在生长的 live context**——读进来的内容仍然只追加、不删除。

作者把这三种做法概括为「人先验」的不断放宽，并用 Sutton 的 The Bitter Lesson 作类比：与其继续设计更好的压缩规则，不如把 context 的写权限直接交给模型，让它自己搜索策略。CLM 的差别不是「再多一个工具」，而是让模型的输出不再是唯一的 context 更新来源：

```math
c_{t+1} = f^{\mathrm{CLM}}_{\theta}(c_t)
```

$c_{t}$ 是第 $t$ 轮的 context，$f^{\mathrm{CLM}}_{\theta}$ 是模型可控制的任意函数；标准 LM 只是把新 token 追加到旧 context（$c_{t+1} = c_{t} \oplus f^{\mathrm{LM}}_{\theta}(c_{t})$）。因此 CLM 在形式上覆盖了「harness 提供一组 context 工具」的做法，区别在于这些函数不必由 harness 预定义，模型可以自己规划，甚至显式定义可复用函数。

## 2. ContextBench：把 context 管理与推理能力拆开

在提出方法前，作者先做了一个诊断性 pilot（§3），核心问题是：**如果任务本身不需要搜索或推理，只是「记住 / 原地更新 / 卸载后取回」，现有 context 管理策略能做好吗？**

ContextBench 的设计要点（附录 D）：

- 输入以**连续对话中的新 user message** 形式逐条到达，操作在 agent 能处理之前就已经进入 context，任何 harness 都无法在入口处截断或卸载。
- agent 只控制「下一条操作什么时候来」：处理完当前操作后执行 `echo READY_FOR_NEXT_OP`。
- 32,768 token 的 context 上限中预留 2,048 给回答，可用预算 30,720；单条操作不超过可用预算的 1/5，任务要求保留的内容不超过 1/2，各留 10% 余量，避免「任务本身放不下」被误判成 context 管理失败。
- 指标只从 agent 的 context 计算，**只存在文件里的答案不算分**——这一点决定了 offload 类方法必须把答案取回到 context。

四个任务（Table 3）：

| 任务 | 输入流 | 查询 | 指标 |
| --- | --- | --- | --- |
| Needle Retention | 约 4K token 的块，每块 2–8 行 needle、140 行 filler | 无 | 最终 context 中逐字保留的 needle 行 |
| Sudoku Sketchpad | 每轮一个 16×16 棋盘移动 | 每次移动后的当前棋盘 | 精确复现的棋盘版本数 |
| KV Store | 每批 100 条 SET，值为随机 24 词 | 24 个 GET | 精确值准确率 |
| Log Triage | 每批 14–54 行服务日志 | 24 个查找/计数查询 | 精确答案准确率 |

context pressure 定义为「整个 episode 环境推送的总输入 / 32,768」，`1×` 就是「全保留刚好填满」的点；各任务通过一个生成器参数把压力推到 24×（Needle、KV）、8×（Sudoku）、16×（Log Triage），并保留低于 `1×` 的控制组。

比较时每个方法都收到与自身机制配套的 skill（四类指导相同，附录 D），每个压力档跑 4 个 seed、部分档 8 个。用 GPT-5.4、32K 上限比较 Base（Mini-SWE-Agent）、Codex-style Summary、Context Folding、RLM、Self-Compact、ACM 与 CLM 后，结论是**没有一个现有方法能在这些简单任务上做到完美**（Figure 2）：摘要式压缩会在 Needle Retention 与 Sudoku 上丢信息或幻觉；没有原地编辑能力的方法在每次细粒度修改时都得重写整个棋盘；普通 coding 工具能把 KV/Log 卸载到文件，却不能在需要时把旧内容从 live context 里清掉。图中 CLM 是唯一在四个任务的所有压力档上都保持 1.0 的方法（低压力档也有基线能到 1.0，但没有一个跨全部档保持），其余方法随压力上升明显下滑。这个 pilot 是全文的动机来源，但它只覆盖合成任务，不能直接外推到真实长程任务。

## 3. 方法：context as a file

### 3.1 实现

CLM 的实现非常「工程化」，几乎没有新模型结构：

1. 把 LM 的 live context **镜像成一个可直接编辑的文件**，并把路径写进 system prompt。
2. 模型用通用 Bash 命令编辑这个文件，和编辑其他文件没有区别。
3. 与普通文件不同的是，**对 context 文件的修改会立即同步到 LM 的 context**，并送到推理服务器继续生成。
4. 如果模型不编辑文件，生成的 token 默认追加到现有 context。

这个设计的关键取舍是：**保留 prefix cache 的复用能力，同时允许任意位置编辑**。默认追加保证常见路径仍然只做增量 prefill；只有模型主动改写时才付出重算代价（第 4 节度量）。

工程细节（附录 E）：CLM 在预算前 2,048 token 收到一次「该编辑 context 了」的提醒，base harness 本身没有触发器；BCP 与 RL 设置中，编辑轮不计入 turn 上限。

### 3.2 多智能体扩展

多个 context 文件可以共存，并分别与各自的 LLM server 保持同步：agent swarm 通过在工作区初始化多个 context 文件实现；subagent 则通过创建/删除额外 context 文件来启动和终止。这把「子 agent 的生命周期」也变成了 context 文件操作，而不是另一套调度 API。

### 3.3 零样本下涌现出的行为

Figure 3 给出五个来自 §5.1 零样本实验的具体例子（均为定性案例）：

- **多 agent 编排**：Figure 3(a) 展示 CLM 用 in-place 编辑维护 in-context scoreboard 和 agent 状态（图中例子包括 Erdős minimum overlap 第 455 步、Circle packing 第 194/198 步）；正文说这类状态更新累计 **163 次原地编辑**后 context 仍只有 6–8K token，但没有把 163 次对应到某个具体任务或步骤。
- **自造角色**：在 BrowseComp-Plus 第 40 步，它用正则把某段对话改写成 `role=notes`，在原模板角色之外创建一个「内部笔记」角色。
- **写循环做批量压缩**：在 BrowseComp-Plus 第 1509 步，用 for 循环把无关搜索结果替换成「Searched: … No relevant results.」；第 13 步用 while 循环按长度截断过长的工具输出。
- **定义并复用函数**：第 109 步定义 `compact_turns`，之后调用 37 次，在压缩细节观察的同时维护一条 progress note。
- **复现已有基线的有效行为**：第 20 步把 21K token 压成与答案相关的摘要；Circle packing 第 332 步保留 untried ideas 供后续探索。

这些例子说明 CLM 不是把「压缩」换了个触发者，而是可以**发明新的 context 结构**（记分板、内部角色、可复用函数）。但它们是论文挑选出来的定性示例（未说明是否来自成功轨迹），也没有统计这类行为出现的频率或与成绩的因果关系。

## 4. 效率：prefix-reuse FLOPs 与 Suffix Cache Reuse

### 4.1 为什么不能只看 FLOPs/token

context 中间被改写后，标准 prefix cache 只能复用第一个不匹配位置之前的部分，**后面的 token 即使文本没变也要重新 prefill**。因此作者用 **prefix-reuse FLOPs** 度量整条轨迹的推理成本：

```math
\mathrm{FLOPs}_{\mathrm{prefix}\text{-}\mathrm{reuse}} = \mathrm{FLOPs}_{\mathrm{prefill}}(\text{unmatched context suffix}) + \mathrm{FLOPs}_{\mathrm{decode}}(\text{generated tokens})
```

即「从第一个 prefix mismatch 起的 suffix prefill」加「新生成 token 的 decode」，而不是简单累加每轮 context 长度。附录 C 给出按模型结构展开的公式，并区分 full-attention 与 Gated DeltaNet 层：线性层每 token 成本与 context 长度无关，只有 full-attention 层有随长度增长的注意力项。

以 Qwen3.6-27B 为例（附录 C）：$L=64$、$d=5120$、$d_{\mathrm{ff}}=17,408$，其中 16 层 full attention、48 层 Gated DeltaNet；代入后 $C_{\mathrm{token}} = 48.70\times 10^{9}$ FLOPs/token（MLP 34.23、full-attention 投影 3.36、DeltaNet 投影 11.12），注意力项 $C_{\mathrm{attn}} = 3.93\times 10^{5}$ FLOPs/query-key pair。一个示意性单轮（$P_{t}=20,000$、$G_{t}=500$）：

| 可复用前缀 $R_{t}$ | 该轮 FLOPs | 相对 append-only |
| --- | --- | --- |
| 18,000（仅追加） | $1.41\times 10^{14}$ | 1× |
| 10,000（中间编辑） | $5.74\times 10^{14}$ | 约 4.1× |
| 0（开头编辑） | $10.81\times 10^{14}$ | 7.7× |

这张表解释了为什么「允许任意编辑」必须配合服务端优化：一次靠前的编辑就能让单轮成本接近 8 倍。

### 4.2 Suffix Cache Reuse（SCR）

SCR 的思路是：编辑把 $B$ 换成 `B'` 后，后缀 $C$ 的文本没变，**不必重算 $C$ 的 KV，只需把它的缓存搬到新位置**。

![Figure 4：标准 serving 与 Suffix Cache Reuse 的对比。标准 serving 只复用匹配前缀，SCR 复用所有存活 token 的缓存，只 prefill 新插入的 `B'`。](assets/fig4-scr.png)

实现要点（附录 B）：

- 作为 **SGLang 的 patch** 实现。新 prompt 到达时，与同一 session 的上一版 prompt 做 diff，找出编辑后仍存活的 span，按长度从大到小最多迁移 $K$ 个（正文 $K=6$）。
- 对每个迁移的 span，复用其 cached keys/values，**把 key 的 RoPE 旋转位置重新对齐到新位置**，再拼到 `B'` 之后；只 prefill `B'` 和新追加的 token。
- 迁移后的条目放在 **session 私有的 cache slot**，不写进共享 radix tree；分配不到 slot 时回退到标准 re-prefill。
- 复用状态是在编辑前的前缀下算出来的，因此 SCR 是**近似**而非精确重算；$K$ 用来限制一次编辑引入的近似量，$K=6$ 是在 64 道 BCP 题上对 $K\in \{1,2,3,6,12,64\}$ 做敏感性分析后的保守选择（增益在 $K=6$ 基本饱和）。
- **混合架构**：Qwen3.6-27B 的 64 层里有 48 层线性注意力，只有固定大小的 recurrent state，没有 token 级缓存。SCR 在编辑前对 recurrent state 做快照并从快照继续，插入的 `B'` 在这些层里不被重算，只通过 16 层 full attention 影响后续输入。
- **推理 token 剥离**：Qwen3.6 默认 chat template 与无状态 Chat Completions 会在下一轮剥掉历史 reasoning token，标准 serving 因此要重算后续所有保留文本。SCR 把「剥离」也当成一次编辑来复用缓存。PDF 的 Figure 12（对应 HTML 的 Figure 14）显示，在 SCR 额外复用的 7.8% prompt token 中，5.3 个百分点来自 reasoning 剥离，只有 2.5 个百分点来自其他 context 编辑——也就是说，**SCR 的收益很大一部分与 CLM 无关，普通 chat serving 也能吃到**。

主结果（Figure 9）：在 BCP、Qwen3.6-27B 上，SCR 与标准 SGLang 的任务准确率同为 60.2%，每问 prefix-reuse FLOPs 从 10.98 降到 7.14 PFLOPs（本笔记复算：为原来的 65.0%，即减少 35.0%），与摘要里「server-side compute 降低 35%」一致。

## 5. 让 context 管理变成可学习的能力

### 5.1 自然语言指令就能改策略

把一段策略说明 $s$ 作为额外 in-context 指导，CLM 的转移变成 $c_{t+1} = f^{\mathrm{CLM}}_{\theta}(c_{t}; s)$。作者用三句话分别诱导三种行为（Figure 7，Claude 4.6 Sonnet、BCP、无预算提醒；阈值实验 30 道长题/48K/200 轮，边界实验 189 sessions/条件、131 个含边界、24K/1,000 轮，备份实验 200 题、91 对、16K）：

| 指令 | 度量 | 无指令 | 有指令 |
| --- | --- | --- | --- |
| 「超过 Y token 就压到约 4K」 | 首次压缩时的 context 中位数（Y=16k/24k/32k） | 未触发压缩（图中以 40k 上限虚线表示） | 16.0k / 23.6k / 30.9k |
| 「只在子问题边界压缩」 | 边界当轮压缩率；边界后 2 轮内压缩率 | 0.34；0.40 | 0.77；0.88 |
| 「压缩前先备份」 | 编辑前有完整备份的比例 | 0.00 | 0.68（另有 0.09 为部分备份） |

这组实验的意义是：context 策略可以像普通 prompt 行为一样被「说」出来，不需要改 harness 或模型参数。代价是策略仍依赖模型愿意遵守指令，论文没有报告指令不生效的比例。

### 5.2 文本进化：把有效策略写成 skill 文档

更进一步的优化目标是找到一份 skill 文档 `s*`，使训练分布上的期望回报最大：

```math
s^{*} = \arg\max_{s} \mathbb{E}_{x\sim\mathcal{D}}\left[R\!\left(\tau(x;s)\right)\right]
```

其中 $\tau(x;s)$ 是在指令 $s$ 下跑出的轨迹，$R$ 是轨迹级奖励，优化时其他部分固定。实现是一个 prompt-evolution 循环：每轮 agent 在训练 split 上 rollout，proposer 根据轨迹提出候选 skill，在 dev split 上评估并选出下一轮的 skill，最后在冻结后用 test split 评一次。proposer 可以是更强的外部模型（assisted evolution），也可以是 agent 自己（self-evolution）。

在 ContextBench 上（32K 预算）：

- **assisted evolution**（Qwen3.6-27B 作 agent，Claude Fable 5.1 作 proposer）：dev 准确率 Needle 97.6→100.0、Sudoku 45.3→65.8、KV Store 22.3→83.8、Log Triage 0.0→100.0。
- **held-out test**：KV Store 38.3→74.2，即摘要里说的「up to 35.9 points」——这个 35.9 是**留出集上 KV Store 单任务的提升**，不是四个任务的平均，也不是 dev 上的最大提升。
- **self-evolution**（Opus 5 同时作 agent 与 proposer）：起点已在 94–100%，进化主要是在同准确率下降成本，或继续小幅提分。

### 5.3 在线 RL：把策略写进权重

由于 context 编辑会改变后续输入，不能把整条轨迹当成一次普通的自回归样本。作者用 **stepwise GRPO**：对每个 prompt 采样一组完整轨迹，用轨迹级结果奖励算标准 GRPO advantage，再把该 advantage 分配给轨迹里的每个 segment，使每次模型调用都用整条轨迹的结果来训练。

只有结果奖励不够：成功轨迹里可能有低效编辑，失败轨迹里也可能有有用的编辑；而直接奖励「编辑次数」或「删掉的 context 量」会被 reward hacking（乱改、丢关键信息、破坏 prefix reuse）。因此作者加了一个 **success-gated efficiency advantage**：只在同一组的成功轨迹内部，按 prefix-reuse FLOPs 重新排序。

```math
A_i^{\mathrm{eff}} =
\begin{cases}
\operatorname{clip}\!\left(\dfrac{\bar{c}_g - c_i}{\bar{c}_g},\,-1,\,1\right), & i \in \mathcal{G}_g^{+},\\[4pt]
0, & i \notin \mathcal{G}_g^{+},
\end{cases}
```

$c_{i}$ 是轨迹 $i$ 的 prefix-reuse FLOPs，$G_{g}^+$ 是组 $g$ 中成功的轨迹集合，$\bar{c}_{g}$ 是这些成功轨迹的平均成本。若成功轨迹少于两条，则所有 $A_{i}^{\mathrm{eff}}$ 置 0。最终 advantage 为 $A_{i} = A_{i}^{\mathrm{out}} + w_{\mathrm{eff}} \cdot A_{i}^{\mathrm{eff}}$（$w_{\mathrm{eff}} = 0.25$），既奖励「做对」，也在做对的里面奖励「更省」。

训练配置（附录 E）：Qwen3.5-9B，3,040 条 OpenResearcher 深搜 prompt，GRPO，截断重要性采样、KL 系数 0.01、动态采样去掉无奖励方差的组；每步 8 个 prompt × 32 rollouts，学习率 `1e-6`、weight decay 0.1、clip `[0.2,0.28]`，训练 70 步；28K context 预算、2,048 预留、80 轮；奖励来自 GPT-5.4-nano 按 DeepSearchQA rubric 打的二值分，另有失败工具调用与格式错误的惩罚。策略用 16 张 H200，rollout 用 48 张。checkpoint 按 500 道 held-out OpenResearcher 题选择，最终在全部 830 道 BCP 上评测；summary harness 在 28,672 token 压缩、最多 100 轮。

结果（Table 2，BCP 留出集）：

| 方法 | 训练前 → 训练后准确率 | 每问 PFLOPs（前 → 后） |
| --- | --- | --- |
| Summary harness | 34.7 → 42.1 | 4.01 → 2.19 |
| CLM | 28.8 → 42.5 | 1.52 → 1.34 |

即 CLM 相对自身提升 47.6%（本笔记复算：42.5/28.8−1），FLOPs 降 11.8%；相对训练后的 summary harness 高 0.4 个百分点，同时少 38.8% FLOPs。注意训练前 CLM 比 summary 低约 6 个百分点——小模型并不天然会管 context，RL 才把这项能力补上。

## 6. 实验结果

### 6.1 编码与深搜：零样本、不训练

设置：Qwen3.6-27B、32K context；Figure 5 图注统一写 100 轮上限，附录 E 则写 BCP 100 轮、TB2.1/TBLite 64 轮。所有方法共用 Mini-SWE-Agent backbone，比较 MEM1、Self-Compact、ACM、RLM 与 Codex-style Summary，全部 out-of-the-box。baseline 的 harness 设置：Summary 在 75% 预算压缩，Self-Compact 超过 37% 后每两轮询问，MEM1 是作者复现的推理循环，RLM/ACM 用 released code。

| 基准 | CLM | 最强基线 | 相对差 | 计算 |
| --- | --- | --- | --- | --- |
| BrowseComp-Plus（830 题） | 59.4% | Codex-style Summary（由 11.4% 相对差反推约 53.3%，本笔记复算） | +11.4% 相对 | 比 Summary 少 21.5% FLOPs，比 MEM1 少 28.9% |
| TerminalBench 2.1（89 题） | 与 Summary 持平（正文未给具体数值） | Codex-style Summary | 0 | 为 Summary 的 70% FLOPs（引言写作少 29.5%） |
| TBLite | 73.7% | Summary 67.0% | +6.7 个百分点，+10.0% 相对 | 为 Summary 的 91% FLOPs |

Figure 5 把准确率对 prefix-reuse PFLOPs 画成三个面板，CLM 在三个基准上都位于 Pareto 前沿。TB2.1 面板里两者的准确率几乎相同，但 CLM 的 prefix-reuse PFLOPs 更低（§5.1.1 写为 Summary 的 70%）；正文只说「match」、未给具体准确率，本笔记不据图反推数值。

小模型对照（附录 F）：Qwen3.5-9B 在 BCP 上 CLM 39.9% vs Summary 37.7%；在 TerminalBench 2.1 上，9B 平均每题只编辑 1.4 次、一半任务完全不编辑，27B 是 2.6 次；9B 的 context 峰值中位数 30.2K（32K 上限），27B 为 17.6K。作者据此认为 CLM 的收益随模型「决定何时编辑」的能力增长。

### 6.2 数学开放问题：与专用进化工作流比

四个 AlphaEvolve/OpenEvolve 风格问题，Claude 4.6 Sonnet、32K、100 次评分尝试或 5 小时、每种方法**只跑一次**：

| 方法 | Circle packing ↑ | Heilbronn ↑ | Min-max/min-dist ↑ | Erdős overlap ↓ |
| --- | --- | --- | --- | --- |
| OpenEvolve（OE） | 2.541 | 0.03127 | 0.07690 | 0.38123 |
| OE-Agent | 2.525 | 0.03053 | 0.07724 | 0.38167 |
| CLM | 2.618 | 0.03653 | 0.07758 | 0.38094 |
| CLM（SA，subagents） | **2.636** | 0.03617 | 0.07758 | 0.38109 |

OpenEvolve 用 population 60 / 4 islands，OE-Agent 的 proposer 每个候选 25 轮，CLM(SA) 最多 5 个 subagent × 40 轮。CLM/CLM(SA) 在四个问题上都取得最高分：circle packing 的最高分来自带 subagent 的 2.636（单 agent CLM 2.618 也已高于 OE 的 2.541，+3.0%），Heilbronn +16.8%，min-max 略高，Erdős overlap 略低（越低越好）。由于每种方法只有一次运行，这些差异没有方差信息。

### 6.3 EdgeBench-10：12 小时单仓库优化

10 个（共 48 个可运行任务中选出的）EdgeBench 任务，每个 3 个 seed，跑 12 小时，32K 预算；run 分数取最佳提交与最终仓库分中较高者，无 turn 上限，超预算时回滚上一轮最多 50 次，CLM+subagents 最多 6 个并发 subagent × 40 轮：

| 模型 / 方法 | 分数 | 每 trial prefix-reuse PFLOPs |
| --- | --- | --- |
| Qwen3.6-27B / Summary | 42.3 | 437 |
| Qwen3.6-27B / CLM | 44.6 | 179 |
| Qwen3.6-27B / CLM + subagents | 44.2 | 181 |
| Claude 4.6 Sonnet / Summary | 42.3 | — |
| Claude 4.6 Sonnet / CLM | 51.0 | — |
| Claude 4.6 Sonnet / CLM + subagents | 50.4 | — |

摘要里的「5% higher with 59% fewer FLOPs」对应 Qwen3.6-27B 的 44.6 vs 42.3（+2.3 分，+5.4% 相对；本笔记复算）与 179 vs 437 PFLOPs（−59.0%）。在 32K 预算下，subagent 在这个单仓库任务上几乎没有额外收益。

128K 预算的补充结果（附录 F）更微妙：CLM 47.3、CLM+subagents 50.2、Summary 47.8，分别用 142、219、222 PFLOPs。**单 agent CLM 在分数上略低于 Summary，但便宜约 36%**；只有加 subagent 才在分数上明显领先。这与「CLM 全面更好」的简化叙述不完全一致。

### 6.4 Software World：24 小时六仓库 agent swarm

六个 agent 各负责一个仓库并行优化 24 小时以上，评估四个 agent 从未见过的下游包的 17 个 CPU benchmark；指标是 executed instructions 的几何平均加速比，坏掉的 benchmark 记 1.0，成本是累计 API 花费（USD）。GPT-5.6-Sol、272K context、Pi harness。

Figure 6b 给出 held-out speedup：Summary swarm 1.026×，CLM swarm 1.044×。摘要/引言把这写成「same compute 下 65% greater improvement（或 65% greater end-to-end speedup）」。按图内标签复算，相对初始版本的**改进量**之比是 $(1.044-1)/(1.026-1)\approx1.69$，即约 69%，与 65% 的差异可能来自未取整的原始值；若按加速比本身比，则只高 1.75%。读这个数字时要先确认「65%」指的是改进量之比，而不是加速比之比。

### 6.5 推理效率（SCR）

见本笔记 §4.2（论文 §4.3）：BCP 上准确率 60.2% 不变，每问 10.98→7.14 PFLOPs；右图把 prompt token 拆成 prefix-cache hit、SCR 复用、prefill 三类，所有轮次里 SCR 额外复用 7.8% 的 token，编辑后的轮次里复用 28.2%。剩余冗余主要来自混合模型下 SGLang 只在 request 边界存 recurrent state，导致缓存匹配在分支点附近回退到更短前缀——作者明确说这是当前 SGLang 实现的限制，不是 SCR 本身。

## 7. 工程视角

**系统组成**（据仓库 README 与目录，未运行代码）：

- `clm/clm_harness`：基于 Harbor 的 CLM agent，目录含 `context_env`、`context_utils`、`flops_metrics`、`task_templates` 等（具体职责未逐个读代码，仅按 README 与目录名定位）。
- `clm/clm_icl`：in-context 策略进化；`clm/clm_rl`：RL 训练；`clm/clm_contextbench`：ContextBench 接入。
- `suffix_cache_reuse/sglang` 与 `suffix_cache_reuse/vllm`：两种 serving 后端的 SCR 实现。README 还给出 `pi install npm:@lolipopshock/pi-clm` 与社区维护的 OpenCode 插件。

**关键接口与数据流**：agent 每轮生成 → 若调用 Bash 修改 context 文件 → 同步层把新文件内容作为下一轮 prompt 发给 server → server 端 prefix cache 命中相同前缀，SCR 再迁移存活后缀。这里有两个容易出问题的点：

1. **同步语义**：文件写入必须原子地反映到下一次请求；如果模型在一次生成中多次修改，需要明确哪一版是下一轮的输入。论文只描述了「每次修改立即同步」，没有展开并发/中途修改的细节。
2. **成本模型依赖 tokenizer 与模型结构**：附录 C 的常数是按 Qwen3.6-27B 的结构算的，换模型要重算 $C_{\mathrm{token}}$、$C_{\mathrm{attn}}$；论文的跨方法比较都在同一 base LM 下进行，不能把绝对 PFLOPs 直接搬到别的模型。

**失败模式**（论文提到或可直接推出）：

- SCR 复用旧前缀下算出的状态，是近似；$K$ 越大、一次编辑的存活 span 越多，近似累积越明显。论文的敏感性分析只到 64 题规模，且只报告「没有观察到性能下降」。
- 分配不到 session-private slot 时回退到完整 re-prefill，最坏情况退化为标准 serving。
- 模型可能做出破坏 prefix reuse 的编辑（例如频繁改开头），效率奖励正是为了抑制这类行为；但奖励只作用于成功轨迹，失败轨迹里的低效编辑不会被直接纠正。
- **安全**：模型对自己的 context 有写权限，prompt injection 或模型自己生成的指令可以跨轮持久化。作者在 §6 明确把这一点列为新的攻击面，并引用已有观察（模型在压缩摘要里插入未授权指令），但没有给出防御或评测。

## 8. 局限与待确认

作者明确讨论的：

- **安全**：可编辑 context 是新的注入/持久化通道，防御留作未来工作。
- **Context length awareness**：现有 LM 估计自己用了多少 context 的能力很弱，长 context 下会给出 6.2K、9.8K、10.4K 这类「分桶」估计；Claude 4.6 Sonnet 倾向低估，GPT-5.4 最准。论文因此用「预算前 2,048 token 提醒」这种环境提示作为临时补丁，并指出未来应把这种信号学进模型（附录 G）。
- **serving 仍有冗余**：混合模型的 recurrent state 只在 request 边界存 checkpoint，导致 SCR 之外仍有大量可复用前缀被重算。

本笔记认为需要额外注意的：

- **ContextBench 是合成诊断集**，任务不需要搜索或推理；它证明了「固定策略会失败」，但不能证明真实任务上的收益来自同一机制。
- **数学优化每种方法只跑一次**，EdgeBench 只有 10/48 个任务、3 个 seed；跨方法的分数差异没有置信区间。
- **BCP 的预算口径**：正文与 Figure 5 写 32K context，附录 E 写 23,560-token budget；两者关系未解释，复现时需要先确认。
- **评测判分依赖模型**：BCP 用 Qwen3.5-27B 作 judge，RL 用 GPT-5.4-nano；判分模型的偏差没有单独分析。
- **RL 只在一个 9B 模型、一个训练集（OpenResearcher）上验证**，没有规模扫描或跨任务迁移实验。
- **TB2.1 的具体准确率未在正文给出**，只能确认「与最强基线持平」和 FLOPs 比例。

## 9. 原文自身的表述张力

- **Software World 的 65%**：图内标签是 1.026 与 1.044，按「改进量之比」复算约 69%，按「加速比之比」只有 1.75%。原文用「65% greater improvement / 65% greater end-to-end speedup」两种措辞，读者容易把后者理解成加速比高 65%。同一段还分别用 same compute（摘要、引言）、same spend（§5.1.2）描述「同等投入」，而 Figure 6b 的横轴是 active hours，三种口径未对齐。
- **TB2.1 的 FLOPs**：引言写「29.5% fewer FLOPs」，§5.1.1 写「only 70% of its FLOPs」（即少 30%）；两者在取整范围内一致，但同一事实用了两种口径。
- **BCP 的两个准确率**：主结果（Figure 5、§5.1.1）是 59.4%，SCR 实验（Figure 9）里标准 serving 与 SCR 都是 60.2%。两次都是同一 830 题（附录 E 与 Figure 12 图注），按附录 E 的统一设置 judge 是 Qwen3.5-27B；但 0.8 分的差异来源（serving 设置、预算或随机性）未说明，引用时不要混用。
- **轮数上限**：Figure 5 图注写「All methods ... a 100-turn cap」，附录 E 的 TerminalBench 2.1 与 TBLite 却是「Every method is limited to 64 turns」；BCP 的 100 轮与附录一致。按各基准的附录设置复现更稳妥。
- **「CLM 在四个数学问题上都最高」**：circle packing 的最高分 2.636 来自 CLM(SA)，单 agent CLM 是 2.618；表格加粗也标在 CLM(SA) 的 2.636 上。本笔记理解正文的「CLM」在这里是包含 subagent 变体的统称。
- **「up to 35.9 points」**：指 KV Store 的 held-out test（38.3→74.2），不是 dev 上更大的 Log Triage（0→100）或 Sudoku（45.3→65.8）；摘要只说「on a context-management task」，没有点名 KV Store，容易被读成四个任务的平均或最大值。
- **ContextBench 的「24×」**：只有 Needle 与 KV 推到 24×，Sudoku 到 8×、Log Triage 到 16×；「up to 24×」是全集上限，不是每个任务都到 24×。
- **Figure 5 的 avg. context**：三个面板分别标 `avg. context 97K / 47K / 33K`，但实验写的是 32K context limit（BCP 附录还写 23,560 token budget）；这个「平均 context」的口径原文没有解释，不能直接当成 context window。

## 10. 与本仓库其他条目的关系

（本笔记补充，仅作定位，不是原文内容。）

- 本仓库已读的 [HarnessX](../2606.14249-v3-harnessx/note.md)、[HarnessPro](../2610.26770-v2-harnesspro/note.md)、[Self-Harness](../2606.09498-v3-self-harness/note.md)、[HarnessPAI](../2609.29166-v2-harnesspai/note.md) 等条目，主线是**自动优化 harness**；CLM 的方向相反：把 context 更新权从 harness 移到模型，再用 in-context skill 进化或 RL 把策略学回去。两者可以在「harness-to-CLM distillation」这个未来方向上接上（§6 明确提出）。
- 与 [Harness^2](../2610.14224-v1-harness2/note.md) 一类「递归/自指 harness」相比，CLM 的自指发生在 **context 文件**这一层，而不是 harness 代码层；它的「自造角色、自造函数」是这种自指的轻量形态。
- 与 RLM（Recursive Language Models）是互补关系：RLM 把长输入放到 context 外按需读取，CLM 管理已经进入 context 的内容；论文在 §2 与附录 A 明确区分了「read-only 的 REPL 变量」与「read–write 的 live context」。

## 11. 核对凭据

- PDF：27 页，sha256 见来源信息；文本抽取使用 Miniconda 的 `pymupdf`，页数用 `pymupdf.open(...)` 复核。
- 渲染：`pymupdf` 渲染并目视核对 p.2（Figure 1，150 dpi）、p.4（Figure 2，200 dpi）、p.5（Figure 3，170 dpi）、p.6（Figure 4/式 5/式 6，200 dpi）、p.7（Figure 5/Table 1，200 dpi）、p.9（Figure 7/8/9、Table 2，整页 170 dpi；Figure 7 另以 300 dpi 局部裁剪读数）；p.8（Figure 6）未单独渲染，1.026/1.044 取自该页 PDF 文字层。
- 表格加粗：用 `page.get_text('dict')` 的 span `font` 核对 Table 1（`OptimisticDisp-Bd` 为加粗），确认 2.636 与 (CLM, SA) 的 0.07758 为加粗，2.618 未加粗。
- 公式：式 (2)(3)(6) 与渲染页逐条对照；式 (6) 的分段、`clip(...,−1,1)` 与「成功轨迹少于两条时置 0」均按 p.6 原文。
- 图内读数：Figure 7 的 0.34/0.40/0.77/0.88、0.68/+0.09、16.0k/23.6k/30.9k 取自 300 dpi 裁剪；Figure 6b 的 1.026/1.044 取自 p.8 的 PDF 文字层（未单独渲染该页）。
- 代码仓库信息：GitHub REST API 于 2026-11-19 查询（`/repos/facebookresearch/context-language-models`、`/commits/main`、`/license`；`/repos/RulinShao/ContextBench`）；未运行仓库代码，未验证其与论文实验的可复现性对应。
- 未核：Hugging Face 上的 ContextBench 数据集（请求超时）；附录 Figure 10–22 未逐张渲染；未做像素测量。
