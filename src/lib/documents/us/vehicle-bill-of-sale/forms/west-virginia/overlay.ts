// West Virginia DMV-7-TR - Bill of Sale for Motor Vehicle
// West Virginia Division of Motor Vehicles official form

import { StateFormOverlay } from '@/lib/pdf/pdf-overlay-service';

export const westVirginiaOverlay: StateFormOverlay = {
  state: 'WV',
  formName: 'DMV-7-TR',
  fieldMappings: [
    // Seller Information
    {
      fieldId: 'seller_name',
      x: 140,
      y: 710,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'seller_address',
      x: 140,
      y: 690,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'seller_city',
      x: 140,
      y: 670,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'seller_state',
      x: 330,
      y: 670,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'seller_zip',
      x: 430,
      y: 670,
      fontSize: 10,
      page: 0
    },
    
    // Buyer Information
    {
      fieldId: 'buyer_name',
      x: 140,
      y: 610,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'buyer_address',
      x: 140,
      y: 590,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'buyer_city',
      x: 140,
      y: 570,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'buyer_state',
      x: 330,
      y: 570,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'buyer_zip',
      x: 430,
      y: 570,
      fontSize: 10,
      page: 0
    },
    
    // Vehicle Information
    {
      fieldId: 'year',
      x: 110,
      y: 510,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'make',
      x: 210,
      y: 510,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'model',
      x: 330,
      y: 510,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'vin',
      x: 140,
      y: 490,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'color',
      x: 140,
      y: 470,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'odometer',
      x: 330,
      y: 470,
      fontSize: 10,
      page: 0
    },
    
    // Sale Information
    {
      fieldId: 'price',
      x: 140,
      y: 410,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'sale_date',
      x: 330,
      y: 410,
      fontSize: 10,
      page: 0
    }
  ]
};

export const westVirginiaFieldMapping = {
  seller_name: ['seller_name', 'seller', 'from_name'],
  seller_address: ['seller_address', 'from_address'],
  seller_city: ['seller_city', 'from_city'],
  seller_state: ['seller_state', 'from_state'],
  seller_zip: ['seller_zip', 'from_zip'],
  
  buyer_name: ['buyer_name', 'buyer', 'to_name', 'purchaser'],
  buyer_address: ['buyer_address', 'to_address', 'purchaser_address'],
  buyer_city: ['buyer_city', 'to_city', 'purchaser_city'],
  buyer_state: ['buyer_state', 'to_state', 'purchaser_state'],
  buyer_zip: ['buyer_zip', 'to_zip', 'purchaser_zip'],
  
  year: ['year', 'model_year', 'yr'],
  make: ['make', 'manufacturer'],
  model: ['model', 'vehicle_model'],
  vin: ['vin', 'vehicle_id', 'serial_number'],
  color: ['color', 'vehicle_color'],
  odometer: ['odometer', 'mileage', 'miles'],
  
  price: ['price', 'sale_price', 'purchase_price'],
  sale_date: ['date', 'sale_date', 'date_of_sale']
};