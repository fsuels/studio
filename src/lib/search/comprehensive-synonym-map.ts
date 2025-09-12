// Comprehensive English-Spanish Legal Synonym Mapping System
// This system provides extensive keyword expansion for legal document discovery

export interface BilingualSynonymMap {
  [key: string]: {
    en: string[];
    es: string[];
    combined: string[];
  };
}

// Core legal action verbs and their variations
const LEGAL_ACTIONS: BilingualSynonymMap = {
  // Buying/Purchasing
  'buy': {
    en: ['buy', 'buying', 'purchase', 'purchasing', 'acquire', 'acquiring', 'obtain', 'obtaining', 'procure', 'procuring', 'get', 'getting'],
    es: ['comprar', 'comprando', 'compra', 'adquirir', 'adquiriendo', 'adquisición', 'obtener', 'obteniendo', 'conseguir', 'consiguiendo'],
    combined: ['buy', 'buying', 'purchase', 'purchasing', 'acquire', 'acquiring', 'obtain', 'obtaining', 'procure', 'procuring', 'get', 'getting', 'comprar', 'comprando', 'compra', 'adquirir', 'adquiriendo', 'adquisición', 'obtener', 'obteniendo', 'conseguir', 'consiguiendo']
  },
  
  // Selling/Transferring
  'sell': {
    en: ['sell', 'selling', 'sale', 'transfer', 'transferring', 'convey', 'conveying', 'dispose', 'disposing', 'assign', 'assigning'],
    es: ['vender', 'vendiendo', 'venta', 'transferir', 'transfiriendo', 'transferencia', 'traspasar', 'traspasando', 'ceder', 'cediendo'],
    combined: ['sell', 'selling', 'sale', 'transfer', 'transferring', 'convey', 'conveying', 'dispose', 'disposing', 'assign', 'assigning', 'vender', 'vendiendo', 'venta', 'transferir', 'transfiriendo', 'transferencia', 'traspasar', 'traspasando', 'ceder', 'cediendo']
  },

  // Renting/Leasing
  'rent': {
    en: ['rent', 'renting', 'rental', 'lease', 'leasing', 'let', 'letting', 'hire', 'hiring', 'tenancy', 'occupy', 'occupying'],
    es: ['alquilar', 'alquilando', 'alquiler', 'arrendar', 'arrendando', 'arriendo', 'rentar', 'rentando', 'ocupar', 'ocupando'],
    combined: ['rent', 'renting', 'rental', 'lease', 'leasing', 'let', 'letting', 'hire', 'hiring', 'tenancy', 'occupy', 'occupying', 'alquilar', 'alquilando', 'alquiler', 'arrendar', 'arrendando', 'arriendo', 'rentar', 'rentando', 'ocupar', 'ocupando']
  },

  // Creating/Establishing
  'create': {
    en: ['create', 'creating', 'establish', 'establishing', 'form', 'forming', 'start', 'starting', 'setup', 'setting up', 'incorporate', 'incorporating'],
    es: ['crear', 'creando', 'creación', 'establecer', 'estableciendo', 'formar', 'formando', 'iniciar', 'iniciando', 'constituir', 'constituyendo'],
    combined: ['create', 'creating', 'establish', 'establishing', 'form', 'forming', 'start', 'starting', 'setup', 'setting up', 'incorporate', 'incorporating', 'crear', 'creando', 'creación', 'establecer', 'estableciendo', 'formar', 'formando', 'iniciar', 'iniciando', 'constituir', 'constituyendo']
  },

  // Hiring/Employment
  'hire': {
    en: ['hire', 'hiring', 'employ', 'employing', 'engagement', 'engaging', 'recruit', 'recruiting', 'onboard', 'onboarding'],
    es: ['contratar', 'contratando', 'contratación', 'emplear', 'empleando', 'reclutar', 'reclutando', 'incorporar', 'incorporando'],
    combined: ['hire', 'hiring', 'employ', 'employing', 'engagement', 'engaging', 'recruit', 'recruiting', 'onboard', 'onboarding', 'contratar', 'contratando', 'contratación', 'emplear', 'empleando', 'reclutar', 'reclutando', 'incorporar', 'incorporando']
  }
};

