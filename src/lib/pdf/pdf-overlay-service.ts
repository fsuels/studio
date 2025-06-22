import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { StateAbbr } from '@/lib/documents/us/vehicle-bill-of-sale/compliance';

export interface FieldMapping {
  fieldId: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  fontSize?: number;
  page?: number;
}

export interface StateFormOverlay {
  state: StateAbbr;
  formName: string;
  fieldMappings: FieldMapping[];
}

export async function overlayFormData(
  pdfBytes: ArrayBuffer,
  formData: Record<string, any>,
  state: string
): Promise<ArrayBuffer> {
  try {
    console.log('🔍 PDF SMART OVERLAY: Starting for state:', state);
    console.log('📝 Form data:', formData);
    
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // STEP 1: Try to detect form fields (this is the SMART approach!)
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    
    console.log(`🎯 SMART DETECTION: Found ${fields.length} form fields in PDF`);
    
    if (fields.length > 0) {
      // SUCCESS! PDF has fillable fields - use smart mapping
      console.log('✅ SMART MODE: PDF has fillable fields - using intelligent field mapping');
      fields.forEach(field => {
        console.log(`📋 Available field: "${field.getName()}" (${field.constructor.name})`);
      });
      
      return await smartFormFieldMapping(pdfDoc, formData, state);
    } else {
      // FALLBACK: No form fields - this is a scanned PDF
      console.log('⚠️ FALLBACK MODE: No form fields detected - PDF appears to be scanned');
      console.log('💡 Recommendation: Contact state DMV for fillable version');
      
      // Return original PDF with a warning overlay
      return await addWarningOverlay(pdfDoc, 'Form fields not detected - please fill manually');
    }
    
  } catch (error) {
    console.error('❌ PDF Overlay Error:', error);
    return pdfBytes;
  }
}

// THE SMART APPROACH: Let the PDF tell us what fields it has!
async function smartFormFieldMapping(
  pdfDoc: PDFDocument,
  formData: Record<string, any>,
  state: string
): Promise<ArrayBuffer> {
  console.log('🧠 SMART MAPPING: Analyzing PDF form fields...');
  
  const form = pdfDoc.getForm();
  const fields = form.getFields();
  
  // Create a comprehensive field mapping based on common patterns
  const intelligentMapping = createIntelligentFieldMapping();
  
  let fieldsMatched = 0;
  let fieldsTotal = fields.length;
  
  console.log('🔍 FIELD ANALYSIS: Starting intelligent matching...');
  
  fields.forEach(field => {
    const fieldName = field.getName();
    const fieldNameLower = fieldName.toLowerCase();
    const fieldType = field.constructor.name;
    
    console.log(`🎯 Analyzing field: "${fieldName}" (${fieldType})`);
    
    // Try to match this field to our form data
    let matched = false;
    
    for (const [ourDataKey, possibleMatches] of Object.entries(intelligentMapping)) {
      // Check for exact matches first
      if (possibleMatches.exact.some(pattern => fieldNameLower === pattern.toLowerCase())) {
        if (setFieldValue(field, formData[ourDataKey], fieldName, 'EXACT')) {
          matched = true;
          fieldsMatched++;
          break;
        }
      }
      
      // Then check for partial matches
      if (!matched && possibleMatches.partial.some(pattern => fieldNameLower.includes(pattern.toLowerCase()))) {
        if (setFieldValue(field, formData[ourDataKey], fieldName, 'PARTIAL')) {
          matched = true;
          fieldsMatched++;
          break;
        }
      }
      
      // Finally check for fuzzy matches
      if (!matched && possibleMatches.fuzzy.some(pattern => 
        fieldNameLower.includes(pattern.toLowerCase()) || 
        pattern.toLowerCase().includes(fieldNameLower.substring(0, 4))
      )) {
        if (setFieldValue(field, formData[ourDataKey], fieldName, 'FUZZY')) {
          matched = true;
          fieldsMatched++;
          break;
        }
      }
    }
    
    if (!matched) {
      console.log(`❓ UNMATCHED: Field "${fieldName}" - no mapping found`);
    }
  });
  
  console.log(`📊 SMART MAPPING RESULTS: ${fieldsMatched}/${fieldsTotal} fields successfully mapped`);
  
  if (fieldsMatched === 0) {
    console.log('⚠️ WARNING: No fields were mapped - field names may be unusual');
    console.log('💡 Consider manual mapping for this state');
  }
  
  return (await pdfDoc.save()).buffer;
}

