# SEO Change Card — PR #3 Final Indexability Fix

## 目标、事实与授权

依据 Founder 在本轮对话提供的 **Growth Lab — SEO Change Control & Ranking Asset Protection v1.0（2026-10-23）**。该原则本身不是授权；本轮后续请求专项批准了新 Mountain 120 路径的 robots、hreflang、sitemap 和严格限定的 middleware 处理。风险按 **L4 范畴**记录，不把它包装成普通 L1 文案修正。发布仍须单独批准。

- 项目：ConnectTheDotsPrintable — Growth Lab。
- 原 PR：#3，原分支 `feat/mountain-120-printable`；本次比较基线 `ef4996ee1cdcffe154b5e9823bd00472d796e43d`。
- 主 URL：`https://connectthedotsprintable.online/printables/mountain-landscape-120/`。
- 用户任务：预览真实 120 点原创题，下载同序 A4 Puzzle / Solution PDF；相关搜索意图为 Mountain Landscape / 120-point dot-to-dot / puzzle and solution PDF，不是经验证的高难度等级。
- 已证实的问题：原新页为 `noindex, follow`；HTTP Link 广告式列出七语言与 x-default，但六个非英文版本均 404；sitemap 不含新 URL。
- 本轮不修改 PR #2，不新增 PR，不 Merge，不调用 Deploy，不改变托管环境配置。

## What changes / What stays

| 范围 | Before（ef4996e） | After |
| --- | --- | --- |
| 新英文页 robots meta | noindex, follow | **index, follow**，无生产页面 noindex |
| 新英文页 HTTP X-Robots-Tag | 无 | 无；生产模式新 URL 200 |
| 新路径 HTTP hreflang | 七语言 + x-default | 只在精确匹配该新详情路径及七种支持语言前缀时移除 middleware Link；Next 图片 preload Link 保留 |
| 非英文新变体 | 六路径 404 + noindex，却被声明 alternate | 保持 404 + noindex，不再被 HTML、HTTP 或 sitemap 声明为 alternate |
| `/en/` 新变体 | 按既有语言策略回到英文根路径 | 原重定向链保持，且不输出错误 alternate |
| sitemap | 69 个既有条目 | 保留原 69 个，追加英文 canonical 一项；新项没有语言 alternate |
| 新页 Title | Mountain Landscape 120-Point Dot to Dot \| Puzzle & Solution PDF | 不变 |
| 新页 Description | Connect 120 numbered dots to reveal three mountain peaks and a foreground fir tree. Download the free A4 puzzle and its matching solution PDF. | 不变 |
| 新页核心 H1 | Mountain Landscape — 120-Point Dot to Dot | 不变 |
| 新页 canonical | 自指英文主 URL | 不变 |
| 新页 URL / redirect / 正文 / H2-H3 / Schema / CTA / 内链 | ef4996e 状态 | 不变 |
| 已有英文总目录入口 | 服务端 HTML 中的普通链接，指向新页 | 不变，可点击进入新详情 |
| 既有页面 TDH / URL / canonical / robots / redirect / hreflang / 主要内容 | ef4996e 状态 | 不变；32 URL + 3 精确匹配边界验证 |
| 首页、广告、多语言策略、共享下载/生成器 | 原实现 | 不变；只包装 middleware 响应，matcher 和语言识别算法不变 |
| PDF / SVG / PNG | v0.2 六文件 | 字节不变，品牌只在页脚，不叠盖题面；A4、120 点、9.2pt 不变 |
| Vercel Preview 索引保护 | 托管平台自身策略 | 未操作、未关闭；不能把 Preview 层 noindex 当作生产应用配置 |

中间件精确匹配范围：主路径（含有/无尾斜线）与 `/en`、`/de`、`/es`、`/pt`、`/fr`、`/it`、`/nl` 前缀。没有使用 `startsWith`；`mountain-landscape-120-extra` 与新路径的子路径不匹配，三项边界 HTTP/HTML 对照通过。静态 v0.2 文件路径也不在匹配范围内。

## 收益假设、下降情景与基线

