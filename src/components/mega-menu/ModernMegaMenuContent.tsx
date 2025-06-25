'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useDiscoveryModal } from '@/contexts/DiscoveryModalContext';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { enhancedSearch } from '@/lib/enhanced-search';
import { getInternalLinks } from '@/lib/internal-linking';
import { 
  Search, 
  ArrowRight, 
  Briefcase, 
  Users, 
  Home, 
  DollarSign,
  Filter,
  Sparkles,
  Zap,
  Target,
  Heart,
  FileText,
  Shield,
  X,
  ChevronRight,
  HeartHandshake,
  Baby,
  Key,
  UserCheck,
  Scale,
  ShieldCheck,
  Stethoscope,
  UserX,
  Star,
  Handshake,
  CreditCard,
  ShoppingCart,
  Building,
  Edit,
  Settings
} from 'lucide-react';

interface DocumentItem {
  slug: string;
  title: string;
  description?: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  documents: DocumentItem[];
}

// Situation-based "What Do You Want to Accomplish?" structure
interface SituationGoal {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  documents: DocumentItem[];
  viewAllLink: string;
  tabs?: TabSection[];
}

interface TabSection {
  id: string;
  title: string;
  documents: DocumentItem[];
}

interface SituationSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  goals: SituationGoal[];
}

