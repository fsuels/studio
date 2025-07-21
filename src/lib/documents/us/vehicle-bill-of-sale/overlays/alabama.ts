// Alabama MVT 32-13B - Abandoned Motor Vehicle Bill of Sale
// Note: This is specifically for abandoned vehicles, not general vehicle sales

import { StateFormOverlay } from '@/lib/pdf/pdf-overlay-service';

export const alabamaOverlay: StateFormOverlay = {
  state: 'AL',
  formName: 'MVT 32-13B',
  fieldMappings: [
    // Seller/Towing Company Information
    {
      fieldId: 'seller_name',
      x: 150,
      y: 720,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'seller_address',
      x: 150,
      y: 700,
      fontSize: 10,
      page: 0
    },
    
    // Buyer Information
    {
      fieldId: 'buyer_name',
      x: 150,
      y: 650,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'buyer_address',
      x: 150,
      y: 630,
      fontSize: 10,
      page: 0
    },
    
    // Vehicle Information
    {
      fieldId: 'year',
      x: 100,
      y: 580,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'make',
      x: 200,
      y: 580,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'model',
      x: 320,
      y: 580,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'vin',
      x: 150,
      y: 560,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'color',
      x: 150,
      y: 540,
      fontSize: 10,
      page: 0
    },
    
    // Sale Information
    {
      fieldId: 'price',
      x: 150,
      y: 480,
      fontSize: 10,
      page: 0
    },
    {
      fieldId: 'sale_date',
      x: 300,
      y: 480,
      fontSize: 10,
      page: 0
    }
  ]
};

export const alabamaFieldMapping = {
  seller_name: ['seller_name', 'seller', 'towing_company', 'company_name'],
  seller_address: ['seller_address', 'company_address', 'towing_address'],
  
  buyer_name: ['buyer_name', 'buyer', 'purchaser_name'],
  buyer_address: ['buyer_address', 'purchaser_address'],
  
  year: ['year', 'model_year', 'yr'],
  make: ['make', 'manufacturer'],
  model: ['model', 'vehicle_model'],
  vin: ['vin', 'vehicle_id', 'serial_number'],
  color: ['color', 'vehicle_color'],
  
  price: ['price', 'sale_price', 'amount'],
  sale_date: ['date', 'sale_date', 'date_of_sale']
};