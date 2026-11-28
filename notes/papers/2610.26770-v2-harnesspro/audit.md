# HarnessPro — 复核档案

> 本文件是维护性档案，不参与站点构建；读者版正文见同目录 `note.md`。

## 来源与版本

- **标题**：HarnessPro: Recursive Harness Self-Improvement with Pareto Optimization for Performance-Cost Trade-offs。
- **作者**：Zhuoshi Pan¹\*, ZhiYuan Feng¹\*, Yukuo Cen², Honglin Lin³, Junru Lu⁴, Zhongxia Chen⁵, Shuo Yang⁵, H. Vicky Zhao¹†, Jie Tang¹†。¹ Tsinghua University；² Z.AI；³ Shanghai Jiao Tong University；⁴ University of Warwick；⁵ Kling AI。`*` 共同一作，`†` 通讯作者。
- **机构**：Tsinghua University（第一机构）。
- **来源**：[arXiv:2610.26770v2](https://arxiv.org/abs/2610.26770v2)（cs.LG; cs.CL）；v1 2026-10-19 → v2 2026-10-20；本笔记基于 v2，为截至阅读时的最新版。
- **v1 → v2 差异**：全文文本比对显示，第 2 单位由 Z.AI Co., Ltd. 简写为 Z.AI，第 5 单位由 Kuaishou–Kuaishou Technology 改为 Kling AI，并补充共同一作 / 通讯作者标记；正文结构与 Table 2 关键数字不变；两版均为 41 页。
- **同一 v2 的两个 PDF 副本**：2026-10-25 使用的副本（sha256 `ce88e54a…`；生成方式、与当前 v2 的差异原因未确认）p4 Figure 1 不完整；2026-10-26 从 arXiv 重取的当前副本（sha256 `c633082a…`）完整。两版除 p4 外逐页文本一致，Table 2 数字一致（见「核对凭据」）。读者版配图取自当前副本。
- **代码**：<https://github.com/pzs19/HarnessPro>（MIT；API 核验：创建 2026-09-24、最近 push 2026-10-19、阅读时 ★84；顶层含 `harnesses/{terminal-bench-2,swe-bench-pro,programbench}/{lite,medium,heavy}`、`scripts/`、`splits/`、`src/`、`tests/`、`third_party/`。仅核到结构与 README 自述层面，未验证其与论文实验的可复现性对应。仓库 README 的 "Paper (coming soon)" 徽章与 arXiv 已有 v2 不符——以 arXiv 为准）。
- **许可**：[CC BY 4.0](http://creativecommons.org/licenses/by/4.0/)（arXiv abs 页 "view license" 实际指向该协议，不是默认的 nonexclusive-distrib）。
- **阅读日期**：2026-10-25。
- **仓库编号**：00218（本次按用户要求新增；编号单元格指向 arXiv 官方页）。
- **归档说明**：arXiv 来源，按仓库策略不归档 PDF；清单编号 00218（编号单元格暂指 arXiv 官方页，归档到上游后改指 PDF）。

## 阅读范围与核对手段

v2 全文 41 页：正文 §1–6（p1–10）、References（p10–12）、附录 A–C（p13–23）逐页读取（含关键 listing）；附录 D（p23–41，演化后 harness 产物清单）读了 D 的结构、D.1 的 medium / lite / heavy policy 与 rubric 关键段、D.2 / D.3 的产物结构与示例，未逐行核对全部 listing。

**已渲染页核对**：Table 1（p3）、Table 2（p8）、Table 3（p9）、Table 4（p14）逐格；公式 (1)（p3）、(2)–(9)（p5–6）、(10)–(12)（p13）逐符号；Algorithm 1（p5）逐行；Figure 1（p4，当前 v2 副本）、Figure 2/3（p6）、Figure 4（p9）看图核对。

**未做像素测量**：Figure 4 的读数只引用 §5.4 正文给出的数值，未从坐标轴取数。

**Figure 1 已作为配图转载**（当前 v2 副本完整；2026-10-25 旧副本的缺陷见「核对凭据」）。

### 配图

`assets/figure1-overview.png`（当前 v2 p4 渲染页裁剪，300 dpi）、`assets/figure3-recursion.png`（v2 p6 渲染页裁剪，400 dpi）、`assets/figure4-evolution.png`（v2 p9 渲染页裁剪，400 dpi）。裁剪框与边缘 / 像素差检查见「核对凭据」。许可见上，引用请注明出处。读者版 `note.md` 只保留 Figure 1 与 Figure 4；Figure 3 未进入读者版，资产仍在本目录。

### 核对凭据（当前 v2 基准可复现）

- v2 PDF（2026-10-25 使用的副本）：41 页，sha256 `ce88e54a2c4c8353094db6481fc28f22f1db6adbdea00560dfe8ff11eb8a46a9`（当时从 `https://arxiv.org/pdf/2610.26770v2` 获取；生成方式/为何与当前 v2 不同未确认；2026-10-26 同一 URL 已返回 `c633...`，旧副本无法再从该 URL 重取；本次临时文件已清理）；其 p4 Figure 1 在 PDF 内容流中不完整（panel 2/3 主体为空）。
- v2 PDF（2026-10-26 复核基准）：41 页，sha256 `c633082abff0c6cd4fa3d63f21e689c34f92369068ee0ed13c74be0f2f54b093`（2026-10-26 从同一 URL 重取得到的当前版本；本次临时文件已清理）；p4 Figure 1 完整。两版除 p4 外逐页文本一致，Table 2 关键数字一致。
- v1 PDF：41 页，sha256 `da167e436b2f2c2b5898789d27c22820b92ccb922a8d420e51c341227d9c8676`（重取：`curl -sL https://arxiv.org/pdf/2610.26770v1 -o v1.pdf`；本次临时文件已清理；重取一致）。v1 ↔ 当前 v2 逐页文本 diff：仅 p1–p6 有排版位移与上述单位 / 作者标记变化，实验数字一致；p4 的 Figure 1 两版都完整。
- 渲染核对：`pymupdf` 以 220 dpi 渲染 p3/p6/p8/p9/p14，逐格读 Table 2/3 与公式；Table 4 在 p14。公式 (10)–(12) 在 p13，DPP 参数 $\varepsilon=0.1$、$\theta=0.7$、$k=10$。
- Figure 3 裁剪框：p6，clip `(343, 486, 507, 616)` pt，400 dpi，成品 912×723；Figure 4 裁剪框：p9，clip `(105, 80, 507, 199)` pt，400 dpi，成品 2234×662。两张均回看确认：无黑边、无越界、无截断；元素清单——Figure 3 的 $H_{0}^{0}$、Epoch 1/2/3、Filtering and Selection、Lite/Medium/Heavy、Output 全部在框内；Figure 4 的三面板、坐标轴标签、图例、`Epoch 1/2/3/4` 与 `(a)–(c)` 面板标题全部在框内。另用第二次独立打开 PDF 的同区域渲染做像素差比对：两张的 diff bbox 均为空，边缘 2 px 内的近黑像素数均为 0。
- Figure 1 版本核验：2026-10-25 旧副本 p4 的 Form XObject（xref 2386）内容流为 `q /fzFrm0 Do Q` 后接浅紫矩形与 5 个 `fzFrm*` 贴片；其 `fullpage` 流（xref 2506，54,404 B）只含 panel 1 元素与三个 panel 标题（x≈619、x≈897），panel 2/3 主体为空。2026-10-26 当前 v2 副本 p4 的 Figure 1 完整（文本层含 `Trajectory analyzer`、`Diagnosis records`、`Evolution planner`、`Harness editor`、`Test synthesizer`、`Harness Filtering`、`Mode selection` 等；`fullpage` 流 241,912 B），读者版配图取自当前副本。Figure 1 裁剪框：p4，clip `(105, 80, 507, 220)` pt，300 dpi，成品 1676×584；回看确认三 panel、标题、图例、底部 `Representative Pareto frontier candidates` 全在框内；边缘 2 px 近黑像素 0；第二次独立渲染的像素差 bbox 为空。
- 否定性检索：v2 全文检索 `RRSI`、`Regularized Recursive`、`HarnessDev`、`Prime Agent`、`Dream` 均为 0 次；`HarnessX` 在 §2 与 References 中出现；RHO 是主 baseline。仓库 README 与 arXiv 的编号 / 标题 / 年份 / 单位已交叉核对。
- 代码仓库 API 值：`created_at 2026-09-24T08:50:03Z`、`pushed_at 2026-10-19T16:20:23Z`、`stargazers_count 84`、`license MIT`、`default_branch main`；README 自述的 quickstart 依赖 Linux、Python 3.12/3.13、`uv`、Docker Compose、Codex CLI 0.147.0。

## 复核记录

2026-10-26 按 check-paper-note 复核：基准为当前 arXiv v2（41 页，sha `c633082a…`；2026-10-25 首次阅读副本 `ce88e54a…` 的 p4 Figure 1 不完整，当前副本完整）。逐项核对 Table 1–4、公式 (1)/(7)/(8)/(9)、§5.2–5.5 数字、Figure 1–4、README 00218 行、代码 / 许可；另由独立子 agent 做三轮只读审计。

**本轮修正**：

- Figure 1 版本判断与配图（补 `figure1-overview.png`）、v2 sha；
- 假阳性 / precision 表述；
- v1 / v2 单位名与作者标记（Z.AI Co., Ltd.→Z.AI；Kuaishou–Kuaishou Technology→Kling AI；补充共同一作 / 通讯作者标记）；
- 3 处引用定位、2 个文件名与少量口径措辞；
- 补充 ProgramBench 固定 high-effort profile、C.1 input token 数、演化成本枚举中的验证集评估；
- 第三轮修正 planner / editor 归属、heavy vs Vanilla 概括、$H_{i}^{t}$ 记号、lite 延迟与 Balance 限定、harness 产物表归属，并补 medium vs RHO+Iteration 与 GLM 对比、引文补 task、Eq (8) 零分母边界说明。

未发现实验数字 / 公式 / 结论错误。**未修项**：§5.1「3 次运行」的语义原文未说明，保留为待确认问题。

2026-11-28 按读者版结构重写 `note.md`，把来源细节、核对凭据、表述张力、工程细节与逐表逐图读数迁入本文件；未重新获取原文，未改动任何数字与结论。

## 原文自身的表述张力

以下不是「论文错了」，而是读摘要 / 结论时容易过度概括的地方；记录在此，方便对照原文。

1. **摘要的平均数口径**：`+2.0 pp` 与 `−26.1%` 是三个 benchmark 逐项变化的算术平均，不是池化平均，也不是每个 benchmark 的保证。逐项 pass 增益从 +0.7 到 +4.5 pp，成本降幅从 17.8% 到 33.9%；如果把三个 benchmark 的每任务平均成本之和按等权相除（RHO 7.36 美元 对 Heavy 5.64 美元），降幅约 23.4%；按测试任务数 59/100/100 加权则约 22.7%（均为本笔记复算），与 26.1% 不同。
2. **「lower cost than RHO」不等于「lower cost than Vanilla」**：GPT-5.5 × Codex 下，heavy 在 SWE-Bench Pro 与 ProgramBench 上比 Vanilla 贵（1.97 对 1.88、2.95 对 2.65），只是比 RHO 便宜；GLM-5.2 × Claude Code 下，heavy 在 SWE-Bench Pro 反而比 Vanilla 便宜（1.01 对 1.17），ProgramBench 仍更贵（14.95 对 11.34）。§5.2 的 "better task performance need not come at a higher execution cost" 应限定在 RHO 对比的语境里读。
3. **「all three RHO variants are Pareto-dominated」的读法**：§5.5 说的三个 RHO 变体是 dynamic routing、budget hooks、low reasoning effort（原版 RHO 是它们的 base）。严格核对 Table 3，这成立的前提是「允许为每个变体挑不同的 HarnessPro 模式」——例如 Terminal-Bench 2 上，Medium（76.3% / 0.56）支配 dynamic routing 与 budget hooks（同为 76.3%，但成本 0.92），而 low reasoning effort（62.7% / 0.45）更便宜，需要 Lite（72.9% / 0.43）来支配；不存在**单一** HarnessPro 模式同时支配三个变体。作者的原句作为「存在某个 HarnessPro 候选支配每个 RHO 变体」是成立的，作为「一个 HarnessPro harness 全面支配」则不成立。
4. **「each round ... higher pass rates at lower costs」是前沿级陈述**：§5.4 在 Terminal-Bench 2 上说每一轮都改善保留的 Pareto 前沿，但没有逐模式给每一轮的成对数字；SWE-Bench Pro 的 medium 则明确从 1.57 升到 1.66 再降到 1.26（§5.4 原文），说明并非每个模式每一轮都两项同时改善。所以这句话应理解为「前沿整体在移动」，不是「每个点单调变好」。

## 工程实现与外部资料（原「工程视角」）

### 演化产物的文件结构

附录 D 给出了演化后 harness 的实际产物（§D、Listings 7–26）。以 Terminal-Bench 2 medium 为例：

| 文件 / 目录 | 作用 |
| --- | --- |
| `runtime/model instructions.md` | TB2 medium 给 solver 的行为约束：按任务契约交付、窄范围检查、避免重复读、完成前做任务形状验证（Listing 8） |
| `runtime/profile rubric.md` | 从任务描述选 execution profile；profile 规定 reasoning effort 与工具预算 |
| `runtime/policy.json` | profile 表、tool-call 阈值（economy / strict / finalize）、tool output 的 history token limit / max chars / head / tail、RTK 开关、classifier 设置 |
| `runtime/hook.py` | `pre_tool_use` 计数与拒绝、`stage_context` 阶段提醒、`compact_text` 文本压缩 |
| `README.md`、`bin/repair-verify`、`checklists/` | SWE-Bench Pro 的 solver 指南、修复验证脚本与契约检查清单（§D.2、Listing 17） |

**一个具体的预算配置**（Terminal-Bench 2 medium，Listing 12/13）：standard profile 的 `economy after tools` 是 14、`strict after tools` 是 26、`finalize after tools` 是 44；tool output 的 `history token limit` 是 900、`max chars` 是 4000、`head chars` 是 2400、`tail chars` 是 900，`rtk enabled` 为 true。lite 把 standard / deep / research 的 finalize 阈值分别降到 38 / 48 / 40，并把 deep / research 的 reasoning effort 从 high 降到 medium；heavy 把 standard 提到 18 / 38 / 60、deep 提到 20 / 42 / 68、research 提到 16 / 36 / 60（§D.1）。

### 运行时是怎么省钱的

1. **路由**：先用一个轻量 classifier（GPT-5.5，medium effort）读任务描述，按 rubric 选 compact / lean / standard / deep / research 之一；分类器有 timeout、重试与 fallback profile（§D.1、Listing 12）。
2. **阶段提醒**：hook 在工具调用计数达到 `economy` 时提醒批量检查、别重复读；达到 `strict` 后每隔 `strict reminder every` 次提醒收敛；超过 `finalize` 直接 deny，要求用现有证据给最终答案（§D.1、Listing 11）。
3. **输出压缩**：`compact_text` 去重连续重复行，超长时保留 head / tail 并给出省略字符数；RTK 可以改写 Bash 调用以压缩输出（§5.3、§D.2、Listing 22；Listing 12 的 `rtk enabled`）。
4. **cache 友好**：提醒追加在 tool result 上，而不是改 system prompt 前缀，避免破坏 prefix cache（§5.3）。

这套设计的工程含义是：**harness 的「省钱」不是单点技巧，而是路由 + 预算 + 压缩 + 验证策略的组合**；单拿一个机制（例如只加 budget hooks）在 RHO 上可能降本但也降性能（§5.5、Table 3），组合起来才在 HarnessPro 的候选集里被选中。

### 成本口径与复现条件

- **成本**：按 token 用量与 Table 4 的公开 API 价格计算；GPT-5.5 用 272K 以下 context 的短上下文价格档，因为所有请求都在 272K 以下（§A.2）。这是**任务执行**成本，不含演化循环本身的开销。
- **价格表**（Table 4，p14）：GPT-5.5（272K 以下 context）uncached input 5.00 美元/M、cached input 0.50 美元/M、output 30.00 美元/M；GLM-5.2 为 1.40 / 0.26 / 4.40 美元/M。
- **延迟**：从 agent 开始执行到结束的 wall-clock，不含 grading；因服务器负载 / 网络波动，作为辅助指标（§3）。
- **复现**：仓库提供三种 benchmark × 三种模式的 harness、`scripts/` 运行脚本、`splits/` 留出集、Docker 配置与 `pyproject.toml`；quickstart 需要 Linux、Python 3.12/3.13、`uv`、Docker Compose、Codex CLI 0.147.0，以及各 provider 的 API 配置。**本笔记未实际跑通复现**，只核到仓库结构与 README 自述。
- **失败模式**（工程角度）：test synthesizer 生成了弱测试或错测试；planner 提出不可泛化的 task-specific 改动；router 低估任务难度导致 reasoning effort 不足；输出上限 / 预算 deny 把有用诊断截掉；这些在 §B 的 instruction 与 §D 的 rubric 里都有对应的防护措辞，但不是硬保证。

## 实验与证据细节（原「实验与证据」逐表逐图内容）

### 5.1 设置

- **Benchmark 与留出**：Terminal-Bench 2（留出 59 个任务）、SWE-Bench Pro（100）、ProgramBench（100）；其余任务里用 DPP 选 10 个作为训练 coreset，剩下的是验证集（§5.1、§A.1）。
- **Backbone / agent**：GPT-5.5 × Codex 0.147.0；GLM-5.2 × Claude Code 2.1.231（§5.1）。
- **演化预算**：每个候选在每个训练任务上 $G=3$ 次 rollout；Terminal-Bench 2 与 SWE-Bench Pro 跑 3 个 epoch，ProgramBench 跑 4 个；每轮最多保留 3 个 harness（§5.1）。
- **Baseline**：Vanilla（原始 Codex / Claude Code harness）、Dynamic Cheatsheet、ReasoningBank、Sleep-time Compute、RHO；另外两个 RHO 变体用来分离「成本感知」与「递归」的贡献：`Balance`（只改 RHO 的优化指令，要求以更低成本取得更好或不降的任务性能）与 `RHO+Iteration`（Balance 跑同样多轮，每轮用 RHO 的 best-of-N 选一个继续）（§5.1）。
- **指标**：pass rate（Terminal-Bench 2 / SWE-Bench Pro 要求全部官方测试通过；ProgramBench 按官方协议取每个任务测试通过比例的宏平均）、每任务平均成本（美元）、平均执行时间（秒）；延迟是辅助指标，因为会受服务器负载 / 网络影响（§3、§5.1）。
- **重复次数**：Terminal-Bench 2 与 SWE-Bench Pro 报 3 次运行的 mean ± sample std，ProgramBench 报 2 次（§5.1）。论文没有明确说明这 3 次是「独立重新演化 3 次」还是「同一批冻结 harness 重复测试 3 次」；Figure 4 的题注写的是 "Final-epoch points show means across repeated test runs"，更接近后者。这个歧义会影响 std 的解释（见「局限与待确认问题」）。

### Table 1（方法定位，p3）

| 方法 | 目标 | 范围 | 反馈 | 迭代 | 输出 |
| --- | --- | --- | --- | --- | --- |
| AFlow (Zhang et al., 2025) | Pass | Workflow | Ground truth | Recursive | Single |
| SkillMOO (Gong et al., 2026a) | Pass + Cost | Skills | Ground truth | Recursive | Pareto set |
| RHO (Pan et al., 2026a) | Pass | Skills + tools | Label-free | Single round | Single |
| AHE (Lin et al., 2026) | Pass | Harness | Ground truth | Recursive | Single |
| HarnessPro | Pass + Cost | Harness | Label-free | Recursive | Pareto set |

> 上表照抄 Table 1（p3）的列序与取值；它比较的是方法定位，不是实验结果。

### 5.2 主结果的完整读数

heavy 档相对 RHO 的逐项结果（数据来自 Table 2，p8；Δ 为本笔记复算，成本降幅按相对变化算）：

| Benchmark | Backbone | RHO：P / C / T | Heavy：P / C / T | ΔP | ΔC |
| --- | --- | --- | --- | --- | --- |
| Terminal-Bench 2 | GPT-5.5 × Codex | 76.3 / 1.09 / 354 | 80.8±1.0 / 0.72±0.05 / 310±31 | +4.5 pp | −33.9% |
| SWE-Bench Pro | GPT-5.5 × Codex | 80.0 / 2.68 / 437 | 80.7±0.6 / 1.97±0.02 / 333±10 | +0.7 pp | −26.5% |
| ProgramBench | GPT-5.5 × Codex | 68.8 / 3.59 / 928 | 69.6±1.03 / 2.95±0.13 / 888±32 | +0.8 pp | −17.8% |
| Terminal-Bench 2 | GLM-5.2 × Claude Code | 78.0 / 1.00 / 1318 | 81.4±1.7 / 0.62±0.02 / 1080±15 | +3.4 pp | −38.0% |
| SWE-Bench Pro | GLM-5.2 × Claude Code | 75.0 / 2.17 / 520 | 77.3±0.6 / 1.01±0.03 / 412±11 | +2.3 pp | −53.5% |
| ProgramBench | GLM-5.2 × Claude Code | 63.3 / 17.00 / 6434 | 64.4±0.8 / 14.95±0.08 / 5925±110 | +1.1 pp | −12.1% |

> P 是 pass rate（%），C 是每任务平均成本（美元），T 是平均执行时间（秒）；RHO 行来自 Table 2（无 std），Heavy 行照抄 Table 2 的 mean±std。ΔP 是百分点差，ΔC 是相对变化；两者都是本笔记复算。

把六行放在一起看：

- **heavy 在两种 backbone、三个 benchmark 上都比 RHO 的 pass rate 高、成本低**；pass rate 增益最小的是 GPT-5.5 的 SWE-Bench Pro（+0.7 pp），最大的是 Terminal-Bench 2（+4.5 pp）；成本降幅最小的是 GLM-5.2 的 ProgramBench（−12.1%），最大的是 GLM-5.2 的 SWE-Bench Pro（−53.5%）。
- **摘要的 +2.0 pp / −26.1% 是 GPT-5.5 三行的算术平均**：pass rate 差 $(4.5+0.7+0.8)/3=2.0$；相对成本降幅 $(33.9+26.5+17.8)/3=26.1$（本笔记复算，取一位小数）。GLM-5.2 的对应均值是 $(3.4+2.3+1.1)/3\approx2.3\ \mathrm{pp}$ 与 $(38.0+53.5+12.1)/3\approx34.5\%$（本笔记复算），摘要没有给这两个数。
- **medium / lite 的定位**：GPT-5.5 下 medium 在 Terminal-Bench 2 与 RHO 打平（76.3%），成本 0.56 对 1.09（−48.6%）；在 SWE-Bench Pro 是 79.0% 对 80.0%（低 1.0 pp），成本 1.26 对 2.68（−53.0%）；ProgramBench 67.9% 对 68.8%（低 0.9 pp），成本 2.90 对 3.59（−19.2%）。GPT-5.5 的 lite 在三个 benchmark 上都高于 Vanilla 的 pass rate，成本分别比 Vanilla 低 51.7%、57.4%、17.7%（本笔记复算）。GLM-5.2 下 medium / lite 的 pass rate 也都高于 Vanilla；lite 三项成本都更低，medium 在 ProgramBench 的成本高于 Vanilla（13.74 对 11.34），TB2 / SWE 更低（本笔记核对 Table 2）。
- **与 RHO+Iteration 比**：GPT-5.5 下 RHO+Iteration 在 Terminal-Bench 2 是 76.3% / 0.82 / 328；heavy 是 80.8% / 0.72 / 310（+4.5 pp、−12.2% 成本），medium 与它打平（76.3%），成本 0.56 对 0.82（−31.7%）。SWE-Bench Pro 是 80.0% / 1.90 / 375 对 heavy 80.7% / 1.97 / 333（+0.7 pp，但成本高 3.7%）；ProgramBench 是 68.3% / 3.13 / 789 对 heavy 69.6% / 2.95 / 888（+1.3 pp、−5.8% 成本）。所以 heavy 并非在每一项上都比 RHO+Iteration 便宜；medium 在 Terminal-Bench 2 上则以更低成本打平。
- **延迟**：heavy 相对 RHO 在六个组合上都是更低（例如 GLM-5.2 的 SWE-Bench Pro 从 520 秒降到 412 秒）；但 GPT-5.5 的 lite 在 ProgramBench 是 985 秒对 RHO 的 928 秒（更慢），GLM-5.2 的 lite 则是 3907 秒对 6434 秒（更快）。论文的措辞是 "in most cases"（§5.2），不是全部。

**一个容易被摘要带偏的比较**：heavy 的「低成本」是相对 RHO，不是相对 Vanilla。GPT-5.5 × Codex 下，heavy 在 SWE-Bench Pro 的成本是 1.97 对 Vanilla 1.88（高 4.8%），ProgramBench 是 2.95 对 2.65（高 11.3%）；只有 Terminal-Bench 2 是 0.72 对 0.89（低 19.1%）（本笔记复算）。所以在这一 backbone 下，更准确的读法是：**heavy 用比 RHO 少的钱买到比 RHO 高的 pass rate；相对 Vanilla，它在 SWE-Bench Pro 与 ProgramBench 上多花一点钱换更高性能，在 Terminal-Bench 2 上则更便宜**。GLM-5.2 × Claude Code 下则不同：Terminal-Bench 2（0.62 对 0.92）与 SWE-Bench Pro（1.01 对 1.17）的 heavy 比 Vanilla 便宜，只有 ProgramBench 更贵（14.95 对 11.34）。论文 §5.2 的 "better task performance need not come at a higher execution cost" 是放在与 RHO 对比的段落里说的，不应泛化成「对所有 baseline 都降本」。

### 5.3 演化后的 harness 做了什么

作者检查了演化出的 harness（§5.3、§D），发现提升不是靠「压缩上下文」或「无脑增加 reasoning effort」，而是几类机制的组合：

1. **按任务描述动态分配 reasoning effort 与 tool budget**：Terminal-Bench 2 与 SWE-Bench Pro 的 harness 先从任务描述选一个 execution profile；profile 指定 reasoning effort 与工具调用预算；lite / medium / heavy 用不同 rubric 选 profile。ProgramBench 的 medium 则用固定 high-effort profile，没有 routing rubric（§D.3）。
2. **runtime hooks 执行预算**：例如 Terminal-Bench 2 的 medium 在 standard profile 下，14 次工具调用后提醒并行调用、避免重复检查；26 次后转入收敛 / 验证；44 次后阻止继续调用。提醒追加在 tool result 上，保留 prompt 前缀以便 cache 复用（§5.3）。
3. **降低静态上下文冗余**：用类似 RTK 的工具输出压缩折叠重复日志、压缩长输出；精简 developer instructions，减少重复的 prompt 内容（§5.3）。
4. **保留必要的验证**：不是简单砍掉验证，而是把验证集中到与任务契约相关的检查上；SWE-Bench Pro 的 harness 还带 `repair-verify` 脚本与 checklist（§D.2）。

这些机制是**演化搜索出来的**，不是作者手工写死的；论文把它们作为「为什么能同时提性能降成本」的解释（§5.3）。但这也意味着具体阈值（14 / 26 / 44 等）是某个 benchmark 上的产物，换模型 / 任务分布是否还合适，需要重新演化或调参。

### 5.4 演化动态与 Figure 4

Figure 4（p9）把三个 benchmark 的逐 epoch 点画在「成本–性能」平面上；题注说明中间 epoch 的 test 指标只用于可视化，不参与过滤 / 选择，最终点才是重复 test 运行的均值。正文给出的关键读数（§5.4）：

- Terminal-Bench 2：heavy 的 pass rate 从 epoch 1 的 74.6% 升到 epoch 3 的 80.8%，每任务成本从 0.91 美元降到 0.72 美元；lite 与 medium 从 epoch 2 到 3 保持 pass rate，成本分别从 0.61 降到 0.43、从 0.68 降到 0.56。
- SWE-Bench Pro：medium 从 epoch 1 的 70.0% / 1.57 美元，到 epoch 2 的 77.0% / 1.66 美元（pass 升、成本也升），到 epoch 3 的 79.0% / 1.26 美元（两项都改善）。这说明**单轮演化可能在提性能的同时抬成本，多轮才把成本压回来**。
- ProgramBench：第 4 个 epoch 在三个模式上都降成本，pass rate 大致持平。

> 注意：Figure 4 的横轴是每任务平均成本（美元），纵轴是 pass rate（%）；面板 (c) 的纵轴是 ProgramBench 的 macro-average pass rate。图中还标了 Vanilla、RHO、RHO+Iteration、Balance、Dynamic Cheatsheet、ReasoningBank、Sleep-time Compute 等 baseline 的位置。本笔记没有从图中取精确读数，所有数字以 §5.4 正文为准。

![Figure 3: 递归 harness 更新、过滤与选择示意（v2 p6）](assets/figure3-recursion.png)

*Figure 3（原文 p6）：每一轮从候选集里过滤并选出 lite / medium / heavy，三个被选中的 harness 再进入下一轮；图中 $H_{i}^{t}$ 的上标是轮次、下标是候选编号（如 $H_{1}^{2}$ 表示第 2 轮的候选 1）。读者版未收录本图。*

### 5.5 消融

Table 3（p9）用 GPT-5.5 × Codex 做消融，报告 pass rate、每任务成本与 Cost-of-Pass（CoP，总执行成本除以成功任务数）。要点：

- **去掉 planner**：多数实验里 pass rate 下降、成本上升。例如 SWE-Bench Pro 的 medium 从 79.0% / 1.26 美元降到 73.0% / 1.42 美元。例外是 Terminal-Bench 2 的 lite：pass rate 保持 72.9%，成本从 0.43 降到 0.41（本笔记核对），所以论文的措辞是 "in most experiments"。
- **去掉 test synthesizer**：影响更大，两个 benchmark、三个模式的 pass rate 下降 3.4–10.0 pp（§5.5）。例如 SWE-Bench Pro 的 medium 从 79.0% 降到 69.0%，heavy 从 80.7% 降到 72.0%。
- **把单个机制搬回 RHO**：给 RHO 加 dynamic routing 或 budget hooks 都能降成本，但 pass rate 也可能下降（SWE-Bench Pro 上两个变体都低于 RHO 的 80.0%）；统一用 low reasoning effort 降本更多，但 pass rate 掉到 62.7%（Terminal-Bench 2）与 59.0%（SWE-Bench Pro）。
- **CoP**：HarnessPro-Heavy 在 Terminal-Bench 2 是 0.89 美元、SWE-Bench Pro 是 2.44 美元，低于 RHO 的 1.43 与 3.35；也就是说不仅每任务成本低，按「每个成功任务」摊的成本也更低（Table 3）。

### 数字口径复算

- 摘要 `+2.0 pp` / `−26.1%`：GPT-5.5 三行 pass 差 $(4.5+0.7+0.8)/3=2.0$；相对成本降幅 $(33.9+26.5+17.8)/3=26.1$。
- 若把三个 benchmark 的每任务平均成本之和等权相除：RHO $1.09+2.68+3.59=7.36$，Heavy $0.72+1.97+2.95=5.64$，降幅约 23.4%。
- 按测试任务数 59/100/100 加权，降幅约 22.7%。
- GLM 三行均值：pass 差 $(3.4+2.3+1.1)/3\approx2.3$ pp；成本降幅 $(38.0+53.5+12.1)/3\approx34.5\%$。
- 假阳性矩阵（Figure 2）：官方 Fail 12 个，生成测试判 Fail 10；官方 Pass 8 个，判 Fail 1 个。若以 Fail 为正类，failure precision $=10/(10+1)\approx90.9\%$（本笔记复算）。

## 局限与待确认问题（完整版）

**作者明确讨论的局限**：论文没有单独的 Limitations 节；§6 只做总结，p10 有 AI Use Statement 与 Reproducibility Statement。因此下面主要是读者根据证据提出的判断，已尽量区分。

1. **演化成本没有计入报告的每任务成本**：Table 2 的成本是任务执行成本；跑完整个 RSI 循环需要多轮 rollout（每轮 10 个训练任务 × 3 次 × 多个候选）、analyzer / planner / editor 的 LLM 调用、每个任务 10 个测试的合成，以及每轮在所有验证任务上对每个候选的评估（Algorithm 1 第 17 行）。论文没有报告这些开销，也没有报告演化一次的总 token / 美元。对部署方来说，真实 TCO 可能明显高于表里的每任务成本。
2. **生成测试的质量只强调了 failure recall**：Figure 2 的 41.7%→83.3% 是 12 个官方 Fail 样本上的 recall；官方 Pass 的 8 个样本里有 1 个被生成测试误判（12.5% 假阳性）。正文没有给出 precision、测试覆盖率或跨任务稳定性（Figure 2 的假阳性格可以看到，但正文未把它作为指标讨论；若以 Fail 为正类，由该矩阵可算 failure precision = 10/(10+1) ≈ 90.9%，本笔记复算）。生成测试在整个演化中固定，候选可能逐渐适配这些测试；held-out test 能缓解但不能完全排除这种过拟合。
3. **「3 次运行」的含义不清**：§5.1 说 Terminal-Bench 2 / SWE-Bench Pro 的 mean±std 来自 3 次运行，ProgramBench 来自 2 次；Figure 4 题注说最终点是 "means across repeated test runs"。如果只是同一批冻结 harness 重复测试，std 反映的是测试噪声，不是演化过程本身的方差；如果是独立重新演化，论文应该说明每次演化是否用不同随机种子 / 不同 coreset。这个歧义影响对结果稳健性的判断。
4. **只覆盖 2 个 backbone × 3 个 benchmark**：GPT-5.5 × Codex 与 GLM-5.2 × Claude Code，任务类型是 terminal、repository-level SWE、program reconstruction。对更弱的模型、非代码 agent、长程交互或工具生态不同的场景，成本-性能前沿可能不同；论文没有做跨模型规模的 scaling 分析。
5. **没有与同类 harness RSI 方法做完整实证对比**：Table 1 把 AFlow、SkillMOO、RHO、AHE 放在一起做定位比较，但实验里主要 baseline 是 RHO 及其变体；AFlow / SkillMOO / AHE 没有在同样三个 benchmark 上跑。因此「比同类方法好」的证据主要是相对 RHO，而不是相对所有同类。
6. **超参与选择规则的敏感性没有消融**：coreset 大小 $k=10$、$G=3$、epoch 数（3/4）、每轮最多保留 3 个、权重 `(1,2)/(1,1)/(2,1)`、DPP 的 $\varepsilon=0.1$ / $\theta=0.7$ 都是固定的；论文没有报告这些选择对结果的影响。归一化选择依赖当前候选池的极值，换候选池可能改变代表点；也没有讨论权重是否需要按部署预算重新调。
7. **成本是 token 价格，不是总算力 / 总时长**：成本按公开 API 价格换算，计入 cached / uncached token 用量，但未单独分析缓存命中率变化、并行 / 重试或基础设施费用对结果的影响；延迟是 wall-clock 且受负载影响。不同 provider / 部署方式下的「成本」可能不同。
8. **代码仓库的可复现性未验证**：仓库结构、MIT 许可、harness 产物与脚本都在，但本笔记没有实际跑通；README 的 "Paper (coming soon)" 徽章也说明仓库自述状态可能滞后。复现前需要确认 evolution pipeline（analyzer / planner / editor / test synthesizer）是否完整开源，而不只是冻结的 harness 产物。

**可以问作者的问题**：

- 3 次运行是独立重新演化，还是同一批 harness 的重复测试？如果是后者，演化方差有多大？
- 演化一次的总成本（rollout + agent 调用 + 测试合成）是多少？与单轮 RHO 相比如何？
- 生成测试的 precision / 假阳性、跨任务覆盖率、以及候选对固定测试的过拟合程度，能否给出更多数据？
- 如果把 $k$、$G$、epoch 数、权重或 coreset 选择方法换掉，Pareto 前沿会怎么移动？
- 在非代码任务或更弱模型上，这套方法是否仍然有效？

## 与本仓库其他条目的关系

- **HarnessX（00199，arXiv 2606.14249）**：本文在 §2 引用，作为「用 typed primitives 组合 harness、用轨迹证据」的代表。两者的共同点是都把 harness 当作可演化的对象；差异是 HarnessX 侧重可组合的 primitives，HarnessPro 侧重「完整 harness + 成本目标 + Pareto 三档 + 固定生成测试」的递归搜索。HarnessX 的笔记在 `notes/papers/2606.14249-v3-harnessx/`。
- **RHO（arXiv 2606.05922）**：本文的主 baseline，也是 DPP coreset、label-free 设定与 harness 编辑流程的直接前代。RHO 用 LLM 自偏好选候选、只优化 pass rate、单轮；HarnessPro 把「选择器」换成固定生成测试，把「目标」扩成 pass + cost，把「输出」扩成 Pareto 集，把「迭代」扩成多轮。RHO 目前不在本仓库清单里。
- **同族但本文未引用**：RRSI（00212，正则化 RSI，重点在抑制演化过拟合）、HarnessDev（00189，LLM 创建 / 演化 harness）、Dream-RSI（00214，通过演化 world 做 RSI）、Prime Agent（00205，RLM harness）。这些与 HarnessPro 同属 harness / agent RSI 家族，但 HarnessPro 的 References 中没有它们（本笔记全文检索 `RRSI`、`HarnessDev`、`Prime Agent`、`Dream` 均为 0 次）；对照时不要把「同族」写成「本文引用 / 对比」。

## 迁移索引

2026-11-28 读者版重写时，以下内容从 `note.md` 移入本文件：

- 来源信息表中的 v1→v2 差异、PDF 副本 sha256 与 Figure 1 缺陷、代码仓库 API 细节、归档说明；
- 原「阅读范围」整行、原「配图」整行；
- 原「复核记录」整行（2026-10-26）；
- 原「核对凭据」整块（含否定性检索与代码仓库 API 值）；
- 原「问题与动机」中的 Table 1（方法定位，p3）；
- 原「方法与贡献」中的「贡献与证据边界」表、论文自报效率数字说明；
- 原「关键公式与直觉」的公式块（Eq. 1/7/8/9 已并入读者版「方法」，本节不再重复）；
- 原「实验与证据」的 5.1 设置全量、5.2 六行主表与逐条读数、5.3 演化后 harness 的完整机制列表、5.4 Figure 4 逐条读数、5.5 消融全部要点，以及本笔记新增的「数字口径复算」；
- 原「原文自身的表述张力」整节（4 条）；
- 原「工程视角」整节（产物文件结构、预算配置、运行时省钱机制、成本口径与复现条件）；
- 原「局限与待确认问题」完整版（8 条 + 5 个问题）；
- 原「与本仓库其他条目的关系」整节。


## 旧版细节补遗（2026-11-28 验收）

> 读者版压缩时删掉了以下表格/数字；按旧版原样保留在档案中，正文不重复。

### 旧版效率数字与 token 口径

- **迭代**：从 RHO 的单轮变为多轮递归；每轮把选中的 harness 作为下一轮候选。

**论文自报的效率数字**：主要是每任务平均成本（美元）与执行时间（秒）；主结果表没有 FLOPs、聚合 token 预算或吞吐指标，附录 C.1 只有零星轨迹的 input token 数（1,058,946 / 1,763,487 / 2,517,861）。成本按 token 用量与 Table 4 的公开价格换算（§3、§5.1、§A.2、Table 4）。注意这些成本是**任务执行**的成本，不是跑完整个演化循环（多轮 rollout、analyzer、planner、editor、test synthesizer）的成本——后者论文没有报告。

---
