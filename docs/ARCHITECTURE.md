# Architecture knowledge base

> Repository snapshot reviewed: 2026-08-10. **Confirmed** means visible in source/configuration. **Unknown** means the repository cannot establish the runtime fact.

## System context

The application is a Next.js 16 App Router project using React 19 and TypeScript (`package.json`, `app/`). It combines server-rendered/content pages, substantial client-side canvas editors, Next.js route handlers, a MySQL database through Prisma, S3-compatible R2 object storage, and several external identity/generation/payment services.

```text
Browser
  -> Next.js localized pages and client components
  -> Next.js /api route handlers
       -> MySQL via Prisma
       -> R2 via AWS S3 SDK
       -> Google userinfo
       -> api.connectthedotsprintable.online (auth/credits/payments)
       -> Volcengine Doubao image generation
       -> Creem prompt moderation
  -> Google Analytics / Microsoft Clarity / AdSense
```

The hosting provider is **Unknown**. `.vercel/` is ignored and a Vercel asset is present, but those facts do not prove deployment on Vercel.

## Runtime and build

- `npm run dev` runs `next dev`; `npm run build` runs `prisma generate && next build`; `npm start` runs `next start`; `npm run lint` runs ESLint (`package.json`).
- TypeScript is strict and no-emit, uses bundler resolution, and maps `@/*` to the repository root (`tsconfig.json`).
- Tailwind CSS 4 is loaded through PostCSS, with application-wide styles in `app/globals.css`.
- `next-intl` wraps Next config and supplies middleware/navigation/message loading (`next.config.ts`, `middleware.ts`, `i18n/`).
- Trailing slashes are enabled. Middleware excludes API and static asset requests and applies locale handling to application paths.
- No automated unit, integration, or end-to-end test command/configuration was found.

## Application layers

### Routing and rendering

- `app/[locale]/layout.tsx` supplies the localized HTML shell, translations, authentication context, PayPal provider, shared header/footer, feedback widget, analytics, Clarity, and AdSense.
- Server page modules generally generate localized metadata and render a client content component. Many content components embed JSON-LD.
- `app/(standalone)/` bypasses the localized shared layout for a shopping-guide route.
- `app/sitemap.ts` produces a runtime sitemap from a static route allowlist and English catalog records.

### Client feature code

- `components/DotGeneratorClient.tsx` contains the main connect-the-dots editor and is the largest product component. It owns canvas state, image processing, editing, download, AI generation, and save operations.
- `app/[locale]/convert-photo-to-beads/editor/page.tsx` and neighboring components implement a second canvas/grid editor.
- `lib/auth-context.tsx` owns browser authentication state and Google OAuth initiation/callback handling.
- Content hubs typically separate a server `page.tsx` from a client presentation component.

### Domain/content data

- Printable metadata is code-defined in `lib/printables-data.ts` and localized sibling modules. `lib/data.ts` is a thin English lookup wrapper.
- `lib/generated-standalone-printables.json` is generated content imported into the English catalog.
- `lib/seo-showcase.ts` selects catalog entries for proof/example modules.
- Bead palette and gallery types/data live under `app/[locale]/convert-photo-to-beads/`.

### API routes

| Route | Confirmed responsibility |
|---|---|
| `GET /api/auth/me` | Reads `session_user_id` cookie and returns selected Prisma user fields. |
| `POST /api/auth/login` | Validates a Google access token, creates/updates a site user, and derives a plan from payment tables. |
| `POST /api/doubao` | Authenticates through the external backend, moderates a prompt, generates an image, and consumes a credit. |
| `POST /api/connect-dots/save` | Validates Google token, uploads two images to R2, and creates a public puzzle. |
| `GET /api/connect-dots/[slug]` | Returns one public saved puzzle. |
| `GET /api/connect-dots/gallery` | Lists public saved puzzles with optional difficulty/limit. |
| `POST /api/feedback` | Validates/truncates feedback and context and inserts it into MySQL. |
| `GET/POST /api/gallery...` | Reads, uploads, or migrates bead-pattern JSON in local storage/R2. |
| `/api/pay/*` | Proxies checkout, PayPal order/subscription/capture, and return verification to an external Java-style backend. |

No checked-in OpenAPI schema or explicit API versioning is present.

## Persistence

### MySQL/Prisma

`prisma/schema.prisma` defines:

