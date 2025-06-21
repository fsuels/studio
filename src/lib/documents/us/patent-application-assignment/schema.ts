// src/lib/documents/us/patent-application-assignment/schema.ts
import { z } from 'zod';

export const PatentApplicationAssignmentSchema = z.object({
  assignorName: z.string().min(1, 'Assignor name is required.'),
  assignorAddress: z.string().min(1, 'Assignor address is required.'),
  assigneeName: z.string().min(1, 'Assignee name is required.'),
  assigneeAddress: z.string().min(1, 'Assignee address is required.'),
  applicationTitle: z.string().min(1, 'Patent application title is required.'),
  applicationNumber: z.string().min(1, 'Application number is required.'),
  filingDate: z
    .string()
    .min(1, 'Filing date is required.')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  inventionDescription: z.string().min(1, 'Invention description is required.'),
  assignmentType: z.enum(['full', 'partial'], {
    errorMap: () => ({ message: 'Assignment type is required.' }),
  }),
  consideration: z.string().min(1, 'Consideration is required.'),
  assignmentDate: z
    .string()
    .min(1, 'Assignment date is required.')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  inventorName: z.string().optional(),
  witnessName: z.string().optional(),
  witnessAddress: z.string().optional(),
  recordingRequested: z.boolean().optional(),
});

export type PatentApplicationAssignmentData = z.infer<
  typeof PatentApplicationAssignmentSchema
>;
