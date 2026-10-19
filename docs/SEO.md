# SEO and discovery knowledge base

> Repository snapshot reviewed: 2026-08-10. This describes implemented repository signals, not live indexation or ranking. Live search-engine state is **Unknown**.

## Confirmed strategy visible in the repository

The site uses a hub-and-spoke content structure around generator, printable, audience, theme, and instructional intent. The implementation includes a main generator landing page, a printable hub, individual printable detail pages, animal/Christmas/coloring/adult/early-number hubs, how-to content, a blog article, and photo-conversion landing pages (`app/[locale]/`, `lib/printables-data*.ts`).

`SEO-GEO-implementation-log-2026-05-21.md` and `CHANGELOG.md` record historical rationale and implementation work. They do not prove current impressions, clicks, positions, or indexation. The repository's dated opportunity plan is not used here as a source of current SEO status.

## URL and locale policy

- The canonical origin in shared metadata and sitemap code is `https://connectthedotsprintable.online` (`lib/metadata.ts`, `app/sitemap.ts`).
- Supported locale codes are `en`, `de`, `es`, `pt`, `fr`, `it`, and `nl`; English is unprefixed and other locales are prefixed (`i18n/routing.ts`).
- `trailingSlash: true` establishes slash-terminated canonical formatting (`next.config.ts`).
- `getAlternates()` creates canonical and hreflang URLs for all seven locales plus `x-default` (`lib/metadata.ts`). Whether every caller limits alternates to locales with fully localized content varies by page.
- Redirects normalize `index.html` and `.html` URLs and consolidate selected duplicate/retired printable routes (`next.config.ts`).

### Confirmed redirect groups

- `/testpricing` to `/pricing`.
- `/index.html` and nested `index.html` to slash URLs.
- other `.html` paths to extensionless slash URLs.
- removed Bluey and SpongeBob printable slugs to the printable hub in all locale prefixes.
- `/printables/christmas` to `/christmas-printables`.
- legacy `/printables/core` and `/printables/general` to `/printable-connect-the-dots`.
- legacy `/printables/adults` and `/printables/hard` to `/connect-the-dots-for-adults`.
- `/printables/animals` to the animal hub for every locale except Spanish.

## Metadata implementation

- The localized root layout supplies translated default title/description, Open Graph, Twitter card, and AdSense account metadata (`app/[locale]/layout.tsx`).
- Most important landing pages implement `generateMetadata`, canonical/alternate links through `lib/metadata.ts`, and social metadata in their `page.tsx` modules.
- Dynamic printable details use slug data to generate page metadata (`app/[locale]/printables/[slug]/page.tsx`).
- The standalone shopping guide defines its own nonlocalized metadata (`app/(standalone)/shopping-guide/brooks-brothers-singapore/page.tsx`).

**Confirmed issue:** the root layout references `/images/og-image.png`, while the tracked asset is `public/images/og-image.jpg`; no matching PNG is tracked. Unless generated externally at deploy time, the default Open Graph image path does not correspond to a repository asset.

## Structured data

JSON-LD appears across the homepage, printable hub/detail pages, guide/blog pages, and themed landing pages. Confirmed schema types include combinations of `WebSite`, `WebApplication`/`SoftwareApplication`, `CollectionPage`, `ItemList`, `BreadcrumbList`, `FAQPage`, `HowTo`, `Article`, and image-oriented entities (see `components/HomeContent.tsx` and localized route components).

Repository presence does not prove that rendered markup passes current rich-result validation or qualifies for a search feature: **Unknown**. No automated structured-data test is checked in.

## Sitemap

`app/sitemap.ts` generates:

- A curated list of static paths, with per-route locale allowlists, weekly change frequency, and priorities.
- Dynamic URLs for every item returned by the English `getAllPrintables()`, with monthly change frequency and all seven language alternates.
- `lastModified: new Date()` for every entry on each generation rather than a content modification timestamp.

Notable confirmed behavior:

- The canonical `url` of every static sitemap entry is the unprefixed English URL even when the route's locale list omits English (not currently apparent in the configured list).
- Dynamic printable entries advertise all seven locale variants regardless of whether translated record quality was reviewed.
- User-generated public puzzle URLs and bead-gallery detail URLs are not included.
- `/convert-photo-to-beads/gallery` and several account/payment/feedback routes are not included.
- The standalone shopping guide is not included.
- Sitemap output availability is advertised at `/sitemap.xml` in `public/robots.txt`.

Whether omissions are intentional is **Unknown**.

## Robots and AI discovery

- `public/robots.txt` allows all paths for all user agents and explicitly allows GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, and PerplexityBot. It names the sitemap.
- There are no repository-defined `Disallow` rules for admin-like migration APIs, payment returns, user pages, or duplicate/test routes.
- `public/llms.txt` summarizes the product and links to primary English sections.
- `public/ads.txt` is present for advertising authorization.

Search-engine handling of API routes and whether sensitive/non-content routes are indexed is **Unknown**; robots allowance alone does not establish indexation.

## Internal linking and content clusters

Shared header/footer components link major product, printable, legal, language, and external partner destinations (`components/Header.tsx`, `components/Footer.tsx`). Hub and landing components contain contextual cards linking related generator, tutorial, and printable routes. The changelog records a deliberate adults hub-and-spoke linking iteration.

The footer also contains unrelated external links. Whether these are partnerships, owned properties, or SEO placements is **Unknown**.

## Media and performance signals

- Next Image remote patterns allow the public R2 domain wildcard and several external media hosts (`next.config.ts`).
- Printable records declare dimensions and pages use Next Image in many locations.
- `public/` contains 98 WebP, 35 SVG, 21 PNG, seven PDF, and one JPG file at review time.
- Generated standalone records provide reference, puzzle, and solution assets and source attribution data.

Live Core Web Vitals, image cache headers, CDN behavior, and page performance are **Unknown**. No Lighthouse configuration or performance budget was found.

## Historical repository evidence

- The May 2026 implementation log reports technical SEO/GEO foundation work, route/canonical cleanup, landing-page rebuilds, and new photo/generator landing pages.
- The June/July 2026 changelog records dead-link redirects, copyright-risk cleanup, printable-hub changes, and an adults content cluster.
- The dated opportunity plan is not a current SEO status source.

These are dated internal records, not current truth. Any numerical statement copied from them must retain its date and provenance; current SEO performance is **Unknown**.

## Verified gaps and unknowns

- **Unknown:** current indexed URL count, rankings, clicks, impressions, crawl errors, manual actions, rich results, backlink profile, or international visibility.
- **Unknown:** whether all localized pages are human-reviewed and equivalent enough to justify their hreflang relationships.
- **Unknown:** whether search engines receive stable `lastModified` values; current sitemap code always uses generation time.
- **Confirmed gap:** no automated metadata, broken-link, sitemap, hreflang, or structured-data validation is defined.
- **Confirmed gap:** no explicit `noindex` is apparent for pricing tests, payment result pages, feedback, user-generated pages, or bead gallery routes; redirects cover some but not all alternate routes.
- **Confirmed inconsistency:** the default Open Graph image extension/path does not match the tracked asset.
