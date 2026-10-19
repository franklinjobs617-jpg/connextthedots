# Product knowledge base

> Repository snapshot reviewed: 2026-08-10. Unless explicitly attributed to the product owner, statements below are confirmed by the checked-in repository. Runtime behavior and production configuration are marked **Unknown** when neither the repository nor the product owner establishes them.

## Product summary

The repository presents **ConnectTheDotsPrintable.online**, a multilingual website for creating and downloading connect-the-dots activities (`app/[locale]/page.tsx`, `components/DotGeneratorClient.tsx`, `public/llms.txt`). Its two principal content/product surfaces are:

1. A browser-based connect-the-dots generator that accepts an uploaded image, extracts/edits a sequence of dots, previews the result, and exports it (`components/DotGeneratorClient.tsx`). The UI also exposes AI image generation through `/api/doubao` and can save a public puzzle for an authenticated user.
2. A printable worksheet library with browsable hubs and detail pages backed by locale-specific TypeScript datasets and a generated Openclipart-derived manifest (`lib/printables-data*.ts`, `lib/generated-standalone-printables.json`, `app/[locale]/printables/[slug]/page.tsx`).

The repository also contains a separate **photo-to-bead-pattern** tool with its own landing page, editor, export workflow, gallery, and gallery detail pages (`app/[locale]/convert-photo-to-beads/`). This is confirmed functionality in the same application; whether it is a strategic second product or an experiment is **Unknown**.

## Confirmed audiences and jobs

Repository copy explicitly targets children, parents, teachers, classrooms, homeschool use, and adults (`public/llms.txt`, `components/HomeContent.tsx`, and the themed landing pages). Confirmed user jobs are:

- Turn a photo, drawing, or generated image into a numbered dot-to-dot worksheet.
- Adjust dot count/placement and presentation before downloading or printing.
- Browse ready-made activities by topic, age recommendation, and difficulty.
- View the reference, puzzle, and solution assets when supplied by the printable record.
- Create bead patterns from photos, edit a grid/palette, and export the result.
- Sign in with Google, consume credits for AI generation, and save a generated puzzle publicly.
- Submit feedback, including optional context and a screenshot.

Claims in page copy about educational, developmental, or wellbeing benefits are product content, not facts validated by this codebase. Their evidentiary accuracy is **Unknown** even where pages link to external sources.

## Product surfaces

### Connect-the-dots creation

- The localized homepage embeds the primary generator (`app/[locale]/page.tsx`, `components/HomeContent.tsx`).
- The generator supports image upload, background removal through `https://ytdlp.vistaflyer.com`, canvas/dot editing, AI image generation, downloads, and persistence calls (`components/DotGeneratorClient.tsx`).
- AI generation is authenticated against an external site API, checks credits, performs prompt moderation, calls Volcengine's Doubao image endpoint, and consumes one external-backend credit after image retrieval (`app/api/doubao/route.tsx`).
- Saving requires a Google access token, uploads original and puzzle images to S3-compatible R2 storage, and creates a public `ConnectDotsPuzzle` database row (`app/api/connect-dots/save/route.ts`).
- Public puzzle records are exposed through slug and gallery APIs (`app/api/connect-dots/[slug]/route.ts`, `app/api/connect-dots/gallery/route.ts`).

### Printable content

- `lib/printables-data.ts` is the English catalog and incorporates generated standalone records; six parallel files provide German, Spanish, French, Italian, Dutch, and Portuguese catalog copy.
- Printable records carry title, description, difficulty, dot range, categories, age recommendation, popularity, image dimensions, asset URLs, and a detail-page path.
- Hubs include general printables, animals, Christmas, coloring pages, 1-to-10 activities, adults, and popular-character/theme content (`app/[locale]/`). Some legacy hub implementations remain in source but are redirected; see `docs/SEO.md`.
- Seven PDF files are checked into `public/`, including kids, animal, Christmas, themed, educational, mandala, and advanced worksheet files.
- The generated standalone collection includes an Openclipart source URL and puzzle/reference/solution asset information (`lib/generated-standalone-printables.json`). The generator script is in `scripts/generate-openclipart-dot-to-dot.mjs`.

### Photo-to-beads

