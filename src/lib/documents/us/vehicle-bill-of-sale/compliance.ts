export { rules as stateRules, getCompliance as getStateRules } from '@/lib/compliance';
export type StateCode = keyof typeof stateRules;
