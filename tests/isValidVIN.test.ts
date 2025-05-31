import { test, expect } from '@playwright/test';
import { isValidVIN } from '../src/utils/isValidVIN';

test('valid VINs pass validation', () => {
  expect(isValidVIN('1HGCM82633A004352')).toBe(true);
  expect(isValidVIN('JH4TB2H26CC000000')).toBe(true);
});

test('invalid VIN due to wrong length', () => {
  expect(isValidVIN('1HGCM82633A00435')).toBe(false);
  expect(isValidVIN('1HGCM82633A0043529')).toBe(false);
});

test('invalid VIN due to illegal characters', () => {
  expect(isValidVIN('1HGCM82633A00I352')).toBe(false);
  expect(isValidVIN('1HGCM82633A00435O')).toBe(false);
  expect(isValidVIN('1HGCM82633A0043$2')).toBe(false);
});

test('invalid when input is not a string', () => {
  expect(isValidVIN(123456789 as any)).toBe(false);
  expect(isValidVIN(undefined as any)).toBe(false);
});
