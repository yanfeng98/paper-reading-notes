# Self-Improvement Memory Enables Continual Recursive Self-Improvement

## 来源信息

| 项 | 内容 |
| --- | --- |
| 标题 | Self-Improvement Memory Enables Continual Recursive Self-Improvement |
| 作者 | Xin Yu¹,⁴\*、Fei Xia¹、Jiaqi Pan¹、Youbao Tang¹、Chengzhi Liu¹、Adams Yu²、Sicong Jiang²、Yanfei Chen³、Lingzhou Xue⁴、Ting Yu¹（¹ Google Cloud AI；² Google DeepMind；³ Google Cloud AI Research；⁴ The Pennsylvania State University；\* p.1 脚注 "This work was done while Xin Yu was an intern at Google."，是实习说明、不是共同一作标注） |
| 机构 | Google Cloud AI（第一机构；p.1 通讯作者为 xinyulucas@google.com） |
| 来源 | [arXiv:2611.18856v1](https://arxiv.org/abs/2611.18856v1)（cs.LG; cs.AI）；提交 2026-11-13，阅读时只有 v1、无更新版 |
| 原文 | PDF 35 页、525,024 B、sha256 `a8299ba5b16577dd328d602e32f35b914b9393ffb38148d2410f358d4d90ff3d`；同版 HTML 707,675 B 用于交叉核对正文。**HTML 版图号整体比 PDF 少 1**（HTML 缺 p.1 的 teaser，故 HTML 的 Figure 1–11 = PDF 的 Figure 2–12）；本笔记一律用 **PDF 图号** |
| 许可 | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)（abs 页 view license 指向 `licenses/by/4.0`）；但 PDF p.1 页脚写「© 2026 Google. All rights reserved」，与 arXiv 许可元数据不一致，本笔记以 arXiv 许可为准 |
| 代码 / 项目页 | 论文正文未给出代码仓库或项目主页；2026-11-22 按标题检索未发现作者公开实现（只命中 Hugging Face papers 聚合页与转载），**不等于不存在** |
| 阅读日期 | 2026-11-18 |
| 仓库编号 | 00230（已收入 `### Google` 分组，紧随 00212/00220/00227 三条 Google Cloud AI Research 条目；论文单位列按原文第一机构写 Google Cloud AI） |
| 阅读范围 | 全文 35 页：§1–5、Limitations、Ethics Statement、References、附录 A–F。**已渲染页逐项核对**：Table 1（p.6）、Table 2/3（p.8）、Table 4（p.18）、Table 5（p.23）、Table 6（p.24）、Table 7（p.25）、Table 8（p.31）逐格；Figure 1（p.1）、2（p.4）、3/4（p.7）、5（p.9）、6（p.20）、7（p.23）、8（p.24）、9（p.28）、10（p.29）、11（p.30）、12（p.32）看图核对。**本笔记复算**：Table 2 的 All 列、Table 3 的均值/配对 t/CI/`d_z`、Table 4 的 merged 行合计、Table 5/6 与 Figure 11(a) 的差值、Figure 8 的 rollout 折算。**未做位图像素颜色测量**：配图与正文数值均来自表格打印值、图内打印标签或 PDF 矢量坐标（Figure 5 的逐轮值见「核对凭据」，偶数轮用 marker、奇数轮用路径顶点），没有用颜色掩码从位图反推数据点 |
| 配图 | `assets/` 下 2 张，自 v1 PDF 300 dpi 渲染页裁剪：Figure 2 裁剪框 `(58, 76, 538, 316)` pt、成品 2001×1001；Figure 5 裁剪框 `(58, 80, 538, 396)` pt、成品 2001×1317。裁剪框在页内、成品逐张回看确认无页眉残留、无黑边、无截断；Figure 5 的 3 个面板、图例与坐标轴标签齐全，Figure 2 的流程框与箭头齐全。原图许可 CC BY 4.0 |

---

## 复核记录（2026-11-18）

- **基准**：重取 arXiv v1 PDF（525,024 B、35 页、sha256 `a8299ba5…d90ff3d`，与笔记记录一致）；abs 页提交历史只有 `[v1]`。
- **方式**：Table 1–8 在 250–300 dpi 渲染页逐格核对；式 (1)–(3) 对 p.3–p.4 渲染页；Figure 1–12 对照渲染页；Figure 5 的逐轮值用 PDF 矢量 marker 坐标 + 网格线定标复核；README 00230 行与所在分组、仓库内 RRSI/Harness²/Self-Harness/Evo-Harness 笔记交叉核对。
- **本轮修正**：① README 分组表述——实际在 `### Google` 组，不存在独立的 Google Cloud AI Research 分组；② Table 2 的 S2 由"三轮反馈"改为"每轮合并三个模型的轨迹反馈"；③ `sample` 字段说明与文末核对凭据统一（schema + P5/P8 5 条示例，正文未定义）；④ "跨厂商模型迁移都没有测"改为"跨厂商的多跳链没有测"（单跳 Opus→Gemini 已在 §4.3.1 测过）；⑤ "差别只在源侧记忆"限定为目标侧也按同一记忆条件追加；⑥ RRSI 关系由"同一团队"改为同机构体系，并注明 RRSI 第一作者 Peng Xia 与本文作者不是同一人（2026-11-22 复核更正：本文第一作者是 Xin Yu，Fei Xia 为第二作者；两篇共享 Yanfei Chen）；⑦ 图 5 命名（图例是 Harness Transfer，不是 No SIM）与第 4 轮回落幅度（20.00→19.39）；⑧ 补 workspace judge、工程无 LLM judge、三个领域的失败/重叠分母规则；⑨ 作者上标排版 `¹⁴` → `¹,⁴`；⑩ 补 PDF 页脚 `© 2026 Google` 与 arXiv CC BY 4.0 的不一致。
- **未修 / 未核**：代码仓库与项目页（未另行检索，标未核验）；"是否逐页看过"这类过程性声明无法独立验证；论文未给 token 与条目数统计，相关判断保留。

## 复核记录（2026-11-22，重读）

