# Analytics and feedback knowledge base

> Repository snapshot reviewed: 2026-08-10. This file documents instrumentation found in source. Data collection in production, consent status, and report contents are **Unknown**.

## Installed client analytics

The localized root layout installs these scripts on every route using `app/[locale]/layout.tsx`:

| System | Confirmed identifier | Loading |
|---|---|---|
| Google Analytics | `G-CM76E2ZP8E` | `GoogleAnalytics` from `@next/third-parties/google` |
| Microsoft Clarity | `tf6ljm5fsf` | inline bootstrap script with `lazyOnload` |
| Google AdSense | publisher `ca-pub-3383070348689557` | async AdSense script and metadata |

The standalone shopping-guide layout does not import these integrations. Whether analytics is injected by infrastructure for that route is **Unknown**.

## Explicit Google Analytics events

`components/DotGeneratorClient.tsx` defines a guarded `window.gtag("event", ...)` helper and emits:

| Event | Confirmed context/parameters |
|---|---|
| `user_upload_image` | Upload flow; includes file-related context in the call site. |
| `clear_canvas` | Includes `dots_before`. |
| `ai_generate_start` | Includes `prompt_length`. |
| `ai_generate_success` | Emitted after successful AI generation. |
| `ai_generate_fail` | Includes an error string. |
| `download_result` | Includes export/result context at the call site. |

No explicit events were found for sign-in success, puzzle save/publish, pricing view, checkout start, payment success, printable/PDF download, bead export, gallery upload, feedback submission, or subscription lifecycle.

GA automatically collected/enhanced-measurement behavior depends on property settings and is **Unknown**. The repository contains no GA property configuration, custom-dimension definitions, conversion markings, retention settings, filters, or dashboard definitions.

## Microsoft Clarity

Clarity is initialized globally on localized pages. The source contains no custom Clarity event, identify, consent, or masking calls. Session recording/heatmap settings and captured production sessions are configured outside the repository and therefore **Unknown**.

## First-party feedback telemetry

`components/FeedbackWidget.tsx` provides manual, timed-nudge, and error-nudge feedback entry points. It can submit:

- message and optional contact;
- quick type (`bug`, `feature`, `content`, or `other`);
- helpful/not-helpful vote;
- trigger source;
- current URL/path, referrer, timezone, language, platform, user agent, device classification;
- recent navigation/action path from session storage;
- viewport and screen dimensions;
- optional screenshot data.

`app/api/feedback/route.ts` validates/truncates fields, derives an IP address from proxy headers, and persists the record through the `Feedback` Prisma model. It allows a submission when at least a message, valid quick type, or boolean helpful vote is present.

Client storage keys control nudge timing and navigation history. The exact number of stored production submissions, who can review them, retention/deletion process, and alerting are **Unknown**.

## Product and business data that exists outside analytics

- `User` records include credits, score, plan, and timestamps.
- `Pay` records include order, status, product type, amount, and timestamps.
- `ConnectDotsPuzzle` records include owner, difficulty, dot count, dimensions, visibility, and timestamps.
- External auth/credits/payment services also return state used by the application.

These structures could support reporting, but no warehouse, ETL, BI queries, reporting endpoints, or dashboards are checked in. The external backend's data model and analytics are **Unknown**.

### Commercial production context

- Payment-related models, pages, and service calls are **implemented in the repository**.
- The product owner confirms that Stripe, PayPal, and Creem were historical payment providers.
- The product owner confirms that payment/subscription monetization is currently **PAUSED**; repository instrumentation must therefore not be interpreted as evidence of an operating production conversion funnel.
- The product owner reports that a material update introduced cartoon-IP content, the PayPal account was affected and banned, and monetization was subsequently paused.
- No repository evidence proves that current production payment or conversion data is entering GA. This remains **Unknown**.

## Privacy and consent observations

- The privacy page says third-party services such as Google Analytics may be used (`app/[locale]/privacy/PrivacyContent.tsx`).
- Analytics, Clarity, and AdSense load directly in the localized root layout.
- No cookie-consent platform, analytics opt-in/out component, Global Privacy Control handling, or consent-mode call was found in the repository.
- Auth tokens and user snapshots are stored in local storage; feedback navigation history uses session storage (`lib/auth-context.tsx`, `components/FeedbackWidget.tsx`).

Whether consent is handled by hosting infrastructure, a tag-manager setting, geolocation, or another external layer is **Unknown**. Legal compliance cannot be determined from repository code alone.

## Measurement coverage

### Confirmed coverage

- Page-level GA/Clarity availability on localized pages.
- Main generator upload, canvas clear, AI generation outcome, and result download.
- Rich qualitative feedback with optional technical/navigation context.
- Database timestamps/state for users, payments, saved puzzles, and feedback.

### Confirmed gaps

- No shared typed event catalog or analytics abstraction beyond the generator-local helper.
- No explicit funnel correlation ID across anonymous visit, login, generation, save, checkout, and payment.
- No explicit purchase/payment event emitted to GA.
- No explicit printable/PDF or bead-pattern conversion events.
- No repository-defined conversion goals, KPI formulas, experiments, feature flags, or attribution model.
- No automated analytics instrumentation tests.

### Unknown

- Current users, sessions, acquisition mix, activation, retention, revenue, conversion rate, error rate, or event volume.
- Whether `gtag` events reach the intended property in production.
- Whether Clarity or AdSense is enabled/blocked by geography, browser policy, or account state.
- Data retention, access control, deletion workflows, and data-processing agreements.
- Whether external checkout systems send server-side conversion events or webhooks elsewhere.

## Repository-verifiable event taxonomy recommendation status

No formal taxonomy document exists in the repository. Consequently, names, parameter definitions, owners, and versioning beyond the six generator event call sites are **Unknown**. This statement documents the gap only; it does not assume a desired future implementation.
