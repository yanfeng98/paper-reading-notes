# Subagent 折叠 — 复核档案

> 本文件是维护性档案，不参与站点构建；读者版正文见同目录 `note.md`。

## 来源与版本

- **标题**：Building agents: When to fold subagents into your main agent loop。本次未发现官方中文版：`/zh-CN/…` 返回 404，`/ja/…` 返回的仍是英文正文；页面无 hreflang 链接，语言切换是站点级入口，其他语言正文未取回。
- **作者**：Diane Sarkis（站点仅署姓名；文中以 "the Applied AI team" 的第一人称复数叙述经验）。
- **站点**：<https://claude.com/resources/articles/building-agents-when-to-fold-subagents-into-your-main-agent-loop>，产品线标注 Claude Platform；分类 Best practices / Perspectives。
- **仓库编号**：**00219**（非论文条目，与论文共用序列；无 PDF 可归档，README 编号列直接指向原文地址）。
- **发布日期**：2026-10-22（站点元数据；站点标注阅读时间 18 min）。阅读日期 2026-10-28。
- **版本锚点**：页面无版本号、无更新记录，`…/article.md` 之类的 markdown 直链返回 404。本档案记的是 2026-10-28 抓取的页面：取 `<article>` 区块，标签替换为空格、解 HTML 实体、连续空白折叠为单空格后为 **18,577 字符**（含标题、导语与元信息行），sha256 `5ed796580193d78f40c6f9146a4a97e22dea2ee2213c31c40cc22a2cff5fe366`（按同一口径重抓可复算；复核时重抓结果一致）。
- **许可**：文章页面未标注许可；配图为 `assets.claude.com` 上的 GIF/PNG，页面同样未标注许可，故本笔记不复制任何配图。配套工具仓为 **Apache-2.0**（GitHub API `license` 字段 + 仓库 `LICENSE`，11,358 B）。
- **未核**：文中关于模型的表述（"Opus 4.5 起……"、"Opus 5.5 与 Fable 5.1 无法关闭 thinking"）没有给链接或数据，本笔记只按原文转述；`/skill-creator` 不在 Claude Code 内置命令表里，工具仓 README 说它是插件（`/plugin install skill-creator@claude-plugins-official`），本轮未安装验证；两张 Mermaid 图最初只做了语法与 GitHub 围栏识别检查（`npx` 安装 mermaid-cli 超时），站点排障时已用本机 Playwright Chromium 实际渲染验证。

## 阅读范围与核对手段