const SITUATION_SECTIONS: SituationSection[] = [
  {
    id: 'personal-life',
    title: 'Your Personal Life',
    icon: <Heart className="h-5 w-5" />,
    goals: [
      {
        id: 'property-management',
        title: 'Property & Real Estate',
        description: 'Complete property lifecycle: lease, manage, and transfer',
        icon: <Home className="h-5 w-5" />,
        documents: [], // Will be populated from active tab
        viewAllLink: '/docs?goal=property-management',
        tabs: [
          {
            id: 'lease',
            title: 'Lease',
            documents: [
              { slug: 'residential-lease-agreement', title: 'Residential Lease Agreement', description: 'outlining terms between landlord and tenant for property rental' },
              { slug: 'commercial-lease-agreement', title: 'Commercial Lease Agreement', description: 'defining rental terms for business properties and office spaces' },
              { slug: 'lease-termination-letter', title: 'Lease Termination Letter', description: 'providing proper notice when ending a rental lease' },
            ]
          },
          {
            id: 'manage',
            title: 'Manage',
            documents: [
              { slug: 'eviction-notice', title: 'Eviction Notice', description: 'officially notifying a tenant of lease violations or termination' },
              { slug: 'tenant-maintenance-request', title: 'Tenant Maintenance Request', description: 'formally requesting property repairs from your landlord' },
              { slug: 'late-rent-notice', title: 'Late Rent Notice', description: 'addressing late payment issues with your landlord' },
            ]
          },
          {
            id: 'transfer',
            title: 'Transfer',
            documents: [
              { slug: 'real-estate-purchase-agreement', title: 'Real Estate Purchase Agreement', description: 'detailing terms and conditions for buying or selling property' },
              { slug: 'property-deed', title: 'Property Deed', description: 'transferring ownership of real estate from seller to buyer' },
              { slug: 'quitclaim-deed', title: 'Quitclaim Deed', description: 'transferring property rights without warranties or guarantees' },
            ]
          }
        ]
      },
      {
        id: 'family-relationships',
        title: 'Family & Relationships',
        description: 'Life event documents from start to end',
        icon: <Heart className="h-5 w-5" />,
        documents: [], // Will be populated from active tab
        viewAllLink: '/docs?goal=family-relationships',
        tabs: [
          {
            id: 'start',
            title: 'Start',
            documents: [
              { slug: 'prenuptial-agreement', title: 'Prenuptial Agreement', description: 'protecting assets and defining financial arrangements before marriage' },
              { slug: 'postnuptial-agreement', title: 'Postnuptial Agreement', description: 'modifying financial arrangements after marriage' },
              { slug: 'cohabitation-agreement', title: 'Cohabitation Agreement', description: 'defining rights and responsibilities for unmarried couples living together' },
              { slug: 'name-change-notification-letter', title: 'Name Change Notification Letter', description: 'notifying organizations and institutions of your legal name change' },
            ]
          },
          {
            id: 'grow',
            title: 'Grow',
            documents: [
              { slug: 'child-custody-agreement', title: 'Child Custody Agreement', description: 'establishing custody arrangements and parenting responsibilities' },
              { slug: 'child-support-agreement', title: 'Child Support Agreement', description: 'defining financial support obligations for children' },
              { slug: 'parenting-plan', title: 'Parenting Plan', description: 'outlining detailed custody schedules and decision-making authority' },
              { slug: 'child-care-contract', title: 'Child Care Contract', description: 'hiring professional childcare services with clear terms' },
            ]
          },
          {
            id: 'end',
            title: 'End',
            documents: [
              { slug: 'divorce-settlement-agreement', title: 'Divorce Settlement Agreement', description: 'finalizing property division and support arrangements in divorce' },
              { slug: 'separation-agreement', title: 'Separation Agreement', description: 'defining terms for couples who choose to live apart' },
              { slug: 'mediation-agreement', title: 'Mediation Agreement', description: 'resolving disputes through alternative dispute resolution' },
              { slug: 'settlement-agreement', title: 'Settlement Agreement', description: 'resolving legal disputes without going to court' },
            ]
          }
        ]
      },
      {
        id: 'estate-health',
        title: 'Estate & Health Planning',
        description: 'Wills, trusts, and medical directives for your future',
        icon: <FileText className="h-5 w-5" />,
        documents: [], // Will be populated from active tab
        viewAllLink: '/docs?goal=estate-health',
        tabs: [
          {
            id: 'wills-trusts',
            title: 'Wills & Trusts',
            documents: [
              { slug: 'last-will-testament', title: 'Last Will & Testament', description: 'stating your final wishes for asset distribution after death' },
              { slug: 'living-trust', title: 'Living Trust', description: 'managing and transferring assets while avoiding probate' },
              { slug: 'power-of-attorney', title: 'Power of Attorney', description: 'granting someone authority to act on your behalf legally' },
            ]
          },
          {
            id: 'medical-powers',
            title: 'Medical & Powers',
            documents: [
              { slug: 'medical-consent-form', title: 'Medical Consent Form', description: 'authorizing medical treatment and healthcare decisions' },
              { slug: 'medical-consent', title: 'Medical Consent', description: 'granting permission for specific medical procedures' },
              { slug: 'elder-care-agreement', title: 'Elder Care Agreement', description: 'arranging care services for elderly family members' },
              { slug: 'hipaa-authorization-form', title: 'HIPAA Authorization Form', description: 'authorizing disclosure of protected health information' },
            ]
          }
        ]
      },
      {
        id: 'legal-support',
        title: 'Legal Support & Services',
        description: 'Professional legal assistance and document authentication',
        icon: <Scale className="h-5 w-5" />,
        documents: [], // Will be populated from active tab
        viewAllLink: '/docs?goal=legal-support',
        tabs: [
          {
            id: 'advice-inquiry',
            title: 'Advice & Inquiry',
            documents: [
              { slug: 'affidavit-general', title: 'General Affidavit', description: 'making sworn statements of fact for legal proceedings' },
              { slug: 'complaint-letter', title: 'Complaint Letter', description: 'formally documenting issues or concerns with a service' },
              { slug: 'demand-letter-payment', title: 'Demand Letter for Payment', description: 'formally requesting payment of outstanding debts' },
            ]
          },
          {
            id: 'authentication',
            title: 'Authentication',
            documents: [
              { slug: 'notarization-request', title: 'Notarization Request', description: 'requesting official notarization of important documents' },
              { slug: 'affidavit-of-identity', title: 'Affidavit of Identity', description: 'sworn statement confirming your identity for legal purposes' },
            ]
          }
        ]
      },
      {
        id: 'employment-career',
        title: 'Employment & Career',
        description: 'Job applications, employment verification, and career transitions',
        icon: <UserCheck className="h-5 w-5" />,
        documents: [
          { slug: 'job-application-form', title: 'Job Application Form', description: 'applying for employment positions with standardized information' },
          { slug: 'employment-verification-letter', title: 'Employment Verification Letter', description: 'confirming employment status and details for various purposes' },
          { slug: 'resignation-letter', title: 'Resignation Letter', description: 'formally notifying your employer of your intent to quit' },
          { slug: 'twoweeksnoticeletter', title: 'Two Weeks Notice Letter', description: 'providing standard notice period when leaving employment' },
        ],
        viewAllLink: '/docs?goal=employment-career'
      },
      {
        id: 'risk-protection',
        title: 'Risk Protection & Liability',
        description: 'Waivers, releases, and protective forms for personal activities',
        icon: <ShieldCheck className="h-5 w-5" />,
        documents: [
          { slug: 'general-liability-waiver', title: 'General Liability Waiver', description: 'protecting against claims from activities or events' },
          { slug: 'release-of-liability', title: 'Release of Liability', description: 'waiving legal claims for potential injuries or damages' },
          { slug: 'fitness-waiver', title: 'Fitness Waiver', description: 'protecting gyms and trainers from injury-related claims' },
          { slug: 'personal-care-agreement', title: 'Personal Care Agreement', description: 'hiring personal care assistants with defined responsibilities' },
        ],
        viewAllLink: '/docs?goal=risk-protection'
      },
      {
        id: 'lifestyle-activities',
        title: 'Lifestyle & Personal Activities',
        description: 'Miscellaneous documents for personal events and activities',
        icon: <Star className="h-5 w-5" />,
        documents: [
          { slug: 'donation-agreement', title: 'Donation Agreement', description: 'formalizing charitable contributions with tax benefits' },
          { slug: 'event-planning-contract', title: 'Event Planning Contract', description: 'hiring event planners with detailed service expectations' },
          { slug: 'lottery-pool-contract', title: 'Lottery Pool Contract', description: 'organizing group lottery participation with fair terms' },
          { slug: 'membership-agreement', title: 'Membership Agreement', description: 'joining clubs or organizations with defined rights and obligations' },
          { slug: 'pet-agreement', title: 'Pet Agreement', description: 'establishing pet ownership terms and care responsibilities' },
        ],
        viewAllLink: '/docs?goal=lifestyle-activities'
      }
    ]
  },
  {
    id: 'business-finances',
    title: 'Your Business & Finances',
    icon: <Briefcase className="h-5 w-5" />,
    goals: [
      {
        id: 'business-setup',
        title: 'Business Setup & Management',
        description: 'Complete business lifecycle from formation to governance',
        icon: <Sparkles className="h-5 w-5" />,
        documents: [], // Will be populated from active tab
        viewAllLink: '/docs?goal=business-setup',
        tabs: [
          {
            id: 'launch',
            title: 'Launch',
            documents: [
              { slug: 'articles-of-incorporation', title: 'Articles of Incorporation', description: 'formally establishing a corporation with the state government' },
              { slug: 'llc-operating-agreement', title: 'LLC Operating Agreement', description: 'defining ownership and management structure for your LLC' },
              { slug: 'partnership-agreement', title: 'Partnership Agreement', description: 'establishing terms for business partnerships and profit sharing' },
            ]
          },
          {
            id: 'govern',
            title: 'Govern',
            documents: [
              { slug: 'buy-sell-agreement', title: 'Shareholder Agreement', description: 'governing shareholder rights and business decision-making' },
              { slug: 'articles-of-incorporation-biz', title: 'Corporate Bylaws', description: 'establishing internal rules and procedures for your corporation' },
              { slug: 'joint-venture-agreement', title: 'Joint Venture Agreement', description: 'partnering with other businesses for specific projects' },
              { slug: 'partnership-dissolution-agreement', title: 'Partnership Dissolution Agreement', description: 'formally ending business partnerships with asset division' },
            ]
          }
        ]
      },
      {
        id: 'hire-employees',
        title: 'Hire Employees & Contractors',
        description: 'Employment contracts, NDAs, and hiring documents',
        icon: <Users className="h-5 w-5" />,
        documents: [
          { slug: 'employment-contract', title: 'Employment Contract', description: 'defining terms of employment between employer and employee' },
          { slug: 'independent-contractor-agreement', title: 'Independent Contractor Agreement', description: 'hiring freelancers and contractors with clear scope and payment' },
          { slug: 'employment-offer-letter', title: 'Employment Offer Letter', description: 'formally offering employment with salary and benefit details' },
          { slug: 'non-disclosure-agreement', title: 'Non-Disclosure Agreement (NDA)', description: 'protecting confidential business information shared with others' },
        ],
        viewAllLink: '/docs?goal=hire-employees'
      },
      {
        id: 'protect-business',
        title: 'Business Protection & IP',
        description: 'NDAs, non-competes, and intellectual property protection',
        icon: <Shield className="h-5 w-5" />,
        documents: [
          { slug: 'non-disclosure-agreement', title: 'Non-Disclosure Agreement (NDA)', description: 'protecting confidential business information shared with others' },
          { slug: 'non-compete-agreement', title: 'Non-Compete Agreement', description: 'preventing employees from competing after leaving your business' },
          { slug: 'copyright-assignment-agreement', title: 'Copyright Assignment Agreement', description: 'transferring ownership of creative works and intellectual property' },
        ],
        viewAllLink: '/docs?goal=protect-business'
      },
      {
        id: 'commerce-payments',
        title: 'Commerce & Payments',
        description: 'Service contracts and payment collection documents',
        icon: <Handshake className="h-5 w-5" />,
        documents: [], // Will be populated from active tab
        viewAllLink: '/docs?goal=commerce-payments',
        tabs: [
          {
            id: 'provide-services',
            title: 'Provide Services',
            documents: [
              { slug: 'service-agreement', title: 'Service Agreement', description: 'defining scope and terms for professional services provided' },
              { slug: 'consulting-agreement-meta', title: 'Consulting Agreement', description: 'hiring consultants with clear deliverables and compensation' },
              { slug: 'coaching-agreement', title: 'Coaching Agreement', description: 'establishing coaching relationships with goals and expectations' },
              { slug: 'website-development-agreement', title: 'Website Development Agreement', description: 'contracting web developers with project specifications and timeline' },
            ]
          },
          {
            id: 'handle-payments',
            title: 'Handle Payments',
            documents: [
              { slug: 'demand-letter-payment', title: 'Demand Letter for Payment', description: 'formally requesting payment of outstanding debts' },
              { slug: 'promissory-note', title: 'Promissory Note', description: 'documenting a promise to repay debt with specific terms' },
              { slug: 'invoice', title: 'Invoice', description: 'billing clients for services or products provided' },
            ]
          }
        ]
      },
      {
        id: 'finance-transactions',
        title: 'Finance & Transactions',
        description: 'Loans, credit, and trading agreements',
        icon: <DollarSign className="h-5 w-5" />,
        documents: [], // Will be populated from active tab
        viewAllLink: '/docs?goal=finance-transactions',
        tabs: [
          {
            id: 'loans-credit',
            title: 'Loans & Credit',
            documents: [
              { slug: 'loan-agreement', title: 'Loan Agreement', description: 'formalizing business loan terms and repayment schedules' },
              { slug: 'personal-loan-agreement', title: 'Personal Loan Agreement', description: 'lending money to individuals with clear repayment terms' },
              { slug: 'credit-card-agreement', title: 'Credit Card Agreement', description: 'establishing credit terms and payment obligations' },
            ]
          },
          {
            id: 'trade-lease',
            title: 'Trade & Lease',
            documents: [
              { slug: 'sales-agreement', title: 'Sales Agreement', description: 'formalizing the sale of products or goods with terms' },
              { slug: 'vehicle-bill-of-sale', title: 'Vehicle Bill of Sale', description: 'transferring ownership of vehicles with legal documentation' },
              { slug: 'boat-bill-of-sale', title: 'Boat Bill of Sale', description: 'documenting watercraft sales with proper ownership transfer' },
              { slug: 'vehicle-lease-agreement', title: 'Vehicle Lease Agreement', description: 'renting vehicles with terms and monthly payment details' },
            ]
          }
        ]
      },
      {
        id: 'create-update-contract',
        title: 'Create or Update a Contract',
        description: 'General agreements, amendments, and termination letters for various business contexts',
        icon: <Edit className="h-5 w-5" />,
        documents: [
          { slug: 'business-contract', title: 'Business Contract', description: 'creating custom agreements for various business transactions' },
          { slug: 'partnership-amendment', title: 'Contract Amendment', description: 'modifying existing contracts with new terms or conditions' },
          { slug: 'termination-letter', title: 'Contract Termination Letter', description: 'formally ending contracts and business relationships' },
          { slug: 'letter-of-intent', title: 'Memorandum of Understanding (MOU)', description: 'outlining preliminary agreements before formal contracts' },
        ],
        viewAllLink: '/docs?goal=create-update-contract'
      },
      {
        id: 'specialized-industries',
        title: 'Navigate Specialized Industries',
        description: 'Agreements tailored for specific sectors like construction, tech, and entertainment',
        icon: <Settings className="h-5 w-5" />,
        documents: [
          { slug: 'construction-contract', title: 'Construction Contract', description: 'managing building projects with contractors and timelines' },
          { slug: 'app-development-agreement', title: 'App Development Agreement', description: 'contracting software developers for mobile applications' },
          { slug: 'clinical-trial-agreement', title: 'Clinical Trial Agreement', description: 'conducting medical research with participant protections' },
          { slug: 'film-production-agreement', title: 'Film Production Agreement', description: 'producing movies or videos with crew and talent contracts' },
        ],
        viewAllLink: '/docs?goal=specialized-industries'
      }
    ]
  }
];