function setFieldValue(field: any, value: any, fieldName: string, matchType: string): boolean {
  if (!value) return false;
  
  try {
    const fieldType = field.constructor.name;
    
    if (fieldType === 'PDFTextField') {
      field.setText(String(value));
      console.log(`✅ ${matchType} MATCH: "${fieldName}" = "${value}"`);
      return true;
    } else if (fieldType === 'PDFCheckBox') {
      field.check();
      console.log(`✅ ${matchType} MATCH: Checked "${fieldName}"`);
      return true;
    } else if (fieldType === 'PDFDropdown') {
      // Try to set dropdown value
      field.select(String(value));
      console.log(`✅ ${matchType} MATCH: Selected "${value}" in "${fieldName}"`);
      return true;
    } else {
      console.log(`❓ Unknown field type: ${fieldType} for "${fieldName}"`);
      return false;
    }
  } catch (error) {
    console.warn(`❌ Failed to set "${fieldName}":`, error);
    return false;
  }
}

function createIntelligentFieldMapping() {
  return {
    seller_name: {
      exact: ['seller_name', 'sellerName', 'seller', 'grantor_name', 'from_name'],
      partial: ['seller', 'grantor', 'from', 'owner', 'current_owner'],
      fuzzy: ['sell', 'gran', 'vendor', 'transferor']
    },
    buyer_name: {
      exact: ['buyer_name', 'buyerName', 'buyer', 'grantee_name', 'to_name', 'purchaser_name'],
      partial: ['buyer', 'grantee', 'purchaser', 'to', 'new_owner'],
      fuzzy: ['buy', 'purch', 'transferee', 'acquirer']
    },
    seller_address: {
      exact: ['seller_address', 'sellerAddress', 'grantor_address', 'from_address'],
      partial: ['seller_addr', 'grantor_addr', 'owner_address'],
      fuzzy: ['sell_addr', 'from_addr']
    },
    buyer_address: {
      exact: ['buyer_address', 'buyerAddress', 'grantee_address', 'to_address', 'purchaser_address'],
      partial: ['buyer_addr', 'grantee_addr', 'purchaser_addr'],
      fuzzy: ['buy_addr', 'to_addr']
    },
    year: {
      exact: ['year', 'model_year', 'yr', 'vehicle_year'],
      partial: ['year', 'yr'],
      fuzzy: ['yr', 'model']
    },
    make: {
      exact: ['make', 'manufacturer', 'vehicle_make'],
      partial: ['make', 'mfg', 'brand'],
      fuzzy: ['make', 'manu']
    },
    model: {
      exact: ['model', 'vehicle_model'],
      partial: ['model'],
      fuzzy: ['mod']
    },
    vin: {
      exact: ['vin', 'vehicle_id', 'serial_number', 'vehicle_identification_number'],
      partial: ['vin', 'serial', 'id_number'],
      fuzzy: ['vin', 'serial', 'id']
    },
    color: {
      exact: ['color', 'colour', 'vehicle_color'],
      partial: ['color', 'colour'],
      fuzzy: ['col']
    },
    price: {
      exact: ['price', 'sale_price', 'purchase_price', 'amount', 'cost'],
      partial: ['price', 'amount', 'cost', 'value'],
      fuzzy: ['pric', 'amt', 'val']
    },
    sale_date: {
      exact: ['sale_date', 'date', 'transaction_date', 'date_of_sale'],
      partial: ['date', 'sale_date', 'trans_date'],
      fuzzy: ['date', 'dt']
    },
    odometer: {
      exact: ['odometer', 'mileage', 'miles', 'odometer_reading'],
      partial: ['odometer', 'mileage', 'miles'],
      fuzzy: ['odom', 'mile', 'km']
    }
  };
}

async function addWarningOverlay(pdfDoc: PDFDocument, message: string): Promise<ArrayBuffer> {
  console.log('⚠️ Adding warning overlay to PDF');
  
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  
  if (pages.length > 0) {
    const page = pages[0];
    const { width, height } = page.getSize();
    
    // Add warning message at top of page
    page.drawText(message, {
      x: 50,
      y: height - 30,
      size: 12,
      font: helveticaFont,
      color: rgb(1, 0, 0), // Red color
    });
  }
  
  return (await pdfDoc.save()).buffer;
}

