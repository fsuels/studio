// src/components/layout/Header/HeaderMegaMenu.tsx
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { LayoutGrid, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProgressiveLoader } from '@/components/ui/ProgressiveLoader';
import { MegaMenuSkeleton } from '@/components/ui/SkeletonVariants';
import { createPortal } from 'react-dom';

interface HeaderMegaMenuProps {
  clientLocale: 'en' | 'es';
  mounted: boolean;
  isMegaMenuOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function HeaderMegaMenu({
  clientLocale,
  mounted,
  isMegaMenuOpen,
  onOpenChange,
}: HeaderMegaMenuProps) {
  const { t: tHeader } = useTranslation('header');

  const handleButtonClick = () => {
    onOpenChange(!isMegaMenuOpen);
  };

  return (
    <>
      <Button
        onClick={handleButtonClick}
        className={cn(
          'bg-gradient-to-r from-[#006EFF] to-[#00C3A3] hover:from-[#0057CC] hover:to-[#00A38A] text-white px-3 py-1.5 rounded-md font-semibold text-sm flex items-center gap-1 drop-shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 whitespace-nowrap',
          isMegaMenuOpen && 'from-[#0057CC] to-[#00A38A]',
        )}
        disabled={!mounted}
        aria-expanded={isMegaMenuOpen}
      >
        <LayoutGrid className="h-4 w-4" />
        {mounted
          ? tHeader('nav.makeDocuments', {
              defaultValue: 'Make Documents',
            })
          : 'Make Documents'}
        {isMegaMenuOpen ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
      </Button>

      {/* Full-Screen Mega Menu Portal */}
      {isMegaMenuOpen && mounted && typeof window !== 'undefined' && createPortal(
        <ProgressiveLoader
          component={() =>
            import('@/components/mega-menu/EnhancedMegaMenuContent')
          }
          fallback={<MegaMenuSkeleton />}
          delay={100}
          props={{
            locale: clientLocale,
            onLinkClick: () => onOpenChange(false),
          }}
        />,
        document.body
      )}
    </>
  );
}