- **基准**：从官方 `https://arxiv.org/pdf/2611.18856v1` 重新下载，525,024 B、35 页、sha256 `a8299ba5…d90ff3d`，与建档时一致；abs 页提交历史仍只有 `[v1]`。同版 HTML 重取为 707,675 B，11 条图题注逐条比对，确认「HTML Figure 1–11 = PDF Figure 2–12」（HTML 无 p.1 的 teaser）。
- **方式**：全文 35 页重读；Table 1（p.6）、2/3（p.8）、4（p.18）、5（p.23）、6（p.24）、7（p.25）、8（p.31）在 250 dpi 渲染页逐格对照；式 (1)–(3) 在 400 dpi 局部渲染核对；Figure 5(a) 用 PDF 矢量路径顶点复核逐轮保留分；Table 2 的加粗用 `get_text('dict')` 的字体名判定（S2 三列均为 `URWPalladioL-Bold`，B1 的 77.40 是常规体）。
- **结论**：表值、公式、Figure 5 读数与既有笔记无冲突，未改动任何结论或数字；本轮只补细节。
- **新增**：① §4.4 的逐轮支配陈述与 Figure 5(a) 的逐轮读数；② 附录 E.1 的「五个设定 held-out 增益大于 evolve 增益、FewShotAll 例外」；③ 编码/文本/workspace/工程四个域的若干具体机制（见「跨领域迁移模式」）；④ Table 6 题注给出的 Terminus-2 Cold Start 对照值。
- **精确化**：原「检索 github 无命中」改为「正文无命中；全文唯一命中是参考文献里 Harvey LAB 的 GitHub 链接」。

## 复核记录（2026-11-22，独立审计）

- **基准**：同一份官方 v1（525,024 B、35 页、sha256 `a8299ba5…d90ff3d`）；审计前快照 md5 `829cee3f…2d4`，审计期间未改动文件。用 `~/miniconda3` 的 pymupdf 重取全文、渲染页与矢量坐标。
- **方式**：派独立子 agent 只读审计，按 A–H 全项覆盖（元数据、Table 1–8 逐格、式 (1)–(3)、§/Figure/Table 引用、声称 vs 证据、读图、遗漏、内部一致性），它另用 `get_drawings()` 复算 Figure 5 顶点、用字体名核加粗、用 300 dpi 裁剪做配图像素差（max diff 0）。它报的 14 项由本笔记逐条回原文复验后全部采纳。
- **本轮修正**：
  1. RRSI 关系段把本文第一作者写成了 Fei Xia——应为 **Xin Yu**（Fei Xia 第二作者）；并补两篇共享 Yanfei Chen，旧复核记录⑥同步更正。
  2. P8「预测的 4 个任务」改为「两次共 4 条任务预测」（`photonic-waveguide-routing`、`production-planning` 各两次）。
  3. `three single-shot tiers` 的译法由「每次只升一档」改为「每级只触发一次」。
  4. 核对凭据的横轴间距 18.1 pt → **17.48 pt**（每两轮 tick 34.97 pt）。
  5. 「全为 0–100、两位小数」补上 **Table 1 一位小数**的例外（C.5）。
  6. §1 的 `often needs` 与 `may repeat / may change` 不再写成「都需要」「会」；第三条现象标注为 F.3 的单次观察。
  7. 附录 E.1 的「作者据此强调……」删去，改为原文只陈述事实、随后转入 §4.2。
  8. 「作者也承认」改为引用 Limitations 的原意（对照评估的是完整过程，不是单字段消融）。
  9. P8 的「最终分数仍提高」改为与 **Table 5 的 Terminus-2 Full SIM 行**（19.39→21.82）绑定，并注明案例不作贡献归因。
  10. 补 Ethics Statement 两点：harness 可能迎合评测器；workspace 分数可能受 judge 偏差影响。
  11. tool registry 的复用限定为 **Harness Transfer 的目标 run**，不是所有目标 run。
  12. `accepted` 的说明改为「存下来的都是入选的；未入选的候选根本没写进记录」。
  13. 「B1 与 S2 的差异落在小样本范围」改为「每个 procedure 只跑一次，0.78 分不足以判断稳定性」。
  14. 「奇数时 evolve 取偶数」明确为「取较小的偶数（89→44、67→34、65→32）」。
- **未修 / 未核**：代码仓库——按标题检索未发现作者公开实现，只命中 Hugging Face papers 聚合页与转载（2026-11-22）；论文未给 token/条目数统计，相关判断保留。本轮未重新获取 HTML（沿用同日 707,675 B 同版副本的图号核对）。

---

## 核心结论

一句话：**这篇论文把"harness 自进化"从"在一个固定 benchmark/模型上搜到收敛"推进到"换数据集或换模型之后继续搜"，并提出让优化器带着上一段优化过程的记忆（SIM）进入新设定——记忆按"反复出现的 harness 问题"组织，记录改动的理由、事前预测与事后观测结果、以及评测上下文；在四个领域的 10 个设定里，带完整记忆的续优化最终分都高于只带 harness、只带根因诊断的对照。**

作者的三条主张：

1. **设定**：定义 Continual Recursive Self-Improvement（CRSI）——在 harness 的可执行接口兼容的前提下，源设定 `σ_S` 优化完之后，把最终 harness 带到目标设定 `σ_T` 继续优化；分**跨数据集**（策略固定、benchmark 变）与**跨模型**（benchmark 与 split 固定、策略变）两种。
2. **方法**：Self-Improvement Memory（SIM）是**给 harness 优化器（proposer + selector）的记忆，不是给任务策略的记忆**。每条记录以根因假设 `c_i` 为键，追加该问题下的历次尝试 `(a_ij, o_ij, p_ij)`，并保留入选编辑的实测结果（包括回归与未修好）。
3. **结果**：6 个跨数据集设定与 4 个 Opus→Gemini 设定里 Full SIM 最终分最高；编码域用 10 次独立源优化做配对续优化，9/10 次更好，平均 **+2.36 分**（95% CI [1.05, 3.68]，`p=0.003`）。

**适合谁看**：做 agent harness 自进化、且真实场景里模型会换代、任务分布会漂移的工程/研究团队；这篇的贡献几乎全在"**跨设定时保留什么信息、怎么记**"这一层，proposer/selector 的搜索算法本身没有改动。

![Figure 2](assets/figure2-sim-loop.png)

*图 2（原文 Figure 2，p.4）：SIM 在 agentic 外循环里的位置。评估器在 evolve 集上跑冻结策略 `M`，proposer 读代码与历史、提 `k` 个候选，selector 先筛后选，只有被选中的编辑连同实测结果写回 SIM。虚线是 proposer/selector 读 SIM，青色实线是写回。裁剪自 v1 PDF，许可见来源信息。*

