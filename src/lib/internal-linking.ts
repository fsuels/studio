// Internal Linking System for SEO and User Experience
import { documentLibrary, type LegalDocument } from '@/lib/document-library';

export interface InternalLink {
  url: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  context: 'primary' | 'related' | 'complementary';
}

export interface LinkingSuggestion {
  keyword: string;
  documents: LegalDocument[];
  linkText: string;
  priority: 'high' | 'medium' | 'low';
}

/**
 * Document-to-keyword mapping for intelligent linking
 */
const documentKeywords: Record<string, string[]> = {
  'lease-agreement': [
    'lease agreement', 'rental agreement', 'lease contract', 'rent lease',
    'residential lease', 'commercial lease', 'property lease', 'tenant agreement',
    'landlord agreement', 'lease terms', 'lease template', 'renting property'
  ],
  'employment-contract': [
    'employment contract', 'employment agreement', 'job contract', 'work agreement',
    'employee contract', 'employment terms', 'hiring agreement', 'work contract',
    'employment offer', 'job offer letter', 'employment law'
  ],
  'non-disclosure-agreement': [
    'nda', 'non-disclosure agreement', 'confidentiality agreement', 'non disclosure',
    'confidentiality contract', 'secrecy agreement', 'proprietary information',
    'trade secrets', 'confidential information'
  ],
  'llc-operating-agreement': [
    'llc operating agreement', 'llc agreement', 'operating agreement', 'llc contract',
    'limited liability company', 'llc formation', 'business agreement', 'llc documents',
    'company operating agreement', 'business operating agreement'
  ],
  'independent-contractor-agreement': [
    'independent contractor agreement', 'contractor agreement', 'freelancer agreement',
    'consultant agreement', 'contractor contract', 'independent contractor',
    'freelance contract', 'consulting agreement', '1099 contractor'
  ],
  'vehicle-bill-of-sale': [
    'vehicle bill of sale', 'car bill of sale', 'auto bill of sale', 'vehicle sale',
    'car sale agreement', 'automobile bill of sale', 'vehicle transfer', 'car purchase',
    'vehicle purchase agreement', 'auto sale document'
  ],
  'last-will-testament': [
    'will', 'last will and testament', 'will and testament', 'estate planning',
    'last will', 'testament', 'estate document', 'inheritance document',
    'final will', 'legal will', 'will template'
  ],
  'power-of-attorney': [
    'power of attorney', 'poa', 'attorney power', 'legal power', 'proxy agreement',
    'durable power of attorney', 'financial power of attorney', 'medical power of attorney',
    'general power of attorney', 'limited power of attorney'
  ],
  'partnership-agreement': [
    'partnership agreement', 'business partnership', 'partnership contract',
    'partnership document', 'business partner agreement', 'joint venture',
    'partnership terms', 'business partnership contract'
  ],
  'service-agreement': [
    'service agreement', 'service contract', 'services agreement', 'service provider agreement',
    'professional services agreement', 'consulting services', 'service terms',
    'service level agreement', 'sla'
  ]
};

/**
 * Content categories that should link to specific document types
 */
const contentToDocumentMapping: Record<string, string[]> = {
  'real-estate': ['lease-agreement', 'property-deed', 'real-estate-purchase-agreement', 'eviction-notice'],
  'business': ['llc-operating-agreement', 'partnership-agreement', 'service-agreement', 'employment-contract'],
  'employment': ['employment-contract', 'independent-contractor-agreement', 'non-disclosure-agreement', 'non-compete-agreement'],
  'legal-forms': ['power-of-attorney', 'last-will-testament', 'affidavit-general', 'notarization-request'],
  'contracts': ['service-agreement', 'consulting-agreement', 'non-disclosure-agreement', 'licensing-agreement'],
  'estate-planning': ['last-will-testament', 'living-trust', 'power-of-attorney', 'advance-directive'],
  'vehicle': ['vehicle-bill-of-sale', 'vehicle-lease-agreement', 'auto-repair-agreement'],
  'family': ['child-custody-agreement', 'prenuptial-agreement', 'divorce-settlement', 'child-support-agreement']
};

