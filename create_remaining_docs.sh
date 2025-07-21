#\!/bin/bash

# Array of document IDs and names
declare -A docs
docs[marketing-agreement]="Marketing Agreement"
docs[endorsement-agreement]="Endorsement Agreement" 
docs[joint-venture-agreement]="Joint Venture Agreement"
docs[buy-sell-agreement]="Buy-Sell Agreement"
docs[limited-partnership-agreement]="Limited Partnership Agreement"
docs[partnership-amendment]="Partnership Amendment"
docs[partnership-dissolution-agreement]="Partnership Dissolution Agreement"
docs[private-placement-memorandum]="Private Placement Memorandum"

for doc_id in "${\!docs[@]}"; do
  doc_name="${docs[$doc_id]}"
  base_dir="/mnt/c/Users/Fsuels/OneDrive/Desktop/123legaldoc/studio-master/src/lib/documents/us/$doc_id"
  
  # Create index.ts
  cat > "$base_dir/index.ts" << EOI
import type { LegalDocument } from '@/types/documents';
import { ${doc_id//-/_}Meta } from './metadata';
import { ${doc_id//-/_}Questions } from './questions';
import { ${doc_id//-/_}Schema } from './schema';

export const ${doc_id//-/_}: LegalDocument = {
  id: '$doc_id',
  ...${doc_id//-/_}Meta,
  schema: ${doc_id//-/_}Schema,
  questions: ${doc_id//-/_}Questions,
};
EOI

  # Create metadata.ts
  cat > "$base_dir/metadata.ts" << EOM
import type { LegalDocument } from '@/types/documents';

export const ${doc_id//-/_}Meta: Omit<LegalDocument, 'schema'  < /dev/null |  'questions'> = {
  id: '$doc_id',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 30,
  states: 'all',
  templatePaths: {
    en: '/templates/en/$doc_id.md',
    es: '/templates/es/$doc_id.md',
  },
  upsellClauses: [],
  translations: {
    en: {
      name: '$doc_name',
      description: 'Professional $doc_name for business purposes.',
      aliases: ['${doc_name,,}', '${doc_name// /-}'],
    },
    es: {
      name: '$doc_name',
      description: '$doc_name profesional para propósitos comerciales.',
      aliases: ['${doc_name,,}', '${doc_name// /-}'],
    },
  },
};
EOM

  # Create schema.ts
  cat > "$base_dir/schema.ts" << EOS
import { z } from 'zod';

export const ${doc_id//-/_}Schema = z.object({
  // Basic Information
  partyOneName: z.string().min(1, 'Party one name is required'),
  partyOneAddress: z.string().min(1, 'Party one address is required'),
  partyTwoName: z.string().min(1, 'Party two name is required'),
  partyTwoAddress: z.string().min(1, 'Party two address is required'),
  
  // Agreement Details
  agreementPurpose: z.string().min(1, 'Agreement purpose is required'),
  term: z.string().min(1, 'Agreement term is required'),
  
  // Additional Terms
  additionalTerms: z.string().optional(),
  
  // Execution
  agreementDate: z.string().min(1, 'Agreement date is required'),
});
EOS

  # Create questions.ts
  cat > "$base_dir/questions.ts" << EOQ
import type { FormQuestion } from '@/types/documents';

export const ${doc_id//-/_}Questions: FormQuestion[] = [
  {
    id: 'partyOneName',
    type: 'text',
    label: 'First Party Name',
    required: true,
    placeholder: 'Enter the name of the first party',
    validation: { min: 1 }
  },
  {
    id: 'partyOneAddress',
    type: 'textarea',
    label: 'First Party Address',
    required: true,
    placeholder: 'Enter the complete address of the first party',
    validation: { min: 10, max: 300 }
  },
  {
    id: 'partyTwoName',
    type: 'text',
    label: 'Second Party Name',
    required: true,
    placeholder: 'Enter the name of the second party',
    validation: { min: 1 }
  },
  {
    id: 'partyTwoAddress',
    type: 'textarea',
    label: 'Second Party Address',
    required: true,
    placeholder: 'Enter the complete address of the second party',
    validation: { min: 10, max: 300 }
  },
  {
    id: 'agreementPurpose',
    type: 'textarea',
    label: 'Agreement Purpose',
    required: true,
    placeholder: 'Describe the purpose and scope of this agreement',
    validation: { min: 20, max: 1000 }
  },
  {
    id: 'term',
    type: 'text',
    label: 'Agreement Term',
    required: true,
    placeholder: 'e.g., 1 year, 6 months, ongoing',
    validation: { min: 1 }
  },
  {
    id: 'additionalTerms',
    type: 'textarea',
    label: 'Additional Terms',
    required: false,
    placeholder: 'Enter any additional terms or conditions',
    validation: { max: 1000 }
  },
  {
    id: 'agreementDate',
    type: 'date',
    label: 'Agreement Date',
    required: true,
    helpText: 'Date this agreement is signed'
  }
];
EOQ

done

echo "Created basic structure for remaining documents"
