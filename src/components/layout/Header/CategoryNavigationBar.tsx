// src/components/layout/Header/CategoryNavigationBar.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  Mail, 
  FileCheck, 
  Users, 
  Building,
  ChevronDown,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';

const CategoryMegaMenuContent = dynamic(() => import('./CategoryMegaMenuContent'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-in fade-in-0" />
});

interface Category {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface CategoryNavigationBarProps {
  clientLocale: 'en' | 'es';
  mounted: boolean;
  className?: string;
}

const categories: Category[] = [
  {
    id: 'agreements',
    label: 'Agreements & Contracts',
    icon: FileText,
    description: 'NDAs, Service agreements, Employment contracts'
  },
  {
    id: 'letters-notices',
    label: 'Letters & Notices',
    icon: Mail,
    description: 'Demand letters, Tenant notices, Legal correspondence'
  },
  {
    id: 'forms-authorizations',
    label: 'Forms & Authorizations',
    icon: FileCheck,
    description: 'Power of Attorney, Medical forms, Government documents'
  },
  {
    id: 'family-legacy',
    label: 'Family & Legacy',
    icon: Users,
    description: 'Wills, Custody agreements, Healthcare directives'
  },
  {
    id: 'business-finance-property',
    label: 'Business & Property',
    icon: Building,
    description: 'Loans, Real estate, Bills of sale'
  }
];

export default function CategoryNavigationBar({
  clientLocale,
  mounted,
  className
}: CategoryNavigationBarProps) {
  const { t } = useTranslation('header');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMegaMenu, setShowMegaMenu] = useState(false);

  const handleClose = useCallback(() => {
    setActiveCategory(null);
    setShowMegaMenu(false);
    setSearchQuery('');
  }, []);

  const handleCategoryClick = useCallback((categoryId: string) => {
    if (activeCategory === categoryId && showMegaMenu) {
      // Close if clicking the same category
      handleClose();
    } else {
      // Open new category or switch to different category
      setActiveCategory(categoryId);
      setShowMegaMenu(true);
    }
  }, [activeCategory, showMegaMenu, handleClose]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent, categoryId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCategoryClick(categoryId);
    } else if (event.key === 'Escape' && showMegaMenu) {
      event.preventDefault();
      handleClose();
    }
  }, [handleCategoryClick, showMegaMenu, handleClose]);

  const handleSearchFocus = useCallback(() => {
    if (!showMegaMenu) {
      setActiveCategory('search');
      setShowMegaMenu(true);
    }
  }, [showMegaMenu]);

  const CategoryMegaMenuComponent = React.useMemo(() => {
    if (!showMegaMenu || !mounted || typeof window === 'undefined') return null;

    return createPortal(
      <CategoryMegaMenuContent
        locale={clientLocale}
        activeCategory={activeCategory}
        searchQuery={searchQuery}
        onClose={handleClose}
        onSearchChange={setSearchQuery}
      />,
      document.body
    );
  }, [showMegaMenu, mounted, clientLocale, activeCategory, searchQuery, handleClose]);

  return (
    <>
      {/* Main Navigation Bar */}
      <div className={cn("bg-background border-b border-border/40", className)}>
        <div className="container mx-auto px-4">
          {/* Search Bar - Prominent and Centered */}
          <div className="py-4">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search all 320+ legal documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                className="w-full pl-12 pr-4 py-3 text-base border-2 border-border/60 focus:border-primary rounded-lg shadow-sm"
              />
            </div>
          </div>

          {/* Categories Bar */}
          <div className="flex items-center justify-center gap-1 pb-3 overflow-x-auto">
            {categories.map((category) => {
              const isActive = activeCategory === category.id;
              const IconComponent = category.icon;
              
              return (
                <Button
                  key={category.id}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => handleCategoryClick(category.id)}
                  onKeyDown={(e) => handleKeyDown(e, category.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 ease-in-out transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    isActive && "bg-primary text-primary-foreground shadow-lg scale-105",
                    !isActive && "hover:bg-muted/50 hover:text-foreground hover:shadow-sm"
                  )}
                  aria-expanded={isActive}
                  aria-describedby={`${category.id}-description`}
                  aria-haspopup="true"
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.label}</span>
                  <span className="sm:hidden">{category.label.split(' ')[0]}</span>
                  <ChevronDown 
                    className={cn(
                      "h-3 w-3 transition-transform duration-200",
                      isActive && "rotate-180"
                    )} 
                  />
                </Button>
              );
            })}
          </div>

          {/* Category Descriptions (Hidden, for screen readers) */}
          {categories.map((category) => (
            <div
              key={`${category.id}-description`}
              id={`${category.id}-description`}
              className="sr-only"
            >
              {category.description}
            </div>
          ))}
        </div>
      </div>

      {/* Mega Menu Overlay */}
      {CategoryMegaMenuComponent}
    </>
  );
}