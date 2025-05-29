# 123LegalDoc – Codex Contributor Guide

## Where to work
- **Next.js app:** `src/`
- **Legal doc engine:** `src/lib/documents/`
- **Cloud Functions:** `functions/`
- Ignore everything in `public/` except image assets.

## How to validate before a PR
```bash
pnpm lint        # ESLint + Prettier + TypeScript
pnpm test        # Vitest unit tests
pnpm e2e         # Playwright E2E
pnpm build       # Next.js static export
Style rules
```