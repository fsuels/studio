/**
 * Dynamic Question Generator
 * 
 * Generates wizard questions dynamically from overlay.json configurations,
 * ensuring the wizard questions exactly match the PDF form fields.
 */

import type { Question } from '@/types/documents';
import type { OverlayConfig } from '@/lib/config-loader/schemas';

/**
 * Convert field name or question ID to human-readable label
 * 
 * Examples:
 * - seller_name → "Seller Name"
 * - vehicleVesselIdentificationNumber → "Vehicle Vessel Identification Number"
 * - buyer_phone → "Buyer Phone"
 */
function generateLabel(fieldId: string): string {
  // Handle snake_case and camelCase
  const words = fieldId
    // Split on underscores
    .split('_')
    // Split camelCase words
    .flatMap(word => word.split(/(?=[A-Z])/))
    // Clean up and filter empty strings
    .map(word => word.trim())
    .filter(word => word.length > 0)
    // Capitalize first letter of each word
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

  return words.join(' ');
}

/**
 * Detect input type based on field name patterns
 */
function detectInputType(fieldId: string, fieldName?: string): Question['type'] {
  const combinedText = `${fieldId} ${fieldName || ''}`.toLowerCase();
  
  // Date fields
  if (combinedText.includes('date')) {
    return 'date';
  }
  
  // Currency/number fields
  if (/price|amount|cost|value|total/.test(combinedText)) {
    return 'number';
  }
  
  // Specific text fields that should be treated as text with potential validation
  if (/year|zip|vin|mileage|odometer/.test(combinedText)) {
    return 'text';
  }
  
  // Phone numbers
  if (/phone|tel|telephone/.test(combinedText)) {
    return 'tel';
  }
  
  // Boolean fields
  if (/^(is_|has_|show_|as_is|warranty)/.test(fieldId)) {
    return 'boolean';
  }
  
  // Default to text
  return 'text';
}

/**
 * Determine if a field should be required based on common patterns
 */
function isFieldRequired(fieldId: string): boolean {
  // Fields that are typically optional
  const optionalPatterns = [
    /optional/i,
    /phone/i,
    /email/i,
    /county/i,
    /state/i,
    /_2$/,  // Second seller/buyer fields
    /warranty_text/i,
    /existing_liens/i,
    /title_number/i,
    /current_title_date/i
  ];
  
  return !optionalPatterns.some(pattern => pattern.test(fieldId));
}

/**
 * Generate placeholder text for common field types
 */
function generatePlaceholder(fieldId: string, type: Question['type']): string | undefined {
  const lowerFieldId = fieldId.toLowerCase();
  
  switch (type) {
    case 'tel':
      return '(XXX) XXX-XXXX';
    case 'date':
      return 'MM/DD/YYYY';
    case 'number':
      if (lowerFieldId.includes('year')) {
        return 'e.g., 2020';
      }
      if (lowerFieldId.includes('price') || lowerFieldId.includes('amount')) {
        return 'e.g., 15000';
      }
      break;
    case 'text':
      if (lowerFieldId.includes('vin')) {
        return 'e.g., 1HGBH41JXMN109186';
      }
      if (lowerFieldId.includes('make')) {
        return 'e.g., Toyota';
      }
      if (lowerFieldId.includes('model')) {
        return 'e.g., Camry';
      }
      if (lowerFieldId.includes('color')) {
        return 'e.g., Blue';
      }
      break;
  }
  
  return undefined;
}

/**
 * Generate tooltip/help text for common fields
 */
function generateTooltip(fieldId: string, type: Question['type']): string | undefined {
  const lowerFieldId = fieldId.toLowerCase();
  
  if (lowerFieldId.includes('seller_name')) {
    return 'Enter the full legal name of the person or entity selling the vehicle.';
  }
  if (lowerFieldId.includes('buyer_name')) {
    return 'Enter the full legal name of the person or entity buying the vehicle.';
  }
  if (lowerFieldId.includes('vin')) {
    return 'The 17-character unique identifier for the vehicle.';
  }
  if (lowerFieldId.includes('odometer')) {
    return "Current mileage shown on the vehicle's odometer.";
  }
  if (lowerFieldId.includes('price')) {
    return 'The total agreed-upon price for the vehicle in USD.';
  }
  if (lowerFieldId.includes('sale_date')) {
    return 'The date the sale is finalized.';
  }
  if (lowerFieldId.includes('county')) {
    return 'The county within the state where the document is signed, typically for notarization purposes.';
  }
  
  return undefined;
}

/**
 * Create special select field options for known field types
 */
