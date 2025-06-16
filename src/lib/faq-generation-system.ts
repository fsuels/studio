// Comprehensive FAQ Generation System
// Automatically generates SEO-optimized FAQs for all documents, states, and industries

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  searchVolume: number;
  difficulty: 'easy' | 'medium' | 'hard';
  lastUpdated: string;
  seoKeywords: string[];
}

interface FAQPage {
  title: string;
  url: string;
  metaDescription: string;
  h1: string;
  faqs: FAQItem[];
  relatedPages: string[];
  structuredData: any;
}

export class FAQGenerationSystem {
  private baseQuestions: Record<string, string[]> = {
    general: [
      'How much does it cost?',
      'How long does it take?',
      'Is it legally binding?',
      'Can I customize it?',
      'What if I need help?',
      'Do you offer refunds?',
      'Is my information secure?',
      'How do I download my document?'
    ],
    'employment-contract': [
      'What should be included in an employment contract?',
      'Can an employment contract be changed?',
      'What is at-will employment?',
      'Are non-compete clauses enforceable?',
      'What benefits should be included?',
      'How do I terminate an employment contract?',
      'What is the difference between salary and hourly employees?',
      'Do I need an employment contract for part-time workers?'
    ],
    'llc-operating-agreement': [
      'Do I need an operating agreement for my LLC?',
      'What happens if I don\'t have an operating agreement?',
      'Can I change my operating agreement later?',
      'How many members can an LLC have?',
      'What is the difference between member-managed and manager-managed?',
      'How are LLC profits distributed?',
      'Can an LLC have different classes of membership?',
      'How do I add new members to my LLC?'
    ],
    'lease-agreement': [
      'What is the difference between a lease and rental agreement?',
      'Can I break a lease early?',
      'How much security deposit can a landlord charge?',
      'Who is responsible for repairs?',
      'Can a landlord enter my apartment without notice?',
      'What happens if I don\'t pay rent?',
      'Can my rent be increased during the lease term?',
      'What is a lease renewal?'
    ],
    'nda': [
      'What information can be protected by an NDA?',
      'How long does an NDA last?',
      'Can an NDA be enforced?',
      'What is the difference between mutual and one-way NDAs?',
      'Can employees be required to sign NDAs?',
      'What happens if someone violates an NDA?',
      'Are NDAs enforceable in all states?',
      'Can I use an NDA with independent contractors?'
    ]
  };

  private stateSpecificQuestions: Record<string, string[]> = {
    'CA': [
      'What are California-specific employment law requirements?',
      'How does California law affect non-compete agreements?',
      'What are California rent control laws?',
      'What is the California Consumer Privacy Act (CCPA)?',
      'How do California meal break laws work?'
    ],
    'TX': [
      'What are Texas business formation requirements?',
      'How does Texas property law work?',
      'What are Texas employment at-will rules?',
      'How do Texas non-compete agreements work?',
      'What are Texas landlord-tenant laws?'
    ],
    'NY': [
      'What are New York employment law requirements?',
      'How do New York rent stabilization laws work?',
      'What is the New York SHIELD Act?',
      'How does New York wage and hour law work?',
      'What are New York business formation requirements?'
    ],
    'FL': [
      'What are Florida business-friendly laws?',
      'How does Florida homestead protection work?',
      'What are Florida employment requirements?',
      'How do Florida sunshine laws affect businesses?',
      'What are Florida landlord-tenant regulations?'
    ]
  };

  private industryQuestions: Record<string, string[]> = {
    'technology': [
      'How do I protect my software intellectual property?',
      'What legal documents do startups need?',
      'How do GDPR and CCPA affect tech companies?',
      'What employment agreements do tech companies need?',
      'How do I handle contractor vs employee classification?'
    ],
    'healthcare': [
      'What legal documents do medical practices need?',
      'How does HIPAA affect my contracts?',
      'What employment agreements do healthcare providers need?',
      'How do I comply with medical licensing requirements?',
      'What insurance requirements apply to healthcare businesses?'
    ],
    'real-estate': [
      'What contracts do real estate agents need?',
      'How do I comply with fair housing laws?',
      'What property management agreements should I use?',
      'How do real estate commissions work legally?',
      'What disclosures are required in real estate?'
    ]
  };