// Vehicles and Transportation
const VEHICLES: BilingualSynonymMap = {
  'car': {
    en: ['car', 'cars', 'vehicle', 'vehicles', 'auto', 'autos', 'automobile', 'automobiles', 'motor vehicle', 'sedan', 'coupe', 'suv', 'truck', 'pickup'],
    es: ['carro', 'carros', 'coche', 'coches', 'vehículo', 'vehículos', 'automóvil', 'automóviles', 'auto', 'autos', 'camioneta', 'sedán'],
    combined: ['car', 'cars', 'vehicle', 'vehicles', 'auto', 'autos', 'automobile', 'automobiles', 'motor vehicle', 'sedan', 'coupe', 'suv', 'truck', 'pickup', 'carro', 'carros', 'coche', 'coches', 'vehículo', 'vehículos', 'automóvil', 'automóviles', 'camioneta', 'sedán']
  },
  
  'boat': {
    en: ['boat', 'boats', 'vessel', 'vessels', 'watercraft', 'yacht', 'yachts', 'ship', 'ships', 'marine', 'sailboat', 'motorboat'],
    es: ['barco', 'barcos', 'embarcación', 'embarcaciones', 'nave', 'naves', 'yate', 'yates', 'lancha', 'lanchas', 'bote', 'botes'],
    combined: ['boat', 'boats', 'vessel', 'vessels', 'watercraft', 'yacht', 'yachts', 'ship', 'ships', 'marine', 'sailboat', 'motorboat', 'barco', 'barcos', 'embarcación', 'embarcaciones', 'nave', 'naves', 'yate', 'yates', 'lancha', 'lanchas', 'bote', 'botes']
  },

  'motorcycle': {
    en: ['motorcycle', 'motorcycles', 'bike', 'bikes', 'motorbike', 'motorbikes', 'scooter', 'scooters', 'moped', 'mopeds'],
    es: ['motocicleta', 'motocicletas', 'moto', 'motos', 'ciclomotor', 'ciclomotores', 'scooter', 'scooters'],
    combined: ['motorcycle', 'motorcycles', 'bike', 'bikes', 'motorbike', 'motorbikes', 'scooter', 'scooters', 'moped', 'mopeds', 'motocicleta', 'motocicletas', 'moto', 'motos', 'ciclomotor', 'ciclomotores']
  }
};

// Business Entities
const BUSINESS_ENTITIES: BilingualSynonymMap = {
  'business': {
    en: ['business', 'businesses', 'company', 'companies', 'corporation', 'corporations', 'enterprise', 'enterprises', 'firm', 'firms', 'organization', 'organizations'],
    es: ['negocio', 'negocios', 'empresa', 'empresas', 'corporación', 'corporaciones', 'compañía', 'compañías', 'organización', 'organizaciones'],
    combined: ['business', 'businesses', 'company', 'companies', 'corporation', 'corporations', 'enterprise', 'enterprises', 'firm', 'firms', 'organization', 'organizations', 'negocio', 'negocios', 'empresa', 'empresas', 'corporación', 'corporaciones', 'compañía', 'compañías', 'organización', 'organizaciones']
  },

  'llc': {
    en: ['llc', 'limited liability company', 'limited liability companies', 'l.l.c.', 'llcs'],
    es: ['sociedad de responsabilidad limitada', 'srl', 'compañía de responsabilidad limitada', 'crl'],
    combined: ['llc', 'limited liability company', 'limited liability companies', 'l.l.c.', 'llcs', 'sociedad de responsabilidad limitada', 'srl', 'compañía de responsabilidad limitada', 'crl']
  },

  'partnership': {
    en: ['partnership', 'partnerships', 'partner', 'partners', 'joint venture', 'joint ventures', 'collaboration', 'collaborations'],
    es: ['sociedad', 'sociedades', 'socio', 'socios', 'asociación', 'asociaciones', 'colaboración', 'colaboraciones'],
    combined: ['partnership', 'partnerships', 'partner', 'partners', 'joint venture', 'joint ventures', 'collaboration', 'collaborations', 'sociedad', 'sociedades', 'socio', 'socios', 'asociación', 'asociaciones', 'colaboración', 'colaboraciones']
  }
};