interface ModernMegaMenuContentProps {
  locale: 'en' | 'es';
  onLinkClick?: () => void;
}

const ModernMegaMenuContent: React.FC<ModernMegaMenuContentProps> = ({ locale, onLinkClick }) => {
  const { t } = useTranslation('common');
  const { setShowDiscoveryModal } = useDiscoveryModal();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all'>('all');
  const [isClient, setIsClient] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [expandedSection, setExpandedSection] = useState<'personal' | 'business' | null>(null);
  const [hoveredDoc, setHoveredDoc] = useState<string | null>(null);
  const [activeTabs, setActiveTabs] = useState<Record<string, string>>({});

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Enhanced search with debouncing
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await enhancedSearch(query, locale, {
        maxResults: 8,
        includePopular: activeFilter === 'popular',
      });
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [locale, activeFilter]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, performSearch]);

  // Prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="w-full p-8 bg-white">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getFilteredDocs = () => {
    return SITUATION_SECTIONS.flatMap(section => 
      section.goals.flatMap(goal => goal.documents)
    );
  };

  // Use enhanced search results when searching, otherwise use filtered docs
  const displayDocs = searchQuery.trim() 
    ? searchResults
    : getFilteredDocs();

  // Helper function to get match type icon
  const getMatchTypeIcon = (matchType: string) => {
    switch (matchType) {
      case 'exact':
        return <Target className="h-3 w-3 text-green-600" />;
      case 'synonym':
        return <Zap className="h-3 w-3 text-blue-600" />;
      case 'category':
        return <Filter className="h-3 w-3 text-purple-600" />;
      default:
        return <Search className="h-3 w-3 text-gray-700 dark:text-gray-300" />;
    }
  };

  const personalSection = SITUATION_SECTIONS.find(s => s.id === 'personal-life');
  const businessSection = SITUATION_SECTIONS.find(s => s.id === 'business-finances');

  const handleSectionClick = (sectionId: 'personal' | 'business') => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const handleClose = () => {
    if (onLinkClick) onLinkClick();
  };

  const getActiveTabDocuments = (goal: SituationGoal) => {
    if (!goal.tabs) return goal.documents;
    
    const activeTabId = activeTabs[goal.id] || goal.tabs[0]?.id;
    const activeTab = goal.tabs.find(tab => tab.id === activeTabId);
    return activeTab?.documents || goal.documents;
  };

  const setActiveTab = (goalId: string, tabId: string) => {
    setActiveTabs(prev => ({ ...prev, [goalId]: tabId }));
  };

  return (
    <div 
      className="fixed inset-0 bg-white z-[9999] overflow-hidden flex flex-col animate-in fade-in duration-300"
      role="menu" 
      aria-label="Legal Document Categories"
      style={{ zIndex: 9999 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Legal Documents</h1>
            <p className="text-gray-600">What do you want to accomplish?</p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Close menu"
        >
          <X className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-6 border-b border-gray-100">
        <div className="max-w-2xl mx-auto relative">
          <Search className={cn(
            "absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors",
            isSearching ? "text-blue-500 animate-pulse" : "text-gray-400"
          )} />
          <input
            type="text"
            placeholder="Search documents (try 'rental', 'nda', 'llc', etc.)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Search documents with smart suggestions"
          />
          {isSearching && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {searchQuery ? (
          /* Search Results */
          <div className="h-full overflow-y-auto p-6">
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Search Results for "{searchQuery}"
                </h2>
                <p className="text-gray-600">
                  {displayDocs.length} document{displayDocs.length !== 1 ? 's' : ''} found
                  {searchQuery && !isSearching && displayDocs.length > 0 && (
                    <span className="ml-2 text-blue-600">• Smart matching enabled</span>
                  )}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayDocs.slice(0, 12).map((doc) => {
                  const isSearchResult = searchQuery.trim() && doc.matchType;
                  return (
                    <Link
                      key={doc.slug}
                      href={`/${locale}/docs/${doc.slug}`}
                      onClick={onLinkClick}
                      className="group p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 bg-white"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                          {isSearchResult ? getMatchTypeIcon(doc.matchType) : <FileText className="h-5 w-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                            {doc.title}
                          </h3>
                          {isSearchResult && doc.matchType && (
                            <Badge 
                              variant="secondary" 
                              className={cn(
                                "text-xs",
                                doc.matchType === 'exact' ? 'bg-green-100 text-green-700' :
                                doc.matchType === 'synonym' ? 'bg-blue-100 text-blue-700' :
                                doc.matchType === 'category' ? 'bg-purple-100 text-purple-700' :
                                'bg-gray-100 text-gray-700'
                              )}
                            >
                              {doc.matchType === 'exact' ? 'Exact Match' :
                               doc.matchType === 'synonym' ? 'Synonym' :
                               doc.matchType === 'category' ? 'Category' : 'Match'}
                            </Badge>
                          )}
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  );
                })}
              </div>

              {displayDocs.length === 0 && !isSearching && (
                <div className="text-center py-16 text-gray-700 dark:text-gray-300">
                  <Search className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                  <p>Try a different search term or browse by category below.</p>
                </div>
              )}

              {isSearching && (
                <div className="text-center py-16">
                  <div className="inline-flex items-center gap-3 text-blue-600">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                    <span className="text-lg">Searching with smart matching...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Two-Column Layout */
          <div className="h-full flex">
            {/* Personal Life Column */}
            <div className={cn(
              "transition-all duration-500 ease-in-out border-r border-gray-200",
              expandedSection === 'business' ? 'w-0 opacity-0 overflow-hidden' :
              expandedSection === 'personal' ? 'w-full' : 'w-1/2'
            )}>
              <div className="h-full overflow-y-auto">
                <button
                  onClick={() => handleSectionClick('personal')}
                  className="w-full p-8 text-left hover:bg-gray-50 transition-colors border-b border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-pink-100 text-pink-600">
                        <Heart className="h-8 w-8" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900">{personalSection?.title}</h2>
                        <p className="text-gray-600 mt-1">Personal, family & estate documents</p>
                      </div>
                    </div>
                    <ChevronRight className={cn(
                      "h-6 w-6 text-gray-400 transition-transform duration-300",
                      expandedSection === 'personal' && "rotate-90"
                    )} />
                  </div>
                </button>

                {/* Personal Life Goals */}
                {(expandedSection === 'personal' || expandedSection === null) && (
                  <div className={cn(
                    "p-8 space-y-6",
                    expandedSection === 'personal' ? "grid grid-cols-2 gap-8 space-y-0" : ""
                  )}>
                    {personalSection?.goals.map((goal) => (
                      <div
                        key={goal.id}
                        className="group p-6 border border-gray-200 rounded-2xl hover:border-pink-300 hover:shadow-lg transition-all duration-200 bg-white"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="p-3 rounded-xl bg-gray-100 text-gray-600 group-hover:bg-pink-100 group-hover:text-pink-600 transition-colors">
                            {goal.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-pink-600 transition-colors mb-2">
                              {goal.title}
                            </h3>
                            <p className="text-gray-600 mb-4">
                              {goal.description}
                            </p>
                          </div>
                        </div>

                        {goal.tabs && (
                          <div className="mb-4">
                            <div className="flex gap-1 p-1 bg-gray-100 rounded-lg mb-4">
                              {goal.tabs.map((tab) => {
                                const isActive = (activeTabs[goal.id] || goal.tabs![0]?.id) === tab.id;
                                return (
                                  <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(goal.id, tab.id)}
                                    className={cn(
                                      "px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
                                      isActive 
                                        ? "bg-white text-pink-600 shadow-sm" 
                                        : "text-gray-600 hover:text-gray-900"
                                    )}
                                  >
                                    {tab.title}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <div className="space-y-3 mb-4">
                          {getActiveTabDocuments(goal).map((doc) => (
                            <Link
                              key={doc.slug}
                              href={`/${locale}/docs/${doc.slug}`}
                              onClick={onLinkClick}
                              className={cn(
                                "group/doc block rounded-lg hover:bg-gray-50 hover:border-pink-200 border border-transparent transition-all duration-200",
                                hoveredDoc === doc.slug && doc.description ? "p-3 pb-4" : "p-3"
                              )}
                              onMouseEnter={() => {
                                if (doc.description) {
                                  setTimeout(() => setHoveredDoc(doc.slug), 100);
                                }
                              }}
                              onMouseLeave={() => setHoveredDoc(null)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                  <FileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-gray-700 group-hover/doc:text-pink-600 transition-colors pb-0.5">
                                      {doc.title}
                                    </div>
                                    {hoveredDoc === doc.slug && doc.description && (
                                      <div className="animate-in slide-in-from-top-1 duration-200">
                                        <div className="text-xs text-gray-500 font-light pl-3 mt-1.5 leading-relaxed">
                                          <span className="font-medium text-gray-600">Use for:</span> {doc.description}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="relative flex items-center self-start mt-0.5 ml-2">
                                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover/doc:text-pink-600 group-hover/doc:opacity-0 transition-all duration-300" />
                                  <span className="absolute right-0 text-sm font-medium text-pink-600 opacity-0 group-hover/doc:opacity-100 transition-all duration-300 whitespace-nowrap">
                                    Start For Free
                                  </span>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>

                        <Link
                          href={`${goal.viewAllLink}`}
                          onClick={onLinkClick}
                          className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium transition-colors"
                        >
                          View All {goal.title} Documents
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Business & Finance Column */}
            <div className={cn(
              "transition-all duration-500 ease-in-out",
              expandedSection === 'personal' ? 'w-0 opacity-0 overflow-hidden' :
              expandedSection === 'business' ? 'w-full' : 'w-1/2'
            )}>
              <div className="h-full overflow-y-auto">
                <button
                  onClick={() => handleSectionClick('business')}
                  className="w-full p-8 text-left hover:bg-gray-50 transition-colors border-b border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                        <Briefcase className="h-8 w-8" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900">{businessSection?.title}</h2>
                        <p className="text-gray-600 mt-1">Business formation, employment & finance</p>
                      </div>
                    </div>
                    <ChevronRight className={cn(
                      "h-6 w-6 text-gray-400 transition-transform duration-300",
                      expandedSection === 'business' && "rotate-90"
                    )} />
                  </div>
                </button>

                {/* Business Goals */}
                {(expandedSection === 'business' || expandedSection === null) && (
                  <div className={cn(
                    "p-8 space-y-6",
                    expandedSection === 'business' ? "grid grid-cols-2 gap-8 space-y-0" : ""
                  )}>
                    {businessSection?.goals.map((goal) => (
                      <div
                        key={goal.id}
                        className="group p-6 border border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all duration-200 bg-white"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="p-3 rounded-xl bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                            {goal.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                              {goal.title}
                            </h3>
                            <p className="text-gray-600 mb-4">
                              {goal.description}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3 mb-4">
                          {goal.documents.map((doc) => (
                            <Link
                              key={doc.slug}
                              href={`/${locale}/docs/${doc.slug}`}
                              onClick={onLinkClick}
                              className={cn(
                                "group/doc block rounded-lg hover:bg-gray-50 hover:border-blue-200 border border-transparent transition-all duration-200",
                                hoveredDoc === doc.slug && doc.description ? "p-3 pb-4" : "p-3"
                              )}
                              onMouseEnter={() => {
                                if (doc.description) {
                                  setTimeout(() => setHoveredDoc(doc.slug), 100);
                                }
                              }}
                              onMouseLeave={() => setHoveredDoc(null)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                  <FileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-gray-700 group-hover/doc:text-blue-600 transition-colors pb-0.5">
                                      {doc.title}
                                    </div>
                                    {hoveredDoc === doc.slug && doc.description && (
                                      <div className="animate-in slide-in-from-top-1 duration-200">
                                        <div className="text-xs text-gray-500 font-light pl-3 mt-1.5 leading-relaxed">
                                          <span className="font-medium text-gray-600">Use for:</span> {doc.description}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="relative flex items-center self-start mt-0.5 ml-2">
                                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover/doc:text-blue-600 group-hover/doc:opacity-0 transition-all duration-300" />
                                  <span className="absolute right-0 text-sm font-medium text-blue-600 opacity-0 group-hover/doc:opacity-100 transition-all duration-300 whitespace-nowrap">
                                    Start For Free
                                  </span>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>

                        <Link
                          href={`${goal.viewAllLink}`}
                          onClick={onLinkClick}
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                          View All {goal.title} Documents
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Links Footer */}
      <div className="border-t border-gray-200 p-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Popular Documents</h3>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/${locale}/docs/non-disclosure-agreement`}
                  onClick={onLinkClick}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  <FileText className="h-4 w-4 text-gray-500" />
                  Non-Disclosure Agreement
                </Link>
                <Link
                  href={`/${locale}/docs/lease-agreement`}
                  onClick={onLinkClick}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  <Home className="h-4 w-4 text-gray-500" />
                  Lease Agreement
                </Link>
                <Link
                  href={`/${locale}/docs/employment-contract`}
                  onClick={onLinkClick}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  <Users className="h-4 w-4 text-gray-500" />
                  Employment Contract
                </Link>
                <Link
                  href={`/${locale}/docs/llc-operating-agreement`}
                  onClick={onLinkClick}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  <Building className="h-4 w-4 text-gray-500" />
                  LLC Operating Agreement
                </Link>
                <Link
                  href={`/${locale}/docs/last-will-testament`}
                  onClick={onLinkClick}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  <FileText className="h-4 w-4 text-gray-500" />
                  Last Will & Testament
                </Link>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Can't find what you need?</p>
              <button
                onClick={() => {
                  setShowDiscoveryModal(true);
                  onLinkClick?.();
                }}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Browse All Templates →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernMegaMenuContent;