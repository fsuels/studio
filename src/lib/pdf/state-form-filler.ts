import { PDFDocument, PDFForm, PDFTextField, PDFCheckBox, PDFRadioGroup } from 'pdf-lib';
import { floridaFieldMapping } from '@/lib/documents/us/vehicle-bill-of-sale/state-specific/florida-questions';
import { coloradoFieldMapping } from '@/lib/documents/us/vehicle-bill-of-sale/state-specific/colorado-questions';
import { alabamaFieldMapping } from '@/lib/documents/us/vehicle-bill-of-sale/state-specific/alabama-questions';
import { georgiaFieldMapping } from '@/lib/documents/us/vehicle-bill-of-sale/state-specific/georgia-questions';
import { idahoFieldMapping } from '@/lib/documents/us/vehicle-bill-of-sale/state-specific/idaho-questions';
import { kansasFieldMapping } from '@/lib/documents/us/vehicle-bill-of-sale/state-specific/kansas-questions';
import { marylandFieldMapping } from '@/lib/documents/us/vehicle-bill-of-sale/state-specific/maryland-questions';
import { montanaFieldMapping } from '@/lib/documents/us/vehicle-bill-of-sale/state-specific/montana-questions';
import { northDakotaFieldMapping } from '@/lib/documents/us/vehicle-bill-of-sale/state-specific/north-dakota-questions';
import { westVirginiaFieldMapping } from '@/lib/documents/us/vehicle-bill-of-sale/state-specific/west-virginia-questions';

export interface StateFormData {
  [key: string]: any;
}

export async function fillStateOfficialForm(
  pdfPath: string,
  formData: StateFormData,
  stateCode: string
): Promise<string> {
  try {
    // Load the official PDF form
    const response = await fetch(pdfPath);
    if (!response.ok) {
      throw new Error(`Failed to load PDF form: ${response.statusText}`);
    }

    const pdfBytes = await response.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();

    // Fill form based on state
    switch (stateCode.toUpperCase()) {
      case 'FL':
        await fillFloridaForm(form, formData);
        break;
      case 'CO':
        await fillColoradoForm(form, formData);
        break;
      case 'AL':
        await fillAlabamaForm(form, formData);
        break;
      case 'GA':
        await fillGeorgiaForm(form, formData);
        break;
      case 'ID':
        await fillIdahoForm(form, formData);
        break;
      case 'KS':
        await fillKansasForm(form, formData);
        break;
      case 'MD':
        await fillMarylandForm(form, formData);
        break;
      case 'MT':
        await fillMontanaForm(form, formData);
        break;
      case 'ND':
        await fillNorthDakotaForm(form, formData);
        break;
      case 'WV':
        await fillWestVirginiaForm(form, formData);
        break;
      default:
        await fillGenericStateForm(form, formData);
    }

    // Flatten the form to prevent further editing
    form.flatten();

    // Save and return blob URL
    const filledPdfBytes = await pdfDoc.save();
    const blob = new Blob([filledPdfBytes], { type: 'application/pdf' });
    return URL.createObjectURL(blob);

  } catch (error) {
    console.error('Error filling state form:', error);
    throw new Error(`Failed to fill ${stateCode} official form: ${error.message}`);
  }
}

