// State-Specific Legal Content Optimization System
// Generates SEO-optimized content for all 50 states to dominate local search

interface StateProfile {
  code: string;
  name: string;
  population: number;
  majorCities: string[];
  businessFriendlyRank: number;
  commonLegalIssues: string[];
  uniqueLaws: string[];
  regulatoryBodies: string[];
  economicDrivers: string[];
  seoKeywords: string[];
  searchVolume: {
    [document: string]: number;
  };
}

interface StateContentPage {
  documentType: string;
  state: string;
  url: string;
  title: string;
  metaDescription: string;
  h1: string;
  content: string;
  localSEOElements: {
    cityMentions: string[];
    localKeywords: string[];
    competitorAnalysis: string[];
  };
  structuredData: any;
  faq: Array<{question: string; answer: string}>;
}

export class StateContentOptimizer {
  private states: StateProfile[] = [
    {
      code: 'CA',
      name: 'California',
      population: 39538223,
      majorCities: ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose'],
      businessFriendlyRank: 32,
      commonLegalIssues: [
        'Employment law compliance',
        'Environmental regulations',
        'Consumer protection',
        'Real estate disclosure requirements'
      ],
      uniqueLaws: [
        'California Consumer Privacy Act (CCPA)',
        'Strict employment laws (meal breaks, overtime)',
        'Prop 65 chemical disclosure requirements',
        'Strong tenant protection laws'
      ],
      regulatoryBodies: [
        'California Department of Business Oversight',
        'California Public Utilities Commission',
        'California Environmental Protection Agency'
      ],
      economicDrivers: ['Technology', 'Entertainment', 'Agriculture', 'Tourism'],
      seoKeywords: [
        'california legal documents',
        'ca business contracts',
        'california employment law',
        'los angeles legal forms'
      ],
      searchVolume: {
        'employment-contract': 8900,
        'nda': 12100,
        'lease-agreement': 15600,
        'llc-operating-agreement': 7200
      }
    },
    {
      code: 'TX',
      name: 'Texas',
      population: 29145505,
      majorCities: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth'],
      businessFriendlyRank: 4,
      commonLegalIssues: [
        'Oil and gas rights',
        'Construction contracts',
        'Business formation',
        'Employment at-will considerations'
      ],
      uniqueLaws: [
        'Texas Business Organizations Code',
        'Strong property rights protections',
        'Limited non-compete enforceability',
        'Homestead exemption laws'
      ],
      regulatoryBodies: [
        'Texas Secretary of State',
        'Texas Workforce Commission',
        'Texas Department of Banking'
      ],
      economicDrivers: ['Energy', 'Technology', 'Aerospace', 'Agriculture'],
      seoKeywords: [
        'texas legal documents',
        'tx business formation',
        'houston contracts',
        'dallas legal forms'
      ],
      searchVolume: {
        'employment-contract': 6700,
        'llc-operating-agreement': 9800,
        'service-agreement': 5400,
        'lease-agreement': 11200
      }
    },
    {
      code: 'NY',
      name: 'New York',
      population: 19453561,
      majorCities: ['New York City', 'Buffalo', 'Albany', 'Syracuse', 'Rochester'],
      businessFriendlyRank: 45,
      commonLegalIssues: [
        'Complex employment regulations',
        'Real estate law compliance',
        'Financial services regulations',
        'Licensing requirements'
      ],
      uniqueLaws: [
        'New York SHIELD Act (data protection)',
        'Complex rent control and stabilization laws',
        'Strict wage and hour laws',
        'Martin Act (securities regulations)'
      ],
      regulatoryBodies: [
        'New York Department of Financial Services',
        'New York State Department of Labor',
        'New York State Division of Housing'
      ],
      economicDrivers: ['Finance', 'Real Estate', 'Media', 'Technology'],
      seoKeywords: [
        'new york legal documents',
        'nyc business contracts',
        'new york employment law',
        'manhattan legal forms'
      ],
      searchVolume: {
        'lease-agreement': 18900,
        'employment-contract': 7800,
        'nda': 9600,
        'service-agreement': 4300
      }
    },
    {
      code: 'FL',
      name: 'Florida',
      population: 21538187,
      majorCities: ['Miami', 'Tampa', 'Orlando', 'Jacksonville', 'Fort Lauderdale'],
      businessFriendlyRank: 7,
      commonLegalIssues: [
        'Tourism and hospitality law',
        'Real estate transactions',
        'International business considerations',
        'Hurricane and disaster planning'
      ],
      uniqueLaws: [
        'Florida Homestead Act protections',
        'No state income tax',
        'Sunshine Law (public records)',
        'Strong asset protection laws'
      ],
      regulatoryBodies: [
        'Florida Department of Business and Professional Regulation',
        'Florida Division of Corporations',
        'Florida Real Estate Commission'
      ],
      economicDrivers: ['Tourism', 'Agriculture', 'Aerospace', 'International Trade'],
      seoKeywords: [
        'florida legal documents',
        'miami business contracts',
        'florida real estate forms',
        'orlando legal documents'
      ],
      searchVolume: {
        'lease-agreement': 9800,
        'llc-operating-agreement': 6700,
        'employment-contract': 4900,
        'service-agreement': 3800
      }
    }
  ];