// Real Estate
const REAL_ESTATE: BilingualSynonymMap = {
  'property': {
    en: ['property', 'properties', 'real estate', 'realty', 'land', 'lands', 'premises', 'estate', 'estates'],
    es: ['propiedad', 'propiedades', 'inmueble', 'inmuebles', 'bienes raíces', 'terreno', 'terrenos', 'finca', 'fincas'],
    combined: ['property', 'properties', 'real estate', 'realty', 'land', 'lands', 'premises', 'estate', 'estates', 'propiedad', 'propiedades', 'inmueble', 'inmuebles', 'bienes raíces', 'terreno', 'terrenos', 'finca', 'fincas']
  },

  'house': {
    en: ['house', 'houses', 'home', 'homes', 'residence', 'residences', 'dwelling', 'dwellings', 'residential'],
    es: ['casa', 'casas', 'hogar', 'hogares', 'residencia', 'residencias', 'vivienda', 'viviendas', 'domicilio', 'domicilios'],
    combined: ['house', 'houses', 'home', 'homes', 'residence', 'residences', 'dwelling', 'dwellings', 'residential', 'casa', 'casas', 'hogar', 'hogares', 'residencia', 'residencias', 'vivienda', 'viviendas', 'domicilio', 'domicilios']
  },

  'apartment': {
    en: ['apartment', 'apartments', 'unit', 'units', 'flat', 'flats', 'condo', 'condos', 'condominium', 'condominiums'],
    es: ['apartamento', 'apartamentos', 'departamento', 'departamentos', 'piso', 'pisos', 'condominio', 'condominios'],
    combined: ['apartment', 'apartments', 'unit', 'units', 'flat', 'flats', 'condo', 'condos', 'condominium', 'condominiums', 'apartamento', 'apartamentos', 'departamento', 'departamentos', 'piso', 'pisos', 'condominio', 'condominios']
  }
};

// Employment & Labor
const EMPLOYMENT: BilingualSynonymMap = {
  'employee': {
    en: ['employee', 'employees', 'worker', 'workers', 'staff', 'personnel', 'team member', 'team members'],
    es: ['empleado', 'empleados', 'trabajador', 'trabajadores', 'personal', 'miembro del equipo', 'miembros del equipo'],
    combined: ['employee', 'employees', 'worker', 'workers', 'staff', 'personnel', 'team member', 'team members', 'empleado', 'empleados', 'trabajador', 'trabajadores', 'personal', 'miembro del equipo', 'miembros del equipo']
  },

  'contractor': {
    en: ['contractor', 'contractors', 'independent contractor', 'independent contractors', 'freelancer', 'freelancers', 'consultant', 'consultants'],
    es: ['contratista', 'contratistas', 'contratista independiente', 'contratistas independientes', 'freelancer', 'freelancers', 'consultor', 'consultores'],
    combined: ['contractor', 'contractors', 'independent contractor', 'independent contractors', 'freelancer', 'freelancers', 'consultant', 'consultants', 'contratista', 'contratistas', 'contratista independiente', 'contratistas independientes', 'consultor', 'consultores']
  },

  'job': {
    en: ['job', 'jobs', 'work', 'employment', 'position', 'positions', 'role', 'roles', 'occupation', 'occupations'],
    es: ['trabajo', 'trabajos', 'empleo', 'empleos', 'puesto', 'puestos', 'posición', 'posiciones', 'ocupación', 'ocupaciones'],
    combined: ['job', 'jobs', 'work', 'employment', 'position', 'positions', 'role', 'roles', 'occupation', 'occupations', 'trabajo', 'trabajos', 'empleo', 'empleos', 'puesto', 'puestos', 'posición', 'posiciones', 'ocupación', 'ocupaciones']
  }
};

