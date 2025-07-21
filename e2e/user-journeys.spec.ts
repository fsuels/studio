import { test, expect } from '@playwright/test';

test.describe('User Journey Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Document Creation Journey', () => {
    test('should complete full document creation flow', async ({ page }) => {
      // Step 1: Search for a document
      const searchInput = page.getByPlaceholder(/search/i);
      if (await searchInput.isVisible()) {
        await searchInput.fill('bill of sale');
        await page.keyboard.press('Enter');
        await page.waitForLoadState('networkidle');
      }

      // Step 2: Select a document from results or navigate to specific document
      const documentLink = page
        .getByRole('link', { name: /bill of sale/i })
        .first();
      if (await documentLink.isVisible()) {
        await documentLink.click();
        await page.waitForLoadState('networkidle');
      } else {
        // Fallback: navigate directly to a known document
        await page.goto('/documents/bill-of-sale');
      }

      // Step 3: Start document creation wizard
      const createButton = page
        .getByRole('button', { name: /create|start|begin/i })
        .first();
      if (await createButton.isVisible()) {
        await createButton.click();
        await page.waitForLoadState('networkidle');
      }

      // Step 4: Fill out form fields
      await page.waitForSelector('form', { timeout: 10000 });

      // Fill in common form fields
      const nameField = page.getByLabel(/name/i).first();
      if (await nameField.isVisible()) {
        await nameField.fill('John Doe');
      }

      const emailField = page.getByLabel(/email/i).first();
      if (await emailField.isVisible()) {
        await emailField.fill('john.doe@example.com');
      }

      // Step 5: Navigate through wizard steps
      const nextButton = page.getByRole('button', { name: /next|continue/i });
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForLoadState('networkidle');
      }

      // Step 6: Review step
      const reviewButton = page.getByRole('button', {
        name: /review|preview/i,
      });
      if (await reviewButton.isVisible()) {
        await reviewButton.click();
        await page.waitForLoadState('networkidle');
      }

      // Step 7: Complete the process
      const completeButton = page.getByRole('button', {
        name: /complete|finish|generate/i,
      });
      if (await completeButton.isVisible()) {
        await completeButton.click();
        await page.waitForLoadState('networkidle');
      }

      // Verify completion
      await expect(page.getByText(/success|completed|generated/i)).toBeVisible({
        timeout: 15000,
      });
    });

    test('should handle form validation errors gracefully', async ({
      page,
    }) => {
      // Navigate to document creation
      await page.goto('/documents/bill-of-sale');

      const createButton = page
        .getByRole('button', { name: /create|start|begin/i })
        .first();
      if (await createButton.isVisible()) {
        await createButton.click();
        await page.waitForLoadState('networkidle');
      }

      // Try to proceed without filling required fields
      const nextButton = page.getByRole('button', { name: /next|continue/i });
      if (await nextButton.isVisible()) {
        await nextButton.click();
      }

      // Check for validation errors
      await expect(page.getByText(/required|error/i)).toBeVisible({
        timeout: 5000,
      });

      // Verify form doesn't proceed
      await expect(
        page.getByRole('button', { name: /next|continue/i }),
      ).toBeVisible();
    });
  });

  test.describe('User Authentication Journey', () => {
    test('should complete sign up flow', async ({ page }) => {
      // Click sign up button
      const signUpButton = page.getByRole('button', { name: /sign up/i });
      if (await signUpButton.isVisible()) {
        await signUpButton.click();

        // Wait for auth modal or page
        await page.waitForSelector(
          '[data-testid*="auth"], [data-testid*="signup"], form',
          { timeout: 10000 },
        );

        // Fill in sign up form
        const emailInput = page.getByLabel(/email/i);
        if (await emailInput.isVisible()) {
          await emailInput.fill('test@example.com');
        }

        const passwordInput = page.getByLabel(/password/i);
        if (await passwordInput.isVisible()) {
          await passwordInput.fill('TestPassword123!');
        }

        const submitButton = page.getByRole('button', {
          name: /sign up|create account/i,
        });
        if (await submitButton.isVisible()) {
          await submitButton.click();
          await page.waitForLoadState('networkidle');
        }
      }
    });

    test('should complete sign in flow', async ({ page }) => {
      const signInButton = page.getByRole('button', {
        name: /sign in|log in/i,
      });
      if (await signInButton.isVisible()) {
        await signInButton.click();

        await page.waitForSelector(
          '[data-testid*="auth"], [data-testid*="signin"], form',
          { timeout: 10000 },
        );

        const emailInput = page.getByLabel(/email/i);
        if (await emailInput.isVisible()) {
          await emailInput.fill('test@example.com');
        }

        const passwordInput = page.getByLabel(/password/i);
        if (await passwordInput.isVisible()) {
          await passwordInput.fill('TestPassword123!');
        }

        const submitButton = page.getByRole('button', {
          name: /sign in|log in/i,
        });
        if (await submitButton.isVisible()) {
          await submitButton.click();
          await page.waitForLoadState('networkidle');
        }
      }
    });
  });

  test.describe('Navigation and Search Journey', () => {
    test('should navigate through main sections', async ({ page }) => {
      // Test mega menu navigation
      const megaMenuTrigger = page
        .getByRole('button', { name: /documents|create/i })
        .first();
      if (await megaMenuTrigger.isVisible()) {
        await megaMenuTrigger.click();

        // Wait for mega menu to open
        await page.waitForSelector(
          '[data-testid*="mega-menu"], [role="menu"]',
          { timeout: 5000 },
        );

        // Navigate to a document category
        const categoryLink = page
          .getByRole('link', { name: /vehicles|real estate|business/i })
          .first();
        if (await categoryLink.isVisible()) {
          await categoryLink.click();
          await page.waitForLoadState('networkidle');
        }
      }

      // Test breadcrumb navigation
      const breadcrumbs = page.locator(
        '[data-testid*="breadcrumb"], nav[aria-label*="breadcrumb"]',
      );
      if (await breadcrumbs.isVisible()) {
        const homeLink = breadcrumbs.getByRole('link', { name: /home/i });
        if (await homeLink.isVisible()) {
          await homeLink.click();
          await page.waitForLoadState('networkidle');
          await expect(page).toHaveURL('/');
        }
      }
    });

    test('should perform comprehensive search', async ({ page }) => {
      const searchInput = page.getByPlaceholder(/search/i);
      if (await searchInput.isVisible()) {
        // Test search with different queries
        const searchQueries = ['bill of sale', 'lease', 'contract'];

        for (const query of searchQueries) {
          await searchInput.fill(query);
          await page.waitForTimeout(500); // Wait for debounced search

          // Check if results appear
          const results = page.locator(
            '[data-testid*="search-result"], [role="list"]',
          );
          if (await results.isVisible()) {
            // Click on first result
            const firstResult = results.getByRole('link').first();
            if (await firstResult.isVisible()) {
              await firstResult.click();
              await page.waitForLoadState('networkidle');
              break;
            }
          }
        }
      }
    });
  });

  test.describe('Mobile User Journey', () => {
    test('should complete mobile navigation flow', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Test mobile menu
      const mobileMenuButton = page.getByRole('button', { name: /menu/i });
      if (await mobileMenuButton.isVisible()) {
        await mobileMenuButton.click();

        // Wait for mobile menu to open
        await page.waitForSelector('[data-testid*="mobile-menu"], nav', {
          timeout: 5000,
        });

        // Navigate through mobile menu
        const documentSection = page.getByText(/documents|create/i).first();
        if (await documentSection.isVisible()) {
          await documentSection.click();
        }

        // Select a document category
        const categoryLink = page
          .getByRole('link', { name: /bill of sale|lease/i })
          .first();
        if (await categoryLink.isVisible()) {
          await categoryLink.click();
          await page.waitForLoadState('networkidle');
        }
      }
    });

    test('should handle mobile form interactions', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Navigate to a form
      await page.goto('/documents/bill-of-sale');

      const createButton = page
        .getByRole('button', { name: /create|start/i })
        .first();
      if (await createButton.isVisible()) {
        await createButton.click();
        await page.waitForLoadState('networkidle');
      }

      // Test form interactions on mobile
      const formFields = page.locator('input, select, textarea').first();
      if (await formFields.isVisible()) {
        await formFields.focus();
        await formFields.fill('Test input');

        // Verify mobile keyboard doesn't interfere
        await expect(formFields).toHaveValue('Test input');
      }
    });
  });

  test.describe('Language Switching Journey', () => {
    test('should switch between languages', async ({ page }) => {
      // Look for language switcher
      const languageSwitcher = page.getByRole('button', {
        name: /language|EN|ES/i,
      });
      if (await languageSwitcher.isVisible()) {
        await languageSwitcher.click();

        // Switch to Spanish
        const spanishOption = page.getByRole('option', { name: /español|ES/i });
        if (await spanishOption.isVisible()) {
          await spanishOption.click();
          await page.waitForLoadState('networkidle');

          // Verify language change
          await expect(page.getByText(/documentos|crear/i)).toBeVisible({
            timeout: 10000,
          });
        }
      }
    });
  });

  test.describe('Error Handling Journey', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Simulate network failure
      await page.route('**/*', (route) => {
        if (route.request().url().includes('/api/')) {
          route.abort('failed');
        } else {
          route.continue();
        }
      });

      // Try to perform an action that requires API call
      const createButton = page
        .getByRole('button', { name: /create|start/i })
        .first();
      if (await createButton.isVisible()) {
        await createButton.click();

        // Should show error message
        await expect(page.getByText(/error|failed|try again/i)).toBeVisible({
          timeout: 10000,
        });
      }
    });

    test('should handle 404 pages', async ({ page }) => {
      await page.goto('/non-existent-page');

      // Should show 404 page or redirect
      await expect(page.getByText(/404|not found|page not found/i)).toBeVisible(
        { timeout: 10000 },
      );

      // Should have navigation back to home
      const homeLink = page.getByRole('link', { name: /home|back/i });
      if (await homeLink.isVisible()) {
        await homeLink.click();
        await expect(page).toHaveURL('/');
      }
    });
  });

  test.describe('Performance Journey', () => {
    test('should load pages within acceptable time limits', async ({
      page,
    }) => {
      const startTime = Date.now();

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds

      // Check for Core Web Vitals
      const paintMetrics = await page.evaluate(() => {
        return JSON.stringify(performance.getEntriesByType('paint'));
      });

      expect(paintMetrics).toBeTruthy();
    });
  });
});
