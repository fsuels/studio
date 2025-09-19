# PaymentModal publishable key guard

ts: 2025-09-19T15:42:49.4722675Z
summary:
  - enforced env-based Stripe publishable key configuration to avoid hard-coded test fallback (src/components/shared/PaymentModal.tsx)
  - blocked StripeIntegration from defaulting to test keys; env vars now required (src/lib/stripe-integration.ts)
  - enabled Stripe webhook signature validation with constant-time comparison (src/lib/stripe-integration.ts)
  - /api/webhooks/stripe validates signatures, rejects empty payloads, and returns Stripe-compatible responses
  - refund-system and wizard submission routes reuse shared Stripe API version helper
  - marketplace revenue sharing and Connect setup now instantiate Stripe clients per call with STRIPE_API_VERSION
verification:
  - jest stripe-integration (requires env shim)
  - not_run: requires Stripe test environment
