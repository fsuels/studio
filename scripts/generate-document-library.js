#!/usr/bin/env node

// Automated Document Library Generation System
// Generates complete document definitions for all 35+ legal document types

const fs = require('fs');
const path = require('path');

// Complete list of documents to generate
const DOCUMENT_LIBRARY = [
  // Real Estate Documents
  {
    id: 'residential-lease-agreement',
    name: 'Residential Lease Agreement',
    category: 'Real Estate',
    complexity: 'medium',
    states: 'all',
    notarization: false,
    priority: 'high',
  },
  {
    id: 'commercial-lease-agreement',
    name: 'Commercial Lease Agreement',
    category: 'Real Estate',
    complexity: 'high',
    states: 'all',
    notarization: true,
    priority: 'high',
  },
  {
    id: 'rental-agreement',
    name: 'Rental Agreement',
    category: 'Real Estate',
    complexity: 'medium',
    states: 'all',
    notarization: false,
    priority: 'high',
  },
  {
    id: 'property-deed',
    name: 'Property Deed',
    category: 'Real Estate',
    complexity: 'high',
    states: 'all',
    notarization: true,
    priority: 'medium',
  },
  {
    id: 'quitclaim-deed',
    name: 'Quitclaim Deed',
    category: 'Real Estate',
    complexity: 'high',
    states: 'all',
    notarization: true,
    priority: 'medium',
  },

  // Business Documents
  {
    id: 'llc-operating-agreement',
    name: 'LLC Operating Agreement',
    category: 'Business',
    complexity: 'high',
    states: 'all',
    notarization: false,
    priority: 'high',
  },
  {
    id: 'articles-of-incorporation',
    name: 'Articles of Incorporation',
    category: 'Business',
    complexity: 'high',
    states: 'all',
    notarization: true,
    priority: 'high',
  },
  {
    id: 'partnership-agreement',
    name: 'Partnership Agreement',
    category: 'Business',
    complexity: 'high',
    states: 'all',
    notarization: false,
    priority: 'high',
  },
  {
    id: 'non-disclosure-agreement',
    name: 'Non-Disclosure Agreement (NDA)',
    category: 'Business',
    complexity: 'medium',
    states: 'all',
    notarization: false,
    priority: 'high',
  },
  {
    id: 'independent-contractor-agreement',
    name: 'Independent Contractor Agreement',
    category: 'Business',
    complexity: 'medium',
    states: 'all',
    notarization: false,
    priority: 'high',
  },
  {
    id: 'non-compete-agreement',
    name: 'Non-Compete Agreement',
    category: 'Business',
    complexity: 'medium',
    states: ['CA', 'TX', 'NY', 'FL'], // Some states restrict
    notarization: false,
    priority: 'medium',
  },
  {
    id: 'service-agreement',
    name: 'Service Agreement',
    category: 'Business',
    complexity: 'medium',
    states: 'all',
    notarization: false,
    priority: 'high',
  },

  // Employment Documents
  {
    id: 'employment-contract',
    name: 'Employment Contract',
    category: 'Employment',
    complexity: 'medium',
    states: 'all',
    notarization: false,
    priority: 'high',
  },
  {
    id: 'offer-letter',
    name: 'Employment Offer Letter',
    category: 'Employment',
    complexity: 'low',
    states: 'all',
    notarization: false,
    priority: 'medium',
  },
  {
    id: 'termination-letter',
    name: 'Employment Termination Letter',
    category: 'Employment',
    complexity: 'low',
    states: 'all',
    notarization: false,
    priority: 'medium',
  },
  {
    id: 'severance-agreement',
    name: 'Severance Agreement',
    category: 'Employment',
    complexity: 'medium',
    states: 'all',
    notarization: false,
    priority: 'medium',
  },

  // Estate Planning Documents
  {
    id: 'last-will-testament',
    name: 'Last Will and Testament',
    category: 'Estate Planning',
    complexity: 'high',
    states: 'all',
    notarization: true,
    priority: 'high',
  },
  {
    id: 'living-will',
    name: 'Living Will',
    category: 'Estate Planning',
    complexity: 'medium',
    states: 'all',
    notarization: true,
    priority: 'high',
  },
  {
    id: 'power-of-attorney',
    name: 'Power of Attorney',
    category: 'Estate Planning',
    complexity: 'medium',
    states: 'all',
    notarization: true,
    priority: 'high',
  },
  {
    id: 'healthcare-power-of-attorney',
    name: 'Healthcare Power of Attorney',
    category: 'Estate Planning',
    complexity: 'medium',
    states: 'all',
    notarization: true,
    priority: 'high',
  },
  {
    id: 'living-trust',
    name: 'Living Trust',
    category: 'Estate Planning',
    complexity: 'high',
    states: 'all',
    notarization: true,
    priority: 'medium',
  },

  // Financial Documents
  {
    id: 'promissory-note',
    name: 'Promissory Note',
    category: 'Financial',
    complexity: 'medium',
    states: 'all',
    notarization: false,
    priority: 'high',
  },
  {
    id: 'loan-agreement',
    name: 'Loan Agreement',
    category: 'Financial',
    complexity: 'medium',
    states: 'all',
    notarization: true,
    priority: 'medium',
  },
  {
    id: 'invoice',
    name: 'Invoice',
    category: 'Financial',
    complexity: 'low',
    states: 'all',
    notarization: false,
    priority: 'low',
  },

  // Personal Documents
  {
    id: 'prenuptial-agreement',
    name: 'Prenuptial Agreement',
    category: 'Personal',
    complexity: 'high',
    states: 'all',
    notarization: true,
    priority: 'medium',
  },
  {
    id: 'divorce-settlement',
    name: 'Divorce Settlement Agreement',
    category: 'Personal',
    complexity: 'high',
    states: 'all',
    notarization: true,
    priority: 'medium',
  },
  {
    id: 'child-custody-agreement',
    name: 'Child Custody Agreement',
    category: 'Personal',
    complexity: 'high',
    states: 'all',
    notarization: true,
    priority: 'medium',
  },
  {
    id: 'medical-consent',
    name: 'Child Medical Consent Form',
    category: 'Personal',
    complexity: 'low',
    states: 'all',
    notarization: true,
    priority: 'low',
  },

  // Vehicle/Transportation
  {
    id: 'vehicle-bill-of-sale',
    name: 'Vehicle Bill of Sale',
    category: 'Transportation',
    complexity: 'medium',
    states: 'all',
    notarization: true,
    priority: 'high',
  },
  {
    id: 'boat-bill-of-sale',
    name: 'Boat Bill of Sale',
    category: 'Transportation',
    complexity: 'medium',
    states: 'all',
    notarization: true,
    priority: 'low',
  },

  // Legal Documents
  {
    id: 'affidavit',
    name: 'General Affidavit',
    category: 'Legal',
    complexity: 'low',
    states: 'all',
    notarization: true,
    priority: 'medium',
  },
  {
    id: 'demand-letter',
    name: 'Demand Letter for Payment',
    category: 'Legal',
    complexity: 'low',
    states: 'all',
    notarization: false,
    priority: 'medium',
  },
  {
    id: 'eviction-notice',
    name: 'Eviction Notice',
    category: 'Legal',
    complexity: 'medium',
    states: 'all',
    notarization: false,
    priority: 'medium',
  },

  // Additional High-Value Documents
  {
    id: 'copyright-assignment',
    name: 'Copyright Assignment Agreement',
    category: 'Intellectual Property',
    complexity: 'medium',
    states: 'all',
    notarization: false,
    priority: 'low',
  },
  {
    id: 'trademark-assignment',
    name: 'Trademark Assignment Agreement',
    category: 'Intellectual Property',
    complexity: 'medium',
    states: 'all',
    notarization: false,
    priority: 'low',
  },
  {
    id: 'licensing-agreement',
    name: 'Licensing Agreement',
    category: 'Intellectual Property',
    complexity: 'high',
    states: 'all',
    notarization: false,
    priority: 'medium',
  },
  {
    id: 'purchase-agreement',
    name: 'General Purchase Agreement',
    category: 'Sales',
    complexity: 'medium',
    states: 'all',
    notarization: false,
    priority: 'medium',
  },
  {
    id: 'consignment-agreement',
    name: 'Consignment Agreement',
    category: 'Sales',
    complexity: 'medium',
    states: 'all',
    notarization: false,
    priority: 'low',
  },
];

