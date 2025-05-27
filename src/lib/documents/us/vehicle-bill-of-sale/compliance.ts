import { z } from 'zod';
import { STATES, NotarizationRequirement, OdometerRequirement } from '@/lib/documents/us/_shared/compliance-types';

/** Map of US states → per-state flags */
export const VehicleBillOfSaleCompliance = z.record(
  z.enum(STATES),
  z.object({
    notarization: z.nativeEnum(NotarizationRequirement),
    odometerDisclosure: z.nativeEnum(OdometerRequirement),
    paymentDeadlineDays: z.number().optional(),
  })
).parse({
  // TODO: fill real rules later; use “optional/always/never” defaults for now
  /* AL */ AL: { notarization: 'optional', odometerDisclosure: 'always' },
  /* etc. */  AK: { notarization: 'optional', odometerDisclosure: 'always' },
});

export type VehicleBillOfSaleComplianceType = z.infer<typeof VehicleBillOfSaleCompliance>;
