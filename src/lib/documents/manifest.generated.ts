// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
// Run: node scripts/generate-document-manifest.mjs

export interface GeneratedMetadata {
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
  estimatedTime?: string;
  complexity?: "simple" | "intermediate" | "complex";
  translations: {
    en: { name: string; description: string; aliases: string[] };
    es: { name: string; description: string; aliases: string[] };
  };
}

export interface DocumentManifestEntry {
  id: string;
  importPath: string;
  meta: GeneratedMetadata;
}

export const DOCUMENT_MANIFEST: DocumentManifestEntry[] = [
  {
    id: "ach-authorization-form",
    importPath: "./us/ach-authorization-form",
    meta: {
      id: "ach-authorization-form",
      title: "ACH Authorization Form",
      description:
        "Authorize automatic bank transfers (ACH) for recurring or one-time payments.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "bank authorization",
        "automatic payment form",
        "direct debit authorization",
        "electronic payment form",
        "autorización bancaria",
        "formulario de pago automático",
        "autorización de débito directo",
        "formulario de pago electrónico",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "ACH Authorization Form",
          description:
            "Authorize automatic bank transfers (ACH) for recurring or one-time payments.",
          aliases: [
            "bank authorization",
            "automatic payment form",
            "direct debit authorization",
            "electronic payment form",
          ],
        },
        es: {
          name: "Formulario de Autorización ACH",
          description:
            "Permite retiros automáticos del banco para facturas, renta o pagos de préstamos. Forma conveniente de configurar pagos recurrentes.",
          aliases: [
            "autorización bancaria",
            "formulario de pago automático",
            "autorización de débito directo",
            "formulario de pago electrónico",
          ],
        },
      },
    },
  },
  {
    id: "advance-directive",
    importPath: "./us/advance-directive",
    meta: {
      id: "advance-directive",
      title: "Advance Directive",
      description:
        "Create a comprehensive advance healthcare directive to specify your medical treatment preferences and appoint a healthcare agent.",
      category: "Estate Planning",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "advance healthcare directive",
        "living will with healthcare proxy",
        "medical directive",
        "healthcare power of attorney with living will",
        "advance medical directive",
        "healthcare decisions document",
        "directiva de atención médica anticipada",
        "testamento vital con poder médico",
        "directiva médica",
        "poder para atención médica con testamento vital",
        "directiva médica anticipada",
        "documento de decisiones médicas",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Advance Directive",
          description:
            "Create a comprehensive advance healthcare directive to specify your medical treatment preferences and appoint a healthcare agent.",
          aliases: [
            "advance healthcare directive",
            "living will with healthcare proxy",
            "medical directive",
            "healthcare power of attorney with living will",
            "advance medical directive",
            "healthcare decisions document",
          ],
        },
        es: {
          name: "Directiva Médica Anticipada",
          description:
            "Dile a los médicos tus deseos médicos si no puedes hablar por ti mismo. Cubre soporte vital, tubos de alimentación y cuidado al final de la vida.",
          aliases: [
            "directiva de atención médica anticipada",
            "testamento vital con poder médico",
            "directiva médica",
            "poder para atención médica con testamento vital",
            "directiva médica anticipada",
            "documento de decisiones médicas",
          ],
        },
      },
    },
  },
  {
    id: "advance-directive-revocation",
    importPath: "./us/advance-directive-revocation",
    meta: {
      id: "advance-directive-revocation",
      title: "Advance Directive Revocation",
      description:
        "Take back control over your healthcare decisions by officially canceling your previous medical directive.",
      category: "Estate Planning",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "revocation of advance directive",
        "advance healthcare directive revocation",
        "cancellation of advance directive",
        "advance directive cancellation",
        "revoke healthcare directive",
        "cancel medical directive",
        "revocación de directiva anticipada",
        "revocación de directiva médica anticipada",
        "cancelación de directiva anticipada",
        "cancelación de directiva médica",
        "revocar directiva médica",
        "cancelar directiva médica",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Advance Directive Revocation",
          description:
            "Take back control over your healthcare decisions by officially canceling your previous medical directive.",
          aliases: [
            "revocation of advance directive",
            "advance healthcare directive revocation",
            "cancellation of advance directive",
            "advance directive cancellation",
            "revoke healthcare directive",
            "cancel medical directive",
          ],
        },
        es: {
          name: "Revocación de Directiva Médica Anticipada",
          description:
            "Documento legal para revocar o cancelar una directiva médica anticipada ejecutada previamente.",
          aliases: [
            "revocación de directiva anticipada",
            "revocación de directiva médica anticipada",
            "cancelación de directiva anticipada",
            "cancelación de directiva médica",
            "revocar directiva médica",
            "cancelar directiva médica",
          ],
        },
      },
    },
  },
  {
    id: "affidavit",
    importPath: "./us/affidavit",
    meta: {
      id: "affidavit",
      title: "General Affidavit",
      description:
        "Provide legally binding testimony for court cases and official proceedings. Strengthen your case with sworn statements.",
      category: "Personal",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "sworn statement",
        "sworn declaration",
        "statement under oath",
        "legal affidavit",
        "declaración jurada",
        "declaración bajo juramento",
        "afidávit legal",
        "declaración jurada legal",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "General Affidavit",
          description:
            "Provide legally binding testimony for court cases and official proceedings. Strengthen your case with sworn statements.",
          aliases: [
            "sworn statement",
            "sworn declaration",
            "statement under oath",
            "legal affidavit",
          ],
        },
        es: {
          name: "Declaración Jurada General",
          description:
            "Acelera trámites legales y burocráticos con declaraciones juradas oficiales. Evita comparecencias innecesarias en cortes y oficinas gubernamentales.",
          aliases: [
            "declaración jurada",
            "declaración bajo juramento",
            "afidávit legal",
            "declaración jurada legal",
          ],
        },
      },
    },
  },
  {
    id: "affidavit-general",
    importPath: "./us/affidavit-general",
    meta: {
      id: "affidavit-general",
      title: "Affidavit (General)",
      description:
        "A sworn written statement confirmed by oath, often used as evidence.",
      category: "Personal",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "sworn statement",
        "declaration",
        "official statement",
        "statement under oath",
        "declaración jurada",
        "declaración oficial",
        "declaración bajo juramento",
        "declaración juramentada",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Affidavit (General)",
          description:
            "A sworn written statement confirmed by oath, often used as evidence.",
          aliases: [
            "sworn statement",
            "declaration",
            "official statement",
            "statement under oath",
          ],
        },
        es: {
          name: "Declaración Jurada (General)",
          description:
            "Formato general de declaración jurada para varias situaciones legales. Documento flexible para testimonios y declaraciones de hechos.",
          aliases: [
            "declaración jurada",
            "declaración oficial",
            "declaración bajo juramento",
            "declaración juramentada",
          ],
        },
      },
    },
  },
  {
    id: "affidavit-of-death",
    importPath: "./us/affidavit-of-death",
    meta: {
      id: "affidavit-of-death",
      title: "Affidavit of Death",
      description:
        "Legal document certifying the death of a person when a death certificate is unavailable or as additional proof of death.",
      category: "Legal",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "death affidavit",
        "affidavit certifying death",
        "proof of death affidavit",
        "death verification affidavit",
        "affidavit of deceased person",
        "sworn statement of death",
        "declaración jurada de defunción",
        "declaración jurada certificando muerte",
        "declaración jurada de prueba de muerte",
        "declaración jurada de verificación de muerte",
        "declaración jurada de persona fallecida",
        "declaración jurada de muerte",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Affidavit of Death",
          description:
            "Legal document certifying the death of a person when a death certificate is unavailable or as additional proof of death.",
          aliases: [
            "death affidavit",
            "affidavit certifying death",
            "proof of death affidavit",
            "death verification affidavit",
            "affidavit of deceased person",
            "sworn statement of death",
          ],
        },
        es: {
          name: "Declaración Jurada de Muerte",
          description:
            "Certifica legalmente la muerte de alguien para propósitos de herencia y seguros. Requerido para transferir bienes y cobrar beneficios.",
          aliases: [
            "declaración jurada de defunción",
            "declaración jurada certificando muerte",
            "declaración jurada de prueba de muerte",
            "declaración jurada de verificación de muerte",
            "declaración jurada de persona fallecida",
            "declaración jurada de muerte",
          ],
        },
      },
    },
  },
  {
    id: "affidavit-of-heirship",
    importPath: "./us/affidavit-of-heirship",
    meta: {
      id: "affidavit-of-heirship",
      title: "Affidavit of Heirship",
      description:
        "Legal document establishing the heirs of a deceased person for property transfer and inheritance purposes.",
      category: "Legal",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "heirship affidavit",
        "affidavit of inheritance",
        "heir determination affidavit",
        "family tree affidavit",
        "descent affidavit",
        "heirship declaration",
        "declaración jurada de herencia",
        "declaración jurada de sucesión",
        "declaración de herederos",
        "declaración jurada familiar",
        "declaración de descendencia",
        "declaración de herencia",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Affidavit of Heirship",
          description:
            "Legal document establishing the heirs of a deceased person for property transfer and inheritance purposes.",
          aliases: [
            "heirship affidavit",
            "affidavit of inheritance",
            "heir determination affidavit",
            "family tree affidavit",
            "descent affidavit",
            "heirship declaration",
          ],
        },
        es: {
          name: "Declaración Jurada de Herederos",
          description:
            "Establece quién hereda propiedad cuando alguien muere sin testamento. Prueba relaciones familiares para transferencia de bienes.",
          aliases: [
            "declaración jurada de herencia",
            "declaración jurada de sucesión",
            "declaración de herederos",
            "declaración jurada familiar",
            "declaración de descendencia",
            "declaración de herencia",
          ],
        },
      },
    },
  },
  {
    id: "affidavit-of-identity",
    importPath: "./us/affidavit-of-identity",
    meta: {
      id: "affidavit-of-identity",
      title: "Affidavit of Identity",
      description:
        "Sworn statement verifying identity for legal or administrative purposes.",
      category: "Government & Legal Services",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "identity affidavit",
        "sworn identity statement",
        "declaración de identidad",
        "declaración jurada de identidad",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Affidavit of Identity",
          description:
            "Sworn statement verifying identity for legal or administrative purposes.",
          aliases: ["identity affidavit", "sworn identity statement"],
        },
        es: {
          name: "Declaración Jurada de Identidad",
          description:
            "Prueba tu identidad para procedimientos legales cuando la identificación oficial se pierde o es cuestionada. Declaración jurada de quién eres.",
          aliases: [
            "declaración de identidad",
            "declaración jurada de identidad",
          ],
        },
      },
    },
  },
  {
    id: "affidavit-of-survivorship",
    importPath: "./us/affidavit-of-survivorship",
    meta: {
      id: "affidavit-of-survivorship",
      title: "Affidavit of Survivorship",
      description:
        "Legal document for surviving joint owners to establish sole ownership of property after the death of a co-owner.",
      category: "Legal",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "survivorship affidavit",
        "joint tenant survivorship affidavit",
        "surviving owner affidavit",
        "right of survivorship affidavit",
        "survivorship deed affidavit",
        "joint ownership death affidavit",
        "declaración jurada de supervivencia",
        "declaración jurada de supervivencia de inquilinos conjuntos",
        "declaración jurada de propietario superviviente",
        "declaración jurada de derecho de supervivencia",
        "declaración jurada de escritura de supervivencia",
        "declaración jurada de muerte de propiedad conjunta",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Affidavit of Survivorship",
          description:
            "Legal document for surviving joint owners to establish sole ownership of property after the death of a co-owner.",
          aliases: [
            "survivorship affidavit",
            "joint tenant survivorship affidavit",
            "surviving owner affidavit",
            "right of survivorship affidavit",
            "survivorship deed affidavit",
            "joint ownership death affidavit",
          ],
        },
        es: {
          name: "Declaración Jurada de Supervivencia",
          description:
            "Transfiere propiedad de tenencia conjunta al propietario sobreviviente después de la muerte. Evita el proceso de sucesión para propiedad en tenencia conjunta.",
          aliases: [
            "declaración jurada de supervivencia",
            "declaración jurada de supervivencia de inquilinos conjuntos",
            "declaración jurada de propietario superviviente",
            "declaración jurada de derecho de supervivencia",
            "declaración jurada de escritura de supervivencia",
            "declaración jurada de muerte de propiedad conjunta",
          ],
        },
      },
    },
  },
  {
    id: "affiliate-marketing-agreement",
    importPath: "./us/affiliate-marketing-agreement",
    meta: {
      id: "affiliate-marketing-agreement",
      title: "Affiliate Marketing Agreement",
      description:
        "Expand your marketing reach and boost sales without upfront costs. Attract motivated partners who only earn when they deliver results.",
      category: "Marketing & Advertising",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "affiliate program agreement",
        "commission agreement",
        "partner marketing agreement",
        "acuerdo de programa de afiliados",
        "acuerdo de comisiones",
        "acuerdo de marketing de socios",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Affiliate Marketing Agreement",
          description:
            "Expand your marketing reach and boost sales without upfront costs. Attract motivated partners who only earn when they deliver results.",
          aliases: [
            "affiliate program agreement",
            "commission agreement",
            "partner marketing agreement",
          ],
        },
        es: {
          name: "Acuerdo de Marketing de Afiliados",
          description:
            "Establece terminos de comision y protege tu negocio al trabajar con afiliados que promocionan tus productos por un porcentaje de las ventas.",
          aliases: [
            "acuerdo de programa de afiliados",
            "acuerdo de comisiones",
            "acuerdo de marketing de socios",
          ],
        },
      },
    },
  },
  {
    id: "agricultural-agreement",
    importPath: "./us/agricultural-agreement",
    meta: {
      id: "agricultural-agreement",
      title: "Agricultural Agreement",
      description:
        "Agreement for farming, agricultural services, and crop sharing arrangements.",
      category: "Agriculture & Farming",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "farming agreement",
        "crop share agreement",
        "agricultural services contract",
        "acuerdo de agricultura",
        "contrato de servicios agrícolas",
        "contrato de servicios agrícolas legal",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Agricultural Agreement",
          description:
            "Agreement for farming, agricultural services, and crop sharing arrangements.",
          aliases: [
            "farming agreement",
            "crop share agreement",
            "agricultural services contract",
          ],
        },
        es: {
          name: "Acuerdo Agrícola",
          description:
            "Maximiza la rentabilidad de tu tierra agrícola y reduce riesgos operativos. Establece asociaciones que beneficien a todos los participantes.",
          aliases: [
            "acuerdo de agricultura",
            "contrato de servicios agrícolas",
            "contrato de servicios agrícolas legal",
          ],
        },
      },
    },
  },
  {
    id: "app-development-agreement",
    importPath: "./us/app-development-agreement",
    meta: {
      id: "app-development-agreement",
      title: "App Development Agreement",
      description:
        "Agreement for mobile and web application development services.",
      category: "Technology & IT",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "mobile app development",
        "software development contract",
        "desarrollo de app móvil",
        "contrato de desarrollo de software",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "App Development Agreement",
          description:
            "Agreement for mobile and web application development services.",
          aliases: ["mobile app development", "software development contract"],
        },
        es: {
          name: "Acuerdo de Desarrollo de Aplicaciones",
          description:
            "Protege tu idea de app y asegura un desarrollo exitoso. Establece expectativas claras sobre funcionalidades, cronogramas y propiedad intelectual.",
          aliases: [
            "desarrollo de app móvil",
            "contrato de desarrollo de software",
          ],
        },
      },
    },
  },
  {
    id: "arbitration-agreement",
    importPath: "./us/arbitration-agreement",
    meta: {
      id: "arbitration-agreement",
      title: "Arbitration Agreement",
      description:
        "Agreement requiring disputes to be resolved through arbitration instead of court litigation.",
      category: "Dispute Resolution",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "binding arbitration agreement",
        "dispute resolution agreement",
        "acuerdo de arbitraje vinculante",
        "acuerdo de resolución de disputas",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Arbitration Agreement",
          description:
            "Agreement requiring disputes to be resolved through arbitration instead of court litigation.",
          aliases: [
            "binding arbitration agreement",
            "dispute resolution agreement",
          ],
        },
        es: {
          name: "Acuerdo de Arbitraje",
          description:
            "Ahorra tiempo y dinero en disputas legales al evitar cortes costosas. Resuelve conflictos de manera privada y eficiente con decisiones vinculantes.",
          aliases: [
            "acuerdo de arbitraje vinculante",
            "acuerdo de resolución de disputas",
          ],
        },
      },
    },
  },
  {
    id: "architect-contract",
    importPath: "./us/architect-contract",
    meta: {
      id: "architect-contract",
      title: "Architect Services Contract",
      description:
        "Professional services agreement for architectural design, planning, and construction administration.",
      category: "Construction",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "architectural services agreement",
        "design professional contract",
        "architect agreement",
        "acuerdo de servicios arquitectónicos",
        "contrato de profesional de diseño",
        "acuerdo de arquitecto",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Architect Services Contract",
          description:
            "Professional services agreement for architectural design, planning, and construction administration.",
          aliases: [
            "architectural services agreement",
            "design professional contract",
            "architect agreement",
          ],
        },
        es: {
          name: "Contrato de Servicios de Arquitecto",
          description:
            "Asegura un diseño profesional que cumpla tus expectativas y presupuesto. Protege tu inversión con términos claros sobre cambios y responsabilidades.",
          aliases: [
            "acuerdo de servicios arquitectónicos",
            "contrato de profesional de diseño",
            "acuerdo de arquitecto",
          ],
        },
      },
    },
  },
  {
    id: "articles-of-incorporation",
    importPath: "./us/articles-of-incorporation",
    meta: {
      id: "articles-of-incorporation",
      title: "Articles of Incorporation",
      description:
        "Protect your personal wealth from business liabilities and gain credibility with customers. Open doors to business financing and tax advantages.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "business incorporation",
        "corporate charter",
        "incorporation documents",
        "company formation",
        "incorporación de negocio",
        "estatutos corporativos",
        "documentos de incorporación",
        "formación de la empresa",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Articles of Incorporation",
          description:
            "Protect your personal wealth from business liabilities and gain credibility with customers. Open doors to business financing and tax advantages.",
          aliases: [
            "business incorporation",
            "corporate charter",
            "incorporation documents",
            "company formation",
          ],
        },
        es: {
          name: "Acta Constitutiva",
          description:
            "Protege tu patrimonio personal de demandas comerciales y obtén credibilidad empresarial. Abre puertas a financiamiento y beneficios fiscales.",
          aliases: [
            "incorporación de negocio",
            "estatutos corporativos",
            "documentos de incorporación",
            "formación de la empresa",
          ],
        },
      },
    },
  },
  {
    id: "articles-of-incorporation-biz",
    importPath: "./us/articles-of-incorporation-biz",
    meta: {
      id: "articles-of-incorporation-biz",
      title: "Articles of Incorporation (Business)",
      description:
        "Formal document filed with the state to create a corporation for business entities.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "form corporation",
        "incorporate business",
        "business incorporation",
        "formar corporación",
        "incorporar negocio",
        "incorporación empresarial",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Articles of Incorporation (Business)",
          description:
            "Formal document filed with the state to create a corporation for business entities.",
          aliases: [
            "form corporation",
            "incorporate business",
            "business incorporation",
          ],
        },
        es: {
          name: "Acta Constitutiva (Empresarial)",
          description:
            "Separa legalmente tu negocio de tus finanzas personales y reduce riesgos. Obten protección legal y credibilidad ante clientes e inversionistas.",
          aliases: [
            "formar corporación",
            "incorporar negocio",
            "incorporación empresarial",
          ],
        },
      },
    },
  },
  {
    id: "assignment-agreement",
    importPath: "./us/assignment-agreement",
    meta: {
      id: "assignment-agreement",
      title: "Assignment Agreement",
      description:
        "Transfer contractual responsibilities legally while protecting your reputation. Exit commitments you can fulfill without penalties.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "contract assignment",
        "right assignment",
        "assignment agreement",
        "cesión de contrato",
        "cesión de derechos",
        "acuerdo de cesión",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Assignment Agreement",
          description:
            "Transfer contractual responsibilities legally while protecting your reputation. Exit commitments you can fulfill without penalties.",
          aliases: [
            "contract assignment",
            "right assignment",
            "assignment agreement",
          ],
        },
        es: {
          name: "Acuerdo de Cesión",
          description:
            "Transfiere responsabilidades contractuales legalmente y evita penalizaciones. Protege tu reputación cuando no puedes cumplir compromisos.",
          aliases: [
            "cesión de contrato",
            "cesión de derechos",
            "acuerdo de cesión",
          ],
        },
      },
    },
  },
  {
    id: "athletic-scholarship-agreement",
    importPath: "./us/athletic-scholarship-agreement",
    meta: {
      id: "athletic-scholarship-agreement",
      title: "Athletic Scholarship Agreement",
      description:
        "Agreement for athletic scholarships and student-athlete commitments.",
      category: "Academic & Research",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "sports scholarship contract",
        "student athlete agreement",
        "athletic aid agreement",
        "contrato de beca deportiva",
        "acuerdo de atleta estudiantil",
        "acuerdo de ayuda atlética",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Athletic Scholarship Agreement",
          description:
            "Agreement for athletic scholarships and student-athlete commitments.",
          aliases: [
            "sports scholarship contract",
            "student athlete agreement",
            "athletic aid agreement",
          ],
        },
        es: {
          name: "Acuerdo de Beca Atlética",
          description:
            "Asegura tu beca deportiva y protege tu futuro educativo. Establece expectativas claras que beneficien tanto al estudiante como a la institución.",
          aliases: [
            "contrato de beca deportiva",
            "acuerdo de atleta estudiantil",
            "acuerdo de ayuda atlética",
          ],
        },
      },
    },
  },
  {
    id: "auto-repair-agreement",
    importPath: "./us/auto-repair-agreement",
    meta: {
      id: "auto-repair-agreement",
      title: "Auto Repair Agreement",
      description:
        "Agreement between auto repair shop and customer for vehicle repair services.",
      category: "Transportation & Automotive",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "vehicle repair agreement",
        "automotive service agreement",
        "car repair contract",
        "acuerdo de reparación de vehículos",
        "contrato de servicio automotriz",
        "contrato de reparación de automóvil",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Auto Repair Agreement",
          description:
            "Agreement between auto repair shop and customer for vehicle repair services.",
          aliases: [
            "vehicle repair agreement",
            "automotive service agreement",
            "car repair contract",
          ],
        },
        es: {
          name: "Acuerdo de Reparación Automotriz",
          description:
            "Protege tu inversión en reparaciones automotrices y evita sobrecostos inesperados. Asegura garantías de trabajo y transparencia en precios.",
          aliases: [
            "acuerdo de reparación de vehículos",
            "contrato de servicio automotriz",
            "contrato de reparación de automóvil",
          ],
        },
      },
    },
  },
  {
    id: "automotive-service-agreement",
    importPath: "./us/automotive-service-agreement",
    meta: {
      id: "automotive-service-agreement",
      title: "Automotive Service Agreement",
      description: "Agreement for automotive repair and maintenance services.",
      category: "Transportation & Automotive",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "car repair agreement",
        "vehicle service contract",
        "auto maintenance agreement",
        "acuerdo de reparación de autos",
        "contrato de servicio vehicular",
        "acuerdo de mantenimiento automotriz",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Automotive Service Agreement",
          description:
            "Agreement for automotive repair and maintenance services.",
          aliases: [
            "car repair agreement",
            "vehicle service contract",
            "auto maintenance agreement",
          ],
        },
        es: {
          name: "Acuerdo de Servicio Automotriz",
          description:
            "Extiende la vida útil de tu vehículo y evita reparaciones costosas. Asegura mantenimiento regular con precios fijos y garantías de servicio.",
          aliases: [
            "acuerdo de reparación de autos",
            "contrato de servicio vehicular",
            "acuerdo de mantenimiento automotriz",
          ],
        },
      },
    },
  },
  {
    id: "aviation-charter-agreement",
    importPath: "./us/aviation-charter-agreement",
    meta: {
      id: "aviation-charter-agreement",
      title: "Aviation Charter Agreement",
      description:
        "Agreement for chartering aircraft for transportation and aviation services.",
      category: "Transportation & Automotive",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "aircraft charter agreement",
        "private jet charter",
        "flight charter contract",
        "contrato de vuelo charter",
        "acuerdo de jet privado",
        "contrato de la carta de vuelo",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Aviation Charter Agreement",
          description:
            "Agreement for chartering aircraft for transportation and aviation services.",
          aliases: [
            "aircraft charter agreement",
            "private jet charter",
            "flight charter contract",
          ],
        },
        es: {
          name: "Acuerdo de Flete Aéreo",
          description:
            "Viaja con comodidad y eficiencia mientras proteges tu inversión. Asegura servicios de aviación premium con términos claros y seguros adecuados.",
          aliases: [
            "contrato de vuelo charter",
            "acuerdo de jet privado",
            "contrato de la carta de vuelo",
          ],
        },
      },
    },
  },
  {
    id: "bar-agreement",
    importPath: "./us/bar-agreement",
    meta: {
      id: "bar-agreement",
      title: "Bar Agreement",
      description: "Agreement for bar operations, partnerships, or management.",
      category: "Food & Hospitality",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "bar partnership",
        "tavern agreement",
        "pub agreement",
        "sociedad de bar",
        "acuerdo de taberna",
        "acuerdo de pub",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Bar Agreement",
          description:
            "Agreement for bar operations, partnerships, or management.",
          aliases: ["bar partnership", "tavern agreement", "pub agreement"],
        },
        es: {
          name: "Acuerdo de Bar",
          description:
            "Maximiza las ganancias de tu negocio de hospitalidad y evita conflictos entre socios. Establece operaciones eficientes que impulsen el éxito.",
          aliases: ["sociedad de bar", "acuerdo de taberna", "acuerdo de pub"],
        },
      },
    },
  },
  {
    id: "bid-proposal",
    importPath: "./us/bid-proposal",
    meta: {
      id: "bid-proposal",
      title: "Bid Proposal",
      description:
        "Professional contractor bid proposal for construction projects with detailed pricing and terms.",
      category: "Construction",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "construction bid",
        "contractor proposal",
        "project bid",
        "oferta de construcción",
        "propuesta de contratista",
        "oferta del proyecto",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Bid Proposal",
          description:
            "Professional contractor bid proposal for construction projects with detailed pricing and terms.",
          aliases: ["construction bid", "contractor proposal", "project bid"],
        },
        es: {
          name: "Propuesta de Oferta",
          description:
            "Aumenta tus posibilidades de ganar contratos lucrativos con propuestas profesionales. Destaca sobre la competencia y justifica tus precios.",
          aliases: [
            "oferta de construcción",
            "propuesta de contratista",
            "oferta del proyecto",
          ],
        },
      },
    },
  },
  {
    id: "bill-of-sale-general",
    importPath: "./us/bill-of-sale-general",
    meta: {
      id: "bill-of-sale-general",
      title: "General Bill of Sale",
      description:
        "Protect your valuable sales and prevent future disputes when selling personal property. Provide legal proof of ownership transfer.",
      category: "Legal",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "bill of sale",
        "sales receipt",
        "property transfer",
        "general bill of sale",
        "factura de venta",
        "recibo de venta",
        "transferencia de propiedad",
        "factura general",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "General Bill of Sale",
          description:
            "Protect your valuable sales and prevent future disputes when selling personal property. Provide legal proof of ownership transfer.",
          aliases: [
            "bill of sale",
            "sales receipt",
            "property transfer",
            "general bill of sale",
          ],
        },
        es: {
          name: "Factura de Venta General",
          description:
            "Protege tu venta y evita disputas futuras al vender objetos valiosos. Proporciona prueba legal de ownership y términos de la transacción.",
          aliases: [
            "factura de venta",
            "recibo de venta",
            "transferencia de propiedad",
            "factura general",
          ],
        },
      },
    },
  },
  {
    id: "board-resolution",
    importPath: "./us/board-resolution",
    meta: {
      id: "board-resolution",
      title: "Corporate Board Resolution",
      description:
        "Formal document recording decisions made by a corporation's board of directors at a meeting.",
      category: "Corporate",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "Board resolution",
        "Directors resolution",
        "Corporate resolution",
        "Resolución de junta",
        "Resolución de directores",
        "Resolución corporativa",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Corporate Board Resolution",
          description:
            "Formal document recording decisions made by a corporation's board of directors at a meeting.",
          aliases: [
            "Board resolution",
            "Directors resolution",
            "Corporate resolution",
          ],
        },
        es: {
          name: "Resolución de Junta Directiva",
          description:
            "Formaliza decisiones corporativas importantes y cumple con requisitos legales. Protege a directores de responsabilidad personal por decisiones empresariales.",
          aliases: [
            "Resolución de junta",
            "Resolución de directores",
            "Resolución corporativa",
          ],
        },
      },
    },
  },
  {
    id: "boat-bill-of-sale",
    importPath: "./us/boat-bill-of-sale",
    meta: {
      id: "boat-bill-of-sale",
      title: "Boat Bill of Sale",
      description:
        "Create a legally binding boat bill of sale with our easy-to-use template. State-specific requirements included.",
      category: "Finance",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "vessel bill of sale",
        "watercraft sale",
        "boat purchase agreement",
        "marine bill of sale",
        "venta de barco",
        "compraventa de embarcación",
        "contrato de venta marina",
        "factura de venta marítima",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Boat Bill of Sale",
          description:
            "Create a legally binding boat bill of sale with our easy-to-use template. State-specific requirements included.",
          aliases: [
            "vessel bill of sale",
            "watercraft sale",
            "boat purchase agreement",
            "marine bill of sale",
          ],
        },
        es: {
          name: "Contrato de Compraventa de Embarcación",
          description:
            "Protege tu inversión marina y evita disputas legales en la venta. Asegura transferencia clara de propiedad con documentación oficial.",
          aliases: [
            "venta de barco",
            "compraventa de embarcación",
            "contrato de venta marina",
            "factura de venta marítima",
          ],
        },
      },
    },
  },
  {
    id: "bookkeeping-services-agreement",
    importPath: "./us/bookkeeping-services-agreement",
    meta: {
      id: "bookkeeping-services-agreement",
      title: "Bookkeeping Services Agreement",
      description:
        "Professional agreement for bookkeeping and accounting services between service provider and client.",
      category: "Professional Services",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "accounting services agreement",
        "financial services contract",
        "bookkeeper contract",
        "contrato de servicios contables",
        "acuerdo de servicios financieros",
        "contrato de contable",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Bookkeeping Services Agreement",
          description:
            "Professional agreement for bookkeeping and accounting services between service provider and client.",
          aliases: [
            "accounting services agreement",
            "financial services contract",
            "bookkeeper contract",
          ],
        },
        es: {
          name: "Acuerdo de Servicios de Contabilidad",
          description:
            "Mantén tus finanzas organizadas y cumple con obligaciones fiscales. Obten servicios contables profesionales que impulsen el crecimiento de tu negocio.",
          aliases: [
            "contrato de servicios contables",
            "acuerdo de servicios financieros",
            "contrato de contable",
          ],
        },
      },
    },
  },
  {
    id: "brand-ambassador-agreement",
    importPath: "./us/brand-ambassador-agreement",
    meta: {
      id: "brand-ambassador-agreement",
      title: "Brand Ambassador Agreement",
      description:
        "Agreement for brand ambassador relationships and long-term brand partnerships.",
      category: "Marketing & Advertising",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "brand partnership agreement",
        "ambassador contract",
        "brand representative agreement",
        "acuerdo de asociación de marca",
        "contrato de embajador",
        "acuerdo representativo de la marca",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Brand Ambassador Agreement",
          description:
            "Agreement for brand ambassador relationships and long-term brand partnerships.",
          aliases: [
            "brand partnership agreement",
            "ambassador contract",
            "brand representative agreement",
          ],
        },
        es: {
          name: "Acuerdo de Embajador de Marca",
          description:
            "Expande tu alcance de marketing y construye credibilidad de marca. Establece relaciones de largo plazo que impulsen ventas y reconocimiento.",
          aliases: [
            "acuerdo de asociación de marca",
            "contrato de embajador",
            "acuerdo representativo de la marca",
          ],
        },
      },
    },
  },
  {
    id: "business-contract",
    importPath: "./us/business-contract",
    meta: {
      id: "business-contract",
      title: "Business Contract",
      description:
        "Protect your business and avoid costly misunderstandings in commercial transactions. Establish clear terms that benefit both parties in your deals.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "commercial contract",
        "business agreement",
        "commercial agreement",
        "contrato de negocios",
        "acuerdo comercial",
        "acuerdo comercial legal",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Business Contract",
          description:
            "Protect your business and avoid costly misunderstandings in commercial transactions. Establish clear terms that benefit both parties in your deals.",
          aliases: [
            "commercial contract",
            "business agreement",
            "commercial agreement",
          ],
        },
        es: {
          name: "Contrato Comercial",
          description:
            "Protege tu negocio y evita malentendidos costosos en transacciones comerciales. Establece términos que beneficien a ambas partes.",
          aliases: [
            "contrato de negocios",
            "acuerdo comercial",
            "acuerdo comercial legal",
          ],
        },
      },
    },
  },
  {
    id: "business-plan",
    importPath: "./us/business-plan",
    meta: {
      id: "business-plan",
      title: "Business Plan",
      description:
        "Attract investors and secure funding with a professional business plan. Present your vision convincingly to achieve business success.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "business strategy",
        "startup plan",
        "company plan",
        "business proposal",
        "estrategia comercial",
        "plan de inicio",
        "plan de empresa",
        "propuesta de negocio",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Business Plan",
          description:
            "Attract investors and secure funding with a professional business plan. Present your vision convincingly to achieve business success.",
          aliases: [
            "business strategy",
            "startup plan",
            "company plan",
            "business proposal",
          ],
        },
        es: {
          name: "Plan de Negocios",
          description:
            "Aumenta tus posibilidades de obtener financiamiento y atrae inversionistas. Presenta tu visión de negocio de manera profesional y convincente.",
          aliases: [
            "estrategia comercial",
            "plan de inicio",
            "plan de empresa",
            "propuesta de negocio",
          ],
        },
      },
    },
  },
  {
    id: "buy-sell-agreement",
    importPath: "./us/buy-sell-agreement",
    meta: {
      id: "buy-sell-agreement",
      title: "Buy-Sell Agreement",
      description:
        "Plan for your business future by establishing how ownership transfers when partners retire, die, or leave the company.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "buyout agreement",
        "business succession",
        "ownership transfer",
        "acuerdo de compra",
        "sucesión empresarial",
        "transferencia de propiedad",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Buy-Sell Agreement",
          description:
            "Plan for your business future by establishing how ownership transfers when partners retire, die, or leave the company.",
          aliases: [
            "buyout agreement",
            "business succession",
            "ownership transfer",
          ],
        },
        es: {
          name: "Acuerdo de Compra-Venta",
          description:
            "Acuerdo que rige la transferencia de participaciones comerciales ante eventos desencadenantes.",
          aliases: [
            "acuerdo de compra",
            "sucesión empresarial",
            "transferencia de propiedad",
          ],
        },
      },
    },
  },
  {
    id: "catering-agreement",
    importPath: "./us/catering-agreement",
    meta: {
      id: "catering-agreement",
      title: "Catering Agreement",
      description: "Agreement for catering services for events and occasions.",
      category: "Food & Hospitality",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "catering contract",
        "food service agreement",
        "contrato de catering",
        "acuerdo de servicio de comida",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Catering Agreement",
          description:
            "Agreement for catering services for events and occasions.",
          aliases: ["catering contract", "food service agreement"],
        },
        es: {
          name: "Acuerdo de Catering",
          description:
            "Garantiza el éxito de tu evento y evita sorpresas desagradables con el catering. Protege tu inversión con términos claros de servicio.",
          aliases: ["contrato de catering", "acuerdo de servicio de comida"],
        },
      },
    },
  },
  {
    id: "certificate-substantial-completion",
    importPath: "./us/certificate-substantial-completion",
    meta: {
      id: "certificate-substantial-completion",
      title: "Certificate of Substantial Completion",
      description:
        "Official certificate documenting substantial completion of construction work for project milestone.",
      category: "Construction",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "substantial completion certificate",
        "completion certificate",
        "project completion document",
        "certificado de finalización sustancial",
        "certificado de finalización",
        "documento de finalización del proyecto",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Certificate of Substantial Completion",
          description:
            "Official certificate documenting substantial completion of construction work for project milestone.",
          aliases: [
            "substantial completion certificate",
            "completion certificate",
            "project completion document",
          ],
        },
        es: {
          name: "Certificado de Finalización Sustancial",
          description:
            "Protege tu inversión en construcción y activa garantías de trabajo. Formaliza la finalización del proyecto para liberar pagos pendientes.",
          aliases: [
            "certificado de finalización sustancial",
            "certificado de finalización",
            "documento de finalización del proyecto",
          ],
        },
      },
    },
  },
  {
    id: "change-order",
    importPath: "./us/change-order",
    meta: {
      id: "change-order",
      title: "Change Order",
      description:
        "Create a formal change order to modify project scope, timeline, or budget.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "change order",
        "project change request",
        "modification order",
        "orden de cambio",
        "solicitud de cambio de proyecto",
        "orden de modificación",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Change Order",
          description:
            "Create a formal change order to modify project scope, timeline, or budget.",
          aliases: [
            "change order",
            "project change request",
            "modification order",
          ],
        },
        es: {
          name: "Orden de Cambio",
          description:
            "Adaptá proyectos a nuevas necesidades sin perder control del presupuesto. Documenta cambios para evitar disputas y sobrecostos inesperados.",
          aliases: [
            "orden de cambio",
            "solicitud de cambio de proyecto",
            "orden de modificación",
          ],
        },
      },
    },
  },
  {
    id: "child-care-authorization-form",
    importPath: "./us/child-care-authorization-form",
    meta: {
      id: "child-care-authorization-form",
      title: "Child Care Authorization Form",
      description:
        "Authorization form for temporary child care and emergency decisions.",
      category: "Family & Personal",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "childcare authorization",
        "temporary custody form",
        "autorización de cuidado infantil",
        "formulario de custodia temporal",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Child Care Authorization Form",
          description:
            "Authorization form for temporary child care and emergency decisions.",
          aliases: ["childcare authorization", "temporary custody form"],
        },
        es: {
          name: "Formulario de Autorización de Cuidado Infantil",
          description:
            "Da tranquilidad cuando viajas o trabajas al autorizar cuidado médico de emergencia para tus hijos. Evita retrasos críticos en tratamientos.",
          aliases: [
            "autorización de cuidado infantil",
            "formulario de custodia temporal",
          ],
        },
      },
    },
  },
  {
    id: "child-care-contract",
    importPath: "./us/child-care-contract",
    meta: {
      id: "child-care-contract",
      title: "Child Care Contract",
      description:
        "Agreement between parents and childcare provider for babysitting services.",
      category: "Family & Personal",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "babysitting contract",
        "nanny agreement",
        "childcare agreement",
        "contrato de niñera",
        "acuerdo de cuidado de niños",
        "acuerdo de cuidado infantil",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Child Care Contract",
          description:
            "Agreement between parents and childcare provider for babysitting services.",
          aliases: [
            "babysitting contract",
            "nanny agreement",
            "childcare agreement",
          ],
        },
        es: {
          name: "Contrato de Cuidado Infantil",
          description:
            "Asegura el cuidado seguro de tus hijos y establece expectativas claras con cuidadoras. Protege a tu familia con reglas y protocolos de emergencia.",
          aliases: [
            "contrato de niñera",
            "acuerdo de cuidado de niños",
            "acuerdo de cuidado infantil",
          ],
        },
      },
    },
  },
  {
    id: "child-custody-agreement",
    importPath: "./us/child-custody-agreement",
    meta: {
      id: "child-custody-agreement",
      title: "Child Custody Agreement",
      description:
        "Protect your children's wellbeing during family transitions. Establish stable custody arrangements that prioritize their needs.",
      category: "Family",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "child custody",
        "custody battle",
        "parenting plan",
        "custodia de hijos",
        "batalla por custodia",
        "plan de crianza",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Child Custody Agreement",
          description:
            "Protect your children's wellbeing during family transitions. Establish stable custody arrangements that prioritize their needs.",
          aliases: ["child custody", "custody battle", "parenting plan"],
        },
        es: {
          name: "Acuerdo de Custodia de Menores",
          description:
            "Protege el bienestar de tus hijos y evita conflictos futuros con tu ex pareja. Establece rutinas estables y derechos claros para ambos padres.",
          aliases: [
            "custodia de hijos",
            "batalla por custodia",
            "plan de crianza",
          ],
        },
      },
    },
  },
  {
    id: "child-medical-consent",
    importPath: "./us/child-medical-consent",
    meta: {
      id: "child-medical-consent",
      title: "Child Medical Consent Form",
      description:
        "Authorize a caregiver to make medical decisions for your child.",
      category: "Family",
      jurisdiction: "us",
      tags: [],
      aliases: [],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Child Medical Consent Form",
          description:
            "Authorize a caregiver to make medical decisions for your child.",
          aliases: [],
        },
        es: {
          name: "Formulario de Consentimiento Médico para Menores",
          description:
            "Asegura que tu hijo reciba atención médica inmediata cuando no puedas estar presente. Autoriza tratamientos que pueden salvar vidas.",
          aliases: [],
        },
      },
    },
  },
  {
    id: "child-support-agreement",
    importPath: "./us/child-support-agreement",
    meta: {
      id: "child-support-agreement",
      title: "Child Support Agreement",
      description:
        "Comprehensive agreement establishing child support payment terms and responsibilities.",
      category: "Family",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "child support contract",
        "support payment agreement",
        "custody support agreement",
        "contrato de manutención",
        "acuerdo de apoyo financiero",
        "acuerdo de soporte de custodia",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Child Support Agreement",
          description:
            "Comprehensive agreement establishing child support payment terms and responsibilities.",
          aliases: [
            "child support contract",
            "support payment agreement",
            "custody support agreement",
          ],
        },
        es: {
          name: "Acuerdo de Manutención Infantil",
          description:
            "Asegura el futuro financiero de tus hijos y evita disputas sobre gastos. Establece pagos justos que cubran todas las necesidades de los menores.",
          aliases: [
            "contrato de manutención",
            "acuerdo de apoyo financiero",
            "acuerdo de soporte de custodia",
          ],
        },
      },
    },
  },
  {
    id: "child-travel-consent",
    importPath: "./us/child-travel-consent",
    meta: {
      id: "child-travel-consent",
      title: "Child Travel Consent",
      description:
        "Consent form for minor children traveling without both parents.",
      category: "Family & Personal",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "minor travel consent",
        "child travel authorization",
        "travel permission letter",
        "consentimiento de viaje menor",
        "autorización de viaje infantil",
        "carta de permiso de viaje",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Child Travel Consent",
          description:
            "Consent form for minor children traveling without both parents.",
          aliases: [
            "minor travel consent",
            "child travel authorization",
            "travel permission letter",
          ],
        },
        es: {
          name: "Consentimiento de Viaje de Menor",
          description:
            "Evita problemas en aeropuertos y fronteras cuando tu hijo viaja sin ambos padres. Garantiza viajes seguros y sin complicaciones legales.",
          aliases: [
            "consentimiento de viaje menor",
            "autorización de viaje infantil",
            "carta de permiso de viaje",
          ],
        },
      },
    },
  },
  {
    id: "clinical-trial-agreement",
    importPath: "./us/clinical-trial-agreement",
    meta: {
      id: "clinical-trial-agreement",
      title: "Clinical Trial Agreement",
      description:
        "Agreement for conducting clinical trials and medical research studies.",
      category: "Healthcare & Medical",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "research study agreement",
        "clinical research contract",
        "trial participation agreement",
        "contrato de investigación clínica",
        "acuerdo de estudio médico",
        "acuerdo de participación en el juicio",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Clinical Trial Agreement",
          description:
            "Agreement for conducting clinical trials and medical research studies.",
          aliases: [
            "research study agreement",
            "clinical research contract",
            "trial participation agreement",
          ],
        },
        es: {
          name: "Acuerdo de Ensayo Clínico",
          description:
            "Participa en investigación médica con protección legal completa. Asegura compensación justa y acceso a tratamientos innovadores.",
          aliases: [
            "contrato de investigación clínica",
            "acuerdo de estudio médico",
            "acuerdo de participación en el juicio",
          ],
        },
      },
    },
  },
  {
    id: "cloud-services-agreement",
    importPath: "./us/cloud-services-agreement",
    meta: {
      id: "cloud-services-agreement",
      title: "Cloud Services Agreement",
      description: "Agreement for cloud computing and hosting services.",
      category: "Technology & IT",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "cloud hosting",
        "SaaS agreement",
        "cloud computing contract",
        "hospedaje en la nube",
        "acuerdo SaaS",
        "contrato de computación en la nube",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Cloud Services Agreement",
          description: "Agreement for cloud computing and hosting services.",
          aliases: [
            "cloud hosting",
            "SaaS agreement",
            "cloud computing contract",
          ],
        },
        es: {
          name: "Acuerdo de Servicios en la Nube",
          description:
            "Protege tus datos empresariales y asegura servicios confiables en la nube. Obten garantías de disponibilidad y seguridad para tu negocio.",
          aliases: [
            "hospedaje en la nube",
            "acuerdo SaaS",
            "contrato de computación en la nube",
          ],
        },
      },
    },
  },
  {
    id: "coaching-agreement",
    importPath: "./us/coaching-agreement",
    meta: {
      id: "coaching-agreement",
      title: "Coaching Agreement",
      description:
        "Agreement for professional coaching and mentoring services.",
      category: "Professional Services",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "life coaching",
        "business coaching",
        "mentor agreement",
        "coaching de vida",
        "coaching empresarial",
        "acuerdo de mentor",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Coaching Agreement",
          description:
            "Agreement for professional coaching and mentoring services.",
          aliases: ["life coaching", "business coaching", "mentor agreement"],
        },
        es: {
          name: "Acuerdo de Coaching",
          description:
            "Acelera tu crecimiento personal o profesional con mentoría estructurada. Establece metas claras y mide progreso hacia el éxito.",
          aliases: [
            "coaching de vida",
            "coaching empresarial",
            "acuerdo de mentor",
          ],
        },
      },
    },
  },
  {
    id: "codicil-to-will",
    importPath: "./us/codicil-to-will",
    meta: {
      id: "codicil-to-will",
      title: "Codicil to Will",
      description:
        "Make amendments to your existing will without rewriting the entire document.",
      category: "Estate Planning",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "will amendment",
        "will codicil",
        "will modification",
        "enmienda al testamento",
        "modificación de testamento",
        "modificación",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Codicil to Will",
          description:
            "Make amendments to your existing will without rewriting the entire document.",
          aliases: ["will amendment", "will codicil", "will modification"],
        },
        es: {
          name: "Codicilo al Testamento",
          description:
            "Mantén tu testamento actualizado sin costos legales excesivos. Adapta tu herencia a cambios familiares y financieros fácilmente.",
          aliases: [
            "enmienda al testamento",
            "modificación de testamento",
            "modificación",
          ],
        },
      },
    },
  },
  {
    id: "cohabitation-agreement",
    importPath: "./us/cohabitation-agreement",
    meta: {
      id: "cohabitation-agreement",
      title: "Cohabitation Agreement",
      description:
        "Create a legally binding cohabitation agreement for unmarried couples living together to define rights and responsibilities.",
      category: "Family & Personal",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "domestic partnership agreement",
        "living together agreement",
        "unmarried couple agreement",
        "common law agreement",
        "acuerdo de pareja de hecho",
        "acuerdo de convivencia",
        "acuerdo de unión libre",
        "acuerdo de derecho consuetudinario",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Cohabitation Agreement",
          description:
            "Create a legally binding cohabitation agreement for unmarried couples living together to define rights and responsibilities.",
          aliases: [
            "domestic partnership agreement",
            "living together agreement",
            "unmarried couple agreement",
            "common law agreement",
          ],
        },
        es: {
          name: "Acuerdo de Cohabitación",
          description:
            "Protege tu futuro financiero y evita disputas costosas si tu relación termina. Establece derechos claros sobre propiedades y responsabilidades financieras.",
          aliases: [
            "acuerdo de pareja de hecho",
            "acuerdo de convivencia",
            "acuerdo de unión libre",
            "acuerdo de derecho consuetudinario",
          ],
        },
      },
    },
  },
  {
    id: "collection-letter",
    importPath: "./us/collection-letter",
    meta: {
      id: "collection-letter",
      title: "Collection Letter",
      description:
        "Send professional debt collection letters to recover outstanding payments with legal compliance.",
      category: "Legal",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "debt collection letter",
        "payment demand",
        "collections notice",
        "past due notice",
        "carta de cobranza de deuda",
        "demanda de pago",
        "aviso de cobranza",
        "aviso de vencimiento",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Collection Letter",
          description:
            "Send professional debt collection letters to recover outstanding payments with legal compliance.",
          aliases: [
            "debt collection letter",
            "payment demand",
            "collections notice",
            "past due notice",
          ],
        },
        es: {
          name: "Carta de Cobranza",
          description:
            "Recupera dinero adeudado sin dañar relaciones comerciales. Presiona por pago de manera legal y profesional que motive acción inmediata.",
          aliases: [
            "carta de cobranza de deuda",
            "demanda de pago",
            "aviso de cobranza",
            "aviso de vencimiento",
          ],
        },
      },
    },
  },
  {
    id: "commercial-lease-agreement",
    importPath: "./us/commercial-lease-agreement",
    meta: {
      id: "commercial-lease-agreement",
      title: "Commercial Lease Agreement",
      description:
        "Secure the perfect space for your business with favorable terms. Protect your commercial investment and avoid surprises in operating costs.",
      category: "Real Estate",
      jurisdiction: "us",
      tags: [],
      aliases: [],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Commercial Lease Agreement",
          description:
            "Secure the perfect space for your business with favorable terms. Protect your commercial investment and avoid surprises in operating costs.",
          aliases: [],
        },
        es: {
          name: "Contrato de Arrendamiento Comercial",
          description:
            "Asegura el espacio perfecto para tu negocio con términos favorables. Protege tu inversión comercial y evita sorpresas en costos operativos.",
          aliases: [],
        },
      },
    },
  },
  {
    id: "commercial-lease-with-option-to-purchase",
    importPath: "./us/commercial-lease-with-option-to-purchase",
    meta: {
      id: "commercial-lease-with-option-to-purchase",
      title: "Commercial Lease with Option to Purchase",
      description:
        "Test commercial locations without committing to purchase immediately. Secure the option to buy successful properties in the future.",
      category: "Business & Commercial",
      jurisdiction: "us",
      tags: [],
      aliases: [],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Commercial Lease with Option to Purchase",
          description:
            "Test commercial locations without committing to purchase immediately. Secure the option to buy successful properties in the future.",
          aliases: [],
        },
        es: {
          name: "Arrendamiento Comercial con Opción de Compra",
          description:
            "Prueba ubicaciones comerciales sin comprometerte a comprar inmediatamente. Asegura la opción de adquirir propiedades exitosas en el futuro.",
          aliases: [],
        },
      },
    },
  },
  {
    id: "commission-agreement",
    importPath: "./us/commission-agreement",
    meta: {
      id: "commission-agreement",
      title: "Commission Agreement",
      description:
        "Comprehensive agreement establishing commission-based compensation structure and terms.",
      category: "Employment",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "sales commission agreement",
        "commission contract",
        "compensation agreement",
        "acuerdo de comisión de ventas",
        "contrato de comisión",
        "acuerdo de compensación",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Commission Agreement",
          description:
            "Comprehensive agreement establishing commission-based compensation structure and terms.",
          aliases: [
            "sales commission agreement",
            "commission contract",
            "compensation agreement",
          ],
        },
        es: {
          name: "Acuerdo de Comisión",
          description:
            "Paga vendedores según lo que vendan. Define porcentajes de comisión, metas de ventas y cuándo se pagan las comisiones.",
          aliases: [
            "acuerdo de comisión de ventas",
            "contrato de comisión",
            "acuerdo de compensación",
          ],
        },
      },
    },
  },
  {
    id: "complaint-letter",
    importPath: "./us/complaint-letter",
    meta: {
      id: "complaint-letter",
      title: "Complaint Letter",
      description:
        "Formal letter to address grievances with businesses or services.",
      category: "Personal & Lifestyle",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "grievance letter",
        "formal complaint",
        "dispute letter",
        "carta de reclamo",
        "queja formal",
        "carta de disputa",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Complaint Letter",
          description:
            "Formal letter to address grievances with businesses or services.",
          aliases: ["grievance letter", "formal complaint", "dispute letter"],
        },
        es: {
          name: "Carta de Queja",
          description:
            "Quéjate formalmente con empresas por mal servicio o productos defectuosos. Aumenta posibilidades de reembolso o compensación.",
          aliases: ["carta de reclamo", "queja formal", "carta de disputa"],
        },
      },
    },
  },
  {
    id: "confidentiality-agreement",
    importPath: "./us/confidentiality-agreement",
    meta: {
      id: "confidentiality-agreement",
      title: "Confidentiality Agreement",
      description:
        "Protect your business secrets and sensitive information from being shared. Prevent competitors from accessing your confidential data.",
      category: "Legal",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "confidential agreement",
        "secrecy agreement",
        "non-disclosure",
        "privacy agreement",
        "acuerdo confidencial",
        "acuerdo de secreto",
        "no divulgación",
        "acuerdo de privacidad",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Confidentiality Agreement",
          description:
            "Protect your business secrets and sensitive information from being shared. Prevent competitors from accessing your confidential data.",
          aliases: [
            "confidential agreement",
            "secrecy agreement",
            "non-disclosure",
            "privacy agreement",
          ],
        },
        es: {
          name: "Acuerdo de Confidencialidad",
          description:
            "Protege tus secretos comerciales y datos confidenciales. Evita que empleados, socios o contratistas compartan tu información privada.",
          aliases: [
            "acuerdo confidencial",
            "acuerdo de secreto",
            "no divulgación",
            "acuerdo de privacidad",
          ],
        },
      },
    },
  },
  {
    id: "consignment-agreement",
    importPath: "./us/consignment-agreement",
    meta: {
      id: "consignment-agreement",
      title: "Consignment Agreement",
      description:
        "Expand your sales reach without upfront costs. Sell products through other retailers while maintaining control over pricing and returns.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "consignment contract",
        "consignment deal",
        "sales agreement",
        "contrato de consignación",
        "acuerdo de ventas",
        "acuerdo de venta",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Consignment Agreement",
          description:
            "Expand your sales reach without upfront costs. Sell products through other retailers while maintaining control over pricing and returns.",
          aliases: [
            "consignment contract",
            "consignment deal",
            "sales agreement",
          ],
        },
        es: {
          name: "Acuerdo de Consignación",
          description:
            "Vende productos a través de otra tienda o vendedor. Define quién recibe qué porcentaje de las ventas y qué pasa con productos no vendidos.",
          aliases: [
            "contrato de consignación",
            "acuerdo de ventas",
            "acuerdo de venta",
          ],
        },
      },
    },
  },
  {
    id: "construction-bid-form",
    importPath: "./us/construction-bid-form",
    meta: {
      id: "construction-bid-form",
      title: "Construction Bid Form",
      description:
        "Standardized construction bid form for contractors to submit project bids.",
      category: "Construction",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "bid form",
        "contractor bid form",
        "project bid form",
        "formulario de oferta",
        "formulario de oferta de contratista",
        "formulario de oferta del proyecto",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Construction Bid Form",
          description:
            "Standardized construction bid form for contractors to submit project bids.",
          aliases: ["bid form", "contractor bid form", "project bid form"],
        },
        es: {
          name: "Formulario de Oferta de Construcción",
          description:
            "Formulario estandarizado de oferta de construcción para que los contratistas presenten ofertas de proyectos.",
          aliases: [
            "formulario de oferta",
            "formulario de oferta de contratista",
            "formulario de oferta del proyecto",
          ],
        },
      },
    },
  },
  {
    id: "construction-contract",
    importPath: "./us/construction-contract",
    meta: {
      id: "construction-contract",
      title: "Construction Contract",
      description:
        "Complete your construction project on time and budget. Protect against shoddy work with performance guarantees and clear expectations.",
      category: "Construction",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "building contract",
        "general contractor agreement",
        "construction agreement",
        "contrato de construcción",
        "acuerdo de contratista general",
        "acuerdo de construcción",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Construction Contract",
          description:
            "Complete your construction project on time and budget. Protect against shoddy work with performance guarantees and clear expectations.",
          aliases: [
            "building contract",
            "general contractor agreement",
            "construction agreement",
          ],
        },
        es: {
          name: "Contrato de Construcción",
          description:
            "Protege tu inversión en construcción y evita sobrecostos inesperados. Asegura trabajo de calidad con cronogramas claros y responsabilidades definidas.",
          aliases: [
            "contrato de construcción",
            "acuerdo de contratista general",
            "acuerdo de construcción",
          ],
        },
      },
    },
  },
  {
    id: "construction-management-agreement",
    importPath: "./us/construction-management-agreement",
    meta: {
      id: "construction-management-agreement",
      title: "Construction Management Agreement",
      description:
        "Professional construction management services agreement between owner and construction manager.",
      category: "Construction",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "CM agreement",
        "construction manager contract",
        "project management agreement",
        "acuerdo de gestión de construcción",
        "contrato de gestor de construcción",
        "acuerdo de gestión de proyectos",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Construction Management Agreement",
          description:
            "Professional construction management services agreement between owner and construction manager.",
          aliases: [
            "CM agreement",
            "construction manager contract",
            "project management agreement",
          ],
        },
        es: {
          name: "Acuerdo de Gestión de Construcción",
          description:
            "Acuerdo de servicios profesionales de gestión de construcción entre propietario y gestor de construcción.",
          aliases: [
            "acuerdo de gestión de construcción",
            "contrato de gestor de construcción",
            "acuerdo de gestión de proyectos",
          ],
        },
      },
    },
  },
  {
    id: "consulting-agreement",
    importPath: "./us/consulting-agreement",
    meta: {
      id: "consulting-agreement",
      title: "Consulting Agreement",
      description:
        "Access specialized expertise without the cost of full-time employees. Define project scope and protect your interests with clear terms.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "consultant contract",
        "advisory agreement",
        "professional services agreement",
        "contrato de consultor",
        "acuerdo de asesoría",
        "acuerdo de servicios profesionales",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Consulting Agreement",
          description:
            "Access specialized expertise without the cost of full-time employees. Define project scope and protect your interests with clear terms.",
          aliases: [
            "consultant contract",
            "advisory agreement",
            "professional services agreement",
          ],
        },
        es: {
          name: "Acuerdo de Consultoría",
          description:
            "Obten experiencia especializada sin contratar empleados de tiempo completo. Establece objetivos claros y protege la propiedad intelectual de tu empresa.",
          aliases: [
            "contrato de consultor",
            "acuerdo de asesoría",
            "acuerdo de servicios profesionales",
          ],
        },
      },
    },
  },
  {
    id: "contract-amendment",
    importPath: "./us/contract-amendment",
    meta: {
      id: "contract-amendment",
      title: "Contract Amendment",
      description:
        "Update contracts efficiently without renegotiating everything. Adapt agreements to changing business needs while maintaining legal validity.",
      category: "Legal",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "contract amendment",
        "contract modification",
        "addendum",
        "enmienda de contrato",
        "modificación de contrato",
        "adenda",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Contract Amendment",
          description:
            "Update contracts efficiently without renegotiating everything. Adapt agreements to changing business needs while maintaining legal validity.",
          aliases: ["contract amendment", "contract modification", "addendum"],
        },
        es: {
          name: "Enmienda de Contrato",
          description:
            "Cambia partes de un contrato existente sin tener que volver a escribir todo. Actualiza precios, fechas o condiciones.",
          aliases: [
            "enmienda de contrato",
            "modificación de contrato",
            "adenda",
          ],
        },
      },
    },
  },
  {
    id: "contract-termination-letter",
    importPath: "./us/contract-termination-letter",
    meta: {
      id: "contract-termination-letter",
      title: "Contract Termination Letter",
      description:
        "End business relationships professionally and avoid legal disputes when terminating contracts. Protect yourself with proper notice and documentation.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "termination notice",
        "contract cancellation",
        "agreement termination",
        "aviso de terminación",
        "cancelación de contrato",
        "terminación de acuerdo",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Contract Termination Letter",
          description:
            "End business relationships professionally and avoid legal disputes when terminating contracts. Protect yourself with proper notice and documentation.",
          aliases: [
            "termination notice",
            "contract cancellation",
            "agreement termination",
          ],
        },
        es: {
          name: "Carta de Terminación de Contrato",
          description:
            "Cancela un contrato existente de manera legal y profesional. Evita problemas legales al terminar acuerdos comerciales.",
          aliases: [
            "aviso de terminación",
            "cancelación de contrato",
            "terminación de acuerdo",
          ],
        },
      },
    },
  },
  {
    id: "copyright-assignment",
    importPath: "./us/copyright-assignment",
    meta: {
      id: "copyright-assignment",
      title: "Copyright Assignment Agreement",
      description:
        "Protect your creative work and control how it's used. Transfer copyright ownership while retaining specific rights that benefit you.",
      category: "Intellectual Property",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "copyright assignment contract",
        "copyright transfer",
        "intellectual property assignment",
        "contrato de asignación de derechos de autor",
        "transferencia de derechos de autor",
        "asignación de propiedad intelectual",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Copyright Assignment Agreement",
          description:
            "Protect your creative work and control how it's used. Transfer copyright ownership while retaining specific rights that benefit you.",
          aliases: [
            "copyright assignment contract",
            "copyright transfer",
            "intellectual property assignment",
          ],
        },
        es: {
          name: "Acuerdo de Asignación de Derechos de Autor",
          description:
            "Transfiere ownership de contenido creativo (arte, música, escritos, software) a otra persona o empresa. Especifica qué derechos se transfieren.",
          aliases: [
            "contrato de asignación de derechos de autor",
            "transferencia de derechos de autor",
            "asignación de propiedad intelectual",
          ],
        },
      },
    },
  },
  {
    id: "copyright-assignment-agreement",
    importPath: "./us/copyright-assignment-agreement",
    meta: {
      id: "copyright-assignment-agreement",
      title: "Copyright Assignment Agreement",
      description:
        "Secure your creative business deals by properly transferring copyright ownership with full legal protection.",
      category: "Intellectual Property",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "copyright transfer",
        "copyright conveyance",
        "intellectual property assignment",
        "transferencia de derechos de autor",
        "cesión de propiedad intelectual",
        "asignación de propiedad intelectual",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Copyright Assignment Agreement",
          description:
            "Secure your creative business deals by properly transferring copyright ownership with full legal protection.",
          aliases: [
            "copyright transfer",
            "copyright conveyance",
            "intellectual property assignment",
          ],
        },
        es: {
          name: "Acuerdo de Cesión de Derechos de Autor",
          description:
            "Acuerdo integral para transferir la propiedad de derechos de autor de obras creativas.",
          aliases: [
            "transferencia de derechos de autor",
            "cesión de propiedad intelectual",
            "asignación de propiedad intelectual",
          ],
        },
      },
    },
  },
  {
    id: "copyright-license-agreement",
    importPath: "./us/copyright-license-agreement",
    meta: {
      id: "copyright-license-agreement",
      title: "Copyright License Agreement",
      description: "Professional copyright license agreement document.",
      category: "Legal",
      jurisdiction: "us",
      tags: [],
      aliases: ["copyright license agreement"],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Copyright License Agreement",
          description: "Professional copyright license agreement document.",
          aliases: ["copyright license agreement"],
        },
        es: {
          name: "Acuerdo de Licencia de Derechos de Autor",
          description:
            "Permite que otros usen tu contenido creativo (música, arte, escritos) bajo condiciones específicas que tú estableces.",
          aliases: ["copyright license agreement"],
        },
      },
    },
  },
  {
    id: "corporate-bylaws",
    importPath: "./us/corporate-bylaws",
    meta: {
      id: "corporate-bylaws",
      title: "Corporate Bylaws",
      description:
        "Establish professional governance that attracts investors and ensures compliance. Run your corporation smoothly with clear operational rules.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "company bylaws",
        "corporate governance",
        "bylaws",
        "corporate rules",
        "estatutos de la empresa",
        "gobierno corporativo",
        "estatutos",
        "reglas corporativas",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Corporate Bylaws",
          description:
            "Establish professional governance that attracts investors and ensures compliance. Run your corporation smoothly with clear operational rules.",
          aliases: [
            "company bylaws",
            "corporate governance",
            "bylaws",
            "corporate rules",
          ],
        },
        es: {
          name: "Estatutos Corporativos",
          description:
            "Define las reglas internas de tu empresa corporativa. Cubre juntas directivas, votaciones, roles de ejecutivos y procedimientos operativos.",
          aliases: [
            "estatutos de la empresa",
            "gobierno corporativo",
            "estatutos",
            "reglas corporativas",
          ],
        },
      },
    },
  },
  {
    id: "court-filing-document",
    importPath: "./us/court-filing-document",
    meta: {
      id: "court-filing-document",
      title: "Court Filing Document",
      description:
        "Present your case professionally with properly formatted court documents that meet legal requirements.",
      category: "Government & Legal Services",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "legal pleading",
        "court document",
        "legal filing",
        "alegato legal",
        "documento judicial",
        "presentación legal",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Court Filing Document",
          description:
            "Present your case professionally with properly formatted court documents that meet legal requirements.",
          aliases: ["legal pleading", "court document", "legal filing"],
        },
        es: {
          name: "Documento de Presentación Judicial",
          description:
            "Plantilla general para documentos de presentación judicial y alegatos legales.",
          aliases: [
            "alegato legal",
            "documento judicial",
            "presentación legal",
          ],
        },
      },
    },
  },
  {
    id: "credit-card-agreement",
    importPath: "./us/credit-card-agreement",
    meta: {
      id: "credit-card-agreement",
      title: "Credit Card Agreement",
      description: "Agreement outlining terms for credit card use and payment.",
      category: "Finance & Lending",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "credit agreement",
        "cardholder agreement",
        "acuerdo de crédito",
        "contrato de tarjetahabiente",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Credit Card Agreement",
          description:
            "Agreement outlining terms for credit card use and payment.",
          aliases: ["credit agreement", "cardholder agreement"],
        },
        es: {
          name: "Acuerdo de Tarjeta de Crédito",
          description:
            "Acuerdo que describe los términos de uso y pago de tarjeta de crédito.",
          aliases: ["acuerdo de crédito", "contrato de tarjetahabiente"],
        },
      },
    },
  },
  {
    id: "crop-sharing-agreement",
    importPath: "./us/crop-sharing-agreement",
    meta: {
      id: "crop-sharing-agreement",
      title: "Crop Sharing Agreement",
      description: "Agreement for crop sharing and agricultural partnerships.",
      category: "Agriculture & Farming",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "sharecropping agreement",
        "farm partnership",
        "acuerdo de aparcería",
        "sociedad agrícola",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Crop Sharing Agreement",
          description:
            "Agreement for crop sharing and agricultural partnerships.",
          aliases: ["sharecropping agreement", "farm partnership"],
        },
        es: {
          name: "Acuerdo de Participación de Cultivos",
          description:
            "Acuerdo para participación de cultivos y asociaciones agrícolas.",
          aliases: ["acuerdo de aparcería", "sociedad agrícola"],
        },
      },
    },
  },
  {
    id: "cryptocurrency-agreement",
    importPath: "./us/cryptocurrency-agreement",
    meta: {
      id: "cryptocurrency-agreement",
      title: "Cryptocurrency Agreement",
      description:
        "Agreement for cryptocurrency transactions, trading, and digital asset services.",
      category: "Digital Assets & Blockchain",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "crypto agreement",
        "digital asset agreement",
        "blockchain agreement",
        "acuerdo crypto",
        "acuerdo de activos digitales",
        "acuerdo de blockchain",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Cryptocurrency Agreement",
          description:
            "Agreement for cryptocurrency transactions, trading, and digital asset services.",
          aliases: [
            "crypto agreement",
            "digital asset agreement",
            "blockchain agreement",
          ],
        },
        es: {
          name: "Acuerdo de Criptomonedas",
          description:
            "Acuerdo para transacciones de criptomonedas, comercio y servicios de activos digitales.",
          aliases: [
            "acuerdo crypto",
            "acuerdo de activos digitales",
            "acuerdo de blockchain",
          ],
        },
      },
    },
  },
  {
    id: "cybersecurity-agreement",
    importPath: "./us/cybersecurity-agreement",
    meta: {
      id: "cybersecurity-agreement",
      title: "Cybersecurity Agreement",
      description: "Agreement for cybersecurity services and protection.",
      category: "Technology & IT",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "IT security agreement",
        "information security contract",
        "acuerdo de seguridad IT",
        "contrato de seguridad informática",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Cybersecurity Agreement",
          description: "Agreement for cybersecurity services and protection.",
          aliases: ["IT security agreement", "information security contract"],
        },
        es: {
          name: "Acuerdo de Ciberseguridad",
          description:
            "Contrata servicios para proteger tu negocio de hackers y ataques cibernéticos. Define responsabilidades y protocolos de seguridad.",
          aliases: [
            "acuerdo de seguridad IT",
            "contrato de seguridad informática",
          ],
        },
      },
    },
  },
  {
    id: "data-processing-agreement",
    importPath: "./us/data-processing-agreement",
    meta: {
      id: "data-processing-agreement",
      title: "Data Processing Agreement",
      description:
        "Agreement governing the processing and handling of personal data and information.",
      category: "Technology & IT",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "DPA",
        "data handling agreement",
        "privacy agreement",
        "acuerdo de manejo de datos",
        "acuerdo de privacidad",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Data Processing Agreement",
          description:
            "Agreement governing the processing and handling of personal data and information.",
          aliases: ["DPA", "data handling agreement", "privacy agreement"],
        },
        es: {
          name: "Acuerdo de Procesamiento de Datos",
          description:
            "Protege la privacidad de datos de clientes cuando trabajas con terceros. Define cómo se manejan y protegen datos personales.",
          aliases: [
            "DPA",
            "acuerdo de manejo de datos",
            "acuerdo de privacidad",
          ],
        },
      },
    },
  },
  {
    id: "debt-settlement-agreement",
    importPath: "./us/debt-settlement-agreement",
    meta: {
      id: "debt-settlement-agreement",
      title: "Debt Settlement Agreement",
      description:
        "Settle outstanding debt for less than the full amount owed with structured payment terms.",
      category: "Finance",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "debt compromise",
        "settlement deal",
        "debt resolution",
        "payment settlement",
        "compromiso de deuda",
        "acuerdo de liquidación",
        "resolución de deuda",
        "liquidación de pago",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Debt Settlement Agreement",
          description:
            "Settle outstanding debt for less than the full amount owed with structured payment terms.",
          aliases: [
            "debt compromise",
            "settlement deal",
            "debt resolution",
            "payment settlement",
          ],
        },
        es: {
          name: "Acuerdo de Liquidación de Deuda",
          description:
            "Negocia pagar menos de lo que debes. Acuerdo legal que reduce tu deuda total a cambio de pagos inmediatos o un plan de pagos.",
          aliases: [
            "compromiso de deuda",
            "acuerdo de liquidación",
            "resolución de deuda",
            "liquidación de pago",
          ],
        },
      },
    },
  },
  {
    id: "debt-validation-letter",
    importPath: "./us/debt-validation-letter",
    meta: {
      id: "debt-validation-letter",
      title: "Debt Validation Letter",
      description:
        "Protect yourself from unfair debt collection by demanding proof that claimed debts are legitimate and accurate.",
      category: "Legal",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "debt dispute letter",
        "validation request",
        "debt verification",
        "collector challenge",
        "carta de disputa de deuda",
        "solicitud de validación",
        "verificación de deuda",
        "desafío de cobrador",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Debt Validation Letter",
          description:
            "Protect yourself from unfair debt collection by demanding proof that claimed debts are legitimate and accurate.",
          aliases: [
            "debt dispute letter",
            "validation request",
            "debt verification",
            "collector challenge",
          ],
        },
        es: {
          name: "Carta de Validación de Deuda",
          description:
            "Solicitar validación de deuda de cobradores para verificar legitimidad y precisión de la deuda reclamada.",
          aliases: [
            "carta de disputa de deuda",
            "solicitud de validación",
            "verificación de deuda",
            "desafío de cobrador",
          ],
        },
      },
    },
  },
  {
    id: "demand-letter",
    importPath: "./us/demand-letter",
    meta: {
      id: "demand-letter",
      title: "Demand Letter for Payment",
      description:
        "Get paid faster and avoid costly legal fees by demanding payment professionally. Show you are serious about collecting debts before involving courts.",
      category: "Legal",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "payment demand letter",
        "collection letter",
        "notice of demand",
        "carta de cobro",
        "aviso de demanda",
        "carta de reclamación",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Demand Letter for Payment",
          description:
            "Get paid faster and avoid costly legal fees by demanding payment professionally. Show you are serious about collecting debts before involving courts.",
          aliases: [
            "payment demand letter",
            "collection letter",
            "notice of demand",
          ],
        },
        es: {
          name: "Carta de Demanda de Pago",
          description:
            "Crea una Carta de Demanda de Pago legalmente válida con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.",
          aliases: [
            "carta de cobro",
            "aviso de demanda",
            "carta de reclamación",
          ],
        },
      },
    },
  },
  {
    id: "demand-letter-payment",
    importPath: "./us/demand-letter-payment",
    meta: {
      id: "demand-letter-payment",
      title: "Demand Letter (Payment)",
      description: "Formally request payment that is overdue.",
      category: "Finance",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "request payment",
        "owe money",
        "legal demand",
        "solicitar pago",
        "deber dinero",
        "demanda legal",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Demand Letter (Payment)",
          description: "Formally request payment that is overdue.",
          aliases: ["request payment", "owe money", "legal demand"],
        },
        es: {
          name: "Carta de Reclamación (Pago)",
          description:
            "Exige pago por facturas vencidas o deudas. Aviso final claro antes de buscar cobro o acción legal.",
          aliases: ["solicitar pago", "deber dinero", "demanda legal"],
        },
      },
    },
  },
  {
    id: "digital-asset-agreement",
    importPath: "./us/digital-asset-agreement",
    meta: {
      id: "digital-asset-agreement",
      title: "Digital Asset Agreement",
      description:
        "Agreement for trading, managing, and transferring digital assets and cryptocurrencies.",
      category: "Technology & IT",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "crypto agreement",
        "nft agreement",
        "blockchain asset agreement",
        "acuerdo crypto",
        "contrato de NFT",
        "acuerdo de activos de blockchain",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Digital Asset Agreement",
          description:
            "Agreement for trading, managing, and transferring digital assets and cryptocurrencies.",
          aliases: [
            "crypto agreement",
            "nft agreement",
            "blockchain asset agreement",
          ],
        },
        es: {
          name: "Acuerdo de Activos Digitales",
          description:
            "Acuerdo para comerciar, gestionar y transferir activos digitales y criptomonedas.",
          aliases: [
            "acuerdo crypto",
            "contrato de NFT",
            "acuerdo de activos de blockchain",
          ],
        },
      },
    },
  },
  {
    id: "direct-deposit-form",
    importPath: "./us/direct-deposit-form",
    meta: {
      id: "direct-deposit-form",
      title: "Direct Deposit Authorization Form",
      description: "Authorization form for employee direct deposit of payroll",
      category: "HR",
      jurisdiction: "us",
      tags: [],
      aliases: [],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Direct Deposit Authorization Form",
          description:
            "Authorization form for employee direct deposit of payroll",
          aliases: [],
        },
        es: {
          name: "Direct Deposit Authorization Form",
          description:
            "Authorization form for employee direct deposit of payroll",
          aliases: [],
        },
      },
    },
  },
  {
    id: "divorce-settlement-agreement",
    importPath: "./us/divorce-settlement-agreement",
    meta: {
      id: "divorce-settlement-agreement",
      title: "Divorce Settlement Agreement",
      description:
        "Formalizes the terms of a divorce, including property division, support, and custody.",
      category: "Family",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "divorce",
        "separation",
        "end marriage",
        "get divorced",
        "marital settlement",
        "divorcio",
        "separación",
        "terminar matrimonio",
        "divorciarse",
        "acuerdo matrimonial",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Divorce Settlement Agreement",
          description:
            "Formalizes the terms of a divorce, including property division, support, and custody.",
          aliases: [
            "divorce",
            "separation",
            "end marriage",
            "get divorced",
            "marital settlement",
          ],
        },
        es: {
          name: "Acuerdo de Divorcio",
          description:
            "Asegura tu futuro y formaliza los términos del divorcio, incluyendo división equitativa de propiedades, pensión alimenticia y custodia de los hijos.",
          aliases: [
            "divorcio",
            "separación",
            "terminar matrimonio",
            "divorciarse",
            "acuerdo matrimonial",
          ],
        },
      },
    },
  },
  {
    id: "dog-breeding-agreement",
    importPath: "./us/dog-breeding-agreement",
    meta: {
      id: "dog-breeding-agreement",
      title: "Dog Breeding Agreement",
      description: "Agreement for dog breeding and stud services.",
      category: "Agriculture & Farming",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "stud service agreement",
        "breeding contract",
        "contrato de cría",
        "acuerdo de semental",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Dog Breeding Agreement",
          description: "Agreement for dog breeding and stud services.",
          aliases: ["stud service agreement", "breeding contract"],
        },
        es: {
          name: "Acuerdo de Cría de Perros",
          description: "Acuerdo para cría de perros y servicios de semental.",
          aliases: ["contrato de cría", "acuerdo de semental"],
        },
      },
    },
  },
  {
    id: "donation-agreement",
    importPath: "./us/donation-agreement",
    meta: {
      id: "donation-agreement",
      title: "Donation Agreement",
      description: "Agreement for charitable donations and gifts.",
      category: "Personal & Lifestyle",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "gift agreement",
        "charitable donation",
        "pledge agreement",
        "acuerdo de regalo",
        "donación caritativa",
        "acuerdo de compromiso",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Donation Agreement",
          description: "Agreement for charitable donations and gifts.",
          aliases: [
            "gift agreement",
            "charitable donation",
            "pledge agreement",
          ],
        },
        es: {
          name: "Acuerdo de Donación",
          description: "Acuerdo para donaciones caritativas y regalos.",
          aliases: [
            "acuerdo de regalo",
            "donación caritativa",
            "acuerdo de compromiso",
          ],
        },
      },
    },
  },
  {
    id: "durable-power-of-attorney",
    importPath: "./us/durable-power-of-attorney",
    meta: {
      id: "durable-power-of-attorney",
      title: "Durable Power of Attorney",
      description:
        "Grant someone authority to act on your behalf for financial and legal matters, even if you become incapacitated.",
      category: "Estate Planning",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "financial power of attorney",
        "general power of attorney",
        "durable POA",
        "poder financiero",
        "poder general",
        "POA duradero",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Durable Power of Attorney",
          description:
            "Grant someone authority to act on your behalf for financial and legal matters, even if you become incapacitated.",
          aliases: [
            "financial power of attorney",
            "general power of attorney",
            "durable POA",
          ],
        },
        es: {
          name: "Poder Duradero",
          description:
            "Otorga a alguien autoridad para actuar en tu nombre en asuntos financieros y legales, incluso si quedas incapacitado.",
          aliases: ["poder financiero", "poder general", "POA duradero"],
        },
      },
    },
  },
  {
    id: "earnest-money-agreement",
    importPath: "./us/earnest-money-agreement",
    meta: {
      id: "earnest-money-agreement",
      title: "Earnest Money Agreement",
      description:
        "Secure your real estate purchase by properly handling earnest money deposits with clear refund conditions.",
      category: "Real Estate & Property",
      jurisdiction: "us",
      tags: [],
      aliases: [],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Earnest Money Agreement",
          description:
            "Secure your real estate purchase by properly handling earnest money deposits with clear refund conditions.",
          aliases: [],
        },
        es: {
          name: "Acuerdo de depósito en garantía",
          description:
            "Asegura tu compra de bienes raíces gestionando correctamente el depósito en garantía con condiciones claras de reembolso.",
          aliases: [],
        },
      },
    },
  },
  {
    id: "ecommerce-terms-of-service",
    importPath: "./us/ecommerce-terms-of-service",
    meta: {
      id: "ecommerce-terms-of-service",
      title: "E-commerce Terms of Service",
      description:
        "Terms of service agreement for online retail and e-commerce businesses.",
      category: "Business & Commercial",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "online store terms",
        "website terms",
        "user agreement",
        "términos de tienda en línea",
        "acuerdo de usuario",
        "acuerdo de usuario legal",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "E-commerce Terms of Service",
          description:
            "Terms of service agreement for online retail and e-commerce businesses.",
          aliases: ["online store terms", "website terms", "user agreement"],
        },
        es: {
          name: "Términos de Servicio de Comercio Electrónico",
          description:
            "Acuerdo de términos de servicio para negocios de venta en línea.",
          aliases: [
            "términos de tienda en línea",
            "acuerdo de usuario",
            "acuerdo de usuario legal",
          ],
        },
      },
    },
  },
  {
    id: "education-trust",
    importPath: "./us/education-trust",
    meta: {
      id: "education-trust",
      title: "Education Trust",
      description:
        "Secure your children's educational future while saving on taxes with a dedicated trust fund for school expenses.",
      category: "Estate Planning",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "educational trust",
        "tuition trust",
        "scholarship trust",
        "529 trust alternative",
        "fideicomiso educacional",
        "fideicomiso de matrícula",
        "fideicomiso de beca",
        "529 alternativa de confianza",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Education Trust",
          description:
            "Secure your children's educational future while saving on taxes with a dedicated trust fund for school expenses.",
          aliases: [
            "educational trust",
            "tuition trust",
            "scholarship trust",
            "529 trust alternative",
          ],
        },
        es: {
          name: "Fideicomiso Educativo",
          description:
            "Un fideicomiso especializado diseñado para financiar gastos educativos para beneficiarios con ventajas fiscales.",
          aliases: [
            "fideicomiso educacional",
            "fideicomiso de matrícula",
            "fideicomiso de beca",
            "529 alternativa de confianza",
          ],
        },
      },
    },
  },
  {
    id: "elder-care-agreement",
    importPath: "./us/elder-care-agreement",
    meta: {
      id: "elder-care-agreement",
      title: "Elder Care Agreement",
      description:
        "Ensure quality care for your loved ones with clear agreements that protect both caregiver and family.",
      category: "Family & Personal",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "senior care agreement",
        "caregiving agreement",
        "elderly care contract",
        "contrato de cuidador",
        "acuerdo de cuidado",
        "contrato de atención de ancianos",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Elder Care Agreement",
          description:
            "Ensure quality care for your loved ones with clear agreements that protect both caregiver and family.",
          aliases: [
            "senior care agreement",
            "caregiving agreement",
            "elderly care contract",
          ],
        },
        es: {
          name: "Acuerdo de Cuidado de Ancianos",
          description:
            "Acuerdo para proporcionar servicios de cuidado a personas mayores.",
          aliases: [
            "contrato de cuidador",
            "acuerdo de cuidado",
            "contrato de atención de ancianos",
          ],
        },
      },
    },
  },
  {
    id: "employee-bonus-plan",
    importPath: "./us/employee-bonus-plan",
    meta: {
      id: "employee-bonus-plan",
      title: "Employee Bonus Plan",
      description:
        "Structured bonus plan document outlining performance-based compensation and incentive programs.",
      category: "Employment",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "incentive plan",
        "performance bonus structure",
        "employee rewards program",
        "plan de incentivos",
        "estructura de bonificación por rendimiento",
        "programa de recompensas para empleados",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Employee Bonus Plan",
          description:
            "Structured bonus plan document outlining performance-based compensation and incentive programs.",
          aliases: [
            "incentive plan",
            "performance bonus structure",
            "employee rewards program",
          ],
        },
        es: {
          name: "Plan de Bonificación de Empleados",
          description:
            "Documento de plan de bonificación estructurado que describe la compensación basada en el rendimiento y los programas de incentivos.",
          aliases: [
            "plan de incentivos",
            "estructura de bonificación por rendimiento",
            "programa de recompensas para empleados",
          ],
        },
      },
    },
  },
  {
    id: "employee-evaluation-form",
    importPath: "./us/employee-evaluation-form",
    meta: {
      id: "employee-evaluation-form",
      title: "Employee Evaluation Form",
      description:
        "Comprehensive employee performance evaluation and review form.",
      category: "Employment",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "performance review",
        "employee assessment",
        "annual review",
        "revisión de desempeño",
        "evaluación anual",
        "revisión anual",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Employee Evaluation Form",
          description:
            "Comprehensive employee performance evaluation and review form.",
          aliases: [
            "performance review",
            "employee assessment",
            "annual review",
          ],
        },
        es: {
          name: "Formulario de Evaluación de Empleado",
          description:
            "Formulario integral de evaluación y revisión del desempeño del empleado.",
          aliases: [
            "revisión de desempeño",
            "evaluación anual",
            "revisión anual",
          ],
        },
      },
    },
  },
  {
    id: "employee-handbook",
    importPath: "./us/employee-handbook",
    meta: {
      id: "employee-handbook",
      title: "Employee Handbook",
      description:
        "Comprehensive employee handbook covering policies, procedures, and workplace guidelines.",
      category: "Employment",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "staff handbook",
        "employee manual",
        "workplace policies",
        "manual de personal",
        "políticas laborales",
        "políticas en el lugar de trabajo",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Employee Handbook",
          description:
            "Comprehensive employee handbook covering policies, procedures, and workplace guidelines.",
          aliases: ["staff handbook", "employee manual", "workplace policies"],
        },
        es: {
          name: "Manual del Empleado",
          description:
            "Manual integral del empleado que cubre políticas, procedimientos y pautas del lugar de trabajo.",
          aliases: [
            "manual de personal",
            "políticas laborales",
            "políticas en el lugar de trabajo",
          ],
        },
      },
    },
  },
  {
    id: "employee-non-disclosure-agreement",
    importPath: "./us/employee-non-disclosure-agreement",
    meta: {
      id: "employee-non-disclosure-agreement",
      title: "Employee Non-Disclosure Agreement",
      description:
        "Employee-specific confidentiality and non-disclosure agreement",
      category: "Legal",
      jurisdiction: "us",
      tags: [],
      aliases: [],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Employee Non-Disclosure Agreement",
          description:
            "Employee-specific confidentiality and non-disclosure agreement",
          aliases: [],
        },
        es: {
          name: "Employee Non-Disclosure Agreement",
          description:
            "Employee-specific confidentiality and non-disclosure agreement",
          aliases: [],
        },
      },
    },
  },
  {
    id: "employee-warning-notice",
    importPath: "./us/employee-warning-notice",
    meta: {
      id: "employee-warning-notice",
      title: "Employee Warning Notice",
      description: "Formal disciplinary warning notice for employee misconduct",
      category: "HR",
      jurisdiction: "us",
      tags: [],
      aliases: [],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Employee Warning Notice",
          description:
            "Formal disciplinary warning notice for employee misconduct",
          aliases: [],
        },
        es: {
          name: "Employee Warning Notice",
          description:
            "Formal disciplinary warning notice for employee misconduct",
          aliases: [],
        },
      },
    },
  },
  {
    id: "employment-contract",
    importPath: "./us/employment-contract",
    meta: {
      id: "employment-contract",
      title: "Employment Contract",
      description:
        "Protect your business and establish clear expectations with new employees. Avoid misunderstandings about salary, benefits, and job responsibilities.",
      category: "Employment",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "employment agreement",
        "job contract",
        "work agreement",
        "employee contract",
        "acuerdo de empleo",
        "contrato laboral",
        "acuerdo de trabajo",
        "contrato de empleados",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Employment Contract",
          description:
            "Protect your business and establish clear expectations with new employees. Avoid misunderstandings about salary, benefits, and job responsibilities.",
          aliases: [
            "employment agreement",
            "job contract",
            "work agreement",
            "employee contract",
          ],
        },
        es: {
          name: "Contrato de Empleo",
          description:
            "Protege tu negocio y establece expectativas claras con nuevos empleados. Evita malentendidos sobre salario, beneficios y responsabilidades laborales.",
          aliases: [
            "acuerdo de empleo",
            "contrato laboral",
            "acuerdo de trabajo",
            "contrato de empleados",
          ],
        },
      },
    },
  },
  {
    id: "employment-offer-letter",
    importPath: "./us/employment-offer-letter",
    meta: {
      id: "employment-offer-letter",
      title: "Employment Offer Letter",
      description:
        "Formalize a job offer with key terms like salary, start date, and position.",
      category: "Employment",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "hire employee",
        "job offer",
        "terms of employment",
        "contratar empleado",
        "oferta de trabajo",
        "términos de empleo",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Employment Offer Letter",
          description:
            "Formalize a job offer with key terms like salary, start date, and position.",
          aliases: ["hire employee", "job offer", "terms of employment"],
        },
        es: {
          name: "Carta de Oferta de Empleo",
          description:
            "Formalizar una oferta de trabajo con términos clave como salario, fecha de inicio y puesto.",
          aliases: [
            "contratar empleado",
            "oferta de trabajo",
            "términos de empleo",
          ],
        },
      },
    },
  },
  {
    id: "employment-termination-letter",
    importPath: "./us/employment-termination-letter",
    meta: {
      id: "employment-termination-letter",
      title: "Employment Termination Letter",
      description: "Formally notify an employee of their termination.",
      category: "Employment",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "fire employee",
        "layoff letter",
        "termination notice",
        "despedir empleado",
        "carta de despido",
        "aviso de terminación",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Employment Termination Letter",
          description: "Formally notify an employee of their termination.",
          aliases: ["fire employee", "layoff letter", "termination notice"],
        },
        es: {
          name: "Carta de Terminación de Empleo",
          description:
            "Despide empleados de manera profesional y legal. Incluye razones del despido y información sobre beneficios finales.",
          aliases: [
            "despedir empleado",
            "carta de despido",
            "aviso de terminación",
          ],
        },
      },
    },
  },
  {
    id: "employment-verification-letter",
    importPath: "./us/employment-verification-letter",
    meta: {
      id: "employment-verification-letter",
      title: "Employment Verification Letter",
      description:
        "Official letter confirming employee status, salary, and employment details.",
      category: "Employment",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "employment letter",
        "verification of employment",
        "salary verification",
        "carta de empleo",
        "verificación de empleo",
        "verificación salarial",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Employment Verification Letter",
          description:
            "Official letter confirming employee status, salary, and employment details.",
          aliases: [
            "employment letter",
            "verification of employment",
            "salary verification",
          ],
        },
        es: {
          name: "Carta de Verificación de Empleo",
          description:
            "Carta oficial que confirma el estado del empleado, salario y detalles del empleo.",
          aliases: [
            "carta de empleo",
            "verificación de empleo",
            "verificación salarial",
          ],
        },
      },
    },
  },
  {
    id: "endorsement-agreement",
    importPath: "./us/endorsement-agreement",
    meta: {
      id: "endorsement-agreement",
      title: "Endorsement Agreement",
      description:
        "Agreement for celebrity, influencer, or spokesperson endorsement services.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "Influencer agreement",
        "Spokesperson agreement",
        "Celebrity endorsement contract",
        "Acuerdo influencer",
        "Contrato portavoz",
        "Contrato patrocinio celebridad",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Endorsement Agreement",
          description:
            "Agreement for celebrity, influencer, or spokesperson endorsement services.",
          aliases: [
            "Influencer agreement",
            "Spokesperson agreement",
            "Celebrity endorsement contract",
          ],
        },
        es: {
          name: "Acuerdo de Patrocinio",
          description:
            "Acuerdo para servicios de patrocinio de celebridades, influencers o portavoces.",
          aliases: [
            "Acuerdo influencer",
            "Contrato portavoz",
            "Contrato patrocinio celebridad",
          ],
        },
      },
    },
  },
  {
    id: "environmental-agreement",
    importPath: "./us/environmental-agreement",
    meta: {
      id: "environmental-agreement",
      title: "Environmental Agreement",
      description:
        "Protect the environment and meet regulatory requirements with agreements that ensure sustainable business practices.",
      category: "Environmental & Energy",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "environmental compliance agreement",
        "conservation agreement",
        "sustainability contract",
        "acuerdo de cumplimiento ambiental",
        "acuerdo de conservación",
        "contrato de sostenibilidad",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Environmental Agreement",
          description:
            "Protect the environment and meet regulatory requirements with agreements that ensure sustainable business practices.",
          aliases: [
            "environmental compliance agreement",
            "conservation agreement",
            "sustainability contract",
          ],
        },
        es: {
          name: "Acuerdo Ambiental",
          description:
            "Acuerdo para cumplimiento ambiental, conservación y proyectos de sostenibilidad.",
          aliases: [
            "acuerdo de cumplimiento ambiental",
            "acuerdo de conservación",
            "contrato de sostenibilidad",
          ],
        },
      },
    },
  },
  {
    id: "equipment-rental-agreement",
    importPath: "./us/equipment-rental-agreement",
    meta: {
      id: "equipment-rental-agreement",
      title: "Equipment Rental Agreement",
      description:
        "Access expensive equipment without the huge investment of buying. Protect your rental business with damage deposits and liability terms.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "equipment lease",
        "machinery rental",
        "tool rental agreement",
        "equipment hire agreement",
        "arrendamiento de equipos",
        "alquiler de maquinaria",
        "acuerdo de alquiler de herramientas",
        "acuerdo de alquiler de equipos",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Equipment Rental Agreement",
          description:
            "Access expensive equipment without the huge investment of buying. Protect your rental business with damage deposits and liability terms.",
          aliases: [
            "equipment lease",
            "machinery rental",
            "tool rental agreement",
            "equipment hire agreement",
          ],
        },
        es: {
          name: "Acuerdo de Alquiler de Equipos",
          description:
            "Renta herramientas o maquinaria pesada de manera segura. Define costos, depósitos, responsabilidades y qué pasa si se daña el equipo.",
          aliases: [
            "arrendamiento de equipos",
            "alquiler de maquinaria",
            "acuerdo de alquiler de herramientas",
            "acuerdo de alquiler de equipos",
          ],
        },
      },
    },
  },
  {
    id: "equity-incentive-plan",
    importPath: "./us/equity-incentive-plan",
    meta: {
      id: "equity-incentive-plan",
      title: "Equity Incentive Plan",
      description:
        "Motivate and retain top employees by offering ownership stakes through stock options and equity rewards.",
      category: "Employment",
      jurisdiction: "us",
      tags: [],
      aliases: [],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Equity Incentive Plan",
          description:
            "Motivate and retain top employees by offering ownership stakes through stock options and equity rewards.",
          aliases: [],
        },
        es: {
          name: "Equity Incentive Plan",
          description:
            "Comprehensive stock option and equity compensation plan",
          aliases: [],
        },
      },
    },
  },
  {
    id: "event-planning-contract",
    importPath: "./us/event-planning-contract",
    meta: {
      id: "event-planning-contract",
      title: "Event Planning Contract",
      description:
        "Contract between event planner and client for event planning services.",
      category: "Personal & Lifestyle",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "event planner agreement",
        "party planning contract",
        "wedding planning contract",
        "acuerdo de planificador de eventos",
        "contrato de planificación de bodas",
        "contrato de planificación de bodas legal",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Event Planning Contract",
          description:
            "Contract between event planner and client for event planning services.",
          aliases: [
            "event planner agreement",
            "party planning contract",
            "wedding planning contract",
          ],
        },
        es: {
          name: "Contrato de Planificación de Eventos",
          description:
            "Contrato entre planificador de eventos y cliente para servicios de planificación.",
          aliases: [
            "acuerdo de planificador de eventos",
            "contrato de planificación de bodas",
            "contrato de planificación de bodas legal",
          ],
        },
      },
    },
  },
  {
    id: "eviction-notice",
    importPath: "./us/eviction-notice",
    meta: {
      id: "eviction-notice",
      title: "Eviction Notice",
      description:
        "Protect your rental income and remove problem tenants legally. Required first step before filing eviction in court.",
      category: "Real Estate",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "remove tenant",
        "late rent",
        "kick out",
        "notice to quit",
        "desalojar inquilino",
        "renta atrasada",
        "echar",
        "notificación de desalojo",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Eviction Notice",
          description:
            "Protect your rental income and remove problem tenants legally. Required first step before filing eviction in court.",
          aliases: ["remove tenant", "late rent", "kick out", "notice to quit"],
        },
        es: {
          name: "Aviso de Desalojo",
          description:
            "Notifica legalmente a los inquilinos que deben abandonar tu propiedad. Primer paso requerido antes de presentar desalojo en corte.",
          aliases: [
            "desalojar inquilino",
            "renta atrasada",
            "echar",
            "notificación de desalojo",
          ],
        },
      },
    },
  },
  {
    id: "executive-employment-agreement",
    importPath: "./us/executive-employment-agreement",
    meta: {
      id: "executive-employment-agreement",
      title: "Executive Employment Agreement",
      description:
        "Attract top executive talent with comprehensive contracts that offer competitive benefits, clear expectations, and strong protections.",
      category: "Employment",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "executive contract",
        "C-level agreement",
        "senior management contract",
        "contrato ejecutivo",
        "acuerdo de nivel C",
        "contrato de alta gerencia",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Executive Employment Agreement",
          description:
            "Attract top executive talent with comprehensive contracts that offer competitive benefits, clear expectations, and strong protections.",
          aliases: [
            "executive contract",
            "C-level agreement",
            "senior management contract",
          ],
        },
        es: {
          name: "Contrato de Empleo Ejecutivo",
          description:
            "Contrato de empleo integral para puestos ejecutivos con términos, beneficios y protecciones mejoradas.",
          aliases: [
            "contrato ejecutivo",
            "acuerdo de nivel C",
            "contrato de alta gerencia",
          ],
        },
      },
    },
  },
  {
    id: "farm-lease-agreement",
    importPath: "./us/farm-lease-agreement",
    meta: {
      id: "farm-lease-agreement",
      title: "Farm Lease Agreement",
      description:
        "Agreement for leasing agricultural land and farming operations.",
      category: "Real Estate & Property",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "agricultural lease",
        "farmland rental agreement",
        "crop share lease",
        "arrendamiento agrícola",
        "acuerdo de alquiler de tierras",
        "arrendamiento de acciones de cultivos",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Farm Lease Agreement",
          description:
            "Agreement for leasing agricultural land and farming operations.",
          aliases: [
            "agricultural lease",
            "farmland rental agreement",
            "crop share lease",
          ],
        },
        es: {
          name: "Acuerdo de Arrendamiento de Granja",
          description:
            "Renta tierra para cultivar o criar ganado. Cubre términos de arrendamiento, responsabilidades y cómo se dividen las ganancias de las cosechas.",
          aliases: [
            "arrendamiento agrícola",
            "acuerdo de alquiler de tierras",
            "arrendamiento de acciones de cultivos",
          ],
        },
      },
    },
  },
  {
    id: "film-production-agreement",
    importPath: "./us/film-production-agreement",
    meta: {
      id: "film-production-agreement",
      title: "Film Production Agreement",
      description:
        "Agreement for film and video production services and rights.",
      category: "Entertainment & Media",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "movie production contract",
        "video production agreement",
        "film contract",
        "contrato de producción",
        "acuerdo cinematográfico",
        "contrato cinematográfico",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Film Production Agreement",
          description:
            "Agreement for film and video production services and rights.",
          aliases: [
            "movie production contract",
            "video production agreement",
            "film contract",
          ],
        },
        es: {
          name: "Acuerdo de Producción Cinematográfica",
          description:
            "Acuerdo para servicios de producción de películas y videos.",
          aliases: [
            "contrato de producción",
            "acuerdo cinematográfico",
            "contrato cinematográfico",
          ],
        },
      },
    },
  },
  {
    id: "fitness-waiver",
    importPath: "./us/fitness-waiver",
    meta: {
      id: "fitness-waiver",
      title: "Fitness Waiver",
      description:
        "Liability waiver for fitness activities, gyms, and personal training.",
      category: "Personal & Lifestyle",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "gym waiver",
        "fitness liability waiver",
        "exercise waiver",
        "exención de gimnasio",
        "renuncia de responsabilidad de ejercicio",
        "renuncia de ejercicio",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Fitness Waiver",
          description:
            "Liability waiver for fitness activities, gyms, and personal training.",
          aliases: [
            "gym waiver",
            "fitness liability waiver",
            "exercise waiver",
          ],
        },
        es: {
          name: "Exención de Fitness",
          description:
            "Protege tu gimnasio o estudio de fitness de demandas si alguien se lastima durante ejercicios o entrenamiento.",
          aliases: [
            "exención de gimnasio",
            "renuncia de responsabilidad de ejercicio",
            "renuncia de ejercicio",
          ],
        },
      },
    },
  },
  {
    id: "food-truck-agreement",
    importPath: "./us/food-truck-agreement",
    meta: {
      id: "food-truck-agreement",
      title: "Food Truck Agreement",
      description:
        "Agreement for food truck operations, vending, and location services.",
      category: "Food & Hospitality",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "mobile food vendor agreement",
        "food cart contract",
        "street food agreement",
        "contrato de vendedor ambulante",
        "acuerdo de comida móvil",
        "acuerdo de comida callejera",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Food Truck Agreement",
          description:
            "Agreement for food truck operations, vending, and location services.",
          aliases: [
            "mobile food vendor agreement",
            "food cart contract",
            "street food agreement",
          ],
        },
        es: {
          name: "Acuerdo de Food Truck",
          description:
            "Acuerdo para operaciones de food truck, venta y servicios de ubicación.",
          aliases: [
            "contrato de vendedor ambulante",
            "acuerdo de comida móvil",
            "acuerdo de comida callejera",
          ],
        },
      },
    },
  },
  {
    id: "franchise-agreement",
    importPath: "./us/franchise-agreement",
    meta: {
      id: "franchise-agreement",
      title: "Franchise Agreement",
      description:
        "Build your business empire by expanding through franchising with clear operational guidelines and brand protection.",
      category: "Business & Commercial",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "franchise contract",
        "franchising agreement",
        "contrato de franquicia",
        "acuerdo de franquicia",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Franchise Agreement",
          description:
            "Build your business empire by expanding through franchising with clear operational guidelines and brand protection.",
          aliases: ["franchise contract", "franchising agreement"],
        },
        es: {
          name: "Acuerdo de Franquicia",
          description:
            "Acuerdo para operaciones comerciales y licencias de franquicia.",
          aliases: ["contrato de franquicia", "acuerdo de franquicia"],
        },
      },
    },
  },
  {
    id: "franchise-disclosure-agreement",
    importPath: "./us/franchise-disclosure-agreement",
    meta: {
      id: "franchise-disclosure-agreement",
      title: "Franchise Disclosure Agreement",
      description:
        "Comprehensive franchise disclosure document and agreement for franchisors and franchisees.",
      category: "Business & Commercial",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "fdd",
        "franchise agreement",
        "franchising contract",
        "contrato de franquicia",
        "acuerdo de franquiciamiento",
        "contrato de franquicia legal",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Franchise Disclosure Agreement",
          description:
            "Comprehensive franchise disclosure document and agreement for franchisors and franchisees.",
          aliases: ["fdd", "franchise agreement", "franchising contract"],
        },
        es: {
          name: "Acuerdo de Divulgación de Franquicia",
          description:
            "Documento completo de divulgación y acuerdo de franquicia.",
          aliases: [
            "contrato de franquicia",
            "acuerdo de franquiciamiento",
            "contrato de franquicia legal",
          ],
        },
      },
    },
  },
  {
    id: "gaming-agreement",
    importPath: "./us/gaming-agreement",
    meta: {
      id: "gaming-agreement",
      title: "Gaming Agreement",
      description:
        "Agreement for esports, gaming tournaments, and professional gaming contracts.",
      category: "Gaming & Esports",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "esports contract",
        "gaming contract",
        "tournament agreement",
        "contrato de esports",
        "acuerdo de torneo",
        "acuerdo de torneo legal",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Gaming Agreement",
          description:
            "Agreement for esports, gaming tournaments, and professional gaming contracts.",
          aliases: [
            "esports contract",
            "gaming contract",
            "tournament agreement",
          ],
        },
        es: {
          name: "Acuerdo de Gaming",
          description:
            "Acuerdo para esports, torneos de juegos y contratos de gaming profesional.",
          aliases: [
            "contrato de esports",
            "acuerdo de torneo",
            "acuerdo de torneo legal",
          ],
        },
      },
    },
  },
  {
    id: "general-contractor-agreement",
    importPath: "./us/general-contractor-agreement",
    meta: {
      id: "general-contractor-agreement",
      title: "General Contractor Agreement",
      description:
        "Comprehensive agreement for general contracting and construction management services.",
      category: "Construction & Home Improvement",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "gc agreement",
        "construction management contract",
        "prime contractor agreement",
        "contrato de construcción general",
        "acuerdo de gestión de obra",
        "acuerdo de contratista principal",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "General Contractor Agreement",
          description:
            "Comprehensive agreement for general contracting and construction management services.",
          aliases: [
            "gc agreement",
            "construction management contract",
            "prime contractor agreement",
          ],
        },
        es: {
          name: "Acuerdo de Contratista General",
          description:
            "Acuerdo integral para servicios de contratación general y gestión de construcción.",
          aliases: [
            "contrato de construcción general",
            "acuerdo de gestión de obra",
            "acuerdo de contratista principal",
          ],
        },
      },
    },
  },
  {
    id: "general-inquiry",
    importPath: "./us/general-inquiry",
    meta: {
      id: "general-inquiry",
      title: "General Inquiry",
      description:
        "For situations where a specific document isn't immediately clear or needed.",
      category: "Miscellaneous",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "help",
        "question",
        "legal advice",
        "not sure",
        "ayuda",
        "pregunta",
        "consejo legal",
        "no estoy seguro",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "General Inquiry",
          description:
            "For situations where a specific document isn't immediately clear or needed.",
          aliases: ["help", "question", "legal advice", "not sure"],
        },
        es: {
          name: "Consulta General",
          description:
            "Para situaciones donde un documento específico no está claro o no se necesita de inmediato.",
          aliases: ["ayuda", "pregunta", "consejo legal", "no estoy seguro"],
        },
      },
    },
  },
  {
    id: "general-liability-waiver",
    importPath: "./us/general-liability-waiver",
    meta: {
      id: "general-liability-waiver",
      title: "General Liability Waiver",
      description:
        "Comprehensive liability waiver and release form for activities and services.",
      category: "Risk Management",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "liability release",
        "waiver of liability",
        "release form",
        "liberación de responsabilidad",
        "exención de responsabilidad",
        "formulario de liberación",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "General Liability Waiver",
          description:
            "Comprehensive liability waiver and release form for activities and services.",
          aliases: ["liability release", "waiver of liability", "release form"],
        },
        es: {
          name: "Exención de Responsabilidad General",
          description:
            "Protege tu negocio de demandas por accidentes en eventos, talleres o actividades peligrosas. Exención completa de responsabilidad.",
          aliases: [
            "liberación de responsabilidad",
            "exención de responsabilidad",
            "formulario de liberación",
          ],
        },
      },
    },
  },
  {
    id: "government-contract-agreement",
    importPath: "./us/government-contract-agreement",
    meta: {
      id: "government-contract-agreement",
      title: "Government Contract Agreement",
      description:
        "Agreement for providing goods or services to government agencies.",
      category: "Government & Legal Services",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "federal contract",
        "public sector agreement",
        "gsa contract",
        "contrato federal",
        "acuerdo de sector público",
        "contrato gsa",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Government Contract Agreement",
          description:
            "Agreement for providing goods or services to government agencies.",
          aliases: [
            "federal contract",
            "public sector agreement",
            "gsa contract",
          ],
        },
        es: {
          name: "Acuerdo de Contrato Gubernamental",
          description:
            "Acuerdo para proporcionar bienes o servicios a agencias gubernamentales.",
          aliases: [
            "contrato federal",
            "acuerdo de sector público",
            "contrato gsa",
          ],
        },
      },
    },
  },
  {
    id: "guardianship-agreement",
    importPath: "./us/guardianship-agreement",
    meta: {
      id: "guardianship-agreement",
      title: "Guardianship Agreement",
      description:
        "Protect and care for a loved one by establishing your legal guardianship responsibilities and decision-making authority.",
      category: "Family & Personal",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "guardian appointment",
        "custody agreement",
        "legal guardianship",
        "nombramiento de tutor",
        "acuerdo de custodia",
        "tutela legal",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Guardianship Agreement",
          description:
            "Protect and care for a loved one by establishing your legal guardianship responsibilities and decision-making authority.",
          aliases: [
            "guardian appointment",
            "custody agreement",
            "legal guardianship",
          ],
        },
        es: {
          name: "Acuerdo de Tutelá",
          description:
            "Acuerdo legal que establece responsabilidades y autoridad de tutelá.",
          aliases: [
            "nombramiento de tutor",
            "acuerdo de custodia",
            "tutela legal",
          ],
        },
      },
    },
  },
  {
    id: "health-care-directive",
    importPath: "./us/health-care-directive",
    meta: {
      id: "health-care-directive",
      title: "Healthcare Directive (Advance Directive)",
      description:
        "Document your healthcare wishes and treatment preferences for situations when you cannot communicate them yourself.",
      category: "Estate Planning",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "advance directive",
        "healthcare directive",
        "medical directive",
        "treatment directive",
        "directiva anticipada",
        "directiva médica",
        "directiva de tratamiento",
        "directiva de tratamiento legal",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Healthcare Directive (Advance Directive)",
          description:
            "Document your healthcare wishes and treatment preferences for situations when you cannot communicate them yourself.",
          aliases: [
            "advance directive",
            "healthcare directive",
            "medical directive",
            "treatment directive",
          ],
        },
        es: {
          name: "Directiva de Atención Médica (Directiva Anticipada)",
          description:
            "Documente sus deseos de atención médica y preferencias de tratamiento para situaciones cuando no pueda comunicarlos usted mismo.",
          aliases: [
            "directiva anticipada",
            "directiva médica",
            "directiva de tratamiento",
            "directiva de tratamiento legal",
          ],
        },
      },
    },
  },
  {
    id: "healthcare-power-of-attorney",
    importPath: "./us/healthcare-power-of-attorney",
    meta: {
      id: "healthcare-power-of-attorney",
      title: "Healthcare Power of Attorney",
      description:
        "Appoint an agent to make healthcare decisions if you cannot.",
      category: "Personal",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "medical poa",
        "healthcare proxy",
        "appoint agent for health",
        "medical decisions",
        "poder médico",
        "proxy de salud",
        "designar agente de salud",
        "decisiones médicas",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Healthcare Power of Attorney",
          description:
            "Appoint an agent to make healthcare decisions if you cannot.",
          aliases: [
            "medical poa",
            "healthcare proxy",
            "appoint agent for health",
            "medical decisions",
          ],
        },
        es: {
          name: "Poder Notarial para Atención Médica",
          description:
            "Nombrar un agente para tomar decisiones de atención médica si usted no puede.",
          aliases: [
            "poder médico",
            "proxy de salud",
            "designar agente de salud",
            "decisiones médicas",
          ],
        },
      },
    },
  },
  {
    id: "hipaa-authorization-form",
    importPath: "./us/hipaa-authorization-form",
    meta: {
      id: "hipaa-authorization-form",
      title: "HIPAA Authorization Form",
      description:
        "Grant access to your medical records safely and legally while maintaining privacy control under HIPAA regulations.",
      category: "Healthcare & Medical",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "medical records release",
        "health information authorization",
        "HIPAA release form",
        "liberación de registros médicos",
        "autorización de información de salud",
        "formulario de liberación de hipaa",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "HIPAA Authorization Form",
          description:
            "Grant access to your medical records safely and legally while maintaining privacy control under HIPAA regulations.",
          aliases: [
            "medical records release",
            "health information authorization",
            "HIPAA release form",
          ],
        },
        es: {
          name: "Formulario de Autorización HIPAA",
          description:
            "Formulario que autoriza la divulgación de información de salud protegida bajo HIPAA.",
          aliases: [
            "liberación de registros médicos",
            "autorización de información de salud",
            "formulario de liberación de hipaa",
          ],
        },
      },
    },
  },
  {
    id: "home-improvement-contract",
    importPath: "./us/home-improvement-contract",
    meta: {
      id: "home-improvement-contract",
      title: "Home Improvement Contract",
      description:
        "Comprehensive contract for home renovation, remodeling, and improvement projects.",
      category: "Construction",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "renovation contract",
        "remodeling agreement",
        "contractor agreement",
        "contrato de renovación",
        "acuerdo de remodelación",
        "acuerdo de contratista",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Home Improvement Contract",
          description:
            "Comprehensive contract for home renovation, remodeling, and improvement projects.",
          aliases: [
            "renovation contract",
            "remodeling agreement",
            "contractor agreement",
          ],
        },
        es: {
          name: "Contrato de Mejoras del Hogar",
          description:
            "Contrato integral para proyectos de renovación, remodelación y mejoras del hogar.",
          aliases: [
            "contrato de renovación",
            "acuerdo de remodelación",
            "acuerdo de contratista",
          ],
        },
      },
    },
  },
  {
    id: "horse-boarding-agreement",
    importPath: "./us/horse-boarding-agreement",
    meta: {
      id: "horse-boarding-agreement",
      title: "Horse Boarding Agreement",
      description: "Agreement for horse boarding and stable services.",
      category: "Agriculture & Farming",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "stable boarding",
        "equine boarding",
        "horse care agreement",
        "pensión de caballos",
        "cuidado equino",
        "acuerdo de cuidado de caballos",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Horse Boarding Agreement",
          description: "Agreement for horse boarding and stable services.",
          aliases: [
            "stable boarding",
            "equine boarding",
            "horse care agreement",
          ],
        },
        es: {
          name: "Acuerdo de Pensión de Caballos",
          description:
            "Acuerdo para pensión de caballos y servicios de establo.",
          aliases: [
            "pensión de caballos",
            "cuidado equino",
            "acuerdo de cuidado de caballos",
          ],
        },
      },
    },
  },
  {
    id: "hotel-agreement",
    importPath: "./us/hotel-agreement",
    meta: {
      id: "hotel-agreement",
      title: "Hotel Agreement",
      description:
        "Agreement for hotel operations, partnerships, or management.",
      category: "Food & Hospitality",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "hotel partnership",
        "hospitality agreement",
        "lodging agreement",
        "sociedad hotelera",
        "acuerdo de hospitalidad",
        "acuerdo de alojamiento",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Hotel Agreement",
          description:
            "Agreement for hotel operations, partnerships, or management.",
          aliases: [
            "hotel partnership",
            "hospitality agreement",
            "lodging agreement",
          ],
        },
        es: {
          name: "Acuerdo de Hotel",
          description:
            "Acuerdo para operaciones, asociaciones o gestión de hoteles.",
          aliases: [
            "sociedad hotelera",
            "acuerdo de hospitalidad",
            "acuerdo de alojamiento",
          ],
        },
      },
    },
  },
  {
    id: "hunting-lease-agreement",
    importPath: "./us/hunting-lease-agreement",
    meta: {
      id: "hunting-lease-agreement",
      title: "Hunting Lease Agreement",
      description: "Agreement for leasing hunting rights on private property.",
      category: "Real Estate & Property",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "hunting rights lease",
        "recreational lease",
        "game lease",
        "arrendamiento de derechos de caza",
        "arrendamiento recreativo",
        "arrendamiento del juego",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Hunting Lease Agreement",
          description:
            "Agreement for leasing hunting rights on private property.",
          aliases: ["hunting rights lease", "recreational lease", "game lease"],
        },
        es: {
          name: "Acuerdo de Arrendamiento de Caza",
          description:
            "Acuerdo para arrendar derechos de caza en propiedad privada.",
          aliases: [
            "arrendamiento de derechos de caza",
            "arrendamiento recreativo",
            "arrendamiento del juego",
          ],
        },
      },
    },
  },
  {
    id: "immigration-affidavit",
    importPath: "./us/immigration-affidavit",
    meta: {
      id: "immigration-affidavit",
      title: "Immigration Affidavit",
      description:
        "Support your immigration case with a professional sworn statement that strengthens your application.",
      category: "Government & Legal Services",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "affidavit of support",
        "immigration statement",
        "sworn immigration declaration",
        "declaración de apoyo",
        "declaración de inmigración",
        "declaración de inmigración jurada",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Immigration Affidavit",
          description:
            "Support your immigration case with a professional sworn statement that strengthens your application.",
          aliases: [
            "affidavit of support",
            "immigration statement",
            "sworn immigration declaration",
          ],
        },
        es: {
          name: "Declaración Jurada de Inmigración",
          description:
            "Declaración jurada para procedimientos y aplicaciones de inmigración.",
          aliases: [
            "declaración de apoyo",
            "declaración de inmigración",
            "declaración de inmigración jurada",
          ],
        },
      },
    },
  },
  {
    id: "independent-contractor-agreement",
    importPath: "./us/independent-contractor-agreement",
    meta: {
      id: "independent-contractor-agreement",
      title: "Independent Contractor Agreement",
      description:
        "Protect your business when hiring freelancers and avoid IRS problems. Clearly establish they are contractors, not employees, to prevent tax issues.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "freelance",
        "contractor",
        "gig work",
        "1099 job",
        "contratista",
        "trabajo gig",
        "trabajo 1099",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Independent Contractor Agreement",
          description:
            "Protect your business when hiring freelancers and avoid IRS problems. Clearly establish they are contractors, not employees, to prevent tax issues.",
          aliases: ["freelance", "contractor", "gig work", "1099 job"],
        },
        es: {
          name: "Contrato de Contratista Independiente",
          description:
            "Protege tu negocio al contratar freelancers y evita problemas con el IRS. Establece claramente que son contratistas independientes, no empleados.",
          aliases: ["freelance", "contratista", "trabajo gig", "trabajo 1099"],
        },
      },
    },
  },
  {
    id: "influencer-agreement",
    importPath: "./us/influencer-agreement",
    meta: {
      id: "influencer-agreement",
      title: "Influencer Agreement",
      description:
        "Professional agreement for influencer marketing partnerships and brand collaborations.",
      category: "Marketing & Advertising",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "brand partnership agreement",
        "influencer contract",
        "social media collaboration agreement",
        "acuerdo de colaboración de marca",
        "contrato de influencer",
        "acuerdo de colaboración de redes sociales",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Influencer Agreement",
          description:
            "Professional agreement for influencer marketing partnerships and brand collaborations.",
          aliases: [
            "brand partnership agreement",
            "influencer contract",
            "social media collaboration agreement",
          ],
        },
        es: {
          name: "Acuerdo de Influencer",
          description:
            "Acuerdo profesional para asociaciones de marketing de influencers y colaboraciones de marca.",
          aliases: [
            "acuerdo de colaboración de marca",
            "contrato de influencer",
            "acuerdo de colaboración de redes sociales",
          ],
        },
      },
    },
  },
  {
    id: "insurance-claim-form",
    importPath: "./us/insurance-claim-form",
    meta: {
      id: "insurance-claim-form",
      title: "Insurance Claim Form",
      description:
        "Form for filing insurance claims for various types of coverage.",
      category: "Risk & Liability",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "claim form",
        "insurance claim",
        "claim application",
        "formulario de reclamo",
        "solicitud de seguro",
        "solicitud de reclamación",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Insurance Claim Form",
          description:
            "Form for filing insurance claims for various types of coverage.",
          aliases: ["claim form", "insurance claim", "claim application"],
        },
        es: {
          name: "Formulario de Reclamo de Seguro",
          description:
            "Reclama dinero de tu seguro por daños, accidentes o pérdidas. Formato profesional que aumenta posibilidades de aprobación.",
          aliases: [
            "formulario de reclamo",
            "solicitud de seguro",
            "solicitud de reclamación",
          ],
        },
      },
    },
  },
  {
    id: "international-trade-agreement",
    importPath: "./us/international-trade-agreement",
    meta: {
      id: "international-trade-agreement",
      title: "International Trade Agreement",
      description:
        "Agreement for international business transactions and trade relationships.",
      category: "Business & Commercial",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "import export agreement",
        "international sales contract",
        "global trade contract",
        "contrato de importación exportación",
        "acuerdo comercial global",
        "contrato comercial global",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "International Trade Agreement",
          description:
            "Agreement for international business transactions and trade relationships.",
          aliases: [
            "import export agreement",
            "international sales contract",
            "global trade contract",
          ],
        },
        es: {
          name: "Acuerdo de Comercio Internacional",
          description:
            "Acuerdo para transacciones comerciales internacionales.",
          aliases: [
            "contrato de importación exportación",
            "acuerdo comercial global",
            "contrato comercial global",
          ],
        },
      },
    },
  },
  {
    id: "internship-agreement",
    importPath: "./us/internship-agreement",
    meta: {
      id: "internship-agreement",
      title: "Internship Agreement",
      description:
        "Agreement between company and intern for internship programs and work experience.",
      category: "Employment & HR",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "intern agreement",
        "work experience agreement",
        "student internship contract",
        "acuerdo de intern",
        "contrato de experiencia laboral",
        "contrato de pasantías para estudiantes",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Internship Agreement",
          description:
            "Agreement between company and intern for internship programs and work experience.",
          aliases: [
            "intern agreement",
            "work experience agreement",
            "student internship contract",
          ],
        },
        es: {
          name: "Acuerdo de Pasantía",
          description:
            "Acuerdo entre empresa y pasante para programas de pasantía y experiencia laboral.",
          aliases: [
            "acuerdo de intern",
            "contrato de experiencia laboral",
            "contrato de pasantías para estudiantes",
          ],
        },
      },
    },
  },
  {
    id: "invention-assignment-agreement",
    importPath: "./us/invention-assignment-agreement",
    meta: {
      id: "invention-assignment-agreement",
      title: "Invention Assignment Agreement",
      description:
        "Protect your company's innovations by ensuring all employee inventions and intellectual property belong to your business.",
      category: "Intellectual Property",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "employee invention assignment",
        "contractor invention agreement",
        "invention ownership",
        "ip assignment",
        "asignación invenciones empleado",
        "acuerdo invenciones contratista",
        "propiedad invenciones",
        "asignación pi",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Invention Assignment Agreement",
          description:
            "Protect your company's innovations by ensuring all employee inventions and intellectual property belong to your business.",
          aliases: [
            "employee invention assignment",
            "contractor invention agreement",
            "invention ownership",
            "ip assignment",
          ],
        },
        es: {
          name: "Acuerdo de Asignación de Invenciones",
          description:
            "Acuerdo que asigna las invenciones de empleados o contratistas a la empresa.",
          aliases: [
            "asignación invenciones empleado",
            "acuerdo invenciones contratista",
            "propiedad invenciones",
            "asignación pi",
          ],
        },
      },
    },
  },
  {
    id: "investment-agreement",
    importPath: "./us/investment-agreement",
    meta: {
      id: "investment-agreement",
      title: "Investment Agreement",
      description:
        "Secure your financial future by clearly defining investment terms, returns, and responsibilities for all parties.",
      category: "Finance & Lending",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "investor agreement",
        "investment contract",
        "contrato de inversionista",
        "acuerdo de capital",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Investment Agreement",
          description:
            "Secure your financial future by clearly defining investment terms, returns, and responsibilities for all parties.",
          aliases: ["investor agreement", "investment contract"],
        },
        es: {
          name: "Acuerdo de Inversión",
          description:
            "Acuerdo que describe términos para transacciones de inversión.",
          aliases: ["contrato de inversionista", "acuerdo de capital"],
        },
      },
    },
  },
  {
    id: "invoice",
    importPath: "./us/invoice",
    meta: {
      id: "invoice",
      title: "Invoice",
      description:
        "Get paid faster with professional invoices that customers take seriously. Improve cash flow with clear payment terms.",
      category: "Finance",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "invoice",
        "billing statement",
        "payment request",
        "factura",
        "recibo de pago",
        "cuenta por cobrar",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Invoice",
          description:
            "Get paid faster with professional invoices that customers take seriously. Improve cash flow with clear payment terms.",
          aliases: ["invoice", "billing statement", "payment request"],
        },
        es: {
          name: "Factura",
          description:
            "Cobra a clientes por bienes o servicios que has proporcionado. Formato profesional de factura para recibir pago más rápido.",
          aliases: ["factura", "recibo de pago", "cuenta por cobrar"],
        },
      },
    },
  },
  {
    id: "job-application-form",
    importPath: "./us/job-application-form",
    meta: {
      id: "job-application-form",
      title: "Job Application Form",
      description:
        "Professional job application form for collecting candidate information.",
      category: "Employment",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "employment application",
        "hiring form",
        "candidate application",
        "solicitud de trabajo",
        "formulario de contratación",
        "solicitud de candidato",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Job Application Form",
          description:
            "Professional job application form for collecting candidate information.",
          aliases: [
            "employment application",
            "hiring form",
            "candidate application",
          ],
        },
        es: {
          name: "Formulario de Solicitud de Empleo",
          description:
            "Formulario profesional de solicitud de empleo para recopilar información de candidatos.",
          aliases: [
            "solicitud de trabajo",
            "formulario de contratación",
            "solicitud de candidato",
          ],
        },
      },
    },
  },
  {
    id: "joint-living-trust",
    importPath: "./us/joint-living-trust",
    meta: {
      id: "joint-living-trust",
      title: "Joint Living Trust (Married Couples)",
      description:
        "A revocable living trust for married couples to manage joint assets and provide for each other and beneficiaries.",
      category: "Estate Planning",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "joint trust",
        "married couple trust",
        "joint revocable trust",
        "family trust",
        "fideicomiso conjunto",
        "fideicomiso de pareja",
        "fideicomiso familiar",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Joint Living Trust (Married Couples)",
          description:
            "A revocable living trust for married couples to manage joint assets and provide for each other and beneficiaries.",
          aliases: [
            "joint trust",
            "married couple trust",
            "joint revocable trust",
            "family trust",
          ],
        },
        es: {
          name: "Fideicomiso Conjunto en Vida (Parejas Casadas)",
          description:
            "Un fideicomiso en vida revocable para parejas casadas para administrar activos conjuntos y proveer el uno para el otro y beneficiarios.",
          aliases: [
            "fideicomiso conjunto",
            "fideicomiso de pareja",
            "fideicomiso familiar",
            "family trust",
          ],
        },
      },
    },
  },
  {
    id: "joint-venture-agreement",
    importPath: "./us/joint-venture-agreement",
    meta: {
      id: "joint-venture-agreement",
      title: "Joint Venture Agreement",
      description:
        "Partner with another business on a specific project. Share costs, profits, and responsibilities while protecting both companies.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "business collaboration",
        "joint venture",
        "strategic partnership",
        "colaboración empresarial",
        "empresa conjunta",
        "asociación estratégica",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Joint Venture Agreement",
          description:
            "Partner with another business on a specific project. Share costs, profits, and responsibilities while protecting both companies.",
          aliases: [
            "business collaboration",
            "joint venture",
            "strategic partnership",
          ],
        },
        es: {
          name: "Acuerdo de Empresa Conjunta",
          description:
            "Une fuerzas con otro negocio para un proyecto específico. Define responsabilidades, inversión y cómo se dividen ganancias y pérdidas.",
          aliases: [
            "colaboración empresarial",
            "empresa conjunta",
            "asociación estratégica",
          ],
        },
      },
    },
  },
  {
    id: "landscaping-contract",
    importPath: "./us/landscaping-contract",
    meta: {
      id: "landscaping-contract",
      title: "Landscaping Contract",
      description:
        "Professional contract for landscaping services including design, installation, and maintenance work.",
      category: "Construction",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "landscape design contract",
        "yard work agreement",
        "garden services contract",
        "contrato de diseño de paisaje",
        "acuerdo de trabajo de jardín",
        "contrato de servicios de jardín",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Landscaping Contract",
          description:
            "Professional contract for landscaping services including design, installation, and maintenance work.",
          aliases: [
            "landscape design contract",
            "yard work agreement",
            "garden services contract",
          ],
        },
        es: {
          name: "Contrato de Paisajismo",
          description:
            "Contrato profesional para servicios de paisajismo incluyendo diseño, instalación y trabajo de mantenimiento.",
          aliases: [
            "contrato de diseño de paisaje",
            "acuerdo de trabajo de jardín",
            "contrato de servicios de jardín",
          ],
        },
      },
    },
  },
  {
    id: "last-will-testament",
    importPath: "./us/last-will-testament",
    meta: {
      id: "last-will-testament",
      title: "Last Will and Testament",
      description:
        "Secure your family's future by controlling how your assets are distributed. Prevent family conflicts and legal complications.",
      category: "Estate Planning",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "will",
        "inheritance",
        "distribute assets",
        "testamento",
        "herencia",
        "distribuir bienes",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Last Will and Testament",
          description:
            "Secure your family's future by controlling how your assets are distributed. Prevent family conflicts and legal complications.",
          aliases: ["will", "inheritance", "distribute assets"],
        },
        es: {
          name: "Última Voluntad y Testamento",
          description:
            "Controla quién obtiene tu propiedad y posesiones después de que mueras. Documento esencial para proteger el futuro de tu familia.",
          aliases: ["testamento", "herencia", "distribuir bienes"],
        },
      },
    },
  },
  {
    id: "late-rent-notice",
    importPath: "./us/late-rent-notice",
    meta: {
      id: "late-rent-notice",
      title: "Late Rent Notice",
      description: "Official notice to tenants for overdue rent payments",
      category: "Real Estate & Property",
      jurisdiction: "us",
      tags: [],
      aliases: [],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Late Rent Notice",
          description: "Official notice to tenants for overdue rent payments",
          aliases: [],
        },
        es: {
          name: "Aviso de retraso en el pago del alquiler",
          description:
            "Aviso oficial para informar a los inquilinos sobre pagos de renta vencidos.",
          aliases: [],
        },
      },
    },
  },
  {
    id: "lease-addendum",
    importPath: "./us/lease-addendum",
    meta: {
      id: "lease-addendum",
      title: "Lease Addendum",
      description:
        "Add terms to existing lease agreements with a legally binding lease addendum",
      category: "Real Estate & Property",
      jurisdiction: "us",
      tags: [],
      aliases: [],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Lease Addendum",
          description:
            "Add terms to existing lease agreements with a legally binding lease addendum",
          aliases: [],
        },
        es: {
          name: "Anexo al contrato de arrendamiento",
          description:
            "Agrega términos a contratos de arrendamiento existentes con un anexo legalmente vinculante.",
          aliases: [],
        },
      },
    },
  },
  {
    id: "lease-agreement",
    importPath: "./us/lease-agreement",
    meta: {
      id: "lease-agreement",
      title: "Residential Lease Agreement",
      description:
        "Generate rental income or secure quality housing with clear terms that protect both parties. Prevent costly disputes.",
      category: "Real Estate",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "rent apartment",
        "tenant",
        "lease form",
        "landlord agreement",
        "alquiler de apartamento",
        "inquilino",
        "formulario de arrendamiento",
        "acuerdo de propietario",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Residential Lease Agreement",
          description:
            "Generate rental income or secure quality housing with clear terms that protect both parties. Prevent costly disputes.",
          aliases: [
            "rent apartment",
            "tenant",
            "lease form",
            "landlord agreement",
          ],
        },
        es: {
          name: "Contrato de Arrendamiento Residencial",
          description:
            "Protege tus derechos como propietario o inquilino. Establece expectativas claras sobre renta, depósitos, reparaciones y reglas de la propiedad.",
          aliases: [
            "alquiler de apartamento",
            "inquilino",
            "formulario de arrendamiento",
            "acuerdo de propietario",
          ],
        },
      },
    },
  },
  {
    id: "lease-amendment",
    importPath: "./us/lease-amendment",
    meta: {
      id: "lease-amendment",
      title: "Lease Amendment",
      description:
        "Modify existing lease terms with a legally binding lease amendment document.",
      category: "Real Estate & Property",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "lease modification",
        "rental amendment",
        "lease change",
        "lease alteration",
        "modificación de arrendamiento",
        "cambio de alquiler",
        "alteración de contrato",
        "alteración del arrendamiento",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Lease Amendment",
          description:
            "Modify existing lease terms with a legally binding lease amendment document.",
          aliases: [
            "lease modification",
            "rental amendment",
            "lease change",
            "lease alteration",
          ],
        },
        es: {
          name: "Enmienda de Arrendamiento",
          description:
            "Modifica los términos de arrendamiento existentes con una enmienda legalmente válida.",
          aliases: [
            "modificación de arrendamiento",
            "cambio de alquiler",
            "alteración de contrato",
            "alteración del arrendamiento",
          ],
        },
      },
    },
  },
  {
    id: "lease-renewal-agreement",
    importPath: "./us/lease-renewal-agreement",
    meta: {
      id: "lease-renewal-agreement",
      title: "Lease Renewal Agreement",
      description:
        "Extend your existing lease with updated terms and conditions.",
      category: "Real Estate",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "lease extension",
        "rental renewal",
        "lease continuation",
        "extensión de arrendamiento",
        "renovación de alquiler",
        "continuación del arrendamiento",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Lease Renewal Agreement",
          description:
            "Extend your existing lease with updated terms and conditions.",
          aliases: ["lease extension", "rental renewal", "lease continuation"],
        },
        es: {
          name: "Acuerdo de Renovación de Arrendamiento",
          description:
            "Extiende tu arrendamiento existente con términos y condiciones actualizados.",
          aliases: [
            "extensión de arrendamiento",
            "renovación de alquiler",
            "continuación del arrendamiento",
          ],
        },
      },
    },
  },
  {
    id: "lease-termination-letter",
    importPath: "./us/lease-termination-letter",
    meta: {
      id: "lease-termination-letter",
      title: "Lease Termination Letter",
      description:
        "Formally notify your landlord or tenant of lease termination.",
      category: "Real Estate",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "lease notice",
        "termination notice",
        "end lease letter",
        "aviso de terminación",
        "carta de fin de contrato",
        "carta de arrendamiento final",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Lease Termination Letter",
          description:
            "Formally notify your landlord or tenant of lease termination.",
          aliases: ["lease notice", "termination notice", "end lease letter"],
        },
        es: {
          name: "Carta de Terminación de Arrendamiento",
          description:
            "Termina tu contrato de renta legalmente. Avisa con anticipación adecuada para evitar problemas y recuperar depósitos.",
          aliases: [
            "aviso de terminación",
            "carta de fin de contrato",
            "carta de arrendamiento final",
          ],
        },
      },
    },
  },
  {
    id: "leave-of-absence-request-form",
    importPath: "./us/leave-of-absence-request-form",
    meta: {
      id: "leave-of-absence-request-form",
      title: "Leave of Absence Request Form",
      description: "Formal request form for employee leave of absence",
      category: "HR",
      jurisdiction: "us",
      tags: [],
      aliases: [],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Leave of Absence Request Form",
          description: "Formal request form for employee leave of absence",
          aliases: [],
        },
        es: {
          name: "Leave of Absence Request Form",
          description: "Formal request form for employee leave of absence",
          aliases: [],
        },
      },
    },
  },
  {
    id: "letter-of-intent",
    importPath: "./us/letter-of-intent",
    meta: {
      id: "letter-of-intent",
      title: "Letter of Intent",
      description:
        "Express your intention to enter into a business agreement or transaction.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "LOI",
        "intent letter",
        "business intent",
        "carta de intenciones",
        "intención comercial",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Letter of Intent",
          description:
            "Express your intention to enter into a business agreement or transaction.",
          aliases: ["LOI", "intent letter", "business intent"],
        },
        es: {
          name: "Carta de Intención",
          description:
            "Expresa tu intención de entrar en un acuerdo comercial o transacción.",
          aliases: ["carta de intenciones", "LOI", "intención comercial"],
        },
      },
    },
  },
  {
    id: "licensing-agreement",
    importPath: "./us/licensing-agreement",
    meta: {
      id: "licensing-agreement",
      title: "Licensing Agreement",
      description:
        "Generate revenue from your intellectual property without selling it. Allow others to use your brand, product, or technology for royalties.",
      category: "Intellectual Property",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "licensing contract",
        "license agreement",
        "intellectual property license",
        "contrato de licencia",
        "licencia de propiedad intelectual",
        "licencia de propiedad intelectual legal",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Licensing Agreement",
          description:
            "Generate revenue from your intellectual property without selling it. Allow others to use your brand, product, or technology for royalties.",
          aliases: [
            "licensing contract",
            "license agreement",
            "intellectual property license",
          ],
        },
        es: {
          name: "Acuerdo de Licencia",
          description:
            "Permite que otros usen tu marca, producto o tecnología a cambio de regalías. Define términos de uso y pagos.",
          aliases: [
            "contrato de licencia",
            "licencia de propiedad intelectual",
            "licencia de propiedad intelectual legal",
          ],
        },
      },
    },
  },
  {
    id: "licensing-agreement-general",
    importPath: "./us/licensing-agreement-general",
    meta: {
      id: "licensing-agreement-general",
      title: "General Licensing Agreement",
      description:
        "Turn your intellectual property into profit by licensing it to others while maintaining ownership and control.",
      category: "Intellectual Property",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "general license agreement",
        "IP licensing contract",
        "licensing contract",
        "contrato general de licencia",
        "acuerdo de licenciamiento",
        "contrato de licencia",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "General Licensing Agreement",
          description:
            "Turn your intellectual property into profit by licensing it to others while maintaining ownership and control.",
          aliases: [
            "general license agreement",
            "IP licensing contract",
            "licensing contract",
          ],
        },
        es: {
          name: "Acuerdo General de Licencia",
          description:
            "Acuerdo integral de licencia para varios tipos de propiedad intelectual.",
          aliases: [
            "contrato general de licencia",
            "acuerdo de licenciamiento",
            "contrato de licencia",
          ],
        },
      },
    },
  },
  {
    id: "limited-partnership-agreement",
    importPath: "./us/limited-partnership-agreement",
    meta: {
      id: "limited-partnership-agreement",
      title: "Limited Partnership Agreement",
      description:
        "Structure your business partnership with clear roles, limited liability protection, and defined profit-sharing arrangements.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "LP agreement",
        "limited partnership",
        "partnership formation",
        "acuerdo LP",
        "sociedad limitada",
        "formación de sociedad",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Limited Partnership Agreement",
          description:
            "Structure your business partnership with clear roles, limited liability protection, and defined profit-sharing arrangements.",
          aliases: [
            "LP agreement",
            "limited partnership",
            "partnership formation",
          ],
        },
        es: {
          name: "Acuerdo de Sociedad Limitada",
          description:
            "Acuerdo que establece una sociedad limitada con socios generales y limitados.",
          aliases: ["acuerdo LP", "sociedad limitada", "formación de sociedad"],
        },
      },
    },
  },
  {
    id: "livestock-purchase-agreement",
    importPath: "./us/livestock-purchase-agreement",
    meta: {
      id: "livestock-purchase-agreement",
      title: "Livestock Purchase Agreement",
      description: "Agreement for the purchase and sale of livestock animals.",
      category: "Business & Commercial",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "cattle purchase agreement",
        "animal sale contract",
        "livestock bill of sale",
        "acuerdo de compra de ganado",
        "contrato de venta de animales",
        "bolsa de venta de ganado",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Livestock Purchase Agreement",
          description:
            "Agreement for the purchase and sale of livestock animals.",
          aliases: [
            "cattle purchase agreement",
            "animal sale contract",
            "livestock bill of sale",
          ],
        },
        es: {
          name: "Acuerdo de Compra de Ganado",
          description:
            "Compra o vende ganado (vacas, caballos, cerdos, etc.) de manera segura. Incluye historial de salud, garantías y condiciones de entrega.",
          aliases: [
            "acuerdo de compra de ganado",
            "contrato de venta de animales",
            "bolsa de venta de ganado",
          ],
        },
      },
    },
  },
  {
    id: "living-trust",
    importPath: "./us/living-trust",
    meta: {
      id: "living-trust",
      title: "Living Trust (Revocable)",
      description:
        "Protect your family's privacy and wealth from expensive probate. Transfer assets quickly while maintaining confidentiality.",
      category: "Estate Planning",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "revocable trust",
        "estate planning",
        "avoid probate",
        "fideicomiso revocable",
        "planificación patrimonial",
        "evitar sucesorio",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Living Trust (Revocable)",
          description:
            "Protect your family's privacy and wealth from expensive probate. Transfer assets quickly while maintaining confidentiality.",
          aliases: ["revocable trust", "estate planning", "avoid probate"],
        },
        es: {
          name: "Fideicomiso en Vida (Revocable)",
          description:
            "Asegura que tu familia reciba tu herencia rápidamente y sin complicaciones legales. Evita el costoso proceso de corte sucesorio y protege tu privacidad.",
          aliases: [
            "fideicomiso revocable",
            "planificación patrimonial",
            "evitar sucesorio",
          ],
        },
      },
    },
  },
  {
    id: "living-trust-amendment",
    importPath: "./us/living-trust-amendment",
    meta: {
      id: "living-trust-amendment",
      title: "Living Trust Amendment",
      description:
        "Modify or update the terms of your existing revocable living trust without creating a new trust.",
      category: "Estate Planning",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "trust amendment",
        "modify trust",
        "update trust",
        "trust modification",
        "enmienda fideicomiso",
        "modificar fideicomiso",
        "actualizar fideicomiso",
        "modificación de confianza",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Living Trust Amendment",
          description:
            "Modify or update the terms of your existing revocable living trust without creating a new trust.",
          aliases: [
            "trust amendment",
            "modify trust",
            "update trust",
            "trust modification",
          ],
        },
        es: {
          name: "Enmienda al Fideicomiso en Vida",
          description:
            "Modificar o actualizar los términos de su fideicomiso en vida revocable existente sin crear un nuevo fideicomiso.",
          aliases: [
            "enmienda fideicomiso",
            "modificar fideicomiso",
            "actualizar fideicomiso",
            "modificación de confianza",
          ],
        },
      },
    },
  },
  {
    id: "living-will",
    importPath: "./us/living-will",
    meta: {
      id: "living-will",
      title: "Living Will / Advance Directive",
      description:
        "Control your end-of-life care by documenting specific treatment preferences. Prevent unwanted medical interventions.",
      category: "Personal",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "medical wishes",
        "advance directive",
        "life support",
        "end of life",
        "deseos médicos",
        "directiva anticipada",
        "soporte vital",
        "fin de vida",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Living Will / Advance Directive",
          description:
            "Control your end-of-life care by documenting specific treatment preferences. Prevent unwanted medical interventions.",
          aliases: [
            "medical wishes",
            "advance directive",
            "life support",
            "end of life",
          ],
        },
        es: {
          name: "Testamento Vital / Directiva Anticipada",
          description:
            "Dile a los médicos exactamente qué tratamientos médicos quieres o no quieres si estás muriendo o permanentemente inconsciente.",
          aliases: [
            "deseos médicos",
            "directiva anticipada",
            "soporte vital",
            "fin de vida",
          ],
        },
      },
    },
  },
  {
    id: "llc-operating-agreement",
    importPath: "./us/operating-agreement",
    meta: {
      id: "llc-operating-agreement",
      title: "Operating Agreement (LLC)",
      description:
        "Protect your LLC investment and prevent partner disputes. Define roles, profit sharing, and decision-making processes clearly.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "LLC agreement",
        "limited liability company",
        "acuerdo de LLC",
        "sociedad de responsabilidad limitada",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Operating Agreement (LLC)",
          description:
            "Protect your LLC investment and prevent partner disputes. Define roles, profit sharing, and decision-making processes clearly.",
          aliases: ["LLC agreement", "limited liability company"],
        },
        es: {
          name: "Acuerdo Operativo (LLC)",
          description:
            "Documento esencial para propietarios de LLC que define roles, responsabilidades, participación en ganancias y procesos de toma de decisiones.",
          aliases: ["acuerdo de LLC", "sociedad de responsabilidad limitada"],
        },
      },
    },
  },
  {
    id: "loan-agreement",
    importPath: "./us/loan-agreement",
    meta: {
      id: "loan-agreement",
      title: "Loan Agreement",
      description:
        "Access or provide funding with confidence and legal protection. Establish clear terms that prevent future disputes.",
      category: "Finance",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "loan contract",
        "personal loan",
        "lending agreement",
        "borrowing contract",
        "contrato de préstamo",
        "préstamo personal",
        "acuerdo de préstamo",
        "contrato de préstamo legal",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Loan Agreement",
          description:
            "Access or provide funding with confidence and legal protection. Establish clear terms that prevent future disputes.",
          aliases: [
            "loan contract",
            "personal loan",
            "lending agreement",
            "borrowing contract",
          ],
        },
        es: {
          name: "Acuerdo de Préstamo",
          description:
            "Formaliza préstamos familiares o comerciales para evitar conflictos. Protege relaciones personales al establecer términos claros de reembolso.",
          aliases: [
            "contrato de préstamo",
            "préstamo personal",
            "acuerdo de préstamo",
            "contrato de préstamo legal",
          ],
        },
      },
    },
  },
  {
    id: "loan-modification-agreement",
    importPath: "./us/loan-modification-agreement",
    meta: {
      id: "loan-modification-agreement",
      title: "Loan Modification Agreement",
      description:
        "Agreement to modify the terms and conditions of an existing loan agreement.",
      category: "Finance",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "loan amendment",
        "loan restructure agreement",
        "loan workout agreement",
        "enmienda de préstamo",
        "acuerdo de reestructuración",
        "acuerdo de entrenamiento de préstamos",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Loan Modification Agreement",
          description:
            "Agreement to modify the terms and conditions of an existing loan agreement.",
          aliases: [
            "loan amendment",
            "loan restructure agreement",
            "loan workout agreement",
          ],
        },
        es: {
          name: "Acuerdo de Modificación de Préstamo",
          description:
            "Cambia los términos de un préstamo existente para evitar el impago. Reduce pagos, cambia tasas de interés o extiende el plazo de pago.",
          aliases: [
            "enmienda de préstamo",
            "acuerdo de reestructuración",
            "acuerdo de entrenamiento de préstamos",
          ],
        },
      },
    },
  },
  {
    id: "loan-modification-letter",
    importPath: "./us/loan-modification-letter",
    meta: {
      id: "loan-modification-letter",
      title: "Loan Modification Letter",
      description:
        "Request a loan modification from your lender due to financial hardship or changed circumstances.",
      category: "Finance",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "loan mod request",
        "payment modification",
        "hardship letter",
        "loan adjustment request",
        "solicitud de modificación",
        "modificación de pago",
        "carta de dificultad",
        "solicitud de ajuste de préstamo",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Loan Modification Letter",
          description:
            "Request a loan modification from your lender due to financial hardship or changed circumstances.",
          aliases: [
            "loan mod request",
            "payment modification",
            "hardship letter",
            "loan adjustment request",
          ],
        },
        es: {
          name: "Carta de Modificación de Préstamo",
          description:
            "Solicitar una modificación de préstamo de su prestamista debido a dificultades financieras o circunstancias cambiadas.",
          aliases: [
            "solicitud de modificación",
            "modificación de pago",
            "carta de dificultad",
            "solicitud de ajuste de préstamo",
          ],
        },
      },
    },
  },
  {
    id: "lottery-pool-contract",
    importPath: "./us/lottery-pool-contract",
    meta: {
      id: "lottery-pool-contract",
      title: "Lottery Pool Contract",
      description:
        "Agreement for group lottery ticket purchases and winnings distribution.",
      category: "Personal & Lifestyle",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "lottery syndicate agreement",
        "group lottery contract",
        "acuerdo de sindicato de lotería",
        "contrato grupal de lotería",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Lottery Pool Contract",
          description:
            "Agreement for group lottery ticket purchases and winnings distribution.",
          aliases: ["lottery syndicate agreement", "group lottery contract"],
        },
        es: {
          name: "Contrato de Grupo de Lotería",
          description:
            "Acuerdo para compras grupales de boletos de lotería y distribución de ganancias.",
          aliases: [
            "acuerdo de sindicato de lotería",
            "contrato grupal de lotería",
          ],
        },
      },
    },
  },
  {
    id: "maritime-charter-agreement",
    importPath: "./us/maritime-charter-agreement",
    meta: {
      id: "maritime-charter-agreement",
      title: "Maritime Charter Agreement",
      description:
        "Agreement for chartering vessels for maritime transportation and services.",
      category: "Transportation & Automotive",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "ship charter agreement",
        "vessel charter contract",
        "marine charter",
        "contrato de fletamento",
        "acuerdo naval",
        "carta marina",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Maritime Charter Agreement",
          description:
            "Agreement for chartering vessels for maritime transportation and services.",
          aliases: [
            "ship charter agreement",
            "vessel charter contract",
            "marine charter",
          ],
        },
        es: {
          name: "Acuerdo de Flete Marítimo",
          description:
            "Acuerdo para fletar embarcaciones para transporte marítimo.",
          aliases: ["contrato de fletamento", "acuerdo naval", "carta marina"],
        },
      },
    },
  },
  {
    id: "marketing-agreement",
    importPath: "./us/marketing-agreement",
    meta: {
      id: "marketing-agreement",
      title: "Marketing Agreement",
      description:
        "Agreement for marketing and promotional services between parties.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "Marketing contract",
        "Promotional agreement",
        "Advertising agreement",
        "Contrato marketing",
        "Acuerdo promocional",
        "Contrato publicitario",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Marketing Agreement",
          description:
            "Agreement for marketing and promotional services between parties.",
          aliases: [
            "Marketing contract",
            "Promotional agreement",
            "Advertising agreement",
          ],
        },
        es: {
          name: "Acuerdo de Marketing",
          description:
            "Acuerdo para servicios de marketing y promoción entre las partes.",
          aliases: [
            "Contrato marketing",
            "Acuerdo promocional",
            "Contrato publicitario",
          ],
        },
      },
    },
  },
  {
    id: "marriage-separation-agreement",
    importPath: "./us/marriage-separation-agreement",
    meta: {
      id: "marriage-separation-agreement",
      title: "Marriage Separation Agreement",
      description:
        "Navigate separation with clarity by establishing fair arrangements for property, support, and children.",
      category: "Family & Personal",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "legal separation agreement",
        "marital separation contract",
        "acuerdo de separación legal",
        "contrato de separación marital",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Marriage Separation Agreement",
          description:
            "Navigate separation with clarity by establishing fair arrangements for property, support, and children.",
          aliases: [
            "legal separation agreement",
            "marital separation contract",
          ],
        },
        es: {
          name: "Acuerdo de Separación Matrimonial",
          description:
            "Acuerdo entre cónyuges que viven separados sobre propiedad, manutención y custodia.",
          aliases: [
            "acuerdo de separación legal",
            "contrato de separación marital",
          ],
        },
      },
    },
  },
  {
    id: "mechanics-lien",
    importPath: "./us/mechanics-lien",
    meta: {
      id: "mechanics-lien",
      title: "Mechanics Lien",
      description:
        "Secure payment for your construction work by filing a legal claim against the property you improved.",
      category: "Legal",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "construction lien",
        "materialman lien",
        "contractor lien",
        "gravamen de construcción",
        "gravamen de contratista",
        "contratista len",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Mechanics Lien",
          description:
            "Secure payment for your construction work by filing a legal claim against the property you improved.",
          aliases: ["construction lien", "materialman lien", "contractor lien"],
        },
        es: {
          name: "Gravamen de Mecánicos",
          description:
            "Reclamo legal contra la propiedad por trabajo no pagado o materiales proporcionados para mejoras de construcción.",
          aliases: [
            "gravamen de construcción",
            "gravamen de contratista",
            "contratista len",
          ],
        },
      },
    },
  },
  {
    id: "mechanics-lien-waiver",
    importPath: "./us/mechanics-lien-waiver",
    meta: {
      id: "mechanics-lien-waiver",
      title: "Mechanics Lien Waiver",
      description:
        "Legal waiver releasing mechanics lien rights upon payment for construction work or materials.",
      category: "Legal",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "lien waiver",
        "lien release",
        "waiver of lien rights",
        "renuncia de gravamen",
        "liberación de gravamen",
        "renuncia de los derechos de gravamen",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Mechanics Lien Waiver",
          description:
            "Legal waiver releasing mechanics lien rights upon payment for construction work or materials.",
          aliases: ["lien waiver", "lien release", "waiver of lien rights"],
        },
        es: {
          name: "Renuncia de Gravamen de Mecánicos",
          description:
            "Renuncia legal que libera los derechos de gravamen de mecánicos al recibir el pago por trabajo de construcción o materiales.",
          aliases: [
            "renuncia de gravamen",
            "liberación de gravamen",
            "renuncia de los derechos de gravamen",
          ],
        },
      },
    },
  },
  {
    id: "mediation-agreement",
    importPath: "./us/mediation-agreement",
    meta: {
      id: "mediation-agreement",
      title: "Mediation Agreement",
      description:
        "Resolve conflicts peacefully and cost-effectively by working with a neutral mediator instead of going to court.",
      category: "Dispute Resolution",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "dispute mediation agreement",
        "alternative dispute resolution agreement",
        "acuerdo de mediación de disputas",
        "acuerdo de resolución alternativa",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Mediation Agreement",
          description:
            "Resolve conflicts peacefully and cost-effectively by working with a neutral mediator instead of going to court.",
          aliases: [
            "dispute mediation agreement",
            "alternative dispute resolution agreement",
          ],
        },
        es: {
          name: "Acuerdo de Mediación",
          description:
            "Acuerdo para resolver disputas a través de mediación con la ayuda de un mediador neutral.",
          aliases: [
            "acuerdo de mediación de disputas",
            "acuerdo de resolución alternativa",
          ],
        },
      },
    },
  },
  {
    id: "medical-consent",
    importPath: "./us/medical-consent",
    meta: {
      id: "medical-consent",
      title: "General Medical Consent Form",
      description:
        "Ensure your children receive prompt medical care in emergencies. Authorize treatment when you can't be present.",
      category: "Personal",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "medical consent",
        "child medical form",
        "medical authorization",
        "consentimiento médico",
        "formulario médico infantil",
        "autorización médica",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "General Medical Consent Form",
          description:
            "Ensure your children receive prompt medical care in emergencies. Authorize treatment when you can't be present.",
          aliases: [
            "medical consent",
            "child medical form",
            "medical authorization",
          ],
        },
        es: {
          name: "Formulario de Consentimiento Médico General",
          description:
            "Autoriza a alguien más a tomar decisiones médicas importantes por ti o tu familia en emergencias cuando no puedas decidir.",
          aliases: [
            "consentimiento médico",
            "formulario médico infantil",
            "autorización médica",
          ],
        },
      },
    },
  },
  {
    id: "medical-consent-form",
    importPath: "./us/medical-consent-form",
    meta: {
      id: "medical-consent-form",
      title: "Medical Consent Form",
      description:
        "Form granting permission for medical treatment or procedures.",
      category: "Healthcare & Medical",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "medical authorization form",
        "treatment consent form",
        "healthcare consent",
        "formulario de autorización médica",
        "consentimiento de tratamiento",
        "consentimiento de la salud",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Medical Consent Form",
          description:
            "Form granting permission for medical treatment or procedures.",
          aliases: [
            "medical authorization form",
            "treatment consent form",
            "healthcare consent",
          ],
        },
        es: {
          name: "Formulario de Consentimiento Médico",
          description:
            "Da permiso para que doctores realicen tratamientos, operaciones o procedimientos médicos. Usado en hospitales y clínicas.",
          aliases: [
            "formulario de autorización médica",
            "consentimiento de tratamiento",
            "consentimiento de la salud",
          ],
        },
      },
    },
  },
  {
    id: "medical-power-of-attorney",
    importPath: "./us/medical-power-of-attorney",
    meta: {
      id: "medical-power-of-attorney",
      title: "Medical Power of Attorney",
      description:
        "Authorize someone to make comprehensive medical decisions on your behalf when you are unable to do so.",
      category: "Estate Planning",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "medical poa",
        "healthcare agent",
        "medical proxy",
        "healthcare surrogate",
        "poder médico",
        "agente de salud",
        "representante médico",
        "sustituto de atención médica",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Medical Power of Attorney",
          description:
            "Authorize someone to make comprehensive medical decisions on your behalf when you are unable to do so.",
          aliases: [
            "medical poa",
            "healthcare agent",
            "medical proxy",
            "healthcare surrogate",
          ],
        },
        es: {
          name: "Poder Notarial Médico",
          description:
            "Nombra a alguien para tomar todas tus decisiones de atención médica si no puedes comunicar tus deseos.",
          aliases: [
            "poder médico",
            "agente de salud",
            "representante médico",
            "sustituto de atención médica",
          ],
        },
      },
    },
  },
  {
    id: "membership-agreement",
    importPath: "./us/membership-agreement",
    meta: {
      id: "membership-agreement",
      title: "Membership Agreement",
      description: "Agreement for club, organization, or service memberships.",
      category: "Personal & Lifestyle",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "club membership",
        "subscription agreement",
        "membresía de club",
        "acuerdo de suscripción",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Membership Agreement",
          description:
            "Agreement for club, organization, or service memberships.",
          aliases: ["club membership", "subscription agreement"],
        },
        es: {
          name: "Acuerdo de Membresía",
          description:
            "Acuerdo para membresías de club, organización o servicio.",
          aliases: ["membresía de club", "acuerdo de suscripción"],
        },
      },
    },
  },
  {
    id: "membership-cancellation-letter",
    importPath: "./us/membership-cancellation-letter",
    meta: {
      id: "membership-cancellation-letter",
      title: "Membership Cancellation Letter",
      description: "Letter to cancel gym, club, or service memberships.",
      category: "Personal & Lifestyle",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "cancellation letter",
        "membership termination letter",
        "carta de cancelación",
        "carta de terminación de membresía",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Membership Cancellation Letter",
          description: "Letter to cancel gym, club, or service memberships.",
          aliases: ["cancellation letter", "membership termination letter"],
        },
        es: {
          name: "Carta de Cancelación de Membresía",
          description:
            "Carta para cancelar membresías de gimnasio, club o servicios.",
          aliases: [
            "carta de cancelación",
            "carta de terminación de membresía",
          ],
        },
      },
    },
  },
  {
    id: "memorandum-of-agreement",
    importPath: "./us/memorandum-of-agreement",
    meta: {
      id: "memorandum-of-agreement",
      title: "Memorandum of Agreement (MOA)",
      description:
        "Secure business deals and establish binding partnerships with formal agreements. Protect your interests in joint ventures and collaborative projects.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "MOA",
        "memorandum of agreement",
        "formal agreement",
        "memorando de acuerdo",
        "acuerdo formal",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Memorandum of Agreement (MOA)",
          description:
            "Secure business deals and establish binding partnerships with formal agreements. Protect your interests in joint ventures and collaborative projects.",
          aliases: ["MOA", "memorandum of agreement", "formal agreement"],
        },
        es: {
          name: "Memorando de Acuerdo (MOA)",
          description:
            "Crea un MOA formal que establece obligaciones y acuerdos vinculantes entre partes.",
          aliases: ["MOA", "memorando de acuerdo", "acuerdo formal"],
        },
      },
    },
  },
  {
    id: "memorandum-of-understanding",
    importPath: "./us/memorandum-of-understanding",
    meta: {
      id: "memorandum-of-understanding",
      title: "Memorandum of Understanding (MOU)",
      description:
        "Build strong partnerships and secure business collaborations before formal contracts. Establish clear expectations and protect your interests in joint ventures.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "MOU",
        "memorandum of understanding",
        "cooperation agreement",
        "memorando de entendimiento",
        "acuerdo de cooperación",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Memorandum of Understanding (MOU)",
          description:
            "Build strong partnerships and secure business collaborations before formal contracts. Establish clear expectations and protect your interests in joint ventures.",
          aliases: [
            "MOU",
            "memorandum of understanding",
            "cooperation agreement",
          ],
        },
        es: {
          name: "Memorando de Entendimiento (MOU)",
          description:
            "Crea un MOU formal para delinear el entendimiento mutuo y la cooperación entre partes.",
          aliases: [
            "MOU",
            "memorando de entendimiento",
            "acuerdo de cooperación",
          ],
        },
      },
    },
  },
  {
    id: "mining-agreement",
    importPath: "./us/mining-agreement",
    meta: {
      id: "mining-agreement",
      title: "Mining Agreement",
      description: "Agreement for mineral extraction and mining rights.",
      category: "Environmental & Energy",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "mineral rights",
        "extraction agreement",
        "mining lease",
        "derechos minerales",
        "arrendamiento minero",
        "arrendamiento minero legal",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Mining Agreement",
          description: "Agreement for mineral extraction and mining rights.",
          aliases: ["mineral rights", "extraction agreement", "mining lease"],
        },
        es: {
          name: "Acuerdo Minero",
          description:
            "Acuerdo para extracción de minerales y derechos mineros.",
          aliases: [
            "derechos minerales",
            "arrendamiento minero",
            "arrendamiento minero legal",
          ],
        },
      },
    },
  },
  {
    id: "mining-lease-agreement",
    importPath: "./us/mining-lease-agreement",
    meta: {
      id: "mining-lease-agreement",
      title: "Mining Lease Agreement",
      description:
        "Agreement for leasing land or mineral rights for mining operations.",
      category: "Real Estate & Property",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "mineral lease",
        "mining rights agreement",
        "extraction lease",
        "arrendamiento mineral",
        "acuerdo de derechos mineros",
        "arrendamiento de extracción",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Mining Lease Agreement",
          description:
            "Agreement for leasing land or mineral rights for mining operations.",
          aliases: [
            "mineral lease",
            "mining rights agreement",
            "extraction lease",
          ],
        },
        es: {
          name: "Acuerdo de Arrendamiento Minero",
          description:
            "Acuerdo para arrendar tierras o derechos minerales para operaciones mineras.",
          aliases: [
            "arrendamiento mineral",
            "acuerdo de derechos mineros",
            "arrendamiento de extracción",
          ],
        },
      },
    },
  },
  {
    id: "model-release",
    importPath: "./us/model-release",
    meta: {
      id: "model-release",
      title: "Model Release",
      description: "Professional model release document.",
      category: "Legal",
      jurisdiction: "us",
      tags: [],
      aliases: ["model release"],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Model Release",
          description: "Professional model release document.",
          aliases: ["model release"],
        },
        es: {
          name: "Model Release en Español",
          description: "Documento profesional de model release.",
          aliases: ["model release"],
        },
      },
    },
  },
  {
    id: "mortgage-agreement",
    importPath: "./us/mortgage-agreement",
    meta: {
      id: "mortgage-agreement",
      title: "Mortgage Agreement",
      description:
        "Achieve homeownership with structured financing backed by real estate. Build equity while securing your family's future.",
      category: "Real Estate & Property",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "mortgage contract",
        "home loan agreement",
        "mortgage note",
        "contrato de hipoteca",
        "acuerdo de préstamo",
        "nota de la hipoteca",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Mortgage Agreement",
          description:
            "Achieve homeownership with structured financing backed by real estate. Build equity while securing your family's future.",
          aliases: [
            "mortgage contract",
            "home loan agreement",
            "mortgage note",
          ],
        },
        es: {
          name: "Acuerdo de Hipoteca",
          description:
            "Formaliza el préstamo para comprar una casa. Establece pagos mensuales, tasa de interés y qué pasa si no puedes pagar.",
          aliases: [
            "contrato de hipoteca",
            "acuerdo de préstamo",
            "nota de la hipoteca",
          ],
        },
      },
    },
  },
  {
    id: "music-license-agreement",
    importPath: "./us/music-license-agreement",
    meta: {
      id: "music-license-agreement",
      title: "Music License Agreement",
      description: "Professional music license agreement document.",
      category: "Legal",
      jurisdiction: "us",
      tags: [],
      aliases: ["music license agreement"],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Music License Agreement",
          description: "Professional music license agreement document.",
          aliases: ["music license agreement"],
        },
        es: {
          name: "Music License Agreement en Español",
          description: "Documento profesional de music license agreement.",
          aliases: ["music license agreement"],
        },
      },
    },
  },
  {
    id: "music-licensing-agreement",
    importPath: "./us/music-licensing-agreement",
    meta: {
      id: "music-licensing-agreement",
      title: "Music Licensing Agreement",
      description:
        "Agreement for licensing music compositions and recordings for various uses.",
      category: "Entertainment & Media",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "music license",
        "sync license",
        "performance license",
        "licencia musical",
        "licencia de sincronización",
        "licencia de rendimiento",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Music Licensing Agreement",
          description:
            "Agreement for licensing music compositions and recordings for various uses.",
          aliases: ["music license", "sync license", "performance license"],
        },
        es: {
          name: "Acuerdo de Licencia Musical",
          description:
            "Acuerdo para licenciar composiciones musicales y grabaciones para varios usos.",
          aliases: [
            "licencia musical",
            "licencia de sincronización",
            "licencia de rendimiento",
          ],
        },
      },
    },
  },
  {
    id: "mutual-non-disclosure-agreement",
    importPath: "./us/mutual-non-disclosure-agreement",
    meta: {
      id: "mutual-non-disclosure-agreement",
      title: "Mutual Non-Disclosure Agreement (Mutual NDA)",
      description:
        "Two-way confidentiality agreement protecting information shared by both parties.",
      category: "Legal",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "mutual confidentiality",
        "bilateral nda",
        "two-way nda",
        "mutual secrecy",
        "confidencialidad mutua",
        "nda bilateral",
        "nda de dos vías",
        "secreto mutuo",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Mutual Non-Disclosure Agreement (Mutual NDA)",
          description:
            "Two-way confidentiality agreement protecting information shared by both parties.",
          aliases: [
            "mutual confidentiality",
            "bilateral nda",
            "two-way nda",
            "mutual secrecy",
          ],
        },
        es: {
          name: "Acuerdo Mutuo de Confidencialidad (NDA Mutuo)",
          description:
            "Acuerdo de confidencialidad bilateral que protege la información compartida por ambas partes.",
          aliases: [
            "confidencialidad mutua",
            "nda bilateral",
            "nda de dos vías",
            "secreto mutuo",
          ],
        },
      },
    },
  },
  {
    id: "name-change-notification-letter",
    importPath: "./us/name-change-notification-letter",
    meta: {
      id: "name-change-notification-letter",
      title: "Name Change Notification Letter",
      description:
        "Letter to notify institutions and organizations of legal name change.",
      category: "Personal & Lifestyle",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "name change letter",
        "legal name update notification",
        "carta de cambio de nombre",
        "notificación de actualización de nombre",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Name Change Notification Letter",
          description:
            "Letter to notify institutions and organizations of legal name change.",
          aliases: ["name change letter", "legal name update notification"],
        },
        es: {
          name: "Carta de Notificación de Cambio de Nombre",
          description:
            "Carta para notificar a instituciones sobre cambio legal de nombre.",
          aliases: [
            "carta de cambio de nombre",
            "notificación de actualización de nombre",
          ],
        },
      },
    },
  },
  {
    id: "nda",
    importPath: "./us/nda",
    meta: {
      id: "nda",
      title: "Non-Disclosure Agreement (NDA)",
      description: "Protect confidential information shared between parties.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "confidential",
        "nda",
        "protect idea",
        "secret",
        "confidencial",
        "proteger idea",
        "secreto",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Non-Disclosure Agreement (NDA)",
          description:
            "Protect confidential information shared between parties.",
          aliases: ["confidential", "nda", "protect idea", "secret"],
        },
        es: {
          name: "Acuerdo de Confidencialidad (NDA)",
          description:
            "Protege tus ideas de negocio y secretos comerciales. Evita que empleados, socios o contratistas compartan tu información confidencial con competidores.",
          aliases: ["confidencial", "nda", "proteger idea", "secreto"],
        },
      },
    },
  },
  {
    id: "non-compete-agreement",
    importPath: "./us/non-compete-agreement",
    meta: {
      id: "non-compete-agreement",
      title: "Non-Compete Agreement",
      description:
        "Protect your business secrets and customer relationships by preventing employees from becoming competitors.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "restrict competition",
        "former employee",
        "noncompete",
        "restringir competencia",
        "ex empleado",
        "no competencia",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Non-Compete Agreement",
          description:
            "Protect your business secrets and customer relationships by preventing employees from becoming competitors.",
          aliases: ["restrict competition", "former employee", "noncompete"],
        },
        es: {
          name: "Acuerdo de No Competencia",
          description:
            "Restringir a un empleado o contratista de competir después de la terminación.",
          aliases: ["restringir competencia", "ex empleado", "no competencia"],
        },
      },
    },
  },
  {
    id: "non-disclosure-agreement",
    importPath: "./us/non-disclosure-agreement",
    meta: {
      id: "non-disclosure-agreement",
      title: "Confidentiality Agreement (NDA)",
      description:
        "Protect your business secrets and confidential information when hiring employees or partners. Prevent competitors from stealing your valuable ideas.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "non-disclosure contract (nda)",
        "business document",
        "commercial agreement",
        "confidentiality agreement",
        "acuerdo de no divulgación",
        "contrato de confidencialidad",
        "documento comercial",
        "acuerdo de confidencialidad",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Confidentiality Agreement (NDA)",
          description:
            "Protect your business secrets and confidential information when hiring employees or partners. Prevent competitors from stealing your valuable ideas.",
          aliases: [
            "non-disclosure contract (nda)",
            "business document",
            "commercial agreement",
            "confidentiality agreement",
          ],
        },
        es: {
          name: "Acuerdo de Confidencialidad (NDA)",
          description:
            "Protege secretos comerciales e información confidencial al contratar empleados o socios. Previene compartir secretos con competidores.",
          aliases: [
            "acuerdo de no divulgación",
            "contrato de confidencialidad",
            "documento comercial",
            "acuerdo de confidencialidad",
          ],
        },
      },
    },
  },
  {
    id: "nonprofit-bylaws",
    importPath: "./us/nonprofit-bylaws",
    meta: {
      id: "nonprofit-bylaws",
      title: "Nonprofit Bylaws",
      description:
        "Establish strong governance for your nonprofit organization with bylaws that ensure proper operations and compliance.",
      category: "Business & Commercial",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "501c3 bylaws",
        "charity bylaws",
        "nonprofit constitution",
        "estatutos 501c3",
        "reglamento de ONG",
        "constitución sin fines de lucro",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Nonprofit Bylaws",
          description:
            "Establish strong governance for your nonprofit organization with bylaws that ensure proper operations and compliance.",
          aliases: ["501c3 bylaws", "charity bylaws", "nonprofit constitution"],
        },
        es: {
          name: "Estatutos de Organización Sin Fines de Lucro",
          description:
            "Estatutos para organizaciones sin fines de lucro y entidades caritativas.",
          aliases: [
            "estatutos 501c3",
            "reglamento de ONG",
            "constitución sin fines de lucro",
          ],
        },
      },
    },
  },
  {
    id: "notarization-request",
    importPath: "./us/notarization-request",
    meta: {
      id: "notarization-request",
      title: "Notarization Request",
      description:
        "Form to request notarial services for document authentication.",
      category: "Government & Legal Services",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "notary request",
        "document notarization",
        "notarial certificate",
        "solicitud notarial",
        "notarización de documento",
        "certificado notarial",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Notarization Request",
          description:
            "Form to request notarial services for document authentication.",
          aliases: [
            "notary request",
            "document notarization",
            "notarial certificate",
          ],
        },
        es: {
          name: "Solicitud de Notarización",
          description:
            "Formulario para solicitar servicios notariales para autenticación de documentos.",
          aliases: [
            "solicitud notarial",
            "notarización de documento",
            "certificado notarial",
          ],
        },
      },
    },
  },
  {
    id: "notice-of-lease-violation",
    importPath: "./us/notice-of-lease-violation",
    meta: {
      id: "notice-of-lease-violation",
      title: "Notice of Lease Violation",
      description: "Official notice to tenants for lease agreement violations",
      category: "Real Estate & Property",
      jurisdiction: "us",
      tags: [],
      aliases: [],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Notice of Lease Violation",
          description:
            "Official notice to tenants for lease agreement violations",
          aliases: [],
        },
        es: {
          name: "Aviso de incumplimiento de contrato de arrendamiento",
          description:
            "Notificación oficial para inquilinos que incumplen el contrato de arrendamiento.",
          aliases: [],
        },
      },
    },
  },
  {
    id: "notice-to-enter",
    importPath: "./us/notice-to-enter",
    meta: {
      id: "notice-to-enter",
      title: "Notice to Enter",
      description:
        "Landlord notice to enter rental property for inspections or repairs",
      category: "Real Estate & Property",
      jurisdiction: "us",
      tags: [],
      aliases: [],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Notice to Enter",
          description:
            "Landlord notice to enter rental property for inspections or repairs",
          aliases: [],
        },
        es: {
          name: "Aviso de ingreso a la propiedad",
          description:
            "Aviso del arrendador para ingresar a la propiedad rentada para inspecciones o reparaciones.",
          aliases: [],
        },
      },
    },
  },
  {
    id: "notice-to-pay-rent-or-quit",
    importPath: "./us/notice-to-pay-rent-or-quit",
    meta: {
      id: "notice-to-pay-rent-or-quit",
      title: "Notice to Pay Rent or Quit",
      description:
        "Legal notice for unpaid rent requiring payment or vacating premises",
      category: "Real Estate & Property",
      jurisdiction: "us",
      tags: [],
      aliases: [],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Notice to Pay Rent or Quit",
          description:
            "Legal notice for unpaid rent requiring payment or vacating premises",
          aliases: [],
        },
        es: {
          name: "Aviso para pagar la renta o desocupar",
          description:
            "Notificación legal por renta impaga que exige el pago inmediato o la desocupación de la vivienda.",
          aliases: [],
        },
      },
    },
  },
  {
    id: "notice-to-proceed",
    importPath: "./us/notice-to-proceed",
    meta: {
      id: "notice-to-proceed",
      title: "Notice to Proceed",
      description:
        "Official authorization for contractor to begin construction work on a project.",
      category: "Construction",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "commencement notice",
        "start work authorization",
        "proceed order",
        "aviso de inicio",
        "autorización de trabajo",
        "orden de proceder",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Notice to Proceed",
          description:
            "Official authorization for contractor to begin construction work on a project.",
          aliases: [
            "commencement notice",
            "start work authorization",
            "proceed order",
          ],
        },
        es: {
          name: "Aviso para Proceder",
          description:
            "Autorización oficial para que el contratista comience el trabajo de construcción en un proyecto.",
          aliases: [
            "aviso de inicio",
            "autorización de trabajo",
            "orden de proceder",
          ],
        },
      },
    },
  },
  {
    id: "offer-letter",
    importPath: "./us/offer-letter",
    meta: {
      id: "offer-letter",
      title: "Job Offer Letter",
      description:
        "Create a professional employment offer letter with our easy-to-use template. State-specific requirements included.",
      category: "Employment",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "job offer letter",
        "employment offer",
        "offer of employment",
        "job offer",
        "oferta de trabajo",
        "carta de trabajo",
        "oferta de empleo",
        "oferta de trabajo legal",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Job Offer Letter",
          description:
            "Create a professional employment offer letter with our easy-to-use template. State-specific requirements included.",
          aliases: [
            "job offer letter",
            "employment offer",
            "offer of employment",
            "job offer",
          ],
        },
        es: {
          name: "Carta de Oferta Laboral",
          description:
            "Crea una carta de oferta de empleo profesional con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.",
          aliases: [
            "oferta de trabajo",
            "carta de trabajo",
            "oferta de empleo",
            "oferta de trabajo legal",
          ],
        },
      },
    },
  },
  {
    id: "office-space-lease",
    importPath: "./us/office-space-lease",
    meta: {
      id: "office-space-lease",
      title: "Office Space Lease",
      description: "Commercial lease agreement specifically for office spaces",
      category: "Business & Commercial",
      jurisdiction: "us",
      tags: [],
      aliases: [],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Office Space Lease",
          description:
            "Commercial lease agreement specifically for office spaces",
          aliases: [],
        },
        es: {
          name: "Contrato de arrendamiento de oficina",
          description:
            "Contrato de arrendamiento comercial específico para espacios de oficina.",
          aliases: [],
        },
      },
    },
  },
  {
    id: "oil-gas-lease",
    importPath: "./us/oil-gas-lease",
    meta: {
      id: "oil-gas-lease",
      title: "Oil & Gas Lease",
      description:
        "Lease agreement for oil and gas exploration and extraction.",
      category: "Environmental & Energy",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "mineral lease",
        "drilling rights",
        "energy lease",
        "arrendamiento mineral",
        "derechos de perforación",
        "arrendamiento de energía",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Oil & Gas Lease",
          description:
            "Lease agreement for oil and gas exploration and extraction.",
          aliases: ["mineral lease", "drilling rights", "energy lease"],
        },
        es: {
          name: "Arrendamiento de Petróleo y Gas",
          description:
            "Acuerdo de arrendamiento para exploración y extracción de petróleo y gas.",
          aliases: [
            "arrendamiento mineral",
            "derechos de perforación",
            "arrendamiento de energía",
          ],
        },
      },
    },
  },
  {
    id: "oil-gas-lease-agreement",
    importPath: "./us/oil-gas-lease-agreement",
    meta: {
      id: "oil-gas-lease-agreement",
      title: "Oil and Gas Lease Agreement",
      description:
        "Maximize income from your land by leasing mineral rights for oil and gas exploration with fair terms and royalties.",
      category: "Real Estate & Property",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "petroleum lease",
        "drilling rights agreement",
        "hydrocarbon lease",
        "arrendamiento petrolero",
        "acuerdo de perforación",
        "arrendamiento de hidrocarburos",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Oil and Gas Lease Agreement",
          description:
            "Maximize income from your land by leasing mineral rights for oil and gas exploration with fair terms and royalties.",
          aliases: [
            "petroleum lease",
            "drilling rights agreement",
            "hydrocarbon lease",
          ],
        },
        es: {
          name: "Acuerdo de Arrendamiento de Petróleo y Gas",
          description:
            "Acuerdo para arrendar derechos minerales para exploración y producción de petróleo y gas.",
          aliases: [
            "arrendamiento petrolero",
            "acuerdo de perforación",
            "arrendamiento de hidrocarburos",
          ],
        },
      },
    },
  },
  {
    id: "parenting-plan",
    importPath: "./us/parenting-plan",
    meta: {
      id: "parenting-plan",
      title: "Parenting Plan",
      description:
        "Put your children first with a detailed plan that ensures their well-being through custody and visitation schedules.",
      category: "Family & Personal",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "custody agreement",
        "visitation schedule",
        "co-parenting plan",
        "acuerdo de custodia",
        "horario de visitación",
        "plan de co-crianza",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Parenting Plan",
          description:
            "Put your children first with a detailed plan that ensures their well-being through custody and visitation schedules.",
          aliases: [
            "custody agreement",
            "visitation schedule",
            "co-parenting plan",
          ],
        },
        es: {
          name: "Plan de Crianza",
          description:
            "Plan integral para custodia infantil, visitación y responsabilidades parentales.",
          aliases: [
            "acuerdo de custodia",
            "horario de visitación",
            "plan de co-crianza",
          ],
        },
      },
    },
  },
  {
    id: "parking-space-lease-agreement",
    importPath: "./us/parking-space-lease-agreement",
    meta: {
      id: "parking-space-lease-agreement",
      title: "Parking Space Lease Agreement",
      description: "Lease agreement for parking spaces and garages",
      category: "Real Estate & Property",
      jurisdiction: "us",
      tags: [],
      aliases: [],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Parking Space Lease Agreement",
          description: "Lease agreement for parking spaces and garages",
          aliases: [],
        },
        es: {
          name: "Contrato de arrendamiento de estacionamiento",
          description:
            "Contrato de arrendamiento para espacios de estacionamiento y garajes.",
          aliases: [],
        },
      },
    },
  },
  {
    id: "partnership-agreement",
    importPath: "./us/partnership-agreement",
    meta: {
      id: "partnership-agreement",
      title: "Partnership Agreement",
      description:
        "Start a business with partners and avoid future conflicts. Define ownership, responsibilities, and what happens if someone leaves.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "business partners",
        "joint venture",
        "partner terms",
        "socios de negocios",
        "empresa conjunta",
        "términos de socios",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Partnership Agreement",
          description:
            "Start a business with partners and avoid future conflicts. Define ownership, responsibilities, and what happens if someone leaves.",
          aliases: ["business partners", "joint venture", "partner terms"],
        },
        es: {
          name: "Acuerdo de Sociedad",
          description:
            "Evita conflictos y protege tu inversión al iniciar un negocio con socios. Define claramente responsabilidades, aportaciones y reparto de ganancias.",
          aliases: [
            "socios de negocios",
            "empresa conjunta",
            "términos de socios",
          ],
        },
      },
    },
  },
  {
    id: "partnership-amendment",
    importPath: "./us/partnership-amendment",
    meta: {
      id: "partnership-amendment",
      title: "Partnership Amendment",
      description:
        "Amendment to modify existing partnership agreement terms and conditions.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "partnership modification",
        "agreement amendment",
        "partnership change",
        "modificación de sociedad",
        "enmienda de acuerdo",
        "cambio de sociedad",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Partnership Amendment",
          description:
            "Amendment to modify existing partnership agreement terms and conditions.",
          aliases: [
            "partnership modification",
            "agreement amendment",
            "partnership change",
          ],
        },
        es: {
          name: "Enmienda de Sociedad",
          description:
            "Enmienda para modificar los términos y condiciones del acuerdo de sociedad existente.",
          aliases: [
            "modificación de sociedad",
            "enmienda de acuerdo",
            "cambio de sociedad",
          ],
        },
      },
    },
  },
  {
    id: "partnership-dissolution-agreement",
    importPath: "./us/partnership-dissolution-agreement",
    meta: {
      id: "partnership-dissolution-agreement",
      title: "Partnership Dissolution Agreement",
      description:
        "End your business partnership fairly by properly dividing assets and closing operations without disputes.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "partnership termination",
        "business dissolution",
        "wind-up agreement",
        "terminación de sociedad",
        "disolución de negocio",
        "acuerdo de liquidación",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Partnership Dissolution Agreement",
          description:
            "End your business partnership fairly by properly dividing assets and closing operations without disputes.",
          aliases: [
            "partnership termination",
            "business dissolution",
            "wind-up agreement",
          ],
        },
        es: {
          name: "Acuerdo de Disolución de Sociedad",
          description:
            "Acuerdo para disolver formalmente una sociedad y distribuir activos.",
          aliases: [
            "terminación de sociedad",
            "disolución de negocio",
            "acuerdo de liquidación",
          ],
        },
      },
    },
  },
  {
    id: "patent-application-assignment",
    importPath: "./us/patent-application-assignment",
    meta: {
      id: "patent-application-assignment",
      title: "Patent Application Assignment Agreement",
      description:
        "Legal document to transfer patent application rights from one party to another.",
      category: "Intellectual Property",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "patent app assignment",
        "application transfer",
        "patent application transfer",
        "patent rights assignment",
        "asignación solicitud patente",
        "transferencia aplicación",
        "transferencia solicitud patente",
        "asignación derechos patente",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Patent Application Assignment Agreement",
          description:
            "Legal document to transfer patent application rights from one party to another.",
          aliases: [
            "patent app assignment",
            "application transfer",
            "patent application transfer",
            "patent rights assignment",
          ],
        },
        es: {
          name: "Acuerdo de Asignación de Solicitud de Patente",
          description:
            "Documento legal para transferir los derechos de solicitud de patente de una parte a otra.",
          aliases: [
            "asignación solicitud patente",
            "transferencia aplicación",
            "transferencia solicitud patente",
            "asignación derechos patente",
          ],
        },
      },
    },
  },
  {
    id: "patent-assignment",
    importPath: "./us/patent-assignment",
    meta: {
      id: "patent-assignment",
      title: "Patent Assignment Agreement",
      description:
        "Complete patent transactions safely by ensuring proper ownership transfer with full legal documentation.",
      category: "Intellectual Property",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "patent transfer",
        "patent ownership transfer",
        "patent conveyance",
        "patent sale",
        "transferencia de patente",
        "transferencia propiedad patente",
        "transmisión patente",
        "venta patente",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Patent Assignment Agreement",
          description:
            "Complete patent transactions safely by ensuring proper ownership transfer with full legal documentation.",
          aliases: [
            "patent transfer",
            "patent ownership transfer",
            "patent conveyance",
            "patent sale",
          ],
        },
        es: {
          name: "Acuerdo de Asignación de Patente",
          description:
            "Documento legal para transferir la propiedad de una patente de una parte a otra.",
          aliases: [
            "transferencia de patente",
            "transferencia propiedad patente",
            "transmisión patente",
            "venta patente",
          ],
        },
      },
    },
  },
  {
    id: "patent-license-agreement",
    importPath: "./us/patent-license-agreement",
    meta: {
      id: "patent-license-agreement",
      title: "Patent License Agreement",
      description:
        "Comprehensive agreement for licensing patent rights with royalty and technical provisions.",
      category: "Intellectual Property",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "patent licensing contract",
        "technology license agreement",
        "patent usage agreement",
        "contrato de licencia de patente",
        "acuerdo de licencia tecnológica",
        "acuerdo de uso de patentes",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Patent License Agreement",
          description:
            "Comprehensive agreement for licensing patent rights with royalty and technical provisions.",
          aliases: [
            "patent licensing contract",
            "technology license agreement",
            "patent usage agreement",
          ],
        },
        es: {
          name: "Acuerdo de Licencia de Patente",
          description:
            "Acuerdo integral para licenciar derechos de patente con provisiones técnicas y de regalías.",
          aliases: [
            "contrato de licencia de patente",
            "acuerdo de licencia tecnológica",
            "acuerdo de uso de patentes",
          ],
        },
      },
    },
  },
  {
    id: "patent-licensing-agreement",
    importPath: "./us/patent-licensing-agreement",
    meta: {
      id: "patent-licensing-agreement",
      title: "Patent Licensing Agreement",
      description:
        "Agreement for licensing patent rights and intellectual property usage.",
      category: "Intellectual Property",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "patent license",
        "ip licensing agreement",
        "technology licensing contract",
        "licencia de patente",
        "contrato de propiedad intelectual",
        "contrato de licencia de tecnología",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Patent Licensing Agreement",
          description:
            "Agreement for licensing patent rights and intellectual property usage.",
          aliases: [
            "patent license",
            "ip licensing agreement",
            "technology licensing contract",
          ],
        },
        es: {
          name: "Acuerdo de Licencia de Patente",
          description:
            "Acuerdo para licenciar derechos de patente y uso de propiedad intelectual.",
          aliases: [
            "licencia de patente",
            "contrato de propiedad intelectual",
            "contrato de licencia de tecnología",
          ],
        },
      },
    },
  },
  {
    id: "payment-bond",
    importPath: "./us/payment-bond",
    meta: {
      id: "payment-bond",
      title: "Payment Bond",
      description:
        "Surety bond guaranteeing payment to subcontractors and material suppliers on construction projects.",
      category: "Legal",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "labor and material bond",
        "subcontractor payment bond",
        "supplier bond",
        "fianza de trabajo y materiales",
        "fianza de pago de subcontratistas",
        "bono de proveedor",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Payment Bond",
          description:
            "Surety bond guaranteeing payment to subcontractors and material suppliers on construction projects.",
          aliases: [
            "labor and material bond",
            "subcontractor payment bond",
            "supplier bond",
          ],
        },
        es: {
          name: "Fianza de Pago",
          description:
            "Fianza de garantía que garantiza el pago a subcontratistas y proveedores de materiales en proyectos de construcción.",
          aliases: [
            "fianza de trabajo y materiales",
            "fianza de pago de subcontratistas",
            "bono de proveedor",
          ],
        },
      },
    },
  },
  {
    id: "payment-plan",
    importPath: "./us/payment-plan",
    meta: {
      id: "payment-plan",
      title: "Payment Plan Agreement",
      description:
        "Structure installment payments for debts, purchases, or services.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "installment plan",
        "payment schedule",
        "payment arrangement",
        "plan de cuotas",
        "cronograma de pagos",
        "arreglo de pagos",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Payment Plan Agreement",
          description:
            "Structure installment payments for debts, purchases, or services.",
          aliases: [
            "installment plan",
            "payment schedule",
            "payment arrangement",
          ],
        },
        es: {
          name: "Acuerdo de Plan de Pagos",
          description:
            "Estructurar pagos a plazos para deudas, compras o servicios.",
          aliases: [
            "plan de cuotas",
            "cronograma de pagos",
            "arreglo de pagos",
          ],
        },
      },
    },
  },
  {
    id: "performance-bond",
    importPath: "./us/performance-bond",
    meta: {
      id: "performance-bond",
      title: "Performance Bond",
      description:
        "Legal bond guaranteeing completion of contractual obligations and performance standards.",
      category: "Legal",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "contract performance bond",
        "completion bond",
        "surety bond",
        "fianza de rendimiento de contrato",
        "bono de cumplimiento",
        "bono de fianza",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Performance Bond",
          description:
            "Legal bond guaranteeing completion of contractual obligations and performance standards.",
          aliases: [
            "contract performance bond",
            "completion bond",
            "surety bond",
          ],
        },
        es: {
          name: "Fianza de Cumplimiento",
          description:
            "Fianza legal que garantiza el cumplimiento de obligaciones contractuales y estándares de rendimiento.",
          aliases: [
            "fianza de rendimiento de contrato",
            "bono de cumplimiento",
            "bono de fianza",
          ],
        },
      },
    },
  },
  {
    id: "personal-care-agreement",
    importPath: "./us/personal-care-agreement",
    meta: {
      id: "personal-care-agreement",
      title: "Personal Care Agreement",
      description:
        "Agreement for personal care services including caregiving, assistance, and support.",
      category: "Family",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "caregiver agreement",
        "personal assistance contract",
        "care services agreement",
        "acuerdo de cuidador",
        "contrato de asistencia personal",
        "acuerdo de servicios de atención",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Personal Care Agreement",
          description:
            "Agreement for personal care services including caregiving, assistance, and support.",
          aliases: [
            "caregiver agreement",
            "personal assistance contract",
            "care services agreement",
          ],
        },
        es: {
          name: "Acuerdo de Cuidado Personal",
          description:
            "Acuerdo para servicios de cuidado personal incluyendo cuidado, asistencia y apoyo.",
          aliases: [
            "acuerdo de cuidador",
            "contrato de asistencia personal",
            "acuerdo de servicios de atención",
          ],
        },
      },
    },
  },
  {
    id: "personal-loan-agreement",
    importPath: "./us/personal-loan-agreement",
    meta: {
      id: "personal-loan-agreement",
      title: "Personal Loan Agreement",
      description:
        "Protect your money when lending to friends or family and avoid damaged relationships. Ensure clear repayment terms and legal recourse if needed.",
      category: "Finance",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "loan contract",
        "lending agreement",
        "borrower agreement",
        "contrato de préstamo",
        "acuerdo de préstamo",
        "acuerdo de prestatario",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Personal Loan Agreement",
          description:
            "Protect your money when lending to friends or family and avoid damaged relationships. Ensure clear repayment terms and legal recourse if needed.",
          aliases: ["loan contract", "lending agreement", "borrower agreement"],
        },
        es: {
          name: "Acuerdo de Préstamo Personal",
          description:
            "Acuerdo integral para préstamos personales con términos de pago detallados y protecciones.",
          aliases: [
            "contrato de préstamo",
            "acuerdo de préstamo",
            "acuerdo de prestatario",
          ],
        },
      },
    },
  },
  {
    id: "personal-training-agreement",
    importPath: "./us/personal-training-agreement",
    meta: {
      id: "personal-training-agreement",
      title: "Personal Training Agreement",
      description:
        "Agreement between personal trainer and client for fitness training services.",
      category: "Personal & Lifestyle",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "fitness training contract",
        "personal trainer agreement",
        "training services contract",
        "contrato de entrenamiento físico",
        "acuerdo de entrenador personal",
        "contrato de servicios de capacitación",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Personal Training Agreement",
          description:
            "Agreement between personal trainer and client for fitness training services.",
          aliases: [
            "fitness training contract",
            "personal trainer agreement",
            "training services contract",
          ],
        },
        es: {
          name: "Acuerdo de Entrenamiento Personal",
          description:
            "Acuerdo entre entrenador personal y cliente para servicios de entrenamiento físico.",
          aliases: [
            "contrato de entrenamiento físico",
            "acuerdo de entrenador personal",
            "contrato de servicios de capacitación",
          ],
        },
      },
    },
  },
  {
    id: "pet-addendum",
    importPath: "./us/pet-addendum",
    meta: {
      id: "pet-addendum",
      title: "Pet Addendum",
      description: "Add pet terms to existing lease agreements",
      category: "Real Estate & Property",
      jurisdiction: "us",
      tags: [],
      aliases: [],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Pet Addendum",
          description: "Add pet terms to existing lease agreements",
          aliases: [],
        },
        es: {
          name: "Anexo de mascotas",
          description:
            "Agrega cláusulas sobre mascotas a contratos de arrendamiento existentes.",
          aliases: [],
        },
      },
    },
  },
  {
    id: "pet-agreement",
    importPath: "./us/pet-agreement",
    meta: {
      id: "pet-agreement",
      title: "Pet Agreement",
      description:
        "Establish rules and responsibilities for pets in rental properties.",
      category: "Real Estate",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "pet addendum",
        "pet policy",
        "pet lease addendum",
        "adenda de mascotas",
        "política de mascotas",
        "anexo de arrendamiento de mascotas",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Pet Agreement",
          description:
            "Establish rules and responsibilities for pets in rental properties.",
          aliases: ["pet addendum", "pet policy", "pet lease addendum"],
        },
        es: {
          name: "Acuerdo de Mascotas",
          description:
            "Establece reglas y responsabilidades para mascotas en propiedades de alquiler.",
          aliases: [
            "adenda de mascotas",
            "política de mascotas",
            "anexo de arrendamiento de mascotas",
          ],
        },
      },
    },
  },
  {
    id: "pet-custody-agreement",
    importPath: "./us/pet-custody-agreement",
    meta: {
      id: "pet-custody-agreement",
      title: "Pet Custody Agreement",
      description:
        "Agreement establishing custody, care, and financial responsibilities for pets.",
      category: "Family",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "pet custody contract",
        "animal custody agreement",
        "pet sharing agreement",
        "contrato de custodia de mascotas",
        "acuerdo de cuidado animal",
        "acuerdo de intercambio de mascotas",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Pet Custody Agreement",
          description:
            "Agreement establishing custody, care, and financial responsibilities for pets.",
          aliases: [
            "pet custody contract",
            "animal custody agreement",
            "pet sharing agreement",
          ],
        },
        es: {
          name: "Acuerdo de Custodia de Mascotas",
          description:
            "Acuerdo que establece custodia, cuidado y responsabilidades financieras para mascotas.",
          aliases: [
            "contrato de custodia de mascotas",
            "acuerdo de cuidado animal",
            "acuerdo de intercambio de mascotas",
          ],
        },
      },
    },
  },
  {
    id: "photo-release-form",
    importPath: "./us/photo-release-form",
    meta: {
      id: "photo-release-form",
      title: "Photo Release Form",
      description:
        "Use photos safely in your marketing without legal risks. Get proper permission for commercial use and advertising.",
      category: "Legal",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "photography release",
        "image release",
        "photo consent",
        "picture release",
        "liberación fotografía",
        "liberación imagen",
        "consentimiento foto",
        "liberación fotografica",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Photo Release Form",
          description:
            "Use photos safely in your marketing without legal risks. Get proper permission for commercial use and advertising.",
          aliases: [
            "photography release",
            "image release",
            "photo consent",
            "picture release",
          ],
        },
        es: {
          name: "Formulario de Liberación Fotográfica",
          description:
            "Formulario simple de permiso para usar la foto de alguien comercialmente. Requerido para marketing, sitios web y publicaciones.",
          aliases: [
            "liberación fotografía",
            "liberación imagen",
            "consentimiento foto",
            "liberación fotografica",
          ],
        },
      },
    },
  },
  {
    id: "photography-release",
    importPath: "./us/photography-release",
    meta: {
      id: "photography-release",
      title: "Photography Release",
      description:
        "Release form granting permission to use photographs and images.",
      category: "Entertainment & Media",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "photo release",
        "image release",
        "model release",
        "liberación de foto",
        "liberación de imagen",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Photography Release",
          description:
            "Release form granting permission to use photographs and images.",
          aliases: ["photo release", "image release", "model release"],
        },
        es: {
          name: "Liberación de Fotografía",
          description:
            "Da permiso para usar tus fotos en marketing, redes sociales o publicaciones. Protege fotógrafos y modelos al definir cómo se usan imágenes.",
          aliases: [
            "liberación de foto",
            "liberación de imagen",
            "model release",
          ],
        },
      },
    },
  },
  {
    id: "postnuptial-agreement",
    importPath: "./us/postnuptial-agreement",
    meta: {
      id: "postnuptial-agreement",
      title: "Postnuptial Agreement",
      description:
        "Agreement between married spouses regarding property and financial matters.",
      category: "Family & Personal",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "post-marital agreement",
        "marital property agreement",
        "acuerdo post-matrimonial",
        "acuerdo de propiedad marital",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Postnuptial Agreement",
          description:
            "Agreement between married spouses regarding property and financial matters.",
          aliases: ["post-marital agreement", "marital property agreement"],
        },
        es: {
          name: "Acuerdo Postnupcial",
          description:
            "Acuerdo entre cónyuges casados sobre asuntos de propiedad y financieros.",
          aliases: ["acuerdo post-matrimonial", "acuerdo de propiedad marital"],
        },
      },
    },
  },
  {
    id: "pour-over-will",
    importPath: "./us/pour-over-will",
    meta: {
      id: "pour-over-will",
      title: "Pour-Over Will",
      description:
        "A will that transfers assets to your existing trust, ensuring trust administration of all assets.",
      category: "Estate Planning",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "trust will",
        "pour over will",
        "trust transfer will",
        "estate planning will",
        "testamento fideicomiso",
        "testamento de transferencia",
        "testamento de administración",
        "planificación patrimonial will",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Pour-Over Will",
          description:
            "A will that transfers assets to your existing trust, ensuring trust administration of all assets.",
          aliases: [
            "trust will",
            "pour over will",
            "trust transfer will",
            "estate planning will",
          ],
        },
        es: {
          name: "Testamento de Transferencia",
          description:
            "Un testamento que transfiere activos a su fideicomiso existente, asegurando la administración fiduciaria de todos los activos.",
          aliases: [
            "testamento fideicomiso",
            "testamento de transferencia",
            "testamento de administración",
            "planificación patrimonial will",
          ],
        },
      },
    },
  },
  {
    id: "power-of-attorney",
    importPath: "./us/power-of-attorney",
    meta: {
      id: "power-of-attorney",
      title: "General Power of Attorney",
      description:
        "Maintain control over your affairs even when unavailable. Ensure trusted agents can act on your behalf in emergencies.",
      category: "Personal",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "represent me",
        "act on my behalf",
        "authorize someone",
        "financial poa",
        "representarme",
        "actuar en mi nombre",
        "autorizar a alguien",
        "poder financiero",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "General Power of Attorney",
          description:
            "Maintain control over your affairs even when unavailable. Ensure trusted agents can act on your behalf in emergencies.",
          aliases: [
            "represent me",
            "act on my behalf",
            "authorize someone",
            "financial poa",
          ],
        },
        es: {
          name: "Poder Notarial General",
          description:
            "Asegura que alguien de confianza pueda manejar tus finanzas y asuntos legales si te enfermas o viajas. Evita complicaciones familiares en emergencias.",
          aliases: [
            "representarme",
            "actuar en mi nombre",
            "autorizar a alguien",
            "poder financiero",
          ],
        },
      },
    },
  },
  {
    id: "power-of-attorney-for-child",
    importPath: "./us/power-of-attorney-for-child",
    meta: {
      id: "power-of-attorney-for-child",
      title: "Power of Attorney for Minor Child",
      description:
        "Grant temporary authority to another person to make decisions for your minor child when you are unavailable.",
      category: "Estate Planning",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "child poa",
        "minor child power of attorney",
        "temporary guardianship",
        "child care authorization",
        "poder para menor",
        "autorización cuidado menor",
        "tutela temporal",
        "autorización de cuidado infantil",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Power of Attorney for Minor Child",
          description:
            "Grant temporary authority to another person to make decisions for your minor child when you are unavailable.",
          aliases: [
            "child poa",
            "minor child power of attorney",
            "temporary guardianship",
            "child care authorization",
          ],
        },
        es: {
          name: "Poder Notarial para Menor de Edad",
          description:
            "Otorgar autoridad temporal a otra persona para tomar decisiones por su hijo menor cuando usted no esté disponible.",
          aliases: [
            "poder para menor",
            "autorización cuidado menor",
            "tutela temporal",
            "autorización de cuidado infantil",
          ],
        },
      },
    },
  },
  {
    id: "prenuptial-agreement",
    importPath: "./us/prenuptial-agreement",
    meta: {
      id: "prenuptial-agreement",
      title: "Prenuptial Agreement",
      description:
        "Start marriage with financial clarity and protection. Preserve individual assets while building shared wealth.",
      category: "Family",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "prenup",
        "marriage contract",
        "before marriage agreement",
        "contrato matrimonial",
        "acuerdo prematrimonial",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Prenuptial Agreement",
          description:
            "Start marriage with financial clarity and protection. Preserve individual assets while building shared wealth.",
          aliases: ["prenup", "marriage contract", "before marriage agreement"],
        },
        es: {
          name: "Acuerdo Prenupcial",
          description:
            "Protege tus bienes y define responsabilidades financieras antes de casarte. Previene disputas si la relación termina.",
          aliases: ["prenup", "contrato matrimonial", "acuerdo prematrimonial"],
        },
      },
    },
  },
  {
    id: "private-placement-memorandum",
    importPath: "./us/private-placement-memorandum",
    meta: {
      id: "private-placement-memorandum",
      title: "Private Placement Memorandum",
      description:
        "Comprehensive document for private securities offerings to accredited investors.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "PPM",
        "private offering document",
        "securities memorandum",
        "documento de oferta privada",
        "memorando de valores",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Private Placement Memorandum",
          description:
            "Comprehensive document for private securities offerings to accredited investors.",
          aliases: [
            "PPM",
            "private offering document",
            "securities memorandum",
          ],
        },
        es: {
          name: "Memorando de Colocación Privada",
          description:
            "Documento integral para ofertas privadas de valores a inversores acreditados.",
          aliases: [
            "PPM",
            "documento de oferta privada",
            "memorando de valores",
          ],
        },
      },
    },
  },
  {
    id: "product-liability-waiver",
    importPath: "./us/product-liability-waiver",
    meta: {
      id: "product-liability-waiver",
      title: "Product Liability Waiver",
      description:
        "Release form protecting manufacturers and retailers from product-related claims and injuries.",
      category: "Risk Management",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "product waiver",
        "manufacturing liability waiver",
        "product release",
        "exención de producto",
        "liberación de fabricante",
        "liberación de productos",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Product Liability Waiver",
          description:
            "Release form protecting manufacturers and retailers from product-related claims and injuries.",
          aliases: [
            "product waiver",
            "manufacturing liability waiver",
            "product release",
          ],
        },
        es: {
          name: "Exención de Responsabilidad de Producto",
          description:
            "Formulario de liberación que protege a fabricantes y vendedores de reclamos relacionados con productos.",
          aliases: [
            "exención de producto",
            "liberación de fabricante",
            "liberación de productos",
          ],
        },
      },
    },
  },
  {
    id: "professional-liability-waiver",
    importPath: "./us/professional-liability-waiver",
    meta: {
      id: "professional-liability-waiver",
      title: "Professional Liability Waiver",
      description:
        "Waiver protecting professionals from malpractice and professional liability claims.",
      category: "Risk Management",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "malpractice waiver",
        "professional indemnity waiver",
        "service liability waiver",
        "exención de negligencia profesional",
        "exención de servicios profesionales",
        "renuncia de responsabilidad del servicio",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Professional Liability Waiver",
          description:
            "Waiver protecting professionals from malpractice and professional liability claims.",
          aliases: [
            "malpractice waiver",
            "professional indemnity waiver",
            "service liability waiver",
          ],
        },
        es: {
          name: "Exención de Responsabilidad Profesional",
          description:
            "Exención que protege a profesionales de reclamos de negligencia profesional y responsabilidad.",
          aliases: [
            "exención de negligencia profesional",
            "exención de servicios profesionales",
            "renuncia de responsabilidad del servicio",
          ],
        },
      },
    },
  },
  {
    id: "progressive-discipline-policy",
    importPath: "./us/progressive-discipline-policy",
    meta: {
      id: "progressive-discipline-policy",
      title: "Progressive Discipline Policy",
      description:
        "Comprehensive company policy outlining disciplinary procedures and progressive corrective actions.",
      category: "HR",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "disciplinary policy",
        "employee discipline procedures",
        "corrective action policy",
        "política disciplinaria",
        "procedimientos de disciplina de empleados",
        "política de acción correctiva",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Progressive Discipline Policy",
          description:
            "Comprehensive company policy outlining disciplinary procedures and progressive corrective actions.",
          aliases: [
            "disciplinary policy",
            "employee discipline procedures",
            "corrective action policy",
          ],
        },
        es: {
          name: "Política de Disciplina Progresiva",
          description:
            "Política integral de la empresa que describe los procedimientos disciplinarios y las acciones correctivas progresivas.",
          aliases: [
            "política disciplinaria",
            "procedimientos de disciplina de empleados",
            "política de acción correctiva",
          ],
        },
      },
    },
  },
  {
    id: "promissory-note",
    importPath: "./us/promissory-note",
    meta: {
      id: "promissory-note",
      title: "Promissory Note",
      description:
        "Create legally enforceable payment obligations with simple documentation. Protect yourself when lending money informally.",
      category: "Finance",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "iou",
        "loan paper",
        "promise to pay",
        "loan document",
        "pagaré",
        "documento de préstamo",
        "promesa de pago",
        "documento de préstamo legal",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Promissory Note",
          description:
            "Create legally enforceable payment obligations with simple documentation. Protect yourself when lending money informally.",
          aliases: ["iou", "loan paper", "promise to pay", "loan document"],
        },
        es: {
          name: "Pagaré",
          description:
            "Protege tu préstamo personal y asegura el reembolso. Establece términos claros de pago, interés y consecuencias por incumplimiento.",
          aliases: [
            "pagaré",
            "documento de préstamo",
            "promesa de pago",
            "documento de préstamo legal",
          ],
        },
      },
    },
  },
  {
    id: "promissory-note-balloon-payments",
    importPath: "./us/promissory-note-balloon-payments",
    meta: {
      id: "promissory-note-balloon-payments",
      title: "Promissory Note - Balloon Payments",
      description:
        "Create a promissory note with balloon payment structure, including regular payments and final balloon payment.",
      category: "Finance",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "balloon loan",
        "balloon note",
        "balloon payment loan",
        "balloon promissory note",
        "préstamo globo",
        "nota globo",
        "préstamo con pago globo",
        "pagaré globo",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Promissory Note - Balloon Payments",
          description:
            "Create a promissory note with balloon payment structure, including regular payments and final balloon payment.",
          aliases: [
            "balloon loan",
            "balloon note",
            "balloon payment loan",
            "balloon promissory note",
          ],
        },
        es: {
          name: "Pagaré - Pagos Globo",
          description:
            "Crear un pagaré con estructura de pago globo, incluyendo pagos regulares y pago final globo.",
          aliases: [
            "préstamo globo",
            "nota globo",
            "préstamo con pago globo",
            "pagaré globo",
          ],
        },
      },
    },
  },
  {
    id: "promissory-note-installment-payments",
    importPath: "./us/promissory-note-installment-payments",
    meta: {
      id: "promissory-note-installment-payments",
      title: "Promissory Note - Installment Payments",
      description:
        "Create a promissory note with structured installment payments, including payment schedule and terms.",
      category: "Finance",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "installment loan",
        "payment plan note",
        "structured loan",
        "installment promissory note",
        "préstamo a plazos",
        "nota de plan de pagos",
        "préstamo estructurado",
        "pagaré a plazos",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Promissory Note - Installment Payments",
          description:
            "Create a promissory note with structured installment payments, including payment schedule and terms.",
          aliases: [
            "installment loan",
            "payment plan note",
            "structured loan",
            "installment promissory note",
          ],
        },
        es: {
          name: "Pagaré - Pagos a Plazos",
          description:
            "Crear un pagaré con pagos estructurados a plazos, incluyendo cronograma de pagos y términos.",
          aliases: [
            "préstamo a plazos",
            "nota de plan de pagos",
            "préstamo estructurado",
            "pagaré a plazos",
          ],
        },
      },
    },
  },
  {
    id: "proof-of-income-letter",
    importPath: "./us/proof-of-income-letter",
    meta: {
      id: "proof-of-income-letter",
      title: "Proof of Income Letter",
      description:
        "Official letter verifying employee income for third parties",
      category: "HR",
      jurisdiction: "us",
      tags: [],
      aliases: [],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Proof of Income Letter",
          description:
            "Official letter verifying employee income for third parties",
          aliases: [],
        },
        es: {
          name: "Proof of Income Letter",
          description:
            "Official letter verifying employee income for third parties",
          aliases: [],
        },
      },
    },
  },
  {
    id: "property-deed",
    importPath: "./us/property-deed",
    meta: {
      id: "property-deed",
      title: "Property Deed",
      description:
        "Create a legally binding Property Deed with our easy-to-use template. State-specific requirements included.",
      category: "Real Estate",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "real estate deed",
        "property transfer",
        "deed of property",
        "escritura inmobiliaria",
        "transferencia de propiedad",
        "título de propiedad",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Property Deed",
          description:
            "Create a legally binding Property Deed with our easy-to-use template. State-specific requirements included.",
          aliases: [
            "real estate deed",
            "property transfer",
            "deed of property",
          ],
        },
        es: {
          name: "Escritura de Propiedad",
          description:
            "Crea una Escritura de Propiedad legalmente válida con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.",
          aliases: [
            "escritura inmobiliaria",
            "transferencia de propiedad",
            "título de propiedad",
          ],
        },
      },
    },
  },
  {
    id: "property-manager-agreement",
    importPath: "./us/property-manager-agreement",
    meta: {
      id: "property-manager-agreement",
      title: "Property Manager Agreement",
      description:
        "Agreement for property management services and responsibilities",
      category: "Business & Commercial",
      jurisdiction: "us",
      tags: [],
      aliases: [],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Property Manager Agreement",
          description:
            "Agreement for property management services and responsibilities",
          aliases: [],
        },
        es: {
          name: "Contrato de administración de propiedades",
          description:
            "Acuerdo para los servicios y responsabilidades de administración de propiedades.",
          aliases: [],
        },
      },
    },
  },
  {
    id: "provisional-patent-application",
    importPath: "./us/provisional-patent-application",
    meta: {
      id: "provisional-patent-application",
      title: "Provisional Patent Application",
      description:
        "Prepare a provisional patent application to establish an early filing date for your invention.",
      category: "Intellectual Property",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "provisional patent",
        "patent application",
        "provisional filing",
        "invention filing",
        "patente provisional",
        "solicitud patente",
        "presentación provisional",
        "registro invención",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Provisional Patent Application",
          description:
            "Prepare a provisional patent application to establish an early filing date for your invention.",
          aliases: [
            "provisional patent",
            "patent application",
            "provisional filing",
            "invention filing",
          ],
        },
        es: {
          name: "Solicitud de Patente Provisional",
          description:
            "Prepare una solicitud de patente provisional para establecer una fecha de presentación temprana para su invención.",
          aliases: [
            "patente provisional",
            "solicitud patente",
            "presentación provisional",
            "registro invención",
          ],
        },
      },
    },
  },
  {
    id: "purchase-agreement",
    importPath: "./us/purchase-agreement",
    meta: {
      id: "purchase-agreement",
      title: "General Purchase Agreement",
      description:
        "Complete property transactions with confidence and legal protection. Secure the best terms for buying or selling real estate.",
      category: "Sales",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "general purchase contract",
        "purchase contract",
        "buying agreement",
        "contrato general de compra",
        "contrato de compra",
        "acuerdo de compra",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "General Purchase Agreement",
          description:
            "Complete property transactions with confidence and legal protection. Secure the best terms for buying or selling real estate.",
          aliases: [
            "general purchase contract",
            "purchase contract",
            "buying agreement",
          ],
        },
        es: {
          name: "Acuerdo General de Compra",
          description:
            "Compra o vende cualquier propiedad con términos claros. Protege tanto al comprador como al vendedor definiendo precio, condiciones y detalles de cierre.",
          aliases: [
            "contrato general de compra",
            "contrato de compra",
            "acuerdo de compra",
          ],
        },
      },
    },
  },
  {
    id: "purchase-order",
    importPath: "./us/purchase-order",
    meta: {
      id: "purchase-order",
      title: "Purchase Order",
      description:
        "Streamline your business operations and avoid supply chain disputes with professional purchase orders. Ensure suppliers deliver exactly what you need on time.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "PO",
        "purchase request",
        "procurement order",
        "OC",
        "solicitud de compra",
        "orden de adquisición",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Purchase Order",
          description:
            "Streamline your business operations and avoid supply chain disputes with professional purchase orders. Ensure suppliers deliver exactly what you need on time.",
          aliases: ["PO", "purchase request", "procurement order"],
        },
        es: {
          name: "Orden de Compra",
          description:
            "Documento formal para solicitar bienes o servicios de un proveedor.",
          aliases: ["OC", "solicitud de compra", "orden de adquisición"],
        },
      },
    },
  },
  {
    id: "quitclaim-deed",
    importPath: "./us/quitclaim-deed",
    meta: {
      id: "quitclaim-deed",
      title: "Quitclaim Deed",
      description:
        "Transfer property ownership quickly for family or divorce situations. Simplify property transfers without title warranties.",
      category: "Real Estate",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "property transfer",
        "quit claim deed",
        "transfer ownership",
        "transferencia de propiedad",
        "escritura de finiquito",
        "transferir titularidad",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Quitclaim Deed",
          description:
            "Transfer property ownership quickly for family or divorce situations. Simplify property transfers without title warranties.",
          aliases: [
            "property transfer",
            "quit claim deed",
            "transfer ownership",
          ],
        },
        es: {
          name: "Escritura de Finiquito",
          description:
            "Transfiere tu parte de una propiedad rápidamente. Común en divorcios o transferencias familiares, pero no garantiza que no hay problemas legales.",
          aliases: [
            "transferencia de propiedad",
            "escritura de finiquito",
            "transferir titularidad",
          ],
        },
      },
    },
  },
  {
    id: "real-estate-purchase-agreement",
    importPath: "./us/real-estate-purchase-agreement",
    meta: {
      id: "real-estate-purchase-agreement",
      title: "Real Estate Purchase Agreement",
      description: "Agreement for the purchase and sale of real property.",
      category: "Real Estate & Property",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "home purchase agreement",
        "property purchase contract",
        "real estate sales contract",
        "contrato de compra de casa",
        "acuerdo de venta de propiedad",
        "contrato de venta de bienes raíces",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Real Estate Purchase Agreement",
          description: "Agreement for the purchase and sale of real property.",
          aliases: [
            "home purchase agreement",
            "property purchase contract",
            "real estate sales contract",
          ],
        },
        es: {
          name: "Acuerdo de Compra de Bienes Raíces",
          description: "Acuerdo para la compra y venta de bienes inmuebles.",
          aliases: [
            "contrato de compra de casa",
            "acuerdo de venta de propiedad",
            "contrato de venta de bienes raíces",
          ],
        },
      },
    },
  },
  {
    id: "receipt",
    importPath: "./us/receipt",
    meta: {
      id: "receipt",
      title: "Receipt",
      description:
        "Create a professional receipt for payments, services, or transactions with detailed records.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "payment receipt",
        "invoice receipt",
        "transaction receipt",
        "proof of payment",
        "recibo de pago",
        "recibo de factura",
        "recibo de transacción",
        "comprobante de pago",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Receipt",
          description:
            "Create a professional receipt for payments, services, or transactions with detailed records.",
          aliases: [
            "payment receipt",
            "invoice receipt",
            "transaction receipt",
            "proof of payment",
          ],
        },
        es: {
          name: "Recibo",
          description:
            "Comprobante oficial de pago para clientes. Documento profesional que ayuda con contabilidad y declaraciones de impuestos.",
          aliases: [
            "recibo de pago",
            "recibo de factura",
            "recibo de transacción",
            "comprobante de pago",
          ],
        },
      },
    },
  },
  {
    id: "recording-artist-agreement",
    importPath: "./us/recording-artist-agreement",
    meta: {
      id: "recording-artist-agreement",
      title: "Recording Artist Agreement",
      description:
        "Agreement between recording artists and record labels or producers.",
      category: "Entertainment & Media",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "record deal",
        "music contract",
        "artist recording contract",
        "contrato discográfico",
        "acuerdo musical",
        "contrato de grabación de artistas",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Recording Artist Agreement",
          description:
            "Agreement between recording artists and record labels or producers.",
          aliases: [
            "record deal",
            "music contract",
            "artist recording contract",
          ],
        },
        es: {
          name: "Acuerdo de Artista de Grabación",
          description:
            "Acuerdo entre artistas de grabación y sellos discográficos.",
          aliases: [
            "contrato discográfico",
            "acuerdo musical",
            "contrato de grabación de artistas",
          ],
        },
      },
    },
  },
  {
    id: "release-for-use-of-likeness",
    importPath: "./us/release-for-use-of-likeness",
    meta: {
      id: "release-for-use-of-likeness",
      title: "Release For Use Of Likeness",
      description: "Professional release for use of likeness document.",
      category: "Legal",
      jurisdiction: "us",
      tags: [],
      aliases: ["release for use of likeness"],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Release For Use Of Likeness",
          description: "Professional release for use of likeness document.",
          aliases: ["release for use of likeness"],
        },
        es: {
          name: "Release For Use Of Likeness en Español",
          description: "Documento profesional de release for use of likeness.",
          aliases: ["release for use of likeness"],
        },
      },
    },
  },
  {
    id: "release-of-liability",
    importPath: "./us/release-of-liability",
    meta: {
      id: "release-of-liability",
      title: "Release of Liability",
      description:
        "General release form to waive liability for activities or services.",
      category: "Risk & Liability",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "liability release",
        "general release",
        "waiver and release",
        "liberación de responsabilidad",
        "liberación general",
        "exención y liberación",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Release of Liability",
          description:
            "General release form to waive liability for activities or services.",
          aliases: [
            "liability release",
            "general release",
            "waiver and release",
          ],
        },
        es: {
          name: "Liberación de Responsabilidad",
          description:
            "Formulario general de liberación para eximir responsabilidad por actividades o servicios.",
          aliases: [
            "liberación de responsabilidad",
            "liberación general",
            "exención y liberación",
          ],
        },
      },
    },
  },
  {
    id: "remodeling-contract",
    importPath: "./us/remodeling-contract",
    meta: {
      id: "remodeling-contract",
      title: "Home Remodeling Contract",
      description:
        "Contract for residential remodeling and renovation projects including kitchens, bathrooms, and room additions.",
      category: "Construction",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "renovation contract",
        "home improvement contract",
        "remodel agreement",
        "contrato de renovación",
        "contrato de mejoras para el hogar",
        "acuerdo de remodelación",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Home Remodeling Contract",
          description:
            "Contract for residential remodeling and renovation projects including kitchens, bathrooms, and room additions.",
          aliases: [
            "renovation contract",
            "home improvement contract",
            "remodel agreement",
          ],
        },
        es: {
          name: "Contrato de Remodelación",
          description:
            "Contrato para proyectos de remodelación y renovación residencial incluyendo cocinas, baños y adiciones de habitaciones.",
          aliases: [
            "contrato de renovación",
            "contrato de mejoras para el hogar",
            "acuerdo de remodelación",
          ],
        },
      },
    },
  },
  {
    id: "rent-increase-letter",
    importPath: "./us/rent-increase-letter",
    meta: {
      id: "rent-increase-letter",
      title: "Rent Increase Letter",
      description: "Formal notice to tenants regarding rent increases",
      category: "Real Estate & Property",
      jurisdiction: "us",
      tags: [],
      aliases: [],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Rent Increase Letter",
          description: "Formal notice to tenants regarding rent increases",
          aliases: [],
        },
        es: {
          name: "Carta de aumento de renta",
          description:
            "Aviso formal a los inquilinos sobre incrementos en la renta.",
          aliases: [],
        },
      },
    },
  },
  {
    id: "rent-receipt",
    importPath: "./us/rent-receipt",
    meta: {
      id: "rent-receipt",
      title: "Rent Receipt",
      description:
        "Generate official rent payment receipts for landlords and tenants",
      category: "Real Estate & Property",
      jurisdiction: "us",
      tags: [],
      aliases: [],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Rent Receipt",
          description:
            "Generate official rent payment receipts for landlords and tenants",
          aliases: [],
        },
        es: {
          name: "Recibo de Renta",
          description:
            "Comprobante oficial de pago de renta para propietarios e inquilinos. Documento importante para registros financieros y declaraciones de impuestos.",
          aliases: [],
        },
      },
    },
  },
  {
    id: "rental-agreement",
    importPath: "./us/rental-agreement",
    meta: {
      id: "rental-agreement",
      title: "Rental Agreement",
      description:
        "Generate steady rental income or secure quality housing with clear terms that protect both parties. Prevent costly tenant disputes and legal issues.",
      category: "Real Estate",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "rental contract",
        "property rental",
        "lease contract",
        "tenancy agreement",
        "contrato de alquiler",
        "contrato de renta",
        "acuerdo de arrendamiento",
        "acuerdo de arrendamiento legal",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Rental Agreement",
          description:
            "Generate steady rental income or secure quality housing with clear terms that protect both parties. Prevent costly tenant disputes and legal issues.",
          aliases: [
            "rental contract",
            "property rental",
            "lease contract",
            "tenancy agreement",
          ],
        },
        es: {
          name: "Acuerdo de Alquiler",
          description:
            "Crea un acuerdo de alquiler legalmente válido con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.",
          aliases: [
            "contrato de alquiler",
            "contrato de renta",
            "acuerdo de arrendamiento",
            "acuerdo de arrendamiento legal",
          ],
        },
      },
    },
  },
  {
    id: "research-agreement",
    importPath: "./us/research-agreement",
    meta: {
      id: "research-agreement",
      title: "Research Agreement",
      description:
        "Agreement for research collaboration and academic research projects.",
      category: "Academic & Research",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "research collaboration agreement",
        "academic research contract",
        "study agreement",
        "acuerdo de colaboración de investigación",
        "contrato de investigación académica",
        "acuerdo de estudio",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Research Agreement",
          description:
            "Agreement for research collaboration and academic research projects.",
          aliases: [
            "research collaboration agreement",
            "academic research contract",
            "study agreement",
          ],
        },
        es: {
          name: "Acuerdo de Investigación",
          description:
            "Acuerdo para colaboración de investigación y proyectos de investigación académica.",
          aliases: [
            "acuerdo de colaboración de investigación",
            "contrato de investigación académica",
            "acuerdo de estudio",
          ],
        },
      },
    },
  },
  {
    id: "residential-lease-agreement",
    importPath: "./us/residential-lease-agreement",
    meta: {
      id: "residential-lease-agreement",
      title: "Residential Rental Agreement",
      description:
        "Secure quality housing or generate reliable rental income. Establish clear expectations that protect everyone's interests.",
      category: "Real Estate",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "residential lease contract",
        "apartment lease",
        "rental lease",
        "home rental agreement",
        "contrato de arrendamiento residencial",
        "arrendamiento de apartamento",
        "contrato de alquiler",
        "acuerdo de alquiler de viviendas",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Residential Rental Agreement",
          description:
            "Secure quality housing or generate reliable rental income. Establish clear expectations that protect everyone's interests.",
          aliases: [
            "residential lease contract",
            "apartment lease",
            "rental lease",
            "home rental agreement",
          ],
        },
        es: {
          name: "Contrato de Alquiler Residencial",
          description:
            "Alquila una casa o apartamento con términos que protegen tanto al inquilino como al propietario. Cubre renta, depósitos de seguridad y reglas de la casa.",
          aliases: [
            "contrato de arrendamiento residencial",
            "arrendamiento de apartamento",
            "contrato de alquiler",
            "acuerdo de alquiler de viviendas",
          ],
        },
      },
    },
  },
  {
    id: "residential-rental-application",
    importPath: "./us/residential-rental-application",
    meta: {
      id: "residential-rental-application",
      title: "Residential Rental Application",
      description:
        "Comprehensive rental application form for prospective tenants",
      category: "Real Estate & Property",
      jurisdiction: "us",
      tags: [],
      aliases: [],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Residential Rental Application",
          description:
            "Comprehensive rental application form for prospective tenants",
          aliases: [],
        },
        es: {
          name: "Solicitud de alquiler residencial",
          description:
            "Formulario integral de solicitud de alquiler para arrendatarios potenciales.",
          aliases: [],
        },
      },
    },
  },
  {
    id: "residential-rental-inspection-report",
    importPath: "./us/residential-rental-inspection-report",
    meta: {
      id: "residential-rental-inspection-report",
      title: "Residential Rental Inspection Report",
      description:
        "Document property condition for move-in and move-out inspections",
      category: "Real Estate & Property",
      jurisdiction: "us",
      tags: [],
      aliases: [],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Residential Rental Inspection Report",
          description:
            "Document property condition for move-in and move-out inspections",
          aliases: [],
        },
        es: {
          name: "Informe de inspección de alquiler residencial",
          description:
            "Documenta el estado de la propiedad durante las inspecciones de entrada y salida.",
          aliases: [],
        },
      },
    },
  },
  {
    id: "resignation-letter",
    importPath: "./us/resignation-letter",
    meta: {
      id: "resignation-letter",
      title: "Resignation Letter",
      description: "Professional resignation letter template",
      category: "Employment",
      jurisdiction: "us",
      tags: [],
      aliases: [],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Resignation Letter",
          description: "Professional resignation letter template",
          aliases: [],
        },
        es: {
          name: "Carta de Renuncia",
          description:
            "Renuncia a tu trabajo de manera profesional. Mantiene buenas relaciones y protege tu reputación laboral.",
          aliases: [],
        },
      },
    },
  },
  {
    id: "resignation-letter-personal",
    importPath: "./us/resignation-letter-personal",
    meta: {
      id: "resignation-letter-personal",
      title: "Resignation Letter (Personal)",
      description:
        "Professional letter to formally resign from employment for personal reasons.",
      category: "Employment & HR",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "personal resignation letter",
        "job resignation letter",
        "carta de renuncia personal",
        "carta de renuncia laboral",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Resignation Letter (Personal)",
          description:
            "Professional letter to formally resign from employment for personal reasons.",
          aliases: ["personal resignation letter", "job resignation letter"],
        },
        es: {
          name: "Carta de Renuncia (Personal)",
          description:
            "Renuncia por motivos personales (familia, salud, mudanza). Mantiene relaciones profesionales y deja la puerta abierta para el futuro.",
          aliases: ["carta de renuncia personal", "carta de renuncia laboral"],
        },
      },
    },
  },
  {
    id: "restaurant-agreement",
    importPath: "./us/restaurant-agreement",
    meta: {
      id: "restaurant-agreement",
      title: "Restaurant Agreement",
      description:
        "Agreement for restaurant operations, partnerships, or management.",
      category: "Food & Hospitality",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "restaurant partnership",
        "restaurant management agreement",
        "sociedad de restaurante",
        "acuerdo de gestión",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Restaurant Agreement",
          description:
            "Agreement for restaurant operations, partnerships, or management.",
          aliases: [
            "restaurant partnership",
            "restaurant management agreement",
          ],
        },
        es: {
          name: "Acuerdo de Restaurante",
          description:
            "Acuerdo para operaciones, asociaciones o gestión de restaurantes.",
          aliases: ["sociedad de restaurante", "acuerdo de gestión"],
        },
      },
    },
  },
  {
    id: "restaurant-lease",
    importPath: "./us/restaurant-lease",
    meta: {
      id: "restaurant-lease",
      title: "Restaurant Lease",
      description:
        "Specialized lease agreement for restaurant and food service businesses",
      category: "Business & Commercial",
      jurisdiction: "us",
      tags: [],
      aliases: [],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Restaurant Lease",
          description:
            "Specialized lease agreement for restaurant and food service businesses",
          aliases: [],
        },
        es: {
          name: "Contrato de arrendamiento para restaurante",
          description:
            "Contrato de arrendamiento especializado para negocios de restaurantes y servicios de alimentos.",
          aliases: [],
        },
      },
    },
  },
  {
    id: "retail-space-lease",
    importPath: "./us/retail-space-lease",
    meta: {
      id: "retail-space-lease",
      title: "Retail Space Lease",
      description:
        "Commercial lease agreement for retail locations and storefronts",
      category: "Business & Commercial",
      jurisdiction: "us",
      tags: [],
      aliases: [],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Retail Space Lease",
          description:
            "Commercial lease agreement for retail locations and storefronts",
          aliases: [],
        },
        es: {
          name: "Contrato de arrendamiento de local comercial",
          description:
            "Contrato de arrendamiento comercial para locales y tiendas minoristas.",
          aliases: [],
        },
      },
    },
  },
  {
    id: "retirement-plan-agreement",
    importPath: "./us/retirement-plan-agreement",
    meta: {
      id: "retirement-plan-agreement",
      title: "Retirement Plan Agreement",
      description:
        "Agreement for employer-sponsored retirement plan participation.",
      category: "Finance & Lending",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "401k agreement",
        "pension plan agreement",
        "retirement benefit plan",
        "plan de pensiones",
        "acuerdo de beneficios",
        "plan de beneficios de jubilación",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Retirement Plan Agreement",
          description:
            "Agreement for employer-sponsored retirement plan participation.",
          aliases: [
            "401k agreement",
            "pension plan agreement",
            "retirement benefit plan",
          ],
        },
        es: {
          name: "Acuerdo de Plan de Jubilación",
          description:
            "Acuerdo para participación en plan de jubilación patrocinado por empleador.",
          aliases: [
            "plan de pensiones",
            "acuerdo de beneficios",
            "plan de beneficios de jubilación",
          ],
        },
      },
    },
  },
  {
    id: "revocation-of-power-of-attorney",
    importPath: "./us/revocation-of-power-of-attorney",
    meta: {
      id: "revocation-of-power-of-attorney",
      title: "Revocation of Power of Attorney",
      description:
        "Officially revoke a previously granted power of attorney and terminate the agent's authority.",
      category: "Legal",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "revoke poa",
        "cancel power of attorney",
        "terminate agent authority",
        "poa revocation",
        "revocar poder",
        "cancelar poder notarial",
        "terminar autoridad agente",
        "revocación de poa",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Revocation of Power of Attorney",
          description:
            "Officially revoke a previously granted power of attorney and terminate the agent's authority.",
          aliases: [
            "revoke poa",
            "cancel power of attorney",
            "terminate agent authority",
            "poa revocation",
          ],
        },
        es: {
          name: "Revocación de Poder Notarial",
          description:
            "Revocar oficialmente un poder notarial previamente otorgado y terminar la autoridad del agente.",
          aliases: [
            "revocar poder",
            "cancelar poder notarial",
            "terminar autoridad agente",
            "revocación de poa",
          ],
        },
      },
    },
  },
  {
    id: "revolving-credit-agreement",
    importPath: "./us/revolving-credit-agreement",
    meta: {
      id: "revolving-credit-agreement",
      title: "Revolving Credit Agreement",
      description:
        "Establish a revolving credit line with terms, limits, and payment requirements.",
      category: "Finance",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "credit line agreement",
        "revolving loan",
        "line of credit",
        "credit facility",
        "acuerdo de línea de crédito",
        "préstamo rotativo",
        "línea de crédito",
        "facilidad de crédito",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Revolving Credit Agreement",
          description:
            "Establish a revolving credit line with terms, limits, and payment requirements.",
          aliases: [
            "credit line agreement",
            "revolving loan",
            "line of credit",
            "credit facility",
          ],
        },
        es: {
          name: "Acuerdo de Crédito Rotativo",
          description:
            "Establecer una línea de crédito rotativo con términos, límites y requisitos de pago.",
          aliases: [
            "acuerdo de línea de crédito",
            "préstamo rotativo",
            "línea de crédito",
            "facilidad de crédito",
          ],
        },
      },
    },
  },
  {
    id: "ride-sharing-agreement",
    importPath: "./us/ride-sharing-agreement",
    meta: {
      id: "ride-sharing-agreement",
      title: "Ride Sharing Agreement",
      description: "Agreement for ride sharing and carpooling arrangements.",
      category: "Transportation & Automotive",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "carpool agreement",
        "rideshare contract",
        "driver passenger agreement",
        "acuerdo de carpool",
        "contrato de viaje compartido",
        "acuerdo de pasajero del conductor",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Ride Sharing Agreement",
          description:
            "Agreement for ride sharing and carpooling arrangements.",
          aliases: [
            "carpool agreement",
            "rideshare contract",
            "driver passenger agreement",
          ],
        },
        es: {
          name: "Acuerdo de Viaje Compartido",
          description:
            "Acuerdo para arreglos de viaje compartido y carpooling.",
          aliases: [
            "acuerdo de carpool",
            "contrato de viaje compartido",
            "acuerdo de pasajero del conductor",
          ],
        },
      },
    },
  },
  {
    id: "roofing-contract",
    importPath: "./us/roofing-contract",
    meta: {
      id: "roofing-contract",
      title: "Roofing Contract",
      description:
        "Professional contract for roofing projects including repairs, replacements, and new installations.",
      category: "Construction",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "roof repair contract",
        "roof replacement agreement",
        "roofing service contract",
        "contrato de reparación de techo",
        "acuerdo de reemplazo de techo",
        "contrato de servicio de techado",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Roofing Contract",
          description:
            "Professional contract for roofing projects including repairs, replacements, and new installations.",
          aliases: [
            "roof repair contract",
            "roof replacement agreement",
            "roofing service contract",
          ],
        },
        es: {
          name: "Contrato de Techado",
          description:
            "Contrato profesional para proyectos de techado incluyendo reparaciones, reemplazos e instalaciones nuevas.",
          aliases: [
            "contrato de reparación de techo",
            "acuerdo de reemplazo de techo",
            "contrato de servicio de techado",
          ],
        },
      },
    },
  },
  {
    id: "room-rental-agreement",
    importPath: "./us/room-rental-agreement",
    meta: {
      id: "room-rental-agreement",
      title: "Room Rental Agreement",
      description:
        "Generate additional income by renting rooms in your home. Establish clear boundaries for shared living spaces.",
      category: "Real Estate",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "room lease",
        "bedroom rental",
        "shared housing agreement",
        "room sharing contract",
        "arrendamiento de habitación",
        "alquiler de dormitorio",
        "acuerdo de vivienda compartida",
        "contrato de intercambio de habitaciones",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Room Rental Agreement",
          description:
            "Generate additional income by renting rooms in your home. Establish clear boundaries for shared living spaces.",
          aliases: [
            "room lease",
            "bedroom rental",
            "shared housing agreement",
            "room sharing contract",
          ],
        },
        es: {
          name: "Acuerdo de Alquiler de Habitación",
          description:
            "Genera ingresos adicionales alquilando habitaciones en tu hogar. Establece límites claros para espacios de vida compartidos.",
          aliases: [
            "arrendamiento de habitación",
            "alquiler de dormitorio",
            "acuerdo de vivienda compartida",
            "contrato de intercambio de habitaciones",
          ],
        },
      },
    },
  },
  {
    id: "roommate-agreement",
    importPath: "./us/roommate-agreement",
    meta: {
      id: "roommate-agreement",
      title: "Roommate Agreement",
      description:
        "Establish clear rules and responsibilities for shared living arrangements.",
      category: "Real Estate",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "roommate contract",
        "shared living agreement",
        "housemate agreement",
        "contrato de compañeros de cuarto",
        "acuerdo de convivencia",
        "acuerdo de compañeros de casa",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Roommate Agreement",
          description:
            "Establish clear rules and responsibilities for shared living arrangements.",
          aliases: [
            "roommate contract",
            "shared living agreement",
            "housemate agreement",
          ],
        },
        es: {
          name: "Acuerdo de Compañeros de Cuarto",
          description:
            "Establece reglas claras y responsabilidades para arreglos de vida compartida.",
          aliases: [
            "contrato de compañeros de cuarto",
            "acuerdo de convivencia",
            "acuerdo de compañeros de casa",
          ],
        },
      },
    },
  },
  {
    id: "royalty-agreement",
    importPath: "./us/royalty-agreement",
    meta: {
      id: "royalty-agreement",
      title: "Royalty Agreement",
      description:
        "Agreement for royalty payments and distribution of intellectual property licensing revenue.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "royalty contract",
        "licensing royalty",
        "ip royalty",
        "revenue sharing",
        "contrato regalías",
        "regalías licenciamiento",
        "regalías pi",
        "participación ingresos",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Royalty Agreement",
          description:
            "Agreement for royalty payments and distribution of intellectual property licensing revenue.",
          aliases: [
            "royalty contract",
            "licensing royalty",
            "ip royalty",
            "revenue sharing",
          ],
        },
        es: {
          name: "Acuerdo de Regalías",
          description:
            "Acuerdo para pagos de regalías y distribución de ingresos por licenciamiento de propiedad intelectual.",
          aliases: [
            "contrato regalías",
            "regalías licenciamiento",
            "regalías pi",
            "participación ingresos",
          ],
        },
      },
    },
  },
  {
    id: "salary-verification-letter",
    importPath: "./us/salary-verification-letter",
    meta: {
      id: "salary-verification-letter",
      title: "Salary Verification Letter",
      description: "Official letter verifying employee salary information",
      category: "HR",
      jurisdiction: "us",
      tags: [],
      aliases: [],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Salary Verification Letter",
          description: "Official letter verifying employee salary information",
          aliases: [],
        },
        es: {
          name: "Salary Verification Letter",
          description: "Official letter verifying employee salary information",
          aliases: [],
        },
      },
    },
  },
  {
    id: "sale-of-goods",
    importPath: "./us/sale-of-goods",
    meta: {
      id: "sale-of-goods",
      title: "Sale of Goods Agreement",
      description:
        "Comprehensive agreement for the sale and purchase of physical goods.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "goods purchase agreement",
        "sales contract",
        "product sale agreement",
        "acuerdo de compra de bienes",
        "contrato de ventas",
        "acuerdo de venta de productos",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Sale of Goods Agreement",
          description:
            "Comprehensive agreement for the sale and purchase of physical goods.",
          aliases: [
            "goods purchase agreement",
            "sales contract",
            "product sale agreement",
          ],
        },
        es: {
          name: "Acuerdo de Venta de Bienes",
          description:
            "Acuerdo integral para la venta y compra de bienes físicos.",
          aliases: [
            "acuerdo de compra de bienes",
            "contrato de ventas",
            "acuerdo de venta de productos",
          ],
        },
      },
    },
  },
  {
    id: "sales-agreement",
    importPath: "./us/sales-agreement",
    meta: {
      id: "sales-agreement",
      title: "Sales Agreement",
      description:
        "Create a comprehensive sales agreement for goods or products.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "purchase and sale agreement",
        "sale contract",
        "goods agreement",
        "contrato de venta",
        "acuerdo de compraventa",
        "acuerdo de bienes",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Sales Agreement",
          description:
            "Create a comprehensive sales agreement for goods or products.",
          aliases: [
            "purchase and sale agreement",
            "sale contract",
            "goods agreement",
          ],
        },
        es: {
          name: "Acuerdo de Venta",
          description:
            "Crea un acuerdo de venta integral para bienes o productos.",
          aliases: [
            "contrato de venta",
            "acuerdo de compraventa",
            "acuerdo de bienes",
          ],
        },
      },
    },
  },
  {
    id: "security-agreement",
    importPath: "./us/security-agreement",
    meta: {
      id: "security-agreement",
      title: "Security Agreement",
      description:
        "Legal agreement creating a security interest in personal property to secure debt obligations.",
      category: "Finance",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "collateral agreement",
        "secured transaction agreement",
        "UCC security agreement",
        "acuerdo de colateral",
        "acuerdo de transacción garantizada",
        "acuerdo de seguridad de ucc",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Security Agreement",
          description:
            "Legal agreement creating a security interest in personal property to secure debt obligations.",
          aliases: [
            "collateral agreement",
            "secured transaction agreement",
            "UCC security agreement",
          ],
        },
        es: {
          name: "Acuerdo de Garantía",
          description:
            "Acuerdo legal que crea un interés de garantía en propiedad personal para asegurar obligaciones de deuda.",
          aliases: [
            "acuerdo de colateral",
            "acuerdo de transacción garantizada",
            "acuerdo de seguridad de ucc",
          ],
        },
      },
    },
  },
  {
    id: "separation-agreement",
    importPath: "./us/separation-agreement",
    meta: {
      id: "separation-agreement",
      title: "Separation Agreement",
      description:
        "General agreement for couples separating and dividing assets.",
      category: "Family & Personal",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "legal separation",
        "separation contract",
        "separación legal",
        "contrato de separación",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Separation Agreement",
          description:
            "General agreement for couples separating and dividing assets.",
          aliases: ["legal separation", "separation contract"],
        },
        es: {
          name: "Acuerdo de Separación",
          description:
            "Acuerdo general para parejas que se separan y dividen bienes.",
          aliases: ["separación legal", "contrato de separación"],
        },
      },
    },
  },
  {
    id: "service-agreement",
    importPath: "./us/service-agreement",
    meta: {
      id: "service-agreement",
      title: "Service Agreement",
      description:
        "Ensure service quality and prevent misunderstandings with providers. Establish clear expectations for deliverables, timelines, and payments.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "hire services",
        "service provider",
        "payment terms",
        "contratar servicios",
        "proveedor de servicios",
        "términos de pago",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Service Agreement",
          description:
            "Ensure service quality and prevent misunderstandings with providers. Establish clear expectations for deliverables, timelines, and payments.",
          aliases: ["hire services", "service provider", "payment terms"],
        },
        es: {
          name: "Acuerdo de Servicios",
          description:
            "Asegura la calidad del servicio y evita malentendidos con proveedores. Establece expectativas claras sobre entregables, cronogramas y pagos.",
          aliases: [
            "contratar servicios",
            "proveedor de servicios",
            "términos de pago",
          ],
        },
      },
    },
  },
  {
    id: "service-level-agreement",
    importPath: "./us/service-level-agreement",
    meta: {
      id: "service-level-agreement",
      title: "Service Level Agreement (SLA)",
      description:
        "Create an SLA defining service performance standards and expectations between parties.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "SLA",
        "service level agreement",
        "performance agreement",
        "acuerdo de nivel de servicio",
        "acuerdo de rendimiento",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Service Level Agreement (SLA)",
          description:
            "Create an SLA defining service performance standards and expectations between parties.",
          aliases: ["SLA", "service level agreement", "performance agreement"],
        },
        es: {
          name: "Acuerdo de Nivel de Servicio (SLA)",
          description:
            "Crea un SLA que defina estándares de rendimiento del servicio y expectativas entre partes.",
          aliases: [
            "SLA",
            "acuerdo de nivel de servicio",
            "acuerdo de rendimiento",
          ],
        },
      },
    },
  },
  {
    id: "settlement-agreement",
    importPath: "./us/settlement-agreement",
    meta: {
      id: "settlement-agreement",
      title: "Settlement Agreement",
      description:
        "Resolve disputes quickly and avoid expensive court battles while protecting your interests. Save time and money by settling claims professionally.",
      category: "Dispute Resolution",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "dispute settlement agreement",
        "claim settlement agreement",
        "release and settlement",
        "acuerdo de resolución de disputas",
        "acuerdo de liquidación de reclamos",
        "liberación y liquidación",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Settlement Agreement",
          description:
            "Resolve disputes quickly and avoid expensive court battles while protecting your interests. Save time and money by settling claims professionally.",
          aliases: [
            "dispute settlement agreement",
            "claim settlement agreement",
            "release and settlement",
          ],
        },
        es: {
          name: "Acuerdo de Liquidación",
          description:
            "Acuerdo integral para resolver disputas y liquidar reclamos entre las partes.",
          aliases: [
            "acuerdo de resolución de disputas",
            "acuerdo de liquidación de reclamos",
            "liberación y liquidación",
          ],
        },
      },
    },
  },
  {
    id: "severance-agreement",
    importPath: "./us/severance-agreement",
    meta: {
      id: "severance-agreement",
      title: "Severance Agreement",
      description:
        "Protect your business from wrongful termination lawsuits and ensure smooth employee separations. Provide fair compensation while preventing future legal claims.",
      category: "Employment",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "severance contract",
        "separation agreement",
        "employment separation",
        "severance package",
        "contrato de indemnización",
        "acuerdo de separación",
        "paquete de indemnización",
        "paquete de indemnización legal",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Severance Agreement",
          description:
            "Protect your business from wrongful termination lawsuits and ensure smooth employee separations. Provide fair compensation while preventing future legal claims.",
          aliases: [
            "severance contract",
            "separation agreement",
            "employment separation",
            "severance package",
          ],
        },
        es: {
          name: "Acuerdo de Indemnización",
          description:
            "Crea un acuerdo de indemnización legalmente válido con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.",
          aliases: [
            "contrato de indemnización",
            "acuerdo de separación",
            "paquete de indemnización",
            "paquete de indemnización legal",
          ],
        },
      },
    },
  },
  {
    id: "shareholder-agreement",
    importPath: "./us/shareholder-agreement",
    meta: {
      id: "shareholder-agreement",
      title: "Shareholder Agreement",
      description:
        "Agreement between company shareholders governing rights, responsibilities, and transfer of shares.",
      category: "Corporate",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "Shareholders agreement",
        "Stock agreement",
        "Equity agreement",
        "Acuerdo accionistas",
        "Acuerdo de acciones",
        "Acuerdo de capital",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Shareholder Agreement",
          description:
            "Agreement between company shareholders governing rights, responsibilities, and transfer of shares.",
          aliases: [
            "Shareholders agreement",
            "Stock agreement",
            "Equity agreement",
          ],
        },
        es: {
          name: "Acuerdo de Accionistas",
          description:
            "Acuerdo entre accionistas de la empresa que rige los derechos, responsabilidades y transferencia de acciones.",
          aliases: [
            "Acuerdo accionistas",
            "Acuerdo de acciones",
            "Acuerdo de capital",
          ],
        },
      },
    },
  },
  {
    id: "simple-will",
    importPath: "./us/simple-will",
    meta: {
      id: "simple-will",
      title: "Simple Will",
      description:
        "Create a basic last will and testament for straightforward estate planning with our easy-to-use template.",
      category: "Estate Planning",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "basic will",
        "last will",
        "testament",
        "simple last will",
        "testamento básico",
        "última voluntad",
        "testamento sencillo",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Simple Will",
          description:
            "Create a basic last will and testament for straightforward estate planning with our easy-to-use template.",
          aliases: ["basic will", "last will", "testament", "simple last will"],
        },
        es: {
          name: "Testamento Simple",
          description:
            "Crea un testamento básico para planificación patrimonial sencilla con nuestra plantilla fácil de usar.",
          aliases: [
            "testamento básico",
            "última voluntad",
            "testamento sencillo",
            "simple last will",
          ],
        },
      },
    },
  },
  {
    id: "single-member-llc-operating-agreement",
    importPath: "./us/single-member-llc-operating-agreement",
    meta: {
      id: "single-member-llc-operating-agreement",
      title: "Single-Member LLC Operating Agreement",
      description:
        "Operating agreement for single-member limited liability companies to establish ownership structure and operational procedures.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "Single member LLC agreement",
        "Solo LLC operating agreement",
        "Single owner LLC agreement",
        "Acuerdo LLC de un miembro",
        "Acuerdo operativo LLC solo",
        "Acuerdo LLC propietario único",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Single-Member LLC Operating Agreement",
          description:
            "Operating agreement for single-member limited liability companies to establish ownership structure and operational procedures.",
          aliases: [
            "Single member LLC agreement",
            "Solo LLC operating agreement",
            "Single owner LLC agreement",
          ],
        },
        es: {
          name: "Acuerdo Operativo de LLC de Miembro Único",
          description:
            "Acuerdo operativo para sociedades de responsabilidad limitada de un solo miembro para establecer la estructura de propiedad y procedimientos operativos.",
          aliases: [
            "Acuerdo LLC de un miembro",
            "Acuerdo operativo LLC solo",
            "Acuerdo LLC propietario único",
          ],
        },
      },
    },
  },
  {
    id: "small-estate-affidavit",
    importPath: "./us/small-estate-affidavit",
    meta: {
      id: "small-estate-affidavit",
      title: "Small Estate Affidavit",
      description:
        "Affidavit to transfer assets of a small estate without formal probate proceedings.",
      category: "Legal",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "small estate succession",
        "affidavit of small estate",
        "small estate declaration",
        "simplified probate affidavit",
        "small estate transfer",
        "inheritance affidavit",
        "sucesión de patrimonio pequeño",
        "declaración jurada de herencia pequeña",
        "declaración de patrimonio menor",
        "declaración jurada de sucesión simplificada",
        "transferencia de patrimonio pequeño",
        "declaración jurada de herencia",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Small Estate Affidavit",
          description:
            "Affidavit to transfer assets of a small estate without formal probate proceedings.",
          aliases: [
            "small estate succession",
            "affidavit of small estate",
            "small estate declaration",
            "simplified probate affidavit",
            "small estate transfer",
            "inheritance affidavit",
          ],
        },
        es: {
          name: "Declaración Jurada de Patrimonio Pequeño",
          description:
            "Declaración jurada para transferir activos de un patrimonio pequeño sin procedimientos formales de sucesión.",
          aliases: [
            "sucesión de patrimonio pequeño",
            "declaración jurada de herencia pequeña",
            "declaración de patrimonio menor",
            "declaración jurada de sucesión simplificada",
            "transferencia de patrimonio pequeño",
            "declaración jurada de herencia",
          ],
        },
      },
    },
  },
  {
    id: "social-media-management-agreement",
    importPath: "./us/social-media-management-agreement",
    meta: {
      id: "social-media-management-agreement",
      title: "Social Media Management Agreement",
      description:
        "Professional agreement for social media marketing and management services between agency and client.",
      category: "Marketing & Advertising",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "social media contract",
        "digital marketing agreement",
        "social media services contract",
        "contrato de redes sociales",
        "acuerdo de marketing digital",
        "contrato de servicios de redes sociales",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Social Media Management Agreement",
          description:
            "Professional agreement for social media marketing and management services between agency and client.",
          aliases: [
            "social media contract",
            "digital marketing agreement",
            "social media services contract",
          ],
        },
        es: {
          name: "Acuerdo de Gestión de Redes Sociales",
          description:
            "Acuerdo profesional para servicios de marketing y gestión de redes sociales entre agencia y cliente.",
          aliases: [
            "contrato de redes sociales",
            "acuerdo de marketing digital",
            "contrato de servicios de redes sociales",
          ],
        },
      },
    },
  },
  {
    id: "software-license-agreement",
    importPath: "./us/software-license-agreement",
    meta: {
      id: "software-license-agreement",
      title: "Software License Agreement",
      description:
        "Generate revenue from your software while protecting intellectual property. Control usage and prevent unauthorized distribution.",
      category: "Technology & IT",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "software licensing agreement",
        "end user license agreement",
        "EULA",
        "acuerdo de licenciamiento de software",
        "eula legal",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Software License Agreement",
          description:
            "Generate revenue from your software while protecting intellectual property. Control usage and prevent unauthorized distribution.",
          aliases: [
            "software licensing agreement",
            "end user license agreement",
            "EULA",
          ],
        },
        es: {
          name: "Acuerdo de Licencia de Software",
          description:
            "Licencia tu software a usuarios mientras proteges tus derechos de propiedad intelectual. Establece términos de uso y restricciones.",
          aliases: [
            "acuerdo de licenciamiento de software",
            "EULA",
            "eula legal",
          ],
        },
      },
    },
  },
  {
    id: "solar-energy-agreement",
    importPath: "./us/solar-energy-agreement",
    meta: {
      id: "solar-energy-agreement",
      title: "Solar Energy Agreement",
      description:
        "Agreement for solar panel installation and energy services.",
      category: "Environmental & Energy",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "solar installation contract",
        "solar power agreement",
        "photovoltaic contract",
        "contrato de instalación solar",
        "acuerdo fotovoltaico",
        "contrato fotovoltaico",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Solar Energy Agreement",
          description:
            "Agreement for solar panel installation and energy services.",
          aliases: [
            "solar installation contract",
            "solar power agreement",
            "photovoltaic contract",
          ],
        },
        es: {
          name: "Acuerdo de Energía Solar",
          description:
            "Acuerdo para instalación de paneles solares y servicios energéticos.",
          aliases: [
            "contrato de instalación solar",
            "acuerdo fotovoltaico",
            "contrato fotovoltaico",
          ],
        },
      },
    },
  },
  {
    id: "sponsorship-agreement",
    importPath: "./us/sponsorship-agreement",
    meta: {
      id: "sponsorship-agreement",
      title: "Sponsorship Agreement",
      description: "Agreement for event, sports, or business sponsorships.",
      category: "Marketing & Advertising",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "sponsor contract",
        "sponsorship deal",
        "contrato de patrocinio",
        "acuerdo de patrocinio",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Sponsorship Agreement",
          description: "Agreement for event, sports, or business sponsorships.",
          aliases: ["sponsor contract", "sponsorship deal"],
        },
        es: {
          name: "Acuerdo de Patrocinio",
          description:
            "Acuerdo para patrocinios de eventos, deportes o negocios.",
          aliases: ["contrato de patrocinio", "acuerdo de patrocinio"],
        },
      },
    },
  },
  {
    id: "sports-agreement",
    importPath: "./us/sports-agreement",
    meta: {
      id: "sports-agreement",
      title: "Sports Agreement",
      description:
        "Agreement for sports activities, coaching, and athletic services.",
      category: "Sports & Recreation",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "athletic agreement",
        "coaching contract",
        "sports contract",
        "acuerdo atlético",
        "contrato de entrenamiento",
        "contrato deportivo",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Sports Agreement",
          description:
            "Agreement for sports activities, coaching, and athletic services.",
          aliases: [
            "athletic agreement",
            "coaching contract",
            "sports contract",
          ],
        },
        es: {
          name: "Acuerdo Deportivo",
          description:
            "Acuerdo para actividades deportivas, entrenamiento y servicios atléticos.",
          aliases: [
            "acuerdo atlético",
            "contrato de entrenamiento",
            "contrato deportivo",
          ],
        },
      },
    },
  },
  {
    id: "startup-equity-agreement",
    importPath: "./us/startup-equity-agreement",
    meta: {
      id: "startup-equity-agreement",
      title: "Startup Equity Agreement",
      description:
        "Agreement for equity distribution and vesting in startup companies.",
      category: "Business & Commercial",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "equity split agreement",
        "founder agreement",
        "equity vesting agreement",
        "acuerdo de fundadores",
        "contrato de participación",
        "acuerdo de adjudicación de capital",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Startup Equity Agreement",
          description:
            "Agreement for equity distribution and vesting in startup companies.",
          aliases: [
            "equity split agreement",
            "founder agreement",
            "equity vesting agreement",
          ],
        },
        es: {
          name: "Acuerdo de Participación en Startup",
          description:
            "Acuerdo para distribución de participaciones en empresas emergentes.",
          aliases: [
            "acuerdo de fundadores",
            "contrato de participación",
            "acuerdo de adjudicación de capital",
          ],
        },
      },
    },
  },
  {
    id: "statement-of-account",
    importPath: "./us/statement-of-account",
    meta: {
      id: "statement-of-account",
      title: "Statement of Account",
      description:
        "Generate detailed account statements showing transactions, balances, and payment information.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "account statement",
        "billing statement",
        "financial statement",
        "account summary",
        "estado de cuenta",
        "estado de facturación",
        "estado financiero",
        "resumen de cuenta",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Statement of Account",
          description:
            "Generate detailed account statements showing transactions, balances, and payment information.",
          aliases: [
            "account statement",
            "billing statement",
            "financial statement",
            "account summary",
          ],
        },
        es: {
          name: "Estado de Cuenta",
          description:
            "Generar estados de cuenta detallados mostrando transacciones, saldos e información de pagos.",
          aliases: [
            "estado de cuenta",
            "estado de facturación",
            "estado financiero",
            "resumen de cuenta",
          ],
        },
      },
    },
  },
  {
    id: "statement-of-work",
    importPath: "./us/statement-of-work",
    meta: {
      id: "statement-of-work",
      title: "Statement of Work (SOW)",
      description:
        "Create a detailed SOW defining project scope, deliverables, and timeline.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "SOW",
        "statement of work",
        "project scope",
        "work order",
        "declaración de trabajo",
        "alcance del proyecto",
        "orden de trabajo",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Statement of Work (SOW)",
          description:
            "Create a detailed SOW defining project scope, deliverables, and timeline.",
          aliases: ["SOW", "statement of work", "project scope", "work order"],
        },
        es: {
          name: "Declaración de Trabajo (SOW)",
          description:
            "Crea un SOW detallado que defina el alcance del proyecto, entregables y cronograma.",
          aliases: [
            "SOW",
            "declaración de trabajo",
            "alcance del proyecto",
            "orden de trabajo",
          ],
        },
      },
    },
  },
  {
    id: "stock-purchase-agreement",
    importPath: "./us/stock-purchase-agreement",
    meta: {
      id: "stock-purchase-agreement",
      title: "Stock Purchase Agreement",
      description:
        "Agreement for the purchase and sale of company stock between parties.",
      category: "Corporate",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "Share purchase agreement",
        "Equity purchase agreement",
        "Stock sale agreement",
        "Acuerdo compra acciones",
        "Acuerdo venta acciones",
        "Compraventa acciones",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Stock Purchase Agreement",
          description:
            "Agreement for the purchase and sale of company stock between parties.",
          aliases: [
            "Share purchase agreement",
            "Equity purchase agreement",
            "Stock sale agreement",
          ],
        },
        es: {
          name: "Acuerdo de Compra de Acciones",
          description:
            "Acuerdo para la compra y venta de acciones de la empresa entre las partes.",
          aliases: [
            "Acuerdo compra acciones",
            "Acuerdo venta acciones",
            "Compraventa acciones",
          ],
        },
      },
    },
  },
  {
    id: "storage-space-lease-agreement",
    importPath: "./us/storage-space-lease-agreement",
    meta: {
      id: "storage-space-lease-agreement",
      title: "Storage Space Lease Agreement",
      description:
        "Lease agreement for storage units and self-storage facilities",
      category: "Real Estate & Property",
      jurisdiction: "us",
      tags: [],
      aliases: [],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Storage Space Lease Agreement",
          description:
            "Lease agreement for storage units and self-storage facilities",
          aliases: [],
        },
        es: {
          name: "Contrato de arrendamiento de espacio de almacenamiento",
          description:
            "Contrato de arrendamiento para unidades de almacenamiento y bodegas de auto-servicio.",
          aliases: [],
        },
      },
    },
  },
  {
    id: "student-loan-agreement",
    importPath: "./us/student-loan-agreement",
    meta: {
      id: "student-loan-agreement",
      title: "Student Loan Agreement",
      description:
        "Agreement for educational loan financing and repayment terms.",
      category: "Finance & Lending",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "education loan agreement",
        "private student loan",
        "educational financing agreement",
        "préstamo educativo",
        "financiamiento estudiantil",
        "acuerdo de financiamiento educativo",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Student Loan Agreement",
          description:
            "Agreement for educational loan financing and repayment terms.",
          aliases: [
            "education loan agreement",
            "private student loan",
            "educational financing agreement",
          ],
        },
        es: {
          name: "Acuerdo de Préstamo Estudiantil",
          description:
            "Acuerdo para financiamiento educativo y términos de reembolso.",
          aliases: [
            "préstamo educativo",
            "financiamiento estudiantil",
            "acuerdo de financiamiento educativo",
          ],
        },
      },
    },
  },
  {
    id: "subcontractor-agreement",
    importPath: "./us/subcontractor-agreement",
    meta: {
      id: "subcontractor-agreement",
      title: "Subcontractor Agreement",
      description:
        "Complete construction projects efficiently with specialized expertise. Control costs by defining specific work scope.",
      category: "Construction",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "subcontract agreement",
        "trade contractor agreement",
        "specialty contractor agreement",
        "acuerdo de subcontrato",
        "contrato de contratista especializado",
        "acuerdo de contratista de especialidad",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Subcontractor Agreement",
          description:
            "Complete construction projects efficiently with specialized expertise. Control costs by defining specific work scope.",
          aliases: [
            "subcontract agreement",
            "trade contractor agreement",
            "specialty contractor agreement",
          ],
        },
        es: {
          name: "Acuerdo de Subcontratista",
          description:
            "Contrata especialistas (electricistas, plomeros, etc.) para partes de un proyecto de construcción. Define trabajo, cronograma y pagos.",
          aliases: [
            "acuerdo de subcontrato",
            "contrato de contratista especializado",
            "acuerdo de contratista de especialidad",
          ],
        },
      },
    },
  },
  {
    id: "sublease-agreement",
    importPath: "./us/sublease-agreement",
    meta: {
      id: "sublease-agreement",
      title: "Sublease Agreement",
      description:
        "Reduce housing costs or generate income through subleasing arrangements. Navigate complex rental situations legally.",
      category: "Real Estate",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "sublet agreement",
        "subletting contract",
        "sublet lease",
        "sublease contract",
        "contrato de subarriendo",
        "subarriendo",
        "subarrendamiento",
        "contrato de subarrendamiento",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Sublease Agreement",
          description:
            "Reduce housing costs or generate income through subleasing arrangements. Navigate complex rental situations legally.",
          aliases: [
            "sublet agreement",
            "subletting contract",
            "sublet lease",
            "sublease contract",
          ],
        },
        es: {
          name: "Acuerdo de Subarriendo",
          description:
            "Renta tu apartamento a otra persona mientras sigues siendo responsable del contrato original. Útil cuando te mudas temporalmente.",
          aliases: [
            "contrato de subarriendo",
            "subarriendo",
            "subarrendamiento",
            "contrato de subarrendamiento",
          ],
        },
      },
    },
  },
  {
    id: "talent-agreement",
    importPath: "./us/talent-agreement",
    meta: {
      id: "talent-agreement",
      title: "Talent Agreement",
      description:
        "Agreement for talent representation and entertainment industry services.",
      category: "Entertainment & Media",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "artist agreement",
        "performer contract",
        "entertainment agreement",
        "acuerdo de artista",
        "contrato de intérprete",
        "acuerdo de entretenimiento",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Talent Agreement",
          description:
            "Agreement for talent representation and entertainment industry services.",
          aliases: [
            "artist agreement",
            "performer contract",
            "entertainment agreement",
          ],
        },
        es: {
          name: "Acuerdo de Talento",
          description:
            "Acuerdo para representación de talento y servicios de la industria del entretenimiento.",
          aliases: [
            "acuerdo de artista",
            "contrato de intérprete",
            "acuerdo de entretenimiento",
          ],
        },
      },
    },
  },
  {
    id: "talent-management-agreement",
    importPath: "./us/talent-management-agreement",
    meta: {
      id: "talent-management-agreement",
      title: "Talent Management Agreement",
      description:
        "Agreement between talent and management for career representation.",
      category: "Entertainment & Media",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "artist management contract",
        "celebrity management agreement",
        "performer management deal",
        "contrato de management",
        "acuerdo de representación",
        "acuerdo de gestión de intérpretes",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Talent Management Agreement",
          description:
            "Agreement between talent and management for career representation.",
          aliases: [
            "artist management contract",
            "celebrity management agreement",
            "performer management deal",
          ],
        },
        es: {
          name: "Acuerdo de Representación de Talento",
          description:
            "Acuerdo entre talento y representación para gestión de carrera.",
          aliases: [
            "contrato de management",
            "acuerdo de representación",
            "acuerdo de gestión de intérpretes",
          ],
        },
      },
    },
  },
  {
    id: "tax-preparation-agreement",
    importPath: "./us/tax-preparation-agreement",
    meta: {
      id: "tax-preparation-agreement",
      title: "Tax Preparation Agreement",
      description:
        "Professional agreement for tax preparation and filing services between preparer and client.",
      category: "Professional Services",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "tax service agreement",
        "tax preparer contract",
        "tax filing agreement",
        "acuerdo de servicios fiscales",
        "contrato de preparador de impuestos",
        "acuerdo de presentación de impuestos",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Tax Preparation Agreement",
          description:
            "Professional agreement for tax preparation and filing services between preparer and client.",
          aliases: [
            "tax service agreement",
            "tax preparer contract",
            "tax filing agreement",
          ],
        },
        es: {
          name: "Acuerdo de Preparación de Impuestos",
          description:
            "Acuerdo profesional para servicios de preparación y presentación de impuestos entre preparador y cliente.",
          aliases: [
            "acuerdo de servicios fiscales",
            "contrato de preparador de impuestos",
            "acuerdo de presentación de impuestos",
          ],
        },
      },
    },
  },
  {
    id: "telecommuting-agreement",
    importPath: "./us/telecommuting-agreement",
    meta: {
      id: "telecommuting-agreement",
      title: "Telecommuting Agreement",
      description:
        "Establish terms and conditions for remote work arrangements between employer and employee.",
      category: "Employment",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "remote work agreement",
        "telework policy",
        "work from home contract",
        "acuerdo de trabajo remoto",
        "política de teletrabajo",
        "contrato de trabajo desde casa",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Telecommuting Agreement",
          description:
            "Establish terms and conditions for remote work arrangements between employer and employee.",
          aliases: [
            "remote work agreement",
            "telework policy",
            "work from home contract",
          ],
        },
        es: {
          name: "Acuerdo de Teletrabajo",
          description:
            "Establecer términos y condiciones para acuerdos de trabajo remoto entre empleador y empleado.",
          aliases: [
            "acuerdo de trabajo remoto",
            "política de teletrabajo",
            "contrato de trabajo desde casa",
          ],
        },
      },
    },
  },
  {
    id: "telemedicine-agreement",
    importPath: "./us/telemedicine-agreement",
    meta: {
      id: "telemedicine-agreement",
      title: "Telemedicine Agreement",
      description: "Agreement for telehealth and remote medical services.",
      category: "Healthcare & Medical",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "telehealth agreement",
        "virtual care agreement",
        "remote medical consultation",
        "acuerdo de telesalud",
        "consulta médica virtual",
        "consulta médica remota",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Telemedicine Agreement",
          description: "Agreement for telehealth and remote medical services.",
          aliases: [
            "telehealth agreement",
            "virtual care agreement",
            "remote medical consultation",
          ],
        },
        es: {
          name: "Acuerdo de Telemedicina",
          description: "Acuerdo para servicios de telesalud y medicina remota.",
          aliases: [
            "acuerdo de telesalud",
            "consulta médica virtual",
            "consulta médica remota",
          ],
        },
      },
    },
  },
  {
    id: "tenant-maintenance-request",
    importPath: "./us/tenant-maintenance-request",
    meta: {
      id: "tenant-maintenance-request",
      title: "Tenant Maintenance Request",
      description:
        "Submit a formal maintenance or repair request to your landlord with our comprehensive form template.",
      category: "Property Management",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "repair request",
        "maintenance form",
        "tenant repair request",
        "property maintenance request",
        "solicitud de reparación",
        "formulario de mantenimiento",
        "solicitud de reparación del inquilino",
        "solicitud de mantenimiento de la propiedad",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Tenant Maintenance Request",
          description:
            "Submit a formal maintenance or repair request to your landlord with our comprehensive form template.",
          aliases: [
            "repair request",
            "maintenance form",
            "tenant repair request",
            "property maintenance request",
          ],
        },
        es: {
          name: "Solicitud de Mantenimiento del Inquilino",
          description:
            "Presenta una solicitud formal de mantenimiento o reparación a tu arrendador con nuestra plantilla de formulario completa.",
          aliases: [
            "solicitud de reparación",
            "formulario de mantenimiento",
            "solicitud de reparación del inquilino",
            "solicitud de mantenimiento de la propiedad",
          ],
        },
      },
    },
  },
  {
    id: "term-sheet",
    importPath: "./us/term-sheet",
    meta: {
      id: "term-sheet",
      title: "Investment Term Sheet",
      description:
        "Non-binding agreement outlining key terms and conditions for investment funding rounds.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "Term sheet",
        "Investment term sheet",
        "Funding term sheet",
        "Hoja de términos",
        "Términos de inversión",
        "Términos de financiación",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Investment Term Sheet",
          description:
            "Non-binding agreement outlining key terms and conditions for investment funding rounds.",
          aliases: [
            "Term sheet",
            "Investment term sheet",
            "Funding term sheet",
          ],
        },
        es: {
          name: "Hoja de Términos de Inversión",
          description:
            "Acuerdo no vinculante que describe los términos y condiciones clave para rondas de financiación de inversión.",
          aliases: [
            "Hoja de términos",
            "Términos de inversión",
            "Términos de financiación",
          ],
        },
      },
    },
  },
  {
    id: "termination-letter",
    importPath: "./us/termination-letter",
    meta: {
      id: "termination-letter",
      title: "Employee Termination Letter",
      description:
        "Create a professional employment termination letter with our easy-to-use template. State-specific requirements included.",
      category: "Employment",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "termination notice",
        "employment termination",
        "firing letter",
        "dismissal letter",
        "aviso de terminación",
        "carta de despido",
        "terminación laboral",
        "carta de despido legal",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Employee Termination Letter",
          description:
            "Create a professional employment termination letter with our easy-to-use template. State-specific requirements included.",
          aliases: [
            "termination notice",
            "employment termination",
            "firing letter",
            "dismissal letter",
          ],
        },
        es: {
          name: "Carta de Despido de Empleado",
          description:
            "Crea una carta de terminación de empleo profesional con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.",
          aliases: [
            "aviso de terminación",
            "carta de despido",
            "terminación laboral",
            "carta de despido legal",
          ],
        },
      },
    },
  },
  {
    id: "timber-sale-agreement",
    importPath: "./us/timber-sale-agreement",
    meta: {
      id: "timber-sale-agreement",
      title: "Timber Sale Agreement",
      description:
        "Agreement for the sale and harvesting of timber from forestland.",
      category: "Real Estate & Property",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "logging agreement",
        "forest harvesting contract",
        "tree cutting agreement",
        "acuerdo de tala",
        "contrato de cosecha forestal",
        "acuerdo de corte de árboles",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Timber Sale Agreement",
          description:
            "Agreement for the sale and harvesting of timber from forestland.",
          aliases: [
            "logging agreement",
            "forest harvesting contract",
            "tree cutting agreement",
          ],
        },
        es: {
          name: "Acuerdo de Venta de Madera",
          description:
            "Acuerdo para la venta y cosecha de madera de tierras forestales.",
          aliases: [
            "acuerdo de tala",
            "contrato de cosecha forestal",
            "acuerdo de corte de árboles",
          ],
        },
      },
    },
  },
  {
    id: "trademark-application-worksheet",
    importPath: "./us/trademark-application-worksheet",
    meta: {
      id: "trademark-application-worksheet",
      title: "Trademark Application Worksheet",
      description:
        "Comprehensive preparation document for USPTO trademark application filing.",
      category: "Intellectual Property",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "trademark prep",
        "trademark application prep",
        "uspto worksheet",
        "trademark filing prep",
        "prep de marca",
        "preparación solicitud marca",
        "hoja trabajo uspto",
        "prep presentación marca",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Trademark Application Worksheet",
          description:
            "Comprehensive preparation document for USPTO trademark application filing.",
          aliases: [
            "trademark prep",
            "trademark application prep",
            "uspto worksheet",
            "trademark filing prep",
          ],
        },
        es: {
          name: "Hoja de Trabajo para Solicitud de Marca Registrada",
          description:
            "Documento integral de preparación para la presentación de solicitud de marca registrada USPTO.",
          aliases: [
            "prep de marca",
            "preparación solicitud marca",
            "hoja trabajo uspto",
            "prep presentación marca",
          ],
        },
      },
    },
  },
  {
    id: "trademark-assignment",
    importPath: "./us/trademark-assignment",
    meta: {
      id: "trademark-assignment",
      title: "Trademark Assignment Agreement",
      description:
        "Create a legally binding Trademark Assignment Agreement with our easy-to-use template. State-specific requirements included.",
      category: "Intellectual Property",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "trademark assignment contract",
        "trademark transfer",
        "brand assignment",
        "contrato de asignación de marca",
        "transferencia de marca registrada",
        "asignación de marca",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Trademark Assignment Agreement",
          description:
            "Create a legally binding Trademark Assignment Agreement with our easy-to-use template. State-specific requirements included.",
          aliases: [
            "trademark assignment contract",
            "trademark transfer",
            "brand assignment",
          ],
        },
        es: {
          name: "Acuerdo de Asignación de Marca Registrada",
          description:
            "Crea un Acuerdo de Asignación de Marca Registrada legalmente válido con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.",
          aliases: [
            "contrato de asignación de marca",
            "transferencia de marca registrada",
            "asignación de marca",
          ],
        },
      },
    },
  },
  {
    id: "trademark-license-agreement",
    importPath: "./us/trademark-license-agreement",
    meta: {
      id: "trademark-license-agreement",
      title: "Trademark License Agreement",
      description:
        "Agreement granting rights to use trademark and brand names with quality control provisions.",
      category: "Intellectual Property",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "brand licensing agreement",
        "trademark usage agreement",
        "licensing contract",
        "acuerdo de licencia de marca",
        "contrato de licencia",
        "contrato de licencia legal",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Trademark License Agreement",
          description:
            "Agreement granting rights to use trademark and brand names with quality control provisions.",
          aliases: [
            "brand licensing agreement",
            "trademark usage agreement",
            "licensing contract",
          ],
        },
        es: {
          name: "Acuerdo de Licencia de Marca Registrada",
          description:
            "Acuerdo que otorga derechos para usar marcas registradas y nombres comerciales con control de calidad.",
          aliases: [
            "acuerdo de licencia de marca",
            "contrato de licencia",
            "contrato de licencia legal",
          ],
        },
      },
    },
  },
  {
    id: "transportation-service-agreement",
    importPath: "./us/transportation-service-agreement",
    meta: {
      id: "transportation-service-agreement",
      title: "Transportation Service Agreement",
      description:
        "Agreement for transportation and delivery services between provider and client.",
      category: "Transportation & Automotive",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "delivery service agreement",
        "transport contract",
        "logistics service agreement",
        "acuerdo de servicio de entrega",
        "contrato de transporte",
        "acuerdo de servicio logístico",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Transportation Service Agreement",
          description:
            "Agreement for transportation and delivery services between provider and client.",
          aliases: [
            "delivery service agreement",
            "transport contract",
            "logistics service agreement",
          ],
        },
        es: {
          name: "Acuerdo de Servicio de Transporte",
          description:
            "Acuerdo para servicios de transporte y entrega entre proveedor y cliente.",
          aliases: [
            "acuerdo de servicio de entrega",
            "contrato de transporte",
            "acuerdo de servicio logístico",
          ],
        },
      },
    },
  },
  {
    id: "travel-insurance-agreement",
    importPath: "./us/travel-insurance-agreement",
    meta: {
      id: "travel-insurance-agreement",
      title: "Travel Insurance Agreement",
      description: "Agreement for travel insurance coverage and terms.",
      category: "Travel & Transportation",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "travel insurance policy",
        "trip insurance",
        "póliza de seguro de viaje",
        "seguro de viaje",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Travel Insurance Agreement",
          description: "Agreement for travel insurance coverage and terms.",
          aliases: ["travel insurance policy", "trip insurance"],
        },
        es: {
          name: "Acuerdo de Seguro de Viaje",
          description: "Acuerdo para cobertura y términos de seguro de viaje.",
          aliases: ["póliza de seguro de viaje", "seguro de viaje"],
        },
      },
    },
  },
  {
    id: "triple-net-lease",
    importPath: "./us/triple-net-lease",
    meta: {
      id: "triple-net-lease",
      title: "Triple Net Lease",
      description: "Commercial lease where tenant pays all property expenses",
      category: "Business & Commercial",
      jurisdiction: "us",
      tags: [],
      aliases: [],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Triple Net Lease",
          description:
            "Commercial lease where tenant pays all property expenses",
          aliases: [],
        },
        es: {
          name: "Contrato de arrendamiento triple neto",
          description:
            "Contrato de arrendamiento comercial en el que el inquilino paga todos los gastos de la propiedad.",
          aliases: [],
        },
      },
    },
  },
  {
    id: "tuition-agreement",
    importPath: "./us/tuition-agreement",
    meta: {
      id: "tuition-agreement",
      title: "Tuition Agreement",
      description: "Agreement for educational tuition and payment terms.",
      category: "Academic & Research",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "tuition contract",
        "education payment agreement",
        "contrato de matrícula",
        "acuerdo de pago educativo",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Tuition Agreement",
          description: "Agreement for educational tuition and payment terms.",
          aliases: ["tuition contract", "education payment agreement"],
        },
        es: {
          name: "Acuerdo de Matrícula",
          description: "Acuerdo para matrícula educativa y términos de pago.",
          aliases: ["contrato de matrícula", "acuerdo de pago educativo"],
        },
      },
    },
  },
  {
    id: "tutoring-agreement",
    importPath: "./us/tutoring-agreement",
    meta: {
      id: "tutoring-agreement",
      title: "Tutoring Agreement",
      description: "Agreement for private tutoring and educational services.",
      category: "Academic & Research",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "private tutoring",
        "academic tutoring",
        "tutor contract",
        "tutoría privada",
        "tutoría académica",
        "contrato de tutor",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Tutoring Agreement",
          description:
            "Agreement for private tutoring and educational services.",
          aliases: ["private tutoring", "academic tutoring", "tutor contract"],
        },
        es: {
          name: "Acuerdo de Tutoría",
          description: "Acuerdo para tutoría privada y servicios educativos.",
          aliases: [
            "tutoría privada",
            "tutoría académica",
            "contrato de tutor",
          ],
        },
      },
    },
  },
  {
    id: "two-weeks-notice-letter",
    importPath: "./us/two-weeks-notice-letter",
    meta: {
      id: "two-weeks-notice-letter",
      title: "Two Weeks Notice Letter",
      description: "Standard two weeks notice resignation letter",
      category: "Employment",
      jurisdiction: "us",
      tags: [],
      aliases: [],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Two Weeks Notice Letter",
          description: "Standard two weeks notice resignation letter",
          aliases: [],
        },
        es: {
          name: "Two Weeks Notice Letter",
          description: "Standard two weeks notice resignation letter",
          aliases: [],
        },
      },
    },
  },
  {
    id: "vacation-rental-agreement",
    importPath: "./us/vacation-rental-agreement",
    meta: {
      id: "vacation-rental-agreement",
      title: "Vacation Rental Agreement",
      description: "Agreement for short-term vacation property rentals.",
      category: "Travel & Transportation",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "short-term rental",
        "vacation home rental",
        "holiday rental",
        "alquiler de vacaciones",
        "alquiler de casa vacacional",
        "alquiler de vacaciones legal",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Vacation Rental Agreement",
          description: "Agreement for short-term vacation property rentals.",
          aliases: [
            "short-term rental",
            "vacation home rental",
            "holiday rental",
          ],
        },
        es: {
          name: "Acuerdo de Alquiler Vacacional",
          description:
            "Acuerdo para alquileres de propiedades vacacionales a corto plazo.",
          aliases: [
            "alquiler de vacaciones",
            "alquiler de casa vacacional",
            "alquiler de vacaciones legal",
          ],
        },
      },
    },
  },
  {
    id: "vehicle-bill-of-sale",
    importPath: "./us/vehicle-bill-of-sale",
    meta: {
      id: "vehicle-bill-of-sale",
      title: "Vehicle Bill of Sale",
      description:
        "Document the sale and transfer of ownership for a vehicle, compliant with state requirements.",
      category: "Finance",
      jurisdiction: "us",
      tags: [
        "car",
        "cars",
        "vehicle",
        "vehicles",
        "auto",
        "autos",
        "automobile",
        "automobiles",
        "motor vehicle",
        "sedan",
        "coupe",
        "suv",
        "truck",
        "pickup",
        "van",
        "minivan",
        "hatchback",
        "convertible",
        "crossover",
        "buy",
        "buying",
        "purchase",
        "purchasing",
        "sell",
        "selling",
        "sale",
        "transfer",
        "ownership",
        "title",
        "used",
        "new",
        "pre-owned",
        "certified",
        "rebuilt",
        "salvage",
        "lemon",
        "buying a car",
        "selling a car",
        "buying a used car",
        "selling my car",
        "car sale",
        "auto sale",
        "vehicle purchase",
        "vehicle transfer",
        "car ownership",
        "auto ownership",
        "title transfer",
        "bill of sale",
        "sales contract",
        "purchase agreement",
        "transfer document",
        "proof of sale",
        "as-is sale",
        "warranty",
        "lien",
        "lienholder",
        "financing",
        "trade-in",
        "dmv",
        "registration",
        "pink slip",
        "certificate of title",
        "odometer",
        "mileage",
        "vin",
        "private party",
        "dealer",
        "trade",
        "gift",
        "inheritance",
        "family transfer",
        "carro",
        "carros",
        "coche",
        "coches",
        "vehículo",
        "vehículos",
        "automóvil",
        "automóviles",
        "sedán",
        "cupé",
        "camioneta",
        "furgoneta",
        "comprar",
        "comprando",
        "compra",
        "vender",
        "vendiendo",
        "venta",
        "transferir",
        "propiedad",
        "título",
        "usado",
        "nueva",
        "nuevo",
        "seminuevo",
        "certificado",
        "reconstruido",
        "siniestrado",
        "comprando un carro",
        "vendiendo un carro",
        "comprando un auto usado",
        "vendiendo mi carro",
        "venta de carro",
        "venta de auto",
        "compra de vehículo",
        "transferencia de vehículo",
        "propiedad de carro",
        "transferencia de título",
        "contrato de compraventa",
        "contrato de venta",
        "acuerdo de compra",
        "documento de transferencia",
        "prueba de venta",
        "venta como está",
        "garantía",
        "gravamen",
        "financiamiento",
        "intercambio",
        "registro",
        "certificado de título",
        "odómetro",
        "millaje",
        "número de serie",
        "particular",
        "concesionario",
        "comercio",
        "regalo",
        "herencia",
        "transferencia familiar",
      ],
      aliases: [
        "sell car",
        "used item sale",
        "vehicle transfer",
        "car sale contract",
        "venta de coche",
        "venta de artículo usado",
        "transferencia de vehículo",
        "contrato de venta de auto",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Vehicle Bill of Sale",
          description:
            "Document the sale and transfer of ownership for a vehicle, compliant with state requirements.",
          aliases: [
            "sell car",
            "used item sale",
            "vehicle transfer",
            "car sale contract",
          ],
        },
        es: {
          name: "Contrato de Compraventa de Vehículo",
          description:
            "Documentar la venta y transferencia de propiedad de un vehículo, conforme a los requisitos estatales.",
          aliases: [
            "venta de coche",
            "venta de artículo usado",
            "transferencia de vehículo",
            "contrato de venta de auto",
          ],
        },
      },
    },
  },
  {
    id: "vehicle-lease-agreement",
    importPath: "./us/vehicle-lease-agreement",
    meta: {
      id: "vehicle-lease-agreement",
      title: "Vehicle Lease Agreement",
      description: "Agreement for leasing vehicles between lessor and lessee.",
      category: "Transportation & Automotive",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "car lease agreement",
        "auto lease contract",
        "vehicle rental agreement",
        "contrato de arrendamiento de auto",
        "acuerdo de alquiler de vehículo",
        "acuerdo de alquiler de vehículos",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Vehicle Lease Agreement",
          description:
            "Agreement for leasing vehicles between lessor and lessee.",
          aliases: [
            "car lease agreement",
            "auto lease contract",
            "vehicle rental agreement",
          ],
        },
        es: {
          name: "Acuerdo de Arrendamiento de Vehículo",
          description:
            "Acuerdo para arrendamiento de vehículos entre arrendador y arrendatario.",
          aliases: [
            "contrato de arrendamiento de auto",
            "acuerdo de alquiler de vehículo",
            "acuerdo de alquiler de vehículos",
          ],
        },
      },
    },
  },
  {
    id: "vendor-agreement",
    importPath: "./us/vendor-agreement",
    meta: {
      id: "vendor-agreement",
      title: "Vendor Agreement",
      description:
        "Agreement between a company and vendor for the supply of goods or services.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "Supplier agreement",
        "Vendor contract",
        "Supply agreement",
        "Acuerdo proveedor",
        "Contrato proveedor",
        "Acuerdo suministro",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Vendor Agreement",
          description:
            "Agreement between a company and vendor for the supply of goods or services.",
          aliases: [
            "Supplier agreement",
            "Vendor contract",
            "Supply agreement",
          ],
        },
        es: {
          name: "Acuerdo de Proveedor",
          description:
            "Acuerdo entre una empresa y proveedor para el suministro de bienes o servicios.",
          aliases: [
            "Acuerdo proveedor",
            "Contrato proveedor",
            "Acuerdo suministro",
          ],
        },
      },
    },
  },
  {
    id: "video-release",
    importPath: "./us/video-release",
    meta: {
      id: "video-release",
      title: "Video Release",
      description: "Professional video release document.",
      category: "Legal",
      jurisdiction: "us",
      tags: [],
      aliases: ["video release"],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Video Release",
          description: "Professional video release document.",
          aliases: ["video release"],
        },
        es: {
          name: "Video Release en Español",
          description: "Documento profesional de video release.",
          aliases: ["video release"],
        },
      },
    },
  },
  {
    id: "volunteer-agreement",
    importPath: "./us/volunteer-agreement",
    meta: {
      id: "volunteer-agreement",
      title: "Volunteer Agreement",
      description:
        "Agreement between organization and volunteer for volunteer services and activities.",
      category: "Employment & HR",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "volunteer contract",
        "volunteer service agreement",
        "community service agreement",
        "contrato de voluntario",
        "acuerdo de servicio voluntario",
        "acuerdo de servicio comunitario",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Volunteer Agreement",
          description:
            "Agreement between organization and volunteer for volunteer services and activities.",
          aliases: [
            "volunteer contract",
            "volunteer service agreement",
            "community service agreement",
          ],
        },
        es: {
          name: "Acuerdo de Voluntariado",
          description:
            "Acuerdo entre organización y voluntario para servicios y actividades de voluntariado.",
          aliases: [
            "contrato de voluntario",
            "acuerdo de servicio voluntario",
            "acuerdo de servicio comunitario",
          ],
        },
      },
    },
  },
  {
    id: "warehouse-agreement",
    importPath: "./us/warehouse-agreement",
    meta: {
      id: "warehouse-agreement",
      title: "Warehouse Agreement",
      description: "Agreement for warehouse storage and logistics services.",
      category: "Transportation & Automotive",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "storage agreement",
        "fulfillment agreement",
        "logistics contract",
        "contrato de almacenamiento",
        "acuerdo logístico",
        "contrato de logística",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Warehouse Agreement",
          description:
            "Agreement for warehouse storage and logistics services.",
          aliases: [
            "storage agreement",
            "fulfillment agreement",
            "logistics contract",
          ],
        },
        es: {
          name: "Acuerdo de Almacén",
          description: "Acuerdo para servicios de almacenamiento y logística.",
          aliases: [
            "contrato de almacenamiento",
            "acuerdo logístico",
            "contrato de logística",
          ],
        },
      },
    },
  },
  {
    id: "warehouse-lease",
    importPath: "./us/warehouse-lease",
    meta: {
      id: "warehouse-lease",
      title: "Warehouse Lease",
      description:
        "Industrial lease agreement for warehouse and storage facilities",
      category: "Business & Commercial",
      jurisdiction: "us",
      tags: [],
      aliases: [],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Warehouse Lease",
          description:
            "Industrial lease agreement for warehouse and storage facilities",
          aliases: [],
        },
        es: {
          name: "Contrato de arrendamiento de almacén",
          description:
            "Contrato de arrendamiento industrial para almacenes y centros de almacenamiento.",
          aliases: [],
        },
      },
    },
  },
  {
    id: "warranty-deed",
    importPath: "./us/warranty-deed",
    meta: {
      id: "warranty-deed",
      title: "Warranty Deed",
      description: "Property transfer deed with full warranties and guarantees",
      category: "Real Estate & Property",
      jurisdiction: "us",
      tags: [],
      aliases: [],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Warranty Deed",
          description:
            "Property transfer deed with full warranties and guarantees",
          aliases: [],
        },
        es: {
          name: "Escritura con garantía general",
          description:
            "Escritura de transferencia de propiedad con garantías y avales completos.",
          aliases: [],
        },
      },
    },
  },
  {
    id: "water-rights-agreement",
    importPath: "./us/water-rights-agreement",
    meta: {
      id: "water-rights-agreement",
      title: "Water Rights Agreement",
      description: "Agreement for the transfer, lease, or use of water rights.",
      category: "Real Estate & Property",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "water transfer agreement",
        "irrigation rights",
        "water usage agreement",
        "acuerdo de transferencia de agua",
        "derechos de riego",
        "acuerdo de uso de agua",
      ],
      requiresNotary: true,
      states: ["all"],
      translations: {
        en: {
          name: "Water Rights Agreement",
          description:
            "Agreement for the transfer, lease, or use of water rights.",
          aliases: [
            "water transfer agreement",
            "irrigation rights",
            "water usage agreement",
          ],
        },
        es: {
          name: "Acuerdo de Derechos de Agua",
          description:
            "Acuerdo para la transferencia, arrendamiento o uso de derechos de agua.",
          aliases: [
            "acuerdo de transferencia de agua",
            "derechos de riego",
            "acuerdo de uso de agua",
          ],
        },
      },
    },
  },
  {
    id: "web-development-agreement",
    importPath: "./us/web-development-agreement",
    meta: {
      id: "web-development-agreement",
      title: "Web Development Agreement",
      description:
        "Professional agreement for web development services between developer and client.",
      category: "Business",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "Website development contract",
        "Web design agreement",
        "Software development agreement",
        "Contrato desarrollo web",
        "Acuerdo diseño web",
        "Contrato desarrollo software",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Web Development Agreement",
          description:
            "Professional agreement for web development services between developer and client.",
          aliases: [
            "Website development contract",
            "Web design agreement",
            "Software development agreement",
          ],
        },
        es: {
          name: "Acuerdo de Desarrollo Web",
          description:
            "Acuerdo profesional para servicios de desarrollo web entre desarrollador y cliente.",
          aliases: [
            "Contrato desarrollo web",
            "Acuerdo diseño web",
            "Contrato desarrollo software",
          ],
        },
      },
    },
  },
  {
    id: "website-development-agreement",
    importPath: "./us/website-development-agreement",
    meta: {
      id: "website-development-agreement",
      title: "Website Development Agreement",
      description:
        "Comprehensive agreement for website design and development services between developer and client.",
      category: "Professional Services",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "web development contract",
        "website design agreement",
        "web services contract",
        "contrato de desarrollo web",
        "acuerdo de diseño web",
        "contrato de servicios web",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Website Development Agreement",
          description:
            "Comprehensive agreement for website design and development services between developer and client.",
          aliases: [
            "web development contract",
            "website design agreement",
            "web services contract",
          ],
        },
        es: {
          name: "Acuerdo de Desarrollo de Sitio Web",
          description:
            "Acuerdo integral para servicios de diseño y desarrollo de sitios web entre desarrollador y cliente.",
          aliases: [
            "contrato de desarrollo web",
            "acuerdo de diseño web",
            "contrato de servicios web",
          ],
        },
      },
    },
  },
  {
    id: "work-from-home-agreement",
    importPath: "./us/work-from-home-agreement",
    meta: {
      id: "work-from-home-agreement",
      title: "Work from Home Agreement",
      description:
        "Comprehensive agreement establishing terms and conditions for remote work arrangements.",
      category: "Employment",
      jurisdiction: "us",
      tags: [],
      aliases: [
        "remote work agreement",
        "telecommuting agreement",
        "home office agreement",
        "acuerdo de trabajo remoto",
        "acuerdo de teletrabajo",
        "acuerdo de la oficina en el hogar",
      ],
      requiresNotary: false,
      states: ["all"],
      translations: {
        en: {
          name: "Work from Home Agreement",
          description:
            "Comprehensive agreement establishing terms and conditions for remote work arrangements.",
          aliases: [
            "remote work agreement",
            "telecommuting agreement",
            "home office agreement",
          ],
        },
        es: {
          name: "Acuerdo de Trabajo desde Casa",
          description:
            "Acuerdo integral que establece términos y condiciones para arreglos de trabajo remoto.",
          aliases: [
            "acuerdo de trabajo remoto",
            "acuerdo de teletrabajo",
            "acuerdo de la oficina en el hogar",
          ],
        },
      },
    },
  },
];

export const DOCUMENT_IMPORTS: Record<string, () => Promise<any>> = {
  "ach-authorization-form": () => import("./us/ach-authorization-form"),
  "advance-directive": () => import("./us/advance-directive"),
  "advance-directive-revocation": () =>
    import("./us/advance-directive-revocation"),
  affidavit: () => import("./us/affidavit"),
  "affidavit-general": () => import("./us/affidavit-general"),
  "affidavit-of-death": () => import("./us/affidavit-of-death"),
  "affidavit-of-heirship": () => import("./us/affidavit-of-heirship"),
  "affidavit-of-identity": () => import("./us/affidavit-of-identity"),
  "affidavit-of-survivorship": () => import("./us/affidavit-of-survivorship"),
  "affiliate-marketing-agreement": () =>
    import("./us/affiliate-marketing-agreement"),
  "agricultural-agreement": () => import("./us/agricultural-agreement"),
  "app-development-agreement": () => import("./us/app-development-agreement"),
  "arbitration-agreement": () => import("./us/arbitration-agreement"),
  "architect-contract": () => import("./us/architect-contract"),
  "articles-of-incorporation": () => import("./us/articles-of-incorporation"),
  "articles-of-incorporation-biz": () =>
    import("./us/articles-of-incorporation-biz"),
  "assignment-agreement": () => import("./us/assignment-agreement"),
  "athletic-scholarship-agreement": () =>
    import("./us/athletic-scholarship-agreement"),
  "auto-repair-agreement": () => import("./us/auto-repair-agreement"),
  "automotive-service-agreement": () =>
    import("./us/automotive-service-agreement"),
  "aviation-charter-agreement": () => import("./us/aviation-charter-agreement"),
  "bar-agreement": () => import("./us/bar-agreement"),
  "bid-proposal": () => import("./us/bid-proposal"),
  "bill-of-sale-general": () => import("./us/bill-of-sale-general"),
  "board-resolution": () => import("./us/board-resolution"),
  "boat-bill-of-sale": () => import("./us/boat-bill-of-sale"),
  "bookkeeping-services-agreement": () =>
    import("./us/bookkeeping-services-agreement"),
  "brand-ambassador-agreement": () => import("./us/brand-ambassador-agreement"),
  "business-contract": () => import("./us/business-contract"),
  "business-plan": () => import("./us/business-plan"),
  "buy-sell-agreement": () => import("./us/buy-sell-agreement"),
  "catering-agreement": () => import("./us/catering-agreement"),
  "certificate-substantial-completion": () =>
    import("./us/certificate-substantial-completion"),
  "change-order": () => import("./us/change-order"),
  "child-care-authorization-form": () =>
    import("./us/child-care-authorization-form"),
  "child-care-contract": () => import("./us/child-care-contract"),
  "child-custody-agreement": () => import("./us/child-custody-agreement"),
  "child-medical-consent": () => import("./us/child-medical-consent"),
  "child-support-agreement": () => import("./us/child-support-agreement"),
  "child-travel-consent": () => import("./us/child-travel-consent"),
  "clinical-trial-agreement": () => import("./us/clinical-trial-agreement"),
  "cloud-services-agreement": () => import("./us/cloud-services-agreement"),
  "coaching-agreement": () => import("./us/coaching-agreement"),
  "codicil-to-will": () => import("./us/codicil-to-will"),
  "cohabitation-agreement": () => import("./us/cohabitation-agreement"),
  "collection-letter": () => import("./us/collection-letter"),
  "commercial-lease-agreement": () => import("./us/commercial-lease-agreement"),
  "commercial-lease-with-option-to-purchase": () =>
    import("./us/commercial-lease-with-option-to-purchase"),
  "commission-agreement": () => import("./us/commission-agreement"),
  "complaint-letter": () => import("./us/complaint-letter"),
  "confidentiality-agreement": () => import("./us/confidentiality-agreement"),
  "consignment-agreement": () => import("./us/consignment-agreement"),
  "construction-bid-form": () => import("./us/construction-bid-form"),
  "construction-contract": () => import("./us/construction-contract"),
  "construction-management-agreement": () =>
    import("./us/construction-management-agreement"),
  "consulting-agreement": () => import("./us/consulting-agreement"),
  "contract-amendment": () => import("./us/contract-amendment"),
  "contract-termination-letter": () =>
    import("./us/contract-termination-letter"),
  "copyright-assignment": () => import("./us/copyright-assignment"),
  "copyright-assignment-agreement": () =>
    import("./us/copyright-assignment-agreement"),
  "copyright-license-agreement": () =>
    import("./us/copyright-license-agreement"),
  "corporate-bylaws": () => import("./us/corporate-bylaws"),
  "court-filing-document": () => import("./us/court-filing-document"),
  "credit-card-agreement": () => import("./us/credit-card-agreement"),
  "crop-sharing-agreement": () => import("./us/crop-sharing-agreement"),
  "cryptocurrency-agreement": () => import("./us/cryptocurrency-agreement"),
  "cybersecurity-agreement": () => import("./us/cybersecurity-agreement"),
  "data-processing-agreement": () => import("./us/data-processing-agreement"),
  "debt-settlement-agreement": () => import("./us/debt-settlement-agreement"),
  "debt-validation-letter": () => import("./us/debt-validation-letter"),
  "demand-letter": () => import("./us/demand-letter"),
  "demand-letter-payment": () => import("./us/demand-letter-payment"),
  "digital-asset-agreement": () => import("./us/digital-asset-agreement"),
  "direct-deposit-form": () => import("./us/direct-deposit-form"),
  "divorce-settlement-agreement": () =>
    import("./us/divorce-settlement-agreement"),
  "dog-breeding-agreement": () => import("./us/dog-breeding-agreement"),
  "donation-agreement": () => import("./us/donation-agreement"),
  "durable-power-of-attorney": () => import("./us/durable-power-of-attorney"),
  "earnest-money-agreement": () => import("./us/earnest-money-agreement"),
  "ecommerce-terms-of-service": () => import("./us/ecommerce-terms-of-service"),
  "education-trust": () => import("./us/education-trust"),
  "elder-care-agreement": () => import("./us/elder-care-agreement"),
  "employee-bonus-plan": () => import("./us/employee-bonus-plan"),
  "employee-evaluation-form": () => import("./us/employee-evaluation-form"),
  "employee-handbook": () => import("./us/employee-handbook"),
  "employee-non-disclosure-agreement": () =>
    import("./us/employee-non-disclosure-agreement"),
  "employee-warning-notice": () => import("./us/employee-warning-notice"),
  "employment-contract": () => import("./us/employment-contract"),
  "employment-offer-letter": () => import("./us/employment-offer-letter"),
  "employment-termination-letter": () =>
    import("./us/employment-termination-letter"),
  "employment-verification-letter": () =>
    import("./us/employment-verification-letter"),
  "endorsement-agreement": () => import("./us/endorsement-agreement"),
  "environmental-agreement": () => import("./us/environmental-agreement"),
  "equipment-rental-agreement": () => import("./us/equipment-rental-agreement"),
  "equity-incentive-plan": () => import("./us/equity-incentive-plan"),
  "event-planning-contract": () => import("./us/event-planning-contract"),
  "eviction-notice": () => import("./us/eviction-notice"),
  "executive-employment-agreement": () =>
    import("./us/executive-employment-agreement"),
  "farm-lease-agreement": () => import("./us/farm-lease-agreement"),
  "film-production-agreement": () => import("./us/film-production-agreement"),
  "fitness-waiver": () => import("./us/fitness-waiver"),
  "food-truck-agreement": () => import("./us/food-truck-agreement"),
  "franchise-agreement": () => import("./us/franchise-agreement"),
  "franchise-disclosure-agreement": () =>
    import("./us/franchise-disclosure-agreement"),
  "gaming-agreement": () => import("./us/gaming-agreement"),
  "general-contractor-agreement": () =>
    import("./us/general-contractor-agreement"),
  "general-inquiry": () => import("./us/general-inquiry"),
  "general-liability-waiver": () => import("./us/general-liability-waiver"),
  "government-contract-agreement": () =>
    import("./us/government-contract-agreement"),
  "guardianship-agreement": () => import("./us/guardianship-agreement"),
  "health-care-directive": () => import("./us/health-care-directive"),
  "healthcare-power-of-attorney": () =>
    import("./us/healthcare-power-of-attorney"),
  "hipaa-authorization-form": () => import("./us/hipaa-authorization-form"),
  "home-improvement-contract": () => import("./us/home-improvement-contract"),
  "horse-boarding-agreement": () => import("./us/horse-boarding-agreement"),
  "hotel-agreement": () => import("./us/hotel-agreement"),
  "hunting-lease-agreement": () => import("./us/hunting-lease-agreement"),
  "immigration-affidavit": () => import("./us/immigration-affidavit"),
  "independent-contractor-agreement": () =>
    import("./us/independent-contractor-agreement"),
  "influencer-agreement": () => import("./us/influencer-agreement"),
  "insurance-claim-form": () => import("./us/insurance-claim-form"),
  "international-trade-agreement": () =>
    import("./us/international-trade-agreement"),
  "internship-agreement": () => import("./us/internship-agreement"),
  "invention-assignment-agreement": () =>
    import("./us/invention-assignment-agreement"),
  "investment-agreement": () => import("./us/investment-agreement"),
  invoice: () => import("./us/invoice"),
  "job-application-form": () => import("./us/job-application-form"),
  "joint-living-trust": () => import("./us/joint-living-trust"),
  "joint-venture-agreement": () => import("./us/joint-venture-agreement"),
  "landscaping-contract": () => import("./us/landscaping-contract"),
  "last-will-testament": () => import("./us/last-will-testament"),
  "late-rent-notice": () => import("./us/late-rent-notice"),
  "lease-addendum": () => import("./us/lease-addendum"),
  "lease-agreement": () => import("./us/lease-agreement"),
  "lease-amendment": () => import("./us/lease-amendment"),
  "lease-renewal-agreement": () => import("./us/lease-renewal-agreement"),
  "lease-termination-letter": () => import("./us/lease-termination-letter"),
  "leave-of-absence-request-form": () =>
    import("./us/leave-of-absence-request-form"),
  "letter-of-intent": () => import("./us/letter-of-intent"),
  "licensing-agreement": () => import("./us/licensing-agreement"),
  "licensing-agreement-general": () =>
    import("./us/licensing-agreement-general"),
  "limited-partnership-agreement": () =>
    import("./us/limited-partnership-agreement"),
  "livestock-purchase-agreement": () =>
    import("./us/livestock-purchase-agreement"),
  "living-trust": () => import("./us/living-trust"),
  "living-trust-amendment": () => import("./us/living-trust-amendment"),
  "living-will": () => import("./us/living-will"),
  "llc-operating-agreement": () => import("./us/operating-agreement"),
  "loan-agreement": () => import("./us/loan-agreement"),
  "loan-modification-agreement": () =>
    import("./us/loan-modification-agreement"),
  "loan-modification-letter": () => import("./us/loan-modification-letter"),
  "lottery-pool-contract": () => import("./us/lottery-pool-contract"),
  "maritime-charter-agreement": () => import("./us/maritime-charter-agreement"),
  "marketing-agreement": () => import("./us/marketing-agreement"),
  "marriage-separation-agreement": () =>
    import("./us/marriage-separation-agreement"),
  "mechanics-lien": () => import("./us/mechanics-lien"),
  "mechanics-lien-waiver": () => import("./us/mechanics-lien-waiver"),
  "mediation-agreement": () => import("./us/mediation-agreement"),
  "medical-consent": () => import("./us/medical-consent"),
  "medical-consent-form": () => import("./us/medical-consent-form"),
  "medical-power-of-attorney": () => import("./us/medical-power-of-attorney"),
  "membership-agreement": () => import("./us/membership-agreement"),
  "membership-cancellation-letter": () =>
    import("./us/membership-cancellation-letter"),
  "memorandum-of-agreement": () => import("./us/memorandum-of-agreement"),
  "memorandum-of-understanding": () =>
    import("./us/memorandum-of-understanding"),
  "mining-agreement": () => import("./us/mining-agreement"),
  "mining-lease-agreement": () => import("./us/mining-lease-agreement"),
  "model-release": () => import("./us/model-release"),
  "mortgage-agreement": () => import("./us/mortgage-agreement"),
  "music-license-agreement": () => import("./us/music-license-agreement"),
  "music-licensing-agreement": () => import("./us/music-licensing-agreement"),
  "mutual-non-disclosure-agreement": () =>
    import("./us/mutual-non-disclosure-agreement"),
  "name-change-notification-letter": () =>
    import("./us/name-change-notification-letter"),
  nda: () => import("./us/nda"),
  "non-compete-agreement": () => import("./us/non-compete-agreement"),
  "non-disclosure-agreement": () => import("./us/non-disclosure-agreement"),
  "nonprofit-bylaws": () => import("./us/nonprofit-bylaws"),
  "notarization-request": () => import("./us/notarization-request"),
  "notice-of-lease-violation": () => import("./us/notice-of-lease-violation"),
  "notice-to-enter": () => import("./us/notice-to-enter"),
  "notice-to-pay-rent-or-quit": () => import("./us/notice-to-pay-rent-or-quit"),
  "notice-to-proceed": () => import("./us/notice-to-proceed"),
  "offer-letter": () => import("./us/offer-letter"),
  "office-space-lease": () => import("./us/office-space-lease"),
  "oil-gas-lease": () => import("./us/oil-gas-lease"),
  "oil-gas-lease-agreement": () => import("./us/oil-gas-lease-agreement"),
  "parenting-plan": () => import("./us/parenting-plan"),
  "parking-space-lease-agreement": () =>
    import("./us/parking-space-lease-agreement"),
  "partnership-agreement": () => import("./us/partnership-agreement"),
  "partnership-amendment": () => import("./us/partnership-amendment"),
  "partnership-dissolution-agreement": () =>
    import("./us/partnership-dissolution-agreement"),
  "patent-application-assignment": () =>
    import("./us/patent-application-assignment"),
  "patent-assignment": () => import("./us/patent-assignment"),
  "patent-license-agreement": () => import("./us/patent-license-agreement"),
  "patent-licensing-agreement": () => import("./us/patent-licensing-agreement"),
  "payment-bond": () => import("./us/payment-bond"),
  "payment-plan": () => import("./us/payment-plan"),
  "performance-bond": () => import("./us/performance-bond"),
  "personal-care-agreement": () => import("./us/personal-care-agreement"),
  "personal-loan-agreement": () => import("./us/personal-loan-agreement"),
  "personal-training-agreement": () =>
    import("./us/personal-training-agreement"),
  "pet-addendum": () => import("./us/pet-addendum"),
  "pet-agreement": () => import("./us/pet-agreement"),
  "pet-custody-agreement": () => import("./us/pet-custody-agreement"),
  "photo-release-form": () => import("./us/photo-release-form"),
  "photography-release": () => import("./us/photography-release"),
  "postnuptial-agreement": () => import("./us/postnuptial-agreement"),
  "pour-over-will": () => import("./us/pour-over-will"),
  "power-of-attorney": () => import("./us/power-of-attorney"),
  "power-of-attorney-for-child": () =>
    import("./us/power-of-attorney-for-child"),
  "prenuptial-agreement": () => import("./us/prenuptial-agreement"),
  "private-placement-memorandum": () =>
    import("./us/private-placement-memorandum"),
  "product-liability-waiver": () => import("./us/product-liability-waiver"),
  "professional-liability-waiver": () =>
    import("./us/professional-liability-waiver"),
  "progressive-discipline-policy": () =>
    import("./us/progressive-discipline-policy"),
  "promissory-note": () => import("./us/promissory-note"),
  "promissory-note-balloon-payments": () =>
    import("./us/promissory-note-balloon-payments"),
  "promissory-note-installment-payments": () =>
    import("./us/promissory-note-installment-payments"),
  "proof-of-income-letter": () => import("./us/proof-of-income-letter"),
  "property-deed": () => import("./us/property-deed"),
  "property-manager-agreement": () => import("./us/property-manager-agreement"),
  "provisional-patent-application": () =>
    import("./us/provisional-patent-application"),
  "purchase-agreement": () => import("./us/purchase-agreement"),
  "purchase-order": () => import("./us/purchase-order"),
  "quitclaim-deed": () => import("./us/quitclaim-deed"),
  "real-estate-purchase-agreement": () =>
    import("./us/real-estate-purchase-agreement"),
  receipt: () => import("./us/receipt"),
  "recording-artist-agreement": () => import("./us/recording-artist-agreement"),
  "release-for-use-of-likeness": () =>
    import("./us/release-for-use-of-likeness"),
  "release-of-liability": () => import("./us/release-of-liability"),
  "remodeling-contract": () => import("./us/remodeling-contract"),
  "rent-increase-letter": () => import("./us/rent-increase-letter"),
  "rent-receipt": () => import("./us/rent-receipt"),
  "rental-agreement": () => import("./us/rental-agreement"),
  "research-agreement": () => import("./us/research-agreement"),
  "residential-lease-agreement": () =>
    import("./us/residential-lease-agreement"),
  "residential-rental-application": () =>
    import("./us/residential-rental-application"),
  "residential-rental-inspection-report": () =>
    import("./us/residential-rental-inspection-report"),
  "resignation-letter": () => import("./us/resignation-letter"),
  "resignation-letter-personal": () =>
    import("./us/resignation-letter-personal"),
  "restaurant-agreement": () => import("./us/restaurant-agreement"),
  "restaurant-lease": () => import("./us/restaurant-lease"),
  "retail-space-lease": () => import("./us/retail-space-lease"),
  "retirement-plan-agreement": () => import("./us/retirement-plan-agreement"),
  "revocation-of-power-of-attorney": () =>
    import("./us/revocation-of-power-of-attorney"),
  "revolving-credit-agreement": () => import("./us/revolving-credit-agreement"),
  "ride-sharing-agreement": () => import("./us/ride-sharing-agreement"),
  "roofing-contract": () => import("./us/roofing-contract"),
  "room-rental-agreement": () => import("./us/room-rental-agreement"),
  "roommate-agreement": () => import("./us/roommate-agreement"),
  "royalty-agreement": () => import("./us/royalty-agreement"),
  "salary-verification-letter": () => import("./us/salary-verification-letter"),
  "sale-of-goods": () => import("./us/sale-of-goods"),
  "sales-agreement": () => import("./us/sales-agreement"),
  "security-agreement": () => import("./us/security-agreement"),
  "separation-agreement": () => import("./us/separation-agreement"),
  "service-agreement": () => import("./us/service-agreement"),
  "service-level-agreement": () => import("./us/service-level-agreement"),
  "settlement-agreement": () => import("./us/settlement-agreement"),
  "severance-agreement": () => import("./us/severance-agreement"),
  "shareholder-agreement": () => import("./us/shareholder-agreement"),
  "simple-will": () => import("./us/simple-will"),
  "single-member-llc-operating-agreement": () =>
    import("./us/single-member-llc-operating-agreement"),
  "small-estate-affidavit": () => import("./us/small-estate-affidavit"),
  "social-media-management-agreement": () =>
    import("./us/social-media-management-agreement"),
  "software-license-agreement": () => import("./us/software-license-agreement"),
  "solar-energy-agreement": () => import("./us/solar-energy-agreement"),
  "sponsorship-agreement": () => import("./us/sponsorship-agreement"),
  "sports-agreement": () => import("./us/sports-agreement"),
  "startup-equity-agreement": () => import("./us/startup-equity-agreement"),
  "statement-of-account": () => import("./us/statement-of-account"),
  "statement-of-work": () => import("./us/statement-of-work"),
  "stock-purchase-agreement": () => import("./us/stock-purchase-agreement"),
  "storage-space-lease-agreement": () =>
    import("./us/storage-space-lease-agreement"),
  "student-loan-agreement": () => import("./us/student-loan-agreement"),
  "subcontractor-agreement": () => import("./us/subcontractor-agreement"),
  "sublease-agreement": () => import("./us/sublease-agreement"),
  "talent-agreement": () => import("./us/talent-agreement"),
  "talent-management-agreement": () =>
    import("./us/talent-management-agreement"),
  "tax-preparation-agreement": () => import("./us/tax-preparation-agreement"),
  "telecommuting-agreement": () => import("./us/telecommuting-agreement"),
  "telemedicine-agreement": () => import("./us/telemedicine-agreement"),
  "tenant-maintenance-request": () => import("./us/tenant-maintenance-request"),
  "term-sheet": () => import("./us/term-sheet"),
  "termination-letter": () => import("./us/termination-letter"),
  "timber-sale-agreement": () => import("./us/timber-sale-agreement"),
  "trademark-application-worksheet": () =>
    import("./us/trademark-application-worksheet"),
  "trademark-assignment": () => import("./us/trademark-assignment"),
  "trademark-license-agreement": () =>
    import("./us/trademark-license-agreement"),
  "transportation-service-agreement": () =>
    import("./us/transportation-service-agreement"),
  "travel-insurance-agreement": () => import("./us/travel-insurance-agreement"),
  "triple-net-lease": () => import("./us/triple-net-lease"),
  "tuition-agreement": () => import("./us/tuition-agreement"),
  "tutoring-agreement": () => import("./us/tutoring-agreement"),
  "two-weeks-notice-letter": () => import("./us/two-weeks-notice-letter"),
  "vacation-rental-agreement": () => import("./us/vacation-rental-agreement"),
  "vehicle-bill-of-sale": () => import("./us/vehicle-bill-of-sale"),
  "vehicle-lease-agreement": () => import("./us/vehicle-lease-agreement"),
  "vendor-agreement": () => import("./us/vendor-agreement"),
  "video-release": () => import("./us/video-release"),
  "volunteer-agreement": () => import("./us/volunteer-agreement"),
  "warehouse-agreement": () => import("./us/warehouse-agreement"),
  "warehouse-lease": () => import("./us/warehouse-lease"),
  "warranty-deed": () => import("./us/warranty-deed"),
  "water-rights-agreement": () => import("./us/water-rights-agreement"),
  "web-development-agreement": () => import("./us/web-development-agreement"),
  "website-development-agreement": () =>
    import("./us/website-development-agreement"),
  "work-from-home-agreement": () => import("./us/work-from-home-agreement"),
};

export const DOCUMENT_METADATA: Record<string, GeneratedMetadata> = {
  "ach-authorization-form": {
    id: "ach-authorization-form",
    title: "ACH Authorization Form",
    description:
      "Authorize automatic bank transfers (ACH) for recurring or one-time payments.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "bank authorization",
      "automatic payment form",
      "direct debit authorization",
      "electronic payment form",
      "autorización bancaria",
      "formulario de pago automático",
      "autorización de débito directo",
      "formulario de pago electrónico",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "ACH Authorization Form",
        description:
          "Authorize automatic bank transfers (ACH) for recurring or one-time payments.",
        aliases: [
          "bank authorization",
          "automatic payment form",
          "direct debit authorization",
          "electronic payment form",
        ],
      },
      es: {
        name: "Formulario de Autorización ACH",
        description:
          "Permite retiros automáticos del banco para facturas, renta o pagos de préstamos. Forma conveniente de configurar pagos recurrentes.",
        aliases: [
          "autorización bancaria",
          "formulario de pago automático",
          "autorización de débito directo",
          "formulario de pago electrónico",
        ],
      },
    },
  },
  "advance-directive": {
    id: "advance-directive",
    title: "Advance Directive",
    description:
      "Create a comprehensive advance healthcare directive to specify your medical treatment preferences and appoint a healthcare agent.",
    category: "Estate Planning",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "advance healthcare directive",
      "living will with healthcare proxy",
      "medical directive",
      "healthcare power of attorney with living will",
      "advance medical directive",
      "healthcare decisions document",
      "directiva de atención médica anticipada",
      "testamento vital con poder médico",
      "directiva médica",
      "poder para atención médica con testamento vital",
      "directiva médica anticipada",
      "documento de decisiones médicas",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Advance Directive",
        description:
          "Create a comprehensive advance healthcare directive to specify your medical treatment preferences and appoint a healthcare agent.",
        aliases: [
          "advance healthcare directive",
          "living will with healthcare proxy",
          "medical directive",
          "healthcare power of attorney with living will",
          "advance medical directive",
          "healthcare decisions document",
        ],
      },
      es: {
        name: "Directiva Médica Anticipada",
        description:
          "Dile a los médicos tus deseos médicos si no puedes hablar por ti mismo. Cubre soporte vital, tubos de alimentación y cuidado al final de la vida.",
        aliases: [
          "directiva de atención médica anticipada",
          "testamento vital con poder médico",
          "directiva médica",
          "poder para atención médica con testamento vital",
          "directiva médica anticipada",
          "documento de decisiones médicas",
        ],
      },
    },
  },
  "advance-directive-revocation": {
    id: "advance-directive-revocation",
    title: "Advance Directive Revocation",
    description:
      "Take back control over your healthcare decisions by officially canceling your previous medical directive.",
    category: "Estate Planning",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "revocation of advance directive",
      "advance healthcare directive revocation",
      "cancellation of advance directive",
      "advance directive cancellation",
      "revoke healthcare directive",
      "cancel medical directive",
      "revocación de directiva anticipada",
      "revocación de directiva médica anticipada",
      "cancelación de directiva anticipada",
      "cancelación de directiva médica",
      "revocar directiva médica",
      "cancelar directiva médica",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Advance Directive Revocation",
        description:
          "Take back control over your healthcare decisions by officially canceling your previous medical directive.",
        aliases: [
          "revocation of advance directive",
          "advance healthcare directive revocation",
          "cancellation of advance directive",
          "advance directive cancellation",
          "revoke healthcare directive",
          "cancel medical directive",
        ],
      },
      es: {
        name: "Revocación de Directiva Médica Anticipada",
        description:
          "Documento legal para revocar o cancelar una directiva médica anticipada ejecutada previamente.",
        aliases: [
          "revocación de directiva anticipada",
          "revocación de directiva médica anticipada",
          "cancelación de directiva anticipada",
          "cancelación de directiva médica",
          "revocar directiva médica",
          "cancelar directiva médica",
        ],
      },
    },
  },
  affidavit: {
    id: "affidavit",
    title: "General Affidavit",
    description:
      "Provide legally binding testimony for court cases and official proceedings. Strengthen your case with sworn statements.",
    category: "Personal",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "sworn statement",
      "sworn declaration",
      "statement under oath",
      "legal affidavit",
      "declaración jurada",
      "declaración bajo juramento",
      "afidávit legal",
      "declaración jurada legal",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "General Affidavit",
        description:
          "Provide legally binding testimony for court cases and official proceedings. Strengthen your case with sworn statements.",
        aliases: [
          "sworn statement",
          "sworn declaration",
          "statement under oath",
          "legal affidavit",
        ],
      },
      es: {
        name: "Declaración Jurada General",
        description:
          "Acelera trámites legales y burocráticos con declaraciones juradas oficiales. Evita comparecencias innecesarias en cortes y oficinas gubernamentales.",
        aliases: [
          "declaración jurada",
          "declaración bajo juramento",
          "afidávit legal",
          "declaración jurada legal",
        ],
      },
    },
  },
  "affidavit-general": {
    id: "affidavit-general",
    title: "Affidavit (General)",
    description:
      "A sworn written statement confirmed by oath, often used as evidence.",
    category: "Personal",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "sworn statement",
      "declaration",
      "official statement",
      "statement under oath",
      "declaración jurada",
      "declaración oficial",
      "declaración bajo juramento",
      "declaración juramentada",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Affidavit (General)",
        description:
          "A sworn written statement confirmed by oath, often used as evidence.",
        aliases: [
          "sworn statement",
          "declaration",
          "official statement",
          "statement under oath",
        ],
      },
      es: {
        name: "Declaración Jurada (General)",
        description:
          "Formato general de declaración jurada para varias situaciones legales. Documento flexible para testimonios y declaraciones de hechos.",
        aliases: [
          "declaración jurada",
          "declaración oficial",
          "declaración bajo juramento",
          "declaración juramentada",
        ],
      },
    },
  },
  "affidavit-of-death": {
    id: "affidavit-of-death",
    title: "Affidavit of Death",
    description:
      "Legal document certifying the death of a person when a death certificate is unavailable or as additional proof of death.",
    category: "Legal",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "death affidavit",
      "affidavit certifying death",
      "proof of death affidavit",
      "death verification affidavit",
      "affidavit of deceased person",
      "sworn statement of death",
      "declaración jurada de defunción",
      "declaración jurada certificando muerte",
      "declaración jurada de prueba de muerte",
      "declaración jurada de verificación de muerte",
      "declaración jurada de persona fallecida",
      "declaración jurada de muerte",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Affidavit of Death",
        description:
          "Legal document certifying the death of a person when a death certificate is unavailable or as additional proof of death.",
        aliases: [
          "death affidavit",
          "affidavit certifying death",
          "proof of death affidavit",
          "death verification affidavit",
          "affidavit of deceased person",
          "sworn statement of death",
        ],
      },
      es: {
        name: "Declaración Jurada de Muerte",
        description:
          "Certifica legalmente la muerte de alguien para propósitos de herencia y seguros. Requerido para transferir bienes y cobrar beneficios.",
        aliases: [
          "declaración jurada de defunción",
          "declaración jurada certificando muerte",
          "declaración jurada de prueba de muerte",
          "declaración jurada de verificación de muerte",
          "declaración jurada de persona fallecida",
          "declaración jurada de muerte",
        ],
      },
    },
  },
  "affidavit-of-heirship": {
    id: "affidavit-of-heirship",
    title: "Affidavit of Heirship",
    description:
      "Legal document establishing the heirs of a deceased person for property transfer and inheritance purposes.",
    category: "Legal",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "heirship affidavit",
      "affidavit of inheritance",
      "heir determination affidavit",
      "family tree affidavit",
      "descent affidavit",
      "heirship declaration",
      "declaración jurada de herencia",
      "declaración jurada de sucesión",
      "declaración de herederos",
      "declaración jurada familiar",
      "declaración de descendencia",
      "declaración de herencia",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Affidavit of Heirship",
        description:
          "Legal document establishing the heirs of a deceased person for property transfer and inheritance purposes.",
        aliases: [
          "heirship affidavit",
          "affidavit of inheritance",
          "heir determination affidavit",
          "family tree affidavit",
          "descent affidavit",
          "heirship declaration",
        ],
      },
      es: {
        name: "Declaración Jurada de Herederos",
        description:
          "Establece quién hereda propiedad cuando alguien muere sin testamento. Prueba relaciones familiares para transferencia de bienes.",
        aliases: [
          "declaración jurada de herencia",
          "declaración jurada de sucesión",
          "declaración de herederos",
          "declaración jurada familiar",
          "declaración de descendencia",
          "declaración de herencia",
        ],
      },
    },
  },
  "affidavit-of-identity": {
    id: "affidavit-of-identity",
    title: "Affidavit of Identity",
    description:
      "Sworn statement verifying identity for legal or administrative purposes.",
    category: "Government & Legal Services",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "identity affidavit",
      "sworn identity statement",
      "declaración de identidad",
      "declaración jurada de identidad",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Affidavit of Identity",
        description:
          "Sworn statement verifying identity for legal or administrative purposes.",
        aliases: ["identity affidavit", "sworn identity statement"],
      },
      es: {
        name: "Declaración Jurada de Identidad",
        description:
          "Prueba tu identidad para procedimientos legales cuando la identificación oficial se pierde o es cuestionada. Declaración jurada de quién eres.",
        aliases: [
          "declaración de identidad",
          "declaración jurada de identidad",
        ],
      },
    },
  },
  "affidavit-of-survivorship": {
    id: "affidavit-of-survivorship",
    title: "Affidavit of Survivorship",
    description:
      "Legal document for surviving joint owners to establish sole ownership of property after the death of a co-owner.",
    category: "Legal",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "survivorship affidavit",
      "joint tenant survivorship affidavit",
      "surviving owner affidavit",
      "right of survivorship affidavit",
      "survivorship deed affidavit",
      "joint ownership death affidavit",
      "declaración jurada de supervivencia",
      "declaración jurada de supervivencia de inquilinos conjuntos",
      "declaración jurada de propietario superviviente",
      "declaración jurada de derecho de supervivencia",
      "declaración jurada de escritura de supervivencia",
      "declaración jurada de muerte de propiedad conjunta",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Affidavit of Survivorship",
        description:
          "Legal document for surviving joint owners to establish sole ownership of property after the death of a co-owner.",
        aliases: [
          "survivorship affidavit",
          "joint tenant survivorship affidavit",
          "surviving owner affidavit",
          "right of survivorship affidavit",
          "survivorship deed affidavit",
          "joint ownership death affidavit",
        ],
      },
      es: {
        name: "Declaración Jurada de Supervivencia",
        description:
          "Transfiere propiedad de tenencia conjunta al propietario sobreviviente después de la muerte. Evita el proceso de sucesión para propiedad en tenencia conjunta.",
        aliases: [
          "declaración jurada de supervivencia",
          "declaración jurada de supervivencia de inquilinos conjuntos",
          "declaración jurada de propietario superviviente",
          "declaración jurada de derecho de supervivencia",
          "declaración jurada de escritura de supervivencia",
          "declaración jurada de muerte de propiedad conjunta",
        ],
      },
    },
  },
  "affiliate-marketing-agreement": {
    id: "affiliate-marketing-agreement",
    title: "Affiliate Marketing Agreement",
    description:
      "Expand your marketing reach and boost sales without upfront costs. Attract motivated partners who only earn when they deliver results.",
    category: "Marketing & Advertising",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "affiliate program agreement",
      "commission agreement",
      "partner marketing agreement",
      "acuerdo de programa de afiliados",
      "acuerdo de comisiones",
      "acuerdo de marketing de socios",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Affiliate Marketing Agreement",
        description:
          "Expand your marketing reach and boost sales without upfront costs. Attract motivated partners who only earn when they deliver results.",
        aliases: [
          "affiliate program agreement",
          "commission agreement",
          "partner marketing agreement",
        ],
      },
      es: {
        name: "Acuerdo de Marketing de Afiliados",
        description:
          "Establece terminos de comision y protege tu negocio al trabajar con afiliados que promocionan tus productos por un porcentaje de las ventas.",
        aliases: [
          "acuerdo de programa de afiliados",
          "acuerdo de comisiones",
          "acuerdo de marketing de socios",
        ],
      },
    },
  },
  "agricultural-agreement": {
    id: "agricultural-agreement",
    title: "Agricultural Agreement",
    description:
      "Agreement for farming, agricultural services, and crop sharing arrangements.",
    category: "Agriculture & Farming",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "farming agreement",
      "crop share agreement",
      "agricultural services contract",
      "acuerdo de agricultura",
      "contrato de servicios agrícolas",
      "contrato de servicios agrícolas legal",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Agricultural Agreement",
        description:
          "Agreement for farming, agricultural services, and crop sharing arrangements.",
        aliases: [
          "farming agreement",
          "crop share agreement",
          "agricultural services contract",
        ],
      },
      es: {
        name: "Acuerdo Agrícola",
        description:
          "Maximiza la rentabilidad de tu tierra agrícola y reduce riesgos operativos. Establece asociaciones que beneficien a todos los participantes.",
        aliases: [
          "acuerdo de agricultura",
          "contrato de servicios agrícolas",
          "contrato de servicios agrícolas legal",
        ],
      },
    },
  },
  "app-development-agreement": {
    id: "app-development-agreement",
    title: "App Development Agreement",
    description:
      "Agreement for mobile and web application development services.",
    category: "Technology & IT",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "mobile app development",
      "software development contract",
      "desarrollo de app móvil",
      "contrato de desarrollo de software",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "App Development Agreement",
        description:
          "Agreement for mobile and web application development services.",
        aliases: ["mobile app development", "software development contract"],
      },
      es: {
        name: "Acuerdo de Desarrollo de Aplicaciones",
        description:
          "Protege tu idea de app y asegura un desarrollo exitoso. Establece expectativas claras sobre funcionalidades, cronogramas y propiedad intelectual.",
        aliases: [
          "desarrollo de app móvil",
          "contrato de desarrollo de software",
        ],
      },
    },
  },
  "arbitration-agreement": {
    id: "arbitration-agreement",
    title: "Arbitration Agreement",
    description:
      "Agreement requiring disputes to be resolved through arbitration instead of court litigation.",
    category: "Dispute Resolution",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "binding arbitration agreement",
      "dispute resolution agreement",
      "acuerdo de arbitraje vinculante",
      "acuerdo de resolución de disputas",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Arbitration Agreement",
        description:
          "Agreement requiring disputes to be resolved through arbitration instead of court litigation.",
        aliases: [
          "binding arbitration agreement",
          "dispute resolution agreement",
        ],
      },
      es: {
        name: "Acuerdo de Arbitraje",
        description:
          "Ahorra tiempo y dinero en disputas legales al evitar cortes costosas. Resuelve conflictos de manera privada y eficiente con decisiones vinculantes.",
        aliases: [
          "acuerdo de arbitraje vinculante",
          "acuerdo de resolución de disputas",
        ],
      },
    },
  },
  "architect-contract": {
    id: "architect-contract",
    title: "Architect Services Contract",
    description:
      "Professional services agreement for architectural design, planning, and construction administration.",
    category: "Construction",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "architectural services agreement",
      "design professional contract",
      "architect agreement",
      "acuerdo de servicios arquitectónicos",
      "contrato de profesional de diseño",
      "acuerdo de arquitecto",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Architect Services Contract",
        description:
          "Professional services agreement for architectural design, planning, and construction administration.",
        aliases: [
          "architectural services agreement",
          "design professional contract",
          "architect agreement",
        ],
      },
      es: {
        name: "Contrato de Servicios de Arquitecto",
        description:
          "Asegura un diseño profesional que cumpla tus expectativas y presupuesto. Protege tu inversión con términos claros sobre cambios y responsabilidades.",
        aliases: [
          "acuerdo de servicios arquitectónicos",
          "contrato de profesional de diseño",
          "acuerdo de arquitecto",
        ],
      },
    },
  },
  "articles-of-incorporation": {
    id: "articles-of-incorporation",
    title: "Articles of Incorporation",
    description:
      "Protect your personal wealth from business liabilities and gain credibility with customers. Open doors to business financing and tax advantages.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "business incorporation",
      "corporate charter",
      "incorporation documents",
      "company formation",
      "incorporación de negocio",
      "estatutos corporativos",
      "documentos de incorporación",
      "formación de la empresa",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Articles of Incorporation",
        description:
          "Protect your personal wealth from business liabilities and gain credibility with customers. Open doors to business financing and tax advantages.",
        aliases: [
          "business incorporation",
          "corporate charter",
          "incorporation documents",
          "company formation",
        ],
      },
      es: {
        name: "Acta Constitutiva",
        description:
          "Protege tu patrimonio personal de demandas comerciales y obtén credibilidad empresarial. Abre puertas a financiamiento y beneficios fiscales.",
        aliases: [
          "incorporación de negocio",
          "estatutos corporativos",
          "documentos de incorporación",
          "formación de la empresa",
        ],
      },
    },
  },
  "articles-of-incorporation-biz": {
    id: "articles-of-incorporation-biz",
    title: "Articles of Incorporation (Business)",
    description:
      "Formal document filed with the state to create a corporation for business entities.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "form corporation",
      "incorporate business",
      "business incorporation",
      "formar corporación",
      "incorporar negocio",
      "incorporación empresarial",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Articles of Incorporation (Business)",
        description:
          "Formal document filed with the state to create a corporation for business entities.",
        aliases: [
          "form corporation",
          "incorporate business",
          "business incorporation",
        ],
      },
      es: {
        name: "Acta Constitutiva (Empresarial)",
        description:
          "Separa legalmente tu negocio de tus finanzas personales y reduce riesgos. Obten protección legal y credibilidad ante clientes e inversionistas.",
        aliases: [
          "formar corporación",
          "incorporar negocio",
          "incorporación empresarial",
        ],
      },
    },
  },
  "assignment-agreement": {
    id: "assignment-agreement",
    title: "Assignment Agreement",
    description:
      "Transfer contractual responsibilities legally while protecting your reputation. Exit commitments you can fulfill without penalties.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "contract assignment",
      "right assignment",
      "assignment agreement",
      "cesión de contrato",
      "cesión de derechos",
      "acuerdo de cesión",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Assignment Agreement",
        description:
          "Transfer contractual responsibilities legally while protecting your reputation. Exit commitments you can fulfill without penalties.",
        aliases: [
          "contract assignment",
          "right assignment",
          "assignment agreement",
        ],
      },
      es: {
        name: "Acuerdo de Cesión",
        description:
          "Transfiere responsabilidades contractuales legalmente y evita penalizaciones. Protege tu reputación cuando no puedes cumplir compromisos.",
        aliases: [
          "cesión de contrato",
          "cesión de derechos",
          "acuerdo de cesión",
        ],
      },
    },
  },
  "athletic-scholarship-agreement": {
    id: "athletic-scholarship-agreement",
    title: "Athletic Scholarship Agreement",
    description:
      "Agreement for athletic scholarships and student-athlete commitments.",
    category: "Academic & Research",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "sports scholarship contract",
      "student athlete agreement",
      "athletic aid agreement",
      "contrato de beca deportiva",
      "acuerdo de atleta estudiantil",
      "acuerdo de ayuda atlética",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Athletic Scholarship Agreement",
        description:
          "Agreement for athletic scholarships and student-athlete commitments.",
        aliases: [
          "sports scholarship contract",
          "student athlete agreement",
          "athletic aid agreement",
        ],
      },
      es: {
        name: "Acuerdo de Beca Atlética",
        description:
          "Asegura tu beca deportiva y protege tu futuro educativo. Establece expectativas claras que beneficien tanto al estudiante como a la institución.",
        aliases: [
          "contrato de beca deportiva",
          "acuerdo de atleta estudiantil",
          "acuerdo de ayuda atlética",
        ],
      },
    },
  },
  "auto-repair-agreement": {
    id: "auto-repair-agreement",
    title: "Auto Repair Agreement",
    description:
      "Agreement between auto repair shop and customer for vehicle repair services.",
    category: "Transportation & Automotive",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "vehicle repair agreement",
      "automotive service agreement",
      "car repair contract",
      "acuerdo de reparación de vehículos",
      "contrato de servicio automotriz",
      "contrato de reparación de automóvil",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Auto Repair Agreement",
        description:
          "Agreement between auto repair shop and customer for vehicle repair services.",
        aliases: [
          "vehicle repair agreement",
          "automotive service agreement",
          "car repair contract",
        ],
      },
      es: {
        name: "Acuerdo de Reparación Automotriz",
        description:
          "Protege tu inversión en reparaciones automotrices y evita sobrecostos inesperados. Asegura garantías de trabajo y transparencia en precios.",
        aliases: [
          "acuerdo de reparación de vehículos",
          "contrato de servicio automotriz",
          "contrato de reparación de automóvil",
        ],
      },
    },
  },
  "automotive-service-agreement": {
    id: "automotive-service-agreement",
    title: "Automotive Service Agreement",
    description: "Agreement for automotive repair and maintenance services.",
    category: "Transportation & Automotive",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "car repair agreement",
      "vehicle service contract",
      "auto maintenance agreement",
      "acuerdo de reparación de autos",
      "contrato de servicio vehicular",
      "acuerdo de mantenimiento automotriz",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Automotive Service Agreement",
        description:
          "Agreement for automotive repair and maintenance services.",
        aliases: [
          "car repair agreement",
          "vehicle service contract",
          "auto maintenance agreement",
        ],
      },
      es: {
        name: "Acuerdo de Servicio Automotriz",
        description:
          "Extiende la vida útil de tu vehículo y evita reparaciones costosas. Asegura mantenimiento regular con precios fijos y garantías de servicio.",
        aliases: [
          "acuerdo de reparación de autos",
          "contrato de servicio vehicular",
          "acuerdo de mantenimiento automotriz",
        ],
      },
    },
  },
  "aviation-charter-agreement": {
    id: "aviation-charter-agreement",
    title: "Aviation Charter Agreement",
    description:
      "Agreement for chartering aircraft for transportation and aviation services.",
    category: "Transportation & Automotive",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "aircraft charter agreement",
      "private jet charter",
      "flight charter contract",
      "contrato de vuelo charter",
      "acuerdo de jet privado",
      "contrato de la carta de vuelo",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Aviation Charter Agreement",
        description:
          "Agreement for chartering aircraft for transportation and aviation services.",
        aliases: [
          "aircraft charter agreement",
          "private jet charter",
          "flight charter contract",
        ],
      },
      es: {
        name: "Acuerdo de Flete Aéreo",
        description:
          "Viaja con comodidad y eficiencia mientras proteges tu inversión. Asegura servicios de aviación premium con términos claros y seguros adecuados.",
        aliases: [
          "contrato de vuelo charter",
          "acuerdo de jet privado",
          "contrato de la carta de vuelo",
        ],
      },
    },
  },
  "bar-agreement": {
    id: "bar-agreement",
    title: "Bar Agreement",
    description: "Agreement for bar operations, partnerships, or management.",
    category: "Food & Hospitality",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "bar partnership",
      "tavern agreement",
      "pub agreement",
      "sociedad de bar",
      "acuerdo de taberna",
      "acuerdo de pub",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Bar Agreement",
        description:
          "Agreement for bar operations, partnerships, or management.",
        aliases: ["bar partnership", "tavern agreement", "pub agreement"],
      },
      es: {
        name: "Acuerdo de Bar",
        description:
          "Maximiza las ganancias de tu negocio de hospitalidad y evita conflictos entre socios. Establece operaciones eficientes que impulsen el éxito.",
        aliases: ["sociedad de bar", "acuerdo de taberna", "acuerdo de pub"],
      },
    },
  },
  "bid-proposal": {
    id: "bid-proposal",
    title: "Bid Proposal",
    description:
      "Professional contractor bid proposal for construction projects with detailed pricing and terms.",
    category: "Construction",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "construction bid",
      "contractor proposal",
      "project bid",
      "oferta de construcción",
      "propuesta de contratista",
      "oferta del proyecto",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Bid Proposal",
        description:
          "Professional contractor bid proposal for construction projects with detailed pricing and terms.",
        aliases: ["construction bid", "contractor proposal", "project bid"],
      },
      es: {
        name: "Propuesta de Oferta",
        description:
          "Aumenta tus posibilidades de ganar contratos lucrativos con propuestas profesionales. Destaca sobre la competencia y justifica tus precios.",
        aliases: [
          "oferta de construcción",
          "propuesta de contratista",
          "oferta del proyecto",
        ],
      },
    },
  },
  "bill-of-sale-general": {
    id: "bill-of-sale-general",
    title: "General Bill of Sale",
    description:
      "Protect your valuable sales and prevent future disputes when selling personal property. Provide legal proof of ownership transfer.",
    category: "Legal",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "bill of sale",
      "sales receipt",
      "property transfer",
      "general bill of sale",
      "factura de venta",
      "recibo de venta",
      "transferencia de propiedad",
      "factura general",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "General Bill of Sale",
        description:
          "Protect your valuable sales and prevent future disputes when selling personal property. Provide legal proof of ownership transfer.",
        aliases: [
          "bill of sale",
          "sales receipt",
          "property transfer",
          "general bill of sale",
        ],
      },
      es: {
        name: "Factura de Venta General",
        description:
          "Protege tu venta y evita disputas futuras al vender objetos valiosos. Proporciona prueba legal de ownership y términos de la transacción.",
        aliases: [
          "factura de venta",
          "recibo de venta",
          "transferencia de propiedad",
          "factura general",
        ],
      },
    },
  },
  "board-resolution": {
    id: "board-resolution",
    title: "Corporate Board Resolution",
    description:
      "Formal document recording decisions made by a corporation's board of directors at a meeting.",
    category: "Corporate",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "Board resolution",
      "Directors resolution",
      "Corporate resolution",
      "Resolución de junta",
      "Resolución de directores",
      "Resolución corporativa",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Corporate Board Resolution",
        description:
          "Formal document recording decisions made by a corporation's board of directors at a meeting.",
        aliases: [
          "Board resolution",
          "Directors resolution",
          "Corporate resolution",
        ],
      },
      es: {
        name: "Resolución de Junta Directiva",
        description:
          "Formaliza decisiones corporativas importantes y cumple con requisitos legales. Protege a directores de responsabilidad personal por decisiones empresariales.",
        aliases: [
          "Resolución de junta",
          "Resolución de directores",
          "Resolución corporativa",
        ],
      },
    },
  },
  "boat-bill-of-sale": {
    id: "boat-bill-of-sale",
    title: "Boat Bill of Sale",
    description:
      "Create a legally binding boat bill of sale with our easy-to-use template. State-specific requirements included.",
    category: "Finance",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "vessel bill of sale",
      "watercraft sale",
      "boat purchase agreement",
      "marine bill of sale",
      "venta de barco",
      "compraventa de embarcación",
      "contrato de venta marina",
      "factura de venta marítima",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Boat Bill of Sale",
        description:
          "Create a legally binding boat bill of sale with our easy-to-use template. State-specific requirements included.",
        aliases: [
          "vessel bill of sale",
          "watercraft sale",
          "boat purchase agreement",
          "marine bill of sale",
        ],
      },
      es: {
        name: "Contrato de Compraventa de Embarcación",
        description:
          "Protege tu inversión marina y evita disputas legales en la venta. Asegura transferencia clara de propiedad con documentación oficial.",
        aliases: [
          "venta de barco",
          "compraventa de embarcación",
          "contrato de venta marina",
          "factura de venta marítima",
        ],
      },
    },
  },
  "bookkeeping-services-agreement": {
    id: "bookkeeping-services-agreement",
    title: "Bookkeeping Services Agreement",
    description:
      "Professional agreement for bookkeeping and accounting services between service provider and client.",
    category: "Professional Services",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "accounting services agreement",
      "financial services contract",
      "bookkeeper contract",
      "contrato de servicios contables",
      "acuerdo de servicios financieros",
      "contrato de contable",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Bookkeeping Services Agreement",
        description:
          "Professional agreement for bookkeeping and accounting services between service provider and client.",
        aliases: [
          "accounting services agreement",
          "financial services contract",
          "bookkeeper contract",
        ],
      },
      es: {
        name: "Acuerdo de Servicios de Contabilidad",
        description:
          "Mantén tus finanzas organizadas y cumple con obligaciones fiscales. Obten servicios contables profesionales que impulsen el crecimiento de tu negocio.",
        aliases: [
          "contrato de servicios contables",
          "acuerdo de servicios financieros",
          "contrato de contable",
        ],
      },
    },
  },
  "brand-ambassador-agreement": {
    id: "brand-ambassador-agreement",
    title: "Brand Ambassador Agreement",
    description:
      "Agreement for brand ambassador relationships and long-term brand partnerships.",
    category: "Marketing & Advertising",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "brand partnership agreement",
      "ambassador contract",
      "brand representative agreement",
      "acuerdo de asociación de marca",
      "contrato de embajador",
      "acuerdo representativo de la marca",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Brand Ambassador Agreement",
        description:
          "Agreement for brand ambassador relationships and long-term brand partnerships.",
        aliases: [
          "brand partnership agreement",
          "ambassador contract",
          "brand representative agreement",
        ],
      },
      es: {
        name: "Acuerdo de Embajador de Marca",
        description:
          "Expande tu alcance de marketing y construye credibilidad de marca. Establece relaciones de largo plazo que impulsen ventas y reconocimiento.",
        aliases: [
          "acuerdo de asociación de marca",
          "contrato de embajador",
          "acuerdo representativo de la marca",
        ],
      },
    },
  },
  "business-contract": {
    id: "business-contract",
    title: "Business Contract",
    description:
      "Protect your business and avoid costly misunderstandings in commercial transactions. Establish clear terms that benefit both parties in your deals.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "commercial contract",
      "business agreement",
      "commercial agreement",
      "contrato de negocios",
      "acuerdo comercial",
      "acuerdo comercial legal",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Business Contract",
        description:
          "Protect your business and avoid costly misunderstandings in commercial transactions. Establish clear terms that benefit both parties in your deals.",
        aliases: [
          "commercial contract",
          "business agreement",
          "commercial agreement",
        ],
      },
      es: {
        name: "Contrato Comercial",
        description:
          "Protege tu negocio y evita malentendidos costosos en transacciones comerciales. Establece términos que beneficien a ambas partes.",
        aliases: [
          "contrato de negocios",
          "acuerdo comercial",
          "acuerdo comercial legal",
        ],
      },
    },
  },
  "business-plan": {
    id: "business-plan",
    title: "Business Plan",
    description:
      "Attract investors and secure funding with a professional business plan. Present your vision convincingly to achieve business success.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "business strategy",
      "startup plan",
      "company plan",
      "business proposal",
      "estrategia comercial",
      "plan de inicio",
      "plan de empresa",
      "propuesta de negocio",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Business Plan",
        description:
          "Attract investors and secure funding with a professional business plan. Present your vision convincingly to achieve business success.",
        aliases: [
          "business strategy",
          "startup plan",
          "company plan",
          "business proposal",
        ],
      },
      es: {
        name: "Plan de Negocios",
        description:
          "Aumenta tus posibilidades de obtener financiamiento y atrae inversionistas. Presenta tu visión de negocio de manera profesional y convincente.",
        aliases: [
          "estrategia comercial",
          "plan de inicio",
          "plan de empresa",
          "propuesta de negocio",
        ],
      },
    },
  },
  "buy-sell-agreement": {
    id: "buy-sell-agreement",
    title: "Buy-Sell Agreement",
    description:
      "Plan for your business future by establishing how ownership transfers when partners retire, die, or leave the company.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "buyout agreement",
      "business succession",
      "ownership transfer",
      "acuerdo de compra",
      "sucesión empresarial",
      "transferencia de propiedad",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Buy-Sell Agreement",
        description:
          "Plan for your business future by establishing how ownership transfers when partners retire, die, or leave the company.",
        aliases: [
          "buyout agreement",
          "business succession",
          "ownership transfer",
        ],
      },
      es: {
        name: "Acuerdo de Compra-Venta",
        description:
          "Acuerdo que rige la transferencia de participaciones comerciales ante eventos desencadenantes.",
        aliases: [
          "acuerdo de compra",
          "sucesión empresarial",
          "transferencia de propiedad",
        ],
      },
    },
  },
  "catering-agreement": {
    id: "catering-agreement",
    title: "Catering Agreement",
    description: "Agreement for catering services for events and occasions.",
    category: "Food & Hospitality",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "catering contract",
      "food service agreement",
      "contrato de catering",
      "acuerdo de servicio de comida",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Catering Agreement",
        description:
          "Agreement for catering services for events and occasions.",
        aliases: ["catering contract", "food service agreement"],
      },
      es: {
        name: "Acuerdo de Catering",
        description:
          "Garantiza el éxito de tu evento y evita sorpresas desagradables con el catering. Protege tu inversión con términos claros de servicio.",
        aliases: ["contrato de catering", "acuerdo de servicio de comida"],
      },
    },
  },
  "certificate-substantial-completion": {
    id: "certificate-substantial-completion",
    title: "Certificate of Substantial Completion",
    description:
      "Official certificate documenting substantial completion of construction work for project milestone.",
    category: "Construction",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "substantial completion certificate",
      "completion certificate",
      "project completion document",
      "certificado de finalización sustancial",
      "certificado de finalización",
      "documento de finalización del proyecto",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Certificate of Substantial Completion",
        description:
          "Official certificate documenting substantial completion of construction work for project milestone.",
        aliases: [
          "substantial completion certificate",
          "completion certificate",
          "project completion document",
        ],
      },
      es: {
        name: "Certificado de Finalización Sustancial",
        description:
          "Protege tu inversión en construcción y activa garantías de trabajo. Formaliza la finalización del proyecto para liberar pagos pendientes.",
        aliases: [
          "certificado de finalización sustancial",
          "certificado de finalización",
          "documento de finalización del proyecto",
        ],
      },
    },
  },
  "change-order": {
    id: "change-order",
    title: "Change Order",
    description:
      "Create a formal change order to modify project scope, timeline, or budget.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "change order",
      "project change request",
      "modification order",
      "orden de cambio",
      "solicitud de cambio de proyecto",
      "orden de modificación",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Change Order",
        description:
          "Create a formal change order to modify project scope, timeline, or budget.",
        aliases: [
          "change order",
          "project change request",
          "modification order",
        ],
      },
      es: {
        name: "Orden de Cambio",
        description:
          "Adaptá proyectos a nuevas necesidades sin perder control del presupuesto. Documenta cambios para evitar disputas y sobrecostos inesperados.",
        aliases: [
          "orden de cambio",
          "solicitud de cambio de proyecto",
          "orden de modificación",
        ],
      },
    },
  },
  "child-care-authorization-form": {
    id: "child-care-authorization-form",
    title: "Child Care Authorization Form",
    description:
      "Authorization form for temporary child care and emergency decisions.",
    category: "Family & Personal",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "childcare authorization",
      "temporary custody form",
      "autorización de cuidado infantil",
      "formulario de custodia temporal",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Child Care Authorization Form",
        description:
          "Authorization form for temporary child care and emergency decisions.",
        aliases: ["childcare authorization", "temporary custody form"],
      },
      es: {
        name: "Formulario de Autorización de Cuidado Infantil",
        description:
          "Da tranquilidad cuando viajas o trabajas al autorizar cuidado médico de emergencia para tus hijos. Evita retrasos críticos en tratamientos.",
        aliases: [
          "autorización de cuidado infantil",
          "formulario de custodia temporal",
        ],
      },
    },
  },
  "child-care-contract": {
    id: "child-care-contract",
    title: "Child Care Contract",
    description:
      "Agreement between parents and childcare provider for babysitting services.",
    category: "Family & Personal",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "babysitting contract",
      "nanny agreement",
      "childcare agreement",
      "contrato de niñera",
      "acuerdo de cuidado de niños",
      "acuerdo de cuidado infantil",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Child Care Contract",
        description:
          "Agreement between parents and childcare provider for babysitting services.",
        aliases: [
          "babysitting contract",
          "nanny agreement",
          "childcare agreement",
        ],
      },
      es: {
        name: "Contrato de Cuidado Infantil",
        description:
          "Asegura el cuidado seguro de tus hijos y establece expectativas claras con cuidadoras. Protege a tu familia con reglas y protocolos de emergencia.",
        aliases: [
          "contrato de niñera",
          "acuerdo de cuidado de niños",
          "acuerdo de cuidado infantil",
        ],
      },
    },
  },
  "child-custody-agreement": {
    id: "child-custody-agreement",
    title: "Child Custody Agreement",
    description:
      "Protect your children's wellbeing during family transitions. Establish stable custody arrangements that prioritize their needs.",
    category: "Family",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "child custody",
      "custody battle",
      "parenting plan",
      "custodia de hijos",
      "batalla por custodia",
      "plan de crianza",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Child Custody Agreement",
        description:
          "Protect your children's wellbeing during family transitions. Establish stable custody arrangements that prioritize their needs.",
        aliases: ["child custody", "custody battle", "parenting plan"],
      },
      es: {
        name: "Acuerdo de Custodia de Menores",
        description:
          "Protege el bienestar de tus hijos y evita conflictos futuros con tu ex pareja. Establece rutinas estables y derechos claros para ambos padres.",
        aliases: [
          "custodia de hijos",
          "batalla por custodia",
          "plan de crianza",
        ],
      },
    },
  },
  "child-medical-consent": {
    id: "child-medical-consent",
    title: "Child Medical Consent Form",
    description:
      "Authorize a caregiver to make medical decisions for your child.",
    category: "Family",
    jurisdiction: "us",
    tags: [],
    aliases: [],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Child Medical Consent Form",
        description:
          "Authorize a caregiver to make medical decisions for your child.",
        aliases: [],
      },
      es: {
        name: "Formulario de Consentimiento Médico para Menores",
        description:
          "Asegura que tu hijo reciba atención médica inmediata cuando no puedas estar presente. Autoriza tratamientos que pueden salvar vidas.",
        aliases: [],
      },
    },
  },
  "child-support-agreement": {
    id: "child-support-agreement",
    title: "Child Support Agreement",
    description:
      "Comprehensive agreement establishing child support payment terms and responsibilities.",
    category: "Family",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "child support contract",
      "support payment agreement",
      "custody support agreement",
      "contrato de manutención",
      "acuerdo de apoyo financiero",
      "acuerdo de soporte de custodia",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Child Support Agreement",
        description:
          "Comprehensive agreement establishing child support payment terms and responsibilities.",
        aliases: [
          "child support contract",
          "support payment agreement",
          "custody support agreement",
        ],
      },
      es: {
        name: "Acuerdo de Manutención Infantil",
        description:
          "Asegura el futuro financiero de tus hijos y evita disputas sobre gastos. Establece pagos justos que cubran todas las necesidades de los menores.",
        aliases: [
          "contrato de manutención",
          "acuerdo de apoyo financiero",
          "acuerdo de soporte de custodia",
        ],
      },
    },
  },
  "child-travel-consent": {
    id: "child-travel-consent",
    title: "Child Travel Consent",
    description:
      "Consent form for minor children traveling without both parents.",
    category: "Family & Personal",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "minor travel consent",
      "child travel authorization",
      "travel permission letter",
      "consentimiento de viaje menor",
      "autorización de viaje infantil",
      "carta de permiso de viaje",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Child Travel Consent",
        description:
          "Consent form for minor children traveling without both parents.",
        aliases: [
          "minor travel consent",
          "child travel authorization",
          "travel permission letter",
        ],
      },
      es: {
        name: "Consentimiento de Viaje de Menor",
        description:
          "Evita problemas en aeropuertos y fronteras cuando tu hijo viaja sin ambos padres. Garantiza viajes seguros y sin complicaciones legales.",
        aliases: [
          "consentimiento de viaje menor",
          "autorización de viaje infantil",
          "carta de permiso de viaje",
        ],
      },
    },
  },
  "clinical-trial-agreement": {
    id: "clinical-trial-agreement",
    title: "Clinical Trial Agreement",
    description:
      "Agreement for conducting clinical trials and medical research studies.",
    category: "Healthcare & Medical",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "research study agreement",
      "clinical research contract",
      "trial participation agreement",
      "contrato de investigación clínica",
      "acuerdo de estudio médico",
      "acuerdo de participación en el juicio",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Clinical Trial Agreement",
        description:
          "Agreement for conducting clinical trials and medical research studies.",
        aliases: [
          "research study agreement",
          "clinical research contract",
          "trial participation agreement",
        ],
      },
      es: {
        name: "Acuerdo de Ensayo Clínico",
        description:
          "Participa en investigación médica con protección legal completa. Asegura compensación justa y acceso a tratamientos innovadores.",
        aliases: [
          "contrato de investigación clínica",
          "acuerdo de estudio médico",
          "acuerdo de participación en el juicio",
        ],
      },
    },
  },
  "cloud-services-agreement": {
    id: "cloud-services-agreement",
    title: "Cloud Services Agreement",
    description: "Agreement for cloud computing and hosting services.",
    category: "Technology & IT",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "cloud hosting",
      "SaaS agreement",
      "cloud computing contract",
      "hospedaje en la nube",
      "acuerdo SaaS",
      "contrato de computación en la nube",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Cloud Services Agreement",
        description: "Agreement for cloud computing and hosting services.",
        aliases: [
          "cloud hosting",
          "SaaS agreement",
          "cloud computing contract",
        ],
      },
      es: {
        name: "Acuerdo de Servicios en la Nube",
        description:
          "Protege tus datos empresariales y asegura servicios confiables en la nube. Obten garantías de disponibilidad y seguridad para tu negocio.",
        aliases: [
          "hospedaje en la nube",
          "acuerdo SaaS",
          "contrato de computación en la nube",
        ],
      },
    },
  },
  "coaching-agreement": {
    id: "coaching-agreement",
    title: "Coaching Agreement",
    description: "Agreement for professional coaching and mentoring services.",
    category: "Professional Services",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "life coaching",
      "business coaching",
      "mentor agreement",
      "coaching de vida",
      "coaching empresarial",
      "acuerdo de mentor",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Coaching Agreement",
        description:
          "Agreement for professional coaching and mentoring services.",
        aliases: ["life coaching", "business coaching", "mentor agreement"],
      },
      es: {
        name: "Acuerdo de Coaching",
        description:
          "Acelera tu crecimiento personal o profesional con mentoría estructurada. Establece metas claras y mide progreso hacia el éxito.",
        aliases: [
          "coaching de vida",
          "coaching empresarial",
          "acuerdo de mentor",
        ],
      },
    },
  },
  "codicil-to-will": {
    id: "codicil-to-will",
    title: "Codicil to Will",
    description:
      "Make amendments to your existing will without rewriting the entire document.",
    category: "Estate Planning",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "will amendment",
      "will codicil",
      "will modification",
      "enmienda al testamento",
      "modificación de testamento",
      "modificación",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Codicil to Will",
        description:
          "Make amendments to your existing will without rewriting the entire document.",
        aliases: ["will amendment", "will codicil", "will modification"],
      },
      es: {
        name: "Codicilo al Testamento",
        description:
          "Mantén tu testamento actualizado sin costos legales excesivos. Adapta tu herencia a cambios familiares y financieros fácilmente.",
        aliases: [
          "enmienda al testamento",
          "modificación de testamento",
          "modificación",
        ],
      },
    },
  },
  "cohabitation-agreement": {
    id: "cohabitation-agreement",
    title: "Cohabitation Agreement",
    description:
      "Create a legally binding cohabitation agreement for unmarried couples living together to define rights and responsibilities.",
    category: "Family & Personal",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "domestic partnership agreement",
      "living together agreement",
      "unmarried couple agreement",
      "common law agreement",
      "acuerdo de pareja de hecho",
      "acuerdo de convivencia",
      "acuerdo de unión libre",
      "acuerdo de derecho consuetudinario",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Cohabitation Agreement",
        description:
          "Create a legally binding cohabitation agreement for unmarried couples living together to define rights and responsibilities.",
        aliases: [
          "domestic partnership agreement",
          "living together agreement",
          "unmarried couple agreement",
          "common law agreement",
        ],
      },
      es: {
        name: "Acuerdo de Cohabitación",
        description:
          "Protege tu futuro financiero y evita disputas costosas si tu relación termina. Establece derechos claros sobre propiedades y responsabilidades financieras.",
        aliases: [
          "acuerdo de pareja de hecho",
          "acuerdo de convivencia",
          "acuerdo de unión libre",
          "acuerdo de derecho consuetudinario",
        ],
      },
    },
  },
  "collection-letter": {
    id: "collection-letter",
    title: "Collection Letter",
    description:
      "Send professional debt collection letters to recover outstanding payments with legal compliance.",
    category: "Legal",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "debt collection letter",
      "payment demand",
      "collections notice",
      "past due notice",
      "carta de cobranza de deuda",
      "demanda de pago",
      "aviso de cobranza",
      "aviso de vencimiento",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Collection Letter",
        description:
          "Send professional debt collection letters to recover outstanding payments with legal compliance.",
        aliases: [
          "debt collection letter",
          "payment demand",
          "collections notice",
          "past due notice",
        ],
      },
      es: {
        name: "Carta de Cobranza",
        description:
          "Recupera dinero adeudado sin dañar relaciones comerciales. Presiona por pago de manera legal y profesional que motive acción inmediata.",
        aliases: [
          "carta de cobranza de deuda",
          "demanda de pago",
          "aviso de cobranza",
          "aviso de vencimiento",
        ],
      },
    },
  },
  "commercial-lease-agreement": {
    id: "commercial-lease-agreement",
    title: "Commercial Lease Agreement",
    description:
      "Secure the perfect space for your business with favorable terms. Protect your commercial investment and avoid surprises in operating costs.",
    category: "Real Estate",
    jurisdiction: "us",
    tags: [],
    aliases: [],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Commercial Lease Agreement",
        description:
          "Secure the perfect space for your business with favorable terms. Protect your commercial investment and avoid surprises in operating costs.",
        aliases: [],
      },
      es: {
        name: "Contrato de Arrendamiento Comercial",
        description:
          "Asegura el espacio perfecto para tu negocio con términos favorables. Protege tu inversión comercial y evita sorpresas en costos operativos.",
        aliases: [],
      },
    },
  },
  "commercial-lease-with-option-to-purchase": {
    id: "commercial-lease-with-option-to-purchase",
    title: "Commercial Lease with Option to Purchase",
    description:
      "Test commercial locations without committing to purchase immediately. Secure the option to buy successful properties in the future.",
    category: "Business & Commercial",
    jurisdiction: "us",
    tags: [],
    aliases: [],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Commercial Lease with Option to Purchase",
        description:
          "Test commercial locations without committing to purchase immediately. Secure the option to buy successful properties in the future.",
        aliases: [],
      },
      es: {
        name: "Arrendamiento Comercial con Opción de Compra",
        description:
          "Prueba ubicaciones comerciales sin comprometerte a comprar inmediatamente. Asegura la opción de adquirir propiedades exitosas en el futuro.",
        aliases: [],
      },
    },
  },
  "commission-agreement": {
    id: "commission-agreement",
    title: "Commission Agreement",
    description:
      "Comprehensive agreement establishing commission-based compensation structure and terms.",
    category: "Employment",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "sales commission agreement",
      "commission contract",
      "compensation agreement",
      "acuerdo de comisión de ventas",
      "contrato de comisión",
      "acuerdo de compensación",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Commission Agreement",
        description:
          "Comprehensive agreement establishing commission-based compensation structure and terms.",
        aliases: [
          "sales commission agreement",
          "commission contract",
          "compensation agreement",
        ],
      },
      es: {
        name: "Acuerdo de Comisión",
        description:
          "Paga vendedores según lo que vendan. Define porcentajes de comisión, metas de ventas y cuándo se pagan las comisiones.",
        aliases: [
          "acuerdo de comisión de ventas",
          "contrato de comisión",
          "acuerdo de compensación",
        ],
      },
    },
  },
  "complaint-letter": {
    id: "complaint-letter",
    title: "Complaint Letter",
    description:
      "Formal letter to address grievances with businesses or services.",
    category: "Personal & Lifestyle",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "grievance letter",
      "formal complaint",
      "dispute letter",
      "carta de reclamo",
      "queja formal",
      "carta de disputa",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Complaint Letter",
        description:
          "Formal letter to address grievances with businesses or services.",
        aliases: ["grievance letter", "formal complaint", "dispute letter"],
      },
      es: {
        name: "Carta de Queja",
        description:
          "Quéjate formalmente con empresas por mal servicio o productos defectuosos. Aumenta posibilidades de reembolso o compensación.",
        aliases: ["carta de reclamo", "queja formal", "carta de disputa"],
      },
    },
  },
  "confidentiality-agreement": {
    id: "confidentiality-agreement",
    title: "Confidentiality Agreement",
    description:
      "Protect your business secrets and sensitive information from being shared. Prevent competitors from accessing your confidential data.",
    category: "Legal",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "confidential agreement",
      "secrecy agreement",
      "non-disclosure",
      "privacy agreement",
      "acuerdo confidencial",
      "acuerdo de secreto",
      "no divulgación",
      "acuerdo de privacidad",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Confidentiality Agreement",
        description:
          "Protect your business secrets and sensitive information from being shared. Prevent competitors from accessing your confidential data.",
        aliases: [
          "confidential agreement",
          "secrecy agreement",
          "non-disclosure",
          "privacy agreement",
        ],
      },
      es: {
        name: "Acuerdo de Confidencialidad",
        description:
          "Protege tus secretos comerciales y datos confidenciales. Evita que empleados, socios o contratistas compartan tu información privada.",
        aliases: [
          "acuerdo confidencial",
          "acuerdo de secreto",
          "no divulgación",
          "acuerdo de privacidad",
        ],
      },
    },
  },
  "consignment-agreement": {
    id: "consignment-agreement",
    title: "Consignment Agreement",
    description:
      "Expand your sales reach without upfront costs. Sell products through other retailers while maintaining control over pricing and returns.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "consignment contract",
      "consignment deal",
      "sales agreement",
      "contrato de consignación",
      "acuerdo de ventas",
      "acuerdo de venta",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Consignment Agreement",
        description:
          "Expand your sales reach without upfront costs. Sell products through other retailers while maintaining control over pricing and returns.",
        aliases: [
          "consignment contract",
          "consignment deal",
          "sales agreement",
        ],
      },
      es: {
        name: "Acuerdo de Consignación",
        description:
          "Vende productos a través de otra tienda o vendedor. Define quién recibe qué porcentaje de las ventas y qué pasa con productos no vendidos.",
        aliases: [
          "contrato de consignación",
          "acuerdo de ventas",
          "acuerdo de venta",
        ],
      },
    },
  },
  "construction-bid-form": {
    id: "construction-bid-form",
    title: "Construction Bid Form",
    description:
      "Standardized construction bid form for contractors to submit project bids.",
    category: "Construction",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "bid form",
      "contractor bid form",
      "project bid form",
      "formulario de oferta",
      "formulario de oferta de contratista",
      "formulario de oferta del proyecto",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Construction Bid Form",
        description:
          "Standardized construction bid form for contractors to submit project bids.",
        aliases: ["bid form", "contractor bid form", "project bid form"],
      },
      es: {
        name: "Formulario de Oferta de Construcción",
        description:
          "Formulario estandarizado de oferta de construcción para que los contratistas presenten ofertas de proyectos.",
        aliases: [
          "formulario de oferta",
          "formulario de oferta de contratista",
          "formulario de oferta del proyecto",
        ],
      },
    },
  },
  "construction-contract": {
    id: "construction-contract",
    title: "Construction Contract",
    description:
      "Complete your construction project on time and budget. Protect against shoddy work with performance guarantees and clear expectations.",
    category: "Construction",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "building contract",
      "general contractor agreement",
      "construction agreement",
      "contrato de construcción",
      "acuerdo de contratista general",
      "acuerdo de construcción",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Construction Contract",
        description:
          "Complete your construction project on time and budget. Protect against shoddy work with performance guarantees and clear expectations.",
        aliases: [
          "building contract",
          "general contractor agreement",
          "construction agreement",
        ],
      },
      es: {
        name: "Contrato de Construcción",
        description:
          "Protege tu inversión en construcción y evita sobrecostos inesperados. Asegura trabajo de calidad con cronogramas claros y responsabilidades definidas.",
        aliases: [
          "contrato de construcción",
          "acuerdo de contratista general",
          "acuerdo de construcción",
        ],
      },
    },
  },
  "construction-management-agreement": {
    id: "construction-management-agreement",
    title: "Construction Management Agreement",
    description:
      "Professional construction management services agreement between owner and construction manager.",
    category: "Construction",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "CM agreement",
      "construction manager contract",
      "project management agreement",
      "acuerdo de gestión de construcción",
      "contrato de gestor de construcción",
      "acuerdo de gestión de proyectos",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Construction Management Agreement",
        description:
          "Professional construction management services agreement between owner and construction manager.",
        aliases: [
          "CM agreement",
          "construction manager contract",
          "project management agreement",
        ],
      },
      es: {
        name: "Acuerdo de Gestión de Construcción",
        description:
          "Acuerdo de servicios profesionales de gestión de construcción entre propietario y gestor de construcción.",
        aliases: [
          "acuerdo de gestión de construcción",
          "contrato de gestor de construcción",
          "acuerdo de gestión de proyectos",
        ],
      },
    },
  },
  "consulting-agreement": {
    id: "consulting-agreement",
    title: "Consulting Agreement",
    description:
      "Access specialized expertise without the cost of full-time employees. Define project scope and protect your interests with clear terms.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "consultant contract",
      "advisory agreement",
      "professional services agreement",
      "contrato de consultor",
      "acuerdo de asesoría",
      "acuerdo de servicios profesionales",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Consulting Agreement",
        description:
          "Access specialized expertise without the cost of full-time employees. Define project scope and protect your interests with clear terms.",
        aliases: [
          "consultant contract",
          "advisory agreement",
          "professional services agreement",
        ],
      },
      es: {
        name: "Acuerdo de Consultoría",
        description:
          "Obten experiencia especializada sin contratar empleados de tiempo completo. Establece objetivos claros y protege la propiedad intelectual de tu empresa.",
        aliases: [
          "contrato de consultor",
          "acuerdo de asesoría",
          "acuerdo de servicios profesionales",
        ],
      },
    },
  },
  "contract-amendment": {
    id: "contract-amendment",
    title: "Contract Amendment",
    description:
      "Update contracts efficiently without renegotiating everything. Adapt agreements to changing business needs while maintaining legal validity.",
    category: "Legal",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "contract amendment",
      "contract modification",
      "addendum",
      "enmienda de contrato",
      "modificación de contrato",
      "adenda",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Contract Amendment",
        description:
          "Update contracts efficiently without renegotiating everything. Adapt agreements to changing business needs while maintaining legal validity.",
        aliases: ["contract amendment", "contract modification", "addendum"],
      },
      es: {
        name: "Enmienda de Contrato",
        description:
          "Cambia partes de un contrato existente sin tener que volver a escribir todo. Actualiza precios, fechas o condiciones.",
        aliases: ["enmienda de contrato", "modificación de contrato", "adenda"],
      },
    },
  },
  "contract-termination-letter": {
    id: "contract-termination-letter",
    title: "Contract Termination Letter",
    description:
      "End business relationships professionally and avoid legal disputes when terminating contracts. Protect yourself with proper notice and documentation.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "termination notice",
      "contract cancellation",
      "agreement termination",
      "aviso de terminación",
      "cancelación de contrato",
      "terminación de acuerdo",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Contract Termination Letter",
        description:
          "End business relationships professionally and avoid legal disputes when terminating contracts. Protect yourself with proper notice and documentation.",
        aliases: [
          "termination notice",
          "contract cancellation",
          "agreement termination",
        ],
      },
      es: {
        name: "Carta de Terminación de Contrato",
        description:
          "Cancela un contrato existente de manera legal y profesional. Evita problemas legales al terminar acuerdos comerciales.",
        aliases: [
          "aviso de terminación",
          "cancelación de contrato",
          "terminación de acuerdo",
        ],
      },
    },
  },
  "copyright-assignment": {
    id: "copyright-assignment",
    title: "Copyright Assignment Agreement",
    description:
      "Protect your creative work and control how it's used. Transfer copyright ownership while retaining specific rights that benefit you.",
    category: "Intellectual Property",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "copyright assignment contract",
      "copyright transfer",
      "intellectual property assignment",
      "contrato de asignación de derechos de autor",
      "transferencia de derechos de autor",
      "asignación de propiedad intelectual",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Copyright Assignment Agreement",
        description:
          "Protect your creative work and control how it's used. Transfer copyright ownership while retaining specific rights that benefit you.",
        aliases: [
          "copyright assignment contract",
          "copyright transfer",
          "intellectual property assignment",
        ],
      },
      es: {
        name: "Acuerdo de Asignación de Derechos de Autor",
        description:
          "Transfiere ownership de contenido creativo (arte, música, escritos, software) a otra persona o empresa. Especifica qué derechos se transfieren.",
        aliases: [
          "contrato de asignación de derechos de autor",
          "transferencia de derechos de autor",
          "asignación de propiedad intelectual",
        ],
      },
    },
  },
  "copyright-assignment-agreement": {
    id: "copyright-assignment-agreement",
    title: "Copyright Assignment Agreement",
    description:
      "Secure your creative business deals by properly transferring copyright ownership with full legal protection.",
    category: "Intellectual Property",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "copyright transfer",
      "copyright conveyance",
      "intellectual property assignment",
      "transferencia de derechos de autor",
      "cesión de propiedad intelectual",
      "asignación de propiedad intelectual",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Copyright Assignment Agreement",
        description:
          "Secure your creative business deals by properly transferring copyright ownership with full legal protection.",
        aliases: [
          "copyright transfer",
          "copyright conveyance",
          "intellectual property assignment",
        ],
      },
      es: {
        name: "Acuerdo de Cesión de Derechos de Autor",
        description:
          "Acuerdo integral para transferir la propiedad de derechos de autor de obras creativas.",
        aliases: [
          "transferencia de derechos de autor",
          "cesión de propiedad intelectual",
          "asignación de propiedad intelectual",
        ],
      },
    },
  },
  "copyright-license-agreement": {
    id: "copyright-license-agreement",
    title: "Copyright License Agreement",
    description: "Professional copyright license agreement document.",
    category: "Legal",
    jurisdiction: "us",
    tags: [],
    aliases: ["copyright license agreement"],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Copyright License Agreement",
        description: "Professional copyright license agreement document.",
        aliases: ["copyright license agreement"],
      },
      es: {
        name: "Acuerdo de Licencia de Derechos de Autor",
        description:
          "Permite que otros usen tu contenido creativo (música, arte, escritos) bajo condiciones específicas que tú estableces.",
        aliases: ["copyright license agreement"],
      },
    },
  },
  "corporate-bylaws": {
    id: "corporate-bylaws",
    title: "Corporate Bylaws",
    description:
      "Establish professional governance that attracts investors and ensures compliance. Run your corporation smoothly with clear operational rules.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "company bylaws",
      "corporate governance",
      "bylaws",
      "corporate rules",
      "estatutos de la empresa",
      "gobierno corporativo",
      "estatutos",
      "reglas corporativas",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Corporate Bylaws",
        description:
          "Establish professional governance that attracts investors and ensures compliance. Run your corporation smoothly with clear operational rules.",
        aliases: [
          "company bylaws",
          "corporate governance",
          "bylaws",
          "corporate rules",
        ],
      },
      es: {
        name: "Estatutos Corporativos",
        description:
          "Define las reglas internas de tu empresa corporativa. Cubre juntas directivas, votaciones, roles de ejecutivos y procedimientos operativos.",
        aliases: [
          "estatutos de la empresa",
          "gobierno corporativo",
          "estatutos",
          "reglas corporativas",
        ],
      },
    },
  },
  "court-filing-document": {
    id: "court-filing-document",
    title: "Court Filing Document",
    description:
      "Present your case professionally with properly formatted court documents that meet legal requirements.",
    category: "Government & Legal Services",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "legal pleading",
      "court document",
      "legal filing",
      "alegato legal",
      "documento judicial",
      "presentación legal",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Court Filing Document",
        description:
          "Present your case professionally with properly formatted court documents that meet legal requirements.",
        aliases: ["legal pleading", "court document", "legal filing"],
      },
      es: {
        name: "Documento de Presentación Judicial",
        description:
          "Plantilla general para documentos de presentación judicial y alegatos legales.",
        aliases: ["alegato legal", "documento judicial", "presentación legal"],
      },
    },
  },
  "credit-card-agreement": {
    id: "credit-card-agreement",
    title: "Credit Card Agreement",
    description: "Agreement outlining terms for credit card use and payment.",
    category: "Finance & Lending",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "credit agreement",
      "cardholder agreement",
      "acuerdo de crédito",
      "contrato de tarjetahabiente",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Credit Card Agreement",
        description:
          "Agreement outlining terms for credit card use and payment.",
        aliases: ["credit agreement", "cardholder agreement"],
      },
      es: {
        name: "Acuerdo de Tarjeta de Crédito",
        description:
          "Acuerdo que describe los términos de uso y pago de tarjeta de crédito.",
        aliases: ["acuerdo de crédito", "contrato de tarjetahabiente"],
      },
    },
  },
  "crop-sharing-agreement": {
    id: "crop-sharing-agreement",
    title: "Crop Sharing Agreement",
    description: "Agreement for crop sharing and agricultural partnerships.",
    category: "Agriculture & Farming",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "sharecropping agreement",
      "farm partnership",
      "acuerdo de aparcería",
      "sociedad agrícola",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Crop Sharing Agreement",
        description:
          "Agreement for crop sharing and agricultural partnerships.",
        aliases: ["sharecropping agreement", "farm partnership"],
      },
      es: {
        name: "Acuerdo de Participación de Cultivos",
        description:
          "Acuerdo para participación de cultivos y asociaciones agrícolas.",
        aliases: ["acuerdo de aparcería", "sociedad agrícola"],
      },
    },
  },
  "cryptocurrency-agreement": {
    id: "cryptocurrency-agreement",
    title: "Cryptocurrency Agreement",
    description:
      "Agreement for cryptocurrency transactions, trading, and digital asset services.",
    category: "Digital Assets & Blockchain",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "crypto agreement",
      "digital asset agreement",
      "blockchain agreement",
      "acuerdo crypto",
      "acuerdo de activos digitales",
      "acuerdo de blockchain",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Cryptocurrency Agreement",
        description:
          "Agreement for cryptocurrency transactions, trading, and digital asset services.",
        aliases: [
          "crypto agreement",
          "digital asset agreement",
          "blockchain agreement",
        ],
      },
      es: {
        name: "Acuerdo de Criptomonedas",
        description:
          "Acuerdo para transacciones de criptomonedas, comercio y servicios de activos digitales.",
        aliases: [
          "acuerdo crypto",
          "acuerdo de activos digitales",
          "acuerdo de blockchain",
        ],
      },
    },
  },
  "cybersecurity-agreement": {
    id: "cybersecurity-agreement",
    title: "Cybersecurity Agreement",
    description: "Agreement for cybersecurity services and protection.",
    category: "Technology & IT",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "IT security agreement",
      "information security contract",
      "acuerdo de seguridad IT",
      "contrato de seguridad informática",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Cybersecurity Agreement",
        description: "Agreement for cybersecurity services and protection.",
        aliases: ["IT security agreement", "information security contract"],
      },
      es: {
        name: "Acuerdo de Ciberseguridad",
        description:
          "Contrata servicios para proteger tu negocio de hackers y ataques cibernéticos. Define responsabilidades y protocolos de seguridad.",
        aliases: [
          "acuerdo de seguridad IT",
          "contrato de seguridad informática",
        ],
      },
    },
  },
  "data-processing-agreement": {
    id: "data-processing-agreement",
    title: "Data Processing Agreement",
    description:
      "Agreement governing the processing and handling of personal data and information.",
    category: "Technology & IT",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "DPA",
      "data handling agreement",
      "privacy agreement",
      "acuerdo de manejo de datos",
      "acuerdo de privacidad",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Data Processing Agreement",
        description:
          "Agreement governing the processing and handling of personal data and information.",
        aliases: ["DPA", "data handling agreement", "privacy agreement"],
      },
      es: {
        name: "Acuerdo de Procesamiento de Datos",
        description:
          "Protege la privacidad de datos de clientes cuando trabajas con terceros. Define cómo se manejan y protegen datos personales.",
        aliases: ["DPA", "acuerdo de manejo de datos", "acuerdo de privacidad"],
      },
    },
  },
  "debt-settlement-agreement": {
    id: "debt-settlement-agreement",
    title: "Debt Settlement Agreement",
    description:
      "Settle outstanding debt for less than the full amount owed with structured payment terms.",
    category: "Finance",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "debt compromise",
      "settlement deal",
      "debt resolution",
      "payment settlement",
      "compromiso de deuda",
      "acuerdo de liquidación",
      "resolución de deuda",
      "liquidación de pago",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Debt Settlement Agreement",
        description:
          "Settle outstanding debt for less than the full amount owed with structured payment terms.",
        aliases: [
          "debt compromise",
          "settlement deal",
          "debt resolution",
          "payment settlement",
        ],
      },
      es: {
        name: "Acuerdo de Liquidación de Deuda",
        description:
          "Negocia pagar menos de lo que debes. Acuerdo legal que reduce tu deuda total a cambio de pagos inmediatos o un plan de pagos.",
        aliases: [
          "compromiso de deuda",
          "acuerdo de liquidación",
          "resolución de deuda",
          "liquidación de pago",
        ],
      },
    },
  },
  "debt-validation-letter": {
    id: "debt-validation-letter",
    title: "Debt Validation Letter",
    description:
      "Protect yourself from unfair debt collection by demanding proof that claimed debts are legitimate and accurate.",
    category: "Legal",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "debt dispute letter",
      "validation request",
      "debt verification",
      "collector challenge",
      "carta de disputa de deuda",
      "solicitud de validación",
      "verificación de deuda",
      "desafío de cobrador",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Debt Validation Letter",
        description:
          "Protect yourself from unfair debt collection by demanding proof that claimed debts are legitimate and accurate.",
        aliases: [
          "debt dispute letter",
          "validation request",
          "debt verification",
          "collector challenge",
        ],
      },
      es: {
        name: "Carta de Validación de Deuda",
        description:
          "Solicitar validación de deuda de cobradores para verificar legitimidad y precisión de la deuda reclamada.",
        aliases: [
          "carta de disputa de deuda",
          "solicitud de validación",
          "verificación de deuda",
          "desafío de cobrador",
        ],
      },
    },
  },
  "demand-letter": {
    id: "demand-letter",
    title: "Demand Letter for Payment",
    description:
      "Get paid faster and avoid costly legal fees by demanding payment professionally. Show you are serious about collecting debts before involving courts.",
    category: "Legal",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "payment demand letter",
      "collection letter",
      "notice of demand",
      "carta de cobro",
      "aviso de demanda",
      "carta de reclamación",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Demand Letter for Payment",
        description:
          "Get paid faster and avoid costly legal fees by demanding payment professionally. Show you are serious about collecting debts before involving courts.",
        aliases: [
          "payment demand letter",
          "collection letter",
          "notice of demand",
        ],
      },
      es: {
        name: "Carta de Demanda de Pago",
        description:
          "Crea una Carta de Demanda de Pago legalmente válida con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.",
        aliases: ["carta de cobro", "aviso de demanda", "carta de reclamación"],
      },
    },
  },
  "demand-letter-payment": {
    id: "demand-letter-payment",
    title: "Demand Letter (Payment)",
    description: "Formally request payment that is overdue.",
    category: "Finance",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "request payment",
      "owe money",
      "legal demand",
      "solicitar pago",
      "deber dinero",
      "demanda legal",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Demand Letter (Payment)",
        description: "Formally request payment that is overdue.",
        aliases: ["request payment", "owe money", "legal demand"],
      },
      es: {
        name: "Carta de Reclamación (Pago)",
        description:
          "Exige pago por facturas vencidas o deudas. Aviso final claro antes de buscar cobro o acción legal.",
        aliases: ["solicitar pago", "deber dinero", "demanda legal"],
      },
    },
  },
  "digital-asset-agreement": {
    id: "digital-asset-agreement",
    title: "Digital Asset Agreement",
    description:
      "Agreement for trading, managing, and transferring digital assets and cryptocurrencies.",
    category: "Technology & IT",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "crypto agreement",
      "nft agreement",
      "blockchain asset agreement",
      "acuerdo crypto",
      "contrato de NFT",
      "acuerdo de activos de blockchain",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Digital Asset Agreement",
        description:
          "Agreement for trading, managing, and transferring digital assets and cryptocurrencies.",
        aliases: [
          "crypto agreement",
          "nft agreement",
          "blockchain asset agreement",
        ],
      },
      es: {
        name: "Acuerdo de Activos Digitales",
        description:
          "Acuerdo para comerciar, gestionar y transferir activos digitales y criptomonedas.",
        aliases: [
          "acuerdo crypto",
          "contrato de NFT",
          "acuerdo de activos de blockchain",
        ],
      },
    },
  },
  "direct-deposit-form": {
    id: "direct-deposit-form",
    title: "Direct Deposit Authorization Form",
    description: "Authorization form for employee direct deposit of payroll",
    category: "HR",
    jurisdiction: "us",
    tags: [],
    aliases: [],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Direct Deposit Authorization Form",
        description:
          "Authorization form for employee direct deposit of payroll",
        aliases: [],
      },
      es: {
        name: "Direct Deposit Authorization Form",
        description:
          "Authorization form for employee direct deposit of payroll",
        aliases: [],
      },
    },
  },
  "divorce-settlement-agreement": {
    id: "divorce-settlement-agreement",
    title: "Divorce Settlement Agreement",
    description:
      "Formalizes the terms of a divorce, including property division, support, and custody.",
    category: "Family",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "divorce",
      "separation",
      "end marriage",
      "get divorced",
      "marital settlement",
      "divorcio",
      "separación",
      "terminar matrimonio",
      "divorciarse",
      "acuerdo matrimonial",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Divorce Settlement Agreement",
        description:
          "Formalizes the terms of a divorce, including property division, support, and custody.",
        aliases: [
          "divorce",
          "separation",
          "end marriage",
          "get divorced",
          "marital settlement",
        ],
      },
      es: {
        name: "Acuerdo de Divorcio",
        description:
          "Asegura tu futuro y formaliza los términos del divorcio, incluyendo división equitativa de propiedades, pensión alimenticia y custodia de los hijos.",
        aliases: [
          "divorcio",
          "separación",
          "terminar matrimonio",
          "divorciarse",
          "acuerdo matrimonial",
        ],
      },
    },
  },
  "dog-breeding-agreement": {
    id: "dog-breeding-agreement",
    title: "Dog Breeding Agreement",
    description: "Agreement for dog breeding and stud services.",
    category: "Agriculture & Farming",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "stud service agreement",
      "breeding contract",
      "contrato de cría",
      "acuerdo de semental",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Dog Breeding Agreement",
        description: "Agreement for dog breeding and stud services.",
        aliases: ["stud service agreement", "breeding contract"],
      },
      es: {
        name: "Acuerdo de Cría de Perros",
        description: "Acuerdo para cría de perros y servicios de semental.",
        aliases: ["contrato de cría", "acuerdo de semental"],
      },
    },
  },
  "donation-agreement": {
    id: "donation-agreement",
    title: "Donation Agreement",
    description: "Agreement for charitable donations and gifts.",
    category: "Personal & Lifestyle",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "gift agreement",
      "charitable donation",
      "pledge agreement",
      "acuerdo de regalo",
      "donación caritativa",
      "acuerdo de compromiso",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Donation Agreement",
        description: "Agreement for charitable donations and gifts.",
        aliases: ["gift agreement", "charitable donation", "pledge agreement"],
      },
      es: {
        name: "Acuerdo de Donación",
        description: "Acuerdo para donaciones caritativas y regalos.",
        aliases: [
          "acuerdo de regalo",
          "donación caritativa",
          "acuerdo de compromiso",
        ],
      },
    },
  },
  "durable-power-of-attorney": {
    id: "durable-power-of-attorney",
    title: "Durable Power of Attorney",
    description:
      "Grant someone authority to act on your behalf for financial and legal matters, even if you become incapacitated.",
    category: "Estate Planning",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "financial power of attorney",
      "general power of attorney",
      "durable POA",
      "poder financiero",
      "poder general",
      "POA duradero",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Durable Power of Attorney",
        description:
          "Grant someone authority to act on your behalf for financial and legal matters, even if you become incapacitated.",
        aliases: [
          "financial power of attorney",
          "general power of attorney",
          "durable POA",
        ],
      },
      es: {
        name: "Poder Duradero",
        description:
          "Otorga a alguien autoridad para actuar en tu nombre en asuntos financieros y legales, incluso si quedas incapacitado.",
        aliases: ["poder financiero", "poder general", "POA duradero"],
      },
    },
  },
  "earnest-money-agreement": {
    id: "earnest-money-agreement",
    title: "Earnest Money Agreement",
    description:
      "Secure your real estate purchase by properly handling earnest money deposits with clear refund conditions.",
    category: "Real Estate & Property",
    jurisdiction: "us",
    tags: [],
    aliases: [],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Earnest Money Agreement",
        description:
          "Secure your real estate purchase by properly handling earnest money deposits with clear refund conditions.",
        aliases: [],
      },
      es: {
        name: "Acuerdo de depósito en garantía",
        description:
          "Asegura tu compra de bienes raíces gestionando correctamente el depósito en garantía con condiciones claras de reembolso.",
        aliases: [],
      },
    },
  },
  "ecommerce-terms-of-service": {
    id: "ecommerce-terms-of-service",
    title: "E-commerce Terms of Service",
    description:
      "Terms of service agreement for online retail and e-commerce businesses.",
    category: "Business & Commercial",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "online store terms",
      "website terms",
      "user agreement",
      "términos de tienda en línea",
      "acuerdo de usuario",
      "acuerdo de usuario legal",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "E-commerce Terms of Service",
        description:
          "Terms of service agreement for online retail and e-commerce businesses.",
        aliases: ["online store terms", "website terms", "user agreement"],
      },
      es: {
        name: "Términos de Servicio de Comercio Electrónico",
        description:
          "Acuerdo de términos de servicio para negocios de venta en línea.",
        aliases: [
          "términos de tienda en línea",
          "acuerdo de usuario",
          "acuerdo de usuario legal",
        ],
      },
    },
  },
  "education-trust": {
    id: "education-trust",
    title: "Education Trust",
    description:
      "Secure your children's educational future while saving on taxes with a dedicated trust fund for school expenses.",
    category: "Estate Planning",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "educational trust",
      "tuition trust",
      "scholarship trust",
      "529 trust alternative",
      "fideicomiso educacional",
      "fideicomiso de matrícula",
      "fideicomiso de beca",
      "529 alternativa de confianza",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Education Trust",
        description:
          "Secure your children's educational future while saving on taxes with a dedicated trust fund for school expenses.",
        aliases: [
          "educational trust",
          "tuition trust",
          "scholarship trust",
          "529 trust alternative",
        ],
      },
      es: {
        name: "Fideicomiso Educativo",
        description:
          "Un fideicomiso especializado diseñado para financiar gastos educativos para beneficiarios con ventajas fiscales.",
        aliases: [
          "fideicomiso educacional",
          "fideicomiso de matrícula",
          "fideicomiso de beca",
          "529 alternativa de confianza",
        ],
      },
    },
  },
  "elder-care-agreement": {
    id: "elder-care-agreement",
    title: "Elder Care Agreement",
    description:
      "Ensure quality care for your loved ones with clear agreements that protect both caregiver and family.",
    category: "Family & Personal",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "senior care agreement",
      "caregiving agreement",
      "elderly care contract",
      "contrato de cuidador",
      "acuerdo de cuidado",
      "contrato de atención de ancianos",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Elder Care Agreement",
        description:
          "Ensure quality care for your loved ones with clear agreements that protect both caregiver and family.",
        aliases: [
          "senior care agreement",
          "caregiving agreement",
          "elderly care contract",
        ],
      },
      es: {
        name: "Acuerdo de Cuidado de Ancianos",
        description:
          "Acuerdo para proporcionar servicios de cuidado a personas mayores.",
        aliases: [
          "contrato de cuidador",
          "acuerdo de cuidado",
          "contrato de atención de ancianos",
        ],
      },
    },
  },
  "employee-bonus-plan": {
    id: "employee-bonus-plan",
    title: "Employee Bonus Plan",
    description:
      "Structured bonus plan document outlining performance-based compensation and incentive programs.",
    category: "Employment",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "incentive plan",
      "performance bonus structure",
      "employee rewards program",
      "plan de incentivos",
      "estructura de bonificación por rendimiento",
      "programa de recompensas para empleados",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Employee Bonus Plan",
        description:
          "Structured bonus plan document outlining performance-based compensation and incentive programs.",
        aliases: [
          "incentive plan",
          "performance bonus structure",
          "employee rewards program",
        ],
      },
      es: {
        name: "Plan de Bonificación de Empleados",
        description:
          "Documento de plan de bonificación estructurado que describe la compensación basada en el rendimiento y los programas de incentivos.",
        aliases: [
          "plan de incentivos",
          "estructura de bonificación por rendimiento",
          "programa de recompensas para empleados",
        ],
      },
    },
  },
  "employee-evaluation-form": {
    id: "employee-evaluation-form",
    title: "Employee Evaluation Form",
    description:
      "Comprehensive employee performance evaluation and review form.",
    category: "Employment",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "performance review",
      "employee assessment",
      "annual review",
      "revisión de desempeño",
      "evaluación anual",
      "revisión anual",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Employee Evaluation Form",
        description:
          "Comprehensive employee performance evaluation and review form.",
        aliases: ["performance review", "employee assessment", "annual review"],
      },
      es: {
        name: "Formulario de Evaluación de Empleado",
        description:
          "Formulario integral de evaluación y revisión del desempeño del empleado.",
        aliases: [
          "revisión de desempeño",
          "evaluación anual",
          "revisión anual",
        ],
      },
    },
  },
  "employee-handbook": {
    id: "employee-handbook",
    title: "Employee Handbook",
    description:
      "Comprehensive employee handbook covering policies, procedures, and workplace guidelines.",
    category: "Employment",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "staff handbook",
      "employee manual",
      "workplace policies",
      "manual de personal",
      "políticas laborales",
      "políticas en el lugar de trabajo",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Employee Handbook",
        description:
          "Comprehensive employee handbook covering policies, procedures, and workplace guidelines.",
        aliases: ["staff handbook", "employee manual", "workplace policies"],
      },
      es: {
        name: "Manual del Empleado",
        description:
          "Manual integral del empleado que cubre políticas, procedimientos y pautas del lugar de trabajo.",
        aliases: [
          "manual de personal",
          "políticas laborales",
          "políticas en el lugar de trabajo",
        ],
      },
    },
  },
  "employee-non-disclosure-agreement": {
    id: "employee-non-disclosure-agreement",
    title: "Employee Non-Disclosure Agreement",
    description:
      "Employee-specific confidentiality and non-disclosure agreement",
    category: "Legal",
    jurisdiction: "us",
    tags: [],
    aliases: [],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Employee Non-Disclosure Agreement",
        description:
          "Employee-specific confidentiality and non-disclosure agreement",
        aliases: [],
      },
      es: {
        name: "Employee Non-Disclosure Agreement",
        description:
          "Employee-specific confidentiality and non-disclosure agreement",
        aliases: [],
      },
    },
  },
  "employee-warning-notice": {
    id: "employee-warning-notice",
    title: "Employee Warning Notice",
    description: "Formal disciplinary warning notice for employee misconduct",
    category: "HR",
    jurisdiction: "us",
    tags: [],
    aliases: [],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Employee Warning Notice",
        description:
          "Formal disciplinary warning notice for employee misconduct",
        aliases: [],
      },
      es: {
        name: "Employee Warning Notice",
        description:
          "Formal disciplinary warning notice for employee misconduct",
        aliases: [],
      },
    },
  },
  "employment-contract": {
    id: "employment-contract",
    title: "Employment Contract",
    description:
      "Protect your business and establish clear expectations with new employees. Avoid misunderstandings about salary, benefits, and job responsibilities.",
    category: "Employment",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "employment agreement",
      "job contract",
      "work agreement",
      "employee contract",
      "acuerdo de empleo",
      "contrato laboral",
      "acuerdo de trabajo",
      "contrato de empleados",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Employment Contract",
        description:
          "Protect your business and establish clear expectations with new employees. Avoid misunderstandings about salary, benefits, and job responsibilities.",
        aliases: [
          "employment agreement",
          "job contract",
          "work agreement",
          "employee contract",
        ],
      },
      es: {
        name: "Contrato de Empleo",
        description:
          "Protege tu negocio y establece expectativas claras con nuevos empleados. Evita malentendidos sobre salario, beneficios y responsabilidades laborales.",
        aliases: [
          "acuerdo de empleo",
          "contrato laboral",
          "acuerdo de trabajo",
          "contrato de empleados",
        ],
      },
    },
  },
  "employment-offer-letter": {
    id: "employment-offer-letter",
    title: "Employment Offer Letter",
    description:
      "Formalize a job offer with key terms like salary, start date, and position.",
    category: "Employment",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "hire employee",
      "job offer",
      "terms of employment",
      "contratar empleado",
      "oferta de trabajo",
      "términos de empleo",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Employment Offer Letter",
        description:
          "Formalize a job offer with key terms like salary, start date, and position.",
        aliases: ["hire employee", "job offer", "terms of employment"],
      },
      es: {
        name: "Carta de Oferta de Empleo",
        description:
          "Formalizar una oferta de trabajo con términos clave como salario, fecha de inicio y puesto.",
        aliases: [
          "contratar empleado",
          "oferta de trabajo",
          "términos de empleo",
        ],
      },
    },
  },
  "employment-termination-letter": {
    id: "employment-termination-letter",
    title: "Employment Termination Letter",
    description: "Formally notify an employee of their termination.",
    category: "Employment",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "fire employee",
      "layoff letter",
      "termination notice",
      "despedir empleado",
      "carta de despido",
      "aviso de terminación",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Employment Termination Letter",
        description: "Formally notify an employee of their termination.",
        aliases: ["fire employee", "layoff letter", "termination notice"],
      },
      es: {
        name: "Carta de Terminación de Empleo",
        description:
          "Despide empleados de manera profesional y legal. Incluye razones del despido y información sobre beneficios finales.",
        aliases: [
          "despedir empleado",
          "carta de despido",
          "aviso de terminación",
        ],
      },
    },
  },
  "employment-verification-letter": {
    id: "employment-verification-letter",
    title: "Employment Verification Letter",
    description:
      "Official letter confirming employee status, salary, and employment details.",
    category: "Employment",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "employment letter",
      "verification of employment",
      "salary verification",
      "carta de empleo",
      "verificación de empleo",
      "verificación salarial",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Employment Verification Letter",
        description:
          "Official letter confirming employee status, salary, and employment details.",
        aliases: [
          "employment letter",
          "verification of employment",
          "salary verification",
        ],
      },
      es: {
        name: "Carta de Verificación de Empleo",
        description:
          "Carta oficial que confirma el estado del empleado, salario y detalles del empleo.",
        aliases: [
          "carta de empleo",
          "verificación de empleo",
          "verificación salarial",
        ],
      },
    },
  },
  "endorsement-agreement": {
    id: "endorsement-agreement",
    title: "Endorsement Agreement",
    description:
      "Agreement for celebrity, influencer, or spokesperson endorsement services.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "Influencer agreement",
      "Spokesperson agreement",
      "Celebrity endorsement contract",
      "Acuerdo influencer",
      "Contrato portavoz",
      "Contrato patrocinio celebridad",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Endorsement Agreement",
        description:
          "Agreement for celebrity, influencer, or spokesperson endorsement services.",
        aliases: [
          "Influencer agreement",
          "Spokesperson agreement",
          "Celebrity endorsement contract",
        ],
      },
      es: {
        name: "Acuerdo de Patrocinio",
        description:
          "Acuerdo para servicios de patrocinio de celebridades, influencers o portavoces.",
        aliases: [
          "Acuerdo influencer",
          "Contrato portavoz",
          "Contrato patrocinio celebridad",
        ],
      },
    },
  },
  "environmental-agreement": {
    id: "environmental-agreement",
    title: "Environmental Agreement",
    description:
      "Protect the environment and meet regulatory requirements with agreements that ensure sustainable business practices.",
    category: "Environmental & Energy",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "environmental compliance agreement",
      "conservation agreement",
      "sustainability contract",
      "acuerdo de cumplimiento ambiental",
      "acuerdo de conservación",
      "contrato de sostenibilidad",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Environmental Agreement",
        description:
          "Protect the environment and meet regulatory requirements with agreements that ensure sustainable business practices.",
        aliases: [
          "environmental compliance agreement",
          "conservation agreement",
          "sustainability contract",
        ],
      },
      es: {
        name: "Acuerdo Ambiental",
        description:
          "Acuerdo para cumplimiento ambiental, conservación y proyectos de sostenibilidad.",
        aliases: [
          "acuerdo de cumplimiento ambiental",
          "acuerdo de conservación",
          "contrato de sostenibilidad",
        ],
      },
    },
  },
  "equipment-rental-agreement": {
    id: "equipment-rental-agreement",
    title: "Equipment Rental Agreement",
    description:
      "Access expensive equipment without the huge investment of buying. Protect your rental business with damage deposits and liability terms.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "equipment lease",
      "machinery rental",
      "tool rental agreement",
      "equipment hire agreement",
      "arrendamiento de equipos",
      "alquiler de maquinaria",
      "acuerdo de alquiler de herramientas",
      "acuerdo de alquiler de equipos",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Equipment Rental Agreement",
        description:
          "Access expensive equipment without the huge investment of buying. Protect your rental business with damage deposits and liability terms.",
        aliases: [
          "equipment lease",
          "machinery rental",
          "tool rental agreement",
          "equipment hire agreement",
        ],
      },
      es: {
        name: "Acuerdo de Alquiler de Equipos",
        description:
          "Renta herramientas o maquinaria pesada de manera segura. Define costos, depósitos, responsabilidades y qué pasa si se daña el equipo.",
        aliases: [
          "arrendamiento de equipos",
          "alquiler de maquinaria",
          "acuerdo de alquiler de herramientas",
          "acuerdo de alquiler de equipos",
        ],
      },
    },
  },
  "equity-incentive-plan": {
    id: "equity-incentive-plan",
    title: "Equity Incentive Plan",
    description:
      "Motivate and retain top employees by offering ownership stakes through stock options and equity rewards.",
    category: "Employment",
    jurisdiction: "us",
    tags: [],
    aliases: [],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Equity Incentive Plan",
        description:
          "Motivate and retain top employees by offering ownership stakes through stock options and equity rewards.",
        aliases: [],
      },
      es: {
        name: "Equity Incentive Plan",
        description: "Comprehensive stock option and equity compensation plan",
        aliases: [],
      },
    },
  },
  "event-planning-contract": {
    id: "event-planning-contract",
    title: "Event Planning Contract",
    description:
      "Contract between event planner and client for event planning services.",
    category: "Personal & Lifestyle",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "event planner agreement",
      "party planning contract",
      "wedding planning contract",
      "acuerdo de planificador de eventos",
      "contrato de planificación de bodas",
      "contrato de planificación de bodas legal",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Event Planning Contract",
        description:
          "Contract between event planner and client for event planning services.",
        aliases: [
          "event planner agreement",
          "party planning contract",
          "wedding planning contract",
        ],
      },
      es: {
        name: "Contrato de Planificación de Eventos",
        description:
          "Contrato entre planificador de eventos y cliente para servicios de planificación.",
        aliases: [
          "acuerdo de planificador de eventos",
          "contrato de planificación de bodas",
          "contrato de planificación de bodas legal",
        ],
      },
    },
  },
  "eviction-notice": {
    id: "eviction-notice",
    title: "Eviction Notice",
    description:
      "Protect your rental income and remove problem tenants legally. Required first step before filing eviction in court.",
    category: "Real Estate",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "remove tenant",
      "late rent",
      "kick out",
      "notice to quit",
      "desalojar inquilino",
      "renta atrasada",
      "echar",
      "notificación de desalojo",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Eviction Notice",
        description:
          "Protect your rental income and remove problem tenants legally. Required first step before filing eviction in court.",
        aliases: ["remove tenant", "late rent", "kick out", "notice to quit"],
      },
      es: {
        name: "Aviso de Desalojo",
        description:
          "Notifica legalmente a los inquilinos que deben abandonar tu propiedad. Primer paso requerido antes de presentar desalojo en corte.",
        aliases: [
          "desalojar inquilino",
          "renta atrasada",
          "echar",
          "notificación de desalojo",
        ],
      },
    },
  },
  "executive-employment-agreement": {
    id: "executive-employment-agreement",
    title: "Executive Employment Agreement",
    description:
      "Attract top executive talent with comprehensive contracts that offer competitive benefits, clear expectations, and strong protections.",
    category: "Employment",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "executive contract",
      "C-level agreement",
      "senior management contract",
      "contrato ejecutivo",
      "acuerdo de nivel C",
      "contrato de alta gerencia",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Executive Employment Agreement",
        description:
          "Attract top executive talent with comprehensive contracts that offer competitive benefits, clear expectations, and strong protections.",
        aliases: [
          "executive contract",
          "C-level agreement",
          "senior management contract",
        ],
      },
      es: {
        name: "Contrato de Empleo Ejecutivo",
        description:
          "Contrato de empleo integral para puestos ejecutivos con términos, beneficios y protecciones mejoradas.",
        aliases: [
          "contrato ejecutivo",
          "acuerdo de nivel C",
          "contrato de alta gerencia",
        ],
      },
    },
  },
  "farm-lease-agreement": {
    id: "farm-lease-agreement",
    title: "Farm Lease Agreement",
    description:
      "Agreement for leasing agricultural land and farming operations.",
    category: "Real Estate & Property",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "agricultural lease",
      "farmland rental agreement",
      "crop share lease",
      "arrendamiento agrícola",
      "acuerdo de alquiler de tierras",
      "arrendamiento de acciones de cultivos",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Farm Lease Agreement",
        description:
          "Agreement for leasing agricultural land and farming operations.",
        aliases: [
          "agricultural lease",
          "farmland rental agreement",
          "crop share lease",
        ],
      },
      es: {
        name: "Acuerdo de Arrendamiento de Granja",
        description:
          "Renta tierra para cultivar o criar ganado. Cubre términos de arrendamiento, responsabilidades y cómo se dividen las ganancias de las cosechas.",
        aliases: [
          "arrendamiento agrícola",
          "acuerdo de alquiler de tierras",
          "arrendamiento de acciones de cultivos",
        ],
      },
    },
  },
  "film-production-agreement": {
    id: "film-production-agreement",
    title: "Film Production Agreement",
    description: "Agreement for film and video production services and rights.",
    category: "Entertainment & Media",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "movie production contract",
      "video production agreement",
      "film contract",
      "contrato de producción",
      "acuerdo cinematográfico",
      "contrato cinematográfico",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Film Production Agreement",
        description:
          "Agreement for film and video production services and rights.",
        aliases: [
          "movie production contract",
          "video production agreement",
          "film contract",
        ],
      },
      es: {
        name: "Acuerdo de Producción Cinematográfica",
        description:
          "Acuerdo para servicios de producción de películas y videos.",
        aliases: [
          "contrato de producción",
          "acuerdo cinematográfico",
          "contrato cinematográfico",
        ],
      },
    },
  },
  "fitness-waiver": {
    id: "fitness-waiver",
    title: "Fitness Waiver",
    description:
      "Liability waiver for fitness activities, gyms, and personal training.",
    category: "Personal & Lifestyle",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "gym waiver",
      "fitness liability waiver",
      "exercise waiver",
      "exención de gimnasio",
      "renuncia de responsabilidad de ejercicio",
      "renuncia de ejercicio",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Fitness Waiver",
        description:
          "Liability waiver for fitness activities, gyms, and personal training.",
        aliases: ["gym waiver", "fitness liability waiver", "exercise waiver"],
      },
      es: {
        name: "Exención de Fitness",
        description:
          "Protege tu gimnasio o estudio de fitness de demandas si alguien se lastima durante ejercicios o entrenamiento.",
        aliases: [
          "exención de gimnasio",
          "renuncia de responsabilidad de ejercicio",
          "renuncia de ejercicio",
        ],
      },
    },
  },
  "food-truck-agreement": {
    id: "food-truck-agreement",
    title: "Food Truck Agreement",
    description:
      "Agreement for food truck operations, vending, and location services.",
    category: "Food & Hospitality",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "mobile food vendor agreement",
      "food cart contract",
      "street food agreement",
      "contrato de vendedor ambulante",
      "acuerdo de comida móvil",
      "acuerdo de comida callejera",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Food Truck Agreement",
        description:
          "Agreement for food truck operations, vending, and location services.",
        aliases: [
          "mobile food vendor agreement",
          "food cart contract",
          "street food agreement",
        ],
      },
      es: {
        name: "Acuerdo de Food Truck",
        description:
          "Acuerdo para operaciones de food truck, venta y servicios de ubicación.",
        aliases: [
          "contrato de vendedor ambulante",
          "acuerdo de comida móvil",
          "acuerdo de comida callejera",
        ],
      },
    },
  },
  "franchise-agreement": {
    id: "franchise-agreement",
    title: "Franchise Agreement",
    description:
      "Build your business empire by expanding through franchising with clear operational guidelines and brand protection.",
    category: "Business & Commercial",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "franchise contract",
      "franchising agreement",
      "contrato de franquicia",
      "acuerdo de franquicia",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Franchise Agreement",
        description:
          "Build your business empire by expanding through franchising with clear operational guidelines and brand protection.",
        aliases: ["franchise contract", "franchising agreement"],
      },
      es: {
        name: "Acuerdo de Franquicia",
        description:
          "Acuerdo para operaciones comerciales y licencias de franquicia.",
        aliases: ["contrato de franquicia", "acuerdo de franquicia"],
      },
    },
  },
  "franchise-disclosure-agreement": {
    id: "franchise-disclosure-agreement",
    title: "Franchise Disclosure Agreement",
    description:
      "Comprehensive franchise disclosure document and agreement for franchisors and franchisees.",
    category: "Business & Commercial",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "fdd",
      "franchise agreement",
      "franchising contract",
      "contrato de franquicia",
      "acuerdo de franquiciamiento",
      "contrato de franquicia legal",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Franchise Disclosure Agreement",
        description:
          "Comprehensive franchise disclosure document and agreement for franchisors and franchisees.",
        aliases: ["fdd", "franchise agreement", "franchising contract"],
      },
      es: {
        name: "Acuerdo de Divulgación de Franquicia",
        description:
          "Documento completo de divulgación y acuerdo de franquicia.",
        aliases: [
          "contrato de franquicia",
          "acuerdo de franquiciamiento",
          "contrato de franquicia legal",
        ],
      },
    },
  },
  "gaming-agreement": {
    id: "gaming-agreement",
    title: "Gaming Agreement",
    description:
      "Agreement for esports, gaming tournaments, and professional gaming contracts.",
    category: "Gaming & Esports",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "esports contract",
      "gaming contract",
      "tournament agreement",
      "contrato de esports",
      "acuerdo de torneo",
      "acuerdo de torneo legal",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Gaming Agreement",
        description:
          "Agreement for esports, gaming tournaments, and professional gaming contracts.",
        aliases: [
          "esports contract",
          "gaming contract",
          "tournament agreement",
        ],
      },
      es: {
        name: "Acuerdo de Gaming",
        description:
          "Acuerdo para esports, torneos de juegos y contratos de gaming profesional.",
        aliases: [
          "contrato de esports",
          "acuerdo de torneo",
          "acuerdo de torneo legal",
        ],
      },
    },
  },
  "general-contractor-agreement": {
    id: "general-contractor-agreement",
    title: "General Contractor Agreement",
    description:
      "Comprehensive agreement for general contracting and construction management services.",
    category: "Construction & Home Improvement",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "gc agreement",
      "construction management contract",
      "prime contractor agreement",
      "contrato de construcción general",
      "acuerdo de gestión de obra",
      "acuerdo de contratista principal",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "General Contractor Agreement",
        description:
          "Comprehensive agreement for general contracting and construction management services.",
        aliases: [
          "gc agreement",
          "construction management contract",
          "prime contractor agreement",
        ],
      },
      es: {
        name: "Acuerdo de Contratista General",
        description:
          "Acuerdo integral para servicios de contratación general y gestión de construcción.",
        aliases: [
          "contrato de construcción general",
          "acuerdo de gestión de obra",
          "acuerdo de contratista principal",
        ],
      },
    },
  },
  "general-inquiry": {
    id: "general-inquiry",
    title: "General Inquiry",
    description:
      "For situations where a specific document isn't immediately clear or needed.",
    category: "Miscellaneous",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "help",
      "question",
      "legal advice",
      "not sure",
      "ayuda",
      "pregunta",
      "consejo legal",
      "no estoy seguro",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "General Inquiry",
        description:
          "For situations where a specific document isn't immediately clear or needed.",
        aliases: ["help", "question", "legal advice", "not sure"],
      },
      es: {
        name: "Consulta General",
        description:
          "Para situaciones donde un documento específico no está claro o no se necesita de inmediato.",
        aliases: ["ayuda", "pregunta", "consejo legal", "no estoy seguro"],
      },
    },
  },
  "general-liability-waiver": {
    id: "general-liability-waiver",
    title: "General Liability Waiver",
    description:
      "Comprehensive liability waiver and release form for activities and services.",
    category: "Risk Management",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "liability release",
      "waiver of liability",
      "release form",
      "liberación de responsabilidad",
      "exención de responsabilidad",
      "formulario de liberación",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "General Liability Waiver",
        description:
          "Comprehensive liability waiver and release form for activities and services.",
        aliases: ["liability release", "waiver of liability", "release form"],
      },
      es: {
        name: "Exención de Responsabilidad General",
        description:
          "Protege tu negocio de demandas por accidentes en eventos, talleres o actividades peligrosas. Exención completa de responsabilidad.",
        aliases: [
          "liberación de responsabilidad",
          "exención de responsabilidad",
          "formulario de liberación",
        ],
      },
    },
  },
  "government-contract-agreement": {
    id: "government-contract-agreement",
    title: "Government Contract Agreement",
    description:
      "Agreement for providing goods or services to government agencies.",
    category: "Government & Legal Services",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "federal contract",
      "public sector agreement",
      "gsa contract",
      "contrato federal",
      "acuerdo de sector público",
      "contrato gsa",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Government Contract Agreement",
        description:
          "Agreement for providing goods or services to government agencies.",
        aliases: [
          "federal contract",
          "public sector agreement",
          "gsa contract",
        ],
      },
      es: {
        name: "Acuerdo de Contrato Gubernamental",
        description:
          "Acuerdo para proporcionar bienes o servicios a agencias gubernamentales.",
        aliases: [
          "contrato federal",
          "acuerdo de sector público",
          "contrato gsa",
        ],
      },
    },
  },
  "guardianship-agreement": {
    id: "guardianship-agreement",
    title: "Guardianship Agreement",
    description:
      "Protect and care for a loved one by establishing your legal guardianship responsibilities and decision-making authority.",
    category: "Family & Personal",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "guardian appointment",
      "custody agreement",
      "legal guardianship",
      "nombramiento de tutor",
      "acuerdo de custodia",
      "tutela legal",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Guardianship Agreement",
        description:
          "Protect and care for a loved one by establishing your legal guardianship responsibilities and decision-making authority.",
        aliases: [
          "guardian appointment",
          "custody agreement",
          "legal guardianship",
        ],
      },
      es: {
        name: "Acuerdo de Tutelá",
        description:
          "Acuerdo legal que establece responsabilidades y autoridad de tutelá.",
        aliases: [
          "nombramiento de tutor",
          "acuerdo de custodia",
          "tutela legal",
        ],
      },
    },
  },
  "health-care-directive": {
    id: "health-care-directive",
    title: "Healthcare Directive (Advance Directive)",
    description:
      "Document your healthcare wishes and treatment preferences for situations when you cannot communicate them yourself.",
    category: "Estate Planning",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "advance directive",
      "healthcare directive",
      "medical directive",
      "treatment directive",
      "directiva anticipada",
      "directiva médica",
      "directiva de tratamiento",
      "directiva de tratamiento legal",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Healthcare Directive (Advance Directive)",
        description:
          "Document your healthcare wishes and treatment preferences for situations when you cannot communicate them yourself.",
        aliases: [
          "advance directive",
          "healthcare directive",
          "medical directive",
          "treatment directive",
        ],
      },
      es: {
        name: "Directiva de Atención Médica (Directiva Anticipada)",
        description:
          "Documente sus deseos de atención médica y preferencias de tratamiento para situaciones cuando no pueda comunicarlos usted mismo.",
        aliases: [
          "directiva anticipada",
          "directiva médica",
          "directiva de tratamiento",
          "directiva de tratamiento legal",
        ],
      },
    },
  },
  "healthcare-power-of-attorney": {
    id: "healthcare-power-of-attorney",
    title: "Healthcare Power of Attorney",
    description: "Appoint an agent to make healthcare decisions if you cannot.",
    category: "Personal",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "medical poa",
      "healthcare proxy",
      "appoint agent for health",
      "medical decisions",
      "poder médico",
      "proxy de salud",
      "designar agente de salud",
      "decisiones médicas",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Healthcare Power of Attorney",
        description:
          "Appoint an agent to make healthcare decisions if you cannot.",
        aliases: [
          "medical poa",
          "healthcare proxy",
          "appoint agent for health",
          "medical decisions",
        ],
      },
      es: {
        name: "Poder Notarial para Atención Médica",
        description:
          "Nombrar un agente para tomar decisiones de atención médica si usted no puede.",
        aliases: [
          "poder médico",
          "proxy de salud",
          "designar agente de salud",
          "decisiones médicas",
        ],
      },
    },
  },
  "hipaa-authorization-form": {
    id: "hipaa-authorization-form",
    title: "HIPAA Authorization Form",
    description:
      "Grant access to your medical records safely and legally while maintaining privacy control under HIPAA regulations.",
    category: "Healthcare & Medical",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "medical records release",
      "health information authorization",
      "HIPAA release form",
      "liberación de registros médicos",
      "autorización de información de salud",
      "formulario de liberación de hipaa",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "HIPAA Authorization Form",
        description:
          "Grant access to your medical records safely and legally while maintaining privacy control under HIPAA regulations.",
        aliases: [
          "medical records release",
          "health information authorization",
          "HIPAA release form",
        ],
      },
      es: {
        name: "Formulario de Autorización HIPAA",
        description:
          "Formulario que autoriza la divulgación de información de salud protegida bajo HIPAA.",
        aliases: [
          "liberación de registros médicos",
          "autorización de información de salud",
          "formulario de liberación de hipaa",
        ],
      },
    },
  },
  "home-improvement-contract": {
    id: "home-improvement-contract",
    title: "Home Improvement Contract",
    description:
      "Comprehensive contract for home renovation, remodeling, and improvement projects.",
    category: "Construction",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "renovation contract",
      "remodeling agreement",
      "contractor agreement",
      "contrato de renovación",
      "acuerdo de remodelación",
      "acuerdo de contratista",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Home Improvement Contract",
        description:
          "Comprehensive contract for home renovation, remodeling, and improvement projects.",
        aliases: [
          "renovation contract",
          "remodeling agreement",
          "contractor agreement",
        ],
      },
      es: {
        name: "Contrato de Mejoras del Hogar",
        description:
          "Contrato integral para proyectos de renovación, remodelación y mejoras del hogar.",
        aliases: [
          "contrato de renovación",
          "acuerdo de remodelación",
          "acuerdo de contratista",
        ],
      },
    },
  },
  "horse-boarding-agreement": {
    id: "horse-boarding-agreement",
    title: "Horse Boarding Agreement",
    description: "Agreement for horse boarding and stable services.",
    category: "Agriculture & Farming",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "stable boarding",
      "equine boarding",
      "horse care agreement",
      "pensión de caballos",
      "cuidado equino",
      "acuerdo de cuidado de caballos",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Horse Boarding Agreement",
        description: "Agreement for horse boarding and stable services.",
        aliases: ["stable boarding", "equine boarding", "horse care agreement"],
      },
      es: {
        name: "Acuerdo de Pensión de Caballos",
        description: "Acuerdo para pensión de caballos y servicios de establo.",
        aliases: [
          "pensión de caballos",
          "cuidado equino",
          "acuerdo de cuidado de caballos",
        ],
      },
    },
  },
  "hotel-agreement": {
    id: "hotel-agreement",
    title: "Hotel Agreement",
    description: "Agreement for hotel operations, partnerships, or management.",
    category: "Food & Hospitality",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "hotel partnership",
      "hospitality agreement",
      "lodging agreement",
      "sociedad hotelera",
      "acuerdo de hospitalidad",
      "acuerdo de alojamiento",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Hotel Agreement",
        description:
          "Agreement for hotel operations, partnerships, or management.",
        aliases: [
          "hotel partnership",
          "hospitality agreement",
          "lodging agreement",
        ],
      },
      es: {
        name: "Acuerdo de Hotel",
        description:
          "Acuerdo para operaciones, asociaciones o gestión de hoteles.",
        aliases: [
          "sociedad hotelera",
          "acuerdo de hospitalidad",
          "acuerdo de alojamiento",
        ],
      },
    },
  },
  "hunting-lease-agreement": {
    id: "hunting-lease-agreement",
    title: "Hunting Lease Agreement",
    description: "Agreement for leasing hunting rights on private property.",
    category: "Real Estate & Property",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "hunting rights lease",
      "recreational lease",
      "game lease",
      "arrendamiento de derechos de caza",
      "arrendamiento recreativo",
      "arrendamiento del juego",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Hunting Lease Agreement",
        description:
          "Agreement for leasing hunting rights on private property.",
        aliases: ["hunting rights lease", "recreational lease", "game lease"],
      },
      es: {
        name: "Acuerdo de Arrendamiento de Caza",
        description:
          "Acuerdo para arrendar derechos de caza en propiedad privada.",
        aliases: [
          "arrendamiento de derechos de caza",
          "arrendamiento recreativo",
          "arrendamiento del juego",
        ],
      },
    },
  },
  "immigration-affidavit": {
    id: "immigration-affidavit",
    title: "Immigration Affidavit",
    description:
      "Support your immigration case with a professional sworn statement that strengthens your application.",
    category: "Government & Legal Services",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "affidavit of support",
      "immigration statement",
      "sworn immigration declaration",
      "declaración de apoyo",
      "declaración de inmigración",
      "declaración de inmigración jurada",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Immigration Affidavit",
        description:
          "Support your immigration case with a professional sworn statement that strengthens your application.",
        aliases: [
          "affidavit of support",
          "immigration statement",
          "sworn immigration declaration",
        ],
      },
      es: {
        name: "Declaración Jurada de Inmigración",
        description:
          "Declaración jurada para procedimientos y aplicaciones de inmigración.",
        aliases: [
          "declaración de apoyo",
          "declaración de inmigración",
          "declaración de inmigración jurada",
        ],
      },
    },
  },
  "independent-contractor-agreement": {
    id: "independent-contractor-agreement",
    title: "Independent Contractor Agreement",
    description:
      "Protect your business when hiring freelancers and avoid IRS problems. Clearly establish they are contractors, not employees, to prevent tax issues.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "freelance",
      "contractor",
      "gig work",
      "1099 job",
      "contratista",
      "trabajo gig",
      "trabajo 1099",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Independent Contractor Agreement",
        description:
          "Protect your business when hiring freelancers and avoid IRS problems. Clearly establish they are contractors, not employees, to prevent tax issues.",
        aliases: ["freelance", "contractor", "gig work", "1099 job"],
      },
      es: {
        name: "Contrato de Contratista Independiente",
        description:
          "Protege tu negocio al contratar freelancers y evita problemas con el IRS. Establece claramente que son contratistas independientes, no empleados.",
        aliases: ["freelance", "contratista", "trabajo gig", "trabajo 1099"],
      },
    },
  },
  "influencer-agreement": {
    id: "influencer-agreement",
    title: "Influencer Agreement",
    description:
      "Professional agreement for influencer marketing partnerships and brand collaborations.",
    category: "Marketing & Advertising",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "brand partnership agreement",
      "influencer contract",
      "social media collaboration agreement",
      "acuerdo de colaboración de marca",
      "contrato de influencer",
      "acuerdo de colaboración de redes sociales",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Influencer Agreement",
        description:
          "Professional agreement for influencer marketing partnerships and brand collaborations.",
        aliases: [
          "brand partnership agreement",
          "influencer contract",
          "social media collaboration agreement",
        ],
      },
      es: {
        name: "Acuerdo de Influencer",
        description:
          "Acuerdo profesional para asociaciones de marketing de influencers y colaboraciones de marca.",
        aliases: [
          "acuerdo de colaboración de marca",
          "contrato de influencer",
          "acuerdo de colaboración de redes sociales",
        ],
      },
    },
  },
  "insurance-claim-form": {
    id: "insurance-claim-form",
    title: "Insurance Claim Form",
    description:
      "Form for filing insurance claims for various types of coverage.",
    category: "Risk & Liability",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "claim form",
      "insurance claim",
      "claim application",
      "formulario de reclamo",
      "solicitud de seguro",
      "solicitud de reclamación",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Insurance Claim Form",
        description:
          "Form for filing insurance claims for various types of coverage.",
        aliases: ["claim form", "insurance claim", "claim application"],
      },
      es: {
        name: "Formulario de Reclamo de Seguro",
        description:
          "Reclama dinero de tu seguro por daños, accidentes o pérdidas. Formato profesional que aumenta posibilidades de aprobación.",
        aliases: [
          "formulario de reclamo",
          "solicitud de seguro",
          "solicitud de reclamación",
        ],
      },
    },
  },
  "international-trade-agreement": {
    id: "international-trade-agreement",
    title: "International Trade Agreement",
    description:
      "Agreement for international business transactions and trade relationships.",
    category: "Business & Commercial",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "import export agreement",
      "international sales contract",
      "global trade contract",
      "contrato de importación exportación",
      "acuerdo comercial global",
      "contrato comercial global",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "International Trade Agreement",
        description:
          "Agreement for international business transactions and trade relationships.",
        aliases: [
          "import export agreement",
          "international sales contract",
          "global trade contract",
        ],
      },
      es: {
        name: "Acuerdo de Comercio Internacional",
        description: "Acuerdo para transacciones comerciales internacionales.",
        aliases: [
          "contrato de importación exportación",
          "acuerdo comercial global",
          "contrato comercial global",
        ],
      },
    },
  },
  "internship-agreement": {
    id: "internship-agreement",
    title: "Internship Agreement",
    description:
      "Agreement between company and intern for internship programs and work experience.",
    category: "Employment & HR",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "intern agreement",
      "work experience agreement",
      "student internship contract",
      "acuerdo de intern",
      "contrato de experiencia laboral",
      "contrato de pasantías para estudiantes",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Internship Agreement",
        description:
          "Agreement between company and intern for internship programs and work experience.",
        aliases: [
          "intern agreement",
          "work experience agreement",
          "student internship contract",
        ],
      },
      es: {
        name: "Acuerdo de Pasantía",
        description:
          "Acuerdo entre empresa y pasante para programas de pasantía y experiencia laboral.",
        aliases: [
          "acuerdo de intern",
          "contrato de experiencia laboral",
          "contrato de pasantías para estudiantes",
        ],
      },
    },
  },
  "invention-assignment-agreement": {
    id: "invention-assignment-agreement",
    title: "Invention Assignment Agreement",
    description:
      "Protect your company's innovations by ensuring all employee inventions and intellectual property belong to your business.",
    category: "Intellectual Property",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "employee invention assignment",
      "contractor invention agreement",
      "invention ownership",
      "ip assignment",
      "asignación invenciones empleado",
      "acuerdo invenciones contratista",
      "propiedad invenciones",
      "asignación pi",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Invention Assignment Agreement",
        description:
          "Protect your company's innovations by ensuring all employee inventions and intellectual property belong to your business.",
        aliases: [
          "employee invention assignment",
          "contractor invention agreement",
          "invention ownership",
          "ip assignment",
        ],
      },
      es: {
        name: "Acuerdo de Asignación de Invenciones",
        description:
          "Acuerdo que asigna las invenciones de empleados o contratistas a la empresa.",
        aliases: [
          "asignación invenciones empleado",
          "acuerdo invenciones contratista",
          "propiedad invenciones",
          "asignación pi",
        ],
      },
    },
  },
  "investment-agreement": {
    id: "investment-agreement",
    title: "Investment Agreement",
    description:
      "Secure your financial future by clearly defining investment terms, returns, and responsibilities for all parties.",
    category: "Finance & Lending",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "investor agreement",
      "investment contract",
      "contrato de inversionista",
      "acuerdo de capital",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Investment Agreement",
        description:
          "Secure your financial future by clearly defining investment terms, returns, and responsibilities for all parties.",
        aliases: ["investor agreement", "investment contract"],
      },
      es: {
        name: "Acuerdo de Inversión",
        description:
          "Acuerdo que describe términos para transacciones de inversión.",
        aliases: ["contrato de inversionista", "acuerdo de capital"],
      },
    },
  },
  invoice: {
    id: "invoice",
    title: "Invoice",
    description:
      "Get paid faster with professional invoices that customers take seriously. Improve cash flow with clear payment terms.",
    category: "Finance",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "invoice",
      "billing statement",
      "payment request",
      "factura",
      "recibo de pago",
      "cuenta por cobrar",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Invoice",
        description:
          "Get paid faster with professional invoices that customers take seriously. Improve cash flow with clear payment terms.",
        aliases: ["invoice", "billing statement", "payment request"],
      },
      es: {
        name: "Factura",
        description:
          "Cobra a clientes por bienes o servicios que has proporcionado. Formato profesional de factura para recibir pago más rápido.",
        aliases: ["factura", "recibo de pago", "cuenta por cobrar"],
      },
    },
  },
  "job-application-form": {
    id: "job-application-form",
    title: "Job Application Form",
    description:
      "Professional job application form for collecting candidate information.",
    category: "Employment",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "employment application",
      "hiring form",
      "candidate application",
      "solicitud de trabajo",
      "formulario de contratación",
      "solicitud de candidato",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Job Application Form",
        description:
          "Professional job application form for collecting candidate information.",
        aliases: [
          "employment application",
          "hiring form",
          "candidate application",
        ],
      },
      es: {
        name: "Formulario de Solicitud de Empleo",
        description:
          "Formulario profesional de solicitud de empleo para recopilar información de candidatos.",
        aliases: [
          "solicitud de trabajo",
          "formulario de contratación",
          "solicitud de candidato",
        ],
      },
    },
  },
  "joint-living-trust": {
    id: "joint-living-trust",
    title: "Joint Living Trust (Married Couples)",
    description:
      "A revocable living trust for married couples to manage joint assets and provide for each other and beneficiaries.",
    category: "Estate Planning",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "joint trust",
      "married couple trust",
      "joint revocable trust",
      "family trust",
      "fideicomiso conjunto",
      "fideicomiso de pareja",
      "fideicomiso familiar",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Joint Living Trust (Married Couples)",
        description:
          "A revocable living trust for married couples to manage joint assets and provide for each other and beneficiaries.",
        aliases: [
          "joint trust",
          "married couple trust",
          "joint revocable trust",
          "family trust",
        ],
      },
      es: {
        name: "Fideicomiso Conjunto en Vida (Parejas Casadas)",
        description:
          "Un fideicomiso en vida revocable para parejas casadas para administrar activos conjuntos y proveer el uno para el otro y beneficiarios.",
        aliases: [
          "fideicomiso conjunto",
          "fideicomiso de pareja",
          "fideicomiso familiar",
          "family trust",
        ],
      },
    },
  },
  "joint-venture-agreement": {
    id: "joint-venture-agreement",
    title: "Joint Venture Agreement",
    description:
      "Partner with another business on a specific project. Share costs, profits, and responsibilities while protecting both companies.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "business collaboration",
      "joint venture",
      "strategic partnership",
      "colaboración empresarial",
      "empresa conjunta",
      "asociación estratégica",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Joint Venture Agreement",
        description:
          "Partner with another business on a specific project. Share costs, profits, and responsibilities while protecting both companies.",
        aliases: [
          "business collaboration",
          "joint venture",
          "strategic partnership",
        ],
      },
      es: {
        name: "Acuerdo de Empresa Conjunta",
        description:
          "Une fuerzas con otro negocio para un proyecto específico. Define responsabilidades, inversión y cómo se dividen ganancias y pérdidas.",
        aliases: [
          "colaboración empresarial",
          "empresa conjunta",
          "asociación estratégica",
        ],
      },
    },
  },
  "landscaping-contract": {
    id: "landscaping-contract",
    title: "Landscaping Contract",
    description:
      "Professional contract for landscaping services including design, installation, and maintenance work.",
    category: "Construction",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "landscape design contract",
      "yard work agreement",
      "garden services contract",
      "contrato de diseño de paisaje",
      "acuerdo de trabajo de jardín",
      "contrato de servicios de jardín",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Landscaping Contract",
        description:
          "Professional contract for landscaping services including design, installation, and maintenance work.",
        aliases: [
          "landscape design contract",
          "yard work agreement",
          "garden services contract",
        ],
      },
      es: {
        name: "Contrato de Paisajismo",
        description:
          "Contrato profesional para servicios de paisajismo incluyendo diseño, instalación y trabajo de mantenimiento.",
        aliases: [
          "contrato de diseño de paisaje",
          "acuerdo de trabajo de jardín",
          "contrato de servicios de jardín",
        ],
      },
    },
  },
  "last-will-testament": {
    id: "last-will-testament",
    title: "Last Will and Testament",
    description:
      "Secure your family's future by controlling how your assets are distributed. Prevent family conflicts and legal complications.",
    category: "Estate Planning",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "will",
      "inheritance",
      "distribute assets",
      "testamento",
      "herencia",
      "distribuir bienes",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Last Will and Testament",
        description:
          "Secure your family's future by controlling how your assets are distributed. Prevent family conflicts and legal complications.",
        aliases: ["will", "inheritance", "distribute assets"],
      },
      es: {
        name: "Última Voluntad y Testamento",
        description:
          "Controla quién obtiene tu propiedad y posesiones después de que mueras. Documento esencial para proteger el futuro de tu familia.",
        aliases: ["testamento", "herencia", "distribuir bienes"],
      },
    },
  },
  "late-rent-notice": {
    id: "late-rent-notice",
    title: "Late Rent Notice",
    description: "Official notice to tenants for overdue rent payments",
    category: "Real Estate & Property",
    jurisdiction: "us",
    tags: [],
    aliases: [],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Late Rent Notice",
        description: "Official notice to tenants for overdue rent payments",
        aliases: [],
      },
      es: {
        name: "Aviso de retraso en el pago del alquiler",
        description:
          "Aviso oficial para informar a los inquilinos sobre pagos de renta vencidos.",
        aliases: [],
      },
    },
  },
  "lease-addendum": {
    id: "lease-addendum",
    title: "Lease Addendum",
    description:
      "Add terms to existing lease agreements with a legally binding lease addendum",
    category: "Real Estate & Property",
    jurisdiction: "us",
    tags: [],
    aliases: [],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Lease Addendum",
        description:
          "Add terms to existing lease agreements with a legally binding lease addendum",
        aliases: [],
      },
      es: {
        name: "Anexo al contrato de arrendamiento",
        description:
          "Agrega términos a contratos de arrendamiento existentes con un anexo legalmente vinculante.",
        aliases: [],
      },
    },
  },
  "lease-agreement": {
    id: "lease-agreement",
    title: "Residential Lease Agreement",
    description:
      "Generate rental income or secure quality housing with clear terms that protect both parties. Prevent costly disputes.",
    category: "Real Estate",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "rent apartment",
      "tenant",
      "lease form",
      "landlord agreement",
      "alquiler de apartamento",
      "inquilino",
      "formulario de arrendamiento",
      "acuerdo de propietario",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Residential Lease Agreement",
        description:
          "Generate rental income or secure quality housing with clear terms that protect both parties. Prevent costly disputes.",
        aliases: [
          "rent apartment",
          "tenant",
          "lease form",
          "landlord agreement",
        ],
      },
      es: {
        name: "Contrato de Arrendamiento Residencial",
        description:
          "Protege tus derechos como propietario o inquilino. Establece expectativas claras sobre renta, depósitos, reparaciones y reglas de la propiedad.",
        aliases: [
          "alquiler de apartamento",
          "inquilino",
          "formulario de arrendamiento",
          "acuerdo de propietario",
        ],
      },
    },
  },
  "lease-amendment": {
    id: "lease-amendment",
    title: "Lease Amendment",
    description:
      "Modify existing lease terms with a legally binding lease amendment document.",
    category: "Real Estate & Property",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "lease modification",
      "rental amendment",
      "lease change",
      "lease alteration",
      "modificación de arrendamiento",
      "cambio de alquiler",
      "alteración de contrato",
      "alteración del arrendamiento",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Lease Amendment",
        description:
          "Modify existing lease terms with a legally binding lease amendment document.",
        aliases: [
          "lease modification",
          "rental amendment",
          "lease change",
          "lease alteration",
        ],
      },
      es: {
        name: "Enmienda de Arrendamiento",
        description:
          "Modifica los términos de arrendamiento existentes con una enmienda legalmente válida.",
        aliases: [
          "modificación de arrendamiento",
          "cambio de alquiler",
          "alteración de contrato",
          "alteración del arrendamiento",
        ],
      },
    },
  },
  "lease-renewal-agreement": {
    id: "lease-renewal-agreement",
    title: "Lease Renewal Agreement",
    description:
      "Extend your existing lease with updated terms and conditions.",
    category: "Real Estate",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "lease extension",
      "rental renewal",
      "lease continuation",
      "extensión de arrendamiento",
      "renovación de alquiler",
      "continuación del arrendamiento",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Lease Renewal Agreement",
        description:
          "Extend your existing lease with updated terms and conditions.",
        aliases: ["lease extension", "rental renewal", "lease continuation"],
      },
      es: {
        name: "Acuerdo de Renovación de Arrendamiento",
        description:
          "Extiende tu arrendamiento existente con términos y condiciones actualizados.",
        aliases: [
          "extensión de arrendamiento",
          "renovación de alquiler",
          "continuación del arrendamiento",
        ],
      },
    },
  },
  "lease-termination-letter": {
    id: "lease-termination-letter",
    title: "Lease Termination Letter",
    description:
      "Formally notify your landlord or tenant of lease termination.",
    category: "Real Estate",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "lease notice",
      "termination notice",
      "end lease letter",
      "aviso de terminación",
      "carta de fin de contrato",
      "carta de arrendamiento final",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Lease Termination Letter",
        description:
          "Formally notify your landlord or tenant of lease termination.",
        aliases: ["lease notice", "termination notice", "end lease letter"],
      },
      es: {
        name: "Carta de Terminación de Arrendamiento",
        description:
          "Termina tu contrato de renta legalmente. Avisa con anticipación adecuada para evitar problemas y recuperar depósitos.",
        aliases: [
          "aviso de terminación",
          "carta de fin de contrato",
          "carta de arrendamiento final",
        ],
      },
    },
  },
  "leave-of-absence-request-form": {
    id: "leave-of-absence-request-form",
    title: "Leave of Absence Request Form",
    description: "Formal request form for employee leave of absence",
    category: "HR",
    jurisdiction: "us",
    tags: [],
    aliases: [],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Leave of Absence Request Form",
        description: "Formal request form for employee leave of absence",
        aliases: [],
      },
      es: {
        name: "Leave of Absence Request Form",
        description: "Formal request form for employee leave of absence",
        aliases: [],
      },
    },
  },
  "letter-of-intent": {
    id: "letter-of-intent",
    title: "Letter of Intent",
    description:
      "Express your intention to enter into a business agreement or transaction.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "LOI",
      "intent letter",
      "business intent",
      "carta de intenciones",
      "intención comercial",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Letter of Intent",
        description:
          "Express your intention to enter into a business agreement or transaction.",
        aliases: ["LOI", "intent letter", "business intent"],
      },
      es: {
        name: "Carta de Intención",
        description:
          "Expresa tu intención de entrar en un acuerdo comercial o transacción.",
        aliases: ["carta de intenciones", "LOI", "intención comercial"],
      },
    },
  },
  "licensing-agreement": {
    id: "licensing-agreement",
    title: "Licensing Agreement",
    description:
      "Generate revenue from your intellectual property without selling it. Allow others to use your brand, product, or technology for royalties.",
    category: "Intellectual Property",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "licensing contract",
      "license agreement",
      "intellectual property license",
      "contrato de licencia",
      "licencia de propiedad intelectual",
      "licencia de propiedad intelectual legal",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Licensing Agreement",
        description:
          "Generate revenue from your intellectual property without selling it. Allow others to use your brand, product, or technology for royalties.",
        aliases: [
          "licensing contract",
          "license agreement",
          "intellectual property license",
        ],
      },
      es: {
        name: "Acuerdo de Licencia",
        description:
          "Permite que otros usen tu marca, producto o tecnología a cambio de regalías. Define términos de uso y pagos.",
        aliases: [
          "contrato de licencia",
          "licencia de propiedad intelectual",
          "licencia de propiedad intelectual legal",
        ],
      },
    },
  },
  "licensing-agreement-general": {
    id: "licensing-agreement-general",
    title: "General Licensing Agreement",
    description:
      "Turn your intellectual property into profit by licensing it to others while maintaining ownership and control.",
    category: "Intellectual Property",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "general license agreement",
      "IP licensing contract",
      "licensing contract",
      "contrato general de licencia",
      "acuerdo de licenciamiento",
      "contrato de licencia",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "General Licensing Agreement",
        description:
          "Turn your intellectual property into profit by licensing it to others while maintaining ownership and control.",
        aliases: [
          "general license agreement",
          "IP licensing contract",
          "licensing contract",
        ],
      },
      es: {
        name: "Acuerdo General de Licencia",
        description:
          "Acuerdo integral de licencia para varios tipos de propiedad intelectual.",
        aliases: [
          "contrato general de licencia",
          "acuerdo de licenciamiento",
          "contrato de licencia",
        ],
      },
    },
  },
  "limited-partnership-agreement": {
    id: "limited-partnership-agreement",
    title: "Limited Partnership Agreement",
    description:
      "Structure your business partnership with clear roles, limited liability protection, and defined profit-sharing arrangements.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "LP agreement",
      "limited partnership",
      "partnership formation",
      "acuerdo LP",
      "sociedad limitada",
      "formación de sociedad",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Limited Partnership Agreement",
        description:
          "Structure your business partnership with clear roles, limited liability protection, and defined profit-sharing arrangements.",
        aliases: [
          "LP agreement",
          "limited partnership",
          "partnership formation",
        ],
      },
      es: {
        name: "Acuerdo de Sociedad Limitada",
        description:
          "Acuerdo que establece una sociedad limitada con socios generales y limitados.",
        aliases: ["acuerdo LP", "sociedad limitada", "formación de sociedad"],
      },
    },
  },
  "livestock-purchase-agreement": {
    id: "livestock-purchase-agreement",
    title: "Livestock Purchase Agreement",
    description: "Agreement for the purchase and sale of livestock animals.",
    category: "Business & Commercial",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "cattle purchase agreement",
      "animal sale contract",
      "livestock bill of sale",
      "acuerdo de compra de ganado",
      "contrato de venta de animales",
      "bolsa de venta de ganado",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Livestock Purchase Agreement",
        description:
          "Agreement for the purchase and sale of livestock animals.",
        aliases: [
          "cattle purchase agreement",
          "animal sale contract",
          "livestock bill of sale",
        ],
      },
      es: {
        name: "Acuerdo de Compra de Ganado",
        description:
          "Compra o vende ganado (vacas, caballos, cerdos, etc.) de manera segura. Incluye historial de salud, garantías y condiciones de entrega.",
        aliases: [
          "acuerdo de compra de ganado",
          "contrato de venta de animales",
          "bolsa de venta de ganado",
        ],
      },
    },
  },
  "living-trust": {
    id: "living-trust",
    title: "Living Trust (Revocable)",
    description:
      "Protect your family's privacy and wealth from expensive probate. Transfer assets quickly while maintaining confidentiality.",
    category: "Estate Planning",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "revocable trust",
      "estate planning",
      "avoid probate",
      "fideicomiso revocable",
      "planificación patrimonial",
      "evitar sucesorio",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Living Trust (Revocable)",
        description:
          "Protect your family's privacy and wealth from expensive probate. Transfer assets quickly while maintaining confidentiality.",
        aliases: ["revocable trust", "estate planning", "avoid probate"],
      },
      es: {
        name: "Fideicomiso en Vida (Revocable)",
        description:
          "Asegura que tu familia reciba tu herencia rápidamente y sin complicaciones legales. Evita el costoso proceso de corte sucesorio y protege tu privacidad.",
        aliases: [
          "fideicomiso revocable",
          "planificación patrimonial",
          "evitar sucesorio",
        ],
      },
    },
  },
  "living-trust-amendment": {
    id: "living-trust-amendment",
    title: "Living Trust Amendment",
    description:
      "Modify or update the terms of your existing revocable living trust without creating a new trust.",
    category: "Estate Planning",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "trust amendment",
      "modify trust",
      "update trust",
      "trust modification",
      "enmienda fideicomiso",
      "modificar fideicomiso",
      "actualizar fideicomiso",
      "modificación de confianza",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Living Trust Amendment",
        description:
          "Modify or update the terms of your existing revocable living trust without creating a new trust.",
        aliases: [
          "trust amendment",
          "modify trust",
          "update trust",
          "trust modification",
        ],
      },
      es: {
        name: "Enmienda al Fideicomiso en Vida",
        description:
          "Modificar o actualizar los términos de su fideicomiso en vida revocable existente sin crear un nuevo fideicomiso.",
        aliases: [
          "enmienda fideicomiso",
          "modificar fideicomiso",
          "actualizar fideicomiso",
          "modificación de confianza",
        ],
      },
    },
  },
  "living-will": {
    id: "living-will",
    title: "Living Will / Advance Directive",
    description:
      "Control your end-of-life care by documenting specific treatment preferences. Prevent unwanted medical interventions.",
    category: "Personal",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "medical wishes",
      "advance directive",
      "life support",
      "end of life",
      "deseos médicos",
      "directiva anticipada",
      "soporte vital",
      "fin de vida",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Living Will / Advance Directive",
        description:
          "Control your end-of-life care by documenting specific treatment preferences. Prevent unwanted medical interventions.",
        aliases: [
          "medical wishes",
          "advance directive",
          "life support",
          "end of life",
        ],
      },
      es: {
        name: "Testamento Vital / Directiva Anticipada",
        description:
          "Dile a los médicos exactamente qué tratamientos médicos quieres o no quieres si estás muriendo o permanentemente inconsciente.",
        aliases: [
          "deseos médicos",
          "directiva anticipada",
          "soporte vital",
          "fin de vida",
        ],
      },
    },
  },
  "llc-operating-agreement": {
    id: "llc-operating-agreement",
    title: "Operating Agreement (LLC)",
    description:
      "Protect your LLC investment and prevent partner disputes. Define roles, profit sharing, and decision-making processes clearly.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "LLC agreement",
      "limited liability company",
      "acuerdo de LLC",
      "sociedad de responsabilidad limitada",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Operating Agreement (LLC)",
        description:
          "Protect your LLC investment and prevent partner disputes. Define roles, profit sharing, and decision-making processes clearly.",
        aliases: ["LLC agreement", "limited liability company"],
      },
      es: {
        name: "Acuerdo Operativo (LLC)",
        description:
          "Documento esencial para propietarios de LLC que define roles, responsabilidades, participación en ganancias y procesos de toma de decisiones.",
        aliases: ["acuerdo de LLC", "sociedad de responsabilidad limitada"],
      },
    },
  },
  "loan-agreement": {
    id: "loan-agreement",
    title: "Loan Agreement",
    description:
      "Access or provide funding with confidence and legal protection. Establish clear terms that prevent future disputes.",
    category: "Finance",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "loan contract",
      "personal loan",
      "lending agreement",
      "borrowing contract",
      "contrato de préstamo",
      "préstamo personal",
      "acuerdo de préstamo",
      "contrato de préstamo legal",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Loan Agreement",
        description:
          "Access or provide funding with confidence and legal protection. Establish clear terms that prevent future disputes.",
        aliases: [
          "loan contract",
          "personal loan",
          "lending agreement",
          "borrowing contract",
        ],
      },
      es: {
        name: "Acuerdo de Préstamo",
        description:
          "Formaliza préstamos familiares o comerciales para evitar conflictos. Protege relaciones personales al establecer términos claros de reembolso.",
        aliases: [
          "contrato de préstamo",
          "préstamo personal",
          "acuerdo de préstamo",
          "contrato de préstamo legal",
        ],
      },
    },
  },
  "loan-modification-agreement": {
    id: "loan-modification-agreement",
    title: "Loan Modification Agreement",
    description:
      "Agreement to modify the terms and conditions of an existing loan agreement.",
    category: "Finance",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "loan amendment",
      "loan restructure agreement",
      "loan workout agreement",
      "enmienda de préstamo",
      "acuerdo de reestructuración",
      "acuerdo de entrenamiento de préstamos",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Loan Modification Agreement",
        description:
          "Agreement to modify the terms and conditions of an existing loan agreement.",
        aliases: [
          "loan amendment",
          "loan restructure agreement",
          "loan workout agreement",
        ],
      },
      es: {
        name: "Acuerdo de Modificación de Préstamo",
        description:
          "Cambia los términos de un préstamo existente para evitar el impago. Reduce pagos, cambia tasas de interés o extiende el plazo de pago.",
        aliases: [
          "enmienda de préstamo",
          "acuerdo de reestructuración",
          "acuerdo de entrenamiento de préstamos",
        ],
      },
    },
  },
  "loan-modification-letter": {
    id: "loan-modification-letter",
    title: "Loan Modification Letter",
    description:
      "Request a loan modification from your lender due to financial hardship or changed circumstances.",
    category: "Finance",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "loan mod request",
      "payment modification",
      "hardship letter",
      "loan adjustment request",
      "solicitud de modificación",
      "modificación de pago",
      "carta de dificultad",
      "solicitud de ajuste de préstamo",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Loan Modification Letter",
        description:
          "Request a loan modification from your lender due to financial hardship or changed circumstances.",
        aliases: [
          "loan mod request",
          "payment modification",
          "hardship letter",
          "loan adjustment request",
        ],
      },
      es: {
        name: "Carta de Modificación de Préstamo",
        description:
          "Solicitar una modificación de préstamo de su prestamista debido a dificultades financieras o circunstancias cambiadas.",
        aliases: [
          "solicitud de modificación",
          "modificación de pago",
          "carta de dificultad",
          "solicitud de ajuste de préstamo",
        ],
      },
    },
  },
  "lottery-pool-contract": {
    id: "lottery-pool-contract",
    title: "Lottery Pool Contract",
    description:
      "Agreement for group lottery ticket purchases and winnings distribution.",
    category: "Personal & Lifestyle",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "lottery syndicate agreement",
      "group lottery contract",
      "acuerdo de sindicato de lotería",
      "contrato grupal de lotería",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Lottery Pool Contract",
        description:
          "Agreement for group lottery ticket purchases and winnings distribution.",
        aliases: ["lottery syndicate agreement", "group lottery contract"],
      },
      es: {
        name: "Contrato de Grupo de Lotería",
        description:
          "Acuerdo para compras grupales de boletos de lotería y distribución de ganancias.",
        aliases: [
          "acuerdo de sindicato de lotería",
          "contrato grupal de lotería",
        ],
      },
    },
  },
  "maritime-charter-agreement": {
    id: "maritime-charter-agreement",
    title: "Maritime Charter Agreement",
    description:
      "Agreement for chartering vessels for maritime transportation and services.",
    category: "Transportation & Automotive",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "ship charter agreement",
      "vessel charter contract",
      "marine charter",
      "contrato de fletamento",
      "acuerdo naval",
      "carta marina",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Maritime Charter Agreement",
        description:
          "Agreement for chartering vessels for maritime transportation and services.",
        aliases: [
          "ship charter agreement",
          "vessel charter contract",
          "marine charter",
        ],
      },
      es: {
        name: "Acuerdo de Flete Marítimo",
        description:
          "Acuerdo para fletar embarcaciones para transporte marítimo.",
        aliases: ["contrato de fletamento", "acuerdo naval", "carta marina"],
      },
    },
  },
  "marketing-agreement": {
    id: "marketing-agreement",
    title: "Marketing Agreement",
    description:
      "Agreement for marketing and promotional services between parties.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "Marketing contract",
      "Promotional agreement",
      "Advertising agreement",
      "Contrato marketing",
      "Acuerdo promocional",
      "Contrato publicitario",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Marketing Agreement",
        description:
          "Agreement for marketing and promotional services between parties.",
        aliases: [
          "Marketing contract",
          "Promotional agreement",
          "Advertising agreement",
        ],
      },
      es: {
        name: "Acuerdo de Marketing",
        description:
          "Acuerdo para servicios de marketing y promoción entre las partes.",
        aliases: [
          "Contrato marketing",
          "Acuerdo promocional",
          "Contrato publicitario",
        ],
      },
    },
  },
  "marriage-separation-agreement": {
    id: "marriage-separation-agreement",
    title: "Marriage Separation Agreement",
    description:
      "Navigate separation with clarity by establishing fair arrangements for property, support, and children.",
    category: "Family & Personal",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "legal separation agreement",
      "marital separation contract",
      "acuerdo de separación legal",
      "contrato de separación marital",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Marriage Separation Agreement",
        description:
          "Navigate separation with clarity by establishing fair arrangements for property, support, and children.",
        aliases: ["legal separation agreement", "marital separation contract"],
      },
      es: {
        name: "Acuerdo de Separación Matrimonial",
        description:
          "Acuerdo entre cónyuges que viven separados sobre propiedad, manutención y custodia.",
        aliases: [
          "acuerdo de separación legal",
          "contrato de separación marital",
        ],
      },
    },
  },
  "mechanics-lien": {
    id: "mechanics-lien",
    title: "Mechanics Lien",
    description:
      "Secure payment for your construction work by filing a legal claim against the property you improved.",
    category: "Legal",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "construction lien",
      "materialman lien",
      "contractor lien",
      "gravamen de construcción",
      "gravamen de contratista",
      "contratista len",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Mechanics Lien",
        description:
          "Secure payment for your construction work by filing a legal claim against the property you improved.",
        aliases: ["construction lien", "materialman lien", "contractor lien"],
      },
      es: {
        name: "Gravamen de Mecánicos",
        description:
          "Reclamo legal contra la propiedad por trabajo no pagado o materiales proporcionados para mejoras de construcción.",
        aliases: [
          "gravamen de construcción",
          "gravamen de contratista",
          "contratista len",
        ],
      },
    },
  },
  "mechanics-lien-waiver": {
    id: "mechanics-lien-waiver",
    title: "Mechanics Lien Waiver",
    description:
      "Legal waiver releasing mechanics lien rights upon payment for construction work or materials.",
    category: "Legal",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "lien waiver",
      "lien release",
      "waiver of lien rights",
      "renuncia de gravamen",
      "liberación de gravamen",
      "renuncia de los derechos de gravamen",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Mechanics Lien Waiver",
        description:
          "Legal waiver releasing mechanics lien rights upon payment for construction work or materials.",
        aliases: ["lien waiver", "lien release", "waiver of lien rights"],
      },
      es: {
        name: "Renuncia de Gravamen de Mecánicos",
        description:
          "Renuncia legal que libera los derechos de gravamen de mecánicos al recibir el pago por trabajo de construcción o materiales.",
        aliases: [
          "renuncia de gravamen",
          "liberación de gravamen",
          "renuncia de los derechos de gravamen",
        ],
      },
    },
  },
  "mediation-agreement": {
    id: "mediation-agreement",
    title: "Mediation Agreement",
    description:
      "Resolve conflicts peacefully and cost-effectively by working with a neutral mediator instead of going to court.",
    category: "Dispute Resolution",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "dispute mediation agreement",
      "alternative dispute resolution agreement",
      "acuerdo de mediación de disputas",
      "acuerdo de resolución alternativa",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Mediation Agreement",
        description:
          "Resolve conflicts peacefully and cost-effectively by working with a neutral mediator instead of going to court.",
        aliases: [
          "dispute mediation agreement",
          "alternative dispute resolution agreement",
        ],
      },
      es: {
        name: "Acuerdo de Mediación",
        description:
          "Acuerdo para resolver disputas a través de mediación con la ayuda de un mediador neutral.",
        aliases: [
          "acuerdo de mediación de disputas",
          "acuerdo de resolución alternativa",
        ],
      },
    },
  },
  "medical-consent": {
    id: "medical-consent",
    title: "General Medical Consent Form",
    description:
      "Ensure your children receive prompt medical care in emergencies. Authorize treatment when you can't be present.",
    category: "Personal",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "medical consent",
      "child medical form",
      "medical authorization",
      "consentimiento médico",
      "formulario médico infantil",
      "autorización médica",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "General Medical Consent Form",
        description:
          "Ensure your children receive prompt medical care in emergencies. Authorize treatment when you can't be present.",
        aliases: [
          "medical consent",
          "child medical form",
          "medical authorization",
        ],
      },
      es: {
        name: "Formulario de Consentimiento Médico General",
        description:
          "Autoriza a alguien más a tomar decisiones médicas importantes por ti o tu familia en emergencias cuando no puedas decidir.",
        aliases: [
          "consentimiento médico",
          "formulario médico infantil",
          "autorización médica",
        ],
      },
    },
  },
  "medical-consent-form": {
    id: "medical-consent-form",
    title: "Medical Consent Form",
    description:
      "Form granting permission for medical treatment or procedures.",
    category: "Healthcare & Medical",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "medical authorization form",
      "treatment consent form",
      "healthcare consent",
      "formulario de autorización médica",
      "consentimiento de tratamiento",
      "consentimiento de la salud",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Medical Consent Form",
        description:
          "Form granting permission for medical treatment or procedures.",
        aliases: [
          "medical authorization form",
          "treatment consent form",
          "healthcare consent",
        ],
      },
      es: {
        name: "Formulario de Consentimiento Médico",
        description:
          "Da permiso para que doctores realicen tratamientos, operaciones o procedimientos médicos. Usado en hospitales y clínicas.",
        aliases: [
          "formulario de autorización médica",
          "consentimiento de tratamiento",
          "consentimiento de la salud",
        ],
      },
    },
  },
  "medical-power-of-attorney": {
    id: "medical-power-of-attorney",
    title: "Medical Power of Attorney",
    description:
      "Authorize someone to make comprehensive medical decisions on your behalf when you are unable to do so.",
    category: "Estate Planning",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "medical poa",
      "healthcare agent",
      "medical proxy",
      "healthcare surrogate",
      "poder médico",
      "agente de salud",
      "representante médico",
      "sustituto de atención médica",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Medical Power of Attorney",
        description:
          "Authorize someone to make comprehensive medical decisions on your behalf when you are unable to do so.",
        aliases: [
          "medical poa",
          "healthcare agent",
          "medical proxy",
          "healthcare surrogate",
        ],
      },
      es: {
        name: "Poder Notarial Médico",
        description:
          "Nombra a alguien para tomar todas tus decisiones de atención médica si no puedes comunicar tus deseos.",
        aliases: [
          "poder médico",
          "agente de salud",
          "representante médico",
          "sustituto de atención médica",
        ],
      },
    },
  },
  "membership-agreement": {
    id: "membership-agreement",
    title: "Membership Agreement",
    description: "Agreement for club, organization, or service memberships.",
    category: "Personal & Lifestyle",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "club membership",
      "subscription agreement",
      "membresía de club",
      "acuerdo de suscripción",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Membership Agreement",
        description:
          "Agreement for club, organization, or service memberships.",
        aliases: ["club membership", "subscription agreement"],
      },
      es: {
        name: "Acuerdo de Membresía",
        description:
          "Acuerdo para membresías de club, organización o servicio.",
        aliases: ["membresía de club", "acuerdo de suscripción"],
      },
    },
  },
  "membership-cancellation-letter": {
    id: "membership-cancellation-letter",
    title: "Membership Cancellation Letter",
    description: "Letter to cancel gym, club, or service memberships.",
    category: "Personal & Lifestyle",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "cancellation letter",
      "membership termination letter",
      "carta de cancelación",
      "carta de terminación de membresía",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Membership Cancellation Letter",
        description: "Letter to cancel gym, club, or service memberships.",
        aliases: ["cancellation letter", "membership termination letter"],
      },
      es: {
        name: "Carta de Cancelación de Membresía",
        description:
          "Carta para cancelar membresías de gimnasio, club o servicios.",
        aliases: ["carta de cancelación", "carta de terminación de membresía"],
      },
    },
  },
  "memorandum-of-agreement": {
    id: "memorandum-of-agreement",
    title: "Memorandum of Agreement (MOA)",
    description:
      "Secure business deals and establish binding partnerships with formal agreements. Protect your interests in joint ventures and collaborative projects.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "MOA",
      "memorandum of agreement",
      "formal agreement",
      "memorando de acuerdo",
      "acuerdo formal",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Memorandum of Agreement (MOA)",
        description:
          "Secure business deals and establish binding partnerships with formal agreements. Protect your interests in joint ventures and collaborative projects.",
        aliases: ["MOA", "memorandum of agreement", "formal agreement"],
      },
      es: {
        name: "Memorando de Acuerdo (MOA)",
        description:
          "Crea un MOA formal que establece obligaciones y acuerdos vinculantes entre partes.",
        aliases: ["MOA", "memorando de acuerdo", "acuerdo formal"],
      },
    },
  },
  "memorandum-of-understanding": {
    id: "memorandum-of-understanding",
    title: "Memorandum of Understanding (MOU)",
    description:
      "Build strong partnerships and secure business collaborations before formal contracts. Establish clear expectations and protect your interests in joint ventures.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "MOU",
      "memorandum of understanding",
      "cooperation agreement",
      "memorando de entendimiento",
      "acuerdo de cooperación",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Memorandum of Understanding (MOU)",
        description:
          "Build strong partnerships and secure business collaborations before formal contracts. Establish clear expectations and protect your interests in joint ventures.",
        aliases: [
          "MOU",
          "memorandum of understanding",
          "cooperation agreement",
        ],
      },
      es: {
        name: "Memorando de Entendimiento (MOU)",
        description:
          "Crea un MOU formal para delinear el entendimiento mutuo y la cooperación entre partes.",
        aliases: [
          "MOU",
          "memorando de entendimiento",
          "acuerdo de cooperación",
        ],
      },
    },
  },
  "mining-agreement": {
    id: "mining-agreement",
    title: "Mining Agreement",
    description: "Agreement for mineral extraction and mining rights.",
    category: "Environmental & Energy",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "mineral rights",
      "extraction agreement",
      "mining lease",
      "derechos minerales",
      "arrendamiento minero",
      "arrendamiento minero legal",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Mining Agreement",
        description: "Agreement for mineral extraction and mining rights.",
        aliases: ["mineral rights", "extraction agreement", "mining lease"],
      },
      es: {
        name: "Acuerdo Minero",
        description: "Acuerdo para extracción de minerales y derechos mineros.",
        aliases: [
          "derechos minerales",
          "arrendamiento minero",
          "arrendamiento minero legal",
        ],
      },
    },
  },
  "mining-lease-agreement": {
    id: "mining-lease-agreement",
    title: "Mining Lease Agreement",
    description:
      "Agreement for leasing land or mineral rights for mining operations.",
    category: "Real Estate & Property",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "mineral lease",
      "mining rights agreement",
      "extraction lease",
      "arrendamiento mineral",
      "acuerdo de derechos mineros",
      "arrendamiento de extracción",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Mining Lease Agreement",
        description:
          "Agreement for leasing land or mineral rights for mining operations.",
        aliases: [
          "mineral lease",
          "mining rights agreement",
          "extraction lease",
        ],
      },
      es: {
        name: "Acuerdo de Arrendamiento Minero",
        description:
          "Acuerdo para arrendar tierras o derechos minerales para operaciones mineras.",
        aliases: [
          "arrendamiento mineral",
          "acuerdo de derechos mineros",
          "arrendamiento de extracción",
        ],
      },
    },
  },
  "model-release": {
    id: "model-release",
    title: "Model Release",
    description: "Professional model release document.",
    category: "Legal",
    jurisdiction: "us",
    tags: [],
    aliases: ["model release"],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Model Release",
        description: "Professional model release document.",
        aliases: ["model release"],
      },
      es: {
        name: "Model Release en Español",
        description: "Documento profesional de model release.",
        aliases: ["model release"],
      },
    },
  },
  "mortgage-agreement": {
    id: "mortgage-agreement",
    title: "Mortgage Agreement",
    description:
      "Achieve homeownership with structured financing backed by real estate. Build equity while securing your family's future.",
    category: "Real Estate & Property",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "mortgage contract",
      "home loan agreement",
      "mortgage note",
      "contrato de hipoteca",
      "acuerdo de préstamo",
      "nota de la hipoteca",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Mortgage Agreement",
        description:
          "Achieve homeownership with structured financing backed by real estate. Build equity while securing your family's future.",
        aliases: ["mortgage contract", "home loan agreement", "mortgage note"],
      },
      es: {
        name: "Acuerdo de Hipoteca",
        description:
          "Formaliza el préstamo para comprar una casa. Establece pagos mensuales, tasa de interés y qué pasa si no puedes pagar.",
        aliases: [
          "contrato de hipoteca",
          "acuerdo de préstamo",
          "nota de la hipoteca",
        ],
      },
    },
  },
  "music-license-agreement": {
    id: "music-license-agreement",
    title: "Music License Agreement",
    description: "Professional music license agreement document.",
    category: "Legal",
    jurisdiction: "us",
    tags: [],
    aliases: ["music license agreement"],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Music License Agreement",
        description: "Professional music license agreement document.",
        aliases: ["music license agreement"],
      },
      es: {
        name: "Music License Agreement en Español",
        description: "Documento profesional de music license agreement.",
        aliases: ["music license agreement"],
      },
    },
  },
  "music-licensing-agreement": {
    id: "music-licensing-agreement",
    title: "Music Licensing Agreement",
    description:
      "Agreement for licensing music compositions and recordings for various uses.",
    category: "Entertainment & Media",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "music license",
      "sync license",
      "performance license",
      "licencia musical",
      "licencia de sincronización",
      "licencia de rendimiento",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Music Licensing Agreement",
        description:
          "Agreement for licensing music compositions and recordings for various uses.",
        aliases: ["music license", "sync license", "performance license"],
      },
      es: {
        name: "Acuerdo de Licencia Musical",
        description:
          "Acuerdo para licenciar composiciones musicales y grabaciones para varios usos.",
        aliases: [
          "licencia musical",
          "licencia de sincronización",
          "licencia de rendimiento",
        ],
      },
    },
  },
  "mutual-non-disclosure-agreement": {
    id: "mutual-non-disclosure-agreement",
    title: "Mutual Non-Disclosure Agreement (Mutual NDA)",
    description:
      "Two-way confidentiality agreement protecting information shared by both parties.",
    category: "Legal",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "mutual confidentiality",
      "bilateral nda",
      "two-way nda",
      "mutual secrecy",
      "confidencialidad mutua",
      "nda bilateral",
      "nda de dos vías",
      "secreto mutuo",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Mutual Non-Disclosure Agreement (Mutual NDA)",
        description:
          "Two-way confidentiality agreement protecting information shared by both parties.",
        aliases: [
          "mutual confidentiality",
          "bilateral nda",
          "two-way nda",
          "mutual secrecy",
        ],
      },
      es: {
        name: "Acuerdo Mutuo de Confidencialidad (NDA Mutuo)",
        description:
          "Acuerdo de confidencialidad bilateral que protege la información compartida por ambas partes.",
        aliases: [
          "confidencialidad mutua",
          "nda bilateral",
          "nda de dos vías",
          "secreto mutuo",
        ],
      },
    },
  },
  "name-change-notification-letter": {
    id: "name-change-notification-letter",
    title: "Name Change Notification Letter",
    description:
      "Letter to notify institutions and organizations of legal name change.",
    category: "Personal & Lifestyle",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "name change letter",
      "legal name update notification",
      "carta de cambio de nombre",
      "notificación de actualización de nombre",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Name Change Notification Letter",
        description:
          "Letter to notify institutions and organizations of legal name change.",
        aliases: ["name change letter", "legal name update notification"],
      },
      es: {
        name: "Carta de Notificación de Cambio de Nombre",
        description:
          "Carta para notificar a instituciones sobre cambio legal de nombre.",
        aliases: [
          "carta de cambio de nombre",
          "notificación de actualización de nombre",
        ],
      },
    },
  },
  nda: {
    id: "nda",
    title: "Non-Disclosure Agreement (NDA)",
    description: "Protect confidential information shared between parties.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "confidential",
      "nda",
      "protect idea",
      "secret",
      "confidencial",
      "proteger idea",
      "secreto",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Non-Disclosure Agreement (NDA)",
        description: "Protect confidential information shared between parties.",
        aliases: ["confidential", "nda", "protect idea", "secret"],
      },
      es: {
        name: "Acuerdo de Confidencialidad (NDA)",
        description:
          "Protege tus ideas de negocio y secretos comerciales. Evita que empleados, socios o contratistas compartan tu información confidencial con competidores.",
        aliases: ["confidencial", "nda", "proteger idea", "secreto"],
      },
    },
  },
  "non-compete-agreement": {
    id: "non-compete-agreement",
    title: "Non-Compete Agreement",
    description:
      "Protect your business secrets and customer relationships by preventing employees from becoming competitors.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "restrict competition",
      "former employee",
      "noncompete",
      "restringir competencia",
      "ex empleado",
      "no competencia",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Non-Compete Agreement",
        description:
          "Protect your business secrets and customer relationships by preventing employees from becoming competitors.",
        aliases: ["restrict competition", "former employee", "noncompete"],
      },
      es: {
        name: "Acuerdo de No Competencia",
        description:
          "Restringir a un empleado o contratista de competir después de la terminación.",
        aliases: ["restringir competencia", "ex empleado", "no competencia"],
      },
    },
  },
  "non-disclosure-agreement": {
    id: "non-disclosure-agreement",
    title: "Confidentiality Agreement (NDA)",
    description:
      "Protect your business secrets and confidential information when hiring employees or partners. Prevent competitors from stealing your valuable ideas.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "non-disclosure contract (nda)",
      "business document",
      "commercial agreement",
      "confidentiality agreement",
      "acuerdo de no divulgación",
      "contrato de confidencialidad",
      "documento comercial",
      "acuerdo de confidencialidad",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Confidentiality Agreement (NDA)",
        description:
          "Protect your business secrets and confidential information when hiring employees or partners. Prevent competitors from stealing your valuable ideas.",
        aliases: [
          "non-disclosure contract (nda)",
          "business document",
          "commercial agreement",
          "confidentiality agreement",
        ],
      },
      es: {
        name: "Acuerdo de Confidencialidad (NDA)",
        description:
          "Protege secretos comerciales e información confidencial al contratar empleados o socios. Previene compartir secretos con competidores.",
        aliases: [
          "acuerdo de no divulgación",
          "contrato de confidencialidad",
          "documento comercial",
          "acuerdo de confidencialidad",
        ],
      },
    },
  },
  "nonprofit-bylaws": {
    id: "nonprofit-bylaws",
    title: "Nonprofit Bylaws",
    description:
      "Establish strong governance for your nonprofit organization with bylaws that ensure proper operations and compliance.",
    category: "Business & Commercial",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "501c3 bylaws",
      "charity bylaws",
      "nonprofit constitution",
      "estatutos 501c3",
      "reglamento de ONG",
      "constitución sin fines de lucro",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Nonprofit Bylaws",
        description:
          "Establish strong governance for your nonprofit organization with bylaws that ensure proper operations and compliance.",
        aliases: ["501c3 bylaws", "charity bylaws", "nonprofit constitution"],
      },
      es: {
        name: "Estatutos de Organización Sin Fines de Lucro",
        description:
          "Estatutos para organizaciones sin fines de lucro y entidades caritativas.",
        aliases: [
          "estatutos 501c3",
          "reglamento de ONG",
          "constitución sin fines de lucro",
        ],
      },
    },
  },
  "notarization-request": {
    id: "notarization-request",
    title: "Notarization Request",
    description:
      "Form to request notarial services for document authentication.",
    category: "Government & Legal Services",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "notary request",
      "document notarization",
      "notarial certificate",
      "solicitud notarial",
      "notarización de documento",
      "certificado notarial",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Notarization Request",
        description:
          "Form to request notarial services for document authentication.",
        aliases: [
          "notary request",
          "document notarization",
          "notarial certificate",
        ],
      },
      es: {
        name: "Solicitud de Notarización",
        description:
          "Formulario para solicitar servicios notariales para autenticación de documentos.",
        aliases: [
          "solicitud notarial",
          "notarización de documento",
          "certificado notarial",
        ],
      },
    },
  },
  "notice-of-lease-violation": {
    id: "notice-of-lease-violation",
    title: "Notice of Lease Violation",
    description: "Official notice to tenants for lease agreement violations",
    category: "Real Estate & Property",
    jurisdiction: "us",
    tags: [],
    aliases: [],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Notice of Lease Violation",
        description:
          "Official notice to tenants for lease agreement violations",
        aliases: [],
      },
      es: {
        name: "Aviso de incumplimiento de contrato de arrendamiento",
        description:
          "Notificación oficial para inquilinos que incumplen el contrato de arrendamiento.",
        aliases: [],
      },
    },
  },
  "notice-to-enter": {
    id: "notice-to-enter",
    title: "Notice to Enter",
    description:
      "Landlord notice to enter rental property for inspections or repairs",
    category: "Real Estate & Property",
    jurisdiction: "us",
    tags: [],
    aliases: [],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Notice to Enter",
        description:
          "Landlord notice to enter rental property for inspections or repairs",
        aliases: [],
      },
      es: {
        name: "Aviso de ingreso a la propiedad",
        description:
          "Aviso del arrendador para ingresar a la propiedad rentada para inspecciones o reparaciones.",
        aliases: [],
      },
    },
  },
  "notice-to-pay-rent-or-quit": {
    id: "notice-to-pay-rent-or-quit",
    title: "Notice to Pay Rent or Quit",
    description:
      "Legal notice for unpaid rent requiring payment or vacating premises",
    category: "Real Estate & Property",
    jurisdiction: "us",
    tags: [],
    aliases: [],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Notice to Pay Rent or Quit",
        description:
          "Legal notice for unpaid rent requiring payment or vacating premises",
        aliases: [],
      },
      es: {
        name: "Aviso para pagar la renta o desocupar",
        description:
          "Notificación legal por renta impaga que exige el pago inmediato o la desocupación de la vivienda.",
        aliases: [],
      },
    },
  },
  "notice-to-proceed": {
    id: "notice-to-proceed",
    title: "Notice to Proceed",
    description:
      "Official authorization for contractor to begin construction work on a project.",
    category: "Construction",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "commencement notice",
      "start work authorization",
      "proceed order",
      "aviso de inicio",
      "autorización de trabajo",
      "orden de proceder",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Notice to Proceed",
        description:
          "Official authorization for contractor to begin construction work on a project.",
        aliases: [
          "commencement notice",
          "start work authorization",
          "proceed order",
        ],
      },
      es: {
        name: "Aviso para Proceder",
        description:
          "Autorización oficial para que el contratista comience el trabajo de construcción en un proyecto.",
        aliases: [
          "aviso de inicio",
          "autorización de trabajo",
          "orden de proceder",
        ],
      },
    },
  },
  "offer-letter": {
    id: "offer-letter",
    title: "Job Offer Letter",
    description:
      "Create a professional employment offer letter with our easy-to-use template. State-specific requirements included.",
    category: "Employment",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "job offer letter",
      "employment offer",
      "offer of employment",
      "job offer",
      "oferta de trabajo",
      "carta de trabajo",
      "oferta de empleo",
      "oferta de trabajo legal",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Job Offer Letter",
        description:
          "Create a professional employment offer letter with our easy-to-use template. State-specific requirements included.",
        aliases: [
          "job offer letter",
          "employment offer",
          "offer of employment",
          "job offer",
        ],
      },
      es: {
        name: "Carta de Oferta Laboral",
        description:
          "Crea una carta de oferta de empleo profesional con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.",
        aliases: [
          "oferta de trabajo",
          "carta de trabajo",
          "oferta de empleo",
          "oferta de trabajo legal",
        ],
      },
    },
  },
  "office-space-lease": {
    id: "office-space-lease",
    title: "Office Space Lease",
    description: "Commercial lease agreement specifically for office spaces",
    category: "Business & Commercial",
    jurisdiction: "us",
    tags: [],
    aliases: [],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Office Space Lease",
        description:
          "Commercial lease agreement specifically for office spaces",
        aliases: [],
      },
      es: {
        name: "Contrato de arrendamiento de oficina",
        description:
          "Contrato de arrendamiento comercial específico para espacios de oficina.",
        aliases: [],
      },
    },
  },
  "oil-gas-lease": {
    id: "oil-gas-lease",
    title: "Oil & Gas Lease",
    description: "Lease agreement for oil and gas exploration and extraction.",
    category: "Environmental & Energy",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "mineral lease",
      "drilling rights",
      "energy lease",
      "arrendamiento mineral",
      "derechos de perforación",
      "arrendamiento de energía",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Oil & Gas Lease",
        description:
          "Lease agreement for oil and gas exploration and extraction.",
        aliases: ["mineral lease", "drilling rights", "energy lease"],
      },
      es: {
        name: "Arrendamiento de Petróleo y Gas",
        description:
          "Acuerdo de arrendamiento para exploración y extracción de petróleo y gas.",
        aliases: [
          "arrendamiento mineral",
          "derechos de perforación",
          "arrendamiento de energía",
        ],
      },
    },
  },
  "oil-gas-lease-agreement": {
    id: "oil-gas-lease-agreement",
    title: "Oil and Gas Lease Agreement",
    description:
      "Maximize income from your land by leasing mineral rights for oil and gas exploration with fair terms and royalties.",
    category: "Real Estate & Property",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "petroleum lease",
      "drilling rights agreement",
      "hydrocarbon lease",
      "arrendamiento petrolero",
      "acuerdo de perforación",
      "arrendamiento de hidrocarburos",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Oil and Gas Lease Agreement",
        description:
          "Maximize income from your land by leasing mineral rights for oil and gas exploration with fair terms and royalties.",
        aliases: [
          "petroleum lease",
          "drilling rights agreement",
          "hydrocarbon lease",
        ],
      },
      es: {
        name: "Acuerdo de Arrendamiento de Petróleo y Gas",
        description:
          "Acuerdo para arrendar derechos minerales para exploración y producción de petróleo y gas.",
        aliases: [
          "arrendamiento petrolero",
          "acuerdo de perforación",
          "arrendamiento de hidrocarburos",
        ],
      },
    },
  },
  "parenting-plan": {
    id: "parenting-plan",
    title: "Parenting Plan",
    description:
      "Put your children first with a detailed plan that ensures their well-being through custody and visitation schedules.",
    category: "Family & Personal",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "custody agreement",
      "visitation schedule",
      "co-parenting plan",
      "acuerdo de custodia",
      "horario de visitación",
      "plan de co-crianza",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Parenting Plan",
        description:
          "Put your children first with a detailed plan that ensures their well-being through custody and visitation schedules.",
        aliases: [
          "custody agreement",
          "visitation schedule",
          "co-parenting plan",
        ],
      },
      es: {
        name: "Plan de Crianza",
        description:
          "Plan integral para custodia infantil, visitación y responsabilidades parentales.",
        aliases: [
          "acuerdo de custodia",
          "horario de visitación",
          "plan de co-crianza",
        ],
      },
    },
  },
  "parking-space-lease-agreement": {
    id: "parking-space-lease-agreement",
    title: "Parking Space Lease Agreement",
    description: "Lease agreement for parking spaces and garages",
    category: "Real Estate & Property",
    jurisdiction: "us",
    tags: [],
    aliases: [],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Parking Space Lease Agreement",
        description: "Lease agreement for parking spaces and garages",
        aliases: [],
      },
      es: {
        name: "Contrato de arrendamiento de estacionamiento",
        description:
          "Contrato de arrendamiento para espacios de estacionamiento y garajes.",
        aliases: [],
      },
    },
  },
  "partnership-agreement": {
    id: "partnership-agreement",
    title: "Partnership Agreement",
    description:
      "Start a business with partners and avoid future conflicts. Define ownership, responsibilities, and what happens if someone leaves.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "business partners",
      "joint venture",
      "partner terms",
      "socios de negocios",
      "empresa conjunta",
      "términos de socios",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Partnership Agreement",
        description:
          "Start a business with partners and avoid future conflicts. Define ownership, responsibilities, and what happens if someone leaves.",
        aliases: ["business partners", "joint venture", "partner terms"],
      },
      es: {
        name: "Acuerdo de Sociedad",
        description:
          "Evita conflictos y protege tu inversión al iniciar un negocio con socios. Define claramente responsabilidades, aportaciones y reparto de ganancias.",
        aliases: [
          "socios de negocios",
          "empresa conjunta",
          "términos de socios",
        ],
      },
    },
  },
  "partnership-amendment": {
    id: "partnership-amendment",
    title: "Partnership Amendment",
    description:
      "Amendment to modify existing partnership agreement terms and conditions.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "partnership modification",
      "agreement amendment",
      "partnership change",
      "modificación de sociedad",
      "enmienda de acuerdo",
      "cambio de sociedad",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Partnership Amendment",
        description:
          "Amendment to modify existing partnership agreement terms and conditions.",
        aliases: [
          "partnership modification",
          "agreement amendment",
          "partnership change",
        ],
      },
      es: {
        name: "Enmienda de Sociedad",
        description:
          "Enmienda para modificar los términos y condiciones del acuerdo de sociedad existente.",
        aliases: [
          "modificación de sociedad",
          "enmienda de acuerdo",
          "cambio de sociedad",
        ],
      },
    },
  },
  "partnership-dissolution-agreement": {
    id: "partnership-dissolution-agreement",
    title: "Partnership Dissolution Agreement",
    description:
      "End your business partnership fairly by properly dividing assets and closing operations without disputes.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "partnership termination",
      "business dissolution",
      "wind-up agreement",
      "terminación de sociedad",
      "disolución de negocio",
      "acuerdo de liquidación",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Partnership Dissolution Agreement",
        description:
          "End your business partnership fairly by properly dividing assets and closing operations without disputes.",
        aliases: [
          "partnership termination",
          "business dissolution",
          "wind-up agreement",
        ],
      },
      es: {
        name: "Acuerdo de Disolución de Sociedad",
        description:
          "Acuerdo para disolver formalmente una sociedad y distribuir activos.",
        aliases: [
          "terminación de sociedad",
          "disolución de negocio",
          "acuerdo de liquidación",
        ],
      },
    },
  },
  "patent-application-assignment": {
    id: "patent-application-assignment",
    title: "Patent Application Assignment Agreement",
    description:
      "Legal document to transfer patent application rights from one party to another.",
    category: "Intellectual Property",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "patent app assignment",
      "application transfer",
      "patent application transfer",
      "patent rights assignment",
      "asignación solicitud patente",
      "transferencia aplicación",
      "transferencia solicitud patente",
      "asignación derechos patente",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Patent Application Assignment Agreement",
        description:
          "Legal document to transfer patent application rights from one party to another.",
        aliases: [
          "patent app assignment",
          "application transfer",
          "patent application transfer",
          "patent rights assignment",
        ],
      },
      es: {
        name: "Acuerdo de Asignación de Solicitud de Patente",
        description:
          "Documento legal para transferir los derechos de solicitud de patente de una parte a otra.",
        aliases: [
          "asignación solicitud patente",
          "transferencia aplicación",
          "transferencia solicitud patente",
          "asignación derechos patente",
        ],
      },
    },
  },
  "patent-assignment": {
    id: "patent-assignment",
    title: "Patent Assignment Agreement",
    description:
      "Complete patent transactions safely by ensuring proper ownership transfer with full legal documentation.",
    category: "Intellectual Property",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "patent transfer",
      "patent ownership transfer",
      "patent conveyance",
      "patent sale",
      "transferencia de patente",
      "transferencia propiedad patente",
      "transmisión patente",
      "venta patente",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Patent Assignment Agreement",
        description:
          "Complete patent transactions safely by ensuring proper ownership transfer with full legal documentation.",
        aliases: [
          "patent transfer",
          "patent ownership transfer",
          "patent conveyance",
          "patent sale",
        ],
      },
      es: {
        name: "Acuerdo de Asignación de Patente",
        description:
          "Documento legal para transferir la propiedad de una patente de una parte a otra.",
        aliases: [
          "transferencia de patente",
          "transferencia propiedad patente",
          "transmisión patente",
          "venta patente",
        ],
      },
    },
  },
  "patent-license-agreement": {
    id: "patent-license-agreement",
    title: "Patent License Agreement",
    description:
      "Comprehensive agreement for licensing patent rights with royalty and technical provisions.",
    category: "Intellectual Property",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "patent licensing contract",
      "technology license agreement",
      "patent usage agreement",
      "contrato de licencia de patente",
      "acuerdo de licencia tecnológica",
      "acuerdo de uso de patentes",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Patent License Agreement",
        description:
          "Comprehensive agreement for licensing patent rights with royalty and technical provisions.",
        aliases: [
          "patent licensing contract",
          "technology license agreement",
          "patent usage agreement",
        ],
      },
      es: {
        name: "Acuerdo de Licencia de Patente",
        description:
          "Acuerdo integral para licenciar derechos de patente con provisiones técnicas y de regalías.",
        aliases: [
          "contrato de licencia de patente",
          "acuerdo de licencia tecnológica",
          "acuerdo de uso de patentes",
        ],
      },
    },
  },
  "patent-licensing-agreement": {
    id: "patent-licensing-agreement",
    title: "Patent Licensing Agreement",
    description:
      "Agreement for licensing patent rights and intellectual property usage.",
    category: "Intellectual Property",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "patent license",
      "ip licensing agreement",
      "technology licensing contract",
      "licencia de patente",
      "contrato de propiedad intelectual",
      "contrato de licencia de tecnología",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Patent Licensing Agreement",
        description:
          "Agreement for licensing patent rights and intellectual property usage.",
        aliases: [
          "patent license",
          "ip licensing agreement",
          "technology licensing contract",
        ],
      },
      es: {
        name: "Acuerdo de Licencia de Patente",
        description:
          "Acuerdo para licenciar derechos de patente y uso de propiedad intelectual.",
        aliases: [
          "licencia de patente",
          "contrato de propiedad intelectual",
          "contrato de licencia de tecnología",
        ],
      },
    },
  },
  "payment-bond": {
    id: "payment-bond",
    title: "Payment Bond",
    description:
      "Surety bond guaranteeing payment to subcontractors and material suppliers on construction projects.",
    category: "Legal",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "labor and material bond",
      "subcontractor payment bond",
      "supplier bond",
      "fianza de trabajo y materiales",
      "fianza de pago de subcontratistas",
      "bono de proveedor",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Payment Bond",
        description:
          "Surety bond guaranteeing payment to subcontractors and material suppliers on construction projects.",
        aliases: [
          "labor and material bond",
          "subcontractor payment bond",
          "supplier bond",
        ],
      },
      es: {
        name: "Fianza de Pago",
        description:
          "Fianza de garantía que garantiza el pago a subcontratistas y proveedores de materiales en proyectos de construcción.",
        aliases: [
          "fianza de trabajo y materiales",
          "fianza de pago de subcontratistas",
          "bono de proveedor",
        ],
      },
    },
  },
  "payment-plan": {
    id: "payment-plan",
    title: "Payment Plan Agreement",
    description:
      "Structure installment payments for debts, purchases, or services.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "installment plan",
      "payment schedule",
      "payment arrangement",
      "plan de cuotas",
      "cronograma de pagos",
      "arreglo de pagos",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Payment Plan Agreement",
        description:
          "Structure installment payments for debts, purchases, or services.",
        aliases: [
          "installment plan",
          "payment schedule",
          "payment arrangement",
        ],
      },
      es: {
        name: "Acuerdo de Plan de Pagos",
        description:
          "Estructurar pagos a plazos para deudas, compras o servicios.",
        aliases: ["plan de cuotas", "cronograma de pagos", "arreglo de pagos"],
      },
    },
  },
  "performance-bond": {
    id: "performance-bond",
    title: "Performance Bond",
    description:
      "Legal bond guaranteeing completion of contractual obligations and performance standards.",
    category: "Legal",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "contract performance bond",
      "completion bond",
      "surety bond",
      "fianza de rendimiento de contrato",
      "bono de cumplimiento",
      "bono de fianza",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Performance Bond",
        description:
          "Legal bond guaranteeing completion of contractual obligations and performance standards.",
        aliases: [
          "contract performance bond",
          "completion bond",
          "surety bond",
        ],
      },
      es: {
        name: "Fianza de Cumplimiento",
        description:
          "Fianza legal que garantiza el cumplimiento de obligaciones contractuales y estándares de rendimiento.",
        aliases: [
          "fianza de rendimiento de contrato",
          "bono de cumplimiento",
          "bono de fianza",
        ],
      },
    },
  },
  "personal-care-agreement": {
    id: "personal-care-agreement",
    title: "Personal Care Agreement",
    description:
      "Agreement for personal care services including caregiving, assistance, and support.",
    category: "Family",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "caregiver agreement",
      "personal assistance contract",
      "care services agreement",
      "acuerdo de cuidador",
      "contrato de asistencia personal",
      "acuerdo de servicios de atención",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Personal Care Agreement",
        description:
          "Agreement for personal care services including caregiving, assistance, and support.",
        aliases: [
          "caregiver agreement",
          "personal assistance contract",
          "care services agreement",
        ],
      },
      es: {
        name: "Acuerdo de Cuidado Personal",
        description:
          "Acuerdo para servicios de cuidado personal incluyendo cuidado, asistencia y apoyo.",
        aliases: [
          "acuerdo de cuidador",
          "contrato de asistencia personal",
          "acuerdo de servicios de atención",
        ],
      },
    },
  },
  "personal-loan-agreement": {
    id: "personal-loan-agreement",
    title: "Personal Loan Agreement",
    description:
      "Protect your money when lending to friends or family and avoid damaged relationships. Ensure clear repayment terms and legal recourse if needed.",
    category: "Finance",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "loan contract",
      "lending agreement",
      "borrower agreement",
      "contrato de préstamo",
      "acuerdo de préstamo",
      "acuerdo de prestatario",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Personal Loan Agreement",
        description:
          "Protect your money when lending to friends or family and avoid damaged relationships. Ensure clear repayment terms and legal recourse if needed.",
        aliases: ["loan contract", "lending agreement", "borrower agreement"],
      },
      es: {
        name: "Acuerdo de Préstamo Personal",
        description:
          "Acuerdo integral para préstamos personales con términos de pago detallados y protecciones.",
        aliases: [
          "contrato de préstamo",
          "acuerdo de préstamo",
          "acuerdo de prestatario",
        ],
      },
    },
  },
  "personal-training-agreement": {
    id: "personal-training-agreement",
    title: "Personal Training Agreement",
    description:
      "Agreement between personal trainer and client for fitness training services.",
    category: "Personal & Lifestyle",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "fitness training contract",
      "personal trainer agreement",
      "training services contract",
      "contrato de entrenamiento físico",
      "acuerdo de entrenador personal",
      "contrato de servicios de capacitación",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Personal Training Agreement",
        description:
          "Agreement between personal trainer and client for fitness training services.",
        aliases: [
          "fitness training contract",
          "personal trainer agreement",
          "training services contract",
        ],
      },
      es: {
        name: "Acuerdo de Entrenamiento Personal",
        description:
          "Acuerdo entre entrenador personal y cliente para servicios de entrenamiento físico.",
        aliases: [
          "contrato de entrenamiento físico",
          "acuerdo de entrenador personal",
          "contrato de servicios de capacitación",
        ],
      },
    },
  },
  "pet-addendum": {
    id: "pet-addendum",
    title: "Pet Addendum",
    description: "Add pet terms to existing lease agreements",
    category: "Real Estate & Property",
    jurisdiction: "us",
    tags: [],
    aliases: [],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Pet Addendum",
        description: "Add pet terms to existing lease agreements",
        aliases: [],
      },
      es: {
        name: "Anexo de mascotas",
        description:
          "Agrega cláusulas sobre mascotas a contratos de arrendamiento existentes.",
        aliases: [],
      },
    },
  },
  "pet-agreement": {
    id: "pet-agreement",
    title: "Pet Agreement",
    description:
      "Establish rules and responsibilities for pets in rental properties.",
    category: "Real Estate",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "pet addendum",
      "pet policy",
      "pet lease addendum",
      "adenda de mascotas",
      "política de mascotas",
      "anexo de arrendamiento de mascotas",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Pet Agreement",
        description:
          "Establish rules and responsibilities for pets in rental properties.",
        aliases: ["pet addendum", "pet policy", "pet lease addendum"],
      },
      es: {
        name: "Acuerdo de Mascotas",
        description:
          "Establece reglas y responsabilidades para mascotas en propiedades de alquiler.",
        aliases: [
          "adenda de mascotas",
          "política de mascotas",
          "anexo de arrendamiento de mascotas",
        ],
      },
    },
  },
  "pet-custody-agreement": {
    id: "pet-custody-agreement",
    title: "Pet Custody Agreement",
    description:
      "Agreement establishing custody, care, and financial responsibilities for pets.",
    category: "Family",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "pet custody contract",
      "animal custody agreement",
      "pet sharing agreement",
      "contrato de custodia de mascotas",
      "acuerdo de cuidado animal",
      "acuerdo de intercambio de mascotas",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Pet Custody Agreement",
        description:
          "Agreement establishing custody, care, and financial responsibilities for pets.",
        aliases: [
          "pet custody contract",
          "animal custody agreement",
          "pet sharing agreement",
        ],
      },
      es: {
        name: "Acuerdo de Custodia de Mascotas",
        description:
          "Acuerdo que establece custodia, cuidado y responsabilidades financieras para mascotas.",
        aliases: [
          "contrato de custodia de mascotas",
          "acuerdo de cuidado animal",
          "acuerdo de intercambio de mascotas",
        ],
      },
    },
  },
  "photo-release-form": {
    id: "photo-release-form",
    title: "Photo Release Form",
    description:
      "Use photos safely in your marketing without legal risks. Get proper permission for commercial use and advertising.",
    category: "Legal",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "photography release",
      "image release",
      "photo consent",
      "picture release",
      "liberación fotografía",
      "liberación imagen",
      "consentimiento foto",
      "liberación fotografica",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Photo Release Form",
        description:
          "Use photos safely in your marketing without legal risks. Get proper permission for commercial use and advertising.",
        aliases: [
          "photography release",
          "image release",
          "photo consent",
          "picture release",
        ],
      },
      es: {
        name: "Formulario de Liberación Fotográfica",
        description:
          "Formulario simple de permiso para usar la foto de alguien comercialmente. Requerido para marketing, sitios web y publicaciones.",
        aliases: [
          "liberación fotografía",
          "liberación imagen",
          "consentimiento foto",
          "liberación fotografica",
        ],
      },
    },
  },
  "photography-release": {
    id: "photography-release",
    title: "Photography Release",
    description:
      "Release form granting permission to use photographs and images.",
    category: "Entertainment & Media",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "photo release",
      "image release",
      "model release",
      "liberación de foto",
      "liberación de imagen",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Photography Release",
        description:
          "Release form granting permission to use photographs and images.",
        aliases: ["photo release", "image release", "model release"],
      },
      es: {
        name: "Liberación de Fotografía",
        description:
          "Da permiso para usar tus fotos en marketing, redes sociales o publicaciones. Protege fotógrafos y modelos al definir cómo se usan imágenes.",
        aliases: [
          "liberación de foto",
          "liberación de imagen",
          "model release",
        ],
      },
    },
  },
  "postnuptial-agreement": {
    id: "postnuptial-agreement",
    title: "Postnuptial Agreement",
    description:
      "Agreement between married spouses regarding property and financial matters.",
    category: "Family & Personal",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "post-marital agreement",
      "marital property agreement",
      "acuerdo post-matrimonial",
      "acuerdo de propiedad marital",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Postnuptial Agreement",
        description:
          "Agreement between married spouses regarding property and financial matters.",
        aliases: ["post-marital agreement", "marital property agreement"],
      },
      es: {
        name: "Acuerdo Postnupcial",
        description:
          "Acuerdo entre cónyuges casados sobre asuntos de propiedad y financieros.",
        aliases: ["acuerdo post-matrimonial", "acuerdo de propiedad marital"],
      },
    },
  },
  "pour-over-will": {
    id: "pour-over-will",
    title: "Pour-Over Will",
    description:
      "A will that transfers assets to your existing trust, ensuring trust administration of all assets.",
    category: "Estate Planning",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "trust will",
      "pour over will",
      "trust transfer will",
      "estate planning will",
      "testamento fideicomiso",
      "testamento de transferencia",
      "testamento de administración",
      "planificación patrimonial will",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Pour-Over Will",
        description:
          "A will that transfers assets to your existing trust, ensuring trust administration of all assets.",
        aliases: [
          "trust will",
          "pour over will",
          "trust transfer will",
          "estate planning will",
        ],
      },
      es: {
        name: "Testamento de Transferencia",
        description:
          "Un testamento que transfiere activos a su fideicomiso existente, asegurando la administración fiduciaria de todos los activos.",
        aliases: [
          "testamento fideicomiso",
          "testamento de transferencia",
          "testamento de administración",
          "planificación patrimonial will",
        ],
      },
    },
  },
  "power-of-attorney": {
    id: "power-of-attorney",
    title: "General Power of Attorney",
    description:
      "Maintain control over your affairs even when unavailable. Ensure trusted agents can act on your behalf in emergencies.",
    category: "Personal",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "represent me",
      "act on my behalf",
      "authorize someone",
      "financial poa",
      "representarme",
      "actuar en mi nombre",
      "autorizar a alguien",
      "poder financiero",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "General Power of Attorney",
        description:
          "Maintain control over your affairs even when unavailable. Ensure trusted agents can act on your behalf in emergencies.",
        aliases: [
          "represent me",
          "act on my behalf",
          "authorize someone",
          "financial poa",
        ],
      },
      es: {
        name: "Poder Notarial General",
        description:
          "Asegura que alguien de confianza pueda manejar tus finanzas y asuntos legales si te enfermas o viajas. Evita complicaciones familiares en emergencias.",
        aliases: [
          "representarme",
          "actuar en mi nombre",
          "autorizar a alguien",
          "poder financiero",
        ],
      },
    },
  },
  "power-of-attorney-for-child": {
    id: "power-of-attorney-for-child",
    title: "Power of Attorney for Minor Child",
    description:
      "Grant temporary authority to another person to make decisions for your minor child when you are unavailable.",
    category: "Estate Planning",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "child poa",
      "minor child power of attorney",
      "temporary guardianship",
      "child care authorization",
      "poder para menor",
      "autorización cuidado menor",
      "tutela temporal",
      "autorización de cuidado infantil",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Power of Attorney for Minor Child",
        description:
          "Grant temporary authority to another person to make decisions for your minor child when you are unavailable.",
        aliases: [
          "child poa",
          "minor child power of attorney",
          "temporary guardianship",
          "child care authorization",
        ],
      },
      es: {
        name: "Poder Notarial para Menor de Edad",
        description:
          "Otorgar autoridad temporal a otra persona para tomar decisiones por su hijo menor cuando usted no esté disponible.",
        aliases: [
          "poder para menor",
          "autorización cuidado menor",
          "tutela temporal",
          "autorización de cuidado infantil",
        ],
      },
    },
  },
  "prenuptial-agreement": {
    id: "prenuptial-agreement",
    title: "Prenuptial Agreement",
    description:
      "Start marriage with financial clarity and protection. Preserve individual assets while building shared wealth.",
    category: "Family",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "prenup",
      "marriage contract",
      "before marriage agreement",
      "contrato matrimonial",
      "acuerdo prematrimonial",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Prenuptial Agreement",
        description:
          "Start marriage with financial clarity and protection. Preserve individual assets while building shared wealth.",
        aliases: ["prenup", "marriage contract", "before marriage agreement"],
      },
      es: {
        name: "Acuerdo Prenupcial",
        description:
          "Protege tus bienes y define responsabilidades financieras antes de casarte. Previene disputas si la relación termina.",
        aliases: ["prenup", "contrato matrimonial", "acuerdo prematrimonial"],
      },
    },
  },
  "private-placement-memorandum": {
    id: "private-placement-memorandum",
    title: "Private Placement Memorandum",
    description:
      "Comprehensive document for private securities offerings to accredited investors.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "PPM",
      "private offering document",
      "securities memorandum",
      "documento de oferta privada",
      "memorando de valores",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Private Placement Memorandum",
        description:
          "Comprehensive document for private securities offerings to accredited investors.",
        aliases: ["PPM", "private offering document", "securities memorandum"],
      },
      es: {
        name: "Memorando de Colocación Privada",
        description:
          "Documento integral para ofertas privadas de valores a inversores acreditados.",
        aliases: ["PPM", "documento de oferta privada", "memorando de valores"],
      },
    },
  },
  "product-liability-waiver": {
    id: "product-liability-waiver",
    title: "Product Liability Waiver",
    description:
      "Release form protecting manufacturers and retailers from product-related claims and injuries.",
    category: "Risk Management",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "product waiver",
      "manufacturing liability waiver",
      "product release",
      "exención de producto",
      "liberación de fabricante",
      "liberación de productos",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Product Liability Waiver",
        description:
          "Release form protecting manufacturers and retailers from product-related claims and injuries.",
        aliases: [
          "product waiver",
          "manufacturing liability waiver",
          "product release",
        ],
      },
      es: {
        name: "Exención de Responsabilidad de Producto",
        description:
          "Formulario de liberación que protege a fabricantes y vendedores de reclamos relacionados con productos.",
        aliases: [
          "exención de producto",
          "liberación de fabricante",
          "liberación de productos",
        ],
      },
    },
  },
  "professional-liability-waiver": {
    id: "professional-liability-waiver",
    title: "Professional Liability Waiver",
    description:
      "Waiver protecting professionals from malpractice and professional liability claims.",
    category: "Risk Management",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "malpractice waiver",
      "professional indemnity waiver",
      "service liability waiver",
      "exención de negligencia profesional",
      "exención de servicios profesionales",
      "renuncia de responsabilidad del servicio",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Professional Liability Waiver",
        description:
          "Waiver protecting professionals from malpractice and professional liability claims.",
        aliases: [
          "malpractice waiver",
          "professional indemnity waiver",
          "service liability waiver",
        ],
      },
      es: {
        name: "Exención de Responsabilidad Profesional",
        description:
          "Exención que protege a profesionales de reclamos de negligencia profesional y responsabilidad.",
        aliases: [
          "exención de negligencia profesional",
          "exención de servicios profesionales",
          "renuncia de responsabilidad del servicio",
        ],
      },
    },
  },
  "progressive-discipline-policy": {
    id: "progressive-discipline-policy",
    title: "Progressive Discipline Policy",
    description:
      "Comprehensive company policy outlining disciplinary procedures and progressive corrective actions.",
    category: "HR",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "disciplinary policy",
      "employee discipline procedures",
      "corrective action policy",
      "política disciplinaria",
      "procedimientos de disciplina de empleados",
      "política de acción correctiva",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Progressive Discipline Policy",
        description:
          "Comprehensive company policy outlining disciplinary procedures and progressive corrective actions.",
        aliases: [
          "disciplinary policy",
          "employee discipline procedures",
          "corrective action policy",
        ],
      },
      es: {
        name: "Política de Disciplina Progresiva",
        description:
          "Política integral de la empresa que describe los procedimientos disciplinarios y las acciones correctivas progresivas.",
        aliases: [
          "política disciplinaria",
          "procedimientos de disciplina de empleados",
          "política de acción correctiva",
        ],
      },
    },
  },
  "promissory-note": {
    id: "promissory-note",
    title: "Promissory Note",
    description:
      "Create legally enforceable payment obligations with simple documentation. Protect yourself when lending money informally.",
    category: "Finance",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "iou",
      "loan paper",
      "promise to pay",
      "loan document",
      "pagaré",
      "documento de préstamo",
      "promesa de pago",
      "documento de préstamo legal",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Promissory Note",
        description:
          "Create legally enforceable payment obligations with simple documentation. Protect yourself when lending money informally.",
        aliases: ["iou", "loan paper", "promise to pay", "loan document"],
      },
      es: {
        name: "Pagaré",
        description:
          "Protege tu préstamo personal y asegura el reembolso. Establece términos claros de pago, interés y consecuencias por incumplimiento.",
        aliases: [
          "pagaré",
          "documento de préstamo",
          "promesa de pago",
          "documento de préstamo legal",
        ],
      },
    },
  },
  "promissory-note-balloon-payments": {
    id: "promissory-note-balloon-payments",
    title: "Promissory Note - Balloon Payments",
    description:
      "Create a promissory note with balloon payment structure, including regular payments and final balloon payment.",
    category: "Finance",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "balloon loan",
      "balloon note",
      "balloon payment loan",
      "balloon promissory note",
      "préstamo globo",
      "nota globo",
      "préstamo con pago globo",
      "pagaré globo",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Promissory Note - Balloon Payments",
        description:
          "Create a promissory note with balloon payment structure, including regular payments and final balloon payment.",
        aliases: [
          "balloon loan",
          "balloon note",
          "balloon payment loan",
          "balloon promissory note",
        ],
      },
      es: {
        name: "Pagaré - Pagos Globo",
        description:
          "Crear un pagaré con estructura de pago globo, incluyendo pagos regulares y pago final globo.",
        aliases: [
          "préstamo globo",
          "nota globo",
          "préstamo con pago globo",
          "pagaré globo",
        ],
      },
    },
  },
  "promissory-note-installment-payments": {
    id: "promissory-note-installment-payments",
    title: "Promissory Note - Installment Payments",
    description:
      "Create a promissory note with structured installment payments, including payment schedule and terms.",
    category: "Finance",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "installment loan",
      "payment plan note",
      "structured loan",
      "installment promissory note",
      "préstamo a plazos",
      "nota de plan de pagos",
      "préstamo estructurado",
      "pagaré a plazos",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Promissory Note - Installment Payments",
        description:
          "Create a promissory note with structured installment payments, including payment schedule and terms.",
        aliases: [
          "installment loan",
          "payment plan note",
          "structured loan",
          "installment promissory note",
        ],
      },
      es: {
        name: "Pagaré - Pagos a Plazos",
        description:
          "Crear un pagaré con pagos estructurados a plazos, incluyendo cronograma de pagos y términos.",
        aliases: [
          "préstamo a plazos",
          "nota de plan de pagos",
          "préstamo estructurado",
          "pagaré a plazos",
        ],
      },
    },
  },
  "proof-of-income-letter": {
    id: "proof-of-income-letter",
    title: "Proof of Income Letter",
    description: "Official letter verifying employee income for third parties",
    category: "HR",
    jurisdiction: "us",
    tags: [],
    aliases: [],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Proof of Income Letter",
        description:
          "Official letter verifying employee income for third parties",
        aliases: [],
      },
      es: {
        name: "Proof of Income Letter",
        description:
          "Official letter verifying employee income for third parties",
        aliases: [],
      },
    },
  },
  "property-deed": {
    id: "property-deed",
    title: "Property Deed",
    description:
      "Create a legally binding Property Deed with our easy-to-use template. State-specific requirements included.",
    category: "Real Estate",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "real estate deed",
      "property transfer",
      "deed of property",
      "escritura inmobiliaria",
      "transferencia de propiedad",
      "título de propiedad",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Property Deed",
        description:
          "Create a legally binding Property Deed with our easy-to-use template. State-specific requirements included.",
        aliases: ["real estate deed", "property transfer", "deed of property"],
      },
      es: {
        name: "Escritura de Propiedad",
        description:
          "Crea una Escritura de Propiedad legalmente válida con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.",
        aliases: [
          "escritura inmobiliaria",
          "transferencia de propiedad",
          "título de propiedad",
        ],
      },
    },
  },
  "property-manager-agreement": {
    id: "property-manager-agreement",
    title: "Property Manager Agreement",
    description:
      "Agreement for property management services and responsibilities",
    category: "Business & Commercial",
    jurisdiction: "us",
    tags: [],
    aliases: [],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Property Manager Agreement",
        description:
          "Agreement for property management services and responsibilities",
        aliases: [],
      },
      es: {
        name: "Contrato de administración de propiedades",
        description:
          "Acuerdo para los servicios y responsabilidades de administración de propiedades.",
        aliases: [],
      },
    },
  },
  "provisional-patent-application": {
    id: "provisional-patent-application",
    title: "Provisional Patent Application",
    description:
      "Prepare a provisional patent application to establish an early filing date for your invention.",
    category: "Intellectual Property",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "provisional patent",
      "patent application",
      "provisional filing",
      "invention filing",
      "patente provisional",
      "solicitud patente",
      "presentación provisional",
      "registro invención",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Provisional Patent Application",
        description:
          "Prepare a provisional patent application to establish an early filing date for your invention.",
        aliases: [
          "provisional patent",
          "patent application",
          "provisional filing",
          "invention filing",
        ],
      },
      es: {
        name: "Solicitud de Patente Provisional",
        description:
          "Prepare una solicitud de patente provisional para establecer una fecha de presentación temprana para su invención.",
        aliases: [
          "patente provisional",
          "solicitud patente",
          "presentación provisional",
          "registro invención",
        ],
      },
    },
  },
  "purchase-agreement": {
    id: "purchase-agreement",
    title: "General Purchase Agreement",
    description:
      "Complete property transactions with confidence and legal protection. Secure the best terms for buying or selling real estate.",
    category: "Sales",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "general purchase contract",
      "purchase contract",
      "buying agreement",
      "contrato general de compra",
      "contrato de compra",
      "acuerdo de compra",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "General Purchase Agreement",
        description:
          "Complete property transactions with confidence and legal protection. Secure the best terms for buying or selling real estate.",
        aliases: [
          "general purchase contract",
          "purchase contract",
          "buying agreement",
        ],
      },
      es: {
        name: "Acuerdo General de Compra",
        description:
          "Compra o vende cualquier propiedad con términos claros. Protege tanto al comprador como al vendedor definiendo precio, condiciones y detalles de cierre.",
        aliases: [
          "contrato general de compra",
          "contrato de compra",
          "acuerdo de compra",
        ],
      },
    },
  },
  "purchase-order": {
    id: "purchase-order",
    title: "Purchase Order",
    description:
      "Streamline your business operations and avoid supply chain disputes with professional purchase orders. Ensure suppliers deliver exactly what you need on time.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "PO",
      "purchase request",
      "procurement order",
      "OC",
      "solicitud de compra",
      "orden de adquisición",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Purchase Order",
        description:
          "Streamline your business operations and avoid supply chain disputes with professional purchase orders. Ensure suppliers deliver exactly what you need on time.",
        aliases: ["PO", "purchase request", "procurement order"],
      },
      es: {
        name: "Orden de Compra",
        description:
          "Documento formal para solicitar bienes o servicios de un proveedor.",
        aliases: ["OC", "solicitud de compra", "orden de adquisición"],
      },
    },
  },
  "quitclaim-deed": {
    id: "quitclaim-deed",
    title: "Quitclaim Deed",
    description:
      "Transfer property ownership quickly for family or divorce situations. Simplify property transfers without title warranties.",
    category: "Real Estate",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "property transfer",
      "quit claim deed",
      "transfer ownership",
      "transferencia de propiedad",
      "escritura de finiquito",
      "transferir titularidad",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Quitclaim Deed",
        description:
          "Transfer property ownership quickly for family or divorce situations. Simplify property transfers without title warranties.",
        aliases: ["property transfer", "quit claim deed", "transfer ownership"],
      },
      es: {
        name: "Escritura de Finiquito",
        description:
          "Transfiere tu parte de una propiedad rápidamente. Común en divorcios o transferencias familiares, pero no garantiza que no hay problemas legales.",
        aliases: [
          "transferencia de propiedad",
          "escritura de finiquito",
          "transferir titularidad",
        ],
      },
    },
  },
  "real-estate-purchase-agreement": {
    id: "real-estate-purchase-agreement",
    title: "Real Estate Purchase Agreement",
    description: "Agreement for the purchase and sale of real property.",
    category: "Real Estate & Property",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "home purchase agreement",
      "property purchase contract",
      "real estate sales contract",
      "contrato de compra de casa",
      "acuerdo de venta de propiedad",
      "contrato de venta de bienes raíces",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Real Estate Purchase Agreement",
        description: "Agreement for the purchase and sale of real property.",
        aliases: [
          "home purchase agreement",
          "property purchase contract",
          "real estate sales contract",
        ],
      },
      es: {
        name: "Acuerdo de Compra de Bienes Raíces",
        description: "Acuerdo para la compra y venta de bienes inmuebles.",
        aliases: [
          "contrato de compra de casa",
          "acuerdo de venta de propiedad",
          "contrato de venta de bienes raíces",
        ],
      },
    },
  },
  receipt: {
    id: "receipt",
    title: "Receipt",
    description:
      "Create a professional receipt for payments, services, or transactions with detailed records.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "payment receipt",
      "invoice receipt",
      "transaction receipt",
      "proof of payment",
      "recibo de pago",
      "recibo de factura",
      "recibo de transacción",
      "comprobante de pago",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Receipt",
        description:
          "Create a professional receipt for payments, services, or transactions with detailed records.",
        aliases: [
          "payment receipt",
          "invoice receipt",
          "transaction receipt",
          "proof of payment",
        ],
      },
      es: {
        name: "Recibo",
        description:
          "Comprobante oficial de pago para clientes. Documento profesional que ayuda con contabilidad y declaraciones de impuestos.",
        aliases: [
          "recibo de pago",
          "recibo de factura",
          "recibo de transacción",
          "comprobante de pago",
        ],
      },
    },
  },
  "recording-artist-agreement": {
    id: "recording-artist-agreement",
    title: "Recording Artist Agreement",
    description:
      "Agreement between recording artists and record labels or producers.",
    category: "Entertainment & Media",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "record deal",
      "music contract",
      "artist recording contract",
      "contrato discográfico",
      "acuerdo musical",
      "contrato de grabación de artistas",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Recording Artist Agreement",
        description:
          "Agreement between recording artists and record labels or producers.",
        aliases: ["record deal", "music contract", "artist recording contract"],
      },
      es: {
        name: "Acuerdo de Artista de Grabación",
        description:
          "Acuerdo entre artistas de grabación y sellos discográficos.",
        aliases: [
          "contrato discográfico",
          "acuerdo musical",
          "contrato de grabación de artistas",
        ],
      },
    },
  },
  "release-for-use-of-likeness": {
    id: "release-for-use-of-likeness",
    title: "Release For Use Of Likeness",
    description: "Professional release for use of likeness document.",
    category: "Legal",
    jurisdiction: "us",
    tags: [],
    aliases: ["release for use of likeness"],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Release For Use Of Likeness",
        description: "Professional release for use of likeness document.",
        aliases: ["release for use of likeness"],
      },
      es: {
        name: "Release For Use Of Likeness en Español",
        description: "Documento profesional de release for use of likeness.",
        aliases: ["release for use of likeness"],
      },
    },
  },
  "release-of-liability": {
    id: "release-of-liability",
    title: "Release of Liability",
    description:
      "General release form to waive liability for activities or services.",
    category: "Risk & Liability",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "liability release",
      "general release",
      "waiver and release",
      "liberación de responsabilidad",
      "liberación general",
      "exención y liberación",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Release of Liability",
        description:
          "General release form to waive liability for activities or services.",
        aliases: ["liability release", "general release", "waiver and release"],
      },
      es: {
        name: "Liberación de Responsabilidad",
        description:
          "Formulario general de liberación para eximir responsabilidad por actividades o servicios.",
        aliases: [
          "liberación de responsabilidad",
          "liberación general",
          "exención y liberación",
        ],
      },
    },
  },
  "remodeling-contract": {
    id: "remodeling-contract",
    title: "Home Remodeling Contract",
    description:
      "Contract for residential remodeling and renovation projects including kitchens, bathrooms, and room additions.",
    category: "Construction",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "renovation contract",
      "home improvement contract",
      "remodel agreement",
      "contrato de renovación",
      "contrato de mejoras para el hogar",
      "acuerdo de remodelación",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Home Remodeling Contract",
        description:
          "Contract for residential remodeling and renovation projects including kitchens, bathrooms, and room additions.",
        aliases: [
          "renovation contract",
          "home improvement contract",
          "remodel agreement",
        ],
      },
      es: {
        name: "Contrato de Remodelación",
        description:
          "Contrato para proyectos de remodelación y renovación residencial incluyendo cocinas, baños y adiciones de habitaciones.",
        aliases: [
          "contrato de renovación",
          "contrato de mejoras para el hogar",
          "acuerdo de remodelación",
        ],
      },
    },
  },
  "rent-increase-letter": {
    id: "rent-increase-letter",
    title: "Rent Increase Letter",
    description: "Formal notice to tenants regarding rent increases",
    category: "Real Estate & Property",
    jurisdiction: "us",
    tags: [],
    aliases: [],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Rent Increase Letter",
        description: "Formal notice to tenants regarding rent increases",
        aliases: [],
      },
      es: {
        name: "Carta de aumento de renta",
        description:
          "Aviso formal a los inquilinos sobre incrementos en la renta.",
        aliases: [],
      },
    },
  },
  "rent-receipt": {
    id: "rent-receipt",
    title: "Rent Receipt",
    description:
      "Generate official rent payment receipts for landlords and tenants",
    category: "Real Estate & Property",
    jurisdiction: "us",
    tags: [],
    aliases: [],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Rent Receipt",
        description:
          "Generate official rent payment receipts for landlords and tenants",
        aliases: [],
      },
      es: {
        name: "Recibo de Renta",
        description:
          "Comprobante oficial de pago de renta para propietarios e inquilinos. Documento importante para registros financieros y declaraciones de impuestos.",
        aliases: [],
      },
    },
  },
  "rental-agreement": {
    id: "rental-agreement",
    title: "Rental Agreement",
    description:
      "Generate steady rental income or secure quality housing with clear terms that protect both parties. Prevent costly tenant disputes and legal issues.",
    category: "Real Estate",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "rental contract",
      "property rental",
      "lease contract",
      "tenancy agreement",
      "contrato de alquiler",
      "contrato de renta",
      "acuerdo de arrendamiento",
      "acuerdo de arrendamiento legal",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Rental Agreement",
        description:
          "Generate steady rental income or secure quality housing with clear terms that protect both parties. Prevent costly tenant disputes and legal issues.",
        aliases: [
          "rental contract",
          "property rental",
          "lease contract",
          "tenancy agreement",
        ],
      },
      es: {
        name: "Acuerdo de Alquiler",
        description:
          "Crea un acuerdo de alquiler legalmente válido con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.",
        aliases: [
          "contrato de alquiler",
          "contrato de renta",
          "acuerdo de arrendamiento",
          "acuerdo de arrendamiento legal",
        ],
      },
    },
  },
  "research-agreement": {
    id: "research-agreement",
    title: "Research Agreement",
    description:
      "Agreement for research collaboration and academic research projects.",
    category: "Academic & Research",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "research collaboration agreement",
      "academic research contract",
      "study agreement",
      "acuerdo de colaboración de investigación",
      "contrato de investigación académica",
      "acuerdo de estudio",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Research Agreement",
        description:
          "Agreement for research collaboration and academic research projects.",
        aliases: [
          "research collaboration agreement",
          "academic research contract",
          "study agreement",
        ],
      },
      es: {
        name: "Acuerdo de Investigación",
        description:
          "Acuerdo para colaboración de investigación y proyectos de investigación académica.",
        aliases: [
          "acuerdo de colaboración de investigación",
          "contrato de investigación académica",
          "acuerdo de estudio",
        ],
      },
    },
  },
  "residential-lease-agreement": {
    id: "residential-lease-agreement",
    title: "Residential Rental Agreement",
    description:
      "Secure quality housing or generate reliable rental income. Establish clear expectations that protect everyone's interests.",
    category: "Real Estate",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "residential lease contract",
      "apartment lease",
      "rental lease",
      "home rental agreement",
      "contrato de arrendamiento residencial",
      "arrendamiento de apartamento",
      "contrato de alquiler",
      "acuerdo de alquiler de viviendas",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Residential Rental Agreement",
        description:
          "Secure quality housing or generate reliable rental income. Establish clear expectations that protect everyone's interests.",
        aliases: [
          "residential lease contract",
          "apartment lease",
          "rental lease",
          "home rental agreement",
        ],
      },
      es: {
        name: "Contrato de Alquiler Residencial",
        description:
          "Alquila una casa o apartamento con términos que protegen tanto al inquilino como al propietario. Cubre renta, depósitos de seguridad y reglas de la casa.",
        aliases: [
          "contrato de arrendamiento residencial",
          "arrendamiento de apartamento",
          "contrato de alquiler",
          "acuerdo de alquiler de viviendas",
        ],
      },
    },
  },
  "residential-rental-application": {
    id: "residential-rental-application",
    title: "Residential Rental Application",
    description:
      "Comprehensive rental application form for prospective tenants",
    category: "Real Estate & Property",
    jurisdiction: "us",
    tags: [],
    aliases: [],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Residential Rental Application",
        description:
          "Comprehensive rental application form for prospective tenants",
        aliases: [],
      },
      es: {
        name: "Solicitud de alquiler residencial",
        description:
          "Formulario integral de solicitud de alquiler para arrendatarios potenciales.",
        aliases: [],
      },
    },
  },
  "residential-rental-inspection-report": {
    id: "residential-rental-inspection-report",
    title: "Residential Rental Inspection Report",
    description:
      "Document property condition for move-in and move-out inspections",
    category: "Real Estate & Property",
    jurisdiction: "us",
    tags: [],
    aliases: [],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Residential Rental Inspection Report",
        description:
          "Document property condition for move-in and move-out inspections",
        aliases: [],
      },
      es: {
        name: "Informe de inspección de alquiler residencial",
        description:
          "Documenta el estado de la propiedad durante las inspecciones de entrada y salida.",
        aliases: [],
      },
    },
  },
  "resignation-letter": {
    id: "resignation-letter",
    title: "Resignation Letter",
    description: "Professional resignation letter template",
    category: "Employment",
    jurisdiction: "us",
    tags: [],
    aliases: [],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Resignation Letter",
        description: "Professional resignation letter template",
        aliases: [],
      },
      es: {
        name: "Carta de Renuncia",
        description:
          "Renuncia a tu trabajo de manera profesional. Mantiene buenas relaciones y protege tu reputación laboral.",
        aliases: [],
      },
    },
  },
  "resignation-letter-personal": {
    id: "resignation-letter-personal",
    title: "Resignation Letter (Personal)",
    description:
      "Professional letter to formally resign from employment for personal reasons.",
    category: "Employment & HR",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "personal resignation letter",
      "job resignation letter",
      "carta de renuncia personal",
      "carta de renuncia laboral",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Resignation Letter (Personal)",
        description:
          "Professional letter to formally resign from employment for personal reasons.",
        aliases: ["personal resignation letter", "job resignation letter"],
      },
      es: {
        name: "Carta de Renuncia (Personal)",
        description:
          "Renuncia por motivos personales (familia, salud, mudanza). Mantiene relaciones profesionales y deja la puerta abierta para el futuro.",
        aliases: ["carta de renuncia personal", "carta de renuncia laboral"],
      },
    },
  },
  "restaurant-agreement": {
    id: "restaurant-agreement",
    title: "Restaurant Agreement",
    description:
      "Agreement for restaurant operations, partnerships, or management.",
    category: "Food & Hospitality",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "restaurant partnership",
      "restaurant management agreement",
      "sociedad de restaurante",
      "acuerdo de gestión",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Restaurant Agreement",
        description:
          "Agreement for restaurant operations, partnerships, or management.",
        aliases: ["restaurant partnership", "restaurant management agreement"],
      },
      es: {
        name: "Acuerdo de Restaurante",
        description:
          "Acuerdo para operaciones, asociaciones o gestión de restaurantes.",
        aliases: ["sociedad de restaurante", "acuerdo de gestión"],
      },
    },
  },
  "restaurant-lease": {
    id: "restaurant-lease",
    title: "Restaurant Lease",
    description:
      "Specialized lease agreement for restaurant and food service businesses",
    category: "Business & Commercial",
    jurisdiction: "us",
    tags: [],
    aliases: [],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Restaurant Lease",
        description:
          "Specialized lease agreement for restaurant and food service businesses",
        aliases: [],
      },
      es: {
        name: "Contrato de arrendamiento para restaurante",
        description:
          "Contrato de arrendamiento especializado para negocios de restaurantes y servicios de alimentos.",
        aliases: [],
      },
    },
  },
  "retail-space-lease": {
    id: "retail-space-lease",
    title: "Retail Space Lease",
    description:
      "Commercial lease agreement for retail locations and storefronts",
    category: "Business & Commercial",
    jurisdiction: "us",
    tags: [],
    aliases: [],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Retail Space Lease",
        description:
          "Commercial lease agreement for retail locations and storefronts",
        aliases: [],
      },
      es: {
        name: "Contrato de arrendamiento de local comercial",
        description:
          "Contrato de arrendamiento comercial para locales y tiendas minoristas.",
        aliases: [],
      },
    },
  },
  "retirement-plan-agreement": {
    id: "retirement-plan-agreement",
    title: "Retirement Plan Agreement",
    description:
      "Agreement for employer-sponsored retirement plan participation.",
    category: "Finance & Lending",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "401k agreement",
      "pension plan agreement",
      "retirement benefit plan",
      "plan de pensiones",
      "acuerdo de beneficios",
      "plan de beneficios de jubilación",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Retirement Plan Agreement",
        description:
          "Agreement for employer-sponsored retirement plan participation.",
        aliases: [
          "401k agreement",
          "pension plan agreement",
          "retirement benefit plan",
        ],
      },
      es: {
        name: "Acuerdo de Plan de Jubilación",
        description:
          "Acuerdo para participación en plan de jubilación patrocinado por empleador.",
        aliases: [
          "plan de pensiones",
          "acuerdo de beneficios",
          "plan de beneficios de jubilación",
        ],
      },
    },
  },
  "revocation-of-power-of-attorney": {
    id: "revocation-of-power-of-attorney",
    title: "Revocation of Power of Attorney",
    description:
      "Officially revoke a previously granted power of attorney and terminate the agent's authority.",
    category: "Legal",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "revoke poa",
      "cancel power of attorney",
      "terminate agent authority",
      "poa revocation",
      "revocar poder",
      "cancelar poder notarial",
      "terminar autoridad agente",
      "revocación de poa",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Revocation of Power of Attorney",
        description:
          "Officially revoke a previously granted power of attorney and terminate the agent's authority.",
        aliases: [
          "revoke poa",
          "cancel power of attorney",
          "terminate agent authority",
          "poa revocation",
        ],
      },
      es: {
        name: "Revocación de Poder Notarial",
        description:
          "Revocar oficialmente un poder notarial previamente otorgado y terminar la autoridad del agente.",
        aliases: [
          "revocar poder",
          "cancelar poder notarial",
          "terminar autoridad agente",
          "revocación de poa",
        ],
      },
    },
  },
  "revolving-credit-agreement": {
    id: "revolving-credit-agreement",
    title: "Revolving Credit Agreement",
    description:
      "Establish a revolving credit line with terms, limits, and payment requirements.",
    category: "Finance",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "credit line agreement",
      "revolving loan",
      "line of credit",
      "credit facility",
      "acuerdo de línea de crédito",
      "préstamo rotativo",
      "línea de crédito",
      "facilidad de crédito",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Revolving Credit Agreement",
        description:
          "Establish a revolving credit line with terms, limits, and payment requirements.",
        aliases: [
          "credit line agreement",
          "revolving loan",
          "line of credit",
          "credit facility",
        ],
      },
      es: {
        name: "Acuerdo de Crédito Rotativo",
        description:
          "Establecer una línea de crédito rotativo con términos, límites y requisitos de pago.",
        aliases: [
          "acuerdo de línea de crédito",
          "préstamo rotativo",
          "línea de crédito",
          "facilidad de crédito",
        ],
      },
    },
  },
  "ride-sharing-agreement": {
    id: "ride-sharing-agreement",
    title: "Ride Sharing Agreement",
    description: "Agreement for ride sharing and carpooling arrangements.",
    category: "Transportation & Automotive",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "carpool agreement",
      "rideshare contract",
      "driver passenger agreement",
      "acuerdo de carpool",
      "contrato de viaje compartido",
      "acuerdo de pasajero del conductor",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Ride Sharing Agreement",
        description: "Agreement for ride sharing and carpooling arrangements.",
        aliases: [
          "carpool agreement",
          "rideshare contract",
          "driver passenger agreement",
        ],
      },
      es: {
        name: "Acuerdo de Viaje Compartido",
        description: "Acuerdo para arreglos de viaje compartido y carpooling.",
        aliases: [
          "acuerdo de carpool",
          "contrato de viaje compartido",
          "acuerdo de pasajero del conductor",
        ],
      },
    },
  },
  "roofing-contract": {
    id: "roofing-contract",
    title: "Roofing Contract",
    description:
      "Professional contract for roofing projects including repairs, replacements, and new installations.",
    category: "Construction",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "roof repair contract",
      "roof replacement agreement",
      "roofing service contract",
      "contrato de reparación de techo",
      "acuerdo de reemplazo de techo",
      "contrato de servicio de techado",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Roofing Contract",
        description:
          "Professional contract for roofing projects including repairs, replacements, and new installations.",
        aliases: [
          "roof repair contract",
          "roof replacement agreement",
          "roofing service contract",
        ],
      },
      es: {
        name: "Contrato de Techado",
        description:
          "Contrato profesional para proyectos de techado incluyendo reparaciones, reemplazos e instalaciones nuevas.",
        aliases: [
          "contrato de reparación de techo",
          "acuerdo de reemplazo de techo",
          "contrato de servicio de techado",
        ],
      },
    },
  },
  "room-rental-agreement": {
    id: "room-rental-agreement",
    title: "Room Rental Agreement",
    description:
      "Generate additional income by renting rooms in your home. Establish clear boundaries for shared living spaces.",
    category: "Real Estate",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "room lease",
      "bedroom rental",
      "shared housing agreement",
      "room sharing contract",
      "arrendamiento de habitación",
      "alquiler de dormitorio",
      "acuerdo de vivienda compartida",
      "contrato de intercambio de habitaciones",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Room Rental Agreement",
        description:
          "Generate additional income by renting rooms in your home. Establish clear boundaries for shared living spaces.",
        aliases: [
          "room lease",
          "bedroom rental",
          "shared housing agreement",
          "room sharing contract",
        ],
      },
      es: {
        name: "Acuerdo de Alquiler de Habitación",
        description:
          "Genera ingresos adicionales alquilando habitaciones en tu hogar. Establece límites claros para espacios de vida compartidos.",
        aliases: [
          "arrendamiento de habitación",
          "alquiler de dormitorio",
          "acuerdo de vivienda compartida",
          "contrato de intercambio de habitaciones",
        ],
      },
    },
  },
  "roommate-agreement": {
    id: "roommate-agreement",
    title: "Roommate Agreement",
    description:
      "Establish clear rules and responsibilities for shared living arrangements.",
    category: "Real Estate",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "roommate contract",
      "shared living agreement",
      "housemate agreement",
      "contrato de compañeros de cuarto",
      "acuerdo de convivencia",
      "acuerdo de compañeros de casa",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Roommate Agreement",
        description:
          "Establish clear rules and responsibilities for shared living arrangements.",
        aliases: [
          "roommate contract",
          "shared living agreement",
          "housemate agreement",
        ],
      },
      es: {
        name: "Acuerdo de Compañeros de Cuarto",
        description:
          "Establece reglas claras y responsabilidades para arreglos de vida compartida.",
        aliases: [
          "contrato de compañeros de cuarto",
          "acuerdo de convivencia",
          "acuerdo de compañeros de casa",
        ],
      },
    },
  },
  "royalty-agreement": {
    id: "royalty-agreement",
    title: "Royalty Agreement",
    description:
      "Agreement for royalty payments and distribution of intellectual property licensing revenue.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "royalty contract",
      "licensing royalty",
      "ip royalty",
      "revenue sharing",
      "contrato regalías",
      "regalías licenciamiento",
      "regalías pi",
      "participación ingresos",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Royalty Agreement",
        description:
          "Agreement for royalty payments and distribution of intellectual property licensing revenue.",
        aliases: [
          "royalty contract",
          "licensing royalty",
          "ip royalty",
          "revenue sharing",
        ],
      },
      es: {
        name: "Acuerdo de Regalías",
        description:
          "Acuerdo para pagos de regalías y distribución de ingresos por licenciamiento de propiedad intelectual.",
        aliases: [
          "contrato regalías",
          "regalías licenciamiento",
          "regalías pi",
          "participación ingresos",
        ],
      },
    },
  },
  "salary-verification-letter": {
    id: "salary-verification-letter",
    title: "Salary Verification Letter",
    description: "Official letter verifying employee salary information",
    category: "HR",
    jurisdiction: "us",
    tags: [],
    aliases: [],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Salary Verification Letter",
        description: "Official letter verifying employee salary information",
        aliases: [],
      },
      es: {
        name: "Salary Verification Letter",
        description: "Official letter verifying employee salary information",
        aliases: [],
      },
    },
  },
  "sale-of-goods": {
    id: "sale-of-goods",
    title: "Sale of Goods Agreement",
    description:
      "Comprehensive agreement for the sale and purchase of physical goods.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "goods purchase agreement",
      "sales contract",
      "product sale agreement",
      "acuerdo de compra de bienes",
      "contrato de ventas",
      "acuerdo de venta de productos",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Sale of Goods Agreement",
        description:
          "Comprehensive agreement for the sale and purchase of physical goods.",
        aliases: [
          "goods purchase agreement",
          "sales contract",
          "product sale agreement",
        ],
      },
      es: {
        name: "Acuerdo de Venta de Bienes",
        description:
          "Acuerdo integral para la venta y compra de bienes físicos.",
        aliases: [
          "acuerdo de compra de bienes",
          "contrato de ventas",
          "acuerdo de venta de productos",
        ],
      },
    },
  },
  "sales-agreement": {
    id: "sales-agreement",
    title: "Sales Agreement",
    description:
      "Create a comprehensive sales agreement for goods or products.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "purchase and sale agreement",
      "sale contract",
      "goods agreement",
      "contrato de venta",
      "acuerdo de compraventa",
      "acuerdo de bienes",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Sales Agreement",
        description:
          "Create a comprehensive sales agreement for goods or products.",
        aliases: [
          "purchase and sale agreement",
          "sale contract",
          "goods agreement",
        ],
      },
      es: {
        name: "Acuerdo de Venta",
        description:
          "Crea un acuerdo de venta integral para bienes o productos.",
        aliases: [
          "contrato de venta",
          "acuerdo de compraventa",
          "acuerdo de bienes",
        ],
      },
    },
  },
  "security-agreement": {
    id: "security-agreement",
    title: "Security Agreement",
    description:
      "Legal agreement creating a security interest in personal property to secure debt obligations.",
    category: "Finance",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "collateral agreement",
      "secured transaction agreement",
      "UCC security agreement",
      "acuerdo de colateral",
      "acuerdo de transacción garantizada",
      "acuerdo de seguridad de ucc",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Security Agreement",
        description:
          "Legal agreement creating a security interest in personal property to secure debt obligations.",
        aliases: [
          "collateral agreement",
          "secured transaction agreement",
          "UCC security agreement",
        ],
      },
      es: {
        name: "Acuerdo de Garantía",
        description:
          "Acuerdo legal que crea un interés de garantía en propiedad personal para asegurar obligaciones de deuda.",
        aliases: [
          "acuerdo de colateral",
          "acuerdo de transacción garantizada",
          "acuerdo de seguridad de ucc",
        ],
      },
    },
  },
  "separation-agreement": {
    id: "separation-agreement",
    title: "Separation Agreement",
    description:
      "General agreement for couples separating and dividing assets.",
    category: "Family & Personal",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "legal separation",
      "separation contract",
      "separación legal",
      "contrato de separación",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Separation Agreement",
        description:
          "General agreement for couples separating and dividing assets.",
        aliases: ["legal separation", "separation contract"],
      },
      es: {
        name: "Acuerdo de Separación",
        description:
          "Acuerdo general para parejas que se separan y dividen bienes.",
        aliases: ["separación legal", "contrato de separación"],
      },
    },
  },
  "service-agreement": {
    id: "service-agreement",
    title: "Service Agreement",
    description:
      "Ensure service quality and prevent misunderstandings with providers. Establish clear expectations for deliverables, timelines, and payments.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "hire services",
      "service provider",
      "payment terms",
      "contratar servicios",
      "proveedor de servicios",
      "términos de pago",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Service Agreement",
        description:
          "Ensure service quality and prevent misunderstandings with providers. Establish clear expectations for deliverables, timelines, and payments.",
        aliases: ["hire services", "service provider", "payment terms"],
      },
      es: {
        name: "Acuerdo de Servicios",
        description:
          "Asegura la calidad del servicio y evita malentendidos con proveedores. Establece expectativas claras sobre entregables, cronogramas y pagos.",
        aliases: [
          "contratar servicios",
          "proveedor de servicios",
          "términos de pago",
        ],
      },
    },
  },
  "service-level-agreement": {
    id: "service-level-agreement",
    title: "Service Level Agreement (SLA)",
    description:
      "Create an SLA defining service performance standards and expectations between parties.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "SLA",
      "service level agreement",
      "performance agreement",
      "acuerdo de nivel de servicio",
      "acuerdo de rendimiento",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Service Level Agreement (SLA)",
        description:
          "Create an SLA defining service performance standards and expectations between parties.",
        aliases: ["SLA", "service level agreement", "performance agreement"],
      },
      es: {
        name: "Acuerdo de Nivel de Servicio (SLA)",
        description:
          "Crea un SLA que defina estándares de rendimiento del servicio y expectativas entre partes.",
        aliases: [
          "SLA",
          "acuerdo de nivel de servicio",
          "acuerdo de rendimiento",
        ],
      },
    },
  },
  "settlement-agreement": {
    id: "settlement-agreement",
    title: "Settlement Agreement",
    description:
      "Resolve disputes quickly and avoid expensive court battles while protecting your interests. Save time and money by settling claims professionally.",
    category: "Dispute Resolution",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "dispute settlement agreement",
      "claim settlement agreement",
      "release and settlement",
      "acuerdo de resolución de disputas",
      "acuerdo de liquidación de reclamos",
      "liberación y liquidación",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Settlement Agreement",
        description:
          "Resolve disputes quickly and avoid expensive court battles while protecting your interests. Save time and money by settling claims professionally.",
        aliases: [
          "dispute settlement agreement",
          "claim settlement agreement",
          "release and settlement",
        ],
      },
      es: {
        name: "Acuerdo de Liquidación",
        description:
          "Acuerdo integral para resolver disputas y liquidar reclamos entre las partes.",
        aliases: [
          "acuerdo de resolución de disputas",
          "acuerdo de liquidación de reclamos",
          "liberación y liquidación",
        ],
      },
    },
  },
  "severance-agreement": {
    id: "severance-agreement",
    title: "Severance Agreement",
    description:
      "Protect your business from wrongful termination lawsuits and ensure smooth employee separations. Provide fair compensation while preventing future legal claims.",
    category: "Employment",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "severance contract",
      "separation agreement",
      "employment separation",
      "severance package",
      "contrato de indemnización",
      "acuerdo de separación",
      "paquete de indemnización",
      "paquete de indemnización legal",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Severance Agreement",
        description:
          "Protect your business from wrongful termination lawsuits and ensure smooth employee separations. Provide fair compensation while preventing future legal claims.",
        aliases: [
          "severance contract",
          "separation agreement",
          "employment separation",
          "severance package",
        ],
      },
      es: {
        name: "Acuerdo de Indemnización",
        description:
          "Crea un acuerdo de indemnización legalmente válido con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.",
        aliases: [
          "contrato de indemnización",
          "acuerdo de separación",
          "paquete de indemnización",
          "paquete de indemnización legal",
        ],
      },
    },
  },
  "shareholder-agreement": {
    id: "shareholder-agreement",
    title: "Shareholder Agreement",
    description:
      "Agreement between company shareholders governing rights, responsibilities, and transfer of shares.",
    category: "Corporate",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "Shareholders agreement",
      "Stock agreement",
      "Equity agreement",
      "Acuerdo accionistas",
      "Acuerdo de acciones",
      "Acuerdo de capital",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Shareholder Agreement",
        description:
          "Agreement between company shareholders governing rights, responsibilities, and transfer of shares.",
        aliases: [
          "Shareholders agreement",
          "Stock agreement",
          "Equity agreement",
        ],
      },
      es: {
        name: "Acuerdo de Accionistas",
        description:
          "Acuerdo entre accionistas de la empresa que rige los derechos, responsabilidades y transferencia de acciones.",
        aliases: [
          "Acuerdo accionistas",
          "Acuerdo de acciones",
          "Acuerdo de capital",
        ],
      },
    },
  },
  "simple-will": {
    id: "simple-will",
    title: "Simple Will",
    description:
      "Create a basic last will and testament for straightforward estate planning with our easy-to-use template.",
    category: "Estate Planning",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "basic will",
      "last will",
      "testament",
      "simple last will",
      "testamento básico",
      "última voluntad",
      "testamento sencillo",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Simple Will",
        description:
          "Create a basic last will and testament for straightforward estate planning with our easy-to-use template.",
        aliases: ["basic will", "last will", "testament", "simple last will"],
      },
      es: {
        name: "Testamento Simple",
        description:
          "Crea un testamento básico para planificación patrimonial sencilla con nuestra plantilla fácil de usar.",
        aliases: [
          "testamento básico",
          "última voluntad",
          "testamento sencillo",
          "simple last will",
        ],
      },
    },
  },
  "single-member-llc-operating-agreement": {
    id: "single-member-llc-operating-agreement",
    title: "Single-Member LLC Operating Agreement",
    description:
      "Operating agreement for single-member limited liability companies to establish ownership structure and operational procedures.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "Single member LLC agreement",
      "Solo LLC operating agreement",
      "Single owner LLC agreement",
      "Acuerdo LLC de un miembro",
      "Acuerdo operativo LLC solo",
      "Acuerdo LLC propietario único",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Single-Member LLC Operating Agreement",
        description:
          "Operating agreement for single-member limited liability companies to establish ownership structure and operational procedures.",
        aliases: [
          "Single member LLC agreement",
          "Solo LLC operating agreement",
          "Single owner LLC agreement",
        ],
      },
      es: {
        name: "Acuerdo Operativo de LLC de Miembro Único",
        description:
          "Acuerdo operativo para sociedades de responsabilidad limitada de un solo miembro para establecer la estructura de propiedad y procedimientos operativos.",
        aliases: [
          "Acuerdo LLC de un miembro",
          "Acuerdo operativo LLC solo",
          "Acuerdo LLC propietario único",
        ],
      },
    },
  },
  "small-estate-affidavit": {
    id: "small-estate-affidavit",
    title: "Small Estate Affidavit",
    description:
      "Affidavit to transfer assets of a small estate without formal probate proceedings.",
    category: "Legal",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "small estate succession",
      "affidavit of small estate",
      "small estate declaration",
      "simplified probate affidavit",
      "small estate transfer",
      "inheritance affidavit",
      "sucesión de patrimonio pequeño",
      "declaración jurada de herencia pequeña",
      "declaración de patrimonio menor",
      "declaración jurada de sucesión simplificada",
      "transferencia de patrimonio pequeño",
      "declaración jurada de herencia",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Small Estate Affidavit",
        description:
          "Affidavit to transfer assets of a small estate without formal probate proceedings.",
        aliases: [
          "small estate succession",
          "affidavit of small estate",
          "small estate declaration",
          "simplified probate affidavit",
          "small estate transfer",
          "inheritance affidavit",
        ],
      },
      es: {
        name: "Declaración Jurada de Patrimonio Pequeño",
        description:
          "Declaración jurada para transferir activos de un patrimonio pequeño sin procedimientos formales de sucesión.",
        aliases: [
          "sucesión de patrimonio pequeño",
          "declaración jurada de herencia pequeña",
          "declaración de patrimonio menor",
          "declaración jurada de sucesión simplificada",
          "transferencia de patrimonio pequeño",
          "declaración jurada de herencia",
        ],
      },
    },
  },
  "social-media-management-agreement": {
    id: "social-media-management-agreement",
    title: "Social Media Management Agreement",
    description:
      "Professional agreement for social media marketing and management services between agency and client.",
    category: "Marketing & Advertising",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "social media contract",
      "digital marketing agreement",
      "social media services contract",
      "contrato de redes sociales",
      "acuerdo de marketing digital",
      "contrato de servicios de redes sociales",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Social Media Management Agreement",
        description:
          "Professional agreement for social media marketing and management services between agency and client.",
        aliases: [
          "social media contract",
          "digital marketing agreement",
          "social media services contract",
        ],
      },
      es: {
        name: "Acuerdo de Gestión de Redes Sociales",
        description:
          "Acuerdo profesional para servicios de marketing y gestión de redes sociales entre agencia y cliente.",
        aliases: [
          "contrato de redes sociales",
          "acuerdo de marketing digital",
          "contrato de servicios de redes sociales",
        ],
      },
    },
  },
  "software-license-agreement": {
    id: "software-license-agreement",
    title: "Software License Agreement",
    description:
      "Generate revenue from your software while protecting intellectual property. Control usage and prevent unauthorized distribution.",
    category: "Technology & IT",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "software licensing agreement",
      "end user license agreement",
      "EULA",
      "acuerdo de licenciamiento de software",
      "eula legal",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Software License Agreement",
        description:
          "Generate revenue from your software while protecting intellectual property. Control usage and prevent unauthorized distribution.",
        aliases: [
          "software licensing agreement",
          "end user license agreement",
          "EULA",
        ],
      },
      es: {
        name: "Acuerdo de Licencia de Software",
        description:
          "Licencia tu software a usuarios mientras proteges tus derechos de propiedad intelectual. Establece términos de uso y restricciones.",
        aliases: [
          "acuerdo de licenciamiento de software",
          "EULA",
          "eula legal",
        ],
      },
    },
  },
  "solar-energy-agreement": {
    id: "solar-energy-agreement",
    title: "Solar Energy Agreement",
    description: "Agreement for solar panel installation and energy services.",
    category: "Environmental & Energy",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "solar installation contract",
      "solar power agreement",
      "photovoltaic contract",
      "contrato de instalación solar",
      "acuerdo fotovoltaico",
      "contrato fotovoltaico",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Solar Energy Agreement",
        description:
          "Agreement for solar panel installation and energy services.",
        aliases: [
          "solar installation contract",
          "solar power agreement",
          "photovoltaic contract",
        ],
      },
      es: {
        name: "Acuerdo de Energía Solar",
        description:
          "Acuerdo para instalación de paneles solares y servicios energéticos.",
        aliases: [
          "contrato de instalación solar",
          "acuerdo fotovoltaico",
          "contrato fotovoltaico",
        ],
      },
    },
  },
  "sponsorship-agreement": {
    id: "sponsorship-agreement",
    title: "Sponsorship Agreement",
    description: "Agreement for event, sports, or business sponsorships.",
    category: "Marketing & Advertising",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "sponsor contract",
      "sponsorship deal",
      "contrato de patrocinio",
      "acuerdo de patrocinio",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Sponsorship Agreement",
        description: "Agreement for event, sports, or business sponsorships.",
        aliases: ["sponsor contract", "sponsorship deal"],
      },
      es: {
        name: "Acuerdo de Patrocinio",
        description:
          "Acuerdo para patrocinios de eventos, deportes o negocios.",
        aliases: ["contrato de patrocinio", "acuerdo de patrocinio"],
      },
    },
  },
  "sports-agreement": {
    id: "sports-agreement",
    title: "Sports Agreement",
    description:
      "Agreement for sports activities, coaching, and athletic services.",
    category: "Sports & Recreation",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "athletic agreement",
      "coaching contract",
      "sports contract",
      "acuerdo atlético",
      "contrato de entrenamiento",
      "contrato deportivo",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Sports Agreement",
        description:
          "Agreement for sports activities, coaching, and athletic services.",
        aliases: ["athletic agreement", "coaching contract", "sports contract"],
      },
      es: {
        name: "Acuerdo Deportivo",
        description:
          "Acuerdo para actividades deportivas, entrenamiento y servicios atléticos.",
        aliases: [
          "acuerdo atlético",
          "contrato de entrenamiento",
          "contrato deportivo",
        ],
      },
    },
  },
  "startup-equity-agreement": {
    id: "startup-equity-agreement",
    title: "Startup Equity Agreement",
    description:
      "Agreement for equity distribution and vesting in startup companies.",
    category: "Business & Commercial",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "equity split agreement",
      "founder agreement",
      "equity vesting agreement",
      "acuerdo de fundadores",
      "contrato de participación",
      "acuerdo de adjudicación de capital",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Startup Equity Agreement",
        description:
          "Agreement for equity distribution and vesting in startup companies.",
        aliases: [
          "equity split agreement",
          "founder agreement",
          "equity vesting agreement",
        ],
      },
      es: {
        name: "Acuerdo de Participación en Startup",
        description:
          "Acuerdo para distribución de participaciones en empresas emergentes.",
        aliases: [
          "acuerdo de fundadores",
          "contrato de participación",
          "acuerdo de adjudicación de capital",
        ],
      },
    },
  },
  "statement-of-account": {
    id: "statement-of-account",
    title: "Statement of Account",
    description:
      "Generate detailed account statements showing transactions, balances, and payment information.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "account statement",
      "billing statement",
      "financial statement",
      "account summary",
      "estado de cuenta",
      "estado de facturación",
      "estado financiero",
      "resumen de cuenta",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Statement of Account",
        description:
          "Generate detailed account statements showing transactions, balances, and payment information.",
        aliases: [
          "account statement",
          "billing statement",
          "financial statement",
          "account summary",
        ],
      },
      es: {
        name: "Estado de Cuenta",
        description:
          "Generar estados de cuenta detallados mostrando transacciones, saldos e información de pagos.",
        aliases: [
          "estado de cuenta",
          "estado de facturación",
          "estado financiero",
          "resumen de cuenta",
        ],
      },
    },
  },
  "statement-of-work": {
    id: "statement-of-work",
    title: "Statement of Work (SOW)",
    description:
      "Create a detailed SOW defining project scope, deliverables, and timeline.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "SOW",
      "statement of work",
      "project scope",
      "work order",
      "declaración de trabajo",
      "alcance del proyecto",
      "orden de trabajo",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Statement of Work (SOW)",
        description:
          "Create a detailed SOW defining project scope, deliverables, and timeline.",
        aliases: ["SOW", "statement of work", "project scope", "work order"],
      },
      es: {
        name: "Declaración de Trabajo (SOW)",
        description:
          "Crea un SOW detallado que defina el alcance del proyecto, entregables y cronograma.",
        aliases: [
          "SOW",
          "declaración de trabajo",
          "alcance del proyecto",
          "orden de trabajo",
        ],
      },
    },
  },
  "stock-purchase-agreement": {
    id: "stock-purchase-agreement",
    title: "Stock Purchase Agreement",
    description:
      "Agreement for the purchase and sale of company stock between parties.",
    category: "Corporate",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "Share purchase agreement",
      "Equity purchase agreement",
      "Stock sale agreement",
      "Acuerdo compra acciones",
      "Acuerdo venta acciones",
      "Compraventa acciones",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Stock Purchase Agreement",
        description:
          "Agreement for the purchase and sale of company stock between parties.",
        aliases: [
          "Share purchase agreement",
          "Equity purchase agreement",
          "Stock sale agreement",
        ],
      },
      es: {
        name: "Acuerdo de Compra de Acciones",
        description:
          "Acuerdo para la compra y venta de acciones de la empresa entre las partes.",
        aliases: [
          "Acuerdo compra acciones",
          "Acuerdo venta acciones",
          "Compraventa acciones",
        ],
      },
    },
  },
  "storage-space-lease-agreement": {
    id: "storage-space-lease-agreement",
    title: "Storage Space Lease Agreement",
    description:
      "Lease agreement for storage units and self-storage facilities",
    category: "Real Estate & Property",
    jurisdiction: "us",
    tags: [],
    aliases: [],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Storage Space Lease Agreement",
        description:
          "Lease agreement for storage units and self-storage facilities",
        aliases: [],
      },
      es: {
        name: "Contrato de arrendamiento de espacio de almacenamiento",
        description:
          "Contrato de arrendamiento para unidades de almacenamiento y bodegas de auto-servicio.",
        aliases: [],
      },
    },
  },
  "student-loan-agreement": {
    id: "student-loan-agreement",
    title: "Student Loan Agreement",
    description:
      "Agreement for educational loan financing and repayment terms.",
    category: "Finance & Lending",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "education loan agreement",
      "private student loan",
      "educational financing agreement",
      "préstamo educativo",
      "financiamiento estudiantil",
      "acuerdo de financiamiento educativo",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Student Loan Agreement",
        description:
          "Agreement for educational loan financing and repayment terms.",
        aliases: [
          "education loan agreement",
          "private student loan",
          "educational financing agreement",
        ],
      },
      es: {
        name: "Acuerdo de Préstamo Estudiantil",
        description:
          "Acuerdo para financiamiento educativo y términos de reembolso.",
        aliases: [
          "préstamo educativo",
          "financiamiento estudiantil",
          "acuerdo de financiamiento educativo",
        ],
      },
    },
  },
  "subcontractor-agreement": {
    id: "subcontractor-agreement",
    title: "Subcontractor Agreement",
    description:
      "Complete construction projects efficiently with specialized expertise. Control costs by defining specific work scope.",
    category: "Construction",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "subcontract agreement",
      "trade contractor agreement",
      "specialty contractor agreement",
      "acuerdo de subcontrato",
      "contrato de contratista especializado",
      "acuerdo de contratista de especialidad",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Subcontractor Agreement",
        description:
          "Complete construction projects efficiently with specialized expertise. Control costs by defining specific work scope.",
        aliases: [
          "subcontract agreement",
          "trade contractor agreement",
          "specialty contractor agreement",
        ],
      },
      es: {
        name: "Acuerdo de Subcontratista",
        description:
          "Contrata especialistas (electricistas, plomeros, etc.) para partes de un proyecto de construcción. Define trabajo, cronograma y pagos.",
        aliases: [
          "acuerdo de subcontrato",
          "contrato de contratista especializado",
          "acuerdo de contratista de especialidad",
        ],
      },
    },
  },
  "sublease-agreement": {
    id: "sublease-agreement",
    title: "Sublease Agreement",
    description:
      "Reduce housing costs or generate income through subleasing arrangements. Navigate complex rental situations legally.",
    category: "Real Estate",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "sublet agreement",
      "subletting contract",
      "sublet lease",
      "sublease contract",
      "contrato de subarriendo",
      "subarriendo",
      "subarrendamiento",
      "contrato de subarrendamiento",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Sublease Agreement",
        description:
          "Reduce housing costs or generate income through subleasing arrangements. Navigate complex rental situations legally.",
        aliases: [
          "sublet agreement",
          "subletting contract",
          "sublet lease",
          "sublease contract",
        ],
      },
      es: {
        name: "Acuerdo de Subarriendo",
        description:
          "Renta tu apartamento a otra persona mientras sigues siendo responsable del contrato original. Útil cuando te mudas temporalmente.",
        aliases: [
          "contrato de subarriendo",
          "subarriendo",
          "subarrendamiento",
          "contrato de subarrendamiento",
        ],
      },
    },
  },
  "talent-agreement": {
    id: "talent-agreement",
    title: "Talent Agreement",
    description:
      "Agreement for talent representation and entertainment industry services.",
    category: "Entertainment & Media",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "artist agreement",
      "performer contract",
      "entertainment agreement",
      "acuerdo de artista",
      "contrato de intérprete",
      "acuerdo de entretenimiento",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Talent Agreement",
        description:
          "Agreement for talent representation and entertainment industry services.",
        aliases: [
          "artist agreement",
          "performer contract",
          "entertainment agreement",
        ],
      },
      es: {
        name: "Acuerdo de Talento",
        description:
          "Acuerdo para representación de talento y servicios de la industria del entretenimiento.",
        aliases: [
          "acuerdo de artista",
          "contrato de intérprete",
          "acuerdo de entretenimiento",
        ],
      },
    },
  },
  "talent-management-agreement": {
    id: "talent-management-agreement",
    title: "Talent Management Agreement",
    description:
      "Agreement between talent and management for career representation.",
    category: "Entertainment & Media",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "artist management contract",
      "celebrity management agreement",
      "performer management deal",
      "contrato de management",
      "acuerdo de representación",
      "acuerdo de gestión de intérpretes",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Talent Management Agreement",
        description:
          "Agreement between talent and management for career representation.",
        aliases: [
          "artist management contract",
          "celebrity management agreement",
          "performer management deal",
        ],
      },
      es: {
        name: "Acuerdo de Representación de Talento",
        description:
          "Acuerdo entre talento y representación para gestión de carrera.",
        aliases: [
          "contrato de management",
          "acuerdo de representación",
          "acuerdo de gestión de intérpretes",
        ],
      },
    },
  },
  "tax-preparation-agreement": {
    id: "tax-preparation-agreement",
    title: "Tax Preparation Agreement",
    description:
      "Professional agreement for tax preparation and filing services between preparer and client.",
    category: "Professional Services",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "tax service agreement",
      "tax preparer contract",
      "tax filing agreement",
      "acuerdo de servicios fiscales",
      "contrato de preparador de impuestos",
      "acuerdo de presentación de impuestos",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Tax Preparation Agreement",
        description:
          "Professional agreement for tax preparation and filing services between preparer and client.",
        aliases: [
          "tax service agreement",
          "tax preparer contract",
          "tax filing agreement",
        ],
      },
      es: {
        name: "Acuerdo de Preparación de Impuestos",
        description:
          "Acuerdo profesional para servicios de preparación y presentación de impuestos entre preparador y cliente.",
        aliases: [
          "acuerdo de servicios fiscales",
          "contrato de preparador de impuestos",
          "acuerdo de presentación de impuestos",
        ],
      },
    },
  },
  "telecommuting-agreement": {
    id: "telecommuting-agreement",
    title: "Telecommuting Agreement",
    description:
      "Establish terms and conditions for remote work arrangements between employer and employee.",
    category: "Employment",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "remote work agreement",
      "telework policy",
      "work from home contract",
      "acuerdo de trabajo remoto",
      "política de teletrabajo",
      "contrato de trabajo desde casa",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Telecommuting Agreement",
        description:
          "Establish terms and conditions for remote work arrangements between employer and employee.",
        aliases: [
          "remote work agreement",
          "telework policy",
          "work from home contract",
        ],
      },
      es: {
        name: "Acuerdo de Teletrabajo",
        description:
          "Establecer términos y condiciones para acuerdos de trabajo remoto entre empleador y empleado.",
        aliases: [
          "acuerdo de trabajo remoto",
          "política de teletrabajo",
          "contrato de trabajo desde casa",
        ],
      },
    },
  },
  "telemedicine-agreement": {
    id: "telemedicine-agreement",
    title: "Telemedicine Agreement",
    description: "Agreement for telehealth and remote medical services.",
    category: "Healthcare & Medical",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "telehealth agreement",
      "virtual care agreement",
      "remote medical consultation",
      "acuerdo de telesalud",
      "consulta médica virtual",
      "consulta médica remota",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Telemedicine Agreement",
        description: "Agreement for telehealth and remote medical services.",
        aliases: [
          "telehealth agreement",
          "virtual care agreement",
          "remote medical consultation",
        ],
      },
      es: {
        name: "Acuerdo de Telemedicina",
        description: "Acuerdo para servicios de telesalud y medicina remota.",
        aliases: [
          "acuerdo de telesalud",
          "consulta médica virtual",
          "consulta médica remota",
        ],
      },
    },
  },
  "tenant-maintenance-request": {
    id: "tenant-maintenance-request",
    title: "Tenant Maintenance Request",
    description:
      "Submit a formal maintenance or repair request to your landlord with our comprehensive form template.",
    category: "Property Management",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "repair request",
      "maintenance form",
      "tenant repair request",
      "property maintenance request",
      "solicitud de reparación",
      "formulario de mantenimiento",
      "solicitud de reparación del inquilino",
      "solicitud de mantenimiento de la propiedad",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Tenant Maintenance Request",
        description:
          "Submit a formal maintenance or repair request to your landlord with our comprehensive form template.",
        aliases: [
          "repair request",
          "maintenance form",
          "tenant repair request",
          "property maintenance request",
        ],
      },
      es: {
        name: "Solicitud de Mantenimiento del Inquilino",
        description:
          "Presenta una solicitud formal de mantenimiento o reparación a tu arrendador con nuestra plantilla de formulario completa.",
        aliases: [
          "solicitud de reparación",
          "formulario de mantenimiento",
          "solicitud de reparación del inquilino",
          "solicitud de mantenimiento de la propiedad",
        ],
      },
    },
  },
  "term-sheet": {
    id: "term-sheet",
    title: "Investment Term Sheet",
    description:
      "Non-binding agreement outlining key terms and conditions for investment funding rounds.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "Term sheet",
      "Investment term sheet",
      "Funding term sheet",
      "Hoja de términos",
      "Términos de inversión",
      "Términos de financiación",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Investment Term Sheet",
        description:
          "Non-binding agreement outlining key terms and conditions for investment funding rounds.",
        aliases: ["Term sheet", "Investment term sheet", "Funding term sheet"],
      },
      es: {
        name: "Hoja de Términos de Inversión",
        description:
          "Acuerdo no vinculante que describe los términos y condiciones clave para rondas de financiación de inversión.",
        aliases: [
          "Hoja de términos",
          "Términos de inversión",
          "Términos de financiación",
        ],
      },
    },
  },
  "termination-letter": {
    id: "termination-letter",
    title: "Employee Termination Letter",
    description:
      "Create a professional employment termination letter with our easy-to-use template. State-specific requirements included.",
    category: "Employment",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "termination notice",
      "employment termination",
      "firing letter",
      "dismissal letter",
      "aviso de terminación",
      "carta de despido",
      "terminación laboral",
      "carta de despido legal",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Employee Termination Letter",
        description:
          "Create a professional employment termination letter with our easy-to-use template. State-specific requirements included.",
        aliases: [
          "termination notice",
          "employment termination",
          "firing letter",
          "dismissal letter",
        ],
      },
      es: {
        name: "Carta de Despido de Empleado",
        description:
          "Crea una carta de terminación de empleo profesional con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.",
        aliases: [
          "aviso de terminación",
          "carta de despido",
          "terminación laboral",
          "carta de despido legal",
        ],
      },
    },
  },
  "timber-sale-agreement": {
    id: "timber-sale-agreement",
    title: "Timber Sale Agreement",
    description:
      "Agreement for the sale and harvesting of timber from forestland.",
    category: "Real Estate & Property",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "logging agreement",
      "forest harvesting contract",
      "tree cutting agreement",
      "acuerdo de tala",
      "contrato de cosecha forestal",
      "acuerdo de corte de árboles",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Timber Sale Agreement",
        description:
          "Agreement for the sale and harvesting of timber from forestland.",
        aliases: [
          "logging agreement",
          "forest harvesting contract",
          "tree cutting agreement",
        ],
      },
      es: {
        name: "Acuerdo de Venta de Madera",
        description:
          "Acuerdo para la venta y cosecha de madera de tierras forestales.",
        aliases: [
          "acuerdo de tala",
          "contrato de cosecha forestal",
          "acuerdo de corte de árboles",
        ],
      },
    },
  },
  "trademark-application-worksheet": {
    id: "trademark-application-worksheet",
    title: "Trademark Application Worksheet",
    description:
      "Comprehensive preparation document for USPTO trademark application filing.",
    category: "Intellectual Property",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "trademark prep",
      "trademark application prep",
      "uspto worksheet",
      "trademark filing prep",
      "prep de marca",
      "preparación solicitud marca",
      "hoja trabajo uspto",
      "prep presentación marca",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Trademark Application Worksheet",
        description:
          "Comprehensive preparation document for USPTO trademark application filing.",
        aliases: [
          "trademark prep",
          "trademark application prep",
          "uspto worksheet",
          "trademark filing prep",
        ],
      },
      es: {
        name: "Hoja de Trabajo para Solicitud de Marca Registrada",
        description:
          "Documento integral de preparación para la presentación de solicitud de marca registrada USPTO.",
        aliases: [
          "prep de marca",
          "preparación solicitud marca",
          "hoja trabajo uspto",
          "prep presentación marca",
        ],
      },
    },
  },
  "trademark-assignment": {
    id: "trademark-assignment",
    title: "Trademark Assignment Agreement",
    description:
      "Create a legally binding Trademark Assignment Agreement with our easy-to-use template. State-specific requirements included.",
    category: "Intellectual Property",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "trademark assignment contract",
      "trademark transfer",
      "brand assignment",
      "contrato de asignación de marca",
      "transferencia de marca registrada",
      "asignación de marca",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Trademark Assignment Agreement",
        description:
          "Create a legally binding Trademark Assignment Agreement with our easy-to-use template. State-specific requirements included.",
        aliases: [
          "trademark assignment contract",
          "trademark transfer",
          "brand assignment",
        ],
      },
      es: {
        name: "Acuerdo de Asignación de Marca Registrada",
        description:
          "Crea un Acuerdo de Asignación de Marca Registrada legalmente válido con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.",
        aliases: [
          "contrato de asignación de marca",
          "transferencia de marca registrada",
          "asignación de marca",
        ],
      },
    },
  },
  "trademark-license-agreement": {
    id: "trademark-license-agreement",
    title: "Trademark License Agreement",
    description:
      "Agreement granting rights to use trademark and brand names with quality control provisions.",
    category: "Intellectual Property",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "brand licensing agreement",
      "trademark usage agreement",
      "licensing contract",
      "acuerdo de licencia de marca",
      "contrato de licencia",
      "contrato de licencia legal",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Trademark License Agreement",
        description:
          "Agreement granting rights to use trademark and brand names with quality control provisions.",
        aliases: [
          "brand licensing agreement",
          "trademark usage agreement",
          "licensing contract",
        ],
      },
      es: {
        name: "Acuerdo de Licencia de Marca Registrada",
        description:
          "Acuerdo que otorga derechos para usar marcas registradas y nombres comerciales con control de calidad.",
        aliases: [
          "acuerdo de licencia de marca",
          "contrato de licencia",
          "contrato de licencia legal",
        ],
      },
    },
  },
  "transportation-service-agreement": {
    id: "transportation-service-agreement",
    title: "Transportation Service Agreement",
    description:
      "Agreement for transportation and delivery services between provider and client.",
    category: "Transportation & Automotive",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "delivery service agreement",
      "transport contract",
      "logistics service agreement",
      "acuerdo de servicio de entrega",
      "contrato de transporte",
      "acuerdo de servicio logístico",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Transportation Service Agreement",
        description:
          "Agreement for transportation and delivery services between provider and client.",
        aliases: [
          "delivery service agreement",
          "transport contract",
          "logistics service agreement",
        ],
      },
      es: {
        name: "Acuerdo de Servicio de Transporte",
        description:
          "Acuerdo para servicios de transporte y entrega entre proveedor y cliente.",
        aliases: [
          "acuerdo de servicio de entrega",
          "contrato de transporte",
          "acuerdo de servicio logístico",
        ],
      },
    },
  },
  "travel-insurance-agreement": {
    id: "travel-insurance-agreement",
    title: "Travel Insurance Agreement",
    description: "Agreement for travel insurance coverage and terms.",
    category: "Travel & Transportation",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "travel insurance policy",
      "trip insurance",
      "póliza de seguro de viaje",
      "seguro de viaje",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Travel Insurance Agreement",
        description: "Agreement for travel insurance coverage and terms.",
        aliases: ["travel insurance policy", "trip insurance"],
      },
      es: {
        name: "Acuerdo de Seguro de Viaje",
        description: "Acuerdo para cobertura y términos de seguro de viaje.",
        aliases: ["póliza de seguro de viaje", "seguro de viaje"],
      },
    },
  },
  "triple-net-lease": {
    id: "triple-net-lease",
    title: "Triple Net Lease",
    description: "Commercial lease where tenant pays all property expenses",
    category: "Business & Commercial",
    jurisdiction: "us",
    tags: [],
    aliases: [],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Triple Net Lease",
        description: "Commercial lease where tenant pays all property expenses",
        aliases: [],
      },
      es: {
        name: "Contrato de arrendamiento triple neto",
        description:
          "Contrato de arrendamiento comercial en el que el inquilino paga todos los gastos de la propiedad.",
        aliases: [],
      },
    },
  },
  "tuition-agreement": {
    id: "tuition-agreement",
    title: "Tuition Agreement",
    description: "Agreement for educational tuition and payment terms.",
    category: "Academic & Research",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "tuition contract",
      "education payment agreement",
      "contrato de matrícula",
      "acuerdo de pago educativo",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Tuition Agreement",
        description: "Agreement for educational tuition and payment terms.",
        aliases: ["tuition contract", "education payment agreement"],
      },
      es: {
        name: "Acuerdo de Matrícula",
        description: "Acuerdo para matrícula educativa y términos de pago.",
        aliases: ["contrato de matrícula", "acuerdo de pago educativo"],
      },
    },
  },
  "tutoring-agreement": {
    id: "tutoring-agreement",
    title: "Tutoring Agreement",
    description: "Agreement for private tutoring and educational services.",
    category: "Academic & Research",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "private tutoring",
      "academic tutoring",
      "tutor contract",
      "tutoría privada",
      "tutoría académica",
      "contrato de tutor",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Tutoring Agreement",
        description: "Agreement for private tutoring and educational services.",
        aliases: ["private tutoring", "academic tutoring", "tutor contract"],
      },
      es: {
        name: "Acuerdo de Tutoría",
        description: "Acuerdo para tutoría privada y servicios educativos.",
        aliases: ["tutoría privada", "tutoría académica", "contrato de tutor"],
      },
    },
  },
  "two-weeks-notice-letter": {
    id: "two-weeks-notice-letter",
    title: "Two Weeks Notice Letter",
    description: "Standard two weeks notice resignation letter",
    category: "Employment",
    jurisdiction: "us",
    tags: [],
    aliases: [],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Two Weeks Notice Letter",
        description: "Standard two weeks notice resignation letter",
        aliases: [],
      },
      es: {
        name: "Two Weeks Notice Letter",
        description: "Standard two weeks notice resignation letter",
        aliases: [],
      },
    },
  },
  "vacation-rental-agreement": {
    id: "vacation-rental-agreement",
    title: "Vacation Rental Agreement",
    description: "Agreement for short-term vacation property rentals.",
    category: "Travel & Transportation",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "short-term rental",
      "vacation home rental",
      "holiday rental",
      "alquiler de vacaciones",
      "alquiler de casa vacacional",
      "alquiler de vacaciones legal",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Vacation Rental Agreement",
        description: "Agreement for short-term vacation property rentals.",
        aliases: [
          "short-term rental",
          "vacation home rental",
          "holiday rental",
        ],
      },
      es: {
        name: "Acuerdo de Alquiler Vacacional",
        description:
          "Acuerdo para alquileres de propiedades vacacionales a corto plazo.",
        aliases: [
          "alquiler de vacaciones",
          "alquiler de casa vacacional",
          "alquiler de vacaciones legal",
        ],
      },
    },
  },
  "vehicle-bill-of-sale": {
    id: "vehicle-bill-of-sale",
    title: "Vehicle Bill of Sale",
    description:
      "Document the sale and transfer of ownership for a vehicle, compliant with state requirements.",
    category: "Finance",
    jurisdiction: "us",
    tags: [
      "car",
      "cars",
      "vehicle",
      "vehicles",
      "auto",
      "autos",
      "automobile",
      "automobiles",
      "motor vehicle",
      "sedan",
      "coupe",
      "suv",
      "truck",
      "pickup",
      "van",
      "minivan",
      "hatchback",
      "convertible",
      "crossover",
      "buy",
      "buying",
      "purchase",
      "purchasing",
      "sell",
      "selling",
      "sale",
      "transfer",
      "ownership",
      "title",
      "used",
      "new",
      "pre-owned",
      "certified",
      "rebuilt",
      "salvage",
      "lemon",
      "buying a car",
      "selling a car",
      "buying a used car",
      "selling my car",
      "car sale",
      "auto sale",
      "vehicle purchase",
      "vehicle transfer",
      "car ownership",
      "auto ownership",
      "title transfer",
      "bill of sale",
      "sales contract",
      "purchase agreement",
      "transfer document",
      "proof of sale",
      "as-is sale",
      "warranty",
      "lien",
      "lienholder",
      "financing",
      "trade-in",
      "dmv",
      "registration",
      "pink slip",
      "certificate of title",
      "odometer",
      "mileage",
      "vin",
      "private party",
      "dealer",
      "trade",
      "gift",
      "inheritance",
      "family transfer",
      "carro",
      "carros",
      "coche",
      "coches",
      "vehículo",
      "vehículos",
      "automóvil",
      "automóviles",
      "sedán",
      "cupé",
      "camioneta",
      "furgoneta",
      "comprar",
      "comprando",
      "compra",
      "vender",
      "vendiendo",
      "venta",
      "transferir",
      "propiedad",
      "título",
      "usado",
      "nueva",
      "nuevo",
      "seminuevo",
      "certificado",
      "reconstruido",
      "siniestrado",
      "comprando un carro",
      "vendiendo un carro",
      "comprando un auto usado",
      "vendiendo mi carro",
      "venta de carro",
      "venta de auto",
      "compra de vehículo",
      "transferencia de vehículo",
      "propiedad de carro",
      "transferencia de título",
      "contrato de compraventa",
      "contrato de venta",
      "acuerdo de compra",
      "documento de transferencia",
      "prueba de venta",
      "venta como está",
      "garantía",
      "gravamen",
      "financiamiento",
      "intercambio",
      "registro",
      "certificado de título",
      "odómetro",
      "millaje",
      "número de serie",
      "particular",
      "concesionario",
      "comercio",
      "regalo",
      "herencia",
      "transferencia familiar",
    ],
    aliases: [
      "sell car",
      "used item sale",
      "vehicle transfer",
      "car sale contract",
      "venta de coche",
      "venta de artículo usado",
      "transferencia de vehículo",
      "contrato de venta de auto",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Vehicle Bill of Sale",
        description:
          "Document the sale and transfer of ownership for a vehicle, compliant with state requirements.",
        aliases: [
          "sell car",
          "used item sale",
          "vehicle transfer",
          "car sale contract",
        ],
      },
      es: {
        name: "Contrato de Compraventa de Vehículo",
        description:
          "Documentar la venta y transferencia de propiedad de un vehículo, conforme a los requisitos estatales.",
        aliases: [
          "venta de coche",
          "venta de artículo usado",
          "transferencia de vehículo",
          "contrato de venta de auto",
        ],
      },
    },
  },
  "vehicle-lease-agreement": {
    id: "vehicle-lease-agreement",
    title: "Vehicle Lease Agreement",
    description: "Agreement for leasing vehicles between lessor and lessee.",
    category: "Transportation & Automotive",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "car lease agreement",
      "auto lease contract",
      "vehicle rental agreement",
      "contrato de arrendamiento de auto",
      "acuerdo de alquiler de vehículo",
      "acuerdo de alquiler de vehículos",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Vehicle Lease Agreement",
        description:
          "Agreement for leasing vehicles between lessor and lessee.",
        aliases: [
          "car lease agreement",
          "auto lease contract",
          "vehicle rental agreement",
        ],
      },
      es: {
        name: "Acuerdo de Arrendamiento de Vehículo",
        description:
          "Acuerdo para arrendamiento de vehículos entre arrendador y arrendatario.",
        aliases: [
          "contrato de arrendamiento de auto",
          "acuerdo de alquiler de vehículo",
          "acuerdo de alquiler de vehículos",
        ],
      },
    },
  },
  "vendor-agreement": {
    id: "vendor-agreement",
    title: "Vendor Agreement",
    description:
      "Agreement between a company and vendor for the supply of goods or services.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "Supplier agreement",
      "Vendor contract",
      "Supply agreement",
      "Acuerdo proveedor",
      "Contrato proveedor",
      "Acuerdo suministro",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Vendor Agreement",
        description:
          "Agreement between a company and vendor for the supply of goods or services.",
        aliases: ["Supplier agreement", "Vendor contract", "Supply agreement"],
      },
      es: {
        name: "Acuerdo de Proveedor",
        description:
          "Acuerdo entre una empresa y proveedor para el suministro de bienes o servicios.",
        aliases: [
          "Acuerdo proveedor",
          "Contrato proveedor",
          "Acuerdo suministro",
        ],
      },
    },
  },
  "video-release": {
    id: "video-release",
    title: "Video Release",
    description: "Professional video release document.",
    category: "Legal",
    jurisdiction: "us",
    tags: [],
    aliases: ["video release"],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Video Release",
        description: "Professional video release document.",
        aliases: ["video release"],
      },
      es: {
        name: "Video Release en Español",
        description: "Documento profesional de video release.",
        aliases: ["video release"],
      },
    },
  },
  "volunteer-agreement": {
    id: "volunteer-agreement",
    title: "Volunteer Agreement",
    description:
      "Agreement between organization and volunteer for volunteer services and activities.",
    category: "Employment & HR",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "volunteer contract",
      "volunteer service agreement",
      "community service agreement",
      "contrato de voluntario",
      "acuerdo de servicio voluntario",
      "acuerdo de servicio comunitario",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Volunteer Agreement",
        description:
          "Agreement between organization and volunteer for volunteer services and activities.",
        aliases: [
          "volunteer contract",
          "volunteer service agreement",
          "community service agreement",
        ],
      },
      es: {
        name: "Acuerdo de Voluntariado",
        description:
          "Acuerdo entre organización y voluntario para servicios y actividades de voluntariado.",
        aliases: [
          "contrato de voluntario",
          "acuerdo de servicio voluntario",
          "acuerdo de servicio comunitario",
        ],
      },
    },
  },
  "warehouse-agreement": {
    id: "warehouse-agreement",
    title: "Warehouse Agreement",
    description: "Agreement for warehouse storage and logistics services.",
    category: "Transportation & Automotive",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "storage agreement",
      "fulfillment agreement",
      "logistics contract",
      "contrato de almacenamiento",
      "acuerdo logístico",
      "contrato de logística",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Warehouse Agreement",
        description: "Agreement for warehouse storage and logistics services.",
        aliases: [
          "storage agreement",
          "fulfillment agreement",
          "logistics contract",
        ],
      },
      es: {
        name: "Acuerdo de Almacén",
        description: "Acuerdo para servicios de almacenamiento y logística.",
        aliases: [
          "contrato de almacenamiento",
          "acuerdo logístico",
          "contrato de logística",
        ],
      },
    },
  },
  "warehouse-lease": {
    id: "warehouse-lease",
    title: "Warehouse Lease",
    description:
      "Industrial lease agreement for warehouse and storage facilities",
    category: "Business & Commercial",
    jurisdiction: "us",
    tags: [],
    aliases: [],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Warehouse Lease",
        description:
          "Industrial lease agreement for warehouse and storage facilities",
        aliases: [],
      },
      es: {
        name: "Contrato de arrendamiento de almacén",
        description:
          "Contrato de arrendamiento industrial para almacenes y centros de almacenamiento.",
        aliases: [],
      },
    },
  },
  "warranty-deed": {
    id: "warranty-deed",
    title: "Warranty Deed",
    description: "Property transfer deed with full warranties and guarantees",
    category: "Real Estate & Property",
    jurisdiction: "us",
    tags: [],
    aliases: [],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Warranty Deed",
        description:
          "Property transfer deed with full warranties and guarantees",
        aliases: [],
      },
      es: {
        name: "Escritura con garantía general",
        description:
          "Escritura de transferencia de propiedad con garantías y avales completos.",
        aliases: [],
      },
    },
  },
  "water-rights-agreement": {
    id: "water-rights-agreement",
    title: "Water Rights Agreement",
    description: "Agreement for the transfer, lease, or use of water rights.",
    category: "Real Estate & Property",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "water transfer agreement",
      "irrigation rights",
      "water usage agreement",
      "acuerdo de transferencia de agua",
      "derechos de riego",
      "acuerdo de uso de agua",
    ],
    requiresNotary: true,
    states: ["all"],
    translations: {
      en: {
        name: "Water Rights Agreement",
        description:
          "Agreement for the transfer, lease, or use of water rights.",
        aliases: [
          "water transfer agreement",
          "irrigation rights",
          "water usage agreement",
        ],
      },
      es: {
        name: "Acuerdo de Derechos de Agua",
        description:
          "Acuerdo para la transferencia, arrendamiento o uso de derechos de agua.",
        aliases: [
          "acuerdo de transferencia de agua",
          "derechos de riego",
          "acuerdo de uso de agua",
        ],
      },
    },
  },
  "web-development-agreement": {
    id: "web-development-agreement",
    title: "Web Development Agreement",
    description:
      "Professional agreement for web development services between developer and client.",
    category: "Business",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "Website development contract",
      "Web design agreement",
      "Software development agreement",
      "Contrato desarrollo web",
      "Acuerdo diseño web",
      "Contrato desarrollo software",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Web Development Agreement",
        description:
          "Professional agreement for web development services between developer and client.",
        aliases: [
          "Website development contract",
          "Web design agreement",
          "Software development agreement",
        ],
      },
      es: {
        name: "Acuerdo de Desarrollo Web",
        description:
          "Acuerdo profesional para servicios de desarrollo web entre desarrollador y cliente.",
        aliases: [
          "Contrato desarrollo web",
          "Acuerdo diseño web",
          "Contrato desarrollo software",
        ],
      },
    },
  },
  "website-development-agreement": {
    id: "website-development-agreement",
    title: "Website Development Agreement",
    description:
      "Comprehensive agreement for website design and development services between developer and client.",
    category: "Professional Services",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "web development contract",
      "website design agreement",
      "web services contract",
      "contrato de desarrollo web",
      "acuerdo de diseño web",
      "contrato de servicios web",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Website Development Agreement",
        description:
          "Comprehensive agreement for website design and development services between developer and client.",
        aliases: [
          "web development contract",
          "website design agreement",
          "web services contract",
        ],
      },
      es: {
        name: "Acuerdo de Desarrollo de Sitio Web",
        description:
          "Acuerdo integral para servicios de diseño y desarrollo de sitios web entre desarrollador y cliente.",
        aliases: [
          "contrato de desarrollo web",
          "acuerdo de diseño web",
          "contrato de servicios web",
        ],
      },
    },
  },
  "work-from-home-agreement": {
    id: "work-from-home-agreement",
    title: "Work from Home Agreement",
    description:
      "Comprehensive agreement establishing terms and conditions for remote work arrangements.",
    category: "Employment",
    jurisdiction: "us",
    tags: [],
    aliases: [
      "remote work agreement",
      "telecommuting agreement",
      "home office agreement",
      "acuerdo de trabajo remoto",
      "acuerdo de teletrabajo",
      "acuerdo de la oficina en el hogar",
    ],
    requiresNotary: false,
    states: ["all"],
    translations: {
      en: {
        name: "Work from Home Agreement",
        description:
          "Comprehensive agreement establishing terms and conditions for remote work arrangements.",
        aliases: [
          "remote work agreement",
          "telecommuting agreement",
          "home office agreement",
        ],
      },
      es: {
        name: "Acuerdo de Trabajo desde Casa",
        description:
          "Acuerdo integral que establece términos y condiciones para arreglos de trabajo remoto.",
        aliases: [
          "acuerdo de trabajo remoto",
          "acuerdo de teletrabajo",
          "acuerdo de la oficina en el hogar",
        ],
      },
    },
  },
};

export const DOCUMENT_IDS: string[] = [
  "ach-authorization-form",
  "advance-directive",
  "advance-directive-revocation",
  "affidavit",
  "affidavit-general",
  "affidavit-of-death",
  "affidavit-of-heirship",
  "affidavit-of-identity",
  "affidavit-of-survivorship",
  "affiliate-marketing-agreement",
  "agricultural-agreement",
  "app-development-agreement",
  "arbitration-agreement",
  "architect-contract",
  "articles-of-incorporation",
  "articles-of-incorporation-biz",
  "assignment-agreement",
  "athletic-scholarship-agreement",
  "auto-repair-agreement",
  "automotive-service-agreement",
  "aviation-charter-agreement",
  "bar-agreement",
  "bid-proposal",
  "bill-of-sale-general",
  "board-resolution",
  "boat-bill-of-sale",
  "bookkeeping-services-agreement",
  "brand-ambassador-agreement",
  "business-contract",
  "business-plan",
  "buy-sell-agreement",
  "catering-agreement",
  "certificate-substantial-completion",
  "change-order",
  "child-care-authorization-form",
  "child-care-contract",
  "child-custody-agreement",
  "child-medical-consent",
  "child-support-agreement",
  "child-travel-consent",
  "clinical-trial-agreement",
  "cloud-services-agreement",
  "coaching-agreement",
  "codicil-to-will",
  "cohabitation-agreement",
  "collection-letter",
  "commercial-lease-agreement",
  "commercial-lease-with-option-to-purchase",
  "commission-agreement",
  "complaint-letter",
  "confidentiality-agreement",
  "consignment-agreement",
  "construction-bid-form",
  "construction-contract",
  "construction-management-agreement",
  "consulting-agreement",
  "contract-amendment",
  "contract-termination-letter",
  "copyright-assignment",
  "copyright-assignment-agreement",
  "copyright-license-agreement",
  "corporate-bylaws",
  "court-filing-document",
  "credit-card-agreement",
  "crop-sharing-agreement",
  "cryptocurrency-agreement",
  "cybersecurity-agreement",
  "data-processing-agreement",
  "debt-settlement-agreement",
  "debt-validation-letter",
  "demand-letter",
  "demand-letter-payment",
  "digital-asset-agreement",
  "direct-deposit-form",
  "divorce-settlement-agreement",
  "dog-breeding-agreement",
  "donation-agreement",
  "durable-power-of-attorney",
  "earnest-money-agreement",
  "ecommerce-terms-of-service",
  "education-trust",
  "elder-care-agreement",
  "employee-bonus-plan",
  "employee-evaluation-form",
  "employee-handbook",
  "employee-non-disclosure-agreement",
  "employee-warning-notice",
  "employment-contract",
  "employment-offer-letter",
  "employment-termination-letter",
  "employment-verification-letter",
  "endorsement-agreement",
  "environmental-agreement",
  "equipment-rental-agreement",
  "equity-incentive-plan",
  "event-planning-contract",
  "eviction-notice",
  "executive-employment-agreement",
  "farm-lease-agreement",
  "film-production-agreement",
  "fitness-waiver",
  "food-truck-agreement",
  "franchise-agreement",
  "franchise-disclosure-agreement",
  "gaming-agreement",
  "general-contractor-agreement",
  "general-inquiry",
  "general-liability-waiver",
  "government-contract-agreement",
  "guardianship-agreement",
  "health-care-directive",
  "healthcare-power-of-attorney",
  "hipaa-authorization-form",
  "home-improvement-contract",
  "horse-boarding-agreement",
  "hotel-agreement",
  "hunting-lease-agreement",
  "immigration-affidavit",
  "independent-contractor-agreement",
  "influencer-agreement",
  "insurance-claim-form",
  "international-trade-agreement",
  "internship-agreement",
  "invention-assignment-agreement",
  "investment-agreement",
  "invoice",
  "job-application-form",
  "joint-living-trust",
  "joint-venture-agreement",
  "landscaping-contract",
  "last-will-testament",
  "late-rent-notice",
  "lease-addendum",
  "lease-agreement",
  "lease-amendment",
  "lease-renewal-agreement",
  "lease-termination-letter",
  "leave-of-absence-request-form",
  "letter-of-intent",
  "licensing-agreement",
  "licensing-agreement-general",
  "limited-partnership-agreement",
  "livestock-purchase-agreement",
  "living-trust",
  "living-trust-amendment",
  "living-will",
  "llc-operating-agreement",
  "loan-agreement",
  "loan-modification-agreement",
  "loan-modification-letter",
  "lottery-pool-contract",
  "maritime-charter-agreement",
  "marketing-agreement",
  "marriage-separation-agreement",
  "mechanics-lien",
  "mechanics-lien-waiver",
  "mediation-agreement",
  "medical-consent",
  "medical-consent-form",
  "medical-power-of-attorney",
  "membership-agreement",
  "membership-cancellation-letter",
  "memorandum-of-agreement",
  "memorandum-of-understanding",
  "mining-agreement",
  "mining-lease-agreement",
  "model-release",
  "mortgage-agreement",
  "music-license-agreement",
  "music-licensing-agreement",
  "mutual-non-disclosure-agreement",
  "name-change-notification-letter",
  "nda",
  "non-compete-agreement",
  "non-disclosure-agreement",
  "nonprofit-bylaws",
  "notarization-request",
  "notice-of-lease-violation",
  "notice-to-enter",
  "notice-to-pay-rent-or-quit",
  "notice-to-proceed",
  "offer-letter",
  "office-space-lease",
  "oil-gas-lease",
  "oil-gas-lease-agreement",
  "parenting-plan",
  "parking-space-lease-agreement",
  "partnership-agreement",
  "partnership-amendment",
  "partnership-dissolution-agreement",
  "patent-application-assignment",
  "patent-assignment",
  "patent-license-agreement",
  "patent-licensing-agreement",
  "payment-bond",
  "payment-plan",
  "performance-bond",
  "personal-care-agreement",
  "personal-loan-agreement",
  "personal-training-agreement",
  "pet-addendum",
  "pet-agreement",
  "pet-custody-agreement",
  "photo-release-form",
  "photography-release",
  "postnuptial-agreement",
  "pour-over-will",
  "power-of-attorney",
  "power-of-attorney-for-child",
  "prenuptial-agreement",
  "private-placement-memorandum",
  "product-liability-waiver",
  "professional-liability-waiver",
  "progressive-discipline-policy",
  "promissory-note",
  "promissory-note-balloon-payments",
  "promissory-note-installment-payments",
  "proof-of-income-letter",
  "property-deed",
  "property-manager-agreement",
  "provisional-patent-application",
  "purchase-agreement",
  "purchase-order",
  "quitclaim-deed",
  "real-estate-purchase-agreement",
  "receipt",
  "recording-artist-agreement",
  "release-for-use-of-likeness",
  "release-of-liability",
  "remodeling-contract",
  "rent-increase-letter",
  "rent-receipt",
  "rental-agreement",
  "research-agreement",
  "residential-lease-agreement",
  "residential-rental-application",
  "residential-rental-inspection-report",
  "resignation-letter",
  "resignation-letter-personal",
  "restaurant-agreement",
  "restaurant-lease",
  "retail-space-lease",
  "retirement-plan-agreement",
  "revocation-of-power-of-attorney",
  "revolving-credit-agreement",
  "ride-sharing-agreement",
  "roofing-contract",
  "room-rental-agreement",
  "roommate-agreement",
  "royalty-agreement",
  "salary-verification-letter",
  "sale-of-goods",
  "sales-agreement",
  "security-agreement",
  "separation-agreement",
  "service-agreement",
  "service-level-agreement",
  "settlement-agreement",
  "severance-agreement",
  "shareholder-agreement",
  "simple-will",
  "single-member-llc-operating-agreement",
  "small-estate-affidavit",
  "social-media-management-agreement",
  "software-license-agreement",
  "solar-energy-agreement",
  "sponsorship-agreement",
  "sports-agreement",
  "startup-equity-agreement",
  "statement-of-account",
  "statement-of-work",
  "stock-purchase-agreement",
  "storage-space-lease-agreement",
  "student-loan-agreement",
  "subcontractor-agreement",
  "sublease-agreement",
  "talent-agreement",
  "talent-management-agreement",
  "tax-preparation-agreement",
  "telecommuting-agreement",
  "telemedicine-agreement",
  "tenant-maintenance-request",
  "term-sheet",
  "termination-letter",
  "timber-sale-agreement",
  "trademark-application-worksheet",
  "trademark-assignment",
  "trademark-license-agreement",
  "transportation-service-agreement",
  "travel-insurance-agreement",
  "triple-net-lease",
  "tuition-agreement",
  "tutoring-agreement",
  "two-weeks-notice-letter",
  "vacation-rental-agreement",
  "vehicle-bill-of-sale",
  "vehicle-lease-agreement",
  "vendor-agreement",
  "video-release",
  "volunteer-agreement",
  "warehouse-agreement",
  "warehouse-lease",
  "warranty-deed",
  "water-rights-agreement",
  "web-development-agreement",
  "website-development-agreement",
  "work-from-home-agreement",
];