---

## 问题与动机

### 现状：优化总在固定设定里做

- harness 决定模型"看到什么上下文、能调什么工具、怎么执行"，因此不改权重也能提分；但手工找改动要反复工程与评测（§1）。
- 已有 RSI 方法用执行反馈反复"提议—评估—选择" harness 编辑：Meta-Harness 用共享文件系统暴露历史实现与轨迹（Lee et al., 2026），AHE 让组件与改动结果可观测、并核对编辑级预测（Lin et al., 2026），RRSI 用正则约束搜索轨迹（Xia et al., 2026）。
- 问题在于：**优化通常只在一个固定设定内做**。模型换代（同族新版本）或多模型共用一个 harness 时，以及任务分布变化时，往往需要把已演化的 harness 带过去继续优化（原文用 "often needs"）。

### 为什么"只带 harness"不够

作者的切入点是：harness 只是**结果**，它不解释"当初为什么这么改、预期修什么、测出来怎样"（§1）。缺了这段历史，目标设定里的优化可能：

- 重复源设定已经试过的方向；
- 改动继承来的组件却不知道它的目的；
- 把继承来的机制误记成"自己这一轮发现的"（F.3 里一次无 SIM 的观察，不是 §1 的一般断言）。

两个具体现象（作者给的例子，都是单次实验）：

- **换模型**：Opus 演化的 harness 在 Gemini 上 workspace 只有 68.41，低于 Gemini 种子 harness 的 73.89（§4.3.1、Table 6）。
- **换数据**：FewShotAll 源演化后在目标文本分类上是 72.92，低于种子的 75.72（§4.2、Table 5）。

也就是说，**源设定的提升不保证目标设定的起点更好**；有用的是"这个修改为什么曾经有用"这类经验，而不是修改本身。

### 与已有 memory 工作的差别（作者定位）

§2 与附录 A.3 把先前工作分成几类：保留候选工件（Meta-Harness）、编辑历史与拒绝记录（RRSI）、改进图（Causal Improvement Graph）、技能修订记录、playbook（Turbo Harness）、按问题归组的候选 harness 库（HarnessBank）；任务求解侧还有 Reflexion、Voyager、ExpeL、ReasoningBank/ACE 等。作者的区分是：SIM 把 **harness 问题 → 修改 → 预测/观测结果 → 出处** 串起来，并让这条记录**跟着 harness 跨设定迁移、在目标侧继续追加**，同时喂给 proposer 与 selector。

---

## 方法与贡献

### 1. 形式化：Harness RSI 与 continual 设定（§3.1）

一个设定记作 `σ = (M, X)`：冻结的策略模型 `M` + 任务集 `X`，后者分成互不相交的 evolve 集 `X_evo` 与留出评测集 `X_eval`。分数 `J(H; M, X)` 按 benchmark 自己的聚合规则算。**只有 evolve 集的反馈**能用于提议、选择、更新 SIM 和停止决策；留出集的分数与轨迹不进入优化代理（附录 B.2）。

一次 run 有 `N` 轮。第 `t` 轮：评估器在 evolve 集上跑 `H_t`，返回分数、轨迹与错误 `F_t`；proposer `P` 结合本 run 历史 `D_t` 生成 `k` 个候选 `C_t`；selector `S` 先筛掉一部分（不执行的候选没有分数），再在已执行候选里权衡性能、复杂度、领域特定性与回归风险后选：

```math
\mathcal{C}_t = P(H_t, F_t, \mathcal{D}_t), \qquad
H_{t+1} = \mathcal{S}\left(H_t, F_t, \mathcal{C}_t, F_t^{\mathcal{C}}\right)
```

读法：本轮候选只由当前 harness、本轮反馈与本 run 历史决定；下一轮 harness 由 selector 在"当前 harness + 已执行候选的反馈"里选，没选中就原地不动（`H_{t+1}=H_t`）。

**Continual 设定**：源设定跑完后得到 `H_S`，在目标设定 `σ_T` 从 `H_S` 继续。跨数据集是 `M_S = M_T`、`X_S ≠ X_T`；跨模型是 `M_S ≠ M_T`、`X_S = X_T`（同一 benchmark 与 split）。衡量指标是**目标留出集上"最终分 − 起始分"**。

### 2. SIM 的记录结构（§3.2）

```math
m_i = \left(c_i,\ \left[(a_{ij}, o_{ij}, p_{ij})\right]_j\right)
```

读法：第 `i` 个问题条目以根因假设 `c_i`（如"过早宣布完成"）为键，`j` 按时间顺序索引该问题下的尝试；每次尝试存修改及理由 `a_ij`、预测与观测到的任务结果 `o_ij`、出处 `p_ij`（领域、benchmark、策略模型、轮次）。**预测在评估之前写下、评估之后核对**——这是它比"只存 diff"多出来的一层。

每轮 proposer 在 system prompt 里拿到**完整的 SIM**（不检索、不截断），selector 在评估候选时读同一份记录：

```math
\mathcal{C}_t = P(H_t, F_t, \mathcal{D}_t; \mathcal{M}_t), \qquad
H_{t+1} = \mathcal{S}\left(H_t, F_t, \mathcal{C}_t, F_t^{\mathcal{C}}; \mathcal{M}_t\right)
```

读法：相对式 (1)，proposer 与 selector 都多了一个条件项 `M_t`（当前记忆）。**被选中的候选才写入** `e_t`，包括它让指标退步或没修好预测任务的情况；更新 `M_{t+1} = U(M_t, e_t)` 把记录追加到被引用的根因条目下，或新建条目；没选中则 `e_t = ∅`、记忆不变。根因文本完全相同的条目会被合并但保留全部历史（D.1：是否同一根因由 proposer 自己判断，不另设相似度模型，判断结果在评估前写入当轮 change manifest）。

### 3. 四个对照条件（§3.3、附录 C.3、Figure 6）

| 条件 | 起始 harness | 目标阶段的记忆 |
| --- | --- | --- |
| Cold Start | 种子 `H_0` | 无 |
| Harness Transfer | 源演化 `H_S` | 无 |
| Problem-Only Memory | `H_S` | 只有根因 `M_S^c`（去掉修改、结果、出处） |
| Full SIM | `H_S` | 完整记录 `M_S`，并在目标阶段继续追加 |

