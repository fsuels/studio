#!/usr/bin/env bash
set -e

echo "👉  1. Creating folder & archiving old formSchemas…"
mkdir -p src/lib/formSchemas
if [[ -f src/data/formSchemas.ts ]]; then
  mv src/data/formSchemas.ts src/lib/formSchemas/_archive.formSchemas.ts
  echo "    • Archived src/data/formSchemas.ts → src/lib/formSchemas/_archive.formSchemas.ts"
else
  echo "    • No src/data/formSchemas.ts to archive, skipping."
fi

echo "👉  2. Scaffolding vehicleBillOfSale.ts…"
cat > src/lib/formSchemas/vehicleBillOfSale.ts << 'SCRIPT'
import type { FormField } from '@/data/formSchemas'
import { usStates }     from '@/lib/usStates'

export const vehicleBillOfSale: FormField[] = [
  {
    id: "seller_name",
    label: "Seller's Full Name",
    type: "text",
    required: true,
    tooltip: "Enter the full legal name of the person or entity selling the vehicle."
  },
  // … paste the rest of your fields here …
  {
    id: "existing_liens",
    label: 'Existing Liens (if any, otherwise leave blank or "None")',
    type: "text",
    placeholder: "e.g., None, or Loan with XYZ Bank",
    tooltip: "Disclose any outstanding loans or claims against the vehicle."
  },
  {
    id: "as_is",
    label: 'Is the vehicle sold "as-is"?',
    type: "boolean",
    required: true,
    tooltip: "Select 'Yes' if sold without warranties, 'No' if warranties are provided."
  },
  {
    id: "state",
    label: "State of Sale (Governing Law & Notary)",
    type: "select",
    required: true,
    options: usStates.map(s => ({ value: s.value, label: s.label })),
    tooltip: "The U.S. state whose laws will govern this agreement."
  },
  {
    id: "county",
    label: "County (for Notary Acknowledgment)",
    type: "text",
    required: false,
    tooltip: "The county within the state where the document is signed."
  }
]
SCRIPT

echo "👉  3. Scaffolding index.ts…"
cat > src/lib/formSchemas/index.ts << 'SCRIPT2'
import type { FormSchema }       from '@/data/formSchemas'
import { vehicleBillOfSale }     from './vehicleBillOfSale'
// import { leaseAgreement }      from './leaseAgreement'
// import { powerOfAttorney }     from './powerOfAttorney'
// …add more as you scaffold them…

export const formSchemas: FormSchema = {
  "Vehicle Bill of Sale": vehicleBillOfSale,
  // "Residential Lease Agreement": leaseAgreement,
  // "General Power of Attorney": powerOfAttorney,
  // etc...
}
SCRIPT2

echo "✅  Done! Now customize src/lib/formSchemas/vehicleBillOfSale.ts with your full field list."
