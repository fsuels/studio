/**
 * Dynamic Question Generator
 */

import type { Question } from '@/types/documents';
import type { OverlayConfig } from '@/lib/config-loader/schemas';

type AllowedType = Extract<Question['type'], 'text' | 'select' | 'number' | 'date' | 'boolean' | 'textarea' | 'address' | 'tel' | 'button'>;

function generateLabel(fieldId: string, stateCode?: string): string {
  const stateSpecificLabels: Record<string, Record<string, string>> = {
    AL: {
      seller_name: 'Name of Seller (Print)',
      seller_address: 'Address of Seller',
      buyer_name: 'Name of Buyer (Print)',
      buyer_address: 'Address of Buyer',
      year: 'Year',
      make: 'Make',
      model: 'Model',
      vin: 'Vehicle Identification Number (VIN)',
      color: 'Color',
      price: 'Sale Price',
      sale_date: 'Date of Sale',
    },
    FL: {
      seller_name: "Seller's Printed Name",
      buyer_name: "Purchaser's Printed Name",
      vin: 'Vehicle/Vessel Identification Number',
      make: 'Make/Manufacturer',
    },
    CO: {
      seller_name: 'Seller Name (Print)',
      buyer_name: 'Buyer Name (Print)',
    },
  };

  if (stateCode && stateSpecificLabels[stateCode]?.[fieldId]) {
    return stateSpecificLabels[stateCode][fieldId];
  }

  const words = fieldId
    .split('_')
    .flatMap((word) => word.split(/(?=[A-Z])/))
    .map((w) => w.trim())
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

  return words.join(' ');
}

function detectInputType(fieldId: string, fieldName?: string): AllowedType {
  const combinedText = `${fieldId} ${fieldName || ''}`.toLowerCase();

  if (fieldId.includes('_button') || combinedText.includes('add') || combinedText.includes('button')) return 'button';
  if (combinedText.includes('phone') || combinedText.includes('tel')) return 'tel';
  if (combinedText.includes('date')) return 'date';
  if (/price|amount|cost|value|total/.test(combinedText)) return 'number';
  if (/^(is_|has_|show_|as_is|warranty)/.test(fieldId)) return 'boolean';

  // Everything else defaults to text
  return 'text';
}

function isFieldRequired(fieldId: string): boolean {
  const optionalPatterns = [
    /optional/i,
    /phone/i,
    /email/i,
    /_2$/, // second seller/buyer fields
    /warranty_text/i,
    /existing_liens/i,
    /title_number/i,
    /current_title_date/i,
    // IMPORTANT: removed /state/i so state stays required
  ];
  return !optionalPatterns.some((p) => p.test(fieldId));
}

function generatePlaceholder(fieldId: string, type: AllowedType): string | undefined {
  const lower = fieldId.toLowerCase();
  if (type === 'tel') return '(555) 123-4567';
  if (type === 'date') return 'MM/DD/YYYY';
  if (type === 'number') {
    if (lower.includes('year')) return 'e.g., 2020';
    if (lower.includes('price') || lower.includes('amount')) return 'e.g., 15000';
  }
  if (type === 'text') {
    if (lower.includes('vin')) return 'e.g., 1HGBH41JXMN109186';
    if (lower.includes('make')) return 'e.g., Toyota';
    if (lower.includes('model')) return 'e.g., Camry';
    if (lower.includes('color')) return 'e.g., Blue';
  }
  return undefined;
}

function generateTooltip(fieldId: string, _type: AllowedType): string | undefined {
  const lower = fieldId.toLowerCase();
  if (lower.includes('seller_name')) return 'Enter the full legal name of the person or entity selling the vehicle.';
  if (lower.includes('buyer_name')) return 'Enter the full legal name of the person or entity buying the vehicle.';
  if (lower.includes('vin')) return 'The 17-character unique identifier for the vehicle.';
  if (lower.includes('odometer')) return "Current mileage shown on the vehicle's odometer.";
  if (lower.includes('price')) return 'The total agreed-upon price for the vehicle in USD.';
  if (lower.includes('sale_date')) return 'The date the sale is finalized.';
  if (lower.includes('county')) return 'The county within the state where the document is signed, typically for notarization purposes.';
  return undefined;
}

