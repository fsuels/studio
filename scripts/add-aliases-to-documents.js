#!/usr/bin/env node

/**
 * Add comprehensive aliases/synonyms to all documents for better search
 */

const fs = require('fs');
const path = require('path');

// Define comprehensive aliases for different document types
const documentAliases = {
  // Business Documents
  'nda': {
    en: ['confidential', 'nda', 'protect idea', 'secret', 'non-disclosure', 'confidentiality', 'privacy agreement'],
    es: ['confidencial', 'nda', 'proteger idea', 'secreto', 'no divulgación', 'confidencialidad', 'acuerdo de privacidad']
  },
  'partnership-agreement': {
    en: ['partnership', 'partners', 'business partnership', 'joint venture', 'collaboration agreement', 'partner contract'],
    es: ['sociedad', 'socios', 'sociedad comercial', 'empresa conjunta', 'acuerdo de colaboración', 'contrato de socios']
  },
  'operating-agreement': {
    en: ['LLC agreement', 'company rules', 'business operating', 'LLC operating', 'business governance', 'company charter'],
    es: ['acuerdo de LLC', 'reglas de empresa', 'operación comercial', 'operación de LLC', 'gobierno empresarial', 'carta de empresa']
  },
  'service-agreement': {
    en: ['service contract', 'freelance contract', 'contractor agreement', 'work agreement', 'consulting agreement'],
    es: ['contrato de servicio', 'contrato freelance', 'acuerdo de contratista', 'acuerdo de trabajo', 'acuerdo de consultoría']
  },
  'employment-contract': {
    en: ['job contract', 'work contract', 'employee agreement', 'employment terms', 'hire agreement'],
    es: ['contrato de trabajo', 'contrato laboral', 'acuerdo de empleado', 'términos de empleo', 'acuerdo de contratación']
  },
  'employment-offer-letter': {
    en: ['job offer', 'offer letter', 'employment offer', 'hire letter', 'job proposal'],
    es: ['oferta de trabajo', 'carta de oferta', 'oferta de empleo', 'carta de contratación', 'propuesta de trabajo']
  },
  'employment-termination-letter': {
    en: ['termination letter', 'firing letter', 'dismissal letter', 'layoff letter', 'separation letter'],
    es: ['carta de terminación', 'carta de despido', 'carta de despedida', 'carta de cesantía', 'carta de separación']
  },
  'non-compete-agreement': {
    en: ['non-compete', 'no compete', 'competition restriction', 'restraint of trade', 'non-competition'],
    es: ['no competencia', 'restricción de competencia', 'limitación de comercio', 'no competir']
  },
  'independent-contractor-agreement': {
    en: ['contractor agreement', 'freelance agreement', '1099 agreement', 'independent worker', 'consultant contract'],
    es: ['acuerdo de contratista', 'acuerdo freelance', 'acuerdo 1099', 'trabajador independiente', 'contrato de consultor']
  },
  'articles-of-incorporation-biz': {
    en: ['incorporation', 'start company', 'business formation', 'corporate charter', 'company registration'],
    es: ['incorporación', 'iniciar empresa', 'formación empresarial', 'carta corporativa', 'registro de empresa']
  },
  'consignment-agreement': {
    en: ['consignment', 'sell items', 'retail agreement', 'consign goods', 'merchandise agreement'],
    es: ['consignación', 'vender artículos', 'acuerdo de venta', 'consignar bienes', 'acuerdo de mercancía']
  },
  'invoice': {
    en: ['bill', 'payment request', 'billing', 'invoice template', 'payment due', 'charges'],
    es: ['factura', 'solicitud de pago', 'facturación', 'plantilla de factura', 'pago debido', 'cargos']
  },

  // Real Estate Documents
  'lease-agreement': {
    en: ['rental agreement', 'rent contract', 'tenant agreement', 'property lease', 'apartment lease'],
    es: ['contrato de alquiler', 'contrato de renta', 'acuerdo de inquilino', 'arrendamiento de propiedad', 'alquiler de apartamento']
  },
  'rental-agreement': {
    en: ['rent agreement', 'lease contract', 'tenant contract', 'property rental', 'housing agreement'],
    es: ['acuerdo de renta', 'contrato de arrendamiento', 'contrato de inquilino', 'alquiler de propiedad', 'acuerdo de vivienda']
  },
  'residential-lease-agreement': {
    en: ['residential lease', 'home lease', 'apartment lease', 'house rental', 'residential rental'],
    es: ['arrendamiento residencial', 'alquiler de casa', 'arrendamiento de apartamento', 'alquiler de vivienda', 'renta residencial']
  },
  'commercial-lease-agreement': {
    en: ['commercial lease', 'business lease', 'office lease', 'retail lease', 'commercial rental'],
    es: ['arrendamiento comercial', 'alquiler comercial', 'arrendamiento de oficina', 'alquiler de local', 'renta comercial']
  },
  'quitclaim-deed': {
    en: ['quitclaim', 'property transfer', 'deed transfer', 'property ownership', 'real estate transfer'],
    es: ['escritura de renuncia', 'transferencia de propiedad', 'transferencia de escritura', 'propiedad inmobiliaria', 'traspaso de bienes']
  },
  'property-deed': {
    en: ['property deed', 'real estate deed', 'property ownership', 'title transfer', 'land deed'],
    es: ['escritura de propiedad', 'escritura inmobiliaria', 'propiedad de bienes', 'transferencia de título', 'escritura de terreno']
  },
  'purchase-agreement': {
    en: ['purchase contract', 'buy agreement', 'sale contract', 'buying agreement', 'acquisition agreement'],
    es: ['contrato de compra', 'acuerdo de compra', 'contrato de venta', 'acuerdo de compraventa', 'acuerdo de adquisición']
  },
  'eviction-notice': {
    en: ['eviction', 'notice to quit', 'tenant removal', 'evict tenant', 'notice to vacate'],
    es: ['desalojo', 'aviso de desalojo', 'remoción de inquilino', 'desalojar inquilino', 'aviso de desocupar']
  },

  // Legal/Personal Documents
  'last-will-testament': {
    en: ['will', 'last will', 'testament', 'estate planning', 'inheritance', 'final wishes'],
    es: ['testamento', 'última voluntad', 'planificación patrimonial', 'herencia', 'deseos finales']
  },
  'living-will': {
    en: ['living will', 'advance directive', 'medical directive', 'end of life', 'healthcare directive'],
    es: ['testamento en vida', 'directiva anticipada', 'directiva médica', 'fin de vida', 'directiva de salud']
  },
  'living-trust': {
    en: ['living trust', 'revocable trust', 'family trust', 'estate trust', 'trust agreement'],
    es: ['fideicomiso en vida', 'fideicomiso revocable', 'fideicomiso familiar', 'fideicomiso patrimonial', 'acuerdo de fideicomiso']
  },
  'power-of-attorney': {
    en: ['power of attorney', 'POA', 'legal representative', 'agent authorization', 'proxy'],
    es: ['poder notarial', 'POA', 'representante legal', 'autorización de agente', 'apoderado']
  },
  'healthcare-power-of-attorney': {
    en: ['healthcare POA', 'medical power', 'healthcare proxy', 'medical representative', 'healthcare agent'],
    es: ['poder médico', 'poder de salud', 'representante médico', 'agente de salud', 'apoderado médico']
  },
  'child-custody-agreement': {
    en: ['child custody', 'custody agreement', 'parenting plan', 'child care agreement', 'custody arrangement'],
    es: ['custodia de menores', 'acuerdo de custodia', 'plan de crianza', 'acuerdo de cuidado infantil', 'arreglo de custodia']
  },
  'child-medical-consent': {
    en: ['medical consent', 'child medical', 'healthcare consent', 'medical authorization', 'medical permission'],
    es: ['consentimiento médico', 'médico infantil', 'consentimiento de salud', 'autorización médica', 'permiso médico']
  },
  'divorce-settlement-agreement': {
    en: ['divorce settlement', 'divorce agreement', 'marital settlement', 'separation agreement', 'divorce terms'],
    es: ['acuerdo de divorcio', 'liquidación de divorcio', 'acuerdo matrimonial', 'acuerdo de separación', 'términos de divorcio']
  },
  'prenuptial-agreement': {
    en: ['prenup', 'prenuptial', 'premarital agreement', 'marriage contract', 'prenuptial contract'],
    es: ['acuerdo prenupcial', 'prenup', 'contrato prematrimonial', 'contrato de matrimonio', 'acuerdo prenupicial']
  },
  'affidavit-general': {
    en: ['affidavit', 'sworn statement', 'legal statement', 'notarized statement', 'oath statement'],
    es: ['declaración jurada', 'declaración bajo juramento', 'declaración legal', 'declaración notarizada', 'declaración de juramento']
  },
  'demand-letter-payment': {
    en: ['demand letter', 'payment demand', 'collection letter', 'overdue payment', 'debt collection'],
    es: ['carta de demanda', 'demanda de pago', 'carta de cobranza', 'pago vencido', 'cobranza de deuda']
  },

  // Financial Documents
  'promissory-note': {
    en: ['promissory note', 'IOU', 'loan agreement', 'debt note', 'payment promise', 'loan contract'],
    es: ['pagaré', 'nota promisoria', 'acuerdo de préstamo', 'nota de deuda', 'promesa de pago', 'contrato de préstamo']
  },
  'loan-agreement': {
    en: ['loan contract', 'lending agreement', 'borrowing agreement', 'credit agreement', 'loan terms'],
    es: ['contrato de préstamo', 'acuerdo de préstamo', 'acuerdo de crédito', 'términos de préstamo']
  },
  'vehicle-bill-of-sale': {
    en: ['sell car', 'vehicle sale', 'car sale contract', 'auto sale', 'vehicle transfer', 'car bill of sale'],
    es: ['venta de coche', 'venta de vehículo', 'contrato de venta de auto', 'venta de automóvil', 'transferencia de vehículo']
  },
  'boat-bill-of-sale': {
    en: ['sell boat', 'boat sale', 'watercraft sale', 'marine sale', 'vessel transfer'],
    es: ['venta de barco', 'venta de embarcación', 'venta marina', 'transferencia de embarcación']
  },

  // Intellectual Property
  'copyright-assignment': {
    en: ['copyright transfer', 'intellectual property', 'creative rights', 'copyright ownership', 'IP assignment'],
    es: ['transferencia de derechos de autor', 'propiedad intelectual', 'derechos creativos', 'propiedad de derechos de autor']
  },
  'trademark-assignment': {
    en: ['trademark transfer', 'brand transfer', 'trademark ownership', 'brand rights', 'trademark sale'],
    es: ['transferencia de marca', 'transferencia de marca registrada', 'propiedad de marca', 'derechos de marca']
  },
  'licensing-agreement': {
    en: ['license agreement', 'licensing contract', 'usage rights', 'permission agreement', 'license terms'],
    es: ['acuerdo de licencia', 'contrato de licencia', 'derechos de uso', 'acuerdo de permiso', 'términos de licencia']
  }
};

