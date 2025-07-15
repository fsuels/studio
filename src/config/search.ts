// src/config/search.ts
// Advanced centralized search configuration for legal document platform

/**
 * Advanced synonym mapping for legal document search terms
 * Features: bilingual support, legal specializations, regional variants, phonetic similarities
 * Optimized for: legal professionals, businesses, individuals, international users
 */
export const SYN_MAP: Record<string, string[]> = {
  // === CORE LEGAL DOCUMENT TYPES (ENGLISH) ===
  contract: ["contract", "agreement", "document", "form", "template", "arrangement", "deal", "pact", "covenant", "compact", "indenture", "instrument", "charter", "understanding", "memorandum"],
  agreement: ["agreement", "contract", "document", "arrangement", "deal", "pact", "covenant", "compact", "accord", "settlement", "understanding", "treaty", "alliance", "concordat"],
  lease: ["lease", "rental", "tenancy", "rent", "hire", "letting", "sublease", "sublet", "occupancy", "demise", "bailment", "charter"],
  employment: ["employment", "job", "work", "hiring", "engagement", "position", "occupation", "labor", "service", "appointment", "recruitment", "staffing", "workforce"],
  nda: ["nda", "non-disclosure", "confidentiality", "secrecy", "privacy", "non-disclosure agreement", "confidentiality agreement", "proprietary information agreement"],
  will: ["will", "testament", "last will", "estate plan", "bequest", "inheritance", "legacy", "devise", "probate", "succession", "testamentary"],
  deed: ["deed", "title", "property document", "conveyance", "transfer", "instrument", "grant", "quitclaim", "warranty deed", "special warranty"],
  license: ["license", "permit", "authorization", "certification", "clearance", "credential", "franchise", "concession", "privilege", "warrant"],
  
  // === ADVANCED LEGAL DOCUMENT TYPES ===
  power_of_attorney: ["power of attorney", "poa", "proxy", "authorization", "agent appointment", "attorney-in-fact", "legal proxy", "mandate"],
  living_will: ["living will", "advance directive", "medical directive", "healthcare directive", "end-of-life directive", "patient directive"],
  trust: ["trust", "trust agreement", "trust document", "fiduciary arrangement", "trustee agreement", "beneficiary document", "estate trust"],
  partnership: ["partnership", "joint venture", "collaboration", "alliance", "union", "association", "consortium", "syndicate", "cooperative"],
  corporation: ["corporation", "company", "business", "entity", "firm", "organization", "enterprise", "incorporation", "corp", "inc"],
  llc: ["llc", "limited liability company", "limited liability", "company formation", "business entity", "liability protection"],
  
  // === FAMILY LAW DOCUMENTS ===
  divorce: ["divorce", "dissolution", "separation", "annulment", "marital dissolution", "decree", "matrimonial", "family court"],
  custody: ["custody", "guardianship", "care", "parental rights", "child custody", "visitation", "parenting plan", "ward", "minor"],
  adoption: ["adoption", "adoption agreement", "parental rights", "guardianship", "foster care", "custody transfer", "legal parent"],
  prenup: ["prenup", "prenuptial", "premarital", "antenuptial", "marriage contract", "pre-marriage agreement"],
  
  // === FINANCIAL & REAL ESTATE DOCUMENTS ===
  loan: ["loan", "credit", "financing", "debt", "advance", "borrowing", "lending", "promissory note", "credit agreement"],
  mortgage: ["mortgage", "home loan", "property loan", "financing", "lien", "real estate loan", "deed of trust", "security interest"],
  promissory_note: ["promissory note", "iou", "note", "debt instrument", "payment promise", "loan note", "credit note"],
  insurance: ["insurance", "coverage", "policy", "protection", "plan", "assurance", "indemnity", "guarantee"],
  bill_of_sale: ["bill of sale", "sales receipt", "purchase agreement", "transfer document", "ownership transfer", "sales contract"],
  
  // === LITIGATION & DISPUTE RESOLUTION ===
  settlement: ["settlement", "resolution", "agreement", "compromise", "arrangement", "accord", "mediation agreement"],
  lawsuit: ["lawsuit", "litigation", "legal action", "case", "suit", "claim", "proceeding", "action", "complaint"],
  arbitration: ["arbitration", "mediation", "alternative dispute resolution", "adr", "binding arbitration", "dispute resolution"],
  subpoena: ["subpoena", "summons", "court order", "legal notice", "service", "process", "citation"],
  affidavit: ["affidavit", "sworn statement", "declaration", "testimony", "attestation", "verification", "deposition"],
  
  // === INTELLECTUAL PROPERTY ===
  trademark: ["trademark", "service mark", "brand", "logo", "mark", "tm", "intellectual property", "brand protection"],
  copyright: ["copyright", "intellectual property", "authorship", "creative work", "literary property", "artistic work"],
  patent: ["patent", "invention", "intellectual property", "innovation", "patent application", "patent protection"],
  
  // === BUSINESS & COMMERCIAL ===
  franchise: ["franchise", "franchising", "business license", "commercial agreement", "brand licensing", "business opportunity"],
  non_compete: ["non-compete", "non-competition", "restraint of trade", "covenant not to compete", "exclusivity"],
  operating_agreement: ["operating agreement", "partnership agreement", "business agreement", "company bylaws", "governance"],
  shareholder: ["shareholder", "stockholder", "equity holder", "investor", "ownership", "stock agreement"],
  
  // === LEGAL ACTIONS & VERBS ===
  buy: ["buy", "purchase", "acquire", "obtain", "procure", "get", "secure", "take title", "come into possession"],
  sell: ["sell", "transfer", "convey", "dispose", "market", "vend", "alienate", "assign", "divest"],
  rent: ["rent", "lease", "hire", "let", "sublease", "sublet", "charter", "tenant"],
  hire: ["hire", "employ", "engage", "contract", "recruit", "retain", "appoint", "enlist", "commission"],
  terminate: ["terminate", "end", "cancel", "dissolve", "conclude", "finish", "cease", "discontinue", "void", "rescind"],
  breach: ["breach", "violation", "default", "break", "infringement", "non-compliance", "transgression", "contravention"],
  enforce: ["enforce", "implement", "execute", "carry out", "apply", "impose", "uphold", "compel", "effectuate"],
  waive: ["waive", "relinquish", "forfeit", "give up", "abandon", "surrender", "renounce", "disclaim", "forgo"],
  assign: ["assign", "transfer", "delegate", "convey", "allocate", "designate", "appoint", "bestow", "grant"],
  sue: ["sue", "litigate", "prosecute", "take legal action", "file suit", "bring action", "commence proceedings"],
  settle: ["settle", "resolve", "agree", "compromise", "arrange", "negotiate", "accord", "mediate", "arbitrate"],
  guarantee: ["guarantee", "warrant", "assure", "promise", "pledge", "certify", "ensure", "secure", "vouch"],
  indemnify: ["indemnify", "protect", "compensate", "hold harmless", "reimburse", "safeguard", "insure", "defend"],
  notarize: ["notarize", "authenticate", "certify", "witness", "validate", "attest", "acknowledge", "verify"],
  
  // === PROPERTY & ASSETS ===
  car: ["car", "vehicle", "auto", "automobile", "motor vehicle", "transportation", "automotive", "motorcar"],
  boat: ["boat", "vessel", "watercraft", "ship", "craft", "marine vehicle", "nautical", "yacht", "sailboat"],
  house: ["house", "home", "property", "residence", "dwelling", "real estate", "residential", "domicile", "abode"],
  land: ["land", "property", "real estate", "parcel", "plot", "lot", "tract", "acreage", "realty", "grounds"],
  business: ["business", "company", "enterprise", "firm", "organization", "venture", "establishment", "concern"],
  money: ["money", "funds", "payment", "compensation", "remuneration", "capital", "cash", "currency", "consideration"],
  equipment: ["equipment", "machinery", "tools", "apparatus", "devices", "assets", "gear", "implements", "fixtures"],
  inventory: ["inventory", "stock", "goods", "merchandise", "products", "items", "supplies", "commodities"],
  
  // === LEGAL CONCEPTS & TERMINOLOGY ===
  liable: ["liable", "responsible", "accountable", "at fault", "culpable", "answerable", "bound", "obligated"],
  damages: ["damages", "compensation", "reimbursement", "payment", "reparation", "remedy", "award", "indemnity"],
  penalty: ["penalty", "fine", "punishment", "sanction", "forfeiture", "assessment", "surcharge", "damages"],
  jurisdiction: ["jurisdiction", "authority", "court", "legal system", "venue", "forum", "competence", "territorial"],
  statute: ["statute", "law", "regulation", "rule", "code", "ordinance", "act", "provision", "enactment"],
  precedent: ["precedent", "case law", "ruling", "decision", "authority", "guidance", "jurisprudence", "stare decisis"],
  evidence: ["evidence", "proof", "documentation", "testimony", "exhibit", "record", "substantiation", "verification"],
  witness: ["witness", "testimony", "attestation", "deposition", "affidavit", "statement", "declaration", "observer"],
  
  // === PROFESSIONAL ROLES ===
  lawyer: ["lawyer", "attorney", "counsel", "advocate", "solicitor", "barrister", "legal professional", "counselor"],
  judge: ["judge", "justice", "magistrate", "jurist", "adjudicator", "tribunal", "court", "bench"],
  notary: ["notary", "notary public", "commissioner", "authenticator", "witness", "official"],
  paralegal: ["paralegal", "legal assistant", "legal aide", "law clerk", "legal support"],
  
  // === TIME & DURATION TERMS ===
  annual: ["annual", "yearly", "per year", "each year", "every year", "annually", "per annum"],
  monthly: ["monthly", "per month", "every month", "each month", "monthly basis", "calendar month"],
  weekly: ["weekly", "per week", "every week", "each week", "weekly basis", "seven days"],
  daily: ["daily", "per day", "every day", "each day", "daily basis", "calendar day"],
  temporary: ["temporary", "short-term", "interim", "provisional", "limited", "transient", "brief", "interim"],
  permanent: ["permanent", "long-term", "indefinite", "ongoing", "lasting", "enduring", "perpetual", "continuing"],
  immediate: ["immediate", "instant", "prompt", "urgent", "right away", "forthwith", "instantaneous", "at once"],
  deadline: ["deadline", "due date", "expiration", "time limit", "cutoff", "maturity", "term", "expiry"],
  renewal: ["renewal", "extension", "continuation", "update", "refresh", "rollover", "prolongation", "reissuance"],
  
  // === SPANISH LEGAL DOCUMENT TYPES ===
  contrato: ["contrato", "acuerdo", "convenio", "documento", "pacto", "arreglo", "trato", "escritura", "instrumento"],
  acuerdo: ["acuerdo", "contrato", "convenio", "pacto", "arreglo", "compromiso", "transacción", "entendimiento"],
  arrendamiento: ["arrendamiento", "alquiler", "renta", "inquilinato", "locación", "subarriendo", "tenencia"],
  empleo: ["empleo", "trabajo", "laboral", "contratación", "ocupación", "puesto", "labor", "plaza", "cargo"],
  confidencialidad: ["confidencialidad", "secreto", "reserva", "privacidad", "discreción", "sigilo", "confidencial"],
  testamento: ["testamento", "última voluntad", "legado", "herencia", "sucesión", "disposición", "testamentario"],
  escritura: ["escritura", "título", "documento de propiedad", "acta", "instrumento", "certificado", "documento"],
  licencia: ["licencia", "permiso", "autorización", "habilitación", "certificación", "patente", "concesión"],
  sociedad: ["sociedad", "asociación", "empresa", "compañía", "partnership", "alianza", "corporación"],
  corporación: ["corporación", "empresa", "entidad", "organización", "compañía", "firma", "sociedad anónima"],
  
  // === SPANISH FAMILY LAW ===
  divorcio: ["divorcio", "separación", "disolución matrimonial", "ruptura", "anulación", "divorcio legal"],
  custodia: ["custodia", "guarda", "cuidado", "tutela", "patria potestad", "custodia parental", "guarda legal"],
  adopcion: ["adopción", "filiación", "patria potestad", "tutela", "guarda", "adopción legal"],
  
  // === SPANISH FINANCIAL TERMS ===
  prestamo: ["préstamo", "crédito", "financiamiento", "deuda", "empréstito", "financiación", "mutuo"],
  hipoteca: ["hipoteca", "gravamen", "préstamo hipotecario", "financiación inmobiliaria", "crédito hipotecario"],
  seguro: ["seguro", "póliza", "cobertura", "protección", "plan", "aseguranza", "garantía"],
  
  // === SPANISH LEGAL ACTIONS ===
  comprar: ["comprar", "adquirir", "obtener", "conseguir", "procurar", "hacerse de", "adquisición", "compra"],
  vender: ["vender", "transferir", "enajenar", "ceder", "comercializar", "traspasar", "alienar", "venta"],
  alquilar: ["alquilar", "arrendar", "rentar", "dar en alquiler", "locar", "subarrendar", "alquiler"],
  contratar: ["contratar", "emplear", "vincular", "comprometer", "reclutar", "retener", "nombrar", "contratación"],
  terminar: ["terminar", "finalizar", "cancelar", "disolver", "concluir", "cesar", "discontinuar", "acabar"],
  incumplir: ["incumplir", "violar", "quebrantar", "faltar", "infringir", "contravenir", "transgredir"],
  renunciar: ["renunciar", "ceder", "abandonar", "desistir", "abdicar", "dimitir", "declinar", "resignar"],
  demandar: ["demandar", "litigar", "procesar", "enjuiciar", "querellarse", "accionar", "reclamar"],
  resolver: ["resolver", "solucionar", "arreglar", "acordar", "negociar", "convenir", "dirimir", "zanjar"],
  garantizar: ["garantizar", "asegurar", "avalar", "prometer", "certificar", "respaldar", "caucionar"],
  indemnizar: ["indemnizar", "compensar", "resarcir", "reparar", "reembolsar", "restituir", "reintegrar"],
  
  // === SPANISH PROPERTY TERMS ===
  carro: ["carro", "vehículo", "auto", "automóvil", "coche", "transporte", "automotor", "vehicle"],
  vehiculo: ["vehículo", "carro", "auto", "automóvil", "coche", "transporte", "automotor", "móvil"],
  barco: ["barco", "embarcación", "nave", "buque", "vessel", "navío", "náutico", "lancha"],
  casa: ["casa", "hogar", "vivienda", "residencia", "domicilio", "inmueble", "propiedad", "habitación"],
  tierra: ["tierra", "propiedad", "terreno", "parcela", "inmueble", "finca", "predio", "solar"],
  negocio: ["negocio", "empresa", "comercio", "firma", "compañía", "establecimiento", "emprendimiento"],
  dinero: ["dinero", "fondos", "pago", "compensación", "remuneración", "capital", "efectivo", "moneda"],
  
  // === SPANISH LEGAL CONCEPTS ===
  responsable: ["responsable", "culpable", "liable", "obligado", "accountable", "encargado", "a cargo"],
  daños: ["daños", "compensación", "indemnización", "perjuicios", "reparación", "resarcimiento", "daño"],
  multa: ["multa", "sanción", "penalidad", "castigo", "penalización", "recargo", "penalización"],
  jurisdiccion: ["jurisdicción", "competencia", "autoridad", "fuero", "tribunal", "instancia", "foro"],
  ley: ["ley", "norma", "reglamento", "estatuto", "código", "ordenanza", "disposición", "regla"],
  precedente: ["precedente", "jurisprudencia", "antecedente", "doctrina", "criterio", "caso"],
  evidencia: ["evidencia", "prueba", "documentación", "testimonio", "constancia", "comprobación"],
  testigo: ["testigo", "testimonio", "atestación", "declaración", "deposición", "testificación"],
  
  // === SPANISH TIME TERMS ===
  anual: ["anual", "por año", "cada año", "yearly", "anuario", "anualmente", "año"],
  mensual: ["mensual", "por mes", "cada mes", "mensualmente", "al mes", "mes"],
  semanal: ["semanal", "por semana", "cada semana", "semanalmente", "a la semana", "semana"],
  diario: ["diario", "por día", "cada día", "diariamente", "cotidiano", "al día", "día"],
  temporal: ["temporal", "provisional", "interino", "transitorio", "limitado", "temporario", "pasajero"],
  permanente: ["permanente", "definitivo", "continuo", "duradero", "perpetuo", "permanentemente"],
  inmediato: ["inmediato", "instantáneo", "urgente", "pronto", "al momento", "de inmediato", "ya"],
  plazo: ["plazo", "fecha límite", "vencimiento", "término", "deadline", "límite", "tiempo"],
  renovacion: ["renovación", "extensión", "prórroga", "actualización", "continuación", "prolongación"],
  
  // === CROSS-LANGUAGE LEGAL TERMS ===
  legal: ["legal", "jurídico", "law", "ley", "derecho", "legitimate", "lawful", "válido"],
  court: ["court", "tribunal", "corte", "juzgado", "courtroom", "sala", "judicial"],
  attorney: ["attorney", "abogado", "lawyer", "counsel", "letrado", "jurista", "legal representative"],
  document: ["document", "documento", "paper", "form", "formulario", "escrito", "instrumento"],
  
  // === INDUSTRY-SPECIFIC TERMS ===
  construction: ["construction", "building", "contractor", "construcción", "obra", "edificación", "building project"],
  healthcare: ["healthcare", "medical", "health", "medicina", "salud", "médico", "sanitario", "hospital"],
  technology: ["technology", "tech", "it", "software", "tecnología", "informática", "digital"],
  real_estate: ["real estate", "property", "realty", "bienes raíces", "inmobiliario", "propiedad"],
  finance: ["finance", "financial", "banking", "finanzas", "financiero", "bancario", "económico"],
  
  // === PHONETIC & SPELLING VARIATIONS ===
  organisation: ["organisation", "organization", "organización", "org", "entity", "body"],
  colour: ["colour", "color", "hue", "shade", "tint"],
  favour: ["favour", "favor", "preference", "benefit", "advantage"],
  centre: ["centre", "center", "middle", "hub", "core"],
  
  // === COMMON MISSPELLINGS & VARIANTS ===
  recieve: ["receive", "recieve", "get", "obtain", "accept"],
  seperate: ["separate", "seperate", "divide", "apart", "distinct"],
  occurance: ["occurrence", "occurance", "event", "incident", "happening"],
};

