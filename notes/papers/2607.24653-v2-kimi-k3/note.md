# Kimi K3: Open Frontier Intelligence

## 来源信息

| 项 | 内容 |
| --- | --- |
| 标题 | Kimi K3: Open Frontier Intelligence（p1 页眉为 Technical Report of Kimi K3，其余页为 Technical Report） |
| 作者 | Kimi Team（arXiv 提交人 Yulun Du；附录 A 按姓氏字母序给出全体名单，PDF 元数据共 402 个署名条目，含团队名本身，即 401 位个人作者；论文未标 ∗ 共同一作或 † 通讯作者——∗ 只作附录数学式里的上标，† 在 Table 2 脚注另有他用，都不是作者标记） |
| 机构 | Kimi Team（论文无 affiliation 行；首页脚注给出权重地址 `huggingface.co/moonshotai/Kimi-K3`） |
| 来源 | [arXiv:2607.24653v2](https://arxiv.org/abs/2607.24653v2)（cs.CL；cs.LG），v2 日期 2026-08-07 |
| 许可 | arXiv 页面标注 CC BY-NC-ND 4.0（版面内图片按引用使用） |
| 版本历史 | v1 2026-07-27 → v2 2026-08-07（本笔记基于 v2，为阅读时最新版；论文未说明 v2 的改动内容） |
| 阅读日期 | 2026-11-05 |
| 阅读范围 | v2 全文 47 页：正文 §1–8（p2–34）、附录 A–F（p41–47），含图 1–16、表 1–5、算法 1；参考资料 p35–40 未逐条阅读 |
| 核对凭据 | 本次抓取的 PDF 共 47 页、sha256 `1a21e4d15de52eb0d4cf09cdbffc6248c497ba6897572cc5574af237c13da51d`（2026-11-05）。表 1 用 p11 渲染页（裁剪 70–540 × 305–582 pt，250 dpi）逐行核对；表 2 用 p27 渲染页（150–250 pt 与 575–690 pt 两段，300 dpi）核对列序与斜杠双值；表 2 的加粗另用 `page.get_text('dict')` 的 `NimbusRomNo9L-Medi` span 逐格核对（Math-Vision 与 ZeroBench 两行原文按单个数值分别加粗）。Figure 2 由 p3 渲染页裁剪（70.5–541.5 × 43.0–437.5 pt，300 dpi，1964×1644 px），裁剪后按元素清单逐项确认在框内：Output、Shared/Routed Expert 图例、专家编号 1–N、Router/Linear/Norm、KDA 的 q/k/v/α/β/σ 与 L2/Conv/Linear、3×/1×、Stable LatentMoE/Gated MLA/KDA、Block n−1/n−2、Embedding、MLP、MoonViT-V2、输入格 |
| 归档说明 | arXiv 来源，按仓库策略不归档 PDF；仓库清单编号 00225（上游 `paper-is-all-you-need` 归档最大号为 00191，本仓库 README 最大号为 00224，故顺延取 00225） |

---

## 复核记录

**2026-11-06（第 1 轮，依 check-paper-note）**：基准为 arXiv:2607.24653v2，重新下载的 PDF sha256 与首读记录一致（`1a21e4d1…3da51d`，47 页），arXiv abs 页确认 v2 仍为最新（无 v3）。核对方式：A–H 全项；Table 1/2 用渲染页（p11 250 dpi、p27 300 dpi）加 `get_text('dict')` 的粗体 span（`NimbusRomNo9L-Medi`）；7 个公式对 250 dpi 渲染页；否定性断言的检索词为 `needle`/`NIAH`/`RULER`/`haystack`、`tokens`/`GPU`/`H800`/`H100`/`cluster`、`K2.5`/`K2.6`、`ablation`、`Corresponding`/`equal contribution`；另派独立子 agent 审计（只报告），其结论逐条回原文复验后采纳。

修正：

- Table 3 的反例计数 4 处 → **5 处（6 格）**：补 KWV Bench（GPT-5.5 65.8 > 64.7）与 Agent Behavior Bench 的 Opus 65.7。
- GDPval-AA v2「不到 50 Elo」→「50 Elo」（原文 "within 50 Elo"，1736−1686=50）。
- 有界衰减的取舍方向写反：被截断的是**快速遗忘端**（α > e^−5），不是长期记忆端。
- 「三个修补带来次生问题」改为「LatentMoE + 极端稀疏放大两个失效模式，用三个组件处理」。
- 摘要与 §1 的引文分开（摘要 "outperforms"、§1 "consistently ahead of"）。
- BabyVision 的归属从 §6.1.4 改为 Table 2；§6.2.1 只用于内部基准。
- MiniTriton 从「无对照」移出（它有 roofline 与 PyTorch loss 对照）；「四个 GitHub 仓库」→ 五个（FlashKDA 在参考文献 [14]）。
- 预训练算力表述与 §5.3.1（RL 几百张 GPU）、H20/H100/Hopper 的实际用途对齐；删除未经本次核实的「K2 报告 15T token」对比。
- 「开源权重默认 4bit」改为「部署默认 4bit，发布格式论文未明说（本笔记推断）」。
- Table 1 补「原文 22 行、省略 Architecture 行、合并 4 行 ViT」的节选说明；Figure 2 图注的括号对象改为 `3×(KDA+LatentMoE) + 1×(Gated MLA+LatentMoE)`。
- 补齐：GPT-5.6 Sol 的潜在 cyber guard、Table 3 的拒答/降级脚注、MCP-Atlas/AutomationBench 子集与视觉重复次数、OfficeQA Pro 图片化、FrontierSWE 重算日期、ALE 的 † 说明。
- 文字修正：直方图段「分子 r_ij」→「所需偏置 r_ij」；Coding Experience 的 0.1/0.6 分对比写清。

未修 / 未核：Hugging Face 权重页仍不可达（curl 000），发布权重的格式与许可未验证；论文未说明 v1→v2 的改动，本次也未下载 v1 比对（不换基准）；「2.5×」图有曲线与数据点但纵轴无刻度值，无法精确复算。

**2026-11-06（第 2 轮）**：基准同上（重新下载的 sha256 仍为 `1a21e4d1…3da51d`，v2 仍为最新版）。本轮以措辞与口径为重点，重查 Table 2 的 bold/underline 规则（全 44 行）、Table 3 的 a–g 脚注、Table 4 的四行复算、Figure 7 的数据点、§6.1.2 的全局 effort、Table 4 的 harness、WorldVQA 的 ForceAnswer 口径、Figure 13a/14 的面板与图例；第一轮的 Table 1/2 数值、五处反例、GDPval 50 Elo、α 方向、五仓库映射做了抽查。Figure 7 在 p11 以 350 dpi 裁剪确认星形数据点；Table 3/4 回 p29 渲染页核对。修正：

- Figure 7 并非「只有拟合曲线」：图中两条虚线旁有星形数据点。三处措辞改为「有曲线与数据点，但纵轴无刻度值、未给拟合参数/置信区间」。
- 「评测在 H20 上」过宽：只有 SWE-Marathon 与 PostTrainBench 用 H20（后者官方设定为 H100），其余评测未说明硬件。
- QB 直方图的通信漏了「每层」：原文是 per layer per step 一次 nB 整数 all-reduce。
- 「56 段素材剪成架构讲解视频」张冠李戴：56 段素材对应 teaser 视频，架构讲解动画是另一项。
- 沙箱口径改为「秒级创建数万个（累计 5100 万）」，原文的 tens of thousands 是创建速率，不是「几十万次」。
- 安全节的引文归位：「we will revisit them at each major model update」指重访评测结论，不是发布策略。
- 「1M 上下文没有检索式评测」与 BabyVision 从「作者明确承认」移到「本笔记判断」，并写明检索词与读数来源。
- 补：其余基线模型均 max effort、仅 GPT-5.5 xhigh；Table 2 的下划线（第二名）未复制、个别单元格只有一侧加粗；Table 3 的 b/c/g 脚注；Table 4 两者同用 Claude Code；WorldVQA 为 ForceAnswer；Harvey 为 criterion pass rate；ALE 为 primary pass-rate；其余基准未给重复次数。
- 小修：α > e^−5（原文严格大于）；Kimi K2.5 关系条目改链本地笔记；Figure 13a 不含 GPT-5.6 Sol、Figure 14 不含 Opus 的图例范围写清；工程视角加「本笔记外推」的声明。

---

## 核心结论

一句话：**K3 把「开源模型的规模上限」从 1T 级推到 2.78T 总参数 / 104.2B 激活，并用三条不同方向的「信息流」改造（序列方向 KDA+MLA 混合注意力、深度方向 Attention Residuals、宽度方向 896 专家的 Stable LatentMoE），配合数据与训练配方换到约 2.5× 的 scaling 效率，再配上百万 token 的 agentic RL 与一套为 3T 级 + 1M 上下文重做的基础设施。**

- **规模与效率**（§1–§3，Table 1，Figure 7）：2.78T 总参数、104.2B 激活、896 路由专家中每 token 激活 16 个（稀疏度 56）、93 层、96 个注意力头、160K 词表、原生视觉（401M 的 MoonViT-V2）、上下文 1M。相对 K2：总参数 +167%、激活参数 +220%、层数 +52%、路由专家 +133%。作者用重新拟合的 scaling law 声称**整体 scaling 效率约 2.5×**（Figure 7 给了两条拟合曲线与沿线数据点，但纵轴无刻度值、未给拟合参数，也没有分项消融）。
- **架构**（§2）：每 4 层一组 = 3 层 Kimi Delta Attention（KDA，线性注意力）+ 1 层 Gated MLA（全局注意力），末尾再补一层 MLA，最终 69 KDA + 24 MLA；MLA 全部用 NoPE，由 KDA 的衰减门提供位置/近因信息，因此扩到 1M **不需要改 RoPE base 或上 YaRN**。深度方向用 Attention Residuals（AttnRes）让每层对「嵌入 + 所有前序层/块」做注意力；宽度方向用 LatentMoE（潜空间宽 3584 = 0.5× hidden），并用 RMSNorm、SiTU-GLU、Quantile Balancing 三个修补压住极端稀疏下的激活爆炸与负载失衡。
- **训练**（§3–§4）：数据沿用 K2/K2.5 管线；预训练 8K→64K，cooldown 阶段 256K→1M（四段课程）；余弦退火优于 WSD（各自独立调参后比较）。后训练是「SFT → 3 领域 × 3 推理档（low/high/max）= 9 个专家 RL → 多教师 on-policy 蒸馏（MOPD）合并」；从 SFT 起就做 QAT（专家权重 MXFP4 / 激活 MXFP8），并把预训练的 MTP 层微调成 EAGLE-3 草稿模型。
- **基础设施**（§5）：FlashKDA 核 + 设备内 CP 规划器 + KDA Context Parallelism（KCP，固定大小 all-gather + 前缀扫描，线性扩展）；MoonEP 用「每 rank 至多 E/R 个冗余专家」证明可做到**完美负载均衡**且计算形状静态化（消掉逐层 host 同步）；1M agentic RL 用部分 rollout + 外部 KV 池 + microVM 沙箱（AgentENV）；服务侧把 KDA 循环状态与 MLA KV 塞进同一个分页池，把前缀复用粒度从 6144 token 的物理块降到 512 token 的哈希块（物理块仍是粗分配单位）。
- **结果**（§6，Table 2）：在论文自己的 30+ 基准套件里，K3 总体落后 Claude Fable 5 与 GPT-5.6 Sol，**领先 Claude Opus 4.8 / GPT-5.5 / GLM-5.2 的多数条目**（但有反例，见「原文自身的表述张力」）。Code/agent 侧最强的几项：SWE-Marathon 42.0（比 Fable 5 高 7 点）、ProgramBench 77.8（全表第一）、BrowseComp 91.2、MCPMark-Verified 94.5、AutomationBench 30.8；弱项集中在研究级推理（HLE-Full 43.5/56.0、CritPt 23.4）、知识工作 Elo（GDPval-AA v2 1686 第三）与部分 computer-use（OSWorld 2.0 58.3）。
- **成本**（§6.4，Figure 13）：BrowseComp 上 91.2 分对应 **2.03 美元/任务**，约为 GPT-5.6 Sol 的一半、Claude 系最大 effort 的十分之一量级；四个套件上 K3 都落在「分数-成本」前沿附近。注意 KCB 2.0 的成本对比里 K3 跑在 Kimi Code harness、对手跑在 Claude Code（见「表述张力」）。
- **适合谁**：需要开源权重 + 长程 agent/coding + 百万上下文的团队。不适合把「全面超过闭源前沿」当作选型依据——论文自己承认研究级推理与知识工作仍有明确差距。

---

## 问题与动机

### 开源生态只在「第二条轴」上进步（§1）

作者把 LLM 的 scaling 拆成两条轴：部署前的预训练规模，和部署时的 test-time compute（长思维链、推理档位、工具调用、并行 agent）。过去两年开源在第二条轴上进展很快（R1、K1.5、K2.5 Agent Swarm），但**预训练规模大多停在 1T 级或略高**。当推理/agentic RL 方法被套到体量相近的底座上时，开源之间的差距会收敛，而**与最强闭源系统的差距有拉大的风险**（原文用 "risks converging while the gap … widens"）。K3 的定位就是把两条轴同时推到前沿：底座进 3T 级，RL 与推理档位在 1M 上下文上做。

### 三条「信息流」瓶颈（§2）

论文把架构设计统一叙述为「沿三个维度扩展信息流」，每一维都对应一个具体瓶颈：

- **序列维度**：全注意力在 1M 上下文下 KV cache 与计算都不可承受；纯 KDA 效率高但只有固定大小的状态，缺少全注意力的选择性高容量交互（原文对混合设计的说法是「retaining selective high-capacity attention」）。→ 3:1 混合。
- **深度维度**：标准残差把所有历史压缩进一个状态 h_l，相当于「深度上的 RNN 瓶颈」，层数加到 93 后前层信息只能逐层衰减传递。→ 用注意力机制跨层取数（AttnRes）。
- **宽度维度**：常规 MoE 每个被选专家都要吃满 d 维表示，专家池一大，通信与权重流量随路由重数增长；而专家池不够大时专业化空间不足。→ LatentMoE 把路由专家放进窄潜空间，从而承受 896 专家 / 16 激活。

LatentMoE 与极端稀疏放大了原设计的两个失效模式，论文用三个组件处理：①潜空间链式矩阵乘（W↓ → 专家 FFN → W↑）条件数差导致激活爆炸（→ W↑ 前加 RMSNorm、并把 SwiGLU 换成有界激活 SiTU-GLU）；②近千专家的负载均衡超出 sign-based 无辅助损失更新的适用区间、收敛慢易震荡（→ Quantile Balancing）。

### 后训练与系统必须一起改（§1、§4、§5）

1M 上下文的 agentic RL 不是「把序列拉长」：单条轨迹跨多个训练迭代（部分 rollout）带来严重的数据陈旧；沙箱要在秒级创建数万个（全程累计 5100 万个）、单次可能上千次工具调用；线上服务又要同时管理两种生命周期完全不同的缓存（KDA 固定状态 vs MLA 逐 token KV）。论文因此把基础设施与算法放在同一篇里讲，这也是这份报告比一般模型卡更有信息量的部分。

---

## 方法与贡献

### 1. 架构总览（§2，Table 1，Figure 2）

![Figure 2：Kimi K3 架构](assets/fig2-architecture.png)

*Figure 2（arXiv:2607.24653v2，CC BY-NC-ND 4.0，由 p3 渲染页裁剪）：右侧为主干——每个 block = 3×(KDA + Stable LatentMoE) + 1×(Gated MLA + Stable LatentMoE)；左侧上为 Stable LatentMoE（2 个全宽共享专家 + N 个潜空间路由专家，Router 打分），左侧下为 KDA 模块（q/k 经 ShortConv+Swish+L2Norm，v 经 ShortConv+Swish，α/β 为门控），右下为原生视觉通路（MoonViT-V2 → MLP → 与文本共享 embedding）。图中 w/α 表示 AttnRes 的伪查询与跨层注意力权重。*

Table 1 是全文信息密度最高的一张表（K2 → K3；原文共 22 行，这里省略 `Architecture: MoE / MoE / –` 一行、把 4 行 ViT 参数合并为一行，其余逐行照抄）：

| 项 | Kimi K2 | Kimi K3 | 变化 |
| --- | --- | --- | --- |
| #Layers | 61 | 93 | ↑52% |
| Total Parameters | 1.04T | 2.78T | ↑167% |
| Activated Parameters | 32.6B | 104.2B | ↑220% |
| Hidden Dimension | 7,168 | 7,168 | = |
| Latent MoE Dimension | — | 3584（0.5×） | — |
| MoE Hidden Dimension per Expert | 2,048 | 3,072 | ↑50% |
| Routed Experts | 384 | 896 | ↑133% |
| Experts Active per Token | 8 | 16 | ↑100% |
| Shared Experts | 1 | 2 | ↑100% |
| Attention Heads | 64 | 96 | ↑50% |
| Number of Dense Layers | 1 | 1 | = |
| Vocabulary Size | 160K | 160K | = |
| Training Context Length | 128K | 1M | 8× |
| Attention Mechanism | MLA | Hybrid KDA–MLA | — |
| Activation Function | SwiGLU | SiTU-GLU | — |
| Attention-Layer Composition | 61 MLA | 69 KDA + 24 MLA | — |
| Number of MTP Layers | 1 | 1 | = |
| ViT（参数 / 层数 / patch / 头数） | — | 401M / 27 / 14 / 12 | — |

几点读表要点：hidden 仍是 7168，说明「宽度」没靠加 hidden，而是靠**加专家数 + 把专家放进 3584 的潜空间**；激活参数涨到 3.2×，但每 token 参与的专家数只翻倍、单专家宽度只涨 1.5×，差额来自层数与共享专家；93 层 = 23 个（3 KDA + 1 MLA）块 + 末尾 1 层 MLA（保证最后一层一定是全局注意力）。

### 2. 混合注意力：KDA + Gated MLA（§2.1）

**KDA 的递推**（Eq. 1）：在 delta-rule 上再加通道级遗忘门。

```math
S_t = \left(I-\beta_t k_t k_t^{\top}\right)\operatorname{Diag}(\alpha_t)S_{t-1}+\beta_t k_t v_t^{\top},
\qquad \tilde{o}_t = S_t^{\top} q_t
```

读法：状态 S 先按通道乘一个遗忘系数 α_t，再减去「沿当前 key 方向的分量」（delta rule 的写入修正），最后写入 β_t·k_t·v_tᵀ；输出是状态对 query 的投影。α 是逐通道的（d_k 维），β 是标量式的写入强度。

**分块并行形式**（Eq. 4）：块内用 UT 变换把递推变成两个矩阵乘——一个带前序块状态 S[t] 的「inter-chunk」项，一个块内因果注意力的「intra-chunk」项。工程上的麻烦在块内对角线 tile：Kimi Linear 时代要逐位置对计算，无法用 Tensor Core。

**下界衰减**（K3 的第一个改动，Eq. 5）：把 log-decay 从无界负 Softplus 换成有界缩放 sigmoid。

```math
g_t^{h}=g_{\min}\operatorname{Sigmoid}\!\left(e^{A^{h}}z_t^{h}\right)\in(g_{\min},0)^{d_k},
\qquad \alpha_t^{h}=\exp(g_t^{h})\in(e^{g_{\min}},1)^{d_k}
```

读法：z 是低秩投影出来的逐通道 decay logit，A 是 per-head 可学 log-scale，g_min=−5 是常数下界。于是每个 α 都大于 e^−5≈6.7×10⁻³，16-token tile 的累计 log-decay 落在 (−80,0)，倒数缩放因子小于 e^80，**留在 BF16 动态范围内**——这正是让对角线 tile 也能用稠密 Tensor Core 矩阵乘、彻底去掉「逐位置对」路径的原因（Figure 3）。代价是单步遗忘率有下界：α > e^−5（严格大于），模型无法表达「一步几乎清空状态」的近完全遗忘（α→1 的长期记忆端不受限）；论文没有量化这一取舍。

**全秩输出门**：KDA 输出先做 head-wise RMSNorm，再乘输入相关的全秩门（Eq. 6）；Gated MLA 同样加了全秩输出门，并在训练时把注意力输出保持在 FP32（修正 flash attention 的偏置舍入误差），代价是输出 tile 的片上占用翻倍，因此重写训练核让它与 KV staging buffer 重叠、而不是与 query tile 重叠。

**Gated MLA + NoPE**：MLA 把 KV 压成低维潜向量 c_t=W_c x_t，只缓存 c_t（K2/K2.5 的老配方）。K3 的关键变化是**所有 MLA 层改用 NoPE**：不给 query/key 加任何显式位置编码，位置与近因信息由中间的 KDA 层提供，MLA 只负责无限制的全局内容交互。好处很直接——扩上下文时不用重调 RoPE base、不用 YaRN；这也解释了 §3.4 里「直接外推到 1M」的说法。

### 3. Attention Residuals：把注意力搬到深度方向（§2.2）

标准残差 h_l = h_{l−1} + f(h_{l−1}) 把所有历史压进单一状态。AttnRes 让第 l 层用一组**可学的伪查询** q_l=w_l 对所有前序表示做 softmax 注意力：

```math
\alpha_{i\to l}=\frac{\phi(q_l,k_i)}{\sum_{j=0}^{l-1}\phi(q_l,k_j)},
\qquad h_l=\sum_{i=0}^{l-1}\alpha_{i\to l}\,v_i,
\qquad \phi(q,k)=\exp\!\left(q^{\top}\operatorname{RMSNorm}(k)\right)
```

读法：key 与 value 都取各层输出（第 0 个是 token embedding），权重由伪查询与 RMSNorm 后的 key 的内积决定；RMSNorm 是为了防止输出幅值大的层垄断权重。全量形式是 O(L²d) 算术——L<100 时可承受——但 O(Ld) 的激活驻留（流水线并行下还有跨 stage 通信）才是实际瓶颈。

因此实际用 **Block AttnRes**：把 L 层切成 N=8 块、每块 12 层（最后一块不满），块内输出求和成一个块表示，跨块只对 8 个块表示做注意力（块内第 i 层再把自己的部分和 bi−1 并进去）；加上 embedding 共 9 个来源。显存/通信从 O(Ld) 降到 O(Nd)，推理时块间并行结果可用 online softmax 与块内顺序部分和合并。K3 的层数是 93，所以最后一块是「不满」的（8 块 × 12 = 96 > 93），论文明确写了这一点。

**为什么值得单列**：这是把「Transformer 用注意力替代时间上的循环」这套论证原样搬到深度上，而且是**推理期也保留**的结构（不是训练技巧）。代价是每层多一次跨层读取与一个伪查询参数，服务侧要专门做融合核（§5.4.2）。

### 4. Stable LatentMoE：896 专家下的三个补丁（§2.3）

路由路径：x → z=W↓x ∈ R^ℓ（ℓ=3584）→ 选中的 16 个专家在潜空间计算 → 加权聚合 u → W↑ 映回 d 维；共享专家（N_s=2）走全宽路径。

```math
u=\sum_{i\in\mathcal{T}_k(x)} p_i E_i^{\text{routed}}\left(W_\downarrow x\right),
\qquad y=\sum_{j=1}^{N_s}E_j^{\text{shared}}(x)+W_\uparrow\operatorname{RMSNorm}(u)
```

读法：路由专家只在 ℓ 维里算，聚合后再用 RMSNorm 归一化、最后升维回模型宽度，与两个全宽共享专家的输出相加。RMSNorm 是 K3 相对原版 LatentMoE 的第一个补丁——原版直接把 u 升维，u 的尺度会随「选中了谁、权重多大」漂移，插一个归一化后路由分支对尺度不敏感；作者称它不仅稳训练，还稳定提升验证损失与下游指标（未给消融数字）。

**SiTU-GLU**（Eq. 12）：把 SwiGLU 的两个无界因子都套上平滑上限 β·tanh(·/β)。

```math
\operatorname{SiTU\text{-}GLU}(x)=\left[\beta_1\tanh\!\left(\frac{W_g x}{\beta_1}\right)\odot\operatorname{Sigmoid}(W_g x)\right]\odot\left[\beta_2\tanh\!\left(\frac{W_u x}{\beta_2}\right)\right]
```

读法：门分支保留 sigmoid（负半轴仍趋 0），但把「线性因子」换成受 β1 限制的缩放 tanh；上分支同样受 β2 限制。β1=4、β2=25 时逐坐标有 |输出| ≤ β1β2 = 100（附录 B，Eq. 19），而原点附近 β tanh(z/β)=z+O(z³/β²)，与 SwiGLU 一阶一致、β→∞ 时逐点退化为 SwiGLU。和硬截断的区别是饱和边界外仍有非零梯度。对 2.8T 规模的低精度训练来说，这是「防溢出但别改坏形状」的折中。

**Quantile Balancing**（QB，§2.3.3、附录 C/D）：保留「偏置只进 Top-k 选择、不进混合权重」的无辅助损失框架，但把固定步长的 sign 更新换成**一步到位的分位数解**。

```math
\hat{b}_j^{(t+1)}\leftarrow-\operatorname{quantile}_{1-k/n}\!\left(s_{:,j}-\alpha^{(t)}\right),
\qquad b^{(t+1)}\leftarrow\hat{b}^{(t+1)}-\operatorname{mean}\!\left(\hat{b}^{(t+1)}\right)\mathbf{1}
```

读法：对每个专家 j，取「本 batch 所有 token 上、它相对各自 cutoff 的 margin」的 (1−k/n) 分位数，取负作为新偏置；再减均值（不影响 Top-k，只固定平移）。cutoff α_i 来自 Top-(k+1) 路由的第 k+1 名，因此不用另算 token 侧分位数；更新只在下一步生效（不能用本 batch 自己的偏置路由自己）。

附录 C 把它推成「最大化分数且每个专家恰好服务 mk/n 个 token」的平衡指派 LP，对偶后交替做精确坐标最小化，两侧解都是同一个 (1−k/n) 分位数（这就是名字的来源）。与 sign 更新的关系写得很清楚：sign 只保留负载误差的方向，QB 直接跳到同一对偶目标的精确坐标最优，所以**没有学习率类超参**、在近千专家时也能几步收敛。与 BIP 的差别是 QB 用等式约束，BIP 的不等式约束会给两侧更新加上 max(0,·) 截断，只能压制过载专家、不能抬升欠载专家，收敛明显更慢。

工程上真正落地的是**直方图估计**（附录 D）：需要统计的量是「所需偏置」r_ij=α_i−s_ij（即「让专家 j 正好落在 token i 的 cutoff 上所需的偏置」）的取值范围被 sigmoid 值域与当前偏置夹住，必在 [b_min−1, b_max+1]；每个 rank 本地 scatter-add 进 n×B 的计数矩阵，每层、每个 step 只做一次 nB 个整数的 all-reduce，再从合并计数里取分位并线性插值。B=1000 时误差不超过 bin 宽（约 10⁻³ 量级），通信量只有「每 micro-batch 交换原始 margin」的 1% 以下；而且计数可加，所以估的是**全局 batch 的分位数**，不是各 rank 分位数的平均。

### 5. 原生视觉与 Per-Head Muon（§2.4、§2.5）

- **MoonViT-V2 从零训练**（相对 K2.5 的最大改动）：K2.5 用 SigLIP 对比预训练权重初始化视觉塔，K3 改成**纯 next-token prediction 从零训练**。理由不是效果而是稳定性：接上预训练编码器后联合优化不稳，SigLIP 初始化的 MoonViT-3D 梯度范数持续更高、频繁尖峰，从零训练的 MoonViT-V2 全程平稳（Figure 6）。作者称视觉评测上与 SigLIP 初始化基线打平，并据此认为「大规模多模态 LM 不需要对比预训练做初始化」。
- **视觉通路**：27 层、约 0.4B 参数、RMSNorm、线性与注意力投影全部去 bias；图像与视频**完全共享参数**，注意力分解为帧内空间 + 帧间时间，时间维再做池化；进 LLM 前做 2×2 pixel-shuffle（视觉 token 数降 4×），从而在 1M 上下文里装下最大 3584×3584 的输入。
- **Per-Head Muon**：Muon 的 Newton–Schulz 正交化原本作用在整块 Q/K/V 投影矩阵上，等于把所有头当成一个耦合块，梯度和动量尺度大的头会主导共享更新方向。K3 按 head 切分动量矩阵、逐头正交化，既均衡各头更新尺度，也因「瘦长块」让 NS 迭代更便宜。

### 6. 预训练（§3）

- **数据**：Web / Code / Math / Knowledge 四大文本域 + 大规模视觉语料（caption、交错图文、OCR、感知、视频、视觉 coding）。沿用 K2 的 rephrasing 配方（风格/视角多样化提示 + 分块自回归生成 + 对源文档做保真校验）；视觉侧沿用 K2.5 分类法，坐标监督同时给绝对与归一化 [0,1] 两种格式，并**大幅扩增程序化多模态数据**（代码片段配渲染结果，覆盖 SVG、3D 资产、网页、游戏、CAD 图）。
- **Scaling law**：因为架构/数据/训练配方都变了，最优训练区间也变了，所以重新扫 batch size、学习率、tokens-per-parameter、模型形状，在 held-out OOD 验证集上拟合，得出「整体约 2.5× 效率」。
- **学习率调度**：在各自独立调参后比较 cosine 与 WSD，结论是 cosine 的最终 loss 更低。论文特意指出「同一套超参下比较两种调度是不公平的」——因为两者的最优 peak LR / batch size 差别很大。这是个方法论上值得记的点。
- **训练配方**：Per-Head Muon + K2 的 weight clipping + QB 负载均衡；cosine + 1% 线性 warmup，weight decay 0.1；上下文 8K 起，预训练后段扩到 64K。
- **长上下文**（§3.4）：NoPE 让位置信息完全由 KDA 的循环门控隐式携带，所以 1M 不修改任何位置编码参数。数据侧对长文档/长视频做去重（含视频帧的感知哈希）、质量过滤、结构校验，并对稀缺的长样本上采样；更关键的是**合成长上下文**——把多模态文档与子任务打乱拼接，使任务只能靠跨全 1M 的信息才能解，防止注意力退化成局部模式。课程是四段：预训练 8K→64K，cooldown 256K→1M（64K→256K 之间的过渡未描述）。

### 7. 后训练：9 个专家 + 蒸馏回一个模型（§4.1）

- **SFT**：用前代 Kimi 模型合成 agentic 轨迹，再多阶段验证 + 人工在环标注；统一用 XTML（eXtensible Token Markup Language）模板序列化（附录 F：`[open]/[sep]/[close]` 三个特殊 token 替代尖括号，`[end_of_msg]` 作停止符，结构边界都是显式 token，便于约束解码）。
- **RL 的组织方式**：不为单任务训专用模型，而是三大域（general / general agents / coding agents）× 三档推理努力（low / high / max）= **9 个专家**。Figure 8 显示 RL FLOPs 增加时各域分数与平均工具步数同步上升。
- **部分 rollout**（§4.1.2）：每轮采 N 个 prompt × K 条完成；不等全部结束，完成比例达到 λ 就暂停生成、进入策略优化，未完成的轨迹入队、下一轮优先续跑（靠沙箱恢复）。单条长轨迹因此跨多个迭代，数据陈旧严重，靠「per-token 正则把策略更新限制在局部邻域」来容忍极端 off-policy。
- **推理档位 RL**：每个问题有冷启动模型估出的初始预算 b0(x)，总预算超过 τ·b0(x) 的轨迹奖励置 −1（general 任务只算 thinking token，agentic 任务算含工具参数在内的全部输出 token）；先训大 τ 的 max 档，再把 τ 退火出 high/low 档，τ 按域人工在环调整。
- **Agentic GRM**（不可验证任务）：保留 K2.5 的锦标赛式二元比较，但裁判必须走固定协议：读产物 → 生成 rubric → 逐条打分 → 把分数记进 scorepad；并用「输出长度超过 σ·ℓ0 直接判负」抑制靠啰嗦刷分。
- **MOPD**（Eq. 15）：把 9 个专家合并成一个学生，逐 token 的蒸馏奖励是教师/学生 log 概率比，stop-gradient 后裁剪到 ±R_max。

```math
r_{\text{opd}}^{d}(y_t\mid e,x,y_{<t})=\operatorname{clip}\!\left(\operatorname{sg}\!\left(\log\frac{\pi_{\text{teacher}}^{(d,e)}(y_t\mid x,y_{<t})}{\pi_{\theta}(y_t\mid e,x,y_{<t})}\right),-R_{\max},R_{\max}\right)
```

读法：学生自己在当前策略下采样出的 token，用教师对同一 token 的对数概率比作为稠密奖励；裁剪防止个别 token 的优势信号过大。作者试过更细的 top-k 蒸馏目标，收敛速度与最终性能都没看到明显收益。

- **部署感知后训练**（§4.1.4）：专家权重 MXFP4、激活 MXFP8，注意力/潜空间投影/共享专家/路由等非专家模块保持高精度；QAT 覆盖 SFT 与 RL 全程，rollout 与训练用同一量化方案以消除训练-推理失配。草稿模型：把预训练就有的 MTP 层（结构与一个 backbone block 相同）微调成 EAGLE-3 草稿头，目标模型冻结；草稿输入融合第 1、4、最后一个 AttnRes 块的三级特征，投影矩阵初始化为 [0 0 I] 使初始融合结果等于 MTP 预训练时看到的高层特征；训练时展开 7 步，损失直接用**接受率的负对数**（LK loss），而不是 KL 代理——因为容量受限的草稿模型上，最小化 KL 不保证最大化接受率。

### 8. RL 环境与任务合成（§4.2）

- **统一白盒 harness**：把 agent harness 拆成可组合模块（工具接口、system prompt、上下文管理、skills、memory、subagent…），按配置实例化 Kimi Code、Claude Code、Codex、OpenClaw、Hermes 或全新 harness；不同任务组用不同配置训练，避免过拟合单一工具 schema 或上下文管理机制。
- **知识图谱引导的任务合成**：agent 递归扩展一个有向无环概念图（粗→细边，先去重再挂新节点），采样节点组关键词去检索真实材料（论文、博客、代码仓），再按任务类型合成。
- **可验证的 agentic 问题**：多步信息检索（可验证答案）、专业工作（投行/数据分析/法律，几十到几百步产出交付物）、视觉推理（隔离沙箱里写 Python 裁剪/放大/变换图像并读回结果）。
- **Kernel 优化**：从 Flash Linear Attention 等高质量仓库收集单算子到融合大核，覆盖 CUDA / Triton / CuTe DSL / Gluon / ThunderKittens / TileLang 与 BF16/FP8/FP4；正确性超误差阈值直接 0 分，匹配专家实现给 0.5，逼近 roofline 才向 1 涨；另配**作弊检测**（CUDA graph replay、输入缓存、降精度等）。
- **个人助理**：Gmail / Notion / Slack / Canvas 的高保真 mock，跨多个模拟日、几十个相互依赖事件，单条 rollout 可达上千次工具调用、数百万上下文 token。
- **AET**（自主执行任务）：只给初始状态、受约束目标、动作空间、预算与验证接口，不给参考轨迹；奖励由**最终环境状态**的独立验证器判定，而不是模型自报完成。防作弊靠隔离 agent 与验证器、公开验证器（给诊断反馈）+ 隐藏验证器（held-out 场景）配对、限次提交并罚分。
- **Web 开发**：容器沙箱 + 多种 agent scaffold；奖励 = 确定性检查（功能测试、结构/像素相似度）+ 模型评审（看源码或直接操作产物）；构建失败、运行报错或「假装实现」一律 0 分。

### 9. 基础设施：三处系统设计（§5）

**KDA 的系统协同**（§5.1）

- FlashKDA：CUTLASS 实现的分块核，把块内并行计算与跨块状态传播**重叠**起来（朴素实现两阶段交替会让 SM 空转），作为 flash-linear-attention 的后端自动分发。
- 设备内 CP：TP 只切头、不缩短递推，超长 prefill 时每 rank 只有几个头、SM 大量闲置。观察到「每段的状态转移可独立于入态求值、事后再精确合成」，于是用 SM 级 CP 规划器把序列切到单卡内的多个 SM 上并行算段转移再合并——**无跨设备通信**。
- KCP（跨设备）：线性注意力的传统 CP 只把各 rank「从 S=0 起算的本地状态」相加；但 KDA 的 delta rule 会先用 M_t=(I−β_t k_t k_tᵀ)Diag(α_t) 作用在入态上，段的效果依赖入态。KCP 因此把每段效应拆成两个本地可算的量：累计转移 M 和从零起算的状态 S̃，all-gather 后按前缀扫描逐段合成。通信是**固定大小的 all-gather**（不随序列长度增长），计算线性扩展。

**3T 级预训练**（§5.2）

- 并行组合：PP + 虚拟 stage、EP、ZeRO-1、Pipeline ZeRO-2 梯度分片、CP；共享专家在 EP rank 上复制，all-to-all 与计算重叠。
- **MoonEP**：传统 EP 的 token 负载不均导致算力失衡与显存碎片。MoonEP 要求每 rank 恰好收到 S×K 个 token，用「动态冗余专家」补齐；论文证明**每 rank 至多 E/R 个冗余专家**就能保证平衡方案总存在（附录 E 给了上界与紧性构造，紧性约为 ⌈E(R−1)/R²⌉）。规划核在线近似最优（离线用 ILP 做参照），通信上做融合 permute/unpermute + 零拷贝视图（最坏失衡下 DeepEP 需要 S×K×R 的 buffer，MoonEP 只需固定 S×K）；因为形状静态，**消掉了每层 host 与 device 的同步**；再叠一个面向 token 分布的专家 GEMM 调度器，共享专家走独立 stream。
- **显存**：统一激活管理器（重算/量化/offload/远程 offload 都是可组合的存储策略，按 tensor 声明）；MoE 梯度改写（借 SonicMoE 的思路）去掉对 forward output 的依赖；dispatch 的输入不存、反向重算并与 group-GEMM 反向重叠；AttnRes 整体 checkpoint + 基于缓存的流水线通信（只增量传新块）；PP rank 间激活不均时用 Mooncake Transfer Engine 远程 offload；梯度在 DP 维分片后放 CPU，GPU 只留双缓冲；Muon 的正交化需要完整参数矩阵，改用 P2P 只取本地参数分片（避免全量 all-gather）。
- **多模态编码器**：大图沿 patch 维切到多设备、gather-KV 算注意力；再把 CP 组分细，把多张大图分散到子组，避免通信占比随规模上升；ViT 的前向/反向被排进流水线气泡（K2.5 的 DEP 之上进一步拆解）。

**1M agentic RL**（§5.3）

- 共置 RL（co-located，几百张卡内完成 1M 上下文实验）+ 部分 rollout 降尾延迟。
- **外部 KV 池**：解码中的块留 GPU，被逐出的空闲前缀才写回 CPU DRAM，下次复用前预取；KDA 状态与对应 MLA KV 块**同生命周期**一起搬。训练迭代结束后把权重与优化器状态卸到 NVMe，腾出 DRAM 给 KV 池。
- rollout 自动限流：按活跃请求数、排队数、KV 利用率动态调并发。
- 参考模型等「只做前向」的大模型权重放 CPU，参数张量直接复用策略模型的 FP32 梯度缓冲存储（梯度稍后会被覆盖，所以安全），配合 ZeRO-2 只保留两个 VPP chunk 的缓冲做双缓冲预取。
- **AgentENV**（Firecracker microVM，与合作方开发）：增量 checkpoint 133 ms、恢复 49 ms；pause/resume（暂停不占内存 CPU，等待模型推理可占沙箱生命周期的 98%）、fork（原沙箱继续跑，用于无副作用的判分）、snapshot（定期快照做错误恢复）；OverlayBD 镜像 + 自研 ublk 驱动 + 存储层共享 + P2P 传输做到大规模亚秒级启动，copy-on-write 内存 + page cache 优化做到最高 6.5× 内存超分。K3 训练与评测期间共创建 **51,219,741 个沙箱、覆盖 1,505,678 个镜像**。

**在线服务**（§5.4）

- **统一分页池**：MLA KV 随序列长、KDA 状态固定且每请求一份，两者页大小对齐后共用一套分配/引用计数/淘汰；页内按头连续存放，跨节点传输以「单头字节流」为最小单位；prefill/decode 分离且 TP 度不同时在传输路径上重排布。
- **细粒度前缀缓存**（Figure 12）：块哈希匹配要求所有层共享一个块大小，而 KDA 状态快照只负担得起稀疏边界，导致块大小被逼到 1024–6144 token，几乎没法复用。K3 把两种粒度解耦：MLA 侧用 512 token 的细哈希块（物理块仍是粗分配单位），KDA 侧只在 MLA 哈希端点的一个稀疏子集存 checkpoint；查找分两段（先整物理块，再块内哈希端点），命中点是「同时满足两段的最长边界」。例子：前 2800 token 命中时在 B=2560=5×512 处恢复，从 B 继续 prefill，[0,B) 零重算。
- 并发一致性三个坑：命中块在所有 cache group 上先 pin 再分配；拷入私有块在 forward 前于 GPU 上完成，未落地的块不参与匹配；一个 KDA group 的 checkpoint 被逐出就原子地让兄弟 group 失效。做到之后，混合模型的任意共享前缀都能在**任意 512 token 边界**复用。
- 解码核：MTP 投机解码被拒时需要回滚 KDA 状态；不存每步快照（batch 大时状态流量爆炸），而是只缓存投影输入、片上重放已接受 token 的状态（与同期工作 ReplaySSM 独立提出同一思路）。Block AttnRes 在 prefill 用 SP 把一个 all-reduce 拆成 reduce-scatter + all-gather、把块内核算在中间；decode 时块间核走 side stream，块内合并与 RMSNorm 融进前一个 TP all-reduce。LatentMoE 把潜空间降维与 router 融成一个 GEMM、潜权重分片 + multimem store 做 all-gather、decode 用 WarpDecode 式 token-centric 核（每 warp 负责一个输出神经元、再细分 lane team 处理不同专家）。
- 集群调度：1M 上下文下一次命中与一次 miss 差几个数量级，所以**按前缀缓存亲和性路由**（把会话路由到持有其缓存的集群）；用一致性哈希把每个会话绑到「主 + 备」两个集群，主故障时备重新 prefill，且备份分配在集群间均匀分散，单集群故障影响有界。再加**按预算的准入控制**：给不同请求类别各自的资源预算，避免长上下文突发把短请求的 TTFT 拖垮。

---

## 实验与证据

### 评测配置（§6.1.1–6.1.3）

- **基准**：四大轴——Reasoning & Knowledge（GPQA Diamond、CritPt、AA-LCR、HLE-Full）、Coding（DeepSWE、ProgramBench、Terminal-Bench 2.1、FrontierSWE、SWE-Marathon、PostTrainBench、MLS-Bench-Lite、SciCode）、Agentic（BrowseComp、DeepSearchQA、ResearchRubrics、Toolathlon-Verified、MCPMark/Atlas、AutomationBench、JobBench、GDPval-AA v2、AA-Briefcase、ALE、APEX-Agents、OfficeQA Pro、SpreadsheetBench 2、OSWorld 1/2、SaaS-Bench、τ3-Banking、Harvey Lab-AA、CorpFin v2、Finance Agent v2、Legal Research Bench）、Vision（WorldVQA、OmniDocBench、PerceptionBench、Video-MME、MMVU、BabyVision、MMMU-Pro、CharXiv、Math-Vision、ZeroBench）。
- **设置**：K3 全部 max effort、temperature 1.0；其余基线模型也是 max effort，只有 GPT-5.5 用 xhigh。单步任务 top-p 0.95，agentic 任务 top-p 1.0。编码任务在 Kimi Code / Claude Code / Codex 三种 harness 里跑，Terminal-Bench 报**各模型跨 harness 的最好分**；DeepSWE 用 v1.1 任务（另注 mini-SWE-agent harness 下 67.3）；SWE-Marathon 用 2026-07-09 的 H20 校准分支（Docker 镜像、性能门、oracle 按 H20 重校，正确性与反作弊校验未改），且 **Claude Fable 5 有 35% 任务触发 fallback**；PostTrainBench 用官方 Harbor 实现、H20 上三次平均。另注：Claude Fable 5 的结果都含潜在 fallback，GPT-5.6 Sol 都含潜在 cyber guard（Figure 1 注、§6.1.2）。
- **子集与重复次数**：MCP-Atlas 用 500 题公开子集、100 轮上限、Gemini 3.1 Pro 判分；AutomationBench 用 600 题公开子集；OfficeQA Pro 把整个 PDF 语料渲染成图片、不提供机器可读文本；FrontierSWE 的 dominance 分数按 2026-07-16 官方脚本从 raw 分数重算；视觉分数三次平均（ZeroBench 五次），其余基准论文未给重复次数。
- **第三方数字**：GDPval-AA v2、AA-Briefcase、τ3-Banking、Harvey、APEX、SciCode、AA-LCR、CritPt 取自 Artificial Analysis（截至 2026-07-23）；CorpFin v2、Finance Agent v2、Legal Research Bench 取自 Vals AI；ALE 取自官方榜（K3 配 Kimi Code，GPT 系配 Codex，Claude 系与 GLM 配 Claude Code；报的是榜单的 primary pass-rate，其中 Fable 5 条目为 xhigh effort、40% 任务标注降级，见 Table 2 脚注 †）。**这些不是本地复跑**。

### 主结果（Table 2，节选）

下表按原文列序照抄 14 行（完整表 44 行；`—` 表示原文为空）：

| 基准 | Kimi K3 (max) | Claude Fable 5 (max, w/ fallback) | GPT-5.6 Sol (max) | Claude Opus 4.8 (max) | GPT-5.5 (xhigh) | GLM-5.2 (max) |
| --- | :-: | :-: | :-: | :-: | :-: | :-: |
| GPQA Diamond | 93.5 | 92.6 | **94.1** | 91.0 | 93.5 | 91.2 |
| CritPt | 23.4 | 28.6 | **32.3** | 20.9 | 27.1 | 20.9 |
| HLE-Full（无工具 / 有工具） | 43.5 / 56.0 | **53.3 / 63.0** | 44.5 / 58.0 | 49.8 / 57.9 | 41.4 / 52.2 | — |
| DeepSWE | 67.5 | 70.0 | **73.0** | 59.0 | 67.0 | 46.2 |
| Terminal-Bench 2.1 | 88.3 | 88.0 | **88.8** | 84.6 | 83.4 | 82.7 |
| FrontierSWE | 81.2 | **86.6** | 71.3 | 66.7 | 64.9 | 67.3 |
| SWE-Marathon | **42.0** | 35.0 | 39.0 | 40.0 | 14.0 | 13.0 |
| BrowseComp | **91.2** | 88.0 | 90.4 | 84.3 | 84.4 | — |
| GDPval-AA v2（Elo） | 1686 | **1747** | 1736 | 1593 | 1491 | 1510 |
| MCPMark-Verified | **94.5** | 87.4 | 92.9 | 76.4 | 92.9 | — |
| AutomationBench | **30.8** | 29.1 | 29.7 | 27.2 | 22.7 | 12.9 |
| OSWorld 2.0 | 58.3 | **66.1** | 62.6 | 55.7 | 49.5 | — |
| Math-Vision（无 / 有 Python） | 94.3 / 97.8 | 94.8 / **98.6** | **95.8** / 97.8 | 86.7 / 97.1 | 92.2 / 96.8 | — |
| ZeroBench-main pass@5（无 / 有） | **23.0** / 41.0 | **23.0** / **46.0** | 17.0 / 35.0 | 17.0 / 34.0 | 22.0 / 41.0 | — |

（粗体照抄原文；原文对「无工具 / 有工具」两侧分别标最佳，个别单元格只有一侧加粗；下划线（第二名）未复制。）

论文自己的读法（§6.1.4）：GPQA 与前沿持平；**研究级任务仍有差距**（HLE 有/无工具都落后 Fable 与 GPT-5.6，CritPt 落后三家）；编码强在 ProgramBench（第一）、SWE-Marathon（42.0，比 Fable 高 7 点）、FrontierSWE（81.2，第二）；agentic 在 8 个套件上第一（BrowseComp、DeepSearchQA、ResearchRubrics、MCPMark、AutomationBench、SpreadsheetBench 2、τ3-Banking、Harvey——Harvey 报的是 criterion pass rate），Elo 类知识工作第三/第二（GDPval 1686 第三、AA-Briefcase 1548 第二），更难的 computer-use（OSWorld 2.0、SaaS-Bench）由 Fable 5 或 GPT-5.6 领先。视觉侧 OmniDocBench 第一、WorldVQA 第二（ForceAnswer 口径：统一强制回答后的分数）。

一个容易被忽略的口径：**BrowseComp 的 91.2 是在 300K token 触发上下文压缩下得到的**；同段自述「用完整 1M 上下文、不做上下文管理时是 90.4%」。Figure 1 与 Table 2 只呈现 91.2。

### 内部评测（Table 3/4）

- **强项**：Swarm Bench 76.3（GPT-5.6 73.2、Opus 72.6）、Deep Research Bench 90.0（GPT-5.6 85.3、Opus 87.2）、Coding Experience 59.9（Fable 59.8、Opus 58.0、GPT-5.6 在 Codex 下 59.3；前三者同为 Claude Code——领先 Fable 0.1 分、高于 Codex 下 GPT-5.6 0.6 分，0.1 分按本笔记判断不构成实质领先，论文未给置信区间）、CLIF 52.4、KAET 83.5（GPT-5.6 85.4）、Webdev 盲评对 Opus 4.8（两者同用 Claude Code harness）总体 +31.0 个百分点（58.6 胜 / 13.8 平 / 27.6 负，3D/WebGL/Shader 上 +59.1）。
- **弱项**（论文自列）：Agent Behavior Bench 65.0（Fable 75.5、GPT-5.6 76.4、GPT-5.5 70.1）、MIRA 64.1（Fable 72.9）、24/7 ClawBench 48.3（GPT-5.6 52.0、GPT-5.5 48.5）、Agentic Vision 78.3（GPT-5.6 82.9、Opus 82.8）、KWV 64.7（GPT-5.6 66.9）。
- **Kimi Code Bench 2.0**：73.7（Claude Code harness）/ 72.9（Kimi Code harness），Fable 76.9、Opus 71.7、GLM 64.2。
- **表注里的拒答/降级**：Table 3 脚注显示 Fable 5 多行含降级或拒答（a: 13 fallbacks + 1 refusal / 80；d: 2 refused；e: 14 refused；f: 6 refusals / 95）；b/c 是 KCB 2.0 在 Codex 下 GPT-5.6 / GPT-5.5 的拒答（10 / 80、3 / 80），g 是 Faithfulness 的指标定义（1−幻觉率，越高越好）。这些行的差距不能全归能力。

### 安全评测（§6.2.2）

两档：Tier 1 = 在真实代码库里找**未公开**漏洞并给出可复现 PoC；Tier 2 = 端到端利用开发（36 个任务：16 个用户态真实 CVE + 20 个历史内核 CVE 的 QEMU 环境，难度分级逐步开启缓解）。结果：Tier 1 人工复核的发现里约 70% 为真，含 **6 个项目共 16 个此前未知漏洞**（两例在 Linux 内核：一个远端可触发的堆越界写、一个 RDMA 子系统的 Dirty-COW 类本地提权）；Tier 2 解出 **14/36**（38.9%），GLM-5.2 为 8/36（22.2%），其中 10 个来自用户态、内核档两组都未解出四分之三。论文估计整套 36 题需约 540 专家小时。第三方（UK AISI + NIST CAISI）的独立评估给了同向但不同的数字：ExploitBench 32% vs 24%，32 步模拟企业网络 17 步 vs 11 步，但在 41 个任务上任意代码执行成功 0 次。

### 第三方与成本（§6.3、§6.4）

- Artificial Analysis Intelligence Index v4.1 = **57.1，第 4/580**（若把 GPT-5.6 Sol 的各 effort 变体合并则第 3），落后 Fable 5（59.9）与 GPT-5.6 Sol（58.9）。
- Vals AI 指数 74.7，第 2/39（Fable 75.1、GPT-5.6 73.1）。
- WebDev Arena 1678 Elo，**第 1/99**（Fable 1634），作者称是首个登顶该榜的开源模型；Text Arena 1486，第 8/200；Agent Arena 9.1，第 4/37。
- 成本：BrowseComp 91.2 分对应 2.03 美元/任务（约为 GPT-5.6 Sol 的一半）；Kimi Code Bench 2.0 上「落后 Fable 4.0 分、成本 38%」，high 档「以约 1/3 成本追平 Opus 4.8 max 档」；GDPval-AA v2 上距 GPT-5.6 Sol 50 Elo（原文 "within 50 Elo"，1736−1686=50）、成本低 13%，比 Fable 便宜 2.6×；AA-Briefcase 约为 Fable 一半成本。

### 案例（§7）

- **GPU kernel 优化**：24 小时预算，四个核（AttnRes、DeepSeek Sparse Attention、KDA、MLA head dim 512）在 Hopper 与一家非 NVIDIA GPGPU 上做。AttnRes 延迟 283.6 ms → 114.4 ms；DSA 降 55.1%、KDA 降 73.6%；MLA 达到峰值 TFLOPS 的一半以上。作者称与 Fable 5（带 fallback）打平，明显强于 Opus 4.8 / GPT-5.6 Sol / GPT-5.5（Figure 14 只画 AttnRes 上 K3 / Fable / GPT-5.5 / Sol 的轨迹，Opus 的比较来自正文）。
- **编译器**：MiniTriton（Python tile 级前端 + warp 级 MLIR 注解/优化 + PTX codegen + 运行时）；在 L20 上核心基准的几何平均优于 PyTorch eager 与 torch.compile；从零写的 tensor-core matmul 在最大形状上接近 cuBLAS（约 90% 实测机器 roof）；端到端训练一个 GPT，loss 曲线贴合 PyTorch 参考，梯度与 torch autograd 的差异不超过 fp32 舍入（1e−4，对 fp64 参考）。
- **推理芯片**：48 小时自主跑完一个 nano 模型推理芯片原型（同样 hybrid KDA + NoPE-MLA、block size 2 的 AttnRes、sigmoid 路由、INT4 group-128），4 mm² 面积预算内 100 MHz 收敛，RTL 仿真解码 >8,700 token/s，1.46M 标准单元、0.277 MiB SRAM。
- **科研复现 / 知识工作 / 视频**：两小时内复现 I–Love–Q 普适关系（读 20+ 论文、300+ 状态方程、3000+ 行 Python、交互式 dashboard，作者称人类专家需 1–2 周）；用 120+ 轮迭代基于 87 份季报 / 99 份 PDF（1.1 万页+）做 AI ASIC 产业研究站；用 20+ 并发 subagent 分析 GWTC-5 的 391 个引力波事件；另制作了架构讲解动画，并用 56 段素材剪出 teaser 视频。这些是定性案例，无对照、无重复。

### 证据强度与内部一致性检查（本笔记判断，非作者结论）

- **2.5× 不能精确复算**：Figure 7 是两条拟合线、沿线星形数据点与一个「2.5×」水平位移标注；纵轴没有刻度值，也没有给拟合参数或置信区间，更没有分项消融（KDA / AttnRes / LatentMoE / SiTU / QB 各贡献多少）。Table 1 只列结构变化，不能替代归因。
- **视觉编码器「从零更好」的证据是梯度范数**：Figure 6 比较的是训练稳定性（梯度范数更低、尖峰更少），「视觉评测打平」只有一句话、没有表格数字。严格说这只支持「从零不更差且更稳」。
- **SiTU-GLU / RMSNorm 的增益没有数字**：§2.3.1 说 RMSNorm「稳定提升验证损失与下游指标」，§2.3.2 说 SiTU 训练行为更好，均无消融表。
- **QB 的证据是推导 + 定性**：附录 C/D 的推导扎实（且明确给出与 sign 更新、BIP 的关系），但「几步收敛」「无可测残余失衡」是作者陈述，没有收敛曲线。
- **MoE 负载均衡的收益缺少端到端数字**：MoonEP 的「静态形状消掉 host 同步」很有说服力，但论文没给吞吐/利用率对比。
- **跨 harness 混比**：Terminal-Bench 报「各模型跨 harness 最好分」，DeepSWE 的 67.5 未注明 harness（另注 67.3 是 mini-SWE-agent）；KCB 2.0 的成本图（Figure 13a）里 K3 跑 Kimi Code，画面中的对手（GLM-5.2 / Opus 4.8 / Fable 5）跑 Claude Code（GPT-5.6 Sol 不在该面板），另外三个套件的成本则来自公开图表或 Artificial Analysis 的按 token 定价。这些都不是错，但读者不能把差值全归给模型。
- **没有与 K2.5 的同套件对照**：Table 2/3 的基线里没有 Kimi K2.5（Figure 10 只在单个 AET 任务上出现 K2.6），所以「相对上一代提升多少」只能从 scaling 效率曲线间接推断。

---

## 原文自身的表述张力

以下都不是笔误级别的排版问题，而是「结论性强断言与自家表格/设定对不上」，引用时需要限定。

1. **「consistently」与表格反例**。摘要写 K3「consistently outperforms other open and proprietary models evaluated in our suite」，§1 的同义句是「is consistently ahead of the other open and proprietary models evaluated in our suite」；§6.1.4 更具体：「consistently outperforming Claude Opus 4.8, GPT-5.5, and GLM-5.2 across the benchmark suite」。但 Table 2 里 Opus 4.8 与 GPT-5.5 至少在三处更高：HLE-Full（Opus 49.8/57.9 > 43.5/56.0）、CritPt（GPT-5.5 27.1 > 23.4）、OfficeQA Pro（Opus 63.9 > 63.3）。Table 3 还有五处（六格）：Agent Behavior Bench（Opus 65.7 与 GPT-5.5 70.1 都高于 65.0）、KWV Bench（GPT-5.5 65.8 > 64.7）、Agentic Vision Bench（Opus 82.8 > 78.3）、24/7 ClawBench（GPT-5.5 48.5 > 48.3）、Faithfulness（GPT-5.5 86.5 > 85.5）。而 §6.2.1 自己就写了「Kimi K3 trails the leaders mainly on Agent Behavior Bench, MIRA Bench, 24/7 ClawBench 2.0, Agentic Vision Bench, and KWV Bench」——与「consistently」直接冲突。**可复算的口径**：按 Table 2 全表 44 行逐格比较，K3 低于 Opus 4.8 的只有上述 HLE-Full 与 OfficeQA Pro 两项，低于 GPT-5.5 的只有 CritPt 一项（GPQA 与 GPT-5.5 同为 93.5）；Table 3 另有上述五处。所以「consistently」至多对 GLM-5.2 成立，对 Opus 4.8 与 GPT-5.5 应写成「多数基准领先」。

2. **成本对比的分数取值与 harness 不对称**。§6.4 写 K3 在 KCB 2.0 上「4.0 points behind Claude Fable 5 at 38% of its cost」，用的是 72.9（Kimi Code harness）对 76.9（Claude Code harness）；而 Table 3 里 K3 在**同一 Claude Code harness** 下是 73.7，差距应为 3.2 分。成本前沿图因此把 K3 画在一个更低的点上。Figure 1 同样用 72.9 与各家并列，未标 harness 差异。

3. **BrowseComp 的成绩依赖上下文压缩，但只在正文一句里披露**。Table 2/Figure 1 给 91.2，§6.1.3 才说这是 300K 触发压缩的结果，无管理时为 90.4。无管理的 90.4 又恰好与 GPT-5.6 Sol 的 BrowseComp 得分相同，两张表并读时容易混。

4. **「3T-class」与 2.78T**。摘要写 2.8T，§1 写「unprecedented 3T-class parameters」，§5 写「3T-class pre-training」，结论写「world's first open 3T-class model」。2.78T 四舍五入到 2.8T 没问题，称为「3T 级」是口径选择（大概指「万亿级中的三万亿档」）。引用时应写 2.78T，而不是 3T。

5. **安全数字不能跨套件比**。自家 38.9%（36 题自定义套件）与第三方 AISI 的 32%（原文点名 ExploitBench）来自不同任务集，论文分别点名了套件但没有说明两者不可直接相减；把两者当作同一能力的两个估计会误导。

---

## 工程视角

### 可以直接借用的设计

以下是本笔记的工程外推（论文只描述 K3 自身设计，未验证这些方案在其他模型上的效果）：

- **下界衰减换稠密 Tensor Core**：任何用「负 Softplus 参数化衰减」的线性注意力（Mamba-2 系、GDN、Kimi Linear）都可以试这个替换——用固定 g_min 给 log-decay 设下界，使 16-token tile 的累积衰减与倒数缩放留在 BF16 范围内；代价是无法表达 α→0 的近完全遗忘，论文未量化这一取舍。这是一个**数值格式驱动架构选择**的干净例子。
- **KCP 的「累计转移 + 零初态状态」分解**：只对「状态会被 token 相关矩阵左乘」的递推成立（delta rule、部分 gated linear attention）。如果递推只是加法（vanilla linear attention），传统 CP 的求和就够了；判断标准是「段的效应是否依赖入态」。
- **静态形状 = 去掉 host 同步**：MoonEP 的收益不只是负载均衡，而是让每层 GEMM 形状在编译期已知，从而消掉逐层 device→host 同步与 kernel launch 抖动。任何 MoE 训练栈都可以先量一下「每层同步」占了多少 step time。
- **前缀缓存的粒度解耦**：混合注意力模型里，「哈希块」和「分配块」不必同大小；把 KDA checkpoint 放在哈希端点的稀疏子集上，就能让 512 token 级复用与 6144 token 级分配共存。这个思路对任何「有固定大小循环状态 + 逐 token KV」的混合模型（Mamba/SSM + attention）都适用。
- **草稿模型用接受率当损失**：投机解码的草稿头直接优化 LK（负对数接受率），而不是 KL；并复用预训练已有的 MTP 层 + 三级特征融合。工程上比从零训一个 draft 便宜得多。

### 成本与规模

- 论文**没有披露预训练**的 token 总量、集群规模/型号/时长与训练成本，也没有单次推理的 token 消耗；RL 侧只给了「几百张 GPU」（§5.3.1），评测侧 SWE-Marathon 与 PostTrainBench 用 H20（后者官方设定为 H100）、案例用 Hopper，都不等于预训练规模。能拿到的规模数字只有参数/层数/专家数与上下文长度。
- 服务侧的三个数字值得记：典型编码请求 400K 前缀只增量 4K（所以命中与 miss 差几个数量级）；每请求成本跨三个数量级（<2K 到 1M）；沙箱侧 checkpoint/resume 133/49 ms、内存超分 6.5×、累计 5100 万次沙箱创建。
- 量化部署是硬约束：专家权重 MXFP4 + 激活 MXFP8，且从 SFT 起就 QAT，rollout 与训练同方案——部署配置默认就是 4bit 专家权重、不是后处理量化；发布权重的实际存储格式论文未明说（本笔记推断：很可能同为 MXFP4）。

### 失败模式（原文点名的 + 本笔记归纳）

- 原文点名：预训练接 SigLIP 编码器会梯度尖峰（→ 从零训）；LatentMoE 链式矩阵乘会激活爆炸（→ RMSNorm + SiTU）；896 专家下 sign 式均衡会震荡（→ QB）；MTP 投机解码被拒时 KDA 状态无法回滚（→ 重放投影输入）；前缀缓存的部分块共享有三类竞态（→ pin / 延迟可见 / 原子失效）；沙箱在容器方案下出现过内核 panic 与死锁（→ microVM）。
- 本笔记归纳：SiTU 的 100 上限在长尾大激活上会**截断信息**，而论文只报了稳定性收益；AttnRes 的伪查询是每层新参数，层数继续涨时 O(L²d) 虽可算但 O(Nd) 的块表示仍要跨 stage 传；prefix cache 的 512 token 粒度仍意味着「短于 512 的请求完全不复用」。

### 一个最小的 KDA 递推示意（解读，非作者代码）

```python
# 单头、逐 token 形式，对应 Eq.1/Eq.5；真实实现走 chunkwise + FlashKDA
S = zeros(dk, dv)                      # 固定大小循环状态
for t in range(T):
    q, k, v = proj_qkv(x[t])           # ShortConv + Swish (+ L2Norm for q,k)
    g = gmin * sigmoid(exp(A) * z[t])  # gmin=-5，逐通道，值域 (-5, 0)
    alpha = exp(g)                     # ∈ (e^-5, 1)
    beta = sigmoid(W_beta @ x[t])
    S = (I - beta * outer(k, k)) @ (alpha[:, None] * S) + beta * outer(k, v)
    o = S.T @ q                        # head-wise RMSNorm 后过 output gate
```

注意第 5 行：`alpha` 是 (d_k,) 的逐通道向量，乘在 S 的行方向；`(I - βkkᵀ)` 才是 delta rule 的「擦除」。这正是 KCP 需要「累计转移矩阵」的原因——M_t 依赖当前 token，作用在入态上不可交换。

---

## 局限与待确认问题

**作者明确承认的**：

- 总体仍落后 Claude Fable 5 与 GPT-5.6 Sol；研究级推理（HLE、CritPt）、Elo 类知识工作、部分 computer-use 是明确短板（§6.1.4）；内部基准的短板见 §6.2.1。
- 安全评测是「能力下界」，且结论绑定当前模型版本与评测覆盖（§6.2.2）。
- WorldVQA 第二（§6.1.4 的 Vision 段；表格行名是 ForceAnswer 口径，即统一强制回答后的分数）。

**本笔记判断、论文无对应实验**：

- **长上下文评测覆盖有限**：全文检索 `needle`/`NIAH`/`RULER`/`haystack` 均无命中，1M 上下文的评测只有 AA-LCR（74.7）与长程 agent 任务，没有独立的检索式长上下文诊断。
- **BabyVision 只能按表格引用**：Table 2 中 K3 85.7，低于 Fable 5（90.5）与 GPT-5.6 Sol（88.9），但正文没有讨论这一项。
- **逐组件归因缺失**：2.5× 是「架构 + 数据 + 配方」的合计，无法判断 KDA/AttnRes/LatentMoE 各自值多少；这对想复用其中某一项的团队是最关键的信息缺口。
- **数据与算力不透明**：预训练 token 数、数据配比、预训练集群规模、训练时长、成本全部未给；开源的是权重与部分基础设施代码，不是训练过程。
- **64K→256K 的过渡未描述**：课程写「预训练 8K→64K，cooldown 256K→1M」，中间一段是空白。
- **内部基准不可复现**：KCB 2.0、Coding Experience、Swarm、CLIF、KAET、Agentic Vision、KWV、DECK、Faithfulness 等均无公开数据与评分协议；Webdev 盲评只给了胜/平/负比例，没有样本量、评审人数与一致性。
- **定性案例无法复核**：芯片原型、科研复现、视频剪辑是单次展示，无对照、无重复（MiniTriton 虽有 roofline 与 PyTorch loss 对照，但没有第三方独立验证）；「48 小时」「两小时」这类时间口径也未说明是否含人工干预。
- **开源承诺的落地状态本次未验证**：权重地址 `huggingface.co/moonshotai/Kimi-K3` 在本次环境不可达（curl 超时），无法确认实际文件、许可与量化格式；已核实的只有论文给出的五个 GitHub 仓库（2026-11-05 与 11-06 两次查询；FlashKDA 见参考文献 [14]，其余四个在脚注 3–6）：MoonEP（MIT，2026-07-24 创建，2026-10-12 最后 push）、FlashKDA（MIT，2026-04-20 创建）、MiniTriton（Apache-2.0）、nano-kpu（Apache-2.0）、AgentENV（MIT，2026-07-23 创建，2026-11-06 仍有 push）。这些仓库与论文实验的可复现性对应关系未验证。
- **安全披露的边界**：Tier 1 找到 16 个未知漏洞、Tier 2 能完成用户态利用链；论文没有讨论发布这些能力（含权重）的缓解措施、使用条款或分级开放策略，安全节只承诺随模型更新重访这些评测结论（"we will revisit them at each major model update"），发布句只写 release full weights。

---

## 与本仓库其他条目的关系

- **[00132 Kimi Linear](https://arxiv.org/abs/2510.26692)**（本仓库未生成笔记）：K3 的 KDA 直接来自它，混合比例 3:1 也沿用它。K3 的两处实质改动是①把 log-decay 从无界负 Softplus 换成有界缩放 sigmoid（消除对角线 tile 的逐位置对计算），②输出门从低秩换成输入相关全秩。想理解 K3 的注意力，应先读 Kimi Linear 的分块形式与 UT 变换。
- **[00156 Kimi K2.5](../2602.02276-v2-kimi-k2.5/note.md)**（arXiv:2602.02276，本仓库已有笔记）：K3 的视觉通路（MoonViT 系列 + MLP projector、帧内/帧间分解、时间池化）与「按域训专家再合并」的后训练思路都承接 K2.5；最大差别是视觉编码器从 SigLIP 初始化改为从零训练，以及把 9 个专家用 MOPD 合并（K2.5 用的是 PARL 编排 + 冻结 subagent，两者不是同一机制，别混）。
- **[00172 DeepSeek-V4](https://arxiv.org/abs/2606.19348) / [00191 DeepSeek-V4.1-Flash](../deepseek-v4.1-flash/note.md)**（前者本仓库未生成笔记，后者有笔记）：同一问题域（百万 token 上下文 + 大规模 MoE 训练/推理）。K3 走的是「KDA 固定状态 + 稀疏全局层」的混合注意力路线，与 KV cache 压缩路线不同；本笔记未读这两篇的细节，此处只作定位。

---

## 附：一页速查

- **规模**：2.78T 总 / 104.2B 激活 / 93 层 / hidden 7168 / 潜空间 3584 / 专家 896（激活 16，稀疏度 56，共享 2）/ 头 96 / 词表 160K / 上下文 1M / ViT 401M（27 层，patch 14）
- **注意力**：每 block 3 KDA + 1 Gated MLA，末尾补 1 层 MLA（共 69 + 24）；MLA 全 NoPE；KDA 用 g_min=−5 的有界 sigmoid 衰减；训练时注意力输出保 FP32
- **深度**：Block AttnRes，8 个 12 层块（末块不满）+ embedding = 9 个来源；每层一个可学伪查询 w
- **宽度**：Stable LatentMoE = RMSNorm + SiTU-GLU（β1=4, β2=25，输出 ≤100）+ Quantile Balancing（Top-(k+1) cutoff，直方图 B=1000，一步分位解）
- **预训练**：8K→64K；cooldown 256K→1M；cosine（独立调参后优于 WSD）；wd 0.1；1% warmup；Per-Head Muon + weight clipping
- **后训练**：SFT（XTML 模板，QAT 起）→ 3 域 × 3 档 = 9 专家 RL（部分 rollout、预算 τ·b0、GRM 带 rubric 协议）→ MOPD 合并 → MXFP4/MXFP8 部署 + EAGLE-3 草稿头（LK loss，7 步展开）
- **基础设施**：FlashKDA / 设备内 CP / KCP（固定 all-gather + 前缀扫描）/ MoonEP（≤E/R 冗余专家、静态形状、零拷贝）/ 统一激活管理 / 外部 KV 池 / AgentENV（133ms checkpoint，49ms resume，6.5× 超分）/ 统一分页池 + 512 token 前缀缓存 / 一致性哈希双集群 + 预算准入
- **招牌数字**：2.5× scaling 效率；SWE-Marathon 42.0；ProgramBench 77.8；BrowseComp 91.2（2.03 美元/任务）；MCPMark 94.5；AutomationBench 30.8；OmniDocBench 91.1；AA Index 57.1（#4/580）；WebDev Arena 1678（#1/99）；cyber Tier 2 14/36
