# ConnectTheDots 支付系统 SOP（可复用版）

本 SOP 基于当前仓库真实代码梳理，目标是：
- 让你在本项目继续扩展支付时不踩坑
- 让你在下一个新项目可以直接照搬流程

---

## 1. 当前支付架构（先看全局）

### 1.1 架构角色
- 前端（本仓库 Next.js）：展示套餐、发起支付、处理回跳、刷新用户积分/会员状态。
- 支付中转后端（外部 Java 服务）：真正调用 Stripe/PayPal，处理订单、回调、状态查询。
- 数据库（MySQL + Prisma）：`User` 存用户积分和会员等级，`Pay` 存订单记录。

### 1.2 关键代码入口
- 套餐页（支付按钮）：
  - `app/[locale]/pricing/PricingContent.tsx`
- Stripe 创建支付 URL：
  - `app/api/pay/create/route.tsx`
- PayPal 一次性支付：
  - `app/api/pay/paypal-smart-create/route.tsx`
  - `app/api/pay/paypal-smart-capture/route.tsx`
- PayPal 订阅：
  - `app/api/pay/paypal-smart-create-subscription/route.tsx`
- PayPal 回调校验：
  - `app/api/pay/paypalCheck/route.tsx`
- Stripe 回调结果页（轮询状态）：
  - `app/[locale]/stripePayment/page.tsx`
- PayPal 回调结果页（轮询/重试）：
  - `app/[locale]/palpalPayment/page.tsx`
- 登录与积分/会员同步：
  - `lib/auth-context.tsx`
  - `app/api/auth/login/route.tsx`
- PayPal SDK Provider：
  - `components/PayPalProviderWrapper.tsx`
- 会员/订单数据结构：
  - `prisma/schema.prisma`

---

## 2. 当前真实支付流程（按渠道）

## 2.1 Stripe 流程
1. 用户在套餐页点击 `Pay with Stripe`。
2. 前端调用 `POST /api/pay/create`，传 `type + googleUserId + email + userId`。
3. Next API 转发到外部后端 `.../prod-api/stripe/getPayUrl`，返回 Stripe Checkout URL。
4. 前端 `window.location.href = data.url` 跳转到 Stripe。
5. Stripe 完成后跳回 `stripePayment` 页面（带 `session_id`）。
6. `stripePayment` 页面轮询 `.../prod-api/stripe/check-order-status?sessionId=...`。
7. 轮询返回 `paid` 后，调用 `refreshUser()` 同步最新积分/会员状态，再跳回首页。

## 2.2 PayPal 一次性支付
1. 套餐卡判断 `type` 非 `monthly/yearly`，`PayPalButtons` 走 `createOrder`。
2. `createOrder` 调 `POST /api/pay/paypal-smart-create`，拿 `orderId`。
3. 用户授权后触发 `onApprove`，前端调用 `POST /api/pay/paypal-smart-capture` 完成扣款。
4. capture 成功后显示成功态，再跳回首页。

## 2.3 PayPal 订阅支付
1. 套餐卡判断 `type` 包含 `monthly/yearly`，`PayPalButtons` 走 `createSubscription`。
2. `createSubscription` 调 `POST /api/pay/paypal-smart-create-subscription`，拿订阅 ID（`I-xxxx`）。
3. `onApprove` 目前仅前端切成功态（不再额外 capture）。
4. 部分场景通过 `palpalPayment` 页 + `/api/pay/paypalCheck` 做后置校验/重试。

---

## 3. 套餐与权限约定（必须统一）

### 3.1 套餐类型常量（前后端必须一模一样）
- `content_lifesaver_once`
- `content_creator_monthly`
- `content_pro_master_yearly`

### 3.2 用户权益字段
- `User.plan`: 当前用于区分 `free/premium`
- `User.credits`: 当前是字符串类型（使用时要 `parseInt`）

### 3.3 订单表字段（用于查账）
- `Pay.orderNo`, `Pay.orderId`, `Pay.status`, `Pay.type`, `Pay.businessType`, `Pay.amount`

---

## 4. 新项目复用 SOP（推荐标准流程）

## 4.1 第 0 步：先定“单一真相”
在开发前先写清楚三件事：
1. 套餐 ID（机器可读）  
2. 权益模型（credits 增加多少、plan 怎么升级）  
3. 回调成功判定（什么状态算最终成功）  

如果这三项不先固定，后面一定会出现“支付成功但前端没到账”的问题。

## 4.2 第 1 步：后端先通，再做前端
1. 在支付后端实现：
   - 创建订单（Stripe/PayPal）
   - 支付成功落库（幂等）
   - 提供订单状态查询 API（前端轮询兜底）
2. 本仓库 Next API 只做轻代理（不做复杂业务）。