  // Generate comprehensive FAQ pages
  generateAllFAQPages(): FAQPage[] {
    const pages: FAQPage[] = [];

    // General FAQ page
    pages.push(this.generateGeneralFAQPage());

    // Document-specific FAQ pages
    Object.keys(this.baseQuestions).forEach(docType => {
      if (docType !== 'general') {
        pages.push(this.generateDocumentFAQPage(docType));
      }
    });

    // State-specific FAQ pages
    Object.keys(this.stateSpecificQuestions).forEach(state => {
      pages.push(this.generateStateFAQPage(state));
    });

    // Industry-specific FAQ pages
    Object.keys(this.industryQuestions).forEach(industry => {
      pages.push(this.generateIndustryFAQPage(industry));
    });

    // Combined FAQ pages for high-value combinations
    pages.push(...this.generateCombinedFAQPages());

    return pages;
  }

  private generateGeneralFAQPage(): FAQPage {
    const faqs = this.baseQuestions.general.map((question, index) => 
      this.createFAQItem(question, 'general', index)
    );

    return {
      title: 'Legal Documents FAQ - Frequently Asked Questions | 123LegalDoc',
      url: '/faq',
      metaDescription: 'Get answers to frequently asked questions about legal documents, contracts, and forms. Learn about costs, legality, customization, and more.',
      h1: 'Frequently Asked Questions About Legal Documents',
      faqs,
      relatedPages: ['/docs', '/pricing', '/support'],
      structuredData: this.generateFAQStructuredData(faqs)
    };
  }

  private generateDocumentFAQPage(documentType: string): FAQPage {
    const documentName = this.getDocumentName(documentType);
    const questions = this.baseQuestions[documentType] || [];
    
    const faqs = questions.map((question, index) => 
      this.createFAQItem(question, documentType, index)
    );

    return {
      title: `${documentName} FAQ - Common Questions & Answers | 123LegalDoc`,
      url: `/faq/${documentType}`,
      metaDescription: `Get answers to frequently asked questions about ${documentName.toLowerCase()}s. Learn about requirements, costs, customization, and legal implications.`,
      h1: `${documentName} Frequently Asked Questions`,
      faqs,
      relatedPages: [`/docs/${documentType}`, `/docs/${documentType}/start`],
      structuredData: this.generateFAQStructuredData(faqs)
    };
  }

  private generateStateFAQPage(state: string): FAQPage {
    const stateName = this.getStateName(state);
    const questions = this.stateSpecificQuestions[state] || [];
    
    const faqs = questions.map((question, index) => 
      this.createFAQItem(question, `state-${state}`, index)
    );

    return {
      title: `${stateName} Legal Documents FAQ - State Law Questions | 123LegalDoc`,
      url: `/faq/${state.toLowerCase()}`,
      metaDescription: `Answers to ${stateName} legal document questions. Learn about state-specific requirements, laws, and regulations for business contracts and legal forms.`,
      h1: `${stateName} Legal Documents FAQ`,
      faqs,
      relatedPages: [`/${state.toLowerCase()}`, `/docs`],
      structuredData: this.generateFAQStructuredData(faqs)
    };
  }

  private generateIndustryFAQPage(industry: string): FAQPage {
    const industryName = this.getIndustryName(industry);
    const questions = this.industryQuestions[industry] || [];
    
    const faqs = questions.map((question, index) => 
      this.createFAQItem(question, `industry-${industry}`, index)
    );

    return {
      title: `${industryName} Legal Documents FAQ - Industry Questions | 123LegalDoc`,
      url: `/faq/${industry}`,
      metaDescription: `Frequently asked questions about legal documents for ${industryName.toLowerCase()} businesses. Industry-specific requirements, compliance, and best practices.`,
      h1: `${industryName} Legal Documents FAQ`,
      faqs,
      relatedPages: [`/industries/${industry}`, `/docs`],
      structuredData: this.generateFAQStructuredData(faqs)
    };
  }

  private generateCombinedFAQPages(): FAQPage[] {
    const combinedPages: FAQPage[] = [];

    // High-value state + document combinations
    const popularCombinations = [
      { state: 'CA', document: 'employment-contract' },
      { state: 'TX', document: 'llc-operating-agreement' },
      { state: 'NY', document: 'lease-agreement' },
      { state: 'FL', document: 'service-agreement' }
    ];

    popularCombinations.forEach(combo => {
      const stateName = this.getStateName(combo.state);
      const docName = this.getDocumentName(combo.document);
      
      const generalQuestions = this.baseQuestions[combo.document]?.slice(0, 3) || [];
      const stateQuestions = this.stateSpecificQuestions[combo.state]?.slice(0, 3) || [];
      
      const faqs = [
        ...generalQuestions.map((q, i) => this.createFAQItem(q, combo.document, i)),
        ...stateQuestions.map((q, i) => this.createFAQItem(q, `state-${combo.state}`, i + 10))
      ];

      combinedPages.push({
        title: `${docName} FAQ for ${stateName} - State-Specific Questions | 123LegalDoc`,
        url: `/faq/${combo.state.toLowerCase()}/${combo.document}`,
        metaDescription: `${stateName} ${docName.toLowerCase()} frequently asked questions. State-specific legal requirements, costs, and compliance information.`,
        h1: `${docName} FAQ for ${stateName}`,
        faqs,
        relatedPages: [
          `/${combo.state.toLowerCase()}/${combo.document}`,
          `/faq/${combo.state.toLowerCase()}`,
          `/faq/${combo.document}`
        ],
        structuredData: this.generateFAQStructuredData(faqs)
      });
    });

    return combinedPages;
  }

