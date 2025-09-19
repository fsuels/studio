# Growth Funnel & SEO Audit - growth-cycle-0001
timestamp_utc: 2025-09-19T15:21:34.4214508Z

## Marketing Route Coverage
- Pricing page includes canonical/hreflang alternates and JSON-LD (src/app/[locale]/(marketing)/pricing/page.tsx:47, src/app/[locale]/(marketing)/pricing/page.tsx:192).
- Features page mirrors the canonical/hreflang + JSON-LD pattern (src/app/[locale]/(marketing)/features/page.tsx:226, src/app/[locale]/(marketing)/features/page.tsx:315).
- Templates marketplace also emits alternates and collection structured data (src/app/[locale]/(marketing)/templates/page.tsx:151, src/app/[locale]/(marketing)/templates/page.tsx:188).
- SignWell landing still returns only basic metadata and manual locale toggles, leaving canonical/hreflang/JSON-LD uncovered (src/app/[locale]/(marketing)/signwell/page.tsx:33, src/app/[locale]/(marketing)/signwell/page.tsx:41).

## Conversion & Funnel Metrics
- Funnel API delegates to an in-memory engine instead of a datastore, so metrics are synthetic (src/app/api/analytics/funnel/route.ts:21).
- The engine persists sessions to browser localStorage and logs hypothetical BigQuery events rather than writing real telemetry (src/lib/funnel-analytics.ts:690, src/lib/funnel-analytics.ts:712).

## Localization Status
- Locale handling on SignWell relies on inline t(en, es) helpers without translation memory, raising maintenance risk for additional locales (src/app/[locale]/(marketing)/signwell/page.tsx:41).
- Supported locales remain hard-coded to English/Spanish only (src/lib/localizations.ts:2).

## Analytics Instrumentation
- Browser analytics wrapper only proxies to window.gtag with console fallback, so no server-side or alternate provider coverage exists yet (src/lib/analytics.ts:11).
- Marketing routes never invoke track, with usage limited to document flows such as the doc viewer (src/app/[locale]/(legal)/docs/[docId]/DocPageClient.tsx:199).

## Experiment Backlog
- Experiment creation still depends on running the local setup script rather than automated deployment hooks (src/scripts/setup-ab-tests.ts:3, src/scripts/setup-ab-tests.ts:164).
- The experiment engine emphasizes Firestore/feature toggle hooks but still relies on console logging for BigQuery streaming (src/lib/ab-testing/experiment-engine.ts:309).

## Feedback Loops
- Customer NPS data feeding dashboards is randomly generated through the development helper instead of real submissions (src/lib/orders.ts:946, src/lib/orders.ts:1044).

## Priority Opportunities
1. Ship canonical/hreflang + structured data for SignWell before promoting it.
2. Replace mock funnel/NPS datasets with GA4 or warehouse-backed sources in analytics APIs.
3. Introduce shared translation resources (e.g., JSON catalogs) so Growth copy reviews scale beyond manual dual-string helpers.
4. Integrate experiment lifecycle into CI/CD by invoking the automation engine during deploys rather than manual scripts.

