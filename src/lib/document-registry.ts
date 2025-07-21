// Document registry for all available documents
// This includes both TypeScript-based and JSON-based documents

export interface DocumentInfo {
  id: string;
  title: string;
  description: string;
  category: string;
  jurisdiction?: string;
  configType: 'typescript' | 'json';
  route: string;
  isNew?: boolean;
  requiresNotary?: boolean;
  officialForm?: boolean;
  states?: string[]; // For state-specific documents
}

export const DOCUMENT_REGISTRY: DocumentInfo[] = [
  // TypeScript-based documents (existing)
  {
    id: 'bill-of-sale-vehicle',
    title: 'Vehicle Bill of Sale',
    description: 'Legally compliant bill of sale for vehicle transactions in all 50 states',
    category: 'Automotive',
    configType: 'typescript',
    route: '/documents/bill-of-sale-vehicle',
    requiresNotary: false, // Varies by state
    officialForm: true, // Some states have official forms
    states: ['all']
  },
  
  // JSON-based documents (new)
  {
    id: 'basic-nda',
    title: 'Basic Non-Disclosure Agreement',
    description: 'Professional NDA template with mutual/unilateral options and state-specific compliance',
    category: 'Business',
    jurisdiction: 'us/generic',
    configType: 'json',
    route: '/documents/basic-nda',
    isNew: true,
    requiresNotary: false,
    officialForm: false,
    states: ['all']
  },
  
  {
    id: 'power-of-attorney',
    title: 'Power of Attorney (Colorado)',
    description: 'Official Colorado statutory power of attorney with automatic compliance checking',
    category: 'Estate Planning',
    jurisdiction: 'us/colorado',
    configType: 'json',
    route: '/documents/power-of-attorney',
    isNew: true,
    requiresNotary: true,
    officialForm: true,
    states: ['colorado']
  }
];

// Helper functions
export function getDocumentById(id: string): DocumentInfo | undefined {
  return DOCUMENT_REGISTRY.find(doc => doc.id === id);
}

export function getDocumentsByCategory(category: string): DocumentInfo[] {
  return DOCUMENT_REGISTRY.filter(doc => doc.category === category);
}

export function getJsonBasedDocuments(): DocumentInfo[] {
  return DOCUMENT_REGISTRY.filter(doc => doc.configType === 'json');
}

export function getTypeScriptBasedDocuments(): DocumentInfo[] {
  return DOCUMENT_REGISTRY.filter(doc => doc.configType === 'typescript');
}

export function getDocumentsByState(state: string): DocumentInfo[] {
  return DOCUMENT_REGISTRY.filter(doc => 
    doc.states?.includes('all') || 
    doc.states?.includes(state.toLowerCase()) ||
    doc.jurisdiction?.includes(state.toLowerCase())
  );
}

export function getAllCategories(): string[] {
  return Array.from(new Set(DOCUMENT_REGISTRY.map(doc => doc.category)));
}

// Export for easier imports
export default DOCUMENT_REGISTRY;