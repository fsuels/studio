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
      x: 120,
      y: 680,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'seller_address',
      x: 120,
      y: 660,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'seller_city',
      x: 120,
      y: 640,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'seller_state',
      x: 300,
      y: 640,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'seller_zip',
      x: 400,
      y: 640,
      fontSize: 10,
      page: 0
    },
    
    // Buyer Information Section
    {
      fieldId: 'buyer_name',
      x: 120,
      y: 580,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'buyer_address',
      x: 120,
      y: 560,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'buyer_city',
      x: 120,
      y: 540,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'buyer_state',
      x: 300,
      y: 540,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'buyer_zip',
      x: 400,
      y: 540,
      fontSize: 10,
      page: 0
    },
    
    // Vehicle Information Section
    {
      fieldId: 'year',
      x: 120,
      y: 480,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'make',
      x: 200,
      y: 480,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'model',
      x: 300,
      y: 480,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'vin',
      x: 120,
      y: 460,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'color',
      x: 120,
      y: 440,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'odometer',
      x: 300,
      y: 440,
      fontSize: 10,
      page: 0
    },
    
    // Sale Information
    {
      fieldId: 'price',
      x: 120,
      y: 380,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'sale_date',
      x: 300,
      y: 380,
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