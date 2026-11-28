# Agentic Harness Engineering: Observability-Driven Automatic Evolution of Coding-Agent Harnesses

## 来源信息

| 项 | 内容 |
| --- | --- |
| 标题 | Agentic Harness Engineering: Observability-Driven Automatic Evolution of Coding-Agent Harnesses |
| 作者 | Jiahang Lin\*‡、Shichun Liu\*‡、Chengjun Pan\*‡、Lizhi Lin、Shihan Dou、Zhiheng Xi、Xuanjing Huang、Hang Yan、Zhenhua Han†、Tao Gui†、Yu-Gang Jiang（\* 共同一作；† 通讯作者 hzhua201@gmail.com、tgui@fudan.edu.cn；‡ 在 Shanghai Qiji Zhifeng Co., Ltd 实习期间完成（论文未给中文名）） |
| 机构 | 第 1、2、5、6、7、10、11 位作者为 Fudan University；第 3 位为 Peking University；第 4、8、9 位为 Shanghai Qiji Zhifeng Co., Ltd。第一机构为 Fudan University |
| 来源 | [arXiv:2604.25850v4](https://arxiv.org/abs/2604.25850v4)（cs.CL; cs.SE）；v1 2026-04-28 → **v4 2026-05-18**（阅读时为最新版；v2/v3 为 2026-04-29/04-30，本笔记只读 v4，未逐版 diff） |
| 原文 | PDF 35 页、1,432,986 B、sha256 `299f2633b4c13db7bed52434b4db7c48ea621993581014d30e7bcd036d3464df`；同版 HTML 1,935,152 B 用于交叉核对 |
| 许可 | arXiv.org perpetual non-exclusive license 1.0（**不是 CC**）；本笔记配图按该许可注明出处 |
| 代码 | <https://github.com/china-qijizhifeng/agentic-harness-engineering>（MIT；创建 2026-04-23，最近推送 2026-10-30，commit `182ea06e…`；顶层有 `evolve.py`、`agents/`、`configs/`、`skills/`、`experiments/`、`tests/` 与 `pyproject.toml`）。**仓库描述/README 自报**在 TB2 上用 GPT-5.5 达到 84.7%±2.1，这个数字不在 v4 论文里，未验证 |
| 阅读日期 | 2026-11-19 |
| 仓库编号 | 00231（已收入 `### Fudan University` 组；论文单位列写 Fudan University） |
| 阅读范围 | v4 全文 35 页：§1–5、Limitations、References、附录 A–E。**已渲染页核对**：Table 1（p.6）、Table 2（p.7）、Table 3（p.8）、Table 4（p.16）、Table 5（p.17）逐格；Figure 1（p.2）、2（p.4）、3（p.8）、4（p.9）看图；Algorithm 1（p.5）逐行；Table 4/5 正文只转写影响理解的关键值；附录 C/D 只按正文与图注引用，Figure 5–13 未逐张渲染核对。**本笔记复算**：Table 2 的 per-repo 加权、Table 3 的增益求和、Table 5 的 Succ/Mtok、Figure 1 的 best-so-far 与逐轮值（PDF 矢量坐标 + 网格线定标）。**未做位图像素颜色测量** |
| 配图 | `assets/` 下 2 张，自 v4 PDF 300 dpi 裁剪：Figure 1 裁剪框 `(116, 72.6, 493, 258)` pt、成品 1572×773；Figure 2 裁剪框 `(104, 73, 508, 279)` pt、成品 1684×859。均回看确认图例、三个观测层标题与坐标轴完整，无页眉/截断 |

---

## 复核记录（2026-11-19）

- **基准**：重取 arXiv v4 PDF（1,432,986 B、35 页、sha256 `299f2633…3464df`，与笔记记录一致）；同版 HTML 1,935,152 B；独立子 agent 审计 + 本笔记逐条复验。
- **方式**：Table 1–5 在 250–300 dpi 渲染页逐格；Figure 1–4 对照渲染页；Algorithm 1 对 PDF p.5 逐行；Figure 1 用矢量坐标 + 网格线定标复读；Table 2/3/5 复算；跨条目核对 SIM/RRSI/Harness²/HarnessX/HarnessDev/Self-Harness 的笔记与编号。
- **本轮修正**：① Algorithm 1 页码由 p.4–5 改为 p.5（三处）；② 伪代码补 $V_{t} = \varnothing$（原文第 9–10 行的 `else` 分支）；③ 删除「跨方法只对齐轮数与候选预算」这一无原文依据的说法，改为「原文未说明」；④ SIM 关系改为「起点 harness + 通用 proposer–selector 流程」，不再说 SIM 的循环直接来自 AHE 或继承 rollback；⑤ 角色名改为 Code Agent / Agent Debugger / Evolve Agent；⑥ Table 1/2/3 的加粗与原文 per-column best 对齐，Table 2 注明只摘 success 列；⑦ 澄清「7 类可编辑组件」与「实际增益集中在四层」；⑧ path-tracing 标成 iter 4 0/2 → iter 5 2/2；⑨ Hard 补充也低于 TF-GRPO 55.6%；⑩ 「第一建议」改为「clearest direction」；⑪ 四案例与 Table 3 的连线标为「本笔记综合/推断」；⑫ RRSI 的 3.82M 改为 policy tokens/trial，Self-Harness 补 00198；⑬ HarnessDev 的「AHE 可作被测量对象」标为推断；⑭ 单次 campaign 改为「原文未报告多 seed」；⑮ 补充 §4.3 自身「three alternate base models」与「five alternate bases」并存的张力；⑯ 补充 Appendix A「each table states k」与 Table 1 未写 k 的矛盾；⑰ 实习单位保留英文名，不臆造中文名。
- **未修 / 未核**：仓库 84.7%±2.1、star/许可/commit 日期等渠道项按独立审计要求未复核（本笔记先前用 GitHub API 核过仓库存在性与 MIT，未运行代码）；v1–v3 未逐版 diff；Figure 5–13 未逐张做像素核对。

---

## 核心结论

一句话：**AHE 把"改 coding agent 的 harness"做成一个由另一个 agent 驱动、每轮都可归因的闭环——它不靠更强的优化器，而靠把三件事变成可观测的结构化产物：可编辑组件（文件级）、执行经验（分层证据语料）、以及每次编辑的决策（带预测的 change manifest）；在 Terminal-Bench 2 上十轮把 pass@1 从 69.7% 提到 77.0%，冻结后的 harness 还能跨 benchmark 与跨模型迁移，而增益主要落在 tools、middleware 与 long-term memory，不在 system prompt。**

作者的三条主张：

1. **方法**：AHE 用三个"可观测性支柱"解决 harness 自动化的三个障碍——异构的编辑空间、淹没信号的百万级轨迹、难以归因的编辑效果；每个编辑都变成"文件级、可被下一轮证伪的契约"。
2. **结果**：10 轮把 TB2 pass@1 从 69.7% 提到 77.0%，超过人工 harness Codex（71.9%）与自进化 baseline ACE（68.9%）、TF-GRPO（72.3%）；冻结 harness 在 SWE-bench-verified 上保持最高聚合成功率且比种子少 12% token，在三个跨厂商模型族上 +5.1 到 +10.1 pp。
3. **分析**：增益集中在 tools / middleware / long-term memory，system prompt 单独替换反而 −2.3 pp；组件之间非可加，单个组件增益之和（+11.1 pp）大于完整 AHE（+7.3 pp）；自归因对"修好哪些题"约 5× 随机基线，对"会弄坏哪些题"只有约 2×，**回归预见是这套 loop 最明确的短板**。

![Figure 2](assets/figure2-three-pillars.png)

*图 2（原文 Figure 2，p.4）：三个可观测层。左侧 NexAU harness 把 system prompt / skills / tools / middleware / sub-agent / memory 暴露成文件；中间 Coding Agent 在 environment 里产生约 10M token 的 raw trace，经 Agent Debugger 压成约 10K token 的 overview；右侧 Evolve Agent 读证据、改组件，并把决策写回。裁剪自 v4 PDF，许可见来源信息。*

---

## 问题与动机

### harness 是 coding agent 的一等变量，但仍是手工活

- harness 指模型外部、可编辑的那一层：system prompt、tools、middleware、skills、sub-agents、long-term memory 等（§1、§2.1）。固定模型时，harness 设计仍能显著改变长程 coding 任务的完成率。
- 更麻烦的是 **harness 是模型特定的**：为一个 base model 调好的 harness 换一个模型常会变差，模型换代后还要重新适配；而人工适配要反复看轨迹、找失败模式、手改多个组件，跟不上模型更新节奏。

### 自动化为什么难

作者把障碍归为三点（§1）：

1. **异构编辑空间**：可改的东西横跨 prompt、工具描述、工具实现、middleware、skill、sub-agent 配置、memory；它们耦合在一起，改一处容易破坏另一处。
2. **轨迹太长**：一次 rollout 产生海量原始消息，真正可行动的失败信号被埋在百万级 token 里。
3. **效果难归因**：一个编辑到底修好了什么、弄坏了什么，往往说不清。

已有方法多数只动一个面：prompt、skills、in-context playbook，或程序结构的某一层。AHE 的切入点是：**瓶颈不是优化器能力，而是可观测性**——只要把组件、经验、决策都变成结构化、可分层的产物，一个普通的 agent 就能稳定地改进 harness。

---

## 方法与贡献

### 1. 组件可观测性：NexAU 基座（§3.1）

AHE 把 harness 实例化在 NexAU 框架上，把 **7 类组件**作为固定挂载点下的显式文件：

| 组件 | 作用 |
| --- | --- |
| system prompt | 工作方式与行为规则 |
| tool description | 工具的自然语言说明 |
| tool implementation | 工具的实际代码 |
| middleware | 执行前后的拦截/注入逻辑 |
| skill | 可复用的操作知识包 |
| sub-agent configuration | 子 agent 的配置 |
| long-term memory | 跨任务保留的经验条目 |

组件之间松耦合（加 middleware 不必改 prompt，加 skill 不必动 tool），因此每种失败模式可以映射到单一组件类；一次逻辑编辑就是 workspace git 历史里的一个 commit，天然有文件级 diff 与回滚粒度。这就是 **component observability**。

种子 harness `NexAU0` 是刻意最小的：只有一个 shell 执行工具，没有 middleware、skills、sub-agents。理由是可归因——如果种子已经贴合 benchmark，就看不出后续增益来自 loop 还是来自种子。

### 2. 经验可观测性：Agent Debugger（§3.2）

每个任务用当前 harness 跑 $k$ 条 trace。Agent Debugger 把轨迹组织成一个**可导航的文件环境**：每条轨迹消息是一个文件，用普通 shell/脚本工具访问；同一 query 的轨迹放在同一环境里，debugger 被要求分析失败根因或成功模式，产出 per-task 分析报告（含该任务的 pass/fail 状态）。所有报告再聚合成一份 benchmark 级 overview，作为每轮 Evolve Agent 的入口。

原始轨迹也保留（raw 与轻量清洗两版），供 agent 回查报告中的断言；这些内容都以文件形式提供，支持 **progressive disclosure**，避免一次把全部 token 塞进上下文。Figure 2 把这一步标成约 10M token → 约 10K token 的压缩（图内示意数字）。

### 3. 决策可观测性：Evolve Agent（§3.3）

Evolve Agent 每轮读证据、决定增删改哪些组件、把编辑写进 workspace，并为每个编辑写一条 **change manifest**：

- 失败证据、推断的根因、目标修复；
- `predicted_fixes`（预期下一轮会修好的任务）与 `risk_tasks`（可能被弄坏的任务）；
- `constraint_level`（middleware / tool_impl / tool_desc / skill / prompt）与选择该层的理由。

两条硬约束把它变成"可证伪契约"：

1. **可控性**：Evolve Agent 只能写 workspace；`runs/`、tracer、verifier、LLM 配置都是只读，种子 system prompt 标记为不可删除。这样它不能靠关掉 verifier、换模型或抬高推理预算来"刷分"。
2. **证据驱动**：每个编辑都带预测；下一轮把预测的 fix/regression 集合与该轮任务级 delta 求交，得到 per-edit verdict；没实现的编辑按文件回滚。

### 4. 外层循环（Algorithm 1，p.5）

```text
H_best = H_0
for t = 1..N:
    T_t      = Rollout(M, H_{t-1}, D, k)          # 每个任务 k 条轨迹
    T_t_clean= Clean(T_t)                          # 规范化轨迹
    V_t = ∅                                         # t=1 时无上一轮可对账
    if t >= 2:
        V_t        = Attribute(C_{t-1}, T_{t-1}, T_t)   # 上一轮 manifest 对账
        H_{t-1}    = Rollback(H_{t-1}, V_t)             # 回滚未实现的编辑
    R_t          = AgentDebugger(T_t_clean)        # 分层蒸馏
    (H_t, C_t)   = Evolve(H_{t-1}, R_t, V_t)       # 改组件 + 新 manifest
    Commit(H_t, C_t, t)                            # git 标记本轮
    if pass@1(T_t) > pass@1(H_best): H_best = H_t
return H_best
```

读法：先 rollout，再清洗；从第 2 轮起先用上一轮 manifest 对账并回滚，再蒸馏、再编辑；每轮结束把当前 harness 与 manifest 一起 commit，并维护历史最优 $H_{\mathrm{best}}$。$k\ge 2$，这样每个任务都有 pass-rate 信号，部分通过的任务才能用于比较诊断。

另有一个 one-shot explore agent 与第 1 轮并行，从 NexAU 源码与公开 coding-agent 参考里"播种"少量可复用 skill；这些 skill 没有特殊保护，从第 2 轮起可以被保留、改写或删除。

### 5. 贡献边界

- **不是新模型/新训练**：base model 全程冻结，改的只是 harness 代码/配置；Code Agent、Agent Debugger、Evolve Agent 三个角色在主线里共用同一个 GPT-5.4，避免把增益归给"更强的优化器"。
- **结构性变化**：相对"只改 prompt / 只改 skill / 只改 playbook"的方法，AHE 把 7 类组件一起开放（实际演化与消融集中在 system prompt、tools、middleware、long-term memory 四层），并用文件级 commit + manifest 把每次编辑变成可回滚、可对账的对象。
- **效率口径**：论文自报的运行时成本是"一次 10 轮 campaign 约 32 小时"（§4.2），token 成本按 per-trial prompt+completion 计（§4.1、附录 A）；没有美元成本或能耗数字。

---

## 实验与证据

### 设置（§4.1、附录 A）

- **benchmark**：Terminal-Bench 2 全部 89 题，按官方难度 4 easy / 55 medium / 30 hard；每题超时 1 小时（3600 s）。
- **基础设施**：Harbor 调度与判分，每次 rollout 在全新 E2B 远程 sandbox；InMemoryTracer 记录轨迹并镜像到 Langfuse；Agent Debugger 并发 16、单任务 600 s。
- **模型与预算**：Code Agent / Agent Debugger 用 GPT-5.4 high；Evolve Agent 与 Explore Agent 用 GPT-5.4 xhigh；Code Agent 200k context、单轮最多 32k 生成、300 turns；Evolve 500 turns；外层 $T=10$、$k=2$、并发 96。
- **指标**：`pass@1` 为 $k$ 次 rollout 的二元成功率均值；基础设施异常/超时的 trial 记 0（不丢弃），与官方 leaderboard 口径一致；token 成本只统计完成的 trial（先剔除异常，避免截断值），单位 k tokens；$\mathrm{Succ/Mtok}=\frac{\mathrm{pass@1}\times10^6}{\text{每 trial 平均 token}}$。
- **baseline**：三种人工 harness（OpenCode、Terminus-2、Codex）、同一个 NexAU0 种子上的两种自进化（ACE、Training-Free GRPO），以及 AHE 自己。

### RQ1：主结果（§4.2、Table 1、Figure 1）

| 方法 | All | Easy | Med. | Hard |
| --- | --- | --- | --- | --- |
| 题数 | 89 | 4 | 55 | 30 |
| OpenCode | 47.2% | 75.0% | 52.7% | 33.3% |
| Terminus-2 | 62.9% | 75.0% | 74.5% | 40.0% |
| Codex | 71.9% | 75.0% | 80.0% | **56.7%** |
| NexAU0（种子） | 69.7% | 87.5% | 78.2% | 51.7% |
| ACE | 68.9% | 91.7% | 78.2% | 48.9% |
| TF-GRPO | 72.3% | **100.0%** | 79.4% | 55.6% |
| AHE | **77.0%** | **100.0%** | **88.2%** | 53.3% |

*表注：题数与各列为原文 Table 1；加粗沿用原文的 per-column best（ties 全部加粗）。*

- AHE 比种子 +7.3 pp，比 Codex +5.1 pp，比 TF-GRPO +4.7 pp，比 ACE +8.1 pp（本笔记复算）。
- **唯一的 tier 例外是 Hard**：AHE 53.3% 低于 Codex 56.7%（−3.4 pp），也低于 TF-GRPO 55.6%。作者把它归因于组件干扰，而非缺少能力：只把 AHE 的 long-term memory 换进种子（不动其他组件）在 Hard 上就有 63.3%，高于完整 AHE（§4.4.1）。
- Figure 1 的 best-so-far 曲线：69.7 → 74.16（iter 2）→ 74.72（iter 5）→ 75.84（iter 6）→ 76.97（iter 8 起持平）；逐轮 pass@1 本身非单调（iter 4、7 回落到约 73.0），对应"改进—回滚"的循环。该图是**一次 campaign** 的轨迹；原文只报告这一条运行，未报告多 seed 或误差带。

![Figure 1](assets/figure1-evolution-curve.png)

*图 1（原文 Figure 1，p.2）：AHE 在一次 campaign 里的 best-so-far 与逐轮 pass@1；三条水平虚线是 TF-GRPO（72.3）、Codex（71.9）、ACE（68.9），best-so-far 从种子 69.7 起步。四个标注对应 iter 2/5/6/8 的四次主要改动。该图只有一条运行轨迹，没有误差带。裁剪自 v4 PDF，许可见来源信息。*

### RQ2：跨 benchmark 与跨模型迁移（§4.3、Table 2、Figure 3）

**跨 benchmark（SWE-bench-verified，500 题）**：

*下表只摘 success rate 列（token 列见正文与原文 Table 2）；加粗为原文 per-column best，ties 全部加粗。*

| Repo | N | ACE | TF-GRPO | NexAU0 | AHE |
| --- | --- | --- | --- | --- | --- |
| All | 500 | 74.6% | 74.2% | 75.2% | **75.6%** |
| django | 231 | 79.2% | 78.8% | 79.2% | **81.0%** |
| sympy | 75 | 69.3% | 68.0% | **70.7%** | **70.7%** |
| sphinx-doc | 44 | 61.4% | 65.9% | 68.2% | **70.5%** |
| matplotlib | 34 | 70.6% | 70.6% | **73.5%** | **73.5%** |
| scikit-learn | 32 | **93.8%** | **93.8%** | **93.8%** | 87.5% |
| pydata | 22 | **77.3%** | **77.3%** | **77.3%** | 72.7% |
| astropy | 22 | **59.1%** | **59.1%** | 54.5% | 50.0% |

- AHE 的聚合成功率 75.6% 对种子 75.2%，**只高 0.4 pp**；作者称"highest aggregate"，但差距很薄，且在三个最小 repo（scikit-learn / pydata / astropy）上低于种子，作者归因于小 repo 的 pass@1 方差。
- token：AHE 461k vs 种子 526k、ACE 679k、TF-GRPO 582k；相对种子少 12.4%，相对 ACE 少 32.1%，相对 TF-GRPO 少 20.8%（本笔记复算）。按 `Succ/Mtok`，All 为 AHE 1.64、NexAU0 1.43、TF-GRPO 1.27、ACE 1.10。
- ACE / TF-GRPO 在 SWE-bench 上反而低于种子，且 token 更多；作者的解释是：它们的 playbook / 轨迹分布是在 TB2 上蒸馏的，到了另一个任务面只增加每次调用的上下文成本，没有改变底层策略。

**跨模型（TB2，同一冻结 harness，不再进化）**：

| Base | NexAU0 | AHE | 增益 |
| --- | --- | --- | --- |
| GPT-5.4 medium | 65.7 | 68.0 | +2.3 |
| GPT-5.4 high | 69.7 | 77.0 | +7.3 |
| GPT-5.4 xhigh | 72.5 | 74.7 | +2.3 |
| gemini-3.1-flash-lite | 36.5 | 41.6 | +5.1 |
| deepseek-v4-flash | 51.7 | 61.8 | +10.1 |
| qwen-3.6-plus | 56.2 | 62.5 | +6.3 |

- 五个 alternate base 全部为正（加上 high 的六个评估点都为正）；跨厂商三个（gemini / deepseek / qwen）增益 +5.1 到 +10.1 pp，同族 GPT-5.4 为 +2.3 到 +7.3 pp。作者认为跨族整体更大，但 gemini 的 +5.1 低于 high 的 +7.3，不能按「每个跨族都高于每个同族」读。
- 同族内**非单调**：medium +2.3、high +7.3、xhigh +2.3。作者的解读是：AHE 的 step budget 与 per-task timeout 是按 GPT-5.4 high 调的；medium 少了推理层级，xhigh 有更多 trial 撞 per-task timeout（按 pass@1 记 0），两头都折损增益。这把"迁移"和"运行点耦合"混在了一起，作者在 Limitations 里承认。

### RQ3a：增益落在哪些组件（§4.4.1、Table 3）

*表注：各列数值为原文 Table 3；加粗为原文 per-column best（ties 全部加粗）。*

| 变体 | All | Easy | Medium | Hard |
| --- | --- | --- | --- | --- |
| NexAU0 | 69.7% | 87.5% | 78.2% | 51.7% |
| + memory only | 75.3% | 50.0% | 83.6% | **63.3%** |
| + tool only | 73.0% | 75.0% | 87.3% | 46.7% |
| + middleware only | 71.9% | **100.0%** | 81.8% | 50.0% |
| + system_prompt only | 67.4% | 75.0% | 78.2% | 46.7% |
| AHE full | **77.0%** | **100.0%** | **88.2%** | 53.3% |

- 单独换入：memory +5.6 pp、tool +3.3 pp、middleware +2.2 pp、system prompt **−2.3 pp**；三个正的单项增益相加 +11.1 pp，大于完整 AHE 的 +7.3 pp。
- **非可加**是作者明确指出的：memory、middleware、prompt 都在推"更严格的完成前验证"，叠在一起会在长程预算里重复检查；evolve agent 优化的又是以 55 个 Medium 题为主的聚合分，于是收敛到 Medium 偏重的折中，牺牲了部分 Hard 上的 memory 收益。
- 各组件的具体形态：memory 是 12 条边界案例经验；tool 是 1364 行 shell，会在命令附近自动提示契约；middleware 是完成前的 evaluator 同构检查；system prompt 是 79 行通用纪律，单独插入无法执行。

### RQ3b：自归因可靠吗（§4.4.2、Figure 4、附录 D）

- **fix 预测**：跨轮平均 precision 33.7%、recall 51.4%，随机基线 6.5% / 10.6%，约 5×。
- **regression 预测**：precision 11.8%、recall 11.1%，随机基线 5.6% / 5.4%，只有约 2×。
- 附录 D 的累计口径：9 轮里 agent 提出 43 个唯一 regression 预测，只有 5 个命中（P=11.6%）；同时有 40 个它没预见的 regression 实际发生（R=11.1%）。
- 结论：agent 能较好地说"我这刀会修好什么"，但几乎不能预见"会弄坏什么"；这正是 Figure 1 里非单调回落的来源，也是作者称为最清晰的方向（clearest direction）的问题。

### 案例：四个轨迹与八次改动（附录 C）

附录 C 用 4 条轨迹（db-wal-recovery、path-tracing、mcmc-sampling-stan、configure-git-webserver）与 8 个 manifest 条目说明机制；这些是**机制示意**，不是对单个编辑的因果估计：

- **db-wal-recovery（iter 2）**：种子 1/2；失败 rollout 用缓存 stdout 重建 WAL、按 $\mathrm{value}=\mathrm{id}\times100$ 猜缺失行、用 `json length == 11` 自检。iter 1 的 chg-1 是 68 行 prompt append（8 条规则，不含 SQLite/WAL 关键词），其中 4 条在该轨迹上触发，任务 2/2；chg-1 的 `predicted_fixes` 甚至没列这个任务，说明通用规则可以跨任务生效。
- **path-tracing（iter 4 0/2 → iter 5 2/2）**：失败 rollout 渲染成功后用 `rm -rf` 清理，把交付物删掉，再按 shell 退出码提交。iter 5 的 publish-state guard 在 shell 层拦截删除，任务 2/2。
- **mcmc-sampling-stan（iter 6）**：连续 5 轮 0/2；失败 rollout 用网格积分当代理、把真实 MCMC 放后台又杀掉、只检查文件存在。iter 6 的 publish-state guard 保护 `analysis.R`，middleware 注入"代理验证/浅验证"提醒，任务 2/2。
- **configure-git-webserver（iter 8）**：iter 7 时 0/2；失败 rollout 用 `ALLOW_POST_SUCCESS_RESET` 覆盖令牌删掉 `hello.html`、清空 git ref，外部 verifier 收到 404。iter 8 把两类 reset 升级为硬阻塞，并让 middleware 的提醒在下一轮模型上下文中以 FRAMEWORK reminder 出现，任务和 git-multibranch 一起翻转。

（本笔记综合/推断）这四例也对应 Table 3 的"组件各管一个失败面"：prompt 规则、shell 工具、middleware 分别在不同层级拦截，单独换入时各自能修一部分，叠起来却会互相干扰。

### 成本

- 一次 10 轮 campaign 约 32 小时（§4.2）；单轮成本未拆。
- token 以 per-trial 计（完成 trial 的均值），SWE-bench 上 AHE 461k/trial，种子 526k；Table 5 的 Succ/Mtok 是派生指标。
- 论文没有美元成本、能耗或 wall-clock 的分项；原文只说明 ACE / TF-GRPO 与 AHE 共用 NexAU0 种子，没有说明跨方法的轮数、候选或 token 预算是否对齐。

---

## 工程视角

### 代码与运行形态（仓库核对，2026-11-19）

- 官方仓库 `china-qijizhifeng/agentic-harness-engineering`，MIT，Python ≥3.13，入口 `agentic-harness-engineering = "evolve:main"`（`pyproject.toml`）；依赖 `e2b`、NexAU（固定 commit）、Harbor 与 `agent_debugger_core`。
- 顶层：`evolve.py`（约 200 KB，主循环）、`agents/`（evolve / debugger 等）、`configs/`、`skills/`、`experiments/`、`tests/`、`trace_converter.py`；仓库还带一份 PDF（1,319,985 B，与 arXiv v4 的 1,432,986 B 不同，未把它当论文基准）。
- 论文的 5 个 prompt/配置块（seed prompt、evolve prompt、explore prompts、manifest JSON）在附录 B 中按公开仓库的 commit 原样列出；`change_manifest.json` 写在 experiment root，而不是 workspace 内。

### 关键接口与数据流

- **组件**：7 类文件在固定挂载点；一次逻辑编辑 = 一个 git commit；回滚按文件粒度。
- **证据**：per-task report（根因/成功模式 + pass/fail）+ benchmark overview + 原始轨迹；agent 通过文件系统按需下钻。
- **决策**：manifest 字段包括 `id`、`type`、`description`、`files`、`failure_pattern`、`predicted_fixes`、`risk_tasks`、`constraint_level`、`why_this_component`；下一轮用 `predicted_fixes` / `risk_tasks` 与任务级 delta 对账。
- **可控性**：workspace 可写；`runs/`、tracer、verifier、LLM 配置只读；种子 prompt 不可删；`ALLOW_POST_SUCCESS_RESET` 是受控覆盖令牌（后被发现可被滥用，iter 8 改成硬阻塞）。

### 成本与失败模式

- **成本**：32 h/campaign；token 是主要可测量成本；没有美元成本或能耗数据；跨模型迁移的 timeout/step budget 耦合会放大或吞掉增益。
- **失败模式**：① regression blindness（自归因对回归只有 ~2× 随机）；② 组件非可加（单项增益之和 > 整体）；③ 运行点耦合（预算按 GPT-5.4 high 调，换 reasoning tier 会变形）；④ 治理不完整（作者自称 controlled research prototype，不是完整 guardrail）。
- **复现边界**：仓库是官方实现，但笔记未运行；repo README 的 84.7%（GPT-5.5）是晚于 v4 的自报结果，不能与论文的 77.0%（GPT-5.4）混用。

---

## 与仓库其他条目的关系

> 本节为本笔记补充，只做定位与对照。

- **00230 Self-Improvement Memory（SIM）**：SIM 把 AHE 作为编码域的起点 harness；它的 proposer–selector 是通用 RSI 流程（SIM 明确说不改这套搜索流程），新增的是跨设定的优化器记忆。读本文能看清 SIM 沿用了什么（文件级组件、编辑级预测）与新增了什么（跨 benchmark/模型携带 rationale、预测与观测）；rollback 是 AHE 的机制，不在 SIM 笔记描述的继承项里。
- **00212 RRSI**：RRSI 把 AHE 当作 baseline 之一，报 AHE 的 OOD 平均 39.2（低于未演化种子 39.7），以及 3.82M policy tokens/trial；那是在 RRSI 自己的 agentic workspace 任务与同窗口评测下，和本文 TB2/SWE-bench 的 77.0/75.6 不是同一组实验，不能直接对照成"矛盾"。
- **00220 Harness²**：沿用 AHE 的组件分解并再加一层 plugin；AHE 是这条线的"文件级组件 + 变更清单"前身。
- **00198 Self-Harness（2606.09498）**：同属 harness 自进化，但关注"弱点挖掘 + 回归验证"的一次优化循环；AHE 关注"观测性 + 归因 + 回滚"，两者的实验设置与 baseline 不同，别把两边的提升直接比大小。
- **00199 HarnessX**：把 harness 配置做成 typed 的可组合对象，并用确定性门 ship/reject；它引用了 AHE。AHE 的组件是文件、HarnessX 的组件是类型化配置，控制流与回滚粒度不同。
- **00189 HarnessDev**：测量"模型能不能自己造/改 harness"的基准与协议，不是一种 harness 演化方法；（本笔记推断）AHE 可以作为它的被测量对象之一。

---

## 局限与待确认

作者明确写的（Limitations）：

1. **benchmark 范围**：只在 TB2 上驱动演化、在 SWE-bench-verified 上探迁移；更广的语言、仓库级部署、human-in-the-loop 都没测。
2. **运行点**：step budget 与 per-task timeout 按 GPT-5.4 high 拟合，跨模型数字把"可移植性"与"运行点耦合"混在一起；同族内随 reasoning tier 非单调。
3. **自我修改治理**：只做到 workspace 边界、manifest 归因、文件级回滚，不是完整 guardrail；长期 harness 清理与滥用防护仍不完整，应视为受控研究原型。

读者应注意的（本笔记判断）：

- **只有一次 campaign**（10 轮）；原文未报告多 seed 或置信区间；Table 1 与 Figure 1 的"提升"是单次轨迹。
- **Table 1 的分母没有交代**：若按 Table 4 的 $k=2$，Easy 4 题只可能出现 12.5% 的整数倍，ACE 的 91.7% 无法由 8 次 binary rollout 得到；Hard 的 48.9%/55.6% 也不是 1/60 的整数倍。原文说 $k$ 随实验变化，但 Table 1 没有写该表的 $k$、分母或是否多次运行取平均，读者无法从表值还原。
- **Table 2 的 500 与 7 个 repo 的 460 不一致**，见下节复算。
- **跨 benchmark 的聚合提升只有 +0.4 pp**，且三个小 repo 回退；摘要的 "highest aggregate success" 虽为真，但不足以支撑"稳定迁移"的强结论。
- **组件非可加**意味着"把 AHE 的组件搬到别的 harness"不一定按单项增益线性叠加；作者自己把 interaction-aware evolution 留给未来工作。
- **回归预见弱**：fix 预测约 5× 随机，regression 只有约 2×；如果实际部署中回滚代价高，这是首要风险。
- **成本**：只有 token 与 32 h campaign，没有美元成本或能耗数据；原文没有说明跨方法的 token 预算是否对齐。

---

## 原文自身的表述张力

1. **Table 2/5 的 All 行与 per-repo 行对不上**：All 写 500 题，但列出的 7 个 repo 的 N 相加为 **460**（231+75+44+34+32+22+22），而 §4.1 写 "500 tasks across seven repositories"。按表内 per-repo 值加权复算，这 7 个 repo 的 pass@1 约 **76.3%**，与 All 的 75.6% 差 0.7 pp；要把 All 拉回 75.6%，未列出的 40 题均值需约 **67.2%**（本笔记复算/推断）。原文没有说明这 40 题来自哪些 repo，也没有解释 "seven repositories" 与 500 的关系。
2. **摘要的 "highest aggregate success" 与 0.4 pp 的边际**：Table 2 里 AHE 75.6% 对种子 75.2%，只高 0.4 pp，且在 scikit-learn / pydata / astropy 三个小 repo 上低于种子；摘要把"最高"作为迁移证据，但没有给边际与回退。
3. **"three alternate model families" 与五个 base**：摘要说三个跨厂商模型族，§4.3/Figure 3 实际有五个 alternate base（另两个是 GPT-5.4 medium/xhigh 的同族档位）；+5.1 到 +10.1 pp 只覆盖三个跨厂商 base，全部五个是 +2.3 到 +10.1 pp。而且 §4.3 自身也同时出现 "three alternate base models" 与 "five alternate bases listed in §4.1"，不只是摘要与正文不一致。
4. **"marginally trails Codex" 的幅度**：Hard 上 AHE 53.3% vs Codex 56.7%（也低于 TF-GRPO 55.6%），差 **3.4 pp**；"marginally" 是作者的措辞，表格给出的差距不算小（相对 Codex 约 −6%）。
5. **regression precision 的两种口径**：§4.4.2 写跨轮平均 11.8%，附录 D 写累计 P=11.6%（5/43）；一个是"轮均"，一个是"累计计数"，不是矛盾，但正文没有说明这两个口径。
6. **Table 1 的分母未说明**（见"局限"）：Easy 4 题、ACE 91.7% 与 $k=2$ 无法同时成立；Table 1 也没有写 $k$。附录 A 还写 "The rollout count k varies across experiments; each table states it explicitly"，但 Table 1 并未写 $k$。这影响对每个 tier 数字的复现，不一定是计算错误。

---

## 核对凭据（便于复核）

- 原文 PDF：`https://arxiv.org/pdf/2604.25850v4`，1,432,986 B、35 页、sha256 见来源信息；`%%EOF` 与 gs 页数确认完整，未使用镜像。
- 表格：Table 1 p.6、Table 2 p.7、Table 3 p.8、Table 4 p.16、Table 5 p.17，均在 250–300 dpi 渲染页上逐格核对；Table 5 的 Succ/Mtok 按 `pass@1×10^3/Tokens k` 逐项复算。
- 公式/算法：Algorithm 1 在 p.5 逐行核对；pass@1 与 Succ/Mtok 的定义在附录 A（p.15–17）核对。
- 图：Figure 1（p.2）用 PDF 矢量坐标读出 best-so-far：网格线 $y=230.46\leftrightarrow 68$、$205.48\leftrightarrow 70$、$180.5\leftrightarrow 72$、$155.52\leftrightarrow 74$、$130.54\leftrightarrow 76$、$105.56\leftrightarrow 78$、$80.58\leftrightarrow 80$（24.98 pt / 2 分）；best-so-far 折线 y=209.7→69.7、153.5→74.16、146.5→74.72、132.5→75.84、118.4→76.97。Figure 2（p.4）裁剪框 `(104,73,508,279)`；Figure 1 裁剪框 `(116,72.6,493,258)`。
- 复算：Table 2 的 7 个 repo N 合计 460、加权 pass@1 76.3%、All 差额反推 40 题均值 67.2%；Table 3 单项增益 +5.6/+3.3/+2.2/−2.3 与和 +11.1；Table 5 All 1.64/1.43/1.27/1.10。
- 否定性/一致性检索：`500`、`seven repositories`、`repositories`、$k=$、`rollouts per task`；其中 $k$ 在 Table 4 明确为 2，但 Table 1 未给。
- 代码：GitHub API 核对仓库存在性、MIT 许可、默认分支 `main`、创建/推送时间与顶层目录；未运行代码，未验证 84.7% 的复现。
