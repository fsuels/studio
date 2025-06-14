import { test, expect } from '@playwright/test';

test.describe('123LegalDoc Application', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads
    await expect(page).toHaveTitle(/123LegalDoc/);
    
    // Check for key elements
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
  });

  test('document search functionality', async ({ page }) => {
    await page.goto('/');
    
    // Look for search input
    const searchInput = page.getByPlaceholder(/search/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('bill of sale');
      await searchInput.press('Enter');
      
      // Wait for search results
      await page.waitForLoadState('networkidle');
      await expect(page.locator('[data-testid*="search"]')).toBeVisible();
    }
  });

  test('mobile navigation works', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Look for mobile menu trigger
    const mobileMenuButton = page.locator('[aria-label*="menu"], [data-testid*="mobile-menu"]');
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      await expect(page.locator('[data-testid*="mobile-nav"]')).toBeVisible();
    }
  });
});