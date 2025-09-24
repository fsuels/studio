// src/components/layout/Header/directCategoryConfig.ts
import type { LucideIcon } from 'lucide-react';
import { Building, Users, ScrollText, LineChart, Home } from 'lucide-react';

export interface DirectCategoryItem {
  id:
    | 'agreements-contracts'
    | 'family-personal'
    | 'forms-authorizations'
    | 'letters-notices'
    | 'business-commercial';
  labelKey: 'business' | 'family' | 'estate' | 'financial' | 'realEstate';
  icon: LucideIcon;
}

export const DIRECT_CATEGORY_ITEMS: DirectCategoryItem[] = [
  {
    id: 'agreements-contracts',
    labelKey: 'business',
    icon: Building,
  },
  {
    id: 'family-personal',
    labelKey: 'family',
    icon: Users,
  },
  {
    id: 'forms-authorizations',
    labelKey: 'estate',
    icon: ScrollText,
  },
  {
    id: 'letters-notices',
    labelKey: 'financial',
    icon: LineChart,
  },
  {
    id: 'business-commercial',
    labelKey: 'realEstate',
    icon: Home,
  },
];
