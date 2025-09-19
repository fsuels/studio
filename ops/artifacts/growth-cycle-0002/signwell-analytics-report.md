# SignWell Analytics Gap Assessment - growth-cycle-0002
observed_at_utc: 2025-09-19T15:41:22.5056765Z

## Current State
- No `track(...)` calls originate from the SignWell marketing page (`rg "track(" src/app/[locale]/(marketing)/signwell -n` on 2025-09-19).
- CTA anchors (`/${locale}/signup`, `/${locale}/templates`) navigate without emitting analytics payloads, leaving Growth blind to click-through performance.

## Target Events
- `signwell_cta_click` with properties `{ cta_id: 'start_esigning' | 'browse_templates', locale }`.
- `signwell_disclaimer_view` to confirm compliance disclaimer exposure.

## Implementation Notes
- Introduce a client component to host CTA markup and wire tracking without promoting the entire route to CSR.
- Reuse the existing `track` helper (`src/lib/analytics.ts`) to stay GA4-compatible while logging events to console in development.

## Verification
- `rg "signwell_cta_click" src/app/[locale]/(marketing)/signwell -n` confirms CTA tracking is wired (2025-09-19).
- `SignWellContent` mounts send `signwell_disclaimer_view` once per locale, ensuring compliance messaging exposure is measurable (`src/app/[locale]/(marketing)/signwell/SignWellContent.tsx:70`).
- Server page retains JSON-LD injection while delegating CTA rendering to the client for analytics (`src/app/[locale]/(marketing)/signwell/page.tsx:157`).
