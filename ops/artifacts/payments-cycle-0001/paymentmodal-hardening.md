# PaymentModal publishable key guard

ts: 2025-09-19T15:42:49.4722675Z
summary:
  - webhook processing now handles checkout.session.completed events
  - .env templates now include STRIPE_WEBHOOK_SECRET alongside existing Stripe keys
  - shared getStripeServerClient helper caches Node Stripe client with version enforcement
  - enforced env-based Stripe publishable key configuration to avoid hard-coded test fallback (src/components/shared/PaymentModal.tsx)
  - blocked StripeIntegration from defaulting to test keys; env vars now required (src/lib/stripe-integration.ts)
  - enabled Stripe webhook signature validation with constant-time comparison (src/lib/stripe-integration.ts)
  - /api/webhooks/stripe validates signatures, rejects empty payloads, and returns Stripe-compatible responses
  - refund-system and wizard submission routes reuse shared Stripe API version helper
  - marketplace revenue sharing and Connect setup now instantiate Stripe clients per call with STRIPE_API_VERSION
verification:
  - jest stripe-integration
  - jest src/app/api/webhooks/stripe/__tests__/route.test.ts (Stripe webhook route)
  - jest stripe-server
  - jest stripe-integration (requires env shim)
  - not_run: requires Stripe test environment