async function fillFloridaForm(form: PDFForm, data: StateFormData): Promise<void> {
  // Florida HSMV-82050 specific form filling

  // Document type checkboxes
  const documentType = data.document_type;
  if (documentType === 'notice_of_sale') {
    const noticeCheckbox = form.getCheckBox('Notice of Sale Seller must complete sections 1  3 The purchasers signature in section 3 is optional');
    noticeCheckbox?.check();
  } else if (documentType === 'bill_of_sale') {
    const billCheckbox = form.getCheckBox('Bill of Sale Seller and purchaser must complete sections 1 2 when applicable  3');
    billCheckbox?.check();
  }

  // Vehicle information
  fillTextField(form, 'Year', data.vehicle_year?.toString());
  fillTextField(form, 'MakeManufacturer', data.vehicle_make_manufacturer);
  fillTextField(form, 'Body Type', data.vehicle_body_type);
  fillTextField(form, 'Model', data.vehicle_model);
  fillTextField(form, 'Color', data.vehicle_color);
  fillTextField(form, 'VehicleVessel Identification Number', data.vehicle_vin);
  fillTextField(form, 'Current Title Issue Date', formatDate(data.current_title_issue_date));

  // Sale price
  fillTextField(form, '2', data.sale_price?.toString());

  // Purchaser information
  fillTextField(form, 'Print Names of Purchasers', data.purchaser_names);
  fillTextField(form, 'Address City State Zip Code', data.purchaser_address);

  // Odometer section
  if (data.odometer_type === '5_digit') {
    const checkbox = form.getCheckBox('5 DIGIT OR');
    checkbox?.check();
  } else if (data.odometer_type === '6_digit') {
    const checkbox = form.getCheckBox('6 DIGIT ODOMETER NOW READS');
    checkbox?.check();
  }

  fillTextField(form, 'undefined_2', data.odometer_reading?.toString());

  // Odometer status
  if (data.odometer_status === 'actual_mileage') {
    const checkbox = form.getCheckBox('1 REFLECTS THE ACTUAL MILEAGE');
    checkbox?.check();
  } else if (data.odometer_status === 'exceeds_limits') {
    const checkbox = form.getCheckBox('2 IS IN EXCESS OF ITS MECHANICAL LIMITS');
    checkbox?.check();
  } else if (data.odometer_status === 'not_actual') {
    const checkbox = form.getCheckBox('3 IS NOT THE ACTUAL MILEAGE');
    checkbox?.check();
  }

  // Seller information
  fillTextField(form, 'Sellers Printed Name', data.seller_printed_name);
  fillTextField(form, 'Sellers Address City State Zip Code', data.seller_address_florida);
  fillTextField(form, 'Date', formatDate(data.sale_date));

  // Co-seller (if applicable)
  if (data.has_coseller && data.coseller_printed_name) {
    fillTextField(form, 'CoSellers Printed Name when applicable', data.coseller_printed_name);
    fillTextField(form, 'CoSellers Address when applicable City State Zip Code', data.coseller_address);
    fillTextField(form, 'Date_2', formatDate(data.sale_date));
  }

  // Purchaser signatures
  fillTextField(form, 'Purchasers Printed Name', data.purchaser_printed_name);
  fillTextField(form, 'Date_3', formatDate(data.sale_date));

  if (data.has_copurchaser && data.copurchaser_printed_name) {
    fillTextField(form, 'CoPurchasers Printed name when applicable', data.copurchaser_printed_name);
    fillTextField(form, 'Date_4', formatDate(data.sale_date));
  }

  // Affidavit (if applicable)
  if (data.affidavit_needed) {
    fillTextField(form, 'Affidavit When applicableRow1', data.affidavit_text_row1);
    fillTextField(form, 'Affidavit When applicableRow2', data.affidavit_text_row2);
  }
}

async function fillColoradoForm(form: PDFForm, data: StateFormData): Promise<void> {
  // Colorado DR-2116 specific form filling (numbered fields)

  fillTextField(form, '1', data.vehicle_year?.toString());
  fillTextField(form, '2', data.vehicle_make);
  fillTextField(form, '3', data.vehicle_model);
  fillTextField(form, '4', data.vehicle_body_style);
  fillTextField(form, '5', data.vehicle_vin);
  fillTextField(form, '6', data.vehicle_color);
  fillTextField(form, '7', data.seller_name);
  fillTextField(form, '8', data.seller_address);
  fillTextField(form, '9', data.seller_phone);
  fillTextField(form, '10', data.buyer_name);
  fillTextField(form, '11', data.buyer_address);
  fillTextField(form, '12', data.buyer_phone);
  fillTextField(form, '13', data.sale_price?.toString());
  fillTextField(form, '14', formatDate(data.sale_date));
  fillTextField(form, '15', data.odometer_reading?.toString());
  fillTextField(form, '16', data.odometer_brand);

  if (data.has_lienholder) {
    fillTextField(form, '17', data.lienholder_name);
    fillTextField(form, '18', data.lienholder_address);
  }

  fillTextField(form, '19', data.title_number);
  fillTextField(form, '20', data.notary_county);
  fillTextField(form, '21', formatDate(data.notary_date));

  // Handle purged record radio button
  if (data.purged_record) {
    try {
      const radioGroup = form.getRadioGroup('Purged Colorado Record');
      const options = radioGroup.getOptions();
      if (options.length > 0) {
        radioGroup.select(options[0]); // Select first option
      }
    } catch (error) {
      console.warn('Could not set purged record option:', error);
    }
  }
}

