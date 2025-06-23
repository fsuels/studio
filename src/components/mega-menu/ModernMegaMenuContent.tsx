'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { enhancedSearch } from '@/lib/enhanced-search';
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
        id: 'rent-property',
        title: 'Rent Out Property',
        description: 'Lease agreements, rental forms, and property management documents',
        icon: <Home className="h-5 w-5" />,
        documents: [
          { slug: 'residential-lease-agreement', title: 'Residential Lease Agreement' },
          { slug: 'commercial-lease-agreement', title: 'Commercial Lease Agreement' },
          { slug: 'eviction-notice', title: 'Eviction Notice' },
        ],
        viewAllLink: '/docs?goal=rent-property'
      },
      {
        id: 'plan-estate',
        title: 'Plan My Estate',
        description: 'Wills, trusts, and advance directives for your future',
        icon: <FileText className="h-5 w-5" />,
        documents: [
          { slug: 'last-will-testament', title: 'Last Will & Testament' },
          { slug: 'living-trust', title: 'Living Trust' },
          { slug: 'power-of-attorney', title: 'Power of Attorney' },
        ],
        viewAllLink: '/docs?goal=estate-planning'
      },
      {
        id: 'sell-transfer-property',
        title: 'Sell or Transfer Real Estate',
        description: 'Agreements for buying, selling, or gifting property',
        icon: <ArrowRight className="h-5 w-5" />,
        documents: [
          { slug: 'real-estate-purchase-agreement', title: 'Real Estate Purchase Agreement' },
          { slug: 'property-deed', title: 'Property Deed' },
          { slug: 'quitclaim-deed', title: 'Quitclaim Deed' },
        ],
        viewAllLink: '/docs?goal=real-estate-transfer'
      },
      {
        id: 'get-married',
        title: 'Get Married',
        description: 'Legal agreements for starting your marriage',
        icon: <Users className="h-5 w-5" />,
        documents: [
          { slug: 'prenuptial-agreement', title: 'Prenuptial Agreement' },
          { slug: 'postnuptial-agreement', title: 'Postnuptial Agreement' },
          { slug: 'cohabitation-agreement', title: 'Cohabitation Agreement' },
        ],
        viewAllLink: '/docs?goal=marriage'
      },
      {
        id: 'separate-divorce',
        title: 'Separate or Divorce',
        description: 'Agreements and forms for legal separation or divorce',
        icon: <HeartHandshake className="h-5 w-5" />,
        documents: [
          { slug: 'divorce-settlement-agreement', title: 'Divorce Settlement Agreement' },
          { slug: 'separation-agreement', title: 'Separation Agreement' },
          { slug: 'mediation-agreement', title: 'Mediation Agreement' },
          { slug: 'settlement-agreement', title: 'Settlement Agreement' },
        ],
        viewAllLink: '/docs?goal=separate-divorce'
      },
      {
        id: 'plan-child-care',
        title: 'Plan My Child\'s Care',
        description: 'Custody, support, and care agreements for children',
        icon: <Baby className="h-5 w-5" />,
        documents: [
          { slug: 'child-custody-agreement', title: 'Child Custody Agreement' },
          { slug: 'child-support-agreement', title: 'Child Support Agreement' },
          { slug: 'parenting-plan', title: 'Parenting Plan' },
          { slug: 'child-care-contract', title: 'Child Care Contract' },
        ],
        viewAllLink: '/docs?goal=child-care'
      },
      {
        id: 'manage-tenancy',
        title: 'Manage My Tenancy',
        description: 'Notices and forms for tenants dealing with landlords',
        icon: <Key className="h-5 w-5" />,
        documents: [
          { slug: 'tenant-maintenance-request', title: 'Tenant Maintenance Request' },
          { slug: 'lease-termination-letter', title: 'Lease Termination Letter' },
          { slug: 'late-rent-notice', title: 'Late Rent Notice' },
          { slug: 'complaint-letter', title: 'Complaint Letter' },
        ],
        viewAllLink: '/docs?goal=tenant-documents'
      },
      {
        id: 'prepare-job-application',
        title: 'Prepare a Job Application',
        description: 'Essential documents to help you apply for jobs',
        icon: <UserCheck className="h-5 w-5" />,
        documents: [
          { slug: 'job-application-form', title: 'Job Application Form' },
          { slug: 'employment-verification-letter', title: 'Employment Verification Letter' },
          { slug: 'resignation-letter', title: 'Resignation Letter' },
          { slug: 'twoweeksnoticeletter', title: 'Two Weeks Notice Letter' },
        ],
        viewAllLink: '/docs?goal=job-application'
      },
      {
        id: 'handle-legal-dispute',
        title: 'Handle a Legal Dispute or Issue',
        description: 'Affidavits, demand letters, and dispute resolution documents',
        icon: <Scale className="h-5 w-5" />,
        documents: [
          { slug: 'affidavit-general', title: 'General Affidavit' },
          { slug: 'demand-letter-payment', title: 'Demand Letter for Payment' },
          { slug: 'mediation-agreement', title: 'Mediation Agreement' },
          { slug: 'complaint-letter', title: 'Complaint Letter' },
        ],
        viewAllLink: '/docs?goal=legal-dispute'
      },
      {
        id: 'manage-risk-liability',
        title: 'Manage Risk & Liability',
        description: 'Waivers, releases, and protective forms for personal activities',
        icon: <ShieldCheck className="h-5 w-5" />,
        documents: [
          { slug: 'general-liability-waiver', title: 'General Liability Waiver' },
          { slug: 'release-of-liability', title: 'Release of Liability' },
          { slug: 'fitness-waiver', title: 'Fitness Waiver' },
          { slug: 'hipaa-authorization-form', title: 'HIPAA Authorization Form' },
        ],
        viewAllLink: '/docs?goal=risk-liability'
      },
      {
        id: 'personal-health-care',
        title: 'Personal Health & Care',
        description: 'Documents related to personal medical decisions and care',
        icon: <Stethoscope className="h-5 w-5" />,
        documents: [
          { slug: 'medical-consent-form', title: 'Medical Consent Form' },
          { slug: 'medical-consent', title: 'Medical Consent' },
          { slug: 'elder-care-agreement', title: 'Elder Care Agreement' },
          { slug: 'personal-care-agreement', title: 'Personal Care Agreement' },
        ],
        viewAllLink: '/docs?goal=personal-health'
      },
      {
        id: 'name-changes',
        title: 'Name Changes',
        description: 'Forms to legally notify of a name change',
        icon: <UserX className="h-5 w-5" />,
        documents: [
          { slug: 'name-change-notification-letter', title: 'Name Change Notification Letter' },
        ],
        viewAllLink: '/docs?goal=name-changes'
      },
      {
        id: 'lifestyle-activities',
        title: 'General Lifestyle & Activities',
        description: 'Miscellaneous documents for personal events and activities',
        icon: <Star className="h-5 w-5" />,
        documents: [
          { slug: 'donation-agreement', title: 'Donation Agreement' },
          { slug: 'event-planning-contract', title: 'Event Planning Contract' },
          { slug: 'lottery-pool-contract', title: 'Lottery Pool Contract' },
          { slug: 'membership-agreement', title: 'Membership Agreement' },
          { slug: 'pet-agreement', title: 'Pet Agreement' },
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
        id: 'start-business',
        title: 'Start a Business',
        description: 'Formation documents, operating agreements, and business plans',
        icon: <Sparkles className="h-5 w-5" />,
        documents: [
          { slug: 'articles-of-incorporation', title: 'Articles of Incorporation' },
          { slug: 'llc-operating-agreement', title: 'LLC Operating Agreement' },
          { slug: 'partnership-agreement', title: 'Partnership Agreement' },
          { slug: 'buy-sell-agreement', title: 'Buy-Sell Agreement' },
        ],
        viewAllLink: '/docs?goal=start-business'
      },
      {
        id: 'hire-employees',
        title: 'Hire Employees or Contractors',
        description: 'Employment contracts, NDAs, and hiring documents',
        icon: <Users className="h-5 w-5" />,
        documents: [
          { slug: 'employment-contract', title: 'Employment Contract' },
          { slug: 'independent-contractor-agreement', title: 'Independent Contractor Agreement' },
          { slug: 'employment-offer-letter', title: 'Employment Offer Letter' },
          { slug: 'non-disclosure-agreement', title: 'Non-Disclosure Agreement (NDA)' },
        ],
        viewAllLink: '/docs?goal=hire-employees'
      },
      {
        id: 'protect-business',
        title: 'Protect My Business',
        description: 'NDAs, non-competes, and intellectual property protection',
        icon: <Shield className="h-5 w-5" />,
        documents: [
          { slug: 'non-disclosure-agreement', title: 'Non-Disclosure Agreement (NDA)' },
          { slug: 'non-compete-agreement', title: 'Non-Compete Agreement' },
          { slug: 'copyright-assignment-agreement', title: 'Copyright Assignment Agreement' },
        ],
        viewAllLink: '/docs?goal=protect-business'
      },
      {
        id: 'get-paid',
        title: 'Get Paid or Collect Debts',
        description: 'Invoices, demand letters, and payment agreements',
        icon: <DollarSign className="h-5 w-5" />,
        documents: [
          { slug: 'demand-letter-payment', title: 'Demand Letter for Payment' },
          { slug: 'promissory-note', title: 'Promissory Note' },
          { slug: 'loan-agreement', title: 'Loan Agreement' },
        ],
        viewAllLink: '/docs?goal=get-paid'
      },
      {
        id: 'sell-services',
        title: 'Sell Services',
        description: 'Contracts for providing professional, creative, or specialized services',
        icon: <Handshake className="h-5 w-5" />,
        documents: [
          { slug: 'service-agreement', title: 'Service Agreement' },
          { slug: 'consulting-agreement-meta', title: 'Consulting Agreement' },
          { slug: 'coaching-agreement', title: 'Coaching Agreement' },
          { slug: 'website-development-agreement', title: 'Website Development Agreement' },
        ],
        viewAllLink: '/docs?goal=sell-services'
      },
      {
        id: 'lend-borrow-money',
        title: 'Lend or Borrow Money',
        description: 'Legal documents for personal and business loans and credit',
        icon: <CreditCard className="h-5 w-5" />,
        documents: [
          { slug: 'loan-agreement', title: 'Loan Agreement' },
          { slug: 'promissory-note', title: 'Promissory Note' },
          { slug: 'personal-loan-agreement', title: 'Personal Loan Agreement' },
          { slug: 'credit-card-agreement', title: 'Credit Card Agreement' },
        ],
        viewAllLink: '/docs?goal=lend-borrow-money'
      },
      {
        id: 'buy-sell-rent-goods',
        title: 'Buy, Sell, or Rent Goods',
        description: 'Agreements for purchasing, selling, or renting products and inventory',
        icon: <ShoppingCart className="h-5 w-5" />,
        documents: [
          { slug: 'sales-agreement', title: 'Sales Agreement' },
          { slug: 'vehicle-bill-of-sale', title: 'Vehicle Bill of Sale' },
          { slug: 'boat-bill-of-sale', title: 'Boat Bill of Sale' },
          { slug: 'vehicle-lease-agreement', title: 'Vehicle Lease Agreement' },
        ],
        viewAllLink: '/docs?goal=buy-sell-rent-goods'
      },
      {
        id: 'manage-corporation',
        title: 'Manage My Corporation/Business Governance',
        description: 'Documents for managing corporate structure, board decisions, and shareholder relations',
        icon: <Building className="h-5 w-5" />,
        documents: [
          { slug: 'buy-sell-agreement', title: 'Shareholder Agreement' },
          { slug: 'articles-of-incorporation-biz', title: 'Corporate Bylaws' },
          { slug: 'joint-venture-agreement', title: 'Joint Venture Agreement' },
          { slug: 'partnership-dissolution-agreement', title: 'Partnership Dissolution Agreement' },
        ],
        viewAllLink: '/docs?goal=manage-corporation'
      },
      {
        id: 'create-update-contract',
        title: 'Create or Update a Contract',
        description: 'General agreements, amendments, and termination letters for various business contexts',
        icon: <Edit className="h-5 w-5" />,
        documents: [
          { slug: 'business-contract', title: 'Business Contract' },
          { slug: 'partnership-amendment', title: 'Contract Amendment' },
          { slug: 'termination-letter', title: 'Contract Termination Letter' },
          { slug: 'letter-of-intent', title: 'Memorandum of Understanding (MOU)' },
        ],
        viewAllLink: '/docs?goal=create-update-contract'
      },
      {
        id: 'specialized-industries',
        title: 'Navigate Specialized Industries',
        description: 'Agreements tailored for specific sectors like construction, tech, and entertainment',
        icon: <Settings className="h-5 w-5" />,
        documents: [
          { slug: 'construction-contract', title: 'Construction Contract' },
          { slug: 'app-development-agreement', title: 'App Development Agreement' },
          { slug: 'clinical-trial-agreement', title: 'Clinical Trial Agreement' },
          { slug: 'film-production-agreement', title: 'Film Production Agreement' },
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
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all'>('all');
  const [isClient, setIsClient] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [expandedSection, setExpandedSection] = useState<'personal' | 'business' | null>(null);

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
        return <Search className="h-3 w-3 text-gray-500" />;
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
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  );
                })}
              </div>

              {displayDocs.length === 0 && !isSearching && (
                <div className="text-center py-16 text-gray-500">
                  <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
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

                        <div className="space-y-3 mb-4">
                          {goal.documents.map((doc) => (
                            <Link
                              key={doc.slug}
                              href={`/${locale}/docs/${doc.slug}`}
                              onClick={onLinkClick}
                              className="group/doc flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="h-4 w-4 text-gray-400" />
                                <span className="font-medium text-gray-700 group-hover/doc:text-pink-600 transition-colors">
                                  {doc.title}
                                </span>
                              </div>
                              <ArrowRight className="h-4 w-4 text-gray-400 group-hover/doc:text-pink-600 group-hover/doc:translate-x-1 transition-all" />
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
                              className="group/doc flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="h-4 w-4 text-gray-400" />
                                <span className="font-medium text-gray-700 group-hover/doc:text-blue-600 transition-colors">
                                  {doc.title}
                                </span>
                              </div>
                              <ArrowRight className="h-4 w-4 text-gray-400 group-hover/doc:text-blue-600 group-hover/doc:translate-x-1 transition-all" />
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
    </div>
  );
};

export default ModernMegaMenuContent;