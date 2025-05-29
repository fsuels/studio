#!/usr/bin/env bash
set -euo pipefail

echo "🔧 [setup] Installing project dependencies with npm…"

# Install packages exactly as locked in package-lock.json
npm ci --prefer-offline --no-audit --progress=false

# Pull Playwright browsers only if the repo uses Playwright tests
grep -q '@playwright/test' package.json 2>/dev/null && \
  npx playwright install --with-deps

# Global CLI helpers Codex often calls
npm install -g eslint prettier typescript firebase-tools >/dev/null 2>&1

# ------------------------------------------------------------------
# (Optional) generate runtime .env & service account during CI runs
# ------------------------------------------------------------------
echo "📄  Generating .env for runtime …"
printenv | grep -E '^(NEXT_PUBLIC_|STRIPE_|OPENAI_|SIGNWELL_)' > .env
echo "NEXT_PUBLIC_SIGNED_URL_API=$NEXT_PUBLIC_SIGNED_URL_API" >> .env
echo "$FIREBASE_SERVICE_ACCOUNT_KEY_JSON" > serviceAccountKey.json

echo "✅ [setup] Done — environment ready for Codex."
--- /dev/null
+++ studio-master/scripts/codex-setup.sh
@@
+#!/usr/bin/env bash
+set -euo pipefail
+
+echo "🔧 [setup] Installing project dependencies with npm…"
+
+# Install packages exactly as locked in package-lock.json
+npm ci --prefer-offline --no-audit --progress=false
+
+# Pull Playwright browsers only if the repo uses Playwright tests
+grep -q '@playwright/test' package.json 2>/dev/null && \
+  npx playwright install --with-deps
+
+# Global CLI helpers Codex often calls
+npm install -g eslint prettier typescript firebase-tools >/dev/null 2>&1
+
+# ------------------------------------------------------------------
+# (Optional) generate runtime .env & service account during CI runs
+# ------------------------------------------------------------------
+echo "📄  Generating .env for runtime …"
+printenv | grep -E '^(NEXT_PUBLIC_|STRIPE_|OPENAI_|SIGNWELL_)' > .env
+echo "NEXT_PUBLIC_SIGNED_URL_API=$NEXT_PUBLIC_SIGNED_URL_API" >> .env
+echo "$FIREBASE_SERVICE_ACCOUNT_KEY_JSON" > serviceAccountKey.json
+
+echo "✅ [setup] Done — environment ready for Codex."
