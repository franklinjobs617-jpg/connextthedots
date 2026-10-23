> **历史记录：以下对应原审核 Head `93b0ce783b2feb71f3e9f9e35bb04ceebabe4314`，已被[本轮修订交接](./revision/README.md)取代。原证据可在该固定提交读取；当前 evidence.zip 是修订后的证据包。尤其不要把原稿的全卡 Not verified 或 webpack 构建结论作为当前完整结论。**

# Growth Sprint 1 — L1 implementation review

日期：2026-10-23（Asia/Shanghai）。范围：修改批准的局部代码、隔离验证、一个 Draft PR；不 Merge、不 Deploy、不修改生产配置。附件中的研究建议、W2 新题、W4 数据采集和 AI 8Q 复测不是本轮执行授权，均未执行。

## 基线与实施边界

- 通过 GitHub connector 读取 main，并通过 `git fetch origin main` 再核对：`da8e3b54df99a3e63246c496ade226890bf236ba`。
- 本地初始工作树干净。没有发现适用的 AGENTS.md。分支：`codex/growth-sprint-1-l1`。
- 读取四份附件后，以当前 main 的代码、数据和本地页面为实施依据。公开两页的文本读取也与当前主要文案吻合；这不能证明生产部署 SHA。生产站和 R2 的直接请求被环境代理以 403 拒绝，远端文件未重新验收。
- 应用代码只改两个 client 组件，且显式限定 `locale === "en"`。没有修改 server page、元数据模块、数据结构、资源文件、共享卡片/详情模板、生成器、首页、广告、语言回退或路由。
- 不能把此 PR 视为已完成高点数成人题供给或全部详情修复。共享详情问题已停在 L2 边界。

## 修改文件与 URL

| 文件 | 用途 | 直接影响 URL |
|---|---|---|
| `app/[locale]/dot-to-dot-printable/DotToDotPrintableClient.tsx` | 英文局部事实、目录提示、CTA、对应局部 Schema | `/dot-to-dot-printable/` |
| `app/[locale]/connect-the-dots-for-adults/ConnectDotsAdultsClient.tsx` | 英文成人资源说明、点数/时间审慎标记、上传 CTA、对应 FAQ/应用 Schema | `/connect-the-dots-for-adults/` |
| `docs/growth-sprint-1/implementation-review.md` | 本交接、Change Cards、停止项 | 无运行时影响 |
| `docs/growth-sprint-1/seo-impact-diff.json` | 逐 URL 保护字段对照摘要、精确 JSON-LD diff | 无运行时影响 |
| `docs/growth-sprint-1/evidence.zip` | HTML、截图、原始对照、导出文件/哈希及隔离验证脚本/日志 | 无运行时影响 |

应用实现提交：`576cba391939b60a3eef7a5c7778f7a466edb7ae`；后续提交只附证据与文档。[下载证据包](./evidence.zip) · [SEO Impact Diff](./seo-impact-diff.json)。

首页 `/#hero-upload-btn` 是新 CTA 的目的地；首页本身未修改。目标页的 de/es/pt/fr/it/nl 变体，以及支持详情、其他集合页，均不属于本次正文变更 URL。

## 当前目录与下载事实

英文目录是 **49 条记录**：27 Easy、20 Medium、1 Hard、1 Extreme。30 条由仓库内的 `generated-standalone-printables.json` 提供，另 19 条指向 R2。目录条目数不等于独立验收通过的可作答题数。其他语言数据模块的条目数：es 49、fr 22、de/pt/it/nl 各 19；这些模块未修改。

