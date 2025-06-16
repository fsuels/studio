import { test, expect } from '@playwright/test';

test.describe('Accessibility Testing', () => {
  test('homepage should not have accessibility violations', async ({ page }) => {
    await page.goto('/');
    
    // Check for proper heading structure
    const h1 = await page.locator('h1').count();
    expect(h1).toBe(1); // Should have exactly one h1
  });

  test('document creation form should be accessible', async ({ page }) => {
    await page.goto('/docs/vehicle-bill-of-sale/start');
    
    // Check that form inputs have labels
    const inputs = await page.locator('input').all();
    
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        await expect(label).toBeVisible();
      }
    }
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/docs');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should be able to navigate with keyboard
    const focusedElement = await page.locator(':focus').first();
    await expect(focusedElement).toBeVisible();
  });

  test('should provide alternative text for images', async ({ page }) => {
    await page.goto('/');
    
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      const role = await img.getAttribute('role');
      
      // Images should have alt text or be marked as decorative
      expect(alt !== null || role === 'presentation').toBe(true);
    }
  });
});