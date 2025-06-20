// src/components/layout/Header/HeaderMegaMenu.tsx
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { LayoutGrid, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProgressiveLoader } from '@/components/ui/ProgressiveLoader';
import { MegaMenuSkeleton } from '@/components/ui/SkeletonVariants';

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

  return (
    <Popover open={isMegaMenuOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
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
      </PopoverTrigger>
      <PopoverContent
        className="w-screen max-w-4xl p-6 shadow-2xl border-border/50"
        align="center"
        sideOffset={8}
      >
        <ProgressiveLoader
          component={() => import('@/components/mega-menu/EnhancedMegaMenuContent')}
          fallback={<MegaMenuSkeleton />}
          delay={100}
          props={{ locale: clientLocale, onLinkClick: () => onOpenChange(false) }}
        />
      </PopoverContent>
    </Popover>
  );
}