| 素材及详情 URL | 当前 Puzzle / Solution 映射 | 点数证据与本轮结论 |
|---|---|---|
| `/printables/simple-rabbit-outline/` | 同源 `simple-rabbit-outline-puzzle.webp` / `-solution.webp` | 目录声明 1–28；文件可解码，PDF/PNG 导出通过；没有独立完整试玩。本地目检发现右边缘编号存在裁切风险，不能据此宣布印刷质量通过。 |
| `/printables/cute-happy-rabbit/` | 同源 `cute-happy-rabbit-puzzle.webp` / `-solution.webp` | 目录声明 1–24；文件及导出通过；点序、打印与独立试玩未验收。 |
| `/printables/puppy-sketch/` | 同源 `puppy-sketch-puzzle.webp` / `-solution.webp` | 目录声明 1–30；文件及导出通过；点序、打印与独立试玩未验收。 |
| `/printables/cute-sitting-puppy/` | 同源 `cute-sitting-puppy-puzzle.webp` / `-solution.webp` | 目录声明 1–32；文件及导出通过；点序、打印与独立试玩未验收。 |
| `/printables/6-Advanced-Mountain-Landscape-Connect-the-Dots-Design-for-Adults-Over-100-dots/` | R2 `/printable/` 下同名 `.avif` / `-solution.avif` | 目录写 100–200，未提供有序点序证据；附件既往 QA 认为是完整线稿。当前映射未改变，远端字节不可复验。目标页按参考图处理，不宣称合格高点数题。 |
| `/printables/7-Extreme-Difficulty-Mandala-Connect-the-Dots-Design-for-Adults-Over-200-dots/` | R2 `/printable/` 下同名 `.avif` / `-solution.avif` | 目录写 200–300，未提供有序点序证据；附件曾报告答案破图。当前远端状态未复验。目标页不承诺可作答题或可用的配套答案。 |

本地文件前缀均为 `/generated/dot-to-dot/standalone-openclipart/`。Rabbit/Puppy 的 Reference、Puzzle、Solution 三种资源独立存在，文件哈希保存在交付证据包。

当前共享详情代码的实际行为：

- 卡片 `Link` 进入详情，并不直接下载文件。
- `Download PDF` 调用 `handleDownloadPdf(item.imageUrl, item.title)`：Puzzle 图片经浏览器 Canvas 转为 JPEG，嵌入 A4 portrait PDF，文件名为 `_Puzzle.pdf`，附网站 credit。
- `Download PNG` 调用 `handleDownloadPng(item.solutionUrl, item.title)`：Solution 图片转为 PNG，文件名为 `_Solution.png`。没有现成 Puzzle PNG 或 Solution PDF 按钮；不能把两按钮理解成同一题图的两种格式。
- 两种导出均没有登录检查。AI 生成通过另一路径检查账号/credits；普通首页上传是已有流程。
- 图像载入使用 `crossOrigin="Anonymous"` 和时间戳查询参数。没有证据支持改动时间戳、CORS 或 CDN 配置，本 PR 没有猜测或修改。
- 原有失败处理是 alert 并恢复按钮状态；隔离强制 Solution 加载失败时已验证该处理。
- 生成脚本将重采样点用于 Puzzle、完整轮廓用于 Solution；文件角色正确并不等于已经证明两者来自完全相同的编号点序。

## Before / After

| 位置 | Before | After |
|---|---|---|
| Dot 首段、打印说明及 FAQ | 笼统承诺全库无水印、双纸型、高点数及任意照片秒制 | 说明静态免费 PDF、网站 credit、A4 导出及逐件检查；Letter 未验证；AI 登录/credits 单独说明 |
| Dot 目录计数 | `49 puzzles · click any card to download` | 从实际数组取总数/筛选数，称为 catalog entries，明确先进入详情；不称为 49 个已验证可玩题 |
| 两页卡片及难度说明 | 将目录范围和预计时间当作可靠能力 | 仅在本页的 presentation 副本标为 `Not verified`；成人卡片说明参考图角色；底层数据不变 |
| Dot Make Your Own | 滚到只有 credits 登录入口、没有首页上传 DOM 的区域 | 主 CTA 和制作区域 CTA 指向已有 `/#hero-upload-btn`；仍保留清楚标注的 AI 登录按钮 |
| Adults 制作区域 | 引导登录，宣称自定义 extreme 秒制 | 原区域内增加通往首页上传的基础制作 CTA；区分 AI 登录要求 |
| Adults 首段、精选说明与 FAQ | 将 Mountain/Mandala 当作已确认的高点数成人题 | 保留原两卡、主题及 URL，按参考图说明；点数、配套答案及完成时间不做未经验证的保证 |
| 局部 JSON-LD | FAQ/HowTo/应用描述重复错误事实 | 与修改后的可见答案及步骤同步；精确字段前后值见 JSON diff；没有修改共享 Schema 模板 |

