// Server-safe helpers for generating breadcrumb items

export interface BreadcrumbItem {
  name: string;
  href: string;
  current?: boolean;
}

export function generateDocumentBreadcrumbs(
  documentType: string,
  state?: string,
  locale: 'en' | 'es' = 'en',
): BreadcrumbItem[] {
  const isSpanish = locale === 'es';
  const items: BreadcrumbItem[] = [];

  items.push({ name: isSpanish ? 'Documentos' : 'Documents', href: `/${locale}/docs` });

  if (state) {
    items.push({
      name: `${state} ${isSpanish ? 'Formularios' : 'Forms'}`,
      href: `/${locale}/${state.toLowerCase().replace(/\s+/g, '-')}`,
    });
  }

  items.push({
    name: documentType,
    href: `/${locale}/docs/${documentType.toLowerCase().replace(/\s+/g, '-')}`,
    current: true,
  });

  return items;
}

export function generateCategoryBreadcrumbs(
  category: string,
  locale: 'en' | 'es' = 'en',
): BreadcrumbItem[] {
  const isSpanish = locale === 'es';

  return [
    { name: isSpanish ? 'Documentos' : 'Documents', href: `/${locale}/docs` },
    {
      name: category,
      href: `/${locale}/docs/category/${category.toLowerCase().replace(/\s+/g, '-')}`,
      current: true,
    },
  ];
}

export function generateStateBreadcrumbs(
  state: string,
  documentType?: string,
  locale: 'en' | 'es' = 'en',
): BreadcrumbItem[] {
  const isSpanish = locale === 'es';
  const items: BreadcrumbItem[] = [];

  items.push({ name: isSpanish ? 'Documentos' : 'Documents', href: `/${locale}/docs` });

  const stateSlug = state.toLowerCase().replace(/\s+/g, '-');
  items.push({
    name: `${state} ${isSpanish ? 'Formularios' : 'Forms'}`,
    href: `/${locale}/${stateSlug}`,
    current: !documentType,
  });

  if (documentType) {
    items.push({
      name: documentType,
      href: `/${locale}/${stateSlug}/${documentType.toLowerCase().replace(/\s+/g, '-')}`,
      current: true,
    });
  }

  return items;
}

