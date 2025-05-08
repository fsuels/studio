// src/utils/vin.ts

/**
 * Basic VIN validation.
 * Checks for 17 alphanumeric characters, excluding I, O, Q.
 * This is a simplified check and might need to be more robust for production.
 * @param vin The Vehicle Identification Number to validate.
 * @returns True if the VIN is structurally valid, false otherwise.
 */
export function isValidVIN(vin: string): boolean {
  if (typeof vin !== 'string') return false;
  const vinUpper = vin.toUpperCase();
  if (vinUpper.length !== 17) {
    return false;
  }
  // VINs do not use I, O, Q
  if (/[IOQ]/.test(vinUpper)) {
    return false;
  }
  // Should be alphanumeric
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vinUpper)) {
    return false;
  }
  return true;
}