/**
 * Multi-language stop words optimized for legal document search
 * Includes context-aware filtering and legal-specific exclusions
 */
export const STOP_WORDS = new Set<string>([
  // === ENGLISH STOP WORDS ===
  // Articles & Determiners
  "a", "an", "the", "this", "that", "these", "those", "some", "any", "all", "both", "each", "every", "other", "another", "same", "different",
  
  // Prepositions
  "in", "on", "at", "to", "for", "of", "with", "by", "from", "about", "into", "through", "during", "before", "after", 
  "above", "below", "between", "among", "within", "without", "against", "toward", "upon", "across", "behind", "beyond", 
  "under", "over", "inside", "outside", "around", "near", "far", "off", "down", "up", "out",
  
  // Conjunctions & Connectors
  "and", "or", "but", "nor", "yet", "so", "either", "neither", "whether", "both", "not only", "as well as",
  "however", "therefore", "thus", "hence", "consequently", "moreover", "furthermore", "nevertheless", "nonetheless",
  
  // Pronouns
  "i", "you", "he", "she", "it", "we", "they", "me", "him", "her", "us", "them", "myself", "yourself", "himself", 
  "herself", "itself", "ourselves", "themselves", "my", "your", "his", "her", "its", "our", "their", "mine", "yours", 
  "hers", "ours", "theirs", "who", "whom", "whose", "which", "what", "where", "when", "why", "how",
  
  // Auxiliary & Modal Verbs
  "is", "are", "was", "were", "am", "be", "being", "been", "have", "has", "had", "having", "do", "does", "did", 
  "will", "would", "shall", "should", "may", "might", "can", "could", "must", "ought", "need", "dare", "used",
  
  // Common Adverbs
  "very", "quite", "rather", "more", "most", "less", "least", "much", "many", "few", "little", "too", "so", "such", 
  "only", "just", "even", "also", "still", "already", "yet", "again", "once", "twice", "always", "never", "often", 
  "sometimes", "usually", "rarely", "seldom", "frequently", "occasionally", "constantly", "continuously",
  
  // Time & Place Adverbs
  "now", "then", "today", "tomorrow", "yesterday", "soon", "later", "early", "late", "here", "there", "everywhere", 
  "somewhere", "anywhere", "nowhere", "upstairs", "downstairs", "inside", "outside", "nearby", "far away",
  
  // Common Adjectives
  "good", "bad", "better", "best", "worse", "worst", "big", "small", "large", "little", "great", "new", "old", 
  "young", "long", "short", "high", "low", "wide", "narrow", "thick", "thin", "heavy", "light", "strong", "weak",
  "fast", "slow", "quick", "easy", "hard", "difficult", "simple", "complex", "clear", "unclear", "right", "wrong", 
  "true", "false", "real", "fake", "sure", "certain", "possible", "impossible", "necessary", "important", "special",
  
  // Quantifiers & Numbers (written)
  "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "first", "second", "third", 
  "last", "next", "previous", "following", "recent", "current", "future", "past", "present",
  
  // Conditional & Temporal
  "if", "unless", "until", "while", "since", "because", "although", "though", "whereas", "whenever", "wherever",
  
  // Interjections & Expressions
  "yes", "no", "okay", "ok", "well", "oh", "ah", "hmm", "um", "uh", "actually", "really", "probably", "maybe", 
  "perhaps", "definitely", "certainly", "absolutely", "exactly", "obviously", "clearly", "apparently", "supposedly",
  
  // === SPANISH STOP WORDS ===
  // Artículos
  "el", "la", "los", "las", "un", "una", "unos", "unas", "al", "del",
  
  // Preposiciones
  "en", "con", "de", "por", "para", "a", "desde", "hasta", "hacia", "sobre", "bajo", "entre", "durante", "antes", 
  "después", "contra", "sin", "según", "mediante", "través", "dentro", "fuera", "cerca", "lejos", "encima", 
  "debajo", "delante", "detrás", "alrededor", "junto", "frente", "ante", "tras",
  
  // Conjunciones
  "y", "e", "o", "u", "pero", "sino", "mas", "ni", "que", "aunque", "mientras", "cuando", "donde", "como", 
  "porque", "si", "sea", "pues", "así", "entonces", "por tanto", "sin embargo", "no obstante", "además",
  
  // Pronombres
  "yo", "tú", "él", "ella", "nosotros", "nosotras", "vosotros", "vosotras", "ellos", "ellas", "me", "te", "le", 
  "nos", "os", "les", "se", "mi", "tu", "su", "nuestro", "nuestra", "vuestro", "vuestra", "mío", "tuyo", "suyo", 
  "este", "esta", "estos", "estas", "ese", "esa", "esos", "esas", "aquel", "aquella", "aquellos", "aquellas", 
  "quien", "quienes", "cual", "cuales", "qué", "cuánto", "cuánta", "cuántos", "cuántas", "dónde", "cuándo", 
  "cómo", "por qué",
  
  // Verbos auxiliares y comunes
  "es", "son", "está", "están", "fue", "fueron", "será", "serán", "estará", "estarán", "sea", "sean", "esté", "estén", 
  "fuera", "fueras", "fuese", "fuesen", "ser", "estar", "haber", "tener", "hacer", "poder", "deber", "querer", 
  "saber", "ver", "ir", "venir", "dar", "decir", "poner", "salir", "llegar", "pasar", "quedar", "seguir",
  
  // Adverbios comunes
  "muy", "más", "menos", "tan", "tanto", "cuanto", "mucho", "poco", "todo", "nada", "algo", "alguien", "nadie", 
  "cada", "cualquier", "otro", "otra", "mismo", "misma", "cierto", "cierta", "verdadero", "falso", "nuevo", "nueva", 
  "viejo", "vieja", "grande", "pequeño", "pequeña", "bien", "mal", "mejor", "peor", "primero", "primera", "último", 
  "última", "siguiente", "anterior", "próximo", "próxima", "pasado", "pasada", "presente", "futuro", "futura",
  
  // Adverbios de tiempo y lugar
  "ahora", "entonces", "hoy", "mañana", "ayer", "pronto", "tarde", "temprano", "aquí", "ahí", "allí", "acá", "allá", 
  "donde", "cuando", "mientras", "durante", "siempre", "nunca", "ya", "todavía", "aún", "apenas", "casi",
  
  // Expresiones y modificadores
  "solo", "sola", "solamente", "también", "tampoco", "además", "incluso", "excepto", "salvo", "realmente", 
  "actualmente", "probablemente", "quizás", "tal", "vez", "seguro", "segura", "posible", "imposible", "necesario", 
  "necesaria", "importante", "difícil", "fácil", "simple", "complejo", "compleja", "largo", "larga", "corto", 
  "corta", "alto", "alta", "bajo", "baja", "rápido", "rápida", "lento", "lenta",
  
  // Números (escritos)
  "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "primero", "segundo", "tercero",
  
  // Expresiones comunes
  "sí", "no", "bueno", "vale", "claro", "por favor", "gracias", "de nada", "perdón", "disculpe",
  
  // === CONTEXT-SPECIFIC EXCLUSIONS ===
  // Common legal filler words that don't add search value
  "whereas", "heretofore", "hereinafter", "aforementioned", "aforesaid", "herein", "thereof", "thereto", "hereby",
  "por cuanto", "considerando", "mediante", "por tanto", "en virtud", "respecto", "referente",
]);

