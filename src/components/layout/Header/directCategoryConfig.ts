// src/components/layout/Header/directCategoryConfig.ts
import type { LucideIcon } from 'lucide-react';
import { FileText, Mail, FileCheck, Users, Building } from 'lucide-react';

export interface DirectCategoryItem {
  id:
    | 'agreements-contracts'
    | 'letters-notices'
    | 'forms-authorizations'
    | 'family-personal'
    | 'business-commercial';
  labelKey: 'agreements' | 'letters' | 'forms' | 'family' | 'business';
  icon: LucideIcon;
}

export const DIRECT_CATEGORY_ITEMS: DirectCategoryItem[] = [
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
  },
];
