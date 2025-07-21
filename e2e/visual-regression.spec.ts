import { test, expect } from '@playwright/test';

test.describe('Visual Regression Testing', () => {
  test('homepage visual consistency', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Take full page screenshot
    await expect(page).toHaveScreenshot('homepage-full.png', {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('document selector visual consistency', async ({ page }) => {
    await page.goto('/docs');
    await page.waitForLoadState('networkidle');

    // Take screenshot of document selector
    await expect(page).toHaveScreenshot('document-selector.png', {
      threshold: 0.2,
    });
  });

  test('form wizard visual consistency', async ({ page }) => {
    await page.goto('/docs/vehicle-bill-of-sale/start');
    await page.waitForLoadState('networkidle');

    // Take screenshot of form wizard
    await expect(page).toHaveScreenshot('form-wizard.png', {
      threshold: 0.2,
    });
  });

  test('mobile responsive visual consistency', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Take mobile screenshot
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('tablet responsive visual consistency', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Take tablet screenshot
    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('component visual consistency', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Test specific components
    const components = [
      '[data-testid="hero-section"]',
      '[data-testid="features-section"]',
      '[data-testid="testimonials-section"]',
      '[data-testid="footer"]',
    ];

    for (const component of components) {
      const element = page.locator(component);
      if ((await element.count()) > 0) {
        await expect(element).toHaveScreenshot(
          `${component.replace(/[^\w]/g, '-')}.png`,
          {
            threshold: 0.2,
          },
        );
      }
    }
  });

  test('dark mode visual consistency', async ({ page }) => {
    await page.goto('/');

    // Enable dark mode if available
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });

    await page.waitForLoadState('networkidle');

    // Take dark mode screenshot
    await expect(page).toHaveScreenshot('homepage-dark-mode.png', {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('print layout visual consistency', async ({ page }) => {
    await page.goto('/docs/vehicle-bill-of-sale/view');
    await page.waitForLoadState('networkidle');

    // Emulate print media
    await page.emulateMedia({ media: 'print' });

    // Take print layout screenshot
    await expect(page).toHaveScreenshot('print-layout.png', {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('high contrast mode visual consistency', async ({ page }) => {
    await page.goto('/');

    // Enable high contrast mode
    await page.evaluate(() => {
      document.documentElement.style.filter = 'contrast(150%)';
    });

    await page.waitForLoadState('networkidle');

    // Take high contrast screenshot
    await expect(page).toHaveScreenshot('homepage-high-contrast.png', {
      fullPage: true,
      threshold: 0.2,
    });
  });
});
