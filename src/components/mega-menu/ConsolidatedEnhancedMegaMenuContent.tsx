// src/components/mega-menu/ConsolidatedEnhancedMegaMenuContent.tsx
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import ConsolidatedMegaMenuContent from '@/components/layout/mega-menu/ConsolidatedMegaMenuContent';
import { trackMegaMenu } from '@/lib/taxonomy-analytics';
import type { LegalDocument } from '@/types/documents';
import { createPortal } from 'react-dom';

interface ConsolidatedEnhancedMegaMenuContentProps {
  locale: 'en' | 'es';
  onLinkClick?: () => void;
  activeCategory?: string | null;
}

const ConsolidatedEnhancedMegaMenuContent: React.FC<ConsolidatedEnhancedMegaMenuContentProps> = ({
  locale,
  onLinkClick,
  activeCategory,
}) => {
  const [isClient, setIsClient] = React.useState(false);
  const [documents, setDocuments] = React.useState<LegalDocument[]>([]);

  React.useEffect(() => {
    setIsClient(true);
    // Track mega menu open
    trackMegaMenu('open', { 
      enhanced_mode: true, 
      locale, 
      design: 'consolidated_v1',
      panels: 5,
      structure: 'document_type_grouped'
    });
    // Lazy load documents when menu opens on client
    (async () => {
      try {
        const mod = await import('@/lib/document-library');
        const docs = mod.getDocumentsForCountry('us') as LegalDocument[];
        setDocuments(docs);
      } catch (_) {
        setDocuments([]);
      }
    })();
  }, [locale]);

  const handleLinkClick = React.useCallback(() => {
    trackMegaMenu('close', { source: 'document_click' });
    onLinkClick?.();
  }, [onLinkClick]);

  const handleClose = React.useCallback(() => {
    trackMegaMenu('close', { source: 'close_button' });
    onLinkClick?.();
  }, [onLinkClick]);

  if (!isClient) {
    return null;
  }

  return (
    <ConsolidatedMegaMenuContent
      documents={documents}
      onClose={handleClose}
      onLinkClick={handleLinkClick}
      activeCategory={activeCategory}
    />
  );
};

export default ConsolidatedEnhancedMegaMenuContent;
