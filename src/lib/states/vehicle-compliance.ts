export interface VehicleCompliance {
  state: string;
  notarizationRequired: boolean;
}

const complianceData: Record<string, VehicleCompliance> = {
  AL: { state: 'Alabama', notarizationRequired: false },
  AZ: { state: 'Arizona', notarizationRequired: true },
  CA: { state: 'California', notarizationRequired: false },
  KY: { state: 'Kentucky', notarizationRequired: true },
  LA: { state: 'Louisiana', notarizationRequired: true },
  NV: { state: 'Nevada', notarizationRequired: true },
  OH: { state: 'Ohio', notarizationRequired: true },
  OK: { state: 'Oklahoma', notarizationRequired: true },
  PA: { state: 'Pennsylvania', notarizationRequired: true },
  WV: { state: 'West Virginia', notarizationRequired: true },
  WY: { state: 'Wyoming', notarizationRequired: true },
};

export function getVehicleCompliance(
  stateCode: string,
): VehicleCompliance | undefined {
  return complianceData[stateCode];
}

export const vehicleComplianceStates = Object.keys(complianceData);