## 4.3 第 2 步：前端支付组件实现
1. Stripe：点击后拿 URL 并跳转。
2. PayPal：
   - 一次性：`createOrder + capture`
   - 订阅：`createSubscription`（必要时再调用后端确认）
3. 所有按钮加 loading，防重复点击。

## 4.4 第 3 步：回调页统一模板
每个支付渠道都要有单独回调页，统一这 4 态：
- `verifying`
- `success`
- `timeout`
- `error`

并且在 `success` 态必须执行：
1. `refreshUser()`
2. 延迟跳转（让用户看见成功）

## 4.5 第 4 步：上线前环境变量
不要硬编码密钥/Client ID。至少改成：
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
- `PAY_GATEWAY_BASE_URL`
- `PAY_GATEWAY_API_BASE_URL`

并区分：
- 本地
- 测试
- 生产

## 4.6 第 5 步：回归测试（必须过）
1. 未登录点击支付是否触发登录
2. 登录后 Stripe 一次性成功
3. 登录后 PayPal 一次性成功
4. 登录后 PayPal 订阅成功
5. 用户取消支付（Cancel）
6. 网关超时/失败（error 展示）
7. 支付成功后积分/plan 是否立即同步
8. 多语言路径下回调页是否正常（`/en`、`/de` 等）

---

## 5. 本项目当前风险点（已识别）

## 5.1 配置与安全
1. `PayPal clientId` 硬编码在前端组件（应改 env）。  
2. 支付网关域名有两套：
   - `https://api.connectthedotsprintable.online`
   - `https://connectthedotsprintable.online`
   建议统一，避免跨域/证书/缓存策略不一致。

## 5.2 逻辑一致性
1. PayPal 成功码在不同地方判断不一致（有的判断 `code===0`，有的判断 `code===200`）。
2. 订阅流 `onApprove` 里主要依赖前端成功态，建议加后端最终状态确认。
3. `palpalPayment` 目录名拼写异常（建议规范为 `paypalPayment`，并做好兼容跳转）。

## 5.3 可维护性
1. `testpricing` 与 `pricing` 存在重复实现，容易逻辑漂移。
2. `api/pay/create` 中 `priceMap` 仅做校验，实际金额以后端为准，建议明确注释并抽常量。
3. `api/auth/me` 用 cookie `session_user_id`，但当前主链路主要使用 `localStorage + /api/auth/login`，需统一认证策略。

---

## 6. 支付故障排查 SOP（值班版）

## 6.1 用户反馈“付了钱但没到账”
1. 先拿用户标识：`googleUserId/email`
2. 查支付后端订单状态（按 `orderId/sessionId/subscriptionId`）
3. 查 `pay` 表是否成功落库
4. 如果已成功：让用户刷新（或手动触发 `refreshUser`）
5. 如果后端未成功：重放 webhook 或人工补单

## 6.2 用户反馈“支付页一直转圈”
1. 检查回调参数是否有 `session_id` / `token` / `PayerID`
2. 检查状态查询接口是否返回可识别状态
3. 检查前端成功判断条件是否和后端返回一致
4. 看浏览器网络请求是否被 CORS/网关拦截

## 6.3 用户反馈“点击支付无反应”
1. 检查是否未登录
2. 检查按钮 loading 是否卡死
3. 检查 `/api/pay/*` 返回是否 200
4. 检查外部网关是否超时或返回非 JSON

---

## 7. 本项目后续优化优先级（建议）

P0（必须）  
1. 把 PayPal Client ID 改为环境变量。  
2. 统一支付成功码协议（例如统一 `{ code: 0 }`）。  
3. 订阅支付增加后端最终确认接口，不只靠前端 `onApprove`。  

P1（高）  
1. 合并 `pricing` 和 `testpricing` 的支付实现。  
2. 统一支付网关域名。  
3. 给每笔支付生成 traceId，前后端日志串联。  

P2（中）  
1. 将 `credits` 从 `String` 升级为数值类型。  
2. `plan` 升级为枚举（free/creator/pro...）。  
3. 增加支付 E2E 自动化（Playwright）。  

---

## 8. 新项目复制模板（最短执行版）

1. 复制本仓库这 5 类文件：
- `app/api/pay/*`
- `app/[locale]/pricing/*`
- `app/[locale]/stripePayment/page.tsx`
- `app/[locale]/palpalPayment/page.tsx`
- `components/PayPalProviderWrapper.tsx`

2. 替换配置：
- 网关域名
- 套餐 type 常量
- 回调地址
- PayPal Client ID（env）

3. 对齐后端协议：
- 创建订单返回字段
- 成功码定义
- 状态查询字段（例如 `paid`）

4. 跑完整回归清单（见 4.6），通过后再上线。

---

如果你愿意，我下一步可以直接再给你一份「支付改造实施清单（按开发任务拆分到可执行 issue）」，你可以直接分配给前后端同事执行。