/**
 * Find relevant documents for a given text content
 */
export function findRelevantDocuments(content: string, maxResults: number = 5): LinkingSuggestion[] {
  const suggestions: LinkingSuggestion[] = [];
  const contentLower = content.toLowerCase();
  
  // Check for direct keyword matches
  Object.entries(documentKeywords).forEach(([docId, keywords]) => {
    const document = documentLibrary.find(doc => doc.id === docId);
    if (!document) return;
    
    keywords.forEach(keyword => {
      if (contentLower.includes(keyword.toLowerCase())) {
        const priority = keyword.length > 10 ? 'high' : 
                        keyword.length > 6 ? 'medium' : 'low';
        
        suggestions.push({
          keyword,
          documents: [document],
          linkText: `${document.translations?.en?.name || document.name} Template`,
          priority
        });
      }
    });
  });
  
  // Sort by priority and remove duplicates
  const uniqueSuggestions = suggestions
    .filter((suggestion, index, self) => 
      self.findIndex(s => s.documents[0].id === suggestion.documents[0].id) === index
    )
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    })
    .slice(0, maxResults);
    
  return uniqueSuggestions;
}

/**
 * Generate internal links for blog content based on category
 */
export function generateCategoryLinks(category: string, locale: 'en' | 'es' = 'en'): InternalLink[] {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://123legaldoc.com';
  const docIds = contentToDocumentMapping[category] || [];
  
  return docIds
    .map(docId => {
      const document = documentLibrary.find(doc => doc.id === docId);
      if (!document) return null;
      
      const name = document.translations?.[locale]?.name || document.name;
      const description = document.translations?.[locale]?.description || document.description;
      
      return {
        url: `${baseUrl}/${locale}/docs/${docId}`,
        title: `${name} Template`,
        description: description || `Professional ${name.toLowerCase()} template`,
        priority: 'high' as const,
        context: 'primary' as const
      };
    })
    .filter(Boolean) as InternalLink[];
}

/**
 * Smart link insertion for blog content
 */
export function insertSmartLinks(content: string, locale: 'en' | 'es' = 'en'): string {
  let processedContent = content;
  const suggestions = findRelevantDocuments(content, 10);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://123legaldoc.com';
  
  suggestions.forEach(suggestion => {
    const document = suggestion.documents[0];
    const keyword = suggestion.keyword;
    const linkUrl = `${baseUrl}/${locale}/docs/${document.id}`;
    const linkTitle = document.translations?.[locale]?.name || document.name;
    
    // Create the link HTML
    const linkHtml = `<a href="${linkUrl}" title="${linkTitle} Template" class="internal-doc-link text-blue-600 hover:text-blue-800 underline font-medium">${keyword}</a>`;
    
    // Replace first occurrence of keyword (case-insensitive)
    const regex = new RegExp(`\\b${keyword}\\b(?![^<]*>)`, 'i');
    if (regex.test(processedContent)) {
      processedContent = processedContent.replace(regex, linkHtml);
    }
  });
  
  return processedContent;
}

/**
 * Get related documents for cross-linking
 */
export function getRelatedDocuments(docId: string, maxResults: number = 4): LegalDocument[] {
  const currentDoc = documentLibrary.find(doc => doc.id === docId);
  if (!currentDoc) return [];
  
  // Find documents in same category
  const sameCategory = documentLibrary.filter(doc => 
    doc.id !== docId && 
    doc.category === currentDoc.category
  );
  
  // Find documents with similar keywords
  const currentKeywords = documentKeywords[docId] || [];
  const similar = documentLibrary.filter(doc => {
    if (doc.id === docId) return false;
    const docKeywords = documentKeywords[doc.id] || [];
    return docKeywords.some(keyword => 
      currentKeywords.some(currentKeyword => 
        keyword.includes(currentKeyword) || currentKeyword.includes(keyword)
      )
    );
  });
  
  // Combine and deduplicate
  const related = [...sameCategory, ...similar]
    .filter((doc, index, self) => self.findIndex(d => d.id === doc.id) === index)
    .slice(0, maxResults);
    
  return related;
}

