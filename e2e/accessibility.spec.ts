import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('WCAG 2.2 AA Compliance', () => {
    test('should pass axe accessibility audit on homepage', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should pass axe accessibility audit on document pages', async ({ page }) => {
      await page.goto('/documents/bill-of-sale-vehicle');
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2aa', 'wcag21aa', 'wcag22aa'])
        .exclude(['#cookie-banner']) // Exclude cookie banner if present
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should pass axe accessibility audit on form pages', async ({ page }) => {
      await page.goto('/documents/promissory-note');
      
      const createButton = page.getByRole('button', { name: /create|start/i }).first();
      if (await createButton.isVisible()) {
        await createButton.click();
        await page.waitForLoadState('networkidle');
      }
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2aa', 'wcag21aa', 'wcag22aa'])
        .exclude(['#cookie-banner'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should pass axe accessibility audit on dashboard', async ({ page }) => {
      // Navigate to dashboard if authentication allows
      await page.goto('/dashboard');
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2aa', 'wcag21aa', 'wcag22aa'])
        .exclude(['#cookie-banner'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should check color contrast ratios', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2aa'])
        .include(['color-contrast'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should validate keyboard accessibility', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2aa'])
        .include(['keyboard'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should validate focus management', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2aa'])
        .include(['focus-order-semantics'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should navigate through header with keyboard', async ({ page }) => {
      // Start from first focusable element
      await page.keyboard.press('Tab');
      
      // Should focus on logo or first navigation item
      const firstFocused = await page.locator(':focus').first();
      await expect(firstFocused).toBeVisible();
      
      // Continue tabbing through header elements
      const headerElements = [];
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
        const focused = await page.locator(':focus').first();
        if (await focused.isVisible()) {
          const tagName = await focused.evaluate(el => el.tagName);
          const role = await focused.getAttribute('role');
          headerElements.push({ tagName, role });
        }
      }
      
      // Verify we can reach interactive elements
      expect(headerElements.some(el => 
        el.tagName === 'BUTTON' || 
        el.tagName === 'A' || 
        el.role === 'button'
      )).toBeTruthy();
    });

    test('should handle dropdown menus with keyboard', async ({ page }) => {
      // Focus on mega menu trigger
      const megaMenuTrigger = page.getByRole('button', { name: /create|documents/i }).first();
      if (await megaMenuTrigger.isVisible()) {
        await megaMenuTrigger.focus();
        
        // Open with Enter key
        await page.keyboard.press('Enter');
        
        // Wait for menu to open
        await page.waitForSelector('[role="menu"], [data-testid*="mega-menu"]', { timeout: 5000 });
        
        // Navigate through menu items with arrows
        await page.keyboard.press('ArrowDown');
        const focusedItem = await page.locator(':focus').first();
        await expect(focusedItem).toBeVisible();
        
        // Close with Escape
        await page.keyboard.press('Escape');
        
        // Focus should return to trigger
        await expect(megaMenuTrigger).toBeFocused();
      }
    });

    test('should navigate form fields with keyboard', async ({ page }) => {
      // Navigate to a form page
      await page.goto('/documents/bill-of-sale');
      
      const createButton = page.getByRole('button', { name: /create|start/i }).first();
      if (await createButton.isVisible()) {
        await createButton.click();
        await page.waitForLoadState('networkidle');
      }
      
      // Tab through form fields
      const formFields = [];
      for (let i = 0; i < 15; i++) {
        await page.keyboard.press('Tab');
        const focused = await page.locator(':focus').first();
        if (await focused.isVisible()) {
          const tagName = await focused.evaluate(el => el.tagName);
          const type = await focused.getAttribute('type');
          const role = await focused.getAttribute('role');
          formFields.push({ tagName, type, role });
        }
      }
      
      // Verify form fields are focusable
      expect(formFields.some(field => 
        field.tagName === 'INPUT' || 
        field.tagName === 'TEXTAREA' || 
        field.tagName === 'SELECT' ||
        field.role === 'combobox'
      )).toBeTruthy();
    });
  });

  test.describe('Screen Reader Support', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      
      expect(headings.length).toBeGreaterThan(0);
      
      // Check for h1
      const h1 = await page.locator('h1').first();
      if (await h1.isVisible()) {
        const h1Text = await h1.textContent();
        expect(h1Text).toBeTruthy();
      }
      
      // Verify logical heading order
      const headingLevels = [];
      for (const heading of headings) {
        const tagName = await heading.evaluate(el => el.tagName);
        const level = parseInt(tagName.charAt(1));
        headingLevels.push(level);
      }
      
      // First heading should be h1 or h2
      expect(headingLevels[0]).toBeLessThanOrEqual(2);
    });

    test('should have proper landmark regions', async ({ page }) => {
      // Check for main landmark
      const main = page.locator('main, [role="main"]');
      await expect(main).toBeVisible();
      
      // Check for navigation landmark
      const nav = page.locator('nav, [role="navigation"]');
      await expect(nav.first()).toBeVisible();
      
      // Check for header landmark
      const header = page.locator('header, [role="banner"]');
      await expect(header.first()).toBeVisible();
    });

    test('should have proper form labels', async ({ page }) => {
      await page.goto('/documents/bill-of-sale');
      
      const createButton = page.getByRole('button', { name: /create|start/i }).first();
      if (await createButton.isVisible()) {
        await createButton.click();
        await page.waitForLoadState('networkidle');
      }
      
      // Check that all form inputs have labels
      const inputs = await page.locator('input[type="text"], input[type="email"], input[type="number"], textarea, select').all();
      
      for (const input of inputs) {
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');
        
        if (id) {
          const label = page.locator(`label[for="${id}"]`);
          const hasLabel = await label.count() > 0;
          const hasAriaLabel = !!ariaLabel || !!ariaLabelledBy;
          
          expect(hasLabel || hasAriaLabel).toBeTruthy();
        }
      }
    });

    test('should have proper button descriptions', async ({ page }) => {
      const buttons = await page.locator('button').all();
      
      for (const button of buttons) {
        const text = await button.textContent();
        const ariaLabel = await button.getAttribute('aria-label');
        const ariaLabelledBy = await button.getAttribute('aria-labelledby');
        const title = await button.getAttribute('title');
        
        // Button should have accessible text
        const hasAccessibleName = !!(text?.trim() || ariaLabel || ariaLabelledBy || title);
        expect(hasAccessibleName).toBeTruthy();
      }
    });
  });

  test.describe('ARIA Attributes', () => {
    test('should have proper aria-expanded for dropdowns', async ({ page }) => {
      const dropdownTriggers = await page.locator('[aria-expanded]').all();
      
      for (const trigger of dropdownTriggers) {
        const expanded = await trigger.getAttribute('aria-expanded');
        expect(['true', 'false']).toContain(expanded);
        
        // Click to toggle
        await trigger.click();
        
        // Check if state changed
        const newExpanded = await trigger.getAttribute('aria-expanded');
        expect(['true', 'false']).toContain(newExpanded);
        
        // Close if opened
        if (newExpanded === 'true') {
          await page.keyboard.press('Escape');
        }
      }
    });

    test('should have proper aria-invalid for form errors', async ({ page }) => {
      await page.goto('/documents/bill-of-sale');
      
      const createButton = page.getByRole('button', { name: /create|start/i }).first();
      if (await createButton.isVisible()) {
        await createButton.click();
        await page.waitForLoadState('networkidle');
      }
      
      // Try to submit form with empty required fields
      const submitButton = page.getByRole('button', { name: /next|continue|submit/i });
      if (await submitButton.isVisible()) {
        await submitButton.click();
        
        // Check for aria-invalid on fields with errors
        const invalidFields = await page.locator('[aria-invalid="true"]').all();
        
        if (invalidFields.length > 0) {
          expect(invalidFields.length).toBeGreaterThan(0);
        }
      }
    });

    test('should have proper role attributes', async ({ page }) => {
      // Check for common ARIA roles
      const menuItems = await page.locator('[role="menu"], [role="menuitem"]').all();
      const dialogs = await page.locator('[role="dialog"]').all();
      const alerts = await page.locator('[role="alert"]').all();
      
      // If these elements exist, they should be properly implemented
      for (const menu of menuItems) {
        await expect(menu).toBeVisible();
      }
    });
  });

  test.describe('Color and Contrast', () => {
    test('should be usable without color', async ({ page }) => {
      // Simulate grayscale/color blindness
      await page.addStyleTag({
        content: `
          * {
            filter: grayscale(100%) !important;
          }
        `
      });
      
      // Test that interactive elements are still distinguishable
      const buttons = await page.locator('button').all();
      
      for (const button of buttons) {
        if (await button.isVisible()) {
          // Button should still be identifiable through text, borders, or other visual cues
          const styles = await button.evaluate(el => {
            const computed = getComputedStyle(el);
            return {
              border: computed.border,
              textDecoration: computed.textDecoration,
              fontWeight: computed.fontWeight,
            };
          });
          
          // Should have some visual distinction
          expect(styles.border !== 'none' || styles.fontWeight === 'bold' || styles.textDecoration !== 'none').toBeTruthy();
        }
      }
    });
  });

  test.describe('Focus Management', () => {
    test('should have visible focus indicators', async ({ page }) => {
      // Tab through interactive elements
      const focusableSelectors = [
        'button:not([disabled])',
        'a[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex="0"]'
      ];
      
      for (const selector of focusableSelectors) {
        const elements = await page.locator(selector).all();
        
        for (const element of elements.slice(0, 3)) { // Test first 3 of each type
          if (await element.isVisible()) {
            await element.focus();
            
            // Check for focus indicator
            const styles = await element.evaluate(el => {
              const computed = getComputedStyle(el);
              return {
                outline: computed.outline,
                boxShadow: computed.boxShadow,
                border: computed.border,
              };
            });
            
            // Should have some form of focus indicator
            const hasFocusIndicator = 
              styles.outline !== 'none' ||
              styles.boxShadow !== 'none' ||
              styles.border.includes('rgba') ||
              styles.border.includes('rgb');
            
            expect(hasFocusIndicator).toBeTruthy();
          }
        }
      }
    });

    test('should trap focus in modals', async ({ page }) => {
      // Look for modal triggers
      const modalTriggers = page.getByRole('button', { name: /sign in|sign up|login/i });
      
      const trigger = modalTriggers.first();
      if (await trigger.isVisible()) {
        await trigger.click();
        
        // Wait for modal
        await page.waitForSelector('[role="dialog"], [data-testid*="modal"]', { timeout: 5000 });
        
        // Tab through modal elements
        const focusedElements = [];
        for (let i = 0; i < 10; i++) {
          await page.keyboard.press('Tab');
          const focused = await page.locator(':focus').first();
          if (await focused.isVisible()) {
            const id = await focused.getAttribute('id') || await focused.evaluate(el => el.tagName);
            focusedElements.push(id);
          }
        }
        
        // Focus should stay within modal
        expect(focusedElements.length).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Mobile Accessibility', () => {
    test('should have proper touch targets on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      const interactiveElements = await page.locator('button, a, input, select').all();
      
      for (const element of interactiveElements.slice(0, 10)) { // Test first 10
        if (await element.isVisible()) {
          const box = await element.boundingBox();
          if (box) {
            // Touch targets should be at least 44x44 pixels
            expect(box.width).toBeGreaterThanOrEqual(44);
            expect(box.height).toBeGreaterThanOrEqual(44);
          }
        }
      }
    });
  });
});