function generateSelectOptions(fieldId: string): { value: string; label: string }[] | undefined {
  const lowerFieldId = fieldId.toLowerCase();
  
  if (lowerFieldId.includes('body_type')) {
    return [
      { value: 'Sedan', label: 'Sedan' },
      { value: 'SUV', label: 'SUV' },
      { value: 'Truck', label: 'Truck' },
      { value: 'Coupe', label: 'Coupe' },
      { value: 'Convertible', label: 'Convertible' },
      { value: 'Wagon', label: 'Wagon' },
      { value: 'Van', label: 'Van' },
      { value: 'Motorcycle', label: 'Motorcycle' },
      { value: 'Other', label: 'Other' }
    ];
  }
  
  if (lowerFieldId.includes('odo_status')) {
    return [
      { value: 'ACTUAL', label: 'Actual Mileage' },
      { value: 'EXCEEDS', label: 'Exceeds Mechanical Limits' },
      { value: 'NOT_ACTUAL', label: 'Not Actual Mileage (Warning)' }
    ];
  }
  
  if (lowerFieldId.includes('payment_method')) {
    return [
      { value: 'cash', label: 'Cash' },
      { value: 'check', label: 'Check' },
      { value: 'wire', label: 'Wire Transfer' },
      { value: 'paypal', label: 'PayPal' },
      { value: 'credit_card', label: 'Credit / Debit Card' }
    ];
  }
  
  return undefined;
}

/**
 * Generate wizard questions from overlay configuration
 * 
 * Priority:
 * 1. fieldMapping keys (AcroForm field names)
 * 2. coordinates keys (coordinate-based fields)
 * 
 * @param overlay - The overlay configuration from overlay.json
 * @returns Array of Question objects for the wizard
 */
export function generateQuestions(overlay: OverlayConfig): Question[] {
  const questions: Question[] = [];
  const processedFields = new Set<string>();
  
  // Get field IDs from overlay configuration
  const fieldIds: string[] = [];
  
  // Priority 1: fieldMapping keys
  if (overlay.fieldMapping) {
    fieldIds.push(...Object.keys(overlay.fieldMapping));
  }
  
  // Priority 2: coordinates keys
  if (overlay.coordinates) {
    Object.keys(overlay.coordinates).forEach(key => {
      if (!fieldIds.includes(key)) {
        fieldIds.push(key);
      }
    });
  }
  
  // Sort field IDs to ensure consistent ordering
  // Common form order: state, seller info, buyer info, vehicle info, transaction info
  const fieldOrder = [
    'state',
    'seller_name', 'seller_phone', 'seller_address',
    'seller2_name', 'seller2_phone', 'seller2_address',
    'buyer_name', 'buyer_phone', 'buyer_address', 
    'buyer2_name', 'buyer2_phone', 'buyer2_address',
    'year', 'make', 'model', 'body_type', 'color', 'vin',
    'odometer', 'odo_status',
    'price', 'payment_method', 'sale_date',
    'title_number', 'current_title_date', 'existing_liens',
    'as_is', 'warranty_text', 'county'
  ];
  
  const sortedFieldIds = fieldIds.sort((a, b) => {
    const aIndex = fieldOrder.indexOf(a);
    const bIndex = fieldOrder.indexOf(b);
    
    // If both fields are in the order array, sort by their position
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    
    // If only one is in the order array, prioritize it
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    
    // If neither is in the order array, sort alphabetically
    return a.localeCompare(b);
  });
  
  // Process each field ID
  for (const fieldId of sortedFieldIds) {
    if (processedFields.has(fieldId)) continue;
    processedFields.add(fieldId);
    
    // Skip button and address type fields
    if (['add_seller2_button', 'add_buyer2_button'].includes(fieldId)) {
      continue;
    }
    
    // Get field name from mapping if available
    const fieldName = overlay.fieldMapping?.[fieldId]?.fieldName;
    
    // Generate question properties
    const label = generateLabel(fieldId);
    const type = detectInputType(fieldId, fieldName);
    const required = isFieldRequired(fieldId);
    const placeholder = generatePlaceholder(fieldId, type);
    const tooltip = generateTooltip(fieldId, type);
    
    // Check for select options
    const selectOptions = generateSelectOptions(fieldId);
    const finalType: Question['type'] = selectOptions ? 'select' : type;
    
    // Create question object
    const question: Question = {
      id: fieldId,
      label,
      type: finalType,
      required,
      ...(placeholder && { placeholder }),
      ...(tooltip && { tooltip }),
      ...(selectOptions && { options: selectOptions })
    };
    
    questions.push(question);
  }
  
  return questions;
}

/**
 * Generate questions with state-specific modifications
 * 
 * @param overlay - The overlay configuration
 * @param stateCode - US state code (e.g., 'FL', 'CA')
 * @returns Array of questions with state-specific adjustments
 */
export function generateQuestionsForState(
  overlay: OverlayConfig, 
  stateCode?: string
): Question[] {
  const baseQuestions = generateQuestions(overlay);
  
  if (!stateCode) {
    return baseQuestions;
  }
  
  // State-specific modifications
  return baseQuestions.map(question => {
    // For states that require notarization, make county field required
    if (question.id === 'county' && ['AL', 'CO', 'FL', 'GA', 'ID', 'KS', 'MD', 'MT', 'ND', 'WV'].includes(stateCode)) {
      return {
        ...question,
        required: true,
        tooltip: `Required for notarization in ${stateCode}`
      };
    }
    
    return question;
  });
}

export default generateQuestions;