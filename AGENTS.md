# Repository Guidelines

## Project Structure & Module Organization
- `src/` hosts the Next.js app; route groups live under `src/app/`, shared UI in `src/components/`, and server-only utilities in `src/lib/`.
- `src/lib/documents/` owns the legal-document generation engine; organize templates per jurisdiction and export utility functions via index files for reuse.
- `functions/` keeps Firebase/Cloud Functions endpoints; mirror any update in `src/lib/documents/` with API-safe wrappers here.
- `tests/`, `__tests__/`, and `e2e/` cover Jest suites and Playwright specs; keep snapshots or reference assets under `tests/` to stay shareable.
- `docs/documents/overview.md` captures the end-to-end document pipeline; keep it updated when adding new jurisdictions.
- `public/` serves static assets; prefer dynamic loading when assets tie to document logic.

## Build, Test, and Development Commands
- `npm run dev` starts the Next.js dev server with hot reload for iterating on `src/app`.
- `npm run lint` enforces ESLint + Prettier + TypeScript checks; auto-fix with `npm run lint:fix` or format everything via `npm run format`.
- `npm run test` executes the Jest suite; use `npm run test:watch` while developing or `npm run test:coverage` for LCOV reports.
- `npm run e2e` runs Playwright regression flows defined in `e2e/`.
- `npm run typecheck` and `npm run typecheck:app` run strict TypeScript passes before builds.
- `npm run build` produces the production static export; ensure it succeeds before any release branch cut.

## Coding Style & Naming Conventions
- Trust Prettier defaults (2-space indent, single quotes, trailing commas); never hand-format after running lint.
- Keep React components as Server Components by default; mark interactive modules with `use client` only when required.
- Import `AutoImage` instead of `<img>` anywhere imagery is rendered.
- Use PascalCase for components, camelCase for helpers, and SCREAMING_SNAKE_CASE for constants shared across modules.
- Co-locate styles via CSS modules or Tailwind utilities; avoid global styles in favor of component scope.

## Testing Guidelines
- Place new unit tests alongside modules as `*.test.ts` or under `tests/`; stub external requests with Jest mocks for repeatability.
- For document engines, craft scenario inputs in plain JSON/TS objects and assert generated clause text for each jurisdictional branch.
- Keep Playwright specs concise; prefer data-testids in `src/app` for selectors, and commit sanitized artifacts only when debugging failures.
- Target coverage parity by adding assertions for each branch introduced; flag intentional gaps in PR descriptions when unavoidable.

## Commit & Pull Request Guidelines
- Format commit subjects as `[Scope] Imperative summary`; keep body lines <= 72 chars with context on why the change matters.
- Husky pre-commit runs the integrated quality system plus `npm run lint-staged`; reproduce locally with `npm run full-check` when needed.
- Before opening a PR, run lint, test, e2e, typecheck, and build locally and paste key command outputs if failures were addressed.
- Reference `docs/scripts/automation.md` when deciding which verification scripts to run beyond the standard npm commands.
- Explain both why and how in the PR description, link tracking issues, and attach screenshots or terminal logs when UI or CLI flows change.
- Upload diffs as unified patches with full file paths; reviewers rely on that format to audit legal-document logic.

## Security & Configuration Tips
- Store secrets only in `.env.local` or project-level secret managers; never commit `.env*` files with real credentials.
- Keep Firebase configuration in sync between `functions/` and deployment environments; use `scripts/` helpers for bulk updates.
- Run `npm audit` periodically and patch vulnerabilities before deploying compliance-related templates.
