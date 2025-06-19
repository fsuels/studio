// src/lib/documents/us/patent-assignment/schema.ts
import { z } from 'zod';

export const PatentAssignmentSchema = z.object({
  assignorName: z.string().min(1, 'Assignor name is required.'),
  assignorAddress: z.string().min(1, 'Assignor address is required.'),
  assigneeName: z.string().min(1, 'Assignee name is required.'),
  assigneeAddress: z.string().min(1, 'Assignee address is required.'),
  patentTitle: z.string().min(1, 'Patent title is required.'),
  patentNumber: z.string().optional(),
  applicationNumber: z.string().optional(),
  filingDate: z.string().optional(),
  inventionDescription: z.string().min(1, 'Invention description is required.'),
  assignmentType: z.enum(['full', 'partial'], { errorMap: () => ({ message: 'Assignment type is required.' }) }),
  consideration: z.string().min(1, 'Consideration is required.'),
  assignmentDate: z.string().min(1, 'Assignment date is required.').regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  witnessName: z.string().optional(),
  witnessAddress: z.string().optional(),
  notaryRequired: z.boolean().optional(),
  recordingRequested: z.boolean().optional(),
});

export type PatentAssignmentData = z.infer<typeof PatentAssignmentSchema>;