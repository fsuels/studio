import { z } from 'zod';

export const schema = z.object({
  principalName: z.string().min(1, 'Principal name is required.'),
  principalAddress: z.string().min(1, 'Principal address is required.'),
  agentName: z.string().min(1, 'Healthcare agent name is required.'),
  agentAddress: z.string().min(1, 'Healthcare agent address is required.'),
  alternateAgentName: z.string().optional(),
  lifeSupportPreferences: z.string().optional(),
  state: z.string().length(2, 'State must be 2 characters.'),
});
