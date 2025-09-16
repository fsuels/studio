# Pending Follow-Ups

- Update UI/Data layers (e.g., `src/lib/document-registry.ts` and downstream listing/search components) to source titles/routes from the generated manifest instead of the three-item stub.
- Mirror the manifest-driven loader inside Firebase functions / API wrappers so backend flows use the same dynamic import surface (checkout + wizard now call `getSingleDocument`, others like `internal-linking` still rely on the legacy array).
- Convert metadata-only templates (e.g., `src/lib/documents/us/accident-report`) to export full `LegalDocument` objects or decide on a separate metadata track so they can join the manifest (script currently skips them).
- Run a full quality sweep once wiring is complete (`npm run lint`, `npm run test`, etc.); lint timed out locally and still reports legacy warnings.
- Document the new manifest script in contributor docs and ensure it is part of the build/pipeline (consider adding pre-commit or CI guard).
- Migrate remaining UI flows that dynamically import `documentLibrary` (workflow steps, mega menu, etc.) to use manifest-backed helpers; they currently receive empty arrays.
