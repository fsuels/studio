// src/utils/isValidVIN.ts

// Basic VIN format validation without checksum enforcement
export function isValidVIN(vin: string): boolean {
  if (typeof vin !== 'string') {
    return false;
  }
  const vinUpper = vin.trim().toUpperCase();
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(vinUpper);
}