// Financial & Legal Documents
const FINANCIAL_LEGAL: BilingualSynonymMap = {
  'loan': {
    en: ['loan', 'loans', 'lending', 'borrow', 'borrowing', 'credit', 'financing', 'advance', 'advances'],
    es: ['préstamo', 'préstamos', 'crédito', 'créditos', 'financiamiento', 'financiamientos', 'adelanto', 'adelantos'],
    combined: ['loan', 'loans', 'lending', 'borrow', 'borrowing', 'credit', 'financing', 'advance', 'advances', 'préstamo', 'préstamos', 'crédito', 'créditos', 'financiamiento', 'financiamientos', 'adelanto', 'adelantos']
  },

  'payment': {
    en: ['payment', 'payments', 'pay', 'paying', 'settlement', 'settlements', 'installment', 'installments'],
    es: ['pago', 'pagos', 'pagar', 'pagando', 'liquidación', 'liquidaciones', 'cuota', 'cuotas', 'abono', 'abonos'],
    combined: ['payment', 'payments', 'pay', 'paying', 'settlement', 'settlements', 'installment', 'installments', 'pago', 'pagos', 'pagar', 'pagando', 'liquidación', 'liquidaciones', 'cuota', 'cuotas', 'abono', 'abonos']
  },

  'contract': {
    en: ['contract', 'contracts', 'agreement', 'agreements', 'deal', 'deals', 'arrangement', 'arrangements'],
    es: ['contrato', 'contratos', 'acuerdo', 'acuerdos', 'convenio', 'convenios', 'arreglo', 'arreglos'],
    combined: ['contract', 'contracts', 'agreement', 'agreements', 'deal', 'deals', 'arrangement', 'arrangements', 'contrato', 'contratos', 'acuerdo', 'acuerdos', 'convenio', 'convenios', 'arreglo', 'arreglos']
  }
};

// Family & Personal
const FAMILY_PERSONAL: BilingualSynonymMap = {
  'divorce': {
    en: ['divorce', 'divorces', 'separation', 'separations', 'split', 'splits', 'dissolution', 'dissolutions'],
    es: ['divorcio', 'divorcios', 'separación', 'separaciones', 'disolución', 'disoluciones'],
    combined: ['divorce', 'divorces', 'separation', 'separations', 'split', 'splits', 'dissolution', 'dissolutions', 'divorcio', 'divorcios', 'separación', 'separaciones', 'disolución', 'disoluciones']
  },

  'child': {
    en: ['child', 'children', 'kid', 'kids', 'minor', 'minors', 'son', 'daughter', 'sons', 'daughters'],
    es: ['niño', 'niños', 'niña', 'niñas', 'hijo', 'hijos', 'hija', 'hijas', 'menor', 'menores'],
    combined: ['child', 'children', 'kid', 'kids', 'minor', 'minors', 'son', 'daughter', 'sons', 'daughters', 'niño', 'niños', 'niña', 'niñas', 'hijo', 'hijos', 'hija', 'hijas', 'menor', 'menores']
  },

  'will': {
    en: ['will', 'wills', 'testament', 'testaments', 'last will', 'estate planning', 'inheritance', 'legacy'],
    es: ['testamento', 'testamentos', 'herencia', 'herencias', 'legado', 'legados', 'planificación patrimonial'],
    combined: ['will', 'wills', 'testament', 'testaments', 'last will', 'estate planning', 'inheritance', 'legacy', 'testamento', 'testamentos', 'herencia', 'herencias', 'legado', 'legados', 'planificación patrimonial']
  }
};

