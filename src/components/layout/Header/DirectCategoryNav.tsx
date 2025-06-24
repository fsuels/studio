// src/components/layout/Header/DirectCategoryNav.tsx
'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  Mail, 
  FileCheck, 
  Users, 
  Building,
  ChevronDown
} from 'lucide-react';

interface DirectCategoryNavProps {
  clientLocale: 'en' | 'es';
  mounted: boolean;
  onCategorySelect: (categoryId: string) => void;
  activeCategoryId?: string | null;
}

const categories = [
  {
    id: 'agreements-contracts',
    labelKey: 'agreements',
    icon: FileText,
  },
  {
    id: 'letters-notices',
    labelKey: 'letters',
    icon: Mail,
  },
  {
    id: 'forms-authorizations',
    labelKey: 'forms',
    icon: FileCheck,
  },
  {
    id: 'family-personal',
    labelKey: 'family',
    icon: Users,
  },
  {
    id: 'business-commercial',
    labelKey: 'business',
    icon: Building,
  }
];

export default function DirectCategoryNav({
  clientLocale,
  mounted,
  onCategorySelect,
  activeCategoryId
}: DirectCategoryNavProps) {
  const { t: tHeader } = useTranslation('header');
  if (!mounted) {
    return (
      <div className="flex items-center gap-1">
        {categories.map((category) => (
          <div
            key={category.id}
            className="h-9 w-20 bg-muted/50 rounded-md animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {categories.map((category) => {
        const isActive = activeCategoryId === category.id;
        const IconComponent = category.icon;
        
        return (
          <Button
            key={category.id}
            variant={isActive ? "default" : "ghost"}
            onClick={() => onCategorySelect(category.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200",
              isActive && "bg-primary text-primary-foreground shadow-sm",
              !isActive && "text-foreground hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20"
            )}
            aria-expanded={isActive}
          >
            <IconComponent className="h-4 w-4" />
            <span className="hidden lg:inline">
              {tHeader(`directCategories.${category.labelKey}`, {
                defaultValue: category.labelKey,
              })}
            </span>
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
  );
}