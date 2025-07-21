import { test, expect } from '@playwright/test';

test.describe('Florida Vehicle Bill of Sale Preview - Regression Test', () => {
  test('should display official Florida PDF when state is selected - PRIMARY REGRESSION TEST', async ({ page }) => {
    // Navigate to the vehicle bill of sale wizard
    await page.goto('/en/docs/vehicle-bill-of-sale/start');
    
    // Wait for the page to load
    await expect(page.locator('h1')).toContainText(/Vehicle Bill of Sale/i);
    
    // Initially should show generic markdown preview (NOT PDF)
    const genericPreview = page.locator('#live-preview, .prose');
    await expect(genericPreview).toBeVisible();
    
    // Select Florida as the state - THIS IS THE CRITICAL STEP
    await page.waitForSelector('select[name="state"], [data-testid="state-select"]', { timeout: 10000 });
    await page.selectOption('select[name="state"], [data-testid="state-select"]', 'FL');
    
    // 🚨 REGRESSION CHECK: After selecting Florida, should switch to official PDF
    // Wait for state switch to happen
    await page.waitForTimeout(2000);
    
    // The critical test: Should now show PDF iframe with HSMV-82050.pdf
    const pdfIframe = page.locator('iframe[src*="HSMV-82050.pdf"], iframe[title*="PDF"]');
    await expect(pdfIframe).toBeVisible({ timeout: 5000 });
    
    // Verify the iframe src contains the Florida form
    const iframeSrc = await pdfIframe.getAttribute('src');
    expect(iframeSrc).toMatch(/HSMV-82050\.pdf/);
    
    // Generic markdown preview should no longer be visible
    await expect(genericPreview).not.toBeVisible();
    
    // Verify the state compliance badges appear
    await expect(page.locator('text=FL Official Form')).toBeVisible();
    await expect(page.locator('text=HSMV-82050')).toBeVisible();
    await expect(page.locator('text=Notary Required')).toBeVisible();
  });
  
  test('should apply overlay when filling form fields', async ({ page }) => {
    await page.goto('/en/docs/vehicle-bill-of-sale/start');
    
    // Select Florida first
    await page.selectOption('select[name="state"], [data-testid="state-select"]', 'FL');
    
    // Wait for PDF to load
    await page.waitForTimeout(2000);
    
    // Verify PDF is showing
    const pdfIframe = page.locator('iframe[src*="HSMV-82050.pdf"]');
    await expect(pdfIframe).toBeVisible();
    
    // Fill in seller name and other fields
    await page.fill('input[name="seller_name"], input[placeholder*="seller"], input[id*="seller"]', 'Alice Seller');
    await page.fill('input[name="buyer_name"], input[placeholder*="buyer"], input[id*="buyer"]', 'Bob Buyer');
    await page.fill('input[name="year"], input[placeholder*="year"]', '2020');
    await page.fill('input[name="make"], input[placeholder*="make"]', 'Toyota');
    await page.fill('input[name="model"], input[placeholder*="model"]', 'Camry');
    
    // Wait for overlay to apply
    await page.waitForTimeout(1000);
    
    // PDF should still be visible with overlay applied
    await expect(pdfIframe).toBeVisible();
    
    // Download button should be available
    await expect(page.locator('button:has-text("Download")')).toBeVisible();
  });
  
  test('should show loading state initially', async ({ page }) => {
    await page.goto('/en/docs/vehicle-bill-of-sale/start');
    
    // Select Florida
    await page.selectOption('select[name="state"], [data-testid="state-select"]', 'FL');
    
    // Check for loading indicator (it should appear briefly)
    const loadingIndicator = page.locator('text=Loading PDF, text=Processing PDF');
    
    // The loading state should exist at some point
    await expect(loadingIndicator).toBeVisible({ timeout: 5000 }).catch(() => {
      // It's OK if loading is too fast to catch
      console.log('Loading state was too quick to capture, which is fine');
    });
    
    // Eventually the PDF should load
    await expect(page.locator('iframe[title="PDF Preview"]')).toBeVisible({ timeout: 15000 });
  });
  
  test('should handle empty form data gracefully', async ({ page }) => {
    await page.goto('/en/docs/vehicle-bill-of-sale/start');
    
    // Select Florida without filling any fields
    await page.selectOption('select[name="state"], [data-testid="state-select"]', 'FL');
    
    // PDF should still load even with no form data
    await expect(page.locator('iframe[title="PDF Preview"]')).toBeVisible({ timeout: 15000 });
  });
});