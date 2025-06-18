// src/lib/documents/us/international-trade-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const internationalTradeAgreementQuestions: FormQuestion[] = [
  {
    id: 'exporterName',
    type: 'text',
    label: 'Exporter Name',
    placeholder: 'Enter exporter company name',
    required: true,
    group: 'exporter',
  },
  {
    id: 'importerName',
    type: 'text',
    label: 'Importer Name',
    placeholder: 'Enter importer company name',
    required: true,
    group: 'importer',
  },
  {
    id: 'productDescription',
    type: 'textarea',
    label: 'Product Description',
    placeholder: 'Describe the products being traded',
    required: false,
    group: 'products',
  },
  {
    id: 'incoterms',
    type: 'select',
    label: 'Incoterms',
    options: [
      { value: 'exw', label: 'EXW - Ex Works' },
      { value: 'fca', label: 'FCA - Free Carrier' },
      { value: 'fob', label: 'FOB - Free on Board' },
      { value: 'cif', label: 'CIF - Cost, Insurance & Freight' },
      { value: 'ddp', label: 'DDP - Delivered Duty Paid' },
    ],
    required: false,
    group: 'shipping',
  },
  {
    id: 'paymentTerms',
    type: 'select',
    label: 'Payment Terms',
    options: [
      { value: 'letter-of-credit', label: 'Letter of Credit' },
      { value: 'advance-payment', label: 'Advance Payment' },
      { value: 'open-account', label: 'Open Account' },
      { value: 'documentary-collection', label: 'Documentary Collection' },
    ],
    required: false,
    group: 'payment',
  },
  {
    id: 'totalValue',
    type: 'text',
    label: 'Total Trade Value',
    placeholder: 'Enter total value',
    required: false,
    group: 'financial',
  },
];