四个条件共享目标策略、evolve 任务、轮数与候选预算；**都保留目标 run 的普通历史 `D_t`**，差别只在记忆条件——源侧携带什么，以及目标侧按同一条件追加什么。因此 `Full SIM` 对 `Problem-Only` 的差距，检验的是"诊断之外的证据与历史"是否有用；`Full SIM` 对 `Harness Transfer` 的差距，才是记忆机制的总体效果。

### 4. 贡献的边界

- **相对前代的结构性变化**：不改 proposer/selector 的搜索流程（仍是 `N` 轮 × `k` 候选、先筛后选），只在两侧注入记忆；新增的是跨设定的"记忆载体 + 更新规则 + 记录格式"。
- **论文自报的效率数字**：编码域一轮约 **4 小时**，其中评测 1.7 小时、候选采样 34 分钟（附录 C.1）；轮数与候选数在各方法间对齐，但**token 用量与运行时长可以不同**，论文没有报告 token、也没有报告 SIM 本身的 prompt 开销。

---

## 实验与证据

### 设置（§4.1、附录 B/C）

- **四个领域**：编码（TB2.1 → TB4）、文本分类（3 个源数据集 → 8 个目标数据集）、agentic workspace（Harvey LAB → JobBench + GDPval + APEX-Agents 等权平均）、工程设计（EngDesign → Frontier-Eng）。
- **模型**：跨数据集两阶段都用 Gemini 3.8 Flash 作策略；跨模型用 Claude Opus 5.5 做源优化、Gemini 3.8 Flash 做目标优化。proposer 与 selector 默认也是 Gemini 3.8 Flash（即使任务是 Opus 在跑）；附录 E.4.2 换成 Opus 做优化代理作为消融。
- **预算**：每次 RSI run `N=10` 轮、每轮 `k=5` 个候选；每个任务 5 次 rollout，evolve 与留出各一份；候选预算与 rollout 预算分开。
- **数据划分**（Table 4）：每个 inventory 均匀随机切成约两半，不分层；任务数为奇数时 evolve 取两半中的**偶数个**（89→44、67→34、65→32、47→24；偶数可能是较小或较大的一半）。例如 TB2.1 共 89 题 → evolve 44 题 / 220 rollouts、留出 45 题 / 225 rollouts；TB4 66 题 → 33/33；文本分类源 412 例、目标 1,000 例；workspace 三个目标合计 merged 765 题（382/1,910 与 383/1,915）。
- **指标**：编码 pass@1；文本分类按样本池化的 accuracy；workspace 用各 benchmark 自己的 rubric/胜率/pass@1 后等权平均；工程用 pass rate 或 medal score。全为 0–100；主表按两位小数，Table 1 例外（C.5 说明保留一位小数）。
- **判分与评测口径**：workspace 三个 benchmark 统一用 Gemini 3.8 Flash 作 judge（不同于 RRSI 的混合 judge 配置与 GDPval 投票团），工程两种指标都不用 LLM judge（B.5–B.6）；编码的 infra 失败 rollout 留在分母记 0，文本分类每次 rollout 从同一初始 example-memory 状态开始，Frontier-Eng 里源自 EngDesign 的 7 个子问题记 0 分但仍留在分母（B.3/B.4/B.6）。
- **统计口径**：除专门的配对研究外，**每个条件只跑一次完整 RSI**，5 次 rollout 只估计执行波动、不估计优化方差；单 run 结果只作描述性报告（附录 C.4）。

### 跨数据集：6 个设定里 Full SIM 全胜（§4.2、Table 5、Figure 3）

| 领域 / 种子 | Cold Start 前→后 | Harness Transfer 前→后 | Problem-Only 前→后 | Full SIM 前→后 |
| --- | --- | --- | --- | --- |
| 编码 / AHE | 16.36 → 19.39 | 18.18 → 20.61 | 18.18 → 18.79 | 18.18 → **24.85** |
| 编码 / Terminus-2 | 18.18 → 19.39 | 19.39 → 19.39 | 19.39 → 20.61 | 19.39 → **21.82** |
| 文本 / NoMemory | 68.60 → 72.00 | 71.40 → 71.00 | 71.40 → 73.40 | 71.40 → **73.60** |
| 文本 / FewShotAll | 75.72 → 75.92 | 72.92 → 74.12 | 72.92 → 75.52 | 72.92 → **77.92** |
| Workspace / ReAct | 73.89 → 82.98 | 74.93 → 85.07 | 74.93 → 85.54 | 74.93 → **87.89** |
| 工程 / ReAct | 39.13 → 40.87 | 39.13 → 42.61 | 39.13 → 42.61 | 39.13 → **46.96** |

- 作者报的区间：Full SIM 比 Harness Transfer 高 **2.43–4.35** 分，比 Problem-Only 高 **0.20–6.06** 分（本笔记按上表复算，逐项吻合）；Problem-Only 相对 Harness Transfer 从 **−1.82** 到 **+2.40**，作用不稳定。
- "最强对照"的领先幅度从 NoMemory 的 **0.20** 到工程的 **4.35** 分（复算：NoMemory 73.60−73.40；工程 46.96−42.61）。
- **源提升不等于目标起点更好**：六组源留出分都涨了 2.75–6.41（附录 E.1、Figure 7），但 FewShotAll 带到目标反而低于种子（72.92 vs 75.72）；无记忆续优化到 74.12，仍低于 Cold Start 的 75.92，Full SIM 到 77.92。
- 附录 E.1 另有一处口径：六个设定里有五个的留出增益**大于** evolve 增益，唯一例外是 FewShotAll（留出 6.41 vs evolve 6.60）。原文只陈述这一事实，随后转入 §4.2 的「源增益是否带来更好的目标起点」；本笔记不把它单独当作源侧泛化的证据。
- NoMemory 上 Cold Start 的涨幅更大（3.40 vs 2.20）但终点更低（72.00 vs 73.60）；作者因此主张同时报起点与终点，并用共享起点的 Harness Transfer 作为记忆机制的直接对照。

### 跨模型：Opus → Gemini（§4.3.1、Table 6、Figure 4）

| 领域 / 种子 | Cold Start | Harness Transfer | Problem-Only | Full SIM |
| --- | --- | --- | --- | --- |
| 编码 / AHE | 16.36 → 19.39 | 13.94 → 18.18 | 13.94 → 20.61 | 13.94 → **21.82** |
| 文本 / FewShotAll | 78.32 → 82.72 | 77.72 → 80.20 | 77.72 → 81.32 | 77.72 → **83.80** |
| Workspace / ReAct | 73.89 → 82.98 | 68.41 → 73.42 | 68.41 → 79.22 | 68.41 → **84.75** |
| 工程 / ReAct | 39.13 → 40.87 | 34.78 → 42.61 | 34.78 → 46.96 | 34.78 → **50.43** |

