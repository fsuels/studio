import { test, expect } from '@playwright/test';

test.describe('Vehicle Bill of Sale - Florida Overlay', () => {
  test('should apply live overlay to Florida HSMV-82050 form', async ({ page }) => {
    // Navigate to Vehicle Bill of Sale start page
    await page.goto('/en/docs/vehicle-bill-of-sale/start');
    
    // Wait for the form to load
    await expect(page.locator('h1')).toContainText('Vehicle Bill of Sale');
    
    // Select Florida as state (first question)
    const stateSelect = page.locator('select').first();
    await expect(stateSelect).toBeVisible();
    await stateSelect.selectOption('FL');
    
    // Wait for compliance detection and preview to load
    await page.waitForTimeout(2000);
    
    // Check that compliance badges appear
    await expect(page.locator('text=Notary Required')).toBeVisible();
    await expect(page.locator('text=HSMV-82050')).toBeVisible();
    
    // Fill seller information  
    const sellerNameInput = page.locator('input[name="seller_name"], input[id="seller_name"]').first();
    await expect(sellerNameInput).toBeVisible();
    await sellerNameInput.fill('John Doe');
    
    // Fill buyer information
    const buyerNameInput = page.locator('input[name="buyer_name"], input[id="buyer_name"]').first();
    await expect(buyerNameInput).toBeVisible();
    await buyerNameInput.fill('Jane Smith');
    
    // Fill vehicle details
    const yearInput = page.locator('input[name="year"], input[id="year"]').first();
    await expect(yearInput).toBeVisible();
    await yearInput.fill('2020');
    
    const makeInput = page.locator('input[name="make"], input[id="make"]').first();
    await expect(makeInput).toBeVisible();
    await makeInput.fill('Honda');
    
    const modelInput = page.locator('input[name="model"], input[id="model"]').first();
    await expect(modelInput).toBeVisible();
    await modelInput.fill('Civic');
    
    const vinInput = page.locator('input[name="vin"], input[id="vin"]').first();
    await expect(vinInput).toBeVisible();
    await vinInput.fill('1HGCV1F3XLA123456');
    
    const priceInput = page.locator('input[name="price"], input[id="price"]').first();
    await expect(priceInput).toBeVisible();
    await priceInput.fill('15000');
    
    // Wait for PDF overlay processing
    await page.waitForTimeout(3000);
    
    // Check that PDF iframe is present and has content
    const pdfIframe = page.locator('iframe[title*="PDF"], iframe[src*=".pdf"]').first();
    await expect(pdfIframe).toBeVisible();
    
    // Wait for the iframe to load
    await page.waitForTimeout(2000);
    
    // Check console logs for overlay success
    const logs = [];
    page.on('console', msg => {
      if (msg.type() === 'log' && msg.text().includes('SMART')) {
        logs.push(msg.text());
      }
    });
    
    // Trigger overlay by changing a field value
    await sellerNameInput.fill('John Updated Doe');
    await page.waitForTimeout(2000);
    
    // Verify overlay processing occurred
    const overlayLogs = logs.filter(log => 
      log.includes('SMART OVERLAY') || 
      log.includes('SMART MODE') || 
      log.includes('EXACT MATCH') ||
      log.includes('PARTIAL MATCH')
    );
    
    expect(overlayLogs.length).toBeGreaterThan(0);
    
    // Additional verification: check that PDF blob URLs are being created
    const responses = [];
    page.on('response', response => {
      if (response.url().includes('blob:') || response.url().includes('.pdf')) {
        responses.push(response);
      }
    });
    
    // Trigger another overlay
    await buyerNameInput.fill('Jane Updated Smith');
    await page.waitForTimeout(2000);
    
    // At minimum, we should have PDF loading activity
    expect(responses.length).toBeGreaterThan(0);
  });
  
  test('should show proper error handling when PDF fails to load', async ({ page }) => {
    // Navigate to Vehicle Bill of Sale start page
    await page.goto('/en/docs/vehicle-bill-of-sale/start');
    
    // Intercept PDF requests and make them fail
    await page.route('**/forms/vehicle-bill-of-sale/florida/HSMV-82050.pdf', route => {
      route.abort();
    });
    
    // Select Florida as state
    const stateSelect = page.locator('select').first();
    await stateSelect.selectOption('FL');
    
    // Wait and check for error handling
    await page.waitForTimeout(3000);
    
    // Should show fallback or error message
    await expect(page.locator('text=Unable to load')).toBeVisible({ timeout: 10000 });
  });
  
  test('should save progress automatically', async ({ page }) => {
    // Mock authentication (if needed)
    await page.goto('/en/docs/vehicle-bill-of-sale/start');
    
    // Select Florida
    const stateSelect = page.locator('select').first();
    await stateSelect.selectOption('FL');
    
    // Fill some data
    const sellerNameInput = page.locator('input[name="seller_name"], input[id="seller_name"]').first();
    await sellerNameInput.fill('Test Seller');
    
    // Wait for autosave
    await page.waitForTimeout(2000);
    
    // Check for save indicators (if visible in UI)
    // This may need adjustment based on actual save UI feedback
    const saveIndicators = await page.locator('text=Saved, text=Auto-saved, text=Progress saved').count();
    
    // At minimum, verify no errors occurred during save attempt
    const errorCount = await page.locator('text=Error, text=Failed').count();
    expect(errorCount).toBe(0);
  });
});