- The editor quantizes an image against configured bead palettes, renders/edit grids, and supports exports (`app/[locale]/convert-photo-to-beads/editor/page.tsx`, `palette-data.ts`, `palette-artkal.ts`, `lib/export-utils.ts`).
- Gallery metadata is stored as JSON locally or in R2 depending on environment configuration (`app/api/gallery/route.ts`, `app/api/gallery/upload/route.ts`, `app/[locale]/convert-photo-to-beads/lib/r2-service.ts`).
- Whether gallery submissions are moderated, private, or intended for production publication is **Unknown**; no moderation or authentication gate is apparent in the gallery upload route.

### Accounts, credits, and commercial flows

- Client authentication supports Google OAuth and stores an auth token/user snapshot in browser local storage (`lib/auth-context.tsx`). A separate local login API verifies Google user info and creates/updates a Prisma user (`app/api/auth/login/route.tsx`).
- New users created by that local API receive two credits. Plan names in code include free, lifesaver, creator, hobbyist, pro master, and creator pro variants.

#### Implemented in repository

- `/pricing` is the repository-defined primary pricing route: the shared header/footer and upgrade prompts link to it, and it submits checkout creation with `provider: "creem"` (`components/Header.tsx`, `components/Footer.tsx`, `app/[locale]/pricing/PricingContent.tsx`).
- Alternate Stripe and PayPal pricing/payment implementations and server proxy routes remain present (`app/[locale]/stripe-pricing/`, `app/api/pay/`, `app/[locale]/stripePayment/`, `app/[locale]/palpalPayment/`). Fixed product identifiers and displayed/requested prices are present in source.
- These facts describe connected code paths only. **Implemented in repository does not mean operational in production.**

#### Operational in production

- **Product-owner-confirmed production fact (2026-09-02): PAUSED.** Payment and subscription monetization is not currently operating as a production commercial capability.
- The product historically enabled payment/subscription functionality using Stripe, PayPal, and Creem.
- The product owner reports that a material update introduced cartoon-IP content, the PayPal account was affected and banned, and the owner subsequently paused payment/subscription monetization.
- Consequently, `/pricing`, the Creem checkout path, and the retained Stripe/PayPal implementations must not be described as currently operational commercial capabilities.
- Whether any residual production endpoint or third-party account remains technically reachable is **Unknown**; operational reachability is not equivalent to active monetization.

### Supporting pages

Confirmed supporting routes include a how-to guide, a blog article, feedback, privacy, terms, DMCA, pricing/payment returns, and several search-intent landing pages. A standalone Brooks Brothers Singapore shopping guide also exists outside the localized product layout (`app/(standalone)/shopping-guide/brooks-brothers-singapore/page.tsx`). Its relationship to the connect-the-dots product is **Unknown**.

## Localization

- Supported locales are English, German, Spanish, Portuguese, French, Italian, and Dutch; English is the default and uses no locale prefix (`i18n/routing.ts`).
- UI messages live in `messages/{locale}.json`; printable catalog copy also has locale-specific modules.
- Not every content route is included for every locale in the sitemap (`app/sitemap.ts`).
- Translation authorship, review quality, and completeness cannot be established from repository contents: **Unknown**.

## Data and content ownership

- MySQL models store users, payments, saved public puzzles, and feedback (`prisma/schema.prisma`).
- R2-compatible object storage is used for saved puzzle images and optionally bead-gallery JSON (`app/[locale]/convert-photo-to-beads/lib/r2-*.ts`).
- Static catalog media is served partly from `public/` and partly from a hard-coded `r2.dev` CDN base URL.
- **Unknown:** production record counts, storage retention, backup/recovery practice, data residency, and whether database migrations are managed elsewhere. No Prisma migration directory is checked in.
- **Unknown:** comprehensive copyright/license status for all checked-in PDFs and media. The standalone generated set records Openclipart sources, but that does not establish provenance for every other asset.

## Success measures

The repository confirms collection mechanisms, not current outcomes:

- Google Analytics and Microsoft Clarity are installed globally (`app/[locale]/layout.tsx`).
- Generator-specific GA events cover upload, clear, AI-generation start/success/failure, and result download (`components/DotGeneratorClient.tsx`).
- Feedback can capture qualitative responses and page/action/device context (`components/FeedbackWidget.tsx`, `app/api/feedback/route.ts`).
- The repository contains dated SEO planning material, but it is not treated as a source of current SEO performance.

No repository-defined KPI targets, dashboards, activation definition, retention definition, or current conversion rate were found: **Unknown**.
