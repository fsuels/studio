// Georgia T-7 - Certificate of Title Application
// Official Georgia Department of Revenue Motor Vehicle Division form

import { StateFormOverlay } from '@/lib/pdf/pdf-overlay-service';

export const georgiaOverlay: StateFormOverlay = {
  state: 'GA',
  formName: 'T-7',
  fieldMappings: [
    // Owner/Seller Information
    {
      fieldId: 'seller_name',
      x: 150,
      y: 720,
      fontSize: 9,
      page: 0
    },
    {
      fieldId: 'seller_address',
      x: 150,
      y: 700,
      fontSize: 9,
      page: 0
    },
    {
      fieldId: 'seller_city',
      x: 150,
      y: 680,
      fontSize: 9,
      page: 0
    },
    {
      fieldId: 'seller_state',
      x: 350,
      y: 680,
      fontSize: 9,
      page: 0
    },
    {
      fieldId: 'seller_zip',
      x: 450,
      y: 680,
      fontSize: 9,
      page: 0
    },
    
    // Buyer/New Owner Information
    {
      fieldId: 'buyer_name',
      x: 150,
      y: 620,
      fontSize: 9,
      page: 0
    },
    {
      fieldId: 'buyer_address',
      x: 150,
      y: 600,
      fontSize: 9,
      page: 0
    },
    {
      fieldId: 'buyer_city',
      x: 150,
      y: 580,
      fontSize: 9,
      page: 0
    },
    {
      fieldId: 'buyer_state',
      x: 350,
      y: 580,
      fontSize: 9,
      page: 0
    },
    {
      fieldId: 'buyer_zip',
      x: 450,
      y: 580,
      fontSize: 9,
      page: 0
    },
    
    // Vehicle Information
    {
      fieldId: 'year',
      x: 100,
      y: 520,
      fontSize: 9,
      page: 0
    },
    {
      fieldId: 'make',
      x: 200,
      y: 520,
      fontSize: 9,
      page: 0
    },
    {
      fieldId: 'model',
      x: 320,
      y: 520,
      fontSize: 9,
      page: 0
    },
    {
      fieldId: 'vin',
      x: 150,
      y: 500,
      fontSize: 9,
      page: 0
    },
    {
      fieldId: 'color',
      x: 150,
      y: 480,
      fontSize: 9,
      page: 0
    },
    {
      fieldId: 'odometer',
      x: 300,
      y: 480,
      fontSize: 9,
      page: 0
    },
    
    // Sale Information
    {
      fieldId: 'price',
      x: 150,
      y: 420,
      fontSize: 9,
      page: 0
    },
    {
      fieldId: 'sale_date',
      x: 350,
      y: 420,
      fontSize: 9,
      page: 0
    }
  ]
};

export const georgiaFieldMapping = {
  seller_name: ['seller_name', 'seller', 'owner_name', 'current_owner'],
  seller_address: ['seller_address', 'owner_address', 'current_address'],
  seller_city: ['seller_city', 'owner_city'],
  seller_state: ['seller_state', 'owner_state'],
  seller_zip: ['seller_zip', 'owner_zip'],
  
  buyer_name: ['buyer_name', 'buyer', 'new_owner', 'applicant_name'],
  buyer_address: ['buyer_address', 'new_owner_address', 'applicant_address'],
  buyer_city: ['buyer_city', 'new_owner_city', 'applicant_city'],
  buyer_state: ['buyer_state', 'new_owner_state', 'applicant_state'],
  buyer_zip: ['buyer_zip', 'new_owner_zip', 'applicant_zip'],
  
  year: ['year', 'model_year', 'yr'],
  make: ['make', 'manufacturer'],
  model: ['model', 'vehicle_model'],
  vin: ['vin', 'vehicle_id', 'serial_number'],
  color: ['color', 'vehicle_color'],
  odometer: ['odometer', 'mileage', 'miles'],
  
  price: ['price', 'sale_price', 'purchase_price'],
  sale_date: ['date', 'sale_date', 'date_of_sale']
};