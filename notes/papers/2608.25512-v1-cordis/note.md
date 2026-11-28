# 时空可组合性：把 effect / coeffect 从类型层搬到运行时

## 来源信息

| 项 | 内容 |
| --- | --- |
| 标题 | A Programming Paradigm for Spatiotemporal Composability |
| 作者 | Yifan Shi¹²、Wei Zhang¹、Tianyi Cui²（¹ Peking University；² DeepSeek-AI） |
| 机构 | DeepSeek-AI（按团队归属记录；首页第一机构为 Peking University，理由见 `audit.md`） |
| 来源 | [arXiv:2608.25512v1](https://arxiv.org/abs/2608.25512v1)（cs.PL；cs.SE；2026-08-26 提交，截至 2026-11-15 仍为最新版，无 HTML 版） |
| 许可 | arXiv 默认的 [nonexclusive-distrib/1.0](https://arxiv.org/licenses/nonexclusive-distrib/1.0/)（非 CC） |
| 页数 | 92 页（§1–§8 正文 p4–83，References p83–92；1 图 2 表，无附录）；仓库编号 00228 |
| 阅读日期 | 2026-11-15 |

---

## 核心结论

一句话：**这篇把运行时动态组合拆成时间与空间两个维度，用「可逆效应」（每个上下文变换由运行时持有一个逆）与「响应式余效应」（把每次上下文变化对照组件声明的依赖集分类成激活/去激活/中性）分别建立单组件的局部保证，再把两者放进同一个上下文类型、给出一个九条规则的组件演算，并用五组定理把保证提升到任意交错的多组件系统。**

- **解决什么问题**：插件、IDE 扩展、agent harness 这类系统要在运行中装卸组件，但静态的 effect/coeffect 只在词法固定、执行前确定的上下文里成立；进程/容器级的替代又太粗。
- **核心想法**：时间可组合性对应 effect、空间可组合性对应 coeffect，但不加更多类型注解，而是把两者的概念结构具体化成运行时可操作的对象——逆账本、带见证的效应函数、响应式依赖表。
- **怎么做到**：所有副作用写成「上下文变换 + 逆」；余效应的 `set` 本身是效应，于是自动被追踪；再用 $\Gamma_\infty$ 把效应表与余效应表合成一个自相似上下文，用九条规则描述组件生命周期。
- **关键结果**：局部可逆性、任意顺序撤销（热拔）、交错后的恢复精确性、依赖排序与 resolution coherence、进展与合流；代价是若干不被运行时检查的见证与全局假设。
- **定位**：说服力来自证明而非测量——Cordis 实现与 Koishi 的 4000+ 插件是采用度证据，作者自己定性为 existence-and-adoption，全文没有性能数字。

---

## 问题

### 两个维度

作者把「动态组合」拆成两个正交要求（§1.1，p4）——时间维对应 effect（计算如何改环境），空间维对应 coeffect（计算如何依赖环境）：

- **时间可组合性**（temporal composability）：组件被移除时，它对共享环境做过的修改必须被完整、安全地撤销。静态情形退化为词法作用域（RAII、bracket）；动态情形要处理生命周期不受词法边界约束的**长时效应**。
- **空间可组合性**（spatial composability）：组件要能声明、发现、解析彼此的依赖，并在依赖变化时协调生命周期。静态情形退化为模块导入解析；动态情形下依赖会在执行中出现、消失、换身份。

### 两个动机案例

**VSCode 插件系统**（§1.2.1，p4–5）。作者给了两个可核数字（脚注 1：2026-06-09 的 VS Code Marketplace）：

- 时间侧：所有扩展跑在共享 extension host 里，没有卸载单个扩展代码的机制；`activate` 之后禁用/卸载要重启整个 host。按安装量前 100 的扩展里 **87 个含可执行代码**，移除时都需要重启。`deactivate` 只是 host 终止时的优雅关闭回调，而且是「创建效应」与「释放效应」分居两个函数，破坏关注点局部性。
- 空间侧：`extensionDependencies` 存在但几乎没人用——前 100 里**只有 7 个**对非内置扩展声明了它。扩展通过 commands/views/language features 这些固定扩展点贡献能力，跨扩展交互走 `vscode.extensions.getExtension(...).exports`，返回值默认 `any`，**没有受检接口**。

**自演化 agent harness**（§1.2.2，p5）。作者列出 harness 的职责（工具、执行环境、权限与沙箱、会话状态、上下文与记忆、子 agent 编排、对外接口），然后指出：未来的 harness 可能会在自己持续服务请求的同时生成并部署对自身组件的修改（原文用 `may`，是可能性而非断言），每次修改都是一次动态组合。没有时间可组合性，每次自我修改都要重启并丢掉进程内累积状态；没有空间可组合性，每个模块只能自己检测并适配依赖的出现/消失/换身份，朴素的代码替换还可能静默打断依赖者或引入只在 reload 时暴露的循环依赖。这一段是动机，不是证据——论文没有做 harness 实验。

### 粗粒度替代为什么不够

操作系统在**进程**粒度给时间可组合性，容器编排在**服务**粒度给空间可组合性（§1.2.3，p5–6）。代价有两类：时间上每次重启丢掉进程内状态（缓存、连接、部分计算），重建要秒到分钟，期间维持可用性得靠冗余副本；空间上容器级编排无法表达**同一地址空间内**组件之间的依赖，还把本可以是本地函数调用的交互变成网络调用。结论是「粒度错配」：现代系统在比进程/容器更细的层次上组合，需要一个和组件同粒度的抽象。

### effect / coeffect 为什么不够

§2（p7–8）是给 PL 读者的铺垫。effect 系统把判断精化成 $\Gamma \vdash t : T \mid \mathrm{effect}$，描述「这次计算可能产生哪些副作用」；主线是 monad（$T(A)$、$\eta$、$\mu$）、代数效应（签名声明操作、程序自由调用而不绑定解释）、handler（$\kappa$ 是被界定的续延）。coeffect 反过来注解上下文：$\Gamma \mid coeffect \vdash t : T$，描述「这次计算要求环境提供什么」；主线是 comonad（$\varepsilon$ 取值、$\delta$ 复制上下文）、Petricek 等人的 coeffect，以及用预序半环 $S$ 刻度的 graded 版本（0 未用、1 线性、$n$ 有界、$\infty$ 无限制）。

关键差异（§2.3，p8）：经典 effect/coeffect 是**静态工具**——effect 在词法固定的作用域里追踪、由编译期 handler 消解；coeffect 注解在执行前确定的上下文上校验。而动态组合要求保证对**运行时到达和离开**的组件成立、对**持续演化**的上下文成立：部署后加载的插件没有词法作用域可界定，运行时配置产生的依赖没有编译期上下文可预期。作者的转向因此不是「给类型系统加更多注解」，而是把 effect 与 coeffect 的概念结构**具体化**（reify）成运行时可操作的对象。

---

## 核心想法

### 一句话

不去静态地证明「这个组件只会碰这些资源」，而是让运行时**记账**：每次改上下文都留下一个能撤回它的逆，每次依赖变化都对照声明重新分类。

### 直觉：把逆记在账本上

任取不纯函数 `f : X ⇝ Y`，写成纯形式 $f : \Gamma \times X \to \Gamma \times Y$。固定输入 $x$，映射 $\gamma \mapsto \mathrm{pr}_{1}(f(\gamma, x))$ 就是这次调用的副作用，与返回值无关。于是**所有副作用都是 $\Gamma \to \Gamma$ 上的变换**，而 $\Gamma \to \Gamma$ 在复合下是幺半群（闭包、结合律、单位元 $\mathrm{id}_\Gamma$）。

要能撤销，就给每个变换配一个逆。作者做了一个明确取舍：**只要单侧逆**，运行时只保证 $g \circ f = \mathrm{id}_\Gamma$，从不要求 $f \circ g$。单侧够用是因为逆在**应用点**返回（这一理由在 §3.1.2 展开）：运行时把逆拿到「该效应刚产生的那个状态」上跑，$f \circ g$ 这个方向不会被用到。把这个「逆的累积」放进上下文本身，就得到「状态 + 账本」的效应上下文；账本按 LIFO 复合，恢复时把账本作用到当前状态并清零。

### 为什么成立

- **账本不改变前向行为，恢复目标也不因插入可逆步骤而移动**：带着什么逆都不影响状态怎么变，一串效应可逐个追踪也可先复合再追踪；只要每步的逆真的撤销了它那一步，从初始状态出发的可达状态都满足「账本作用到当前状态等于初始状态」这个不变式。
- **余效应操作本身是效应**：`set(k,v)` 的类型就是带见证的效应函数，所以登记依赖也能被追踪、被撤销。这让「空间」与「时间」共用同一套机器。
- **满足性的变化在每个效应边界上可检测**：所有对依赖表的修改都经过效应函数，而逆恢复前一个域，所以「依赖是否就位」的翻转发生在明确的位置，可以据此激活/去激活。
- **独立性可以降到一个键一个键检查**：不同键上的操作天然互不干扰，剩下的只有同键操作的交换性；这项义务由提供该键的组件在定义处承担。

### 与已有做法的区别

- **monadic effect（ZIO、Effect-TS）**：追踪要求程序写在 effect 类型里；requirement 由解释器满足，服务被撤走时它做过的事仍留在原地。Cordis 是叠加在普通宿主代码上的追踪，每个效应配一个逆，提供者来去时重新解析需求。
- **可逆效应（dagger arrows / inverse arrows）**：可逆性是**全局**性质，每个计算可逆、逆是双侧的、由范畴结构导出；Cordis 只要求每个原子效应有单侧逆，由调用者在应用点提供。
- **面向上下文/切面编程（COP/AOP）**：COP 的 context 是环境情形，激活不追踪也不撤销副作用；AOP 的 pointcut 是无意识且量化的。Cordis 的横切限制在每个组件**声明**的余效应上，由效应承载、卸载时撤销。
- **OSGi Declarative Services 一类**：声明 provided/required、按服务出现/消失激活，最接近；但恢复靠**手写的去激活回调**，且回调是同步的，teardown 需要与正在离开的依赖做异步交换时没有协议可等。

### 一个走通的例子

按原文规则走一遍（不是实验）：组件 A 提供键 `db`，组件 B 声明 `db`。B 只有在 `db` 有 `Active` 提供者时才激活；B 的效应由自己的累加器追踪。

现在移除 A。编排者先把 A 标成退休（`O-Retire`，只是请求）；A 的生命周期规则 `L-Leave` 让它**停止提供**（表离开共享视图），但保留自己的视图。于是 B 的目标视图变了，B 开始去激活——此时 `db` 的绑定还在，B 的 teardown 仍能读它（例如把连接交还给连接池）。B 卸载完后，A 才在 guard 允许下跑 `L-Unload`，应用累加器、丢弃视图、回到 `Inactive`。如果 A 与 B 两两独立，逆甚至可以按任意顺序应用，不必 LIFO——这就是「热拔一个组件」的理论依据。

### 代价

- **两项见证不被检查**：逆真的撤销（$\mathfrak{E}^{*}$ 见证）、同键操作真的交换（余效应见证）都是组件作者的义务，运行时只信不验。写错时定理不适用，但程序不会报错。
- **全局假设也不被检查**：进展要 $\prec$ 无环、名字集有限、迭代器链长有界；合流要每个组件 total on provision。这些是定理的前提，不是运行时保证。
- **单源纪律限制复用**：一个键只有一个可能的提供者，所以「同一个组件多次实例化」只对不提供键的组件成立；同键多实现要走隔离域或 broker。
- **工程成本与循环依赖**：每次变更多一个逆闭包，每条纤维一条累加器链；实现里的通知是对全部纤维的线性扫描；论文没有给任何性能数字。依赖环让相关组件永久 inactive，可预测但不能自动消解，拆成集成组件后数量可能随组件数二次增长。

---

## 方法

### 符号表

| 符号 | 含义 | 维度 / 取值 |
| --- | --- | --- |
| $\Gamma$、$\gamma$、$\gamma_0$ | 上下文类型、它的元素（系统状态）、初始状态 | — |
| $f,g,f_1,g_1,f_2,g_2$ | 上下文变换（效应函数）及其逆；$\mathrm{id}_\Gamma$ 是恒等，$\circ$ 是函数复合 | $\Gamma\to\Gamma$ |
| $\mathfrak{T}_\Gamma$ | 扭转复合幺半群：变换与反范畴的积 | $(\Gamma\to\Gamma)\times(\Gamma\to\Gamma)$ |
| $\partial\Gamma$、$\phi$ | 效应上下文、逆累加器（把状态带回初始状态的函数） | $\Gamma\times(\Gamma\to\Gamma)$；$\Gamma\to\Gamma$ |
| $\mathrm{track}_\Gamma$、$\mathrm{recover}_\Gamma$ | 追踪一个效应、应用并清空账本 | 见下文 |
| $\mathfrak{E}_\Gamma$、$\mathfrak{E}^{*}_\Gamma$、$e$ | 效应函数类型、带见证的效应函数、其中一个元素 | $\Gamma\to\Gamma\times(\Gamma\to\Gamma)$ |
| $\diamond$、$\mathrm{effect}_\Gamma$ | 效应复合、把效应提升到 $\partial\Gamma$ 的构造 | — |
| $\mathfrak{I}_\Gamma$、$\mathrm{effectiter}_\Gamma$ | 效应迭代器（每步返回新状态、逆（Definition 17 写作 $g$、L-Iter 处写作 $h$）与续延 $o$）、把迭代器提升到 $\partial\Gamma$ 的构造 | $\mu\mathfrak{I}.\,\Gamma\to\Gamma\times(\Gamma\to\Gamma)\times\mathsf{Maybe}(\mathfrak{I})$ |
| $\delta,\varepsilon$、$s,t$、$\mathrm{pr}_1,\mathrm{pr}_{2,3}$ | 复合与迭代中的中间状态、复合中的两个逆、元组分量的投影 | $\Gamma$；$\Gamma\to\Gamma$ |
| $K$、$k$ | 键集合、一个键；Thm 73 的 $\operatorname{len}(e_n)\le K$ 用同一字母作上界常数，原文未区分记法 | — |
| $\mathcal{V}_k$、$v$ | 键 $k$ 的值类型（类型族 $\mathcal{V}:K\to\mathrm{Type}$；原文对比的统一值类型记作 $V$）、一个值 | — |
| $\Sigma$、$\sigma$ | 余效应上下文（键到值的偏函数）、一张具体绑定表 | $K\rightharpoonup\mathcal{V}_k$ |
| $d$、$\mathfrak{D}_\Sigma$ | 余效应规格（组件声明需要的键集）、规格类型；$\mathfrak{D}_\Gamma$ 原文未展开，按上下文理解为组件处的规格类型；interception 下规格扩成键到元数据的偏函数，$d(k)$ 是组件声明的元数据 | $\mathrm{Set}(K)$ |
| $p$、$\mathfrak{P}_\Gamma$ | 提供集（组件可能提供的键集）；$\mathfrak{P}_\Gamma$ 原文未展开，按上下文理解为键集 | — |
| $\sigma\models d$ | 满足谓词：$d$ 中每个键都在 $\sigma$ 的域内 | 可判定 |
| $\operatorname{notify}_d(\sigma,\sigma')$ | 把一次迁移对照规格分成 activating / deactivating / neutral | 三值 |
| $\Sigma_{\mathrm{iso}}$、$R$、$\rho$、$r$、$\Sigma_{\mathrm{inter}}$、$\mathcal{M}_k$、$\oplus_k$、$\varepsilon_k$、$\iota$ | 隔离上下文；域标识集（$R\supseteq K$）、隔离域表、域标识；拦截上下文（键→元数据 的全函数 × 键⇀（元数据→值）的偏函数）、元数据幺半群 / 合并 / 单位元、上下文携带的元数据 | $(K\rightharpoonup R)\times((r:R)\rightharpoonup\mathcal{V}_r)$；— |
| $\Gamma_\infty$ | 统一上下文：递归状态 × 累加器 × 余效应表 | $\mu\Gamma.\,\Gamma\times(\Gamma\to\Gamma)\times\Sigma$ |
| $\mathcal{A}_k$、$X_a$、$B_a$、$\mathfrak{I}^{\mathcal{A}}_\Sigma(S,P)$ | 键 $k$ 的余效应操作集、操作 $a$ 的参数/结果类型、上下文中介迭代器（$S$ 操作键集、$P$ 提供键集） | — |
| $\simeq$、$\simeq_k$、$\simeq_S$ | 观察等价、键 $k$ 上、键集 $S$ 上的版本 | — |
| $\mathrm{reach}(i)$、$\mathfrak{M}(i)$、$\operatorname{len}(i)$ | 迭代器 $i,j$ 中 $i$ 可达的迭代器集（$i'$ 是其中元素）、其前向映射与逆生成的子幺半群、续延链长上确界 | — |
| $\mathfrak{C}_\Gamma$ | 组件类型：规格 × 提供 × 在 $d\cup p$ 上被见证的迭代器 | — |
| $\langle d,p,e,\pi,\sigma,\tau,\theta\rangle$ | 纤维（一次实例化，$d,p,e$ 同组件）；$e$ 是效应迭代器、在纤维 $n$ 上记 $e_n$，$\pi$ 父、$\tau$ 退休标志（$\perp/\top$）、$\theta$ 生命周期状态 | — |
| $\Theta_\Gamma$、$i$、$g$（纤维中）、$\omega$ | 生命周期状态（`Inactive`、`Reloading`$(i,g,\omega)$、`Active`$(g,\omega)$、`Unloading`$(g,\omega)$）、剩余迭代器、已建立的累加器、已提交视图（每个声明键送到提供它的纤维名） | — |
| $F_\gamma$、$\mathfrak{F}_\Gamma$、$\mathfrak{N}$、$n,m$ | registry（名字到纤维的偏函数）、纤维类型（原文未展开）、纤维名字集（原子名）、两条纤维的名字（$n$ 也用作有限计数，如 Thm 43 的 $e_1,\dots,e_n$） | $\mathfrak{N}\rightharpoonup\mathfrak{F}_\Gamma$ |
| $\sigma_\gamma$、$\operatorname{provider}_k(\gamma)$、$\operatorname{relied}_n(\gamma)$、$\operatorname{target}_n(\gamma)$、$\operatorname{quiet}(\gamma)$ | 由 `Active` 纤维的表并成的派生表、键 $k$ 的唯一提供者、依赖 guard、纤维 $n$ 的目标视图（$\perp$ 表示无目标）、是否全体纤维都停在目标上 | — |
| $\Psi_t$、$edit_t$ | 第 $t$ 步的状态映射、只写控制字段的编辑；$\gamma_{t+1}=edit_t(\Psi_t(\gamma_t))$ | — |
| $b,u$、$\gamma^b,\gamma^u$、$g^u_n$、$t_i$ | episode 的开始 / 结束步、这两步的状态、纤维 $n$ 在第 $u$ 步的累加器、`[b,u)` 内作用于其他纤维的步 | — |
| $\prec$ | 激活依赖序：$n\prec m$ 表示 $n$ 可能提供 $m$ 声明的键 | — |

### 可逆效应：账本、单侧逆与迭代器

**原文式 (4)**。成对的变换自带一个乘法 $(f_1, g_1) \circ (f_2, g_2) := (f_1 \circ f_2,\ g_2 \circ g_1)$：左操作数在右操作数之后作用，逆则按相反顺序累积（$f_i$ 是变换，$g_i$ 是它的逆）；这让变换与其反范畴的积成为幺半群 $\mathfrak{T}_\Gamma$，作者叫它扭转复合幺半群。

**原文式 (5)**。把这个「逆的累积」放进上下文本身：
```math
\partial\Gamma := \Gamma \times (\Gamma \to \Gamma)
```

逐项读法：元素是 $(\gamma,\phi)$，$\gamma$ 是当前状态，$\phi$ 是累加器——到目前为止所有效应的逆的复合，也是把上下文恢复到初始状态的函数。初始效应上下文是 $(\gamma_0,\mathrm{id}_\Gamma)$；迭代 $\partial$ 得到塔 $\Gamma,\partial\Gamma,\partial^2\Gamma,\dots$。

**原文 Definition 3、6**。两个具体构造：

```math
\mathrm{track}_\Gamma(f,g) = (\gamma,\varphi)\mapsto(f(\gamma),\ \varphi\circ g),\qquad
\mathrm{recover}_\Gamma(\gamma,\varphi) = (\varphi(\gamma),\ \mathrm{id}_\Gamma)
```

逐项读法：`track` 改状态的同时把逆压到账本上（注意是 $\phi\circ g$，新逆在里层，所以 `recover` 按 LIFO 执行）；`recover` 把账本作用到当前状态并把账本清零。

四条性质撑起局部时间可组合性：`track` 不改变前向行为（Thm 4）；`track` 是幺半群同态，一串效应可当作单个效应推理（Thm 5）；若 $g(f(\gamma))=\gamma$，则恢复的目标不因中间插入一个可逆步骤而移动（Thm 7），作者把 $\phi(\gamma)=\gamma_0$ 叫**可靠性不变式**；一串效应按逆序撤销时，每一步逆都拿到它自己那次应用产生的状态（Thm 16）。

`track/recover` 有两个不足（§3.1.2，p12）：`track(f,g)` 在看到状态前就固定了 $g$，同一个 $g$ 必须在效应可能遇到的每个状态上都成立；`recover` 又是全有或全无，不能选择性撤一个效应。于是类型改成 $\mathfrak{E}_\Gamma := \Gamma \to \Gamma \times (\Gamma \to \Gamma)$，再用见证精化（原文式 (12)）：

```math
\mathfrak{E}^{*}_\Gamma := (e : \mathfrak{E}_\Gamma) \times \big((\gamma:\Gamma) \to (\delta:\Gamma) \to (g:\Gamma\to\Gamma) \to ((\delta, g) = e(\gamma) \to g(\delta) = \gamma)\big)
```

逐项读法：$e$ 是「给一个状态，返回新状态和这次效应的逆」；见证说对任意 $\gamma$，若 $e(\gamma)=(\delta,g)$，则 $g(\delta)=\gamma$。方程只在**应用点**成立，所以每个状态可以选不同的逆；均匀的 $g\circ f=\mathrm{id}_\Gamma$ 自然满足它（Thm 11）。

$\mathfrak{E}_\Gamma$ 不再是上下文上的自同态，不能直接复合，于是定义效应复合 $\diamond$（原文式 (13)）：先跑 $g$ 再跑 $f$，得到 $(\varepsilon,s\circ t)$——两个逆按相反顺序拼成一个。Theorem 10 说 $(\mathfrak{E}_\Gamma,\diamond)$ 是幺半群；Theorem 13 说 $\mathrm{effect}_\Gamma$ 保持 $\diamond$。提升 $\mathrm{effect}_\Gamma(e)$ 到 $\partial\Gamma$ 时，它先跑 $e$、把逆压进账本，**再为「撤销这个效应」本身返回一个逆**——那个逆是 `track(g, pr1∘e)`，即「用 $g$ 改状态，而撤销它的办法是再执行一次 $e$」。这一步是整节最漂亮的地方：**撤销本身也是一个效应，于是它自己也需要被追踪**，$\partial$ 塔因此自相似。但 Theorem 15 给出一个必须诚实对待的结论：$\mathrm{effect}_\Gamma$ 不把 $\mathfrak{E}^{*}_\Gamma$ 送进 $\mathfrak{E}^{*}_{\partial\Gamma}$；状态恢复精确，累加器只在 $g\circ f=\mathrm{id}_\Gamma$ 时恢复，一般情况下只保住可靠性不变式。

组件加载的不是一个效应而是一串。于是有**效应迭代器**（原文式 (17)）：

```math
\mathfrak{I}_\Gamma := \mu \mathfrak{I}.\ \Gamma \to \Gamma \times (\Gamma \to \Gamma) \times \mathsf{Maybe}(\mathfrak{I})
```

逐项读法：每次迭代返回 $(\delta,g,o)$——新状态、这一步的逆、续延（`Nothing` 终止、`Just(i)` 继续）；见证与 $\mathfrak{E}^{*}$ 同形。`effectiter` 沿续延递归展开，每步把逆压进账本，于是 $\phi\circ g_1\circ\cdots\circ g_k$ 按 LIFO 撤销。$\mathsf{Maybe}$ 的续延在相邻迭代之间提供了一个边界，边界处的上下文就是「到目前为止的迭代造成的状态」——作者叫它「具体化的有界续延」，也就是主流语言用 `yield` 暴露的结构，所以模型能直接落到生成器上。普通效应函数是退化情形：第一次迭代就返回 `Nothing`。

### 响应式余效应：依赖表与三分类

**原文式 (20)**。传统 IoC 容器把依赖建模成键值映射，论文形式化成依赖偏函数：

```math
\Sigma := (k : K) \rightharpoonup \mathcal{V}_k
```

逐项读法：用类型族 $\mathcal{V}:K\to\mathrm{Type}$ 而不是统一的 $V$，让每个键自带值类型、给依赖访问静态类型安全。四个操作记号是 $\sigma(k)$、$\sigma[k\mapsto v]$、$\sigma\setminus k$、$k\in\operatorname{dom}(\sigma)$；扩展要求 $k\notin\operatorname{dom}(\sigma)$（不能重复提供），限制要求 $k\in\operatorname{dom}(\sigma)$（不能撤销不存在的），违反前提报错且不产生迁移。

**原文式 (21)**。两个核心操作：`get(k)` 要求 $k\in\operatorname{dom}(\sigma)$，返回 $\sigma(k)$；`set(k,v)` 要求 $k\notin\operatorname{dom}(\sigma)$，返回 $(\sigma[k\mapsto v],\lambda\sigma'.\sigma'\setminus k)$。关键一句：**`set(k,v)` 的类型是 $\mathfrak{E}^{*}_\Sigma$**，即它是余效应上下文上的效应函数。于是 §3.1 的全部机器直接可用——`effect` 自动给出依赖注册的追踪与恢复。作者把这叫「响应式余效应与可逆效应的协同」：**余效应操作是效应，而效应是可逆的**。

只有登记和访问还不够：访问缺席的依赖是运行时失败，所以组件应在所有声明依赖就位后才激活。为此定义满足谓词 $\sigma\models d \mathrel{:=}\forall k\in d.\,k\in\operatorname{dom}(\sigma)$；因域有限所以可判定。又因为所有修改都经过效应函数（逆恢复前一个域），满足性的变化在每个效应边界上可检测——这是响应性的代数基础。

余效应规格就是键集 $\mathfrak{D}_\Sigma := \mathrm{Set}(K)$；「响应式」体现在它如何**分类状态迁移**（原文式 (24)）：$\operatorname{notify}_d(\sigma,\sigma')$ 在 $\sigma\not\models d\wedge\sigma'\models d$ 时给 `activating`，在 $\sigma\models d\wedge\sigma'\not\models d$ 时给 `deactivating`，否则 `neutral`。激活迁移触发组件效应执行（按 §3.1 追踪），去激活迁移触发恢复（应用累加器）。

平铺的 $\Sigma$ 不够用：同一逻辑依赖在不同组件下可能绑不同值，于是加两个机制（§3.2.3，p19–21），并把实现分成**原地实现**（改上下文、返回非平凡逆）与**派生实现**（不动输入、返回派生上下文、逆是恒等）。**isolation** 用 $\Sigma_{\mathrm{iso}} := (K\rightharpoonup R)\times((r:R)\rightharpoonup\mathcal{V}_r)$：$\rho$ 把键映射到域，访问 $k$ 先 $\rho(k)$ 再 $\sigma(\rho(k))$；`isolate` 派生上下文而不写共享表，`set` 仍是 $\mathfrak{E}^{*}_{\Sigma_{\mathrm{iso}}}$。**interception** 用 $\Sigma_{\mathrm{inter}}$：每个键带元数据幺半群 $(\mathcal{M}_k,\oplus_k,\varepsilon_k)$，访问时算 $\sigma(k)(d(k)\oplus_k\iota(k))$；合并右偏，$\iota$ 优先，于是外层上下文能约束一个组件如何使用某个余效应而不改这个组件。

### 统一：上下文范式与观察等价

**原文式 (29)**。把效应上下文的递归结构与余效应上下文合起来：
```math
\Gamma_\infty := \mu \Gamma.\ \Gamma \times (\Gamma \to \Gamma) \times \Sigma
```

逐项读法：三个投影分别是当前状态（递归）、本层逆累加器、携带依赖信息的余效应表。$\mathfrak{E}_{\Gamma_\infty}$ 映射回自身，$\partial$ 塔塌缩成一个自相似类型。两个后果：$\Sigma$ 吞掉了所有共享可变状态（$\mathcal{V}$ 无约束，任何要共享的状态都能编码成某个键），所以每次交互都可以经过同一个实体；而光有唯一实体还不够，所以每个键还配一组**余效应操作** $\mathcal{A}_k$，操作 $a$ 是 $X_a\to\mathcal{V}_k\rightharpoonup\mathcal{V}_k\times(\mathcal{V}_k\rightharpoonup\mathcal{V}_k)\times B_a$（前两段构成 $\mathcal{V}_k$ 上的效应函数，第三段是结果）。操作通过 lift 作用到 $\Sigma$ 上，只读写 $k$ 的绑定——「给 $k$ 的操作定型在 $\mathcal{V}_k$ 上，就是把它限制在 $k$ 的绑定上」，不需要额外侧条件。Definition 30 再定义**上下文中介的迭代器** $\mathfrak{I}^{\mathcal{A}}_\Sigma(S,P)$：最少包含单位元，并在续延都合法时包含 $k\in S$ 上的操作阶段（按结果选续延，所以后面的参数可以依赖前面拿到的结果）与 $k\in P$ 上的提供阶段（`set(k,v)`）。

§3.1 的恢复保证断言的是**状态相等**，作者立刻说这是理想化（§3.3.2，p23）：`free` 把块还给分配器，但不恢复 `malloc` 之前的堆布局；生成名不会被「丢弃它」的逆恢复，因为下一次创建会取一个新名。所以 §3 的等式都要模一个等价 $\simeq$ 来读，而 $\simeq$ 取**观察等价**：没有观察者能区分的两个状态就相关。形式化上，**测试**是有限字，字母是各操作的前向映射与产出的逆；两值不可区分当且仅当每个测试在两边都定义或都不定义、且结果相同；键上的等价就是它自己操作下的不可区分，记作 $\simeq_k$。Lemma 32 说每个 $\simeq_k$ 是等价关系、每个操作都尊重它、且它是最粗的这种关系；第 (2) 款同时是证明原则：要证两值相关，只需给出一个被所有操作尊重、且包含该对的等价关系。上下文层面 $\sigma\simeq_S\sigma'$ 要求 $S$ 内键上域相同、逐键值相关；Definition 34 把 $\simeq_S$ 沿类型构造子扩展（函数是「相关输入给相关输出」、积逐分量、`Maybe` 分情况、递归类型余归纳读）。函数与迭代器上的 $\simeq_S$ 只是**偏等价**（Lemma 35）：对称、传递，但不必然自反——自反性要求映射在每一对相关输入上都给相关输出，这正是「尊重」这个条件而非免费获得的东西。Lemma 38 把 $=$ 换成 $\simeq$ 后，§3.1 的每个状态等式仍成立，且从初始状态可达的每个状态的累加器都尊重 $\simeq$。这一段的意义不只是技术性的：**$\simeq$ 的粒度是一个设计变量**——接口发布的结果越少，关系越粗，越多操作被视为交换。

### 独立性：从局部保证到多组件

单个组件内，Theorem 16 只覆盖「在它自己那次应用产生的状态上撤销」。两种情形需要更强的东西（§3.4.1，p26）：一个逆可能在后续效应仍在的情况下被运行（从一个运行中的系统里移除组件）；一个序列可能交错多个组件的效应，于是一方的逆被另一方的应用隔开。两种情形下逆都会遇到被外来效应移动过的状态，「它是否仍能撤销它本该撤销的东西」就变成**交换性**问题。

迭代器会产生多个映射：可达的每次迭代的前向映射，以及它在每个状态上产出的逆。所以交换性要谈两个**集合**：`reach(i)` 是最少包含 $i$、对续延封闭的迭代器集；$\mathfrak{M}(i)$ 是 `reach(i)` 里每个迭代器的前向映射与产出逆生成的子幺半群；$\operatorname{len}(i)$ 是续延序下链长的上确界。Lemma 41 把检查降到生成元上：生成元两两交换则两个幺半群逐元素交换。

**原文式 (39–40)**。独立性有两条，缺一不可：

```math
\begin{aligned}
&\forall f \in \mathfrak{M}(i),\ g \in \mathfrak{M}(j).\ f \circ g = g \circ f\\
&\forall i' \in \mathrm{reach}(i),\ g \in \mathfrak{M}(j),\ \gamma \in \Gamma.\ \mathrm{pr}_{2,3}(i'(g(\gamma))) = \mathrm{pr}_{2,3}(i'(\gamma))
\end{aligned}
```

逐项读法：第一条是所有前向映射与所有逆（含外来逆）两两交换；第二条是**一方的变换不改变另一方「产出什么逆、接下来走哪一支」**，并且原文要求对调 $i$ 与 $j$ 后同样成立。第二条不是多余的：交换映射本身并不保证迭代器在被移动过的状态上产出同一个逆和同一个续延。作者还特意区分「$\diamond$ 下交换」与「独立」：前者只把两个顺序的复合前向/复合逆互相比，而每个逆进入复合时都是在**它自己那次应用产生的状态**上；独立性把一方每个变换与另一方每个变换配对，包括「前向映射配外来逆」。

**Theorem 43**（p28）：若 $e_1,\dots,e_n\in\mathfrak{E}^{*}_\Gamma$ 两两独立、按序从 $\gamma_0$ 应用，每个 $g_i$ 是 $e_i$ 在应用处产出的逆，则在序列到达的状态上按 $\{1,\dots,n\}$ 的**任意排列**应用这 $n$ 个逆，都能回到 $\gamma_0$。这就是「热拔一个组件」的理论依据——不必按 LIFO 撤，只要两两独立。

$\simeq$ 是模等价读的，这既让交换性可达（两个操作留下 $\simeq_k$ 视为相同的值仍算交换），也多要一样东西：操作还产出**结果**。两个操作独立，当且仅当它们的 lift 在每对参数上作为效应函数独立，**并且**一方的变换不扰动另一方产出的结果（Definition 44）。**Theorem 45**：不同键上的操作天然独立，因为每个生成元都是只读写一个键的映射。于是条件只在**同一个键内部**的键对上才紧。作者把它做成余效应自身的第三个组成部分（Definition 46）：一个键上的余效应 = $(\mathcal{V}_k,\mathcal{A}_k,\text{证明该键交换})$——与效应函数的见证平行，「每个见证证明的是消费者本来只能假设的条件；返回的逆在那里撤销，操作在这里交换；两者都在写定义的地方提供，而不是在使用的地方检查」。又因为 Theorem 45，这个义务只落在**提供该键的组件**上。

交换性可判定，也有反例：表类值（路由表、事件监听器）每次注册取自己的标识符、逆删掉那一条，任意顺序都留下对每个测试回答相同的表，所以交换；CRDT 给每次添加附唯一 tag 正是为此。有序链（middleware）不交换——插在另一个前面的 middleware 看到的是不同的请求。分配器按接口发布什么来分：句柄不被比较时，$\simeq_k$ 把两个堆按句柄重命名视为相同，分配交换（CompCert 关联程序与翻译后程序的内存状态正是这么做的）；地址按相等比较时，两次分配的结果能区分两个顺序，键就不交换。POSIX 自己画了同一条线：`mmap` 可返回任意未用地址、`creat` 可指派任意未用 inode，而 `open` 被要求返回**最低可用描述符**——仅这一条要求就让两次描述符分配不交换。

**Theorem 47**（p30）：若两个上下文中介迭代器的提供集与对方的操作键集不相交，并且两者有操作出现的每个键都交换，则两者独立。这是全篇的枢纽：**独立性（时间侧的条件）被归约到单键交换性（空间侧的性质）**。有了每个余效应都带见证，交换性假设由组件自己提供，只剩不相交性要逐对检查——而 §4 把它从两个组件的声明里读出来。作者把这种分解讲成一句话：**交换的部分由效应承担，顺序敏感的部分由余效应承担**。

### 演算：组件、纤维与九条规则

**原文式 (42)**。组件是一个三元组：$\mathfrak{C}_\Gamma := (d:\mathfrak{D}_\Gamma)\times(p:\mathfrak{P}_\Gamma)\times\mathfrak{I}^{\,d\cup p}_\Gamma$。逐项读法：$d$ 是要向环境要哪些键，$p$ 是可能提供哪些键（$p$ 之外的键它的效应函数不装绑定），$e$ 是在 $d\cup p$ 这些键上被见证的效应迭代器——见证的键集就是「这个组件自己的接口」，这是后面「每个组件的保证在它自己声明的键上读」的来源。

**纤维**（fiber）是组件的一次实例化，记作 $\langle d,p,e,\pi,\sigma,\tau,\theta\rangle$：$\sigma$ 是它自己的余效应表（激活前为空，激活中由它的效应写），$\tau$ 是退休标志，$\theta$ 是生命周期状态。$\Theta_\Gamma := \mathrm{Inactive}\mid\mathrm{Reloading}(i,g,\omega)\mid\mathrm{Active}(g,\omega)\mid\mathrm{Unloading}(g,\omega)$：$i$ 是剩余迭代器、$g$ 是已建立的累加器、$\omega$ 是已提交视图（每个声明键送到「提交时提供它的那条纤维的名字」）。两个稳定态是 `Inactive` 与 `Active`，两个过渡态是 `Reloading`（激活中）与 `Unloading`（去激活中）——真实运行时的 transition 是**跨一个区间**的，不是一步完成。**registry** 是 $F_\gamma:\mathfrak{N}\rightharpoonup\mathfrak{F}_\Gamma$，父指针构成以 `root` 为根的树；名字是原子：没有规则计算它、检查结构、或用相等之外的关系比较两个名字。

一个关键设计：**每个纤维拥有自己的表，所以余效应上下文是派生而非存储的**：$\sigma_\gamma$ 只并 `Active` 纤维的表。三个后果：不相交性让这个并是函数，每个键有唯一可能的提供者 $\operatorname{provider}_k(\gamma)$，由提供集固定而不由状态固定；一个纤维可以在撤下任何东西之前先停止提供；过渡中的纤维通过 $\omega$ 读余效应、不提供自己的任何键，所以「它已经写进去的键」还不算依赖者可以据此激活的键。

**九条规则**（§4.2，p34）。八条落在 Figure 1 的边上：`O-Insert`（取未用名字、父在 registry、组件合法、提供集与现有每条纤维都不相交，装入 `Inactive` 条目——最后这条是单源纪律）、`O-Remove`（要求已退休、`Inactive`、表为空、没有子纤维）、`L-Begin`、`L-Iter`、`L-Finish`、`L-Divert`、`L-Leave`、`L-Unload`。第九条 `O-Retire`（只要名字在 registry，就把退休标志置 `⊤`，无条件，因为退休是请求）只写退休标志、在四个状态上都适用，所以是四个自环，图里省略。

![Figure 1：组件生命周期。最左侧空节点表示纤维不在 registry 中；八条边对应八条规则，`O-Retire` 是省略的四个自环。来源：原文 p34，300 dpi 渲染页裁剪](assets/figure1-lifecycle.png)

激活把纤维带向它还没有的目标视图：`L-Begin` 进 `Reloading(e_n,id_Γ,ω)`；`L-Iter` 取一次迭代，把新逆按 $g\circ h$ 压进累加器（LIFO）；`L-Finish` 落在 `Active(g∘h,ω)`。去激活**不能一步做完**：一个因提供者要走而被拆的组件，正在跑 teardown，而 teardown 可能需要正在被撤走的余效应（关连接池通常意味着把连接交还给提供它们的东西）。所以规则把**决定**与**动作**分开：`L-Divert` 从 `Reloading` 把纤维路由进 `Unloading`，中止只发生在迭代边界，所以 divert 的粒度就是迭代器的粒度；`L-Leave` 从 `Active` 只记录决定、标 `Unloading`、停止提供，但保留自己的 $\omega$ 与别人的 $\omega$；`L-Unload` 在 guard $\neg\operatorname{relied}_n(\gamma)$ 成立时应用累加器、丢弃视图、回到 `Inactive`，它是**全演算里唯一应用累加器的规则**。guard 按**绑定**而非按纤维施加：声明了 $n$ 的键以外的键的纤维不算障碍，在另一个域里解析同一键的也不算。

目标视图 $\operatorname{target}_n(\gamma)$ **不是布尔**，而是「每个声明键当前由哪条纤维提供」这张总表；退休或依赖不满足时为 $\perp$。$\operatorname{quiet}(\gamma)$ 要求每条纤维都停在它的目标视图上。记录**提供者而不是值**是关键取舍：否则「另一条纤维提供了相等的值」会被比较成相等。由此得到一个对使用者有直接影响的行为：**提供者原地覆写自己的绑定不会被观察到**——想让替换传播，必须撤回绑定再重新装。confinement 则规定一个效应函数能碰什么：写侧只允许越出自己表的唯一一种写（声明键的值住在提供者的表里，对声明余效应做操作就是移动它的表），读侧只能读它声明的值；它不能读写声明之外的任何表、任何控制字段。这正是「组件不能根据它没声明的纤维的生命周期状态分支」的形式化。

### 五组元理论结果

§4.3 是全篇技术核心。作者先把每一步分解成 $\gamma_{t+1}=edit_t(\Psi_t(\gamma_t))$（$\Psi_t$ 是状态映射、$edit_t$ 只写控制字段），于是「哪些写属于谁」可以逐字段对账；再把状态关系 $\simeq$ 定义为「registry 上按 §3.3 的关系、域相同、每个纤维的控制字段逐个相关」，规则只通过它保留的观察来读状态。五组结果的**前提与完整陈述**见 `audit.md`，这里是主干：

- **保持性**（Thm 64，p43）：在 registry 良形的前提下，九条规则都保持四条不变式（父指针落在 registry、提供集两两不交、已安装纤维的视图在其声明上全定义且取值于 registry、视图指向的纤维已安装）。
- **恢复精确性 + 终止恢复**（Thm 68、Cor 69，p46）：在一次 episode 内、且涉及的纤维两两独立时，在任意交错之后跑 $n$ 的累加器，等于「把中间别的纤维那些步照做、但 $n$ 从未开始」：$g^u_n(\gamma^u)\simeq_K(\Psi^{t_l}\circ\cdots\circ\Psi^{t_1})(\gamma^b)$。读法有前提：`[b,u)` 内没有 $n$ 实例化的纤维走步。卸载后表为空，且状态等价于「没有 $n$」。
- **排序与 resolution coherence**（Thm 70、Thm 71，p47–48）：①只在依赖被提供处开始 transition；②提供者的 episode 严格包含消费者的 episode；③消费者活跃期间，键的值只在声明该键的纤维的操作下移动；一次 transition 只对**一份** resolution $\omega$ 跑，目标中途变了要么落在 `Active(-,ω)`，要么 `L-Divert` 走 `Unloading` 并按 Cor 69 精确恢复。
- **进展**（Thm 73，p49）：在 $\prec$ 无环、$\operatorname{len}(e_n)\le K$、名字集有限三个前提下，系统无死锁（`¬quiet` 时必有生命周期规则可用）且终止。
- **合流**（Thm 80，p54）：在每个组件 total on provision 的前提下，动态历史无痕——任何到达静息态的序列都能重排成「按依赖序各加载一次」的规范序列，两条这样的序列在重命名后 $\simeq$ 相等。

### 与已有做法的结构差异

- **追踪的位置**：monadic effect 把程序写进 effect 类型、由解释器满足 requirement；Cordis 把追踪叠加在普通宿主代码上，逆由调用者在应用点提供，提供者来去时重新解析需求。
- **可逆性的范围**：dagger arrows / inverse arrows 要求全局、双侧的可逆性；Cordis 只要求每个原子效应有单侧逆，复合的逆由复合导出。
- **横切的范围**：AOP 的 pointcut 无意识且量化；Cordis 的横切限制在组件声明的余效应上，范围恰好是声明面，因而确定、可追溯。
- **生命周期的归属**：OSGi DS 一类靠手写去激活回调、同步执行；Cordis 由组件效应承载横切、卸载时撤销，并用异步 `Unloading` 状态把 teardown 跑完再响应后续变化。

---

## 主要结果

这是一篇证明型论文，没有实验章节。结果要分三层读：**局部代数**、**多组件演算**、**证据性质**；各定理的完整前提与证明读法见方法节的五组结果与 `audit.md`。

- **局部可逆性成立**：任何组件施加的效应函数序列，累加器把它带回起始上下文（Thm 7）；按逆序撤销时每个逆拿到它自己那次应用跑过的状态（Thm 16）。这是「组件内部能干净卸载」的代数基础，不依赖其他组件。
- **热拔成立**：两两独立的效应，其逆可以按任意排列应用而回到初始状态（Thm 43）。而独立性又被归约到单键交换性：不同键天然独立（Thm 45），同键的交换性由提供者在定义处见证（Def 46），剩下的只有提供集/需求集的不相交性（Thm 47）。这把「时间侧」的条件变成了「空间侧」可检查的性质。
- **交错后的恢复是精确的**：在定理前提下，跑累加器的结果等于「别的纤维照做、它从未开始」的等价状态（Thm 68）；卸载后表为空、状态等价于它不存在（Cor 69）。恢复在 $\simeq$ 与系统边界之内完整，不是物理状态的一字不差。
- **响应式排序正确**：消费者只在依赖被提供后激活，提供者的 episode 严格包含消费者的 episode，消费者活跃期间其键不被别人移动（Thm 70）；一次 transition 不跨两份 resolution，目标中途变化时要么完成、要么精确回退（Thm 71）。这解释了为什么去激活可以先停止提供、再等依赖者卸载。
- **系统会静息，且静息态与历史无关**：在定理的全局前提下无死锁并终止（Thm 73）；任何到达静息态的历史都能重排成规范序列，结果在重命名后等价（Thm 80）。合流说的是**状态**，不是沿途产生的 emission。
- **证据性质**：Cordis 的三层实现（核心库、组件加载器、应用框架）把上述原语落成一条 `ctx.effect` 与十个算法；Koishi 的 4000+ 社区插件、四年开发是**存在性与采用度**证据，作者明确说不是定量比较，且 Koishi 线上跑的是 Cordis v3、本文形式化的是 v4。全文没有 benchmark、吞吐、延迟或开销的实测数字。

---

## 边界与局限

**作者明确讨论的**：
- 没有定量评估：开销与开发效率的度量是 future work（§5.3，p70），全文没有本文自己测得的延迟、吞吐、内存或开发者效率数字；案例又是单一生态、单一宿主语言、观测性而非受控比较，Koishi 用 v3、本文形式化 v4（p69 脚注 4），核心组合模型两版共享。
- 「完整恢复」是在 $\simeq$ 与系统边界之内完整：物理状态不可原样恢复（堆布局、生成名）；边界外的 emission 只能 withhold 或 compensate，补偿的等价更粗、需要重新证明交换性（§3.3.2、§6.1）。
- 进展依赖 $\prec$ 无环、$\operatorname{len}(e_n)\le K$、名字集有限；合流依赖 total on provision；失败扩展必须把失败纤维排除在合流之外。单源纪律把「一个组件多次实例化」限制在不提供键的组件上；依赖链接只有键身份，接口漂移与键冲突没有解决（§6.6）。

**读者根据证据提出的判断**（不是作者结论）：
- **最大的理论与实现落差是「见证不被检查」**：逆真的撤销、同键操作真的交换，在实现里都是组件作者的义务，运行时只信不验；无环、名字有限、链长有界、total on provision 也同样不由运行时检查。所以「结构保证」实际是「结构 + 作者义务 + 未检查的全局假设」。
- **`notify` 的全量扫描是可扩展性隐患**：每次绑定变化都遍历全部纤维，论文既没给索引方案也没给实测。
- **本文对 agent harness 是动机而非证据**：§1.2.2 的论证有说服力，但 §8 把在自演化 harness 里验证列为未来方向，全文没有 harness 实验。

---

## 与其他工作的关系

- **与 DeepSeek Harness 系列（00221 / 00222《Super-agent 设计探索》）**：那篇讲 agent harness 的组件化与自我修改；本文把「自演化 harness」当作核心动机，且第一、第三作者署名 DeepSeek-AI。两篇是概念上的咬合，不是引用关系（本文没有引用那篇微信文章）。
- **与 Harness²（00220）、Self-Harness、HarnessX（00199）**：那些在任务层面改 harness 并测分；本文在运行时层面给组合语义、不做任务评测。HarnessX 标题里的 "Composable" 指 harness 模块的类型化组合，本文指效应可撤销、依赖可重解析——两个「可组合性」不是同一个词。
- **与 vLLM / SGLang（00086 / 00164）**：都关心组件边界与资源生命周期，但那两篇的边界是显存与请求调度，本文的边界是语言级上下文与系统边界（§6.1）。
- **旁证（非本仓库条目）**：Cordis 仓库的 homepage 指向 DeepSeek Harness 文档的 Cordis 入门页，页面把 Cordis 描述为「以 vendor 方式引入的插件框架」；该线索比论文本身更直接，但未验证它与论文 v4 语义的对应程度。

<!-- 复核档案见同目录 audit.md（不随站点发布） -->
