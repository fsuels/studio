import { test, expect } from '@playwright/test';

test.describe('Basic NDA document flow', () => {
  test('renders the NDA builder shell', async ({ page }) => {
    await page.goto('/en/documents/basic-nda');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText('Basic Non-Disclosure Agreement')).toBeVisible();
    await expect(page.getByText('Document Preview')).toBeVisible();
    await expect(page.getByText('Create a professional NDA', { exact: false })).toBeVisible();
  });
});
