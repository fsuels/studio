// src/components/layout/Header/categoryMenuContent.ts
export interface CategoryMenuSection {
  id: string;
  label: string;
  documents: string[];
}

export interface CategoryMenuContent {
  title: string;
  subtitle?: string;
  sections: CategoryMenuSection[];
}

export const CATEGORY_MENU_CONTENT: Record<string, CategoryMenuContent> = {
  'agreements-contracts': {
    title: 'Agreements & Contracts',
    subtitle: 'Protect your business interests and avoid costly disputes',
    sections: [
      {
        id: 'business-operations',
        label: 'Business Operations',
        documents: ['business-contract', 'service-agreement', 'consulting-agreement', 'sales-agreement', 'purchase-agreement', 'vendor-agreement', 'letter-of-intent', 'non-disclosure-agreement', 'general-contractor-agreement', 'subcontractor-agreement', 'catering-agreement', 'auto-repair-agreement', 'consulting-services-agreement', 'bookkeeping-services-agreement', 'website-development-agreement', 'app-development-agreement', 'cloud-services-agreement', 'cybersecurity-agreement', 'government-contract-agreement']
      },
      {
        id: 'intellectual-property',
        label: 'Intellectual Property & Licensing',
        documents: ['copyright-assignment', 'copyright-license-agreement', 'trademark-assignment', 'trademark-license-agreement', 'patent-assignment', 'patent-license-agreement', 'licensing-agreement', 'software-license-agreement', 'music-licensing-agreement', 'data-processing-agreement', 'digital-asset-agreement', 'content-creation-agreement', 'brand-licensing-agreement', 'franchise-agreement', 'ecommerce-terms-of-service']
      },
      {
        id: 'employment-hr',
        label: 'Employment & HR',
        documents: ['employment-contract', 'independent-contractor-agreement', 'non-compete-agreement', 'commission-agreement', 'employee-non-disclosure-agreement', 'severance-agreement', 'executive-employment-agreement', 'internship-agreement', 'work-from-home-agreement', 'volunteer-agreement', 'employment-offer-letter', 'employment-termination-letter', 'employee-warning-notice', 'resignation-letter', 'employment-verification-letter', 'salary-verification-letter', 'progressive-discipline-policy', 'employee-evaluation-form', 'employee-handbook']
      },
      {
        id: 'partnerships',
        label: 'Partnerships & Investments',
        documents: ['partnership-agreement', 'partnership-amendment', 'partnership-dissolution-agreement', 'joint-venture-agreement', 'limited-partnership-agreement', 'buy-sell-agreement', 'investment-agreement', 'startup-equity-agreement', 'private-placement-memorandum', 'shareholder-agreement', 'franchise-disclosure-agreement', 'equity-incentive-plan', 'retirement-plan-agreement', 'sponsorship-agreement']
      }
    ]
  },
  'letters-notices': {
    title: 'Letters & Notices',
    subtitle: 'Handle disputes professionally and protect your rights',
    sections: [
      {
        id: 'payment-debt',
        label: 'Payment & Debt',
        documents: ['demand-letter-payment', 'collection-letter', 'debt-validation-letter', 'debt-settlement-agreement', 'promissory-note', 'loan-agreement', 'loan-modification-agreement', 'personal-loan-agreement', 'credit-card-agreement']
      },
      {
        id: 'property-tenancy',
        label: 'Property & Tenancy',
        documents: ['eviction-notice', 'late-rent-notice', 'lease-termination-letter', 'notice-to-pay-rent-or-quit', 'notice-to-enter', 'notice-of-lease-violation', 'rent-increase-letter', 'lease-amendment', 'lease-addendum', 'tenant-maintenance-request', 'residential-rental-application']
      },
      {
        id: 'employment-hr-letters',
        label: 'Employment & HR',
        documents: ['employment-verification-letter', 'resignation-letter', 'employee-warning-notice', 'employment-offer-letter', 'employment-termination-letter', 'salary-verification-letter', 'proof-of-income-letter', 'two-weeks-notice-letter', 'leave-of-absence-request-form', 'name-change-notification-letter']
      },
      {
        id: 'legal-business',
        label: 'Legal & Business',
        documents: ['complaint-letter', 'cease-desist-letter', 'breach-contract-notice', 'contract-termination-letter', 'force-majeure-notice', 'membership-cancellation-letter', 'demand-letter', 'termination-letter']
      }
    ]
  },
  'forms-authorizations': {
    title: 'Forms & Authorizations',
    subtitle: 'Ensure compliance and secure your legal standing',
    sections: [
      {
        id: 'legal-affidavits',
        label: 'Legal Affidavits & Court Documents',
        documents: ['affidavit-general', 'affidavit-of-death', 'affidavit-of-heirship', 'affidavit-of-identity', 'immigration-affidavit', 'court-filing-document', 'small-claims-worksheet', 'incident-report', 'accident-report', 'notarization-request']
      },
      {
        id: 'powers-attorney-directives',
        label: 'Powers of Attorney & Health Directives',
        documents: ['durable-power-of-attorney', 'power-of-attorney', 'healthcare-power-of-attorney', 'medical-power-of-attorney', 'power-of-attorney-for-child', 'revocation-of-power-of-attorney', 'advance-directive', 'health-care-directive', 'living-will', 'medical-consent']
      },
      {
        id: 'medical-healthcare',
        label: 'Medical & Healthcare',
        documents: ['child-medical-consent', 'medical-consent-form', 'hipaa-authorization-form', 'covid19-health-screening', 'telemedicine-agreement', 'clinical-trial-agreement', 'elder-care-agreement']
      },
      {
        id: 'financial-authorizations',
        label: 'Financial & Banking',
        documents: ['ach-authorization-form', 'direct-deposit-form', 'insurance-claim-form', 'mortgage-agreement', 'security-agreement', 'earnest-money-agreement']
      },
      {
        id: 'property-transactions',
        label: 'Property & Vehicle Transactions',
        documents: ['vehicle-bill-of-sale', 'bill-of-sale-general', 'boat-bill-of-sale', 'property-deed', 'quitclaim-deed', 'warranty-deed', 'real-estate-purchase-agreement']
      }
    ]
  },
  'family-personal': {
    title: 'Family & Personal Life',
    subtitle: 'Protect your loved ones and secure your legacy',
    sections: [
      {
        id: 'estate-planning',
        label: 'Estate Planning & Wills',
        documents: ['last-will-testament', 'simple-will', 'pour-over-will', 'codicil-to-will', 'living-trust', 'joint-living-trust', 'living-trust-amendment', 'education-trust', 'guardianship-agreement']
      },
      {
        id: 'marriage-relationships',
        label: 'Marriage & Relationships',
        documents: ['prenuptial-agreement', 'postnuptial-agreement', 'cohabitation-agreement', 'marriage-separation-agreement', 'separation-agreement', 'divorce-settlement', 'divorce-settlement-agreement']
      },
      {
        id: 'children-family',
        label: 'Children & Family Care',
        documents: ['child-custody-agreement', 'child-support-agreement', 'child-care-contract', 'child-care-authorization-form', 'child-travel-consent', 'parenting-plan', 'adoption-agreement', 'pet-custody-agreement']
      },
      {
        id: 'personal-recreation',
        label: 'Personal & Recreation',
        documents: ['donation-agreement', 'membership-agreement', 'fitness-waiver', 'personal-training-agreement', 'athletic-scholarship-agreement', 'pet-agreement', 'dog-breeding-agreement', 'horse-boarding-agreement', 'personal-care-agreement', 'lottery-pool-contract']
      }
    ]
  },
  'business-commercial': {
    title: 'Business & Commercial',
    subtitle: 'Scale your business confidently with professional documentation',
    sections: [
      {
        id: 'business-formation',
        label: 'Business Formation & Governance',
        documents: ['articles-of-incorporation', 'articles-of-incorporation-biz', 'corporate-bylaws', 'nonprofit-bylaws', 'llc-operating-agreement', 'business-plan', 'board-resolution', 'consignment-agreement', 'arbitration-agreement', 'mediation-agreement', 'settlement-agreement']
      },
      {
        id: 'commercial-real-estate',
        label: 'Commercial Real Estate',
        documents: ['commercial-lease-agreement', 'commercial-lease-with-option-to-purchase', 'lease-agreement', 'rental-agreement', 'residential-lease-agreement', 'sublease-agreement', 'triple-net-lease', 'office-space-lease', 'retail-space-lease', 'restaurant-lease', 'warehouse-lease', 'storage-space-lease-agreement', 'parking-space-lease-agreement', 'property-manager-agreement']
      },
      {
        id: 'industry-specialized',
        label: 'Industry-Specialized Services',
        documents: ['construction-contract', 'home-improvement-contract', 'catering-agreement', 'restaurant-agreement', 'bar-agreement', 'hotel-agreement', 'auto-repair-agreement', 'automotive-service-agreement', 'vehicle-lease-agreement', 'transportation-service-agreement', 'ride-sharing-agreement', 'food-truck-agreement', 'event-planning-contract', 'tuition-agreement', 'coaching-agreement', 'tutoring-agreement']
      },
      {
        id: 'agriculture-energy',
        label: 'Agriculture, Energy & Natural Resources',
        documents: ['agricultural-agreement', 'farm-lease-agreement', 'crop-sharing-agreement', 'livestock-purchase-agreement', 'timber-sale-agreement', 'water-rights-agreement', 'hunting-lease-agreement', 'mining-agreement', 'mining-lease-agreement', 'oil-gas-lease-agreement', 'solar-energy-agreement', 'environmental-agreement']
      },
      {
        id: 'technology-digital',
        label: 'Technology & Digital Services',
        documents: ['app-development-agreement', 'website-development-agreement', 'cloud-services-agreement', 'data-processing-agreement', 'software-license-agreement', 'cybersecurity-agreement', 'digital-asset-agreement', 'cryptocurrency-agreement', 'ecommerce-terms-of-service', 'international-trade-agreement']
      },
      {
        id: 'entertainment-media',
        label: 'Entertainment & Media',
        documents: ['film-production-agreement', 'recording-artist-agreement', 'talent-agreement', 'talent-management-agreement', 'music-licensing-agreement', 'photography-release', 'influencer-agreement', 'brand-ambassador-agreement', 'affiliate-marketing-agreement', 'social-media-management-agreement', 'gaming-agreement', 'sports-agreement']
      },
      {
        id: 'travel-hospitality',
        label: 'Travel & Hospitality',
        documents: ['vacation-rental-agreement', 'travel-insurance-agreement', 'maritime-charter-agreement', 'aviation-charter-agreement']
      }
    ]
  }
};

export type CategoryMenuKey = keyof typeof CATEGORY_MENU_CONTENT;
