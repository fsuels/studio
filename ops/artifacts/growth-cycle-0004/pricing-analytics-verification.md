# Pricing CTA Instrumentation Verification - growth-cycle-0004
- Updated pricing route CTAs to emit `pricing_cta_click` with locale, plan_id, surface, and destination for plan cards and the quiz CTA.
- Added client-side wrapper (`PricingCTA`) to centralize analytics tracking and reuse for link/anchor CTAs.
- Verified eslint on updated files (see lint-pricing.txt); run surfaced existing global warnings in unrelated files.
- Next dependency: Platform needs GA4/warehouse ingestion for new `pricing_cta_click` events and to retire mock funnel metrics.
