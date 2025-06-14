// src/components/Breadcrumb.tsx
'use client';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import React from 'react'; // Import React

interface BreadcrumbItem {
  label: string; // Expected to be a translation key
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = React.memo(function Breadcrumb({ items }: BreadcrumbProps) {
  const { t } = useTranslation('common'); // Changed to common namespace

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-6">
      <ol className="flex items-center space-x-1.5">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-primary hover:underline transition-colors"
              >
                {t(item.label, item.label)}
              </Link>
            ) : (
              <span className="font-semibold text-foreground">
                {t(item.label, item.label)}
              </span>
            )}
            {index < items.length - 1 && (
              <span className="mx-1.5" aria-hidden="true">
                /
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
});
export default Breadcrumb;