async function fillGenericStateForm(form: PDFForm, data: StateFormData): Promise<void> {
  // Generic form filling for states we haven't specifically mapped yet
  const fields = form.getFields();

  fields.forEach(field => {
    const fieldName = field.getName().toLowerCase();

    // Try to match common field patterns
    if (fieldName.includes('year')) {
      fillTextField(form, field.getName(), data.vehicle_year?.toString());
    } else if (fieldName.includes('make')) {
      fillTextField(form, field.getName(), data.vehicle_make || data.make);
    } else if (fieldName.includes('model')) {
      fillTextField(form, field.getName(), data.vehicle_model || data.model);
    } else if (fieldName.includes('vin')) {
      fillTextField(form, field.getName(), data.vehicle_vin || data.vin);
    } else if (fieldName.includes('seller') && fieldName.includes('name')) {
      fillTextField(form, field.getName(), data.seller_name);
    } else if (fieldName.includes('buyer') && fieldName.includes('name')) {
      fillTextField(form, field.getName(), data.buyer_name);
    } else if (fieldName.includes('price')) {
      fillTextField(form, field.getName(), data.sale_price?.toString() || data.price?.toString());
    } else if (fieldName.includes('date')) {
      fillTextField(form, field.getName(), formatDate(data.sale_date));
    } else if (fieldName.includes('odometer')) {
      fillTextField(form, field.getName(), data.odometer_reading?.toString() || data.odometer?.toString());
    }
  });
}

function fillTextField(form: PDFForm, fieldName: string, value: string | undefined): void {
  if (!value) return;

  try {
    const field = form.getTextField(fieldName);
    field.setText(value);
  } catch (error) {
    // Field might not exist or might be a different type
    console.warn(`Could not fill field "${fieldName}":`, error);
  }
}

function formatDate(date: Date | string | undefined): string {
  if (!date) return '';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return date.toString();
  }
}

// Add all the state-specific form filling functions
async function fillAlabamaForm(form: PDFForm, data: StateFormData): Promise<void> {
  // Alabama MVT 32-13B - uses Text1, Text2, etc. fields
  Object.entries(alabamaFieldMapping).forEach(([pdfField, dataField]) => {
    if (pdfField.includes('Check Box')) {
      // Handle checkboxes
      if (data[dataField]) {
        try {
          const checkbox = form.getCheckBox(pdfField);
          checkbox?.check();
        } catch (error) {
          console.warn(`Could not check box "${pdfField}":`, error);
        }
      }
    } else {
      // Handle text fields
      const value = data[dataField];
      if (value !== undefined) {
        fillTextField(form, pdfField, typeof value === 'object' && value instanceof Date ? formatDate(value) : String(value));
      }
    }
  });
}

async function fillGeorgiaForm(form: PDFForm, data: StateFormData): Promise<void> {
  // Georgia T-7 form filling
  Object.entries(georgiaFieldMapping).forEach(([pdfField, dataField]) => {
    const value = data[dataField];
    if (value !== undefined) {
      fillTextField(form, pdfField, typeof value === 'object' && value instanceof Date ? formatDate(value) : String(value));
    }
  });
}

