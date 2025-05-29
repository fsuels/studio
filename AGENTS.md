--- /dev/null
+++ studio-master/AGENTS.md
@@
+# 123LegalDoc – Codex Contributor Guide
+
+## Work here
+- **Next.js app:** `src/`
+- **Legal-doc engine:** `src/lib/documents/`
+- **Cloud Functions:** `functions/`
+
+## Validate before committing
+```bash
+npm run lint     # ESLint + Prettier + TS
+npm run test     # Vitest unit tests
+npm run e2e      # Playwright E2E
+npm run build    # Next.js static export
+```
+
+## Style rules
+- Use React Server Components except where `use client` is required.  
+- Never use `<img>` – always our `<AutoImage />` wrapper.  
+- Always supply **unified diffs** (`+`/`-`) with full file paths in PRs.
+
+## PR checklist
+1. All commands above pass locally.
+2. Title format: `[Scope] Imperative summary`.
+3. Explain **why** and **how**, not just **what**.
