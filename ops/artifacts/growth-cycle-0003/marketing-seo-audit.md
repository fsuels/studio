# Marketing Route SEO Audit — growth-cycle-0003
- Timestamp: 2025-09-19T16:11:44Z
- Auditor: Growth & Customer Learning (Codex)

## Summary
- Primary marketing routes (pricing, features, FAQ, support, templates, online-notary, partners, signwell) all expose locale-aware canonical + hreflang metadata and embed JSON-LD payloads.
- Homepage (`/[locale]`) already centralizes canonical + language alternates and injects locale-specific structured data via `HomePageStructuredData`.
- Gap 1: Dynamic blog articles under `src/app/[locale]/(marketing)/blog/[slug]/page.tsx` render without `generateMetadata`, canonical/hreflang alternates, or JSON-LD. This breaks parity with the static blog template and blocks rich results.
- Gap 2: Static blog article `how-to-draft-lease-agreement` has full metadata but no JSON-LD (consider aligning with new shared implementation after fixing Gap 1).
- Gap 3: Marketing sitemap route exports static `metadata` without canonical/hreflang alternates or structured data. Low priority but should be harmonized during follow-up routing cleanup.

## Coverage Matrix
| Route | Source File | Canonical/Hreflang | JSON-LD | Notes |
| --- | --- | --- | --- | --- |
| `/[locale]/` | `src/app/[locale]/page.tsx` | Yes | Yes | Uses shared helpers `buildLanguageAlternates` and `HomePageStructuredData`.
| `/[locale]/pricing` | `src/app/[locale]/(marketing)/pricing/page.tsx` | Yes | Yes | Structured data covers plan catalog.
| `/[locale]/features` | `src/app/[locale]/(marketing)/features/page.tsx` | Yes | Yes | ItemList JSON-LD present.
| `/[locale]/faq` | `src/app/[locale]/(marketing)/faq/page.tsx` | Yes | Yes | FAQPage schema inline.
| `/[locale]/support` | `src/app/[locale]/(marketing)/support/page.tsx` | Yes | Yes | ContactPage schema present.
| `/[locale]/templates` | `src/app/[locale]/(marketing)/templates/page.tsx` | Yes | Yes | CollectionPage schema present.
| `/[locale]/online-notary` | `src/app/[locale]/(marketing)/online-notary/page.tsx` | Yes | Yes | Service schema present.
| `/[locale]/partners` | `src/app/[locale]/(marketing)/partners/page.tsx` | Yes | Yes | ItemList schema with partner programs.
| `/[locale]/signwell` | `src/app/[locale]/(marketing)/signwell/page.tsx` | Yes | Yes | JSON-LD verified during growth-cycle-0002.
| `/[locale]/blog` | `src/app/[locale]/(marketing)/blog/page.tsx` | Yes | Yes | Blog schema enumerates latest posts.
| `/[locale]/blog/how-to-draft-lease-agreement` | `src/app/[locale]/(marketing)/blog/how-to-draft-lease-agreement/page.tsx` | Yes | No | Legacy article missing JSON-LD; should adopt new shared helper.
| `/[locale]/blog/[slug]` | `src/app/[locale]/(marketing)/blog/[slug]/page.tsx` | No | No | **Priority gap** — add metadata + JSON-LD for global blog coverage.
| `/[locale]/sitemap` | `src/app/[locale]/(marketing)/sitemap/page.tsx` | No | No | Exported static metadata without alternates; low risk.

## Next Steps
1. Implement locale-aware `generateMetadata` + structured data builder for dynamic blog articles to close canonical/hreflang gap (handled this cycle).
2. Once shared logic exists, refactor static blog templates to consume the same helper to avoid duplication and guarantee JSON-LD parity.
3. Align marketing sitemap metadata with canonical/hreflang standards in a future routing tidy-up (coordinate with Platform for link map).