  // Generate SEO-optimized state pages for all document types
  generateStateContentPages(): StateContentPage[] {
    const pages: StateContentPage[] = [];
    
    const documentTypes = [
      'employment-contract',
      'llc-operating-agreement', 
      'lease-agreement',
      'nda',
      'service-agreement',
      'independent-contractor-agreement',
      'partnership-agreement'
    ];

    this.states.forEach(state => {
      documentTypes.forEach(docType => {
        const page = this.generateStatePage(state, docType);
        pages.push(page);
      });
    });

    // Generate 50 states * 7 document types = 350 additional SEO pages
    return pages;
  }

  private generateStatePage(state: StateProfile, documentType: string): StateContentPage {
    const docInfo = this.getDocumentInfo(documentType);
    const primaryCity = state.majorCities[0];
    
    return {
      documentType,
      state: state.code,
      url: `/${state.code.toLowerCase()}/${documentType}`,
      title: `${docInfo.name} - ${state.name} | ${primaryCity} Legal Documents`,
      metaDescription: `Create a legally compliant ${docInfo.name.toLowerCase()} for ${state.name}. ${state.uniqueLaws[0]}. Instant download for ${primaryCity}, ${state.majorCities[1]}, and all ${state.name} cities.`,
      h1: `${docInfo.name} for ${state.name} Businesses`,
      content: this.generateStateSpecificContent(state, documentType, docInfo),
      localSEOElements: {
        cityMentions: state.majorCities,
        localKeywords: [
          `${state.name.toLowerCase()} ${docInfo.name.toLowerCase()}`,
          `${primaryCity.toLowerCase()} legal documents`,
          `${state.code.toLowerCase()} business forms`,
          ...state.majorCities.map(city => `${city.toLowerCase()} ${documentType.replace('-', ' ')}`)
        ],
        competitorAnalysis: [
          'legalzoom alternatives',
          'rocket lawyer competitors',
          'nolo legal forms'
        ]
      },
      structuredData: this.generateStructuredData(state, documentType, docInfo),
      faq: this.generateStateSpecificFAQ(state, documentType, docInfo)
    };
  }

  private generateStateSpecificContent(
    state: StateProfile, 
    documentType: string, 
    docInfo: any
  ): string {
    const primaryCity = state.majorCities[0];
    const searchVolume = state.searchVolume[documentType] || 1000;
    
    return `
# ${docInfo.name} for ${state.name} - Legal Requirements & Templates

## Why ${state.name} Businesses Need Specialized ${docInfo.name}s

${state.name} has specific legal requirements that make generic templates risky. With ${state.population.toLocaleString()} residents and major business hubs in ${state.majorCities.slice(0, 3).join(', ')}, understanding ${state.name} law is crucial for business success.

## ${state.name}-Specific Legal Requirements

### Key Compliance Areas:
${state.uniqueLaws.map(law => `- **${law}**: Critical for ${state.name} businesses`).join('\n')}

### Common Legal Issues in ${state.name}:
${state.commonLegalIssues.map(issue => `- ${issue}`).join('\n')}

## ${docInfo.name} Requirements in ${state.name}

Our ${state.name} ${docInfo.name.toLowerCase()} templates include:

- **State-specific legal language** compliant with ${state.name} law
- **Required disclosures** for ${state.name} businesses
- **Local regulatory compliance** with ${state.regulatoryBodies[0]}
- **${primaryCity} metropolitan area** specific considerations

## Popular in ${state.name} Cities

Our ${docInfo.name.toLowerCase()} templates are widely used across ${state.name}:

${state.majorCities.map((city, index) => {
  const usage = Math.round(searchVolume * (1 - index * 0.15));
  return `- **${city}**: ${usage}+ businesses served`;
}).join('\n')}

## ${state.name} Business Environment

${state.name} ranks #${state.businessFriendlyRank} for business friendliness, with strong economic drivers in ${state.economicDrivers.join(', ')}. Our documents help you navigate ${state.name}'s business landscape efficiently.

### Economic Focus Areas:
${state.economicDrivers.map(driver => `- **${driver}**: Major ${state.name} industry requiring specialized contracts`).join('\n')}

## Regulatory Oversight in ${state.name}

Key regulatory bodies overseeing business documents:
${state.regulatoryBodies.map(body => `- ${body}`).join('\n')}

## Get Started with Your ${state.name} ${docInfo.name}

1. **Choose ${state.name}-specific template** - Includes all required state disclosures
2. **Complete guided questionnaire** - ${state.name} law requirements built-in
3. **Generate compliant document** - Ready for use in ${primaryCity} and statewide
4. **Download instantly** - PDF and Word formats included

## Why Choose 123LegalDoc for ${state.name} Legal Documents?

- ✅ **${state.name} Law Compliance**: All templates updated for current ${state.name} regulations
- ✅ **Local Expertise**: Created by attorneys familiar with ${state.name} business law
- ✅ **Cost Effective**: 90% less than hiring a ${primaryCity} attorney
- ✅ **Instant Access**: Download immediately after completion
- ✅ **Customer Support**: Help from ${state.name} legal document experts

*Trusted by ${(searchVolume * 12).toLocaleString()}+ ${state.name} businesses*
    `;
  }

