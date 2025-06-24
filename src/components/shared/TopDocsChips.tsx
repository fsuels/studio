// src/components/TopDocsChips.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { useTranslation } from 'react-i18next';
import { useParams, useRouter } from 'next/navigation';
import {
  Loader2,
  FileText,
  Folder,
  Home,
  Users,
  Clock,
  Zap,
  RefreshCcw,
  type LucideIcon,
} from 'lucide-react';
import { documentLibrary, type LegalDocument } from '@/lib/document-library';
import { useIsMobile } from '@/hooks/use-mobile';

import { taxonomy } from '@/config/taxonomy';

const TopDocsChips = React.memo(function TopDocsChips() {
  // Use 'common' namespace for shared UI text
  const { t: tCommon } = useTranslation('common');
  const params = (useParams<{ locale?: string }>() ?? {}) as {
    locale?: string;
  };
  const router = useRouter();
  const locale = (params.locale as 'en' | 'es') || 'en';

  const [topDocs, setTopDocs] = useState<LegalDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('real-estate-property');
  const badges: Record<string, 'new' | 'updated'> = {
    powerOfAttorney: 'new',
    leaseAgreement: 'updated',
  };
  
  // Get all categories from taxonomy
  const allCategories = Object.keys(taxonomy.categories);
  
  // Category translation keys and icons - using all your categories
  const categoryMeta: Record<string, { labelKey: string; icon: LucideIcon }> = {
    'real-estate-property': { labelKey: 'categories.realEstateProperty', icon: Home },
    'employment-hr': { labelKey: 'categories.employmentHr', icon: Users },
    'personal-family': { labelKey: 'categories.personalFamily', icon: Users },
    'health-care': { labelKey: 'categories.healthCare', icon: Users },
    'finance-lending': { labelKey: 'categories.financeLending', icon: Folder },
    'business-startups': { labelKey: 'categories.businessStartups', icon: Folder },
    'ip-creative': { labelKey: 'categories.ipCreative', icon: FileText },
    'legal-process-disputes': { labelKey: 'categories.legalProcessDisputes', icon: FileText },
    'estate-planning': { labelKey: 'categories.estatePlanning', icon: FileText },
    'construction-trades': { labelKey: 'categories.constructionTrades', icon: FileText },
    'technology-digital': { labelKey: 'categories.technologyDigital', icon: FileText },
    'agriculture-energy': { labelKey: 'categories.agricultureEnergy', icon: FileText },
    'vehicles-equipment': { labelKey: 'categories.vehiclesEquipment', icon: FileText },
    'general-forms': { labelKey: 'categories.generalForms', icon: FileText },
    'ip-creative-works': { labelKey: 'categories.ipCreativeWorksMedia', icon: FileText },
    'assets-gear': { labelKey: 'categories.assetsGear', icon: FileText },
  };

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    // Get all documents from the library
    setTopDocs(documentLibrary);
    setIsLoading(false);
  }, [isHydrated]);

  const categories = React.useMemo(
    () => allCategories.filter(cat => categoryMeta[cat]),
    [allCategories],
  );
  const isMobile = useIsMobile();
  const categoriesToShow = React.useMemo(
    () => (isMobile ? categories.slice(0, 3) : categories),
    [isMobile, categories],
  );
  const moreCategories = React.useMemo(
    () => (isMobile ? categories.slice(3) : []),
    [isMobile, categories],
  );
  // Create mapping from taxonomy keys to document category names
  const taxonomyToDocCategory: Record<string, string[]> = {
    'real-estate-property': ['Real Estate', 'Property'],
    'employment-hr': ['Employment', 'HR'],
    'personal-family': ['Personal', 'Family'],
    'health-care': ['Health', 'Healthcare', 'Medical'],
    'finance-lending': ['Finance', 'Financial', 'Lending'],
    'business-startups': ['Business', 'Corporate'],
    'ip-creative': ['Intellectual Property', 'IP', 'Creative'],
    'legal-process-disputes': ['Legal', 'Disputes'],
    'estate-planning': ['Estate Planning', 'Estate'],
    'construction-trades': ['Construction', 'Trades'],
    'technology-digital': ['Technology', 'Digital'],
    'agriculture-energy': ['Agriculture', 'Energy'],
    'vehicles-equipment': ['Vehicles', 'Equipment'],
    'general-forms': ['General', 'Forms'],
    'ip-creative-works': ['Creative Works', 'Media'],
    'assets-gear': ['Assets', 'Gear'],
  };

  // Filter documents by selected category
  const filteredDocs = React.useMemo(() => {
    const validCategories = taxonomyToDocCategory[selectedCategory] || [];
    return topDocs.filter((doc) => 
      validCategories.includes(doc.category) || doc.category === selectedCategory
    );
  }, [topDocs, selectedCategory]);

  const handleExploreAll = () => {
    const workflowStartElement = document.getElementById('workflow-start');
    if (workflowStartElement) {
      router.push(`/${locale}/#workflow-start`);
    } else {
      router.push(`/${locale}/`); // Fallback to homepage
    }
  };

  if (isLoading && isHydrated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
        <p className="text-sm text-slate-700 dark:text-slate-200 mt-2">
          {tCommon('TopDocsChips.loading', {
            defaultValue: 'Loading popular documents...',
          })}
        </p>
      </div>
    );
  }

  if (!isHydrated || topDocs.length === 0) {
    return isHydrated ? null : <div className="h-20" />;
  }

  return (
    <TooltipProvider>
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-xl font-semibold text-center mb-6 text-foreground">
          {tCommon('TopDocsChips.title', {
            defaultValue: 'Popular Legal Documents',
          })}
        </h2>
        
        {/* Category Filter Buttons */}
        {categories.length > 1 && (
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {categoriesToShow.map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={selectedCategory === cat ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat)}
              >
                {tCommon(categoryMeta[cat]?.labelKey || cat, {
                  defaultValue: categoryMeta[cat]?.labelKey || cat,
                })}
              </Button>
            ))}
            {isMobile && moreCategories.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline">
                    {tCommon('more', { defaultValue: 'More' })}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  {moreCategories.map((cat) => (
                    <DropdownMenuItem
                      key={cat}
                      onSelect={() => setSelectedCategory(cat)}
                    >
                      {tCommon(categoryMeta[cat]?.labelKey || cat, {
                        defaultValue: categoryMeta[cat]?.labelKey || cat,
                      })}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}

        {/* Selected Category Name */}
        <h3 className="text-lg font-medium text-center mb-4 text-foreground">
          {tCommon(categoryMeta[selectedCategory]?.labelKey || selectedCategory, {
            defaultValue: categoryMeta[selectedCategory]?.labelKey || selectedCategory,
          })}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDocs.map((doc) => {
            const Icon = categoryMeta[doc.category]?.icon || FileText;
            const badge = badges[doc.id];
            return (
              <Link
                key={doc.id}
                href={`/${locale}/docs/${doc.id}`}
                prefetch
                className="p-4 border border-gray-200 rounded-lg bg-card shadow-sm transition-all hover:-translate-y-[2px] hover:shadow-lg hover:border-[#006EFF] hover:bg-muted"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {React.createElement(Icon, {
                      className: 'h-4 w-4 text-primary/80',
                    })}
                    <span className="text-sm font-medium">
                      {doc.translations?.[locale as 'en' | 'es']?.name ||
                        doc.translations?.en?.name ||
                        doc.name ||
                        doc.id}
                    </span>
                  </div>
                  {badge && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          variant="secondary"
                          className="flex items-center space-x-1"
                        >
                          {badge === 'new' ? (
                            <Zap className="h-3 w-3" />
                          ) : (
                            <RefreshCcw className="h-3 w-3" />
                          )}
                          <span className="capitalize">
                            {tCommon(`TopDocsChips.badge.${badge}`, {
                              defaultValue: badge === 'new' ? 'New' : 'Updated',
                            })}
                          </span>
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        {badge === 'new'
                          ? tCommon('TopDocsChips.tooltip.new', {
                              defaultValue: 'Recently added',
                            })
                          : tCommon('TopDocsChips.tooltip.updated', {
                              defaultValue: 'Recently refreshed',
                            })}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="mt-2 flex items-center gap-1 text-xs text-slate-700 dark:text-slate-200">
                      <Clock className="h-3 w-3" />
                      ~3 min
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Average completion time</TooltipContent>
                </Tooltip>
              </Link>
            );
          })}
        </div>
        <div className="text-center mt-6">
          <Button
            variant="link"
            onClick={handleExploreAll}
            className="text-primary text-sm"
          >
            {tCommon('stepOne.exploreAllCategoriesButton', {
              defaultValue: 'Explore All Document Categories',
            })}{' '}
            →
          </Button>
        </div>
      </section>
    </TooltipProvider>
  );
});
export default TopDocsChips;