  private createFAQItem(question: string, category: string, index: number): FAQItem {
    return {
      id: `faq_${category}_${index}`,
      question,
      answer: this.generateAnswer(question, category),
      category,
      tags: this.generateTags(question, category),
      searchVolume: this.estimateSearchVolume(question),
      difficulty: this.assessDifficulty(question),
      lastUpdated: new Date().toISOString(),
      seoKeywords: this.extractSEOKeywords(question)
    };
  }

  private generateAnswer(question: string, category: string): string {
    // AI-powered answer generation based on question and category
    const questionLower = question.toLowerCase();

    // Cost-related questions
    if (questionLower.includes('cost') || questionLower.includes('price')) {
      return 'Our legal documents start at $29, which is significantly less than hiring an attorney (typically $500-2000+). The exact cost depends on the document complexity and any additional features you choose. We offer transparent pricing with no hidden fees.';
    }

    // Time-related questions
    if (questionLower.includes('long') || questionLower.includes('time')) {
      return 'Most legal documents can be completed in 10-30 minutes using our guided questionnaire. Simple documents like NDAs typically take 10-15 minutes, while complex agreements like LLC Operating Agreements may take 20-30 minutes. You receive your completed document immediately after finishing.';
    }

    // Legal binding questions
    if (questionLower.includes('legal') || questionLower.includes('binding')) {
      return 'Yes, when properly completed and executed, our documents are legally binding. They are created by experienced attorneys and regularly updated to comply with current laws. However, we recommend consulting with a local attorney for complex situations or if you have specific legal questions.';
    }

    // Customization questions
    if (questionLower.includes('customize') || questionLower.includes('modify')) {
      return 'Absolutely! All our documents can be customized to meet your specific needs. Our platform includes built-in customization options, and you receive editable Word documents that can be further modified. We also provide guidance on common customizations for different situations.';
    }

    // State-specific answers
    if (category.startsWith('state-')) {
      const state = category.replace('state-', '');
      const stateName = this.getStateName(state);
      return `${stateName} has specific legal requirements that our documents address. We include all necessary state-specific clauses, disclosures, and compliance requirements. Our ${stateName} documents are regularly updated to reflect current state law and regulations.`;
    }

    // Industry-specific answers
    if (category.startsWith('industry-')) {
      const industry = category.replace('industry-', '');
      const industryName = this.getIndustryName(industry);
      return `${industryName} businesses have unique legal requirements that our specialized documents address. We include industry-specific clauses, terminology, and compliance requirements. Our ${industryName.toLowerCase()} documents are created by attorneys familiar with industry regulations and best practices.`;
    }

    // Document-specific answers
    if (category === 'employment-contract') {
      if (questionLower.includes('at-will')) {
        return 'At-will employment means either the employer or employee can terminate the employment relationship at any time, for any reason (except illegal reasons), with or without notice. Most US states follow at-will employment, but employment contracts can modify this relationship by specifying terms for termination.';
      }
      if (questionLower.includes('non-compete')) {
        return 'Non-compete clause enforcement varies significantly by state. Some states like California generally prohibit non-compete agreements, while others enforce them if they are reasonable in scope, duration, and geography. Our templates include state-appropriate language and guidance.';
      }
    }

    if (category === 'llc-operating-agreement') {
      if (questionLower.includes('need') && questionLower.includes('operating agreement')) {
        return 'While not required in all states, an LLC operating agreement is highly recommended. It protects your limited liability status, prevents disputes among members, allows you to override default state LLC laws, and provides credibility with banks and investors.';
      }
    }

    // Default answer
    return 'This is an important question about legal documents. Our platform provides comprehensive guidance and support for all document-related questions. For specific legal advice, we recommend consulting with a qualified attorney in your jurisdiction.';
  }