/**
 * Advanced ranking weights with contextual multipliers
 */
export const RANK_WEIGHTS = {
  // Base weights
  original: 2.0,
  synonym: 1.0,
  semantic: 0.7,
  keyword: 0.3,
  
  // Context multipliers
  exact_match: 2.5,
  phrase_match: 1.8,
  fuzzy_match: 0.6,
  partial_match: 0.4,
  
  // Language preferences
  primary_language: 1.2,
  secondary_language: 0.9,
  
  // Document type relevance
  document_title: 2.0,
  document_category: 1.5,
  document_keywords: 1.3,
  document_content: 1.0,
  
  // Recency and popularity
  recent_document: 1.1,
  popular_document: 1.15,
  verified_document: 1.25,
};

/**
 * Search configuration metadata
 */
export const SEARCH_CONFIG = {
  version: "2.0.0",
  lastUpdated: "2025-01-15",
  totalSynonyms: Object.keys(SYN_MAP).length,
  totalStopWords: STOP_WORDS.size,
  supportedLanguages: ["en", "es"],
  features: [
    "bilingual_search",
    "phonetic_matching", 
    "fuzzy_matching",
    "legal_specialization",
    "context_awareness",
    "ranking_optimization"
  ]
};

/**
 * Utility functions for search configuration
 */
