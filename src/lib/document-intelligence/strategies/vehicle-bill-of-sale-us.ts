import { DocumentStrategy, FormSection } from '../types';

/**
 * VEHICLE BILL OF SALE - US STRATEGIES
 * 
 * This file contains optimized strategies for every US state,
 * handling both states with official forms and states using custom templates.
 */

// Base question flow for vehicle bill of sale
const baseVehicleBillOfSaleFlow: FormSection[] = [
  {
    id: 'jurisdiction_selection',
    title: {
      en: 'Location & Legal Requirements',
      es: 'Ubicación y Requisitos Legales'
    },
    description: {
      en: 'Select your state to ensure compliance with local laws',
      es: 'Selecciona tu estado para cumplir con las leyes locales'
    },
    order: 1,
    icon: 'MapPin',
    fields: [
      {
        id: 'state',
        type: 'select',
        label: {
          en: 'State of Sale (Governing Law & Notary)',
          es: 'Estado de Venta (Ley Aplicable y Notario)'
        },
        required: true,
        options: [
          { value: 'AL', label: { en: 'Alabama', es: 'Alabama' } },
          { value: 'AK', label: { en: 'Alaska', es: 'Alaska' } },
          { value: 'AZ', label: { en: 'Arizona', es: 'Arizona' } },
          { value: 'AR', label: { en: 'Arkansas', es: 'Arkansas' } },
          { value: 'CA', label: { en: 'California', es: 'California' } },
          { value: 'CO', label: { en: 'Colorado', es: 'Colorado' } },
          { value: 'CT', label: { en: 'Connecticut', es: 'Connecticut' } },
          { value: 'DE', label: { en: 'Delaware', es: 'Delaware' } },
          { value: 'FL', label: { en: 'Florida', es: 'Florida' } },
          { value: 'GA', label: { en: 'Georgia', es: 'Georgia' } },
          { value: 'HI', label: { en: 'Hawaii', es: 'Hawái' } },
          { value: 'ID', label: { en: 'Idaho', es: 'Idaho' } },
          { value: 'IL', label: { en: 'Illinois', es: 'Illinois' } },
          { value: 'IN', label: { en: 'Indiana', es: 'Indiana' } },
          { value: 'IA', label: { en: 'Iowa', es: 'Iowa' } },
          { value: 'KS', label: { en: 'Kansas', es: 'Kansas' } },
          { value: 'KY', label: { en: 'Kentucky', es: 'Kentucky' } },
          { value: 'LA', label: { en: 'Louisiana', es: 'Luisiana' } },
          { value: 'ME', label: { en: 'Maine', es: 'Maine' } },
          { value: 'MD', label: { en: 'Maryland', es: 'Maryland' } },
          { value: 'MA', label: { en: 'Massachusetts', es: 'Massachusetts' } },
          { value: 'MI', label: { en: 'Michigan', es: 'Míchigan' } },
          { value: 'MN', label: { en: 'Minnesota', es: 'Minnesota' } },
          { value: 'MS', label: { en: 'Mississippi', es: 'Misisipi' } },
          { value: 'MO', label: { en: 'Missouri', es: 'Misuri' } },
          { value: 'MT', label: { en: 'Montana', es: 'Montana' } },
          { value: 'NE', label: { en: 'Nebraska', es: 'Nebraska' } },
          { value: 'NV', label: { en: 'Nevada', es: 'Nevada' } },
          { value: 'NH', label: { en: 'New Hampshire', es: 'Nuevo Hampshire' } },
          { value: 'NJ', label: { en: 'New Jersey', es: 'Nueva Jersey' } },
          { value: 'NM', label: { en: 'New Mexico', es: 'Nuevo México' } },
          { value: 'NY', label: { en: 'New York', es: 'Nueva York' } },
          { value: 'NC', label: { en: 'North Carolina', es: 'Carolina del Norte' } },
          { value: 'ND', label: { en: 'North Dakota', es: 'Dakota del Norte' } },
          { value: 'OH', label: { en: 'Ohio', es: 'Ohio' } },
          { value: 'OK', label: { en: 'Oklahoma', es: 'Oklahoma' } },
          { value: 'OR', label: { en: 'Oregon', es: 'Oregón' } },
          { value: 'PA', label: { en: 'Pennsylvania', es: 'Pensilvania' } },
          { value: 'RI', label: { en: 'Rhode Island', es: 'Rhode Island' } },
          { value: 'SC', label: { en: 'South Carolina', es: 'Carolina del Sur' } },
          { value: 'SD', label: { en: 'South Dakota', es: 'Dakota del Sur' } },
          { value: 'TN', label: { en: 'Tennessee', es: 'Tennessee' } },
          { value: 'TX', label: { en: 'Texas', es: 'Texas' } },
          { value: 'UT', label: { en: 'Utah', es: 'Utah' } },
          { value: 'VT', label: { en: 'Vermont', es: 'Vermont' } },
          { value: 'VA', label: { en: 'Virginia', es: 'Virginia' } },
          { value: 'WA', label: { en: 'Washington', es: 'Washington' } },
          { value: 'WV', label: { en: 'West Virginia', es: 'Virginia Occidental' } },
          { value: 'WI', label: { en: 'Wisconsin', es: 'Wisconsin' } },
          { value: 'WY', label: { en: 'Wyoming', es: 'Wyoming' } }
        ]
      }
    ]
  },
  {
    id: 'vehicle_information',
    title: {
      en: 'Vehicle Information',
      es: 'Información del Vehículo'
    },
    order: 2,
    icon: 'Car',
    fields: [
      {
        id: 'year',
        type: 'number',
        label: {
          en: 'Year',
          es: 'Año'
        },
        required: true,
        validation: { min: 1900, max: new Date().getFullYear() + 1 }
      },
      {
        id: 'make',
        type: 'text',
        label: {
          en: 'Make',
          es: 'Marca'
        },
        required: true
      },
      {
        id: 'model',
        type: 'text',
        label: {
          en: 'Model',
          es: 'Modelo'
        },
        required: true
      },
      {
        id: 'vin',
        type: 'text',
        label: {
          en: 'VIN (Vehicle Identification Number)',
          es: 'VIN (Número de Identificación del Vehículo)'
        },
        required: true,
        validation: { pattern: '^[A-HJ-NPR-Z0-9]{17}$' }
      },
      {
        id: 'odometer',
        type: 'number',
        label: {
          en: 'Odometer Reading (Miles)',
          es: 'Lectura del Odometro (Millas)'
        },
        required: true,
        validation: { min: 0 }
      },
      {
        id: 'odo_status',
        type: 'select',
        label: {
          en: 'Odometer Status',
          es: 'Estado del Odometro'
        },
        required: true,
        options: [
          { value: 'ACTUAL', label: { en: 'Actual Mileage', es: 'Millaje real' } },
          { value: 'EXCEEDS', label: { en: 'Exceeds Mechanical Limits', es: 'Excede limites mecanicos' } },
          { value: 'NOT_ACTUAL', label: { en: 'Not Actual Mileage (Warning)', es: 'Millaje no real (advertencia)' } }
        ]
      }
  },
  {
    id: 'seller_information',
    title: {
      en: 'Seller Information',
      es: 'Información del Vendedor'
    },
    order: 3,
    icon: 'UserCheck',
    fields: [
      {
        id: 'seller_name',
        type: 'text',
        label: {
          en: 'Full Legal Name',
          es: 'Nombre Legal Completo'
        },
        required: true
      },
      {
        id: 'seller_address',
        type: 'textarea',
        label: {
          en: 'Complete Address',
          es: 'Dirección Completa'
        },
        required: true
      },
      {
        id: 'seller_phone',
        type: 'phone',
        label: {
          en: 'Phone Number',
          es: 'Número de Teléfono'
        },
        required: false
      }
    ]
  },
  {
    id: 'buyer_information',
    title: {
      en: 'Buyer Information',
      es: 'Información del Comprador'
    },
    order: 4,
    icon: 'UserPlus',
    fields: [
      {
        id: 'buyer_name',
        type: 'text',
        label: {
          en: 'Full Legal Name',
          es: 'Nombre Legal Completo'
        },
        required: true
      },
      {
        id: 'buyer_address',
        type: 'textarea',
        label: {
          en: 'Complete Address',
          es: 'Dirección Completa'
        },
        required: true
      },
      {
        id: 'buyer_phone',
        type: 'phone',
        label: {
          en: 'Phone Number',
          es: 'Número de Teléfono'
        },
        required: false
      }
    ]
  },
  {
    id: 'transaction_details',
    title: {
      en: 'Sale Details',
      es: 'Detalles de la Venta'
    },
    order: 5,
    icon: 'DollarSign',
    fields: [
      {
        id: 'price',
        type: 'number',
        label: {
          en: 'Sale Price ($)',
          es: 'Precio de Venta ($)'
        },
        required: true,
        validation: { min: 0 }
      },
      {
        id: 'sale_date',
        type: 'date',
        label: {
          en: 'Date of Sale',
          es: 'Fecha de Venta'
        },
        required: true
      },
      {
        id: 'payment_method',
        type: 'select',
        label: {
          en: 'Payment Method',
          es: 'Metodo de Pago'
        },
        required: false,
        options: [
          { value: 'cash', label: { en: 'Cash', es: 'Efectivo' } },
          { value: 'check', label: { en: 'Check', es: 'Cheque' } },
          { value: 'wire', label: { en: 'Wire Transfer', es: 'Transferencia bancaria' } },
          { value: 'paypal', label: { en: 'PayPal', es: 'PayPal' } },
          { value: 'credit_card', label: { en: 'Credit or Debit Card', es: 'Tarjeta de credito o debito' } }
        ]
      },
      {
        id: 'existing_liens',
        type: 'textarea',
        label: {
          en: 'Existing Liens or Encumbrances',
          es: 'Gravamenes o cargas existentes'
        },
        required: false,
        placeholder: {
          en: 'e.g., None or Loan with XYZ Bank',
          es: 'ej., Ninguno o Prestamo con Banco XYZ'
        }
      }
    ]
  },
  {
    id: 'condition_and_warranty',
    title: {
      en: 'Condition and Warranty',
      es: 'Condicion y Garantia'
    },
    order: 6,
    icon: 'ShieldCheck',
    fields: [
      {
        id: 'as_is',
        type: 'checkbox',
        label: {
          en: 'Vehicle is sold as-is (no warranties)',
          es: 'Vehiculo vendido en el estado en que se encuentra (sin garantias)'
        },
        required: false
      },
      {
        id: 'warranty_text',
        type: 'textarea',
        label: {
          en: 'Warranty Details (if provided)',
          es: 'Detalles de garantia (si aplica)'
        },
        required: false,
        placeholder: {
          en: 'Describe any warranty coverage or limitations',
          es: 'Describa la cobertura o limites de la garantia'
        },
        conditionalLogic: {
          showIf: {
            field: 'as_is',
            value: false
          }
        }
      }
    ]
  },
  {
    id: 'notary_details',
    title: {
      en: 'Notary Details',
      es: 'Detalles de notario'
    },
    order: 7,
    icon: 'Feather',
    fields: [
      {
        id: 'county',
        type: 'text',
        label: {
          en: 'County for notarization',
          es: 'Condado para notarizacion'
        },
        required: false
      }
    ]
  }
];

// States with mandatory official forms
const STATES_WITH_OFFICIAL_FORMS = ['AL', 'CO', 'FL', 'GA', 'ID', 'KS', 'MD', 'MT', 'ND', 'WV'];

/**
 * FLORIDA-SPECIFIC STRATEGY (HSMV-82050 Form)
 */
export const floridaVehicleBillOfSaleStrategy: DocumentStrategy = {
  id: 'vehicle-bill-of-sale-us-fl-en',
  documentType: 'vehicle-bill-of-sale',
  jurisdiction: 'US',
  subJurisdiction: 'FL',
  language: 'en',
  formType: 'official-form',
  
  officialFormPath: '/forms/vehicle-bill-of-sale/florida/HSMV-82050.pdf',
  
  // Optimized question flow for Florida form
  questionFlow: [
    baseVehicleBillOfSaleFlow[0], // jurisdiction_selection
    baseVehicleBillOfSaleFlow[1], // vehicle_information (Florida form starts here)
    baseVehicleBillOfSaleFlow[2], // seller_information
    baseVehicleBillOfSaleFlow[3], // buyer_information
    baseVehicleBillOfSaleFlow[4], // transaction_details
    baseVehicleBillOfSaleFlow[5], // condition_and_warranty
    baseVehicleBillOfSaleFlow[6], // notary_details
    {
      id: 'florida_specific_odometer',
      title: {
        en: 'Odometer Disclosure (Required by Florida Law)',
        es: 'Declaración del Odómetro (Requerido por la Ley de Florida)'
      },
      order: 6,
      icon: 'Gauge',
      fields: [
        {
          id: 'odometer_accurate',
          type: 'checkbox',
          label: {
            en: 'I certify that the odometer reading is accurate',
            es: 'Certifico que la lectura del odómetro es precisa'
          },
          required: true
        },
        {
          id: 'odometer_discrepancy',
          type: 'select',
          label: {
            en: 'Odometer Status',
            es: 'Estado del Odómetro'
          },
          required: true,
          options: [
            { value: 'actual', label: { en: 'Actual mileage', es: 'Millaje real' } },
            { value: 'not_actual', label: { en: 'NOT actual mileage', es: 'NO es millaje real' } },
            { value: 'exceeds_limit', label: { en: 'Exceeds mechanical limits', es: 'Excede límites mecánicos' } }
          ]
        }
      ]
    },
    {
      id: 'notary_acknowledgment',
      title: {
        en: 'Notary Acknowledgment (Required in Florida)',
        es: 'Reconocimiento Notarial (Requerido en Florida)'
      },
      order: 7,
      icon: 'Shield',
      fields: [
        {
          id: 'notary_required',
          type: 'checkbox',
          label: {
            en: 'I understand this document must be notarized to be valid in Florida',
            es: 'Entiendo que este documento debe ser notarizado para ser válido en Florida'
          },
          required: true
        }
      ]
    }
  ],
  
  fieldMappings: {
    'year': { pdfField: 'year_field' },
    'make': { pdfField: 'make_field' },
    'model': { pdfField: 'model_field' },
    'vin': { pdfField: 'vin_field' },
    'odometer': { pdfField: 'odometer_field' },
    'seller_name': { pdfField: 'seller_name_field' },
    'seller_address': { pdfField: 'seller_address_field' },
    'buyer_name': { pdfField: 'buyer_name_field' },
    'buyer_address': { pdfField: 'buyer_address_field' },
    'price': { 
      pdfField: 'sale_price_field',
      transform: (value) => `$${value.toLocaleString()}`
    },
    'sale_date': { 
      pdfField: 'sale_date_field',
      transform: (value) => new Date(value).toLocaleDateString()
    }
  },
  
  pricing: {
    basePrice: 19.95,
    currency: 'USD',
    priceBreakdown: [
      {
        component: 'florida_official_form',
        price: 15.95,
        description: {
          en: 'Florida HSMV-82050 Official Form',
          es: 'Formulario Oficial HSMV-82050 de Florida'
        }
      },
      {
        component: 'smart_completion',
        price: 4.00,
        description: {
          en: 'Smart Form Completion & Validation',
          es: 'Completado Inteligente y Validación del Formulario'
        }
      }
    ]
  },
  
  compliance: {
    requiresNotary: true,
    requiresWitness: false,
    requiresRecording: false,
    specialRequirements: [
      {
        type: 'odometer_disclosure',
        description: {
          en: 'Federal and Florida law requires accurate odometer disclosure',
          es: 'La ley federal y de Florida requiere declaración precisa del odómetro'
        }
      }
    ]
  },
  
  monetization: {
    allowPreview: true,
    previewLimitations: [
      'watermark_overlay',
      'no_download_until_payment',
      'limited_to_first_page'
    ],
    paymentRequired: 'before_download',
    trialMode: {
      allowedActions: ['preview', 'form_completion', 'validation'],
      limitations: ['no_download', 'watermarked_preview']
    }
  }
};

/**
 * GENERIC US STRATEGY (Custom Template)
 * Used for states without official forms
 */
export const genericUSVehicleBillOfSaleStrategy: DocumentStrategy = {
  id: 'vehicle-bill-of-sale-us-generic-en',
  documentType: 'vehicle-bill-of-sale',
  jurisdiction: 'US',
  language: 'en',
  formType: 'custom-template',
  
  templatePath: '/templates/en/vehicle-bill-of-sale.md',
  questionFlow: baseVehicleBillOfSaleFlow,
  
  pricing: {
    basePrice: 14.95,
    currency: 'USD',
    priceBreakdown: [
      {
        component: 'custom_template',
        price: 10.95,
        description: {
          en: 'Professional Vehicle Bill of Sale Template',
          es: 'Plantilla Profesional de Contrato de Compraventa de Vehículo'
        }
      },
      {
        component: 'smart_completion',
        price: 4.00,
        description: {
          en: 'Smart Form Completion & Legal Validation',
          es: 'Completado Inteligente y Validación Legal'
        }
      }
    ]
  },
  
  compliance: {
    requiresNotary: false, // Varies by state, handled in compliance rules
    requiresWitness: false,
    requiresRecording: false
  },
  
  monetization: {
    allowPreview: true,
    previewLimitations: [
      'watermark_overlay',
      'no_download_until_payment'
    ],
    paymentRequired: 'before_download',
    trialMode: {
      allowedActions: ['preview', 'form_completion', 'validation'],
      limitations: ['no_download', 'watermarked_preview']
    }
  }
};

/**
 * STRATEGY FACTORY
 * Automatically generates strategies for all US states
 */
export function generateUSVehicleBillOfSaleStrategies(): DocumentStrategy[] {
  const strategies: DocumentStrategy[] = [];
  
  // Add generic strategy
  strategies.push(genericUSVehicleBillOfSaleStrategy);
  
  // Add Florida strategy (example of official form)
  strategies.push(floridaVehicleBillOfSaleStrategy);
  
  // Generate strategies for other states with official forms
  STATES_WITH_OFFICIAL_FORMS.forEach(state => {
    if (state === 'FL') return; // Already added above
    
    const strategy: DocumentStrategy = {
      ...floridaVehicleBillOfSaleStrategy,
      id: `vehicle-bill-of-sale-us-${state.toLowerCase()}-en`,
      subJurisdiction: state,
      officialFormPath: `/forms/vehicle-bill-of-sale/${state.toLowerCase()}/${getOfficialFormName(state)}.pdf`,
      questionFlow: optimizeQuestionFlowForState(state, baseVehicleBillOfSaleFlow),
      compliance: {
        ...floridaVehicleBillOfSaleStrategy.compliance,
        requiresNotary: getNotaryRequirement(state)
      }
    };
    
    strategies.push(strategy);
  });
  
  return strategies;
}

function getOfficialFormName(state: string): string {
  const formNames: Record<string, string> = {
    'AL': 'MVT-32-13B',
    'CO': 'DR-2116',
    'FL': 'HSMV-82050',
    'GA': 'T-7',
    'ID': 'ITD-3738',
    'KS': 'TR-312',
    'MD': 'VR-181',
    'MT': 'MV-24',
    'ND': 'SFN-2888',
    'WV': 'DMV-7-TR'
  };
  
  return formNames[state] || 'bill-of-sale';
}

function getNotaryRequirement(state: string): boolean {
  const notaryStates = ['AL', 'CO', 'FL', 'GA', 'ID', 'KS', 'MD', 'MT', 'ND', 'WV'];
  return notaryStates.includes(state);
}

function optimizeQuestionFlowForState(state: string, baseFlow: FormSection[]): FormSection[] {
  // State-specific optimizations would go here
  // For now, return base flow with state-specific modifications
  return baseFlow.map(section => {
    if (section.id === 'notary_acknowledgment' && !getNotaryRequirement(state)) {
      return { ...section, fields: [] }; // Remove notary section for non-notary states
    }
    return section;
  });
}