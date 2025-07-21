import type { OverlayConfig } from '@/types/documents';

export const genericVehicleBillOfSaleOverlay: OverlayConfig = {
  fields: [
    // Seller information
    {
      id: 'seller_name',
      type: 'text',
      coordinates: { x: 200, y: 550, width: 300, height: 20 },
      fallbackNames: ['seller', 'sellerName', 'from']
    },
    
    // Buyer information
    {
      id: 'buyer_name',
      type: 'text',
      coordinates: { x: 200, y: 530, width: 300, height: 20 },
      fallbackNames: ['buyer', 'buyerName', 'to']
    },
    
    // Vehicle information
    {
      id: 'year',
      type: 'text',
      coordinates: { x: 100, y: 510, width: 60, height: 20 },
      fallbackNames: ['vehicle_year', 'vehicleYear', 'year']
    },
    {
      id: 'make',
      type: 'text',
      coordinates: { x: 170, y: 510, width: 80, height: 20 },
      fallbackNames: ['vehicle_make', 'vehicleMake', 'make']
    },
    {
      id: 'model',
      type: 'text',
      coordinates: { x: 260, y: 510, width: 100, height: 20 },
      fallbackNames: ['vehicle_model', 'vehicleModel', 'model']
    },
    
    // VIN
    {
      id: 'vin',
      type: 'text',
      coordinates: { x: 150, y: 490, width: 350, height: 20 },
      fallbackNames: ['vehicle_vin', 'vehicleVIN', 'vin']
    },
    
    // Price
    {
      id: 'price',
      type: 'text',
      coordinates: { x: 150, y: 470, width: 200, height: 20 },
      fallbackNames: ['sale_price', 'salePrice', 'price', 'amount']
    }
  ],
  defaultFont: 'Helvetica',
  defaultFontSize: 12
};

export default genericVehicleBillOfSaleOverlay;