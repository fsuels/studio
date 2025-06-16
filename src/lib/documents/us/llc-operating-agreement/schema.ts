import { z } from 'zod';

export const llcOperatingAgreementSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required").optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "Valid ZIP code required"),
  date: z.string().min(1, "Date is required"),
  companyName: z.string().min(1, "Company name is required"),
  businessAddress: z.string().min(1, "Business address is required"),
  taxId: z.string().optional(),
  businessType: z.enum(["LLC", "Corporation", "Partnership", "Sole Proprietorship"])
});

export type LlcOperatingAgreementData = z.infer<typeof llcOperatingAgreementSchema>;
