export { SchemaMarkup } from './SchemaMarkup';
export {
  generateDocumentFAQs,
  generateDocumentHowToSteps,
} from '@/lib/seo/schema';
export { MetaTags } from './MetaTags';
// Re-export server-safe helpers from lib
export { generateDocumentMetaTags } from '@/lib/seo/meta';
export {
  Breadcrumbs,
} from './Breadcrumbs';
export {
  generateDocumentBreadcrumbs,
  generateCategoryBreadcrumbs,
  generateStateBreadcrumbs,
  type BreadcrumbItem,
} from '@/lib/seo/breadcrumbs';
export {
  LocalBusinessSchema,
  StateSpecificLegalSchema,
} from './LocalBusinessSchema';
