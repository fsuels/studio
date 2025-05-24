#!/usr/bin/env bash
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 <doc-id>    (e.g. promissory-note)"
  exit 1
fi

DOC="$1"                           # e.g. "promissory-note"
ROOT="$(pwd)"

# ─── The 8 files we expect ────────────────────────────────────────
T_EN="$ROOT/templates/en/us/${DOC}.md"
T_ES="$ROOT/templates/es/us/${DOC}.md"
I18N_EN="$ROOT/public/locales/en/documents/${DOC}.json"
I18N_ES="$ROOT/public/locales/es/documents/${DOC}.json"
SCHEMA="$ROOT/src/lib/documents/us/${DOC}/schema.ts"
QUESTIONS="$ROOT/src/lib/documents/us/${DOC}/questions.ts"
META="$ROOT/src/lib/documents/us/${DOC}/metadata.ts"
DOC_INDEX="$ROOT/src/lib/documents/us/${DOC}/index.ts"

# ─── Central index where we add the export ───────────────────────
CENTRAL_INDEX="$ROOT/src/lib/documents/index.ts"

echo "🔍 Verifying all required files for '$DOC'…"
for f in \
  "$T_EN" "$T_ES" \
  "$I18N_EN" "$I18N_ES" \
  "$SCHEMA" "$QUESTIONS" "$META" "$DOC_INDEX"
do
  if [ ! -f "$f" ]; then
    echo "❌ Missing required file: $f"
    exit 1
  fi
done

# ─── Build camelCase export name ──────────────────────────────────
# Split on '-', capitalize each, then lowercase the first letter of the result
IFS='-' read -ra PARTS <<< "$DOC"
UPPER=""
for part in "${PARTS[@]}"; do
  UPPER+="${part^}"       # Bash: ^ upcases first char, rest unchanged
done
DOC_CAMEL="${UPPER,}"     # Bash: , lowercases first char
EXPORT_NAME="${DOC_CAMEL}Config"   # e.g. "promissoryNoteConfig"
REL_PATH="./us/${DOC}"             # path from src/lib/documents/index.ts

# ─── Register it in central index.ts ─────────────────────────────
EXPORT_LINE="export { $EXPORT_NAME } from '$REL_PATH';"

echo
echo "🔗 Registering export in $CENTRAL_INDEX…"

if grep -qF "$EXPORT_LINE" "$CENTRAL_INDEX"; then
  echo "ℹ️  $EXPORT_NAME already present in index.ts"
else
  printf "\n%s\n" "$EXPORT_LINE" >> "$CENTRAL_INDEX"
  echo "✅ Added export for '$EXPORT_NAME' → $REL_PATH"
fi

echo
echo "🎉 All set! Next steps:"
echo "    yarn tsc --noEmit && yarn dev"
