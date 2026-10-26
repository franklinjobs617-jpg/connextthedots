# Mountain 120 v0.2 — PR #3 发布准备交接

本轮已按 Founder 专项授权解除新英文详情页的应用层索引保留，修正该路径的虚假 hreflang，并加入仅英文 sitemap 条目。**这是待审候选，不是发布批准；未 Merge、未调用 Deploy。**

- 分支：`feat/mountain-120-printable`，继续原 PR #3。
- 本次修正前 Head：`ef4996ee1cdcffe154b5e9823bd00472d796e43d`。
- 内容集成原 Base：main `da8e3b54df99a3e63246c496ade226890bf236ba`，未从 PR #2 派生。
- 新 URL：`https://connectthedotsprintable.online/printables/mountain-landscape-120/`（候选，尚未部署）。
- 发现入口：英文 `/printable-connect-the-dots/` 的已有 HTML 链接，以及新增 sitemap 条目。
- 素材：`public/printables/mountain-landscape-120/v0.2/` 内两份 PDF、两份 SVG、两份 PNG，全部与 ef4996e **字节一致**。

## 本次索引修正与 SEO Change Control

依据 Founder 在本轮对话提供的 **Growth Lab — SEO Change Control & Ranking Asset Protection v1.0（2026-10-23）**，将本次索引/middleware 改动作为 L4 范畴的专项限定处理。完整目标、授权、变更前后、基线、收益假设、风险、回滚、D0/D3–D7/D14/D28 观察计划在 [SEO Change Card](seo-change-card.md)。GSC/GA4/AdSense 实际指标本轮未取得，没有虚构基线或增长结论。

只修改三处应用源码：

1. 新页 robots 改为 **index, follow**；准确 Title、Description、H1、自指 canonical、正文与 CTA 保持不变。
2. middleware 在原语言处理中，仅为精确的新路径及七语言前缀移除自动生成的 hreflang Link；matcher、语言路由、重定向策略及所有其他路径不变，图片 preload Link 保留。
3. sitemap 追加一个英文 canonical URL，不包含不存在的翻译页，也不为新条目生成语言 alternates。

六个非英文新变体保持 404 + noindex；这些是不存在的翻译页，不是正式英文详情页的 noindex。`/en/` 仍沿原策略归一到英文主 URL。新页应用层不保留 noindex，也没有 X-Robots-Tag。Vercel Preview 平台自身的索引保护未操作，不与生产应用配置混淆。

[完整 SEO Impact Diff](seo-impact-diff.json) 包含修正前后新页 HTML/HTTP SEO 状态、32 个旧 URL 逐项结果、3 项匹配边界、语言变体、robots、sitemap 和下载证据。[文件清单](changed-files.txt) 列出相对 main 的完整 PR 修改范围。初版索引保留与 main 比较材料保留在历史 Head ef4996e，不作为最终配置。

## 验证与实际边界

| 检查 | 结果 |
| --- | --- |
| 修正前/后默认生产构建 | `npm run build` 均 exit 0，未改配置或加类型豁免 |
| TypeScript / 本次三处应用源码 lint / whitespace | 全部通过 |
| 新英文页普通请求、Googlebot、Bingbot | 本地生产配置下 HTTP 200；index, follow；自指 canonical；无 X-Robots-Tag 或 noindex；无虚假 hreflang |
| robots.txt / sitemap | robots 不变且允许抓取；原 69 条保留，恰好新增英文 URL，无语言 alternate |
| 既有 32 URL | Title / 全部 meta / H1–H6 / canonical / HTML hreflang / Schema / 内容文字 / HTML 链接 / 图片相同；HTTP 状态链、Location/Refresh、Link hreflang、X-Robots-Tag 等必要字段相同 |
| middleware 边界 | 三项相似 slug/子路径响应保持，未误扩展到 prefix 匹配 |
| 新 PDF 实际浏览器下载 | Puzzle / Solution 均 200、application/pdf、一页可读 A4、品牌页脚各一次，与源文件字节相同 |
| v0.2 文件 | 六份文件经修正前/后 HTTP 响应及源文件对照字节一致 |
| 数字/点序/排版/裁切 | 重跑原 50/50 检查通过，结果与原 audit 一致；120 点与 9.2pt 不变 |
| 桌面/移动 | 1440px / 390px 图片完整解码、无横向溢出；新截图与原截图字节相同，已目检 |
| 旧资源下载 | 4 个 Rabbit/Puppy 条目 × PDF/PNG × 修正前/后，共 16 次实际下载回归；PDF 图/文字等价，Solution PNG 像素相同 |
| A4 100% 实印 / 非制作者试玩 / 04 独立 Technical Review | **Pending / Pending / Pending** |

