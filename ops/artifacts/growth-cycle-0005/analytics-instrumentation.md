# Growth Cycle 0005 - Analytics Instrumentation Follow-Up (2025-09-19)

## Overview
- Added `online_notary_cta_click` tracking via `OnlineNotaryCTA` wrapper for the `/[locale]/online-notary` hero CTA.
- Wrapped partners hero CTAs with `PartnersCTA` to emit `partners_cta_click` events (primary mailto + secondary support CTA).
- Wired support FAQ prompt link through `SupportCTA`, logging `support_cta_click` when customers head to FAQs.
- Introduced `BlogArticleCard` client component so blog index links emit `blog_article_click` with locale + slug metadata.
- Added `RelatedDocumentLink` client component for blog detail related docs, emitting `blog_related_click` with document identifiers.

## Implementation Notes
- All wrappers use the existing `track` helper to keep GA4 integration consistent and payloads include `locale`, destination, and contextual identifiers (cta_id, document_id, surface).
- Server components remain the source of metadata/structured data; only CTA surfaces were converted to client wrappers to avoid hydration regressions.
- Verified that all new components maintain prior class names/aria-labels to preserve layout, accessibility, and localized copy.

## Files Touched
- `src/app/[locale]/(marketing)/online-notary/OnlineNotaryCTA.tsx`
- `src/app/[locale]/(marketing)/online-notary/page.tsx`
- `src/app/[locale]/(marketing)/partners/PartnersCTA.tsx`
- `src/app/[locale]/(marketing)/partners/page.tsx`
- `src/app/[locale]/(marketing)/support/SupportCTA.tsx`
- `src/app/[locale]/(marketing)/support/page.tsx`
- `src/app/[locale]/(marketing)/blog/BlogArticleCard.tsx`
- `src/app/[locale]/(marketing)/blog/page.tsx`
- `src/app/[locale]/(marketing)/blog/[slug]/RelatedDocumentLink.tsx`
- `src/app/[locale]/(marketing)/blog/[slug]/page.tsx`

## Verification
- Static review of bundle diff confirms no JSX validation errors and wrappers align with previous markup.
- Lint/test runs deferred; recommend `pnpm lint` once shared workspace is clean to validate imports.