function generateSelectOptions(fieldId: string): { value: string; label: string }[] | undefined {
  const lower = fieldId.toLowerCase();

  if (lower.includes('body_type')) {
    return [
      { value: 'Sedan', label: 'Sedan' },
      { value: 'SUV', label: 'SUV' },
      { value: 'Truck', label: 'Truck' },
      { value: 'Coupe', label: 'Coupe' },
      { value: 'Convertible', label: 'Convertible' },
      { value: 'Wagon', label: 'Wagon' },
      { value: 'Van', label: 'Van' },
      { value: 'Motorcycle', label: 'Motorcycle' },
      { value: 'Other', label: 'Other' },
    ];
  }

  if (lower.includes('odo_status')) {
    return [
      { value: 'ACTUAL', label: 'Actual Mileage' },
      { value: 'EXCEEDS', label: 'Exceeds Mechanical Limits' },
      { value: 'NOT_ACTUAL', label: 'Not Actual Mileage (Warning)' },
    ];
  }

  if (lower.includes('payment_method')) {
    return [
      { value: 'cash', label: 'Cash' },
      { value: 'check', label: 'Check' },
      { value: 'wire', label: 'Wire Transfer' },
      { value: 'paypal', label: 'PayPal' },
      { value: 'credit_card', label: 'Credit / Debit Card' },
    ];
  }

  return undefined;
}

function stateCodeFromPdfPath(pdfPath?: string): string | undefined {
  if (!pdfPath) return;
  const parts = pdfPath.split('/');
  const idx = parts.findIndex((p) =>
    [
      'alabama',
      'florida',
      'colorado',
      'georgia',
      'idaho',
      'kansas',
      'maryland',
      'montana',
      'north-dakota',
      'west-virginia',
    ].includes(p),
  );
  if (idx === -1) return;
  const map: Record<string, string> = {
    alabama: 'AL',
    florida: 'FL',
    colorado: 'CO',
    georgia: 'GA',
    idaho: 'ID',
    kansas: 'KS',
    maryland: 'MD',
    montana: 'MT',
    'north-dakota': 'ND',
    'west-virginia': 'WV',
  };
  return map[parts[idx]];
}

/**
 * Generate wizard questions from overlay configuration
 */
export function generateQuestions(overlay: OverlayConfig): Question[] {
  const questions: Question[] = [];
  const processed = new Set<string>();

  const fieldIds: string[] = [];

  if (overlay.fieldMapping) {
    fieldIds.push(...Object.keys(overlay.fieldMapping));
  }
  if (overlay.coordinates) {
    for (const k of Object.keys(overlay.coordinates)) {
      if (!fieldIds.includes(k)) fieldIds.push(k);
    }
  }

  const stateCode = stateCodeFromPdfPath(overlay.pdfPath);

  let fieldOrder = [
    'state',
    'seller_name',
    'seller_phone',
    'seller_address',
    'seller2_name',
    'seller2_phone',
    'seller2_address',
    'buyer_name',
    'buyer_phone',
    'buyer_address',
    'buyer2_name',
    'buyer2_phone',
    'buyer2_address',
    'year',
    'make',
    'model',
    'body_type',
    'color',
    'vin',
    'odometer',
    'odo_status',
    'price',
    'payment_method',
    'sale_date',
    'title_number',
    'current_title_date',
    'existing_liens',
    'as_is',
    'warranty_text',
    'county',
  ];

  if (stateCode === 'AL') {
    fieldOrder = [
      'state',
      'vin',
      'seller_name',
      'seller_address',
      'buyer_name',
      'buyer_address',
      'year',
      'make',
      'model',
      'color',
      'price',
      'sale_date',
    ];
  }

  const sorted = fieldIds.sort((a, b) => {
    const ai = fieldOrder.indexOf(a);
    const bi = fieldOrder.indexOf(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b);
  });

  for (const fieldId of sorted) {
    if (processed.has(fieldId)) continue;
    processed.add(fieldId);

    if (['add_seller2_button', 'add_buyer2_button'].includes(fieldId)) continue;

    const fieldName = overlay.fieldMapping?.[fieldId]?.fieldName;
    const type = detectInputType(fieldId, fieldName);
    const label = generateLabel(fieldId, stateCode);
    const required = isFieldRequired(fieldId);
    const placeholder = generatePlaceholder(fieldId, type);
    const tooltip = generateTooltip(fieldId, type);
    const options = generateSelectOptions(fieldId);

    const finalType: AllowedType = options ? 'select' : type;

    const q: Question = {
      id: fieldId,
      label,
      type: finalType,
      required,
      ...(placeholder && { placeholder }),
      ...(tooltip && { tooltip }),
      ...(options && { options }),
      ...(finalType === 'button' && {
        buttonAction: fieldId.includes('seller2') ? 'toggle_show_seller2' : 
                     fieldId.includes('buyer2') ? 'toggle_show_buyer2' : 
                     undefined
      }),
    };

    questions.push(q);
  }

  return questions;
}

export function generateQuestionsForState(overlay: OverlayConfig, stateCode?: string): Question[] {
  const base = generateQuestions(overlay);
  if (!stateCode) return base;

  const notarized = ['AL', 'CO', 'FL', 'GA', 'ID', 'KS', 'MD', 'MT', 'ND', 'WV'];
  return base.map((q) =>
    q.id === 'county' && notarized.includes(stateCode)
      ? { ...q, required: true, tooltip: `Required for notarization in ${stateCode}` }
      : q,
  );
}

export default generateQuestions;