- Opus 演化的 harness 换到 Gemini 后**四个领域都低于 Gemini 自己的种子**，缺口 0.60（文本）到 5.48（workspace）分。
- 目标侧续优化并不总能补回：Harness Transfer 在编码、文本、workspace 三个领域仍低于 Cold Start；Full SIM 四个领域都最高，比 harness-only 高 **3.60–11.33** 分（复算吻合）。
- workspace 差距最大：同起点 68.41，Full SIM 到 84.75，Harness Transfer 只到 73.42。
- Table 6 题注另说明：编码行的 Cold Start 用的是 AHE 种子；Terminus-2 的 Cold Start 对照为 18.18 → 19.39。

### 模型代际链（§4.3.2、Table 1）

在 TB2.1 上按 Gemini 2.5 Flash → 3.5 Flash → 3.8 Flash → 4 Argon 依次传递 harness 与 SIM；Fresh RSI 每代都从种子重新优化：

| Gemini | Seed | Fresh RSI | CRSI |
| --- | --- | --- | --- |
| 2.5 Flash | 17.8 | 21.4 | **22.4** |
| 3.5 Flash | 70.2 | 73.3 | **76.8** |
| 3.8 Flash | 87.2 | 88.9 | **90.5** |
| 4 Argon | 89.7 | **95.6** | 94.8 |

- 第一代两边同种子，比较的是"初次运行里 SIM 是否有用"（22.4 vs 21.4）；后续三代里 CRSI 两胜一负：3.5 Flash +3.5、3.8 Flash +1.6，4 Argon **−0.8**。
- 作者没有解释 4 Argon 为什么回退；这也是表 1 里唯一一处 CRSI 低于 Fresh RSI 的结果。

### 一个 harness 服务多个模型（§4.3.3、Table 2）

目标文本分类套件上，让 Grok 4.20 Reasoning、Claude Opus 5.5、Gemini 3.8 Flash 共用一个 harness：

| 构造方式 | Evolve | Held-out | All |
| --- | --- | --- | --- |
| B1 每模型各自演化 | 77.40 | 75.20 | 76.30 |
| B2 共享种子 | 72.36 | 73.28 | 72.82 |
| S1 顺序 CRSI（Grok→Gemini→Opus） | 76.72 | 74.20 | 75.46 |
| S2 统一综合（每轮合并三个模型的轨迹反馈） | **78.92** | **75.24** | **77.08** |
| S3 用 Gemini 3.8 Flash 演化的 harness | 74.28 | 71.24 | 72.76 |
| S3 用 Grok 4.20 Reasoning 演化的 | 68.24 | 66.84 | 67.54 |
| S3 用 Claude Opus 5.5 演化的 | 75.20 | 72.24 | 73.72 |

- 作者强调的对比是**留出列**：S2 的 75.24 与 B1 的 75.20"相近"，即一个共享 harness 可接近三个专用 harness；S1 74.20；三个 S3 harness 在留出列平均 66.84–72.24。
- **All 列**（= (Evolve+Held-out)/2，附录 C.6 定义）S2 是 77.08、B1 是 76.30：按这一列 S2 反而高 0.78 分。正文只引留出列，见"原文自身的表述张力"。
- 作者自己声明：每种构造只跑一次、不比优化成本，"小差异不足以证明统计等价或逐模型排名"。

### 配对研究：同一继承 harness 上有没有 SIM（§4.4、Table 3、Figure 5）

从 Terminus-2 在 TB2.1 上独立跑 **10 次**源优化，每个源 harness 初始化两条 TB4 续优化（有/无 SIM），起点、策略、benchmark、轮数与候选预算都配对：

| Run | Start | No SIM | SIM | Δ |
| --- | --- | --- | --- | --- |
| 1 | 18.18 | 20.61 | 22.42 | +1.81 |
| 2 | 16.97 | 17.58 | 19.39 | +1.81 |
| 3 | 17.58 | 20.00 | 20.61 | +0.61 |
| 4 | 18.18 | 18.18 | 23.64 | +5.46 |
| 5 | 17.58 | 18.79 | 20.61 | +1.82 |
| 6 | 19.39 | 20.00 | 23.64 | +3.64 |
| 7 | 18.79 | 20.00 | 21.82 | +1.82 |
| 8 | 18.18 | 20.00 | 19.39 | −0.61 |
| 9 | 19.39 | 18.18 | 23.03 | +4.85 |
| 10 | 19.39 | 20.00 | 22.42 | +2.42 |
| Mean | 18.36 | 19.33 | 21.70 | **+2.36** |

- 9/10 次更好，唯一例外低 0.61；均值差 +2.36（95% CI [1.05, 3.68]，双侧配对 `t(9)=4.06`、`p=0.003`；符号秩检验 `p=0.006`；`d_z=1.28`）。
- 本笔记复算：Start 均值 18.363、No SIM 19.334、SIM 21.697；Δ 均值 2.363；Δ 的样本标准差 1.842、标准误 0.582，`t=4.06`、CI ±1.32，`d_z=1.28`——与原文一致。
- 该研究的分析单位是**独立源 run**（10 个），不是 10×5 次 rollout；作者在附录 C.4 明确区分"重复 rollout"与"独立优化 run"。
- §4.4 另报逐轮比较：两个编码种子上 Full SIM 在第 1–10 轮都最好或并列，从 AHE 起点在第 5 轮（21.21）就超过最强对照的终局 20.61，从 Terminus-2 起点第 2 轮（21.21）已超过。Figure 5(a) 的 Full SIM 逐轮保留分为 r0 18.18、r1–r3 20.00、r4 19.39、r5 21.21、r6–r7 22.42、r8 24.24、r9–r10 24.85；r4 是整条曲线唯一一次回落（矢量路径顶点读数，TB4 每个 rollout 约 0.61 分，故读数都落在 0.61 的整数倍上）。

![Figure 5](assets/figure5-coding-curves.png)