async function fillIdahoForm(form: PDFForm, data: StateFormData): Promise<void> {
  // Idaho ITD-3738 specific form filling
  Object.entries(idahoFieldMapping).forEach(([pdfField, dataField]) => {
    if (pdfField.includes('Actual Miles') || pdfField.includes('Not Actual') || pdfField.includes('Exceeds') || pdfField.includes('Exempt') || pdfField.includes('No Odometer')) {
      // Handle odometer status checkboxes
      const odometerStatus = data.odometer_status;
      if ((pdfField.includes('Actual Miles') && odometerStatus === 'actual') ||
          (pdfField.includes('Not Actual') && odometerStatus === 'not_actual') ||
          (pdfField.includes('Exceeds') && odometerStatus === 'exceeds') ||
          (pdfField.includes('Exempt') && odometerStatus === 'exempt') ||
          (pdfField.includes('No Odometer') && odometerStatus === 'no_odometer')) {
        try {
          const checkbox = form.getCheckBox(pdfField);
          checkbox?.check();
        } catch (error) {
          console.warn(`Could not check box "${pdfField}":`, error);
        }
      }
    } else if (pdfField.includes('Rebuilt') || pdfField.includes('Previous') || pdfField.includes('Reconstruct') || pdfField.includes('Repaired')) {
      // Handle brand status checkboxes
      const brandStatus = data.vehicle_brand_status;
      if ((pdfField.includes('Rebuilt') && brandStatus === 'rebuilt_salvage') ||
          (pdfField.includes('Previous') && brandStatus === 'previous_brand') ||
          (pdfField.includes('Reconstruct') && brandStatus === 'reconstruct') ||
          (pdfField.includes('Repaired') && brandStatus === 'repaired')) {
        try {
          const checkbox = form.getCheckBox(pdfField);
          checkbox?.check();
        } catch (error) {
          console.warn(`Could not check box "${pdfField}":`, error);
        }
      }
    } else {
      // Handle text fields
      const value = data[dataField];
      if (value !== undefined) {
        fillTextField(form, pdfField, typeof value === 'object' && value instanceof Date ? formatDate(value) : String(value));
      }
    }
  });
}

async function fillKansasForm(form: PDFForm, data: StateFormData): Promise<void> {
  // Kansas TR-312 form filling
  Object.entries(kansasFieldMapping).forEach(([pdfField, dataField]) => {
    const value = data[dataField];
    if (value !== undefined) {
      fillTextField(form, pdfField, typeof value === 'object' && value instanceof Date ? formatDate(value) : String(value));
    }
  });
}

async function fillMarylandForm(form: PDFForm, data: StateFormData): Promise<void> {
  // Maryland VR-181 form filling
  Object.entries(marylandFieldMapping).forEach(([pdfField, dataField]) => {
    const value = data[dataField];
    if (value !== undefined) {
      fillTextField(form, pdfField, typeof value === 'object' && value instanceof Date ? formatDate(value) : String(value));
    }
  });
}

async function fillMontanaForm(form: PDFForm, data: StateFormData): Promise<void> {
  // Montana MV-24 form filling
  Object.entries(montanaFieldMapping).forEach(([pdfField, dataField]) => {
    const value = data[dataField];
    if (value !== undefined) {
      fillTextField(form, pdfField, typeof value === 'object' && value instanceof Date ? formatDate(value) : String(value));
    }
  });
}

async function fillNorthDakotaForm(form: PDFForm, data: StateFormData): Promise<void> {
  // North Dakota SFN-2888 form filling
  Object.entries(northDakotaFieldMapping).forEach(([pdfField, dataField]) => {
    const value = data[dataField];
    if (value !== undefined) {
      fillTextField(form, pdfField, typeof value === 'object' && value instanceof Date ? formatDate(value) : String(value));
    }
  });
}

async function fillWestVirginiaForm(form: PDFForm, data: StateFormData): Promise<void> {
  // West Virginia DMV-7-TR form filling
  Object.entries(westVirginiaFieldMapping).forEach(([pdfField, dataField]) => {
    const value = data[dataField];
    if (value !== undefined) {
      fillTextField(form, pdfField, typeof value === 'object' && value instanceof Date ? formatDate(value) : String(value));
    }
  });
}

export { fillTextField, formatDate };