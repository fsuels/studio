// src/lib/documents/us/tenant-maintenance-request/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { TenantMaintenanceRequestSchema } from './schema';
import { tenantMaintenanceRequestQuestions } from './questions';

export const tenantMaintenanceRequestMeta: LegalDocument = {
  id: 'tenant-maintenance-request',
  jurisdiction: 'US',
  category: 'Property Management',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 4.95,
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
      description:
        'Submit a formal maintenance or repair request to your landlord with our comprehensive form template.',
      aliases: [
        'repair request',
        'maintenance form',
        'tenant repair request',
        'property maintenance request',
      ],
    },
    es: {
      name: 'Solicitud de Mantenimiento del Inquilino',
      description:
        'Presenta una solicitud formal de mantenimiento o reparación a tu arrendador con nuestra plantilla de formulario completa.',
      aliases: [
        'solicitud de reparación',
        'formulario de mantenimiento',
        'solicitud de reparación del inquilino',
      ],
    },
  },
};
