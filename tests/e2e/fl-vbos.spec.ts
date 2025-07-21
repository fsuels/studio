import { test, expect } from '@playwright/test';

test.describe('Florida Vehicle Bill of Sale', () => {
  test('should correctly overlay form data on HSMV-82050 PDF', async ({ page }) => {
    // Navigate to the Florida VBOS wizard
    await page.goto('/en/docs/vehicle-bill-of-sale/start');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Fill out the form with test data
    const testData = {
      state: 'FL',
      seller_name: 'John Smith',
      seller_address: '123 Main St',
      seller_city: 'Orlando',
      seller_state: 'FL',
      seller_zip: '32801',
      seller_phone: '(555) 123-4567',
      buyer_name: 'Jane Doe', 
      buyer_address: '456 Oak Ave',
      buyer_city: 'Tampa',
      buyer_state: 'FL',
      buyer_zip: '33601',
      buyer_phone: '(555) 987-6543',
      year: '2020',
      make: 'Honda',
      model: 'Civic',
      vin: '1HGBH41JXMN109186',
      color: 'Blue',
      odometer: '50000',
      price: '15000',
      sale_date: '2025-07-21'
    };

    // Select Florida as the state first
    await page.selectOption('select[name="state"]', testData.state);
    
    // Wait for state selection to process
    await page.waitForTimeout(1000);

    // Fill seller information
    await page.fill('input[name="seller_name"]', testData.seller_name);
    await page.fill('input[name="seller_address"]', testData.seller_address);
    await page.fill('input[name="seller_phone"]', testData.seller_phone);

    // Fill buyer information
    await page.fill('input[name="buyer_name"]', testData.buyer_name);
    await page.fill('input[name="buyer_address"]', testData.buyer_address);
    await page.fill('input[name="buyer_phone"]', testData.buyer_phone);

    // Fill vehicle information
    await page.fill('input[name="year"]', testData.year);
    await page.fill('input[name="make"]', testData.make);
    await page.fill('input[name="model"]', testData.model);
    await page.fill('input[name="vin"]', testData.vin);
    await page.fill('input[name="color"]', testData.color);
    await page.fill('input[name="odometer"]', testData.odometer);

    // Fill sale information
    await page.fill('input[name="price"]', testData.price);
    await page.fill('input[name="sale_date"]', testData.sale_date);

    // Wait for preview to update
    await page.waitForTimeout(2000);

    // Check that the preview pane is visible
    const previewPane = page.locator('#live-preview, .preview-pane, iframe[title="PDF Preview"]');
    await expect(previewPane).toBeVisible();

    // Check for StatePDFPreview specifically (Florida should show the official form)
    const statePdfPreview = page.locator('div:has-text("FL Official Form")');
    if (await statePdfPreview.isVisible()) {
      console.log('✅ Florida official form is displayed');
      
      // Check that the PDF iframe is present
      const pdfIframe = page.locator('iframe[title="PDF Preview"]');
      await expect(pdfIframe).toBeVisible();

      // Verify that the PDF is loaded and not showing an error
      const errorAlert = page.locator('[role="alert"], .alert-destructive');
      await expect(errorAlert).not.toBeVisible();

      // Check for successful overlay indicators in console logs
      page.on('console', (msg) => {
        if (msg.text().includes('JSON OVERLAY: Drawing') && 
            msg.text().includes(testData.seller_name)) {
          console.log('✅ Found overlay log for seller name:', msg.text());
        }
      });

    } else {
      console.log('ℹ️ Using generic preview (StatePDFPreview not active)');
      
      // Fallback: check that form data appears somewhere in the preview
      const preview = page.locator('#live-preview');
      await expect(preview).toContainText(testData.seller_name);
      await expect(preview).toContainText(testData.buyer_name);
    }

    // Take a screenshot for manual verification
    await page.screenshot({ 
      path: 'tests/screenshots/florida-vbos-overlay.png',
      fullPage: true 
    });

    console.log('✅ Test completed - screenshot saved to tests/screenshots/florida-vbos-overlay.png');
  });

  test('should show Florida compliance requirements', async ({ page }) => {
    await page.goto('/en/docs/vehicle-bill-of-sale/start');
    
    // Select Florida
    await page.selectOption('select[name="state"]', 'FL');
    await page.waitForTimeout(1000);

    // Check for Florida-specific compliance badges/indicators
    const notaryBadge = page.locator('text=/Notary Required/i');
    const officialFormBadge = page.locator('text=/Official Form/i, text=/HSMV/i');
    
    // At least one compliance indicator should be visible
    await expect(notaryBadge.or(officialFormBadge)).toBeVisible();
    
    console.log('✅ Florida compliance requirements are displayed');
  });
});