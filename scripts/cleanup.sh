#!/usr/bin/env bash
set -euo pipefail

echo "🔧 Applying non-null assertions to params, pathname, searchParams…"
find src/app -type f -name '*.tsx' | \
  xargs sed -i \
    -e 's/\bparams\./params!./g' \
    -e 's/\bpathname\./pathname!./g' \
    -e 's/\bsearchParams\./searchParams!./g'

echo "🗑 Removing stray 'ts' or 'tsx' lines…"
grep -rlE '^\s*tsx?\s*$' src/app | xargs sed -i '/^\s*tsx\?\s*$/d'

echo "🛠 Fixing API checkout route…"
# remove a line that's just "ts" at the top
sed -i '1{/^ts$/d}' src/app/api/checkout/route.ts
# rename imports to avoid conflicts
sed -i \
  -e "s|import { PRICE_LOOKUP, COUPONS } from '@/lib/stripePrices';|import { PRICE_LOOKUP as STRIPE_PRICES, COUPONS as STRIPE_COUPONS } from '@/lib/stripePrices';|g" \
  -e 's/\bPRICE_LOOKUP\b/STRIPE_PRICES/g' \
  -e 's/\bCOUPONS\b/STRIPE_COUPONS/g' \
  src/app/api/checkout/route.ts

echo "✅ Cleanup done. Now re-run:"
echo "    npx tsc --noEmit && npm run dev -p 9002"
