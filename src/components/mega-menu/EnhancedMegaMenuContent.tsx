// src/components/mega-menu/EnhancedMegaMenuContent.tsx
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import ModernMegaMenuContent from './ModernMegaMenuContent';
import { trackMegaMenu } from '@/lib/taxonomy-analytics';

interface EnhancedMegaMenuContentProps {
  locale: 'en' | 'es';
  onLinkClick?: () => void;
}

const EnhancedMegaMenuContent: React.FC<EnhancedMegaMenuContentProps> = ({
  locale,
  onLinkClick,
}) => {
  React.useEffect(() => {
    // Track mega menu open
    trackMegaMenu('open', { enhanced_mode: true, locale, design: 'modern_v2' });
  }, [locale]);

  const handleLinkClick = React.useCallback(() => {
    trackMegaMenu('close', { source: 'document_click' });
    onLinkClick?.();
  }, [onLinkClick]);

  return (
    <ModernMegaMenuContent
      locale={locale}
      onLinkClick={handleLinkClick}
    />
  );
};

export default EnhancedMegaMenuContent;
