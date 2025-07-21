// Industry-Specific Document Generation System
// Creates targeted document variations for different industries to maximize SEO coverage

interface IndustryProfile {
  id: string;
  name: string;
  commonDocuments: string[];
  specificRequirements: string[];
  regulatoryBodies: string[];
  averageRevenue: number;
  employeeCount: string;
  keyTerminology: string[];
  seoKeywords: string[];
  painPoints: string[];
}

interface DocumentVariation {
  baseDocumentId: string;
  industryId: string;
  name: string;
  description: string;
  additionalFields: Array<{
    id: string;
    label: string;
    type: string;
    required: boolean;
    industrySpecific: boolean;
  }>;
  industrySpecificClauses: string[];
  seoKeywords: string[];
  marketingAngle: string;
  pricingTier: 'basic' | 'professional' | 'enterprise';
}

export class IndustryDocumentGenerator {
  private industries: IndustryProfile[] = [
    {
      id: 'technology',
      name: 'Technology & Software',
      commonDocuments: [
        'nda',
        'service-agreement',
        'employment-contract',
        'independent-contractor-agreement',
        'licensing-agreement',
      ],
      specificRequirements: [
        'Intellectual property protection',
        'Data privacy compliance (GDPR, CCPA)',
        'Software licensing terms',
        'Non-compete restrictions (where legal)',
        'Remote work agreements',
      ],
      regulatoryBodies: ['FTC', 'SEC', 'State Attorney General'],
      averageRevenue: 500000,
      employeeCount: '10-100',
      keyTerminology: [
        'SaaS',
        'API',
        'intellectual property',
        'data processing',
        'cloud services',
        'software license',
        'user data',
      ],
      seoKeywords: [
        'software company legal documents',
        'tech startup contracts',
        'SaaS terms of service',
        'developer agreements',
      ],
      painPoints: [
        'Protecting intellectual property',
        'Compliance with data privacy laws',
        'Managing contractor relationships',
        'International data transfers',
      ],
    },
    {
      id: 'healthcare',
      name: 'Healthcare & Medical',
      commonDocuments: [
        'employment-contract',
        'independent-contractor-agreement',
        'service-agreement',
        'partnership-agreement',
        'lease-agreement',
      ],
      specificRequirements: [
        'HIPAA compliance mandatory',
        'Professional liability coverage',
        'State medical board regulations',
        'Patient privacy protections',
        'Telemedicine regulations',
      ],
      regulatoryBodies: ['FDA', 'CMS', 'State Medical Boards', 'DEA'],
      averageRevenue: 750000,
      employeeCount: '5-50',
      keyTerminology: [
        'HIPAA',
        'PHI',
        'medical records',
        'patient care',
        'telehealth',
        'medical device',
        'clinical trial',
      ],
      seoKeywords: [
        'medical practice legal documents',
        'HIPAA compliant contracts',
        'healthcare provider agreements',
        'medical partnership agreements',
      ],
      painPoints: [
        'HIPAA compliance complexity',
        'Medical malpractice liability',
        'Telemedicine regulations',
        'Patient data security',
      ],
    },
    {
      id: 'real-estate',
      name: 'Real Estate & Property',
      commonDocuments: [
        'lease-agreement',
        'service-agreement',
        'independent-contractor-agreement',
        'partnership-agreement',
        'purchase-agreement',
      ],
      specificRequirements: [
        'State real estate law compliance',
        'Property disclosure requirements',
        'Fair housing compliance',
        'Lead paint disclosures',
        'Local zoning considerations',
      ],
      regulatoryBodies: [
        'State Real Estate Commissions',
        'HUD',
        'Local Zoning Boards',
      ],
      averageRevenue: 300000,
      employeeCount: '1-20',
      keyTerminology: [
        'MLS',
        'escrow',
        'title insurance',
        'property management',
        'rental income',
        'fair housing',
        'due diligence',
      ],
      seoKeywords: [
        'real estate agent contracts',
        'property management agreements',
        'real estate legal documents',
        'landlord tenant agreements',
      ],
      painPoints: [
        'Complex state regulations',
        'Fair housing compliance',
        'Property disclosure requirements',
        'Commission disputes',
      ],
    },
    {
      id: 'construction',
      name: 'Construction & Contracting',
      commonDocuments: [
        'service-agreement',
        'independent-contractor-agreement',
        'partnership-agreement',
        'employment-contract',
      ],
      specificRequirements: [
        'Contractor licensing compliance',
        'Lien waiver provisions',
        'Safety and insurance requirements',
        'Performance bond requirements',
        'Change order procedures',
      ],
      regulatoryBodies: [
        'OSHA',
        'State Contractor Boards',
        'Local Building Departments',
      ],
      averageRevenue: 400000,
      employeeCount: '5-100',
      keyTerminology: [
        'subcontractor',
        'lien waiver',
        'performance bond',
        'change order',
        'construction schedule',
        'prevailing wage',
      ],
      seoKeywords: [
        'construction contract templates',
        'contractor agreements',
        'subcontractor contracts',
        'construction legal documents',
      ],
      painPoints: [
        'Payment and lien issues',
        'Safety compliance',
        'Change order management',
        'Subcontractor disputes',
      ],
    },
    {
      id: 'consulting',
      name: 'Consulting & Professional Services',
      commonDocuments: [
        'service-agreement',
        'nda',
        'independent-contractor-agreement',
        'partnership-agreement',
        'employment-contract',
      ],
      specificRequirements: [
        'Professional liability considerations',
        'Confidentiality protections',
        'Scope of work definitions',
        'Payment terms and milestones',
        'Intellectual property ownership',
      ],
      regulatoryBodies: [
        'Professional Licensing Boards',
        'IRS',
        'State Tax Authorities',
      ],
      averageRevenue: 250000,
      employeeCount: '1-25',
      keyTerminology: [
        'retainer',
        'deliverables',
        'milestone payments',
        'professional liability',
        'confidential information',
      ],
      seoKeywords: [
        'consulting agreement templates',
        'professional services contracts',
        'consultant legal documents',
        'business consulting agreements',
      ],
      painPoints: [
        'Scope creep management',
        'Payment collection',
        'Confidentiality protection',
        'Professional liability',
      ],
    },
    {
      id: 'retail',
      name: 'Retail & E-commerce',
      commonDocuments: [
        'employment-contract',
        'lease-agreement',
        'service-agreement',
        'partnership-agreement',
        'purchase-agreement',
      ],
      specificRequirements: [
        'Consumer protection compliance',
        'Return and refund policies',
        'Product liability considerations',
        'Sales tax compliance',
        'E-commerce regulations',
      ],
      regulatoryBodies: [
        'FTC',
        'State Consumer Protection Agencies',
        'Sales Tax Authorities',
      ],
      averageRevenue: 600000,
      employeeCount: '5-200',
      keyTerminology: [
        'point of sale',
        'inventory management',
        'consumer protection',
        'return policy',
        'sales tax',
        'product liability',
      ],
      seoKeywords: [
        'retail business legal documents',
        'e-commerce terms and conditions',
        'retail employment contracts',
        'store lease agreements',
      ],
      painPoints: [
        'Consumer protection compliance',
        'Product liability risks',
        'Employee management',
        'Lease negotiations',
      ],
    },
  ];

