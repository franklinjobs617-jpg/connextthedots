# PR #2 — L1 revision after REQUEST CHANGES

2026-10-23（Asia/Shanghai）。这是 Codex 自测及交接，不是 04 独立复核或发布批准。沿用 [Draft PR #2](https://github.com/franklinjobs617-jpg/connextthedots/pull/2)，不 Merge、不 Deploy、不修改生产配置。

main 基线：`da8e3b54df99a3e63246c496ade226890bf236ba`。原审核 Head：`93b0ce783b2feb71f3e9f9e35bb04ceebabe4314`。本轮应用提交：`60fe15a12d861d799b06d23bbdf0f941dc4ebe30`；后续提交只更新文档、诊断和证据。最终 Head 见 PR；用[运行输入哈希](./evidence/runtime-inputs-sha256.json)核对其与实测应用提交一致。

授权依据是 Founder 本轮请求。附件中的审核建议、历史提案和审批清单不被当作额外执行授权。已重读独立审核、Founder Decision v0.4、SEO Change Control v1.0、原实施记录与 SEO Diff。

## F01–F08 disposition

| Finding | Disposition | 本轮处理及剩余边界 |
|---|---|---|
| F01 全卡 Not verified | **Fixed** | 不再覆盖全部 49 张为未知。43 个普通目录项 + 4 个已测导出样本保留原范围，明确显示 `Dots: Catalog …`，不声称精确点数已验收；四个样本另显示 `Export checked: PDF + solution PNG`。两张成人线稿显示点数不适用及简短修复状态。 |
| F02 重复免责声明 | **Fixed** | Hero 回到浏览/预览/下载行动；成人线稿完整提示集中到 Featured 说明，只在卡片保留短状态。删除 Hero、难度说明及多条 FAQ 中反复出现的同一警告。没有恢复 100–300 点可作答成人题承诺。 |
| F03 Hub/详情/成人答案断裂 | **Deferred** | 仍未修复 Mountain/Mandala 的编号题及答案。共享详情、资源和动态 Title 均未修改；不能称为成人下载闭环完成。需要独立 L2/L3。 |
| F04 CTA/挂载及完整任务 | **Blocked** | Founder 本轮认可基础入口方向。锚点、匿名选图/进入编辑区已验证，原挂载的功能/副作用/事件差异见下。OpenCV 被外网隔离阻断，编号预览与生成器 PDF **Not Verified**，交 02 Work；不扩大生成器修复。 |
| F05 旧 Meta/Title/H2 冲突 | **Deferred** | 保持冻结；单列已有冲突及 L2/L3 决策，未静默改 Title、Meta Description 或 headings。 |
| F06 局部 Schema/旧冲突 | **Verified（清单核查）** | 两页 FAQ 与可见答案一致；局部字段差异精确记录。旧 Adults WebPage.description/dateModified、Offer 语义、目录质量边界仍列为冲突/待测，不称整体 Schema 已验收。 |
| F07 目录数与可用题数 | **Fixed** | 49 始终指目录记录，筛选数 27/20/1/1/49。点数显示按证据分层，不等同 49 张已验收题；A02/A03 高点数成人题/可靠 Mandala 答案仍未解决。 |
| F08 语言、链接及运行覆盖 | **Verified（有限范围）** | 26 URL 的保护字段一致，其余 24 路径正文/链接/Schema 一致；所有 href 顺序相同。生产构建启动后的两页交互、样本下载及移动布局通过。远端成人资源、物理打印、完整上传任务与 Vercel 运行环境仍待独立 QA。 |

## 实施文件、素材分层和搜索意图

本轮运行时代码仍只修改：

- `app/[locale]/dot-to-dot-printable/DotToDotPrintableClient.tsx`
- `app/[locale]/connect-the-dots-for-adults/ConnectDotsAdultsClient.tsx`

修改显式限于英文 presentation；没有修改共享 `PrintableCard`、`PrintableDetailClient`、任何目录/素材数据、首页、生成器、广告、元信息模块或语言回退。四个导出标记只对应明确的 ID，不把所有 Hard/Extreme 或所有 Rabbit/Puppy 推定为同等证据。

| 显示层级 | 数量 | 用户所见与事实边界 |
|---|---:|---|
| 目录声明，未独立逐点验收 | 43 | 保留如 `Catalog 1–22` 的原范围，仅作选题线索，非已验证精确点数 |
| 文件与导出已测，未独立试玩 | 4 | 同样保留 Catalog 范围，并加导出标记；范围不升级为 Verified count |
| Mountain/Mandala 参考线稿 | 2 | `Not applicable (reference art)`；局部短文指出编号题与匹配答案修复仍待完成 |

四个样本为 Simple Rabbit Outline（目录 1–28）、Cute Happy Rabbit（1–24）、Puppy Sketch（1–30）、Cute Sitting Puppy（1–32）。这些仍是**目录声明**。完整 49 项映射见 [catalog-evidence.json](./evidence/catalog-evidence.json)。

## 两页逐模块 Before / After

以下 Before 是原审核 Head，After 是本次修订；[逐模块完整原文 JSON](./evidence/module-before-after.json)保留精确文字，原/新截图可单独打开。

| 页面模块 | Before | After / 搜索任务保持 |
|---|---|---|
| Dot Hero | 介绍目录后，直接重复静态/AI 限制 | 先说明按主题和目录范围找 Free Printable、打开预览/PDF/答案；次段说明免费免账号和首页制作入口 |
| Dot 定义/打印段 | 长段纸型与未验收提醒 | 简明提供 A4 portrait、网站 credit 和打印预览指引；Letter 未测只在纸型 FAQ 说明 |
| Dot Why | 以难度标签不代表可玩题作结 | 正面说明按短序列/轮廓细节选择活动，不声称库中有 200 点成人题 |
| Dot Difficulty | 四个区块都写未验证；Hard/Extreme 重复线稿警告 | 引导使用卡片目录范围和预览，保留原级别及年龄标签；不编造高点数或完成时间 |
| Dot HowTo | 单一步骤包含多句限制与资源角色 | 明确“卡片→预览/详情→Puzzle PDF / Solution PNG”，继续服务 Printable PDF 下载 |
| Dot Gallery | 49 张卡片统一抹掉点数 | 恢复 47 条有用的 Catalog 范围；四个已测样本有导出标记；一次集合说明区分记录、证据和两张线稿 |
| Dot Custom | 首页 CTA + 基础/AI 分离 | 保留已获认可方向及原位置，不再改生成器；仍说明基础上传与 AI 登录/credits 的区别 |
| Dot FAQ / Related | 成人 FAQ 再重复线稿不可用 | 成人 FAQ 回到如何选择编号题和屏幕外活动；免费、纸型、自制问题各回答自己的任务；相关集合仍保留 |
| Adults Hero | 首屏主要解释为什么没有合格题 | 先承接 Adults / Hard / Extreme 主题浏览、预览、下载和自制任务；不承诺现成高点数成品 |
| Adults 制作区域 | 首页上传 CTA 与 AI 登录 | 保留，不再扩大交互变更 |
| Adults Featured | 长段免责声明加长卡片警告 | 一段完整而显著的线稿状态说明；原两卡、图片映射、主题、URL、顺序保留，卡片仅留短状态 |
| Adults Difficulty | Not verified 与未测时间反复占据表格 | 指引查看 worksheet 标签/Featured 参考图状态，时间写 Depends on worksheet，不展示虚构的点数范围 |
| Adults Why | 又一次说明未验证完成时间 | 回到选题、打印和按自己的节奏完成编号活动；静态下载与首页上传的实际入口 |
| Adults FAQ | 多个答案复述同一线稿/高点数缺陷 | 定义、免费、点数标签、自制、纸型分别作简短回答；点数问答仅指向 Featured 状态一次 |
| Adults Related | 保留原链接 | 无变化，继续提供其他 printable 集合及制作指引 |

两页仍服务 Free Printable、Adults/Hard/Extreme、Printable PDF、Worksheet preview/download；没有通过隐藏素材或新建页面改变主意图。Adults 仍有实质供给缺口：修订改善承接及事实表达，不能宣称满足真正 100+ 点成人题或 Mandala＋可靠答案需求。正文改动仍可能影响摘要/词覆盖，不能从元信息相同推导 SEO 零风险或增长保证。

## CTA：原 DotGeneratorClient 挂载差异

本轮保留已获原则认可的方向，不重新挂回无对应 DOM 的组件。组件 `return null`；主 effect 查询全局 DOM ID，实际上传 input、canvas、编辑与导出按钮由首页 `HomeContent` 提供，在内容页缺失。两英文页原挂载不能凭登录按钮自行产生这些 DOM。

| 功能/副作用/事件 | 原内容页挂载可能产生的行为 | 当前英文内容页与首页路径 |
|---|---|---|
| 上传、点序/画布编辑、滑块、PNG/PDF | 对已有全局 ID 注册监听；缺少 DOM 时多数监听跳过，不渲染独立编辑器 | 内容页基础 CTA 导航到 `/#hero-upload-btn`，由原首页 DOM 和原生成器接管，生成器代码不变 |
| OpenCV | `init()` 主动插入 R2 opencv.js，设置 `window.Module` 回调；不是只有上传才加载 | 英文内容页不再因该组件加载它；到首页后仍按原逻辑加载。本轮该外部请求被阻断 |
| AI 按钮轮询 | `setupAiHandler()` 每 500ms 寻找 `hero-ai-go-btn`，源码没有 effect cleanup；无该 DOM 时可能持续等待 | 当前英文内容页不再启动该组件的轮询；首页自己挂载。潜在跨路由旧回调问题仅作代码风险记录，未扩大到全站修复 |
| 工具/预设/演示视频/返回/保存监听 | 按全局选择器存在性注册；生成器 effect 未返回统一的 removeEventListener cleanup | 原首页行为不改；内容页不再初始化这些监听。没有证据表明丢失内容页可见的独立编辑控件 |
| user/登录/credits | userRef 随 user 更新；登录按钮来自各页 useAuth，不是 return-null 组件的 UI | 两页登录/credits 显示保留；登录本身不等于开始生成，AI 输入/执行仍在首页，AI 要求账号及可用 credits |
| 分析事件 | 动作代码包含 `user_upload_image`、`clear_canvas`、`ai_generate_start/success/fail`、`download_result` | 不新增或重命名事件；导航到首页增加页面路径/可能 pageview，后续上传/导出动作归属首页。未测试真实 GA 入库；不能把页面跳转前后当完全相同漏斗 |
| API / 存储副作用 | 上传处理可能调用去背景服务；AI 可调用 `/api/doubao` 并改 credits；保存可调用 `/api/connect-dots/save` | 本轮不执行登录、AI、付费或保存；浏览器外部请求阻断，全部 `/api/*` 以本地 fixture 拦截，没有 Gallery 管理 API 或生产写入 |

**已验证：** `hero-upload-btn` 和 `hero-file-input` 存在；两页 CTA 到达首页该锚点；匿名选择本地图像后编辑区域出现。**Not Verified：** OpenCV 初始化、有序编号预览、生成器 PDF 导出；不把编辑区可见当作生成成功。02 Work 应在可正常访问既有资源的真实浏览器验证该全流程并保存文件。没有发现需本轮扩大的已证实实质功能损失，也没有为绕过外部限制替换 OpenCV 或重构生成器。

## 下载及详情事实

- 卡片是详情链接，**不是直接下载**；本轮所有 href 及顺序不变。
- 详情 PDF 从 `item.imageUrl`（Puzzle）生成，A4 portrait、文件名 `_Puzzle.pdf`，含网站 credit。
- PNG 从 `item.solutionUrl`（Solution）生成，文件名 `_Solution.png`。这不是 Puzzle 的同图另一格式，没有新增 Puzzle PNG 或 Solution PDF 能力。
- 四个样本共 8 次本地浏览器导出通过。PDF 内嵌图与 Puzzle 的像素 RMSE < 0.23；Solution PNG 与源图像素完全相等。没有把传输/导出成功外推为完整点序、同序解答、独立试玩、Letter 或实印通过。
- Simple Rabbit 右边缘编号有裁切风险；[PDF 渲染证据](./evidence/downloads/Simple_Rabbit_Outline_PDF-render.png)只是文件取证，不是新增下载格式。缺陷未在本 PR 通过共享素材修复。
- Mountain/Mandala 编号题与答案修复仍未完成；R2 远端当前字节/答案状态未验收，原详情仍有旧范围、Title 和答案按钮，不能认为此 PR 已解决。
- 不修改共享 `PrintableDetailClient`、任何批量数据或 CDN/CORS 配置；没有得到根因证据就不猜测远端故障。

## Build：原始诊断与模式差异

两边相同：Node `v24.19.0`、npm `11.9.0`、TypeScript `5.9.3`，lockfile SHA-256 `c3e4bbdd2be6b6bb9b53aaed14c293a4bfbc6cf660b7b484be660479cc606465`。关键依赖 installed/locked 版本一致；[main 上下文](./evidence/build/main-context.json)、[修订上下文](./evidence/build/head-context.json)。

| 相同命令 / 生成上下文 | main | 修订应用提交 | 可支持的结论 |
|---|---|---|---|
| **`NEXT_TELEMETRY_DISABLED=1 npm run build`**（默认 Turbopack） | **exit 0** | **exit 0** | 两边实际运行 TypeScript 阶段并生成 135 页。没有人为忽略类型错误；正式默认命令本轮通过。 |
| 同上之后 `./node_modules/.bin/tsc --noEmit --incremental false --pretty false` | **exit 0，空日志** | **exit 0，空日志** | 默认生成类型上下文里没有诊断；保留空原始日志及 exit 文件。 |
| **`NEXT_TELEMETRY_DISABLED=1 npm run build -- --webpack`** | **exit 1** | **exit 1** | 两边编译后均在旧 blog 页 Props.params 类型处失败；不是本 PR 新增。 |
| webpack 生成类型之后，同一 tsc 命令 | **exit 2，16 项** | **exit 2，16 项** | 未过滤、未归一化的两份原始日志逐字节一致，含路径、行、列、TS code 和完整消息；新增/移除均为空。 |

[完整比较 JSON（含全部错误路径/行号/消息）](./evidence/build/comparison.json) · [main 原始 16 项日志](./evidence/build/main-typescript.log) · [修订原始 16 项日志](./evidence/build/head-typescript.log) · [默认 main build](./evidence/build/main-default-build.log) · [默认修订 build](./evidence/build/head-default-build.log) · [webpack main build](./evidence/build/main-build.log) · [webpack 修订 build](./evidence/build/head-build.log)。

这修正了原记录对 Build 的概括：**16 项是 webpack 生成类型上下文的结果，不是所有构建模式必然失败。** 默认 `.next/types/validator.ts` 与 webpack 的逐页检查不同；保留两份 [默认 generated validator](./evidence/build/head-default-generated-validator.txt) 和原始结果作为上下文，不手改生成代码。默认命令通过不表示源代码里的旧同步 params 已被修复，也不等于所有运行/发布门槛通过。

最初归档副本仅 symlink node_modules，默认 Turbopack 因“超出 filesystem root”而失败；随后改为相同依赖的 hard-link 副本，在**未改源码或配置**的条件下完成上述正式构建。初始环境失败日志另存，不能冒充应用构建缺陷。没有使用 `ignoreBuildErrors`、没有本轮 scratch 类型豁免或更改生产配置。

## Vercel Preview：可得证据与缺口

应用提交 `60fe15a…` 的 GitHub `Vercel` status 为 success，关联 [该次 Inspector](https://vercel.com/franklinjobs617s-projects/connextthedots/E4Tqp1finSXjri1E2PT8C6Tpfmce)。[原始 status 记录](./evidence/vercel-source-status.json)和 [check-runs](./evidence/github-source-checks.json)可单独读取。Preview Comments 的成功只表示无未解决反馈，不是构建证明。

**实际 Vercel Build Command、Node/依赖环境、完整日志、运行时 deployment SHA：Unknown / Blocked。** 现有连接只提供 GitHub 状态与 URL，Inspector/Preview 访问失败；仓库没有可证明项目设置的 vercel.json。不能因为本地默认命令成功就反推 Vercel 必然使用该命令或相同环境。最终 Head 的 status 另在 PR 说明中按其 SHA 记录；没有调用 Deploy API、触发手工重建或修改 Vercel 配置。

## SEO、Schema 与仍待批准事项

更新的 [SEO Impact Diff](../seo-impact-diff.json)以原审核 Head 对照修订应用代码：26 个 URL 都返回 200；Title、所有 head meta、H1/H2/H3、canonical/hreflang 全相等；所有 href 顺序相同。只有两个英文目标页正文/局部 JSON-LD 改变，其余 24 条正文、链接、Schema 均一致。另逐文件核对从 main 到当前的元信息、路由、首页、广告/布局、共享模板、语言及数据文件保持相同。

| Schema | 核查结果 | 旧冲突 / 待测 |
|---|---|---|
| Dot WebPage.description | 随本页局部正文改为浏览、预览、PDF/答案的事实说明 | HTML Meta Description 另行冻结，不借 Schema 改动宣称它已更正 |
| Dot FAQPage / HowTo | FAQ 答案与可见内容一致；下载步骤解释 Puzzle PDF 与 Solution PNG | 不因此外推所有资源质量或答案可用 |
| Dot ItemList | numberOfItems=49 个目录记录，实际列出前 20 项 | 聚合数包含两张参考图，不是 49 个验收通过题；前 20 个 ListItem 本身不包含两张成人图 |
| Adults WebPage | URL/name/language 未改 | `description` 仍为旧 100–300+ / 秒制宣传；`dateModified=2026-07-15` 仍旧。正式发布时应按真实更新事实处理日期，不在未发布修订中伪造发布日期 |
| Adults FAQPage | 答案与可见内容一致，去除重复长警告 | 保留的旧问题标题仍含 extreme，不能当作能力已兑现 |
| Adults SoftwareApplication / Offer | 既有应用描述区分首页上传及 AI；无批量模板改动 | price=0 / Offer 不能替代实际 credits 政策或登录后能力验证，语义范围待 Founder/QA 确认 |
| Adults ItemList / 共享详情 CreativeWork | 列表保留两条原主题/URL；共享详情未改 | 仅代表目录记录，不能当作编号题/答案质量通过；详情仍有旧能力表述 |

**L2 继续暂缓：** 成人主素材/答案、120 点 Mountain、共享详情按钮/模板、Rabbit 编号裁切的系统性修复、主要 H2/首屏重写。潜在共享影响仍涉及目录、集合、相关卡片与七语言详情回退；本轮未扩大。

**L3 继续暂缓：** 两页 Meta Description（Dot 的任意照片秒制 / Adults 的 100–300+ Extreme PDF）、Adults WebPage.description，以及由旧范围生成的两条详情 Title。精确旧值、风险和候选仍在历史 C4 卡；Founder 需单独决定准确替代、署名政策及摘要/CTR 监测。Title、Meta、核心 H1、URL、canonical、redirect、robots/noindex、hreflang、首页/多语言 SEO、广告保持冻结。较大 H2 修改不在本轮实施。

**发布准入：** 默认本地生产命令已通过，仍需解释/接受构建模式差异，核实 Vercel 实际管线，完成 02 的完整上传与实际文件/纸张/点序 QA，并决定成人资源和旧元信息冲突的处理方式。没有全站 TypeScript 重构，没有增长效果、排名或可上线保证。

## 证据、复核与回滚

[证据索引及单独可打开文件](./evidence/README.md) · [更新后的 ZIP](../evidence.zip) · [文件 SHA-256](./evidence/manifest-sha256.json)。ZIP 与独立文件内容一致；旧 Head 的历史 ZIP 仍可通过其固定 Git 提交读取。

原始渲染快照保留于 ZIP，四个本地详情曾因不同 localhost 端口出现 OG/Twitter image origin 差异，已在同一 origin 重读这四项控制页，未改元信息来消除差异。包内保留初始端口快照，避免隐去环境差异。最终保护字段为原值逐项相等，不是仅比较经过清洗的文本。

回滚不涉及数据库、CDN 或配置迁移。Draft 阶段可关闭 PR，生产不受影响；若需撤销本轮技术变更，以原审核 Head 为定位基线，单独撤销故障部分并保留目录声明/真实状态，不默认恢复全卡 Not verified 或已证伪的高点数宣传。任何后续部署及生产回滚均需 Founder 单独决定。

完成后停止，等待 04 针对新 Head 复核，再由 02 Work 做真实浏览器验收；不 Merge、不 Deploy。