- **阅读范围**：正文全文（引言、五节正文、结尾，含 3 张配图所在段落的上下文）。配图未复制、未做像素测量。
- **交叉核对**：① 配套工具仓 [`anthropics/single-agent-loop-kit`](https://github.com/anthropics/single-agent-loop-kit)：`release` 分支的 `README.md`、`reference_loop/loop.py`、`skill/steps/00-audit.md`、`skill/steps/03-fold.md`、`examples/support-desk/example-run/README.md` 与 `example-run/plan/inventory.tsv` 取回并逐条比对（重点核对了审计判决表、阈值动因、提示的五个去处与预算/写闸门实现，未逐行通读全文）；同目录的 `results/`（24 条打分记录）、`PLAN.md`、`as-tool/` 与 diff **未逐份读完**。② 文中"系统提示减少 80%"的出处 [claude.dev 上下文工程文](https://claude.dev/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models/) 全文（核对 80% 原句与渐进披露相关削减）。③ 文中引用的 [commerce agents 指南](https://claude.com/resources/articles/the-anatomy-of-effective-commerce-agents) 全文。④ Anthropic 2026-01 的 [多智能体系统指南](https://claude.com/resources/articles/building-multi-agent-systems-when-and-how-to-use-them)（重点核对三条条件、3–10x token 成本与 20+ 工具阈值）。⑤ Claude Code 命令文档（核对 `/skill-doctor`、`/claude-api` 是否存在）。

### 证据层级一览

| 主张 | 原文依据 | 证据层级 |
| --- | --- | --- |
| 单 agent + skills 在质量上常胜过"全塞一个提示"和"subagent"两种设计，成本与延迟常更低 | 转引 commerce agents 指南的"several enterprise deployments" | **厂商经验，无数字、无任务分布**；本篇与被转引的 commerce 指南措辞强度还不一致（见"表述张力"） |
| 多 agent 架构的复杂度带来延迟，某客户对比单循环"快约 2x" | 一家客户自评 | **单案例**，未说明模型、任务、p50/p99、是否同预算 |
| Claude Code 对更高级模型的系统提示削减了 80% 以上 | 链接 claude.dev 文 | **可核到另一篇官方文**（该文原句："removed over 80% of Claude Code's system prompt for models like Claude Opus 5 and Claude Fable 5 with no measurable loss on our coding evaluations"），仍是内部工程数据 |
| 从 Opus 4.5 起模型能在单循环里承担更多 | 无链接、无数据 | **厂商判断** |
| 系统提示里工具定义超过 30–50 个后，工具选择开始退化 | 无出处 | **经验阈值**；与 Anthropic 九个月前那篇的"常常 20+ 就难以选择"不是同一个阈值 |
| 折叠一个 subagent 后延迟下降但流程断裂，两次运行只翻车一次 | "a sample support agent" | **单案例 + 作者自述**；但这条正好说明"看翻转任务 + 重复跑"的必要性 |

> 全文可测量的量化结果只有两个（2x、80%）；其余数字是阈值、建议值或案例规模。

## 复核记录

2026-10-28 按 check-paper-note 复核。基准：同日重抓页面，按 `<article>` 去标签 / 解实体 / 空白折叠口径复算得 18,577 字符、sha256 `5ed7965…`，与首读一致（页面未更新）。方式：①笔记内全部英文引文与 6 个 `§` 小节（7 处引用）按 `<h2>` 分段逐条检索；②工具仓 `release` 分支的 `README.md`、`loop.py`、`00-audit.md`、`03-fold.md`、`templates/PLAN.md`、`example-run/README.md`、`inventory.tsv` 逐项比对；③commerce 指南、2026-01 多智能体文、claude.dev 文重取原文核对关键句；④另派独立子 agent 审计（快照 md5 `bbf0121800de…`）。

本轮修正：①示例仓的 24 条打分记录仍在 `results.jsonl`、`compare.py` 可离线打印，原写"只能自己复跑"错误；②Break map 实际在 `templates/PLAN.md` 而非 `03-fold.md`；③"导语比正文强"方向不成立，改为"导语省略三条例外"；④"差了两个数量级"改为 10–90 倍（1–2 个数量级）；⑤补入"单循环需要纪律"、终局论证、"走多 agent 时从最简模式开始"、客户案例与作者自用 subagent；⑥"19 行"改为 19 个任务行 + 汇总行；⑦tool owner 标为本笔记补充；⑧"量化只有两个数字"改为"可测量的量化结果只有两个"。

未修/未核：`/skill-creator` 未安装；`example-run/results/` 只核了文件规模与样例行，未逐份读；未运行工具仓代码。另（同日站点渲染复核）：图 2 的 `1.`/`3.`/`4.` 标签在站点 `htmlLabels:false` 下（这几条标签较宽）触发了 Mermaid 11.12 的 `splitLineToFitWidth does not support newlines` 错误、整页渲染失败，已把标签改为 ①②③④，并用无头 Chromium 复验两张图均渲染通过。

## 原文的表述张力与证据缺口（整节）

1. **导语省略了正文的三条例外。** 页面导语（standfirst/description）只写"用更少的 subagent……可以提升质量，同时降低成本与延迟"，没有带正文的三条 keep 条件；单看导语容易把结论读成无条件的。不过导语用的是 "can"，正文的 "frequently outperformed" 在结论强度上反而更硬——两处口径不同，引用应以正文为准。
2. **转引的强度被下调。** 本篇写"a single agent with skills frequently outperformed…"，而它链接的 commerce 指南原文是"consistently has outperformed"。同一组内部对比，两篇给了不同强度的措辞；两篇都没有给任务数、模型、成本口径。
3. **"2x 更快"没有口径。** 只有"一家客户"、"多 agent harness vs 单 agent loop"、"roughly 2x faster runtime"；没说是 p50 还是 p99、是否同预算、是否同模型、是否同 eval。它只能当"方向性轶事"。
4. **"质量"没有定义。** 全文反复出现 quality，但没给指标；eval 一节只建议"用 rubric 给最终消息打分"作为起点，并未说明那组跨部署对比用的是哪种口径。成本也没说清是 per task 还是 per turn。
5. **模型表述无法核。** "Opus 4.5 起"、"Opus 5.5 与 Fable 5.1 无法关闭 thinking"没有链接，属于厂商对自家模型的说法，本轮未独立验证。
6. **"modular permissioning" 与后文的权限做法互相抵消。** 开头把"模块化权限"列为 subagent 的优点，后文却建议把权限检查放进 tool（每个 tool 自己检查调用者能看/能做什么），于是一个循环就能服务不同权限的用户——那"按权限拆 agent"这个理由就淡了。原文只是把两件事分别陈述，并没有把它们设为对立（**本笔记判断**）：实践中**权限更像 tool 的属性，而不是 agent 的属性**。
7. **加载技能要花一轮，与"更低延迟"存在张力。** 文章主张折叠降低延迟，但 skill 的按需加载要一次模型轮次（commerce 指南明说 "Loading a skill costs a model turn"），tool search 也要先取 schema 才能调真正的工具。折叠省掉的是嵌套循环与重复上下文，付出的是加载轮次与增长的前缀；净收益依任务而定，不能从架构直接推出。
8. **示例仓修正过记录。** `example-run/README.md` 明确写：跑完后**删掉了"测量结果与由此得出的结论"**，零售商名字也换过，其余记录未改、也没重跑。所以 write-up 里看不到汇总结论；但 `results/baseline/results.jsonl` 的 24 条打分记录仍在，`compare.py` 可直接从日志打印对比（不需要重跑），README 也给了命令。缺的是作者对这些数字的解读，而不是数字本身。

## 配套工具仓（原节）

文章开头就用斜体提示：如果你已经在 Claude Platform 上建了多 subagent 的 agent，可以用配套的 [migration kit](https://github.com/anthropics/single-agent-loop-kit) 跑一个引导式流程，识别模式、评估替代方案、验证最佳方案，并且**先在 mock 系统上试**。

核过的事实（2026-10-28，GitHub API + 仓库文件）：

| 项 | 值 |
| --- | --- |
| 仓库 | `anthropics/single-agent-loop-kit`，公开，默认分支 `release`（不是 `main`——`main` 上的 raw README 返回 404） |
| 许可 | Apache-2.0 |
| 时间 | 创建 2026-10-15，最后 push 2026-10-21（文章发布前一天） |
| 定位 | README 用引用块注明"**Reference implementation. Not maintained and not accepting contributions.**"；并写明"The kit does not assume a single loop always wins. It measures." |
| 结构 | `skill/`（`SKILL.md` + `steps/00-audit…05-upkeep` + `scripts/coupling_map.py`、`compare.py`、`chain_coverage.py`、`estimate.py` + `templates/`）、`reference_loop/loop.py`、`examples/support-desk/`（改前 `app/`、改后 `single_loop/`、真实运行记录 `example-run/`）、`tests/` |
| 十分钟试用 | `cd examples/support-desk && KIT_MODEL=fake python3 evals/run_eval.py --variant smoke`，不需要 API key、不花钱；会为 19 个任务各打一行，随后是汇总行 `smoke: 19 tasks ran on the offline stand-in model, 0 harness errors. The plumbing works.`（stand-in 按关键词规则走，**不计分**） |
| 它自己的缺口清单 | README 明列 **未在真实模型上跑过** 的部分：合并步骤与 upkeep 步骤、未跑过完整的 `single_loop/` 版本、未跑过 t18/t19、未从"没有 eval 的仓库"起步、未在示例之外的系统上跑过；两次运行之后措辞改过、改写后的步骤还没有任何会话走过；另列 4 类"两次运行后才改、只做了离线验证"的改动（参考循环、skill 加载器、脚本、示例） |

### 参考实现里的具体参数

`reference_loop/loop.py` 是文章主张的可读实现（Apache-2.0，作者写明"Copy the parts your harness is missing."，不是框架）。它把"限制放 harness"落成了这些具体机制：

| 机制 | 实现（`loop.py`） |
| --- | --- |
| 轮次/token 预算 | `Budget(max_turns=25, max_tokens=400_000, max_batch=16)`；token 预算把输入+输出、含 cache 读写一起计入，并在一次 `run()` 内累加 |
| 子 agent 计入预算 | 运行 subagent 的 tool 用 `charge(usage)` 把子 agent 的用量记到同一预算上；返回 `False` 时子 agent 就停 |
| 批量并行 | 读类工具最多 8 个线程并行；写类工具串行、按模型请求顺序执行；超过 `max_batch` 的调用直接收到错误结果，请模型下一轮再发 |
| 写闸门 | 只要有 tool 声明 `writes=True` 而没传 `approve` 回调，构造时就报错（默认拒绝，而不是默认放行）；被拒绝时回一句"用户拒绝了，不要重试，问他想怎么做" |
| 渐进披露 skills | 系统提示里只列 `名字: 描述`，另加一个 `load_skill` 工具返回正文；同名 skill 直接报错，指向目录外的 skill 也报错 |
| 渐进披露 tools | `deferred=True` 的工具用 `defer_loading` + 一个 BM25 tool search 工具按需取 schema；不允许全部工具都 deferred |
| verifier | 可选回调；被拒两次就扣下回答（`verify_failed`），只给一次改正机会 |
| 中断处理 | `pause_turn` 继续下一轮（服务端工具如 tool search 需要）；`refusal`/`max_tokens`/上下文超限时，把被截断的工具调用补上"未执行"结果，否则对话无法继续 |
| 缓存 | 默认给请求加 `cache_control: ephemeral`，让增长的前缀从缓存读 |

这些数字是**工具仓的默认值，不是文章的处方**——文章只说"设置轮次与成本预算"，没给具体数额。把它们当起点，而不是标准。

### 提示的五个去处（`03-fold.md`）

配套仓把"拆一个 subagent 的提示"写得更狠，逐行判定五个去处：流程/领域知识 → skill 正文；硬限制 → 移进 tool 里强制执行（skill 仍可解释规则，让 agent 能解释结果）；事实与参考资料 → skill 内的参考文件或查询 tool；语气/人设/问候 → **删掉**（声音由主系统提示统一拥有）；写给旧模型的指令（大喊、think step by step、提醒用工具）→ **删掉**。若正文什么都不剩，"那就没有 skill"——薄 subagent 常常只变成 tools，这是好结果。

### 审计输出的样子（来自示例，不是生产部署）

`example-run/plan/inventory.tsv` 是一个 mock 客服系统（router + 6 个 subagent）的审计结果，正好把五种判决都用上了。它记录的是 2026-10-08 用 `claude-opus-5`、每个 variant 两次重复、12 条任务（`results/baseline/results.jsonl` 里 24 条打分记录）的一次运行；另有一次 17 条任务上的 as-tool 运行。分数保留在 `results/` 的日志里，被删掉的是 write-up 里的汇总结论：

| agent | 每次调用读入（中位） | 流量占比 | 判决 | 依据 |
| --- | --- | --- | --- | --- |
| router | 不在 trace 里 | 100% | `main` | 每轮都路由、并且重写 specialist 的摘要；提示里写着"禁止自己回答" |
| orders | 926 tokens | 56% | `merge:shipping` | coupling map 显示 orders→shipping 出现在 96 条 trace 里、耦合 100%，且都是小读、只读工具 |
| shipping | 763 tokens | 48% | `merge:orders` | 每次 shipping 调用都紧跟 orders；它需要的 tracking id 只有 orders 能返回 |
| returns | 2,674 tokens | 25% | `fold` | 提示是固定流程 + 三条 API 上的政策，没有大读 |
| account | 1,056 tokens | 15% | `fold` | 两行规则套三个 API，读入很小 |
| diagnostics | 31,164 tokens | 12%（占 subagent 时间 31%） | `as-tool` | 后端返回 900 行日志，其中只有约 7 行有用；一次简要就能交回结果 |
| claims | 3,177 tokens | 5% | `keep` | 由外部保险公司（Harbor Mutual）拥有提示，且要求 transcript 是客户与该 agent 自己的对话；需要与用户多轮交互 |

这张表的密度比文章正文高得多：**判决不是按"团队"给的，是按"读入多少 token、和谁连跑、要不要自己对话"给的**。`diagnostics` 那条尤其值得记：31k tokens 的中位读入才是它保住独立上下文的理由，而"日志太长"本身不是——审计记录自己把它标成 open："a filtered log tool could make this a fold"，也就是说判别标准应当是"过滤之后主 agent 还需要留下的量"。

### 配套命令（原文 §"Tools to accelerate this work"）

| 命令 | 用途（原文） | 对应步骤 |
| --- | --- | --- |
| `/claude-api build-eval` | 建第一套中央团队拥有的端到端 eval，或每个团队随 skill 交付的小集 | 第 1 步 |
| `/claude-api prompt-audit` | 找出提示、skill、tool 描述里"写给旧模型"的指令，以 diff 形式提修改建议；可对系统提示与各团队的 skill 分别跑 | 第 4 步 / 收尾（提示只减不增） |
| `/claude-api hillclimb` | 对着已有 eval 迭代改进——折叠后让它在 skill 与 tool 描述上迭代，看折叠版能否追平或超过原 subagent；也可用于系统提示 | 第 4 步 |
| `/claude-api cost-optimize` | 分析调用花在哪，逐项提出 prompt caching、裁剪输入输出 token、effort、模型选择等节省项，一次改一项 | 设计稳定之后 |

`/claude-api` 及其 `build-eval`、`hillclimb`、`prompt-audit`、`cost-optimize` 子命令已能在 Claude Code 命令文档中查到；配套仓 README 的说明是"The steps hand off to these Claude Code commands instead of rebuilding them."

### 折叠省下了什么、又付出了什么

原文的对照是"交接成本" vs "上下文增长"。可以把它写成更清楚的一笔账（**本笔记的整理，不是原文表述**）：

- **省下**：每次交接的一次嵌套模型循环（多轮请求 + 自己的系统提示）、跨 agent 的上下文重复、以及把结果压成摘要时丢掉的细节。
- **付出**：主上下文随任务推进单调增长，每轮都要重读；技能/工具的按需加载本身**要花一次模型轮次**（commerce 指南写得很明确："Loading a skill costs a model turn"）。tool search 也一样：模型要先调检索工具取 schema，才能调真正的工具（**本笔记推断**；机制见 `loop.py` 把 tool search 作为工具插入请求）。

## 与 Anthropic 既有指导的关系（原节）

这是理解全文定位的关键：**它不是推翻九个月前那篇，而是把边界收紧并给出退路**。

Anthropic 2026-01-23 的《Building multi-agent systems: When and how to use them》给了三条"多 agent 稳定胜出"的条件——上下文污染、可并行、专业化改善工具选择——并说"在这三种情形之外，协调成本通常超过收益"，同文已经链回本篇（"See when to fold subagents back into the main agent loop"）。（本笔记的对照）本篇的三条"仍该用 subagent"的条件与那三条同源，没有新增条件；真正的变化落在判据的量级与措辞上：

| 维度 | 2026-01 文 | 2026-10 本篇 |
| --- | --- | --- |
| 上下文隔离的触发量 | "subtask 产生超过 1,000 tokens 的高上下文量、且大部分与主任务无关"时最有效 | "单次调用读到数万 token 才算，几千不算"（工具仓 `00-audit.md`）；正文只写"可测量的上下文膨胀导致性能下降" |
| 工具过多的阈值 | "一个 agent 工具太多（常常 20+）就难以选择" | "超过 30–50 个工具定义后，工具选择开始退化" |
| 多 agent 的 token 成本 | "同等任务通常多用 3–10x tokens" | 未重复该数字，只提嵌套循环加延迟 |
| 主结论 | 先单 agent，三种情形才上多 agent | 已在多 agent 上的，按 eval 逐个折回 |

两篇都把边界写得很明确，所以这不是"翻案"，而是**同一条判断线在模型变强后向单 agent 一侧移动**。真正值得注意的是这个移动的**速度**：九个月里，"1,000 tokens 就值得隔离"（2026-01 文）变成"几万才值得"（2026-10 的判据出自配套仓的审计步骤，正文没给数字）。两者口径不完全相同——前者说的是"上下文隔离最有效"的场景，后者是"够格拥有独立上下文"的门槛——但量级从千级升到万级（约 10–90 倍，即 1–2 个数量级）。若按这个速度外推，今天写死的阈值一年后大概都失效——所以文章结尾那句"测量、一次只改一件事"比任何具体阈值都更耐用。

### 多团队怎么继续往一个循环里贡献（原节）

这一节回答的是"折成单循环之后，团队自治去哪了"。作者的答案是：**所有权从 agent 迁到 skill / tool / 知识库，中央团队保留系统提示与端到端质量**。

| 载体 | 适用条件（原文） | 关键做法 |
| --- | --- | --- |
| **MCP tools** | 需要执行动作、读实时数据、或返回固定形状的结果 | **按用户意图分组，而不是一个 API 一个 tool**；"系统提示里的工具定义超过 30–50 个，工具选择就开始退化"；用 tool search 做延迟加载；**把硬前置条件放进 tool**（Y 需要 X 的输出时，Y 自己检查并返回一句模型能照做的指令）；**权限也放进 tool**——每个 tool 检查调用者能看/能做什么，返回一句模型能读懂的拒绝，于是一个循环就能服务不同权限的用户，不必按权限级别各建一个 agent；迁移期也可用 tool 继续调 subagent |
| **Skills** | 需要知道"一个团队怎么做事"——即原先写在 specialist 提示里的步骤、规则、判断 | 每个 skill 有团队 DRI，保证写得对、彼此不重复、自带 eval；让 Claude 参与维护（"skills that can build, test, and prune other skills"）；`/skill-creator` 起草与审计，`/skill-doctor` 看每个 skill 的上下文成本与实际使用频率、清理死重 |
| **知识库** | 只是偶尔需要的参考资料（政策、指标定义、产品规格） | 放在搜索/查询 tool 后面，或作为 skill 内的参考文件；**不要用代码把上下文检索出来再粘进提示** |

组织侧的两条硬约束：

- **中央团队要小**：拥有端到端质量与系统提示，新 tool、新 eval 上线前都要审；小才能迭代快、跨大组织的协调成本低。
- **每个 skill 有单一 owner**：原文要求每个团队设 DRI 拥有自己的 skill。**tool 也应有单一 owner**（本笔记补充；配套仓的审计表就带 owner 列，未知时允许写 `unknown`）。否则就是另一种 sprawl——只不过从 subagent sprawl 变成 skill sprawl。

> **解读（本笔记）**：这套安排实际上是把"模块边界"从进程/上下文搬到了**文件与接口**：skill 是有 owner 的文档，tool 是有 owner 的 API，eval 是随交付物一起提交的测试。文章没说但很关键的一点是：**这三类交付物都必须可评审**，否则中央小团队会变成瓶颈。配套仓的 `templates/` 里给了 contribution rules 的模板，算是补上了这一块。

## 适用边界与落地清单（原节）

### 适用边界：什么时候别折

文章明确说 subagent 仍有其位置，包括研究前沿；它给出的三条"仍该用 subagent"的条件，配合工具仓的判据，可以整理成一张决策卡：

**保留独立上下文，需要满足其中一条（工具仓要求逐条写出证据）：**

1. **上下文**：它读的远比主 agent 之后需要留下的多（数量级：单次数万 token；几千不算）。**先问"让工具少返回一点"能不能解决**——能的话更好的方案是 fold + 更好的 tool。
2. **并行/独立工作**：多个干净上下文分头探索以换取覆盖度，或由一个在**看不到生成过程**的前提下检查另一个的工作。
3. **工具过载或指令冲突**：全部加载时主 agent 可测量地选错工具，或指令真的互相矛盾。

**如果最后仍走多 agent 路线**（原文在渐进披露这一节末尾给的退路）：从能工作的最简单模式开始——generator-verifier、orchestrator-subagent 或其他；切分按上下文，好的候选是独立研究路径、接口清晰的分组件、黑盒验证，这些几乎不需要系统其余部分的信息。

**不构成理由（工具仓明确列出）：**

- 公司内部另一个团队拥有它 → 所有权迁给 skill + 它的 eval。
- 它有自己的"人格/声音" → 一个 agent 应该只有一个声音。
- 它的提示很长 → skill 正文只在需要时加载。
- 它的工具很多 → tool search 按需加载。
- 它的步骤是固定的 → 固定步骤是工作流，是普通代码；固定部分进 tool，仍需判断的部分进 skill。

**工具仓还给了 `keep`（完整 handoff）的窄口子**：只有"必须自己与用户多轮对话"或"由外部方控制（另一家公司、合同、监管）"时才用；其余落在 `fold`（默认）或 `as-tool`（需要保留独立上下文、且能一次简报交回结果）。

> **补充（本笔记，非原文）**：还有几类边界文章没覆盖但实践中常见——(a) **合规隔离**要求"某个域的上下文不得进入主上下文"（不是性能问题而是数据边界问题）；(b) **故障隔离**要求某个不稳定组件不能污染主循环；(c) **成本硬上限**按子任务计费时，独立循环更容易归账。这些理由与"模型够不够强"无关，折叠也解决不了。

### 落地清单

| 步骤 | 产物 | 验收信号 |
| --- | --- | --- |
| 1. 盘点 | 每个 agent 一行：owner、提示大小、工具数、调用方式（handoff/tool_call/pipeline/entry）、返回形式、是否直接对用户说话、每次读入 token、流量占比、连跑对象、覆盖它的 eval、判决与证据 | 每个判决都有文件行号或 trace 数字；`unknown` 允许，猜测要标 `(inferred)` |
| 2. 打分 | 端到端 eval（中央团队拥有）+ 每个 skill 自带小集 | 每条生产链路有任务；每条"不能破的规则"有任务；会查路由准确率 |
| 3. 合并 | 合成后的领域 agent | 主 agent 只少一项，先拿到一次"少一次交接"的收益 |
| 4. as-tool | 统一返回 schema 的 subagent 工具 | 主 agent 能核对结论；拿到 fold 的基线分 |
| 5. fold | 一个 skill（描述写清"何时加载"）+ 若干按意图分组的 tool | 同一 eval 有/无对比；**看翻转任务**；每条任务跑 ≥2–3 次；提示变短 |
| 6. 收尾 | 删路由、删旧模型专属指令、清 dead skill | 系统提示只减不增；`/skill-doctor` 显示 skill 使用率与成本；工具定义控制在 30–50 以内，或已用 tool search |

## 待确认问题

1. **"可测量的上下文膨胀导致性能下降"具体测什么？** 文章给了条件却没给指标（长上下文准确率？任务完成率随轮次的斜率？），也没有"到什么程度该拆"的数值。这一条不解决，"什么时候该保留 subagent"仍然靠感觉。
2. **2x 延迟来自哪里？** 是省掉了嵌套循环的轮次、省掉了跨 agent 的重复上下文、还是省掉了路由的分类调用？拆不开就无法迁移到别的系统。
3. **折叠后主上下文的增长成本谁来兜？** 文章只在纪律要求里点了"deliberate handling of context windows, memory, and note-taking"，没有展开具体手段（prompt caching、压缩、会话切分）；commerce 指南里那套"global/session/volatile 三段 + 缓存断点前移"是否适用于单循环长任务，本篇没有回答。
4. **中央小团队会不会成为瓶颈？** 文章要求它审所有新 tool 与 eval，却没给吞吐机制（评审 SLA、模板、自动化门禁）。工具仓的 templates 与 `/claude-api prompt-audit` 是半个答案。
5. **示例仓为什么删掉解读、而不是数字？** README 说删掉了"测量结果与由此得出的结论"、也没重跑；但 24 条打分记录还在，`compare.py` 能离线打印。所以这个 mock 样例的前后对比是可复算的——真正没有公开材料的是**文章正文那组企业对比**（没有任务数、模型、口径）。
6. **eval 的"翻转任务"如何统计才算显著？** 2 次重复、12 条任务，一次翻转就把某任务从 100% 拉到 50%；这种粒度下"变差"与"噪声"很难分开。工具仓自己承认 "Two reps is thin. One flip moves a task by half."，但没有给最小重复次数或置信口径。

## 迁移索引

2026-11-28 读者版重写时，以下内容从 `note.md` 移入本文件：

- 来源信息表中的仓库编号、版本锚点（字符数 / sha256）、许可、未核项；阅读范围与交叉核对两行；
- 原「证据层级一览」表；
- 原「复核记录」整行（2026-10-28）；
- 原「原文的表述张力与证据缺口」整节（8 条）；
- 原「配套工具仓」整节：仓库事实表、参考实现参数表、提示的五个去处、审计输出表、配套命令表、折叠的成本账；
- 原「与 Anthropic 自家既有指导的关系」整节（含对照表）；
- 原「多团队怎么继续往一个循环里贡献」整节（含载体表与所有权解读）；
- 原「适用边界：什么时候别折」与「落地清单」整节；
- 原「待确认问题」6 条。
