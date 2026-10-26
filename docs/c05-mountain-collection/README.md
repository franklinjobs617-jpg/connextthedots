# C05 — [Codex] Mountain 120 Collection Fix

Growth Sprint 1B · ConnectTheDotsPrintable — Growth Lab

基线为最新 main `ebdb92c1143ef149cc5dfc04e43f51cb0dbc0f13`（已合并 PR #3），独立分支 `codex/c05-mountain-120-collection-fix`。本轮仅交付 Draft PR，等待 Founder 批准合并；不推送 main、不 Merge、不执行 Deploy。

## 修改与 Before / After

仅两处应用源码变更；本目录为定向测试、证据与交接。

| 文件 | Before | After |
| --- | --- | --- |
| `app/[locale]/printable-connect-the-dots/PrintableClient.tsx` | 英文 All 49；Mountain 只有列表外入口；Extreme/100+ 只有原 Mandala | 仅英文页面内追加既有 `mountain120` 记录，All 50；英文按钮显示 `100+ dots`，原 Mandala 后追加 Mountain；Mountain 保持 Unrated。旧卡片信息与顺序保持；原列表外入口保留 |
| `components/PrintableCard.tsx` | 默认所有卡片显示 Popularity，缩略图 cover | 新增可选 `showPopularity` 与 `imageFit`，默认行为保持；仅本集合的 Mountain 关闭 Popularity、采用 contain 完整展示原 A4 预览 |

没有修改共享素材数据、`lib/mountain-120.ts`、语言数据、路由、server page、metadata、middleware、sitemap、robots 或 PDF/图片。Mountain 原记录中的 `popularity: 0` 不被展示，也未注入任何共享 difficulty bucket；其它页面调用卡片仍使用原默认值。

## 最小 SEO Impact Diff

- `/printable-connect-the-dots/` 与 `/printables/mountain-landscape-120/` 保持原 URL；没有创建 `/printables/` 集合页。
- 七种语言集合的 Title、Description、H1、全部 meta、canonical、HTML/HTTP hreflang、robots 与状态保持。英文 Schema 唯一差异是 `ItemList.numberOfItems: 49 → 50`；既有前 20 条 ListItem、FAQ Schema 不变。
- 英文列表增加一条指向现有详情的卡片链接；既有链接均保留。筛选按钮从 Extreme 改称 `100+ dots`，不改变旧题难度，也不为 Mountain 认定 Extreme。
- Mountain 英文详情在普通 UA、Googlebot、Bingbot 下均为 200、`index, follow`、原自指 canonical；无 X-Robots-Tag、无虚假 hreflang，原图片 preload 保留。
- 六个不存在的非英文 Mountain 详情继续 404/noindex。sitemap 的现有英文 Mountain 条目恰一条，无语言 alternates；整个 sitemap 仅排除原有构建时间 lastmod 后一致。robots.txt 字节一致。

逐路由字段、哈希与允许差异见 [seo-impact-diff.json](seo-impact-diff.json)。这是本地生产构建对比，不代表已对线上托管响应或 Google 收录作验证。

## 最小回归结果

| 英文筛选 | Before | After |
| --- | --- | --- |
| All | 49 | 50 |
| Easy | 27 | 27 |
| Medium | 20 | 20 |
| Hard | 1 | 1 |
| 100+ | 1 | 2 |

- 七语言 × 五筛选均通过；逐张比较旧卡片完整 HTML 和顺序。DE / FR / IT / ES / PT / NL 的 All 分别保持 19 / 22 / 19 / 49 / 19 / 49，全部筛选保持。NL 原有英文 fallback 也保持。
- Mountain 卡片显示 `Dots: 120`、Adults、Unrated、原 Puzzle PNG，无 Popularity。1440px / 390px 图片可解码、contain、无横向溢出；[390px 截图](collection-390.png)与[桌面卡片截图](mountain-card-1440.png)已目检。
- 实际点击 Mountain 卡片进入既有详情。Puzzle / Solution 两次实际浏览器下载均成功，HTTP 200 / application/pdf，字节与仓库原 PDF 一致；未生成或修改 PDF，未重跑 PR #3 的数字审计。
- main 与修复后默认 `npm run build` 均通过；`npx tsc --noEmit`、两处组件 ESLint（0 errors）、`git diff --check` 通过。保留原有 `<img>` 的 next/no-img-element warning。

结构化结果见 [regression.json](regression.json)。复验脚本 [verify.py](verify.py) 要求 Python Playwright、`/usr/bin/chromium`，基线和候选分别运行本地生产服务 3100 / 3101，再执行 `python docs/c05-mountain-collection/verify.py`。第三方浏览器请求被阻止，避免广告/统计/外部 API 副作用；旧缩略图远程 CDN 的可用性不在本轮验证范围。

## 未验证与停止条件

未部署，因此未验证发布后线上 CDN/托管响应、线上交互或实际搜索收录/排名。第三方图片 CDN 未做连通性测试；未开展全站 QA、实印/独立试玩复验或重复 PDF 数字核查。Founder 已认可的素材与原下载文件直接复用。

回滚本次集合行为只需还原两处组件；既有详情、PDF、sitemap 和旧 49 张数据均独立保留。Draft PR 创建后停止，等待 Founder 批准合并。
