// src/components/mega-menu/EnhancedMegaMenuContent.tsx
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import TaxonomyMegaMenuContent from './TaxonomyMegaMenuContent';
import MegaMenuContent from './MegaMenuContent';
import TaxonomyErrorBoundary from '@/components/shared/TaxonomyErrorBoundary';
import { taxonomy } from '@/config/taxonomy';
import { CATEGORY_LIST } from '@/components/workflow/Step1DocumentSelector/constants';
import { documentLibrary } from '@/lib/document-library';
import { trackMegaMenu } from '@/lib/taxonomy-analytics';

interface EnhancedMegaMenuContentProps {
  locale: 'en' | 'es';
  onLinkClick?: () => void;
}

const EnhancedMegaMenuContent: React.FC<EnhancedMegaMenuContentProps> = ({ 
  locale, 
  onLinkClick 
}) => {
  const { i18n } = useTranslation();
  
  // Check if taxonomy features are enabled
  const useTaxonomy = taxonomy.feature_flags?.wizard_v4?.enabled;
  
  // Get user role from localStorage or context (if available)
  const [userRole, setUserRole] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    // Track mega menu open
    trackMegaMenu('open', { enhanced_mode: useTaxonomy, locale });
    
    // Try to get user role from localStorage
    try {
      const savedRole = localStorage.getItem('userRole');
      if (savedRole && taxonomy.roles[savedRole]) {
        setUserRole(savedRole);
      }
    } catch (error) {
      // localStorage not available or error
      console.warn('Could not access localStorage for user role');
    }
  }, [useTaxonomy, locale]);

  const handleLinkClick = React.useCallback(() => {
    trackMegaMenu('close', { source: 'document_click' });
    onLinkClick?.();
  }, [onLinkClick]);

  // If taxonomy features are enabled, use the new enhanced version
  if (useTaxonomy) {
    return (
      <TaxonomyErrorBoundary
        onError={(error) => {
          console.error('Taxonomy mega menu error:', error);
          trackMegaMenu('error', { error: error.message });
        }}
        fallback={({ retry }) => (
          <div className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Enhanced navigation temporarily unavailable
            </p>
            <button 
              onClick={retry}
              className="text-primary hover:underline text-sm"
            >
              Try again
            </button>
          </div>
        )}
      >
        <TaxonomyMegaMenuContent
          locale={locale}
          onLinkClick={handleLinkClick}
          userRole={userRole || undefined}
        />
      </TaxonomyErrorBoundary>
    );
  }

  // Fallback to original mega menu
  const documents = documentLibrary.getDocuments({
    country: 'US', // Default to US documents
    locale: locale,
  });

  return (
    <MegaMenuContent
      categories={CATEGORY_LIST}
      documents={documents}
      onLinkClick={handleLinkClick}
      defaultOpenCategories={['Finance', 'Business']} // Open popular categories by default
    />
  );
};

export default EnhancedMegaMenuContent;