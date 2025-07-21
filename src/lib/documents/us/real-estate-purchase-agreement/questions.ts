// src/lib/documents/us/real-estate-purchase-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const realEstatePurchaseAgreementQuestions: FormQuestion[] = [
  {
    id: 'buyerName',
    type: 'text',
    label: 'Buyer Name',
    placeholder: 'Enter buyer full name',
    required: true,
    group: 'buyer',
  },
  {
    id: 'sellerName',
    type: 'text',
    label: 'Seller Name',
    placeholder: 'Enter seller full name',
    required: true,
    group: 'seller',
  },
  {
    id: 'propertyAddress',
    type: 'text',
    label: 'Property Address',
    placeholder: 'Enter complete property address',
    required: true,
    group: 'property',
  },
  {
    id: 'purchasePrice',
    type: 'text',
    label: 'Purchase Price',
    placeholder: 'Enter purchase price',
    required: false,
    group: 'terms',
  },
  {
    id: 'earnestMoney',
    type: 'text',
    label: 'Earnest Money',
    placeholder: 'Enter earnest money amount',
    required: false,
    group: 'terms',
  },
  {
    id: 'closingDate',
    type: 'date',
    label: 'Closing Date',
    required: false,
    group: 'closing',
  },
  {
    id: 'financingContingency',
    type: 'boolean',
    label: 'Financing contingency?',
    required: false,
    group: 'contingencies',
  },
  {
    id: 'inspectionContingency',
    type: 'boolean',
    label: 'Inspection contingency?',
    required: false,
    group: 'contingencies',
  },
];