// Services & Industries
const SERVICES_INDUSTRIES: BilingualSynonymMap = {
  'construction': {
    en: ['construction', 'building', 'builder', 'builders', 'contractor', 'contractors', 'renovation', 'renovations', 'remodeling'],
    es: ['construcción', 'construcciones', 'constructor', 'constructores', 'contratista', 'contratistas', 'renovación', 'renovaciones', 'remodelación'],
    combined: ['construction', 'building', 'builder', 'builders', 'contractor', 'contractors', 'renovation', 'renovations', 'remodeling', 'construcción', 'construcciones', 'constructor', 'constructores', 'contratista', 'contratistas', 'renovación', 'renovaciones', 'remodelación']
  },

  'photography': {
    en: ['photography', 'photographer', 'photographers', 'photo', 'photos', 'picture', 'pictures', 'wedding photography'],
    es: ['fotografía', 'fotógrafo', 'fotógrafos', 'foto', 'fotos', 'fotografía de bodas'],
    combined: ['photography', 'photographer', 'photographers', 'photo', 'photos', 'picture', 'pictures', 'wedding photography', 'fotografía', 'fotógrafo', 'fotógrafos', 'foto', 'fotos', 'fotografía de bodas']
  },

  'catering': {
    en: ['catering', 'caterer', 'caterers', 'food service', 'food services', 'event catering', 'wedding catering'],
    es: ['catering', 'servicio de comida', 'servicios de comida', 'banquetes', 'catering de eventos', 'catering de bodas'],
    combined: ['catering', 'caterer', 'caterers', 'food service', 'food services', 'event catering', 'wedding catering', 'servicio de comida', 'servicios de comida', 'banquetes', 'catering de eventos', 'catering de bodas']
  }
};

// Combine all mappings
export const COMPREHENSIVE_SYNONYM_MAP: BilingualSynonymMap = {
  ...LEGAL_ACTIONS,
  ...VEHICLES,
  ...BUSINESS_ENTITIES,
  ...REAL_ESTATE,
  ...EMPLOYMENT,
  ...FINANCIAL_LEGAL,
  ...FAMILY_PERSONAL,
  ...SERVICES_INDUSTRIES
};

// Create a simple lookup function to avoid circular reference issues
export function getSynonyms(word: string): string[] {
  const lowerWord = word.toLowerCase();
  
  // Find the group that contains this word
  for (const [_key, group] of Object.entries(COMPREHENSIVE_SYNONYM_MAP)) {
    if (group.combined.some(synonym => synonym.toLowerCase() === lowerWord)) {
      return group.combined.map(s => s.toLowerCase());
    }
  }
  
  return [lowerWord]; // Return the word itself if no synonyms found
}

// Stop words in both languages
export const STOP_WORDS = new Set([
  // English
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
  // Spanish
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'y', 'o', 'pero', 'en', 'por', 'para', 'de', 'del', 'con', 'sin', 'es', 'son', 'fue', 'fueron', 'ser', 'estar', 'tener', 'haber', 'hacer', 'poder', 'deber', 'este', 'esta', 'estos', 'estas', 'ese', 'esa', 'esos', 'esas', 'yo', 'tú', 'él', 'ella', 'nosotros', 'nosotras', 'vosotros', 'vosotras', 'ellos', 'ellas', 'me', 'te', 'le', 'nos', 'os', 'les'
]);

// Query preprocessing function
export function preprocessQuery(query: string, _language: 'en' | 'es' | 'both' = 'both'): string[] {
  const tokens = query
    .toLowerCase()
    .replace(/['"]/g, '') // Remove quotes
    .replace(/[^\w\s]/g, ' ') // Replace punctuation with spaces
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOP_WORDS.has(token));

  const expandedTokens = new Set<string>();
  
  tokens.forEach(token => {
    expandedTokens.add(token);
    
    // Add synonyms using the getSynonyms function
    const synonyms = getSynonyms(token);
    synonyms.forEach(synonym => {
      expandedTokens.add(synonym);
    });
  });

  return Array.from(expandedTokens);
}

// Get document relevance score
export function calculateRelevanceScore(
  documentKeywords: string[],
  searchTokens: string[],
  originalTokens: string[]
): number {
  let score = 0;
  
  // Original tokens get higher weight
  originalTokens.forEach(token => {
    if (documentKeywords.some(keyword => keyword.toLowerCase().includes(token.toLowerCase()))) {
      score += 2;
    }
  });
  
  // Synonym matches get lower weight
  searchTokens.forEach(token => {
    if (documentKeywords.some(keyword => keyword.toLowerCase().includes(token.toLowerCase()))) {
      score += 1;
    }
  });
  
  return score;
}