- 技术收益已测：解除应用 noindex，提供 200、自指 canonical、可抓取 robots、sitemap 和已有目录 HTML 链接，消除虚假语言 alternate。
- Google 抓取、实际收录、点击增长仍是待观察结果，不保证收录或排名。ChatGPT 推荐/引用/实际引荐单独衡量，不用它冒充 Google 或 AdSense 收益。
- 风险：共享 middleware 匹配扩大可能破坏其他 URL hreflang；漏删新路径的 alternate 可能继续声明 404 翻译；误加 robots/canonical 可能阻断新页。精确路径、32 旧 URL、3 边界、七语言变体和 sitemap 回归用于限制这些风险。新 Mountain 与旧参考素材可能竞争相似查询，不能凭本地通过声称没有排名分流。
- 新 URL 尚未正式发布，没有可宣称的该 URL 生产 GSC 历史。旧 URL 的 GSC 查询/点击/展示/CTR/排名、国家和窗口，本轮未取得；GA4 落地页/来源及 AdSense 指标亦未取得，均为 **Unavailable**。没有编造数值，也没有据此宣称增长。
- 可复核技术基线：ef4996e 生产构建、原 PDF/预览、页面截图与文案、32 个 URL HTML/HTTP SEO 字段、原新页 noindex/错误 HTTP hreflang、原 sitemap/robots 和实际下载。完整差异在 `seo-impact-diff.json`，历史初版材料可按 ef4996e 查看。

## 测试、评审与发布

本地执行 `npm run build` + `npm start`，使用正式域名 Host / HTTPS forwarded headers 测应用配置，不部署、不从 Vercel status 推断生产运行结果。Googlebot/Bingbot 均实测 200，无 noindex 或 X-Robots-Tag；robots.txt 允许抓取，sitemap 恰好新增英文条目。32 旧 URL 的 HTML 语义及必要 HTTP SEO 字段完全一致；另测三项边界。原始 HTML 哈希保留，但不将构建 chunk 差异误算为文案变化；只对本地两端口产生的 fallback OG/Twitter origin 做一致化，没有归一化正式 URL 或索引指令。

新页两次浏览器 PDF 下载、1440px/390px 预览、50 项数字检查、六文件字节对照，以及四个旧条目共 16 次导出回归通过。默认构建、TypeScript、三处应用修改文件 lint、whitespace 检查通过。第三方资源请求在浏览器测试中阻止，未验证全站远程 CDN。

**04 独立 Technical Review：Pending**。Founder 专项实现授权已取得，但不代替 04 复核和最终发布批准；不伪造独立审核。A4 实印与非制作者试玩仍 **Pending**。

## 回滚与观察

- 发布记录：本轮没有上线 SHA/上线日期/发布人；最终 PR Head 是待审候选，不能填成已发布记录。
- 回滚基准：ef4996e。若发布后发现本修正的技术故障，由 Founder 指定负责人回退本次索引修正提交（保持更早 v0.2 内容集成）。这会恢复新页索引保留及原 sitemap，属于停止索引发布；应重新核对新页和旧 32 URL。不得因此修改或回退 PR #2。Draft 阶段可直接不合并，不影响线上。
- 若出现意外 noindex/robots 拒绝、canonical 错配、错误 404/redirect、重要 hreflang 或下载故障，立即停止后续发布，并由授权负责人按故障范围回滚。
- D0：04/Founder 验证实际最终托管响应的 200、robots、X-Robots-Tag、canonical、语言变体、sitemap、下载及移动版；Vercel Preview 的平台保护单独记录。
- D3–D7：观察 Google 抓取/索引及功能；D14/D28：在固定 URL/查询/国家/可比窗口下观察 GSC、GA4 来源和 AdSense PV/RPM/收益，并参考未改页面与季节性。ChatGPT 的推荐、引用与实际到站分别记录。
- 指标阈值与监测负责人需由 Founder 在正式实验前确定；没有历史数据时不事后捏造阈值。单日排名波动不自动归因为本修正，也不自动回滚。

完成本轮后停止，等待 Founder 最终发布批准。
