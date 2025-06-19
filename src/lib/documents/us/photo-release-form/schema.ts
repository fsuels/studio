// src/lib/documents/us/photo-release-form/schema.ts
import { z } from 'zod';

export const PhotoReleaseFormSchema = z.object({
  subjectName: z.string().min(1, 'Subject name is required.'),
  subjectAddress: z.string().min(1, 'Subject address is required.'),
  photographerName: z.string().min(1, 'Photographer name is required.'),
  photographerAddress: z.string().min(1, 'Photographer address is required.'),
  shootDate: z.string().min(1, 'Photo shoot date is required.').regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  location: z.string().min(1, 'Photo location is required.'),
  purpose: z.string().min(1, 'Purpose of photos is required.'),
  usageRights: z.enum(['unlimited', 'limited', 'specific'], { errorMap: () => ({ message: 'Usage rights type is required.' }) }),
  specificUsage: z.string().optional(),
  compensation: z.string().optional(),
  creditRequired: z.boolean().optional(),
  creditName: z.string().optional(),
  exclusiveRights: z.boolean().optional(),
  duration: z.string().optional(),
  territory: z.string().optional(),
  modification: z.boolean().optional(),
  minorAge: z.boolean().optional(),
  guardianName: z.string().optional(),
  guardianRelation: z.string().optional(),
});

export type PhotoReleaseFormData = z.infer<typeof PhotoReleaseFormSchema>;