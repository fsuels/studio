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