*图 5（原文 Figure 5，p.9）：(a)(b) 两个编码种子下逐轮保留版本的留出 TB4 分，round 0 是起点；(c) 十个独立源 run 上 SIM − No SIM 的终局差，虚线为均值 +2.36。Full SIM 在 (a) 第 4 轮从 20.00 回落到 19.39（矢量 marker 读数），仍高于同期对照。裁剪自 v1 PDF，许可见来源信息。*

### 源性能保留与消融（附录 E.3/E.4）

- **源侧保留**（Figure 8，AHE 起点，留出 TB2.1 共 225 rollouts，一次 rollout = 0.44 分）：三个迁移条件都从 90.22 出发；Full SIM 终局 88.89、Problem-Only 终局 88.44（两者的最低点是 88.44，即 −1.78）；Harness Transfer 第 2 轮跌到 86.67、终局 87.56；Cold Start 85.78 → 85.33。
- 作者折算成**丢失的成功 rollout 数**：Full SIM 3/225、Problem-Only 4/225、Harness Transfer 6/225（复算：90.22−88.89=1.33≈3×0.44；−88.44=1.78≈4×0.44；−87.56=2.66≈6×0.44）。同一次 AHE 迁移里，Full SIM 在 TB4 上 +6.67，Problem-Only 只 +0.61。
- **只记根因不够**（E.4.1）：10 个设定里 Full SIM 都高于 no-memory 与 root-cause-only；作者在 Limitations 说明该对照评估的是 SIM 这一完整过程（继承记忆 + 目标侧更新），因此不是单个字段的消融。
- **优化代理换 Opus**（E.4.2、Table 7）：TB2.1 源优化中，Opus 做 proposer/selector 的留出分比 Gemini 高 1.06（AHE，91.28 vs 90.22）与 0.05（Terminus-2，91.61 vs 91.56）。

---

## 案例：记忆怎样改变后续编辑

附录 F 的案例都是**编辑史**，作者明确说它们"不估计单个编辑对最终分的贡献"（p.24），所以只能当机制示意、不能当因果证据。

### 完成门（completion gate）：问题保留、实现要改（F.2、F.3、Figure 11）

- **源问题 P5**：TB2.1 上一个任务里，agent 把"用户会自己配账号"当成外部分工，没建 `user` 账号，本地命令全成功就宣布 `task_complete`；种子 harness 的完成确认只是让模型再说一遍，不问执行证据。源优化分三轮做出 `ExecutionGatingInterlock`（137 行 → 275 行），拦截"上一轮解析错/没真执行却要完成"等情形，任务成功率 1→5（out of 5）。
- **目标侧**：TB4 的 `photonic-waveguide-routing` 任务里，解可行、`check_routing.py` 全过、无终端错误，四个拒绝条件都不触发；但评分是路径代价，"可行"不等于"够好"。于是目标第 2 轮开新条目 **P8**（可行但次优），加"约束检查通过 ≠ 最优"的提示与检测；第 4 轮加第五个拒绝路径拦截"带分数的可行性输出"。目标阶段把组件从 275 行扩展到 437 行。
- **结果**：P8 两次入选，但两次共 4 条任务预测（`photonic-waveguide-routing`、`production-planning` 各两次）全部未实现（0/4）；后来的编辑又改变了第 4 轮的阻塞行为：最终 harness 保留源侧四条拒绝路径，行为变为"拦截自报不可行 + 对可能次优给出提示"。SIM 里仍留着那次失败尝试与未解决的预测。
- **对照（无 SIM）**：同一个继承门被改了四次、两次是在修完成死锁，第 3 轮的 rationale 还把继承来的门归因成"自己第 1 轮做的"（F.3）。有 SIM 的运行则在第 2 轮读到 P5 的源记录，保留验证思路、把证据要求改写成目标侧谓词。

### 同一诊断跨设定累积证据（F.4、Figure 12）

P3 的根因是"交付物内部正确、但违反验证器的外部契约（schema、耦合属性、API 签名、切分卫生）"。源第 4 轮用 system prompt 指南修好 1/4；目标第 5 轮追加 schema 与测试审计（0/2）、第 6 轮追加防御性契约检测（1/2）。诊断不变、证据累加，未解决的预测也留着。

### 源侧两个编辑（F.1）

- `adaptive-rejection-sampler`：agent 把约 22.8 KB 的程序塞进一条 shell 命令，超过该 run 报告的约 16 KB 传输上限，命令没跑、文件没建。修法是把输入切成 ≤2,048 字符的块、特殊键单独发、发送失败直接报错；成功率 1→5（out of 5）。
- `gpt2-codegolf`：C 代码里的引号没转义，塞进 JSON 的 `keystrokes` 字段导致 `json.loads` 失败。修法是解析失败后再走一次修复：按"下一个期望键"定位真正的结束引号并转义中间所有引号。这一条**没有报告修改后的成功率**。

### 跨领域迁移模式（F.5、Table 8）

Table 8 把四个领域 ×（数据集变化 / 模型变化）的机制分成四类：直接复用、需要适配、继承后扩展、依赖设定（含失效或被移除的组件、需要重新评估的假设）。几个具体观察：

- 编码：终端/进程层与 paste-buffer 结构可留，但 TB4 需要按键归一化与前台进程识别；完成契约保留、判据换成目标侧；**解析器修复是针对具体模型输出错误的**，换模型要重查；拒答处理被带过去但在 TB4 没有触发任务，所以"它在场"既不证明收益也不证明损失。F.5.1 还记录：无 SIM 的 cold-start run 在 8 轮内没有重新发现这套工具层改动，10 轮后只是得到一个更大的 parser，仍未超过继承的 harness。
- 文本分类：BM25 索引与检索器跨数据集可用，`top-k`、分数阈值、类配额要重调；SMILES 归一化在目标套件里失效（输出不再是该格式）。源侧把检索限制在 BM25 分数为正的前 8 个样例；四个 run 里有三个演进出 BM25 索引；目标侧对 Banking77、GoEmotions 的 rubric 重写比对 SciTail、TweetEval-Hate 更多（F.5.2）。
- Workspace：终止前的软门可留，但目标失败来自"文件写了却没通过 `write_file` 注册"，探针要从文件系统改成工具调用历史；注册假设依赖评测器，换评测器要重想。目标的注册检查分三级、每级只触发一次（single-shot）：检测到写文件时提示、步数预算用掉 75% 仍未注册时强制要求、`final_answer` 时条件阻塞（F.5.3）。
- 工程：源侧 import 了但没调用的 tool registry，在 **Harness Transfer 的目标 run** 里被重新用作集中截断的入口点（不是所有目标 run）；三个目标 run 都提高了共享上下文常量；Full SIM 保留了源指南并扩展，Harness Transfer 第一轮就把指南退回种子 prompt。Full SIM 还把源侧一次性的事后检查改成 checkpoint 协议，把超过 baseline 的中间产物写盘以防无预告超时丢失；同一领域记录的零分率在 Opus 上 0.09%、Gemini 上 4.49%，所以干预阈值要按策略重校（F.5.4）。