验证使用本地 `next build` + `next start`，HTTP 检查附生产域名 Host 与 HTTPS forwarded headers；不是对尚未部署的实际 CDN/托管响应作结论，也不承诺 Google 实际收录。原始 HTML 哈希保留；比较语义时排除构建脚本，且仅将两本地端口造成的 fallback OG/Twitter origin 归一为同一测试 origin。正式 URL、robots 与 canonical 未归一化。sitemap 原代码每次构建更新 lastmod；旧条目比较只排除该构建时间，其余字段一致。浏览器阻止第三方请求，未验证全站远程 CDN。

环境：Node v24.19.0、npm 11.9.0、ReportLab 4.4.9、PyMuPDF 1.26.6；锁文件不变。证据见 `browser-checks.json`、`digital-audit.json`、`download-regression.json`、`reproducibility.json` 与两份截图。不提交完整内部 ZIP、未筛选日志、下载回归样本或字体二进制。

复验：ef4996e 和修正后代码各自构建并在 3100/3101 运行；安装 Playwright Python、PyMuPDF、Pillow，使用 `/usr/bin/chromium`，运行 `verification/verify.py` 和 `verification/regression.py`。结果只写入仓库 `work/`，不要整体暂存。制作/渲染复现见 `scripts/mountain-120/README.md`。

## 保留的内容集成

旧共享详情用 Puzzle 图片生成 PDF、Solution 图片导出 PNG；本轮继续使用独立 `PrintableItem` 扩展记录和专属英文详情，让两份原始矢量 PDF 通过同源链接下载，PNG 字段不错误指向 PDF。共享详情/卡片、目录数据桶、首页生成器、广告、旧 Mountain/Mandala 资源和 URL 均未改。

素材保持 v0.1 原 58 个控制点、120 个唯一点及全部标签布局，顺序 1→120→1，编号 9.2pt。v0.2 两份 PDF 页脚均为 `ConnectTheDotsPrintable.online`，无覆盖题面水印或内部测试标签。一页 A4 210×297mm、嵌入字体、实际 50mm 校准线仍在。难度保持 Unrated，没有伪造完成时间、试玩人或发布日期。

## PR #2 与 Founder 发布前验收

PR #2 Head `6400802b88c12ea511ada7c25fadacc889ab8b17` 的两个英文组件和证据目录未修改；本 PR 与它的修改文件交集为空。初版合并模拟见 `branch-check.json`；本次 middleware/sitemap 修正不修改 PR #2 分支。

发布前仍须：

1. 04 独立复核 L4 变更范围、32 URL 回归和索引关系；Founder 给出最终发布批准。
2. A4 Actual size / 100% 实印、测量 50mm 校准线，检查数字/品牌/裁切。
3. 非制作者不看答案完成 1→120→1，记录用时、歧义、可辨识性，再核对 Solution 并给出 Pass / Fail / Inconclusive。
4. 最终批准发布后的 D0 核验实际生产托管响应及下载；按 Change Card 进行后续观察。真实上线 SHA、时间、负责人在发布发生后再记录。

本轮完成后停止，不 Merge、不 Deploy。
