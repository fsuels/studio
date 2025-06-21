import { test, expect, Page } from '@playwright/test';

// Critical user journey: Document creation from start to finish
test.describe('Document Creation Flow', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    // Set viewport for consistent testing
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('should complete vehicle bill of sale creation flow', async () => {
    // Step 1: Navigate to homepage
    await page.goto('/');
    await expect(page).toHaveTitle(/123LegalDoc/);

    // Step 2: Search for vehicle bill of sale
    await page.fill('[data-testid="search-input"]', 'vehicle bill of sale');
    await page.press('[data-testid="search-input"]', 'Enter');

    // Step 3: Select vehicle bill of sale document
    await page.click('[data-testid="document-card-vehicle-bill-of-sale"]');
    await expect(page.url()).toContain('/docs/vehicle-bill-of-sale');

    // Step 4: Start document creation
    await page.click('[data-testid="start-document-creation"]');
    await expect(page.url()).toContain('/start');

    // Step 5: Fill out wizard form
    await fillVehicleBillOfSaleForm(page);

    // Step 6: Review information
    await page.click('[data-testid="continue-to-review"]');
    await expect(page.locator('[data-testid="review-step"]')).toBeVisible();

    // Step 7: Verify form data is displayed correctly
    await expect(page.locator('[data-testid="seller-name"]')).toContainText(
      'John Doe',
    );
    await expect(page.locator('[data-testid="buyer-name"]')).toContainText(
      'Jane Smith',
    );
    await expect(page.locator('[data-testid="vehicle-make"]')).toContainText(
      'Toyota',
    );

    // Step 8: Complete document
    await page.click('[data-testid="complete-document"]');
    await expect(page.url()).toContain('/complete');

    // Step 9: Verify completion page
    await expect(
      page.locator('[data-testid="completion-message"]'),
    ).toBeVisible();
    await expect(page.locator('[data-testid="download-pdf"]')).toBeVisible();
    await expect(page.locator('[data-testid="download-docx"]')).toBeVisible();
  });

  test('should handle form validation errors', async () => {
    await page.goto('/docs/vehicle-bill-of-sale/start');

    // Try to proceed without filling required fields
    await page.click('[data-testid="continue-to-review"]');

    // Check for validation errors
    await expect(
      page.locator('[data-testid="error-seller-name"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="error-buyer-name"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="error-vehicle-vin"]'),
    ).toBeVisible();

    // Fill one field and check that its error disappears
    await page.fill('[data-testid="input-seller-name"]', 'John Doe');
    await page.blur('[data-testid="input-seller-name"]');
    await expect(
      page.locator('[data-testid="error-seller-name"]'),
    ).not.toBeVisible();
  });

  test('should work on mobile devices', async () => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/docs/vehicle-bill-of-sale/start');

    // Check mobile-specific elements
    await expect(page.locator('[data-testid="mobile-form"]')).toBeVisible();

    // Test mobile form interaction
    await page.tap('[data-testid="input-seller-name"]');
    await page.fill('[data-testid="input-seller-name"]', 'John Doe');

    // Test mobile navigation
    await page.tap('[data-testid="mobile-continue-button"]');
    // Verify mobile-friendly experience
  });

  test('should support multiple languages', async () => {
    // Test Spanish language
    await page.goto('/es/docs/venta-de-vehiculo/start');

    // Verify Spanish text is displayed
    await expect(page.locator('h1')).toContainText('Contrato de Compraventa');
    await expect(
      page.locator('[data-testid="field-label-seller-name"]'),
    ).toContainText('Nombre del Vendedor');

    // Switch back to English
    await page.click('[data-testid="language-switcher"]');
    await page.click('[data-testid="language-en"]');

    await expect(page.locator('h1')).toContainText('Vehicle Bill of Sale');
  });

  test('should integrate with authentication flow', async () => {
    await page.goto('/docs/vehicle-bill-of-sale/start');

    // Fill form but don't authenticate
    await fillVehicleBillOfSaleForm(page);
    await page.click('[data-testid="continue-to-review"]');

    // Should prompt for authentication before completion
    await page.click('[data-testid="complete-document"]');
    await expect(page.locator('[data-testid="auth-modal"]')).toBeVisible();

    // Complete authentication
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'testpassword');
    await page.click('[data-testid="signin-button"]');

    // Should proceed to completion
    await expect(page.url()).toContain('/complete');
  });

  test('should handle network errors gracefully', async () => {
    // Simulate offline mode
    await page.context().setOffline(true);

    await page.goto('/docs/vehicle-bill-of-sale/start');

    // Attempt to save progress
    await page.fill('[data-testid="input-seller-name"]', 'John Doe');
    await page.click('[data-testid="save-progress"]');

    // Should show offline message
    await expect(page.locator('[data-testid="offline-message"]')).toBeVisible();

    // Restore connection
    await page.context().setOffline(false);

    // Retry save
    await page.click('[data-testid="retry-save"]');
    await expect(page.locator('[data-testid="save-success"]')).toBeVisible();
  });

  test('should have good Core Web Vitals performance', async () => {
    const startTime = Date.now();

    await page.goto('/docs/vehicle-bill-of-sale/start');

    // Measure Largest Contentful Paint (LCP)
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
      });
    });

    // LCP should be under 2.5 seconds
    expect(lcp).toBeLessThan(2500);

    // Test Cumulative Layout Shift (CLS)
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          resolve(clsValue);
        }).observe({ entryTypes: ['layout-shift'] });

        // Resolve after a short delay to capture layout shifts
        setTimeout(() => resolve(clsValue), 1000);
      });
    });

    // CLS should be under 0.1
    expect(cls).toBeLessThan(0.1);
  });
});

// Helper function to fill vehicle bill of sale form
async function fillVehicleBillOfSaleForm(page: Page) {
  // Seller information
  await page.fill('[data-testid="input-seller-name"]', 'John Doe');
  await page.fill(
    '[data-testid="input-seller-address"]',
    '123 Main St, Anytown, CA 90210',
  );
  await page.fill('[data-testid="input-seller-phone"]', '555-123-4567');

  // Buyer information
  await page.fill('[data-testid="input-buyer-name"]', 'Jane Smith');
  await page.fill(
    '[data-testid="input-buyer-address"]',
    '456 Oak Ave, Somewhere, CA 90211',
  );
  await page.fill('[data-testid="input-buyer-phone"]', '555-987-6543');

  // Vehicle information
  await page.fill('[data-testid="input-vehicle-vin"]', '1HGCM82633A123456');
  await page.fill('[data-testid="input-vehicle-make"]', 'Toyota');
  await page.fill('[data-testid="input-vehicle-model"]', 'Camry');
  await page.fill('[data-testid="input-vehicle-year"]', '2020');
  await page.fill('[data-testid="input-vehicle-odometer"]', '45000');

  // Sale information
  await page.fill('[data-testid="input-sale-price"]', '15000');
  await page.fill('[data-testid="input-sale-date"]', '2024-01-15');

  // State selection
  await page.selectOption('[data-testid="select-state"]', 'CA');
}
