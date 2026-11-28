# Cordis — 复核档案

> 本文件是维护性档案，不参与站点构建；读者版正文见同目录 `note.md`。

## 来源与版本

- **标题**：A Programming Paradigm for Spatiotemporal Composability。
- **作者**：Yifan Shi¹²、Wei Zhang¹、Tianyi Cui²（¹ Peking University；² DeepSeek-AI）。p1 只有单位上标，无 ∗/† 标注，也未给通讯作者邮箱。
- **机构**：首页署名顺序为 Peking University 在前、DeepSeek-AI 在后；3 位作者中 **Tianyi Cui 只署 DeepSeek-AI、Wei Zhang 只署 Peking University、第一作者 Yifan Shi 两处兼署**。清单按**团队归属**记 `DeepSeek-AI`（用户 2026-11-15 明确要求；按第一机构本应记 `Peking University`），理由见「机构判断」。
- **来源**：[arXiv:2608.25512v1](https://arxiv.org/abs/2608.25512v1)（Subjects：cs.PL；cs.SE）。v1 提交于 2026-08-26 08:22:19 UTC，截至 2026-11-15 abs 页 submission history 只有 `[v1]`，为当前最新版；**无 arXiv HTML 版**（`/html/2608.25512v1` 返回 404）。
- **许可**：arXiv 默认的 [nonexclusive-distrib/1.0](https://arxiv.org/licenses/nonexclusive-distrib/1.0/)（abs 页 `licenses/` 路径实测指向该协议，**不是** CC）。
- **页数**：92 页（PDF 文件页码与印刷页码一致，p1 为标题页）：§1–§8 正文 p4–83、References p83–92（[1]–[127]）；**无附录**。
- **篇幅构成**：论文 Comments 自报 `92 pages, 1 figure, 2 tables`——实测即 Figure 1（p34）、Table 1（p40）、Table 2（p58）。
- **仓库编号**：00228（本次新增；编号单元格指向 arXiv 官方页，上游归档后再改指 PDF）。
- **归档说明**：arXiv 来源，按仓库策略不归档 PDF；本笔记只记官方链接。
- **配图**：`assets/figure1-lifecycle.png`（p34 渲染页裁剪，300 dpi，含图内四个状态节点与八条边、不含图注）；许可同上，引用请注明出处。

### 补充核验（论文之外，单独标注）

论文没有给代码仓库，但它反复以名字指称 Cordis / Koishi 及其 npm 包（`@cordisjs/group`、`@cordisjs/include`、`@cordisjs/hmr`）。2026-11-15 用 GitHub API 与 npm registry 核到：

- <https://github.com/cordiverse/cordis> 存在，`description` 逐字为 **"Meta-Framework of Spatiotemporal Composability"**（与论文对 Cordis 的定义同词），许可 MIT，创建 2022-05-17、最后 push 2026-11-15，★9,894 / fork 637，顶层为 `packages/` + `vitest`/`yakumo` 等配置。**只核到存在性、许可与顶层结构，未验证它与论文形式模型的对应关系**。
- 该仓库 `homepage` 指向 <https://deepseek-harness.github.io/deepseek-harness/reference/cordis-primer>，页面（2026-11-15 访问）称「Cordis 是 DeepSeek Harness 底层以 vendor 方式引入的插件框架」，并列出 plugin / context / inject / 类型化事件等概念——与论文 §5.1 的 `inject`、`apply(ctx)`、context 作为服务容器一致。这条是**旁证**，不是论文内容。
- npm 上 `cordis` 的 `dist-tags.latest` 是 `4.0.0-rc.13`（共 169 个版本，`time.modified` = 2026-11-12）。论文 §5 描述的是 **Cordis v4**（p69 脚注 4），而 Koishi 线上跑的是 **v3**——所以「v4 已发布为稳定版」不成立，目前是 RC 线。

## 阅读范围与核对手段

- **已获取全文**：`https://arxiv.org/pdf/2608.25512v1` 一次下载即完整——`size_download` 2,284,543 B、退出码 0、文件尾 `%%EOF`、`gs`/pymupdf 均报 92 页，sha256 `390775dbc9debdcf2ed1b076eed013387ca057630be3cb594617b2b742e48cf0`。PDF 元信息：`creator = Typst 0.15.1`、`creationDate = D:20260826130014+08'00'`、标题/作者与 abs 页一致。**未使用** abs 页的 "2,231 KB" 做校验（那是 e-print 源码包大小，与编译出的 PDF 不是同一文件）。临时文件已清理。
- **已通读**：p1–92 全文（含 §4.3 的证明与 §7 相关工作、References 列表）。§4.3 的部分证明按结构与关键步骤读（归纳变量、用到的引理、前提），**未逐行验算**，也未做机器检查。
- **已回渲染页核对**：Definition 8（式 12，p12）、Definition 28（式 29，p21）、Definition 42（式 39，p27）、Definition 48（式 42，p31）、Definition 53（式 48–49，p35）、Theorem 68（式 55，p46）——均 250–600 dpi 局部渲染逐符号比对（含 $\partial$、$\phi$、$\diamond$、$\mathfrak{E}$、$\mathfrak{I}$、$\simeq_{K}$ 等记号；式 55 的上下标在 600 dpi 下确认，见复核记录）。Figure 1（p34）、Table 1（p40，九行五列逐行）、Table 2（p58，30 行逐行）在 200 dpi 渲染页对照。
- **配图**：裁剪框 `(85, 322, 495, 474)`（pt，页面坐标系）、300 dpi，成品 1709×634 px（宽×高）。元素清单逐项点名：四个状态节点 Inactive / Reloading / Active / Unloading、最左侧空节点（表示 fiber 不在 registry 中）、八条边及其标签（O-Insert、O-Remove、L-Begin、L-Finish、L-Divert、L-Leave、L-Unload、Reloading 上的 L-Iter 自环）。边缘检查：裁剪框外无内容被切（图注块 y0≈477.6 pt，框下沿 474 pt；图内 ink bbox 约 y=332.6–467.4）。**已做**与原文同区域重裁的像素差比对：同一裁剪框 300 dpi 重渲染后与 `assets/figure1-lifecycle.png` 逐像素差为 0（`ImageChops.difference` 的 bbox 为 `None`）。
- **仅按正文/图注引用**：全文只有 1 张图、2 张表，无曲线/柱状图，**未做任何像素测量或图中读数**。
- **否定性断言检索词**（PDF 全文，已折叠折行；2026-11-15 复核重跑）：`benchmark` 0、`throughput` 0、`millisecond` 0、`CPU` 0、`wall-clock` 0；`latency` 2 次（均在 §6.2，p71 的负载均衡策略与 p72 的跨进程定性讨论）；`overhead` 5 次（§1.2.3 两处 resource/network overhead、§5.3 的 "without cognitive overhead" 与 "measuring the abstraction's overhead … remains future work"、§6.5 的 cognitive overhead）——**无一处给出实测数字**。`github` 全文 1 次，只出现在参考文献 [86] 的 fp-ts 链接里（p89），即**论文未给出 Cordis 的代码仓库地址**。
- **未做**：未复现任何证明、未运行 Cordis 或 Koishi 代码、未验证 §5 的十个算法与形式模型的逐条对应。

## 复核记录

- **2026-11-15 第一轮**（check-paper-note；基准：重新下载 arXiv v1，sha256 `390775dbc9debdcf2ed1b076eed013387ca057630be3cb594617b2b742e48cf0`、2,284,543 B、92 页，与首读逐字节一致；abs 页仍只有 `[v1]`，`/html/2608.25512v1` 仍 404）。手段：pymupdf 全文抽取（折行折叠后检索）+ 200/250/300/600 dpi 渲染页；逐条核对笔记里出现的全部编号与页码——Definition 39 个不同编号、Theorem 14、Lemma 13、Corollary 1、式 31（含 `25–26` 这类区间记法）、Algorithm 1–10、`Table 1/2`、`Figure 1`；Table 1（p40，九行五列）与 Table 2（p58，30 行）在 200 dpi 渲染页逐行对照；式 (55) 在 600 dpi 下确认 $\gamma$/$\Psi$ 用**上标**；Figure 1 同裁剪框重渲染后与 `assets/figure1-lifecycle.png` 逐像素差为 0；否定性检索词重跑（`benchmark`/`throughput`/`millisecond`/`CPU`/`wall-clock` 0，`latency` 2、`overhead` 5、`github` 1）。另派独立子 agent 只读审计（报告 14 条），逐条回原文复验后采纳并修正。
- **本轮修正 18 处**：① 作者署名统计写错（原写「2 位只署 DeepSeek-AI」，实为 1 位：Tianyi Cui；Wei Zhang 只署 PKU）；②「账本一字不差要求逆是双侧的」错——Thm 15 的条件仍是单侧 $g\circ f = \mathrm{id}_\Gamma$，改为「处处可撤销」；③「全部元理论的前提 = 两类见证」过强，补上无环性/名字有限/$\operatorname{len}(e_n) \le K$/total on provision（两处）；④ Thm 68 补「`[b,u)` 内无 $n$ 实例化的纤维走步」这一读法前提（表格与正文）；⑤「这一条是 Theorem 70 的全部内容」→ 主要由 (2) 与 guard 承担；⑥ 式 (55) 的 $\gamma$/$\Psi$ 指标由下标改为上标，并注明原文证明里用下标（原文自身记法不统一）；⑦ §4.4「自相矛盾」→「开头概括比实际结论宽」（作者紧接着用 `and has to` 收窄）；⑧「组件所需的全部能力」→ 原文限定的 `proxy-mediated capabilities`；⑨ `end-user features` 误译为「终端功能」→「最终用户功能」；⑩ Def 42 补「对调 $i$ 与 $j$ 同样成立」；⑪ §1.2.2 的 `may` 被写成「会」→「可能」；⑫ §3.1.1 的「理由是……」标注为本笔记概括（该理由在 Def 8/Thm 15 展开）；⑬ Thm 73「两个前提」→ 三个；⑭ 核心结论补 resolution coherence 与 terminal recovery；⑮ Table 2 节选标注「共 30 行、摘 14 行、省略 16 行」并列出省略行；⑯ `ContextL / ContextJS` → `ContextL（[95]）`（原文参考文献无 ContextJS）；⑰ 配图补像素差比对（0）与 ink bbox；⑱ 否定性检索词的命中计数改为精确值（初稿只列了部分命中）。
- **改后自检**：`doc_lint.py` 无问题（代码围栏 24 行成对、公式块 12 个）；`github_render_check.py` math 12/12、无残留；`site/build.py` 成功；本地 `check_render.mjs` math 12/12、images 1、brokenImages 0、literalStars 0、TOC 19；式 (55) 在渲染页复核为 $g_{n}^{u}(\gamma^{u}) \simeq _{K} (\Psi^{t_l}\circ \cdots \circ \Psi^{t_1})(\gamma^{b})$。
- **未修**：未逐行重推 §4.3 的证明；未运行代码；GitHub/npm/项目页与仓库其他条目的关系未在本轮复核范围内（首读时另行核验，日期见「补充核验」）。
- **2026-11-15 用户决定**：按团队归属把清单的「论文单位」改为 `DeepSeek-AI`，该行从 `### Peking University` 移到 `### DeepSeek-AI` 末尾（编号 00228 不变）；来源信息表与「机构判断」已同步。
- **2026-11-28 读者版重写**：按 read-paper-blog 的读者版结构，把证明细节、表格细节、§5 实现、§6 讨论、相关工作与本复核记录迁入本文件；`note.md` 正文 299 行、独立公式块 7 个（原 12），`doc_lint.py` 无问题。所有事实、数字与符号仍取自 2026-11-15 版笔记，未新增未核内容。

## 元理论与证明细节（五组结果与各自前提的完整版）

这一节是全篇的技术核心。作者的策略是：先把每一步分解成 $\gamma_{t+1} = edit_{t}(\Psi_{t}(\gamma_{t}))$（式 53）——$\Psi_{t}$ 是状态映射（`id`、一次迭代的前向映射、或 `L-Unload` 的累加器），`edit_t` 是括号里那部分「只写控制字段」的编辑——于是「哪些写属于谁」可以逐字段对账；再把状态关系 $\simeq$（式 54）定义为「registry 上按 Definition 33 的关系 ∧ 域相同 ∧ 每个纤维的 $\theta, \tau, \pi, d, p, e$ 逐个相关」，于是规则只通过它保留的观察来读状态（Lemma 60 的 $\simeq$-不变性）。

| 结果 | 位置 | 前提 | 说了什么 |
| --- | --- | --- | --- |
| Preservation（Thm 64） | p43 | registry 良形（Def 63 四条） | 九条规则都保持四条不变式：父指针落在 registry、提供集两两不交、已安装纤维的 $\omega$ 在其声明上全定义且取值于 registry、$\omega$ 指向的纤维已安装 |
| Recovery exactness（Thm 68） | p46 | episode + pairwise independence（Lemma 66）；且 `[b,u)` 内没有 $n$ 实例化的纤维走步 | 在任意交错之后跑 $n$ 的累加器，等于「把中间别的纤维那些步照做、但 $n$ 从未开始」 |
| Terminal recovery（Cor 69） | p46 | 同上 | 卸载后 $\sigma_{n} = \varnothing$（这正是 `O-Remove` 的前提），且 $\gamma_{u+1} \simeq _{K}$ 那个「没有 $n$」的状态 |
| Ordering（Thm 70） | p47 | —（靠规则与 guard） | ①只在依赖被提供处开始 transition；②提供者的 episode 严格包含消费者的 episode；③消费者活跃期间，键的值只在**声明该键的纤维**的操作下移动 |
| Resolution coherence（Thm 71） | p48 | — | 一次 transition 只对**一份** resolution $\omega$ 跑；若目标中途变了，要么 `L-Finish` 落在 $\mathrm{Active}(- , \omega)$，要么 `L-Divert` 走 `Unloading` 并按 Cor 69 精确恢复 |
| Progress（Thm 73） | p49 | `≺` 无环、$\operatorname{len}(e_n) \le K$、名字集有限 | 无死锁（`¬quiet` 时必有生命周期规则可用）+ 终止：$S(n) \le (K+3)(V(n)+1)$，`V(n)` 与总步数有限 |
| Confluence（Thm 80） | p54 | 每个组件 total on provision（Def 76） | 动态历史无痕：任何到达静息态的序列，都能重排成「按依赖序各加载一次」的规范序列；两条这样的序列在重命名后 $\simeq$ 相等 |

**恢复精确性**（Thm 68）的形式陈述是

```math
g^u_n(\gamma^u) \simeq_K (\Psi^{t_l} \circ \cdots \circ \Psi^{t_1})(\gamma^b)
```

其中 $t_{1} < \cdots < t_{l}$ 是 `[b, u)` 里**作用于 $n$ 以外**纤维的那些步。原文 (55) 里 $\gamma$ 与 $\Psi$ 的指标写成**上标**（$\gamma^{u}$、$\gamma^{b}$、$\Psi^{t_i}$）；同一段的证明里又写成下标（$h(\Psi_u(\gamma_u))$），这是原文自身的记法不统一，语义相同。

读法：在第 $u$ 步跑 $n$ 的累加器，得到的是「那些外来步照做一遍、但 $n$ 从未开始」的表的等价状态——控制字段不在比较范围内。**这个读法有前提**（原文紧接公式后说明）：`[b, u)` 内没有 $n$ 实例化的纤维走步；否则右侧不是「$n$ 从未开始」的状态，因为那样一条纤维本来不会存在、也就不会走那一步。证明是对 $u$ 归纳，每步用两种事实之一：若该步作用于 $n$，用 $\mathfrak{E}^{*}$ 的见证（$h(\Psi_u(\gamma_u)) \simeq_{d_n \cup p_n} \gamma_u$，再由 Lemma 57 升到 $\simeq _{K}$）；若作用于 $m \ne n$，用独立性（Lemma 66）或纠缠情形（Lemma 67）把 $g^{n}_{u}$ 与 $\Psi_{u}$ 交换。

**纠缠（entangled）**是独立性覆盖不到的那类键对：$p_{m} \cap (d_{n} \cup p_{n}) \ne \varnothing$ 或对称。作者说得很坦白：消费者的操作作用在提供者的扩展所装的那个值上，所以在绑定缺席的每个状态上两个顺序都不同——无论按哪个等价读都不同。Definition 65 对这一类仍要求**共享键上的操作交换**（第二分支），而 Lemma 67 补的是交换性也救不了的方向，且分两种情形：(1) 当 $p_{m} \cap (d_{n} \cup p_{n}) \ne \varnothing$（一方提供、另一方声明）时 $\Psi_{t} = \mathrm{id}_\Gamma$——guard 挡住提供者的 `L-Unload`，它在消费者装好期间到不了 `Inactive`，只剩 `L-Leave`/`O-Retire` 这类 $\Psi = \mathrm{id}$ 的步，是**规则**在替代独立性；(2) 另一方向 $p_{n} \cap d_{m} \ne \varnothing$ 时两者在 $\gamma_{t}$ 上交换——靠的是该键的交换性。这是「定理依赖演算而非仅依赖代数」的地方，也是这套框架不能随便换一个运行时还成立的原因。

**排序（Thm 70）**的第二款——提供者的 episode 严格**包含**消费者的 episode——是「依赖者的去激活先完成、提供者才撤」的形式版本；第三款——键的值只在声明它的纤维的操作下移动——是「transition 不跨两份 resolution」的另一半。实现里对应三行（§5.1.3，p63）：`reload` 在第 14 行提交视图、`unload` 在跑完所有逆之后才丢弃它；`refresh` 在第 10 行先把纤维标成 `UNLOADING`（即 `L-Leave`）再创建 transition 任务；`unload` 在第 25 行等所有被通知的依赖者到 `INACTIVE`（即 guard）。

**进展（Thm 73）**的三个前提要看清：`≺` 无环、$\operatorname{len}(e_n) \le K$、名字集有限。`≺` 是「$n$ 可能提供 $m$ 声明的键」（$p_{n} \cap d_{m} \ne \varnothing$），**无环是假设而不是定义给的**——`n ≺ n` 对一个声明自己提供的键的组件成立。作者明确说 `≺` 排的是**激活**而不是生命期：`n ≺ m` 说 $n$ 必须先 `Active` 才能让 $m$ 激活；而「提供者活得比消费者久」是 Thm 70(2)，是带 guard 的演算的定理。终止性证明给的上界 $S(n) \le (K+3)(V(n)+1)$ 里，`V(n)` 是目标视图翻转次数；$V(n) \le 1 + \sum_{m \prec n} S(m)$ 靠无环性做良基递归。名字集有限也是**假设**：宿主持有的组件是运行前给定的有限程序，只要没有组件能（间接地）实例化「自己这个组件的纤维」，实例化就构成有界深度的树，$\operatorname{len}(e_n) \le K$ 再界住分支。

**合流（Thm 80）**的直觉最值得工程读者记住：**动态历史不留痕**。编排者加一个组件、移除它、替换一个提供者、再撤销替换，最终一定到「一开始就把最终组合写下来」的那个状态；组件作者推理「哪些余效应在作用域内」时只需推理静息态。规范形式的存在性靠三步：闭合的 episode 先按 `⊲`-极大消去（Lemma 79）、编排步前移（Lemma 78(2)）、episode 排序并连成块（对 `|A|` 归纳）。前提是 **total on provision**（Definition 76：完成的激活装上了 $p$ 的每个键，于是 `Active` 纤维的 $\operatorname{dom}(\sigma_n)=p_n$）——没有它，support set 只是 `Active` 集合的**过近似**（Lemma 77 才能把两者等同）。作者也点明合流说的是**状态**，不是系统沿途产生的 emission（§6.1 的 acquisition/emission 之分）。

**保持性**的四条不变式（Def 63）与 Table 1 的逐规则对账（Lemma 59，p40–41）：

1. **表只在一个 $\Psi_{t}$ 里动**：$\sigma^{m}_{t+1} \ne \sigma^{m}_{t}$ 只在该步作用于 $m$、或作用于 $n \ne m$ 且 $\operatorname{dom}(\sigma^m)\cap d_n\ne\varnothing$ 时发生，后者只改 $d_{n}$ 那些键上的**值**、不改域。
2. $\omega_{n}$ 只在 `L-Begin(n)` 出现、只在 `L-Unload(n)` 消失，所以**在一个 episode 内恒定**。
3. $\Psi_{t} = g^{n}_{t}$ 只在 `L-Unload(n)`——没有别的规则把累加器应用到状态上。
4. $\neg \mathrm{installed}^{n}_{t} \wedge installed^{n}_{t+1} \Rightarrow step_{t} = L\text{-}\operatorname{Begin}(n)$，反之 `⇒ L-Unload(n)`。
5. $\pi_{n}, d_{n}, p_{n}, e_{n}$ 随条目进入就存在、**再不写**；$\tau_{n}$ 单调，只被 `O-Retire` 写 `⊤`。

第 5 条是后面几个定理的地基：组件的接口（声明、提供、效应函数）在一次存在期内**不可变**，变的只有生命周期与表。

## 实现与案例（Cordis §5、Koishi §5.3）

### 三层与理论对照

Cordis 被定位成**元框架**：不针对具体领域（web 路由、ORM、UI 渲染），只提供通用的动态组合语义。三层是核心库（§5.1，直接实现 effect/coeffect 系统）、组件加载器（§5.2，加声明式配置协调与 HMR）、以及 Koishi 这类应用框架（§5.3）。

Table 2（p58）是理论与实现的对照表，共 **30 行**；下面摘 14 行，**省略 16 行**：$\gamma \in \Gamma$、$\operatorname{dom}(F_\gamma)$、$n : \mathfrak{N}$、$d : \mathfrak{D}_\Gamma$、$p : \mathfrak{P}_\Gamma$、$e : \mathfrak{I}^{d\cup p}_\Gamma$、$\pi : \mathfrak{N}$、derived realization（Def 23）、$\mathrm{effect}_\Gamma(e)$、`get(k), set(k, v)`、`isolate(k, r)`、$\mathrm{intercept}(k,\nu)$、$\mathrm{provider}_k(\gamma)$、`Future`/inertia、`O-Remove`、`failure`（其中 get/set、isolate、intercept 在 §5.1.2 正文已讲，failure 在 §4.4 讲）：

| 理论 | 实现 |
| --- | --- |
| $\Gamma_\infty$ | `ctx`，一等上下文 |
| $\mathfrak{E}_\Gamma, \mathfrak{I}_\Gamma$ | 返回/产出逆的 effect callback |
| $\Sigma, \Sigma_{\mathrm{iso}}, \Sigma_{\mathrm{inter}}$ | `ctx[@@store]`、`ctx[@@isolate]`、`ctx[@@intercept]` |
| $\langle d,p,e,\pi,\sigma,\tau,\theta\rangle$ | `fiber` |
| $\theta$ | `fiber.state`，其中 `LOADING` 对应 `Reloading`、`FAILED` 携带 §4.4 的错误结果 |
| `recover` / 累加器 $g$ | `fiber.dispose` |
| $\omega$ | `fiber.committed` |
| $\mathrm{target}(\gamma,n)$ | `fiber.target`，由 `refresh` 重算，`⊥` 即 `INACTIVE` |
| `O-Insert` / `O-Retire` | `ctx.use` 及其回调的逆 |
| `L-Begin/L-Iter/L-Finish` | `execute` 的迭代循环（Algorithm 1） |
| `L-Divert` | 迭代边界上 guard 失败，或 reload 链到 unload |
| `L-Leave` | `refresh` 把纤维标 `UNLOADING`（第 10 行） |
| `L-Unload` | `unload` 及其惯性链 |
| guard on `L-Unload` | `unload` 等待被通知的依赖者（第 25 行） |

### ctx.effect：唯一的变更原语

**所有上下文变更都走 `ctx.effect`**——余效应提供、组件实例化、以及任何其它改上下文的操作都归约到它，所以任何经上下文做的操作都自动被追踪、在组件卸载时被撤销。它是 $\mathrm{effectiter}_\Gamma$ 的实现：接收 $\mathfrak{I}_\Gamma$ 的回调，提升成 $\mathfrak{I}_{\partial \Gamma}$，返回一个 `dispose` 闭包。$\mathfrak{E}_\Gamma$ 与 $\mathfrak{I}_\Gamma$ 通过同一个操作接受（ad-hoc 多态），因为普通效应函数是「只产出一个逆」的退化迭代器。

Algorithm 1（p59）的核心是一个 `execute(callback, guard)` 循环：每步 `await iter.next()`，若拿到值就把逆**前插**到累加器（$inverse \leftarrow value \circ inverse$，于是 LIFO），每步之前查 `guard()`；guard 一旦跳闸就停止迭代、只保留已累积的逆。`ctx.effect` 是它的薄包装，加两件事：

1. **自撤销**：guard 读 `armed` 标志，返回的 `dispose` 把它翻成 `false`，同时**中止在飞的迭代**并让恢复**至多发生一次**。作者给了理由：跑两次会把逆应用到一个「没有任何应用产生过」的状态上，那里没有任何东西保证它能撤销什么。
2. **父级复合**：`dispose` 被前插到外层上下文的 `ctx.dispose` 上，于是子效应的逆本身是父上下文上的一个效应——这正是 $\partial^2\Gamma$ 的递归结构。

组件层复用同一个 `execute`，只把 guard 换成「`fiber.target` 是否稳定」。

**作者自己声明的实现缺口**（§5.1.1，p59）：`ctx.effect` **不检查 $\mathfrak{E}^{*}_\Gamma$ 的见证**。回调提供逆，而「这个逆确实撤销了这个效应」是**组件作者的义务**，不是运行时验证的性质；Theorem 68 用到它的地方正是这里，§6.1 划定这个义务的边界。余效应的见证（交换性）**同样不检查**。也就是说：**元理论依赖的两类见证，在实现里是两个未强制执行的责任**；除此之外，§4.3.4–§4.3.5 的 `≺` 无环、名字集有限、$\operatorname{len}(e_n) \le K$ 与 total on provision 也同样不由运行时检查。这些合起来决定了「结构保证」这句话能读多重——它不是疏漏，而是论文明确的设计选择。

### 余效应操作与响应式通知

三个符号键槽：`@@store`（$\sigma$：域符号 → 值）、`@@isolate`（$\rho$：键 → 域符号）、`@@intercept`（$\iota$）。`ctx.get(key)` 先读 $\rho(k)$ 再读 $\sigma(\rho(k))$（Algorithm 2）。

`ctx.set(key, value)` 是 `set(k, v)` 的实现：回调把值绑进 $\sigma$ 的 $\rho(k)$ 下，返回的 dispose 删掉它；**装与删都调用 `notify`**（Algorithm 3）。`notify` 遍历 `all_fibers`，对每个声明了变化键、且该键解析到同一域符号的纤维调 `refresh`，并返回被重估的纤维供调用者等待。这就是 Definition 22 的三分类落地：翻转满足性的变化激活或去激活，`refresh` 的幂等性让中性变化无害。

两个实现细节值得注意：

- **可用性按「提供者 Active」判**，而不是只看 store：`refresh` 把每个声明键解析到**活跃**提供者。于是「提供者已进入 `UNLOADING` 就停止提供」让依赖者在撤下**前一步**就看到，从而在它的绑定都还在时开始自己的 teardown。
- `notify` 是**对全部纤维的线性扫描**（Algorithm 3 第 3 行 `for fiber in all_fibers`），没有索引。论文没有给复杂度或实测——这在有数千纤维的宿主里是个真实的成本问题，属于「作者未测量」的范围。

### proxy 访问与 capability

`ctx[key]` 用 TypeScript 的 `Proxy` 的 `get` trap 中介（Algorithm 6，p64）：从访问方上下文沿纤维链**向上**走——第一个 `committed` 视图里绑定了该键的纤维授权并返回该绑定；若走到一个**声明了**该键但还没提交的纤维，说明它没加载，访问失败（$INACTIVE_{\mathrm{ACCESS}}$）；若走到 root 都没声明，按未声明拒绝（$UNDECLARED_{\mathrm{ACCESS}}$）。

这与裸 `ctx.get` 的区别正是**访问控制**：`ctx.get` 是对 store 的查表，返回值或空、从不失败；proxy 则对着访问方自己的视图解析，并在**使用点**强制 $d$。读视图而不是读 store 也是 Thm 70 依赖的东西——它让「因依赖消失而被触发 teardown 的组件」在整个 teardown 期间仍能读到那个依赖。作者还指出：因为 $d$ 是静态声明的，这个违规**原则上可以在编译期**对每个 `ctx[key]` 检查（§6.4 讨论宿主语言怎么承载）。

### 加载器：声明式配置与协调

加载器把「编排者想装什么」变成一份**持久记录**（Definition 81 的 entry：`id`、`url`、`isolate`、`intercept`、`config`、`disabled`），再把记录的变化翻译成纤维操作。entry 能当规格用，是因为**支持集读的正是 entry 记的东西**：`disabled` 给 $\tau$、树里的父给 $\pi$、`url` 选组件从而给 $d$ 与 $p$。

协调按字段分派（§5.2.1，p66）：`id`/`url` 变化 → 重建条目；`isolate` → 重指派域（Algorithm 7）；`intercept` → **原地更新**（元数据在读取时被查，不需要重载）；`config` → 交给组件自己决定（典型是按差异比较、只在实质变化时重载）；`disabled` → 置位时卸载、清除时重载。

四条「为什么增量协调是可靠的」直接对应四条定理：Thm 80 说静息态只由最终配置决定（所以中途怎么做都行）；Thm 73 说系统确实会静息（所以发出装卸就算完成）；Cor 69 说离开的纤维贡献为零（所以重建一个条目只撤它自己装的东西）；Thm 70 说条目可以**一起**实例化、编排者不必安排加载顺序（依赖不满足的纤维在 `L-Begin` 处等，提供者离开时消费者先被去激活）。最后一条有个具体的工程收益：依赖约束的是**纤维何时激活**而不是**模块何时被抓取与求值**，所以加载器可以**并发**取模块——作者说「bring up a large configuration spends its time」正是在这里。

**受管域**（managed realms）是 `isolate` 的加载器版本：`true` 选条目私有、以 `id` 标记、随条目移动的局部域；字符串选全局共享域。重指派域的难点是「一个域符号可能被多条纤维共享，其中只有一条是提供者」，加载器用**定界符**（delimiter）解决：每个键一个符号 $\delta_{k}$，每个上下文在它下面存一个自己的 tag，tag 写在条目上下文上并被后代继承，所以「条目的 tag 与提供者的 tag 相同」恰好等价于「两者在同一个 isolate 作用域内派生」，也就等价于「$k$ 的绑定是条目自己的、要跟着它走」（式 64）。Algorithm 7 据此把绑定从 `s₁` 搬到 `s₂`，并用 `affected` 精确挑出受影响的依赖者。

### HMR：三阶段

§5.2.2（p67–69）把「可逆效应模式」用在模块级：文件变了，就地替换受影响的模块而不重启进程。因为纤维已经界定了组件的全部效应与余效应，**模块只要本身是一个组件，就能纯靠纤维操作替换**——丢掉旧纤维恢复它装的一切，从重载模块实例化新纤维重装。因此它**不需要** Webpack/Vite HMR 那种开发者标注的 acceptance 边界。

三个阶段：**模块分类**（Algorithm 8：以变化文件为种子，从 import 关系求不动点——一个模块只要有一个 import 被接受就被接受，全部 import 被拒就被拒，剩下的（落在 import 环里的）默认拒绝）；**陈旧条目检测**（Algorithm 9：沿每个条目的依赖树走，把 `declined` 当边界，树与 `accepted` 相交则条目陈旧）；**事务式重载**（Algorithm 10：先失效缓存并备份，再对每个陈旧条目 `dispose` 旧纤维、`ctx.use` 新模块；任一 import 失败就恢复缓存、从备份重建所有陈旧条目再抛错）。

事务性是这里唯一有「全或全无」语义的地方，也是整个 §5 里最接近工程实践的一处。

### 案例：Koishi（§5.3）

Koishi 是建在 Cordis 上的开源聊天机器人应用框架：四年开发、**4000+ 社区贡献插件**（IM 适配器、数据库驱动、管理台、最终用户功能——原文 `end-user features`）。作者用它支持两个论点：

- **表达力**：Koishi 的每个功能都是 §5.1 原语之上的插件，Koishi 自己只贡献聊天机器人领域的词汇。而且同一个模型在**完全不同的运行时**里复现——Koishi 的 Web 控制台是第二个独立的 Cordis 应用，它的插件组合的是浏览器与 UI 的原语。所以这套原语足以承载一个完整生产系统，且不预设领域或运行时。
- **时间可组合性无认知负担**：§1.2.1 里那些插件系统不能在不重启宿主的情况下卸载单个扩展；Koishi 经常做这件事——编排者在控制台禁用一个插件，它的效应就地撤销；开发时 HMR 在保存时重新应用被改的插件，同时保留别处的缓存状态与活连接。因为经上下文的效应被自动追踪、逆被自动复合，**即使经验不足的作者也能得到有序清理，而不用写卸载路径**。这正是 §1.2.1 指出缺失的关注点局部性：本来依赖每个作者勤勉的正确性，由抽象一次性承担。
- **空间可组合性跨开放生态**：与 §1.2.1 那些几乎没有插件间依赖的系统相反，Koishi 的生态有真实的依赖拓扑——IM 适配器提供平台访问、数据库驱动提供持久存储、功能插件把这些声明成余效应再访问。运行时重配一个提供者（换存储后端、重连适配器）只重新激活**解析到的依赖变了**的那些依赖者；依赖不可用的插件保持 inactive 直到它出现，不报错。作者强调的是：这种组合**跨独立编写的代码**成立——插件与它的依赖通常由不同作者写、除了连接它们的余效应之外不协调任何东西。

**证据边界**（作者自述，p70）：单一生态、单一宿主语言，所以**无法**把范式的功劳与 TypeScript 实现或 Koishi 特定领域的功劳分开；且是观测性的，不是与替代架构的受控比较。结论是「存在性与采用度」而不是定量的。此外 p69 脚注 4 说明：**Koishi 当前用的是 Cordis v3，本文呈现的是 v4**（核心组合模型两版共享，v4 精化了 effect/coeffect 语义并重设计了加载器）。所以这 4000+ 插件的采用事实，严格说是 **v3 生态**的事实。

## 原文自身的表述张力（整节）

- **「carries … to a whole system」的条件性在摘要层面读不出来。** 摘要与 §1.3 贡献 4 都说元理论把时空可组合性「从单个组件带到整个交错组件的系统」，这在小节层面是真的，但两条全局结果各带实质前提：进展要 `≺` 无环（§4.3.4 明说这是假设而非定义给的），合流要每个组件 total on provision（Def 76）。同时 §4.1 的单源纪律又把「一个组件多次实例化」限制在提供集为空的组件上。这些都是正文写清的限定，但只在摘要读会得到过强的印象。
- **「完整恢复」与 $\simeq$、与边界的关系需要三处合读。** §3.1 的等式是状态相等，§3.3.2 立刻说这是理想化、要模 $\simeq$ 读（堆布局、生成名），§4.3.2 又把结论限定在「表、且在每个键的 $\simeq _{k}$ 之内」，§6.1 再把边界外的 emission 排除。单独引用任何一处都会把「完整」读得过强；作者没有在摘要里做这个限定。
- **§4.4 开头「每个扩展都让 §4.3 的结果保持不变」的覆盖范围过宽。** 原话是四个扩展「each leaving the results of Section 4.3 intact」，但 Failure 段随后说 "Confluence excludes failed fibers, and has to"。作者紧接着用 `and has to` 收窄了，并不是没意识到，所以这不是矛盾而是**开头的概括比实际结论宽**：对 Failure 应读作「其余结果不变、合流需排除失败纤维」。
- **案例的版本口径。** §5.3 用 Koishi 的 4000+ 插件支撑「范式在生产系统里成立」，而 p69 脚注 4 说明 Koishi 用的是 v3、本文是 v4。作者在脚注里交代了（「核心组合模型两版共享」），但正文的论证强度是按「本文这套语义已被 4000+ 插件验证」在读的，实际是 v3 生态的采用事实。
- **「无开发者标注的 acceptance 边界」是比较性断言。** §5.2.2 说 HMR「不需要 Webpack 或 Vite 那种开发者标注的 acceptance 边界」，这个对比成立的前提是「模块本身是组件」；对不是组件的模块（纯数据模块、副作用在模块顶层执行的模块），论文没有说会怎样，只把 `externals`（不能热替换、触发整重启的模块）作为输入交给分类算法。

## 工程实现与外部资料（原「工程视角」）

### 落地路径

1. 先立**唯一变更原语**。所有副作用必须能写成「回调 + 逆」的形式，并由一个 `effect(callback)` 包装前插到父级累加器。这是最不可绕过的一步：只要还有绕过它的写入，`Theorem 68` 的前提就不成立。
2. 把一次加载写成**迭代器**（生成器/异步生成器），而不是一个函数。这样每一步之间才有边界，才能在边界上查目标是否变了（§4.2.2 的 `L-Divert` 粒度就是迭代器粒度）。
3. 用**键 + 声明**替换显式的服务引用。消费者声明键集 $d$，提供者声明可提供的键集 $p$；「满足」是「每个声明的键都有 Active 提供者」。
4. 把「目标」存成**提供者身份表**而不是值。否则等值替换不可见；反过来，如果确实想让等值替换传播，就撤回再装（§5.1.3 明说）。
5. 把去激活拆成「停止提供」与「应用逆」两步，并在两者之间等依赖者卸载。这一步主要由 `Theorem 70(2)`（提供者的 episode 严格包含消费者的 episode）与 `L-Unload` 的 guard 承担（Theorem 70 还有第 (1)、(3) 款），也是最容易实现错的地方：一步做完会让 teardown 读不到正在被撤的依赖。
6. 异步宿主只能取 `L-Divert` 的**落地**分支（inertia），不能中止在飞的迭代。论文的进展定理不依赖中止分支，所以仍然会静息。

### 成本与代价

论文没有量化，这里只列结构性的：

- 每次变更多一个闭包 + 一个逆闭包；每条纤维一条累加器链；`notify` 是全体纤维的线性扫描（Algorithm 3），没有索引。
- `target` 每次余效应变化都要重算（`refresh`），按 Algorithm 5 的 `resolve(inject)` 推算，代价是「声明键数 × 查表」；实现用哈希比较避免逐字段比。
- 每个组件作者要承担两项**不被检查**的义务：逆真的撤销（$\mathfrak{E}^{*}$ 见证）、同键操作真的交换（Def 46 见证）。这两项错，定理不适用而运行时不会报错——这是采用这套东西时最大的隐性成本。
- 循环依赖要靠人拆；拆完组件数可能二次增长（§6.5）。

### 失败模式（从形式模型直接读出）

- **逆不完整** → 泄漏，且只在卸载路径上暴露；`O-Remove` 的 $\sigma_{n} = \varnothing$ 前提会兜住「表没清空」这一类，但兜不住边界外的 emission。
- **同键操作不交换** → 两个组件交错时结果依赖调度；`Theorem 43` 的任意顺序撤销不再成立。典型反例：有序 middleware 链、按「最低可用」分配的描述符。
- **在声明外的键上分支** → confinement 被破坏，$\simeq _{d_n\cup p_n}$ 上的见证失效；实现里 proxy 会拦未声明的访问，但 `ctx.get` 不会。
- **一步式去激活** → teardown 读到已被撤走的依赖；表现为「关连接池时拿不到连接」这类问题。
- **异步宿主上做「中止」语义** → 与 inertia 冲突；论文明确说这种宿主不提供 abort 分支。
- **失败不重试** → `FAILED` 纤维在环境不变时不会被 `L-Begin` 重新拉起（§4.4），需要一次 revision（重插入）才会清掉错误结果。

### 讨论（§6）的要点

- **系统边界：acquisition 与 emission**（§6.1，p70–71）。边界把环境分成两半：一个位置在**界内**，当系统能独占修改它、并能恢复修改前的状态——那么它上面的操作被追踪进 $\Gamma$、可撤销；在**界外**，当两个能力有一个不成立——那么操作就是 $\mathrm{id}_\Gamma$，既不追踪也不撤销。**余效应移动边界**：它把一个外部位置具体化，把对该位置的每次访问限制在它提供的一组操作里、每个操作都能给逆，于是原本 $\mathrm{id}_\Gamma$ 的操作变成被追踪、可撤销的。所以边界是**按位置**画的，不是按介质：一块内存区域在界内当且仅当只有系统写它；一个文件在界内当且仅当只有系统能到达它（私有路径下的临时文件）。一个操作越界时通常分两段：**acquisition**（取得访问权、在界内装一条记录——`open` 装描述符、`malloc` 预留块、`fork` 起子进程）与 **emission**（把数据推过这条通道——`write` 把字节交给文件、`send` 把数据报放到线上）。前者留在界内，后者跨到界外。所以「已发送的消息不会回来」**不是实现缺陷，而是边界定义的一部分**。必须从 emission 恢复的系统只有两条路：**withhold**（把 emission 压到产生它的状态确定持久之后，即 rollback-recovery 的 output commit 问题）与 **compensation**（用应用提供的、比 $\simeq$ 更粗的等价来恢复——删掉刚建的文件、退款）。补偿按同样的 LIFO 复合，所以 §3.1 的复合可迁移；但**元理论不迁移**：Definition 65 的交换性是对 $\simeq$ 证的，得对更粗的等价重新建立。这一段是全文最诚实的地方，也是任何想把「完整恢复」写进产品文档的人必须读的一段。
- **服务多路复用：broker 而不是多提供者**（§6.2，p71–72）。单源纪律下「一个键一个提供者」，所以「一个服务多个实现」要靠两种形式：**独占绑定**（多个实现共享一个接口但至多一个绑定，切换要卸一个装一个，**瞬时扰动每个消费者**）与**服务代理**（一个中心服务作为接口入口，被后端提供者与消费者同时注入，由它分发；更新后端时代理不动，消费者看不到依赖变化、不触发重载）。代理支撑三件事：负载均衡（轮询/最少负载/延迟加权，提供者是普通组件，注册是可逆效应，卸载自动掉出路由集）、滚动更新（新提供者作为额外纤维加载并注册，`ACTIVE` 后逐步转移流量，旧的不再承载在飞请求后卸载——把基础设施级的蓝绿部署变成应用级组合模式）、跨进程调用（每个进程有自己的 Cordis 上下文，协调组件把远程提供者当本地提供者，RPC 保持接口；但跨进程调用有延迟且可能中途失败，所以暴露的接口必须按异步契约设计）。
- **访问控制与沙箱**（§6.3）。依赖访问机制本身已是一种访问控制：组件只能访问它声明的依赖，未声明即报错——这与 capability-based security 结构相同（`inject` 是能力请求、context proxy 是能力中介），且因为请求是静态声明的，**组件所需的全部 proxy 中介能力在运行前就已知**（原文限定为 `proxy-mediated capabilities`；直接 import 或全局对象不在其中），编排者可以在加载时审查批准，而不是运行时才发现访问。细粒度策略走 interception（§3.2.3）：访问控制元数据由上下文携带或组件声明，提供者在被调用时查它决定是否允许（例：文件系统依赖携带「哪些路径可读写」的元数据）。因为拦截活在上下文而不是任一方代码里，编排者能约束任何组件对某依赖的访问而不改提供者（社区组件给只读数据库权限、核心组件保留全权）；又因为拦截只影响**如何调用**、不影响**是否满足**，它可以运行时装卸而不触发重载、不扰动依赖图。沙箱是另一回事：不可信代码需要超出语言级手段的执行边界（SFI、独立运行时、沙箱进程、虚拟化容器），因为能访问宿主运行时的恶意组件可以直接摸到底层对象。这时不可信组件跑在自己的沙箱上下文里，经桥接访问宿主依赖——这泛化了 §6.2 的跨进程调用，同样的透明性论证让桥接访问与本地注入不可区分；宿主侧的桥接是普通纤维，其能力可被上面的访问控制削减。
- **语言与 OS 协同**（§6.4，p73–74）。语言至少要提供：时间侧要**闭包**（逆必须作为值被捕获，连同它恢复的状态）以及**运行时可引入/可撤回**的代码（托管运行时用可编程模块注册表，Node.js 有；原生代码用 `dlopen`/`dlclose`、`LoadLibrary`/`FreeLibrary`；Wasm 取决于嵌入者）。空间侧要**依赖声明与注入**（DI 问题），分两层：类型层（Haskell typeclass、Rust trait、TypeScript module augmentation 都能让提供者从自己的模块扩展上下文类型）与运行时层（需要透明中介访问——JS 的 `Proxy`、Python 的 `__get__` 描述符；没有的话用运行时反射，代价是类型安全与开发体验）。两者合起来靠元编程：注解/装饰器 + 编译期宏（Rust proc macro、Scala macro、Zig comptime）为每个依赖生成带类型的声明与访问器。§6.7（p76–77）反过来问「与范式共同设计的语言/OS 能多给什么」：语言可以让上下文重新变成**隐式**的（同时消掉「把上下文当普通参数传」带来的两个风险——组件可能经闭包或全局变量摸到别人的上下文，从而让效应泄漏出自己的生命周期、让余效应逃出自己的声明），也可以让 effect/coeffect **对编译器可见**（为整个迭代生成单个状态机、把逆存在帧里；把余效应规格纳入类型系统，从而编译期报循环依赖、并按结构而非键名比较依赖，如 row types）。OS 侧可以让「组件声明的余效应就是它能到达的全部」，把资源作为余效应提供（记录只保留一份、且天然归属于请求它的组件），并把 §6.1 只能 withhold/compensate 的操作变成可回滚的（事务式持久写、copy-on-write/不可变存储靠移指针回退）。
- **循环依赖与粒度**（§6.5，p74）。**依赖环只是让相关组件永久 inactive**——$A$ 要 $B$ 提供的键、$B$ 要 $A$ 提供的键，两者的满足谓词都不可能变真。与并发死锁不同，这个条件**只从声明就能预测**，所以运行时可以在加载时报出来。实践上大多数「看起来互相依赖」可以拆成更细的组件消环：server 与 access controller 双向交互，拆成 server-core、access-control-core、request-mediation（依赖两个 core，把访问控制施加到入站请求）、policy-management（依赖两个 core，经 server 暴露策略修改）。两个 core 互不依赖，只有集成组件依赖两者。作者说这种分解**原则上总是可能**（任何双向交互都能分解成独立单向绑定），代价是组件数：一般情形下 n 个互相作用的组件，集成组件数可能**随 n 二次增长**。这不影响正确性与运行时性能（组件很轻），甚至有益（用户只装自己需要的集成绑定）；但影响开发体验（更多配置、命名与认知负担）。缓解手段是工程性的：包捆绑、按命名/类型约定自动接线、从声明式规格生成样板集成组件。
- **版本与接口漂移**（§6.6，p75）。形式模型的一个真实缺口：依赖链接**只靠键身份**，$\mathcal{V}_{k}$ 的类型一致性只在单个编译单元内成立。独立开发的组件生态里这导致两个问题：**接口漂移**（提供者改了 $k$ 的接口，消费者还声明同一个 $k$，余效应层面满足但运行时不匹配——类型错误、方法不存在、或静默的行为分歧）与**键冲突**（两个独立开发的提供者用同一个键名表示完全无关的接口，消费者会接受另一个的值而没有任何兼容检查）。三条路，从最耦合到最语言无关：**键命名空间**（键空间从 $K$ 扩到 $K \times P$，$P$ 标识定义接口的包，构造上消除冲突，但把包命名空间嵌进形式模型、依赖外部包注册表）；**peer dependencies**（用宿主包管理器声明版本约束——**Cordis 目前采用这条**；限制是依赖提供者遵守 semver（不可强制）以及包管理器通常把依赖解析到单一版本、无法在一个应用里装同包的多版本）；**结构兼容**（把成员检查 $k \in \operatorname{dom}(\sigma)$ 换成兼容谓词，验证提供的接口结构上包含消费者期望——类似结构子类型；但语言无关地定义这个谓词很难：记录类型（宽度子类型）容易，行为契约（前后条件、效应规格）复杂，一旦引入有界量化就不可判定）。作者把「统一这三条并保持动态组合保证」列为开放问题。

### 外部资料小结

- GitHub / npm / DeepSeek Harness 文档的核验结果见「来源与版本」的「补充核验」；只核到仓库存在性、许可、顶层结构、npm 版本线与文档描述，**未验证仓库实现与论文形式模型的对应关系**。
- 论文本身没有给 Cordis 的代码仓库地址；正文只以名字指称 Cordis / Koishi。

## 实验与证据细节

本文**没有实验章节、没有 benchmark**。证据分三类：

1. **形式证明**：§4.3 的五组结果（见「元理论与证明细节」）。部分证明按结构与关键步骤读，未逐行验算，未做机器检查。
2. **实现对照**：Table 2 的 30 行理论—实现映射；§5 的十个算法（Algorithm 1–10）。论文没有给算法复杂度、吞吐、延迟、内存或开发者效率的实测数字。否定性检索：`benchmark` 0、`throughput` 0、`millisecond` 0、`CPU` 0、`wall-clock` 0；`latency` 2、`overhead` 5，均为定性。
3. **采用度案例**：Koishi 的 4000+ 社区插件、四年开发、单一生态与单一宿主语言；作者自述是 "existence-and-adoption result rather than a quantitative one"，且跑在 Cordis v3 上（本文形式化 v4）。

**Table 1（p40，九行五列）**：把九条规则读成「对纤维 $n$ 的写」，五列是规则、$\theta^{n}_{t}$、$\theta^{n}_{t+1}$、$\Psi_{t}$、被编辑的控制字段。它是后面所有 case analysis 的查表依据，也是工程实现与形式模型之间的对账表；逐规则结论见「元理论与证明细节」的 Lemma 59 五条。

**Table 2（p58，30 行）**：理论与实现的对照；读者版只保留 14 行，省略的 16 行名称已在「实现与案例」列出。

**Figure 1（p34）**：组件生命周期状态机。四个状态节点 Inactive / Reloading / Active / Unloading、最左侧空节点（表示 fiber 不在 registry 中）、八条边及其标签（O-Insert、O-Remove、L-Begin、L-Finish、L-Divert、L-Leave、L-Unload、Reloading 上的 L-Iter 自环）；第九条 `O-Retire` 是四个状态上的自环，图里省略。配图为 300 dpi 裁剪，元素清单与像素差比对见「阅读范围与核对手段」。

## 局限与待确认（完整版）

**作者明确讨论的**：

- 无定量评估：开销与开发效率的度量是 future work（§5.3，p70）；全文没有**本文自己测得**的延迟、吞吐、内存或开发者效率数字（用 `benchmark`/`latency`/`throughput`/`overhead` 全文检索确认过，命中处均为定性；§1.2.3 的「秒到分钟」是引用 [15] 的既有观察，不是本文测量）。
- 案例是单一生态、单一宿主语言、观测性而非受控比较；且跑在 **Cordis v3** 上，本文形式化的是 **v4**（p69 脚注 4）。
- 「完整恢复」是在 $\simeq$ 与系统边界之内完整：物理状态不可原样恢复（堆布局、生成名），边界外的 emission 只能 withhold 或 compensate，且补偿的等价更粗、需要重新证明交换性（§3.3.2、§4.3.2、§6.1）。
- 进展依赖 `≺` 无环、$\operatorname{len}(e_n) \le K$、名字集有限三个假设（§4.3.4，p49–50）；合流依赖 total on provision（§4.3.5，p52–54）。
- 单源纪律把「一个组件多次实例化」限制在**不提供键**的组件上（§4.1，p33）；需要同键多实现时走 realm（§3.2.3/§4.4）或 broker（§6.2）。
- 失败扩展**必须**把失败纤维排除在合流之外（§4.4，p56），因为一次迭代是否抛错取决于它遇到的状态，不同调度可能一个失败一个成功。
- 依赖链接只有键身份，接口漂移与键冲突没有解决（§6.6）；统一三条路是开放问题。

**读者根据证据提出的判断**（不是作者结论）：

- **最大的理论与实现落差是「见证不被检查」**。元理论的两类见证（逆真的撤销、同键操作真的交换）在实现里明确不被验证（§5.1.1）；此外 `≺` 无环、名字集有限、$\operatorname{len}(e_n) \le K$、total on provision 这些假设同样不由运行时检查。所以「结构保证」实际是「结构 + 作者义务 + 未检查的全局假设」；作者在 §6.1 划了义务边界，但没有给出任何静态检查或运行时断言的方案。
- **`notify` 的全量扫描是可扩展性隐患**。数千纤维的宿主里每次绑定变化都扫全体，论文既没给索引方案也没给实测；这一条只能从 Algorithm 3 的伪代码读出，属于实现细节而非形式模型。
- **合流定理对「配置相关安装」的组件不适用**。§5.2.1 承认：一个声明了键、只在某些配置下才装它的组件，loader 仍能协调，但「加载了哪些组件」这时也取决于配置。这与 Definition 76 的要求是同一件事的两面。
- **`isolate` 在运行时重指派被视为接口变更**（§4.4 的 Configuration 段），因此要走「退休—去激活—移除—重插入」的复合，而不是改一个字段。这对实现者是个不直观的约束。
- **本文对 agent harness 是动机而非证据**。§1.2.2 的论证（自演化 harness 需要这两个维度）有说服力，但 §8 把在自演化 harness 里验证列为未来方向，全文没有任何 harness 实验。

**未核实事项**：未复现任何证明、未运行 Cordis 或 Koishi 代码、未验证 §5 的十个算法与形式模型的逐条对应；GitHub/npm 只核到存在性与版本线，未核对实现与论文语义。

## 相关工作细节

| 线 | 代表 | 与本文的关键差别 |
| --- | --- | --- |
| monadic effect 系统 | ZIO（`ZIO[R,E,A]`）、Effect-TS（$Effect<A,E,R>$）、fp-ts | 追踪要付 monadic 嵌入的代价（程序必须写在 effect 类型里）；requirement 由解释器满足，服务被撤走时**它做过的事仍留在原地**；Cordis 是叠加在普通宿主代码上的追踪，且每个效应配一个逆、提供者来去时重新解析需求 |
| 代数效应即能力 | Effekt（Brachthäuser 等） | 目的不同：代数效应让 effect 可见是为了**多重解释**，Cordis 是为了**追踪与撤销**；设定不同：Effekt 在类型层静态约束、能力是二等的、被限制在词法作用域（靠 boxing 恢复一等使用），Cordis 在运行时约束、目标是组件移除时的完整资源回收 |
| 可逆效应语义 | Heunen 等（dagger arrows / inverse arrows） | 最接近的形式工作，但可逆性是**全局**性质（每个计算都可逆、逆是双侧的、由范畴结构导出）；Cordis 在运行时追踪逆，只要求**每个原子效应**有单侧逆、由调用者在应用点提供，复合的逆由复合导出 |
| graded 类型统一 effect/coeffect | Orchard 等（Granule） | 都在**类型层**、编译期、词法固定作用域上做；本文把同样的两个概念提升到运行时机制，让时间撤回与空间依赖随已加载组件集合演化而**重新解析** |
| 面向上下文编程（COP） | ContextL（[95]） | 「context」指环境情形（位置、用户、模式），激活改变方法分派、layer 既不追踪也不撤销它引出的副作用、激活不由依赖满足驱动；Cordis 的 context 是中介 effect/coeffect 的 $\Gamma_\infty$，激活跑可逆效应、由响应式余效应驱动、去激活完整撤销。作者自评：Cordis 只能把 COP 的**全局、值驱动**那一小片表达成余效应 |
| 面向切面编程（AOP） | AspectJ | 声明 vs 无意识：pointcut 是 oblivious 且量化的，Cordis 把横切限制在每个组件**声明**的余效应上（范围恰好是声明面，因而确定、可追溯，编排者不必读源码）；生命周期集成：Cordis 的横切由组件效应承载、卸载时撤销、响应式传播给依赖者，动态 AOP 也能运行时织入/拆出但那是独立操作 |
| 状态前向迁移（DSU / HMR） | Hicks 等、Kitsune、Erlang/OTP、webpack/Vite | 它们把状态**前向迁移**（手写迁移函数、在安全点切换）；Cordis 撤销旧组件的追踪效应、从干净状态重装新组件，所以组件自己的内存状态**不跨重载存活**（除非放进更长命的依赖）——作者明说把 DSU 式前向迁移叠在可逆效应之上是 future work，但 Cordis 更一般的地方是不需要手写迁移、且支持彻底卸载并回收资源 |
| 开发者自写恢复 | OSGi、Eclipse extension points、Command 模式、saga、代数效应 handler 的 finalizer、event sourcing、React `useEffect` | 逆是**未强制的手写义务**、与操作解耦，忘一个就静默泄漏；`useEffect` 最接近（返回 cleanup、运行时在下次执行前与 unmount 时调用），但**可组合性**不足：hook 只能在组件或另一个 hook 顶层调用，不能在条件、循环、嵌套函数里，effect body 也不接受 async 函数或迭代器——于是效应无法由别的效应组装、无法与控制流交错，也就没有可导出复合逆的东西 |
| 静态作用域的反转 | STM、可逆计算（Janus）、可逆进程演算（RCCS、Phillips & Ulidowski）、线性类型/RAII/Rust ownership | 都由**构造**保证、但作用域**预先固定**；RCCS 的因果一致性是 Cordis 恢复顺序的并发对应物（累加器按 LIFO 应用自己的逆 + guard 推迟提供者撤出），但它的可达范围由语义固定（每个动作永远可撤），而 Cordis 组件为每个原子效应提供逆、累加器把上下文带回组合开始处 |
| 接口介入式回收 | Nooks、shadow drivers、Akeso | 最接近的系统级先例（运行时维护记录而不是靠开发者记得写清理），但**平台决定能记录什么**（每类内核对象的 release 代码、每类驱动一个 shadow、每个被插桩分配器一个逆），组件只能持有平台已知如何释放的资源；Cordis 组件引入自己的效应、为每个原子效应提供逆，且恢复范围是组件整个生命周期、并把移除传播给依赖者 |
| 初始化期依赖装配 | Spring、Guice、Angular、Inversify、Vue `provide/inject`、React Context | 初始化时注入，**不响应式重解析**：提供者被替换或移除时，已有依赖者既不去激活也不重新初始化，也没有本文这种生命周期状态机 |
| 可用性响应式组件模型 | OSGi Declarative Services、iPOJO（Gravity）、R-OSGi | 最接近的先例：声明 provided/required，运行时按服务出现/消失自动激活/去激活；但恢复靠**手写的去激活回调**（资源安全依赖开发者勤勉），且回调是**同步**的——teardown 需要与正在离开的依赖做异步交换时没有协议可等，只能对一个可能已过期的引用做阻塞等待。Cordis 的两点补足：去激活撤销依赖者累积的效应；惯性 `Unloading` 状态把异步 teardown 跑完再响应后续变化 |
| 值级响应式 | FRP、signals（SolidJS、Vue reactivity、Angular Signals） | 它们在**值级**传播、同步或在调度器下重算；Cordis 在**组件级**、加异步生命周期语义。一致性方向相反：FRP 靠「一个 turn 内按依赖图定序传播」实现 glitch freedom，Cordis 没有 turn（编排动作一次一个到达），只保证**没有单次 transition 跨两份 resolution**（Thm 71）。两者互补：Cordis 的余效应本身可以携带响应式值 |

## 与本仓库其他条目的关系

- **与 DeepSeek Harness 系列（00221 / 00222《Super-agent 设计探索》）**：那篇讲 agent harness 的组件化与自我修改；本文 §1.2.2 把「自演化 harness」当作核心动机，且第一作者与第三作者署名 DeepSeek-AI。两篇可以对照读：一篇是 harness 的设计探索，一篇是给「运行时装卸组件」提供形式基础。**这是概念上的咬合，不是引用关系**（本文没有引用那篇微信文章）。
- **与 Harness²（00220）、Self-Harness、HarnessX（00199）等「改 harness」的论文**：那些工作在**任务层面**改 harness 并测分；本文在**运行时层面**给组合语义、不做任务评测。两边的「可组合性」不是同一个词，尤其 **HarnessX 标题里的 "Composable" 指 harness 模块的类型化组合**（本仓库其笔记记的是「typed 组合 + manifest 可伪证 + 确定性门 + 版本/回滚」），而本文指**效应可撤销、依赖可重解析**；本文的「可组合性」是关于运行时状态的代数性质，不是关于模块装配的类型约束。
- **与 vLLM / SGLang 一类系统论文（00086 / 00164）**：都关心「组件边界与资源生命周期」，但那两篇的边界是显存与请求调度，本文的边界是语言级上下文与系统边界（§6.1）。
- **旁证（非本仓库条目）**：Cordis 仓库的 `homepage` 指向 DeepSeek Harness 文档的 Cordis 入门页，该页把 Cordis 描述为「以 vendor 方式引入的插件框架」。若要把本文的形式模型与某个真实 harness 的实现对照，这条线索比论文本身更直接；但**未验证**该 harness 与论文 v4 语义的对应程度。

## 机构判断

论文首页署名是 $Yifan Shi^{1,2}, Wei Zhang^{1}, Tianyi Cui^{2}$，单位为 `1 Peking University`、`2 DeepSeek-AI`——**第一机构是 Peking University**。三位作者里，Wei Zhang 只署 Peking University、Tianyi Cui 只署 DeepSeek-AI、第一作者 Yifan Shi 两处兼署；工作内容（agent harness、插件系统）与 DeepSeek Harness 直接相关，Cordis 仓库首页也指向 DeepSeek Harness 文档。

按仓库规则，第一机构优先本应记 `Peking University`；**用户于 2026-11-15 明确要求改按团队归属**，因此清单的「论文单位」列记 `DeepSeek-AI`，该行置于 `### DeepSeek-AI` 分组（这是规则里唯一允许的例外：归并分组通常不改写该列，需用户明确同意）。笔记上表的「作者」行保留原文署名与单位行的原貌，不做改写。

## 迁移索引

2026-11-28 读者版重写时，以下内容从 `note.md` 移入本文件：

- 来源信息表中的版本日期、Subjects、许可、篇幅构成、仓库编号、归档说明、配图与「补充核验」；
- 原「阅读范围与核对凭据」整节（含下载 sha256、渲染页核对清单、配图裁剪框与像素差、否定性检索词）；
- 原「复核记录」整节（2026-11-15 第一轮、18 处修正、改后自检、未修事项、用户决定）；
- 原「元理论：五组结果与各自的前提」整节（含结果表、恢复精确性公式与证明读法、纠缠、排序/进展/合流的完整前提、Table 1 对账）；
- 原「实现：Cordis（§5）」整节（含 Table 2 的 14 行节选与 16 个省略行名、ctx.effect、余效应通知、proxy、加载器、受管域、HMR）；
- 原「案例：Koishi（§5.3）」整节；
- 原「讨论：值得工程读者读的部分（§6）」整节（acquisition/emission、broker、访问控制与沙箱、语言与 OS、循环依赖、版本漂移）；
- 原「工程视角：落地路径、成本与失败模式」整节；
- 原「原文自身的表述张力」整节（5 条）；
- 原「局限与待确认」完整版（作者明说 + 读者判断 + 未核实事项）；
- 原「相关工作：与本方法的差别（§7）」表；
- 原「与本仓库其他条目的关系」完整版；
- 原「机构判断」整节。
