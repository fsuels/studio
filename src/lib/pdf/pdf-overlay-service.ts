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
    console.log('PDF Overlay: Starting overlay for state:', state);
    console.log('PDF Overlay: Form data received:', formData);
    
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    
    console.log('PDF Overlay: Found', fields.length, 'form fields in PDF');
    fields.forEach(field => {
      console.log('PDF Overlay: Field name:', field.getName(), 'type:', field.constructor.name);
    });
    
    if (fields.length > 0) {
      return await fillFormFields(pdfDoc, formData, state);
    }
    
    console.warn(`No form fields found in PDF for state: ${state}. Using coordinate-based overlay fallback.`);
    return await coordinateBasedOverlay(pdfDoc, formData, state);
    
  } catch (error) {
    console.error('Error overlaying PDF:', error);
    return pdfBytes;
  }
}

async function fillFormFields(
  pdfDoc: PDFDocument,
  formData: Record<string, any>,
  state: string
): Promise<ArrayBuffer> {
  console.log('PDF Overlay: Using smart form field mapping');
  
  const form = pdfDoc.getForm();
  const fields = form.getFields();
  
  const fieldMappings: Record<string, string[]> = {
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
  
  fields.forEach(field => {
    const fieldName = field.getName().toLowerCase();
    console.log(`PDF Overlay: Processing field "${fieldName}"`);
    
    for (const [ourField, possibleNames] of Object.entries(fieldMappings)) {
      if (possibleNames.some(name => fieldName.includes(name.toLowerCase()))) {
        const value = formData[ourField];
        if (value) {
          try {
            if (field.constructor.name === 'PDFTextField') {
              (field as any).setText(String(value));
              console.log(`PDF Overlay: Set "${fieldName}" = "${value}"`);
            } else if (field.constructor.name === 'PDFCheckBox') {
              (field as any).check();
              console.log(`PDF Overlay: Checked "${fieldName}"`);
            }
          } catch (error) {
            console.warn(`PDF Overlay: Failed to set field "${fieldName}":`, error);
          }
        }
        break;
      }
    }
  });
  
  return (await pdfDoc.save()).buffer;
}

async function coordinateBasedOverlay(
  pdfDoc: PDFDocument,
  formData: Record<string, any>,
  state: string
): Promise<ArrayBuffer> {
  console.log('PDF Overlay: Using coordinate-based overlay fallback');
  
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  
  if (pages.length === 0) {
    console.warn('PDF has no pages');
    return (await pdfDoc.save()).buffer;
  }
  
  const page = pages[0];
  const { height } = page.getSize();
  
  const defaultMappings: Array<{ fieldId: string; x: number; y: number; fontSize?: number }> = [
    { fieldId: 'seller_name', x: 120, y: height - 150, fontSize: 10 },
    { fieldId: 'buyer_name', x: 120, y: height - 200, fontSize: 10 },
    { fieldId: 'year', x: 120, y: height - 250, fontSize: 10 },
    { fieldId: 'make', x: 200, y: height - 250, fontSize: 10 },
    { fieldId: 'model', x: 280, y: height - 250, fontSize: 10 },
    { fieldId: 'vin', x: 120, y: height - 300, fontSize: 10 },
    { fieldId: 'price', x: 120, y: height - 350, fontSize: 10 },
    { fieldId: 'sale_date', x: 120, y: height - 400, fontSize: 10 }
  ];
  
  for (const mapping of defaultMappings) {
    const value = formData[mapping.fieldId];
    if (value) {
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
  
  return (await pdfDoc.save()).buffer;
}

export function getOverlayForState(state: string): StateFormOverlay | null {
  console.log(`No specific overlay configuration found for state: ${state}`);
  return null;
}