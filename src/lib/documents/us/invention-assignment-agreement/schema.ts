// src/lib/documents/us/invention-assignment-agreement/schema.ts
import { z } from 'zod';

export const InventionAssignmentAgreementSchema = z.object({
  employeeName: z.string().min(1, 'Employee name is required.'),
  employeeAddress: z.string().min(1, 'Employee address is required.'),
  companyName: z.string().min(1, 'Company name is required.'),
  companyAddress: z.string().min(1, 'Company address is required.'),
  effectiveDate: z
    .string()
    .min(1, 'Effective date is required.')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  employmentPosition: z.string().min(1, 'Employment position is required.'),
  workScope: z.string().min(1, 'Scope of work is required.'),
  inventionDefinition: z.string().min(1, 'Invention definition is required.'),
  assignmentScope: z.enum(['all', 'work-related', 'specific'], {
    errorMap: () => ({ message: 'Assignment scope is required.' }),
  }),
  specificInventions: z.string().optional(),
  priorInventions: z.string().optional(),
  confidentialityTerms: z.string().optional(),
  competingWork: z.string().optional(),
  disclosure: z.boolean().optional(),
  patentCooperation: z.boolean().optional(),
  moralRights: z.boolean().optional(),
});

export type InventionAssignmentAgreementData = z.infer<
  typeof InventionAssignmentAgreementSchema
>;