F.6 归纳出 SIM 的四个作用：保留旧理由以判断"还要不要"、同一理由可换实现、新结果给旧诊断加证据、编辑被替换后经验仍可查。

---

## 工程视角

### 记录与更新路径

一次 run 的 SIM 是**一个 JSON 文件**（D.3）：顶层有 `next_id`、`carried_from`（源 run/领域/目标 run）、`aliases`（合并后的旧 ID，如 `P6 → P5`）与 `problems[]`。每个 problem 是 `{id, name, opened_round, attempts[]}`；每个 attempt 是 `{round, sample, accepted, backfilled, what, files, predicted, fixed, missed, passed, total, domain}`。

- `what`/`files` 描述改了什么；`predicted` 是**评估前**写下的"预期修好的任务"，`fixed`/`missed` 是评估后的对账；`passed`/`total` 是该轮 evolve 集成功/总试验数。
- `carried_from` 是 run 级字段，让整份记录可追溯到源/目标 run；`domain` 在示例里取 `coding_enriched`（源）与 `tb4`（目标）。
- **未说明的字段**：`backfilled` 只出现在 D.3 的 schema；`sample` 只出现在 schema 与 P5/P8 的 5 条示例记录（取值 `s1`–`s4`），正文没有定义它的含义。`accepted` 在 P5/P8 的 5 条 attempt 里都是 `true`，而 §3.2 说只记录被选中的候选，语义上有些冗余。
- 合并规则：根因文本完全相同则确定性合并，保留全部 attempts；是否相同由 proposer 判断，判断结果在评估前落盘（D.1）。

### 提示词约束（D.2）

给 proposer/selector 的八条指导，核心是三条：把条目当**先前经验**而不是必须沿用的结论；先看条目背后的 domain/benchmark/model；新证据足够时可以改、换、覆盖旧改动，只有在有新证据时才重试已测过的方向。benchmark 与模型**同时**变化时，任务特定证据的权重更低。

### 成本与失效模式

- 论文给出的成本只有编码域：**一轮约 4 h，其中评测 1.7 h、候选采样 34 min**；轮数/候选数对齐，token 与时长未对齐也未报告。跨方法比较的是"同轮数同候选数"，不是同算力。
- SIM 每轮**整份**进 system prompt、不检索不截断，因此 prompt 随轮数与问题数线性增长；论文没有给条目数/长度的统计（D.3 的示意里出现 P1–P9，P6 已并入 P5），也没有报告 prompt token 与由此带来的成本。这是把它搬到长周期、多设定场景时首先要量的量。
- 只记录入选编辑：被筛掉/未执行的候选、以及 selector 的拒绝理由都不在记忆里；因此 SIM 解释的是"试过并采纳了什么"，不是完整搜索树。
- 预测字段要求"事前写、事后核"，这会约束 proposer 的表述，但**预测错了不会阻断采用**（P8 两次合计 0/4 条预测实现，仍被采用）。记忆在这里的作用是留下证据，不是自动纠错。
- 迁移失败的高发点（F.5）：依赖具体模型输出格式的解析修复、依赖评测器注册方式的检查、按某一策略失败率校准的干预阈值；这些都需要在目标设定重新验证。

---

## 与仓库其他条目的关系

> 本节为本笔记补充，只做定位与对照。

- **RRSI（00212，`notes/papers/2609.24972-v3-rrsi/note.md`）**：同一机构体系（Google Cloud AI / Google Cloud AI Research）的相关工作；RRSI 第一作者是 Peng Xia，本文第一作者是 Xin Yu（Fei Xia 是第二作者）。两篇只在 Yanfei Chen 一位作者上重合，作者列表不同，勿把两篇当成同一团队。本文在 workspace 与工程两个领域直接采用 RRSI 的环境、种子 harness 与评测接口（workspace 的 judge 改为统一用 Gemini 3.8 Flash，而 RRSI 是混合 judge 配置）。差别在问题：RRSI 约束"搜索轨迹怎么走"，本文关心"换设定后带什么过去"。RRSI 也记录假设、diff、分数与拒绝决定；本文的增量是把记录按问题归组、加上事前预测/事后结果与出处，并让它跨设定继续追加。
- **Harness²（00220，`notes/papers/2610.14224-v1-harness2/note.md`）**：本文把它归为"保留已采纳 harness 与改法经验、在 benchmark 间复用"的一类（附录 A.2）。SIM 与它的差别是记录粒度和使用方式：SIM 以根因为键、把 rationale/预测/观测/出处绑在一起，并在目标阶段由 proposer 与 selector 同时读取。
- **Self-Harness（2606.09498，`notes/papers/2606.09498-v3-self-harness/note.md`）**：本文引作"弱点挖掘 + harness 提议 + 回归验证"的代表（Zhang et al., 2026a）。两者都利用失败证据，但 Self-Harness 关注一次优化循环内的验证，本文关注跨设定的经验携带。
- **Evo-Harness（2608.15071，`notes/papers/2608.15071-v2-evo-harness/note.md`）**：本文引用的是 **EvoHarnessBench**（Ke et al., 2026，arXiv:2609.04280），与本仓库已读的 Evo-Harness 不是同一篇，勿混。
- **HarnessDev / HarnessX / HarnessPro 等仓库条目**：都属"harness 自进化"家族，但本文没有直接引用它们；本篇可看作给这类方法加一个**跨设定记忆层**的通用补丁，而不是新的搜索器。

---

## 局限与待确认

作者明确写的（Limitations）：

1. 受算力限制，**独立重复只做了编码域**；其他领域的每个条件只有一次 run，无法给跨 run 区间。
2. 只研究**接口兼容**的设定，且优化器的规划与搜索过程保持不变（否则无法把差异归给记忆）。
3. 比较的是 **SIM 这个完整过程**（继承记忆 + 目标侧更新），不是单个字段的消融。