/**
 * Blog post templates with built-in internal linking
 */
export const blogPostTemplates = {
  'how-to-lease-agreement': {
    title: 'How to Draft a Lease Agreement: Complete Guide 2024',
    content: `
# How to Draft a Lease Agreement: Complete Guide 2024

Creating a comprehensive lease agreement is essential for protecting both landlords and tenants. A well-drafted lease agreement establishes clear expectations and helps prevent disputes.

## What is a Lease Agreement?

A lease agreement is a legally binding contract between a landlord and tenant that outlines the terms and conditions of renting a property. Our [lease agreement template](#) provides a professional foundation for your rental relationship.

## Key Components of a Lease Agreement

### 1. Property Details
- Complete property address
- Description of rental unit
- Included amenities and fixtures

### 2. Lease Terms
- Lease duration
- Rent amount and due date
- Security deposit requirements

### 3. Tenant Responsibilities
When drafting employment contracts for property managers, ensure they understand tenant screening processes. Our [employment contract](#) template can help establish clear job expectations.

## State-Specific Requirements

Different states have varying requirements for lease agreements. Consider consulting our state-specific resources:

- **California**: Rent control laws and tenant protection acts
- **Texas**: Property code requirements
- **New York**: Rent stabilization regulations

## Related Documents You May Need

- [Property deed](#) for ownership verification
- [Eviction notice](#) templates for non-compliance situations
- [Real estate purchase agreement](#) for property acquisitions

## Conclusion

A properly drafted lease agreement protects both parties and ensures a smooth rental relationship. Use our professional lease agreement template to get started today.
    `,
    category: 'real-estate',
    keywords: ['lease agreement', 'rental agreement', 'landlord', 'tenant', 'property'],
    relatedDocs: ['lease-agreement', 'eviction-notice', 'property-deed', 'real-estate-purchase-agreement']
  },
  
  'business-formation-guide': {
    title: 'Complete Guide to Business Formation: LLC vs Corporation',
    content: `
# Complete Guide to Business Formation: LLC vs Corporation

Starting a business requires careful consideration of your legal structure. The right choice affects taxes, liability, and operations.

## LLC Formation

A Limited Liability Company offers flexibility and protection. Our [llc operating agreement](#) template helps establish member roles and responsibilities.

### Benefits of LLC Structure
- Limited personal liability
- Tax flexibility
- Operational simplicity
- Fewer compliance requirements

## Employment Considerations

As your business grows, you'll need to hire employees or contractors. Understanding the difference is crucial:

- **Employees**: Use our [employment contract](#) template for full-time staff
- **Contractors**: Our [independent contractor agreement](#) protects both parties

## Protecting Your Business

Every business needs proper documentation:

- [Non-disclosure agreement](#) for confidential information
- [Partnership agreement](#) for business partners
- [Service agreement](#) for client relationships

## Next Steps

Choose the right business structure and protect your interests with proper documentation. Our business formation templates provide the legal foundation you need.
    `,
    category: 'business',
    keywords: ['llc', 'business formation', 'corporation', 'partnership'],
    relatedDocs: ['llc-operating-agreement', 'employment-contract', 'partnership-agreement', 'non-disclosure-agreement']
  }
};

/**
 * Generate a complete blog post with smart internal linking
 */
export function generateBlogPost(templateKey: string, locale: 'en' | 'es' = 'en'): string {
  const template = blogPostTemplates[templateKey as keyof typeof blogPostTemplates];
  if (!template) return '';
  
  let content = template.content;
  
  // Insert smart links based on keywords
  const suggestions = findRelevantDocuments(content);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://123legaldoc.com';
  
  // Replace placeholder links with actual URLs
  suggestions.forEach(suggestion => {
    const document = suggestion.documents[0];
    const linkUrl = `${baseUrl}/${locale}/docs/${document.id}`;
    const placeholderRegex = new RegExp(`\\[([^\\]]*${suggestion.keyword}[^\\]]*)\\]\\(#\\)`, 'gi');
    
    content = content.replace(placeholderRegex, `[$1](${linkUrl})`);
  });
  
  return content;
}