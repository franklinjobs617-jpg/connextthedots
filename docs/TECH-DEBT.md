# Technical-debt register

> Repository snapshot reviewed: 2026-08-10. Items are limited to conditions visible in the repository. Priority labels are maintainers' triage aids based on apparent impact, not evidence of a production incident. No production code was changed while creating this register.

## Critical / security-sensitive

### Hard-coded moderation credential

- **Confirmed:** `app/api/doubao/route.tsx` sends a literal `creem_...` value as an `x-api-key` to the moderation service.
- **Risk inference:** a credential committed to source may be exposed through repository access/history and cannot be independently rotated per environment.
- **Unknown:** whether the literal is active, scoped, public by design, or already revoked.

### Unauthenticated gallery mutation and migration routes

- **Confirmed:** `POST /api/gallery/upload` accepts a pattern and writes it to local disk or R2 without an authentication/authorization check. `GET /api/gallery/migrate` reads local files, rewrites them, and may upload them to R2, also without an apparent authorization check (`app/api/gallery/upload/route.ts`, `app/api/gallery/migrate/route.ts`).
- **Risk inference:** if publicly reachable, callers could create storage content or trigger administrative migration behavior.
- **Unknown:** whether infrastructure restricts these routes.

### Sensitive user material stored directly

- **Confirmed:** `User.accessToken` is a text database field, and client auth tokens/user profiles are stored in local storage (`prisma/schema.prisma`, `lib/auth-context.tsx`). Feedback can store IP, user agent, navigation, contact, and a base64-style screenshot in a long-text field.
- **Unknown:** encryption at rest, token expiry/revocation practice, database access controls, retention/deletion, and whether screenshots can contain sensitive information.

## High priority

### Split and inconsistent authentication paths

- The client auth context calls the external backend for user state, while `/api/auth/login` separately manages local Prisma users.
- `/api/auth/me` expects a `session_user_id` cookie, but no checked-in code sets it.
- `/api/connect-dots/save` validates Google directly and finds a user by email.
- AI generation authenticates against the external backend rather than the local login API.
- **Confirmed consequence:** multiple identity contracts and storage mechanisms must remain aligned.
- **Unknown:** intended source of truth and whether all paths are actively used.

### Database schema drift / unsafe raw dependencies

- `app/api/auth/login/route.tsx` uses `$queryRawUnsafe` against both `pay` and `paypal_pay`; `paypal_pay` has no Prisma model in `prisma/schema.prisma`.
- Payment status semantics differ in the same resolver (`pay.status = '1'`, `paypal_pay.status = '2'`).
- No Prisma migrations are checked in.
- **Unknown:** authoritative external schema, migration process, and whether status values are correct by provider.

### AI moderation fail-open behavior

- **Confirmed:** network/errors from the Creem moderation request are caught, logged, and generation continues (`app/api/doubao/route.tsx`).
- **Risk inference:** moderation availability failures bypass that control.
- **Unknown:** whether Doubao or another upstream layer independently moderates requests.

### Missing request hardening on resource-intensive routes

- Gallery upload and connect-dots save accept multipart/body content without a repository-visible request-size limit or rate limiter.
- AI generation permits cross-origin requests with `Access-Control-Allow-Origin: *`; it does require a bearer token and credit.
- Public gallery `limit` is parsed directly and has no repository-visible upper bound.
- **Unknown:** platform-level body limits, WAF, rate limits, or abuse controls.

## Medium priority

### Oversized, multi-responsibility client components

- `components/DotGeneratorClient.tsx`, `components/HomeContent.tsx`, and `app/[locale]/convert-photo-to-beads/editor/page.tsx` combine substantial state, presentation, network, canvas, and business logic.
- **Risk inference:** broad responsibilities increase review/testing cost and regression surface.
- No automated tests cover these workflows.

### No automated test suite

- `package.json` exposes dev/build/start/lint only; no unit, integration, or end-to-end test framework/configuration is tracked.
- Critical flows dependent on canvas behavior, auth, R2, MySQL, external AI, and three payment approaches therefore have no repository-defined automated regression checks.

### Incomplete environment contract

- Multiple environment variables are referenced, but no `.env.example`, schema validator, or deployment documentation is tracked.
- Some external hostnames, IDs, prices, app type values, and public CDN URLs are hard-coded while secrets/endpoints are partly environment-driven.
- **Unknown:** which values differ by environment and which integrations are mandatory.

