# Mountain 120 v0.2 — 内容集成交接

本轮是发布准备，**不是发布批准**。只在独立分支开发、测试并创建 Draft PR；不 Merge、不调用 Deploy、不修改生产配置。实印与非制作者试玩均 **Pending**。

- 分支：`feat/mountain-120-printable`
- Base：当前 main `da8e3b54df99a3e63246c496ade226890bf236ba`
- PR #2 对照 Head：`6400802b88c12ea511ada7c25fadacc889ab8b17`（`codex/growth-sprint-1-l1`，未写入）
- 新 URL：`/printables/mountain-landscape-120/`，本地生产构建验证；**尚未发布**。
- 展示入口：英文 `/printable-connect-the-dots/` 原组件之后的独立新增 section。
- 新静态文件：`/printables/mountain-landscape-120/v0.2/` 下 Puzzle / Solution PDF、SVG、PNG 预览，共六个文件。

## 内容模型与实现

原 `PrintableItem` 依赖图片，旧详情客户端用 jsPDF 从 Puzzle 图片生成 PDF，并从 Solution 图片导出 PNG。不能把 Solution PDF 填入 `solutionUrl`。

本轮 `lib/mountain-120.ts` 用 `PrintableItem` 加上独立的精确点数和两份 PDF 字段，图片字段仍是 PNG。新英文详情使用专属小页面与普通同源下载链接，保留原始 A4 矢量 PDF。共享数据桶、共享详情、共享卡片、目录旧计数和全部旧资源均不变。未给新题虚构 Hard/Extreme 难度、完成时间、流行度或发布日期，也未把新题混入旧 Mountain 页面。

新页包含 Puzzle 预览及全尺寸入口、120 点实数、两份 PDF、打印/连点说明、可折叠 Solution 预览，以及总目录/成人活动入口。移动和桌面预览见 `preview-390.png`、`preview-1440.png`。

## 素材与复现

以附件 v0.1 制作脚本、58 个控制点及点序清单为基础生成 v0.2，更新脚本、PDF、SVG、PNG。PDF author、页眉/页脚内测标签已移除，两份页脚均为 `ConnectTheDotsPrintable.online`。

120 个唯一坐标、顺序与全部标签位置逐项等于 v0.1，数字仍为 9.2pt；两份答案使用 1→120→1 同一闭合点序。所有文字距纸边至少约 12.35mm，数字标签间最小约 0.80mm；不靠缩字号/减点数通过。两份 PDF 是一页 210×297mm A4，字体嵌入，保留实际 50mm 校准线。

制作/核查/渲染步骤和字体校验见 `scripts/mountain-120/README.md`。六个公开文件全部字节一致重建，哈希见 `reproducibility.json`。没有提交完整附件 ZIP、失败迭代、未经筛选的日志或字体二进制；保留字体许可文本。

## 测试结果与范围

| 检查 | 结果 |
| --- | --- |
| 实际 PDF/SVG 数字、点标、完整点序、同序答案、排版、裁切、品牌、原 v0.1 布局保持 | 50/50 PASS，见 `digital-audit.json` |
| 新 PDF 实际浏览器下载 | 两次 PASS；HTTP 200、application/pdf、可打开、与源文件逐字节相同 |
| 新预览 | 1440px / 390px，图片完整解码、无横向溢出；已目检截图及 PDF 渲染 |
| 总目录入口 | 实际点击进入新详情通过 |
| 旧下载回归 | 4 个 Rabbit/Puppy 条目 × PDF/PNG × main/head = 16 次浏览器下载；PDF 内嵌图与文字相同，PNG 与原 Solution 像素相同 |
| SEO 对照 | 32 个现有 URL，Title / 全部 meta / H1 / canonical / HTML hreflang / Schema 相同；其余 31 页全部 H2/H3 与 href 也相同；英文目录只增加一个 H2、一个 href，旧链接顺序不变 |
| 默认生产构建 | main 与最终应用源 `npm run build` 均 exit 0；未加类型豁免或改构建配置 |
| TypeScript | 两份默认构建后 `npx tsc --noEmit --incremental false --pretty false` 均 exit 0 |
| Lint | 两个新增 TS 文件 exit 0；目录页与 main 同有两项原 `no-explicit-any`（main 81 行，本分支 83 行），未新增诊断 |
| whitespace | `git diff --check` PASS |
| A4 100% 实印 / 非制作者完整试玩 | **Pending / Pending** |

