import { usStates } from '@/lib/document-library/utils';
import type { Question } from '@/types/documents';

export const vehicleBillOfSaleQuestions: Question[] = [
  { id: 'sellers', label: 'Seller Information', type: 'group', required: true },
  { id: 'buyers', label: 'Buyer Information', type: 'group', required: true },
  { id: 'vin', label: 'Vehicle Identification Number (VIN)', type: 'text', required: true },
  { id: 'year', label: 'Vehicle Year', type: 'number', required: true },
  { id: 'make', label: 'Vehicle Make', type: 'text', required: true },
  { id: 'model', label: 'Vehicle Model', type: 'text', required: true },
  { id: 'color', label: 'Vehicle Color', type: 'text', required: true },
  { id: 'odometer', label: 'Odometer Reading (miles)', type: 'number', required: true },
  {
    id: 'odo_status',
    label: 'Odometer Status',
    type: 'select',
    required: true,
    options: [
      { value: 'ACTUAL', label: 'Actual' },
      { value: 'EXCEEDS', label: 'Exceeds' },
      { value: 'NOT_ACTUAL', label: 'Not Actual' }
    ]
  },
  { id: 'sale_date', label: 'Date of Sale', type: 'date', required: true },
  { id: 'price', label: 'Sale Price ($)', type: 'number', required: true },
  {
    id: 'payment_method',
    label: 'Payment Method',
    type: 'select',
    options: [
      { value: 'cash', label: 'Cash' },
      { value: 'check', label: 'Check' },
      { value: 'wire', label: 'Wire' },
      { value: 'paypal', label: 'PayPal' },
      { value: 'credit_card', label: 'Credit Card' }
    ]
  },
  { id: 'existing_liens', label: 'Existing Liens (if any, otherwise leave blank or "None")', type: 'text' },
  { id: 'as_is', label: 'Is the vehicle sold "as-is"?', type: 'boolean' },
  { id: 'warranty_text', label: 'Warranty Details (if not "as-is")', type: 'textarea' },
  {
    id: 'state',
    label: 'State of Sale (Governing Law & Notary)',
    type: 'select',
    required: true,
    options: usStates.map(s => ({ value: s.value, label: s.label }))
  },
  { id: 'county', label: 'County (for Notary Acknowledgment)', type: 'text' }
];
