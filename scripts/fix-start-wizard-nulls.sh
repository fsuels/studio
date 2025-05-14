#!/usr/bin/env bash
set -e

FILE="src/app/[locale]/docs/[docId]/start/StartWizardPageClient.tsx"
echo "🔧 Patching non-null assertions in $FILE…"

# 1) Turn every `params.` into `params!.`
sed -i 's/params\./params!./g' "$FILE"

# 2) Turn every `docConfig.` into `docConfig!.`
sed -i 's/docConfig\./docConfig!./g' "$FILE"

echo "✅ Done! Now re-run:"
echo "    tsc --noEmit"
