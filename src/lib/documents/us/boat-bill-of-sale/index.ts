// Boat Bill of Sale
import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required').optional(),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'Valid ZIP code required'),
  date: z.string().min(1, 'Date is required'),
});

export const boatBillOfSale: LegalDocument = {
  id: 'boat-bill-of-sale',
  name: 'Boat Bill of Sale',
  category: 'Transportation',
  schema,
  // Comprehensive search keywords for boat sales
  keywords: [
    // Primary marine terms
    'boat', 'boats', 'vessel', 'vessels', 'watercraft', 'marine', 'nautical',
    // Boat types
    'yacht', 'sailboat', 'motorboat', 'fishing boat', 'pontoon', 'jet ski', 'kayak', 'canoe',
    'speedboat', 'cabin cruiser', 'catamaran', 'trimaran', 'dinghy', 'skiff', 'trawler',
    // Actions
    'buy', 'buying', 'purchase', 'purchasing', 'sell', 'selling', 'sale', 'transfer',
    // Use cases
    'buying a boat', 'selling a boat', 'boat sale', 'vessel transfer', 'marine sale',
    'watercraft purchase', 'yacht sale', 'sailboat sale', 'used boat', 'new boat',
    // Legal terms
    'bill of sale', 'marine title', 'vessel registration', 'coast guard', 'hull number',
    'boat documentation', 'maritime law', 'admiralty', 'marine survey', 'sea trial',
    // Documentation
    'registration', 'title', 'certificate', 'hull id', 'state registration', 'federal documentation'
  ],
  keywords_es: [
    // Términos marinos primarios
    'barco', 'barcos', 'embarcación', 'embarcaciones', 'nave', 'naves', 'navío', 'marítimo',
    // Tipos de embarcaciones
    'yate', 'velero', 'lancha', 'bote de pesca', 'pontón', 'moto acuática', 'kayak', 'canoa',
    'lancha rápida', 'crucero', 'catamarán', 'trimarán', 'bote auxiliar', 'esquife', 'pesquero',
    // Acciones
    'comprar', 'comprando', 'compra', 'vender', 'vendiendo', 'venta', 'transferir',
    // Casos de uso
    'comprando un barco', 'vendiendo un barco', 'venta de barco', 'transferencia de embarcación',
    'venta marina', 'compra de embarcación', 'venta de yate', 'venta de velero', 'barco usado', 'barco nuevo',
    // Términos legales
    'contrato de compraventa', 'título marino', 'registro de embarcación', 'guardia costera',
    'número de casco', 'documentación de barco', 'ley marítima', 'almirantazgo', 'inspección marina',
    // Documentación
    'registro', 'título', 'certificado', 'identificación de casco', 'registro estatal', 'documentación federal'
  ],
  questions: [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      placeholder: 'Enter name...',
    },
    {
      id: 'email',
      label: 'Email',
      type: 'text',
      required: false,
      placeholder: 'Enter email...',
    },
    {
      id: 'address',
      label: 'Address',
      type: 'address',
      required: true,
      placeholder: 'Enter address...',
    },
    {
      id: 'city',
      label: 'City',
      type: 'text',
      required: true,
      placeholder: 'Enter city...',
    },
    {
      id: 'state',
      label: 'State',
      type: 'text',
      required: true,
      placeholder: 'Enter state...',
    },
    {
      id: 'zipCode',
      label: 'Zip Code',
      type: 'text',
      required: true,
      placeholder: 'Enter zip code...',
    },
    {
      id: 'date',
      label: 'Date',
      type: 'date',
      required: true,
      placeholder: 'Enter date...',
    },
  ],
  offerNotarization: true,
  states: 'all',
  complexity: 'medium',
  estimatedTime: '10-20 minutes',
  tags: ['transportation', 'medium', 'legal', 'template', 'notarization'],
  translations: {
    en: {
      name: 'Boat Bill of Sale',
      description:
        'Create a legally binding Boat Bill of Sale with our easy-to-use template. State-specific requirements included.',
      aliases: [],
    },
    es: {
      name: 'Contrato de Compraventa de Embarcación',
      description:
        'Crea un contrato de compraventa de embarcación legalmente válido con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.',
      aliases: ['venta de barco', 'compraventa de embarcación', 'contrato de venta marina'],
    },
  },
};