  // Generate industry-specific document variations
  generateIndustryVariations(baseDocumentId: string): DocumentVariation[] {
    const variations: DocumentVariation[] = [];

    this.industries.forEach((industry) => {
      if (industry.commonDocuments.includes(baseDocumentId)) {
        const variation = this.createDocumentVariation(
          baseDocumentId,
          industry,
        );
        variations.push(variation);
      }
    });

    return variations;
  }

  private createDocumentVariation(
    baseDocumentId: string,
    industry: IndustryProfile,
  ): DocumentVariation {
    const baseDocument = this.getBaseDocumentInfo(baseDocumentId);

    return {
      baseDocumentId,
      industryId: industry.id,
      name: `${baseDocument.name} - ${industry.name}`,
      description: `Specialized ${baseDocument.name.toLowerCase()} tailored for ${industry.name.toLowerCase()} businesses with industry-specific requirements and terminology.`,
      additionalFields: this.generateIndustryFields(baseDocumentId, industry),
      industrySpecificClauses: this.generateIndustryClauses(
        baseDocumentId,
        industry,
      ),
      seoKeywords: [
        ...industry.seoKeywords,
        `${industry.name.toLowerCase()} ${baseDocument.name.toLowerCase()}`,
        `${baseDocumentId.replace('-', ' ')} ${industry.name.toLowerCase()}`,
        ...industry.keyTerminology.map((term) => `${term} agreement`),
      ],
      marketingAngle: this.generateMarketingAngle(baseDocumentId, industry),
      pricingTier: this.determinePricingTier(industry),
    };
  }

