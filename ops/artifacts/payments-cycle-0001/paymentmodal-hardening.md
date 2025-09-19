# PaymentModal publishable key guard

ts: 2025-09-19T15:42:49.4722675Z
summary:
  - enforced env-based Stripe publishable key configuration to avoid hard-coded test fallback (src/components/shared/PaymentModal.tsx)
  - blocked StripeIntegration from defaulting to test keys; env vars now required (src/lib/stripe-integration.ts)
  - removed fallback stripe publishable key from checkout page and enforced env guard (src/app/[locale]/(legal)/checkout/page.tsx)
verification:
  - not_run: requires Stripe test environment
