import { test, expect } from '@playwright/test';

test('vehicle bill of sale wizard flow for CA', async ({ page }) => {
  await page.goto('http://localhost:9002/en');

  await page.getByRole('textbox', { name: /search/i }).fill('Vehicle Bill of Sale');
  await page.getByRole('link', { name: /Vehicle Bill of Sale/i }).click();
  await page.getByRole('button', { name: /Start/i }).click();

  await page.getByRole('combobox', { name: /State/i }).selectOption('CA');
  await page.fill('input[name="seller_name"]', 'Alice');
  await page.fill('input[name="buyer_name"]', 'Bob');
  await page.fill('input[name="year"]', '2020');
  await page.fill('input[name="make"]', 'Honda');
  await page.fill('input[name="model"]', 'Civic');
  await page.fill('input[name="vin"]', '1HGCM82633A004352');
  await page.fill('input[name="price"]', '5000');
  await page.getByRole('button', { name: /Next/i }).click();
  await page.getByRole('button', { name: /Finish/i }).click();

  await expect(page.getByText(/notary/i)).toBeVisible();
});
