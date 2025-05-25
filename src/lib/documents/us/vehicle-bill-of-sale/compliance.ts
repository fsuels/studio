export const stateRules = {
  CA: {
    requireNotary: true,
    witnessCount: 0,
  },
  TX: {
    requireNotary: false,
    witnessCount: 1,
  },
  FL: {
    requireNotary: true,
    witnessCount: 2,
  },
  NY: {
    requireNotary: false,
    witnessCount: 1,
  },
  DEFAULT: {
    requireNotary: false,
    witnessCount: 0,
  },
} as const;

export type StateCode = keyof typeof stateRules;

export function getStateRules(stateCode: string) {
  return stateRules[stateCode as StateCode] || stateRules.DEFAULT;
}
