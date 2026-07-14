# CHANGELOG

> 记录规范参考 `建站与提审通用准则-v4-融合版.md` 第十四章。
> 每次迭代新增一条，格式：新增文件（含说明）/ 修改文件（含改动说明）/ 导航与内链变动。

---

## 2026-07-14 — 迭代07: Adults页面内容补强 + Hub-and-Spoke内链闭环

**Modified:**
- `app/[locale]/connect-the-dots-for-adults/ConnectDotsAdultsClient.tsx` — 新增"Difficulty at a Glance"难度对比表（Easy/Medium/Hard/Extreme四档，点数/耗时/适用人群），补齐AI GEO要求的结构化数据表格
- `app/[locale]/printable-connect-the-dots/PrintableClient.tsx` — EN语言的related链接区块加入 `/connect-the-dots-for-adults/` 和 `/dot-to-dot-printable/`
- `app/[locale]/dot-to-dot-printable/DotToDotPrintableClient.tsx` — related链接区块加入 `/connect-the-dots-for-adults/`

**Modified — wiring:**
- 无导航变动（决定：新内页不进Header/Footer全局导航，仅靠Hub页related链接传递内链权重，避免导航膨胀）

**待办（未在本次处理）：**
- [ ] Adults页面入站内链仅2个来源（printable-connect-the-dots、dot-to-dot-printable），未达"至少3个"标准，待后续新页面上线或补充到how-to-make/christmas-printables页面
- [ ] Hub-and-Spoke集群页面数仅3篇，距10篇"Niche Expertise"阈值有差距，**优先级：高**，后续排期需加快内页上线节奏

---

## 2026-07-14 — 迭代06: 新建 /connect-the-dots-for-adults/ 页面

**Added:**
- `app/[locale]/connect-the-dots-for-adults/page.tsx` — 目标词 "connect the dots for adults"（880/月，KD33）+ 相关词群（~1,610/月），EN单语言
- `app/[locale]/connect-the-dots-for-adults/ConnectDotsAdultsClient.tsx` — 工具首屏可见（Hero内嵌DotGeneratorClient，左文案右工具双栏布局），精选2张Hard/Extreme素材（非虚张图库），Cleveland Clinic出站权威引用，FAQ 6条，Schema: WebPage+SoftwareApplication+FAQPage

**Modified:**
- `app/sitemap.ts` — 新增 `/connect-the-dots-for-adults` 路由（en）

**说明：**
- Hard/Extreme素材决策：先用现有2张（Mountain Landscape、Mandala）上线，后续逐步补充，不强行凑图库
- 首次应用"工具必须首屏可见"新标准（来自ai-saas-website-iteration-rules.md）

---

## 2026-07-14 — 迭代05: Bluey/SpongeBob死链301跳转

**Modified:**
- `next.config.ts` — 新增 `removedPrintableRedirects`，用数组生成方式覆盖全部7语言前缀，将已下线的 `easy-bluey-01-*` 和 `medium-spongebob-01-*` 详情页301跳转至对应语言的 `/printable-connect-the-dots/`

**验证结果：**
- 已confirm生产环境跳转生效（用户实测反馈）

---

## 2026-07-14 — 迭代04: /dot-to-dot-printable/ 补发布（此前3周未push）

**说明：**
- 该页面代码早于此条记录已交付，但因故3周未实际push上线，GSC和线上搜索均查不到
- 本次为确认代码完整性后重新交付、用户完成push

**Added（原交付内容）:**
- `app/[locale]/dot-to-dot-printable/page.tsx`
- `app/[locale]/dot-to-dot-printable/DotToDotPrintableClient.tsx` — 目标词"dot to dot printable"（6,600/月）+ 相关词群，EN单语言，内容导向差异化（vs printable-connect-the-dots的图库导向），Schema: HowTo+FAQPage+WebPage

---

## 2026-06-26 — 迭代03: printable-connect-the-dots 页面改造 + Make Your Own按钮bug修复

**Modified:**
- `app/[locale]/printable-connect-the-dots/page.tsx` — 新增IT语言支持，修复FR/PT标题乱码
- `app/[locale]/printable-connect-the-dots/PrintableClient.tsx` — 全面改造：新增EN/DE/FR/IT四语言copy、FAQPage+CollectionPage Schema、难度筛选栏、生成器工具区、内链区
- `app/[locale]/printable-connect-the-dots/PrintableClient.tsx` — 修复"Make Your Own"按钮anchor跳转错误定位到FAQ的bug，改为scrollIntoView

**效果验证（GSC数据）：**
- CTR从3.87%提升至7.18%（+85%）
- 多语言版本开始出量：FR 23点击、PT 39点击、IT 13点击、ES 12点击、DE 5点击（此前均接近0）

---

## 2026-06-26 — 迭代02: 版权风险清理

**Modified:**
- `lib/printables-data.ts` + 6个多语言数据文件（de/es/fr/it/nl/pt）— 删除Bluey（Disney）和SpongeBob（Nickelodeon）条目
- 原因：网站此前因IP版权问题导致PayPal被封户，需彻底清理避免Stripe重蹈覆辙

**待办（后续处理）：**
- R2存储桶需手动删除对应图片文件（用户异步操作）
- 产生的详情页死链需301跳转（已在迭代05完成）

---

## 2026-06-26 — 迭代01: 技术债修复（sitemap死链 + .html重定向）

**Modified:**
- `app/sitemap.ts` — 删除 `/gallery`、`/editor` 两个不存在页面的死链条目（共14个无效URL，含多语言）
- `middleware.ts` — 修复matcher正则，原规则 `.*\\..*` 会拦截所有含点号路径导致 `.html` URL无法进入Next.js的redirects()流程；改为 `.*\\.(?!html$)[^/]*$`，使 `.html` URL能正常触发既有的301跳转规则

**背景：**
- GSC数据显示 `.html` 版本页面（如`christmas-printables.html`）与`/`版本并存，分流权重，`christmas-printables.html`有2,580次曝光但0点击

---

*文档创建日期：2026-07-14*
*后续每次迭代请在文件顶部新增一条记录，最新记录始终置顶*
