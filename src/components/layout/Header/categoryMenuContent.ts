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
    title: 'Business',
    subtitle: 'Run, hire, and grow with confidence.',
    sections: [
      {
        id: 'business-operations',
        label: 'Operations & Services',
        documents: [
          'business-contract',
          'service-agreement',
          'consulting-agreement',
          'sales-agreement',
          'purchase-agreement',
          'vendor-agreement',
          'non-disclosure-agreement',
          'letter-of-intent',
          'general-contractor-agreement',
          'subcontractor-agreement',
          'app-development-agreement',
          'website-development-agreement',
          'cloud-services-agreement',
        ],
      },
      {
        id: 'employment-hr',
        label: 'Employment & HR',
        documents: [
          'employment-contract',
          'independent-contractor-agreement',
          'non-compete-agreement',
          'commission-agreement',
          'employee-non-disclosure-agreement',
          'severance-agreement',
          'executive-employment-agreement',
          'internship-agreement',
          'work-from-home-agreement',
          'employment-offer-letter',
          'employment-termination-letter',
          'employee-warning-notice',
        ],
      },
      {
        id: 'partnerships-investors',
        label: 'Partnerships & Investors',
        documents: [
          'partnership-agreement',
          'joint-venture-agreement',
          'limited-partnership-agreement',
          'buy-sell-agreement',
          'investment-agreement',
          'shareholder-agreement',
          'startup-equity-agreement',
          'franchise-agreement',
          'equity-incentive-plan',
        ],
      },
      {
        id: 'formation-compliance',
        label: 'Formation & Compliance',
        documents: [
          'articles-of-incorporation',
          'corporate-bylaws',
          'nonprofit-bylaws',
          'llc-operating-agreement',
          'business-plan',
          'board-resolution',
          'arbitration-agreement',
          'mediation-agreement',
          'settlement-agreement',
        ],
      },
    ],
  },
  'family-personal': {
    title: 'Family',
    subtitle: 'Protect relationships, children, and everyday life.',
    sections: [
      {
        id: 'relationship-planning',
        label: 'Marriage & Relationships',
        documents: [
          'prenuptial-agreement',
          'postnuptial-agreement',
          'cohabitation-agreement',
          'marriage-separation-agreement',
          'separation-agreement',
          'divorce-settlement',
          'divorce-settlement-agreement',
        ],
      },
      {
        id: 'children-guardianship',
        label: 'Children & Guardianship',
        documents: [
          'child-custody-agreement',
          'child-support-agreement',
          'child-care-contract',
          'child-care-authorization-form',
          'child-travel-consent',
          'parenting-plan',
          'adoption-agreement',
          'pet-custody-agreement',
        ],
      },
      {
        id: 'family-health',
        label: 'Health & Care',
        documents: [
          'child-medical-consent',
          'medical-consent-form',
          'hipaa-authorization-form',
          'telemedicine-agreement',
          'elder-care-agreement',
          'personal-care-agreement',
        ],
      },
      {
        id: 'everyday-life',
        label: 'Personal Agreements',
        documents: [
          'donation-agreement',
          'membership-agreement',
          'fitness-waiver',
          'personal-training-agreement',
          'athletic-scholarship-agreement',
          'pet-agreement',
          'dog-breeding-agreement',
          'horse-boarding-agreement',
          'lottery-pool-contract',
        ],
      },
    ],
  },
  'forms-authorizations': {
    title: 'Estate',
    subtitle: 'Plan wills, trusts, and end-of-life care.',
    sections: [
      {
        id: 'wills-trusts',
        label: 'Wills & Trusts',
        documents: [
          'last-will-testament',
          'simple-will',
          'pour-over-will',
          'codicil-to-will',
          'living-trust',
          'joint-living-trust',
          'living-trust-amendment',
          'education-trust',
        ],
      },
      {
        id: 'powers-attorney',
        label: 'Powers of Attorney',
        documents: [
          'durable-power-of-attorney',
          'power-of-attorney',
          'medical-power-of-attorney',
          'healthcare-power-of-attorney',
          'power-of-attorney-for-child',
          'revocation-of-power-of-attorney',
        ],
      },
      {
        id: 'health-directives',
        label: 'Health Directives',
        documents: [
          'advance-directive',
          'living-will',
          'health-care-directive',
          'medical-consent',
        ],
      },
      {
        id: 'legacy-transfers',
        label: 'Legacy & Transfers',
        documents: [
          'property-deed',
          'quitclaim-deed',
          'warranty-deed',
          'real-estate-purchase-agreement',
        ],
      },
    ],
  },
  'letters-notices': {
    title: 'Financial',
    subtitle: 'Manage loans, debt, and authorizations.',
    sections: [
      {
        id: 'loans-credit',
        label: 'Loans & Credit',
        documents: [
          'loan-agreement',
          'personal-loan-agreement',
          'loan-modification-agreement',
          'promissory-note',
          'credit-card-agreement',
        ],
      },
      {
        id: 'debt-resolution',
        label: 'Debt Resolution',
        documents: [
          'debt-settlement-agreement',
          'demand-letter-payment',
          'collection-letter',
          'debt-validation-letter',
        ],
      },
      {
        id: 'banking-authorizations',
        label: 'Banking & Authorizations',
        documents: [
          'ach-authorization-form',
          'direct-deposit-form',
          'insurance-claim-form',
          'security-agreement',
          'earnest-money-agreement',
        ],
      },
      {
        id: 'investor-documents',
        label: 'Investments & Finance',
        documents: [
          'investment-agreement',
          'private-placement-memorandum',
          'retirement-plan-agreement',
        ],
      },
    ],
  },
  'business-commercial': {
    title: 'Real Estate',
    subtitle: 'Lease, manage, buy, and sell property.',
    sections: [
      {
        id: 'residential-leases',
        label: 'Residential Leases',
        documents: [
          'lease-agreement',
          'rental-agreement',
          'residential-lease-agreement',
          'sublease-agreement',
          'rent-increase-letter',
        ],
      },
      {
        id: 'landlord-notices',
        label: 'Landlord Notices',
        documents: [
          'eviction-notice',
          'late-rent-notice',
          'notice-to-pay-rent-or-quit',
          'notice-of-lease-violation',
          'lease-termination-letter',
          'notice-to-enter',
        ],
      },
      {
        id: 'property-transfers',
        label: 'Property Transfers',
        documents: [
          'real-estate-purchase-agreement',
          'property-deed',
          'quitclaim-deed',
          'warranty-deed',
          'mortgage-agreement',
        ],
      },
      {
        id: 'commercial-spaces',
        label: 'Commercial Spaces',
        documents: [
          'commercial-lease-agreement',
          'commercial-lease-with-option-to-purchase',
          'office-space-lease',
          'retail-space-lease',
          'warehouse-lease',
          'property-manager-agreement',
          'triple-net-lease',
        ],
      },
    ],
  },
};

export type CategoryMenuKey = keyof typeof CATEGORY_MENU_CONTENT;
