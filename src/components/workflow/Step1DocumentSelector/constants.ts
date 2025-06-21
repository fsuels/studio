import React from 'react';
import {
  Landmark,
  Briefcase,
  Home,
  Users,
  User,
  ScrollText,
  FileText,
  ShieldQuestion,
  AlertTriangle,
} from 'lucide-react';
import { LegalDocument } from '@/lib/document-library';
import { CategoryInfo } from './types';

export const CATEGORY_LIST: CategoryInfo[] = [
  { key: 'Finance', labelKey: 'Finance', icon: Landmark },
  { key: 'Business', labelKey: 'Business', icon: Briefcase },
  { key: 'Real Estate', labelKey: 'Real Estate', icon: Home },
  { key: 'Family', labelKey: 'Family', icon: Users },
  { key: 'Personal', labelKey: 'Personal', icon: User },
  { key: 'Estate Planning', labelKey: 'Estate Planning', icon: ScrollText },
  {
    key: 'Employment',
    labelKey: 'Employment & Labor Documents',
    icon: Briefcase,
  },
  { key: 'Miscellaneous', labelKey: 'General', icon: FileText },
];

// Placeholder for top docs - in a real app, this comes from Firestore
export const PLACEHOLDER_TOP_DOCS: Array<
  Pick<LegalDocument, 'id' | 'category' | 'translations'> & {
    icon?: React.ElementType;
  }
> = [
  {
    id: 'bill-of-sale-vehicle',
    category: 'Finance',
    translations: {
      en: { name: 'Vehicle Bill of Sale', description: '' },
      es: { name: 'Contrato de Compraventa de Vehículo', description: '' },
    },
    icon: FileText,
  },
  {
    id: 'leaseAgreement',
    category: 'Real Estate',
    translations: {
      en: { name: 'Residential Lease Agreement', description: '' },
      es: { name: 'Contrato de Arrendamiento Residencial', description: '' },
    },
    icon: Home,
  },
  {
    id: 'non-disclosure-agreement',
    category: 'Business',
    translations: {
      en: { name: 'Non-Disclosure Agreement (NDA)', description: '' },
      es: { name: 'Acuerdo de Confidencialidad (NDA)', description: '' },
    },
    icon: ShieldQuestion,
  },
  {
    id: 'powerOfAttorney',
    category: 'Personal',
    translations: {
      en: { name: 'General Power of Attorney', description: '' },
      es: { name: 'Poder Notarial General', description: '' },
    },
    icon: User,
  },
  {
    id: 'last-will-testament',
    category: 'Estate Planning',
    translations: {
      en: { name: 'Last Will and Testament', description: '' },
      es: { name: 'Última Voluntad y Testamento', description: '' },
    },
    icon: ScrollText,
  },
  {
    id: 'eviction-notice',
    category: 'Real Estate',
    translations: {
      en: { name: 'Eviction Notice', description: '' },
      es: { name: 'Aviso de Desalojo', description: '' },
    },
    icon: AlertTriangle,
  },
];

// Utility functions for document translations
export const getDocName = (
  doc: Pick<LegalDocument, 'translations'>,
  locale: string,
) =>
  locale === 'es'
    ? doc.translations?.es?.name || doc.translations?.en?.name || ''
    : doc.translations?.en?.name || doc.translations?.es?.name || '';

export const getDocDescription = (
  doc: Pick<LegalDocument, 'translations'>,
  locale: string,
) =>
  locale === 'es'
    ? doc.translations?.es?.description ||
      doc.translations?.en?.description ||
      ''
    : doc.translations?.en?.description ||
      doc.translations?.es?.description ||
      '';

export const getDocAliases = (
  doc: Pick<LegalDocument, 'translations'>,
  locale: string,
) =>
  locale === 'es'
    ? doc.translations?.es?.aliases || []
    : doc.translations?.en?.aliases || [];

export const languageSupportsSpanish = (
  support: string[] | undefined,
): boolean => !!support && support.includes('es');
