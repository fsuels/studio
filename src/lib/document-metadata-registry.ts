// Document metadata registry - lightweight document information without implementations
// This allows fast enumeration and search without loading heavy document code

export interface DocumentMetadata {
  id: string;
  title: string;
  description: string;
  category: string;
  jurisdiction: string;
  tags: string[];
  aliases: string[];
  requiresNotary?: boolean;
  officialForm?: boolean;
  states?: string[];
  estimatedTime?: string; // e.g., "5 minutes"
  complexity?: 'simple' | 'intermediate' | 'complex';
  isNew?: boolean;
  translations: {
    en: {
      name: string;
      description: string;
      aliases: string[];
    };
    es: {
      name: string;
      description: string;
      aliases: string[];
    };
  };
}

// Lightweight metadata for all documents - this can be imported safely
export const DOCUMENT_METADATA: Record<string, DocumentMetadata> = {
  'vehicle-bill-of-sale': {
    id: 'vehicle-bill-of-sale',
    title: 'Vehicle Bill of Sale',
    description: 'Legally compliant bill of sale for vehicle transactions in all 50 states',
    category: 'Automotive',
    jurisdiction: 'us',
    tags: ['vehicle', 'bill of sale', 'automotive', 'dmv', 'registration'],
    aliases: ['car bill of sale', 'auto bill of sale', 'vehicle sale agreement'],
    requiresNotary: false, // Varies by state
    officialForm: true, // Some states have official forms
    states: ['all'],
    estimatedTime: '5 minutes',
    complexity: 'simple',
    translations: {
      en: {
        name: 'Vehicle Bill of Sale',
        description: 'Generate a legally solid vehicle bill of sale in under 5 minutes. Free printable PDF, e-sign-ready, attorney-reviewed, and valid in all 50 states.',
        aliases: ['car bill of sale', 'auto bill of sale', 'vehicle sale agreement']
      },
      es: {
        name: 'Factura de Venta de Vehículo',
        description: 'Genere una factura de venta de vehículo legalmente sólida en menos de 5 minutos. PDF imprimible gratuito, listo para firmar electrónicamente, revisado por abogados y válido en los 50 estados.',
        aliases: ['factura de venta de carro', 'factura de venta de auto', 'contrato de venta de vehículo']
      }
    }
  },

  'basic-nda': {
    id: 'basic-nda',
    title: 'Basic Non-Disclosure Agreement',
    description: 'Professional NDA template with mutual/unilateral options and state-specific compliance',
    category: 'Business',
    jurisdiction: 'us',
    tags: ['nda', 'non-disclosure', 'confidentiality', 'business', 'legal'],
    aliases: ['confidentiality agreement', 'non disclosure agreement', 'secrecy agreement'],
    requiresNotary: false,
    officialForm: false,
    states: ['all'],
    estimatedTime: '10 minutes',
    complexity: 'intermediate',
    isNew: true,
    translations: {
      en: {
        name: 'Basic Non-Disclosure Agreement',
        description: 'Professional NDA template with mutual/unilateral options and state-specific compliance',
        aliases: ['confidentiality agreement', 'non disclosure agreement', 'secrecy agreement']
      },
      es: {
        name: 'Acuerdo Básico de No Divulgación',
        description: 'Plantilla profesional de NDA con opciones mutuas/unilaterales y cumplimiento específico por estado',
        aliases: ['acuerdo de confidencialidad', 'acuerdo de no divulgación', 'acuerdo de secreto']
      }
    }
  },

  'power-of-attorney': {
    id: 'power-of-attorney',
    title: 'Power of Attorney',
    description: 'State-specific power of attorney forms with automatic compliance checking',
    category: 'Legal',
    jurisdiction: 'us',
    tags: ['power of attorney', 'legal', 'authorization', 'agent', 'principal'],
    aliases: ['POA', 'attorney authorization', 'legal authorization'],
    requiresNotary: true,
    officialForm: true,
    states: ['colorado'], // Initially Colorado only
    estimatedTime: '15 minutes',
    complexity: 'complex',
    translations: {
      en: {
        name: 'Power of Attorney',
        description: 'Official state power of attorney with automatic compliance checking',
        aliases: ['POA', 'attorney authorization', 'legal authorization']
      },
      es: {
        name: 'Poder Notarial',
        description: 'Poder notarial oficial del estado con verificación automática de cumplimiento',
        aliases: ['POA', 'autorización de abogado', 'autorización legal']
      }
    }
  }

  // Additional document metadata will be added here as documents are migrated
};

// Helper functions for metadata operations
export function getDocumentMetadata(docId: string): DocumentMetadata | null {
  return DOCUMENT_METADATA[docId] || null;
}

export function getAllDocumentMetadata(): DocumentMetadata[] {
  return Object.values(DOCUMENT_METADATA);
}

export function getDocumentsByCategory(category: string): DocumentMetadata[] {
  return Object.values(DOCUMENT_METADATA).filter(doc =>
    doc.category.toLowerCase() === category.toLowerCase()
  );
}

export function getDocumentsByJurisdiction(jurisdiction: string): DocumentMetadata[] {
  return Object.values(DOCUMENT_METADATA).filter(doc =>
    doc.jurisdiction === jurisdiction
  );
}

export function searchDocumentMetadata(
  query: string,
  lang: 'en' | 'es' = 'en'
): DocumentMetadata[] {
  const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 1);

  return Object.values(DOCUMENT_METADATA).filter(doc => {
    const translation = doc.translations[lang];
    const searchableText = [
      translation.name,
      translation.description,
      ...translation.aliases,
      ...doc.tags,
      doc.category
    ].join(' ').toLowerCase();

    return searchTerms.some(term => searchableText.includes(term));
  });
}