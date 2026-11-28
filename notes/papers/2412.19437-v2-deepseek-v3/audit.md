# DeepSeek-V3 — 复核档案

> 本文件是维护性档案，不参与站点构建；读者版正文见同目录 `note.md`。

## 来源与版本

- **标题**：DeepSeek-V3 Technical Report。
- **作者**：DeepSeek-AI（arXiv 元信息记 “DeepSeek-AI and 199 other authors”；Appendix A 按 Research & Engineering / Data Annotation / Business & Compliance 三节、名字字母序列出，`*` 标注已离职；未标通讯作者，联系方式 research@deepseek.com）。
- **机构**：DeepSeek-AI。
- **来源**：[arXiv:2412.19437v2](https://arxiv.org/abs/2412.19437)（[PDF](https://arxiv.org/pdf/2412.19437v2)）；本笔记按 v2 阅读。
- **Subjects**：cs.CL（primary）；cs.AI。
- **日期**：v1 提交 2024-12-27；v2 提交 2025-02-18（PDF CreationDate 2025-02-19）。
- **阅读日期**：2026-11-22。
- **许可**：arXiv 页 “view license” 指向 `nonexclusive-distrib/1.0`（非 CC）。
- **版本**：截至 2026-11-22，arXiv 只有 v1/v2，v2 为最新；53 页；v2 PDF sha256 `812a3fd645c80725354de9d831a6785503007a60681461407f64e97305fa9330`；v1 sha256 `a67e18a4ca6e2c81abc030239a3ee53705f656b79efab8ce1d6b5ac25630c2a5`。
- **上游归档关系**：README 行 `00042` 的编号单元格指向上游归档 PDF。2026-11-22 复核时已完整下载（6,394,437 B，sha256 `d5f23cb31e6ba338b43bf461cf1f40f31361b626be94a990c72d32b7e7f77374`，53 页，`%%EOF`），核验为 **v1 的重导出**：watermark 是 `arXiv:2412.19437v1 [cs.CL] 27 Dec 2024`，FP8 段落是 v1 的旧措辞，Table 6 的 DROP 也是 `91.`；PDF 由 iOS Quartz 于 2025-02-13 重导出（CreationDate `D:20250213154537Z`），图内文字大量转为矢量，文本层与 arXiv v1 不完全逐字一致，但抽查的 watermark、FP8 段落、DROP 单元格与 arXiv v1 一致。**它不是本笔记所用的 v2**；若按上游 PDF 复核，会看不到 v2 的 FP8 改写与 `91.6`。
- **配图**：`assets/` 下的两张图裁自 arXiv v2 PDF（p7、p10），300 dpi。按 arXiv 非独占分发许可引用，请注明出处。Figure 2 裁剪框 `(55,60,540,455)` pt、Figure 3 裁剪框 `(55,60,540,293)` pt。

## 阅读范围与核对手段

- **阅读范围**：全文 53 页：正文 §1–6、参考文献、附录 A–C。Table 1–9 在 250 dpi 渲染页逐格核对；Figure 1/2/3/4/5/6/7/8/9 看过渲染页；Figure 10 的 p47 曲线与 p49 的专家负载首屏看过整图，p50–53 的其余层只按图注与文本层核对，未逐格读数。Figure 2/3 裁为 `assets/` 配图并逐元素检查。未运行代码、未复现、未独立评测。
- **核对凭据**：逐页抽取 v1/v2 文本并逐页 diff（实质差异只有 3 处，见下「版本关系」）；Table 1/2/3/4/5/6/7/8/9 在 250 dpi 渲染页核对；Table 3/4/5/6 的加粗用 `get_text('dict')` 的 `URWPalladioL-Bold` 核对；Figure 2 裁剪框 `(55,60,540,455)` pt、Figure 3 裁剪框 `(55,60,540,293)` pt，300 dpi；Figure 9 看过整图；Figure 10 的专家负载只按结构与图注核对（p49 首屏），未做像素测量。否定性核对：全文没有训练 FLOPs 数值（`FLOPs` 0 次）；MTP 的 85%–90% 接受率与 1.8× TPS 只在 §5.4.3 出现，没有分主题表或测量协议。

## 复核记录

**2026-11-22**（首轮；基准 arXiv v2，sha256 `812a3fd6…`）

- 获取 v2 PDF：53 页，1,887,366 B，`%%EOF` 完整，CreationDate 2025-02-19；v1 同页数，1,887,607 B，CreationDate 2024-12-30。
- 逐页文本 diff：p1–3 只有水印/目录页码差异；p20–39 的段落位置变化来自浮动体换页；实质差异只有 FP8 段落重写、`under-utilized` 拼写、Table 6 的 `91.`→`91.6`。
- Table 1–9 在 250 dpi 渲染页逐格核对；Table 3/4/5/6 的加粗用 `get_text('dict')` 的 `URWPalladioL-Bold` 核对。Table 3 的 0.3 容差解释了 HellaSwag/TriviaQA/CLUEWSC/ARC-Challenge 的双加粗；Table 4/5 的加粗标较优值，近似同档也会同时加粗（例如 Table 5 小模型 NQ 的 23.2/23.4），本笔记转写时省略了加粗。
- Figure 1/2/3/4/5/6/7/8/9 看过渲染页；Figure 2/3 裁为 `assets/fig2-architecture.png`、`assets/fig3-mtp.png`，300 dpi，裁剪框分别为 `(55,60,540,455)`、`(55,60,540,293)` pt；Figure 2 检查了图内标题、图例与 input/output hidden 标签；Figure 3 检查了 input/target token 标签与 shared 标注。
- Figure 10 两处：p47 的 loss curves 与 p49–53 的 expert load；专家负载只按整图结构核对，未逐格读数。
- 未做：运行代码、复现训练/评测、独立测量吞吐；上游 00042 PDF 已核验为 v1 重导出（见版本关系）；未做 Figure 1/8 的像素测量（按图内数值标签/色标核对）。

**本轮复核（2026-11-22，独立审计 + 自查）**：基准 v2（sha `812a3fd6…`），重取 v2/v1 并核对 sha；上游 00042 完整下载并核验为 v1 重导出（见版本关系）。修正：长上下文限制从「只测 NIAH」改为「128K 扩展只给 NIAH，下游另有 DROP/LongBench v2/FRAMES」；GRPO 把重要性采样比改用 $\rho_i$、奖励保留 $r_i$；Dgrad 的「只做转置」归到 block-wise；gating 明确为「未加 bias 的 affinity 归一化」；54.2 天标为满利用率折算；FP8 证据改为「全部 GEMM + 关键算子高精度」；NIAH 补 SFT 后；补评测口径、IF-Eval、Table 4/5 设置、FP8 <0.25%、GRPO KL 式；Table 4/5 注明省略 `# Shots`；Table 6 三个 88.x；#1 归属改为 Arena-Hard；TriviaQA 加入双加粗例子；上游版本从未核验改为已核验。未修：K2 笔记仍写「本仓库尚未生成笔记」，按规则只报告、不改他篇；Figure 10 的 p50–53 未逐格像素读数；未运行代码/复现。

## 实验与证据细节

**评测口径**（§4.4.1、§5.3.1）：base 的多选题（MMLU/MMLU-Redux/MMLU-Pro/MMMLU/ARC/C-Eval/CMMLU/C3/CCPM 等）用 perplexity；生成类（TriviaQA/NQ/DROP/MATH/GSM8K/MGSM/HumanEval/MBPP/LCB/CRUXEval/BBH/AGIEval/CLUEWSC/CMRC/CMath）用 generation；Pile 用 BPB。Chat 的 MMLU/DROP/GPQA/SimpleQA 用 simple-evals 的 prompt，MMLU-Redux 用 Zero-Eval 的 zero-shot 格式，其他数据集按各自原始协议/默认 prompt；HumanEval-Mul 覆盖 8 种语言；LCB 取 2024-08 至 2024-11 的题，分 CoT 与非 CoT；Codeforces 用 percentile；SWE-bench Verified 用 agentless；Aider 用 diff；AIME/CNMO 温度 0.7、16 次平均；MATH-500 greedy；所有模型最多输出 8192 token。Table 6 中样本数 <1000 的 benchmark 会用不同温度多次运行取稳健结果；Table 7 的 Arena-Hard/AlpacaEval 用 GPT-4-Turbo-1106 做 pairwise judge。Baselines 为 DeepSeek-V2-0506、V2.5-0905、Qwen2.5 72B Instruct、LLaMA-3.1 405B Instruct、Claude-3.5-Sonnet-1022、GPT-4o-0513。

### 1. Base 模型（Table 3）

Table 3 用同一套内部 HAI-LLM 评测框架比较 DeepSeek-V2-Base、Qwen2.5 72B Base、LLaMA-3.1 405B Base 与 DeepSeek-V3-Base。V3-Base 在多数行领先，尤其是 code/math：HumanEval 65.2、MBPP 75.4、LiveCodeBench-Base 19.4、GSM8K 89.3、MATH 61.6、CMath 90.7、MGSM 79.8；英语知识类 MMLU 87.1、MMLU-Pro 64.4、BBH 87.5、DROP 89.0；中文 C-Eval 90.1；多语言 MMMLU 79.4。

但 base 不是「全面领先」：

- **英语语言理解**：LLaMA-3.1 405B 在 HellaSwag 89.2（V3 88.9）、PIQA 85.9（84.7）、WinoGrande 85.2（84.9）、RACE-Middle 74.2（67.1）、RACE-High 56.8（51.3）、NaturalQuestions 41.5（40.0）更高；Pile-test BPB 0.542 也优于 V3 的 0.548（越低越好）。
- **中文**：Qwen2.5 72B 的 CMMLU 89.5 高于 V3 的 88.8；DeepSeek-V2-Base 的 CMRC 77.4、CCPM 93.0 高于 V3 的 76.3、92.0；LLaMA 的 C3 79.7 高于 78.6。
- **RACE** 是 V3-Base 最明显的短板：RACE-Middle 67.1，甚至低于 V2-Base 的 73.1。

Table 3 的 caption 说「差距不超过 0.3 视为同一水平」，所以表里有些行会把两个模型都加粗（HellaSwag 89.2/88.9、TriviaQA 82.7/82.9、CLUEWSC 83.0/82.7、ARC-Challenge 95.3/95.3）。读表时按同档理解，不要只看加粗判断谁高。

### 2. Chat 模型（Table 6）

Chat 版在 22 个 benchmark 上多数领先：

- **知识/长上下文**：MMLU 88.5、MMLU-Redux 89.1、MMLU-Pro 75.9、DROP 91.6、GPQA 59.1、FRAMES 73.3、LongBench v2 48.7。MMLU-Pro 仍低于 Claude 78.0；GPQA 低于 Claude 65.0；FRAMES 低于 GPT-4o 80.5。
- **事实性**：SimpleQA 24.9，明显低于 GPT-4o 38.2 与 Claude 28.4；中文 C-SimpleQA 64.8，高于 GPT-4o 59.3、Claude 51.3、Qwen 48.4。原文把这解释为「把更多训练 token 分给中文知识」。
- **代码**：HumanEval-Mul 82.6、LiveCodeBench-CoT 40.5、LiveCodeBench 37.6、Codeforces 51.6 percentile、Aider-Polyglot 49.6；SWE-bench Verified 42.0 低于 Claude 50.8；Aider-Edit 79.7 低于 Claude 84.2。
- **数学**：AIME 2024 39.2、MATH-500 90.2、CNMO 2024 43.2，三项都高于 Qwen2.5 72B 的 23.3 / 80.0 / 15.9。
- **中文**：CLUEWSC 90.9、C-Eval 86.5、C-SimpleQA 64.8；CLUEWSC 略低于 Qwen 的 91.4。
- **指令遵循**：IF-Eval (Prompt Strict) 86.1，明显高于前代 V2.5 的 80.6；与 LLaMA-3.1 405B 的 86.0、Claude-3.5-Sonnet 的 86.5 接近，未超过 Claude。原文说它显著优于 V2 系列。

Figure 1 的六组柱与 Table 6 的 chat 数字一致（MMLU-Pro 75.9、GPQA 59.1、MATH-500 90.2、AIME 39.2、Codeforces 51.6、SWE 42.0），不是 base 的数字。

### 3. 开放式对话与 RewardBench（Table 7/8）

Table 7：Arena-Hard 上 V3 85.5，Claude-3.5-Sonnet 85.2，GPT-4o 80.4，Qwen2.5 72B 81.2，LLaMA-3.1 405B 69.3，V2.5 76.2；AlpacaEval 2.0（length-controlled）V3 70.0，Claude 52.0，GPT-4o 51.1，Qwen 49.1，LLaMA 40.5，V2.5 50.5。V3 在 AlpacaEval 上的领先幅度很大；开放式评测的措辞与表值有两处口径问题（Arena-Hard #1、AlpacaEval #5）。

Table 8：RewardBench 平均分 V3 87.0，Claude-3.5-Sonnet-1022 88.7，GPT-4o-0806 86.7；V3 的 maj@6 到 89.6，超过 Claude 的 88.7。分项上 V3 的 Chat 96.9、Chat-Hard 79.8、Safety 87.0、Reasoning 84.3；Safety/Reasoning 低于 Claude 的 91.1/87.6，Chat-Hard 略高于 Claude 的 79.7。原文说「on par with the best versions」，按平均分看是「接近但略低」，按 maj@6 看是「略高」，要区分单次与投票。

### 4. 消融：MTP 与无辅助损失均衡（Table 4/5）

Table 4 的 MTP 消融（小模型 15.7B 总参 / 2.4B 激活 / 1.33T token；大模型 228.7B 总参 / 20.9B 激活 / 540B token）。两个 baseline 在相同数据/架构上训练，只额外加一个 1-depth MTP 模块；推理时丢弃 MTP，所以推理成本相同（§4.5.1）。

| Benchmark (Metric) | Small Baseline | Small w/ MTP | Large Baseline | Large w/ MTP |
| --- | ---: | ---: | ---: | ---: |
| Pile-test (BPB) | 0.729 | 0.729 | 0.658 | 0.657 |
| BBH (EM) | 39.0 | 41.4 | 70.0 | 70.7 |
| MMLU (EM) | 50.0 | 53.3 | 67.5 | 66.6 |
| DROP (F1) | 39.2 | 41.3 | 68.5 | 70.6 |
| TriviaQA (EM) | 56.9 | 57.7 | 67.0 | 67.3 |
| NaturalQuestions (EM) | 22.7 | 22.3 | 27.2 | 28.5 |
| HumanEval (Pass@1) | 20.7 | 26.8 | 44.5 | 53.7 |
| MBPP (Pass@1) | 35.8 | 36.8 | 61.6 | 62.2 |
| GSM8K (EM) | 25.4 | 31.4 | 72.3 | 74.0 |
| MATH (EM) | 10.7 | 12.6 | 38.6 | 39.8 |

*Table 4 数值转写（省略 `# Shots` 列）；原文用加粗标较优值，本表省略加粗。BPB 越低越好。*

Table 5 的无辅助损失均衡消融（小模型 15.7B / 2.4B / 1.33T；大模型 228.7B / 20.9B / 578B）。baseline 纯用 auxiliary loss（sigmoid gating + top-K normalization，超参同 V2-Lite/V2），free 版去掉所有 auxiliary loss、改用 bias 路由（§4.5.2）。

| Benchmark (Metric) | Small Aux-Loss-Based | Small Aux-Loss-Free | Large Aux-Loss-Based | Large Aux-Loss-Free |
| --- | ---: | ---: | ---: | ---: |
| Pile-test (BPB) | 0.727 | 0.724 | 0.656 | 0.652 |
| BBH (EM) | 37.3 | 39.3 | 66.7 | 67.9 |
| MMLU (EM) | 51.0 | 51.8 | 68.3 | 67.2 |
| DROP (F1) | 38.1 | 39.0 | 67.1 | 67.1 |
| TriviaQA (EM) | 58.3 | 58.5 | 66.7 | 67.7 |
| NaturalQuestions (EM) | 23.2 | 23.4 | 27.1 | 28.1 |
| HumanEval (Pass@1) | 22.0 | 22.6 | 40.2 | 46.3 |
| MBPP (Pass@1) | 36.6 | 35.8 | 59.2 | 61.2 |
| GSM8K (EM) | 27.1 | 29.6 | 70.7 | 74.5 |
| MATH (EM) | 10.9 | 11.1 | 37.2 | 39.6 |

*Table 5 数值转写（省略 `# Shots` 列）；原文用加粗标较优值，本表省略加粗。BPB 越低越好。*

两张表都是 10 个 benchmark × 2 个规模 = 20 个组合。本笔记按表复算：**MTP 17 个改善、1 个持平、2 个变差**（小模型 Pile 0.729/0.729 持平；小模型 NaturalQuestions 22.7→22.3、大模型 MMLU 67.5→66.6 变差）；**无辅助损失均衡也是 17 个改善、1 个持平、2 个变差**（大模型 DROP 67.1/67.1 持平；小模型 MBPP 36.6→35.8、大模型 MMLU 68.3→67.2 变差）。原文写 “consistently … on most of the evaluation benchmarks”，与这组数字一致；但两处 MMLU 下降说明它不是「每一项都更好」。

Table 4 与 Table 5 的大规模 run 用了不同的 token 数（540B vs 578B），不能当作同一批 run；跨表比较要谨慎。

### 5. Batch-wise 与 sequence-wise 负载均衡（§4.5.3）

作者比较了三种均衡范围：sequence-wise auxiliary loss、batch-wise auxiliary loss、aux-loss-free。1B MoE 的验证损失：2.258（sequence-wise）、2.253（aux-loss-free）、2.253（batch-wise）；3B MoE：2.085、2.080、2.080。差异约 0.005（本笔记复算：相对 2.258/2.085 约 0.22%/0.24%），作者认为 batch-wise 与 aux-loss-free 基本等价，而 sequence-wise 因为强制每条序列内部均衡，限制了专家按域特化。

Figure 9 的专家负载热图支持这一点：相对负载定义为「实际专家负载 / 理论均衡负载」，色标 0–10；aux-loss-free 的 Layer 9/18 在 Wikipedia、Github、DM Mathematics 三个域上出现更多深色/红色单元格，即更明显的专家特化；aux-loss-based 更均匀。Appendix C 把 16B 模型的 1–27 层全部画成 Figure 10（与 Appendix B 的 Figure 10 重号，见「原文自身的表述张力」#7）。这些图只给相对负载，没有给「特化程度」的标量指标。

### 6. R1 蒸馏（Table 9）

在 DeepSeek-V2.5 上做消融：baseline 用短 CoT 数据，competitor 用 R1 专家 checkpoint 生成的数据。LiveCodeBench-CoT 31.1 → 37.4（+6.3，本笔记复算 +20.3%），平均长度 718 → 783（+65，+9.1%）；MATH-500 74.6 → 83.2（+8.6，+11.5%），平均长度 769 → 1510（+741，+96.4%）。作者说蒸馏提升明显但显著增加长度，因此 V3 在蒸馏时「carefully selected optimal settings」以平衡准确率与效率；原文没有给选择准则，也没有说明是否使用长度惩罚。

### 7. 长上下文与 MTP 推理

- **NIAH**（Figure 8，SFT 后）：2K–128K 长度、0–100% 文档深度，颜色条 1–10，整图基本全绿（10 分）。这说明「针」在 128K 内都能找到；但 NIAH 是检索任务，不能证明长上下文推理、多跳或摘要能力。
- **MTP 接受率**（§5.4.3）：第二个 token 的接受率 85%–90%，带来 1.8× TPS。原文没有给分主题的接受率、测量 batch size 或硬件；1.8× 也不能与结论章的「端到端生成速度 >2× V2」混为一谈——后者是 §6 所说的部署策略带来的端到端生成速度（相对 V2），前者是 MTP 投机解码本身的 TPS。

## 版本关系

两版都是 53 页。逐页文本 diff 后，实质差异只有三处，其余差异来自浮动体换页（段落整体前移/后移）、目录页码和页眉水印：

1. **p20–21 的 FP8 累加段落重写**。v1 写 “FP8 GEMM employs fixed-point accumulation… only uses the highest 14 bits… at least 34-bit precision is required… recommend future chip designs increase accumulation precision…”。v2 改成 “FP8 GEMM suffers from limited accumulation precision… After aligning 32 mantissa products… the Tensor Core only uses the highest 14 bits… The accumulation of addition results into registers also employs 14-bit precision. Our implementation partially mitigates the limitation by accumulating the addition results of 128 FP8×FP8 multiplications into registers with FP32 precision in the CUDA core… it is merely a compromise due to the Hopper architecture’s hardware deficiency… Future chips need to adopt higher precision.” 结论一致（Hopper 的 FP8 累加精度不足），但 v2 更明确地写出了「每 128 次 FP8×FP8 乘加把结果提升到 CUDA core 的 FP32 寄存器」这一实际缓解手段，并把建议从「支持全精度累加」改成「需要更高精度」。
2. **p20 拼写修正**：v1 “tensor cores remain entirely -utilized” → v2 “under-utilized”。
3. **Table 6 的 DROP 单元格**：v1 渲染为 `91.`（缺少小数位，且加粗），v2 为 `91.6`。正文 p32 两版都写 91.6，所以 v1 是表格录入/排版遗漏；这是唯一被修正的实验数字。

Table 3/4/5/6/7/8/9 的其余数值与图号在两版间一致；p26/p27 的 540B/578B 等数字在两版间没有变化，页面上的位置变化只是段落换页。本笔记的页码、图号、引文均按 **v2**。

## 原文自身的表述张力

1. **Arena-Hard 的「over 86%」与 Table 7 的 85.5**：§5.3.3 写 “achieves an impressive win rate of over 86% against the baseline GPT-4-0314”，但 Table 7 的 Arena-Hard 是 85.5。同一段又说「first open-source model to surpass 85%」，这与 85.5 一致；「over 86%」与表值差 0.5 个百分点，按表值应写「超过 85%」。
2. **§1 的 MMLU「outperforms all other open-source models」与 Table 6 的 88.6/88.5**：§1 用 88.5/75.9/59.1 说 V3 在 MMLU、MMLU-Pro、GPQA 上超过所有开源模型；Table 6 中 LLaMA-3.1 405B 的 MMLU 是 88.6，高于 V3 的 88.5。Table 3 的 caption 有「差距 ≤0.3 算同档」的规则，Table 6 没有写这条规则，但三个 88.x（88.6/88.3/88.5）都加粗；按同档可以解释，按字面「outperforms all」不成立。
3. **§4.4.2 的「comprehensively outperforms」与 Table 3 的四个反例**：正文说 V3-Base 「comprehensively outperforms DeepSeek-V2-Base and Qwen2.5 72B Base」。Table 3 中 V2-Base 的 CMRC 77.4 > 76.3、CCPM 93.0 > 92.0；Qwen2.5 的 RACE-Middle 68.1 > 67.1、CMMLU 89.5 > 88.8。后文承认了 CMMLU 这个例外，但没有提 RACE-Middle；「comprehensively」至少对这四行不成立。
4. **数学「approximately 10%」只对 MATH-500 成立**：§5.3.2 说在 AIME、MATH-500、CNMO 上比第二好的 Qwen2.5 72B 高「approximately 10% in absolute scores」；Table 6 的差值是 AIME +15.9（39.2 vs 23.3）、MATH-500 +10.2（90.2 vs 80.0）、CNMO +27.3（43.2 vs 15.9）。只有 MATH-500 接近 10 个百分点，AIME/CNMO 远高于 10。
5. **AlpacaEval 的「20%」是约 20 个百分点，不是 20% 相对提升**：§5.3.3 说 V3 比 V2.5-0905 高「a significant margin of 20%」；Table 7 是 70.0 vs 50.5，差 19.5 个百分点；若按相对提升算是 38.6%。原文的「20%」只能理解为约 20 个百分点。
6. **工程任务「trails behind Claude」对 Aider-Polyglot 不成立**：§5.3.2 说在 engineering tasks 上 V3 落后 Claude-Sonnet-3.5-1022；Table 6 中 SWE 42.0 < 50.8、Aider-Edit 79.7 < 84.2，但 Aider-Polyglot 49.6 > 45.3（V3 反而高 4.3 分）。「trails」不是所有工程任务都成立。
7. **Figure 10 编号重复**：p47 的 Figure 10 是 FP8 vs BF16 的 loss curves；p49–53 的 Figure 10 是 16B 模型的 expert load；Appendix C 的 “as demonstrated in Figure 10” 指后者。同一篇论文有两个 Figure 10，引用时必须带页码/主题，否则会指错。
8. **Figure 3 画了 D=2，正文配置是 D=1**：Figure 3 有 MTP Module 1（Next2）与 Module 2（Next3），但 §4.2 明确 $D=1$，实际只加一个 MTP 模块。Figure 3 按 D=2 的通用形式画出，不能按图读成 V3 训练了两个模块。
9. **Table 4 与 Table 5 的大规模 token 数不同**：Table 4 用 540B，Table 5 用 578B；两表大规模 run 的 token 预算不同，不能直接当作同一预算下的对照，跨表的「MTP vs aux-loss-free」比较不成立。
10. **18T 比 14.8T「20% more」是近似**：§5.3.2 说 Qwen2.5 的 18T 比 V3 的 14.8T 多 20%；按 18/14.8 复算约多 21.6%，原文是取整/近似。

## 工程实现与外部资料

### 1. 成本账

| 阶段 | H800 GPU 小时 | 美元（按 2 美元/GPU·小时） |
| --- | ---: | ---: |
| 预训练 | 2,664K | 5.328M |
| 上下文扩展 | 119K | 0.238M |
| 后训练 | 5K | 0.01M |
| 合计 | 2,788K | 5.576M |

Table 1 与 §1 的口径一致：预训练 2.664M 小时、上下文 0.119M、后训练 0.005M，总 2.788M；按 2 美元/GPU·小时得到 5.576M 美元。每万亿 token 180K 小时，$180\mathrm{K}/(2048\times24)=3.66$ 天，所以「3.7 天」是按 2048 卡满利用率折算的；同样口径下整个预训练约 54.2 天，原文只说「less than two months」，与 2.664M 小时一致。成本不含架构/算法/数据的先前研究与消融实验。

### 2. 并行与通信

- **16 PP × 64 EP × 2 DP**：64 EP 跨 8 节点，正好把 8 卡/节点用满；DP=2 是按 2048 卡反推的（原文未写 DP degree）。
- **DualPipe**：2 份参数、$P+1$ 激活；换来更小的 bubble 与 all-to-all/PP 全隐藏。它要求 PP 阶段与 micro-batch 能被 2 整除；不要求 micro-batch 能被 PP 阶段整除。若 EP 不够大，2 份参数的内存开销会变显著。
- **20 个 SM**：H800 132 个 SM 中的 20 个用于通信，10 个 channel；每个 channel 的 warp 按 IB 发送、IB→NVLink 转发、NVLink 接收分工。通信与计算流重叠，但会争 L2；V3 用自定义 PTX 与自动调 chunk size 降低干扰。
- **节点限制**：$M=4$ 是通信成本与路由自由度的折中；8 个路由专家最多扩到 13 个（4×3.2）而不增加通信成本，这个「3.2 experts/node」是平均路由分布的结果，不是硬上限。

### 3. 显存与数值

- **重算**：RMSNorm 与 MLA up-projection 在 backward 重算，不存输出激活；代价是少量计算，换大量激活显存。
- **EMA on CPU**：EMA 参数放 CPU，异步更新；不占 GPU 显存，但依赖 CPU-GPU 带宽与同步。
- **共享 embedding/head**：DualPipe 把最浅/最深放同一 PP rank，MTP 与主模型物理共享参数和梯度；这减少了 MTP 模块与主模型重复的 embedding/输出头参数与梯度，提升显存效率。
- **FP8 的精度边界**：embedding、输出头、gating、norm、attention 保持高精度；Dgrad 的激活梯度在 16B/300B 的实验中 block-wise 会发散，因此 V3 不用；attention 后 Linear 的输入用 E5M6；scaling factor 取 2 的整数次幂以避免额外误差。这些是「哪些算子不能省」的工程清单。

### 4. 推理部署（§3.4）

**Prefilling**（§3.4.1）：最小部署单元 4 节点 / 32 GPU；attention 用 TP4 + SP、DP8；MoE 用 EP32。MoE all-to-all 仍是「先 IB 跨节点、再 NVLink 节点内转发」。为了均衡专家负载，设置 32 个冗余专家：每个 GPU 原本 8 个专家，再额外托管 1 个冗余专家；冗余集合按在线统计定期调整（例如每 10 分钟）。Prefill 同时处理两个计算量相近的 micro-batch，让一个的 attention 与另一个的 dispatch/combine 重叠。还在探索「每个 GPU 托管更多专家（如 16 个），每步只激活 9 个」的动态冗余策略。

**Decoding**（§3.4.2）：最小部署单元 40 节点 / 320 GPU；attention 用 TP4 + SP、DP80；MoE 用 EP320。每个 GPU 只托管 1 个专家；64 个 GPU 负责冗余专家与共享专家。解码时把共享专家当成路由专家，所以每个 token 选 9 个专家（8 路由 + 1 共享）。all-to-all 用 IB 点对点 + IBGDA 降低延迟；每个专家的 batch 通常不超过 256 token，瓶颈是访存而非计算，所以只分配少量 SM 给 dispatch+MoE+combine，避免拖慢 attention。解码的冗余专家集合也按在线统计定期调整，但因为每个 GPU 只有一个专家，不需要重排；动态冗余在解码侧仍是「探索中」。

**读者备注**：这是「最小部署单元」，不是单机可跑；小团队部署 V3 的门槛主要在这里（作者在 §6 也承认）。原文没有给动态冗余策略的吞吐/延迟收益，decode 侧只说按一定间隔统计、未给具体间隔。

### 5. 硬件建议（§3.5）

1. **把通信从 SM 卸载**：当前 all-to-all 用 20 个 SM，Tensor Core 在通信时几乎不参与计算（原文：entirely under-utilized）；建议做 GPU co-processor / network co-processor（类似 SHARP），统一 IB 与 NVLink 的编程接口。
2. **提高 FP8 GEMM 的累加精度**：Hopper Tensor Core 只保留约 14 bit；V3 用每 128 个 MMA 提升到 CUDA core FP32 的方式绕过，但这是妥协，未来芯片应原生支持更高精度。
3. **支持 tile/block-wise 量化**：让 Tensor Core 直接接收 scaling factor，做 group scaling 的 MMA，避免 Tensor Core ↔ CUDA core 的频繁数据搬运。
4. **支持 online quantization 与转置 GEMM**：把 FP8 cast 与 TMA 融合，在 global→shared 的传输中完成量化；支持 shared memory 的转置读取，减少 backward 的读出/反量化/转置/再量化。

## 贡献与证据的对应

| 作者主张 | 原文证据 | 证据等级 |
| --- | --- | --- |
| FP8 首次在超大规模模型上验证 | 全部 GEMM 用 FP8 的混合精度训练（关键算子保持 BF16/FP32）；Appendix B.1 在 16B（1.33T token）/ 230B（0.9T token）上与 BF16 对比，相对 loss error <0.25% | 强，但没有 671B 全规模的 BF16 对照；全规模只有「训练稳定」的陈述 |
| DualPipe 实现 near-zero all-to-all overhead | Table 2 的 bubble 公式、Figure 4/5 的调度、20 SM/10 channel 的实现 | 设计证据强；没有给「通信隐藏比例」的实测数字 |
| 训练过程无不可恢复的 loss spike / rollback | 摘要与 §1 的陈述；Figure 10 只给 16B/230B 的 FP8 vs BF16 曲线 | 作者陈述；没有公开完整 671B 训练的 loss 曲线 |
| MTP 提升模型性能 | Table 4：20 个组合 17 改善、1 持平、2 变差 | 强（两个规模、10 个 benchmark） |
| 无辅助损失均衡优于纯 auxiliary loss | Table 5：20 个组合 17 改善、1 持平、2 变差；§4.5.3 的 1B/3B 验证损失 | 强（两个规模、10 个 benchmark + 小规模对照） |
| R1 蒸馏提升推理 | Table 9：V2.5 上 LiveCodeBench +6.3、MATH-500 +8.6 | 中等（只在 V2.5 上做，不在 V3 上做消融；没有长度控制方法的独立消融） |
| MTP 可用于投机解码，1.8× TPS | §5.4.3 一句话；接受率 85%–90% | 弱（无表格、无测量协议、无分主题数据） |
| Chat 模型达到 GPT-4o / Claude 附近 | Table 6/7/8 | 多数 benchmark 支持；SimpleQA、SWE、Aider-Edit 等明显落后 |

## 局限与待确认问题（完整版）

### 作者明确承认的

- **部署单元大**：prefill 最小 32 GPU、decode 最小 320 GPU，对小团队是负担（§6）。
- **生成速度仍有提升空间**：端到端 >2× V2，但作者认为还不够（§6）。
- **动态冗余仍在探索**：prefill 与 decode 都只给出设想；decode 侧明确说还需要优化全局路由算法并与 dispatch kernel 融合（§3.4.2）。
- **未来方向**：无限上下文、突破 Transformer 架构限制、数据 scaling、更深的 reasoning、更多维的评测（§6）。

### 读者根据证据提出的

- **英语事实性与工程任务仍是短板**：SimpleQA 24.9 vs GPT-4o 38.2；SWE 42.0 vs Claude 50.8；Aider-Edit 79.7 vs 84.2。原文没有把这三点放进「limitations」，但它们会影响「接近闭源」的结论。
- **base 的英语语言理解与部分中文任务不是最高**：RACE-Middle/High、HellaSwag、PIQA、WinoGrande、CMMLU、CMRC、C3、CCPM；原文用「majority」而不是「all」，但正文的「comprehensively」需要打折。
- **评测缺少方差/置信区间**：Table 6 caption 说小于 1000 样本的 benchmark 会多次运行取稳健结果，但没有给重复次数、方差或 CI；闭源模型通过 API 评测，版本与解码参数不完全可控。
- **MTP 的 85%–90% 与 1.8× TPS 不可复算**：没有分主题接受率、测量 batch size、硬件与 baseline 定义。
- **FP8 的全规模证据只证明训练稳定，不证明与 BF16 等价**：受控对比只在 16B（1.33T token）/ 230B（0.9T token）；671B 全量没有 BF16 对照。
- **没有训练 FLOPs**：全文 `FLOPs` 0 次，只有 GPU 小时与美元；无法直接比较不同硬件的算力效率。
- **数据配比不公开**：14.8T token 的域比例、代码/数学比例、多语言比例都没有给；SFT 1.5M 的域比例也没有给。
- **RL 细节不足**：GRPO 的 $\varepsilon$、$\beta$ 数值、RM 规模/数据量、self-rewarding 的投票数/prompt 模板都没有给。
- **128K 扩展只给了 NIAH 压力测试**：下游长上下文评测有 DROP、LongBench v2、FRAMES（§5.3.2），但没有按 128K 长度分层、多跳、摘要或代码库级任务的评测；128K 是 YaRN 扩展，不是原生训练。
- **「不丢 token」是设计声明**：训练与推理都没有丢 token 的对照测量；推理侧依赖冗余专家与在线统计。
- **上游 00042 PDF 是 v1 重导出**：已核验为 v1（watermark、FP8 旧措辞、DROP `91.`），不是本笔记的 v2；复核时先看版本关系，不要把 v1 的表格当成 v2。

## 与本仓库其他条目的关系

- **DeepSeek-V3.2**（00133，[笔记](../2512.02556-v1-deepseek-v3.2/note.md)）：V3 的后续独立版本，不是本报告的修订。V3.2 在 V3.1-Terminus 上继续预训练植入 DSA（稀疏注意力），再用混合 RL 推到 GPT-5 附近；V3.2 笔记里的 `<think>` 标签、R1 冷启动与 V3 的 R1 蒸馏一脉相承。读 V3.2 的 DSA 之前，先看本笔记的 MLA 压缩与 KV cache，会更容易理解「为什么 DSA 要建在 MLA 的 MQA 模式上」。
- **DeepSeek-V4 / V4.1-Flash**（00172 / 00191，[V4 笔记](../deepseek-v4/note.md)、[V4.1-Flash 笔记](../deepseek-v4.1-flash/note.md)）：更后面的代际。V4 笔记把 V3.2 视为 V4 的直接前代；V3 把 V2 的 MLA/DeepSeekMoE 推到 671B，并新增 MTP；V3.2/V4 是后续代际。V4 的 CSA/HCA、FP4、mHC 等设计不在本报告范围内，不能拿 V4 的数字回填 V3。
- **Kimi K2**（00083，[笔记](../2507.20534-v2-kimi-k2/note.md)）：K2 把 V3 当作直接架构基线：61 层、MLA、8 激活专家、1 共享专家相同；不同点是总专家 256→384、激活参数 37B→32.6B、头数 128→64、dense layer 3→1，并去掉 expert grouping。K2 的 scaling law 与 64 头消融，本质是在 V3 架构上做「更稀疏 + 更少头」的再权衡。
- **mHC**（00148，[笔记](../2512.24880-v2-mhc/note.md)）：DeepSeek 的 manifold-constrained hyper-connections；其笔记把 baseline 描述为 DeepSeek-V3 风格的 MoE。V3 的残差流是标准残差，mHC 是后续对残差连接的改动，不要混为同一模型。
- **GLM-5**（00157，[笔记](../2602.15763-v2-glm-5/note.md)）：GLM-5 在 MLA 头数选择上引用 V3 的 H800 roofline 经验；它的 MTP 用 3 个共享参数层，与 V3 的 $D=1$ 单层 MTP 形成对照。GLM-5 笔记里「DeepSeek-V3 只训 1 层却推 2 token」说的就是本报告。
- **DSpark**（00174，[笔记](../2607.05147v1-dspark/note.md)）：DSpark 的 baseline MTP-1 引自 V3 的单 token MTP 设置；V3 的 85%–90% 接受率与 1.8× TPS 是这类投机解码工作的前置参照。
- **DeepSeek-R1**（00045 / 00095）与 **DeepSeekMath**（00057）：V3 的推理数据蒸馏自 R1 系列，GRPO 来自 DeepSeekMath；这两条在本仓库尚未生成笔记，读 V3 的 §5 时需要回原文/上游 PDF。
- **同名不同文提醒**：V3、V3-0324、V3.1、V3.1-Terminus、V3.2 是不同 checkpoint/报告；本笔记只覆盖 2024-12 的 V3 技术报告（v2 是 2025-02 的编辑修订，不是新模型）。

## 迁移索引

2026-11-28 读者版重写时，以下内容从 `note.md` 移入本文件：

- 来源信息表中的 Subjects、完整日期、许可、版本 sha256、上游 00042 归档关系、配图裁剪框；
- 原「阅读范围」整行、原「核对凭据」整行；
- 原「阅读范围与复核记录」中的 2026-11-22 复核条目与独立审计/自查段落；
- 原「版本关系：v1 与 v2」整节；
- 原「原文自身的表述张力」整节（10 条）；
- 原「工程视角」整节（成本账、并行与通信、显存与数值、部署、硬件建议）；
- 原「贡献与证据的对应」整节；
- 原「局限与待确认问题」完整版（作者承认 + 读者判断）；
- 原「与本仓库其他条目的关系」完整版；
- 原「实验与证据」中的 Table 4/5 逐项数值、Table 3/6/7/8/9 的逐项读数、Figure 1/8/9/10 的逐图读数与评测口径细节（读者版只保留结论与一张主表）。
