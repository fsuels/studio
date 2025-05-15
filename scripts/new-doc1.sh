#!/usr/bin/env bash
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 <DocId>"
  exit 1
fi

DOC="$1"
ROOT="$(pwd)"

# 1️⃣ The two Markdown templates (you’ll rename .md → .tpl if you prefer)
T_EN="$ROOT/public/templates/en/${DOC}.md"
T_ES="$ROOT/public/templates/es/${DOC}.md"

# 2️⃣ The two i18n JSON files
I18N_EN="$ROOT/public/locales/en/documents/${DOC}.json"
I18N_ES="$ROOT/public/locales/es/documents/${DOC}.json"

# 3️⃣ The per‐document code folder under the US namespace
DOC_DIR="$ROOT/src/lib/documents/us/${DOC}"
SCHEMA="$DOC_DIR/schema.ts"
QUESTIONS="$DOC_DIR/questions.ts"
META="$DOC_DIR/metadata.ts"
DOC_INDEX="$DOC_DIR/index.ts"

# create all the dirs
mkdir -p \
  "$(dirname "$T_EN")" "$(dirname "$T_ES")" \
  "$(dirname "$I18N_EN")" "$(dirname "$I18N_ES")" \
  "$DOC_DIR"

# touch out stubs for each of the 8
for f in \
  "$T_EN" "$T_ES" \
  "$I18N_EN" "$I18N_ES" \
  "$SCHEMA" "$QUESTIONS" "$META" \
  "$DOC_INDEX"
do
  if [ -f "$f" ]; then
    echo "⏭ Skipped (exists) $f"
  else
    echo "// TODO: fill in $(basename "$f")" > "$f"
    echo "✏️  Created $f"
  fi
done

# open them all in your EDITOR (or vim if $EDITOR is unset)
${EDITOR:-vim} \
  "$T_EN" "$T_ES" \
  "$I18N_EN" "$I18N_ES" \
  "$SCHEMA" "$QUESTIONS" "$META" \
  "$DOC_INDEX"

echo
echo "✅ Skeleton for '$DOC' is ready. Next:"
echo "   1) fill in each file"
echo "   2) run  register-script to wire up central index:"
echo "        bash scripts/register-document.sh $DOC"
