# Pending Follow-Ups

- Update UI/Data layers (e.g., `src/lib/document-registry.ts` and downstream listing/search components) to source titles/routes from the generated manifest instead of the three-item stub. (Step1 selector, workflow steps 1–3, DocumentTypeSelector, mega menu variants, discovery modal, questionnaire, header/global search, and top docs chips now hydrate from the manifest-backed library without placeholders.)
- Mirror the manifest-driven loader inside Firebase functions / API wrappers so backend flows use the same dynamic import surface (checkout + wizard use `getSingleDocument`; start page + Firestore dashboard now resolve metadata via manifest; remaining API/AI scripts currently reference only metadata helpers—recheck after next manifest expansion).
- Convert metadata-only templates (e.g., `src/lib/documents/us/accident-report`) to export full `LegalDocument` objects or decide on a separate metadata track so they can join the manifest (script currently skips them).
- Run a full quality sweep once wiring is complete (`npm run lint`, `npm run test`, etc.); lint timed out locally and still reports legacy warnings (see latest run).
- Document the new manifest script in contributor docs and ensure it is part of the build/pipeline (consider adding pre-commit or CI guard).
- Migrate remaining UI flows that dynamically import `documentLibrary` (AI/autocomplete flows, analytics dashboards, any server-rendered stubs) to use manifest-backed helpers; audit for lingering async placeholders (none found in components, re-check `ai/` and backend consumers).
- Manifest-driven document library wiring is in progress—next focus: Firebase/API parity and metadata gaps, then schedule the quality sweep.