class DocumentLibraryGenerator {
  constructor() {
    this.baseDir = 'src/lib/documents/us';
    this.templatesDir = 'public/templates/en';
    this.created = 0;
    this.skipped = 0;
  }

  // Generate document schema based on complexity and type
  generateSchema(document) {
    const baseFields = {
      name: 'z.string().min(1, "Name is required")',
      email: 'z.string().email("Valid email required").optional()',
      address: 'z.string().min(1, "Address is required")',
      city: 'z.string().min(1, "City is required")',
      state: 'z.string().min(2, "State is required")',
      zipCode: 'z.string().min(5, "Valid ZIP code required")',
      date: 'z.string().min(1, "Date is required")',
    };

    const businessFields = {
      companyName: 'z.string().min(1, "Company name is required")',
      businessAddress: 'z.string().min(1, "Business address is required")',
      taxId: 'z.string().optional()',
      businessType:
        'z.enum(["LLC", "Corporation", "Partnership", "Sole Proprietorship"])',
    };

    const financialFields = {
      amount: 'z.number().min(0, "Amount must be positive")',
      interestRate:
        'z.number().min(0).max(100, "Interest rate must be between 0-100%")',
      paymentTerms: 'z.string().min(1, "Payment terms required")',
      dueDate: 'z.string().min(1, "Due date required")',
    };

    let fields = { ...baseFields };

    // Add category-specific fields
    if (document.category === 'Business') {
      fields = { ...fields, ...businessFields };
    }
    if (document.category === 'Financial') {
      fields = { ...fields, ...financialFields };
    }
    if (document.category === 'Real Estate') {
      fields = {
        ...fields,
        propertyAddress: 'z.string().min(1, "Property address required")',
        rentAmount:
          'z.number().min(0, "Rent amount must be positive").optional()',
        leaseTerms: 'z.string().min(1, "Lease terms required").optional()',
      };
    }

    return fields;
  }

