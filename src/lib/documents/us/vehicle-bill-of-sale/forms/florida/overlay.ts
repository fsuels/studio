// Florida HSMV 82050 - Notice of Sale and/or Bill of Sale
// Official form URL: https://www.flhsmv.gov/pdf/forms/82050.pdf

import { StateFormOverlay } from '@/lib/pdf/pdf-overlay-service';

export const floridaOverlay: StateFormOverlay = {
  state: 'FL',
  formName: 'HSMV 82050',
  fieldMappings: [
    // Seller Information Section
    {
      fieldId: 'seller_name',
      x: 155,
      y: 618,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'seller_address',
      x: 155,
      y: 593,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'seller_city',
      x: 155,
      y: 568,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'seller_state',
      x: 285,
      y: 568,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'seller_zip',
      x: 335,
      y: 568,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'seller_phone',
      x: 425,
      y: 618,
      fontSize: 10,
      page: 0
    },
    
    // Buyer Information Section
    {
      fieldId: 'buyer_name',
      x: 155,
      y: 518,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'buyer_address',
      x: 155,
      y: 493,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'buyer_city',
      x: 155,
      y: 468,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'buyer_state',
      x: 285,
      y: 468,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'buyer_zip',
      x: 335,
      y: 468,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'buyer_phone',
      x: 425,
      y: 518,
      fontSize: 10,
      page: 0
    },
    
    // Vehicle Information Section
    {
      fieldId: 'year',
      x: 105,
      y: 418,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'make',
      x: 165,
      y: 418,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'model',
      x: 275,
      y: 418,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'vin',
      x: 385,
      y: 418,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'color',
      x: 105,
      y: 393,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'odometer',
      x: 195,
      y: 393,
      fontSize: 10,
      page: 0
    },
    
    // Sale Information
    {
      fieldId: 'price',
      x: 155,
      y: 343,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'sale_date',
      x: 385,
      y: 343,
      fontSize: 10,
      page: 0
    }
  ]
};

// Smart field mapping for form fields if PDF has fillable fields
export const floridaFieldMapping = {
  // These are common field names found in Florida HSMV forms
  seller_name: ['seller_name', 'seller', 'from_name', 'grantor_name'],
  seller_address: ['seller_address', 'seller_addr', 'from_address', 'grantor_address'],
  seller_city: ['seller_city', 'from_city', 'grantor_city'],
  seller_state: ['seller_state', 'from_state', 'grantor_state'],
  seller_zip: ['seller_zip', 'seller_zipcode', 'from_zip', 'grantor_zip'],
  
  buyer_name: ['buyer_name', 'buyer', 'to_name', 'grantee_name', 'purchaser_name'],
  buyer_address: ['buyer_address', 'buyer_addr', 'to_address', 'grantee_address', 'purchaser_address'],
  buyer_city: ['buyer_city', 'to_city', 'grantee_city', 'purchaser_city'],
  buyer_state: ['buyer_state', 'to_state', 'grantee_state', 'purchaser_state'],
  buyer_zip: ['buyer_zip', 'buyer_zipcode', 'to_zip', 'grantee_zip', 'purchaser_zip'],
  
  year: ['year', 'model_year', 'yr', 'vehicle_year'],
  make: ['make', 'manufacturer', 'vehicle_make'],
  model: ['model', 'vehicle_model'],
  vin: ['vin', 'vehicle_identification_number', 'serial_number'],
  color: ['color', 'colour', 'vehicle_color'],
  odometer: ['odometer', 'mileage', 'miles', 'odometer_reading'],
  
  price: ['price', 'sale_price', 'purchase_price', 'amount'],
  sale_date: ['date', 'sale_date', 'transaction_date', 'date_of_sale']
};