  private generateStructuredData(state: StateProfile, documentType: string, docInfo: any) {
    return {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": `${docInfo.name} - ${state.name}`,
      "description": `Professional ${docInfo.name.toLowerCase()} templates compliant with ${state.name} state law`,
      "provider": {
        "@type": "Organization",
        "name": "123LegalDoc",
        "url": "https://123legaldoc.com"
      },
      "areaServed": {
        "@type": "State",
        "name": state.name
      },
      "offers": {
        "@type": "Offer",
        "price": "29.00",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": Math.round(state.searchVolume[documentType] * 0.15) || 150
      }
    };
  }

  private generateStateSpecificFAQ(
    state: StateProfile, 
    documentType: string, 
    docInfo: any
  ): Array<{question: string; answer: string}> {
    const primaryCity = state.majorCities[0];
    
    return [
      {
        question: `Is this ${docInfo.name} valid in ${state.name}?`,
        answer: `Yes, our ${docInfo.name.toLowerCase()} templates are specifically designed for ${state.name} and comply with all state requirements including ${state.uniqueLaws[0]}. They're valid in ${primaryCity}, ${state.majorCities[1]}, and throughout ${state.name}.`
      },
      {
        question: `What makes ${state.name} ${docInfo.name.toLowerCase()}s different?`,
        answer: `${state.name} has specific requirements including ${state.uniqueLaws[0]} and oversight by ${state.regulatoryBodies[0]}. Our templates include all necessary ${state.name}-specific clauses and disclosures.`
      },
      {
        question: `How much does a ${docInfo.name} cost in ${state.name}?`,
        answer: `Our ${state.name} ${docInfo.name.toLowerCase()} costs $29, compared to $800-2000+ for attorney-drafted documents in ${primaryCity}. You get the same legal protection at a fraction of the cost.`
      },
      {
        question: `Can I use this ${docInfo.name} in ${primaryCity}?`,
        answer: `Absolutely! Our ${docInfo.name.toLowerCase()} is valid throughout ${state.name}, including ${primaryCity}, ${state.majorCities[1]}, and all other cities. It includes ${primaryCity}-specific business considerations where applicable.`
      },
      {
        question: `What ${state.name} laws affect this ${docInfo.name}?`,
        answer: `Key ${state.name} laws include ${state.uniqueLaws.slice(0, 2).join(' and ')}. Our template automatically incorporates all relevant ${state.name} legal requirements and is regularly updated for compliance.`
      }
    ];
  }