  // Generate questions array based on schema
  generateQuestions(document, schema) {
    const questions = [];

    Object.entries(schema).forEach(([key, validation]) => {
      questions.push({
        id: key,
        label: this.humanize(key),
        type: this.getFieldType(key, validation),
        required: !validation.includes('optional()'),
        placeholder: `Enter ${this.humanize(key).toLowerCase()}...`,
      });
    });

    return questions;
  }

  // Convert camelCase to human readable
  humanize(str) {
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }

  // Determine field type from validation
  getFieldType(key, validation) {
    if (validation.includes('number()')) return 'number';
    if (validation.includes('email()')) return 'email';
    if (validation.includes('enum(')) return 'select';
    if (key.toLowerCase().includes('date')) return 'date';
    if (key.toLowerCase().includes('address')) return 'address';
    return 'text';
  }

  // Generate document template content
  generateTemplate(document) {
    return `# ${document.name}

## Overview
This ${document.name} is designed to meet the legal requirements for ${document.category.toLowerCase()} documents in the United States.

## Key Provisions
- Clearly defines all parties involved
- Outlines terms and conditions
- Includes state-specific requirements
- ${document.notarization ? 'Requires notarization' : 'No notarization required'}

## When to Use
Use this ${document.name} when you need to formalize ${document.category.toLowerCase()} arrangements that are legally binding and enforceable.

## State Requirements
${document.states === 'all' ? 'This document is valid in all 50 states with appropriate customization.' : `This document is specifically designed for: ${Array.isArray(document.states) ? document.states.join(', ') : document.states}`}

## Important Notes
- Review all information carefully before finalizing
- Consider consulting with a legal professional for complex situations
- Ensure all parties receive signed copies
${document.notarization ? '- Document must be notarized to be legally valid' : ''}

---

**Document ID**: {{document_id}}
**Created**: {{creation_date}}
**Parties**: {{parties}}

{{document_content}}`;
  }

  // Generate metadata
  generateMetadata(document) {
    return {
      id: document.id,
      name: document.name,
      category: document.category,
      complexity: document.complexity,
      estimatedTime: this.getEstimatedTime(document.complexity),
      offerNotarization: document.notarization,
      states: document.states,
      tags: this.generateTags(document),
      translations: {
        en: {
          name: document.name,
          description: `Create a legally binding ${document.name} with our easy-to-use template. State-specific requirements included.`,
          aliases: this.generateAliases(document),
        },
        es: {
          name: this.translateToSpanish(document.name),
          description: `Crea un ${this.translateToSpanish(document.name)} legalmente válido con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.`,
          aliases: [],
        },
      },
    };
  }

  // Get estimated completion time
  getEstimatedTime(complexity) {
    switch (complexity) {
      case 'low':
        return '5-10 minutes';
      case 'medium':
        return '10-20 minutes';
      case 'high':
        return '20-40 minutes';
      default:
        return '10-15 minutes';
    }
  }

  // Generate tags for searchability
  generateTags(document) {
    const tags = [
      document.category.toLowerCase(),
      document.complexity,
      'legal',
      'template',
    ];

    if (document.notarization) tags.push('notarization');
    if (document.priority === 'high') tags.push('popular');

    return tags;
  }

  // Generate aliases for better search
  generateAliases(document) {
    const aliases = [];
    const name = document.name.toLowerCase();

    // Add common variations
    if (name.includes('agreement')) {
      aliases.push(name.replace('agreement', 'contract'));
    }
    if (name.includes('contract')) {
      aliases.push(name.replace('contract', 'agreement'));
    }

    // Add category-specific aliases
    if (document.category === 'Business') {
      aliases.push('business document', 'commercial agreement');
    }

    return aliases;
  }