  private generateTags(question: string, category: string): string[] {
    const tags = [category];
    const questionLower = question.toLowerCase();

    if (questionLower.includes('cost') || questionLower.includes('price')) tags.push('pricing');
    if (questionLower.includes('legal') || questionLower.includes('law')) tags.push('legal');
    if (questionLower.includes('state') || questionLower.includes('california') || questionLower.includes('texas')) tags.push('state-law');
    if (questionLower.includes('business')) tags.push('business');
    if (questionLower.includes('employee') || questionLower.includes('employment')) tags.push('employment');
    if (questionLower.includes('contract') || questionLower.includes('agreement')) tags.push('contracts');

    return tags;
  }

  private estimateSearchVolume(question: string): number {
    // Estimate monthly search volume based on question type
    const questionLower = question.toLowerCase();
    
    if (questionLower.includes('cost') || questionLower.includes('price')) return 2400;
    if (questionLower.includes('how to') || questionLower.includes('how do')) return 1800;
    if (questionLower.includes('what is') || questionLower.includes('what are')) return 1200;
    if (questionLower.includes('legal') || questionLower.includes('law')) return 1600;
    if (questionLower.includes('required') || questionLower.includes('need')) return 1000;
    
    return 800; // Default estimate
  }

  private assessDifficulty(question: string): 'easy' | 'medium' | 'hard' {
    const questionLower = question.toLowerCase();
    
    if (questionLower.includes('cost') || questionLower.includes('time') || questionLower.includes('download')) {
      return 'easy';
    }
    
    if (questionLower.includes('legal') || questionLower.includes('compliance') || questionLower.includes('state')) {
      return 'hard';
    }
    
    return 'medium';
  }

  private extractSEOKeywords(question: string): string[] {
    const keywords = [];
    const questionLower = question.toLowerCase();
    
    // Extract main keywords from question
    const words = questionLower.split(' ');
    const importantWords = words.filter(word => 
      word.length > 3 && 
      !['what', 'how', 'does', 'the', 'can', 'are', 'is', 'and', 'or', 'but'].includes(word)
    );
    
    keywords.push(...importantWords);
    
    // Add variations
    if (questionLower.includes('employment')) {
      keywords.push('employment contract', 'employee agreement', 'work contract');
    }
    
    if (questionLower.includes('llc')) {
      keywords.push('llc operating agreement', 'limited liability company', 'business formation');
    }
    
    return keywords.slice(0, 5); // Limit to top 5 keywords
  }

  private generateFAQStructuredData(faqs: FAQItem[]): any {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  }

  private getDocumentName(documentType: string): string {
    const names: Record<string, string> = {
      'employment-contract': 'Employment Contract',
      'llc-operating-agreement': 'LLC Operating Agreement',
      'lease-agreement': 'Lease Agreement',
      'nda': 'Non-Disclosure Agreement',
      'service-agreement': 'Service Agreement'
    };
    return names[documentType] || 'Legal Document';
  }

  private getStateName(stateCode: string): string {
    const names: Record<string, string> = {
      'CA': 'California',
      'TX': 'Texas',
      'NY': 'New York',
      'FL': 'Florida'
    };
    return names[stateCode] || stateCode;
  }

  private getIndustryName(industryCode: string): string {
    const names: Record<string, string> = {
      'technology': 'Technology & Software',
      'healthcare': 'Healthcare & Medical',
      'real-estate': 'Real Estate & Property'
    };
    return names[industryCode] || industryCode;
  }

  // Calculate SEO impact of FAQ system
  calculateSEOImpact(): {
    totalFAQPages: number;
    totalQuestions: number;
    estimatedTraffic: number;
    keywordCoverage: number;
    longTailOpportunities: number;
  } {
    const allPages = this.generateAllFAQPages();
    const totalQuestions = allPages.reduce((sum, page) => sum + page.faqs.length, 0);
    const avgSearchVolume = 1200;
    const estimatedCTR = 0.08; // Higher CTR for FAQ content
    
    return {
      totalFAQPages: allPages.length,
      totalQuestions,
      estimatedTraffic: Math.round(totalQuestions * avgSearchVolume * estimatedCTR),
      keywordCoverage: totalQuestions * 3, // ~3 keywords per question
      longTailOpportunities: totalQuestions * 2 // FAQ content great for long-tail
    };
  }

  // Get FAQ page by URL
  getFAQPage(url: string): FAQPage | undefined {
    const allPages = this.generateAllFAQPages();
    return allPages.find(page => page.url === url);
  }
}

// Export singleton instance
export const faqGenerationSystem = new FAQGenerationSystem();