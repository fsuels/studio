# Home Hero CTA Instrumentation Verification - growth-cycle-0004
- Added analytics emission (`home_cta_click`) on the homepage hero CTA prior to opening the discovery modal so we capture locale and experiment bucket.
- Payload captures `{ locale, surface: 'hero', destination: 'discovery_modal', cta_variant }` using the existing CTA variant experiment.
- eslint run (`lint-homepage.txt`) shows only pre-existing repo warnings outside the touched areas.
- Follow-up: ensure GA4/warehouse ingestion handles the new `home_cta_click` event and experiment dimensions.
