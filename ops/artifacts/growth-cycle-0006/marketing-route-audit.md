# Marketing Route Audit - 2025-09-19T20:38:06.483985+00:00

## Summary
- Reviewed customer-facing marketing routes (home, pricing, features, templates, blog index & article, SignWell landing, online notary, partners, support, FAQ, sitemap).
- Verified canonical/hreflang setup, JSON-LD coverage, bilingual copy, and analytics instrumentation wrappers.
- Identified sitemap gaps: English-only copy, missing locale alternates, and links that drop the locale prefix.

## Route Checks
| Route | Metadata / Canonical | Structured Data | Analytics Instrumentation | Localization | Notes |
| --- | --- | --- | --- | --- | --- |
| /[locale]/ | Pass | Pass | Pass (hero + modal CTAs emit home_cta_click) | Pass | generateMetadata plus HomePageStructuredData cover Organization and WebSite JSON-LD. |
| /[locale]/pricing | Pass | Pass | Pass (PricingCTA wrapper emits pricing_cta_click) | Pass | Service JSON-LD matches localized plan copy. |
| /[locale]/features | Pass | Pass | Pass (FeaturesCTA covers wizard/pricing CTAs) | Pass | Comparison table uses accessible icons; JSON-LD lists feature inventory. |
| /[locale]/templates | Pass | Pass | Pass (quiz CTA tracks templates_cta_click) | Pass | CollectionPage JSON-LD spans EN/ES content; decorative emoji remain text. |
| /[locale]/blog | Pass | Pass | Pass (BlogArticleCard emits blog_article_click) | Pass | Blog index JSON-LD enumerates latest posts. |
| /[locale]/blog/[slug] | Pass | Pass | Pass (RelatedDocumentLink emits blog_related_click) | Pass | BlogPosting JSON-LD includes word count and canonical alternates. |
| /[locale]/signwell | Pass | Pass | Pass (signwell_cta_click plus signwell_disclaimer_view) | Pass | Service JSON-LD reflects SignWell integration and disclaimers. |
| /[locale]/online-notary | Pass | Pass | Pass (OnlineNotaryCTA instrumented) | Pass | Service + HowTo JSON-LD cover workflow; lock emoji is decorative only. |
| /[locale]/partners | Pass | Pass | Pass (PartnersCTA wraps primary/secondary CTAs) | Pass | JSON-LD exposes partner program taxonomy. |
| /[locale]/support | Pass | Pass | Pass (SupportCTA on FAQ handoff) | Pass | ContactPage structured data captures hours, locale, and consent-safe payload. |
| /[locale]/faq | Pass | Pass | N/A (read-only) | Pass | FAQPage schema enumerates localized Q/A entries. |
| /[locale]/sitemap | Fail | Missing | N/A | Fail | English-only metadata, no generateMetadata, hreflang, or locale-prefixed links. |

## Follow-ups
- Update /[locale]/sitemap to match marketing metadata and localization standards; prefix internal links with the active locale.
- Consider replacing decorative emoji in templates/online-notary lists with accessible inline SVGs; current glyphs are readable but may be verbose for screen readers.