英文卡片点数显示一律保守标为未验证，没有根据目录数字新增精确能力承诺。筛选仍使用原 difficulty 数据，卡片次序、数量、网格和目的地不变。核心 H1、所有 H2/H3 和原搜索意图均保留。

## SEO Change Cards / Impact Diff

C1（Dot）与 C2（Adults）均按 L1 局部事实与任务入口纠正实施。收益假设是减少错误预期、帮助理解文件角色和找到已有上传入口；不承诺 Google 排名、ChatGPT 推荐或收入增长。准确化正文仍可能改变搜索摘要或词覆盖，因此风险非零。

| 受保护项 | Before → After |
|---|---|
| 首页、目标页、支持详情的 Title、Meta Description、OG/Twitter meta | 无变化 |
| 核心 H1、所有主内容 H2/H3 | 无变化 |
| URL、slug、canonical、hreflang/alternate links | 无变化 |
| redirects、middleware、robots/noindex、sitemap、语言路由 | 源文件无变化；渲染中存在的索引字段无变化，没有新增 robots/noindex |
| 共享 SEO/详情模板、数据、广告位置 | 无变化 |
| 主卡片目的地及目录顺序 | 无变化 |
| 内链 | Dot 增加两个首页上传锚点链接；Adults 增加一个。Dot 旧的页内制作滚动按钮改为其中一个链接。其余主内容链接一致。 |
| 局部 JSON-LD | Dot WebPage.description、4 个 FAQ acceptedAnswer.text、HowTo 第一步 text；Adults SoftwareApplication.description、5 个 FAQ acceptedAnswer.text。URL、名称、ItemList、数量与其他字段保持原值。 |

共 26 个 URL 对照均返回 200。全部保护字段相等；两个目标页有预期正文/链接/局部 JSON-LD 变化，其他 24 路径的正文、链接、Schema 及保护字段均一致。JSON 文件逐项记录 URL、保护字段摘要哈希及所有 Schema 字段的精确 Before/After。完整原始快照、HTML、截图及下载文件在交付证据包中。

核查路径包括：两个目标页及其六个非英文前缀（14）、首页（1）、英文 printable/animal 集合及 fr/it/es printable 集合（5）、上表六个详情（6）。不是全站每个 URL 的全面验收。

## 隔离验证及限制

- 两个修改组件的 ESLint、`git diff --check` 通过。
- 正式 `npm run build -- --webpack`：Prisma 客户端生成成功、生产代码编译成功；TypeScript 阶段在未修改的 `blog/are-dot-to-dot-puzzles-good-for-kids/page.tsx` 的旧同步 `params` 类型处失败。没有把正式构建报告为通过。
- 对 main 的独立归档副本及修改后代码使用同一生成类型检查：去掉 `.next/dev` 的重复项后，两边均为相同 16 项既有诊断，没有新增。诊断涉及多个旧页面的 `params` 类型。
- 原始 Turbopack 本地开发模式循环重定向；清理生成缓存并用 webpack 后得到 26 URL 的完整渲染对照。中途的临时开发缓存 500 已重新读取，最终对照都是 200；没有修改路由来绕过它们。
- 为进行稳定的浏览器交互验证，另建不进入 PR 的临时副本：只在该副本添加 `typescript.ignoreBuildErrors: true` 和 `experimental.cpus: 2`，用 webpack 构建并在 localhost:3001 启动。该预览完成 135 个静态页面生成。这不等于仓库正式构建通过；仓库 `next.config.ts` 原样保留。
- 四个样本共 8 次导出通过：PDF 单页 A4、credit 存在，内嵌图与 Puzzle 的像素 RMSE < 0.23；PNG 像素与 Solution 完全相等。证据包保存输出及 SHA-256。
- 五个筛选按钮分别返回 27 / 20 / 1 / 1 / 49 条，Browse 按钮滚到目录；两个页面的基础制作 CTA 均到达首页上传 input。匿名选择本地图像后编辑区域显示，但 OpenCV 被外网隔离阻断，完整生成/导出未验证。390px 移动视口的两个目标页均无水平溢出，保存桌面和移动长截图；远端图片在隔离截图中为空，不能据此判断生产图片状态。
- 浏览器中禁止外部请求，并拦截全部 `/api/*` 以本地 fixture 响应。没有调用 Gallery 管理 API、登录、AI 生成、支付、保存、迁移或任何生产写入。
- 下载成功不代表独立试玩、序列一致性、实际打印、来源权利审查、Letter 支持或无署名政策通过。成人远端题/答、生产 CDN/CORS 及生产移动体验仍需独立 QA。
- 首页上传入口和本地基础交互另有浏览器结果；完整上传→生成→PDF 依赖 R2 的 OpenCV，外网阻断时不能声称该全流程通过。