Ethics Statement 另提醒两点（不算 Limitations，但影响解读）：自改的 harness 可能迎合评测器而不真正解题——论文的对应做法是把留出反馈与优化代理隔离、标明每个 benchmark 的 verifier/judge，并在附录 F.2 收录一次「入选但没修好目标」的编辑；workspace 分数可能反映 LLM judge 的偏差，而 workspace 恰是 Full SIM 增益最大的领域（+12.96，Figure 11a）。

读者应注意的（本笔记判断）：

- 10 个主设定都是单 run，"Full SIM 全胜"是描述性结果；唯一有重复的实验只在编码/Terminus-2 上，换成 AHE 或别的领域是否仍有 2 分级别优势，没有证据。
- 代际链只有 4 代，且末代回退 0.8；更长的链、跨厂商的多跳链没有测（跨厂商单跳 Opus→Gemini 已在 §4.3.1 测过）。
- "一个共享 harness" 实验每个 procedure 只跑一次，作者自己说不能据此排名；B1 与 S2 各只跑一次，0.78 分的差异不足以判断稳定性。
- 没有成本对账：SIM 让 prompt 变长，理论上会推高 proposer/selector 的推理成本；论文只说"token use and runtime can differ"，没有量化，也没有做"同等 token 预算"的对照。
- 案例只说明机制，不估计单个编辑的贡献；P8 的两次尝试都没有修好目标任务，而同一编码设定（Terminus-2、Table 5 的 Full SIM 行）终局分仍从 19.39 升到 21.82——案例与总分之间不能直接连线（p.24 也明确不作这种归因）。

---

## 原文自身的表述张力

1. **同一个 Cold Start 在不同表里不一致**：文本分类 FewShotAll 的 Cold Start 起点，Table 5 是 **75.72**、Table 6 是 **78.32**（同为 Gemini 3.8 Flash、同一目标套件）；而编码（16.36）、workspace（73.89）、工程（39.13）三行的 Cold Start 起点在两表完全相同。论文没有解释这个差异。可能的解释是文本分类的随机划分在两次实验里各抽了一次（附录 B.2 只说"均匀随机切分"、未说固定种子），但原文没有说明；本笔记不据此推断哪张表"错"。
2. **共享 harness 的结论依赖看哪一列**：§4.3.3 用留出列说 S2（75.24）与 B1（75.20）"相近"；Table 2 的 All 列是 S2 **77.08** 对 B1 **76.30**（+0.78），且按题注 S2 在三列都加粗。正文没有提 All 列的这个差距，读者容易把"相近"读成"全面持平"。
3. **第一代代际结果没进叙述**：Table 1 第一行 CRSI 22.4 vs Fresh 21.4（+1.0），作者只把它当"初次运行里 SIM 有用"的证据，没有展开；正文的"两胜一负"只数后三代。两处并不矛盾，但只读正文会漏掉第一代的 +1.0。
4. **记录 schema 有未定义字段**：`backfilled`、`sample` 在 D.3 的字段表里没有解释；`accepted` 的语义（"selector 选中，即使部分预测没实现"）与"只记录入选候选"的规则放在一起时，示例里恒为 `true`。记录里看不到的是未入选或被筛掉的候选——不是无法区分，而是根本没写进来。
5. **"最强对照"的口径**：§4.2 说领先"最强对照"0.20–4.35 分。逐项复算成立，但不同设定的"最强对照"并不是同一个条件（NoMemory 是 Problem-Only，工程是 Harness Transfer 与 Problem-Only 并列 42.61），正文没有逐项点明。
6. **图 11(a) 与图 5 的命名不同**：图 11(a) 把对照叫 "Without SIM (Harness Transfer)"、把处理叫 "With SIM (Full SIM)"；图 5 的图例写的是 "Harness Transfer"，只有 (c) 的纵轴与 Table 3 表头用 "No SIM"。语义一致（都是 Harness Transfer vs Full SIM），但术语不统一。

---

## 核对凭据（便于复核）

- 原文 PDF：`https://arxiv.org/pdf/2611.18856v1`，525,024 B、35 页、sha256 见来源信息；下载后以 `%%EOF` 与页数（gs：35）确认完整，未使用镜像。
- 表格：Table 1 p.6、Table 2/3 p.8、Table 4 p.18、Table 5 p.23、Table 6 p.24、Table 7 p.25、Table 8 p.31，均在 250–300 dpi 渲染页上逐格核对；Table 5/6 的 Before/After 与 Figure 3/4 的柱内打印标签、Figure 11(a) 的差值三方一致。
- 公式：式 (1)–(3) 在 p.3–p.4 渲染页核对（式 (2) 的元组下标、式 (3) 的分号与 `M_t` 位置）；式 (4)–(6) 为附录计分定义，本笔记未转抄。
- 图：Figure 2（p.4）与 Figure 5（p.9）的裁剪框与成品尺寸已记录；其余图按渲染页看图核对。Figure 5 的逐轮值由 PDF 矢量坐标读出（p.9 面板 (a)：横轴每轮 17.48 pt、每两轮一个 tick（间距 34.97 pt），圆形 marker 只画在偶数轮，奇数轮取路径顶点；纵轴网格线 y=215.49↔16、197.24↔18、178.98↔20，即 18.25 pt / 2 分）。Full SIM 各轮顶点 y 为 r0 195.59、r1–r3 178.98、r4 184.55、r5 167.94、r6–r7 156.90、r8 140.29、r9–r10 134.73，对应 18.18、20.00、19.39、21.21、22.42、24.24、24.85。未做位图像素颜色测量。
- 否定性断言检索词：为确认未定义字段，检索 `backfill`（全文仅 D.3 schema 一处）；`sample` 作为字段只出现在 schema 与 P5/P8 的 5 条示例记录（取值 `s1`–`s4`），正文没有定义其含义。为确认无代码/项目页，检索 `github`、`code available`、`open-source`：正文无命中，全文唯一命中是参考文献里 Harvey LAB 的 `https://github.com/harveyai/harvey-labs/tree/v1.0`（PDF 折行成 `https://github.c` + `om/...`）。
- 环境备忘：本次 `/tmp` 为 3.8 GB tmpfs，先前的 HTML/PDF 下载曾因空间不足被截断（HTML 只到 602,112 B、PDF 只到 221,184 B）；改在 `~/tmp/sim` 重下后得到完整的 707,675 B HTML 与 525,024 B PDF。复核时先比 `Content-Length`/`size_download`，再比 sha256。
