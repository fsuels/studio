# Document Engine Overview

## Directory Map
- `src/lib/documents/` stores jurisdiction-specific templates (e.g., `us/vehicle-bill-of-sale`). Each template exports `metadata.ts`, `schema.ts`, `questions.ts`, and any jurisdictional helpers.
- `src/lib/document-library.ts` orchestrates lazy loading through the metadata registry and enrichment utilities. Prefer `getAllDocuments()` or jurisdiction helpers when you need fully hydrated `LegalDocument` objects.
- `src/lib/document-metadata-registry.ts` (and generated JSON assets) expose lightweight metadata used for search, listing pages, and dynamic import lookups.

## Load & Enrichment Pipeline
1. Metadata is read from the registry for a jurisdiction or query.
2. `loadDocuments()` dynamically imports the template modules listed in that metadata.
3. `enrichDocument()` applies defaults: it ensures IDs, attaches fallback schemas, normalizes translations, and pre-populates empty question arrays so downstream code never sees `undefined` fields.
4. The resulting `LegalDocument` objects are cached per jurisdiction using the manifest-generated cache and reused across APIs and UI surfaces.

## Template Anatomy
- **`metadata.ts`** � static description, pricing, supported languages, and SEO aliases. Keep `translations.en` and `translations.es` filled for accurate marketing pages.
- **`schema.ts`** � Zod schema that validates wizard payloads. Align field names with `questions.ts` and include `.describe()` text for future tooling.
- **`questions.ts`** � array of wizard prompts. Use deterministic IDs (snake_case) so fixtures and tests can target them reliably.
- **`index.ts`** � exports the assembled `LegalDocument`. Route files import from this module to render editors and overlays.

## Generation & Rendering
- `src/services/pdf-generator.ts` receives validated answers, maps them into overlay coordinates, and delegates to PDF utilities in `src/lib/pdf-utils/`.
- Client routes under `src/app/[locale]/(legal)/documents/*` request documents via the dynamic loader, render React Server Components, and stream client wrappers that mount interactive editors.
- Cloud Functions in `functions/` (e.g., `gen-preview.ts`) wrap the same loaders for API-driven previews. Keep any breaking schema changes mirrored here.

## Agent Tips
- Add new templates by copying an existing jurisdiction folder, updating metadata, and registering the document in the metadata registry (or via `scripts/generate-document-manifest.mjs`).
- Run `npm run verify-templates` after editing schemas or metadata to catch missing fields.
- Use the fixtures in `tests/fixtures/` when writing regression tests; avoid sampling the entire catalog at runtime to keep suites deterministic.