- `User` mapped to `google_user`, with Google identity/profile fields, string-valued credits/score/streak, plan/type, access token, and relations to payments and puzzles.
- `Pay` mapped to `pay`, containing order/provider response/status/type/amount information.
- `ConnectDotsPuzzle` mapped to `connect_dots_puzzle`, with owner, unique slug, image URLs, difficulty/dot count/dimensions/settings, and public visibility.
- `Feedback` mapped to `feedback`, with message/quick vote/contact plus navigation, referrer, device, IP, viewport, user agent, and optional screenshot context.

`lib/prisma.ts` provides a singleton Prisma client in development. `DATABASE_URL` is required by Prisma. Schema migrations, seeding, backups, connection pooling, and production database topology are **Unknown**.

`app/api/auth/login/route.tsx` also queries a `paypal_pay` table that is not represented by a Prisma model. Its schema and owner are **Unknown**.

### Object and file storage

- R2 clients use the AWS S3 SDK with `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, and `R2_BUCKET_NAME`. Saved puzzle URLs also require `R2_PUBLIC_URL`.
- Bead gallery APIs choose R2 when endpoint/access-key variables exist and otherwise read/write a local `data/gallery` directory.
- The repository does not contain `data/gallery`; behavior in a read-only or ephemeral server runtime is **Unknown**.

## External integrations

Confirmed source integrations are Google OAuth/userinfo, Google Analytics, AdSense, Microsoft Clarity, PayPal's React provider, the external `api.connectthedotsprintable.online` auth/credits/payment backend, Creem checkout/moderation, Stripe checkout/status through that backend, Volcengine Ark/Doubao, Cloudflare-style R2, and a background-removal URL at `ytdlp.vistaflyer.com`.

Service-level agreements, account ownership, network controls, webhook handling, retry policy, and production credentials are **Unknown**.

### Commercial implementation versus production operation

- **Implemented in repository:** `/pricing` connects to a Creem checkout request; Stripe and PayPal routes, UI, return pages, and proxy handlers also remain in source (`app/[locale]/pricing/`, `app/[locale]/stripe-pricing/`, `app/api/pay/`).
- **Historical production providers, confirmed by the product owner:** Stripe, PayPal, and Creem.
- **Current production status, confirmed by the product owner on 2026-09-02:** payment/subscription monetization is **PAUSED**.
- The product owner reports that cartoon-IP content introduced during a material update affected the PayPal account and led to its ban; the owner then paused payment/subscription monetization.
- The presence and connectivity of these code paths does not establish that any payment capability is operational in production.

## Configuration contract

Environment names referenced in source are:

- `DATABASE_URL`
- `DOUBAO_API_KEY`
- `R2_ENDPOINT`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`
- `R2_PUBLIC_URL`
- `NEXT_PUBLIC_BASE_URL`
- `NODE_ENV` (platform-provided convention)

No example environment file or configuration validation module is checked in. Required/optional status can be inferred in individual call paths, but the complete deployment contract is **Unknown**.

## Authentication and authorization boundaries

- The browser auth context primarily talks to the external backend and stores bearer credentials in local storage.
- Local `/api/auth/login` separately verifies Google and writes to Prisma.
- `/api/connect-dots/save` validates its bearer token directly with Google.
- `/api/auth/me` expects a `session_user_id` cookie, but no checked-in route sets that cookie.
- Public puzzle reads enforce `isPublic`; gallery upload/migration routes show no authentication or role check.

Whether upstream middleware, infrastructure, or the external backend supplies additional access controls is **Unknown**.

## Key request flows

### AI-to-puzzle flow

1. The generator submits a prompt and local-storage bearer token to `/api/doubao`.
2. The route fetches the user/credit balance from the external backend.
3. It sends the prompt to Creem moderation; moderation transport failure is logged and generation proceeds.
4. It requests a Doubao image, downloads the remote result, then consumes one external credit.
5. The image bytes return to the browser for conversion/editing (`components/DotGeneratorClient.tsx`, `app/api/doubao/route.tsx`).

### Saved-puzzle flow

1. The client submits title/settings and original/puzzle files with a Google bearer token.
2. The route validates the token at Google and finds a local user by email.
3. It uploads images to R2 and creates a public database row.
4. Public routes later retrieve the record by slug or gallery query.

### Static printable flow

1. Locale route selects a locale-specific dataset.
2. Hub/detail server pages generate metadata and render content/client components.
3. Media comes from the checked-in public directory or the hard-coded public R2 CDN.

## Operational visibility

Client analytics and feedback persistence exist, and server routes use console logging for errors. No checked-in centralized logging, error-reporting SDK, tracing, metrics, health check, alert definitions, or runbooks were found. Production observability is therefore **Unknown** beyond GA/Clarity and stored feedback.