  private generateIndustryFields(
    baseDocumentId: string,
    industry: IndustryProfile,
  ): Array<{
    id: string;
    label: string;
    type: string;
    required: boolean;
    industrySpecific: boolean;
  }> {
    const fields = [];

    // Technology-specific fields
    if (industry.id === 'technology') {
      if (baseDocumentId === 'nda') {
        fields.push({
          id: 'dataTypes',
          label: 'Types of Data/Information Covered',
          type: 'select',
          required: true,
          industrySpecific: true,
        });
        fields.push({
          id: 'gdprCompliance',
          label: 'GDPR Compliance Required',
          type: 'checkbox',
          required: false,
          industrySpecific: true,
        });
      }
      if (baseDocumentId === 'employment-contract') {
        fields.push({
          id: 'remoteWorkPolicy',
          label: 'Remote Work Policy',
          type: 'textarea',
          required: false,
          industrySpecific: true,
        });
        fields.push({
          id: 'equipmentProvision',
          label: 'Company Equipment Provided',
          type: 'checkbox',
          required: false,
          industrySpecific: true,
        });
      }
    }

    // Healthcare-specific fields
    if (industry.id === 'healthcare') {
      fields.push({
        id: 'hipaaCompliance',
        label: 'HIPAA Compliance Acknowledgment',
        type: 'checkbox',
        required: true,
        industrySpecific: true,
      });
      fields.push({
        id: 'medicalLicenseNumber',
        label: 'Medical License Number',
        type: 'text',
        required: true,
        industrySpecific: true,
      });
      if (baseDocumentId === 'employment-contract') {
        fields.push({
          id: 'malpracticeInsurance',
          label: 'Malpractice Insurance Requirements',
          type: 'textarea',
          required: true,
          industrySpecific: true,
        });
      }
    }

    // Construction-specific fields
    if (industry.id === 'construction') {
      fields.push({
        id: 'contractorLicense',
        label: 'Contractor License Number',
        type: 'text',
        required: true,
        industrySpecific: true,
      });
      fields.push({
        id: 'insuranceRequirements',
        label: 'Insurance Requirements',
        type: 'textarea',
        required: true,
        industrySpecific: true,
      });
      if (baseDocumentId === 'service-agreement') {
        fields.push({
          id: 'lienWaiverProvisions',
          label: 'Lien Waiver Provisions',
          type: 'checkbox',
          required: true,
          industrySpecific: true,
        });
      }
    }

    return fields;
  }

  private generateIndustryClauses(
    baseDocumentId: string,
    industry: IndustryProfile,
  ): string[] {
    const clauses = [];

    // Technology industry clauses
    if (industry.id === 'technology') {
      clauses.push(
        'Data privacy and security provisions compliant with applicable regulations',
      );
      clauses.push(
        'Intellectual property protection for software, algorithms, and proprietary methods',
      );
      if (baseDocumentId === 'employment-contract') {
        clauses.push('Remote work and digital communication policies');
        clauses.push('Company equipment and software license usage terms');
      }
    }

    // Healthcare industry clauses
    if (industry.id === 'healthcare') {
      clauses.push(
        'HIPAA compliance and patient privacy protection requirements',
      );
      clauses.push(
        'Professional liability and malpractice insurance provisions',
      );
      clauses.push('Medical licensing and credentialing requirements');
      clauses.push('Compliance with state and federal healthcare regulations');
    }

    // Real estate industry clauses
    if (industry.id === 'real-estate') {
      clauses.push(
        'Fair housing law compliance and anti-discrimination provisions',
      );
      clauses.push('Property disclosure and inspection requirements');
      clauses.push('Real estate licensing and MLS compliance terms');
    }

    // Construction industry clauses
    if (industry.id === 'construction') {
      clauses.push('Contractor licensing and bonding requirements');
      clauses.push('Safety compliance and OSHA regulation adherence');
      clauses.push('Lien waiver and payment protection provisions');
      clauses.push('Change order and scope modification procedures');
    }

    return clauses;
  }

  private generateMarketingAngle(
    baseDocumentId: string,
    industry: IndustryProfile,
  ): string {
    const baseDocument = this.getBaseDocumentInfo(baseDocumentId);

    return `Specialized ${baseDocument.name.toLowerCase()} designed specifically for ${industry.name.toLowerCase()} businesses. Includes industry-specific clauses, terminology, and compliance requirements. Addresses common ${industry.name.toLowerCase()} challenges like ${industry.painPoints[0]?.toLowerCase()} and ${industry.painPoints[1]?.toLowerCase()}.`;
  }

  private determinePricingTier(
    industry: IndustryProfile,
  ): 'basic' | 'professional' | 'enterprise' {
    if (industry.averageRevenue > 500000) return 'enterprise';
    if (industry.averageRevenue > 250000) return 'professional';
    return 'basic';
  }