## 已停止的 L2 / L3 事项

**L2：共享详情和素材质量。** 没有修改 `PrintableDetailClient.tsx`、PrintableItem 或资源数据。该模板服务当前 49 条目录，语言选择只有 ES 与 EN；其余语言详情回退 EN。按七个前缀计算，最多涉及 343 个目录详情变体，另有动态用户题，以及其他集合/相关卡片。修复详情按钮命名、隐藏不可用答案、替换成人主素材、点序/编号裁切等，必须先制定按资源/locale 限定的方案并单独批准。其他数据消费位置包括 printable hub、animal/holiday/character 集合、展示模块、相关卡片和 sitemap；不能通过改 EN 数据悄悄影响这些页面。本轮不制作 120 点 Mountain、不覆盖 R2、不扩张素材。

**L3：独立 Description 决策，当前 PR 不执行。** 两页当前 Meta Description 与 Adults 的 `WebPage.description` 仍保留错误能力宣传；本次冻结不代表其事实验收通过。

| URL | 当前原文（未改） | 独立候选（待 Founder 决定） |
|---|---|---|
| `/dot-to-dot-printable/` | Download free dot to dot printables as PDF. Easy to extreme difficulty puzzles for all ages — animals, nature, fantasy and more. Or turn any photo into your own custom dot-to-dot in seconds. | Browse dot-to-dot catalog entries for kids and adults. Check previews, available downloads and printing details before choosing a worksheet. |
| `/connect-the-dots-for-adults/` | Free connect the dots for adults, 100-300+ dots. Download extreme printable PDFs or turn any photo into your own custom puzzle in seconds. | Explore adult dot-to-dot activities and current reference artwork. Check numbered worksheet availability and download details before printing. |

此外，Mountain/Mandala 详情 Title 由旧的 dotRange 生成，仍含 100–200 / 200–300；需要独立 L3 评估，不能附带修改。关键旧 H2（如 Dot 的 “from any photo”、Adults 的 “Extreme & Hard”）也可能继续造成预期偏差；本轮所有 headings 冻结，较大调整另按 L2/L3 审核。

Description 候选的收益是减少未兑现预期；下降情景是失去高点数/Extreme 吸引力而短期 CTR/点击降低，且旧摘要可能继续缓存。历史导出为 Dot 752 点击、Adults 1,963 点击，不是最新排名。缺少最新连续完整 28D URL×Query×Country 的点击/展示/CTR/排名、GA4 landing/source 及 AdSense 基线，不能预测收益。

发布前由 Founder 单独决定署名政策、Description/Schema 准确替代和成人资源处理路径；之后再由独立审核及 Work QA 验收。监测应记录 D0 版本，D3–D7 技术/抓取，D14/D28 同 URL/查询/国家的可比变化及未改参考页。不用恢复虚假宣传作为默认回滚。

## 回滚

Draft 阶段可关闭 PR 并放弃分支，生产不受影响。技术基线为上述 main SHA；没有数据库、CDN 文件或配置迁移。

若日后另获批准合并/部署，出现渲染、索引或下载回归时，应停止发布并撤销本次提交形成新的回退提交；先在隔离环境复验相同 URL/保护字段及样本导出。由于完整撤销会恢复已知不实宣传，应由 Founder 审核：优先只撤销造成故障的技术/CTA 变更并保留准确事实说明，或使用已经单独批准的准确替代文案。不得把恢复错误事实当作默认业务回滚。

本轮完成 Draft PR 后停止，等待独立审核；不自动处理这里的 L2/L3 项，也不合并或部署。