export const searchUtils = {
  /**
   * Get all synonyms for a term, including cross-language matches
   */
  getAllSynonyms: (term: string): string[] => {
    const normalizedTerm = term.toLowerCase().trim();
    return SYN_MAP[normalizedTerm] || [normalizedTerm];
  },
  
  /**
   * Check if a word should be filtered as a stop word
   */
  isStopWord: (word: string): boolean => {
    return STOP_WORDS.has(word.toLowerCase());
  },
  
  /**
   * Filter stop words from a search query
   */
  filterStopWords: (query: string): string[] => {
    return query
      .toLowerCase()
      .split(/\s+/)
      .filter(word => !STOP_WORDS.has(word) && word.length > 1);
  },
  
  /**
   * Get search weight for a match type
   */
  getWeight: (matchType: keyof typeof RANK_WEIGHTS): number => {
    return RANK_WEIGHTS[matchType] || 1.0;
  },
  
  /**
   * Calculate relevance score for a search match
   */
  calculateRelevance: (
    matchType: keyof typeof RANK_WEIGHTS,
    contextMultipliers: Array<keyof typeof RANK_WEIGHTS> = []
  ): number => {
    const baseWeight = RANK_WEIGHTS[matchType] || 1.0;
    const multiplier = contextMultipliers.reduce(
      (acc, mult) => acc * (RANK_WEIGHTS[mult] || 1.0), 
      1.0
    );
    return baseWeight * multiplier;
  }
};