// Legacy function - redirects to smart mapping
async function fillFormFields(
  pdfDoc: PDFDocument,
  formData: Record<string, any>,
  state: string
): Promise<ArrayBuffer> {
  return smartFormFieldMapping(pdfDoc, formData, state);
}

// DEPRECATED: Old coordinate-based approach
// We now use smart field detection instead!
async function coordinateBasedOverlay(
  pdfDoc: PDFDocument,
  formData: Record<string, any>,
  state: string
): Promise<ArrayBuffer> {
  console.log('⚠️ DEPRECATED: coordinate-based overlay should not be used');
  console.log('💡 The smart approach should handle all cases');
  
  // Return original PDF with deprecation warning
  return await addWarningOverlay(pdfDoc, 'DEPRECATED: Coordinate overlay not supported');
}

// Smart state-specific field mapping loader
async function getStateFieldMapping(state: string): Promise<Record<string, string[]> | null> {
  try {
    const stateKey = state.toLowerCase().replace(/[\s-]/g, '-');
    
    switch (stateKey) {
      case 'fl':
      case 'florida':
        const { floridaFieldMapping } = await import('@/lib/documents/us/vehicle-bill-of-sale/forms/florida/overlay');
        return floridaFieldMapping;
      case 'al':
      case 'alabama':
        const { alabamaFieldMapping } = await import('@/lib/documents/us/vehicle-bill-of-sale/forms/alabama/overlay');
        return alabamaFieldMapping;
      case 'co':
      case 'colorado':
        const { coloradoFieldMapping } = await import('@/lib/documents/us/vehicle-bill-of-sale/forms/colorado/overlay');
        return coloradoFieldMapping;
      case 'ga':
      case 'georgia':
        const { georgiaFieldMapping } = await import('@/lib/documents/us/vehicle-bill-of-sale/forms/georgia/overlay');
        return georgiaFieldMapping;
      case 'id':
      case 'idaho':
        const { idahoFieldMapping } = await import('@/lib/documents/us/vehicle-bill-of-sale/forms/idaho/overlay');
        return idahoFieldMapping;
      case 'ks':
      case 'kansas':
        const { kansasFieldMapping } = await import('@/lib/documents/us/vehicle-bill-of-sale/forms/kansas/overlay');
        return kansasFieldMapping;
      case 'md':
      case 'maryland':
        const { marylandFieldMapping } = await import('@/lib/documents/us/vehicle-bill-of-sale/forms/maryland/overlay');
        return marylandFieldMapping;
      case 'mt':
      case 'montana':
        const { montanaFieldMapping } = await import('@/lib/documents/us/vehicle-bill-of-sale/forms/montana/overlay');
        return montanaFieldMapping;
      case 'nd':
      case 'north-dakota':
        const { northDakotaFieldMapping } = await import('@/lib/documents/us/vehicle-bill-of-sale/forms/north-dakota/overlay');
        return northDakotaFieldMapping;
      case 'wv':
      case 'west-virginia':
        const { westVirginiaFieldMapping } = await import('@/lib/documents/us/vehicle-bill-of-sale/forms/west-virginia/overlay');
        return westVirginiaFieldMapping;
      default:
        console.log(`No state-specific field mapping found for: ${state}`);
        return null;
    }
  } catch (error) {
    console.warn(`Failed to load state mapping for ${state}:`, error);
    return null;
  }
}

function getGenericFieldMapping(): Record<string, string[]> {
  return {
    seller_name: ['seller', 'seller_name', 'sellerName', 'from', 'grantor', 'vendor'],
    buyer_name: ['buyer', 'buyer_name', 'buyerName', 'to', 'grantee', 'purchaser'],
    seller_address: ['seller_address', 'sellerAddress', 'from_address', 'grantor_address'],
    buyer_address: ['buyer_address', 'buyerAddress', 'to_address', 'grantee_address'],
    year: ['year', 'model_year', 'yr', 'vehicle_year'],
    make: ['make', 'manufacturer', 'vehicle_make'],
    model: ['model', 'vehicle_model'],
    vin: ['vin', 'vehicle_id', 'serial_number', 'vehicle_vin'],
    color: ['color', 'colour', 'vehicle_color'],
    price: ['price', 'amount', 'sale_price', 'purchase_price'],
    sale_date: ['date', 'sale_date', 'transaction_date'],
    odometer: ['odometer', 'mileage', 'miles', 'odometer_reading'],
    seller_city: ['seller_city', 'from_city'],
    seller_state: ['seller_state', 'from_state'],
    seller_zip: ['seller_zip', 'from_zip'],
    buyer_city: ['buyer_city', 'to_city'],
    buyer_state: ['buyer_state', 'to_state'],
    buyer_zip: ['buyer_zip', 'to_zip']
  };
}