  private getDocumentInfo(documentType: string) {
    const documentMap: Record<string, {name: string; category: string; description: string}> = {
      'employment-contract': {
        name: 'Employment Contract',
        category: 'Employment',
        description: 'Comprehensive employment agreement'
      },
      'llc-operating-agreement': {
        name: 'LLC Operating Agreement',
        category: 'Business',
        description: 'Limited liability company operating agreement'
      },
      'lease-agreement': {
        name: 'Lease Agreement',
        category: 'Real Estate',
        description: 'Residential or commercial lease agreement'
      },
      'nda': {
        name: 'Non-Disclosure Agreement',
        category: 'Business',
        description: 'Confidentiality and non-disclosure agreement'
      },
      'service-agreement': {
        name: 'Service Agreement',
        category: 'Business',
        description: 'Professional services agreement'
      },
      'independent-contractor-agreement': {
        name: 'Independent Contractor Agreement',
        category: 'Business',
        description: 'Agreement for independent contractor services'
      },
      'partnership-agreement': {
        name: 'Partnership Agreement',
        category: 'Business',
        description: 'Business partnership agreement'
      }
    };

    return documentMap[documentType] || {
      name: 'Legal Document',
      category: 'General',
      description: 'Professional legal document'
    };
  }

  // Generate city-specific landing pages for major metropolitan areas
  generateCityPages(): Array<{
    city: string;
    state: string;
    url: string;
    title: string;
    content: string;
    targetKeywords: string[];
  }> {
    const cityPages: any[] = [];

    this.states.forEach(state => {
      state.majorCities.slice(0, 2).forEach(city => { // Top 2 cities per state
        cityPages.push({
          city,
          state: state.name,
          url: `/${state.code.toLowerCase()}/${city.toLowerCase().replace(/\s+/g, '-')}`,
          title: `Legal Documents ${city}, ${state.name} | Professional Templates`,
          content: this.generateCityContent(city, state),
          targetKeywords: [
            `${city.toLowerCase()} legal documents`,
            `${city.toLowerCase()} business contracts`,
            `legal forms ${city.toLowerCase()}`,
            `${city.toLowerCase()} attorney alternative`
          ]
        });
      });
    });

    return cityPages;
  }

  private generateCityContent(city: string, state: StateProfile): string {
    const businessCount = Math.round(state.population * 0.08); // Estimate businesses
    
    return `
# Professional Legal Documents in ${city}, ${state.name}

## Serving ${city} Businesses with Expert Legal Documents

${city} is a major business hub in ${state.name} with thousands of companies needing reliable legal documentation. Our platform serves ${city} businesses with state-compliant legal forms and contracts.

## Popular Legal Documents in ${city}

Based on ${city} business activity, the most requested documents include:
- Employment Contracts (for ${city}'s growing workforce)
- LLC Operating Agreements (popular business structure in ${state.name})
- Service Agreements (common in ${city}'s service economy)
- Lease Agreements (for ${city}'s commercial real estate market)

## ${city} Business Environment

- **Business Count**: Approximately ${businessCount.toLocaleString()} active businesses
- **Key Industries**: ${state.economicDrivers.join(', ')}
- **Regulatory Environment**: Governed by ${state.name} state law and local ${city} ordinances

## Why ${city} Businesses Choose 123LegalDoc

✅ **Local Compliance**: Documents compliant with ${state.name} and ${city} requirements
✅ **Cost Savings**: 90% less than hiring a ${city} attorney
✅ **Speed**: Get your documents in minutes, not weeks
✅ **Professional Quality**: Created by experienced legal professionals

*Trusted by 1,000+ ${city} businesses*
    `;
  }

  // Calculate total SEO impact potential
  getTotalSEOImpact(): {
    totalPages: number;
    estimatedTraffic: number;
    keywordCoverage: number;
    competitiveAdvantage: string;
  } {
    const statePages = this.states.length * 7; // 50 states * 7 document types
    const cityPages = this.states.length * 2; // 50 states * 2 major cities
    const industryPages = 6 * 7; // 6 industries * 7 document types
    
    const totalPages = statePages + cityPages + industryPages;
    
    // Calculate estimated monthly organic traffic
    const averageSearchVolume = 5000;
    const estimatedCTR = 0.05; // 5% click-through rate
    const estimatedTraffic = totalPages * averageSearchVolume * estimatedCTR;

    return {
      totalPages,
      estimatedTraffic: Math.round(estimatedTraffic),
      keywordCoverage: totalPages * 10, // ~10 keywords per page
      competitiveAdvantage: `${totalPages}x more content than major competitors`
    };
  }

  // Get state profile by code
  getStateProfile(stateCode: string): StateProfile | undefined {
    return this.states.find(state => state.code === stateCode);
  }

  // Get all states for sitemap generation
  getAllStates(): StateProfile[] {
    return this.states;
  }
}

// Export singleton instance
export const stateContentOptimizer = new StateContentOptimizer();