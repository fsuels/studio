// src/components/mega-menu/ConsolidatedEnhancedMegaMenuContent.tsx
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import ConsolidatedMegaMenuContent from '@/components/layout/mega-menu/ConsolidatedMegaMenuContent';
import { trackMegaMenu } from '@/lib/taxonomy-analytics';
import type { DocumentSummary } from '@/lib/workflow/document-workflow';
import { createPortal } from 'react-dom';
import { loadWorkflowModule } from '@/lib/workflow/load-workflow-module';

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
  const [documents, setDocuments] = React.useState<DocumentSummary[]>([]);

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
    // Hydrate documents when menu opens on client
    let cancelled = false;

    loadWorkflowModule()
      .then((module) => {
        if (cancelled) return;
        const docs = module.getWorkflowDocuments({ jurisdiction: 'us' });
        setDocuments(docs);
      })
      .catch((error) => {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Failed to load workflow documents for consolidated mega menu', error);
        }
      });

    return () => {
      cancelled = true;
    };
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