  private getBaseDocumentInfo(documentId: string) {
    const documentMap: Record<string, { name: string; category: string }> = {
      nda: { name: 'Non-Disclosure Agreement', category: 'Business' },
      'service-agreement': { name: 'Service Agreement', category: 'Business' },
      'employment-contract': {
        name: 'Employment Contract',
        category: 'Employment',
      },
      'independent-contractor-agreement': {
        name: 'Independent Contractor Agreement',
        category: 'Business',
      },
      'lease-agreement': { name: 'Lease Agreement', category: 'Real Estate' },
      'partnership-agreement': {
        name: 'Partnership Agreement',
        category: 'Business',
      },
      'purchase-agreement': { name: 'Purchase Agreement', category: 'Sales' },
      'licensing-agreement': {
        name: 'Licensing Agreement',
        category: 'Intellectual Property',
      },
    };

    return (
      documentMap[documentId] || { name: 'Legal Document', category: 'General' }
    );
  }

  // Generate SEO-optimized content for industry pages
  generateIndustryPageContent(industryId: string): {
    title: string;
    metaDescription: string;
    h1: string;
    content: string;
    faq: Array<{ question: string; answer: string }>;
    seoKeywords: string[];
  } {
    const industry = this.industries.find((i) => i.id === industryId);
    if (!industry) throw new Error(`Industry ${industryId} not found`);

    return {
      title: `${industry.name} Legal Documents & Contracts | 123LegalDoc`,
      metaDescription: `Professional legal documents for ${industry.name.toLowerCase()} businesses. Industry-specific contracts, agreements, and forms. ${industry.specificRequirements[0]}. Create in minutes.`,
      h1: `Legal Documents for ${industry.name} Businesses`,
      content: this.generateIndustryContent(industry),
      faq: this.generateIndustryFAQ(industry),
      seoKeywords: industry.seoKeywords,
    };
  }

  private generateIndustryContent(industry: IndustryProfile): string {
    return `
# Legal Documents Tailored for ${industry.name}

## Why ${industry.name} Businesses Need Specialized Legal Documents

${industry.name} businesses face unique challenges including ${industry.painPoints.join(', ')}. Our industry-specific legal documents address these challenges with specialized clauses and terminology.

## Essential Documents for ${industry.name}

${industry.commonDocuments.map((doc) => `- ${this.getBaseDocumentInfo(doc).name}`).join('\n')}

## Industry-Specific Requirements

${industry.specificRequirements.map((req) => `- ${req}`).join('\n')}

## Regulatory Compliance

Our ${industry.name.toLowerCase()} documents ensure compliance with relevant regulatory bodies:
${industry.regulatoryBodies.map((body) => `- ${body}`).join('\n')}

## Key Benefits

- **Industry Expertise**: Documents created by legal experts familiar with ${industry.name.toLowerCase()} regulations
- **Time-Saving**: Pre-populated with industry-standard terms and clauses
- **Compliance**: Built-in compliance with ${industry.regulatoryBodies[0]} and other relevant regulations
- **Cost-Effective**: Fraction of the cost of custom legal work
    `;
  }

  private generateIndustryFAQ(
    industry: IndustryProfile,
  ): Array<{ question: string; answer: string }> {
    return [
      {
        question: `What legal documents does a ${industry.name.toLowerCase()} business need?`,
        answer: `${industry.name} businesses typically need ${industry.commonDocuments.slice(0, 3).join(', ')} and other specialized agreements. The specific documents depend on your business model and ${industry.specificRequirements[0]?.toLowerCase()}.`,
      },
      {
        question: `Are these documents compliant with ${industry.name.toLowerCase()} regulations?`,
        answer: `Yes, our ${industry.name.toLowerCase()} documents are designed to comply with relevant regulations including ${industry.regulatoryBodies.slice(0, 2).join(' and ')} requirements. They include industry-specific clauses for ${industry.specificRequirements[0]?.toLowerCase()}.`,
      },
      {
        question: `How much do ${industry.name.toLowerCase()} legal documents cost?`,
        answer: `Our ${industry.name.toLowerCase()} documents start at $29, significantly less than traditional legal fees which can range from $500-2000. The exact cost depends on the document complexity and your specific needs.`,
      },
      {
        question: `Can I customize the documents for my specific ${industry.name.toLowerCase()} business?`,
        answer: `Absolutely! All documents can be customized with your specific terms, ${industry.keyTerminology.slice(0, 2).join(', ')}, and business requirements while maintaining legal compliance.`,
      },
    ];
  }

  // Get all industry profiles for navigation/categorization
  getAllIndustries(): IndustryProfile[] {
    return this.industries;
  }

  // Get documents for specific industry
  getIndustryDocuments(industryId: string): string[] {
    const industry = this.industries.find((i) => i.id === industryId);
    return industry?.commonDocuments || [];
  }
}

// Export singleton instance
export const industryDocumentGenerator = new IndustryDocumentGenerator();
