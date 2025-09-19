# Growth Cycle 0005 - Marketing Route Audit (2025-09-19)

## Scope
- Reviewed bilingual marketing routes under `src/app/[locale]` including homepage, pricing, features, templates, blog (index + slug), signwell, online-notary, partners, faq, support, and sitemap layout.
- Verified each page implements Next metadata, canonical + language alternates, and JSON-LD aligned with SEO guardrails.
- Audited client CTA instrumentation and localization coverage for growth-owned components.

## Route Findings
- `/[locale]` homepage (`src/app/[locale]/page.tsx`, `HomePageStructuredData.tsx`, `HomePageClient.tsx`): Organization + WebSite JSON-LD present; hero/modal CTA uses `home_cta_click` with locale + destination metadata.
- `/[locale]/pricing` (`src/app/[locale]/(marketing)/pricing/page.tsx`): Service JSON-LD includes Offer markup; `PricingCTA` instruments plan, quiz, and contact flows with `pricing_cta_click` events.
- `/[locale]/features` (`src/app/[locale]/(marketing)/features/page.tsx`): HowTo style content with WebPage JSON-LD; both CTAs use `FeaturesCTA` wrapper emitting `features_cta_click`.
- `/[locale]/templates` (`src/app/[locale]/(marketing)/templates/page.tsx` + `templates-client-content.tsx`): CollectionPage JSON-LD emitted server-side; quiz entry tracked via `templates_cta_click` (`track` call within `handleTemplatesQuizClick`).
- `/[locale]/signwell` (`src/app/[locale]/(marketing)/signwell/page.tsx` + `SignWellContent.tsx`): WebPage JSON-LD with nested Service entity; disclaimer rendered with `signwell_disclaimer_view`; CTAs emit `signwell_cta_click` with IDs `start_esigning` and `browse_templates`.
- `/[locale]/blog` index (`src/app/[locale]/(marketing)/blog/page.tsx`): Blog JSON-LD lists top articles; link cards rely on server render (no client analytics).
- `/[locale]/blog/[slug]` (`src/app/[locale]/(marketing)/blog/[slug]/page.tsx`): BlogPosting JSON-LD built from data set; dynamic metadata per locale.
- `/[locale]/faq` (`src/app/[locale]/(marketing)/faq/page.tsx`): FAQPage JSON-LD generated; page lacks click instrumentation (search input static, toggles purely semantic).
- `/[locale]/support` (`src/app/[locale]/(marketing)/support/page.tsx`): ContactPage JSON-LD present; email/time CTA accessible but untracked.
- `/[locale]/online-notary` (`src/app/[locale]/(marketing)/online-notary/page.tsx`): Service JSON-LD covers steps + compliance; hero CTA is static anchor without analytics hook.
- `/[locale]/partners` (`src/app/[locale]/(marketing)/partners/page.tsx`): WebPage JSON-LD with structured stats; mailto + support CTAs currently lack `track` instrumentation.

## Localization Notes
- All `localizedContent` objects contain full `en`/`es` branches; fallback `t()` calls in templates client rely on `public/locales/*/common.json` keys. Spot-checking `public/locales/es` confirms the keys exist, but we still depend on the translation pipeline to keep parity.
- Blog data source (`src/data/blogArticles.ts`) stores bilingual title/summary/content, enabling slug metadata parity. No automated parity test exists yet.

## Analytics Coverage
- Confirmed events: `home_cta_click`, `pricing_cta_click`, `features_cta_click`, `templates_cta_click`, `signwell_cta_click`, `signwell_disclaimer_view`, `footer_subscribe_attempt/result`.
- Gaps: partners mailto/support links, online-notary hero CTA, support page FAQ link/search, blog article link clicks lack tracking. These should emit standardized events before GA4 ingestion goes live.
- Funnel API (`src/app/api/analytics/funnel/route.ts`) still returns mock data; Growth TODO aligns with Platform handoff to retire mocks once events land in GA4/warehouse.

## Action Items
1. Add `track` instrumentation for partners mailto/support buttons and online-notary hero CTA to maintain CTA coverage.
2. Define blog click analytics (`blog_article_click`, `blog_related_click`) for index and detail navigation.
3. Coordinate with Platform to hook new events into GA4 and replace mock funnel API responses (blocked on shared warehouse work).
4. Backfill automated JSON-LD validation (lint/test) so regressions surface in CI; none exists for marketing routes today.
5. Review translation fallback usage in `templates-client-content.tsx` and ensure all keys live in `public/locales/*` to avoid English bleeding into ES if translation JSON drifts.

## Evidence
- Source review: `src/app/[locale]/page.tsx`, `HomePageStructuredData.tsx`, `HomePageClient.tsx`.
- Pricing instrumentation: `src/app/[locale]/(marketing)/pricing/page.tsx`, `PricingCTA.tsx`.
- Features instrumentation: `src/app/[locale]/(marketing)/features/page.tsx`, `FeaturesCTA.tsx`.
- Templates quiz tracking: `src/app/[locale]/(marketing)/templates/templates-client-content.tsx`.
- SignWell analytics: `src/app/[locale]/(marketing)/signwell/SignWellContent.tsx`.
- Blog metadata parity: `src/app/[locale]/(marketing)/blog/page.tsx`, `[slug]/page.tsx`, `src/data/blogArticles.ts`.
- Support + partners CTA gap: `src/app/[locale]/(marketing)/support/page.tsx`, `partners/page.tsx`.
- Localization assets: `public/locales/en/common.json`, `public/locales/es/common.json`.
