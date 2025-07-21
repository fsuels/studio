'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Home } from 'lucide-react';
import { SchemaMarkup } from './SchemaMarkup';

export interface BreadcrumbItem {
  name: string;
  href: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
  showSchema?: boolean;
}

export function Breadcrumbs({
  items,
  className = '',
  showHome = true,
  showSchema = true,
}: BreadcrumbsProps) {
  const { t } = useTranslation('common');

  // Ensure we have at least home if showHome is true
  const breadcrumbItems = showHome
    ? [{ name: t('home', 'Home'), href: '/' }, ...items]
    : items;

  // Generate schema data for structured markup
  const schemaData = {
    breadcrumbs: breadcrumbItems.map((item, index) => ({
      name: item.name,
      url:
        typeof window !== 'undefined'
          ? new URL(item.href, window.location.origin).href
          : item.href,
      position: index + 1,
    })),
  };

  return (
    <>
      {showSchema && <SchemaMarkup type="BreadcrumbList" data={schemaData} />}

      <nav
        className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`}
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center space-x-2">
          {breadcrumbItems.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <ChevronRight
                  className="h-4 w-4 text-gray-600 dark:text-gray-400 mx-2"
                  aria-hidden="true"
                />
              )}

              {item.current ? (
                <span className="font-medium text-gray-900" aria-current="page">
                  {index === 0 && showHome ? (
                    <span className="flex items-center">
                      <Home className="h-4 w-4 mr-1" />
                      {item.name}
                    </span>
                  ) : (
                    item.name
                  )}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-blue-600 transition-colors duration-200"
                >
                  {index === 0 && showHome ? (
                    <span className="flex items-center">
                      <Home className="h-4 w-4 mr-1" />
                      {item.name}
                    </span>
                  ) : (
                    item.name
                  )}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

// Helper function to generate breadcrumbs for document pages
export function generateDocumentBreadcrumbs(
  documentType: string,
  state?: string,
  locale = 'en',
): BreadcrumbItem[] {
  const isSpanish = locale === 'es';
  const items: BreadcrumbItem[] = [];

  // Add documents listing page
  items.push({
    name: isSpanish ? 'Documentos' : 'Documents',
    href: `/${locale}/docs`,
  });

  // Add state-specific page if state is provided
  if (state) {
    items.push({
      name: `${state} ${isSpanish ? 'Formularios' : 'Forms'}`,
      href: `/${locale}/${state.toLowerCase().replace(/\s+/g, '-')}`,
    });
  }

  // Add current document page
  items.push({
    name: documentType,
    href: `/${locale}/docs/${documentType.toLowerCase().replace(/\s+/g, '-')}`,
    current: true,
  });

  return items;
}

// Helper function to generate breadcrumbs for category pages
export function generateCategoryBreadcrumbs(
  category: string,
  locale = 'en',
): BreadcrumbItem[] {
  const isSpanish = locale === 'es';

  return [
    {
      name: isSpanish ? 'Documentos' : 'Documents',
      href: `/${locale}/docs`,
    },
    {
      name: category,
      href: `/${locale}/docs/category/${category.toLowerCase().replace(/\s+/g, '-')}`,
      current: true,
    },
  ];
}

// Helper function to generate breadcrumbs for state pages
export function generateStateBreadcrumbs(
  state: string,
  documentType?: string,
  locale = 'en',
): BreadcrumbItem[] {
  const isSpanish = locale === 'es';
  const items: BreadcrumbItem[] = [];

  // Add documents listing page
  items.push({
    name: isSpanish ? 'Documentos' : 'Documents',
    href: `/${locale}/docs`,
  });

  // Add state page
  const stateSlug = state.toLowerCase().replace(/\s+/g, '-');
  items.push({
    name: `${state} ${isSpanish ? 'Formularios' : 'Forms'}`,
    href: `/${locale}/${stateSlug}`,
    current: !documentType,
  });

  // Add specific document if provided
  if (documentType) {
    items.push({
      name: documentType,
      href: `/${locale}/${stateSlug}/${documentType.toLowerCase().replace(/\s+/g, '-')}`,
      current: true,
    });
  }

  return items;
}
