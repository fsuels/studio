# Features CTA Instrumentation Verification - growth-cycle-0004
- Added tracked CTAs on the features route so clicks emit `features_cta_click` with locale, surface (`features_wizard` or `features_pricing`), and destination before navigation.
- Primary CTA routes to the wizard, secondary CTA links to pricing; both reuse shared handler logic in the new client helper.
- eslint report stored in lint-features.txt; warnings remain limited to pre-existing files outside this change.
- Follow-up: Platform to ingest `features_cta_click` alongside other marketing events for funnel attribution.
