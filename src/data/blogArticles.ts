// src/data/blogArticles.ts

// Define the type for a single blog article based on the new structure
export type BlogArticle = {
  slug: string;
  title_en: string;
  title_es: string;
  date: string; // Static ISO date string
  summary_en: string;
  summary_es: string;
  content_en: string;
  content_es: string;
};


// Combine all blog article data into one source
export const blogArticles: BlogArticle[] = [
  // Existing articles...
  {
    "slug": "legal-checklist-small-business",
    "title_en": "The Ultimate Legal Checklist for Starting a Small Business",
    "title_es": "Lista Legal Definitiva para Iniciar un Pequeño Negocio",
    "date": "2024-03-11",
    "summary_en": "A step-by-step legal guide for new entrepreneurs—licenses, agreements, and tax forms.",
    "summary_es": "Una guía legal paso a paso para nuevos emprendedores: licencias, contratos y formularios fiscales.",
    "content_en": "<p>Starting a small business involves navigating a complex legal landscape. This checklist covers the essentials:</p><ul><li>Choosing a business structure (Sole Proprietorship, LLC, Corporation)</li><li>Registering your business name</li><li>Obtaining necessary licenses and permits (federal, state, local)</li><li>Understanding tax obligations (EIN, sales tax, income tax)</li><li>Drafting key agreements (Partnership, Operating, Leases)</li><li>Complying with employment laws</li></ul><p>Consulting with legal and financial professionals is crucial.</p>",
    "content_es": "<p>Iniciar un pequeño negocio implica navegar un complejo panorama legal. Esta lista cubre lo esencial:</p><ul><li>Elegir una estructura de negocio (Empresario individual, LLC, Corporación)</li><li>Registrar el nombre de tu negocio</li><li>Obtener las licencias y permisos necesarios (federales, estatales, locales)</li><li>Comprender las obligaciones fiscales (EIN, impuesto sobre ventas, impuesto sobre la renta)</li><li>Redactar acuerdos clave (Sociedad, Operativo, Arrendamientos)</li><li>Cumplir con las leyes laborales</li></ul><p>Consultar con profesionales legales y financieros es crucial.</p>"
  },
  {
    "slug": "ndas-how-to-use",
    "title_en": "When and Why You Need an NDA (Non-Disclosure Agreement)",
    "title_es": "Cuándo y Por Qué Necesitas un NDA (Acuerdo de Confidencialidad)",
    "date": "2024-02-01",
    "summary_en": "Learn what an NDA is, when to use it, and how to protect sensitive business information.",
    "summary_es": "Descubre qué es un NDA, cuándo usarlo y cómo proteger información sensible de negocios.",
    "content_en": "<p>An NDA, or Non-Disclosure Agreement, is a legal contract that establishes confidentiality between parties. Key considerations:</p><ul><li><strong>Purpose:</strong> Protects trade secrets, client lists, financial data, or proprietary ideas during discussions.</li><li><strong>Types:</strong> Mutual (both parties share info) or Unilateral (one party discloses).</li><li><strong>When to Use:</strong> Before pitching investors, hiring contractors with access to sensitive data, exploring partnerships, or discussing inventions.</li><li><strong>Key Clauses:</strong> Definition of confidential info, obligations of receiving party, duration of confidentiality, exclusions.</li></ul><p>An NDA is a fundamental tool for safeguarding intellectual property and business strategies.</p>",
    "content_es": "<p>Un NDA, o Acuerdo de Confidencialidad, es un contrato legal que establece confidencialidad entre las partes. Consideraciones clave:</p><ul><li><strong>Propósito:</strong> Protege secretos comerciales, listas de clientes, datos financieros o ideas propietarias durante discusiones.</li><li><strong>Tipos:</strong> Mutuo (ambas partes comparten información) o Unilateral (una parte revela).</li><li><strong>Cuándo usarlo:</strong> Antes de presentar a inversores, contratar contratistas con acceso a datos sensibles, explorar asociaciones o discutir invenciones.</li><li><strong>Cláusulas Clave:</strong> Definición de información confidencial, obligaciones de la parte receptora, duración de la confidencialidad, exclusiones.</li></ul><p>Un NDA es una herramienta fundamental para salvaguardar la propiedad intelectual y las estrategias de negocio.</p>"
  },
  {
    "slug": "eviction-process",
    "title_en": "Understanding the Eviction Process: Landlord & Tenant Rights",
    "title_es": "Entendiendo el Proceso de Desalojo: Derechos del Propietario e Inquilino",
    "date": "2023-12-19",
    "summary_en": "Explore the legal eviction process and how to avoid common pitfalls as a landlord or tenant.",
    "summary_es": "Explora el proceso legal de desalojo y cómo evitar errores comunes como propietario o inquilino.",
    "content_en": "<p>Eviction is a legal process landlords must follow to remove a tenant. Key steps and rights:</p><ul><li><strong>Valid Reason:</strong> Typically non-payment of rent, lease violations, or illegal activity.</li><li><strong>Notice:</strong> Landlord must provide proper written notice (e.g., 3-day notice to pay or quit, 30-day notice to vacate). State laws vary significantly.</li><li><strong>Court Filing:</strong> If the tenant doesn't comply, the landlord files an unlawful detainer lawsuit.</li><li><strong>Tenant Response:</strong> Tenant has a specific timeframe to respond to the court summons.</li><li><strong>Hearing:</strong> A judge hears the case and issues a ruling.</li><li><strong>Writ of Possession:</strong> If the landlord wins, law enforcement executes the eviction.</li></ul><p>Both landlords and tenants should understand their state's specific laws and seek legal advice if unsure.</p>",
    "content_es": "<p>El desalojo es un proceso legal que los propietarios deben seguir para retirar a un inquilino. Pasos y derechos clave:</p><ul><li><strong>Razón Válida:</strong> Típicamente falta de pago de alquiler, violaciones del contrato de arrendamiento o actividad ilegal.</li><li><strong>Notificación:</strong> El propietario debe proporcionar una notificación escrita adecuada (p. ej., aviso de 3 días para pagar o desalojar, aviso de 30 días para desalojar). Las leyes estatales varían significativamente.</li><li><strong>Presentación Judicial:</strong> Si el inquilino no cumple, el propietario presenta una demanda de desalojo ilegal.</li><li><strong>Respuesta del Inquilino:</strong> El inquilino tiene un plazo específico para responder a la citación judicial.</li><li><strong>Audiencia:</strong> Un juez escucha el caso y emite un fallo.</li><li><strong>Orden de Posesión:</strong> Si el propietario gana, las fuerzas del orden ejecutan el desalojo.</li></ul><p>Tanto propietarios como inquilinos deben comprender las leyes específicas de su estado y buscar asesoramiento legal si no están seguros.</p>"
   },
   {
    "slug": "power-of-attorney-basics",
    "title_en": "Power of Attorney: What It Is and Why It Matters",
    "title_es": "Poder Legal: Qué Es y Por Qué Es Importante",
    "date": "2024-01-12",
    "summary_en": "A clear breakdown of Power of Attorney types and when to create one.",
    "summary_es": "Una guía clara sobre los tipos de poder legal y cuándo crearlo.",
    "content_en": "<p>A Power of Attorney (POA) is a legal document granting someone (the Agent) authority to act on another person's (the Principal) behalf. Types include:</p><ul><li><strong>General POA:</strong> Broad authority over financial matters. Often ends if the Principal becomes incapacitated.</li><li><strong>Durable POA:</strong> Remains effective even if the Principal becomes incapacitated. Crucial for planning.</li><li><strong>Healthcare POA (or Proxy):</strong> Allows the Agent to make medical decisions if the Principal cannot.</li><li><strong>Special/Limited POA:</strong> Grants specific, limited powers for a particular task or time.</li></ul><p>Creating POAs is vital for ensuring your affairs and healthcare wishes are managed if you're unable to do so yourself.</p>",
    "content_es": "<p>Un Poder Legal (POA) es un documento legal que otorga a alguien (el Agente) autoridad para actuar en nombre de otra persona (el Principal). Los tipos incluyen:</p><ul><li><strong>POA General:</strong> Autoridad amplia sobre asuntos financieros. A menudo termina si el Principal queda incapacitado.</li><li><strong>POA Duradero:</strong> Sigue siendo efectivo incluso si el Principal queda incapacitado. Crucial para la planificación.</li><li><strong>POA de Atención Médica (o Proxy):</strong> Permite al Agente tomar decisiones médicas si el Principal no puede.</li><li><strong>POA Especial/Limitado:</strong> Otorga poderes específicos y limitados para una tarea o tiempo particular.</li></ul><p>Crear POAs es vital para asegurar que tus asuntos y deseos de atención médica se gestionen si no puedes hacerlo tú mismo.</p>"
   },
   {
    "slug": "contract-breach",
    "title_en": "What Happens If Someone Breaks a Contract?",
    "title_es": "¿Qué Pasa Si Alguien Rompe un Contrato?",
    "date": "2024-03-01",
    "summary_en": "Understand legal remedies and prevention strategies for breach of contract.",
    "summary_es": "Conoce los remedios legales y estrategias para prevenir el incumplimiento de contratos.",
    "content_en": "<p>A breach of contract occurs when one party fails to fulfill their obligations under a legally binding agreement. Consequences and remedies depend on the contract and the nature of the breach:</p><ul><li><strong>Material Breach:</strong> A significant failure that undermines the contract's core purpose. The non-breaching party may be excused from performance and can sue for damages.</li><li><strong>Minor Breach:</strong> A less significant failure. The non-breaching party must still perform but can sue for damages caused by the breach.</li><li><strong>Remedies:</strong> Compensatory damages (money to cover losses), specific performance (court orders performance), rescission (cancels the contract), reformation (court rewrites part of the contract).</li></ul><p>Clear contract drafting, communication, and negotiation can help prevent breaches. Seek legal advice if a breach occurs.</p>",
    "content_es": "<p>Un incumplimiento de contrato ocurre cuando una parte no cumple con sus obligaciones bajo un acuerdo legalmente vinculante. Las consecuencias y remedios dependen del contrato y la naturaleza del incumplimiento:</p><ul><li><strong>Incumplimiento Material:</strong> Una falla significativa que socava el propósito central del contrato. La parte no incumplidora puede ser excusada de cumplir y puede demandar por daños.</li><li><strong>Incumplimiento Menor:</strong> Una falla menos significativa. La parte no incumplidora aún debe cumplir pero puede demandar por daños causados por el incumplimiento.</li><li><strong>Remedios:</strong> Daños compensatorios (dinero para cubrir pérdidas), cumplimiento específico (el tribunal ordena el cumplimiento), rescisión (cancela el contrato), reforma (el tribunal reescribe parte del contrato).</li></ul><p>Una redacción clara del contrato, comunicación y negociación pueden ayudar a prevenir incumplimientos. Busca asesoramiento legal si ocurre un incumplimiento.</p>"
   },
   {
    "slug": "child-custody-explained",
    "title_en": "Child Custody Agreements: A Simple Guide for Parents",
    "title_es": "Acuerdos de Custodia de Menores: Una Guía para Padres",
    "date": "2024-03-25",
    "summary_en": "Learn about joint custody, sole custody, and how to create a fair plan.",
    "summary_es": "Aprende sobre custodia compartida, exclusiva y cómo crear un plan justo.",
    "content_en": "<p>Child custody agreements determine where children live and who makes decisions for them after parents separate. Key concepts:</p><ul><li><strong>Legal Custody:</strong> Right to make major decisions (education, healthcare, religion). Can be Joint or Sole.</li><li><strong>Physical Custody:</strong> Where the child primarily resides. Can be Joint (significant time with both parents) or Sole (primarily with one parent, visitation for the other).</li><li><strong>Best Interests of the Child:</strong> Courts prioritize the child's well-being, considering factors like parental stability, child's preference (if old enough), and history of care.</li><li><strong>Parenting Plan:</strong> A detailed schedule outlining visitation, holidays, transportation, and communication.</li></ul><p>Mediation or collaboration is often encouraged to create a plan. Formalizing the agreement legally is essential.</p>",
    "content_es": "<p>Los acuerdos de custodia de menores determinan dónde viven los niños y quién toma decisiones por ellos después de que los padres se separan. Conceptos clave:</p><ul><li><strong>Custodia Legal:</strong> Derecho a tomar decisiones importantes (educación, atención médica, religión). Puede ser Conjunta o Única.</li><li><strong>Custodia Física:</strong> Dónde reside principalmente el niño. Puede ser Conjunta (tiempo significativo con ambos padres) o Única (principalmente con un padre, visitas para el otro).</li><li><strong>Interés Superior del Niño:</strong> Los tribunales priorizan el bienestar del niño, considerando factores como la estabilidad parental, la preferencia del niño (si tiene edad suficiente) y el historial de cuidado.</li><li><strong>Plan de Crianza:</strong> Un cronograma detallado que describe visitas, días festivos, transporte y comunicación.</li></ul><p>A menudo se fomenta la mediación o la colaboración para crear un plan. Es esencial formalizar el acuerdo legalmente.</p>"
   },
  {
    "slug": "digital-signatures-legal",
    "title_en": "Are Digital Signatures Legally Binding in the U.S.?",
    "title_es": "¿Son Legalmente Válidas las Firmas Digitales en EE. UU.?",
    "date": "2024-03-30",
    "summary_en": "Understand the legal status of e-signatures under U.S. law.",
    "summary_es": "Comprende la validez legal de las firmas electrónicas según la ley estadounidense.",
    "content_en": "Coming soon...",
    "content_es": "Próximamente..."
  },
  {
    "slug": "notarized-documents-online",
    "title_en": "Can You Notarize Documents Online? What to Know",
    "title_es": "¿Se Puede Notariar un Documento en Línea? Lo Que Debes Saber",
    "date": "2024-03-28",
    "summary_en": "Learn how online notarization works and which states support it.",
    "summary_es": "Aprende cómo funciona la notarización en línea y qué estados la permiten.",
    "content_en": "Coming soon...",
    "content_es": "Próximamente..."
  },
  {
    "slug": "legal-documents-immigrants",
    "title_en": "Top 5 Legal Documents Immigrants Need in the U.S.",
    "title_es": "Los 5 Documentos Legales Más Importantes para Inmigrantes en EE. UU.",
    "date": "2024-03-27",
    "summary_en": "From work permits to affidavits—here’s what new residents should prepare.",
    "summary_es": "Desde permisos de trabajo hasta declaraciones juradas—esto es lo que deben preparar los nuevos residentes.",
    "content_en": "Coming soon...",
    "content_es": "Próximamente..."
  },
    {
    "slug": "contract-basics",
    "title_en": "Contract Basics: What Every Agreement Must Include",
    "title_es": "Contratos Básicos: Qué Debe Incluir Todo Acuerdo",
    "date": "2024-04-01",
    "summary_en": "Understand the essential parts of any valid legal contract.",
    "summary_es": "Conoce las partes esenciales de cualquier contrato legal válido.",
    "content_en": "Coming soon...",
    "content_es": "Próximamente..."
  },
  {
    "slug": "green-card-process",
    "title_en": "Understanding the Green Card Application Process",
    "title_es": "Entendiendo el Proceso de Solicitud de la Green Card",
    "date": "2024-04-02",
    "summary_en": "An overview of steps, forms, and documents for lawful permanent residency.",
    "summary_es": "Resumen de los pasos, formularios y documentos necesarios para la residencia legal permanente.",
    "content_en": "Coming soon...",
    "content_es": "Próximamente..."
  },
  {
    "slug": "why-you-need-a-will",
    "title_en": "Why You Need a Will — No Matter Your Age",
    "title_es": "Por Qué Necesitas un Testamento — Sin Importar Tu Edad",
    "date": "2024-04-03",
    "summary_en": "Learn how a simple will can protect your assets and your family.",
    "summary_es": "Descubre cómo un testamento puede proteger tus bienes y tu familia.",
    "content_en": "Coming soon...",
    "content_es": "Próximamente..."
  },
  {
    "slug": "eviction-letter-guide",
    "title_en": "How to Write a Legal Eviction Letter",
    "title_es": "Cómo Escribir una Carta Legal de Desalojo",
    "date": "2024-04-04",
    "summary_en": "Steps for landlords to give notice properly and avoid legal issues.",
    "summary_es": "Pasos para que los propietarios notifiquen correctamente y eviten problemas legales.",
    "content_en": "Coming soon...",
    "content_es": "Próximamente..."
  },
  {
    "slug": "buying-home-checklist",
    "title_en": "Legal Checklist for First-Time Homebuyers",
    "title_es": "Lista Legal para Compradores de Vivienda por Primera Vez",
    "date": "2024-04-05",
    "summary_en": "From purchase agreements to title searches — protect your real estate deal.",
    "summary_es": "Desde contratos de compra hasta títulos de propiedad — protege tu transacción inmobiliaria.",
    "content_en": "Coming soon...",
    "content_es": "Próximamente..."
  },
  {
    "slug": "identity-theft-response",
    "title_en": "What to Do if You're a Victim of Identity Theft",
    "title_es": "Qué Hacer Si Eres Víctima de Robo de Identidad",
    "date": "2024-04-06",
    "summary_en": "Your rights and the legal steps you should take immediately.",
    "summary_es": "Tus derechos y los pasos legales que debes tomar de inmediato.",
    "content_en": "Coming soon...",
    "content_es": "Próximamente..."
  },
  {
    "slug": "notarized-vs-witnessed",
    "title_en": "Notarized vs Witnessed: What's the Difference?",
    "title_es": "Notariado vs Testificado: ¿Cuál es la Diferencia?",
    "date": "2024-04-07",
    "summary_en": "When to use each form of document verification.",
    "summary_es": "Cuándo usar cada forma de verificación documental.",
    "content_en": "Coming soon...",
    "content_es": "Próximamente..."
  },
  {
    "slug": "nda-vs-noncompete",
    "title_en": "NDA vs. Non-Compete: Which One Do You Need?",
    "title_es": "NDA vs. No Competencia: ¿Cuál Necesitas?",
    "date": "2024-04-08",
    "summary_en": "Compare these two common business agreements.",
    "summary_es": "Compara estos dos contratos comunes en negocios.",
    "content_en": "Coming soon...",
    "content_es": "Próximamente..."
  },
  {
    "slug": "how-to-hire-freelancers",
    "title_en": "How to Legally Hire Freelancers in the U.S.",
    "title_es": "Cómo Contratar Freelancers Legalmente en EE.UU.",
    "date": "2024-04-09",
    "summary_en": "Independent contractor rules, contracts, and tax forms.",
    "summary_es": "Reglas para contratistas independientes, contratos y formularios fiscales.",
    "content_en": "Coming soon...",
    "content_es": "Próximamente..."
  },
   {
    "slug": "legal-name-change",
    "title_en": "How to Legally Change Your Name in the U.S.",
    "title_es": "Cómo Cambiar Legalmente tu Nombre en EE. UU.",
    "date": "2024-04-11",
    "summary_en": "Step-by-step process for a legal name change in any state.",
    "summary_es": "Proceso paso a paso para cambiar legalmente tu nombre en cualquier estado.",
    "content_en": "Coming soon...",
    "content_es": "Próximamente..."
  },
  {
    "slug": "how-to-draft-bill-of-sale",
    "title_en": "How to Draft a Legal Bill of Sale",
    "title_es": "Cómo Redactar un Contrato de Compra-Venta Legal",
    "date": "2024-04-12",
    "summary_en": "Ensure your private sale is secure with a properly formatted bill of sale.",
    "summary_es": "Asegura tu venta privada con un contrato de compra-venta bien redactado.",
    "content_en": "Coming soon...",
    "content_es": "Próximamente..."
  },
  {
    "slug": "divorce-paperwork-guide",
    "title_en": "The Paperwork You Need to File for Divorce",
    "title_es": "Los Documentos Necesarios para Solicitar el Divorcio",
    "date": "2024-04-13",
    "summary_en": "A checklist of forms and filings for divorce in your state.",
    "summary_es": "Lista de formularios y trámites para el divorcio en tu estado.",
    "content_en": "Coming soon...",
    "content_es": "Próximamente..."
  },
  {
    "slug": "start-llc-online",
    "title_en": "How to Start an LLC Online in 2024",
    "title_es": "Cómo Crear una LLC en Línea en 2024",
    "date": "2024-04-14",
    "summary_en": "File your Limited Liability Company without a lawyer using these tools.",
    "summary_es": "Crea tu empresa de responsabilidad limitada sin abogado usando estas herramientas.",
    "content_en": "Coming soon...",
    "content_es": "Próximamente..."
  },
  {
    "slug": "do-i-need-a-lawyer",
    "title_en": "Do I Need a Lawyer or Can I Do It Myself?",
    "title_es": "¿Necesito un Abogado o Puedo Hacerlo Yo Mismo?",
    "date": "2024-04-15",
    "summary_en": "When it's safe to use DIY legal tools—and when it's not.",
    "summary_es": "Cuándo puedes usar herramientas legales por tu cuenta y cuándo no.",
    "content_en": "Coming soon...",
    "content_es": "Próximamente..."
  },
  {
    "slug": "pet-agreements-renters",
    "title_en": "Pet Agreements for Renters: What to Include",
    "title_es": "Acuerdos de Mascotas para Inquilinos: Qué Incluir",
    "date": "2024-04-16",
    "summary_en": "How to make pets part of a lease agreement legally and clearly.",
    "summary_es": "Cómo incluir legalmente a las mascotas en un contrato de arrendamiento.",
    "content_en": "Coming soon...",
    "content_es": "Próximamente..."
  },
  {
    "slug": "freelancer-contract-template",
    "title_en": "Free Freelancer Contract Template for 2024",
    "title_es": "Plantilla Gratis de Contrato para Freelancers 2024",
    "date": "2024-04-17",
    "summary_en": "Protect your freelance work with a simple contract template.",
    "summary_es": "Protege tu trabajo freelance con una plantilla de contrato sencilla.",
    "content_en": "Coming soon...",
    "content_es": "Próximamente..."
  },
  {
    "slug": "medical-consent-minors",
    "title_en": "Medical Consent Forms for Minors: What Parents Should Know",
    "title_es": "Formularios de Consentimiento Médico para Menores: Lo Que Deben Saber los Padres",
    "date": "2024-04-18",
    "summary_en": "Why a consent form is vital when your child is under someone else’s care.",
    "summary_es": "Por qué un formulario de consentimiento médico es vital cuando tu hijo está al cuidado de otra persona.",
    "content_en": "Coming soon...",
    "content_es": "Próximamente..."
  },
  {
    "slug": "legal-docs-for-startups",
    "title_en": "Top 7 Legal Documents Every Startup Needs",
    "title_es": "Los 7 Documentos Legales Que Toda Startup Necesita",
    "date": "2024-04-19",
    "summary_en": "From founder agreements to NDAs—cover your legal bases early.",
    "summary_es": "Desde acuerdos entre socios hasta NDAs—protege tu startup desde el inicio.",
    "content_en": "Coming soon...",
    "content_es": "Próximamente..."
  },
  {
    "slug": "power-of-attorney-guide",
    "title_en": "General vs. Limited Power of Attorney: What's the Difference?",
    "title_es": "Poder General vs. Limitado: ¿Cuál es la Diferencia?",
    "date": "2024-04-20",
    "summary_en": "Understand when each type of POA is appropriate and why it matters.",
    "summary_es": "Conoce cuándo se usa cada tipo de poder legal y por qué importa.",
    "content_en": "Coming soon...",
    "content_es": "Próximamente..."
  }
];