  // Basic Spanish translation (would use proper translation service in production)
  translateToSpanish(name) {
    const translations = {
      Agreement: 'Acuerdo',
      Contract: 'Contrato',
      Letter: 'Carta',
      Notice: 'Aviso',
      Will: 'Testamento',
      'Power of Attorney': 'Poder Notarial',
      Lease: 'Arrendamiento',
      'Bill of Sale': 'Contrato de Compraventa',
      Employment: 'Empleo',
      Termination: 'Terminación',
      'Non-Disclosure': 'Confidencialidad',
      Partnership: 'Sociedad',
    };

    let translated = name;
    Object.entries(translations).forEach(([en, es]) => {
      translated = translated.replace(new RegExp(en, 'gi'), es);
    });

    return translated;
  }

  // Create document files
  async createDocumentFiles(document) {
    const docDir = path.join(this.baseDir, document.id);

    // Create directory
    if (!fs.existsSync(docDir)) {
      fs.mkdirSync(docDir, { recursive: true });
    }

    const schema = this.generateSchema(document);
    const questions = this.generateQuestions(document, schema);
    const metadata = this.generateMetadata(document);

    // Generate index.ts
    const indexContent = `// ${document.name}
import { z } from 'zod';
import type { LegalDocument } from '../../types';

const schema = z.object({
${Object.entries(schema)
  .map(([key, validation]) => `  ${key}: ${validation}`)
  .join(',\n')}
});

export const ${this.toCamelCase(document.id)}: LegalDocument = {
  id: '${document.id}',
  name: '${document.name}',
  category: '${document.category}',
  schema,
  questions: ${JSON.stringify(questions, null, 2)},
  offerNotarization: ${document.notarization},
  states: ${document.states === 'all' ? '"all"' : JSON.stringify(document.states)},
  ...${JSON.stringify(metadata, null, 2).slice(1, -1)}
};
`;

    fs.writeFileSync(path.join(docDir, 'index.ts'), indexContent);

    // Generate schema.ts
    const schemaContent = `import { z } from 'zod';

export const ${this.toCamelCase(document.id)}Schema = z.object({
${Object.entries(schema)
  .map(([key, validation]) => `  ${key}: ${validation}`)
  .join(',\n')}
});

export type ${this.toPascalCase(document.id)}Data = z.infer<typeof ${this.toCamelCase(document.id)}Schema>;
`;

    fs.writeFileSync(path.join(docDir, 'schema.ts'), schemaContent);

    // Generate questions.ts
    const questionsContent = `import type { Question } from '../../types';

export const ${this.toCamelCase(document.id)}Questions: Question[] = ${JSON.stringify(questions, null, 2)};
`;

    fs.writeFileSync(path.join(docDir, 'questions.ts'), questionsContent);

    // Generate metadata.ts
    const metadataContent = `export const ${this.toCamelCase(document.id)}Metadata = ${JSON.stringify(metadata, null, 2)};
`;

    fs.writeFileSync(path.join(docDir, 'metadata.ts'), metadataContent);

    // Generate template file
    const templateDir = path.join(this.templatesDir, document.id + '.md');
    const templateContent = this.generateTemplate(document);

    if (!fs.existsSync(path.dirname(templateDir))) {
      fs.mkdirSync(path.dirname(templateDir), { recursive: true });
    }
    fs.writeFileSync(templateDir, templateContent);

    console.log(`✅ Created ${document.name} (${document.id})`);
    this.created++;
  }

  // Utility functions
  toCamelCase(str) {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  }

  toPascalCase(str) {
    const camel = this.toCamelCase(str);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  }

  // Generate all documents
  async generateAll() {
    console.log('📚 Generating complete document library...');
    console.log(`Target: ${DOCUMENT_LIBRARY.length} documents\n`);

    // Ensure base directories exist
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
    if (!fs.existsSync(this.templatesDir)) {
      fs.mkdirSync(this.templatesDir, { recursive: true });
    }

    // Generate high priority documents first
    const sortedDocs = DOCUMENT_LIBRARY.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    for (const document of sortedDocs) {
      const docDir = path.join(this.baseDir, document.id);

      if (fs.existsSync(docDir)) {
        console.log(`⏭️  Skipping ${document.name} - already exists`);
        this.skipped++;
        continue;
      }

      await this.createDocumentFiles(document);
    }

    console.log(`\n🎉 Document library generation completed!`);
    console.log(`Created: ${this.created} documents`);
    console.log(`Skipped: ${this.skipped} documents`);
    console.log(
      `Total: ${this.created + this.skipped}/${DOCUMENT_LIBRARY.length} documents`,
    );
  }
}

// Run the generator
const generator = new DocumentLibraryGenerator();
generator.generateAll().catch(console.error);
