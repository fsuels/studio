// Idaho ITD 3738 - Bill of Sale for Motor Vehicle
// Idaho Transportation Department official form

import { StateFormOverlay } from '@/lib/pdf/pdf-overlay-service';

export const idahoOverlay: StateFormOverlay = {
  state: 'ID',
  formName: 'ITD 3738',
  fieldMappings: [
    // Seller Information
    {
      fieldId: 'seller_name',
      x: 130,
      y: 700,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'seller_address',
      x: 130,
      y: 680,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'seller_city',
      x: 130,
      y: 660,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'seller_state',
      x: 320,
      y: 660,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'seller_zip',
      x: 420,
      y: 660,
      fontSize: 10,
      page: 0
    },
    
    // Buyer Information
    {
      fieldId: 'buyer_name',
      x: 130,
      y: 600,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'buyer_address',
      x: 130,
      y: 580,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'buyer_city',
      x: 130,
      y: 560,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'buyer_state',
      x: 320,
      y: 560,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'buyer_zip',
      x: 420,
      y: 560,
      fontSize: 10,
      page: 0
    },
    
    // Vehicle Information
    {
      fieldId: 'year',
      x: 100,
      y: 500,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'make',
      x: 200,
      y: 500,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'model',
      x: 320,
      y: 500,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'vin',
      x: 130,
      y: 480,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'color',
      x: 130,
      y: 460,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'odometer',
      x: 320,
      y: 460,
      fontSize: 10,
      page: 0
    },
    
    // Sale Information
    {
      fieldId: 'price',
      x: 130,
      y: 400,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'sale_date',
      x: 320,
      y: 400,
      fontSize: 10,
      page: 0
    }
  ]
};

export const idahoFieldMapping = {
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