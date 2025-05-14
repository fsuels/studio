#!/usr/bin/env bash
set -e

FILE="src/components/DynamicFormRenderer.tsx"
echo "🧹 Cleaning up analyzeFormData imports in \$FILE…"

# 1) Delete the broken import block starting at "import { analyzeFormData," (and its next line)
sed -i "/import { analyzeFormData,/,+1d" "\$FILE"

# 2) Remove any stray "type FieldSuggestion," lines
sed -i "/type FieldSuggestion,/d" "\$FILE"

# 3) Insert the correct, single-line import right after the FormField import
#    (matches: import type { FormField } from '@/data/formSchemas'; )
sed -i "/import type { FormField } from '.*data\/formSchemas';/a import { analyzeFormData, type FieldSuggestion } from '@/ai\/flows\/analyze-form-data';" "\$FILE"

echo "✅ Done! Now run:"
echo "    tsc --noEmit"
