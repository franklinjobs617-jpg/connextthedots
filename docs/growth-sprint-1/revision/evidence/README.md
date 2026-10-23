# 可独立读取的修订证据

所有文件均来自本轮应用提交 `60fe15a12d861d799b06d23bbdf0f941dc4ebe30` 的自测或明确标记的原审核基线。不是独立 Reviewer Runtime Confirmed。后续文档/证据提交不改变应用输入，见 [runtime-inputs-sha256.json](./runtime-inputs-sha256.json)。

- [F01 三类素材清单（49 项）](./catalog-evidence.json)
- [两页实际渲染的 JSON-LD 及 FAQ 一致性记录](./schema-inventory.json)（旧字段冲突仍须结合交接表读取）
- [逐模块 Before / After 原文](./module-before-after.json)
- [浏览器结果及 Not Verified 项](./browser-results.json)、[原始 actions log](./actions.log)、[被拦截请求清单](./blocked-requests.json)
- [Build 比较、路径/行号/完整消息](./build/comparison.json)、[错误索引表](./build/diagnostic-index.md)
- [webpack main TS 原文](./build/main-typescript.log)、[webpack 修订 TS 原文](./build/head-typescript.log)
- [默认 main build](./build/main-default-build.log)、[默认修订 build](./build/head-default-build.log)
- [webpack main build](./build/main-build.log)、[webpack 修订 build](./build/head-build.log)
- [默认 main tsc exit](./build/main-typescript-default.exit)、[默认修订 tsc exit](./build/head-typescript-default.exit)：都为 0；对应 `.log` 是实际的空日志，不是漏传
- [main 运行上下文](./build/main-context.json)、[修订运行上下文](./build/head-context.json)
- [Vercel 提交状态与未知字段](./vercel-source-status.json)、[GitHub checks 原始响应](./github-source-checks.json)
- [26 URL reviewed log](./reviewed-capture.log)、[revised log](./revised-capture.log)、[同 origin 控制页复读](./same-origin-capture.log)、[默认生产构建启动后的两页读取](./production-capture.log)
- [ESLint 原文](./lint.log)（成功、无诊断，实际为空）

## 四组 PDF / Solution PNG

| 样本 | 实际导出的 Puzzle PDF | 实际导出的 Solution PNG |
|---|---|---|
| Simple Rabbit Outline | [PDF](./downloads/Simple_Rabbit_Outline_Puzzle.pdf) | [PNG](./downloads/Simple_Rabbit_Outline_Solution.png) |
| Cute Happy Rabbit | [PDF](./downloads/Cute_Happy_Rabbit_Puzzle.pdf) | [PNG](./downloads/Cute_Happy_Rabbit_Solution.png) |
| Puppy Sketch | [PDF](./downloads/Puppy_Sketch_Puzzle.pdf) | [PNG](./downloads/Puppy_Sketch_Solution.png) |
| Cute Sitting Puppy | [PDF](./downloads/Cute_Sitting_Puppy_Puzzle.pdf) | [PNG](./downloads/Cute_Sitting_Puppy_Solution.png) |

[输出哈希及像素/纸型/署名断言](./downloads/downloads.json) · [Simple Rabbit PDF 渲染](./downloads/Simple_Rabbit_Outline_PDF-render.png)。PDF 渲染仅供取证，不表示新增 Puzzle PNG 下载能力。未独立试玩、未实印、未验证 Letter 或点序与解答同序；Rabbit 边缘编号风险未修复。

## 截图

| 页面 | 原审核长图 | 修订桌面长图 | 修订移动长图 | 聚焦选题区域 |
|---|---|---|---|---|
| Dot | [Before](./screenshots/dot-to-dot-printable-reviewed.png) | [Desktop](./screenshots/dot-to-dot-printable-desktop.png) | [390px](./screenshots/dot-to-dot-printable-mobile.png) | [1440px](./screenshots/dot-gallery-1440.png) / [390px](./screenshots/dot-gallery-390.png) |
| Adults | [Before](./screenshots/connect-the-dots-for-adults-reviewed.png) | [Desktop](./screenshots/connect-the-dots-for-adults-desktop.png) | [390px](./screenshots/connect-the-dots-for-adults-mobile.png) | [1440px](./screenshots/adults-featured-1440.png) / [390px](./screenshots/adults-featured-390.png) |

外部请求被阻断，截图中空白的 R2 图片不是对生产图片状态的诊断。交互/下载使用实际源码、浏览器 Canvas/jsPDF 和真实本地素材；没有用假生成器或假下载文件替代。全部 `/api/*` 被本地 fixture 拦截，没有调用 Gallery 管理、AI、支付、保存或生产写入。OpenCV 请求失败，因此完整上传→编号预览→生成器 PDF 是 Not Verified。

## 复现条件

源码 main 与应用提交分别归档；相同 Node 24.19.0、lockfile 和已安装的 lock-matching 依赖。默认构建最初遇到归档外 node_modules symlink 的 Turbopack root 限制，随后用 hard-link 依赖目录消除环境问题，未修改源码、next.config 或 tsconfig。两个模式均使用原始配置，没有 ignoreBuildErrors。

每个归档使用：`NEXT_TELEMETRY_DISABLED=1 npm run build`；另一个干净生成类型上下文使用 `NEXT_TELEMETRY_DISABLED=1 npm run build -- --webpack`。各模式生成类型后再运行 `./node_modules/.bin/tsc --noEmit --incremental false --pretty false`，去掉的是旧 `.next/dev` 生成目录，不是诊断输出。保留两种模式的原始日志，不混算 0 项与 16 项。

浏览器脚本位于 [scripts](./scripts)，是本环境实际执行的 harness，需要 Playwright、系统 Chromium、Pillow 和 PyMuPDF，并引用记录中的工作区路径；不是无需配置的通用测试套件。26 URL 对照来自 webpack dev，默认生产构建通过后又启动 `npm start` 验证两页交互/移动/下载，没有临时类型豁免。完整 HTML/快照、脚本和日志也收入[证据 ZIP](../../evidence.zip)。

[文件 SHA-256 清单](./manifest-sha256.json)。原审核 Head 的历史证据可从其固定 Git 提交读取，本目录和当前 ZIP 对应修订。

构建原始日志保留终端进度的 CR/尾随空格；不会为了 whitespace 检查清洗原始证据。源码及说明文档另作 whitespace 检查。