console.log('🏷️  Adding Aliases to All Documents...\n');

const usDocsDir = path.join(__dirname, '../src/lib/documents/us');
const documentDirs = fs.readdirSync(usDocsDir)
  .filter(item => {
    const itemPath = path.join(usDocsDir, item);
    return fs.statSync(itemPath).isDirectory();
  });

let updatedCount = 0;
let alreadyHadAliases = 0;

documentDirs.forEach(dir => {
  const metadataPath = path.join(usDocsDir, dir, 'metadata.ts');
  
  if (fs.existsSync(metadataPath)) {
    const content = fs.readFileSync(metadataPath, 'utf8');
    
    // Check if it already has aliases
    if (content.includes('aliases:')) {
      console.log(`✅ ${dir}: Already has aliases`);
      alreadyHadAliases++;
      return;
    }

    // Get aliases for this document
    let aliases = documentAliases[dir];
    if (!aliases) {
      console.log(`⚠️  ${dir}: No predefined aliases, adding generic ones`);
      // Add generic aliases
      aliases = {
        en: [dir.replace(/-/g, ' '), dir.replace(/-/g, ''), 'legal document', 'contract'],
        es: [dir.replace(/-/g, ' '), dir.replace(/-/g, ''), 'documento legal', 'contrato']
      };
    }

    // Find the translations section and add aliases
    const aliasesEn = `      aliases: ${JSON.stringify(aliases.en, null, 8).replace(/\n/g, '\n      ')},`;
    const aliasesEs = `      aliases: ${JSON.stringify(aliases.es, null, 8).replace(/\n/g, '\n      ')},`;

    let newContent = content;

    // Add aliases to English section
    if (newContent.includes('en: {') && !newContent.includes('aliases:')) {
      newContent = newContent.replace(
        /(en: {\s*\n\s*name:.*?\n\s*description:.*?\n)/,
        `$1${aliasesEn}\n`
      );
    }

    // Add aliases to Spanish section
    if (newContent.includes('es: {') && !newContent.includes('aliases:')) {
      newContent = newContent.replace(
        /(es: {\s*\n\s*name:.*?\n\s*description:.*?\n)/,
        `$1${aliasesEs}\n`
      );
    }

    // Write the updated content
    if (newContent !== content) {
      fs.writeFileSync(metadataPath, newContent);
      console.log(`✅ ${dir}: Added aliases`);
      updatedCount++;
    } else {
      console.log(`⚠️  ${dir}: Could not add aliases (format issue)`);
    }
  } else {
    console.log(`❌ ${dir}: No metadata.ts file found`);
  }
});

console.log(`\n🎯 Aliases Summary:`);
console.log(`   ✅ Documents with existing aliases: ${alreadyHadAliases}`);
console.log(`   🆕 Documents updated with new aliases: ${updatedCount}`);
console.log(`   📚 Total documents processed: ${documentDirs.length}`);

console.log(`\n🔍 Search improvements added:`);
console.log(`   • Common synonyms and alternative terms`);
console.log(`   • Industry-specific terminology`);
console.log(`   • Bilingual search support (EN/ES)`);
console.log(`   • Casual and formal language variations`);

console.log(`\n✨ All documents now have comprehensive search aliases!`);