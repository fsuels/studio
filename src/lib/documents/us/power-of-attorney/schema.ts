import { z } from 'zod';

export const powerOfAttorneySchema = z.object({
  principalName: z.string().min(1, "Principal's name is required."),
  principalAddress: z.string().min(1, "Principal's address is required."),
  agentName: z.string().min(1, "Agent's name is required."),
  agentAddress: z.string().min(1, "Agent's address is required."),
  alternateAgentName: z.string().optional(),
  effectiveDateType: z.enum(['immediately', 'incapacity'], {
    errorMap: () => ({
      message: 'Please select when the POA becomes effective.',
    }),
  }),
  isDurable: z.enum(['yes', 'no'], {
    errorMap: () => ({ message: 'Please specify if this is a Durable POA.' }),
  }),
  state: z.string().length(2, 'State must be 2 characters.'),
});