环境：Node v24.19.0、npm 11.9.0、ReportLab 4.4.9、PyMuPDF 1.26.6，锁文件不变。网站测试使用本地生产构建，第三方请求被阻止；旧远程 CDN 图片整体可用性不在通过范围内。四个回归样本均使用仓库已有同源静态文件。本轮未调用付费生成、登录、支付或生产写入。测试工具启动时的受限网络/监听与过早交互问题在本地修正后重跑；未将这些测试工具失败算作产品通过。

复验：两个构建分别在 3100（main）/3101（本分支）运行，安装 Playwright Python/PyMuPDF/Pillow 并提供 `/usr/bin/chromium`，运行 `verification/verify.py` 与 `verification/regression.py`。脚本只访问本地，结果写入仓库 `work/mountain-120-browser/`；浏览器检查是运行时抽样，不能代替实印/独立试玩。

## SEO Impact Diff 与发布阻塞

详见 `seo-impact-diff.json`：既有 SEO Title、Description、核心 H1、URL、canonical、hreflang、robots 未改；首页生成器、广告、共享多语言结构、旧 Mountain/Mandala 详情和静态文件未改。新页 Title 为 `Mountain Landscape 120-Point Dot to Dot | Puzzle & Solution PDF`，H1 为 `Mountain Landscape — 120-Point Dot to Dot`，canonical 自指英文新 URL。原创题图和具体 120 点/两份 PDF 与旧参考线稿内容区分；仍需上线后观察相似 Mountain 搜索意图的分流，不能凭本地对照宣称无排名影响。

发现现有 next-intl 中间件会为任何新路径自动输出七种语言的 **HTTP Link hreflang**。本轮新内容只有英文，其余六语言请求实测 404 + noindex，因此不能把不存在的翻译作为可用 alternate。

本轮保留独立新增页并暂设 **`noindex, follow`**，不加入 sitemap；没有修改共享中间件。该状态可供 Founder 评审，**尚不具备可索引发布条件**。noindex 只用于这个新页，不影响旧页面。

需 Founder 单独审批的最小后续方案：仅对新 Mountain-120 路径（含各语言前缀）停止输出中间件的自动语言 Link header，保留所有其他 URL 的行为；复验英文 canonical、六语言 404 和现有 URL 后，再移除新页 noindex，按需添加仅英文的 sitemap 项。本轮没有执行该共享文件变更。不要顺带修复旧详情、批量 Title 或全站语言策略。

## PR #2 潜在冲突

PR #2 两个英文组件分别是 `connect-the-dots-for-adults/ConnectDotsAdultsClient.tsx`、`dot-to-dot-printable/DotToDotPrintableClient.tsx`，均未修改；其证据目录也未触碰。本轮只在总目录服务端页面添加独立入口，不注入它们读取的共享数据桶。文件交集为空，合并模拟见 `branch-check.json`。两项工作都涉及 Printable 用户旅程，未来如调整共享详情/目录统计仍须重新检查；PR #2 对旧 Mountain/Mandala 的状态说明应保留。

## Founder 发布前验收

1. A4 Actual size / 100% 实印；量取 50mm 校准线，记录设备、缩放和纸张，检查品牌、裁切与 9.2pt 可读性。
2. 非制作者先不看答案完成 1→120→1，记录实际用时、找号歧义、可辨识性；再用 Solution 核对，记录 Pass / Fail / Inconclusive。
3. 审核两份 v0.2 PDF、预览与英文介绍；难度保持 Unrated，直到取得实测依据。
4. 单独审批并验收上述新 URL 的最小 hreflang 修正与解除索引保留；复核新旧 Mountain 内链、相似意图与索引计划。
5. 在最终发布候选上复验两份下载、移动/桌面与旧样本；另行作出 Merge/Deploy 决定。本轮完成后停止。