### Local filesystem fallback in a server application

- Bead gallery routes fall back to `data/gallery`; that directory is absent from the tracked repository, and upload uses synchronous directory/file operations (`app/api/gallery/*.ts`).
- **Unknown:** whether the production runtime has persistent writable storage. On an ephemeral runtime, writes may not survive or be shared across instances.

### Error and response inconsistency

- APIs return several unrelated shapes (`error`, `status`, `code/msg/data`) and do not share validation/error utilities.
- Several routes use `any`; caught errors sometimes disclose upstream messages and sometimes collapse to generic messages.
- There is no checked-in API schema or contract test.

### Payment surface duplication

- The repository contains `/pricing`, `/stripe-pricing`, `/testpricing`, `/paypalpayment`, typo-named `/palpalPayment`, `/stripePayment`, `/creemPayment`, and several overlapping payment proxy routes.
- `next.config.ts` redirects `/testpricing` to `/pricing`, but source remains.
- **Implemented in repository:** `/pricing` currently connects to Creem checkout creation; Stripe and PayPal implementations also remain in source.
- **Product-owner-confirmed production status (2026-09-02):** payment/subscription monetization is **PAUSED**. Stripe, PayPal, and Creem were historical production providers.
- The product owner reports that cartoon-IP content introduced during a material update affected the PayPal account and led to its ban, after which monetization was paused.
- The retained code must not be interpreted as evidence that payment or subscription flows are currently operational in production.

### Catalog localization duplication

- Seven large locale-specific printable data modules duplicate structure and records.
- English incorporates generated standalone records, while localized modules have separate hand-coded lists.
- **Risk inference:** additions and schema changes can drift between languages.
- Translation review status is **Unknown**.

## SEO/content debt

### Default Open Graph asset mismatch

- `app/[locale]/layout.tsx` references `/images/og-image.png`; only `public/images/og-image.jpg` is tracked.

### Sitemap freshness semantics

- `app/sitemap.ts` sets every entry's `lastModified` to the generation time. This does not reflect verified content modification time.

### Route/indexation ambiguity

- Source retains routes that redirects make unreachable at their original paths, plus payment/test/user/gallery routes without apparent `noindex` metadata.
- `robots.txt` allows all routes.
- **Unknown:** intended indexation policy for non-content and user-generated routes.

### Historical plans are not a current status source

- SEO plan/log/changelog files contain dated observations and recommendations. No current Search Console export or automated SEO audit is tracked.
- **Unknown:** which historical recommendations remain pending after later code changes.

## Low priority / maintainability

### Naming and consistency

- `package.json` still names the package `my-app`.
- Route casing and spelling are inconsistent (`connectTheDotsGenerator`, `palpalPayment`, `paypalpayment`, `stripePayment`).
- Code comments and implementation text mix English and Chinese.
- Formatting varies substantially across files.

### Dead or ambiguous artifacts

- Root `2.html` is a large standalone artifact with no import/reference found in application code.
- Several legacy page implementations remain even though Next redirects consolidate their public URLs.
- `public/next.svg`, `vercel.svg`, `globe.svg`, and `file.svg` resemble starter assets; whether they are used was not established.
- The standalone shopping guide's product relationship is **Unknown**.

### Dependency reproducibility observations

- Most dependency versions use caret ranges while core Next/React packages are exact; `package-lock.json` is tracked, so npm installs using the lockfile remain pinned.
- No Node engine or package-manager field is declared in `package.json`; expected runtime version is **Unknown**.

## Operational unknowns

No checked-in evidence was found for centralized server error reporting, health checks, metrics, tracing, alerting, incident runbooks, backup/restore tests, disaster recovery, dependency scanning, secret scanning, CSP/security headers, or CI configuration. These capabilities may exist outside the repository; their status is **Unknown**.

## Suggested verification order (documentation only)

This ordering is an inference from the visible risk surface, not a claim about incidents:

1. Determine whether the hard-coded moderation key is active and whether gallery mutation/migration routes are publicly reachable.
2. Document the authoritative authentication, credit, plan, and payment systems.
3. Establish the deployment environment contract and storage/database migration model.
4. Add regression coverage for generator, auth, save/gallery, and checkout flows.
5. Decide which duplicate/legacy routes and artifacts should remain.
6. Validate live analytics, privacy/consent, sitemap, metadata, and indexation against production.
