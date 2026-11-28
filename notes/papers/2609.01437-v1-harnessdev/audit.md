# HarnessDev — 复核档案

> 本文件是维护性档案，不参与站点构建；读者版正文见同目录 `note.md`。

## 来源与版本

- **标题**：HarnessDev: Can LLMs Create and Evolve Their Own Agent Harness?
- **作者**：19 位作者；论文按 Contributions 分列，核心贡献者为 Yuhao Wu、Jingyuan Zhang、Jiajun Shi；通讯作者 Yuhao Wu / Shen Yan / Wenhao Huang（ByteDance）、Ge Zhang（umich）、Wenxuan Zhang（SUTD）。
- **机构**：ByteDance Seed（第一机构）；其余署名单位：Singapore University of Technology and Design、Georgia Institute of Technology、M-A-P、TokenWave.AI（论文首页）。
- **来源**：[arXiv:2609.01437v1](https://arxiv.org/abs/2609.01437)（cs.SE，交叉列表 cs.CL；2026-09-01 提交，截至 2026-10-09 无后续版本；正文日期写 September 2, 2026）；全文 41 页。
- **项目页**：<https://self-developing-agents.github.io/>。自述为「Self-Developing Agents」三基准之一，另两篇同页发布：Aspire [arXiv:2608.31111](https://arxiv.org/abs/2608.31111)「Can Models Self-Evolve from Vague Goals?」、S³Gym [arXiv:2608.31100](https://arxiv.org/abs/2608.31100)「Can LLMs Turn Self-Testing and Self-Judging into Self-Improvement?」；站点叙事是「半环 → 闭环 RSI」。
- **仓库编号**：00189（清单行内标题/年份/单位已核对一致）。
- **许可**：[CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/)（arXiv abs 页 "view license" 指向，2026-10-09 核验；**不是** arXiv 默认的 nonexclusive-distrib）。
- **归档说明**：arXiv 来源，按仓库策略不归档 PDF；清单编号 00189 的编号单元格指向上游归档仓库的 `papers/00189-HarnessDev.pdf`（上游已有归档），本次阅读用的是 arXiv v1 官方 PDF（临时文件用后已清理）。复核确认上游归档与 arXiv v1 **字节一致**（sha256 `1231454f0ae5ccffdb3d031dc8f42eae0cbbaeb61dcd25dddb1855074697dfc0`、1,800,192 B、41 页）。
- **配图**：`assets/` 下 3 张（Figure 1/4/8），自 v1 PDF 200 dpi 渲染页裁剪：裁剪框先按行/列像素剖面标出内容范围（含图内标题、图例、坐标轴标签与图内说明行），成品逐张回看确认边缘干净、无缺元素。复核时重裁两处：Figure 8 首版漏掉底部 "Harness version" 轴标签、Figure 4 首版漏掉图内底部说明行（"Downstream score as % …"），均已下延重裁并重验。

## 阅读范围与核对手段

v1 全文 41 页。**已读**：主文 §1–§6（含 Related Work、Limitations、Ethics）、附录 A–D（候选系统、实验配置、接口规范、评测角色）。**仅抽样**：附录 E（RQ1/RQ2 系统提示词，pp.26–31，约 5 页）只读了 RQ1 提示词的总纲与术语表；附录 F–I 的四条开发/演进轨迹逐条注释只读了部分步骤（F 的 01–03 步与 06/07 步片段、G 第 03 步、H 末步、I 末两步，其余只看了步骤标题）。**已渲染页（200 dpi）逐项核对**：Table 3/4（p.8）、Table 5（p.9）、Table 6/7（p.12）逐格；式 (1)（p.4）、式 (2)（p.11）逐符号；Figure 1（p.2）、Figure 4（p.9）、Figure 8（p.14）看图并与正文对照。**像素测量**：Figure 8 的 Qwen 自运行面板（200 dpi 渲染，定标：网格线 y=704 px ↔ 0 分、53 px ↔ 20 分）——实线+填充三角为 Held-out-630 序列，其 H3 处顶点读数约 23 分，±2。**未逐张检查**：Figure 2/3/5/6/7/9/10 只按正文与图注引用，未从图中读数。

## 复核记录

2026-10-09 依 check-paper-note 复核（基准：重新下载 arXiv v1，sha256 `1231454f0ae5ccffdb3d031dc8f42eae0cbbaeb61dcd25dddb1855074697dfc0`、1,800,192 B、41 页，与阅读时一致；另核上游归档 `papers/00189-HarnessDev.pdf` **与 v1 字节一致**（同 sha256）；按编号与按标题检索 arXiv 均只有 v1）。手段：Table 3/4/5/6/7 与式 (1)(2) 在 200 dpi 渲染页复核，另经 PDF 文本层逐行交叉比对；三张配图与重新渲染同坐标裁剪**像素差为 0**、边缘 4 px 环全白；Figure 8 的 Qwen 自运行面板按定标锚点（200 dpi，网格线 y=704 px ↔ 0 分、53 px ↔ 20 分）复跑：H3 顶点最深像素 row=644 → 22.6 分、标记质心 ≈23.8 分（独立审计读数 23.6，一致）；否定性断言检索词：`77.8`、`harness defects`、`120-step`、`clearest example`、`confidence interval`、`variance`、`creator tokens`，项目页 curl 全页仅 arxiv.org 外链；含独立子 agent 审计（未改文件）。

本轮修正：

1. 「§6.2 结论重复」→ §6 开头段（p.15），并说明该处自带 code/search 限定（原表述把 §6 开头误当成 §6.2）；
2. 附录 E 页数「约 15 页」→ 约 5 页（pp.26–31）、附录 F–I「约 14 页」→ 约 10 页（pp.31–41）；
3. 阅读范围抽样枚举补 F 的 06/07 步与 G 第 03 步（正文引用到了）；
4. Figure 8 读数 H4「约 41」→ 约 43（复测取标记质心，原值把 H3→H4 的上行线画段计入簇心）；
5. Figure 4 配图重裁、补入图内底部说明行；
6. 「cs.SE」补交叉列表 cs.CL；
7. Table 6 补说明：Seed 无 RQ2 轨迹。

**未修**：77.8% 的归因口径原文未给，只能照记。

## 原文自身的表述张力（整节）

1. **「写作持平/超过、MLE 超过」的概括与自己的 Table 3 不符——只在最强创建者上成立。** 摘要（p.1）写 "matching or exceeding the selected references on writing and machine-learning experimentation"，§1（p.3）写 "model-built harnesses match the reference on short-form writing and exceed it on machine-learning experimentation"；同一概括在 §6 开头段（p.15）也出现，但那里带上了 code/search 的限定（"…but remain far behind in search and research and still trail it in code"），且 §6.2 结论段（p.16）并未重复该概括。按 Table 3 逐项核对：EQ-Bench3（人类 83.7）**只有 Opus 84.6 超过**，GPT-5.5 83.0 低 0.7，Gemini 74.8 / DeepSeek 75.4 / Qwen 68.7 / Seed 71.1 低 9–15 分；MLE-bench（人类 24.0）**只有 Opus 32.9 与 Gemini 32.4 超过**，GPT-5.5 19.1、DeepSeek 19.6 低 4–5 分，Qwen 3.1、Seed 5.3 则差一个量级。§4.2 的概况措辞同样更谨慎（"Writing harnesses approach the reference"）。
2. **「留出涨分变小」有一个明确反例。** §4.3 开头："All five self-runtime creators improve on the visible feedback pair, but the gains shrink on held-out tasks." 按 Table 6，Opus 自运行是反馈 +3.0 < 留出 +4.44（唯一反例；该句的下一句恰好自己点出 "Opus 4.8 has the largest held-out improvement at +4.44 points"）。
3. **一个未给口径的百分比**：§4.2（p.7）"77.8% of failed Data tasks are attributed to harness defects" 在正文与附录都没有展示归因方法或分解表（本笔记只能按原文数字引用，无法复算）。

（以上三条均针对 v1；若后续版本修订，以新版为准。）

## 工程实现与外部资料（原「工程视角」）

### 接口与契约（附录 C）

一个可接受的 harness 实现六个功能模块（原文列出的方法签名）：

| 模块 | 接口（原文） |
| --- | --- |
| `execution.py` | `run(task) -> Result`；`step(state, observation) -> Action` |
| `tools.py` | `register(toolspec) -> None`；`call(name, **params) -> Observation` |
| `context.py` | `build(task, history, state) -> Prompt`；`compress(messages) -> Messages` |
| `state.py` | `save(checkpoint) -> None`；`load(id) -> State`；`resume() -> State` |
| `lifecycle.py` | `beforeAction(action) -> Action \| Abort`；`afterAction(action, result) -> None`；`onFailure(error) -> Recovery`；`onTimeout() -> Graceful` |
| `evaluation.py` | `evaluate(result, criteria) -> Score`；`recordTrajectory(step) -> None` |

所有方法返回 JSON 可序列化对象。**统一审计契约**（`result.json` / `trajectory.jsonl` / `response.md` / 运行日志）不强制单一文件格式，但**域的最终产物必须是对应评分器可读的**：code 要真实仓库改动 + patch；数据分析要可读提交；写作要最终面向用户的 prose；搜索要带检索证据的答案。只产出公共 JSON 与日志 = 不完整的执行（种子就是这个下场，五个基准全 0）。冻结后的 harness 由 runner 注入的运行时基底承载，创建者只对 `harness/` 负责。

### 复现与资源（附录 B）

- MLE-bench 下游：每任务独立容器，1×A800-SXM4-80GB、14 vCPU、227 GiB 内存；墙钟 36,000 s = 34,200 s 给生成的 harness + 1,800 s 保留给固定 grader；500 步上限；数据下载不计入任务时钟；
- RQ2 code 基准：同一 500 步上限，7,200 s 限制；
- **只有执行 token 被计入成本比较**（创建者与 judge、探针的 token 排除）；创建 harness 的开销不在报告口径内——拿这套结果做成本判断时要自己补这一项。

### 工程上最有用的失败模式清单（来自 §4.2/§4.3）

1. **硬编码与执行器绑定的常量**（步数/输出上限、去重与终止规则）：换执行模型就从"能用"变"崩塌"（Opus 的 120 步上限、重复查询率 10.1%→88.2%）；
2. **状态/记忆写了不触发**：声明在代码里、运行时零事件（0/26,679 条轨迹有 checkpoint）——「代码里有」不等于「运行时活着」；
3. **验证停在语法层**：非法提交无人检出（441/2,325）；
4. **上下文压缩破坏协议**：DeepSeek 的固定 Gemini 重写因压缩后 tool-message 配对断裂而大面积回滚——工程上应把"压缩前后消息协议一致性"当作回归测试项；
5. **探针 ≠ 全量**：5 任务探针全过、全量 0.584；任何用小子集做门禁的流程都要防这一点；
6. **自报成功 ≠ 真成功**：99/100 自报成功 vs 48/100 实测——harness 的完成判定需要与评分路径隔离（本文的评分隔离设计值得抄）；
7. **申报版本选择**：按可见分选版本对留出的有效率约等于抛硬币（53.1% 同向、2/9 最优）——需要版本化 + 回滚 + 留出核验（项目页也把教训写成「Keep changes only with versioning and rollback」）。

### 安全边界（Ethics statement）

Creation 与下游任务跑在容器里，但**容器是为复现而配的，不是为隔离而配的**；论文明确提醒复用这些生成 harness 的人应把它们当作不可信代码、做更严格的隔离。

## 实验与证据细节（原「实验与证据」逐表逐图内容）

### Creation

**实验设置（§4.1、附录 B）**：6 个创建模型为 Opus 4.8、GPT-5.5、Gemini 3.1 Pro、DeepSeek V4 Pro、Qwen 3.7 Max、Seed 2.0 Pro（官方 API 或 OpenRouter）；开发环境 $D$ 为 Claude Code 2.1.177（GPT-5.5 用 Codex 0.144.3）；各模型的温度/top-p/max output 见附录 Table 8（如 Opus temp 1.0；Qwen temp 0.6、top-p 0.95、top-k 20；输出上限 65k–131k token）；RQ1 对每个「创建者×基准」独立创建并评测 3 个 harness，报 avg@3。

**人类参照（附录 Table 9）**：取自各基准官方榜单/系统报告里可核验的最高系统级成绩——SWE-Pro 用 Claude Fable 5 的 80.0、Terminal-Bench 用 GPT-5.6 Sol 的 88.8、MLE-bench 用 MLEvolve+Gemini 3.1 的 24.0、EQ-Bench3 用 Kimi Writer+Opus 4.8 的 83.7、BrowseComp 用 GPT-5.6 Sol 的 92.2；其中三个带 \* 的值取自 OpenAI GPT-5.6 发布报告、**未在本地复跑**。

**Table 3 的脚注与口径**：Avg. 是 SWE-Pro / Terminal-Bench / EQ-Bench3 / BrowseComp 的**无权重均值，不含 MLE-bench**；本笔记复算 Opus 行：(69.3+64.8+84.6+52.4)/4 = 67.775 ≈ 67.8 一致。MLE-bench 一列是 medal 率、EQ-Bench3 是 rubric 分、BrowseComp 是准确率。MLE-bench 单元覆盖 33 个 physical cells、2,475 个结果。原文每个基准另有 token 列（每个 harness 的平均执行 token，百万），读者版表已省略。

**Unified-Eval（固定 Gemini 执行）**（Table 4，p.8，省略 token 列）：

| 创建者（Unified-Eval） | SWE-Pro | Term.-2.1 | MLE-bench | EQ-Bench3 | BrowseComp | Avg. |
| --- | --- | --- | --- | --- | --- | --- |
| Opus 4.8 | 33.0‡ | 52.4 | 16.9 | 74.2 | 53.6 | 53.3‡ |
| GPT-5.5 | 27.8 | 49.4 | 16.0 | 46.5 | 55.4 | 44.8 |
| Gemini 3.1 Pro | 43.6 | 68.8 | 32.4 | 74.8 | 35.2 | 55.6 |
| DeepSeek V4 Pro | 29.2‡ | 38.2‡ | 9.8 | 72.9 | 54.8 | 48.8‡ |
| Qwen 3.7 Max | 41.3 | 48.6 | 16.0 | 71.5 | 49.9 | 52.8 |
| Seed 2.0 Pro | 15.6 | 13.1 | 13.3 | 73.1 | 17.3 | 29.8 |

（‡：该单元含一个崩塌的 R3 复本；去掉后 Opus 的 SWE-Pro 敏感性均值为 49.1，DeepSeek 的 SWE-Pro/Terminal 为 43.8/57.3。GPT-5.5 的 EQ-Bench3 是 avg@3=46.5；剔除其首个 0 值 harness 后均值 69.7。Gemini 行复用 Self-Eval 对照、不算新单元。）

**Creation 要点（§4.2）**：

- **差距分化**：写作 harness 接近参照（Opus 84.6 vs 83.7）、机器学习实验两侧超过（Opus 32.9 / Gemini 32.4 vs 24.0），**搜索与研究差距最大**（最好 52.6 vs 92.2），code 仍落后（69.3 vs 80.0）。表 3 的 Avg. 也给出整体距离：Opus 67.8 vs 人类 86.2。
- **同一模型的独立创建之间差异很大**，所以报 avg@3：最典型的反例是一个 Opus code harness 在 Self-Eval 下不错、换 Gemini 后几乎崩塌——原因是它把 **120 步上限硬编码**在了原执行器上。附录 G 记录的 Opus RQ1 轨迹第 03 步给出了这类实现的写法（`max_steps=120`、6,600 秒时间预算、150,000 token 软上下文上限；论文未说明 §4.2 点名的 harness 是否就是该产物）。Data 域也出现过度严格的停止规则导致的塌陷。
- **换执行者会重排**：Qwen、Seed、DeepSeek 在 Gemini 下多个 Data/Search 设置变好（Qwen 在 BrowseComp +17.6、MLE-bench +12.9），而 Opus 与 GPT-5.5 通常在自己当执行者时更强（Opus Self→Unified 的 SWE-Pro 从 69.3 → 33.0、写作 84.6 → 74.2；它搜索 harness 的**重复查询率从 10.1% 涨到 88.2%**，说明去重、复核与终止规则是针对原模型调的）。
- **成本极不均匀**：MLE-bench 上 token 用量差约 **19 倍**，而高成本不保证高分（Figure 9 图注：GPT-5.5 以 29.3M token 拿到 19.1 medal 率，DeepSeek V4 以 208.4M token 拿到 19.6）。
- **失败归因**：**77.8% 的失败 Data 任务被归因于 harness 缺陷**（§4.2，p.7；论文未在正文展示该归因的分解口径）——瓶颈不只是执行模型的能力。

**Creation 的机制层证据：harness 里有多少是「活着」的（§4.2、Figure 5）**：

- 18 个 code harness **全部**实现了显式执行循环；工具、生命周期、验证「完整」的分别有 13/18、13/18、15/18。**状态与记忆是最明显的缺口**：11/18 定义了 State 类，但各只有 1 个暴露了状态保存接口、各只有 1 个实现了周期 checkpoint——**26,679 条记录轨迹里一次 checkpoint 事件都没有出现**。
- Code 的 108 个组件实例中：72 个在真实运行里被触发、18 个只有部分证据、**18 个从未被观察到，且全部属于状态与记忆**。Code 之外同样：Writing 的 587 个特性里 124 个被确认是死代码、Data 有 36 个机制落在死路径上。
- **测试数量本身是弱信号**：自测数与下游分的 Spearman 相关只有 0.13–0.26（不显著），而「修订调用」达到 0.57（p ≤ .0005）——有帮助的是「读失败→做定向修改→重新验证」这个闭环，不是测试的堆量。
- 验证多为语法级：2,325 个执行的 Data 任务里 441 个产出 degenerate 提交，没有任何 harness 检出。
- 实现策略各异（Opus 常常重写执行栈；GPT-5.5 加一个大型单体 agent；DeepSeek/Qwen/Seed 在种子上扩模块；Gemini 主要原地改 runner）；18 个 code 产物合计新增 17,111 行净代码（本笔记复算 Table 5 六行之和 2,470+3,537+1,006+3,242+3,562+3,294 = 17,111 ✓），但**代码量与成绩无预测关系**：Gemini 改得最少（1,006 行）却拿到最好的 Terminal-Bench（68.8）。

**Figure 4 的图注限定**：各创建者 Self-Eval 成绩相对人类工程参照的百分比（虚线=参照，柱上标签=原始分）。五个面板依次 SWE-Pro（人类 80.0\*）、Terminal-Bench 2.1（88.8\*）、MLE-bench（24.0）、EQ-Bench3（83.7）、BrowseComp（92.2\*）。人类参照来自不同的 harness–模型组合、并非同一执行器下的配对对照，超过 100% 只意味着超过那个外部参照，不代表超过人类能力。

### Evolution

**主表**（Table 6，p.12，逐格核对）：

| 设置 | 创建者 | 反馈 pair $H_{0} \to H_{\mathrm{dec}}$ | 留出-630 $H_{0} \to H_{\mathrm{dec}}$ | 留出 final gap |
| --- | --- | --- | --- | --- |
| Self | Gemini 3.1 Pro | 59.9 → 68.7（+8.8） | 48.89 → 51.59（+2.70） | 0.00 |
| Self | Opus 4.8 | 71.1 → 74.1（+3.0） | 63.02 → 67.46（+4.44） | 1.59 |
| Self | Qwen 3.7 Max | 41.8 → 55.7（+13.9） | 42.22 → 43.65（+1.43） | 3.17 |
| Self | DeepSeek V4 Pro | 47.2 → 60.6（+13.4） | 47.30 → 50.48（+3.17） | 1.75 |
| Self | GPT-5.5 | 59.2 → 65.1（+5.9） | 48.25 → 52.06（+3.81） | 0.00 |
| Fixed Gemini | Opus 4.8 | 58.8 → 68.6（+9.7） | 48.10 → 50.79（+2.70） | 2.54 |
| Fixed Gemini | Qwen 3.7 Max | 62.1 → 63.2（+1.1） | 49.52 → 48.41（**−1.11**） | 1.11 |
| Fixed Gemini | DeepSeek V4 Pro | 47.3 → 53.8（+6.5） | 43.02 → 40.63（**−2.38**） | 3.02 |
| Fixed Gemini | GPT-5.5 | 56.6 → 59.1（+2.4） | 42.22 → 31.90（**−10.32**） | 16.51 |

（feedback pair 是两个基准百分比的均值；held-out 只用 SWE-Pro-630；final gap = 该谱系留出最高分 − 申报版本的分。九个谱系共 **73 个官方版本、64 次相邻官方切换**。六个创建者里 **Seed 2.0 Pro 没有 RQ2 轨迹**，所以表中没有它的行——见 Figure 5 图注。）

**编辑行为**（Table 7，p.12，节选「累计 diff 与主要编辑焦点」）：

| 设置 | 创建者 | 官方切换 | $H_{0} \to H_{\mathrm{dec}}$ 累计 diff | 主要编辑焦点（该条轨迹内观察，非模型的一般属性） |
| --- | --- | --- | --- | --- |
| Self | Gemini 3.1 Pro | 8 | 11 文件，+692/−38 | 工具输出、编辑、超时、patch 清理 |
| Self | Opus 4.8 | 3 | 8 文件，+450/−18 | 完成门、自审、进程恢复 |
| Self | Qwen 3.7 Max | 8 | 9 文件，+1101/−106 | 空响应/解析恢复、自动提交点 |
| Self | DeepSeek V4 Pro | 10 | 9 文件，+1730/−58 | 完成逻辑、工具扩展、工作区预分析 |
| Self | GPT-5.5 | 7 | 4 文件，+496/−49 | 终态复核门、产物跟踪 |
| Fixed Gemini | Opus 4.8 | 4 | 3 文件，+227/−21 | 完成前验证、scratch 文件清理 |
| Fixed Gemini | Qwen 3.7 Max | 5 | 4 文件，+219/−96 | 上下文与消息消毒重写 |
| Fixed Gemini | DeepSeek V4 Pro | 9 | 8 文件，+476/−12 | 消息协议恢复、工作区发现 |
| Fixed Gemini | GPT-5.5 | 10 | 6 文件，+297/−34 | 探针、分支回滚、终态复核 |

编辑结构统计（§4.3）：64 次切换中 **58 次改执行/控制流、37 次改工具、17 次改生命周期恢复、16 次改上下文，只有 4 次改 state，没有任何一次改独立 verifier**；申报版本的中位数改动是 8 个文件、+476/−38 行。

**不稳定与选择失效**（§4.3）：

- 64 次切换的分解：8 次两个基准同时退步、16 次单基准退步、3 次交叉权衡、7 次无可测变化、**27 次涨分落在重复运行噪声带内**、只有 2 次有超出噪声带的明确正向证据、1 次不含可执行代码改动。同一 commit 的 pair 分波动约 **±4.75 分**——小涨分不能从分数单独归因于代码改动。
- **反馈与留出同向仅 34/64（53.1%）**；9 个申报版本里**只有 2 个**是留出最优（例如 GPT-5.5 固定 Gemini 谱系：最优留出比申报版高 16.51 分）。创建者一般选可见反馈分最高的邻近版本，但这个选法对留出几乎无效——反复优化一个带噪分数会放大过拟合。
- **新增代码不一定是活代码**：169 个新函数/类中 113 个从入口可达、31 个只经死代码可达、25 个无调用者。
- **诊断是整条链最弱的一环**：专用轨迹接口只被调用过 2 次；显式检查过的反馈任务只覆盖 0.5%–40.2%（依谱系而变，反馈任务共 189 个）；创建者更依赖自写脚本和小探针，而两者都可能与全量评测相悖——一个 GPT-5.5 候选通过全部 5 个 Terminal 探针，全量只拿到 0.584（§4.3 原文数值）。
- **正面案例**：Opus 发现「100 次运行 99 次自报成功、实际只有 48 次通过」的偏差，定位到过早结束，加了完成检查。反面案例：Qwen 的消息消毒器反而破坏了 Gemini 合法的 tool-result 序列。（附录里还有两次有代表性的申报决策：附录 I 的 Opus 估计「一次完整评测的噪声约 ±3~4 个任务」，主动放弃剩余 7 对预算；附录 H 的 GPT-5.5 确认 T2 仍是真 argmax 后不再为采样更高分提交候选。）

**Figure 8 的逐图读数**：九个谱系的 SWE-Pro-100 反馈轨迹（虚线+空心标记）与冻结后 630 任务留出轨迹（实线+填充标记）叠放；星号是创建者申报的版本。上排自运行、下排固定 Gemini。Qwen 自运行面板里留出曲线在 H3 处出现深 V 回落（H2 约 44 分 → H3 顶点 **≈23 分** → H4 回升到约 43 分；200 dpi 像素测量，网格线定标 53 px ↔ 20 分，取标记质心，±2）。H4 复核后取标记质心为约 43（原值约 41 把 H3→H4 的上行线画段计入簇心）。

### 附录 F–I：四条开发轨迹的逐条注释（抽样阅读）

论文末尾从 p.31 中段到 p.41 用约 10 页放了 4 条真实轨迹（F/G = GPT-5.5 与 Opus 的 RQ1 Creation；H/I = 两者的 RQ2 Evolution），每条按 `Observation / Diagnosis / Plan / Modification` 分步注释，带真实 diff 片段。抽样看到的例子：

- F 里 GPT-5.5 把解析、分派、状态、验证、终结收进一个 1,245 行的 `agent.py`（把可靠性逻辑集中成单一控制面，便于从轨迹直接修）；F 的后续步骤记录了两类只有跑起来才暴露的问题——多对象 JSON 输出被截断、`source` 命令与 shell 的选择不匹配。
- H（GPT-5.5 的 RQ2）以「T7 结算后 13 秒确认 T2 仍是真 argmax、不为了刷分再提交候选」收尾（该段末尾的注记还写着它"从未修好自己 54% 的工具调用拒绝率"）。
- I（Opus 的 RQ2）的收尾更典型：创建者估计「一次完整评测的噪声约 ±3~4 个任务」，判定再提交一个小改动只是在采样而不是在演化，于是**主动放弃剩余 7 对预算**（10 对里只用了 3 对），申报 SWE 74.0 / Terminal 74.157 的 T3——pair = 74.08，与本笔记复算 Table 6 的 74.1 一致。

## 局限与待确认问题（完整版）

**作者明确讨论的**（§6.1）：

- 四个域覆盖不了全部真实部署；人类基线不齐、不保证最优；Unified-Eval 减少但不能完全消除执行器差异（harness–模型交互复杂）；
- 行为比较是描述性的，且受基准覆盖限制；Evolution 每个「创建者×运行时」格只有**一条**轨迹（另有 1 个主运行格未完成），冻结后的留出只覆盖 SWE-Pro——**不支持不确定度估计或总体层面的比较**；
- 开发环境 $D$ 在两阶段都固定；「演化后的 harness 自己当开发环境继续演化」留给未来工作；
- 明确不主张启发式学习可以替代参数训练（本文测的是模型外部的学习）。

**本笔记补充的判断**：

- 人类参照是外部成绩（各自 harness+模型的配对），不是统一执行器对照 → "距离"只能当刻度；且其中 3 个带 \* 的分数未本地复跑；
- avg@3（3 个独立创建的均值）没有给出置信区间或方差报告，创建者之间的 5 分以内差距不宜过度解读；
- 「创建 harness 的成本」完全没有进成本口径（创建者 token、开发环境 $D$ 的开销），而实践中这可能是主要开销；
- 结论绑定 2026-09 的模型版本（Opus 4.8 / GPT-5.5 / Gemini 3.1 Pro / DeepSeek V4 Pro / Qwen 3.7 Max / Seed 2.0 Pro），模型换代后值得重跑；
- 基准本体：附录 C 说参考种子实现、审计脚本与留出 split「将随基准发布」（will be released），截至 2026-10-09 项目页只有三篇论文链接、**没有看到代码仓库**——发布状态未核实。

## 与本仓库其他条目的关系

这篇处在仓库 RSI/harness 这条主线的「评测」位置，与几篇已有条目直接咬合：

- **00212 RRSI**（刚读过）：RRSI 的四个 baseline（Meta-Harness / AHE / TTHE / HarnessX）里，Meta-Harness 与 HarnessX 这两个名字也出现在 HarnessDev 的 Related Work（[21] Lee et al. 2603.28052、[10] 2606.14249；本笔记未逐字核对两处是否确为同一篇，仅名字与年份一致）。HarnessDev 引的 "Harness Updating Is Not Harness Benefit"（[24]）与 "Rethinking the Evaluation of Harness Evolution"（[50]）正是「演化涨分≠留出受益」这条质疑线的另两篇。两篇的结论方向一致：RRSI 用正则把涨分约束到可迁移的机制上，HarnessDev 则直接测出「不加约束时留出迁移本来就很弱」。
- **00198 Self-Harness**：被本文引用（[56]），属「从失败推导模型特定编辑 + 回归测试」的方法线；本文的 Creation/Evolution 协议可以直接当它的评测环境看。
- **00199 HarnessX**：被本文引用（[10]，composable/evolvable harness foundry）。
- **00205 Prime Agent**：本文引用的 Continual Harness（[19] Karten et al. 2605.09998）与 Prime Agent 作者有重叠（Seth Karten 等），是「上下文/工作台持续化」这条支线在本文语境里的对应物。
- **00202 Evo-Harness ≠ 本文引的 Evo-Bench**：本文 Related Work 的 Evo-Bench [16]（2608.09096，"Can language models improve agent harness?"）与仓库 00202 的 Evo-Harness（2608.15071）是两篇不同的工作，引用时别混。
- **00192 RSI 导读**：导读的关键限定是「更新产物要被后续任务复用才算 RSI」；本文的机制层证据（state/memory 组件写在代码里但运行时零触发、169 个新函数里 56 个不可达或只有死路径可达）给出了这条限定在真实系统里的**实测形态**——"写下了"离"参与后续任务"还差很远。

## 一句话备忘

HarnessDev = 把「AI 自己造 harness」变成可评测对象的两阶段基准：Creation 测「从弱种子能不能造出跑得起来的系统」，Evolution 测「用反馈能不能稳定改好它」；结论是**能造、能改，但改好很难**——留出迁移（53.1% 的切换与可见分同向）、跨执行器迁移（固定 Gemini 下 4 个谱系只有 1 个留出改善）、「选对版本」（9 个申报版本只有 2 个留出最优）三件事上，当前模型的水准都远不到可靠。

## 迁移索引

2026-11-28 读者版重写时，以下内容从 `note.md` 移入本文件：

- 来源信息表中的项目页细节、仓库编号、许可、阅读范围、配图、归档说明与复核记录；
- 原「问题与动机」中的 FDE 三块拆分表（读者版改为列表，只保留结论）；
- 原「方法与贡献」的实验设置细节（温度/top-p、输出上限、人类参照的完整配对清单；读者版只保留「最高系统级成绩、3 个未复跑」这一层）；
- 原「关键公式与直觉」节的过渡说明（两条式子本身已并入读者版「方法」，逐项读法保留）；
- 原「实验与证据」中的 Table 4 全部数值、Table 3 脚注与 token 列说明、Creation 机制层证据、Table 6/7 全表、编辑结构统计、不稳定与选择失效的完整分解、附录 F–I 逐条注释、Figure 4/8 的图注与像素读数；
- 原「工程视角」整节（接口契约、复现资源、失败模式清单、安全边界）；
- 原「原文自身的表述张力」整节（3 条）；
- 原「局限与待确认问题」完整版（作者承认 + 读者判断）；
- 原「与本仓库其他条目的关系」完整版；
- 原「一句话备忘」。
