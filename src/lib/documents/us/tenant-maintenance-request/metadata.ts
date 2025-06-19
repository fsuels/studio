// src/lib/documents/us/tenant-maintenance-request/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { TenantMaintenanceRequestSchema } from './schema';
import { tenantMaintenanceRequestQuestions } from './questions';

export const tenantMaintenanceRequestMeta: LegalDocument = {
  id: 'tenant-maintenance-request',
  jurisdiction: 'US',
  category: 'Real Estate & Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 9.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/tenant-maintenance-request.md',
    es: '/templates/es/tenant-maintenance-request.md',
  },
  schema: TenantMaintenanceRequestSchema,
  questions: tenantMaintenanceRequestQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Tenant Maintenance Request',
      description: 'Formal maintenance request form for tenants to report issues',
      aliases: [],
    },
    es: {
      name: 'Tenant Maintenance Request', // TODO: Add Spanish translation
      description: 'Formal maintenance request form for tenants to report issues', // TODO: Add Spanish translation
      aliases: [],
    },
  },
};