// Smart coordinate-based overlay using state-specific configurations
async function coordinateBasedOverlayWithStateMapping(
  pdfDoc: PDFDocument,
  formData: Record<string, any>,
  state: string
): Promise<ArrayBuffer> {
  console.log('PDF Overlay: Using coordinate-based overlay with state-specific mappings');
  
  const stateOverlay = await getStateOverlay(state);
  
  if (stateOverlay) {
    return await applyStateOverlay(pdfDoc, formData, stateOverlay);
  }
  
  // Fallback to generic coordinate overlay
  return await coordinateBasedOverlay(pdfDoc, formData, state);
}

async function getStateOverlay(state: string): Promise<StateFormOverlay | null> {
  try {
    const stateKey = state.toLowerCase().replace(/[\s-]/g, '-');
    
    switch (stateKey) {
      case 'fl':
      case 'florida':
        const { floridaOverlay } = await import('@/lib/documents/us/vehicle-bill-of-sale/forms/florida/overlay');
        return floridaOverlay;
      case 'al':
      case 'alabama':
        const { alabamaOverlay } = await import('@/lib/documents/us/vehicle-bill-of-sale/forms/alabama/overlay');
        return alabamaOverlay;
      case 'co':
      case 'colorado':
        const { coloradoOverlay } = await import('@/lib/documents/us/vehicle-bill-of-sale/forms/colorado/overlay');
        return coloradoOverlay;
      case 'ga':
      case 'georgia':
        const { georgiaOverlay } = await import('@/lib/documents/us/vehicle-bill-of-sale/forms/georgia/overlay');
        return georgiaOverlay;
      case 'id':
      case 'idaho':
        const { idahoOverlay } = await import('@/lib/documents/us/vehicle-bill-of-sale/forms/idaho/overlay');
        return idahoOverlay;
      case 'ks':
      case 'kansas':
        const { kansasOverlay } = await import('@/lib/documents/us/vehicle-bill-of-sale/forms/kansas/overlay');
        return kansasOverlay;
      case 'md':
      case 'maryland':
        const { marylandOverlay } = await import('@/lib/documents/us/vehicle-bill-of-sale/forms/maryland/overlay');
        return marylandOverlay;
      case 'mt':
      case 'montana':
        const { montanaOverlay } = await import('@/lib/documents/us/vehicle-bill-of-sale/forms/montana/overlay');
        return montanaOverlay;
      case 'nd':
      case 'north-dakota':
        const { northDakotaOverlay } = await import('@/lib/documents/us/vehicle-bill-of-sale/forms/north-dakota/overlay');
        return northDakotaOverlay;
      case 'wv':
      case 'west-virginia':
        const { westVirginiaOverlay } = await import('@/lib/documents/us/vehicle-bill-of-sale/forms/west-virginia/overlay');
        return westVirginiaOverlay;
      default:
        return null;
    }
  } catch (error) {
    console.warn(`Failed to load state overlay for ${state}:`, error);
    return null;
  }
}

async function applyStateOverlay(
  pdfDoc: PDFDocument,
  formData: Record<string, any>,
  overlay: StateFormOverlay
): Promise<ArrayBuffer> {
  console.log(`PDF Overlay: Applying ${overlay.formName} overlay for ${overlay.state}`);
  
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  
  if (pages.length === 0) {
    console.warn('PDF has no pages');
    return (await pdfDoc.save()).buffer;
  }
  
  overlay.fieldMappings.forEach(mapping => {
    const value = formData[mapping.fieldId];
    if (value) {
      const page = pages[mapping.page || 0];
      if (page) {
        console.log(`PDF Overlay: Drawing "${value}" at (${mapping.x}, ${mapping.y})`);
        
        page.drawText(String(value), {
          x: mapping.x,
          y: mapping.y,
          size: mapping.fontSize || 10,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
      }
    }
  });
  
  return (await pdfDoc.save()).buffer;
}

export function getOverlayForState(state: string): StateFormOverlay | null {
  console.log(`Use getStateOverlay() for dynamic loading of state: ${state}`);
  return null;
}